"use client";
// context/ActivityContext.tsx
//
// Fetches the user's activity log from /api/user-activity and exposes it to
// the rest of the app.  Every activity type written by awardUserPoints() flows
// through unchanged — no filtering is applied here.

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { onSxpActivityRefresh } from "@/lib/sxpEvents";

// ─── Public types ─────────────────────────────────────────────────────────────
export interface ActivityItem {
  id:        string;
  type:      string;   // raw enum, e.g. "ROAR_POST", "TRIVIA_CORRECT", "AUDIO_DROP"
  points:    number;
  label:     string;   // human-readable, e.g. "Shared a ROAR Post"
  metadata:  Record<string, unknown>;
  createdAt: number;   // Unix ms
}

export interface ProfileStats {
  posts:       number;
  predictions: number;
  hotTakes:    number;
  flashQuiz:   number;
  debates:     number;
  totalActivity: number;
}

export interface BadgeItem {
  id:         string;
  name:       string;
  unlocked:   boolean;
  unlockedAt?: number;
  progress?:  number;
}

interface ActivityContextType {
  activities:         ActivityItem[];
  loading:            boolean;
  profileStats:       ProfileStats;
  badges:             BadgeItem[];
  refreshActivities:  () => Promise<void>;
  addLocalActivity:   (activity: ActivityItem) => void;
}

// ─── Module-level cache ───────────────────────────────────────────────────────
// Survives re-renders; resets on page reload.
// Keyed by userId so switching accounts always gets fresh data.
let cache: { ts: number; userId: string; data: ActivityItem[] } | null = null;
const CACHE_TTL = 30_000; // 30 seconds
const ACTIVITY_FETCH_LIMIT = 200;

// ─── Stats Calculation Constants ───────────────────────────────────────────────
const POST_TYPES = [
  "ROAR_HOT_TAKE",
  "ROAR_RAW_REACTIONS",
  "ROAR_MEMORY",
  "ROAR_DEBATE",
];

// ─── Post Content Resolver (Content Resolution) ─────────────────────────────────
export interface PostContentData {
  id?: string;
  type?: string;
  statement?: string;
  title?: string;
  caption?: string;
  description?: string;
  agreeVotes?: number;
  disagreeVotes?: number;
  totalVotes?: number;
  score?: number;
  status?: "pending" | "correct" | "incorrect";
  image?: string;
  reaction?: string;
  [key: string]: unknown;
}

// Cache to avoid fetching the same post multiple times
const postCache = new Map<string, PostContentData>();

/**
 * Fetch post data from ROAR API using postId
 */
export async function resolvePostContent(
  postId: string,
  type: string
): Promise<PostContentData> {
  // Check cache first
  if (postCache.has(postId)) {
    return postCache.get(postId)!;
  }

  try {
    // Try to fetch from ROAR post API
    const response = await axios.get(`/api/roar/posts/${postId}`, {
      timeout: 5000, // 5 second timeout
      withCredentials: true,
    });

    const data = response.data?.data || response.data;

    // Cache the result
    postCache.set(postId, data);

    return data as PostContentData;
  } catch (error) {
    console.warn(`Failed to resolve post ${postId}:`, error);
    // Return empty object on error - activity will still display
    return {};
  }
}

/**
 * Batch resolve multiple post contents
 */
export async function resolveBatchPostContents(
  postIds: string[]
): Promise<Map<string, PostContentData>> {
  const results = new Map<string, PostContentData>();

  // Filter out already cached items
  const uncached = postIds.filter((id) => !postCache.has(id));

  // If all items are cached, return immediately
  if (uncached.length === 0) {
    postIds.forEach((id) => {
      const cached = postCache.get(id);
      if (cached) results.set(id, cached);
    });
    return results;
  }

  // Fetch uncached items in parallel (max 5 at a time to avoid overwhelming server)
  const batchSize = 5;
  for (let i = 0; i < uncached.length; i += batchSize) {
    const batch = uncached.slice(i, i + batchSize);
    const promises = batch.map((id) =>
      resolvePostContent(id, "").then((data) => ({ id, data }))
    );

    const batchResults = await Promise.allSettled(promises);

    batchResults.forEach((result) => {
      if (result.status === "fulfilled") {
        const { id, data } = result.value;
        results.set(id, data);
      }
    });
  }

  // Add cached items to results
  postIds.forEach((id) => {
    if (!results.has(id)) {
      const cached = postCache.get(id);
      if (cached) results.set(id, cached);
    }
  });

  return results;
}

