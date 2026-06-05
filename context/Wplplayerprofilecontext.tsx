



// "use client";

// import axios from "axios";
// import {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
// } from "react";
// import { WPLPlayer } from "@/types/wplPlayer";

// // === LIST RESPONSE ===
// type WPLPlayerListData = {
//   players: WPLPlayer[];
//   hasMore: boolean;
//   nextCursor?: string | null;
// };

// // === API RESPONSE SHAPES ===
// type WPLPlayerListApiResponse = {
//   success: boolean;
//   data: WPLPlayer[];
//   nextCursor?: string | null;
//   pageSize?: number;
// };

// // === CONTEXT TYPE ===
// type WPLContextType = {
//   player: WPLPlayer | null;
//   listData: WPLPlayerListData | null;
//   loading: boolean;
//   selectPlayer: (playerId: string) => void;
//   fetchWPLPlayerList: (reset?: boolean) => Promise<void>;
//   fetchWPLPlayerById: (playerId: string) => Promise<void>; // ← NEW
// };

// const WPLPlayerProfileContext = createContext<WPLContextType | undefined>(undefined);

// export function WPLPlayerProfileProvider({ children }: { children: ReactNode }) {
//   const [player, setPlayer]   = useState<WPLPlayer | null>(null);
//   const [listData, setListData] = useState<WPLPlayerListData | null>(null);
//   const [loading, setLoading] = useState(false);

//   // ── Select from already-fetched list (home page flow) ────────────────────
//   const selectPlayer = (playerId: string) => {
//     const found = listData?.players.find((p) => p.player_id === playerId) ?? null;
//     setPlayer(found);
//   };

//   // ── Direct fetch by player_id (global search flow) ───────────────────────
//   // Hits /api/player-stats?player_id=<id>&tournament=womens_ipl
//   // Falls back to setPlayer(null) if not found.
//   const fetchWPLPlayerById = async (playerId: string) => {
//     try {
//       setLoading(true);
//       const res = await axios.get<WPLPlayerListApiResponse>(
//         `/api/player-stats?player_id=${encodeURIComponent(playerId)}&tournament=womens_ipl&limit=1`
//       );
//       if (res.data.success && res.data.data?.length > 0) {
//         const found = res.data.data[0];
//         setPlayer(found);

//         // Also add this player into listData so selectPlayer works if called later
//         setListData((prev) => {
//           if (!prev) return { players: [found], hasMore: false, nextCursor: null };
//           const already = prev.players.some((p) => p.player_id === found.player_id);
//           if (already) return prev;
//           return { ...prev, players: [...prev.players, found] };
//         });
//       } else {
//         setPlayer(null);
//       }
//     } catch (err) {
//       console.error("Failed to fetch WPL player by id:", err);
//       setPlayer(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Fetch paginated list (home page) ─────────────────────────────────────
//   const fetchWPLPlayerList = async (reset = true) => {
//     try {
//       setLoading(true);

//       const params = new URLSearchParams({
//         tournament: "womens_ipl",
//         limit: "20",
//       });

//       if (!reset && listData?.nextCursor) {
//         params.set("after", listData.nextCursor);
//       }

//       const res = await axios.get<WPLPlayerListApiResponse>(
//         `/api/player-stats?${params.toString()}`
//       );

//       if (res.data.success) {
//         const incoming   = res.data.data ?? [];
//         const nextCursor = res.data.nextCursor ?? null;
//         const hasMore    = Boolean(nextCursor);

//         if (reset) {
//           setListData({ players: incoming, hasMore, nextCursor });
//         } else {
//           setListData((prev) => ({
//             players: [...(prev?.players ?? []), ...incoming],
//             hasMore,
//             nextCursor,
//           }));
//         }
//       }
//     } catch (error) {
//       console.error("Failed to fetch WPL player list", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <WPLPlayerProfileContext.Provider
//       value={{ player, listData, loading, selectPlayer, fetchWPLPlayerList, fetchWPLPlayerById }}
//     >
//       {children}
//     </WPLPlayerProfileContext.Provider>
//   );
// }

// export function useWPLPlayerProfile() {
//   const context = useContext(WPLPlayerProfileContext);
//   if (!context) {
//     throw new Error("useWPLPlayerProfile must be used inside WPLPlayerProfileProvider");
//   }
//   return context;
// }







"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { WPLPlayer } from "@/types/wplPlayer";

