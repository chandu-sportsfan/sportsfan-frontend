"use client";

// Update your import line
import { 
    Search, X, SlidersHorizontal, Star, ChevronDown, Sparkles, Bell, 
    MessageSquare, User, Settings, LogOut, MessageCircle
} from "lucide-react";
import { useGlobalSearch } from "@/context/GlobalSearchContext";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLeaderboard } from "@/context/LeaderboardContext";
import { useAuth } from "@/context/AuthContext";
import { useChats } from "@/hooks/useChat";
import LogoutButton from "../LogoutButton";

// ─── Bell with badge ──────────────────────────────────────────────────────────

function BellButton({ unreadCount }: { unreadCount: number }) {
  const capped = Math.min(unreadCount, 99);
  return (
    <Link href="/MainModules/Notifications">
      <div className="relative w-9 h-9 flex items-center justify-center bg-[#111] border border-white/10 rounded-full hover:bg-pink-500/10 transition-colors">
        <Bell size={15} className="text-pink-400" />
        {capped > 0 && (
          <span
            className={`
              absolute -top-1 -right-1
              flex items-center justify-center
              rounded-full
              bg-[#e91e8c]
              text-white font-bold leading-none
              border border-[#07070f]
              ${capped > 9 ? "min-w-[18px] px-[3px] text-[9px] h-[18px]" : "w-4 h-4 text-[9px]"}
            `}
          >
            {capped}
          </span>
        )}
      </div>
    </Link>
  );
}

