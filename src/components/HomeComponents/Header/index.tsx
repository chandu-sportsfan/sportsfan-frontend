


// "use client";

// import {
//     Search, X, SlidersHorizontal, Star, ChevronDown, Sparkles, Bell,
//     MessageSquare, User, Settings, LogOut, MessageCircle
// } from "lucide-react";
// import { useGlobalSearch } from "@/context/GlobalSearchContext";
// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useLeaderboard } from "@/context/LeaderboardContext";
// import { useAuth } from "@/context/AuthContext";
// import { useChats } from "@/hooks/useChat";
// import LogoutButton from "../LogoutButton";

// // ── Tournament badge config ───────────────────────────────────────────────────

// type TournamentMeta = {
//     label: string;
//     sublabel: string;
//     badgeBg: string;
//     badgeText: string;
//     avatarFrom: string;
//     avatarTo: string;
//     jerseyBg: string;
//     jerseyText: string;
// };

// const TOURNAMENT_META: Record<string, TournamentMeta> = {
//     womens_ipl: {
//         label: "WPL",
//         sublabel: "Women's Premier League",
//         badgeBg: "bg-[#7c3aed]",
//         badgeText: "text-white",
//         avatarFrom: "from-violet-600",
//         avatarTo: "to-fuchsia-500",
//         jerseyBg: "bg-violet-500/20",
//         jerseyText: "text-violet-300",
//     },
//     womens_t20i: {
//         label: "WT20I",
//         sublabel: "Women's T20 International",
//         badgeBg: "bg-[#0e7490]",
//         badgeText: "text-white",
//         avatarFrom: "from-cyan-600",
//         avatarTo: "to-teal-500",
//         jerseyBg: "bg-cyan-500/20",
//         jerseyText: "text-cyan-300",
//     },
// };

// function getWomenMeta(tournament: string): TournamentMeta | null {
//     return TOURNAMENT_META[tournament] ?? null;
// }

// // ── Bell with badge ───────────────────────────────────────────────────────────

// function BellButton({ unreadCount }: { unreadCount: number }) {
//     const capped = Math.min(unreadCount, 99);
//     return (
//         <Link href="/MainModules/Notifications">
//             <div className="relative w-9 h-9 flex items-center justify-center bg-[#111] border border-white/10 rounded-full hover:bg-pink-500/10 transition-colors">
//                 <Bell size={15} className="text-pink-400" />
//                 {capped > 0 && (
//                     <span className={`absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-[#e91e8c] text-white font-bold leading-none border border-[#07070f] ${capped > 9 ? "min-w-[18px] px-[3px] text-[9px] h-[18px]" : "w-4 h-4 text-[9px]"}`}>
//                         {capped}
//                     </span>
//                 )}
//             </div>
//         </Link>
//     );
// }

// function ChatButton({ unreadCount }: { unreadCount: number }) {
//     const capped = Math.min(unreadCount, 99);
//     return (
//         <Link href="/MainModules/Chat">
//             <div className="relative w-9 h-9 flex items-center justify-center bg-[#111] border border-white/10 rounded-full hover:bg-pink-500/10 transition-colors">
//                 <MessageCircle size={15} className="text-pink-400" />
//                 {capped > 0 && (
//                     <span className={`absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-[#e91e8c] text-white font-bold leading-none border border-[#07070f] ${capped > 9 ? "min-w-[18px] px-[3px] text-[9px] h-[18px]" : "w-4 h-4 text-[9px]"}`}>
//                         {capped}
//                     </span>
//                 )}
//             </div>
//         </Link>
//     );
// }

// function Avatar({ src, name, size = 36, ring = false }: { src?: string; name: string; size?: number; ring?: boolean }) {
//     return (
//         <div
//             style={{ width: size, height: size }}
//             className={`rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-pink-500 to-orange-500 ${ring ? "ring-2 ring-pink-500/40" : ""}`}
//         >
//             {src ? (
//                 <img src={src} alt={name} className="w-full h-full object-cover" />
//             ) : (
//                 <div className="w-full h-full flex items-center justify-center text-white font-bold" style={{ fontSize: size * 0.4 }}>
//                     {name.charAt(0)}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default function Header() {
//     const {
//         searchQuery,
//         setSearchQuery,
//         searchResults,
//         isSearching,
//         performSearch,
//         clearSearch,
//         navigateToResult,
//     } = useGlobalSearch();

//     const { currentUserPoints } = useLeaderboard();
//     const { user, getUserDisplayName, loading: authLoading } = useAuth();
//     const { chats } = useChats();
//     const totalUnreadChats = chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);

//     const formatPoints = (pts: number | undefined | null) => {
//         if (!pts) return "0";
//         if (pts >= 1000) return (pts / 1000).toFixed(1) + "k";
//         return pts.toLocaleString();
//     };

//     const [showDropdown, setShowDropdown] = useState(false);
//     const [showProfileDropdown, setShowProfileDropdown] = useState(false);

//     const dropdownRef         = useRef<HTMLDivElement>(null);
//     const mobileDropdownRef   = useRef<HTMLDivElement>(null);
//     const inputRef            = useRef<HTMLInputElement>(null);
//     const mobileInputRef      = useRef<HTMLInputElement>(null);
//     const searchTimeoutRef    = useRef<NodeJS.Timeout | null>(null);
//     const profileDropdownRef  = useRef<HTMLDivElement>(null);
//     const mobileProfileDropdownRef = useRef<HTMLDivElement>(null);

