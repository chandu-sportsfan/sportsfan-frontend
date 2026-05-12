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

import { Search, X, SlidersHorizontal, Star, ChevronDown, Menu, Sparkles } from "lucide-react";
import LogoutButton from "../LogoutButton";
import { useGlobalSearch } from "@/context/GlobalSearchContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Mock user data (replace with real auth/context) ───────────────────────
const USER = {
  name: "Arjun Mehta",
  role: "Pro Member",
  points: 12450,
  avatar: "", // put real URL here
};

export default function Header() {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    performSearch,
    clearSearch,
  } = useGlobalSearch();

  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
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
    setMobileSearchOpen(false);
  };

  // Shared search dropdown JSX
  const SearchDropdown = () =>
    showDropdown ? (
      <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-pink-500/20 rounded-2xl shadow-2xl z-50 max-h-[400px] overflow-y-auto">
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
                      <span className="text-xs text-gray-500 uppercase">{result.type === "player" ? "Player" : "Team"}</span>
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
      </div>
    ) : null;

  return (
    <>
      {/* ── DESKTOP (1440px+)  */}
      <header className="hidden xl:flex w-full items-center gap-4 px-6 py-3 bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
        {/* Logo */}
        {/* <Link href="/MainModules/HomePage" className="flex-shrink-0">
          <LogoMark size={48} />
        </Link> */}

        {/* Search + Ask AI */}
        <div className="relative flex-1 max-w-2xl" ref={dropdownRef}>
          <div className="flex items-center gap-0 bg-[#111] border border-white/10 rounded-full overflow-hidden pr-1">
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
          <SearchDropdown />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Preferences */}
          <button className="flex items-center gap-2 bg-transparent hover:bg-pink-500/10 border border-pink-500 text-pink-400 text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
            <SlidersHorizontal size={15} />
            Preferences
          </button>

          {/* Points */}
          <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full px-4 py-2.5">
            <Star size={16} className="text-pink-500 fill-pink-500" />
            <div className="flex flex-col leading-tight">
              <span className="text-white font-semibold text-sm">{USER.points.toLocaleString()}</span>
              <span className="text-gray-500 text-xs">Points</span>
            </div>
          </div>

          {/* User */}
          <button className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full pl-1 pr-3 py-1 hover:bg-white/5 transition-colors">
            <Avatar src={USER.avatar} name={USER.name} size={34} ring />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-white font-medium text-sm">{USER.name}</span>
              <span className="text-pink-400 text-xs">{USER.role}</span>
            </div>
            <ChevronDown size={14} className="text-gray-400 ml-1" />
          </button>

          <LogoutButton />
        </div>
      </header>

      {/* ── TABLET (768px – 1279px) ─────────────────────────────────────── */}
      <header className="hidden md:flex xl:hidden w-full items-center gap-3 px-4 py-3 bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
        <Link href="/MainModules/HomePage" className="flex-shrink-0">
          <LogoMark size={40} />
        </Link>

        <div className="relative flex-1" ref={dropdownRef}>
          <div className="flex items-center gap-0 bg-[#111] border border-white/10 rounded-full overflow-hidden pr-1">
            <Search size={15} className="text-gray-500 ml-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => { if (searchQuery.trim() && searchResults.length > 0) setShowDropdown(true); }}
              placeholder="Search players, teams, jersey numbers..."
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
          <SearchDropdown />
        </div>

        <button className="flex items-center gap-2 border border-pink-500 text-pink-400 text-xs font-medium px-4 py-2 rounded-full hover:bg-pink-500/10 transition-colors whitespace-nowrap">
          <SlidersHorizontal size={13} />
          Preferences
        </button>

        <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full px-3 py-2">
          <Star size={14} className="text-pink-500 fill-pink-500" />
          <div className="flex flex-col leading-tight">
            <span className="text-white font-semibold text-xs">{USER.points.toLocaleString()}</span>
            <span className="text-gray-500 text-[10px]">Points</span>
          </div>
        </div>

        <button className="flex items-center gap-1.5 bg-[#111] border border-white/10 rounded-full pl-1 pr-2 py-1 hover:bg-white/5 transition-colors">
          <Avatar src={USER.avatar} name={USER.name} size={30} ring />
          <div className="flex flex-col items-start leading-tight">
            <span className="text-white font-medium text-xs">{USER.name}</span>
            <span className="text-pink-400 text-[10px]">{USER.role}</span>
          </div>
          <ChevronDown size={12} className="text-gray-400" />
        </button>
      </header>

      {/* ── MOBILE (< 768px) ────────────────────────────────────────────── */}
      <header className="flex md:hidden flex-col bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
        {/* Primary row */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Link href="/MainModules/HomePage" className="flex-shrink-0">
            <LogoMark size={34} />
          </Link>

          {/* Search toggle */}
          <button
            onClick={() => { setMobileSearchOpen((v) => !v); setTimeout(() => mobileInputRef.current?.focus(), 100); }}
            className="w-9 h-9 flex items-center justify-center bg-[#111] border border-white/10 rounded-full hover:bg-white/5 transition-colors"
          >
            <Search size={15} className="text-gray-400" />
          </button>

          {/* Ask AI */}
          <button className="flex items-center gap-1.5 bg-[#111] border border-white/10 text-pink-400 text-xs font-medium px-3 py-2 rounded-full hover:bg-pink-500/10 transition-colors">
            <Sparkles size={12} />
            Ask AI
          </button>

          {/* Preferences */}
          <button className="w-9 h-9 flex items-center justify-center border border-pink-500 bg-pink-500/10 rounded-full">
            <SlidersHorizontal size={14} className="text-pink-400" />
          </button>

          {/* Points */}
          <div className="flex items-center gap-1 bg-[#111] border border-white/10 rounded-full px-3 py-2">
            <Star size={13} className="text-pink-500 fill-pink-500" />
            <span className="text-white font-semibold text-xs">{USER.points.toLocaleString()}</span>
          </div>

          {/* Avatar */}
          <button className="ml-auto">
            <Avatar src={USER.avatar} name={USER.name} size={32} ring />
          </button>

          {/* Hamburger */}
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white">
            <Menu size={18} />
          </button>
        </div>

        {/* Expandable search row */}
        {mobileSearchOpen && (
          <div className="relative px-3 pb-2.5" ref={dropdownRef}>
            <div className="flex items-center gap-0 bg-[#111] border border-white/10 rounded-full overflow-hidden pr-1">
              <Search size={14} className="text-gray-500 ml-3 shrink-0" />
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => { if (searchQuery.trim() && searchResults.length > 0) setShowDropdown(true); }}
                placeholder="Search players, teams..."
                className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-gray-500 px-3 py-2"
              />
              {searchQuery && (
                <button onClick={handleClear} className="mr-1">
                  <X size={13} className="text-gray-500 hover:text-white" />
                </button>
              )}
              <button className="flex items-center gap-1 bg-[#1a1a1a] border border-white/10 text-pink-400 text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap">
                <Sparkles size={11} />
                Ask AI
              </button>
            </div>
            <SearchDropdown />
          </div>
        )}
      </header>
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/20"
    >
      {/* Replace with your actual <Image> or <img> logo */}
      <span className="text-white font-black" style={{ fontSize: size * 0.45 }}>S</span>
    </div>
  );
}

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