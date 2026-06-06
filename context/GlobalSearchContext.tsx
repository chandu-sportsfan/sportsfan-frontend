




// "use client";

// import { createContext, useContext, useState, useCallback, ReactNode } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// interface SearchResult {
//     type: 'player' | 'team' | 'user';
//     id: string;
//     name: string;
//     image?: string;
//     logo?: string;
//     playerProfilesId?: string;
//     jerseyNumber?: number;
//     category?: string[];
//     tournament?: string;
//     // when a player plays in multiple tournaments, this lists all of them
//     allTournaments?: string[];
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

// const WOMEN_TOURNAMENTS = ["womens_ipl", "womens_t20i"];

// function isWomenPlayer(result: SearchResult): boolean {
//     if (result.type !== "player") return false;
//     // true if the primary tournament OR any of allTournaments is a women's tournament
//     const all = result.allTournaments ?? [result.tournament ?? ""];
//     return all.some((t) => WOMEN_TOURNAMENTS.includes(t));
// }

// const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

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
//             const [globalRes, playerStatsRes] = await Promise.allSettled([
//                 axios.get(`/api/global-search?q=${encodeURIComponent(query)}`),
//                 axios.get(`/api/player-stats?search=${encodeURIComponent(query)}&limit=20`),
//             ]);

//             // ── Global search results ──────────────────────────────────────────
//             let globalResults: SearchResult[] = [];
//             if (globalRes.status === "fulfilled") {
//                 globalResults = globalRes.value.data.results || [];
//             }

//             // ── Player-stats results (all tournaments) ─────────────────────────
//             let statsResults: SearchResult[] = [];
//             if (playerStatsRes.status === "fulfilled" && playerStatsRes.value.data.success) {
//                 // Group by player_id so we can collect all tournaments per player
//                 const byPlayerId = new Map<
//                     string,
//                     { primary: SearchResult; tournaments: string[] }
//                 >();

//                 for (const p of playerStatsRes.value.data.data ?? []) {
//                     const t = p.tournament ?? "";
//                     const existing = byPlayerId.get(p.player_id);

//                     if (!existing) {
//                         byPlayerId.set(p.player_id, {
//                             primary: {
//                                 type: "player" as const,
//                                 id: p.player_id,
//                                 name: p.player_name,
//                                 playerProfilesId: p.player_id,
//                                 jerseyNumber: p.jersey_no ?? undefined,
//                                 tournament: t,
//                                 category: [p.format ?? "T20"],
//                             },
//                             tournaments: [t],
//                         });
//                     } else {
//                         // Prefer womens_ipl as the primary tournament label
//                         if (t === "womens_ipl") {
//                             existing.primary.tournament = t;
//                         }
//                         if (!existing.tournaments.includes(t)) {
//                             existing.tournaments.push(t);
//                         }
//                     }
//                 }

//                 statsResults = Array.from(byPlayerId.values()).map(({ primary, tournaments }) => ({
//                     ...primary,
//                     allTournaments: tournaments.length > 1 ? tournaments : undefined,
//                 }));
//             }

//             // ── Merge: deduplicate by player_id only (not player_id|tournament) ─
//             const seenPlayerIds = new Set<string>(
//                 globalResults.map((r) => r.playerProfilesId ?? r.id)
//             );
//             const newFromStats = statsResults.filter(
//                 (r) => !seenPlayerIds.has(r.playerProfilesId ?? r.id)
//             );
//             const merged: SearchResult[] = [...globalResults, ...newFromStats];

//             // ── Sort: Players → Users → Teams; women after men within players ──
//             const typeOrder: Record<string, number> = { player: 1, user: 2, team: 3 };
//             merged.sort((a, b) => {
//                 const ta = typeOrder[a.type] ?? 4;
//                 const tb = typeOrder[b.type] ?? 4;
//                 if (ta !== tb) return ta - tb;
//                 const aW = isWomenPlayer(a) ? 1 : 0;
//                 const bW = isWomenPlayer(b) ? 1 : 0;
//                 return aW - bW;
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
//         } else if (isWomenPlayer(result)) {
//             const profileId = result.playerProfilesId || result.id;
//             // Always navigate without a specific tournament — the profile page
//             // will load both tournaments and show the toggle automatically.
//             // Fall back to the primary tournament if needed for legacy compat.
//             const primaryTournament = result.tournament ?? "womens_ipl";
//             router.push(
//                 `/MainModules/WplPlayers?id=${encodeURIComponent(profileId)}&tournament=${encodeURIComponent(primaryTournament)}`
//             );
//         } else if (result.type === "player" || result.type === "team") {
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

// ── Types ─────────────────────────────────────────────────────────────────────

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
    allTournaments?: string[];
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

// ── Tournament routing helpers ─────────────────────────────────────────────────

const WOMEN_TOURNAMENTS = ["womens_ipl", "womens_t20i"];
const FIFA_TOURNAMENTS  = ["mens_fifa_wc_2022", "mens_fifa_wc_2026", "womens_fifa_wc"];

function isWomenCricketPlayer(result: SearchResult): boolean {
    if (result.type !== "player") return false;
    const all = result.allTournaments ?? [result.tournament ?? ""];
    return all.some((t) => WOMEN_TOURNAMENTS.includes(t));
}

