"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import axios from "axios";

interface SearchResult {
    type: 'player' | 'team';
    id: string;
    name: string;
    image?: string;
    logo?: string;
    playerProfilesId: string;
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
            setSearchResults(response.data.results || []);
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