//     // FIX: removed `performSearch` from the dependency array.
//     // It is now stable (useCallback with [] in context) so omitting it is safe.
//     // Previously, if performSearch was recreated on every render, this effect
//     // would re-run and fire a new search on every render — defeating debounce.
//     useEffect(() => {
//         if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

//         if (!searchQuery.trim()) {
//             setShowDropdown(false);
//             return;
//         }

//         // 400 ms debounce: only fires one search after the user stops typing.
//         // Typing "smriti" (6 chars) = 1 API call instead of 6.
//         searchTimeoutRef.current = setTimeout(() => {
//             performSearch(searchQuery);
//         }, 400);

//         return () => {
//             if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
//         };
//     }, [searchQuery]); // ← searchQuery only; performSearch is stable

//     // Show dropdown when results arrive
//     useEffect(() => {
//         if (searchQuery.trim() && !isSearching) setShowDropdown(true);
//     }, [searchQuery, searchResults, isSearching]);

//     // Close on outside click
//     useEffect(() => {
//         const handleClickOutside = (e: MouseEvent) => {
//             const target = e.target as Node;
//             if (
//                 dropdownRef.current && !dropdownRef.current.contains(target) &&
//                 mobileDropdownRef.current && !mobileDropdownRef.current.contains(target)
//             ) {
//                 setShowDropdown(false);
//                 if (inputRef.current) inputRef.current.value = "";
//                 if (mobileInputRef.current) mobileInputRef.current.value = "";
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

//     const handleClear = () => {
//         clearSearch();
//         setShowDropdown(false);
//         if (inputRef.current) inputRef.current.value = "";
//         if (mobileInputRef.current) mobileInputRef.current.value = "";
//     };

//     const handleAskAIClick = () => {
//         setTimeout(() => handleClear(), 50);
//     };

//     // ── Results list ──────────────────────────────────────────────────────────
//     const ResultsList = () => (
//         <>
//             {isSearching ? (
//                 <div className="p-4 text-center text-gray-400">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500 mx-auto" />
//                     <p className="text-sm mt-2">Searching…</p>
//                 </div>
//             ) : searchResults.length > 0 ? (
//                 <div>
//                     {searchResults.map((result) => {
//                         const womenMeta = result.type === "player"
//                             ? getWomenMeta(result.tournament ?? "")
//                             : null;

//                         return (
//                             <button
//                                 key={`${result.type}-${result.id}-${result.tournament ?? ""}`}
//                                 onMouseDown={(e) => {
//                                     e.preventDefault();
//                                     setShowDropdown(false);
//                                     navigateToResult(result);
//                                 }}
//                                 className="w-full text-left p-3 hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0 cursor-pointer"
//                             >
//                                 {/* Avatar */}
//                                 <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
//                                     {result.type === "player" || result.type === "user" ? (
//                                         result.image ? (
//                                             <img src={result.image} alt={result.name} className="w-full h-full object-cover" />
//                                         ) : (
//                                             <div className={`w-full h-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${womenMeta
//                                                 ? `${womenMeta.avatarFrom} ${womenMeta.avatarTo}`
//                                                 : "from-pink-500 to-orange-500"
//                                                 }`}>
//                                                 {result.name.charAt(0)}
//                                             </div>
//                                         )
//                                     ) : result.logo ? (
//                                         <img src={result.logo} alt={result.name} className="w-full h-full object-cover" />
//                                     ) : (
//                                         <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
//                                             {result.name.charAt(0)}
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Name + badges */}
//                                 <div className="flex-1 min-w-0">
//                                     <div className="flex items-center gap-1.5 flex-wrap">
//                                         <p className="text-white font-medium text-sm truncate">{result.name}</p>

//                                         {/* Jersey number */}
//                                         {result.type === "player" && result.jerseyNumber && (
//                                             <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${womenMeta
//                                                 ? `${womenMeta.jerseyBg} ${womenMeta.jerseyText}`
//                                                 : "bg-pink-500/20 text-pink-400"
//                                                 }`}>
//                                                 #{result.jerseyNumber}
//                                             </span>
//                                         )}

//                                         {/* Tournament badge — WPL / WT20I */}
//                                         {womenMeta && (
//                                             <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full flex-shrink-0 ${womenMeta.badgeBg} ${womenMeta.badgeText} tracking-wide`}>
//                                                 {womenMeta.label}
//                                             </span>
//                                         )}

//                                         {/* Type badge */}
//                                         <span className={`text-xs font-semibold uppercase px-1.5 py-0.5 rounded-full flex-shrink-0 ${result.type === "user"
//                                             ? "bg-blue-500/20 text-blue-400"
//                                             : result.type === "player"
//                                                 ? womenMeta
//                                                     ? `${womenMeta.jerseyBg} ${womenMeta.jerseyText}`
//                                                     : "bg-pink-500/10 text-gray-400"
//                                                 : "bg-purple-500/10 text-gray-400"
//                                             }`}>
//                                             {result.type === "user" ? "User" : result.type === "player" ? "Player" : "Team"}
//                                         </span>
//                                     </div>

