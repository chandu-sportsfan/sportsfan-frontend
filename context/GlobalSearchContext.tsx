"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import axios from "axios";

// 1. Add 'user' to the type and make playerProfilesId optional
interface SearchResult {
    type: 'player' | 'team' | 'user'; 
    id: string;
    name: string;
    image?: string;
    logo?: string;
    playerProfilesId?: string; 
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
}

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const performSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await axios.get(`/api/global-search?q=${encodeURIComponent(query)}`);
            const results = response.data.results || [];

            // 2. Sort the array: Players first, Users second, Teams third
            const sortedResults = [...results].sort((a, b) => {
                const order = { player: 1, user: 2, team: 3 };
                const rankA = order[a.type as keyof typeof order] || 4;
                const rankB = order[b.type as keyof typeof order] || 4;
                return rankA - rankB;
            });

            setSearchResults(sortedResults);
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

    return (
        <GlobalSearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            searchResults,
            isSearching,
            performSearch,
            clearSearch
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
