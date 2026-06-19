// const BASE = "/api/roar";

// async function apiFetch<T>(
//   path: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const res = await fetch(`${BASE}${path}`, {
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",          // sends the httpOnly cookie
//     ...options,
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.error ?? "Request failed");
//   return data as T;
// }

// export const roarApi = {
//   // Onboarding
//   completeOnboarding: (body: object) =>
//     apiFetch("/onboarding", { method: "POST", body: JSON.stringify(body) }),

//   // Feed
//   getFeed: (filter = "For You", lastDocId?: string) =>
//     apiFetch<{ posts: any[] }>(
//       `/feed?filter=${encodeURIComponent(filter)}${lastDocId ? `&lastDocId=${lastDocId}` : ""}`
//     ),

//   // Posts
//   createPost: (body: object) =>
//     apiFetch<{ postId: string }>("/posts", { method: "POST", body: JSON.stringify(body) }),

//   castVote: (postId: string, vote: "agree" | "disagree" | null) =>
//     apiFetch(`/posts/${postId}/vote`, { method: "POST", body: JSON.stringify({ vote }) }),

//   // Room
//   getRoomMessages: (roomId: string, lastDocId?: string) =>
//     apiFetch<{ messages: any[] }>(
//       `/rooms/${roomId}/messages${lastDocId ? `?lastDocId=${lastDocId}` : ""}`
//     ),

//   sendRoomMessage: (roomId: string, body: object) =>
//     apiFetch(`/rooms/${roomId}/messages`, { method: "POST", body: JSON.stringify(body) }),

//   reactToMessage: (roomId: string, msgId: string, reaction: "fire" | "noChance") =>
//     apiFetch(`/rooms/${roomId}/messages/${msgId}/react`, {
//       method: "POST",
//       body: JSON.stringify({ reaction }),
//     }),

//   // Notifications
//   getNotifications: (unreadOnly = false) =>
//     apiFetch<{ notifications: any[]; unreadCount: number }>(
//       `/notifications${unreadOnly ? "?unreadOnly=true" : ""}`
//     ),

//   markNotificationRead: (notifId: string) =>
//     apiFetch("/notifications", { method: "PATCH", body: JSON.stringify({ notifId }) }),

//   markAllNotificationsRead: () =>
//     apiFetch("/notifications", { method: "PATCH", body: JSON.stringify({ markAll: true }) }),

//   // Leaderboard
//   getLeaderboard: (period = "all_time") =>
//     apiFetch<{ leaderboard: any; currentUserEntry: any }>(`/leaderboard?period=${period}`),

//   // Profile
//   getProfile: () => apiFetch<{ user: any; badges: any[]; predictions: any[]; hotTakes: any[]; rival: any }>("/profile"),

//   updateProfile: (body: object) =>
//     apiFetch("/profile", { method: "PATCH", body: JSON.stringify(body) }),
// };





// lib/roarApi.ts

// const BASE = "/api/roar";

// async function apiFetch<T>(
//   path: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const res = await fetch(`${BASE}${path}`, {
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     ...options,
//   });
//   const data = await res.json();
//   if (!res.ok) throw new Error(data.error ?? "Request failed");
//   return data as T;
// }

// export const roarApi = {
//   // Onboarding
//   completeOnboarding: (body: object) =>
//     apiFetch("/onboarding", { method: "POST", body: JSON.stringify(body) }),

//   // Feed
//   getFeed: (filter = "For You", lastCreatedAt?: number) =>
//     apiFetch<{ posts: any[] }>(
//       `/feed?filter=${encodeURIComponent(filter)}${lastCreatedAt ? `&lastCreatedAt=${lastCreatedAt}` : ""}`
//     ),

//   // Posts
//   createPost: (body: object) =>
//     apiFetch<{ postId: string }>("/posts", { method: "POST", body: JSON.stringify(body) }),

//   castVote: (postId: string, vote: "agree" | "disagree" | null) =>
//     apiFetch(`/posts/${postId}/vote`, { method: "POST", body: JSON.stringify({ vote }) }),

//   // FIX: like toggle — was completely missing, heart was incorrectly routed
//   // through the fire/noChance react endpoint which only ever increments.
//   // POST /api/roar/posts/:id/like → { success, liked: bool, likeCount: number }
//   likePost: (postId: string) =>
//     apiFetch<{ success: boolean; liked: boolean; likeCount: number }>(
//       `/posts/${postId}/like`,
//       { method: "POST" }
//     ),

//   // Room
//   getRoomMessages: (roomId: string, lastCreatedAt?: number) =>
//     apiFetch<{ messages: any[] }>(
//       `/rooms/${roomId}/messages${lastCreatedAt ? `?lastCreatedAt=${lastCreatedAt}` : ""}`
//     ),

//   sendRoomMessage: (roomId: string, body: object) =>
//     apiFetch(`/rooms/${roomId}/messages`, { method: "POST", body: JSON.stringify(body) }),

//   // FIX: added "heart" to the reaction union — was missing so heart calls
//   // were hitting a different (wrong) endpoint path before.
//   reactToMessage: (roomId: string, msgId: string, reaction: "fire" | "noChance" | "heart") =>
//     apiFetch(`/rooms/${roomId}/messages/${msgId}/react`, {
//       method: "POST",
//       body: JSON.stringify({ reaction }),
//     }),