//                                     {/* Sub-label */}
//                                     {womenMeta && (
//                                         <p className="text-[10px] mt-0.5 leading-none" style={{ color: "rgba(165,243,252,0.6)" }}>
//                                             {womenMeta.sublabel}
//                                         </p>
//                                     )}
//                                 </div>
//                             </button>
//                         );
//                     })}
//                 </div>
//             ) : searchQuery.trim() ? (
//                 <div className="p-4 text-center text-gray-400">
//                     <p className="text-sm">No results found for &apos;{searchQuery}&apos;</p>
//                 </div>
//             ) : null}
//         </>
//     );

//     // ── Profile menu ──────────────────────────────────────────────────────────
//     const ProfileMenu = ({ onClose }: { onClose: () => void }) => (
//         <div className="py-1.5">
//             <Link href="/MainModules/Profile" onClick={onClose}
//                 className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
//                 <User size={16} className="text-gray-400 group-hover:text-white transition-colors" />
//                 <span className="text-white text-sm font-medium">Profile</span>
//             </Link>
//             <div className="h-px bg-white/5 mx-4" />
//             <Link href="/MainModules/Preferences" onClick={onClose}
//                 className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
//                 <SlidersHorizontal size={16} className="text-pink-400" />
//                 <span className="text-pink-400 text-sm font-medium">Preferences</span>
//                 <span className="ml-auto text-[8px] font-semibold bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/30">
//                     Recommended
//                 </span>
//             </Link>
//             <div className="h-px bg-white/5 mx-4" />
//             <Link href="/MainModules/Settings" onClick={onClose}
//                 className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
//                 <Settings size={16} className="text-gray-400 group-hover:text-white transition-colors" />
//                 <span className="text-white text-sm font-medium">Settings</span>
//             </Link>
//             <div className="h-px bg-white/5 mx-4" />
//             <LogoutButton className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
//                 <LogOut size={16} className="text-gray-400 group-hover:text-red-400 transition-colors" />
//                 <span className="text-white group-hover:text-red-400 text-sm font-medium transition-colors">Logout</span>
//             </LogoutButton>
//         </div>
//     );

//     return (
//         <>
//             {/* ── DESKTOP (1280px+)  */}
//             <header className="hidden xl:flex w-full items-center gap-4 px-6 py-3 bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
//                 <div className="relative flex-1 max-w-2xl" ref={dropdownRef}>
//                     <div className="flex items-center bg-[#111] border border-white/10 rounded-full overflow-hidden pr-1">
//                         <Search size={16} className="text-gray-500 ml-4 shrink-0" />
//                         <input
//                             ref={inputRef}
//                             type="text"
//                             maxLength={100}
//                             value={searchQuery}
//                             onChange={handleInputChange}
//                             onFocus={() => { if (searchQuery.trim() && searchResults.length > 0) setShowDropdown(true); }}
//                             placeholder="Search players, teams, jersey numbers..."
//                             className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-gray-500 px-3 py-2.5"
//                         />
//                         {searchQuery && (
//                             <button onClick={handleClear} className="mr-1">
//                                 <X size={14} className="text-gray-500 hover:text-white transition-colors" />
//                             </button>
//                         )}
//                         <Link href={searchQuery.trim()
//                             ? `/MainModules/AskAI?q=${encodeURIComponent(searchQuery.trim().slice(0, 100))}`
//                             : "/MainModules/AskAI"}>
//                             <button onClick={handleAskAIClick}
//                                 className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-pink-400 text-sm font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap">
//                                 <Sparkles size={14} className="text-pink-400" />
//                                 Ask AI
//                             </button>
//                         </Link>
//                     </div>
//                     {showDropdown && (
//                         <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-pink-500/20 rounded-2xl shadow-2xl z-50 max-h-[400px] overflow-y-auto">
//                             <ResultsList />
//                         </div>
//                     )}
//                 </div>

//                 <div className="flex items-center gap-3 ml-auto">
//                     <button className="flex items-center gap-2 bg-transparent hover:bg-pink-500/10 border border-pink-500 text-pink-400 text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
//                         <SlidersHorizontal size={15} />
//                         Preferences
//                     </button>
//                     <ChatButton unreadCount={totalUnreadChats} />
//                     <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full px-4 py-2.5">
//                         <Star size={16} className="text-pink-500 fill-pink-500" />
//                         <span className="text-white font-semibold text-sm">{formatPoints(currentUserPoints)}</span>
//                     </div>
//                     <BellButton unreadCount={0} />
//                     <div className="relative" ref={profileDropdownRef}>
//                         <button
//                             onClick={() => setShowProfileDropdown((v) => !v)}
//                             className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full pl-1 pr-3 py-1 hover:bg-white/5 transition-colors"
//                         >
//                             <Avatar src={""} name={authLoading ? "" : getUserDisplayName()} size={34} ring />
//                             <div className="flex flex-col items-start leading-tight">
//                                 <span className="text-white font-medium text-sm">
//                                     {authLoading ? "Loading..." : getUserDisplayName()}
//                                 </span>
//                                 <span className="text-pink-400 text-xs">
//                                     {authLoading ? "..." : (user?.role || "user")}
//                                 </span>
//                             </div>
//                             <ChevronDown size={14} className={`text-gray-400 ml-1 transition-transform duration-200 ${showProfileDropdown ? "rotate-180" : ""}`} />
//                         </button>
//                         {showProfileDropdown && (
//                             <div className="absolute right-0 top-full mt-3 w-56 bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
//                                 <ProfileMenu onClose={() => setShowProfileDropdown(false)} />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </header>

