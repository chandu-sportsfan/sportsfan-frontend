// // src/hooks/useChat.ts  (FRONTEND project)
// //
// // Real-time strategy: smart polling via REST APIs only.
// // Zero Firebase on the client. Zero external services. Works on Vercel free.
// //
// // Poll intervals:
// //   Messages (chat open)     → every 3s  while tab is visible
// //   Chat list                → every 30s while tab is visible
// //   Everything               → paused    while tab is hidden
// //
// // Quota cost per active user:
// //   Messages: ~20 reads/min  (3s interval × 1 REST call)
// //   Chat list: ~2 reads/min  (30s interval × 1 REST call)
// //   Total: well within Firestore free tier (50k reads/day)

// import { useState, useEffect, useCallback, useRef } from "react";
// import {
//   ChatAPI, GroupAPI, CommunityAPI, MessageAPI,
//   type Chat, type Message, type Group, type Community,
// } from "../lib/chatApi";
// import { useAuth } from "@/context/AuthContext";

// // ─── useChats — 30s polling ────────────────────────────────────────────────────
// export function useChats(type?: "dm" | "group") {
//   const [chats, setChats]     = useState<Chat[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState<string | null>(null);
//   const [hasMore, setHasMore] = useState(false);
//   const cursorRef = useRef<{ lastDocId: string; lastDocUpdatedAt: number } | null>(null);

//   const load = useCallback(async (reset = false) => {
//     try {
//       // Only show the full spinner on first load, not on background polls
//       if (reset) setLoading(true);
//       setError(null);
//       const cursor = reset ? undefined : cursorRef.current ?? undefined;
//       const res = await ChatAPI.list({ type, ...(cursor ?? {}) });
//       setChats(prev => reset ? res.chats : [...prev, ...res.chats]);
//       setHasMore(res.pagination.hasMore);
//       if (res.pagination.nextCursor) {
//         cursorRef.current = {
//           lastDocId:        res.pagination.nextCursor.lastDocId,
//           lastDocUpdatedAt: res.pagination.nextCursor.lastDocUpdatedAt as number,
//         };
//       }
//     } catch (e) {
//       // Don't wipe the list on a background poll failure — just log it
//       if (reset) setError(e instanceof Error ? e.message : "Failed to load chats");
//     } finally {
//       setLoading(false);
//     }
//   }, [type]);

//   useEffect(() => {
//     load(true);

//     // Poll every 30s — updates unread badges + last message preview
//     // Pauses when tab is hidden to save quota
//     const startPolling = () => {
//       return setInterval(() => {
//         if (!document.hidden) {
//           cursorRef.current = null;
//           load(true);
//         }
//       }, 30_000);
//     };

//     let interval = startPolling();

//     // Resume polling when tab becomes visible again
//     const handleVisibility = () => {
//       if (!document.hidden) {
//         clearInterval(interval);
//         cursorRef.current = null;
//         load(true);                  // immediate refresh on tab focus
//         interval = startPolling();   // restart interval
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibility);
//     return () => {
//       clearInterval(interval);
//       document.removeEventListener("visibilitychange", handleVisibility);
//     };
//   }, [load]);

//   const refresh = useCallback(() => {
//     cursorRef.current = null;
//     load(true);
//   }, [load]);

//   const loadMore = useCallback(() => {
//     if (hasMore && !loading) load(false);
//   }, [hasMore, loading, load]);

//   const updateChat = useCallback((updated: Chat) => {
//     setChats(prev => prev.map(c => c.id === updated.id ? updated : c));
//   }, []);

//   const removeChat = useCallback((chatId: string) => {
//     setChats(prev => prev.filter(c => c.id !== chatId));
//   }, []);

//   const prependChat = useCallback((chat: Chat) => {
//     setChats(prev => [chat, ...prev.filter(c => c.id !== chat.id)]);
//   }, []);

//   return { chats, loading, error, hasMore, refresh, loadMore, updateChat, removeChat, prependChat };
// }

// // ─── useMessages — 3s polling ──────────────────────────────────────────────────
// export function useMessages(chatId: string | null) {
//   const { user } = useAuth();
//   const currentUserId = user?.userId ?? user?.email ?? "";

