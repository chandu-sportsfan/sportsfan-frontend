// "use client";
// import { useState, useEffect, useRef } from "react";
// import { ArrowLeft, Headphones, Play, Users, Loader2 } from "lucide-react";
// import Link from "next/link";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext"; 
// import { useGlobalAudio } from "@/hooks/useGlobalAudio";

// interface MatchInfo {
//     team1?: string;
//     team2?: string;
//     type?: string;
//     speaker?: string;
//     date?: string;
// }

// interface AudioFile {
//     id: string;
//     title: string;
//     fileName: string;
//     url: string;
//     duration: string;
//     durationSeconds: number;
//     size: number;
//     sizeFormatted: string;
//     format: string;
//     createdAt: string;
//     createdAtFormatted: string;
//     folder: string;
//     matchInfo?: MatchInfo;
// }

// interface Drop {
//     id: string;
//     title: string;
//     duration: string;
//     plays: string;
//     author: string;
//     badge: "Inner Room" | "Public";
//     type: "audio" | "video";
//     url?: string;
//     createdAt?: string;
// }

// interface DateGroup {
//     label: string;
//     audioDrops: Drop[];
//     videoDrops: Drop[];
// }

// // Convert API audio file to Drop format
// function audioFileToDrop(audio: AudioFile): Drop {
//     return {
//         id: audio.id,
//         title: audio.title,
//         duration: audio.duration,
//         plays: "0",
//         author: audio.matchInfo?.speaker || "Unknown",
//         badge: "Inner Room",
//         type: "audio",
//         url: audio.url,
//         createdAt: audio.createdAt,
//     };
// }

// // Group drops by date label
// function groupByDate(drops: Drop[]): DateGroup[] {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     const groups = new Map<string, Drop[]>();

//     drops.forEach((drop) => {
//         let label = "Unknown";
//         if (drop.createdAt) {
//             const date = new Date(drop.createdAt);
//             date.setHours(0, 0, 0, 0);
//             const dateString = date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

//             if (date.getTime() === today.getTime()) {
//                 label = `Today (${dateString})`;
//             } else if (date.getTime() === yesterday.getTime()) {
//                 label = `Yesterday (${dateString})`;
//             } else {
//                 label = dateString;
//             }
//         }
//         if (!groups.has(label)) groups.set(label, []);
//         groups.get(label)!.push(drop);
//     });

//     return Array.from(groups.entries()).map(([label, audioDrops]) => ({
//         label,
//         audioDrops,
//         videoDrops: [],
//     }));
// }



// function DropRow({ drop }: { drop: Drop }) {
//     const [playing, setPlaying] = useState(false);
//     const [duration, setDuration] = useState<string>(drop.duration || "0:00");
//     const [plays, setPlays] = useState<number>(parseInt(drop.plays) || 0);
//     const audioRef = useRef<HTMLAudioElement | null>(null);
//     const hasCountedPlay = useRef(false);
//     const { audioManager, currentAudio } = useGlobalAudio();

//     // Check if this audio is currently playing globally
//     const isCurrentlyPlaying = currentAudio === audioRef.current && playing;

//     // Initialize audio element
//     useEffect(() => {
//         if (drop.url) {
//             audioRef.current = new Audio(drop.url);

//             const handleMetadata = () => {
//                 const audio = audioRef.current;
//                 if (audio && audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
//                     const m = Math.floor(audio.duration / 60);
//                     const s = Math.floor(audio.duration % 60);
//                     setDuration(`${m}:${s.toString().padStart(2, "0")}`);
//                 }
//             };

//             audioRef.current.addEventListener("loadedmetadata", handleMetadata);

//             // Cleanup on unmount or when URL changes
//             return () => {
//                 if (audioRef.current) {
//                     audioRef.current.pause();
//                     audioRef.current.src = "";
//                     audioRef.current.load();
//                     audioRef.current.removeEventListener("loadedmetadata", handleMetadata);
//                     audioRef.current = null;
//                 }
//             };
//         }
//     }, [drop.url]);

//     const incrementPlay = async () => {
//         if (hasCountedPlay.current) return;
//         hasCountedPlay.current = true;
//         try {
//             const res = await axios.post("/api/plays", { id: drop.id });
//             if (res.data.success) setPlays(res.data.plays);
//         } catch {
//             // silently fail
//         }
//     };

//     const togglePlay = () => {
//         const audio = audioRef.current;
//         if (!audio) return;

