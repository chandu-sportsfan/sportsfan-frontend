// // src/components/HomeComponents/Header.tsx
// "use client";

// import { Bell,Search,  X } from "lucide-react";
// import LogoutButton from "../LogoutButton";
// import { useGlobalSearch } from "@/context/GlobalSearchContext";
// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";



// export default function Header() {
//     const { searchQuery, setSearchQuery, searchResults, isSearching, performSearch, clearSearch } = useGlobalSearch();
//     const [showDropdown, setShowDropdown] = useState(false);
//     const dropdownRef = useRef<HTMLDivElement>(null);
//     const inputRef = useRef<HTMLInputElement>(null);
//     const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

//     // Debounced search
//     useEffect(() => {
//         if (searchTimeoutRef.current) {
//             clearTimeout(searchTimeoutRef.current);
//         }

//         if (searchQuery.trim()) {
//             searchTimeoutRef.current = setTimeout(() => {
//                 performSearch(searchQuery);
//             }, 300);
//         } else {
//             setShowDropdown(false);
//         }

//         return () => {
//             if (searchTimeoutRef.current) {
//                 clearTimeout(searchTimeoutRef.current);
//             }
//         };
//     }, [searchQuery, performSearch]);

//     // Show dropdown when typing
//     useEffect(() => {
//         if (searchQuery.trim() && !isSearching) {
//             setShowDropdown(true);
//         }
//     }, [searchQuery, searchResults, isSearching]);

//     // Close dropdown on click outside
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//                 setShowDropdown(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchQuery(e.target.value);
//     };

//     const handleClear = () => {
//         clearSearch();
//         setShowDropdown(false);
//         if (inputRef.current) {
//             inputRef.current.value = "";
//         }
//     };

//     const handleResultClick = () => {
//         setShowDropdown(false);
//         clearSearch();
//     };

//     return (
//         <div className="w-full px-4 lg:px-6 py-3 border-b border-pink-500/20 bg-black flex flex-col gap-3 sticky top-0 z-50">
//             {/* Top row */}
//             <div className="flex items-center justify-between gap-4">
//                 <div>
//                     <Link href="/MainModules/HomePage">
//                         <h1 className="text-lg font-semibold lg:hidden cursor-pointer hover:text-pink-500 transition">SportsFan360</h1>
//                     </Link>
//                 </div>
//                 <div className="hidden lg:block" />
//                 <div>



//                     <div className="flex gap-2 items-center">
//                         <LogoutButton />
//                     </div>
//                 </div>
//             </div>

//             {/* Search row with dropdown */}
//             <div className="relative" ref={dropdownRef}>

//                <div className="flex items-center gap-2">
//   <div className="flex-1 flex items-center gap-2 bg-[#0d1117] px-3 py-2 rounded-full border border-pink-500/20">
//     <Search size={16} className="text-pink-500 shrink-0" />
//     <input
//       ref={inputRef}
//       type="text"
//       value={searchQuery}
//       onChange={handleInputChange}
//       onFocus={() => {
//         if (searchQuery.trim() && searchResults.length > 0) {
//           setShowDropdown(true);
//         }
//       }}
//       placeholder="Search players, teams, jersey numbers..."
//       className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-500"
//     />
//     {searchQuery && (
//       <button onClick={handleClear} className="shrink-0">
//         <X size={14} className="text-gray-400 hover:text-white" />
//       </button>
//     )}
//   </div>

//   <Link href="/MainModules/Notifications">
//     <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0d1117] border border-pink-500/20 hover:bg-pink-500/10 transition-colors">
//       <Bell className="w-4 h-4 text-pink-500" />
//     </button>
//   </Link>
// </div>

