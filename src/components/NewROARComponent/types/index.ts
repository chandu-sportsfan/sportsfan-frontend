export interface Fan {
  username: string;
  badge: string;
  team?: string;
}

export interface FeedPost {
  id: string;
  type: "hot_take" | "prediction" | "debate" | "memory" | "match_room";
  sport: string;
  fan: Fan;
  text?: string;
  agreePercent?: number;
  fanCount?: number;
  replies?: number;
  following?: boolean;
  isLive?: boolean;
  match?: string;
  samePredictionCount?: number;
  counterCount?: number;
  isDbPost?: boolean;
  userVote?: "agree" | "disagree" | null;
  sideA?: string;
  sideB?: string;
  memCtx?: string;
}

export interface RoomPost {
  id: string;
  fan: Fan;
  text: string;
  fireCount: number;
  nochanceCount: number;
  timeAgo: string;
  type: "chat" | "prediction" | "hottake";
  mediaUrls?: string[];
}

export interface Room {
  roomId: string;
  name: string;
  description?: string;
  sport?: string;
  fanCount?: number;
  isActive?: boolean;
  scheduledStartTime?: number;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  time: string;
  read: boolean;
  fan: Fan | null;
  cta: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  badge: string;
  accuracy: number;
  predictions: number;
  team: string;
  reputationScore: number;
}

export interface BadgeEntry {
  id?: string;
  badgeId?: string;
  unlocked: boolean;
  progress: number;
  earnedDate?: string;
}

export interface UserPrediction {
  id?: string;
  postId?: string;
  text: string;
  matchId?: string;
  status: "CORRECT" | "WRONG" | "PENDING" | "settled_correct" | "settled_wrong" | "active";
  createdAt?: string | number;
}

export interface UserHotTake {
  id?: string;
  postId?: string;
  text: string;
  agreeCount?: number;
  disagreeCount?: number;
  agreePercent?: number;
  controversial?: boolean;
  top?: boolean;
}

export interface CurrentUser {
  username: string;
  handle: string;
  badge: string;
  fanSince: string;
  yearsFandom: number;
  accuracy: number;
  predictionCount: number;
  hotTakeCount: number;
  reputationScore: number;
  teams: string[];
  rank: number;
}

export interface ComposePayload {
  type: string;
  text: string;
  sideA?: string;
  sideB?: string;
  match?: string;
  confidence?: number;
  audience?: string;
  memCtx?: string;
  sport?: string;
  mediaFiles?: File[];
}
