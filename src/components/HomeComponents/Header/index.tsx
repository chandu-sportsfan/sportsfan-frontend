




// // src/components/HomeComponents/Header.tsx
// "use client";

// import { Bell, MessageCircle, Menu, Search, Home } from "lucide-react";
// import LogoutButton from "../LogoutButton";


// export default function Header() {
//   return (
//     //  Full-width header with border-b so it visually separates from content below
//     <div className="w-full px-4 lg:px-6 py-3 border-b border-pink-500/20 bg-black flex flex-col gap-3">

//       {/* Top row: title (mobile only — hidden on desktop since sidebar has it) + icons */}
//       <div className="flex items-center justify-between">
//         {/* Title — visible only on mobile; desktop sidebar already shows it */}
//         <h1 className="text-lg font-semibold lg:hidden">SportsFan360</h1>
//         {/* On desktop, left side is empty so icons stay right-aligned */}
//         <div className="hidden lg:block" />

//         <div className="flex gap-2 items-center">
//           {/* <button className="p-2 rounded-full border border-pink-500 text-white">
//             <Bell size={16} />
//           </button>
//           <button className="p-2 rounded-full border border-pink-500 text-white">
//             <MessageCircle size={16} />
//           </button>
//           <button className="p-2 rounded-full border border-pink-500 text-white">
//             <Menu size={16} />
//           </button> */}
//           <LogoutButton />
//         </div>
//       </div>

//       {/* Search row */}
//       <div className="flex items-center gap-2">
//         <div className="flex items-center gap-2 bg-[#0d1117] px-3 py-2 rounded-full flex-1 border border-pink-500/20">
//           <Search size={16} className="text-pink-500 shrink-0" />
//           <input
//             placeholder="Search players, teams, stats..."
//             className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-500"
//           />
//         </div>
//         {/* <button className="p-2 border border-pink-500 rounded-full text-white shrink-0">
//           <Home size={16} />
//         </button> */}
//       </div>

//     </div>
//   );
// }
















// src/components/HomeComponents/Header.tsx
"use client";

import { Bell, MessageCircle, Menu, Search, Home, X } from "lucide-react";
import LogoutButton from "../LogoutButton";
import { useGlobalSearch } from "@/context/GlobalSearchContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    const { searchQuery, setSearchQuery, searchResults, isSearching, performSearch, clearSearch } = useGlobalSearch();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (searchQuery.trim()) {
            searchTimeoutRef.current = setTimeout(() => {
                performSearch(searchQuery);
            }, 300);
        } else {
            setShowDropdown(false);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery, performSearch]);

    // Show dropdown when typing
    useEffect(() => {
        if (searchQuery.trim() && !isSearching) {
            setShowDropdown(true);
        }
    }, [searchQuery, searchResults, isSearching]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleClear = () => {
        clearSearch();
        setShowDropdown(false);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleResultClick = () => {
        setShowDropdown(false);
        clearSearch();
    };

    return (
        <div className="w-full px-4 lg:px-6 py-3 border-b border-pink-500/20 bg-black flex flex-col gap-3">
            {/* Top row */}
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold lg:hidden">SportsFan360</h1>
                <div className="hidden lg:block" />
                <div className="flex gap-2 items-center">
                    <LogoutButton />
                </div>
            </div>

            {/* Search row with dropdown */}
            <div className="relative" ref={dropdownRef}>
                <div className="flex items-center gap-2 bg-[#0d1117] px-3 py-2 rounded-full border border-pink-500/20">
                    <Search size={16} className="text-pink-500 shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={() => {
                            if (searchQuery.trim() && searchResults.length > 0) {
                                setShowDropdown(true);
                            }
                        }}
                        placeholder="Search players, teams, jersey numbers..."
                        className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-500"
                    />
                    {searchQuery && (
                        <button onClick={handleClear} className="shrink-0">
                            <X size={14} className="text-gray-400 hover:text-white" />
                        </button>
                    )}
                </div>

                {/* Search Results Dropdown */}
                {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl z-50 max-h-[400px] overflow-y-auto">
                        {isSearching ? (
                            <div className="p-4 text-center text-gray-400">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500 mx-auto"></div>
                                <p className="text-sm mt-2">Searching...</p>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div>
                                {searchResults.map((result) => (
                                    <Link
                                        key={`${result.type}-${result.id}`}
                                        href={result.type === 'player' 
                                            ? `/MainModules/PlayersProfile?id=${result.playerProfilesId}&tab=highlights`
                                            : `/MainModules/ClubsProfile?teamProfile=${encodeURIComponent(result.name)}`
                                        }
                                        onClick={handleResultClick}
                                    >
                                        <div className="p-3 hover:bg-gray-800 transition-colors flex items-center gap-3 border-b border-gray-800 last:border-0">
                                            {/* Image/Logo */}
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                                                {result.type === 'player' ? (
                                                    result.image ? (
                                                        <img 
                                                            src={result.image} 
                                                            alt={result.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                                            {result.name.charAt(0)}
                                                        </div>
                                                    )
                                                ) : (
                                                    result.logo ? (
                                                        <img 
                                                            src={result.logo} 
                                                            alt={result.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                            {result.name.charAt(0)}
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-white font-medium text-sm truncate">
                                                        {result.name}
                                                    </p>
                                                    {result.type === 'player' && result.jerseyNumber && (
                                                        <span className="text-xs bg-pink-500/20 text-pink-500 px-1.5 py-0.5 rounded-full">
                                                            #{result.jerseyNumber}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-gray-500 uppercase">
                                                        {result.type === 'player' ? 'Player' : 'Team'}
                                                    </span>
                                                </div>
                                                {result.category && (
                                                    <p className="text-xs text-gray-400 truncate">
                                                        {Array.isArray(result.category) 
                                                            ? result.category.join(', ') 
                                                            : result.category}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : searchQuery.trim() ? (
                            <div className="p-4 text-center text-gray-400">
                                <p className="text-sm">No results found for &apos;{searchQuery}&apos;</p>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}