//   // Notifications
//   getNotifications: (unreadOnly = false) =>
//     apiFetch<{ notifications: any[]; unreadCount: number }>(
//       `/notifications${unreadOnly ? "?unreadOnly=true" : ""}`
//     ),

//   markNotificationRead: (notifId: string) =>
//     apiFetch("/notifications", { method: "PATCH", body: JSON.stringify({ notifId }) }),

//   markAllNotificationsRead: () =>
//     apiFetch("/notifications", { method: "PATCH", body: JSON.stringify({ markAll: true }) }),

//   // Leaderboard
//   getLeaderboard: (period = "all_time") =>
//     apiFetch<{ leaderboard: any; currentUserEntry: any }>(`/leaderboard?period=${period}`),

//   // Profile
//   getProfile: () =>
//     apiFetch<{ user: any; badges: any[]; predictions: any[]; hotTakes: any[]; rival: any }>("/profile"),

//   updateProfile: (body: object) =>
//     apiFetch("/profile", { method: "PATCH", body: JSON.stringify(body) }),
// };




// lib/roarApi.ts

import type { Reaction } from "../src/components/NewROARComponent/components/ReactionPicker";

const BASE = "/api/roar";

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data as T;
}

export const roarApi = {
  // ── Onboarding ──────────────────────────────────────────────────────────────
  completeOnboarding: (body: object) =>
    apiFetch("/onboarding", { method: "POST", body: JSON.stringify(body) }),

  // ── Feed ─────────────────────────────────────────────────────────────────────
  getFeed: (filter = "For You", lastCreatedAt?: number) =>
    apiFetch<{ posts: any[] }>(
      `/feed?filter=${encodeURIComponent(filter)}${lastCreatedAt ? `&lastCreatedAt=${lastCreatedAt}` : ""}`
    ),

  // ── Posts ─────────────────────────────────────────────────────────────────────
  createPost: (body: object) =>
    apiFetch<{ postId: string }>("/posts", { method: "POST", body: JSON.stringify(body) }),

  castVote: (postId: string, vote: "agree" | "disagree" | null) =>
    apiFetch(`/posts/${postId}/vote`, { method: "POST", body: JSON.stringify({ vote }) }),

  // ── Reactions (replaces the old bare likePost) ────────────────────────────────
  //
  // POST   /api/roar/posts/:id/likesection  { reaction }
  //   → adds or switches reaction; returns { success, action, reaction, likeCount }
  //
  // DELETE /api/roar/posts/:id/likesection
  //   → removes reaction; returns { success, action: "removed", reaction: null }
  //
  // The old likePost() is kept as a convenience wrapper that always sends "heart",
  // so any existing call-sites don't break.
  //
  reactPost: (
    postId: string,
    reaction: Reaction                              // "heart"|"fire"|"laugh"|"sad"|"thumb"
  ) =>
    apiFetch<{ success: boolean; action: string; reaction: Reaction; likeCount: number }>(
      `/posts/${postId}/likesection`,
      { method: "POST", body: JSON.stringify({ reaction }) }
    ),

  unreactPost: (postId: string) =>
    apiFetch<{ success: boolean; action: string; reaction: null }>(
      `/posts/${postId}/likesection`,
      { method: "DELETE" }
    ),

  // Backward-compat shim: callers that used likePost() get a ❤️ reaction.
  likePost: (postId: string) =>
    roarApi.reactPost(postId, "heart"),

  // ── Room ─────────────────────────────────────────────────────────────────────
  getRoomMessages: (roomId: string, lastCreatedAt?: number) =>
    apiFetch<{ messages: any[] }>(
      `/rooms/${roomId}/messages${lastCreatedAt ? `?lastCreatedAt=${lastCreatedAt}` : ""}`
    ),

  sendRoomMessage: (roomId: string, body: object) =>
    apiFetch(`/rooms/${roomId}/messages`, { method: "POST", body: JSON.stringify(body) }),

  reactToMessage: (roomId: string, msgId: string, reaction: "fire" | "noChance" | "heart") =>
    apiFetch(`/rooms/${roomId}/messages/${msgId}/react`, {
      method: "POST",
      body: JSON.stringify({ reaction }),
    }),

  // ── Notifications ─────────────────────────────────────────────────────────────
  getNotifications: (unreadOnly = false) =>
    apiFetch<{ notifications: any[]; unreadCount: number }>(
      `/notifications${unreadOnly ? "?unreadOnly=true" : ""}`
    ),

  markNotificationRead: (notifId: string) =>
    apiFetch("/notifications", { method: "PATCH", body: JSON.stringify({ notifId }) }),

  markAllNotificationsRead: () =>
    apiFetch("/notifications", { method: "PATCH", body: JSON.stringify({ markAll: true }) }),

  // ── Leaderboard ───────────────────────────────────────────────────────────────
  getLeaderboard: (period = "all_time") =>
    apiFetch<{ leaderboard: any; currentUserEntry: any }>(`/leaderboard?period=${period}`),

  // ── Profile ───────────────────────────────────────────────────────────────────
  getProfile: () =>
    apiFetch<{ user: any; badges: any[]; predictions: any[]; hotTakes: any[]; rival: any }>("/profile"),

  updateProfile: (body: object) =>
    apiFetch("/profile", { method: "PATCH", body: JSON.stringify(body) }),
};