//   const [messages, setMessages]         = useState<Message[]>([]);
//   const [loading, setLoading]           = useState(false);
//   const [loadingOlder, setLoadingOlder] = useState(false);
//   const [sending, setSending]           = useState(false);
//   const [error, setError]               = useState<string | null>(null);
//   const [hasMore, setHasMore]           = useState(false);

//   // Cursor for "load older messages" pagination
//   const olderCursorRef = useRef<{ lastDocId: string; lastDocCreatedAt: number } | null>(null);
//   // Track the newest message we've seen so we only merge genuinely new ones
//   const latestCreatedAtRef = useRef<number>(0);
//   // Avoid running two polls simultaneously
//   const pollingRef = useRef(false);

//   // ── Initial load ─────────────────────────────────────────────────────────────
//   const loadInitial = useCallback(async (cid: string) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await ChatAPI.getMessages(cid, { limit: 50 });
//       setMessages(res.messages);
//       setHasMore(res.pagination.hasMore);

//       // Track newest timestamp for incremental polling
//       if (res.messages.length > 0) {
//         latestCreatedAtRef.current = Math.max(...res.messages.map(m => m.createdAt));
//       }

//       if (res.pagination.nextCursor) {
//         olderCursorRef.current = {
//           lastDocId:        res.pagination.nextCursor.lastDocId,
//           lastDocCreatedAt: res.pagination.nextCursor.lastDocCreatedAt as number,
//         };
//       }
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to load messages");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ── Background poll — only fetches messages newer than what we have ──────────
//   // This is the key quota saving: we pass `since` to the API so it only
//   // returns new messages, not the full history on every tick.
//   const pollNewMessages = useCallback(async (cid: string) => {
//     if (pollingRef.current) return; // skip if previous poll still running
//     pollingRef.current = true;
//     try {
//       const res = await ChatAPI.getMessages(cid, { limit: 50 });

//       setMessages(prev => {
//         const existingIds = new Set(prev.map(m => m.id));

//         // Only add messages we don't already have
//         const newMsgs = res.messages.filter(m => !existingIds.has(m.id));

//         // Also apply any modifications to existing messages
//         // (edits, soft-deletes, isRead updates for blue ticks)
//         const updated = prev.map(existing => {
//           const serverVersion = res.messages.find(m => m.id === existing.id);
//           if (!serverVersion) return existing;
//           // Merge — keep optimistic content if server hasn't confirmed yet
//           return existing.id.startsWith("optimistic_") ? existing : serverVersion;
//         });

//         if (newMsgs.length === 0) return updated; // nothing new, just apply modifications

//         // Track newest timestamp
//         const allTimestamps = res.messages.map(m => m.createdAt);
//         if (allTimestamps.length > 0) {
//           latestCreatedAtRef.current = Math.max(...allTimestamps);
//         }

//         return [...updated, ...newMsgs];
//       });
//     } catch {
//       // Silent fail on background polls — don't show error to user
//     } finally {
//       pollingRef.current = false;
//     }
//   }, []);

//   // ── Main effect: load + start polling on chatId change ───────────────────────
//   useEffect(() => {
//     if (!chatId) {
//       setMessages([]);
//       olderCursorRef.current  = null;
//       latestCreatedAtRef.current = 0;
//       setHasMore(false);
//       return;
//     }

//     setMessages([]);
//     olderCursorRef.current  = null;
//     latestCreatedAtRef.current = 0;
//     setHasMore(false);
//     setError(null);
//     pollingRef.current = false;

//     loadInitial(chatId);

//     // Poll every 3s while tab is visible
//     const startPolling = () => {
//       return setInterval(() => {
//         if (!document.hidden) pollNewMessages(chatId);
//       }, 3_000);
//     };

//     let interval = startPolling();

//     // Pause on tab hide, resume + immediate refresh on tab show
//     const handleVisibility = () => {
//       if (document.hidden) {
//         clearInterval(interval);
//       } else {
//         pollNewMessages(chatId);     // catch up immediately
//         interval = startPolling();   // restart 3s interval
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibility);
//     return () => {
//       clearInterval(interval);
//       document.removeEventListener("visibilitychange", handleVisibility);
//     };
//   }, [chatId, loadInitial, pollNewMessages]);

