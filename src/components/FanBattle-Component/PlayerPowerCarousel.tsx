// "use client";

// import React from "react";

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface PlayerCard {
//   id: number;
//   name: string;
//   ringValue: number;
//   ringMax: number;
//   ringColor: string;
//   points: number;
//   delta: number;
//   prevPoints: number;
//   isLive?: boolean;
//   trend: "up" | "down";
// }

// // ─── Circular Ring SVG ────────────────────────────────────────────────────────
// const RingIndicator: React.FC<{
//   value: number;
//   max: number;
//   color: string;
//   size?: number;
// }> = ({ value, max, color, size = 56 }) => {
//   const radius = (size - 6) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const fill = (value / max) * circumference;

//   return (
//     <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
//       <svg width={size} height={size} className="-rotate-90" style={{ display: "block" }}>
//         {/* Track */}
//         <circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           fill="none"
//           stroke="#2a2a2a"
//           strokeWidth="4"
//         />
//         {/* Progress */}
//         <circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           fill="none"
//           stroke={color}
//           strokeWidth="4"
//           strokeDasharray={`${fill} ${circumference}`}
//           strokeLinecap="round"
//         />
//       </svg>
//       {/* Center value */}
//       <span
//         className="absolute inset-0 flex items-center justify-center text-[13px] font-bold"
//         style={{ color }}
//       >
//         {value}
//       </span>
//     </div>
//   );
// };

// // ─── Trend Arrow ─────────────────────────────────────────────────────────────
// const TrendArrow: React.FC<{ trend: "up" | "down" }> = ({ trend }) => (
//   <svg
//     width="12"
//     height="12"
//     viewBox="0 0 24 24"
//     fill={trend === "up" ? "#00e676" : "#ef5350"}
//     className="flex-shrink-0"
//   >
//     {trend === "up" ? (
//       <path d="M7 14l5-5 5 5H7z" />
//     ) : (
//       <path d="M7 10l5 5 5-5H7z" />
//     )}
//   </svg>
// );

// // ─── Lightning bolt icon ──────────────────────────────────────────────────────
// const LightningIcon = () => (
//   <svg width="11" height="11" viewBox="0 0 24 24" fill="#00e676">
//     <path d="M13 2L4.09 12.96H11L10 22L20.91 11.04H14L13 2Z" />
//   </svg>
// );

// // ─── Player Card ──────────────────────────────────────────────────────────────
// const PlayerPowerCard: React.FC<{ player: PlayerCard }> = ({ player }) => (
//   <div className="relative flex-shrink-0 w-[155px] rounded-2xl bg-[#1a1a1a] border border-[#252525] p-3.5 flex flex-col gap-2.5">
//     {/* LIVE badge */}
//     {player.isLive && (
//       <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#1f0a0a] border border-[#4a1a1a] rounded-full px-1.5 py-0.5">
//         <span className="w-1.5 h-1.5 rounded-full bg-[#e53935] animate-pulse" />
//         <span className="text-[#e53935] text-[8px] font-bold tracking-widest uppercase">
//           Live
//         </span>
//       </div>
//     )}

//     {/* Ring + points */}
//     <div className="flex items-center gap-2.5">
//       <RingIndicator
//         value={player.ringValue}
//         max={player.ringMax}
//         color={player.ringColor}
//         size={52}
//       />
//       <div className="flex flex-col min-w-0">
//         <span className="text-white text-[12px] font-bold leading-tight truncate">
//           {player.name.length > 10 ? player.name.slice(0, 10) + "…" : player.name}
//         </span>
//         <div className="flex items-center gap-1 mt-0.5">
//           <LightningIcon />
//           <span className="text-[#00e676] text-[13px] font-bold">
//             {player.points.toLocaleString()}
//           </span>
//         </div>
//       </div>
//     </div>

//     {/* Delta */}
//     <div className="flex items-center gap-1">
//       <TrendArrow trend={player.trend} />
//       <span
//         className="text-[11px] font-semibold"
//         style={{ color: player.trend === "up" ? "#00e676" : "#ef5350" }}
//       >
//         {player.trend === "up" ? "+" : "-"}
//         {Math.abs(player.delta)}
//       </span>
//       <span className="text-[#555] text-[10px]">from {player.prevPoints.toLocaleString()}</span>
//     </div>
//   </div>
// );

// // ─── Mock Data ────────────────────────────────────────────────────────────────
// const PLAYER_DATA: PlayerCard[] = [
//   {
//     id: 1,
//     name: "Neeraj Chopra",
//     ringValue: 87,
//     ringMax: 100,
//     ringColor: "#00e676",
//     points: 1523,
//     delta: 36,
//     prevPoints: 1487,
//     isLive: false,
//     trend: "up",
//   },
//   {
//     id: 2,
//     name: "Shaili Singh",
//     ringValue: 21,
//     ringMax: 100,
//     ringColor: "#00e676",
//     points: 1245,
//     delta: 47,
//     prevPoints: 1198,
//     isLive: true,
//     trend: "up",
//   },
//   {
//     id: 3,
//     name: "Lakshya Sen",
//     ringValue: 64,
//     ringMax: 100,
//     ringColor: "#e91e8c",
//     points: 980,
//     delta: 12,
//     prevPoints: 968,
//     isLive: true,
//     trend: "up",
//   },
//   {
//     id: 4,
//     name: "Tejaswin",
//     ringValue: 45,
//     ringMax: 100,
//     ringColor: "#ff9800",
//     points: 854,
//     delta: 8,
//     prevPoints: 862,
//     isLive: false,
//     trend: "down",
//   },
//   {
//     id: 5,
//     name: "Avinash Sable",
//     ringValue: 33,
//     ringMax: 100,
//     ringColor: "#00e676",
//     points: 720,
//     delta: 22,
//     prevPoints: 698,
//     isLive: false,
//     trend: "up",
//   },
// ];

// // ─── Main Component ───────────────────────────────────────────────────────────
// interface PlayerPowerCarouselProps {
//   onShowAll: () => void;
// }

// const PlayerPowerCarousel: React.FC<PlayerPowerCarouselProps> = ({ onShowAll }) => {
//   return (
//     <div className="w-full bg-[#121212] px-4 pb-4">
//       {/* Header row */}
//       <div className="flex items-start justify-between mb-1">
//         <div>
//           <h2 className="text-white text-[15px] font-bold leading-tight">
//             Player Power Points
//           </h2>
//           <p className="text-[#e53935] text-[11px] mt-0.5 leading-snug max-w-[220px]">
//             Hey! Don&apos;t let your favorite players drop their Power!
//           </p>
//         </div>
//         <button
//           onClick={onShowAll}
//           className="text-[#e91e8c] text-[12px] font-semibold hover:text-[#ff4db8] transition-colors whitespace-nowrap mt-0.5 flex-shrink-0"
//         >
//           Show All
//         </button>
//       </div>

//       {/* Subtitle */}
//       <p className="text-[#555] text-[11px] mb-3 leading-relaxed">
//         Players earn Power Points when fans Like, Echo, Quote, Watch Videos, and Post
//         about them on SportsFan360.
//       </p>

//       {/* Scrollable cards - Auto Marquee */}
//       <div className="overflow-hidden relative w-full pb-1">
//         <style>{`
//           @keyframes infinite-scroll {
//             0% { transform: translateX(0); }
//             100% { transform: translateX(-50%); }
//           }
//           .animate-scroll {
//             animation: infinite-scroll 20s linear infinite;
//             width: max-content; /* Critical for continuous scroll */
//           }
//           .animate-scroll:hover {
//             animation-play-state: paused; /* Pauses when user hovers over it! */
//           }
//         `}</style>
        
//         {/* We map the array TWICE so the loop is perfectly seamless */}
//         <div className="flex gap-3 animate-scroll">
//           {[...PLAYER_DATA, ...PLAYER_DATA].map((player, index) => (
//             <PlayerPowerCard key={`${player.id}-${index}`} player={player} />
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

const LightningIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#00e676">
    <path d="M13 2L4.09 12.96H11L10 22L20.91 11.04H14L13 2Z" />
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
        boxShadow: glowColor !== "transparent"
          ? `0 0 10px 2px ${glowColor}, inset 0 0 6px ${glowColor}`
          : "none",
      }}
    >
      <span
        style={{
          color: textColor,
          fontSize: 16,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {rank}
      </span>
    </div>
  );
};

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="3" />
  </svg>
);

