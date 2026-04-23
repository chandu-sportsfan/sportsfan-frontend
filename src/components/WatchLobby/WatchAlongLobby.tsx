// "use client";

// import { useWatchAlong, Room, Match } from "@/context/WatchAlongContext";
// import { ArrowLeft } from "lucide-react";
// import { useState, useEffect } from "react";

// const tabs = ["Match Predictions", "Goal Reactions", "Fan Leaderboard", "Highlights"];

// type Props = {
//     onEnterRoom: (roomId: string) => void;
// };

// export default function WatchAlongLobby({ onEnterRoom }: Props) {
//     const [activeTab, setActiveTab] = useState(0);
//     const {
//         rooms,
//         fetchRooms,
//         matches,
//         fetchMatches,
//         loading,
//         error
//     } = useWatchAlong();

//     useEffect(() => {
//         fetchRooms();
//         fetchMatches();
//     }, [fetchRooms, fetchMatches]);

//     // Get match details for a room
//     const getMatchForRoom = (liveMatchId: string) => {
//         return matches.find(m => m.id === liveMatchId);
//     };

//     if (loading && rooms.length === 0) {
//         return (
//             <div className="min-h-screen bg-[#111] text-white font-sans flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
//                     <p className="text-gray-400">Loading watch along rooms...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="min-h-screen bg-[#111] text-white font-sans flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-red-400 mb-4">{error}</p>
//                     <button
//                         onClick={() => {
//                             fetchRooms();
//                             fetchMatches();
//                         }}
//                         className="bg-pink-500 px-4 py-2 rounded text-white hover:bg-pink-600"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-[#111] text-white font-sans">
//             <div className="sticky top-0 z-50 bg-[#111]">
//                 <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-10 py-6">

//                     {/* Header */}
//                     <div className="flex items-center gap-3 mb-6">
//                         <button
//                             className="text-white hover:text-pink-500 transition cursor-pointer"
//                             onClick={() => window.history.back()}
//                         >
//                             <ArrowLeft size={20} />
//                         </button>
//                         <h1 className="text-xl font-bold">Watch Along</h1>
//                     </div>

//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
//                         <div className="flex items-center gap-2 flex-shrink-0">
//                             <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
//                             <span className="text-base font-bold">Watch Along – IPL 2026</span>
//                         </div>

//                         <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
//                             {tabs.map((tab, i) => (
//                                 <button
//                                     key={tab}
//                                     onClick={() => setActiveTab(i)}
//                                     className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all [scrollbar-width:none] ${activeTab === i
//                                             ? "bg-pink-600 border-pink-600 text-white"
//                                             : "bg-[#1e1e1e] border-[#333] text-gray-400 hover:border-gray-500"
//                                         }`}
//                                 >
//                                     {tab}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                     </div>

//                     {rooms.length === 0 ? (
//                         <div className="text-center py-12">
//                             <p className="text-gray-400">No watch along rooms available.</p>
//                             <p className="text-sm text-gray-600 mt-2">Check back later for live expert sessions!</p>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
//                             {rooms.map((room) => (
//                                 <ExpertCard
//                                     key={room.id}
//                                     room={room}
//                                     match={getMatchForRoom(room.liveMatchId)}
//                                     onEnter={() => onEnterRoom(room.id)}
//                                 />
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//             );
// }

//             function ExpertCard({
//                 room,
//                 match,
//                 onEnter
//             }: {
//                 room: Room;
//             match?: Match; 
//     onEnter: () => void;
// }) {
//     // Format numbers for display
//     const formatNumber = (num: string) => {
//         if (!num) return "0";
//             return num;
//     };

//             // Check if room has live match content
//             const hasLiveMatchContent = room.isLive && match;
//             const hasLivePlaceholder = room.isLive && !match;

//             return (
//             // Removed h-full, let content determine height
//             <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col">
//                 {/* Badge */}
//                 <span
//                     className={`absolute top-3 right-3 ${room.badgeColor} text-white text-[11px] font-semibold px-3 py-1 rounded-full z-10`}
//                 >
//                     {room.badge}
//                 </span>