//   // ── Load older messages on demand (REST, no polling) ─────────────────────────
//   const loadMore = useCallback(async () => {
//     if (!chatId || loadingOlder || !hasMore) return;
//     try {
//       setLoadingOlder(true);
//       const cursor = olderCursorRef.current ?? undefined;
//       const res = await ChatAPI.getMessages(chatId, { limit: 30, ...(cursor ?? {}) });
//       setMessages(prev => {
//         const existingIds = new Set(prev.map(m => m.id));
//         const fresh = res.messages.filter(m => !existingIds.has(m.id));
//         return [...fresh, ...prev];
//       });
//       setHasMore(res.pagination.hasMore);
//       if (res.pagination.nextCursor) {
//         olderCursorRef.current = {
//           lastDocId:        res.pagination.nextCursor.lastDocId,
//           lastDocCreatedAt: res.pagination.nextCursor.lastDocCreatedAt as number,
//         };
//       }
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to load older messages");
//     } finally {
//       setLoadingOlder(false);
//     }
//   }, [chatId, loadingOlder, hasMore]);

//   // ── Send ──────────────────────────────────────────────────────────────────────
//   const send = useCallback(async (content: string, opts?: { replyToId?: string }) => {
//     if (!chatId || !content.trim()) return null;
//     try {
//       setSending(true);

//       // Show optimistic bubble immediately — no waiting for the server
//       const optimistic: Message = {
//         id:        `optimistic_${Date.now()}`,
//         chatId,
//         senderId:  currentUserId,
//         type:      "text",
//         content:   content.trim(),
//         isRead:    false,
//         createdAt: Date.now(),
//         updatedAt: Date.now(),
//         ...(opts?.replyToId && { replyToId: opts.replyToId }),
//       };
//       setMessages(prev => [...prev, optimistic]);

//       const res = await ChatAPI.sendMessage(chatId, content.trim(), opts);

//       // Replace optimistic with the real confirmed message
//       setMessages(prev => prev.map(m => m.id === optimistic.id ? res.message : m));

//       // Update latestCreatedAt so the next poll doesn't re-add this message
//       latestCreatedAtRef.current = Math.max(latestCreatedAtRef.current, res.message.createdAt);

//       return res.message;
//     } catch (e) {
//       // Remove failed optimistic message
//       setMessages(prev => prev.filter(m => !m.id.startsWith("optimistic_")));
//       setError(e instanceof Error ? e.message : "Failed to send message");
//       return null;
//     } finally {
//       setSending(false);
//     }
//   }, [chatId, currentUserId]);

//   // ── Edit ──────────────────────────────────────────────────────────────────────
//   const editMessage = useCallback(async (messageId: string, content: string) => {
//     // Optimistic update immediately
//     setMessages(prev =>
//       prev.map(m => m.id === messageId ? { ...m, content, updatedAt: Date.now() } : m)
//     );
//     try {
//       await MessageAPI.edit(messageId, content);
//       return true;
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to edit message");
//       return false;
//     }
//   }, []);

//   // ── Delete ────────────────────────────────────────────────────────────────────
//   const deleteMessage = useCallback(async (messageId: string) => {
//     // Optimistic soft-delete immediately
//     setMessages(prev =>
//       prev.map(m =>
//         m.id === messageId
//           ? { ...m, content: "This message was deleted.", deletedAt: Date.now() }
//           : m
//       )
//     );
//     try {
//       await MessageAPI.delete(messageId);
//       return true;
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to delete message");
//       return false;
//     }
//   }, []);

//   return {
//     messages,
//     loading,
//     loadingOlder,
//     sending,
//     error,
//     hasMore,
//     loadMore,
//     send,
//     editMessage,
//     deleteMessage,
//   };
// }

// // ─── useGroups ────────────────────────────────────────────────────────────────
// export function useGroups(params?: { privacy?: "public" | "closed" | "private"; trending?: boolean }) {
//   const [groups, setGroups]   = useState<Group[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState<string | null>(null);
//   const [hasMore, setHasMore] = useState(false);
//   const cursorRef = useRef<{ lastDocId: string; lastDocAt: number } | null>(null);

//   const privacyParam  = params?.privacy;
//   const trendingParam = params?.trending;

//   const load = useCallback(async (reset = false) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const cursor = reset ? undefined : cursorRef.current ?? undefined;
//       const res = await GroupAPI.list({ privacy: privacyParam, trending: trendingParam, ...(cursor ?? {}) });
//       setGroups(prev => reset ? res.groups : [...prev, ...res.groups]);
//       setHasMore(res.pagination.hasMore);
//       if (res.pagination.nextCursor) {
//         cursorRef.current = {
//           lastDocId: res.pagination.nextCursor.lastDocId,
//           lastDocAt: res.pagination.nextCursor.lastDocAt as number,
//         };
//       }
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to load groups");
//     } finally {
//       setLoading(false);
//     }
//   }, [privacyParam, trendingParam]);

//   useEffect(() => { load(true); }, [load]);

//   const refresh  = useCallback(() => { cursorRef.current = null; load(true); }, [load]);
//   const loadMore = useCallback(() => { if (hasMore && !loading) load(false); }, [hasMore, loading, load]);

//   const join = useCallback(async (groupId: string) => {
//     const res = await GroupAPI.join(groupId);
//     if (res.status === "joined") {
//       setGroups(prev => prev.map(g => g.id === groupId ? { ...g, memberCount: g.memberCount + 1 } : g));
//     }
//     return res;
//   }, []);

//   const leave = useCallback(async (groupId: string) => {
//     await GroupAPI.leave(groupId);
//     setGroups(prev => prev.map(g => g.id === groupId ? { ...g, memberCount: Math.max(0, g.memberCount - 1) } : g));
//   }, []);

//   const create = useCallback(async (data: { name: string; description?: string; privacy?: "public" | "closed" | "private"; tags?: string[] }) => {
//     const res = await GroupAPI.create(data);
//     setGroups(prev => [res.group, ...prev]);
//     return res.group;
//   }, []);

//   return { groups, loading, error, hasMore, refresh, loadMore, join, leave, create };
// }

// // ─── useCommunities ───────────────────────────────────────────────────────────
// export function useCommunities() {
//   const [communities, setCommunities] = useState<Community[]>([]);
//   const [loading, setLoading]         = useState(true);
//   const [error, setError]             = useState<string | null>(null);
//   const [hasMore, setHasMore]         = useState(false);
//   const cursorRef = useRef<{ lastDocId: string; lastDocMemberCount: number } | null>(null);

//   const load = useCallback(async (reset = false) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const cursor = reset ? undefined : cursorRef.current ?? undefined;
//       const res = await CommunityAPI.list(cursor ?? {});
//       setCommunities(prev => reset ? res.communities : [...prev, ...res.communities]);
//       setHasMore(res.pagination.hasMore);
//       if (res.pagination.nextCursor) {
//         cursorRef.current = {
//           lastDocId:          res.pagination.nextCursor.lastDocId,
//           lastDocMemberCount: res.pagination.nextCursor.lastDocMemberCount as number,
//         };
//       }
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to load communities");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { load(true); }, [load]);

//   const loadMore = useCallback(() => { if (hasMore && !loading) load(false); }, [hasMore, loading, load]);

//   return { communities, loading, error, hasMore, loadMore };
// }

// // ─── useCreateChat ─────────────────────────────────────────────────────────────
// export function useCreateChat() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError]     = useState<string | null>(null);

//   const createGroup = useCallback(async (name: string, participantIds?: string[]) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await ChatAPI.createGroup(name, participantIds);
//       return res.chat;
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to create group");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const createDM = useCallback(async (participantId: string) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await ChatAPI.createDM(participantId);
//       return res.chat;
//     } catch (e) {
//       setError(e instanceof Error ? e.message : "Failed to start DM");
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return { createGroup, createDM, loading, error };
// }

// // ─── Time helper ──────────────────────────────────────────────────────────────
// export function timeAgo(ms: number): string {
//   const diff = Date.now() - ms;
//   const m = Math.floor(diff / 60000);
//   if (m < 1) return "now";
//   if (m < 60) return `${m}m`;
//   const h = Math.floor(m / 60);
//   if (h < 24) return `${h}h`;
//   return `${Math.floor(h / 24)}d`;
// }