const TrendArrow: React.FC<{ trend: "up" | "down" }> = ({ trend }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={trend === "up" ? "#00e676" : "#ef5350"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
    {trend === "up" ? <path d="M7 17L17 7M17 7H9M17 7V15" /> : <path d="M7 7L17 17M17 17H9M17 17V9" />}
  </svg>
);
// (You can delete the LightningIcon entirely)

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
      <RankCircle
        rank={item.rank}
        prevRank={item.prevRank}
        delta={item.delta}
        size={52}
      />
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
  const previousPointsRef = useRef<Map<string, number>>(new Map());
  const previousRanksRef = useRef<Map<string, number>>(new Map());
  const isFirstFetch = useRef(true);

  const checkPermission = useCallback((battle: Battle): boolean => {
    if (!user?.userId) return false;
    if (battle.userId === user.userId) return true;
    return !!battle.invitedFriends?.some((f) => f.email === user.email);
  }, [user]);

  const fetchLeaderboardForBattle = useCallback(async (battleId: string): Promise<LeaderboardEntry[]> => {
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
  }, [user]);

  useEffect(() => {
    const fetchPowerData = async () => {
      if (!user?.userId) {
        setLoading(false);
        return;
      }

      try {
        if (isFirstFetch.current) {
          setLoading(true);
        }

        const battlesResponse = await axios.get(`/api/battle?userId=${user.userId}`);

        if (!battlesResponse.data.success || !battlesResponse.data.battles) {
          setPowerItems([]);
          setLoading(false);
          isFirstFetch.current = false;
          return;
        }

        const accessibleBattles = battlesResponse.data.battles.filter(checkPermission);

        if (accessibleBattles.length === 0) {
          setPowerItems([]);
          setLoading(false);
          isFirstFetch.current = false;
          return;
        }

        // Collect all unique items from all battles
        const itemsMap = new Map<string, { id: string; name: string; type: "PLAYER" | "CLUB"; team: string; avatar?: string }>();

        for (const battle of accessibleBattles) {
          const ids = battle.battleType === "PLAYERS" ? battle.selectedPlayers : battle.selectedClubs;

          for (const id of ids) {
            if (!itemsMap.has(id)) {
              try {
                if (battle.battleType === "PLAYERS") {
                  const response = await axios.get(`/api/player-profile/${id}`);
                  const playerData = response.data.profile || response.data.data || response.data;
                  itemsMap.set(id, {
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
                    itemsMap.set(id, {
                      id,
                      name: club.name || "Unknown Club",
                      type: "CLUB",
                      team: club.team || "IPL",
                      avatar: club.avatar,
                    });
                  }
                }
              } catch (err) {
                console.error(`Error fetching item ${id}:`, err);
              }
            }
          }
        }

        // Fetch leaderboard data for all battles and aggregate points
        const pointsMap = new Map<string, number>();

        for (const battle of accessibleBattles) {
          const leaderboard = await fetchLeaderboardForBattle(battle.id);
          for (const entry of leaderboard) {
            const currentPoints = pointsMap.get(entry.playerId) || 0;
            pointsMap.set(entry.playerId, currentPoints + entry.points);
          }
        }

        // Prepare items with points
        const itemsWithPoints: { id: string; name: string; type: "PLAYER" | "CLUB"; team: string; avatar?: string; points: number }[] = [];

        for (const [id, details] of itemsMap) {
          const points = pointsMap.get(id) || 0;
          itemsWithPoints.push({
            id,
            name: details.name,
            type: details.type,
            team: details.team,
            avatar: details.avatar,
            points,
          });
        }

        // Sort by points descending to determine ranks
        itemsWithPoints.sort((a, b) => b.points - a.points);

        // Take only top 20
        const top20Items = itemsWithPoints.slice(0, 20);

        // Create final items with ranks and deltas
        const items: PlayerCard[] = top20Items.map((item, index) => {
          const rank = index + 1;
          const points = item.points;
          const prevPoints = previousPointsRef.current.get(item.id) || points;
          const prevRank = previousRanksRef.current.get(item.id) || rank;
          const delta = points - prevPoints;
          const trend = delta >= 0 ? "up" : "down";

          return {
            id: item.id,
            name: item.name,
            points,
            delta: Math.abs(delta),
            prevPoints,
            rank,
            prevRank,
            isLive: delta >= 15,
            trend,
            type: item.type,
            avatar: item.avatar,
            team: item.team,
          };
        });

        // Update refs for next comparison
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
    };

    fetchPowerData();

    const interval = setInterval(fetchPowerData, 30000);
    return () => clearInterval(interval);
  }, [user, checkPermission, fetchLeaderboardForBattle]);

  if (loading) {
    return (
      <div className="w-full bg-[#121212] px-4 pb-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-white text-[15px] font-bold leading-tight">
              Power Rankings
            </h2>
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

  if (powerItems.length === 0) {
    return (
      <div className="w-full bg-[#121212] px-4 pb-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-white text-[15px] font-bold leading-tight">
              Power Rankings
            </h2>
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

  return (
    <div className="w-full bg-[#121212] px-4 pb-4">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-white text-[15px] font-bold leading-tight">
            Power Rankings
          </h2>
          <p className="text-[#e53935] text-[11px] mt-0.5 leading-snug max-w-[220px]">
            Top 20{" "}
            {powerItems.some((item) => item.type === "CLUB")
              ? "Players & Clubs"
              : "Players"}{" "}
            by Power Points
          </p>
        </div>
        <button onClick={onShowAll} className="text-[#ff5722] text-[14px] font-bold hover:text-[#ff8a50] transition-colors whitespace-nowrap mt-1 flex-shrink-0 underline underline-offset-4">
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
          {powerItems.length > 0 &&
            [...powerItems, ...powerItems].map((item, index) => (
              <PowerCard key={`${item.id}-${index}`} item={item} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerPowerCarousel;