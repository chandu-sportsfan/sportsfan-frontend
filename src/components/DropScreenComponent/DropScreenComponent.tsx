// "use client";

// import { useState } from "react";
// import { ArrowLeft, Headphones, Play, Clock, Mic } from "lucide-react";
// import Link from "next/link";

// interface AudioDrop {
//     title: string;
//     duration: string;
//     date: string;
//     roomType: "Inner Room" | "Reflection" | "Open Room";
// }

// interface VideoDrop {
//     title: string;
//     duration: string;
//     date: string;
// }

// const ROOM_COLORS: Record<string, string> = {
//     "Inner Room": "text-pink-500 border border-pink-500",
//     "Reflection": "text-pink-500 border border-pink-500",
//     "Open Room": "text-pink-500 border border-pink-500",
// };

// const AUDIO_DROPS: AudioDrop[] = [
//     { title: "Pre-Match Strategy", duration: "15:30", date: "2026-01-28", roomType: "Inner Room" },
//     { title: "Coach Post-Match", duration: "12:45", date: "2026-01-25", roomType: "Reflection" },
//     { title: "Team Meeting Highlights", duration: "8:20", date: "2026-01-23", roomType: "Open Room" },
// ];

// const VIDEO_DROPS: VideoDrop[] = [
//     { title: "Training Session Highlights", duration: "6:30", date: "2026-01-27" },
//     { title: "Behind the Scenes", duration: "9:15", date: "2026-01-24" },
// ];

// export default function FullPlaylistPage() {
//     const [request, setRequest] = useState("");

//     return (
//         <div className="min-h-screen bg-[#0d0d0d] text-white">

//             {/* Header */}
//             <div className="flex items-center gap-3 px-4 md:px-8 lg:px-12 py-4 border-b border-gray-800">
//                 <button className="text-white hover:text-pink-500 transition"
//                     onClick={() => window.history.back()}>
//                     <ArrowLeft size={20} />
//                 </button>
//                 <div>
//                     <h1 className="font-bold text-base md:text-lg lg:text-xl leading-tight">
//                         Royal Challengers Bengaluru
//                     </h1>
//                     <p className="text-gray-400 text-xs md:text-sm">Full Playlist</p>
//                 </div>
//             </div>

//             {/* Content */}
//             <div className="px-4 md:px-8 lg:px-12 py-6 max-w-7xl mx-auto">

//                 {/* On tablet/desktop: two column layout */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

//                     {/* Left Column — Audio + Video */}
//                     <div className="flex flex-col gap-8">

//                         {/* Audio Drops */}
//                         <div>
//                             <div className="flex items-center gap-2 mb-4">
//                                 <Headphones size={18} className="text-pink-500" />
//                                 <h2 className="font-bold text-sm md:text-base">Audio Drops</h2>
//                             </div>

//                             <div className="flex flex-col gap-3">
//                                 {AUDIO_DROPS.map((item, i) => (
//                                     <div
//                                         key={i}
//                                         className="flex items-center justify-between bg-[#1a1a1a] rounded-xl px-4 py-3 hover:bg-[#222] transition cursor-pointer"
//                                     >
//                                         <div className="flex items-center gap-3">
//                                             <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-pink-900/40 flex items-center justify-center flex-shrink-0">
//                                                 <Headphones size={18} className="text-pink-500" />
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm md:text-base font-medium leading-tight">
//                                                     {item.title}
//                                                 </p>
//                                                 <div className="flex items-center gap-1 mt-0.5">
//                                                     <Clock size={10} className="text-gray-400" />
//                                                     <span className="text-gray-400 text-[10px] md:text-xs">{item.duration}</span>
//                                                     <span className="text-gray-600 text-[10px]">•</span>
//                                                     <span className="text-gray-400 text-[10px] md:text-xs">{item.date}</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <Link href="/MainModules/AudioDrop" >
//                                             <span className={`text-[10px] md:text-xs px-2 py-0.5 rounded-md whitespace-nowrap ${ROOM_COLORS[item.roomType]}`}>
//                                                 {item.roomType}
//                                             </span>
//                                         </Link>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {/* Video Drops */}
//                         <div>
//                             <div className="flex items-center gap-2 mb-4">
//                                 <Play size={18} className="text-orange-500" />
//                                 <h2 className="font-bold text-sm md:text-base">Video Drops</h2>
//                             </div>

