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
}

interface ActivityContextType {
  activities:         ActivityItem[];
  loading:            boolean;
  profileStats:       ProfileStats;
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
    };
  }

  return {
    posts: activities.filter((a) => POST_TYPES.includes(a.type)).length,
    predictions: activities.filter((a) => a.type === "ROAR_PREDICTION").length,
    hotTakes: activities.filter((a) => a.type === "ROAR_HOT_TAKE").length,
    flashQuiz: activities.filter((a) => a.type === "FLASH_QUIZ").length,
  };
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

  // ── Calculate memoized profile stats ────────────────────────────────────────
  const profileStats = useMemo(
    () => calculateProfileStats(activities),
    [activities]
  );

  // ── Fetch from API ──────────────────────────────────────────────────────────
  const fetchActivities = useCallback(async () => {
    const userId = user?.userId;
    if (!userId) {
      setActivities([]);
      return;
    }

    // Serve from cache if still fresh
    if (
      cache &&
      cache.userId === userId &&
      Date.now() - cache.ts < CACHE_TTL
    ) {
      setActivities(cache.data);
      return;
    }

    // Guard against concurrent fetches
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);

    try {
      const res = await axios.get(
        `/api/user-activity?userId=${encodeURIComponent(userId)}&limit=${ACTIVITY_FETCH_LIMIT}`
      );

      if (res.data.success) {
        // Merge server data with any optimistic local additions, sort newest-first
        const data = mergeActivities(
          res.data.activities,
          localActivitiesRef.current
        );
        cache = { ts: Date.now(), userId, data };
        setActivities(data);
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
    cache = null;
    await fetchActivities();
  }, [fetchActivities]);

  /**
   * Optimistically add an activity before the server round-trip completes.
   * Call this immediately after awarding points so FanZone updates instantly.
   */
  const addLocalActivity = useCallback(
    (activity: ActivityItem) => {
      localActivitiesRef.current = mergeActivities(
        [activity],
        localActivitiesRef.current
      );
      setActivities((prev) => {
        const data = mergeActivities(prev, [activity]);
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
    if (authReady) fetchActivities();
  }, [authReady, fetchActivities]);

  useEffect(() => {
    return onSxpActivityRefresh(() => {
      void refreshActivities();
    });
  }, [refreshActivities]);

  return (
    <ActivityContext.Provider
      value={{ activities, loading, profileStats, refreshActivities, addLocalActivity }}
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
