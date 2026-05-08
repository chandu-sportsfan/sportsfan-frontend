"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export interface LeaderboardUser {
  userId: string;
  userName: string;
  userEmail: string;
  totalPoints: number;
  rank: number;
}

interface LeaderboardContextType {
  leaderboard: LeaderboardUser[];
  currentUserRank: number | null;
  currentUserPoints: number | null;
  loading: boolean;
  refreshLeaderboard: () => Promise<void>;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [currentUserPoints, setCurrentUserPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchGlobalLeaderboard = useCallback(async () => {
    const userId = user?.userId;
    if (!userId) {
      setLeaderboard([]);
      setCurrentUserRank(null);
      setCurrentUserPoints(null);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `/api/user-points?userId=${encodeURIComponent(userId)}&limit=100`
      );

      if (res.data.success) {
        setLeaderboard(res.data.leaderboard || []);
        if (res.data.currentUser) {
          setCurrentUserRank(res.data.currentUser.rank);
          setCurrentUserPoints(res.data.currentUser.points);
        }
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchGlobalLeaderboard();
  }, [fetchGlobalLeaderboard]);

  const refreshLeaderboard = async () => {
    await fetchGlobalLeaderboard();
  };

  return (
    <LeaderboardContext.Provider
      value={{
        leaderboard,
        currentUserRank,
        currentUserPoints,
        loading,
        refreshLeaderboard,
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error("useLeaderboard must be used within a LeaderboardProvider");
  }
  return context;
};