//         if (playing && currentAudio === audio) {
//             // Pause current audio
//             audioManager.pause(audio, () => {
//                 setPlaying(false);
//             });
//         } else {
//             // Play new audio (this will automatically stop any other playing audio)
//             audioManager.play(
//                 audio,
//                 () => {
//                     setPlaying(true);
//                     incrementPlay();
//                 },
//                 () => {
//                     setPlaying(false);
//                 }
//             );
//         }
//     };

//     // Update playing state when global audio changes
//     useEffect(() => {
//         if (currentAudio !== audioRef.current && playing) {
//             setPlaying(false);
//         }
//     }, [currentAudio]);

//     // Cleanup when component unmounts
//     useEffect(() => {
//         return () => {
//             if (audioRef.current && currentAudio === audioRef.current) {
//                 audioRef.current.pause();
//                 audioRef.current = null;
//             }
//         };
//     }, []);

//     return (
//         <div className="flex items-center justify-between px-3 py-3 bg-[#141414] rounded-xl mb-2 gap-3">
//             <Link href={`/MainModules/MatchesDropContent/AudioDropScreen?id=${encodeURIComponent(drop.id)}`}>
//                 <div className="flex items-center gap-3 min-w-0">
//                     <button
//                         onClick={(e) => {
//                             e.preventDefault();
//                             togglePlay();
//                         }}
//                         className="w-10 h-10 rounded-lg bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 border border-white/5 hover:border-[#C9115F]/40 transition-colors"
//                     >
//                         {drop.type === "audio" ? (
//                             isCurrentlyPlaying ? (
//                                 <span className="w-3 h-3 flex gap-0.5 items-end">
//                                     <span className="w-1 h-3 bg-[#C9115F] rounded-sm animate-pulse" />
//                                     <span className="w-1 h-2 bg-[#C9115F] rounded-sm animate-pulse delay-75" />
//                                     <span className="w-1 h-3 bg-[#C9115F] rounded-sm animate-pulse delay-150" />
//                                 </span>
//                             ) : (
//                                 <Headphones size={16} className="text-[#C9115F]" />
//                             )
//                         ) : (
//                             <Play size={16} className="text-[#C9115F]" fill="#C9115F" />
//                         )}
//                     </button>

//                     <div className="min-w-0">
//                         <p className="text-white text-sm font-medium truncate text-wrap">{drop.title}</p>
//                         <div className="flex items-center gap-2 mt-0.5">
//                             <span className="text-gray-500 text-xs">{duration}</span>
//                             <span className="text-gray-600 text-xs">•</span>
//                             <span className="text-gray-500 text-xs">{plays} plays</span>
//                         </div>
//                         <div className="flex flex-row items-start gap-1 mt-0.5">
//                             <Users size={10} className="text-gray-600 mt-1" />
//                             <span className="text-gray-500 text-[11px]">by {drop.author}</span>
//                         </div>
//                     </div>
//                 </div>
//             </Link>

//             <Link href={`/MainModules/MatchesDropContent/AudioDropScreen?id=${encodeURIComponent(drop.id)}`}>
//                 <span className="flex-shrink-0 text-[#C9115F] text-xs font-semibold whitespace-nowrap">
//                     {drop.badge}
//                 </span>
//             </Link>
//         </div>
//     );
// }



// function SectionLabel({ label }: { label: string }) {
//     const isToday = label === "Today";
//     return (
//         <div className={`inline-block px-3 py-1 rounded-md mb-4 text-sm font-semibold ${isToday ? "bg-[#b8460a] text-white" : "bg-[#1e1e1e] text-gray-300 border border-white/10"}`}>
//             {label}
//         </div>
//     );
// }

// export default function FullPlaylist() {
//     const { user, getUserName, getUserDisplayName, isAuthenticated, loading: authLoading } = useAuth();
//     const [requestText, setRequestText] = useState("");
//     const [dateGroups, setDateGroups] = useState<DateGroup[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [search, setSearch] = useState("");
//     const [submitting, setSubmitting] = useState(false);
//     const [submitted, setSubmitted] = useState(false);
//     const [submitError, setSubmitError] = useState<string | null>(null);
//     const [displayName, setDisplayName] = useState("");

//     // Get or create user ID for drop requests
//     const getUserId = () => {
//         // If authenticated, use the actual user ID from backend
//         if (user?.userId) {
//             return user.userId;
//         }
//         // Fallback for non-authenticated users
//         let userId = localStorage.getItem("drop_request_user_id");
//         if (!userId) {
//             userId = `user_${Math.random().toString(36).substr(2, 9)}`;
//             localStorage.setItem("drop_request_user_id", userId);
//         }
//         return userId;
//     };

