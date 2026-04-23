// "use client";
// import { useState, useEffect, useRef } from "react";
// import { ArrowLeft, Headphones, Play, Users, Loader2 } from "lucide-react";
// import Link from "next/link";
// import axios from "axios";

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
//     let label = "Unknown";
//     if (drop.createdAt) {
//         const date = new Date(drop.createdAt);
//         date.setHours(0, 0, 0, 0);
//         const dateString = date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

//         if (date.getTime() === today.getTime()) {
//             label = `Today (${dateString})`;
//         } else if (date.getTime() === yesterday.getTime()) {
//             label = `Yesterday (${dateString})`;
//         } else {
//             label = dateString;
//         }
//     }
//     if (!groups.has(label)) groups.set(label, []);
//     groups.get(label)!.push(drop);
// });

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
//     const [audio] = useState(() => (drop.url ? new Audio(drop.url) : null));
//     const hasCountedPlay = useRef(false);


//     useEffect(() => {
//         if (!audio) return;

//         const handleMetadata = () => {
//             const secs = audio.duration;
//             if (secs && !isNaN(secs) && isFinite(secs)) {
//                 const m = Math.floor(secs / 60);
//                 const s = Math.floor(secs % 60);
//                 setDuration(`${m}:${s.toString().padStart(2, "0")}`);
//             }
//         };

//         audio.addEventListener("loadedmetadata", handleMetadata);
//         if (audio.readyState >= 1) handleMetadata();

//         return () => {
//             audio.removeEventListener("loadedmetadata", handleMetadata);
//         };
//     }, [audio]);

//     const incrementPlay = async () => {
//         if (hasCountedPlay.current) return; // only count once per mount
//         hasCountedPlay.current = true;
//         try {
//             const res = await axios.post("/api/plays", { id: drop.id });
//             if (res.data.success) setPlays(res.data.plays);
//         } catch {
//             // silently fail — don't break playback
//         }
//     };

//     const togglePlay = () => {
//         if (!audio) return;
//         if (playing) {
//             audio.pause();
//             setPlaying(false);
//         } else {
//             audio.play();
//             setPlaying(true);
//             incrementPlay(); // count play on first press
//             audio.onended = () => setPlaying(false);
//         }
//     };

//     return (
//         <div className="flex items-center justify-between px-3 py-3 bg-[#141414] rounded-xl mb-2 gap-3">
//             <Link href={`/MainModules/MatchesDropContent/AudioDropScreen?id=${encodeURIComponent(drop.id)}`}>
//                 <div className="flex items-center gap-3 min-w-0">
//                     <button
//                         onClick={togglePlay}
//                         className="w-10 h-10 rounded-lg bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 border border-white/5 hover:border-[#C9115F]/40 transition-colors"
//                       >
//                         {drop.type === "audio" ? (
//                             playing ? (
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
//                         <p className="text-white text-sm font-medium truncate leading-tight">{drop.title}</p>
//                         <div className="flex items-center gap-2 mt-0.5">
//                             <span className="text-gray-500 text-xs">{duration}</span>
//                             <span className="text-gray-600 text-xs">•</span>
//                             <span className="text-gray-500 text-xs">{plays} plays</span>
//                         </div>
//                         <div className="flex items-center gap-1 mt-0.5">
//                             <Users size={10} className="text-gray-600" />
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
//     const [requestText, setRequestText] = useState("");
//     const [dateGroups, setDateGroups] = useState<DateGroup[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [search, setSearch] = useState("");
//     const [submitting, setSubmitting] = useState(false);
//     const [submitted, setSubmitted] = useState(false);

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

//     const handleSubmitRequest = async () => {
//         if (!requestText.trim()) return;
//         setSubmitting(true);
//         // TODO: wire up your request submission API here
//         await new Promise((res) => setTimeout(res, 1000));
//         setSubmitting(false);
//         setSubmitted(true);
//         setRequestText("");
//         setTimeout(() => setSubmitted(false), 3000);
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

//                         {/* Textarea */}
//                         <textarea
//                             value={requestText}
//                             onChange={(e) => setRequestText(e.target.value)}
//                             placeholder="What would you like to hear about?"
//                             rows={5}
//                             className="w-full bg-[#0d0d10] text-white text-sm placeholder-gray-600 rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-[#C9115F]/50 resize-none transition-colors"
//                         />