// === LIST RESPONSE ===
type WPLPlayerListData = {
  players: WPLPlayer[];
  hasMore: boolean;
  nextCursor?: string | null;
};

// === API RESPONSE SHAPES ===
type WPLPlayerListApiResponse = {
  success: boolean;
  data: WPLPlayer[];
  nextCursor?: string | null;
  pageSize?: number;
};

// === CONTEXT TYPE ===
type WPLContextType = {
  player: WPLPlayer | null;
  listData: WPLPlayerListData | null;
  loading: boolean;
  selectPlayer: (playerId: string) => void;
  fetchWPLPlayerList: (reset?: boolean) => Promise<void>;
  fetchWPLPlayerById: (playerId: string, tournament?: string) => Promise<void>;
};

const WPLPlayerProfileContext = createContext<WPLContextType | undefined>(undefined);

export function WPLPlayerProfileProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer]     = useState<WPLPlayer | null>(null);
  const [listData, setListData] = useState<WPLPlayerListData | null>(null);
  const [loading, setLoading]   = useState(false);

  // ── Select from already-fetched list ─────────────────────────────────────
  const selectPlayer = (playerId: string) => {
    const found = listData?.players.find((p) => p.player_id === playerId) ?? null;
    setPlayer(found);
  };

  // ── Direct fetch by player_id + optional tournament ───────────────────────
  // Called when a player arrives via global search and isn't in the cached 20.
  // tournament defaults to "womens_ipl" for backward compat with home-page flow.
  const fetchWPLPlayerById = async (playerId: string, tournament?: string) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        player_id: playerId,
        limit: "1",
      });

      // If we know the tournament, filter precisely; otherwise search both women's.
      if (tournament) {
        params.set("tournament", tournament);
      } else {
        // No tournament hint — try womens_ipl first, then womens_t20i as fallback
        params.set("tournament", "womens_ipl");
      }

      let res = await axios.get<WPLPlayerListApiResponse>(
        `/api/player-stats?${params.toString()}`
      );

      // Fallback: if not found in womens_ipl, try womens_t20i
      if (
        (!res.data.success || !res.data.data?.length) &&
        !tournament // only auto-fallback when no explicit tournament was given
      ) {
        params.set("tournament", "womens_t20i");
        res = await axios.get<WPLPlayerListApiResponse>(
          `/api/player-stats?${params.toString()}`
        );
      }

      if (res.data.success && res.data.data?.length > 0) {
        const found = res.data.data[0];
        setPlayer(found);

        // Merge into listData cache
        setListData((prev) => {
          if (!prev) return { players: [found], hasMore: false, nextCursor: null };
          const already = prev.players.some(
            (p) =>
              p.player_id === found.player_id &&
              (p as unknown as Record<string, string>).tournament ===
                (found as unknown as Record<string, string>).tournament
          );
          if (already) return prev;
          return { ...prev, players: [...prev.players, found] };
        });
      } else {
        setPlayer(null);
      }
    } catch (err) {
      console.error("Failed to fetch player by id:", err);
      setPlayer(null);
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch paginated list (home page / WPL cards) ──────────────────────────
  const fetchWPLPlayerList = async (reset = true) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        tournament: "womens_ipl",
        limit: "20",
      });

      if (!reset && listData?.nextCursor) {
        params.set("after", listData.nextCursor);
      }

      const res = await axios.get<WPLPlayerListApiResponse>(
        `/api/player-stats?${params.toString()}`
      );

      if (res.data.success) {
        const incoming   = res.data.data ?? [];
        const nextCursor = res.data.nextCursor ?? null;
        const hasMore    = Boolean(nextCursor);

        if (reset) {
          setListData({ players: incoming, hasMore, nextCursor });
        } else {
          setListData((prev) => ({
            players: [...(prev?.players ?? []), ...incoming],
            hasMore,
            nextCursor,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch WPL player list", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WPLPlayerProfileContext.Provider
      value={{ player, listData, loading, selectPlayer, fetchWPLPlayerList, fetchWPLPlayerById }}
    >
      {children}
    </WPLPlayerProfileContext.Provider>
  );
}

export function useWPLPlayerProfile() {
  const context = useContext(WPLPlayerProfileContext);
  if (!context) {
    throw new Error("useWPLPlayerProfile must be used inside WPLPlayerProfileProvider");
  }
  return context;
}