//     // Get user name for display from auth context
//     useEffect(() => {
//         if (!authLoading) {
//             if (isAuthenticated && user) {
//                 const name = getUserDisplayName();
//                 setDisplayName(name);
//                 // Store for consistency
//                 localStorage.setItem("drop_request_user_name", name);
//             } else {
//                 // Fallback to stored or generate random
//                 let storedName = localStorage.getItem("drop_request_user_name");
//                 if (!storedName) {
//                     storedName = `Fan_${Math.random().toString(36).substr(2, 5)}`;
//                     localStorage.setItem("drop_request_user_name", storedName);
//                 }
//                 setDisplayName(storedName);
//             }
//         }
//     }, [user, isAuthenticated, authLoading, getUserDisplayName]);

//     // Get user name for API (formatted for backend)
//     const getUserNameForRequest = () => {
//         if (isAuthenticated && user) {
//             // Convert to username format (no spaces, lowercase)
//             return getUserName();
//         }
//         // Fallback to stored
//         const stored = localStorage.getItem("drop_request_user_name");
//         if (stored) return stored.toLowerCase().replace(/\s/g, "_");
//         return `fan_${Math.random().toString(36).substr(2, 5)}`;
//     };

//     const handleSubmitRequest = async () => {
//         if (!requestText.trim()) return;

//         setSubmitting(true);
//         setSubmitError(null);

//         try {
//             const response = await axios.post("/api/request-drop", {
//                 userName: getUserNameForRequest(),
//                 message: requestText.trim(),
//                 audioTitle: null,
//                 userId: getUserId(),
//             });

//             if (response.data.success) {
//                 setSubmitted(true);
//                 setRequestText("");
//                 setTimeout(() => setSubmitted(false), 3000);
//             } else {
//                 setSubmitError(response.data.message || "Failed to submit request");
//                 setTimeout(() => setSubmitError(null), 3000);
//             }
//         } catch (err) {
//             console.error("Error submitting request:", err);
//             setSubmitError("Something went wrong. Please try again.");
//             setTimeout(() => setSubmitError(null), 3000);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     useEffect(() => {
//         fetchAudio();
//     }, []);

//     const fetchAudio = async (searchTerm?: string) => {
//         setLoading(true);
//         setError(null);
//         try {
//             const params = new URLSearchParams({ limit: "50" });
//             if (searchTerm) params.append("search", searchTerm);

//             const [audioRes, playsRes] = await Promise.all([
//                 axios.get(`/api/cloudinary/audio?${params.toString()}`),
//                 axios.get("/api/cloudinary/plays"),
//             ]);

//             if (audioRes.data.success) {
//                 const playsMap: Record<string, number> = playsRes.data.plays || {};
//                 const drops: Drop[] = audioRes.data.audioFiles.map((audio: AudioFile) => ({
//                     ...audioFileToDrop(audio),
//                     plays: String(playsMap[audio.id] || 0),
//                 }));
//                 const groups = groupByDate(drops);
//                 setDateGroups(groups);
//             } else {
//                 setError("Failed to load audio files.");
//             }
//         } catch (err) {
//             console.error("Error fetching audio:", err);
//             setError("Something went wrong. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const val = e.target.value;
//         setSearch(val);
//         fetchAudio(val || undefined);
//     };

//     return (
//         <div className="min-h-screen bg-[#0d0d10] text-white pb-10">
//             {/* Header */}
//             <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5 sticky top-0 bg-[#0d0d10] z-10">
//                 <Link href="/MainModules/HomePage">
//                     <button className="text-gray-400 hover:text-white transition-colors cursor-pointer">
//                         <ArrowLeft size={20} />
//                     </button>
//                 </Link>
//                 <div className="flex-1 min-w-0">
//                     <h1 className="text-base font-bold text-white leading-tight">Full Playlist</h1>
//                     <p className="text-xs text-gray-500">Audio Drops</p>
//                 </div>
//                 {/* Search — desktop */}
//                 <input
//                     type="text"
//                     value={search}
//                     onChange={handleSearch}
//                     placeholder="Search drops..."
//                     className="hidden sm:block bg-[#1a1a1a] border border-white/10 rounded-full px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9115F]/50 w-40"
//                 />
//             </div>

//             {/* Search — mobile */}
//             <div className="sm:hidden px-4 pt-3">
//                 <input
//                     type="text"
//                     value={search}
//                     onChange={handleSearch}
//                     placeholder="Search drops..."
//                     className="w-full bg-[#1a1a1a] border border-white/10 rounded-full px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9115F]/50"
//                 />
//             </div>

