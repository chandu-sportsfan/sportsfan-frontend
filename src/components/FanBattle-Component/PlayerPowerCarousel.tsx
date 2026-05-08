// "use client";

// import React, { useEffect, useState, useCallback, useRef } from "react";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface PlayerCard {
//   id: string;
//   name: string;
//   points: number;
//   delta: number;
//   prevPoints: number;
//   rank: number;
//   prevRank: number;
//   isLive?: boolean;
//   trend: "up" | "down";
//   type?: "PLAYER" | "CLUB";
//   avatar?: string;
//   team?: string;
// }

// interface Battle {
//   id: string;
//   battleName: string;
//   battleType: "PLAYERS" | "CLUBS";
//   selectedPlayers: string[];
//   selectedClubs: string[];
//   invitedFriends: Array<{ email: string; name: string }>;
//   userId: string;
//   userName: string;
//   createdAt: number;
//   updatedAt: number;
// }

// interface LeaderboardEntry {
//   rank: number;
//   playerId: string;
//   playerName: string;
//   points: number;
//   votes: number;
// }

// // ─── FIX 1: Module-level profile cache ───────────────────────────────────────
// // Lives outside the component so it survives re-renders AND across poll cycles.
// // Profile data (name, team, avatar) never changes between polls — no need to
// // re-fetch it every 30 seconds. This is the single biggest quota reduction.
// interface CachedProfile {
//   id: string;
//   name: string;
//   type: "PLAYER" | "CLUB";
//   team: string;
//   avatar?: string;
// }
// const profileCache = new Map<string, CachedProfile>();

// // ─── Icons ────────────────────────────────────────────────────────────────────
// const LightningIcon = () => (
//   <svg width="11" height="11" viewBox="0 0 24 24" fill="#00e676">
//     <path d="M13 2L4.09 12.96H11L10 22L20.91 11.04H14L13 2Z" />
//   </svg>
// );

// const TrendArrow: React.FC<{ trend: "up" | "down" }> = ({ trend }) => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke={trend === "up" ? "#00e676" : "#ef5350"}
//     strokeWidth="3"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className="flex-shrink-0"
//   >
//     {trend === "up" ? (
//       <path d="M7 17L17 7M17 7H9M17 7V15" />
//     ) : (
//       <path d="M7 7L17 17M17 17H9M17 17V9" />
//     )}
//   </svg>
// );

// // ─── Circle with Rank Inside ──────────────────────────────────────────────────
// const RankCircle: React.FC<{
//   rank: number;
//   prevRank: number;
//   delta: number;
//   size?: number;
// }> = ({ rank, prevRank, delta, size = 52 }) => {
//   let borderColor = "#2a2a2a";
//   let textColor = "#9ca3af";
//   let glowColor = "transparent";

//   if (delta >= 15) {
//     borderColor = "#00e676";
//     textColor = "#00e676";
//     glowColor = "rgba(0, 230, 118, 0.35)";
//   } else if (rank > prevRank) {
//     borderColor = "#ef5350";
//     textColor = "#ef5350";
//     glowColor = "rgba(239, 83, 80, 0.35)";
//   }

//   return (
//     <div
//       className="flex-shrink-0 rounded-full flex items-center justify-center"
//       style={{
//         width: size,
//         height: size,
//         border: `3px solid ${borderColor}`,
//         background: "#121212",
//         boxShadow:
//           glowColor !== "transparent"
//             ? `0 0 10px 2px ${glowColor}, inset 0 0 6px ${glowColor}`
//             : "none",
//       }}
//     >
//       <span style={{ color: textColor, fontSize: 16, fontWeight: 700, lineHeight: 1 }}>
//         {rank}
//       </span>
//     </div>
//   );
// };

// // ─── Player/Club Card ─────────────────────────────────────────────────────────
// const PowerCard: React.FC<{ item: PlayerCard }> = ({ item }) => (
//   <div className="relative flex-shrink-0 w-[155px] rounded-2xl bg-[#1a1a1a] border border-[#252525] p-3.5 flex flex-col gap-2.5">
//     {item.isLive && (
//       <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#1f0a0a] border border-[#4a1a1a] rounded-full px-1.5 py-0.5 z-10">
//         <span className="w-1.5 h-1.5 rounded-full bg-[#e53935] animate-pulse" />
//         <span className="text-[#e53935] text-[8px] font-bold tracking-widest uppercase">
//           Live
//         </span>
//       </div>
//     )}

//     {item.type === "CLUB" && item.avatar && (
//       <div className="absolute top-2.5 right-2.5 z-10">
//         <img
//           src={item.avatar}
//           alt={item.name}
//           className="w-8 h-8 rounded-full object-cover border border-[#252525]"
//         />
//       </div>
//     )}

//     <div className="flex items-center gap-2.5">
//       <RankCircle rank={item.rank} prevRank={item.prevRank} delta={item.delta} size={52} />
//       <div className="flex flex-col min-w-0">
//         <span className="text-white text-[11px] font-bold leading-tight line-clamp-2">
//           {item.name}
//         </span>
//         <div className="flex items-center gap-1 mt-0.5">
//           <LightningIcon />
//           <span className="text-[#00e676] text-[13px] font-bold">
//             {item.points.toLocaleString()}
//           </span>
//         </div>
//         {item.team && (
//           <span className="text-[#555] text-[8px] mt-0.5 truncate">{item.team}</span>
//         )}
//       </div>
//     </div>

//     <div className="flex items-center gap-1">
//       <TrendArrow trend={item.trend} />
//       <span
//         className="text-[11px] font-semibold"
//         style={{ color: item.trend === "up" ? "#00e676" : "#ef5350" }}
//       >
//         {item.trend === "up" ? "+" : ""}
//         {Math.abs(item.delta)}
//       </span>
//       <span className="text-[#555] text-[10px]">from {item.prevPoints.toLocaleString()}</span>
//     </div>
//   </div>
// );

// // ─── Main Component ───────────────────────────────────────────────────────────
// interface PlayerPowerCarouselProps {
//   onShowAll: () => void;
// }

// const PlayerPowerCarousel: React.FC<PlayerPowerCarouselProps> = ({ onShowAll }) => {
//   const { user } = useAuth();
//   const [powerItems, setPowerItems] = useState<PlayerCard[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Track previous points/ranks for delta calculation across polls
//   const previousPointsRef = useRef<Map<string, number>>(new Map());
//   const previousRanksRef = useRef<Map<string, number>>(new Map());
//   const isFirstFetch = useRef(true);

//   // FIX 2: Track in-flight profile fetches to prevent duplicate concurrent requests.
//   // Without this, rapid re-renders can trigger the same profile fetch multiple times.
//   const inflightProfileFetches = useRef<Map<string, Promise<void>>>(new Map());

//   const checkPermission = useCallback(
//     (battle: Battle): boolean => {
//       // If no user, only show battles that might be public (or all if that's the requirement)
//       if (!user?.userId) return true; // Assuming we want to show all data to everyone
//       if (battle.userId === user.userId) return true;
//       return !!battle.invitedFriends?.some((f) => f.email === user.email);
//     },
//     [user]
//   );

//   const fetchLeaderboardForBattle = useCallback(
//     async (battleId: string): Promise<LeaderboardEntry[]> => {
//       try {
//         const res = await axios.get(
//           `/api/battle/battle-vote?battleId=${battleId}&userId=${user?.userId || ""}`
//         );
//         if (res.data.success) {
//           return res.data.leaderboard || [];
//         }
//         return [];
//       } catch (err) {
//         console.error("Error fetching leaderboard:", err);
//         return [];
//       }
//     },
//     [user]
//   );

//   // FIX 1 (core): Fetch a profile only if not already cached.
//   // Re-uses any in-flight request for the same ID to avoid duplicate network calls.
//   const fetchProfileIfNeeded = useCallback(
//     async (id: string, battleType: "PLAYERS" | "CLUBS"): Promise<void> => {
//       // Already cached — nothing to do
//       if (profileCache.has(id)) return;