function ChatButton({ unreadCount }: { unreadCount: number }) {
  const capped = Math.min(unreadCount, 99);
  return (
    <Link href="/MainModules/Chat">
      <div className="relative w-9 h-9 flex items-center justify-center bg-[#111] border border-white/10 rounded-full hover:bg-pink-500/10 transition-colors">
        <MessageCircle size={15} className="text-pink-400" />
        {capped > 0 && (
          <span
            className={`
              absolute -top-1 -right-1
              flex items-center justify-center
              rounded-full
              bg-[#e91e8c]
              text-white font-bold leading-none
              border border-[#07070f]
              ${capped > 9 ? "min-w-[18px] px-[3px] text-[9px] h-[18px]" : "w-4 h-4 text-[9px]"}
            `}
          >
            {capped}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function Header() {
    const {
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        performSearch,
        clearSearch,
        navigateToResult,   // ← added: handles routing for all result types
    } = useGlobalSearch();
     const { currentUserPoints } = useLeaderboard();
     const { user, getUserDisplayName, loading: authLoading } = useAuth();
     const { chats } = useChats();
     const totalUnreadChats = chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
     
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
                if (inputRef.current) inputRef.current.value = "";
                if (mobileInputRef.current) mobileInputRef.current.value = "";
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

    // ── Reusable results list ────────────────────────────────────────────────
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
                        /*
                         * Use a <button> instead of <Link> so ALL three types
                         * (player, team, user) go through navigateToResult,
                         * which knows the correct URL for each.
                         *
                         * For "user" → /MainModules/Profile?userId=<id>
                         *   The Profile page reads ?userId and shows
                         *   "Add Friend" instead of "Edit Profile" for visitors.
                         *
                         * For "player" → /MainModules/PlayersProfile?id=<playerProfilesId>
                         * For "team"   → /MainModules/ClubsProfile?teamProfile=<name>
                         */
                        <button
                            key={`${result.type}-${result.id}`}
                            onClick={() => {
                                setShowDropdown(false);
                                navigateToResult(result);
                            }}
                            className="w-full text-left p-3 hover:bg-white/5 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0 cursor-pointer"
                        >
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                                {result.type === "player" || result.type === "user" ? (
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

                            {/* Name + type badge */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-white font-medium text-sm truncate">{result.name}</p>

                                    {/* Jersey number — players only */}
                                    {result.type === "player" && result.jerseyNumber && (
                                        <span className="text-xs bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                            #{result.jerseyNumber}
                                        </span>
                                    )}

                                    {/* Type badge: USER (blue) · PLAYER (muted) · TEAM (muted) */}
                                    <span className={`text-xs font-semibold uppercase px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                                        result.type === "user"
                                            ? "bg-blue-500/20 text-blue-400"
                                            : result.type === "player"
                                            ? "bg-pink-500/10 text-gray-400"
                                            : "bg-purple-500/10 text-gray-400"
                                    }`}>
                                        {result.type === "user" ? "User" : result.type === "player" ? "Player" : "Team"}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            ) : searchQuery.trim() ? (
                <div className="p-4 text-center text-gray-400">
                    <p className="text-sm">No results found for &apos;{searchQuery}&apos;</p>
                </div>
            ) : null}
        </>
    );

    // ── Profile dropdown menu ────────────────────────────────────────────────
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
                <span className="ml-auto text-[8px] font-semibold bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/30">
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
            <LogoutButton className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group">
                <LogOut size={16} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                <span className="text-white group-hover:text-red-400 text-sm font-medium transition-colors">Logout</span>
            </LogoutButton>
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
                        <Link href="/MainModules/AskAI">
                        <button className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-pink-400 text-sm font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap">
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
                    <button className="flex items-center gap-2 bg-transparent hover:bg-pink-500/10 border border-pink-500 text-pink-400 text-sm font-medium px-5 py-2.5 rounded-full transition-colors">
                        <SlidersHorizontal size={15} />
                        Preferences
                    </button>
                    <ChatButton unreadCount={totalUnreadChats} />
                    <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full px-4 py-2.5">
                        <Star size={16} className="text-pink-500 fill-pink-500" />
                        <div className="flex flex-col leading-tight">
                            <span className="text-white font-semibold text-sm">{formatPoints(currentUserPoints)}</span>
                        </div>
                    </div>

                    <BellButton unreadCount={0} />

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

            {/* ── TABLET (768px – 1279px) ─────────────────────────────────────── */}
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
                        <Link href="/MainModules/AskAI">
                            <button className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-pink-400 text-xs font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
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

                <button className="flex items-center gap-2 border border-pink-500 text-pink-400 text-xs font-medium px-4 py-2 rounded-full hover:bg-pink-500/10 transition-colors whitespace-nowrap">
                    <SlidersHorizontal size={13} />
                    Preferences
                </button>
                <ChatButton unreadCount={totalUnreadChats} />
                <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-full px-3 py-2">
                    <Star size={14} className="text-pink-500 fill-pink-500" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-white font-semibold text-xs">{formatPoints(currentUserPoints)}</span>
                    </div>
                </div>

                <BellButton unreadCount={0} />

                <div className="relative" ref={profileDropdownRef}>
                    <button
                        onClick={() => setShowProfileDropdown((v) => !v)}
                        className="flex items-center gap-1.5 bg-[#111] border border-white/10 rounded-full pl-1 pr-2 py-1 hover:bg-white/5 transition-colors"
                    >
                        <Avatar src={""} name={authLoading ? "" : getUserDisplayName()} size={30} ring />
                        <ChevronDown size={12} className="text-gray-400" />
                    </button>
                    {showProfileDropdown && (
                        <div className="absolute right-0 top-full mt-3 w-52 bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                            <ProfileMenu onClose={() => setShowProfileDropdown(false)} />
                        </div>
                    )}
                </div>
            </header>

            {/* ── MOBILE (< 768px) ────────────────────────────────────────────── */}
            <header
                className="flex md:hidden flex-col bg-[#0a0a0a] border-b border-white/5"
                style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}
            >
                {/* Row 1: Logo + Search + Ask AI */}
                <div className="flex items-center gap-2 px-3 pt-2.5 pb-2 w-full">
                    <Link href="/MainModules/HomePage" className="flex-shrink-0">
                        <Image src="/images/Logo.png" alt="SportsFan360 logo" width={32} height={36} />
                    </Link>

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
                            <Link href="/MainModules/AskAI">
                                <button className="flex items-center gap-1 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-pink-400 text-xs font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap shrink-0">
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

                {/* Row 2: Icon strip */}
                <div className="flex items-center justify-around pb-2.5 px-2 w-full">
                    <button className="flex flex-col items-center group">
                        <div className="w-9 h-9 flex items-center justify-center border border-pink-500 bg-pink-500/10 rounded-full group-hover:bg-pink-500/20 transition-colors">
                            <SlidersHorizontal size={15} className="text-pink-400" />
                        </div>
                    </button>
                    <ChatButton unreadCount={totalUnreadChats} />
                    <button className="flex flex-col items-center group">
                        <div className="w-9 h-9 flex flex-col items-center justify-center bg-[#111] border border-white/10 rounded-full group-hover:bg-white/5 transition-colors gap-0.5">
                            <Star size={10} className="text-pink-500 fill-pink-500" />
                            <span className="text-[9px] text-gray-400 font-medium leading-none">
                                {formatPoints(currentUserPoints)}
                            </span>
                        </div>
                    </button>
                    <BellButton unreadCount={0} />
                    <div className="relative" ref={mobileProfileDropdownRef}>
                        <button onClick={() => setShowProfileDropdown((v) => !v)}>
                            <Avatar src={""} name={authLoading ? "" : getUserDisplayName()} size={36} ring />
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

// ─── Sub-components ───────────────────────────────────────────────────────────

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