//                 {/* Search Results Dropdown */}
//                 {showDropdown && (
//                     <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl z-50 max-h-[400px] overflow-y-auto">
//                         {isSearching ? (
//                             <div className="p-4 text-center text-gray-400">
//                                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500 mx-auto"></div>
//                                 <p className="text-sm mt-2">Searching...</p>
//                             </div>
//                         ) : searchResults.length > 0 ? (
//                             <div>
//                                 {searchResults.map((result) => (
//                                     <Link
//                                         key={`${result.type}-${result.id}`}
//                                         href={result.type === 'player'
//                                             ? `/MainModules/PlayersProfile?id=${result.playerProfilesId}&tab=highlights`
//                                             : `/MainModules/ClubsProfile?teamProfile=${encodeURIComponent(result.name)}`
//                                         }
//                                         onClick={handleResultClick}
//                                     >
//                                         <div className="p-3 hover:bg-gray-800 transition-colors flex items-center gap-3 border-b border-gray-800 last:border-0">
//                                             {/* Image/Logo */}
//                                             <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
//                                                 {result.type === 'player' ? (
//                                                     result.image ? (
//                                                         <img
//                                                             src={result.image}
//                                                             alt={result.name}
//                                                             className="w-full h-full object-cover"
//                                                         />
//                                                     ) : (
//                                                         <div className="w-full h-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">
//                                                             {result.name.charAt(0)}
//                                                         </div>
//                                                     )
//                                                 ) : (
//                                                     result.logo ? (
//                                                         <img
//                                                             src={result.logo}
//                                                             alt={result.name}
//                                                             className="w-full h-full object-cover"
//                                                         />
//                                                     ) : (
//                                                         <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
//                                                             {result.name.charAt(0)}
//                                                         </div>
//                                                     )
//                                                 )}
//                                             </div>

//                                             {/* Details */}
//                                             <div className="flex-1 min-w-0">
//                                                 <div className="flex items-center gap-2">
//                                                     <p className="text-white font-medium text-sm truncate">
//                                                         {result.name}
//                                                     </p>
//                                                     {result.type === 'player' && result.jerseyNumber && (
//                                                         <span className="text-xs bg-pink-500/20 text-pink-500 px-1.5 py-0.5 rounded-full">
//                                                             #{result.jerseyNumber}
//                                                         </span>
//                                                     )}
//                                                     <span className="text-xs text-gray-500 uppercase">
//                                                         {result.type === 'player' ? 'Player' : 'Team'}
//                                                     </span>
//                                                 </div>
//                                                 {/* {result.category && (
//                                                     <p className="text-xs text-gray-400 truncate">
//                                                         {Array.isArray(result.category) 
//                                                             ? result.category.join(', ') 
//                                                             : result.category}
//                                                     </p>
//                                                 )} */}
//                                             </div>
//                                         </div>
//                                     </Link>
//                                 ))}
//                             </div>
//                         ) : searchQuery.trim() ? (
//                             <div className="p-4 text-center text-gray-400">
//                                 <p className="text-sm">No results found for &apos;{searchQuery}&apos;</p>
//                             </div>
//                         ) : null}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }



"use client";

import { Search, X, SlidersHorizontal, Star, ChevronDown, Sparkles, Bell } from "lucide-react";
import { User, Settings, LogOut } from "lucide-react";
import { useGlobalSearch } from "@/context/GlobalSearchContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLeaderboard } from "@/context/LeaderboardContext";
import { useAuth } from "@/context/AuthContext";