//       // Already being fetched by a concurrent call — wait for that one
//       if (inflightProfileFetches.current.has(id)) {
//         await inflightProfileFetches.current.get(id);
//         return;
//       }

//       const fetchPromise = (async () => {
//         try {
//           if (battleType === "PLAYERS") {
//             const response = await axios.get(`/api/player-profile/${id}`);
//             const playerData = response.data.profile || response.data.data || response.data;
//             profileCache.set(id, {
//               id,
//               name: playerData.name || "Unknown Player",
//               type: "PLAYER",
//               team: playerData.team || "IPL",
//               avatar: undefined,
//             });
//           } else {
//             const response = await axios.get(`/api/club-profile/${id}`);
//             if (response.data.success) {
//               const club = response.data.profile;
//               profileCache.set(id, {
//                 id,
//                 name: club.name || "Unknown Club",
//                 type: "CLUB",
//                 team: club.team || "IPL",
//                 avatar: club.avatar,
//               });
//             }
//           }
//         } catch (err) {
//           console.error(`Error fetching profile ${id}:`, err);
//         } finally {
//           inflightProfileFetches.current.delete(id);
//         }
//       })();

//       inflightProfileFetches.current.set(id, fetchPromise);
//       await fetchPromise;
//     },
//     []
//   );

//   const fetchPowerData = useCallback(async () => {
//     try {
//       if (isFirstFetch.current) {
//         setLoading(true);
//       }

//       const battlesResponse = await axios.get(`/api/battle${user?.userId ? `?userId=${user.userId}` : ""}`);

//       if (!battlesResponse.data.success || !battlesResponse.data.battles) {
//         setPowerItems([]);
//         setLoading(false);
//         isFirstFetch.current = false;
//         return;
//       }

//       const accessibleBattles: Battle[] = battlesResponse.data.battles.filter(checkPermission);

//       if (accessibleBattles.length === 0) {
//         setPowerItems([]);
//         setLoading(false);
//         isFirstFetch.current = false;
//         return;
//       }

//       // Collect all unique IDs that need profile data
//       const idToBattleType = new Map<string, "PLAYERS" | "CLUBS">();
//       for (const battle of accessibleBattles) {
//         const ids =
//           battle.battleType === "PLAYERS" ? battle.selectedPlayers : battle.selectedClubs;
//         for (const id of ids) {
//           if (!idToBattleType.has(id)) {
//             idToBattleType.set(id, battle.battleType);
//           }
//         }
//       }

//       // FIX 1 (usage): Fetch only profiles NOT already in cache, in parallel
//       await Promise.all(
//         Array.from(idToBattleType.entries()).map(([id, battleType]) =>
//           fetchProfileIfNeeded(id, battleType)
//         )
//       );

//       // Aggregate leaderboard points across all battles
//       // NOTE: only leaderboard data is re-fetched on every poll — not profiles
//       const pointsMap = new Map<string, number>();
//       await Promise.all(
//         accessibleBattles.map(async (battle) => {
//           const leaderboard = await fetchLeaderboardForBattle(battle.id);
//           for (const entry of leaderboard) {
//             pointsMap.set(entry.playerId, (pointsMap.get(entry.playerId) || 0) + entry.points);
//           }
//         })
//       );

//       // Build items from cache + fresh points
//       const itemsWithPoints = Array.from(idToBattleType.keys())
//         .map((id) => {
//           const cached = profileCache.get(id);
//           if (!cached) return null;
//           return { ...cached, points: pointsMap.get(id) || 0 };
//         })
//         .filter((item): item is CachedProfile & { points: number } => item !== null);

//       // Sort by points, take top 20
//       itemsWithPoints.sort((a, b) => b.points - a.points);
//       const top20 = itemsWithPoints.slice(0, 20);

//       // Build final cards with rank deltas
//       const items: PlayerCard[] = top20.map((item, index) => {
//         const rank = index + 1;
//         const points = item.points;
//         const prevPoints = previousPointsRef.current.get(item.id) || points;
//         const prevRank = previousRanksRef.current.get(item.id) || rank;
//         const delta = points - prevPoints;

