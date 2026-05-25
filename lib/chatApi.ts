// // src/lib/api.ts
// // Thin fetch wrappers that match the deployed API routes exactly.
// // Every function returns typed data or throws so callers can catch.

// const BASE = "/api";

// // ─── Generic helper ───────────────────────────────────────────────────────────

// async function request<T>(
//   path: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const res = await fetch(`${BASE}${path}`, {
//     headers: { "Content-Type": "application/json" },
//     ...options,
//   });
//   const json = await res.json();
//   if (!res.ok || !json.success) {
//     throw new Error(json.error ?? `Request failed: ${res.status}`);
//   }
//   return json as T;
// }

// // ─── Types (mirrors lib/types/messages.ts on the backend) ────────────────────

// export type ChatType = "dm" | "group";
// export type MessageType = "text" | "image" | "video" | "audio" | "file";
// export type GroupPrivacy = "public" | "closed" | "private";
// export type GroupRole = "owner" | "admin" | "member";

// export interface Chat {
//   id: string;
//   type: ChatType;
//   name: string;
//   avatarUrl?: string;
//   participantIds: string[];
//   lastMessageContent: string;
//   lastMessageAt: number;
//   unreadCount: number;
//   isOnline: boolean;
//   isVerified: boolean;
//   isPinned: boolean;
//   isMuted: boolean;
//   createdBy: string;
//   createdAt: number;
//   updatedAt: number;
// }

// export interface Message {
//   id: string;
//   chatId: string;
//   senderId: string;
//   type: MessageType;
//   content: string;
//   mediaUrl?: string;
//   replyToId?: string;
//   isRead: boolean;
//   deletedAt?: number;
//   createdAt: number;
//   updatedAt: number;
// }

// export interface Group {
//   id: string;
//   name: string;
//   description: string;
//   avatarUrl?: string;
//   privacy: GroupPrivacy;
//   memberCount: number;
//   isTrending: boolean;
//   category?: string;
//   lastActivityAt: number;
//   isVerified: boolean;
//   tags: string[];
//   chatId?: string;
//   createdBy: string;
//   createdAt: number;
//   updatedAt: number;
// }

// export interface Community {
//   id: string;
//   name: string;
//   description?: string;
//   avatarUrl?: string;
//   memberCount: number;
//   groupCount: number;
//   isVerified: boolean;
//   createdAt: number;
//   updatedAt: number;
// }

// export interface Pagination {
//   limit: number;
//   hasMore: boolean;
//   nextCursor: { lastDocId: string; [key: string]: unknown } | null;
// }

// // ─── Chats ────────────────────────────────────────────────────────────────────

// export const ChatAPI = {
//   list: (params?: { type?: ChatType; lastDocId?: string; lastDocUpdatedAt?: number; limit?: number }) => {
//     const q = new URLSearchParams();
//     if (params?.type) q.set("type", params.type);
//     if (params?.limit) q.set("limit", String(params.limit));
//     if (params?.lastDocId) q.set("lastDocId", params.lastDocId);
//     if (params?.lastDocUpdatedAt) q.set("lastDocUpdatedAt", String(params.lastDocUpdatedAt));
//     return request<{ success: true; chats: Chat[]; pagination: Pagination }>(`/chats?${q}`);
//   },

//   get: (chatId: string) =>
//     request<{ success: true; chat: Chat }>(`/chats/${chatId}`),

//   createDM: (participantId: string) =>
//     request<{ success: true; id: string; chat: Chat }>("/chats", {
//       method: "POST",
//       body: JSON.stringify({ type: "dm", participantId }),
//     }),

//   createGroup: (name: string, participantIds?: string[]) =>
//     request<{ success: true; id: string; chat: Chat }>("/chats", {
//       method: "POST",
//       body: JSON.stringify({ type: "group", name, participantIds }),
//     }),

//   update: (chatId: string, data: Partial<Pick<Chat, "name" | "isMuted" | "isPinned" | "avatarUrl">>) =>
//     request<{ success: true; chat: Chat }>(`/chats/${chatId}`, {
//       method: "PATCH",
//       body: JSON.stringify(data),
//     }),

//   delete: (chatId: string) =>
//     request<{ success: true; message: string }>(`/chats/${chatId}`, { method: "DELETE" }),

//   // Messages
//   getMessages: (chatId: string, params?: { lastDocId?: string; lastDocCreatedAt?: number; limit?: number }) => {
//     const q = new URLSearchParams();
//     if (params?.limit) q.set("limit", String(params.limit));
//     if (params?.lastDocId) q.set("lastDocId", params.lastDocId);
//     if (params?.lastDocCreatedAt) q.set("lastDocCreatedAt", String(params.lastDocCreatedAt));
//     return request<{ success: true; messages: Message[]; pagination: Pagination }>(`/chats/${chatId}/messages?${q}`);
//   },

//   sendMessage: (chatId: string, content: string, opts?: { type?: MessageType; replyToId?: string; mediaUrl?: string }) =>
//     request<{ success: true; id: string; message: Message }>(`/chats/${chatId}/messages`, {
//       method: "POST",
//       body: JSON.stringify({ content, ...opts }),
//     }),
// };

