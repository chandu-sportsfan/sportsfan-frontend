


// "use client";

// import { createContext, useContext, useState, useCallback, ReactNode } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// // ── Types ────────────────────────────────────────────────────────────────────

// interface SearchResult {
//     type: 'player' | 'team' | 'user';
//     id: string;
//     name: string;
//     image?: string;
//     logo?: string;
//     playerProfilesId?: string;
//     jerseyNumber?: number;
//     category?: string[];
//     // ← NEW: tells us which profile page to use
//     tournament?: string;
// }

// interface GlobalSearchContextType {
//     searchQuery: string;
//     setSearchQuery: (query: string) => void;
//     searchResults: SearchResult[];
//     isSearching: boolean;
//     performSearch: (query: string) => Promise<void>;
//     clearSearch: () => void;
//     navigateToResult: (result: SearchResult) => void;
// }

// // ── Helpers ───────────────────────────────────────────────────────────────────

// const WPL_TOURNAMENT = "womens_ipl";

// function isWPLPlayer(result: SearchResult): boolean {
//     return result.type === "player" && result.tournament === WPL_TOURNAMENT;
// }

// // ── Context ───────────────────────────────────────────────────────────────────

// const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

// // ── Provider ──────────────────────────────────────────────────────────────────

// export function GlobalSearchProvider({ children }: { children: ReactNode }) {
//     const [searchQuery, setSearchQuery] = useState("");
//     const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
//     const [isSearching, setIsSearching] = useState(false);
//     const router = useRouter();

//     const performSearch = useCallback(async (query: string) => {
//         if (!query.trim()) {
//             setSearchResults([]);
//             return;
//         }

//         setIsSearching(true);
//         try {
//             // Run both searches in parallel:
//             // 1. existing global-search API (teams, users, IPL players)
//             // 2. player-stats API with no tournament filter (covers both IPL + WPL)
//             const [globalRes, playerStatsRes] = await Promise.allSettled([
//                 axios.get(`/api/global-search?q=${encodeURIComponent(query)}`),
//                 axios.get(`/api/player-stats?search=${encodeURIComponent(query)}&limit=10`),
//             ]);

//             // ── Global search results (teams, users, IPL players) ─────────────
//             let globalResults: SearchResult[] = [];
//             if (globalRes.status === "fulfilled") {
//                 globalResults = globalRes.value.data.results || [];
//             }

//             // ── Player-stats results (both IPL + WPL from playerStats collection)
//             let statsResults: SearchResult[] = [];
//             if (playerStatsRes.status === "fulfilled" && playerStatsRes.value.data.success) {
//                 statsResults = (playerStatsRes.value.data.data ?? []).map(
//                     (p: {
//                         player_id: string;
//                         player_name: string;
//                         jersey_no?: number;
//                         tournament?: string;
//                         format?: string;
//                     }) => ({
//                         type: "player" as const,
//                         id: p.player_id,
//                         name: p.player_name,
//                         playerProfilesId: p.player_id,
//                         jerseyNumber: p.jersey_no ?? undefined,
//                         tournament: p.tournament ?? "",
//                         category: [p.format ?? "T20"],
//                     })
//                 );
//             }

//             // ── Merge: deduplicate by player_id / id ──────────────────────────
//             // Global search may already include some IPL players — keep them
//             // (they have richer data like images). Stats results fill in WPL players.
//             const seen = new Set<string>(globalResults.map((r) => r.playerProfilesId ?? r.id));
//             const newFromStats = statsResults.filter((r) => !seen.has(r.playerProfilesId ?? r.id));
//             const merged: SearchResult[] = [...globalResults, ...newFromStats];

//             // ── Sort: Players first → Users → Teams; WPL after IPL ───────────
//             const typeOrder: Record<string, number> = { player: 1, user: 2, team: 3 };
//             merged.sort((a, b) => {
//                 const ta = typeOrder[a.type] ?? 4;
//                 const tb = typeOrder[b.type] ?? 4;
//                 if (ta !== tb) return ta - tb;
//                 // Within players: IPL before WPL
//                 const aIsWpl = isWPLPlayer(a) ? 1 : 0;
//                 const bIsWpl = isWPLPlayer(b) ? 1 : 0;
//                 return aIsWpl - bIsWpl;
//             });

//             setSearchResults(merged);
//         } catch (error) {
//             console.error("Search failed:", error);
//             setSearchResults([]);
//         } finally {
//             setIsSearching(false);
//         }
//     }, []);

//     const clearSearch = useCallback(() => {
//         setSearchQuery("");
//         setSearchResults([]);
//     }, []);

//     const navigateToResult = useCallback((result: SearchResult) => {
//         if (result.type === "user") {
//             const userId = result.playerProfilesId || result.id;
//             router.push(`/MainModules/Profile?userId=${encodeURIComponent(userId)}`);
//         } else if (isWPLPlayer(result)) {
//             // ← WPL players go to the WPL profile page
//             const profileId = result.playerProfilesId || result.id;
//             router.push(`/MainModules/WplPlayers?id=${encodeURIComponent(profileId)}`);
//         } else {
//             // IPL players + teams
//             const profileId = result.playerProfilesId || result.id;
//             router.push(
//                 `/MainModules/PlayersProfile?id=${encodeURIComponent(profileId)}&tab=highlights`
//             );
//         }