//                             <div className="flex flex-col gap-3">
//                                 {VIDEO_DROPS.map((item, i) => (
//                                     <div
//                                         key={i}
//                                         className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl px-4 py-3 hover:bg-[#222] transition cursor-pointer"
//                                     >
//                                         <Link href="/MainModules/VideoDrop">
//                                             <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-orange-900/40 flex items-center justify-center flex-shrink-0">
//                                                 <Play size={18} className="text-orange-500 fill-orange-500" />
//                                             </div>
//                                         </Link>
//                                         <div>
//                                             <p className="text-sm md:text-base font-medium leading-tight">
//                                                 {item.title}
//                                             </p>
//                                             <div className="flex items-center gap-1 mt-0.5">
//                                                 <Clock size={10} className="text-gray-400" />
//                                                 <span className="text-gray-400 text-[10px] md:text-xs">{item.duration}</span>
//                                                 <span className="text-gray-600 text-[10px]">•</span>
//                                                 <span className="text-gray-400 text-[10px] md:text-xs">{item.date}</span>
//                                             </div>
//                                         </div>

//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right Column — Request a Drop */}
//                     <div className="lg:sticky lg:top-6 lg:self-start">
//                         <div className="bg-[#1a1a1a] rounded-2xl p-5 md:p-6">
//                             <div className="flex items-center gap-3 mb-3">
//                                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-pink-600 to-orange-500 flex items-center justify-center flex-shrink-0">
//                                     <Mic size={18} className="text-white" />
//                                 </div>
//                                 <div>
//                                     <h3 className="font-bold text-sm md:text-base">Request a Drop</h3>
//                                     <p className="text-gray-400 text-[11px] md:text-xs leading-snug">
//                                         Want to hear more from Royal Challengers Bengaluru? Request a specific topic or moment!
//                                     </p>
//                                 </div>
//                             </div>

//                             <textarea
//                                 value={request}
//                                 onChange={(e) => setRequest(e.target.value)}
//                                 placeholder="What would you like to hear about?"
//                                 rows={5}
//                                 className="w-full mt-3 bg-[#0d0d0d] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none resize-none focus:border-pink-500 transition"
//                             />

//                             <button className="w-full mt-4 py-3 rounded-full font-bold text-sm md:text-base text-white bg-gradient-to-r from-pink-600 to-orange-500 hover:opacity-90 transition">
//                                 Submit Request
//                             </button>

//                             <p className="text-center text-gray-500 text-[10px] md:text-xs mt-2">
//                                 Your request will be reviewed by the team
//                             </p>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// }






















"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Headphones, Play, Clock, Mic } from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface AudioDrop {
    title: string;
    duration: string;
    description?: string;
    mediaUrl: string;
    thumbnail?: string;
    listens: number;
    signals: number;
    engagement: number;
}

interface VideoDrop {
    title: string;
    duration: string;
    description?: string;
    mediaUrl: string;
    thumbnail?: string;
    listens: number;
    signals: number;
    engagement: number;
}

interface Playlist {
    id: string;
    team360PostId: string;
    audioDrops: AudioDrop[];
    videoDrops: VideoDrop[];
    createdAt: number;
    updatedAt: number;
}

