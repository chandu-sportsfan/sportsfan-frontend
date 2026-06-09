const BASE = "/api/roar";

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",          // sends the httpOnly cookie
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data as T;
}

export const roarApi = {
  // Onboarding
  completeOnboarding: (body: object) =>
    apiFetch("/onboarding", { method: "POST", body: JSON.stringify(body) }),

  // Feed
  getFeed: (filter = "For You", lastDocId?: string) =>
    apiFetch<{ posts: any[] }>(
      `/feed?filter=${encodeURIComponent(filter)}${lastDocId ? `&lastDocId=${lastDocId}` : ""}`
    ),

  // Posts
  createPost: (body: object) =>
    apiFetch<{ postId: string }>("/posts", { method: "POST", body: JSON.stringify(body) }),

  castVote: (postId: string, vote: "agree" | "disagree" | null) =>
    apiFetch(`/posts/${postId}/vote`, { method: "POST", body: JSON.stringify({ vote }) }),

  // Room
  getRoomMessages: (roomId: string, lastDocId?: string) =>
    apiFetch<{ messages: any[] }>(
      `/rooms/${roomId}/messages${lastDocId ? `?lastDocId=${lastDocId}` : ""}`
    ),

  sendRoomMessage: (roomId: string, body: object) =>
    apiFetch(`/rooms/${roomId}/messages`, { method: "POST", body: JSON.stringify(body) }),

  reactToMessage: (roomId: string, msgId: string, reaction: "fire" | "noChance") =>
    apiFetch(`/rooms/${roomId}/messages/${msgId}/react`, {
      method: "POST",
      body: JSON.stringify({ reaction }),
    }),

  // Notifications
  getNotifications: (unreadOnly = false) =>
    apiFetch<{ notifications: any[]; unreadCount: number }>(
      `/notifications${unreadOnly ? "?unreadOnly=true" : ""}`
    ),

  markNotificationRead: (notifId: string) =>
    apiFetch("/notifications", { method: "PATCH", body: JSON.stringify({ notifId }) }),

  markAllNotificationsRead: () =>
    apiFetch("/notifications", { method: "PATCH", body: JSON.stringify({ markAll: true }) }),

  // Leaderboard
  getLeaderboard: (period = "all_time") =>
    apiFetch<{ leaderboard: any; currentUserEntry: any }>(`/leaderboard?period=${period}`),

  // Profile
  getProfile: () => apiFetch<{ user: any; badges: any[]; predictions: any[]; hotTakes: any[]; rival: any }>("/profile"),

  updateProfile: (body: object) =>
    apiFetch("/profile", { method: "PATCH", body: JSON.stringify(body) }),
};