//             {/* Body */}
//             <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 px-4 lg:px-8 py-6 max-w-6xl mx-auto">

//                 {/* Left: Drops Feed */}
//                 <div className="flex-1 min-w-0">
//                     {loading ? (
//                         <div className="flex items-center justify-center py-20">
//                             <Loader2 size={28} className="animate-spin text-[#C9115F]" />
//                             <span className="ml-3 text-gray-400 text-sm">Loading drops...</span>
//                         </div>
//                     ) : error ? (
//                         <div className="flex flex-col items-center justify-center py-20 gap-3">
//                             <p className="text-red-400 text-sm">{error}</p>
//                             <button
//                                 onClick={() => fetchAudio()}
//                                 className="px-4 py-2 bg-[#C9115F] text-white text-xs rounded-lg hover:opacity-90"
//                             >
//                                 Retry
//                             </button>
//                         </div>
//                     ) : dateGroups.length === 0 ? (
//                         <div className="flex items-center justify-center py-20">
//                             <p className="text-gray-500 text-sm">
//                                 {search ? `No drops found for "${search}"` : "No audio drops available."}
//                             </p>
//                         </div>
//                     ) : (
//                         dateGroups.map((group) => (
//                             <div key={group.label} className="mb-8">
//                                 <SectionLabel label={group.label} />

//                                 {group.audioDrops.length > 0 && (
//                                     <div className="mb-5">
//                                         <p className="text-gray-400 text-sm font-medium mb-3">Audio Drops</p>
//                                         {group.audioDrops.map((drop) => (
//                                             <DropRow key={drop.id} drop={drop} />
//                                         ))}
//                                     </div>
//                                 )}

//                                 {group.videoDrops.length > 0 && (
//                                     <div>
//                                         <p className="text-gray-400 text-sm font-medium mb-3">Video Drops</p>
//                                         {group.videoDrops.map((drop) => (
//                                             <DropRow key={drop.id} drop={drop} />
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         ))
//                     )}
//                 </div>

//                 {/* Right: Request a Drop Panel */}
//                 <div className="w-full lg:w-[340px] flex-shrink-0">
//                     <div className="bg-[#141414] rounded-2xl border border-white/5 p-5 lg:sticky lg:top-24">
//                         {/* Panel Header */}
//                         <div className="flex items-start gap-3 mb-4">
//                             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9115F] to-[#e85d04] flex items-center justify-center flex-shrink-0">
//                                 <span className="text-white text-sm font-bold">e</span>
//                             </div>
//                             <div>
//                                 <p className="text-white text-sm font-semibold leading-tight">Request a drop</p>
//                                 <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
//                                     Want to hear more from specific team? Request a specific topic or moment!
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Show user info - Now using authenticated user name */}
//                         <div className="mb-3 p-2 bg-[#1a1a1a] rounded-lg border border-white/5">
//                             <p className="text-gray-500 text-xs">Requesting as:</p>
//                             <p className="text-[#C9115F] text-sm font-medium">
//                                 {authLoading ? "Loading..." : displayName}
//                                 {isAuthenticated && user && (
//                                     <span className="ml-2 text-xs text-green-400">(Verified)</span>
//                                 )}
//                             </p>
//                         </div>

//                         {/* Textarea */}
//                         <textarea
//                             value={requestText}
//                             onChange={(e) => setRequestText(e.target.value)}
//                             placeholder="What would you like to hear about? (e.g., specific match analysis, player interview, etc.)"
//                             rows={4}
//                             className="w-full bg-[#0d0d10] text-white text-sm placeholder-gray-600 rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-[#C9115F]/50 resize-none transition-colors"
//                         />

//                         {/* Character counter */}
//                         <div className="flex justify-end mt-1">
//                             <span className="text-gray-600 text-xs">{requestText.length}/500</span>
//                         </div>

//                         {/* Success message */}
//                         {submitted && (
//                             <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
//                                 <p className="text-green-400 text-xs text-center">
//                                     ✓ Request submitted successfully!
//                                 </p>
//                                 <p className="text-gray-500 text-xs text-center mt-1">
//                                     We&apos;ll review your request shortly.
//                                 </p>
//                             </div>
//                         )}

//                         {/* Error message */}
//                         {submitError && (
//                             <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
//                                 <p className="text-red-400 text-xs text-center">
//                                     {submitError}
//                                 </p>
//                             </div>
//                         )}

