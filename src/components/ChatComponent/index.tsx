// components/ChatComponent/index.tsx  — FRONTEND project
// CLEANED: Groups and Communities removed. DM-only experience.
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronLeft, Plus, UserPlus, Camera, X, MoreVertical, Mic,
  CheckCheck, Reply, Edit2, Trash2,
  Search, BadgeCheck, Loader2,
  AlertCircle, Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useChats, useMessages, useCreateChat, timeAgo } from "../../../hooks/useChat";
import { useAuth } from "@/context/AuthContext";
import {
  ChatAPI, resolveChatName,
  type Chat, type Message,
} from "../../../lib/chatApi";

// REMOVED: "Discover Groups" | "Communities" tabs
type TabType  = "My Chats";
// REMOVED: create_group | create_community | group_detail | group_members | edit_group | community_detail views
type ViewType = "list" | "chat_room";

const EMOJIS = ["🤣", "🥳", "🤩", "😡", "😔"];

type PickerUser = {
  userId?: string; user_id?: string; id?: string;
  email?: string; firstName?: string; lastName?: string; name?: string; avatar?: string;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const ChatAvatar = ({ src, name, size = "w-12 h-12", className = "", fallbackBg = "bg-[#2a1a1f]" }: {
  src?: string | null; name: string; size?: string; className?: string; fallbackBg?: string;
}) => {
  const [err, setErr] = useState(false);
  const letter = (name || "?").charAt(0).toUpperCase();
  return (
    <div className={`${size} rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold ${!src || err ? fallbackBg : "bg-[#151515]"} border border-white/5 ${className}`}>
      {src && !err
        ? <img src={src} alt={name} className="w-full h-full object-cover" onError={() => setErr(true)} />
        : <span className="text-xl opacity-80">{letter}</span>}
    </div>
  );
};

const Spinner = ({ className = "" }: { className?: string }) => (
  <Loader2 size={20} className={`animate-spin text-[#e91e63] ${className}`} />
);

const ErrorBanner = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex items-center gap-3 bg-red-900/20 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
    <AlertCircle size={16} className="flex-shrink-0" />
    <span className="flex-1">{message}</span>
    {onRetry && <button onClick={onRetry} className="text-red-300 underline text-xs">Retry</button>}
  </div>
);

const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 animate-pulse">
    <div className="w-14 h-14 rounded-full bg-white/5" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-4 bg-white/5 rounded w-1/3" />
      <div className="h-3 bg-white/5 rounded w-2/3" />
    </div>
  </div>
);

// REMOVED: PrivacyBadge — only used by Groups
// REMOVED: PrivacySelector — only used by Groups

const MessageTicks = ({ isRead, isOptimistic }: { isRead: boolean; isOptimistic: boolean }) => {
  if (isOptimistic) return <Loader2 size={10} className="animate-spin text-gray-500" />;
  if (isRead)       return <CheckCheck size={14} className="text-blue-400" />;
  return              <CheckCheck size={14} className="text-gray-500" />;
};