//             {/* ── TABLET (768px – 1279px)  */}
//             <header className="hidden md:flex xl:hidden w-full items-center gap-3 px-4 py-2 bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
//                 <Link href="/MainModules/HomePage" className="flex-shrink-0">
//                     <Image src="/images/Logo.png" alt="SportsFan360 logo" width={32} height={36} className="shrink-0" />
//                 </Link>

//                 <div className="relative flex-1" ref={dropdownRef}>
//                     <div className="flex items-center bg-[#111] border border-white/10 rounded-full overflow-hidden pr-1">
//                         <Search size={15} className="text-gray-500 ml-3 shrink-0" />
//                         <input
//                             ref={inputRef}
//                             type="text"
//                             maxLength={100}
//                             value={searchQuery}
//                             onChange={handleInputChange}
//                             onFocus={() => { if (searchQuery.trim() && searchResults.length > 0) setShowDropdown(true); }}
//                             placeholder="Search players, teams..."
//                             className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-gray-500 px-3 py-2"
//                         />
//                         {searchQuery && (
//                             <button onClick={handleClear} className="mr-1">
//                                 <X size={13} className="text-gray-500 hover:text-white transition-colors" />
//                             </button>
//                         )}
//                         <Link href={searchQuery.trim()
//                             ? `/MainModules/AskAI?q=${encodeURIComponent(searchQuery.trim().slice(0, 100))}`
//                             : "/MainModules/AskAI"}>
//                             <button onClick={handleAskAIClick}
//                                 className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-pink-400 text-xs font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
//                                 <Sparkles size={12} />
//                                 Ask AI
//                             </button>
//                         </Link>
//                     </div>
//                     {showDropdown && (
//                         <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-pink-500/20 rounded-2xl shadow-2xl z-50 max-h-[400px] overflow-y-auto">
//                             <ResultsList />
//                         </div>
//                     )}
//                 </div>

//                 <button className="flex items-center gap-2 border border-pink-500 text-pink-400 text-xs font-medium px-4 py-2 rounded-full hover:bg-pink-500/10 transition-colors whitespace-nowrap">
//                     <SlidersHorizontal size={13} />
//                     Preferences
//                 </button>
//                 <ChatButton unreadCount={totalUnreadChats} />
//                 <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full px-3 py-2">
//                     <Star size={14} className="text-pink-500 fill-pink-500" />
//                     <span className="text-white font-semibold text-xs">{formatPoints(currentUserPoints)}</span>
//                 </div>
//                 <BellButton unreadCount={0} />
//                 <div className="relative" ref={profileDropdownRef}>
//                     <button
//                         onClick={() => setShowProfileDropdown((v) => !v)}
//                         className="flex items-center gap-1.5 bg-[#111] border border-white/10 rounded-full pl-1 pr-2 py-1 hover:bg-white/5 transition-colors"
//                     >
//                         <Avatar src={""} name={authLoading ? "" : getUserDisplayName()} size={30} ring />
//                         <ChevronDown size={12} className="text-gray-400" />
//                     </button>
//                     {showProfileDropdown && (
//                         <div className="absolute right-0 top-full mt-3 w-52 bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
//                             <ProfileMenu onClose={() => setShowProfileDropdown(false)} />
//                         </div>
//                     )}
//                 </div>
//             </header>

//             {/* ── MOBILE (< 768px) ──────────────────────────────────────────────── */}
//             <header
//                 className="flex md:hidden flex-col bg-[#0a0a0a] border-b border-white/5"
//                 style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}
//             >
//                 <div className="flex items-center gap-2 px-3 pt-2.5 pb-2 w-full">
//                     <Link href="/MainModules/HomePage" className="flex-shrink-0">
//                         <Image src="/images/Logo.png" alt="SportsFan360 logo" width={32} height={36} />
//                     </Link>