// // ─── Messages ─────────────────────────────────────────────────────────────────

// export const MessageAPI = {
//   edit: (messageId: string, content: string) =>
//     request<{ success: true; message: Message }>(`/messages/${messageId}`, {
//       method: "PATCH",
//       body: JSON.stringify({ content }),
//     }),

//   delete: (messageId: string) =>
//     request<{ success: true; message: string }>(`/messages/${messageId}`, { method: "DELETE" }),
// };

// // ─── Groups ───────────────────────────────────────────────────────────────────

// export const GroupAPI = {
//   list: (params?: {
//     privacy?: GroupPrivacy;
//     trending?: boolean;
//     category?: string;
//     joined?: boolean;
//     lastDocId?: string;
//     lastDocAt?: number;
//     limit?: number;
//   }) => {
//     const q = new URLSearchParams();
//     if (params?.privacy) q.set("privacy", params.privacy);
//     if (params?.trending) q.set("trending", "true");
//     if (params?.category) q.set("category", params.category);
//     if (params?.joined) q.set("joined", "true");
//     if (params?.limit) q.set("limit", String(params.limit));
//     if (params?.lastDocId) q.set("lastDocId", params.lastDocId);
//     if (params?.lastDocAt) q.set("lastDocAt", String(params.lastDocAt));
//     return request<{ success: true; groups: Group[]; pagination: Pagination }>(`/groups?${q}`);
//   },

//   get: (groupId: string) =>
//     request<{ success: true; group: Group }>(`/groups/${groupId}`),

//   create: (data: { name: string; description?: string; privacy?: GroupPrivacy; category?: string; tags?: string[] }) =>
//     request<{ success: true; id: string; group: Group }>("/groups", {
//       method: "POST",
//       body: JSON.stringify(data),
//     }),

//   update: (groupId: string, data: Partial<Pick<Group, "name" | "description" | "privacy" | "category" | "tags" | "avatarUrl">>) =>
//     request<{ success: true; group: Group }>(`/groups/${groupId}`, {
//       method: "PATCH",
//       body: JSON.stringify(data),
//     }),

//   delete: (groupId: string) =>
//     request<{ success: true; message: string }>(`/groups/${groupId}`, { method: "DELETE" }),

//   join: (groupId: string) =>
//     request<{ success: true; status: "joined" | "pending"; message: string }>(`/groups/${groupId}/join`, { method: "POST" }),

//   leave: (groupId: string) =>
//     request<{ success: true; message: string }>(`/groups/${groupId}/join`, { method: "DELETE" }),
// };

// // ─── Communities ──────────────────────────────────────────────────────────────

// export const CommunityAPI = {
//   list: (params?: { lastDocId?: string; lastDocMemberCount?: number; limit?: number }) => {
//     const q = new URLSearchParams();
//     if (params?.limit) q.set("limit", String(params.limit));
//     if (params?.lastDocId) q.set("lastDocId", params.lastDocId);
//     if (params?.lastDocMemberCount) q.set("lastDocMemberCount", String(params.lastDocMemberCount));
//     return request<{ success: true; communities: Community[]; pagination: Pagination }>(`/communities?${q}`);
//   },

//   create: (data: { name: string; description?: string; avatarUrl?: string }) =>
//     request<{ success: true; id: string; community: Community }>("/communities", {
//       method: "POST",
//       body: JSON.stringify(data),
//     }),
// };







// lib/chatApi.ts  (FRONTEND project)
// Added: resolveDMName helper so DM chats always show the other person's name

const BASE = "/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? `Request failed: ${res.status}`);
  }
  return json as T;
}

export type ChatType     = "dm" | "group";
export type MessageType  = "text" | "image" | "video" | "audio" | "file";
export type GroupPrivacy = "public" | "closed" | "private";
export type GroupRole    = "owner" | "admin" | "member";

