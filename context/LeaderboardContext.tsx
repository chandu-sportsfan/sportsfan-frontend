

// "use client";

// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext";

// export interface LeaderboardUser {
//   userId: string;
//   userName: string;
//   userEmail: string;
//   totalPoints: number;
//   rank: number;
// }

// interface LeaderboardContextType {
//   leaderboard: LeaderboardUser[];
//   currentUserRank: number | null;
//   currentUserPoints: number | null;
//   loading: boolean;
//   refreshLeaderboard: () => Promise<void>;
// }

// const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

// export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { user } = useAuth();
//   const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
//   const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
//   const [currentUserPoints, setCurrentUserPoints] = useState<number | null>(null);
//   const [loading, setLoading] = useState(false);

//   const fetchFullLeaderboard = useCallback(async () => {
//     try {
//       const res = await axios.get(`/api/user-points?limit=100`);
//       if (res.data.success && res.data.leaderboard) {
//         setLeaderboard(res.data.leaderboard);
//         return res.data.leaderboard;
//       }
//     } catch (error) {
//       console.error("Error fetching full leaderboard:", error);
//     }
//     return [];
//   }, []);

//   const fetchCurrentUser = useCallback(async (userId: string) => {
//     try {
//       const res = await axios.get(
//         `/api/user-points?userId=${encodeURIComponent(userId)}`
//       );
//       if (res.data.success && res.data.user) {
//         setCurrentUserRank(res.data.user.rank);
//         setCurrentUserPoints(res.data.user.totalPoints);
//         console.log("Current user points:", res.data.user.totalPoints);
//         return res.data.user;
//       }
//     } catch (error) {
//       console.error("Error fetching current user:", error);
//     }
//     return null;
//   }, []);

//   const fetchGlobalLeaderboard = useCallback(async () => {
//     const userId = user?.userId;
//     if (!userId) {
//       setLeaderboard([]);
//       setCurrentUserRank(null);
//       setCurrentUserPoints(null);
//       return;
//     }

//     setLoading(true);
//     try {
//       // Fetch both in parallel
//       const [leaderboardData, userData] = await Promise.all([
//         fetchFullLeaderboard(),
//         fetchCurrentUser(userId),
//       ]);
      
//       // If user data is not available from separate call, find in leaderboard
//       if (!userData && leaderboardData.length > 0) {
//         const currentUserInLeaderboard = leaderboardData.find(
//           (u: LeaderboardUser) => u.userId === userId
//         );
//         if (currentUserInLeaderboard) {
//           setCurrentUserRank(currentUserInLeaderboard.rank);
//           setCurrentUserPoints(currentUserInLeaderboard.totalPoints);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching leaderboard data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [user?.userId, fetchFullLeaderboard, fetchCurrentUser]);

//   useEffect(() => {
//     fetchGlobalLeaderboard();
//   }, [fetchGlobalLeaderboard]);

//   const refreshLeaderboard = async () => {
//     await fetchGlobalLeaderboard();
//   };

//   return (
//     <LeaderboardContext.Provider
//       value={{
//         leaderboard,
//         currentUserRank,
//         currentUserPoints,
//         loading,
//         refreshLeaderboard,
//       }}
//     >
//       {children}
//     </LeaderboardContext.Provider>
//   );
// };

// export const useLeaderboard = () => {
//   const context = useContext(LeaderboardContext);
//   if (context === undefined) {
//     throw new Error("useLeaderboard must be used within a LeaderboardProvider");
//   }
//   return context;
// };







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
  const { user, authReady } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [currentUserPoints, setCurrentUserPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchFullLeaderboard = useCallback(async () => {
    try {
      const res = await axios.get(`/api/user-points?limit=100`);
      if (res.data.success && res.data.leaderboard) {
        setLeaderboard(res.data.leaderboard);
        return res.data.leaderboard;
      }
    } catch (error) {
      console.error("Error fetching full leaderboard:", error);
    }
    return [];
  }, []);

  const fetchCurrentUser = useCallback(async (userId: string) => {
    try {
      const res = await axios.get(`/api/user-points?userId=${encodeURIComponent(userId)}`);

      if (res.data.success && res.data.user) {
        setCurrentUserRank(res.data.user.rank);
        setCurrentUserPoints(res.data.user.totalPoints);
        console.log("Current user points:", res.data.user.totalPoints);
        return res.data.user;
      }
    } catch (error) {
      console.error("Error fetching current user points:", error);
    }
    return null;
  }, []);

  const fetchGlobalLeaderboard = useCallback(async () => {
    const userId = user?.userId;
    console.log("userId for leaderboard fetch:", userId);
    if (!userId) {
      setLeaderboard([]);
      setCurrentUserRank(null);
      setCurrentUserPoints(null);
      return;
    }

    setLoading(true);
    try {
      const [leaderboardData, userData] = await Promise.all([
        fetchFullLeaderboard(),
        fetchCurrentUser(userId),
      ]);

      // Fallback: find user in leaderboard if individual fetch failed
      if (!userData && leaderboardData.length > 0) {
        const found = leaderboardData.find((u: LeaderboardUser) => u.userId === userId);
        if (found) {
          setCurrentUserRank(found.rank);
          setCurrentUserPoints(found.totalPoints);
        }
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.userId, fetchFullLeaderboard, fetchCurrentUser]);

  // Wait for auth to be ready before fetching — prevents firing with undefined userId
  useEffect(() => {
    if (!authReady) return;
    fetchGlobalLeaderboard();
  }, [authReady, fetchGlobalLeaderboard]);

  return (
    <LeaderboardContext.Provider
      value={{
        leaderboard,
        currentUserRank,
        currentUserPoints,
        loading,
        refreshLeaderboard: fetchGlobalLeaderboard,
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