//                     <div className="relative flex-1 min-w-0" ref={mobileDropdownRef}>
//                         <div className="flex items-center bg-[#111] border border-white/10 rounded-full overflow-hidden pr-1">
//                             <Search size={14} className="text-gray-500 ml-3 shrink-0" />
//                             <input
//                                 ref={mobileInputRef}
//                                 type="text"
//                                 maxLength={100}
//                                 value={searchQuery}
//                                 onChange={handleInputChange}
//                                 onFocus={() => { if (searchQuery.trim() && searchResults.length > 0) setShowDropdown(true); }}
//                                 placeholder="Search players, teams..."
//                                 className="bg-transparent outline-none text-sm flex-1 min-w-0 text-white placeholder:text-gray-500 px-2 py-2"
//                             />
//                             {searchQuery && (
//                                 <button onClick={handleClear} className="shrink-0 mr-1">
//                                     <X size={13} className="text-gray-500 hover:text-white transition-colors" />
//                                 </button>
//                             )}
//                             <Link href={searchQuery.trim()
//                                 ? `/MainModules/AskAI?q=${encodeURIComponent(searchQuery.trim().slice(0, 100))}`
//                                 : "/MainModules/AskAI"}>
//                                 <button onClick={handleAskAIClick}
//                                     className="flex items-center gap-1 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-pink-400 text-xs font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap shrink-0">
//                                     <Sparkles size={11} />
//                                     Ask AI
//                                 </button>
//                             </Link>
//                         </div>
//                         {showDropdown && (
//                             <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-pink-500/20 rounded-2xl shadow-2xl z-50 max-h-[60vh] overflow-y-auto">
//                                 <ResultsList />
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div className="flex items-center justify-around pb-2.5 px-2 w-full">
//                     <button className="flex flex-col items-center group">
//                         <div className="w-9 h-9 flex items-center justify-center border border-pink-500 bg-pink-500/10 rounded-full group-hover:bg-pink-500/20 transition-colors">
//                             <SlidersHorizontal size={15} className="text-pink-400" />
//                         </div>
//                     </button>
//                     <ChatButton unreadCount={totalUnreadChats} />
//                     <button className="flex flex-col items-center group">
//                         <div className="w-9 h-9 flex flex-col items-center justify-center bg-[#111] border border-white/10 rounded-full group-hover:bg-white/5 transition-colors gap-0.5">
//                             <Star size={10} className="text-pink-500 fill-pink-500" />
//                             <span className="text-[9px] text-gray-400 font-medium leading-none">
//                                 {formatPoints(currentUserPoints)}
//                             </span>
//                         </div>
//                     </button>
//                     <BellButton unreadCount={0} />
//                     <div className="relative" ref={mobileProfileDropdownRef}>
//                         <button onClick={() => setShowProfileDropdown((v) => !v)}>
//                             <Avatar src={""} name={authLoading ? "" : getUserDisplayName()} size={36} ring />
//                         </button>
//                         {showProfileDropdown && (
//                             <div className="absolute right-0 top-full mt-2 w-48 bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-[100]">
//                                 <ProfileMenu onClose={() => setShowProfileDropdown(false)} />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </header>

//             <div className="h-[104px] md:hidden" aria-hidden="true" />
//         </>
//     );
// }








"use client";

import {
  Search,
  X,
  SlidersHorizontal,
  Star,
  ChevronDown,
  Sparkles,
  Bell,
  User,
  Settings,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { useGlobalSearch } from "@/context/GlobalSearchContext";
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  memo,
  useCallback,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useLeaderboard } from "@/context/LeaderboardContext";
import { useAuth } from "@/context/AuthContext";
import { useChats } from "@/hooks/useChat";
import LogoutButton from "../LogoutButton";

// ── Tournament badge config ───────────────────────────────────────────────────

type TournamentMeta = {
  label: string;
  sublabel: string;
  badgeBg: string;
  badgeText: string;
  avatarFrom: string;
  avatarTo: string;
  jerseyBg: string;
  jerseyText: string;
};

const TOURNAMENT_META: Record<string, TournamentMeta> = {
  womens_ipl: {
    label: "WPL",
    sublabel: "Women's Premier League",
    badgeBg: "bg-[#7c3aed]",
    badgeText: "text-white",
    avatarFrom: "from-violet-600",
    avatarTo: "to-fuchsia-500",
    jerseyBg: "bg-violet-500/20",
    jerseyText: "text-violet-300",
  },
  womens_t20i: {
    label: "WT20I",
    sublabel: "Women's T20 International",
    badgeBg: "bg-[#0e7490]",
    badgeText: "text-white",
    avatarFrom: "from-cyan-600",
    avatarTo: "to-teal-500",
    jerseyBg: "bg-cyan-500/20",
    jerseyText: "text-cyan-300",
  },
};

function getWomenMeta(tournament: string): TournamentMeta | null {
  return TOURNAMENT_META[tournament] ?? null;
}

// ── Memoized sub-components ───────────────────────────────────────────────────
// Wrapping these in memo means they only re-render when their own props change,
// not every time the parent Header re-renders (e.g. on searchQuery changes).

const BellButton = memo(function BellButton({
  unreadCount,
}: {
  unreadCount: number;
}) {
  const capped = Math.min(unreadCount, 99);
  return (
    <Link href="/MainModules/Notifications">
      <div className="relative w-9 h-9 flex items-center justify-center bg-[#111] border border-white/10 rounded-full hover:bg-pink-500/10 transition-colors">
        <Bell size={15} className="text-pink-400" />
        {capped > 0 && (
          <span
            className={`absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-[#e91e8c] text-white font-bold leading-none border border-[#07070f] ${
              capped > 9
                ? "min-w-[18px] px-[3px] text-[9px] h-[18px]"
                : "w-4 h-4 text-[9px]"
            }`}
          >
            {capped}
          </span>
        )}
      </div>
    </Link>
  );
});

const ChatButton = memo(function ChatButton({
  unreadCount,
}: {
  unreadCount: number;
}) {
  const capped = Math.min(unreadCount, 99);
  return (
    <Link href="/MainModules/Chat">
      <div className="relative w-9 h-9 flex items-center justify-center bg-[#111] border border-white/10 rounded-full hover:bg-pink-500/10 transition-colors">
        <MessageCircle size={15} className="text-pink-400" />
        {capped > 0 && (
          <span
            className={`absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-[#e91e8c] text-white font-bold leading-none border border-[#07070f] ${
              capped > 9
                ? "min-w-[18px] px-[3px] text-[9px] h-[18px]"
                : "w-4 h-4 text-[9px]"
            }`}
          >
            {capped}
          </span>
        )}
      </div>
    </Link>
  );
});