//                         {/* Success message */}
//                         {submitted && (
//                             <p className="text-green-400 text-xs mt-2 text-center">
//                                 Request submitted successfully!
//                             </p>
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

// Convert API audio file to Drop format
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

// Group drops by date label
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
            const dateString = date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

            if (date.getTime() === today.getTime()) {
                label = `Today (${dateString})`;
            } else if (date.getTime() === yesterday.getTime()) {
                label = `Yesterday (${dateString})`;
            } else {
                label = dateString;
            }
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

function DropRow({ drop }: { drop: Drop }) {
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState<string>(drop.duration || "0:00");
    const [plays, setPlays] = useState<number>(parseInt(drop.plays) || 0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hasCountedPlay = useRef(false);

    // Initialize audio element
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

            // Cleanup on unmount or when URL changes
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
        } catch {
            // silently fail
        }
    };

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (playing) {
            audio.pause();
            setPlaying(false);
        } else {
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setPlaying(true);
                        incrementPlay();
                    })
                    .catch(error => {
                        console.error("Playback failed:", error);
                        setPlaying(false);
                    });
            }

            audio.onended = () => {
                setPlaying(false);
            };
        }
    };

    // Cleanup when component unmounts
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
            }
        };
    }, []);

    return (
        <div className="flex items-center justify-between px-3 py-3 bg-[#141414] rounded-xl mb-2 gap-3">
            <Link href={`/MainModules/MatchesDropContent/AudioDropScreen?id=${encodeURIComponent(drop.id)}`}>
                <div className="flex items-center gap-3 min-w-0">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            togglePlay();
                        }}
                        className="w-10 h-10 rounded-lg bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 border border-white/5 hover:border-[#C9115F]/40 transition-colors"
                    >
                        {drop.type === "audio" ? (
                            playing ? (
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
                        <p className="text-white text-sm font-medium truncate leading-tight">{drop.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-gray-500 text-xs">{duration}</span>
                            <span className="text-gray-600 text-xs">•</span>
                            <span className="text-gray-500 text-xs">{plays} plays</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Users size={10} className="text-gray-600" />
                            <span className="text-gray-500 text-[11px]">by {drop.author}</span>
                        </div>
                    </div>
                </div>
            </Link>

            <Link href={`/MainModules/MatchesDropContent/AudioDropScreen?id=${encodeURIComponent(drop.id)}`}>
                <span className="flex-shrink-0 text-[#C9115F] text-xs font-semibold whitespace-nowrap">
                    {drop.badge}
                </span>
            </Link>
        </div>
    );
}

function SectionLabel({ label }: { label: string }) {
    const isToday = label === "Today";
    return (
        <div className={`inline-block px-3 py-1 rounded-md mb-4 text-sm font-semibold ${isToday ? "bg-[#b8460a] text-white" : "bg-[#1e1e1e] text-gray-300 border border-white/10"}`}>
            {label}
        </div>
    );
}

export default function FullPlaylist() {
    const [requestText, setRequestText] = useState("");
    const [dateGroups, setDateGroups] = useState<DateGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null); //  Added missing state
    const [userName, setUserName] = useState("");

    // Get or create user ID
    const getUserId = () => {
        let userId = localStorage.getItem("drop_request_user_id");
        if (!userId) {
            userId = `user_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem("drop_request_user_id", userId);
        }
        return userId;
    };

    // Get user name from localStorage
    const getUserName = () => {
        let userName = localStorage.getItem("drop_request_user_name");
        if (!userName) {
            userName = `Fan_${Math.random().toString(36).substr(2, 5)}`;
            localStorage.setItem("drop_request_user_name", userName);
        }
        return userName;
    };

    // Get stored user name if exists
    useEffect(() => {
        const storedName = localStorage.getItem("drop_request_user_name");
        if (storedName) {
            setUserName(storedName);
        } else {
            setUserName(getUserName());
        }
    }, []);

    // Update handleSubmitRequest function
    const handleSubmitRequest = async () => {
        if (!requestText.trim()) return; // ✅ Removed userName validation since we get it from localStorage

        setSubmitting(true);
        setSubmitError(null);

        try {
            const response = await axios.post("/api/request-drop", {
                userName: getUserName(), // ✅ Use getUserName() function
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
        } catch (err) {
            console.error("Error submitting request:", err);
            setSubmitError("Something went wrong. Please try again.");
            setTimeout(() => setSubmitError(null), 3000);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchAudio();
    }, []);

    const fetchAudio = async (searchTerm?: string) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ limit: "50" });
            if (searchTerm) params.append("search", searchTerm);

            const [audioRes, playsRes] = await Promise.all([
                axios.get(`/api/cloudinary/audio?${params.toString()}`),
                axios.get("/api/cloudinary/plays"),
            ]);

            if (audioRes.data.success) {
                const playsMap: Record<string, number> = playsRes.data.plays || {};
                const drops: Drop[] = audioRes.data.audioFiles.map((audio: AudioFile) => ({
                    ...audioFileToDrop(audio),
                    plays: String(playsMap[audio.id] || 0),
                }));
                const groups = groupByDate(drops);
                setDateGroups(groups);
            } else {
                setError("Failed to load audio files.");
            }
        } catch (err) {
            console.error("Error fetching audio:", err);
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
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5 sticky top-0 bg-[#0d0d10] z-10">
                <Link href="/MainModules/HomePage">
                    <button className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <ArrowLeft size={20} />
                    </button>
                </Link>
                <div className="flex-1 min-w-0">
                    <h1 className="text-base font-bold text-white leading-tight">Full Playlist</h1>
                    <p className="text-xs text-gray-500">Audio Drops</p>
                </div>
                {/* Search — desktop */}
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search drops..."
                    className="hidden sm:block bg-[#1a1a1a] border border-white/10 rounded-full px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9115F]/50 w-40"
                />
            </div>

            {/* Search — mobile */}
            <div className="sm:hidden px-4 pt-3">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search drops..."
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-full px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#C9115F]/50"
                />
            </div>

            {/* Body */}
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
                        <div className="flex items-center justify-center py-20">
                            <p className="text-gray-500 text-sm">
                                {search ? `No drops found for "${search}"` : "No audio drops available."}
                            </p>
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
                <div className="w-full lg:w-[340px] flex-shrink-0">
                    <div className="bg-[#141414] rounded-2xl border border-white/5 p-5 lg:sticky lg:top-24">
                        {/* Panel Header */}
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9115F] to-[#e85d04] flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-bold">e</span>
                            </div>
                            <div>
                                <p className="text-white text-sm font-semibold leading-tight">Request a drop</p>
                                <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                                    Want to hear more from specific team? Request a specific topic or moment!
                                </p>
                            </div>
                        </div>

                        {/* Show user info */}
                        {/* <div className="mb-3 p-2 bg-[#1a1a1a] rounded-lg border border-white/5">
                            <p className="text-gray-500 text-xs">Requesting as:</p>
                            <p className="text-[#C9115F] text-sm font-medium">{getUserName()}</p>
                        </div> */}

                        {/* Textarea */}
                        <textarea
                            value={requestText}
                            onChange={(e) => setRequestText(e.target.value)}
                            placeholder="What would you like to hear about? (e.g., specific match analysis, player interview, etc.)"
                            rows={4}
                            className="w-full bg-[#0d0d10] text-white text-sm placeholder-gray-600 rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-[#C9115F]/50 resize-none transition-colors"
                        />

                        {/* Character counter */}
                        <div className="flex justify-end mt-1">
                            <span className="text-gray-600 text-xs">{requestText.length}/500</span>
                        </div>

                        {/* Success message */}
                        {submitted && (
                            <div className="mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <p className="text-green-400 text-xs text-center">
                                    ✓ Request submitted successfully!
                                </p>
                                <p className="text-gray-500 text-xs text-center mt-1">
                                    We&apos;ll review your request shortly.
                                </p>
                            </div>
                        )}

                        {/* Error message */}
                        {submitError && (
                            <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-xs text-center">
                                    {submitError}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmitRequest}
                            disabled={submitting || !requestText.trim()}
                            className="w-full mt-4 py-3 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-[#C9115F] to-[#e85d04] hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting && <Loader2 size={14} className="animate-spin" />}
                            {submitting ? "Submitting..." : "Submit Request"}
                        </button>

                        {/* Note about name storage */}
                        <p className="text-gray-600 text-xs text-center mt-3">
                            Your name is saved locally for future requests
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}