/**
 * Clear the post cache (useful for force refresh)
 */
export function clearPostCache() {
  postCache.clear();
}

/**
 * Preload posts for better performance
 */
export async function preloadPosts(postIds: string[]) {
  await resolveBatchPostContents(postIds);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sameActivity = (a: ActivityItem, b: ActivityItem): boolean => {
  const aTx = a.metadata?.transactionId;
  const bTx = b.metadata?.transactionId;
  return a.id === b.id || (typeof aTx === "string" && aTx === bTx);
};

const mergeActivities = (
  remote: ActivityItem[],
  local: ActivityItem[]
): ActivityItem[] => {
  const merged = [...remote];
  local.forEach((activity) => {
    if (!merged.some((item) => sameActivity(item, activity))) {
      merged.unshift(activity);
    }
  });
  return merged.sort((a, b) => b.createdAt - a.createdAt);
};

// ── Calculate profile stats from activities array ──────────────────────────────
/**
 * Calculate profile stats from activities array.
 * Returns zero counts if activities is empty or undefined.
 */
const calculateProfileStats = (activities: ActivityItem[]): ProfileStats => {
  if (!activities || activities.length === 0) {
    return {
      posts: 0,
      predictions: 0,
      hotTakes: 0,
      flashQuiz: 0,
      debates: 0,
      totalActivity: 0,
    };
  }

  const debates = activities.filter((a) => a.type === "ROAR_DEBATE").length;
  const predictions = activities.filter((a) => a.type === "ROAR_PREDICTION").length;
  const hotTakes = activities.filter((a) => a.type === "ROAR_HOT_TAKE").length;
  const flashQuiz = activities.filter((a) => a.type === "FLASH_QUIZ").length;
  // Total = all meaningful activity types (excluding internal types)
  const totalActivity = debates + predictions + hotTakes + flashQuiz + activities.filter((a) => a.type === "ROAR_MEMORY" || a.type === "ROAR_RAW_REACTIONS").length;

  return {
    posts: activities.filter((a) => POST_TYPES.includes(a.type)).length,
    predictions,
    hotTakes,
    flashQuiz,
    debates,
    totalActivity,
  };
};

// ── Calculate badges from room activities ──────────────────────────────────────
/**
 * Calculate badges based on user's aggregated room activities.
 * Awards badges for milestones reached across all rooms.
 */
const calculateBadgesFromActivities = (activities: ActivityItem[]): BadgeItem[] => {
  const postCount = activities.filter((a) =>
    ["ROAR_POST", "ROAR_HOT_TAKE", "ROAR_MEMORY"].includes(a.type)
  ).length;

  const predictionCount = activities.filter((a) => a.type === "ROAR_PREDICTION").length;
  const debateCount = activities.filter((a) => a.type === "ROAR_DEBATE").length;
  const totalActivities = activities.length;

  const firstActivityTime = activities.length > 0 ? activities[activities.length - 1].createdAt : undefined;

  return [
    {
      id: "FIRST_POST",
      name: "First Post",
      unlocked: postCount >= 1,
      unlockedAt: postCount >= 1 ? firstActivityTime : undefined,
      progress: postCount,
    },
    {
      id: "POST_10",
      name: "10 Posts",
      unlocked: postCount >= 10,
      progress: Math.min(postCount, 10),
    },
    {
      id: "PREDICTION_EXPERT",
      name: "Prediction Expert",
      unlocked: predictionCount >= 5,
      progress: Math.min(predictionCount, 5),
    },
    {
      id: "DEBATE_STARTER",
      name: "Debate Starter",
      unlocked: debateCount >= 3,
      progress: Math.min(debateCount, 3),
    },
    {
      id: "ACTIVE_CONTRIBUTOR",
      name: "Active Contributor",
      unlocked: totalActivities >= 20,
      progress: Math.min(totalActivities, 20),
    },
    {
      id: "TOP_FAN",
      name: "Top Fan",
      unlocked: totalActivities >= 50,
      progress: Math.min(totalActivities, 50),
    },
  ];
};

// ─── Context ──────────────────────────────────────────────────────────────────
const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, authReady } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading]       = useState(false);

  const inFlight          = useRef(false);
  const localActivitiesRef = useRef<ActivityItem[]>([]);

  // ── Calculate memoized profile stats and badges ─────────────────────────────
  const profileStats = useMemo(
    () => calculateProfileStats(activities),
    [activities]
  );

  const badges = useMemo(
    () => calculateBadgesFromActivities(activities),
    [activities]
  );

  // ── Fetch from API ──────────────────────────────────────────────────────────
  const fetchActivities = useCallback(async () => {
    const userId = user?.userId;
    console.log("[ActivityContext] fetchActivities called, userId:", userId);
    if (!userId) {
      console.log("[ActivityContext] No userId, setting empty activities");
      setActivities([]);
      return;
    }

    // Serve from cache if still fresh
    if (
      cache &&
      cache.userId === userId &&
      Date.now() - cache.ts < CACHE_TTL
    ) {
      console.log("[ActivityContext] Serving from cache, activities:", cache.data);
      setActivities(cache.data);
      return;
    }

    // Guard against concurrent fetches
    if (inFlight.current) {
      console.log("[ActivityContext] Fetch already in flight, returning");
      return;
    }
    inFlight.current = true;
    setLoading(true);

    try {
      const url = `/api/user-activity?userId=${encodeURIComponent(userId)}&limit=${ACTIVITY_FETCH_LIMIT}`;
      console.log("[ActivityContext] Calling API:", url);
      const res = await axios.get(url, { withCredentials: true });
      console.log("[ActivityContext] API response:", res.data);

      if (res.data.success) {
        console.log("[ActivityContext] Success! Activities from API:", res.data.activities);
        // Merge server data with any optimistic local additions, sort newest-first
        const data = mergeActivities(
          res.data.activities,
          localActivitiesRef.current
        );
        console.log("[ActivityContext] Merged activities:", data);
        cache = { ts: Date.now(), userId, data };
        setActivities(data);
      } else {
        console.error("[ActivityContext] API returned success: false", res.data);
      }
    } catch (e) {
      console.error("[ActivityContext] fetch error:", e);
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [user?.userId]);

  // ── Public API ──────────────────────────────────────────────────────────────

  /** Force a fresh fetch, bypassing the cache. */
  const refreshActivities = useCallback(async () => {
    console.log("[ActivityContext] refreshActivities called - clearing cache");
    cache = null;
    await fetchActivities();
  }, [fetchActivities]);

  /**
   * Optimistically add an activity before the server round-trip completes.
   * Call this immediately after awarding points so FanZone updates instantly.
   */
  const addLocalActivity = useCallback(
    (activity: ActivityItem) => {
      console.log("[ActivityContext] addLocalActivity called with:", activity);
      localActivitiesRef.current = mergeActivities(
        [activity],
        localActivitiesRef.current
      );
      setActivities((prev) => {
        const data = mergeActivities(prev, [activity]);
        console.log("[ActivityContext] Activities after addLocalActivity:", data);
        if (user?.userId) {
          cache = { ts: Date.now(), userId: user.userId, data };
        }
        return data;
      });
    },
    [user?.userId]
  );

  // Trigger fetch once auth is confirmed ready
  useEffect(() => {
    console.log("[ActivityContext] Auth check - authReady:", authReady, "userId:", user?.userId);
    if (authReady) {
      console.log("[ActivityContext] Auth ready, fetching activities");
      fetchActivities();
    }
  }, [authReady, fetchActivities, user?.userId]);

  useEffect(() => {
    console.log("[ActivityContext] Registering SXP activity refresh listener");
    return onSxpActivityRefresh(() => {
      console.log("[ActivityContext] SXP refresh event received, calling refreshActivities");
      void refreshActivities();
    });
  }, [refreshActivities]);

  return (
    <ActivityContext.Provider
      value={{ activities, loading, profileStats, badges, refreshActivities, addLocalActivity }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity must be used within ActivityProvider");
  return ctx;
  
};