//         return {
//           id: item.id,
//           name: item.name,
//           points,
//           delta: Math.abs(delta),
//           prevPoints,
//           rank,
//           prevRank,
//           isLive: delta >= 15,
//           trend: delta >= 0 ? "up" : "down",
//           type: item.type,
//           avatar: item.avatar,
//           team: item.team,
//         };
//       });

//       // Update refs for next poll comparison
//       const newPrevPoints = new Map<string, number>();
//       const newPrevRanks = new Map<string, number>();
//       items.forEach((item) => {
//         newPrevPoints.set(item.id, item.points);
//         newPrevRanks.set(item.id, item.rank);
//       });
//       previousPointsRef.current = newPrevPoints;
//       previousRanksRef.current = newPrevRanks;

//       setPowerItems(items);
//       isFirstFetch.current = false;
//     } catch (err) {
//       console.error("Error fetching power data:", err);
//       setPowerItems([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [user, checkPermission, fetchLeaderboardForBattle, fetchProfileIfNeeded]);

//   useEffect(() => {
//     fetchPowerData();

//     // FIX 2: Pause polling when the browser tab is hidden.
//     // This alone halves quota usage for users who keep the app open in a background tab.
//     let interval: ReturnType<typeof setInterval> | null = null;

//     const startPolling = () => {
//       if (interval) return;
//       interval = setInterval(fetchPowerData, 30_000);
//     };

//     const stopPolling = () => {
//       if (interval) {
//         clearInterval(interval);
//         interval = null;
//       }
//     };

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         stopPolling();
//       } else {
//         // Re-fetch immediately when the user comes back, then restart polling
//         fetchPowerData();
//         startPolling();
//       }
//     };

//     if (!document.hidden) {
//       startPolling();
//     }

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => {
//       stopPolling();
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, [fetchPowerData]);

//   // ─── Loading state ────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="w-full bg-[#121212] px-4 pb-4">
//         <div className="flex items-start justify-between mb-1">
//           <div>
//             <h2 className="text-white text-[15px] font-bold leading-tight">Power Rankings</h2>
//             <p className="text-[#e53935] text-[11px] mt-0.5 leading-snug max-w-[220px]">
//               Top 20 Players & Clubs by Power Points
//             </p>
//           </div>
//           <button
//             onClick={onShowAll}
//             className="text-[#e91e8c] text-[12px] font-semibold hover:text-[#ff4db8] transition-colors whitespace-nowrap mt-0.5 flex-shrink-0"
//           >
//             Show All
//           </button>
//         </div>
//         <div className="flex gap-3 overflow-x-auto pb-1">
//           {[1, 2, 3, 4, 5].map((i) => (
//             <div
//               key={i}
//               className="flex-shrink-0 w-[155px] rounded-2xl bg-[#1a1a1a] border border-[#252525] p-3.5 animate-pulse"
//             >
//               <div className="w-[52px] h-[52px] rounded-full bg-[#252525] mx-auto" />
//               <div className="h-3 bg-[#252525] rounded mt-2" />
//               <div className="h-2 bg-[#252525] rounded mt-1 w-2/3 mx-auto" />
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // ─── Empty state ──────────────────────────────────────────────────────────
//   if (powerItems.length === 0) {
//     return (
//       <div className="w-full bg-[#121212] px-4 pb-4">
//         <div className="flex items-start justify-between mb-1">
//           <div>
//             <h2 className="text-white text-[15px] font-bold leading-tight">Power Rankings</h2>
//             <p className="text-[#e53935] text-[11px] mt-0.5 leading-snug max-w-[220px]">
//               Top 20 Players & Clubs by Power Points
//             </p>
//           </div>
//           <button
//             onClick={onShowAll}
//             className="text-[#e91e8c] text-[12px] font-semibold hover:text-[#ff4db8] transition-colors whitespace-nowrap mt-0.5 flex-shrink-0"
//           >
//             Show All
//           </button>
//         </div>
//         <div className="text-center py-8">
//           <p className="text-[#555] text-sm">No power data available yet</p>
//           <p className="text-[#666] text-xs mt-1">
//             Create battles and vote to see power points!
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ─── Carousel ─────────────────────────────────────────────────────────────
//   return (
//     <div className="w-full bg-[#121212] px-4 pb-4">
//       <div className="flex items-start justify-between mb-1">
//         <div>
//           <h2 className="text-white text-[15px] font-bold leading-tight">Power Rankings</h2>
//           <p className="text-[#e53935] text-[11px] mt-0.5 leading-snug max-w-[220px]">
//             Top 20{" "}
//             {powerItems.some((item) => item.type === "CLUB") ? "Players & Clubs" : "Players"} by
//             Power Points
//           </p>
//         </div>
//         <button
//           onClick={onShowAll}
//           className="text-[#ff5722] text-[14px] font-bold hover:text-[#ff8a50] transition-colors whitespace-nowrap mt-1 flex-shrink-0 underline underline-offset-4"
//         >
//           Show All
//         </button>
//       </div>