const Avatar = memo(function Avatar({
  src,
  name,
  size = 36,
  ring = false,
}: {
  src?: string;
  name: string;
  size?: number;
  ring?: boolean;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-pink-500 to-orange-500 ${
        ring ? "ring-2 ring-pink-500/40" : ""
      }`}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-white font-bold"
          style={{ fontSize: size * 0.4 }}
        >
          {name.charAt(0)}
        </div>
      )}
    </div>
  );
});

// ── Points pill ───────────────────────────────────────────────────────────────
// Isolated so only it re-renders when points change, not the whole header.
const PointsPill = memo(function PointsPill({
  points,
  loading,
  small = false,
}: {
  points: number | null;
  loading: boolean;
  small?: boolean;
}) {
  // Memoized formatting — only recalculates when `points` changes
  const formatted = useMemo(() => {
    if (points == null) return "0";
    if (points >= 1000) return (points / 1000).toFixed(1) + "k";
    return points.toLocaleString();
  }, [points]);

  if (small) {
    // Mobile compact version
    return (
      <button className="flex flex-col items-center group">
        <div className="w-9 h-9 flex flex-col items-center justify-center bg-[#111] border border-white/10 rounded-full group-hover:bg-white/5 transition-colors gap-0.5">
          <Star size={10} className="text-pink-500 fill-pink-500" />
          {loading ? (
            <div className="w-3 h-1.5 bg-white/10 rounded-full animate-pulse" />
          ) : (
            <span className="text-[9px] text-gray-400 font-medium leading-none">
              {formatted}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full px-3 py-2">
      <Star
        size={small ? 14 : 16}
        className="text-pink-500 fill-pink-500 shrink-0"
      />
      {loading ? (
        // Skeleton shimmer while loading — avoids layout shift
        <div className="w-8 h-3.5 bg-white/10 rounded-full animate-pulse" />
      ) : (
        <span
          className={`text-white font-semibold ${small ? "text-xs" : "text-sm"}`}
        >
          {formatted}
        </span>
      )}
    </div>
  );
});

export default function Header() {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    performSearch,
    clearSearch,
    navigateToResult,
  } = useGlobalSearch();

  const { currentUserPoints, loading: pointsLoading } = useLeaderboard();
  const { user, getUserDisplayName, loading: authLoading } = useAuth();
  const { chats } = useChats();

  // Memoized so it doesn't recalculate on every render
  const totalUnreadChats = useMemo(
    () => chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0),
    [chats]
  );

  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileProfileDropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search — 400 ms, performSearch excluded from deps (stable useCallback)
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!searchQuery.trim()) {
      setShowDropdown(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 400);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]); // ← searchQuery only; performSearch is stable

  // Show dropdown when results arrive
  useEffect(() => {
    if (searchQuery.trim() && !isSearching) setShowDropdown(true);
  }, [searchQuery, searchResults, isSearching]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(target)
      ) {
        setShowDropdown(false);
        if (inputRef.current) inputRef.current.value = "";
        if (mobileInputRef.current) mobileInputRef.current.value = "";
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    [setSearchQuery]
  );

  const handleClear = useCallback(() => {
    clearSearch();
    setShowDropdown(false);
    if (inputRef.current) inputRef.current.value = "";
    if (mobileInputRef.current) mobileInputRef.current.value = "";
  }, [clearSearch]);

  const handleAskAIClick = useCallback(() => {
    setTimeout(() => handleClear(), 50);
  }, [handleClear]);

  // Stable display name — avoids recomputing on unrelated re-renders
  const displayName = useMemo(
    () => (authLoading ? "" : getUserDisplayName()),
    [authLoading, getUserDisplayName]
  );

  const userRole = useMemo(
    () => (authLoading ? "..." : user?.role || "user"),
    [authLoading, user?.role]
  );

  // ── Search results list ───────────────────────────────────────────────────
  const ResultsList = useCallback(
    () => (
      <>
        {isSearching ? (
          <div className="p-4 text-center text-gray-400">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-pink-500 mx-auto" />
            <p className="text-sm mt-2">Searching…</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div>
            {searchResults.map((result) => {
              const womenMeta =
                result.type === "player"
                  ? getWomenMeta(result.tournament ?? "")
                  : null;

              return (
                <button
                  key={`${result.type}-${result.id}-${result.tournament ?? ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowDropdown(false);
                    navigateToResult(result);
                  }}
                  className="w-full text-left p-3 hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0 cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                    {result.type === "player" || result.type === "user" ? (
                      result.image ? (
                        <img
                          src={result.image}
                          alt={result.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${
                            womenMeta
                              ? `${womenMeta.avatarFrom} ${womenMeta.avatarTo}`
                              : "from-pink-500 to-orange-500"
                          }`}
                        >
                          {result.name.charAt(0)}
                        </div>
                      )
                    ) : result.logo ? (
                      <img
                        src={result.logo}
                        alt={result.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {result.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Name + badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-white font-medium text-sm truncate">
                        {result.name}
                      </p>

                      {result.type === "player" && result.jerseyNumber && (
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                            womenMeta
                              ? `${womenMeta.jerseyBg} ${womenMeta.jerseyText}`
                              : "bg-pink-500/20 text-pink-400"
                          }`}
                        >
                          #{result.jerseyNumber}
                        </span>
                      )}

                      {womenMeta && (
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full flex-shrink-0 ${womenMeta.badgeBg} ${womenMeta.badgeText} tracking-wide`}
                        >
                          {womenMeta.label}
                        </span>
                      )}

                      <span
                        className={`text-xs font-semibold uppercase px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                          result.type === "user"
                            ? "bg-blue-500/20 text-blue-400"
                            : result.type === "player"
                            ? womenMeta
                              ? `${womenMeta.jerseyBg} ${womenMeta.jerseyText}`
                              : "bg-pink-500/10 text-gray-400"
                            : "bg-purple-500/10 text-gray-400"
                        }`}
                      >
                        {result.type === "user"
                          ? "User"
                          : result.type === "player"
                          ? "Player"
                          : "Team"}
                      </span>
                    </div>

                    {womenMeta && (
                      <p
                        className="text-[10px] mt-0.5 leading-none"
                        style={{ color: "rgba(165,243,252,0.6)" }}
                      >
                        {womenMeta.sublabel}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : searchQuery.trim() ? (
          <div className="p-4 text-center text-gray-400">
            <p className="text-sm">
              No results found for &apos;{searchQuery}&apos;
            </p>
          </div>
        ) : null}
      </>
    ),
    [isSearching, searchResults, searchQuery, navigateToResult]
  );

  // ── Profile menu ──────────────────────────────────────────────────────────
  const ProfileMenu = useCallback(
    ({ onClose }: { onClose: () => void }) => (
      <div className="py-1.5">
        <Link
          href="/MainModules/Profile"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
        >
          <User
            size={16}
            className="text-gray-400 group-hover:text-white transition-colors"
          />
          <span className="text-white text-sm font-medium">Profile</span>
        </Link>
        <div className="h-px bg-white/5 mx-4" />
        <Link
          href="/MainModules/RoarPreference"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
        >
          <SlidersHorizontal size={16} className="text-pink-400" />
          <span className="text-pink-400 text-sm font-medium">Preferences</span>
          <span className="ml-auto text-[8px] font-semibold bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/30">
            Recommended
          </span>
        </Link>
        <div className="h-px bg-white/5 mx-4" />
        {/* <Link
          href="/MainModules/Settings"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
        >
          <Settings
            size={16}
            className="text-gray-400 group-hover:text-white transition-colors"
          />
          <span className="text-white text-sm font-medium">Settings</span>
        </Link> */}
        <div className="h-px bg-white/5 mx-4" />
        <LogoutButton className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
          <LogOut
            size={16}
            className="text-gray-400 group-hover:text-red-400 transition-colors"
          />
          <span className="text-white group-hover:text-red-400 text-sm font-medium transition-colors">
            Logout
          </span>
        </LogoutButton>
      </div>
    ),
    []
  );

  const askAIHref = useMemo(
    () =>
      searchQuery.trim()
        ? `/MainModules/AskAI?q=${encodeURIComponent(
            searchQuery.trim().slice(0, 100)
          )}`
        : "/MainModules/AskAI",
    [searchQuery]
  );

  return (
    <>
      {/* ── DESKTOP (1280px+) ─────────────────────────────────────────────── */}
      <header className="hidden xl:flex w-full items-center gap-4 px-6 py-3 bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
        <div className="relative flex-1 max-w-2xl" ref={dropdownRef}>
          <div className="flex items-center bg-[#111] border border-white/10 rounded-full overflow-hidden pr-1">
            <Search size={16} className="text-gray-500 ml-4 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              maxLength={100}
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => {
                if (searchQuery.trim() && searchResults.length > 0)
                  setShowDropdown(true);
              }}
              placeholder="Search players, teams, jersey numbers..."
              className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-gray-500 px-3 py-2.5"
            />
            {searchQuery && (
              <button onClick={handleClear} className="mr-1">
                <X
                  size={14}
                  className="text-gray-500 hover:text-white transition-colors"
                />
              </button>
            )}
            <Link href={askAIHref}>
              <button
                onClick={handleAskAIClick}
                className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-pink-400 text-sm font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap"
              >
                <Sparkles size={14} className="text-pink-400" />
                Ask AI
              </button>
            </Link>
          </div>
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-pink-500/20 rounded-2xl shadow-2xl z-50 max-h-[400px] overflow-y-auto">
              <ResultsList />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* <button className="flex items-center gap-2 bg-transparent hover:bg-pink-500/10 border border-pink-500 text-pink-400 text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
            <SlidersHorizontal size={15} />
            Preferences
          </button> */}
          <ChatButton unreadCount={totalUnreadChats} />
          {/* PointsPill only re-renders when points/loading changes */}
          <PointsPill points={currentUserPoints} loading={pointsLoading} />
          <BellButton unreadCount={0} />
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setShowProfileDropdown((v) => !v)}
              className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full pl-1 pr-3 py-1 hover:bg-white/5 transition-colors"
            >
              <Avatar src="" name={displayName} size={34} ring />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-white font-medium text-sm">
                  {authLoading ? "Loading..." : displayName}
                </span>
                <span className="text-pink-400 text-xs">{userRole}</span>
              </div>
              <ChevronDown
                size={14}
                className={`text-gray-400 ml-1 transition-transform duration-200 ${
                  showProfileDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-3 w-56 bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                <ProfileMenu onClose={() => setShowProfileDropdown(false)} />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── TABLET (768px – 1279px) ───────────────────────────────────────── */}
      <header className="hidden md:flex xl:hidden w-full items-center gap-3 px-4 py-2 bg-[#0a0a0a] border-b border-white/5 sticky top-0 z-50">
        <Link href="/MainModules/HomePage" className="flex-shrink-0">
          <Image
            src="/images/Logo.png"
            alt="SportsFan360 logo"
            width={32}
            height={36}
            className="shrink-0"
          />
        </Link>

        <div className="relative flex-1" ref={dropdownRef}>
          <div className="flex items-center bg-[#111] border border-white/10 rounded-full overflow-hidden pr-1">
            <Search size={15} className="text-gray-500 ml-3 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              maxLength={100}
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => {
                if (searchQuery.trim() && searchResults.length > 0)
                  setShowDropdown(true);
              }}
              placeholder="Search players, teams..."
              className="bg-transparent outline-none text-sm flex-1 text-white placeholder:text-gray-500 px-3 py-2"
            />
            {searchQuery && (
              <button onClick={handleClear} className="mr-1">
                <X
                  size={13}
                  className="text-gray-500 hover:text-white transition-colors"
                />
              </button>
            )}
            <Link href={askAIHref}>
              <button
                onClick={handleAskAIClick}
                className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-pink-400 text-xs font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
              >
                <Sparkles size={12} />
                Ask AI
              </button>
            </Link>
          </div>
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-pink-500/20 rounded-2xl shadow-2xl z-50 max-h-[400px] overflow-y-auto">
              <ResultsList />
            </div>
          )}
        </div>

        {/* <button className="flex items-center gap-2 border border-pink-500 text-pink-400 text-xs font-medium px-4 py-2 rounded-full hover:bg-pink-500/10 transition-colors whitespace-nowrap">
          <SlidersHorizontal size={13} />
          Preferences
        </button> */}
        <ChatButton unreadCount={totalUnreadChats} />
        {/* Tablet pill is slightly smaller */}
        <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full px-3 py-2">
          <Star size={14} className="text-pink-500 fill-pink-500" />
          {pointsLoading ? (
            <div className="w-6 h-3 bg-white/10 rounded-full animate-pulse" />
          ) : (
            <span className="text-white font-semibold text-xs">
              <PointsPill
                points={currentUserPoints}
                loading={pointsLoading}
                small
              />
            </span>
          )}
        </div>
        <BellButton unreadCount={0} />
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setShowProfileDropdown((v) => !v)}
            className="flex items-center gap-1.5 bg-[#111] border border-white/10 rounded-full pl-1 pr-2 py-1 hover:bg-white/5 transition-colors"
          >
            <Avatar src="" name={displayName} size={30} ring />
            <ChevronDown size={12} className="text-gray-400" />
          </button>
          {showProfileDropdown && (
            <div className="absolute right-0 top-full mt-3 w-52 bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
              <ProfileMenu onClose={() => setShowProfileDropdown(false)} />
            </div>
          )}
        </div>
      </header>

      {/* ── MOBILE (< 768px) ──────────────────────────────────────────────── */}
      <header
        className="flex md:hidden flex-col bg-[#0a0a0a] border-b border-white/5"
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}
      >
        <div className="flex items-center gap-2 px-3 pt-2.5 pb-2 w-full">
          <Link href="/MainModules/HomePage" className="flex-shrink-0">
            <Image
              src="/images/Logo.png"
              alt="SportsFan360 logo"
              width={32}
              height={36}
            />
          </Link>

          <div className="relative flex-1 min-w-0" ref={mobileDropdownRef}>
            <div className="flex items-center bg-[#111] border border-white/10 rounded-full overflow-hidden pr-1">
              <Search size={14} className="text-gray-500 ml-3 shrink-0" />
              <input
                ref={mobileInputRef}
                type="text"
                maxLength={100}
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => {
                  if (searchQuery.trim() && searchResults.length > 0)
                    setShowDropdown(true);
                }}
                placeholder="Search players, teams..."
                className="bg-transparent outline-none text-sm flex-1 min-w-0 text-white placeholder:text-gray-500 px-2 py-2"
              />
              {searchQuery && (
                <button onClick={handleClear} className="shrink-0 mr-1">
                  <X
                    size={13}
                    className="text-gray-500 hover:text-white transition-colors"
                  />
                </button>
              )}
              <Link href={askAIHref}>
                <button
                  onClick={handleAskAIClick}
                  className="flex items-center gap-1 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-pink-400 text-xs font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap shrink-0"
                >
                  <Sparkles size={11} />
                  Ask AI
                </button>
              </Link>
            </div>
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-pink-500/20 rounded-2xl shadow-2xl z-50 max-h-[60vh] overflow-y-auto">
                <ResultsList />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-around pb-2.5 px-2 w-full">
          <button className="flex flex-col items-center group">
            <div className="w-9 h-9 flex items-center justify-center border border-pink-500 bg-pink-500/10 rounded-full group-hover:bg-pink-500/20 transition-colors">
              <SlidersHorizontal size={15} className="text-pink-400" />
            </div>
          </button>
          <ChatButton unreadCount={totalUnreadChats} />
          {/* Mobile compact points pill */}
          <PointsPill points={currentUserPoints} loading={pointsLoading} small />
          <BellButton unreadCount={0} />
          <div className="relative" ref={mobileProfileDropdownRef}>
            <button onClick={() => setShowProfileDropdown((v) => !v)}>
              <Avatar src="" name={displayName} size={36} ring />
            </button>
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-[100]">
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