export interface Chat {
  id: string;
  type: ChatType;
  name: string;
  avatarUrl?: string;
  participantIds: string[];
  lastMessageContent: string;
  lastMessageAt: number;
  unreadCount: number;
  isOnline: boolean;
  isVerified: boolean;
  isPinned: boolean;
  isMuted: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  content: string;
  mediaUrl?: string;
  replyToId?: string;
  isRead: boolean;
  deletedAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
  privacy: GroupPrivacy;
  memberCount: number;
  isTrending: boolean;
  category?: string;
  lastActivityAt: number;
  isVerified: boolean;
  tags: string[];
  chatId?: string;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface Community {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  memberCount: number;
  groupCount: number;
  isVerified: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Pagination {
  limit: number;
  hasMore: boolean;
  nextCursor: { lastDocId: string; [key: string]: unknown } | null;
}

// ─── Resolve DM display name ───────────────────────────────────────────────────
// The backend stores name: "" for DMs (name comes from the other user's profile).
// This helper resolves it client-side so the chat list always shows a real name.
export function resolveChatName(chat: Chat, currentUserId: string): string {
  if (chat.type === "group") return chat.name || "Unnamed Group";
  if (chat.name && chat.name.trim()) return chat.name;

  // For DMs: find the other participant's ID and use it as fallback name.
  // In production your /api/users endpoint would resolve this to a display name.
  const otherId = chat.participantIds.find(id => id !== currentUserId);
  return otherId ?? "Unknown User";
}

// ─── Chats ────────────────────────────────────────────────────────────────────
export const ChatAPI = {
  list: (params?: { type?: ChatType; lastDocId?: string; lastDocUpdatedAt?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.type) q.set("type", params.type);
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.lastDocId) q.set("lastDocId", params.lastDocId);
    if (params?.lastDocUpdatedAt) q.set("lastDocUpdatedAt", String(params.lastDocUpdatedAt));
    return request<{ success: true; chats: Chat[]; pagination: Pagination }>(`/chats?${q}`);
  },

  get: (chatId: string) =>
    request<{ success: true; chat: Chat }>(`/chats/${chatId}`),

  createDM: (participantId: string) =>
    request<{ success: true; id: string; chat: Chat }>("/chats", {
      method: "POST",
      body: JSON.stringify({ type: "dm", participantId }),
    }),

  createGroup: (name: string, participantIds?: string[]) =>
    request<{ success: true; id: string; chat: Chat }>("/chats", {
      method: "POST",
      body: JSON.stringify({ type: "group", name, participantIds }),
    }),

  update: (chatId: string, data: Partial<Pick<Chat, "name" | "isMuted" | "isPinned" | "avatarUrl">>) =>
    request<{ success: true; chat: Chat }>(`/chats/${chatId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (chatId: string) =>
    request<{ success: true; message: string }>(`/chats/${chatId}`, { method: "DELETE" }),

  getMessages: (chatId: string, params?: { lastDocId?: string; lastDocCreatedAt?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.lastDocId) q.set("lastDocId", params.lastDocId);
    if (params?.lastDocCreatedAt) q.set("lastDocCreatedAt", String(params.lastDocCreatedAt));
    return request<{ success: true; messages: Message[]; pagination: Pagination }>(`/chats/${chatId}/messages?${q}`);
  },

  sendMessage: (chatId: string, content: string, opts?: { type?: MessageType; replyToId?: string; mediaUrl?: string }) =>
    request<{ success: true; id: string; message: Message }>(`/chats/${chatId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content, ...opts }),
    }),
};

// ─── Messages ─────────────────────────────────────────────────────────────────
export const MessageAPI = {
  edit: (messageId: string, content: string) =>
    request<{ success: true; message: Message }>(`/messages/${messageId}`, {
      method: "PATCH",
      body: JSON.stringify({ content }),
    }),

  delete: (messageId: string) =>
    request<{ success: true; message: string }>(`/messages/${messageId}`, { method: "DELETE" }),
};

// ─── Groups ───────────────────────────────────────────────────────────────────
export const GroupAPI = {
  list: (params?: { privacy?: GroupPrivacy; trending?: boolean; category?: string; joined?: boolean; lastDocId?: string; lastDocAt?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.privacy) q.set("privacy", params.privacy);
    if (params?.trending) q.set("trending", "true");
    if (params?.category) q.set("category", params.category);
    if (params?.joined) q.set("joined", "true");
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.lastDocId) q.set("lastDocId", params.lastDocId);
    if (params?.lastDocAt) q.set("lastDocAt", String(params.lastDocAt));
    return request<{ success: true; groups: Group[]; pagination: Pagination }>(`/groups?${q}`);
  },

  get: (groupId: string) =>
    request<{ success: true; group: Group }>(`/groups/${groupId}`),

  create: (data: { name: string; description?: string; privacy?: GroupPrivacy; category?: string; tags?: string[] }) =>
    request<{ success: true; id: string; group: Group }>("/groups", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (groupId: string, data: Partial<Pick<Group, "name" | "description" | "privacy" | "category" | "tags" | "avatarUrl">>) =>
    request<{ success: true; group: Group }>(`/groups/${groupId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (groupId: string) =>
    request<{ success: true; message: string }>(`/groups/${groupId}`, { method: "DELETE" }),

  join: (groupId: string) =>
    request<{ success: true; status: "joined" | "pending"; message: string }>(`/groups/${groupId}/join`, { method: "POST" }),

  leave: (groupId: string) =>
    request<{ success: true; message: string }>(`/groups/${groupId}/join`, { method: "DELETE" }),
};

// ─── Communities ──────────────────────────────────────────────────────────────
export const CommunityAPI = {
  list: (params?: { lastDocId?: string; lastDocMemberCount?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.lastDocId) q.set("lastDocId", params.lastDocId);
    if (params?.lastDocMemberCount) q.set("lastDocMemberCount", String(params.lastDocMemberCount));
    return request<{ success: true; communities: Community[]; pagination: Pagination }>(`/communities?${q}`);
  },

  create: (data: { name: string; description?: string; avatarUrl?: string }) =>
    request<{ success: true; id: string; community: Community }>("/communities", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};