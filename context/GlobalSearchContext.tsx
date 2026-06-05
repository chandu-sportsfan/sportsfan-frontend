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
    playerProfilesId?: string;   // optional – not all results have one
    jerseyNumber?: number;
    category?: string[];
}

interface GlobalSearchContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: SearchResult[];
    isSearching: boolean;
    performSearch: (query: string) => Promise<void>;
    clearSearch: () => void;
    /** Call this when the user clicks any result in the search dropdown. */
    navigateToResult: (result: SearchResult) => void;
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
            const response = await axios.get(`/api/global-search?q=${encodeURIComponent(query)}`);
            const results: SearchResult[] = response.data.results || [];

            // Sort: Players first → Users second → Teams third
            const order: Record<string, number> = { player: 1, user: 2, team: 3 };
            const sorted = [...results].sort((a, b) => {
                const rankA = order[a.type] ?? 4;
                const rankB = order[b.type] ?? 4;
                return rankA - rankB;
            });

            setSearchResults(sorted);
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

    /**
     * Navigate to the correct profile page based on result type, then clear search.
     *
     * • type === "user"   → /MainModules/Profile?userId=<id>
     *     The Profile page reads ?userId and, if it differs from the logged-in
     *     user, renders "Add Friend" instead of "Edit Profile".
     *
     * • type === "player" → /MainModules/PlayersProfile?id=<playerProfilesId>
     *
     * • type === "team"   → /MainModules/PlayersProfile?id=<id>  (adjust if needed)
     */
    const navigateToResult = useCallback((result: SearchResult) => {
        // 1. Trigger the route change FIRST
        // AFTER
if (result.type === "user") {
    router.push(`/MainModules/Profile?userId=${encodeURIComponent(result.id)}`);
}else {
            const profileId = result.playerProfilesId || result.id;
            router.push(
                `/MainModules/PlayersProfile?id=${encodeURIComponent(profileId)}&tab=highlights`
            );
        }

        // 2. Delay the cleanup by 150ms so the router has time to execute
        setTimeout(() => {
            clearSearch();
        }, 150);
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