export default function Header() {
    const {
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        performSearch,
        clearSearch,
    } = useGlobalSearch();
     const { currentUserPoints } = useLeaderboard();
     const { user, getUserDisplayName, loading: authLoading } = useAuth();
     
    // Helper to format points (e.g., 12.5k for 12500)
    const formatPoints = (pts: number | undefined | null) => {
        if (!pts) return "0";
        if (pts >= 1000) return (pts / 1000).toFixed(1) + "k";
        return pts.toLocaleString();
    };

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileDropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout>(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const mobileProfileDropdownRef = useRef<HTMLDivElement>(null);

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        if (searchQuery.trim()) {
            searchTimeoutRef.current = setTimeout(() => performSearch(searchQuery), 300);
        } else {
            setShowDropdown(false);
        }
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, [searchQuery, performSearch]);

    // Show dropdown when results arrive
    useEffect(() => {
        if (searchQuery.trim() && !isSearching) setShowDropdown(true);
    }, [searchQuery, searchResults, isSearching]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                dropdownRef.current && !dropdownRef.current.contains(target) &&
                mobileDropdownRef.current && !mobileDropdownRef.current.contains(target)
            ) {
                setShowDropdown(false);
            }
            if (
                profileDropdownRef.current && !profileDropdownRef.current.contains(target) &&
                mobileProfileDropdownRef.current && !mobileProfileDropdownRef.current.contains(target)
            ) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

    const handleClear = () => {
        clearSearch();
        setShowDropdown(false);
        if (inputRef.current) inputRef.current.value = "";
        if (mobileInputRef.current) mobileInputRef.current.value = "";
    };

    const handleResultClick = () => {
        setShowDropdown(false);
        clearSearch();
    };

    // Reusable results list
    const ResultsList = () => (
        <>
            {isSearching ? (
                <div className="p-4 text-center text-gray-400">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500 mx-auto" />
                    <p className="text-sm mt-2">Searching…</p>
                </div>
            ) : searchResults.length > 0 ? (
                <div>
                    {searchResults.map((result) => (
                        <Link
                            key={`${result.type}-${result.id}`}
                            href={
                                result.type === "player"
                                    ? `/MainModules/PlayersProfile?id=${result.playerProfilesId}&tab=highlights`
                                    : `/MainModules/ClubsProfile?teamProfile=${encodeURIComponent(result.name)}`
                            }
                            onClick={handleResultClick}
                        >
                            <div className="p-3 hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                                    {result.type === "player" ? (
                                        result.image ? (
                                            <img src={result.image} alt={result.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                                {result.name.charAt(0)}
                                            </div>
                                        )
                                    ) : result.logo ? (
                                        <img src={result.logo} alt={result.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                            {result.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-white font-medium text-sm truncate">{result.name}</p>
                                        {result.type === "player" && result.jerseyNumber && (
                                            <span className="text-xs bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded-full">
                                                #{result.jerseyNumber}
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-500 uppercase">
                                            {result.type === "player" ? "Player" : "Team"}
                                        </span>
                                    </div>
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
        </>
    );

    // Profile dropdown menu items
    const ProfileMenu = ({ onClose }: { onClose: () => void }) => (
        <div className="py-1.5">
            <Link href="/MainModules/Profile" onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
                <User size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                <span className="text-white text-sm font-medium">Profile</span>
            </Link>
            <div className="h-px bg-white/5 mx-4" />
            <Link href="/MainModules/Preferences" onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
                <SlidersHorizontal size={16} className="text-pink-400" />
                <span className="text-pink-400 text-sm font-medium">Preferences</span>
                <span className="ml-auto text-[10px] font-semibold bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/30">
                    Recommended
                </span>
            </Link>
            <div className="h-px bg-white/5 mx-4" />
            <Link href="/MainModules/Settings" onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
                <Settings size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                <span className="text-white text-sm font-medium">Settings</span>
            </Link>
            <div className="h-px bg-white/5 mx-4" />
            <button onClick={onClose}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
                <LogOut size={16} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                <span className="text-white group-hover:text-red-400 text-sm font-medium transition-colors">Logout</span>
            </button>
        </div>
    );

    return (
        <>
            {/* ── DESKTOP (1280px+) ───────────────────────────────────────────── */}
            <header className="hidden xl:flex w-full items-center gap-4 px-6 py-3 bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
                <div className="relative flex-1 max-w-2xl" ref={dropdownRef}>
                    <div className="flex items-center bg-[#111] border border-white/10 rounded-full overflow-hidden pr-1">
                        <Search size={16} className="text-gray-500 ml-4 shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleInputChange}
                            onFocus={() => { if (searchQuery.trim() && searchResults.length > 0) setShowDropdown(true); }}
                            placeholder="Search players, teams, jersey numbers..."
                            className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-gray-500 px-3 py-2.5"
                        />
                        {searchQuery && (
                            <button onClick={handleClear} className="mr-1">
                                <X size={14} className="text-gray-500 hover:text-white transition-colors" />
                            </button>
                        )}
                        <button className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-pink-400 text-sm font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap">
                            <Sparkles size={14} className="text-pink-400" />
                            Ask AI
                        </button>
                    </div>
                    {showDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-pink-500/20 rounded-2xl shadow-2xl z-50 max-h-[400px] overflow-y-auto">
                            <ResultsList />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    <button className="flex items-center gap-2 bg-transparent hover:bg-pink-500/10 border border-pink-500 text-pink-400 text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
                        <SlidersHorizontal size={15} />
                        Preferences
                    </button>

                    <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full px-4 py-2.5">
                        <Star size={16} className="text-pink-500 fill-pink-500" />
                        <div className="flex flex-col leading-tight">
                            <span className="text-white font-semibold text-sm">{formatPoints(currentUserPoints)}</span>
                            {/* <span className="text-gray-500 text-xs">Points</span> */}
                        </div>
                    </div>

                    <Link href="/MainModules/Notifications">
                        <div className="w-9 h-9 flex items-center justify-center bg-[#111] border border-white/10 rounded-full hover:bg-pink-500/10 transition-colors">
                            <Bell size={15} className="text-pink-400" />
                        </div>
                    </Link>

                    <div className="relative" ref={profileDropdownRef}>
                        <button
                            onClick={() => setShowProfileDropdown((v) => !v)}
                            className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full pl-1 pr-3 py-1 hover:bg-white/5 transition-colors"
                        >
                            <Avatar src={""} name={authLoading ? "" : getUserDisplayName()} size={34} ring />
                            <div className="flex flex-col items-start leading-tight">
                                <span className="text-white font-medium text-sm">
                                    {authLoading ? "Loading..." : getUserDisplayName()}
                                </span>
                                <span className="text-pink-400 text-xs">
                                    {authLoading ? "..." : (user?.role || "Pro Member")}
                                </span>
                            </div>
                            <ChevronDown size={14} className={`text-gray-400 ml-1 transition-transform duration-200 ${showProfileDropdown ? "rotate-180" : ""}`} />
                        </button>
                        {showProfileDropdown && (
                            <div className="absolute right-0 top-full mt-3 w-56 bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                                <ProfileMenu onClose={() => setShowProfileDropdown(false)} />
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/*  TABLET (768px – 1279px)  */}
            <header className="hidden md:flex xl:hidden w-full items-center gap-3 px-4 py-2 bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
                <Link href="/MainModules/HomePage" className="flex-shrink-0">
                    <Image src="/images/Logo.png" alt="SportsFan360 logo" width={32} height={36} className="shrink-0" />
                </Link>

                <div className="relative flex-1" ref={dropdownRef}>
                    <div className="flex items-center bg-[#111] border border-white/10 rounded-full overflow-hidden pr-1">
                        <Search size={15} className="text-gray-500 ml-3 shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleInputChange}
                            onFocus={() => { if (searchQuery.trim() && searchResults.length > 0) setShowDropdown(true); }}
                            placeholder="Search players, teams..."
                            className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-gray-500 px-3 py-2"
                        />
                        {searchQuery && (
                            <button onClick={handleClear} className="mr-1">
                                <X size={13} className="text-gray-500 hover:text-white transition-colors" />
                            </button>
                        )}
                        <button className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-pink-400 text-xs font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
                            <Sparkles size={12} />
                            Ask AI
                        </button>
                    </div>
                    {showDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-pink-500/20 rounded-2xl shadow-2xl z-50 max-h-[400px] overflow-y-auto">
                            <ResultsList />
                        </div>
                    )}
                </div>

                <button className="flex items-center gap-2 border border-pink-500 text-pink-400 text-xs font-medium px-4 py-2 rounded-full hover:bg-pink-500/10 transition-colors whitespace-nowrap">
                    <SlidersHorizontal size={13} />
                    Preferences
                </button>

                <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full px-3 py-2">
                    <Star size={14} className="text-pink-500 fill-pink-500" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-white font-semibold text-xs">{formatPoints(currentUserPoints)}</span>
                        {/* <span className="text-gray-500 text-[10px]">Points</span> */}
                    </div>
                </div>

                <Link href="/MainModules/Notifications">
                    <div className="w-9 h-9 flex items-center justify-center bg-[#111] border border-white/10 rounded-full hover:bg-pink-500/10 transition-colors">
                        <Bell size={15} className="text-pink-400" />
                    </div>
                </Link>

                <div className="relative" ref={profileDropdownRef}>
                    <button
                        onClick={() => setShowProfileDropdown((v) => !v)}
                        className="flex items-center gap-1.5 bg-[#111] border border-white/10 rounded-full pl-1 pr-2 py-1 hover:bg-white/5 transition-colors"
                    >
                        <Avatar src={""} name={authLoading ? "" : getUserDisplayName()} size={30} ring />
                        {/* <div className="flex flex-col items-start leading-tight">
                            <span className="text-white font-medium text-xs">{USER.name}</span>
                            <span className="text-pink-400 text-[10px]">{USER.role}</span>
                        </div> */}
                        <ChevronDown size={12} className="text-gray-400" />
                    </button>
                    {showProfileDropdown && (
                        <div className="absolute right-0 top-full mt-3 w-52 bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                            <ProfileMenu onClose={() => setShowProfileDropdown(false)} />
                        </div>
                    )}
                </div>
            </header>

            {/* ── MOBILE (< 768px)  */}
            <header
                className="flex md:hidden flex-col bg-[#0a0a0a] border-b border-white/5"
                style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, overflowX: "hidden" }}
            >
                {/* Row 1: Logo + Search + Ask AI */}
                <div className="flex items-center gap-2 px-3 pt-2.5 pb-2 w-full">
                    <Link href="/MainModules/HomePage" className="flex-shrink-0">
                        <Image src="/images/Logo.png" alt="SportsFan360 logo" width={32} height={36} />
                    </Link>

                    {/* min-w-0 is critical: lets flex-1 shrink below content size */}
                    <div className="relative flex-1 min-w-0" ref={mobileDropdownRef}>
                        <div className="flex items-center bg-[#111] border border-white/10 rounded-full overflow-hidden pr-1">
                            <Search size={14} className="text-gray-500 ml-3 shrink-0" />
                            <input
                                ref={mobileInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={handleInputChange}
                                onFocus={() => { if (searchQuery.trim() && searchResults.length > 0) setShowDropdown(true); }}
                                placeholder="Search players, teams..."
                                className="bg-transparent outline-none text-sm flex-1 min-w-0 text-white placeholder:text-gray-500 px-2 py-2"
                            />
                            {searchQuery && (
                                <button onClick={handleClear} className="shrink-0 mr-1">
                                    <X size={13} className="text-gray-500 hover:text-white transition-colors" />
                                </button>
                            )}
                            <button className="flex items-center gap-1 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-pink-400 text-xs font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap shrink-0">
                                <Sparkles size={11} />
                                Ask AI
                            </button>
                        </div>
                        {showDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-pink-500/20 rounded-2xl shadow-2xl z-50 max-h-[60vh] overflow-y-auto">
                                <ResultsList />
                            </div>
                        )}
                    </div>
                </div>

                {/* Row 2: Icon strip */}
                <div className="flex items-center justify-around pb-2.5 px-2 w-full">
                    {/* Preferences */}
                    <button className="flex flex-col items-center group">
                        <div className="w-9 h-9 flex items-center justify-center border border-pink-500 bg-pink-500/10 rounded-full group-hover:bg-pink-500/20 transition-colors">
                            <SlidersHorizontal size={15} className="text-pink-400" />
                        </div>
                    </button>

                    {/* Points */}
                    <button className="flex flex-col items-center group">
                        <div className="w-9 h-9 flex flex-col items-center justify-center bg-[#111] border border-white/10 rounded-full group-hover:bg-white/5 transition-colors gap-0.5">
                            <Star size={10} className="text-pink-500 fill-pink-500" />
                            <span className="text-[9px] text-gray-400 font-medium leading-none">
                                {formatPoints(currentUserPoints)}
                            </span>
                        </div>
                    </button>

                    {/* Notifications */}
                    <Link href="/MainModules/Notifications">
                        <div className="w-9 h-9 flex items-center justify-center bg-[#111] border border-white/10 rounded-full hover:bg-pink-500/10 transition-colors">
                            <Bell size={15} className="text-pink-400" />
                        </div>
                    </Link>

                    {/* Avatar / Profile — dropdown opens upward */}
                    <div className="relative" ref={mobileProfileDropdownRef}>
                        <button onClick={() => setShowProfileDropdown((v) => !v)}>
                            <Avatar src={""} name={authLoading ? "" : getUserDisplayName()} size={36} ring />
                        </button>
                        {showProfileDropdown && (
                            <div className="absolute right-0 -top-5 bottom-full mb-2 mt-15 w-48 bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-150">
                                <ProfileMenu onClose={() => setShowProfileDropdown(false)} />
                            </div>
                        )}
                    </div>
                </div>
            </header>

          
            <div className="h-[104px] md:hidden" aria-hidden="true" />
        </>
    );
}

// ─── Sub-components 

function Avatar({ src, name, size = 36, ring = false }: { src?: string; name: string; size?: number; ring?: boolean }) {
    return (
        <div
            style={{ width: size, height: size }}
            className={`rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-pink-500 to-orange-500 ${ring ? "ring-2 ring-pink-500/40" : ""}`}
        >
            {src ? (
                <img src={src} alt={name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold" style={{ fontSize: size * 0.4 }}>
                    {name.charAt(0)}
                </div>
            )}
        </div>
    );
}