//         setTimeout(() => clearSearch(), 150);
//     }, [clearSearch, router]);

//     return (
//         <GlobalSearchContext.Provider value={{
//             searchQuery,
//             setSearchQuery,
//             searchResults,
//             isSearching,
//             performSearch,
//             clearSearch,
//             navigateToResult,
//         }}>
//             {children}
//         </GlobalSearchContext.Provider>
//     );
// }

// // ── Hook ──────────────────────────────────────────────────────────────────────

// export function useGlobalSearch() {
//     const context = useContext(GlobalSearchContext);
//     if (!context) {
//         throw new Error("useGlobalSearch must be used within GlobalSearchProvider");
//     }
//     return context;
// }






"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// ── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
    type: 'player' | 'team' | 'user';
    id: string;
    name: string;
    image?: string;
    logo?: string;
    playerProfilesId?: string;
    jerseyNumber?: number;
    category?: string[];
    tournament?: string;
}

interface GlobalSearchContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: SearchResult[];
    isSearching: boolean;
    performSearch: (query: string) => Promise<void>;
    clearSearch: () => void;
    navigateToResult: (result: SearchResult) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const WOMEN_TOURNAMENTS = ["womens_ipl", "womens_t20i"];

function isWomenPlayer(result: SearchResult): boolean {
    return result.type === "player" && WOMEN_TOURNAMENTS.includes(result.tournament ?? "");
}

// ── Context ───────────────────────────────────────────────────────────────────

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    const performSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            // Run both in parallel:
            // 1. existing global-search (teams, users, IPL players)
            // 2. player-stats cross-tournament search (womens_ipl + womens_t20i + ipl)
            const [globalRes, playerStatsRes] = await Promise.allSettled([
                axios.get(`/api/global-search?q=${encodeURIComponent(query)}`),
                axios.get(`/api/player-stats?search=${encodeURIComponent(query)}&limit=10`),
            ]);

            // ── Global search results ─────────────────────────────────────────
            let globalResults: SearchResult[] = [];
            if (globalRes.status === "fulfilled") {
                globalResults = globalRes.value.data.results || [];
            }

            // ── Player-stats results (all tournaments) ────────────────────────
            let statsResults: SearchResult[] = [];
            if (playerStatsRes.status === "fulfilled" && playerStatsRes.value.data.success) {
                statsResults = (playerStatsRes.value.data.data ?? []).map(
                    (p: {
                        player_id: string;
                        player_name: string;
                        jersey_no?: number;
                        tournament?: string;
                        format?: string;
                    }) => ({
                        type: "player" as const,
                        id: p.player_id,
                        name: p.player_name,
                        playerProfilesId: p.player_id,
                        jerseyNumber: p.jersey_no ?? undefined,
                        tournament: p.tournament ?? "",
                        category: [p.format ?? "T20"],
                    })
                );
            }

            // ── Merge: deduplicate by player_id ───────────────────────────────
            // Use "player_id|tournament" as key because the same player_id can
            // exist in both womens_ipl and womens_t20i (e.g. Smriti Mandhana)
            const seen = new Set<string>(
                globalResults.map((r) => `${r.playerProfilesId ?? r.id}|${r.tournament ?? ""}`)
            );
            const newFromStats = statsResults.filter((r) => {
                const key = `${r.playerProfilesId ?? r.id}|${r.tournament ?? ""}`;
                return !seen.has(key);
            });
            const merged: SearchResult[] = [...globalResults, ...newFromStats];

            // ── Sort: Players → Users → Teams; women after men within players ─
            const typeOrder: Record<string, number> = { player: 1, user: 2, team: 3 };
            merged.sort((a, b) => {
                const ta = typeOrder[a.type] ?? 4;
                const tb = typeOrder[b.type] ?? 4;
                if (ta !== tb) return ta - tb;
                // Within players: IPL (men) first, then women
                const aW = isWomenPlayer(a) ? 1 : 0;
                const bW = isWomenPlayer(b) ? 1 : 0;
                return aW - bW;
            });

            setSearchResults(merged);
        } catch (error) {
            console.error("Search failed:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery("");
        setSearchResults([]);
    }, []);

    const navigateToResult = useCallback((result: SearchResult) => {
        if (result.type === "user") {
            const userId = result.playerProfilesId || result.id;
            router.push(`/MainModules/Profile?userId=${encodeURIComponent(userId)}`);
        } else if (isWomenPlayer(result)) {
            const profileId = result.playerProfilesId || result.id;
            router.push(
                `/MainModules/WplPlayers?id=${encodeURIComponent(profileId)}&tournament=${encodeURIComponent(result.tournament ?? "womens_ipl")}`
            );
        } else if (result.type === "player" || result.type === "team") {
            const profileId = result.playerProfilesId || result.id;
            router.push(
                `/MainModules/PlayersProfile?id=${encodeURIComponent(profileId)}&tab=highlights`
            );
        }

        setTimeout(() => clearSearch(), 150);
    }, [clearSearch, router]);

    return (
        <GlobalSearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            searchResults,
            isSearching,
            performSearch,
            clearSearch,
            navigateToResult,
        }}>
            {children}
        </GlobalSearchContext.Provider>
    );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useGlobalSearch() {
    const context = useContext(GlobalSearchContext);
    if (!context) {
        throw new Error("useGlobalSearch must be used within GlobalSearchProvider");
    }
    return context;
}