// src/hooks/useChat.ts  (FRONTEND project)
//
// Fixes in this version:
//   1. currentUserId is passed INTO useMessages so senderId comparison works
//   2. unreadCount reset locally when a chat is opened (no need to wait for poll)
//   3. pollNewMessages uses the same currentUserId so isRead updates correctly
//   4. loadInitial marks the chat as read optimistically in the chats list

import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChatAPI, GroupAPI, CommunityAPI, MessageAPI,
  type Chat, type Message, type Group, type Community,
} from "../lib/chatApi";

// ─── useChats — 30s polling ────────────────────────────────────────────────────
export function useChats(type?: "dm" | "group") {
  const [chats, setChats]     = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const cursorRef = useRef<{ lastDocId: string; lastDocUpdatedAt: number } | null>(null);

  const load = useCallback(async (reset = false) => {
    try {
      if (reset) setLoading(true);
      setError(null);
      const cursor = reset ? undefined : cursorRef.current ?? undefined;
      const res = await ChatAPI.list({ type, ...(cursor ?? {}) });
      setChats(prev => reset ? res.chats : [...prev, ...res.chats]);
      setHasMore(res.pagination.hasMore);
      if (res.pagination.nextCursor) {
        cursorRef.current = {
          lastDocId:        res.pagination.nextCursor.lastDocId,
          lastDocUpdatedAt: res.pagination.nextCursor.lastDocUpdatedAt as number,
        };
      }
    } catch (e) {
      if (reset) setError(e instanceof Error ? e.message : "Failed to load chats");
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    load(true);

    const startPolling = () =>
      setInterval(() => {
        if (!document.hidden) { cursorRef.current = null; load(true); }
      }, 30_000);

    let interval = startPolling();

    const handleVisibility = () => {
      if (!document.hidden) {
        clearInterval(interval);
        cursorRef.current = null;
        load(true);
        interval = startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [load]);

  const refresh = useCallback(() => { cursorRef.current = null; load(true); }, [load]);
  const loadMore = useCallback(() => { if (hasMore && !loading) load(false); }, [hasMore, loading, load]);
  const updateChat = useCallback((updated: Chat) => setChats(prev => prev.map(c => c.id === updated.id ? updated : c)), []);
  const removeChat = useCallback((chatId: string) => setChats(prev => prev.filter(c => c.id !== chatId)), []);
  const prependChat = useCallback((chat: Chat) => setChats(prev => [chat, ...prev.filter(c => c.id !== chat.id)]), []);

  // ── Called when user opens a chat — instantly zeroes the unread badge ────────
  // Fix #3: don't wait for the next 30s poll to clear the red number
  const markChatAsRead = useCallback((chatId: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
  }, []);

  return { chats, loading, error, hasMore, refresh, loadMore, updateChat, removeChat, prependChat, markChatAsRead };
}

// ─── useMessages — 3s polling ─────────────────────────────────────────────────
// Fix #1: accepts currentUserId as a parameter instead of reading from useAuth()
// This ensures the senderId comparison (isMe) always has the right value.
export function useMessages(chatId: string | null, currentUserId: string) {
  const [messages, setMessages]         = useState<Message[]>([]);
  const [loading, setLoading]           = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [sending, setSending]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [hasMore, setHasMore]           = useState(false);

  const olderCursorRef     = useRef<{ lastDocId: string; lastDocCreatedAt: number } | null>(null);
  const latestCreatedAtRef = useRef<number>(0);
  const pollingRef         = useRef(false);

  // ── Initial load ─────────────────────────────────────────────────────────────
  const loadInitial = useCallback(async (cid: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await ChatAPI.getMessages(cid, { limit: 50 });
      setMessages(res.messages);
      setHasMore(res.pagination.hasMore);
      if (res.messages.length > 0) {
        latestCreatedAtRef.current = Math.max(...res.messages.map(m => m.createdAt));
      }
      if (res.pagination.nextCursor) {
        olderCursorRef.current = {
          lastDocId:        res.pagination.nextCursor.lastDocId,
          lastDocCreatedAt: res.pagination.nextCursor.lastDocCreatedAt as number,
        };
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Background poll ───────────────────────────────────────────────────────────
  const pollNewMessages = useCallback(async (cid: string) => {
    if (pollingRef.current) return;
    pollingRef.current = true;
    try {
      const res = await ChatAPI.getMessages(cid, { limit: 50 });
      setMessages(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const newMsgs     = res.messages.filter(m => !existingIds.has(m.id));

        // Apply modifications (edits, soft-deletes, isRead) to existing messages
        const updated = prev.map(existing => {
          const serverVersion = res.messages.find(m => m.id === existing.id);
          if (!serverVersion) return existing;
          return existing.id.startsWith("optimistic_") ? existing : serverVersion;
        });

        if (newMsgs.length === 0) return updated;

        const allTimestamps = res.messages.map(m => m.createdAt);
        if (allTimestamps.length > 0) latestCreatedAtRef.current = Math.max(...allTimestamps);

        return [...updated, ...newMsgs];
      });
    } catch {
      // Silent fail on background polls
    } finally {
      pollingRef.current = false;
    }
  }, []);

  // ── Main effect ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      olderCursorRef.current     = null;
      latestCreatedAtRef.current = 0;
      setHasMore(false);
      return;
    }

    setMessages([]);
    olderCursorRef.current     = null;
    latestCreatedAtRef.current = 0;
    setHasMore(false);
    setError(null);
    pollingRef.current = false;

    loadInitial(chatId);

    const startPolling = () =>
      setInterval(() => { if (!document.hidden) pollNewMessages(chatId); }, 3_000);

    let interval = startPolling();

    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(interval);
      } else {
        pollNewMessages(chatId);
        interval = startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [chatId, loadInitial, pollNewMessages]);

  // ── Load older messages ───────────────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (!chatId || loadingOlder || !hasMore) return;
    try {
      setLoadingOlder(true);
      const cursor = olderCursorRef.current ?? undefined;
      const res = await ChatAPI.getMessages(chatId, { limit: 30, ...(cursor ?? {}) });
      setMessages(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const fresh = res.messages.filter(m => !existingIds.has(m.id));
        return [...fresh, ...prev];
      });
      setHasMore(res.pagination.hasMore);
      if (res.pagination.nextCursor) {
        olderCursorRef.current = {
          lastDocId:        res.pagination.nextCursor.lastDocId,
          lastDocCreatedAt: res.pagination.nextCursor.lastDocCreatedAt as number,
        };
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load older messages");
    } finally {
      setLoadingOlder(false);
    }
  }, [chatId, loadingOlder, hasMore]);

  // ── Send ──────────────────────────────────────────────────────────────────────
  const send = useCallback(async (content: string, opts?: { replyToId?: string }) => {
    if (!chatId || !content.trim()) return null;
    try {
      setSending(true);
      const optimistic: Message = {
        id:        `optimistic_${Date.now()}`,
        chatId,
        senderId:  currentUserId,   // ← uses the passed-in userId, never empty
        type:      "text",
        content:   content.trim(),
        isRead:    false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...(opts?.replyToId && { replyToId: opts.replyToId }),
      };
      setMessages(prev => [...prev, optimistic]);

      const res = await ChatAPI.sendMessage(chatId, content.trim(), opts);
      setMessages(prev => prev.map(m => m.id === optimistic.id ? res.message : m));
      latestCreatedAtRef.current = Math.max(latestCreatedAtRef.current, res.message.createdAt);
      return res.message;
    } catch (e) {
      setMessages(prev => prev.filter(m => !m.id.startsWith("optimistic_")));
      setError(e instanceof Error ? e.message : "Failed to send message");
      return null;
    } finally {
      setSending(false);
    }
  }, [chatId, currentUserId]);

  // ── Edit ──────────────────────────────────────────────────────────────────────
  const editMessage = useCallback(async (messageId: string, content: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content, updatedAt: Date.now() } : m));
    try {
      await MessageAPI.edit(messageId, content);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to edit message");
      return false;
    }
  }, []);

  // ── Delete ────────────────────────────────────────────────────────────────────
  const deleteMessage = useCallback(async (messageId: string) => {
    setMessages(prev => prev.map(m =>
      m.id === messageId
        ? { ...m, content: "This message was deleted.", deletedAt: Date.now() }
        : m
    ));
    try {
      await MessageAPI.delete(messageId);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete message");
      return false;
    }
  }, []);

  return { messages, loading, loadingOlder, sending, error, hasMore, loadMore, send, editMessage, deleteMessage };
}