//                 {/* Expert info */}
//                 <div className="flex items-center gap-3 mb-4">
//                     <div
//                         className={`w-14 h-14 rounded-full border-2 ${room.borderColor} bg-[#2a2a2a] flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden`}
//                     >
//                         {room.displayPicture ? (
//                             <img
//                                 src={room.displayPicture}
//                                 alt={room.name}
//                                 className="w-full h-full object-cover rounded-full"
//                             />
//                         ) : (
//                             <span className="text-white font-bold text-lg">
//                                 {room.name.split(" ").map(n => n[0]).join("")}
//                             </span>
//                         )}
//                     </div>
//                     <div>
//                         <p className="text-base font-bold text-white">{room.name}</p>
//                         <p className="text-xs text-gray-400">{room.role}</p>
//                     </div>
//                 </div>

//                 {/* Live match section - dynamic height based on content */}
//                 {hasLiveMatchContent && (
//                     <div className="bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2.5 mb-4">
//                         <div className="flex items-center justify-between mb-1.5">
//                             <span className="bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
//                                 <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
//                                 LIVE
//                             </span>
//                             <span className="text-[11px] text-gray-400">
//                                 Match {match.matchNo} &nbsp; {match.tournament || "IPL 2026"}
//                             </span>
//                         </div>
//                         <div className="flex items-center justify-between mb-1">
//                             <span className="text-sm font-bold text-pink-500">
//                                 {match.team1?.name} {match.team1?.score || "0/0"}
//                             </span>
//                             <span className="text-xs text-gray-500">vs</span>
//                             <span className="text-sm font-bold text-blue-400">
//                                 {match.team2?.name} {match.team2?.score || "0/0"}
//                             </span>
//                         </div>
//                         <p className="text-[10px] text-gray-600 text-center">
//                             {match.stadium || "Venue TBD"}
//                         </p>
//                     </div>
//                 )}

//                 {/* No live match placeholder - only shown when room.isLive is true but no match linked */}
//                 {hasLivePlaceholder && (
//                     <div className="bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2.5 mb-4">
//                         <div className="flex items-center justify-between mb-1.5">
//                             <span className="bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
//                                 <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
//                                 LIVE
//                             </span>
//                             <span className="text-[11px] text-gray-400">Match coming soon</span>
//                         </div>
//                         <p className="text-xs text-gray-400 text-center py-2">
//                             Match details will appear here shortly
//                         </p>
//                     </div>
//                 )}

//                 {/* Stats section - always visible */}
//                 <div className="grid grid-cols-3 gap-2 mb-4">
//                     <div className="flex flex-col items-center gap-0.5 border border-gray-700 rounded-lg px-2 py-2">
//                         <span className="text-[13px] font-semibold text-white">
//                             <img src="/images/watching.png" alt="Watching" className="w-4 h-4 inline-block mr-1" />
//                             {formatNumber(room.watching)}
//                         </span>
//                         <span className="text-[10px] text-gray-500">Watching</span>
//                     </div>
//                     <div className="flex flex-col items-center gap-0.5 border border-gray-700 rounded-lg px-2 py-2">
//                         <span className="text-[13px] font-semibold text-green-400">
//                             <img src="/images/engagement.png" alt="Engagement" className="w-4 h-4 inline-block mr-1" />
//                             {formatNumber(room.engagement)}
//                         </span>
//                         <span className="text-[10px] text-gray-500">Engagement</span>
//                     </div>
//                     <div className="flex flex-col items-center gap-0.5 border border-gray-700 rounded-lg px-2 py-2">
//                         <span className="text-[13px] font-semibold text-green-400">
//                             ● {formatNumber(room.active)}
//                         </span>
//                         <span className="text-[10px] text-gray-500">Active</span>
//                     </div>
//                 </div>

//                 {/* CTA button */}
//                 <button
//                     onClick={() => onEnter()}
//                     className="w-full py-3 rounded-full text-white text-sm font-bold transition-all active:scale-95 hover:opacity-90"
//                     style={{ background: "linear-gradient(90deg, #e91e63, #ff5722)" }}
//                 >
//                     Enter Watch Room →
//                 </button>
//             </div>
//             );
// }






"use client";