//                         {/* Submit Button */}
//                         <button
//                             onClick={handleSubmitRequest}
//                             disabled={submitting || !requestText.trim()}
//                             className="w-full mt-4 py-3 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-[#C9115F] to-[#e85d04] hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                         >
//                             {submitting && <Loader2 size={14} className="animate-spin" />}
//                             {submitting ? "Submitting..." : "Submit Request"}
//                         </button>

//                         {/* Note about authentication */}
//                         {!isAuthenticated && !authLoading && (
//                             <p className="text-gray-600 text-xs text-center mt-3">
//                                 Not signed in? Your requests will appear as {displayName}
//                             </p>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }















"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Headphones, Play, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useGlobalAudio } from "@/hooks/useGlobalAudio";

// ── Team filter map ──────────────────────────────────────────────────────────
const TEAM_ABBR_MAP: Record<string, string[]> = {
    "Mumbai Indians": ["MI", "Mumbai"],
    "Chennai Super Kings": ["CSK", "Chennai"],
    "Royal Challengers Bengaluru": ["RCB", "Bengaluru", "Bangalore"],
    "Sunrisers Hyderabad": ["SRH", "Hyderabad"],
    "Kolkata Knight Riders": ["KKR", "Kolkata"],
    "Delhi Capitals": ["DC", "Delhi"],
    "Rajasthan Royals": ["RR", "Rajasthan"],
    "Punjab Kings": ["PBKS", "Punjab"],
    "Lucknow Super Giants": ["LSG", "Lucknow"],
    "Gujarat Titans": ["GT", "Gujarat"],
};

function audioMatchesTeam(audioTitle: string, teamName: string): boolean {
    const abbrs = TEAM_ABBR_MAP[teamName] || [teamName];
    const title = audioTitle.toUpperCase();
    return abbrs.some((abbr) => title.includes(abbr.toUpperCase()));
}

// ── Interfaces ───────────────────────────────────────────────────────────────
interface MatchInfo {
    team1?: string;
    team2?: string;
    type?: string;
    speaker?: string;
    date?: string;
}

interface AudioFile {
    id: string;
    title: string;
    fileName: string;
    url: string;
    duration: string;
    durationSeconds: number;
    size: number;
    sizeFormatted: string;
    format: string;
    createdAt: string;
    createdAtFormatted: string;
    folder: string;
    matchInfo?: MatchInfo;
}

interface Drop {
    id: string;
    title: string;
    duration: string;
    plays: string;
    author: string;
    badge: "Inner Room" | "Public";
    type: "audio" | "video";
    url?: string;
    createdAt?: string;
}

interface DateGroup {
    label: string;
    audioDrops: Drop[];
    videoDrops: Drop[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function audioFileToDrop(audio: AudioFile): Drop {
    return {
        id: audio.id,
        title: audio.title,
        duration: audio.duration,
        plays: "0",
        author: audio.matchInfo?.speaker || "Unknown",
        badge: "Inner Room",
        type: "audio",
        url: audio.url,
        createdAt: audio.createdAt,
    };
}

function groupByDate(drops: Drop[]): DateGroup[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const groups = new Map<string, Drop[]>();

    drops.forEach((drop) => {
        let label = "Unknown";
        if (drop.createdAt) {
            const date = new Date(drop.createdAt);
            date.setHours(0, 0, 0, 0);
            const dateString = date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
            });
            if (date.getTime() === today.getTime()) label = `Today (${dateString})`;
            else if (date.getTime() === yesterday.getTime()) label = `Yesterday (${dateString})`;
            else label = dateString;
        }
        if (!groups.has(label)) groups.set(label, []);
        groups.get(label)!.push(drop);
    });

    return Array.from(groups.entries()).map(([label, audioDrops]) => ({
        label,
        audioDrops,
        videoDrops: [],
    }));
}