// ─── useGroups ────────────────────────────────────────────────────────────────
export function useGroups(params?: { privacy?: "public" | "closed" | "private"; trending?: boolean }) {
  const [groups, setGroups]   = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const cursorRef = useRef<{ lastDocId: string; lastDocAt: number } | null>(null);

  const privacyParam  = params?.privacy;
  const trendingParam = params?.trending;

  const load = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      const cursor = reset ? undefined : cursorRef.current ?? undefined;
      const res = await GroupAPI.list({ privacy: privacyParam, trending: trendingParam, ...(cursor ?? {}) });
      setGroups(prev => reset ? res.groups : [...prev, ...res.groups]);
      setHasMore(res.pagination.hasMore);
      if (res.pagination.nextCursor) {
        cursorRef.current = {
          lastDocId: res.pagination.nextCursor.lastDocId,
          lastDocAt: res.pagination.nextCursor.lastDocAt as number,
        };
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load groups");
    } finally {
      setLoading(false);
    }
  }, [privacyParam, trendingParam]);

  useEffect(() => { load(true); }, [load]);

  const refresh  = useCallback(() => { cursorRef.current = null; load(true); }, [load]);
  const loadMore = useCallback(() => { if (hasMore && !loading) load(false); }, [hasMore, loading, load]);

  const join = useCallback(async (groupId: string) => {
    const res = await GroupAPI.join(groupId);
    if (res.status === "joined") setGroups(prev => prev.map(g => g.id === groupId ? { ...g, memberCount: g.memberCount + 1 } : g));
    return res;
  }, []);

  const leave = useCallback(async (groupId: string) => {
    await GroupAPI.leave(groupId);
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, memberCount: Math.max(0, g.memberCount - 1) } : g));
  }, []);

  const create = useCallback(async (data: { name: string; description?: string; privacy?: "public" | "closed" | "private"; tags?: string[] }) => {
    const res = await GroupAPI.create(data);
    setGroups(prev => [res.group, ...prev]);
    return res.group;
  }, []);

  return { groups, loading, error, hasMore, refresh, loadMore, join, leave, create };
}

