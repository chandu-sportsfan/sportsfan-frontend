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
<<<<<<< HEAD
import { ArrowLeft, Share2, X } from "lucide-react";
import Image from "next/image";
=======
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
>>>>>>> 4fdd009f93b51e4a91928ba48e82a2bb8bace6a0
import { useState, useEffect } from "react";

const tabs = ["Match Predictions", "Goal Reactions", "Fan Leaderboard", "Highlights"];

type Props = {
    onEnterRoom: (roomId: string) => void;
};

export default function WatchAlongLobby({ onEnterRoom }: Props) {
    const [activeTab, setActiveTab] = useState(0);
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
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

function ExpertCard({
    room,
    match,
    onEnter
}: {
    room: Room;
    match?: Match;
    onEnter: () => void;
}) {
<<<<<<< HEAD
    const [shareMenuOpen, setShareMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Format numbers for display
    const formatNumber = (num: string) => {
=======
       const formatNumber = (num: string): string => {
>>>>>>> 4fdd009f93b51e4a91928ba48e82a2bb8bace6a0
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

<<<<<<< HEAD
    const roomSharePath = `/MainModules/WatchAlong/room/${room.id}`;
    const roomShareUrl = typeof window !== "undefined"
        ? `${window.location.origin}${roomSharePath}`
        : roomSharePath;

    const handleCopyLink = async () => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(roomShareUrl);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = roomShareUrl;
                textArea.style.position = "fixed";
                textArea.style.opacity = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }

            setCopied(true);
            setShareMenuOpen(false);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            setCopied(false);
        }
    };

    const shareText = encodeURIComponent(`Join ${room.name}'s watch along room: ${roomShareUrl}`);

    const whatsappShareText = encodeURIComponent(
        `${room.name} - ${room.role}\nJoin the live room: ${roomShareUrl}`
    );

    const openShareLink = (url: string) => {
        if (typeof window !== "undefined") {
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    const handleWhatsAppShare = async () => {
        if (typeof window === "undefined") return;

        // First try native share with an actual image file so receiver sees an image attachment.
        if (navigator.share) {
            try {
                const imageUrl = new URL(
                    room.displayPicture || "/images/profile.png",
                    window.location.origin
                ).toString();

                const imageRes = await fetch(imageUrl);
                if (imageRes.ok) {
                    const blob = await imageRes.blob();
                    const mimeType = blob.type || "image/png";
                    const extension = mimeType.includes("jpeg") ? "jpg" : "png";
                    const imageFile = new File([blob], `host-dp-${room.id}.${extension}`, {
                        type: mimeType,
                    });

                    await navigator.share({
                        title: `${room.name} Watch Along`,
                        text: `${room.name} - ${room.role}\n${roomShareUrl}`,
                        files: [imageFile],
                    });
                    setShareMenuOpen(false);
                    return;
                }
            } catch {
                // Fall back to WhatsApp deeplink.
            }
        }

        const appUrl = `whatsapp://send?text=${whatsappShareText}`;

        // Open WhatsApp app directly.
        window.location.href = appUrl;
        setShareMenuOpen(false);
    };

    const shareActions = [
        {
            key: "whatsapp",
            label: "WhatsApp",
            description: "Send via WhatsApp app (web fallback)",
            icon: "/images/share_whatsapp.png",
            onClick: handleWhatsAppShare,
        },
        {
            key: "threads",
            label: "Threads",
            description: "Post the room link to your thread",
            icon: "/images/share_thread.png",
            onClick: () => openShareLink(`https://www.threads.net/intent/post?text=${shareText}`),
        },
        {
            key: "instagram",
            label: "Instagram",
            description: "Open Instagram in a new tab",
            icon: "/images/share_insta.png",
            onClick: () => openShareLink("https://www.instagram.com/"),
        },
    ];

    // Check if room has live match content
=======
>>>>>>> 4fdd009f93b51e4a91928ba48e82a2bb8bace6a0
    const hasLiveMatchContent = room.isLive && match;
    const hasLivePlaceholder  = room.isLive && !match;

    return (
        <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-5 relative overflow-hidden flex flex-col">
<<<<<<< HEAD
            {/* Share actions for each expert card */}
            <div className="absolute top-3 right-3 z-20">
                <button
                    type="button"
                    onClick={() => setShareMenuOpen((prev) => !prev)}
                    aria-label={`Share ${room.name} room`}
                    className="w-9 h-9 rounded-full border border-[#333] bg-[#121212] text-gray-300 hover:text-white hover:border-pink-500 transition flex items-center justify-center"
                >
                    <Share2 size={16} />
                </button>
            </div>

            {shareMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/70 flex items-end sm:items-center justify-center p-4"
                    onClick={() => setShareMenuOpen(false)}
                >
                    <div
                        className="w-full max-w-sm rounded-3xl border border-[#2f2f2f] bg-[#0e0f12] p-5"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-2xl font-semibold text-white">Share Expert Room</h3>
                            <button
                                type="button"
                                aria-label="Close share menu"
                                onClick={() => setShareMenuOpen(false)}
                                className="text-gray-300 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-2xl font-semibold text-white leading-tight">{room.name}</p>
                        <p className="text-gray-400 text-lg leading-tight">{room.role}</p>
                        <p className="text-xs text-gray-500 mt-2 mb-4">Share this room and invite friends to join the live conversation.</p>

                        <div className="space-y-3">
                            {shareActions.map((action) => (
                                <button
                                    key={action.key}
                                    type="button"
                                    onClick={action.onClick}
                                    className="w-full rounded-2xl bg-[#202226] text-white px-4 py-4 text-left hover:bg-[#2a2d31] transition flex items-center gap-4"
                                >
                                    <div className="w-11 h-11 rounded-full overflow-hidden bg-[#111] shrink-0 relative p-1">
                                        <Image
                                            src={action.icon}
                                            alt={`${action.label} icon`}
                                            fill
                                            sizes="44px"
                                            className="object-contain p-1 scale-125"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-white leading-tight">Share on {action.label}</p>
                                        <p className="text-xs text-gray-400 leading-tight mt-1">{action.description}</p>
                                    </div>
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className="w-full rounded-2xl bg-[#202226] text-white px-4 py-4 text-left hover:bg-[#2a2d31] transition flex items-center gap-4"
                            >
                                <div className="w-11 h-11 rounded-full bg-[#111] flex items-center justify-center shrink-0 overflow-hidden">
                                    <Image
                                        src={copied ? "/images/share_copy_link.png" : "/images/share_copy_link.png"}
                                        alt="Copy link icon"
                                        width={22}
                                        height={22}
                                        className="object-contain scale-[2.2]"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-white leading-tight">{copied ? "Link Copied" : "Copy Link"}</p>
                                    <p className="text-xs text-gray-400 leading-tight mt-1">Save the room URL and share it anywhere</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Expert info */}
            <div className="flex items-center gap-3 mb-4 pr-12">
                <div
                    className={`w-14 h-14 rounded-full border-2 ${room.borderColor} bg-[#2a2a2a] flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden`}
                >
                    {room.displayPicture ? (
                        <Image
                            src={room.displayPicture}
                            alt={room.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover rounded-full"
                        />
=======

            {/* Badge */}
            <span className={`absolute top-3 right-3 ${room.badgeColor} text-white text-[11px] font-semibold px-3 py-1 rounded-full z-10`}>
                {room.badge}
            </span>

            {/* Expert info */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-14 h-14 rounded-full border-2 ${room.borderColor} bg-[#2a2a2a] flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden`}>
                    {room.displayPicture ? (
                        <img src={room.displayPicture} alt={room.name} className="w-full h-full object-cover rounded-full" />
>>>>>>> 4fdd009f93b51e4a91928ba48e82a2bb8bace6a0
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
    );
}