// ── DropRow ──────────────────────────────────────────────────────────────────
function DropRow({ drop }: { drop: Drop }) {
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState<string>(drop.duration || "0:00");
    const [plays, setPlays] = useState<number>(parseInt(drop.plays) || 0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hasCountedPlay = useRef(false);
    const { audioManager, currentAudio } = useGlobalAudio();

    const isCurrentlyPlaying = currentAudio === audioRef.current && playing;

    useEffect(() => {
        if (drop.url) {
            audioRef.current = new Audio(drop.url);
            const handleMetadata = () => {
                const audio = audioRef.current;
                if (audio && audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
                    const m = Math.floor(audio.duration / 60);
                    const s = Math.floor(audio.duration % 60);
                    setDuration(`${m}:${s.toString().padStart(2, "0")}`);
                }
            };
            audioRef.current.addEventListener("loadedmetadata", handleMetadata);
            return () => {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.src = "";
                    audioRef.current.load();
                    audioRef.current.removeEventListener("loadedmetadata", handleMetadata);
                    audioRef.current = null;
                }
            };
        }
    }, [drop.url]);

    const incrementPlay = async () => {
        if (hasCountedPlay.current) return;
        hasCountedPlay.current = true;
        try {
            const res = await axios.post("/api/plays", { id: drop.id });
            if (res.data.success) setPlays(res.data.plays);
        } catch { }
    };

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (playing && currentAudio === audio) {
            audioManager.pause(audio, () => setPlaying(false));
        } else {
            audioManager.play(
                audio,
                () => { setPlaying(true); incrementPlay(); },
                () => setPlaying(false)
            );
        }
    };

    useEffect(() => {
        if (currentAudio !== audioRef.current && playing) setPlaying(false);
    }, [currentAudio]);

    useEffect(() => {
        return () => {
            if (audioRef.current && currentAudio === audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    return (
        <div className="flex items-center justify-between px-3 py-3 bg-[#141414] rounded-xl mb-2 gap-3">
            <Link
                href={`/MainModules/MatchesDropContent/AudioDropScreen?id=${encodeURIComponent(drop.id)}`}
                className="flex items-center gap-3 min-w-0 flex-1"
            >
                <button
                    onClick={(e) => { e.preventDefault(); togglePlay(); }}
                    className="w-10 h-10 rounded-lg bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 border border-white/5 hover:border-[#C9115F]/40 transition-colors"
                >
                    {drop.type === "audio" ? (
                        isCurrentlyPlaying ? (
                            <span className="w-3 h-3 flex gap-0.5 items-end">
                                <span className="w-1 h-3 bg-[#C9115F] rounded-sm animate-pulse" />
                                <span className="w-1 h-2 bg-[#C9115F] rounded-sm animate-pulse delay-75" />
                                <span className="w-1 h-3 bg-[#C9115F] rounded-sm animate-pulse delay-150" />
                            </span>
                        ) : (
                            <Headphones size={16} className="text-[#C9115F]" />
                        )
                    ) : (
                        <Play size={16} className="text-[#C9115F]" fill="#C9115F" />
                    )}
                </button>
                <div className="min-w-0">
                    <p className="text-white text-sm font-medium  leading-snug line-clamp-2">{drop.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-gray-500 text-xs">{duration}</span>
                        {/* <span className="text-gray-600 text-xs">•</span> */}
                        {/* <span className="text-gray-500 text-xs">{plays} plays</span> */}
                    </div>
                    <div className="flex flex-row items-start gap-1 mt-0.5">
                        <Users size={10} className="text-gray-600 mt-1" />
                        <span className="text-gray-500 text-[11px]">by {drop.author}</span>
                    </div>
                </div>
            </Link>
            {/* <Link href={`/MainModules/MatchesDropContent/AudioDropScreen?id=${encodeURIComponent(drop.id)}`}>
        <span className="flex-shrink-0 text-[#C9115F] text-xs font-semibold whitespace-nowrap">
          {drop.badge}
        </span>
      </Link> */}
        </div>
    );
}

// ── SectionLabel 
function SectionLabel({ label }: { label: string }) {
    const isToday = label.startsWith("Today");
    return (
        <div
            className={`inline-block px-3 py-1 rounded-md mb-4 text-sm font-semibold ${isToday
                ? "bg-[#b8460a] text-white"
                : "bg-[#1e1e1e] text-gray-300 border border-white/10"
                }`}
        >
            {label}
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function FullPlaylist() {
    const searchParams = useSearchParams();
    const teamFilter = searchParams.get("team"); // e.g. "Mumbai Indians" or null

    const { user, getUserName, getUserDisplayName, isAuthenticated, loading: authLoading } = useAuth();
    const [requestText, setRequestText] = useState("");
    const [dateGroups, setDateGroups] = useState<DateGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState("");
    const requestPanelRef = useRef<HTMLDivElement>(null);

    const getUserId = () => {
        if (user?.userId) return user.userId;
        let userId = localStorage.getItem("drop_request_user_id");
        if (!userId) {
            userId = `user_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem("drop_request_user_id", userId);
        }
        return userId;
    };

    useEffect(() => {
        if (!authLoading) {
            if (isAuthenticated && user) {
                const name = getUserDisplayName();
                setDisplayName(name);
                localStorage.setItem("drop_request_user_name", name);
            } else {
                let storedName = localStorage.getItem("drop_request_user_name");
                if (!storedName) {
                    storedName = `Fan_${Math.random().toString(36).substr(2, 5)}`;
                    localStorage.setItem("drop_request_user_name", storedName);
                }
                setDisplayName(storedName);
            }
        }
    }, [user, isAuthenticated, authLoading, getUserDisplayName]);

    const getUserNameForRequest = () => {
        if (isAuthenticated && user) return getUserName();
        const stored = localStorage.getItem("drop_request_user_name");
        if (stored) return stored.toLowerCase().replace(/\s/g, "_");
        return `fan_${Math.random().toString(36).substr(2, 5)}`;
    };

    const scrollToRequestPanel = () => {
        requestPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleSubmitRequest = async () => {
        if (!requestText.trim()) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            const response = await axios.post("/api/request-drop", {
                userName: getUserNameForRequest(),
                message: requestText.trim(),
                audioTitle: null,
                userId: getUserId(),
            });
            if (response.data.success) {
                setSubmitted(true);
                setRequestText("");
                setTimeout(() => setSubmitted(false), 3000);
            } else {
                setSubmitError(response.data.message || "Failed to submit request");
                setTimeout(() => setSubmitError(null), 3000);
            }
        } catch {
            setSubmitError("Something went wrong. Please try again.");
            setTimeout(() => setSubmitError(null), 3000);
        } finally {
            setSubmitting(false);
        }
    };

    // Re-fetch whenever team filter changes
    useEffect(() => {
        fetchAudio();
    }, [teamFilter]);

    const fetchAudio = async (searchTerm?: string) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ limit: "100" });
            if (searchTerm) params.append("search", searchTerm);

            const [audioRes, playsRes] = await Promise.all([
                axios.get(`/api/cloudinary/audio?${params.toString()}`),
                axios.get("/api/cloudinary/plays"),
            ]);

            if (audioRes.data.success) {
                const playsMap: Record<string, number> = playsRes.data.plays || {};
                let drops: Drop[] = audioRes.data.audioFiles.map((audio: AudioFile) => ({
                    ...audioFileToDrop(audio),
                    plays: String(playsMap[audio.id] || 0),
                }));

                // Filter by team if ?team= param is present
                if (teamFilter) {
                    drops = drops.filter((d) => audioMatchesTeam(d.title, teamFilter));
                }

                setDateGroups(groupByDate(drops));
            } else {
                setError("Failed to load audio files.");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearch(val);
        fetchAudio(val || undefined);
    };

    return (
        <div className="min-h-screen bg-[#0d0d10] text-white pb-10">

            {/* ── Header ── */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5 sticky top-0 bg-[#0d0d10] z-10">
                <Link href="/MainModules/HomePage">
                    <button className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <ArrowLeft size={20} />
                    </button>
                </Link>

                <div className="flex-1 min-w-0">
                    <h1 className="text-base font-bold text-white leading-tight">
                        {teamFilter ? `${teamFilter}` : "Full Playlist"}
                    </h1>
                    <p className="text-xs text-gray-500">
                        {teamFilter ? "Match Audio Drops" : "All Audio Drops"}
                    </p>
                </div>

                {/* Team badge + clear filter */}
                {teamFilter && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] bg-[#C9115F]/20 text-[#C9115F] border border-[#C9115F]/30 px-2 py-1 rounded-full font-bold">
                            {teamFilter}
                        </span>
                        <Link href="/MainModules/MatchesDropContent">
                            <button className="text-gray-500 hover:text-white text-xs transition-colors">
                                ✕
                            </button>
                        </Link>
                    </div>
                )}

                {/* Search — desktop, hidden when team-filtered */}
                {/* {!teamFilter && (
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search drops..."
                        className="hidden sm:block bg-[#1a1a1a] border border-white/10 rounded-full px-3 py-1.5 mr-50 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9115F]/50 w-40"
                    />
                )} */}
            </div>

            {/* Search — mobile, hidden when team-filtered */}
            {!teamFilter && (
                <div className="w-full lg:w-fit ml-0 lg:ml-38 px-4 pt-3">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search drops..."
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-full px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9115F]/50"
                    />
                </div>
            )}

            {/* <div className="lg:hidden block text-[12px] text-[#C9115F] bg-[#C9115F]/20 px-3 py-1 w-fit mt-6 rounded-full ml-4">Request Drop</div> */}
            <button
                onClick={scrollToRequestPanel}
                className="lg:hidden block text-[12px] text-white bg-[#C9115F] px-3 py-1 w-fit mt-6 rounded-full ml-4"
            >
                Request Drop
            </button>
            {/* ── Body ── */}
            <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 px-4 lg:px-8 py-6 max-w-6xl mx-auto">

                {/* Left: Drops Feed */}
                <div className="flex-1 min-w-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 size={28} className="animate-spin text-[#C9115F]" />
                            <span className="ml-3 text-gray-400 text-sm">Loading drops...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <p className="text-red-400 text-sm">{error}</p>
                            <button
                                onClick={() => fetchAudio()}
                                className="px-4 py-2 bg-[#C9115F] text-white text-xs rounded-lg hover:opacity-90"
                            >
                                Retry
                            </button>
                        </div>
                    ) : dateGroups.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <p className="text-gray-500 text-sm text-center">
                                {teamFilter
                                    ? `No audio drops found for ${teamFilter} yet.`
                                    : search
                                        ? `No drops found for "${search}"`
                                        : "No audio drops available."}
                            </p>
                            {teamFilter && (
                                <Link href="/MainModules/MatchesDropContent">
                                    <button className="px-4 py-2 bg-[#1e1e1e] text-gray-300 text-xs rounded-lg border border-white/10 hover:bg-[#2a2a2a] transition-colors">
                                        View All Drops
                                    </button>
                                </Link>
                            )}
                        </div>
                    ) : (
                        dateGroups.map((group) => (
                            <div key={group.label} className="mb-8">
                                <SectionLabel label={group.label} />
                                {group.audioDrops.length > 0 && (
                                    <div className="mb-5">
                                        <p className="text-gray-400 text-sm font-medium mb-3">Audio Drops</p>
                                        {group.audioDrops.map((drop) => (
                                            <DropRow key={drop.id} drop={drop} />
                                        ))}
                                    </div>
                                )}
                                {group.videoDrops.length > 0 && (
                                    <div>
                                        <p className="text-gray-400 text-sm font-medium mb-3">Video Drops</p>
                                        {group.videoDrops.map((drop) => (
                                            <DropRow key={drop.id} drop={drop} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Right: Request a Drop Panel */}
                <div className="w-full lg:w-[340px] flex-shrink-0" ref={requestPanelRef}>
                    <div className="bg-[#141414] rounded-2xl border border-white/5 p-5 lg:sticky lg:top-24">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9115F] to-[#e85d04] flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-bold">e</span>
                            </div>
                            <div>
                                <p className="text-white text-sm font-semibold leading-tight">Request a drop</p>
                                <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                                    {teamFilter
                                        ? `Want more ${teamFilter} content? Request a specific topic or moment!`
                                        : "Want to hear more from a specific team? Request a topic or moment!"}
                                </p>
                            </div>
                        </div>

                        <div className="mb-3 p-2 bg-[#1a1a1a] rounded-lg border border-white/5">
                            <p className="text-gray-500 text-xs">Requesting as:</p>
                            <p className="text-[#C9115F] text-sm font-medium">
                                {authLoading ? "Loading..." : displayName}
                                {isAuthenticated && user && (
                                    <span className="ml-2 text-xs text-green-400">(Verified)</span>
                                )}
                            </p>
                        </div>

                        <textarea
                            value={requestText}
                            onChange={(e) => setRequestText(e.target.value)}
                            placeholder={
                                teamFilter
                                    ? `Request a ${teamFilter} drop... (e.g., match analysis, player interview)`
                                    : "What would you like to hear about? (e.g., specific match analysis, player interview, etc.)"
                            }
                            rows={4}
                            className="w-full bg-[#0d0d10] text-white text-sm placeholder-gray-600 rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-[#C9115F]/50 resize-none transition-colors"
                        />

                        <div className="flex justify-end mt-1">
                            <span className="text-gray-600 text-xs">{requestText.length}/500</span>
                        </div>

                        {submitted && (
                            <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <p className="text-green-400 text-xs text-center">✓ Request submitted successfully!</p>
                                <p className="text-gray-500 text-xs text-center mt-1">We&apos;ll review your request shortly.</p>
                            </div>
                        )}

                        {submitError && (
                            <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-xs text-center">{submitError}</p>
                            </div>
                        )}

                        <button
                            onClick={handleSubmitRequest}
                            disabled={submitting || !requestText.trim()}
                            className="w-full mt-4 py-3 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-[#C9115F] to-[#e85d04] hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting && <Loader2 size={14} className="animate-spin" />}
                            {submitting ? "Submitting..." : "Submit Request"}
                        </button>

                        {!isAuthenticated && !authLoading && (
                            <p className="text-gray-600 text-xs text-center mt-3">
                                Not signed in? Your requests will appear as {displayName}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}