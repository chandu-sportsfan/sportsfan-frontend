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
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

let cache: { ts: number; userId: string; data: ActivityItem[] } | null = null;
const CACHE_TTL = 30_000;

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, authReady } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inFlight = useRef(false);

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
        cache = { ts: Date.now(), userId, data: res.data.activities };
        setActivities(res.data.activities);
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

  useEffect(() => {
    if (authReady) fetchActivities();
  }, [authReady, fetchActivities]);

  return (
    <ActivityContext.Provider value={{ activities, loading, refreshActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity must be used within ActivityProvider");
  return ctx;
};