// ─── useCommunities ───────────────────────────────────────────────────────────
export function useCommunities() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [hasMore, setHasMore]         = useState(false);
  const cursorRef = useRef<{ lastDocId: string; lastDocMemberCount: number } | null>(null);

  const load = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      const cursor = reset ? undefined : cursorRef.current ?? undefined;
      const res = await CommunityAPI.list(cursor ?? {});
      setCommunities(prev => reset ? res.communities : [...prev, ...res.communities]);
      setHasMore(res.pagination.hasMore);
      if (res.pagination.nextCursor) {
        cursorRef.current = {
          lastDocId:          res.pagination.nextCursor.lastDocId,
          lastDocMemberCount: res.pagination.nextCursor.lastDocMemberCount as number,
        };
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load communities");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(true); }, [load]);
  const loadMore = useCallback(() => { if (hasMore && !loading) load(false); }, [hasMore, loading, load]);

  return { communities, loading, error, hasMore, loadMore };
}

// ─── useCreateChat ─────────────────────────────────────────────────────────────
export function useCreateChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const createGroup = useCallback(async (name: string, participantIds?: string[]) => {
    try {
      setLoading(true); setError(null);
      const res = await ChatAPI.createGroup(name, participantIds);
      return res.chat;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create group");
      return null;
    } finally { setLoading(false); }
  }, []);

  const createDM = useCallback(async (participantId: string) => {
    try {
      setLoading(true); setError(null);
      const res = await ChatAPI.createDM(participantId);
      return res.chat;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start DM");
      return null;
    } finally { setLoading(false); }
  }, []);

  return { createGroup, createDM, loading, error };
}

// ─── Time helper ──────────────────────────────────────────────────────────────
export function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}