const UserPickerSheet = ({ open, onClose, onPickUser, title = "New Chat" }: {
  open: boolean; onClose: () => void; onPickUser: (userId: string, displayName: string) => void; title?: string;
}) => {
  const [search, setSearch]   = useState("");
  const [users, setUsers]     = useState<PickerUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!open) { setSearch(""); return; }
    const ac = new AbortController();
    setLoading(true); setError(null);
    fetch("/api/users", { signal: ac.signal, credentials: "include" })
      .then(r => r.json())
      .then(json => setUsers(Array.isArray(json.users) ? json.users : []))
      .catch(e => { if (e.name !== "AbortError") setError("Failed to load users"); })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [open]);

  if (!open) return null;

  const filtered = (users ?? []).filter(u => {
    const name  = `${u.firstName ?? u.name ?? ""} ${u.lastName ?? ""}`.toLowerCase();
    const email = (u.email ?? "").toLowerCase();
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
  });

  return (
    <div className="absolute inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-[#1a1a1a] w-full max-w-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition"><X size={20} /></button>
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-3 bg-[#111] rounded-xl px-3 py-2.5 border border-white/5">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500" />
            {search && <button onClick={() => setSearch("")}><X size={14} className="text-gray-500" /></button>}
          </div>
        </div>
        <div className="max-h-72 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          {loading  && <div className="flex items-center justify-center py-10 gap-3 text-gray-400 text-sm"><Spinner /> Loading users…</div>}
          {error    && <div className="p-4 text-center text-sm text-red-400">{error}</div>}
          {!loading && !error && filtered.length === 0 && <div className="p-6 text-center text-sm text-gray-500">No users found</div>}
          {filtered.map((u, index) => {
            const id = u.userId ?? u.user_id ?? u.id ?? u.email ?? "";
            const displayName = (u.name?.trim()) || `${u.firstName ?? ""}${u.lastName ? ` ${u.lastName}` : ""}`.trim() || id;
            const key = id ? `${id}-${index}` : `user-${index}`;
            return (
              <div key={key} onClick={() => onPickUser(id, displayName)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 transition-colors">
                <ChatAvatar src={u.avatar} name={displayName} size="w-10 h-10" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{displayName}</div>
                  {u.email && <div className="text-xs text-gray-400 truncate">{u.email}</div>}
                </div>
                <div className="w-8 h-8 rounded-full bg-[#e91e63]/10 border border-[#e91e63]/30 flex items-center justify-center flex-shrink-0">
                  <UserPlus size={14} className="text-[#e91e63]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function ChatComponent() {
  const router = useRouter();
  const { user, authReady } = useAuth();

  const currentUserId = user?.userId ?? user?.uid ?? user?.email ?? "";

  const [view, setView]               = useState<ViewType>("list");
  const [activeTab]                   = useState<TabType>("My Chats"); // single tab, no setter needed
  const [activeChat, setActiveChat]   = useState<Chat | null>(null);
  const [search, setSearch]           = useState("");

  const chatHook       = useChats(undefined, authReady);
  // REMOVED: groupHook, communityHook
  const messageHook    = useMessages(activeChat?.id ?? null, currentUserId, authReady);
  const createChatHook = useCreateChat(); // kept — used by handlePickUser internally if needed

  // ── Misc UI ────────────────────────────────────────────────────────────────
  const [showUserPicker, setShowUserPicker]       = useState(false);
  const [messageInput, setMessageInput]           = useState("");
  const [replyingTo, setReplyingTo]               = useState<Message | null>(null);
  const [editingMsg, setEditingMsg]               = useState<Message | null>(null);
  const [deletingMsgId, setDeletingMsgId]         = useState<string | null>(null);
  const [activeMenuMsgId, setActiveMenuMsgId]     = useState<string | null>(null);
  const [toastMsg, setToastMsg]                   = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu]             = useState(false);
  const [dmCreating, setDmCreating]               = useState(false);

  const menuRef       = useRef<HTMLDivElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef      = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowAddMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [messageHook.messages]);

  useEffect(() => {
    if (view === "chat_room") setTimeout(() => inputRef.current?.focus(), 100);
  }, [view]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }, []);

  // ── Open a DM chat room ────────────────────────────────────────────────────
  const openChat = useCallback((chat: Chat) => {
    setActiveChat(chat);
    setMessageInput("");
    setReplyingTo(null);
    setEditingMsg(null);
    chatHook.markChatAsRead(chat.id);
    setView("chat_room");
  }, [chatHook]);

  const activeChatId = activeChat?.id;

  useEffect(() => {
    if (activeChatId) {
      chatHook.markChatAsRead(activeChatId);
    }
  }, [activeChatId, chatHook]);

  // REMOVED: openGroupDetail, openCommunityDetail, loadCommunityMembers, handleJoinCommunity,
  //          handleLeaveCommunity, loadMembers, openGroupMembers, openEditGroup,
  //          handleCreateGroup, handleSaveGroup, handleJoinGroup, handleLeaveGroup,
  //          handleCreateCommunity, handleAddMember, handleRemoveMember, handleToggleAdmin,
  //          myRoleInGroup, isOwnerOrAdmin

  const handlePickUser = useCallback(async (userId: string, displayName: string) => {
    setShowUserPicker(false);
    setDmCreating(true);
    try {
      const res = await ChatAPI.createDM(userId, displayName);
      chatHook.prependChat(res.chat);
      openChat(res.chat);
      showToast("Chat opened!");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to create chat");
    } finally {
      setDmCreating(false);
    }
  }, [chatHook, openChat, showToast]);

  const handleSend = useCallback(async () => {
    const text = messageInput.trim();
    if (!text || !activeChat) return;
    setMessageInput("");
    if (editingMsg) {
      await messageHook.editMessage(editingMsg.id, text);
      setEditingMsg(null);
      return;
    }
    await messageHook.send(text, replyingTo ? { replyToId: replyingTo.id } : undefined);
    setReplyingTo(null);
    chatHook.refresh();
    chatHook.markChatAsRead(activeChat.id);
  }, [messageInput, activeChat, editingMsg, replyingTo, messageHook, chatHook]);

  const confirmDelete = useCallback(async () => {
    if (!deletingMsgId) return;
    await messageHook.deleteMessage(deletingMsgId);
    setDeletingMsgId(null);
    setActiveMenuMsgId(null);
  }, [deletingMsgId, messageHook]);

  // Search helper — filters DM list by resolved display name
  const filterBySearch = (chats: Chat[]) => {
    if (!search.trim()) return chats;
    return chats.filter(chat =>
      resolveChatName(chat, currentUserId).toLowerCase().includes(search.toLowerCase())
    );
  };

  // ── Auth loading ────────────────────────────────────────────────────────────
  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW: CHAT ROOM
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "chat_room" && activeChat) {
    const chatDisplayName = resolveChatName(activeChat, currentUserId);

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#111] border-b border-white/5 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => { setView("list"); setActiveChat(null); }} className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 transition">
              <ChevronLeft size={22} />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <ChatAvatar src={activeChat.avatarUrl} name={chatDisplayName} size="w-10 h-10" />
                {activeChat.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]" />}
              </div>
              <div>
                <h1 className="text-[16px] font-bold flex items-center gap-1">
                  {chatDisplayName}
                  {activeChat.isVerified && <BadgeCheck size={14} className="text-blue-500" />}
                </h1>
                {activeChat.isOnline
                  ? <span className="text-xs text-green-400">Online</span>
                  : <span className="text-xs text-gray-500">{activeChat.lastMessageAt ? `Last seen ${timeAgo(activeChat.lastMessageAt)}` : "Offline"}</span>
                }
              </div>
            </div>
          </div>
          {/* DM settings — info/block/report */}
          <button className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 transition">
            <MoreVertical size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Messages */}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" onClick={() => setActiveMenuMsgId(null)}>
          {messageHook.loading && messageHook.messages.length === 0 && <div className="flex justify-center py-16"><Spinner /></div>}
          {messageHook.error && <ErrorBanner message={messageHook.error} />}
          {toastMsg && (
            <div className="flex justify-center sticky top-2 z-10 mb-2">
              <div className="bg-[#222]/90 backdrop-blur-md text-gray-200 px-5 py-2 rounded-full text-sm shadow-xl border border-white/10">{toastMsg}</div>
            </div>
          )}
          {!messageHook.loading && messageHook.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-600">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center"><Mic size={28} /></div>
              <p className="text-sm">No messages yet. Say hi! 👋</p>
            </div>
          )}

          {messageHook.messages.map((msg, idx) => {
            const isMe         = msg.senderId === currentUserId;
            const isDeleted    = !!msg.deletedAt;
            const showMenu     = activeMenuMsgId === msg.id;
            const isOptimistic = msg.id.startsWith("optimistic_");
            const prevMsg      = idx > 0 ? messageHook.messages[idx - 1] : null;
            const isSameSender = prevMsg?.senderId === msg.senderId;
            const replyMsg     = msg.replyToId ? messageHook.messages.find(m => m.id === msg.replyToId) : null;

            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} ${isSameSender ? "mt-0.5" : "mt-3"}`}>
                {/* REMOVED: group avatar stacking — DMs are 1-to-1 only */}

                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[72%] relative`}>
                  {replyMsg && !isDeleted && (
                    <div className={`text-xs px-3 py-1.5 rounded-t-lg mb-[-6px] max-w-full truncate border-l-2 ${isMe ? "bg-[#c01854] text-pink-200 border-pink-300 self-end" : "bg-[#2a2a2a] text-gray-300 border-gray-500 self-start"}`}>
                      <span className="font-medium">{replyMsg.senderId === currentUserId ? "You" : replyMsg.senderId}</span>
                      <span className="ml-1 opacity-80">{replyMsg.content.slice(0, 50)}</span>
                    </div>
                  )}

                  <div
                    onClick={e => { e.stopPropagation(); if (!isDeleted) setActiveMenuMsgId(showMenu ? null : msg.id); }}
                    className={`px-4 py-2 text-[14.5px] leading-relaxed cursor-pointer select-none relative ${isOptimistic ? "opacity-70" : "opacity-100"} ${
                      isDeleted ? "bg-[#1a1a1a] text-gray-500 italic rounded-2xl text-sm"
                      : isMe    ? "bg-[#e91e63] text-white rounded-2xl rounded-br-sm"
                                : "bg-[#262626] text-white rounded-2xl rounded-bl-sm"
                    }`}
                  >
                    {isDeleted ? "This message was deleted." : msg.content}
                    {!isDeleted && (
                      <span className={`inline-flex items-center gap-1 ml-2 float-right mt-1 ${isMe ? "text-pink-200/70" : "text-gray-500"} text-[10px] leading-none`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {isMe && <MessageTicks isRead={msg.isRead} isOptimistic={isOptimistic} />}
                      </span>
                    )}
                  </div>

                  {showMenu && !isDeleted && (
                    <div className={`absolute z-50 top-0 w-56 bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isMe ? "right-full mr-2" : "left-full ml-2"}`} onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-around px-3 py-2.5 border-b border-white/5 bg-[#252525]">
                        {EMOJIS.map(emoji => <button key={emoji} onClick={() => setActiveMenuMsgId(null)} className="text-xl hover:scale-125 active:scale-110 transition-transform">{emoji}</button>)}
                      </div>
                      <button onClick={() => { setReplyingTo(msg); setActiveMenuMsgId(null); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-gray-200 transition-colors">
                        <Reply size={15} className="text-gray-400" /> Reply
                      </button>
                      {isMe && (
                        <>
                          <button onClick={() => { setEditingMsg(msg); setMessageInput(msg.content); setActiveMenuMsgId(null); setTimeout(() => inputRef.current?.focus(), 50); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-gray-200 transition-colors">
                            <Edit2 size={15} className="text-gray-400" /> Edit
                          </button>
                          <button onClick={() => { setDeletingMsgId(msg.id); setActiveMenuMsgId(null); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-red-500 transition-colors">
                            <Trash2 size={15} /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="bg-[#0a0a0a] border-t border-white/5 px-4 pb-4 pt-2 z-20">
          {(replyingTo || editingMsg) && (
            <div className="flex items-center justify-between bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 mb-2">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#e91e63]">{editingMsg ? "Editing message" : "Replying to message"}</span>
                <span className="text-xs text-gray-400 truncate">{editingMsg ? editingMsg.content : replyingTo?.content}</span>
              </div>
              <button onClick={() => { setReplyingTo(null); setEditingMsg(null); setMessageInput(""); }} className="ml-3 p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition flex-shrink-0">
                <X size={13} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-full px-4 py-3 border border-white/10">
            <input
              ref={inputRef}
              type="text"
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              placeholder={editingMsg ? "Edit your message..." : "Message…"}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm"
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
            {messageInput.trim()
              ? <button onClick={handleSend} disabled={messageHook.sending} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#e91e63] hover:bg-pink-600 transition disabled:opacity-50 flex-shrink-0">
                  {messageHook.sending
                    ? <Loader2 size={16} className="animate-spin text-white" />
                    : <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth={2.5}><path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" /></svg>
                  }
                </button>
              : <button className="text-gray-400 hover:text-white transition"><Mic size={20} /></button>
            }
          </div>
        </div>

        {/* Delete confirmation */}
        {deletingMsgId && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
            <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-sm border border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Delete message?</h3>
                <button onClick={() => setDeletingMsgId(null)} className="p-1 hover:bg-white/10 rounded-full transition"><X size={20} className="text-gray-400" /></button>
              </div>
              <p className="text-gray-400 text-sm mb-6">This will delete the message for everyone. This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeletingMsgId(null)} className="px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/10 transition">Cancel</button>
                <button onClick={confirmDelete} className="px-5 py-2.5 rounded-full text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition shadow-lg shadow-red-600/20">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW: MAIN LIST (DMs only)
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden font-sans flex flex-col">
      <div className="max-w-2xl mx-auto w-full relative z-10 flex flex-col h-screen">

        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 transition">
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-2xl font-bold tracking-wide">Messages</h1>
          </div>
          <div className="flex items-center gap-2">
            {dmCreating && <Spinner />}
            <div className="relative" ref={menuRef}>
              {/* SIMPLIFIED: only "New chat" action remains — no group/community options */}
              <button
                onClick={() => { setShowAddMenu(false); setShowUserPicker(true); }}
                className="w-10 h-10 flex items-center justify-center rounded bg-gradient-to-br from-pink-500 to-orange-500 hover:opacity-90 transition shadow-lg shadow-pink-500/20"
              >
                <Plus size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 mb-4">
          <div className="flex items-center gap-3 bg-[#151515] rounded-xl px-4 py-3 border border-white/5 focus-within:border-pink-500/50 transition">
            <Search size={18} className="text-gray-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500" />
            {search && <button onClick={() => setSearch("")}><X size={16} className="text-gray-500" /></button>}
          </div>
        </div>

        {/* REMOVED: Tabs bar ("My Chats" | "Discover Groups" | "Communities") */}
        {/* Now DMs are always shown directly — no tab switching needed */}

        {/* DM List */}
        <div className="flex-1 overflow-y-auto px-4 pb-20 flex flex-col gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {chatHook.error && <ErrorBanner message={chatHook.error} onRetry={chatHook.refresh} />}
          {chatHook.loading && chatHook.chats.length === 0 && <>{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</>}

          {filterBySearch(chatHook.chats.filter(chat => chat.type === "dm")).map(chat => {
            const displayName = resolveChatName(chat, currentUserId);
            return (
              <div key={chat.id} onClick={() => openChat(chat)} className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 cursor-pointer hover:bg-white/5 active:bg-white/10 transition-colors">
                <div className="relative flex-shrink-0">
                  <ChatAvatar src={chat.avatarUrl} name={displayName} size="w-14 h-14" />
                  {chat.isOnline && <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h2 className="text-white font-bold text-[15px] truncate flex items-center gap-1.5">
                      {displayName}
                      {chat.isVerified && <BadgeCheck size={15} className="text-blue-500 flex-shrink-0" />}
                    </h2>
                    <span className="text-[11px] text-gray-500 whitespace-nowrap ml-2 flex-shrink-0">{chat.lastMessageAt ? timeAgo(chat.lastMessageAt) : ""}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400 truncate pr-3">{chat.lastMessageContent || "Tap to chat"}</p>
                    {chat.unreadCount > 0 && (
                      <div className="bg-[#e91e63] text-white text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/20 flex-shrink-0">
                        {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {chatHook.hasMore && (
            <button onClick={chatHook.loadMore} disabled={chatHook.loading} className="text-xs text-gray-500 hover:text-gray-300 text-center py-3 flex items-center justify-center gap-2">
              {chatHook.loading ? <Spinner /> : "Load more"}
            </button>
          )}

          {!chatHook.loading && chatHook.chats.filter(c => c.type === "dm").length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-600">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <UserPlus size={28} />
              </div>
              <p className="text-sm">No messages yet. Start a conversation!</p>
              <button onClick={() => setShowUserPicker(true)} className="px-4 py-2 rounded-full bg-[#e91e63]/10 border border-[#e91e63]/30 text-[#e91e63] text-sm font-medium hover:bg-[#e91e63]/20 transition">
                New Message
              </button>
            </div>
          )}
        </div>
      </div>

      <UserPickerSheet open={showUserPicker} onClose={() => setShowUserPicker(false)} onPickUser={handlePickUser} />
    </div>
  );
}