interface ApiResponse {
    success: boolean;
    playlists: Playlist[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

const ROOM_COLORS: Record<string, string> = {
    "Inner Room": "text-pink-500 border border-pink-500",
    "Reflection": "text-pink-500 border border-pink-500",
    "Open Room": "text-pink-500 border border-pink-500",
};

// Helper function to format date from timestamp
const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export default function FullPlaylistPage() {
    const [request, setRequest] = useState("");
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async () => {
        try {
            setLoading(true);
            const response = await axios.get<ApiResponse>("/api/team360-playlist");
            
            if (response.data.success) {
                setPlaylists(response.data.playlists);
                // Select the first playlist by default
                if (response.data.playlists.length > 0) {
                    setSelectedPlaylistId(response.data.playlists[0].id);
                }
            } else {
                setError("Failed to fetch playlists");
            }
        } catch (err) {
            console.error("Error fetching playlists:", err);
            setError("Failed to load playlists");
        } finally {
            setLoading(false);
        }
    };

    // Get the selected playlist
    const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId);

    // If no playlist selected and we have playlists, select the first one
    useEffect(() => {
        if (!selectedPlaylistId && playlists.length > 0) {
            setSelectedPlaylistId(playlists[0].id);
        }
    }, [playlists, selectedPlaylistId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading playlist...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button 
                        onClick={fetchPlaylists}
                        className="bg-pink-500 px-4 py-2 rounded text-white hover:bg-pink-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!selectedPlaylist) {
        return (
            <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
                <p className="text-gray-400">No playlists available</p>
            </div>
        );
    }

    const { audioDrops, videoDrops } = selectedPlaylist;

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white">

            {/* Header */}
            <div className="flex items-center gap-3 px-4 md:px-8 lg:px-12 py-4 border-b border-gray-800">
                <button className="text-white hover:text-pink-500 transition"
                    onClick={() => window.history.back()}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="font-bold text-base md:text-lg lg:text-xl leading-tight">
                        {selectedPlaylist.team360PostId || "Team 360 Playlist"}
                    </h1>
                    <p className="text-gray-400 text-xs md:text-sm">Full Playlist</p>
                </div>
            </div>

            {/* Playlist Selector (if multiple playlists) */}
            {playlists.length > 1 && (
                <div className="px-4 md:px-8 lg:px-12 py-3 border-b border-gray-800">
                    <div className="flex gap-2 overflow-x-auto">
                        {playlists.map((playlist) => (
                            <button
                                key={playlist.id}
                                onClick={() => setSelectedPlaylistId(playlist.id)}
                                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition ${
                                    selectedPlaylistId === playlist.id
                                        ? "bg-pink-500 text-white"
                                        : "bg-[#1a1a1a] text-gray-400 hover:bg-[#222]"
                                }`}
                            >
                                Playlist {playlist.id.slice(0, 8)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="px-4 md:px-8 lg:px-12 py-6 max-w-7xl mx-auto">

                {/* On tablet/desktop: two column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">

                    {/* Left Column — Audio + Video */}
                    <div className="flex flex-col gap-8">

                        {/* Audio Drops */}
                        {audioDrops && audioDrops.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Headphones size={18} className="text-pink-500" />
                                    <h2 className="font-bold text-sm md:text-base">Audio Drops</h2>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {audioDrops.map((item, i) => (
                                        <Link href={`/MainModules/AudioDrop?url=${encodeURIComponent(item.mediaUrl)}`} key={i}>
                                            <div
                                                className="flex items-center justify-between bg-[#1a1a1a] rounded-xl px-4 py-3 hover:bg-[#222] transition cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-pink-900/40 flex items-center justify-center flex-shrink-0">
                                                        <Headphones size={18} className="text-pink-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm md:text-base font-medium leading-tight">
                                                            {item.title}
                                                        </p>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <Clock size={10} className="text-gray-400" />
                                                            <span className="text-gray-400 text-[10px] md:text-xs">{item.duration}</span>
                                                            <span className="text-gray-600 text-[10px]">•</span>
                                                            <span className="text-gray-400 text-[10px] md:text-xs">{formatDate(Date.now())}</span>
                                                            <span className="text-gray-600 text-[10px]">•</span>
                                                            <span className="text-gray-400 text-[10px] md:text-xs">👂 {item.listens}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`text-[10px] md:text-xs px-2 py-0.5 rounded-md whitespace-nowrap text-pink-500 border border-pink-500`}>
                                                    Audio Drop
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Video Drops */}
                        {videoDrops && videoDrops.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Play size={18} className="text-orange-500" />
                                    <h2 className="font-bold text-sm md:text-base">Video Drops</h2>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {videoDrops.map((item, i) => (
                                        <Link href={`/MainModules/VideoDrop?url=${encodeURIComponent(item.mediaUrl)}`} key={i}>
                                            <div
                                                className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl px-4 py-3 hover:bg-[#222] transition cursor-pointer"
                                            >
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-orange-900/40 flex items-center justify-center flex-shrink-0">
                                                    <Play size={18} className="text-orange-500 fill-orange-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm md:text-base font-medium leading-tight">
                                                        {item.title}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <Clock size={10} className="text-gray-400" />
                                                        <span className="text-gray-400 text-[10px] md:text-xs">{item.duration}</span>
                                                        <span className="text-gray-600 text-[10px]">•</span>
                                                        <span className="text-gray-400 text-[10px] md:text-xs">{formatDate(Date.now())}</span>
                                                        <span className="text-gray-600 text-[10px]">•</span>
                                                        <span className="text-gray-400 text-[10px] md:text-xs">👁️ {item.listens}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No content message */}
                        {(!audioDrops || audioDrops.length === 0) && (!videoDrops || videoDrops.length === 0) && (
                            <div className="text-center py-10">
                                <p className="text-gray-400">No audio or video drops available</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column — Request a Drop */}
                    <div className="lg:sticky lg:top-6 lg:self-start">
                        <div className="bg-[#1a1a1a] rounded-2xl p-5 md:p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-pink-600 to-orange-500 flex items-center justify-center flex-shrink-0">
                                    <Mic size={18} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm md:text-base">Request a Drop</h3>
                                    <p className="text-gray-400 text-[11px] md:text-xs leading-snug">
                                        Want to hear more? Request a specific topic or moment!
                                    </p>
                                </div>
                            </div>

                            <textarea
                                value={request}
                                onChange={(e) => setRequest(e.target.value)}
                                placeholder="What would you like to hear about?"
                                rows={5}
                                className="w-full mt-3 bg-[#0d0d0d] border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none resize-none focus:border-pink-500 transition"
                            />

                            <button className="w-full mt-4 py-3 rounded-full font-bold text-sm md:text-base text-white bg-gradient-to-r from-pink-600 to-orange-500 hover:opacity-90 transition">
                                Submit Request
                            </button>

                            <p className="text-center text-gray-500 text-[10px] md:text-xs mt-2">
                                Your request will be reviewed by the team
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}