function isFifaPlayer(result: SearchResult): boolean {
    if (result.type !== "player") return false;
    const t = result.tournament ?? "";
    return FIFA_TOURNAMENTS.some((f) => t.startsWith(f.split("_wc")[0])) ||
           t.includes("fifa");
}

// ── Context ───────────────────────────────────────────────────────────────────

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

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
            // Run three in parallel:
            // 1. existing global-search (teams, users, IPL players)
            // 2. player-stats cross-tournament search (womens_ipl + womens_t20i)
            // 3. fifa-player-stats search
            const [globalRes, playerStatsRes, fifaRes] = await Promise.allSettled([
                axios.get(`/api/global-search?q=${encodeURIComponent(query)}`),
                axios.get(`/api/player-stats?search=${encodeURIComponent(query)}&limit=10`),
                axios.get(`/api/fifa-player-stats?search=${encodeURIComponent(query)}&limit=10`),
            ]);

            // ── Global results ─────────────────────────────────────────────────
            let globalResults: SearchResult[] = [];
            if (globalRes.status === "fulfilled") {
                globalResults = globalRes.value.data.results || [];
            }

            // ── WPL / WT20I results ────────────────────────────────────────────
            let statsResults: SearchResult[] = [];
            if (playerStatsRes.status === "fulfilled" && playerStatsRes.value.data.success) {
                const byPlayerId = new Map<string, { primary: SearchResult; tournaments: string[] }>();

                for (const p of playerStatsRes.value.data.data ?? []) {
                    const t = p.tournament ?? "";
                    const existing = byPlayerId.get(p.player_id);
                    if (!existing) {
                        byPlayerId.set(p.player_id, {
                            primary: {
                                type: "player" as const,
                                id: p.player_id,
                                name: p.player_name,
                                playerProfilesId: p.player_id,
                                jerseyNumber: p.jersey_no ?? undefined,
                                tournament: t,
                                category: [p.format ?? "T20"],
                            },
                            tournaments: [t],
                        });
                    } else {
                        if (t === "womens_ipl") existing.primary.tournament = t;
                        if (!existing.tournaments.includes(t)) existing.tournaments.push(t);
                    }
                }

                statsResults = Array.from(byPlayerId.values()).map(({ primary, tournaments }) => ({
                    ...primary,
                    allTournaments: tournaments.length > 1 ? tournaments : undefined,
                }));
            }

            // ── FIFA results ───────────────────────────────────────────────────
            let fifaResults: SearchResult[] = [];
            if (fifaRes.status === "fulfilled" && fifaRes.value.data.success) {
                fifaResults = (fifaRes.value.data.data ?? []).map(
                    (p: {
                        player_id: string;
                        player_name: string;
                        position?: string;
                        team?: string;
                        tournament?: string;
                        season?: number;
                    }) => ({
                        type: "player" as const,
                        id: p.player_id,
                        name: p.player_name,
                        playerProfilesId: p.player_id,
                        tournament: p.tournament ?? "",
                        category: [p.position ?? "Player", p.team ?? ""],
                    })
                );
            }

            // ── Merge: deduplicate by player_id ────────────────────────────────
            const seenIds = new Set<string>(
                globalResults.map((r) => r.playerProfilesId ?? r.id)
            );

            const newFromStats = statsResults.filter(
                (r) => !seenIds.has(r.playerProfilesId ?? r.id)
            );
            newFromStats.forEach((r) => seenIds.add(r.playerProfilesId ?? r.id));

            const newFromFifa = fifaResults.filter(
                (r) => !seenIds.has(r.playerProfilesId ?? r.id)
            );

            const merged: SearchResult[] = [...globalResults, ...newFromStats, ...newFromFifa];

            // ── Sort: Players → Users → Teams; IPL → Women → FIFA ─────────────
            const typeOrder: Record<string, number> = { player: 1, user: 2, team: 3 };
            merged.sort((a, b) => {
                const ta = typeOrder[a.type] ?? 4;
                const tb = typeOrder[b.type] ?? 4;
                if (ta !== tb) return ta - tb;
                // Within players: IPL (0) < Women Cricket (1) < FIFA (2)
                const sportRank = (r: SearchResult) => {
                    if (isFifaPlayer(r))         return 2;
                    if (isWomenCricketPlayer(r)) return 1;
                    return 0;
                };
                return sportRank(a) - sportRank(b);
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
        const profileId = result.playerProfilesId || result.id;

        if (result.type === "user") {
            router.push(`/MainModules/Profile?userId=${encodeURIComponent(profileId)}`);
        } else if (isFifaPlayer(result)) {
            router.push(
                `/MainModules/FifaPlayersProfile?id=${encodeURIComponent(profileId)}&tournament=${encodeURIComponent(result.tournament ?? "")}`
            );
        } else if (isWomenCricketPlayer(result)) {
            router.push(
                `/MainModules/WplPlayers?id=${encodeURIComponent(profileId)}&tournament=${encodeURIComponent(result.tournament ?? "womens_ipl")}`
            );
        } else if (result.type === "player" || result.type === "team") {
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

export function useGlobalSearch() {
    const context = useContext(GlobalSearchContext);
    if (!context) {
        throw new Error("useGlobalSearch must be used within GlobalSearchProvider");
    }
    return context;
}