//       <p className="text-[#555] text-[11px] mb-3 leading-relaxed">
//         Players and Clubs earn Power Points when fans vote for them in battles on SportsFan360.
//       </p>

//       <div className="overflow-hidden relative w-full pb-1">
//         <style>{`
//           @keyframes infinite-scroll {
//             0% { transform: translateX(0); }
//             100% { transform: translateX(-50%); }
//           }
//           .animate-scroll {
//             animation: infinite-scroll 45s linear infinite;
//             width: max-content;
//           }
//           .animate-scroll:hover {
//             animation-play-state: paused;
//           }
//         `}</style>

//         <div className="flex gap-3 animate-scroll">
//           {[...powerItems, ...powerItems].map((item, index) => (
//             <PowerCard key={`${item.id}-${index}`} item={item} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlayerPowerCarousel;









"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlayerCard {
  id: string;
  name: string;
  points: number;
  delta: number;
  prevPoints: number;
  rank: number;
  prevRank: number;
  isLive?: boolean;
  trend: "up" | "down";
  type?: "PLAYER" | "CLUB";
  avatar?: string;
  team?: string;
}

interface Battle {
  id: string;
  battleName: string;
  battleType: "PLAYERS" | "CLUBS";
  selectedPlayers: string[];
  selectedClubs: string[];
  invitedFriends: Array<{ email: string; name: string }>;
  userId: string;
  userName: string;
  createdAt: number;
  updatedAt: number;
}

interface LeaderboardEntry {
  rank: number;
  playerId: string;
  playerName: string;
  points: number;
  votes: number;
}

// ─── Module-level profile cache ──────────────────────────────────────────────
interface CachedProfile {
  id: string;
  name: string;
  type: "PLAYER" | "CLUB";
  team: string;
  avatar?: string;
}
const profileCache = new Map<string, CachedProfile>();

// ─── Icons ────────────────────────────────────────────────────────────────────
const LightningIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#00e676">
    <path d="M13 2L4.09 12.96H11L10 22L20.91 11.04H14L13 2Z" />
  </svg>
);

const TrendArrow: React.FC<{ trend: "up" | "down" }> = ({ trend }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={trend === "up" ? "#00e676" : "#ef5350"}
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="flex-shrink-0"
  >
    {trend === "up" ? (
      <path d="M7 17L17 7M17 7H9M17 7V15" />
    ) : (
      <path d="M7 7L17 17M17 17H9M17 17V9" />
    )}
  </svg>
);

