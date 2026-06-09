"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export interface ActivityItem {
  id: string;
  type: string;
  points: number;
  label: string;
  metadata: Record<string, unknown>;
  createdAt: number;
}

interface ActivityContextType {
  activities: ActivityItem[];
  loading: boolean;
  refreshActivities: () => Promise<void>;
  addLocalActivity: (activity: ActivityItem) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

let cache: { ts: number; userId: string; data: ActivityItem[] } | null = null;
const CACHE_TTL = 30_000;

const sameActivity = (a: ActivityItem, b: ActivityItem) => {
  const aTx = a.metadata?.transactionId;
  const bTx = b.metadata?.transactionId;
  return a.id === b.id || (typeof aTx === "string" && aTx === bTx);
};

const mergeActivities = (remote: ActivityItem[], local: ActivityItem[]) => {
  const merged = [...remote];
  local.forEach((activity) => {
    if (!merged.some((item) => sameActivity(item, activity))) {
      merged.unshift(activity);
    }
  });
  return merged.sort((a, b) => b.createdAt - a.createdAt);
};

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, authReady } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);
  const localActivitiesRef = useRef<ActivityItem[]>([]);

  const fetchActivities = useCallback(async () => {
    const userId = user?.userId;
    if (!userId) { setActivities([]); return; }

    if (cache && cache.userId === userId && Date.now() - cache.ts < CACHE_TTL) {
      setActivities(cache.data);
      return;
    }
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);

    try {
      const res = await axios.get(`/api/user-activity?userId=${encodeURIComponent(userId)}&limit=50`);
      if (res.data.success) {
        const data = mergeActivities(res.data.activities, localActivitiesRef.current);
        cache = { ts: Date.now(), userId, data };
        setActivities(data);
      }
    } catch (e) {
      console.error("[ActivityContext]", e);
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [user?.userId]);

  const refreshActivities = useCallback(async () => {
    cache = null;
    await fetchActivities();
  }, [fetchActivities]);

  const addLocalActivity = useCallback((activity: ActivityItem) => {
    localActivitiesRef.current = mergeActivities([activity], localActivitiesRef.current);
    setActivities((prev) => {
      const data = mergeActivities(prev, [activity]);
      if (user?.userId) cache = { ts: Date.now(), userId: user.userId, data };
      return data;
    });
  }, [user?.userId]);

  useEffect(() => {
    if (authReady) fetchActivities();
  }, [authReady, fetchActivities]);

  return (
    <ActivityContext.Provider value={{ activities, loading, refreshActivities, addLocalActivity }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity must be used within ActivityProvider");
  return ctx;
};