import { useWatchAlong, Room, Match } from "@/context/WatchAlongContext";
import { ArrowLeft, Share2, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const tabs = ["Match Predictions", "Goal Reactions", "Fan Leaderboard", "Highlights"];

type Props = {
    onEnterRoom: (roomId: string) => void;
};

export default function WatchAlongLobby({ onEnterRoom }: Props) {
    const [activeTab, setActiveTab] = useState(0);
    const [shareRoom, setShareRoom] = useState<Room | null>(null);
    const [copied, setCopied] = useState(false);
    const {
        rooms,
        fetchRooms,
        matches,
        fetchMatches,
        loading,
        error
    } = useWatchAlong();

    useEffect(() => {
        fetchRooms();
        fetchMatches();
    }, [fetchRooms, fetchMatches]);

    const getMatchForRoom = (liveMatchId: string) => {
        return matches.find(m => m.id === liveMatchId);
    };

    const buildShareUrl = (roomId: string) => {
        if (typeof window === "undefined") return "";
        return `${window.location.origin}/MainModules/WatchAlong/share/${roomId}`;
    };

    const buildRoomUrl = (roomId: string) => {
        if (typeof window === "undefined") return "";
        return `${window.location.origin}/MainModules/WatchAlong/room/${roomId}`;
    };

    const resolveShareImageUrl = (room: Room) => {
        if (!room.displayPicture) {
            return "/images/share.png";
        }

        if (room.displayPicture.startsWith("http://") || room.displayPicture.startsWith("https://")) {
            return room.displayPicture;
        }

        return room.displayPicture.startsWith("/") ? room.displayPicture : `/${room.displayPicture}`;
    };

    const buildShareText = (room: Room, match?: Match) => {
        const previewLink = buildShareUrl(room.id);
        const matchText = match ? `Live match: ${match.team1?.name || "Team 1"} vs ${match.team2?.name || "Team 2"}` : "Live match updates and fan chat";
        return [
            `Join ${room.name} in Watch Along - IPL 2026`,
            room.role,
            matchText,
            `View and join: ${previewLink}`,
        ].filter(Boolean).join("\n");
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            try {
                const input = document.createElement("textarea");
                input.value = text;
                input.style.position = "fixed";
                input.style.opacity = "0";
                document.body.appendChild(input);
                input.focus();
                input.select();
                const ok = document.execCommand("copy");
                document.body.removeChild(input);
                return ok;
            } catch {
                return false;
            }
        }
    };

    const openShare = (room: Room) => {
        setShareRoom(room);
        setCopied(false);
    };

    const closeShare = () => {
        setShareRoom(null);
        setCopied(false);
    };

    const handleShareToWhatsApp = () => {
        if (!shareRoom) return;
        const match = getMatchForRoom(shareRoom.liveMatchId);
        const shareText = buildShareText(shareRoom, match);
        const whatsappAppUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
        const whatsappWebFallbackUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

        const opened = window.open(whatsappAppUrl, "_self");
        if (!opened) {
            window.location.href = whatsappWebFallbackUrl;
        }
    };

    const handleShareToThreads = () => {
        if (!shareRoom) return;
        const shareText = buildShareText(shareRoom, getMatchForRoom(shareRoom.liveMatchId));
        window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
    };

    const handleShareToInstagram = async () => {
        if (!shareRoom) return;
        const shareText = buildShareText(shareRoom, getMatchForRoom(shareRoom.liveMatchId));
        await copyToClipboard(shareText);
        setCopied(true);
        window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
        setTimeout(() => setCopied(false), 1600);
    };

    const handleCopyLink = async () => {
        if (!shareRoom) return;
        const ok = await copyToClipboard(buildShareText(shareRoom, getMatchForRoom(shareRoom.liveMatchId)));
        if (!ok) return;
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
    };

    if (loading && rooms.length === 0) {
        return (
            <div className="min-h-screen bg-[#111] text-white font-sans flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading watch along rooms...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#111] text-white font-sans flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={() => { fetchRooms(); fetchMatches(); }}
                        className="bg-pink-500 px-4 py-2 rounded text-white hover:bg-pink-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#111] text-white font-sans flex flex-col overflow-hidden">

            {/* ── Sticky Header + Tabs ── */}
            <div className="flex-shrink-0 bg-[#111] border-b border-[#222] z-50">
                <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-4">

                    {/* Back + Title */}
                    <div className="flex items-center gap-3 mb-5">
                        <Link href="/MainModules/HomePage">
                        <button
                            className="text-white hover:text-pink-500 transition cursor-pointer"
                            // onClick={() => window.history.back()}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        </Link>
                        <h1 className="text-xl font-bold">Watch Along</h1>
                    </div>

                    {/* Live badge + Tab pills */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                            <span className="text-base font-bold">Watch Along – IPL 2026</span>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {tabs.map((tab, i) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(i)}
                                    className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all ${
                                        activeTab === i
                                            ? "bg-pink-600 border-pink-600 text-white"
                                            : "bg-[#1e1e1e] border-[#333] text-gray-400 hover:border-gray-500"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto [scrollbar-width:none]">
                <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-24">
                    {rooms.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No watch along rooms available.</p>
                            <p className="text-sm text-gray-600 mt-2">Check back later for live expert sessions!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                            {rooms.map((room) => (
                                <ExpertCard
                                    key={room.id}
                                    room={room}
                                    match={getMatchForRoom(room.liveMatchId)}
                                    onEnter={() => onEnterRoom(room.id)}
                                    onShare={() => openShare(room)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {shareRoom && (
                <div
                    className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-[1px] flex items-end sm:items-center justify-center p-4"
                    onClick={closeShare}
                >
                    <div
                        className="w-full max-w-md rounded-3xl border border-white/15 bg-[#3c434f] text-white p-5 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="pr-4">
                                <p className="text-2xl font-bold leading-tight">Share Expert Room</p>
                                <p className="text-lg font-semibold mt-2">{shareRoom.name}</p>
                                <p className="text-white/70 text-sm">{shareRoom.role}</p>
                            </div>
                            <button
                                onClick={closeShare}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
                                aria-label="Close share dialog"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-3 flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 bg-white/10 shrink-0">
                                <img
                                    src={shareRoom.displayPicture || "/images/share.png"}
                                    alt={shareRoom.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-sm">Watch Along preview</p>
                                <p className="text-xs text-white/70 line-clamp-2">
                                    Join this room, see live match context, and share the link with the room preview image.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleShareToWhatsApp}
                                className="w-full rounded-2xl px-4 py-3 bg-[#5b6472] hover:bg-[#6a7483] transition-colors flex items-center gap-3 text-left"
                            >
                                <img src="/images/share_whatsapp.png" alt="WhatsApp" className="w-9 h-9 rounded-full object-cover" />
                                <span className="font-semibold">Share on WhatsApp</span>
                            </button>

                            <button
                                onClick={handleShareToThreads}
                                className="w-full rounded-2xl px-4 py-3 bg-[#5b6472] hover:bg-[#6a7483] transition-colors flex items-center gap-3 text-left"
                            >
                                <img src="/images/share_thread.png" alt="Threads" className="w-9 h-9 rounded-full object-cover" />
                                <span className="font-semibold">Share on Threads</span>
                            </button>

                            <button
                                onClick={handleShareToInstagram}
                                className="w-full rounded-2xl px-4 py-3 bg-[#5b6472] hover:bg-[#6a7483] transition-colors flex items-center gap-3 text-left"
                            >
                                <img src="/images/share_insta.png" alt="Instagram" className="w-9 h-9 rounded-full object-cover" />
                                <span className="font-semibold">Share on Instagram</span>
                            </button>

                            <button
                                onClick={handleCopyLink}
                                className="w-full rounded-2xl px-4 py-3 bg-[#5b6472] hover:bg-[#6a7483] transition-colors flex items-center gap-3 text-left"
                            >
                                <img src="/images/share_copy_link.png" alt="Copy Link" className="w-9 h-9 rounded-full object-cover" />
                                <span className="font-semibold">{copied ? "Copied" : "Copy Link"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

function ExpertCard({
    room,
    match,
    onEnter,
    onShare
}: {
    room: Room;
    match?: Match;
    onEnter: () => void;
    onShare: () => void;
}) {
       const formatNumber = (num: string): string => {
        if (!num) return "0";
        
        const value = parseFloat(num);
        if (isNaN(value)) return "0";
        
        // For Crore (10 million = 1 Crore)
        if (value >= 10000000) {
            return (value / 10000000).toFixed(1) + "Cr";
        }
        // For Lakh (100,000 = 1 Lakh)
        if (value >= 100000) {
            return (value / 100000).toFixed(1) + "L";
        }
        // For Thousand
        if (value >= 1000) {
            return (value / 1000).toFixed(1) + "K";
        }
        
        return value.toString();
    };

    const hasLiveMatchContent = room.isLive && match;
    const hasLivePlaceholder  = room.isLive && !match;

    return (
        <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col">

            {/* Badge */}
            <span className={`absolute top-3 right-3 ${room.badgeColor} text-white text-[11px] font-semibold px-3 py-1 rounded-full z-10`}>
                {room.badge}
            </span>

            <button
                onClick={onShare}
                className="absolute top-3 right-24 sm:right-28 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center z-10"
                aria-label={`Share ${room.name} room`}
            >
                <Share2 size={17} />
            </button>

            {/* Expert info */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-14 h-14 rounded-full border-2 ${room.borderColor} bg-[#2a2a2a] flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden`}>
                    {room.displayPicture ? (
                        <img src={room.displayPicture} alt={room.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <span className="text-white font-bold text-lg">
                            {room.name.split(" ").map(n => n[0]).join("")}
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-base font-bold text-white">{room.name}</p>
                    <p className="text-xs text-gray-400">{room.role}</p>
                    <span
                        className={`inline-flex mt-1 ${room.badgeColor} text-white text-[10px] font-semibold px-2 py-0.5 rounded-full`}
                    >
                        {room.badge}
                    </span>
                </div>
            </div>

            {/* Live match */}
            {hasLiveMatchContent && (
                <div className="bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2.5 mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                            LIVE
                        </span>
                        <span className="text-[11px] text-gray-400">
                            Match {match.matchNo} &nbsp; {match.tournament || "IPL 2026"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-pink-500">{match.team1?.name} {match.team1?.score || "0/0"}</span>
                        <span className="text-xs text-gray-500">vs</span>
                        <span className="text-sm font-bold text-blue-400">{match.team2?.name} {match.team2?.score || "0/0"}</span>
                    </div>
                    <p className="text-[10px] text-gray-600 text-center">{match.stadium || "Venue TBD"}</p>
                </div>
            )}

            {/* Placeholder */}
            {hasLivePlaceholder && (
                <div className="bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2.5 mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                            LIVE
                        </span>
                        <span className="text-[11px] text-gray-400">Match coming soon</span>
                    </div>
                    <p className="text-xs text-gray-400 text-center py-2">Match details will appear here shortly</p>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex flex-col items-center gap-0.5 border border-gray-700 rounded-lg px-2 py-2">
                    <span className="text-[13px] font-semibold text-white">
                        <img src="/images/watching.png" alt="Watching" className="w-4 h-4 inline-block mr-1" />
                        {formatNumber(room.watching)}
                    </span>
                    <span className="text-[10px] text-gray-500">Watching</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 border border-gray-700 rounded-lg px-2 py-2">
                    <span className="text-[13px] font-semibold text-green-400">
                        <img src="/images/engagement.png" alt="Engagement" className="w-4 h-4 inline-block mr-1" />
                        {formatNumber(room.engagement)}
                    </span>
                    <span className="text-[10px] text-gray-500">Engagement</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 border border-gray-700 rounded-lg px-2 py-2">
                    <span className="text-[13px] font-semibold text-green-400">
                        ● {formatNumber(room.active)}
                    </span>
                    <span className="text-[10px] text-gray-500">Active</span>
                </div>
            </div>

            {/* CTA */}
            <button
                onClick={onEnter}
                className="w-full py-3 rounded-full text-white text-sm font-bold transition-all cursor-pointer active:scale-95 hover:opacity-90"
                style={{ background: "linear-gradient(90deg, #e91e63, #ff5722)" }}
            >
                Enter Watch Room →
            </button>
        </div>
    );}