// ─── Circle with Rank Inside ──────────────────────────────────────────────────
const RankCircle: React.FC<{
  rank: number;
  prevRank: number;
  delta: number;
  size?: number;
}> = ({ rank, prevRank, delta, size = 52 }) => {
  let borderColor = "#2a2a2a";
  let textColor = "#9ca3af";
  let glowColor = "transparent";

  if (delta >= 15) {
    borderColor = "#00e676";
    textColor = "#00e676";
    glowColor = "rgba(0, 230, 118, 0.35)";
  } else if (rank > prevRank) {
    borderColor = "#ef5350";
    textColor = "#ef5350";
    glowColor = "rgba(239, 83, 80, 0.35)";
  }

  return (
    <div
      className="flex-shrink-0 rounded-full flex items-center justify-center"
      style={{
        width: size,
        height: size,
        border: `3px solid ${borderColor}`,
        background: "#121212",
        boxShadow:
          glowColor !== "transparent"
            ? `0 0 10px 2px ${glowColor}, inset 0 0 6px ${glowColor}`
            : "none",
      }}
    >
      <span style={{ color: textColor, fontSize: 16, fontWeight: 700, lineHeight: 1 }}>
        {rank}
      </span>
    </div>
  );
};

// ─── Player/Club Card ─────────────────────────────────────────────────────────
const PowerCard: React.FC<{ item: PlayerCard }> = ({ item }) => (
  <div className="relative flex-shrink-0 w-[155px] rounded-2xl bg-[#1a1a1a] border border-[#252525] p-3.5 flex flex-col gap-2.5">
    {item.isLive && (
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#1f0a0a] border border-[#4a1a1a] rounded-full px-1.5 py-0.5 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e53935] animate-pulse" />
        <span className="text-[#e53935] text-[8px] font-bold tracking-widest uppercase">
          Live
        </span>
      </div>
    )}

    {item.type === "CLUB" && item.avatar && (
      <div className="absolute top-2.5 right-2.5 z-10">
        <img
          src={item.avatar}
          alt={item.name}
          className="w-8 h-8 rounded-full object-cover border border-[#252525]"
        />
      </div>
    )}

    <div className="flex items-center gap-2.5">
      <RankCircle rank={item.rank} prevRank={item.prevRank} delta={item.delta} size={52} />
      <div className="flex flex-col min-w-0">
        <span className="text-white text-[11px] font-bold leading-tight line-clamp-2">
          {item.name}
        </span>
        <div className="flex items-center gap-1 mt-0.5">
          <LightningIcon />
          <span className="text-[#00e676] text-[13px] font-bold">
            {item.points.toLocaleString()}
          </span>
        </div>
        {item.team && (
          <span className="text-[#555] text-[8px] mt-0.5 truncate">{item.team}</span>
        )}
      </div>
    </div>

    <div className="flex items-center gap-1">
      <TrendArrow trend={item.trend} />
      <span
        className="text-[11px] font-semibold"
        style={{ color: item.trend === "up" ? "#00e676" : "#ef5350" }}
      >
        {item.trend === "up" ? "+" : ""}
        {Math.abs(item.delta)}
      </span>
      <span className="text-[#555] text-[10px]">from {item.prevPoints.toLocaleString()}</span>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
interface PlayerPowerCarouselProps {
  onShowAll: () => void;
}

const PlayerPowerCarousel: React.FC<PlayerPowerCarouselProps> = ({ onShowAll }) => {
  const { user } = useAuth();
  const [powerItems, setPowerItems] = useState<PlayerCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Track previous points/ranks for delta calculation across polls
  const previousPointsRef = useRef<Map<string, number>>(new Map());
  const previousRanksRef = useRef<Map<string, number>>(new Map());
  const isFirstFetch = useRef(true);

  // Track in-flight profile fetches to prevent duplicate concurrent requests
  const inflightProfileFetches = useRef<Map<string, Promise<void>>>(new Map());

  // For Power Rankings - we want ALL battles, no permission filtering
  // This function always returns true to include all battles
  const checkPermission = useCallback(
    (_battle: Battle): boolean => {
      // Show ALL battles to ALL users for global rankings
      return true;
    },
    []
  );

  const fetchLeaderboardForBattle = useCallback(
    async (battleId: string): Promise<LeaderboardEntry[]> => {
      try {
        const res = await axios.get(
          `/api/battle/battle-vote?battleId=${battleId}&userId=${user?.userId || ""}`
        );
        if (res.data.success) {
          return res.data.leaderboard || [];
        }
        return [];
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        return [];
      }
    },
    [user]
  );

  // Fetch a profile only if not already cached
  const fetchProfileIfNeeded = useCallback(
    async (id: string, battleType: "PLAYERS" | "CLUBS"): Promise<void> => {
      if (profileCache.has(id)) return;

      if (inflightProfileFetches.current.has(id)) {
        await inflightProfileFetches.current.get(id);
        return;
      }

      const fetchPromise = (async () => {
        try {
          if (battleType === "PLAYERS") {
            const response = await axios.get(`/api/player-profile/${id}`);
            const playerData = response.data.profile || response.data.data || response.data;
            profileCache.set(id, {
              id,
              name: playerData.name || "Unknown Player",
              type: "PLAYER",
              team: playerData.team || "IPL",
              avatar: undefined,
            });
          } else {
            const response = await axios.get(`/api/club-profile/${id}`);
            if (response.data.success) {
              const club = response.data.profile;
              profileCache.set(id, {
                id,
                name: club.name || "Unknown Club",
                type: "CLUB",
                team: club.team || "IPL",
                avatar: club.avatar,
              });
            }
          }
        } catch (err) {
          console.error(`Error fetching profile ${id}:`, err);
        } finally {
          inflightProfileFetches.current.delete(id);
        }
      })();

      inflightProfileFetches.current.set(id, fetchPromise);
      await fetchPromise;
    },
    []
  );

  const fetchPowerData = useCallback(async () => {
    try {
      if (isFirstFetch.current) {
        setLoading(true);
      }

      // Fetch ALL battles - no userId filter for global rankings
      const battlesResponse = await axios.get(`/api/battle`);

      if (!battlesResponse.data.success || !battlesResponse.data.battles) {
        setPowerItems([]);
        setLoading(false);
        isFirstFetch.current = false;
        return;
      }

      // Include ALL battles - no permission filtering
      const accessibleBattles: Battle[] = battlesResponse.data.battles;

      if (accessibleBattles.length === 0) {
        setPowerItems([]);
        setLoading(false);
        isFirstFetch.current = false;
        return;
      }

      // Collect all unique IDs that need profile data
      const idToBattleType = new Map<string, "PLAYERS" | "CLUBS">();
      for (const battle of accessibleBattles) {
        const ids =
          battle.battleType === "PLAYERS" ? battle.selectedPlayers : battle.selectedClubs;
        for (const id of ids) {
          if (!idToBattleType.has(id)) {
            idToBattleType.set(id, battle.battleType);
          }
        }
      }

      // Fetch only profiles NOT already in cache
      await Promise.all(
        Array.from(idToBattleType.entries()).map(([id, battleType]) =>
          fetchProfileIfNeeded(id, battleType)
        )
      );

      // Aggregate leaderboard points across ALL battles
      const pointsMap = new Map<string, number>();
      await Promise.all(
        accessibleBattles.map(async (battle) => {
          const leaderboard = await fetchLeaderboardForBattle(battle.id);
          for (const entry of leaderboard) {
            pointsMap.set(entry.playerId, (pointsMap.get(entry.playerId) || 0) + entry.points);
          }
        })
      );

      // Build items from cache + fresh points
      const itemsWithPoints = Array.from(idToBattleType.keys())
        .map((id) => {
          const cached = profileCache.get(id);
          if (!cached) return null;
          return { ...cached, points: pointsMap.get(id) || 0 };
        })
        .filter((item): item is CachedProfile & { points: number } => item !== null);

      // Sort by points globally, take top 20
      itemsWithPoints.sort((a, b) => b.points - a.points);
      const top20 = itemsWithPoints.slice(0, 20);

      // Build final cards with rank deltas
      const items: PlayerCard[] = top20.map((item, index) => {
        const rank = index + 1;
        const points = item.points;
        const prevPoints = previousPointsRef.current.get(item.id) || points;
        const prevRank = previousRanksRef.current.get(item.id) || rank;
        const delta = points - prevPoints;

        return {
          id: item.id,
          name: item.name,
          points,
          delta: Math.abs(delta),
          prevPoints,
          rank,
          prevRank,
          isLive: delta >= 15,
          trend: delta >= 0 ? "up" : "down",
          type: item.type,
          avatar: item.avatar,
          team: item.team,
        };
      });

      // Update refs for next poll comparison
      const newPrevPoints = new Map<string, number>();
      const newPrevRanks = new Map<string, number>();
      items.forEach((item) => {
        newPrevPoints.set(item.id, item.points);
        newPrevRanks.set(item.id, item.rank);
      });
      previousPointsRef.current = newPrevPoints;
      previousRanksRef.current = newPrevRanks;

      setPowerItems(items);
      isFirstFetch.current = false;
    } catch (err) {
      console.error("Error fetching power data:", err);
      setPowerItems([]);
    } finally {
      setLoading(false);
    }
  }, [checkPermission, fetchLeaderboardForBattle, fetchProfileIfNeeded]);

  useEffect(() => {
    fetchPowerData();

    let interval: ReturnType<typeof setInterval> | null = null;

    const startPolling = () => {
      if (interval) return;
      interval = setInterval(fetchPowerData, 30000);
    };

    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        fetchPowerData();
        startPolling();
      }
    };

    if (!document.hidden) {
      startPolling();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchPowerData]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-[#121212] px-4 pb-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-white text-[15px] font-bold leading-tight">Power Rankings</h2>
            <p className="text-[#e53935] text-[11px] mt-0.5 leading-snug max-w-[220px]">
              Top 20 Players & Clubs by Power Points
            </p>
          </div>
          <button
            onClick={onShowAll}
            className="text-[#e91e8c] text-[12px] font-semibold hover:text-[#ff4db8] transition-colors whitespace-nowrap mt-0.5 flex-shrink-0"
          >
            Show All
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[155px] rounded-2xl bg-[#1a1a1a] border border-[#252525] p-3.5 animate-pulse"
            >
              <div className="w-[52px] h-[52px] rounded-full bg-[#252525] mx-auto" />
              <div className="h-3 bg-[#252525] rounded mt-2" />
              <div className="h-2 bg-[#252525] rounded mt-1 w-2/3 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (powerItems.length === 0) {
    return (
      <div className="w-full bg-[#121212] px-4 pb-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-white text-[15px] font-bold leading-tight">Power Rankings</h2>
            <p className="text-[#e53935] text-[11px] mt-0.5 leading-snug max-w-[220px]">
              Top 20 Players & Clubs by Power Points
            </p>
          </div>
          <button
            onClick={onShowAll}
            className="text-[#e91e8c] text-[12px] font-semibold hover:text-[#ff4db8] transition-colors whitespace-nowrap mt-0.5 flex-shrink-0"
          >
            Show All
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-[#555] text-sm">No power data available yet</p>
          <p className="text-[#666] text-xs mt-1">
            Create battles and vote to see power points!
          </p>
        </div>
      </div>
    );
  }

  // Carousel view
  return (
    <div className="w-full bg-[#121212] px-4 pb-4">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-white text-[15px] font-bold leading-tight">Power Rankings</h2>
          <p className="text-[#e53935] text-[11px] mt-0.5 leading-snug max-w-[220px]">
            Top 20{" "}
            {powerItems.some((item) => item.type === "CLUB") ? "Players & Clubs" : "Players"} by
            Power Points
          </p>
        </div>
        <button
          onClick={onShowAll}
          className="text-[#ff5722] text-[14px] font-bold hover:text-[#ff8a50] transition-colors whitespace-nowrap mt-1 flex-shrink-0 underline underline-offset-4"
        >
          Show All
        </button>
      </div>

      <p className="text-[#555] text-[11px] mb-3 leading-relaxed">
        Players and Clubs earn Power Points when fans vote for them in battles on SportsFan360.
      </p>

      <div className="overflow-hidden relative w-full pb-1">
        <style>{`
          @keyframes infinite-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: infinite-scroll 45s linear infinite;
            width: max-content;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="flex gap-3 animate-scroll">
          {[...powerItems, ...powerItems].map((item, index) => (
            <PowerCard key={`${item.id}-${index}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerPowerCarousel;