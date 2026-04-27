// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useSearchParams } from "next/navigation";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext";

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

// interface AudioDrop {
//     id?: string;
//     title: string;
//     subtitle?: string;
//     description: string;
//     listens: number;
//     signals: number;
//     duration: string;
//     date?: string;
//     room?: string;
//     engagement: number;
//     audioUrl?: string;
//     sizeFormatted?: string;
//     speaker?: string;
//     team1?: string;
//     team2?: string;
// }

// interface SignalMessage {
//     id: string;
//     audioId: string;
//     userId: string;
//     userName: string;
//     message: string;
//     createdAt: number;
// }

// const parseDurationToSeconds = (duration: string): number => {
//     const parts = duration.split(":");
//     if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1]);
//     if (parts.length === 3) return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
//     return 0;
// };

// function audioFileToAudioDrop(audio: AudioFile): AudioDrop {
//     return {
//         id: audio.id,
//         title: audio.title,
//         subtitle: audio.matchInfo?.type
//             ? `${audio.matchInfo.type.replace(/_/g, " ")} — ${audio.matchInfo.team1 ?? ""} vs ${audio.matchInfo.team2 ?? ""}`
//             : "Audio Drop",
//         description: audio.matchInfo
//             ? `${audio.matchInfo.team1 ?? ""} vs ${audio.matchInfo.team2 ?? ""} — ${audio.matchInfo.type?.replace(/_/g, " ") ?? ""}`
//             : audio.title,
//         listens: 0,
//         signals: 0,
//         duration: audio.duration,
//         date: audio.createdAtFormatted,
//         room: audio.matchInfo?.team1
//             ? `${audio.matchInfo.team1} vs ${audio.matchInfo.team2}`
//             : "Audio Room",
//         engagement: 0,
//         audioUrl: audio.url,
//         sizeFormatted: audio.sizeFormatted,
//         speaker: audio.matchInfo?.speaker,
//         team1: audio.matchInfo?.team1,
//         team2: audio.matchInfo?.team2,
//     };
// }

// const buildAudioDropShareUrl = (audioDrop: AudioDrop, urlParam: string | null) => {
//     if (typeof window === "undefined") return "";
//     const targetUrl = new URL(`${window.location.origin}/MainModules/AudioDrop/share`);
//     if (audioDrop.id) {
//         targetUrl.searchParams.set("id", audioDrop.id);
//         return targetUrl.toString();
//     }
//     if (urlParam) {
//         targetUrl.searchParams.set("url", urlParam);
//         return targetUrl.toString();
//     }
//     return targetUrl.toString();
// };

// const buildAudioDropShareText = (audioDrop: AudioDrop, urlParam: string | null) => {
//     const shareUrl = buildAudioDropShareUrl(audioDrop, urlParam);
//     return [
//         `Listen to ${audioDrop.title} on Sportsfan`,
//         audioDrop.subtitle || "Audio Drops",
//         audioDrop.description || "Latest audio drop from Sportsfan.",
//         `View and listen: ${shareUrl}`,
//     ].filter(Boolean).join("\n");
// };

// const copyToClipboard = async (text: string) => {
//     try {
//         await navigator.clipboard.writeText(text);
//         return true;
//     } catch {
//         try {
//             const input = document.createElement("textarea");
//             input.value = text;
//             input.style.position = "fixed";
//             input.style.opacity = "0";
//             document.body.appendChild(input);
//             input.focus();
//             input.select();
//             const ok = document.execCommand("copy");
//             document.body.removeChild(input);
//             return ok;
//         } catch {
//             return false;
//         }
//     }
// };

// export default function AudioDropCard() {
//     const { user, getUserName, getUserDisplayName, isAuthenticated } = useAuth();
//     const searchParams = useSearchParams();
//     const idParam = searchParams.get("id");
//     const urlParam = searchParams.get("url");

//     const [playing, setPlaying] = useState(false);
//     const [elapsed, setElapsed] = useState(0);
//     const [duration, setDuration] = useState("0:00");
//     const [audioDrop, setAudioDrop] = useState<AudioDrop | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     const [showSignalDialog, setShowSignalDialog] = useState(false);
//     const [signalMessage, setSignalMessage] = useState("");
//     const [sendingSignal, setSendingSignal] = useState(false);
//     const [signalsCount, setSignalsCount] = useState(0);
//     const [recentSignals, setRecentSignals] = useState<SignalMessage[]>([]);

//     const [showShareDialog, setShowShareDialog] = useState(false);
//     const [copied, setCopied] = useState(false);

//     const audioRef = useRef<HTMLAudioElement | null>(null);
//     const timerRef = useRef<NodeJS.Timeout | null>(null);

//     // ── Listen tracking refs ─────────────────────────────────────────────────
//     const hasCountedListen = useRef(false);
//     const audioIdRef = useRef<string | null>(null);          // set synchronously, no effect delay
//     const incrementListensRef = useRef<() => void>(() => {}); // always points to latest fn

//     // ── incrementListens ─────────────────────────────────────────────────────
//     // const incrementListens = async () => {
//     //     const id = audioIdRef.current;
//     //     console.log("[listens] ended fired — id:", id, "hasCounted:", hasCountedListen.current);
//     //     if (hasCountedListen.current) return;
//     //     if (!id) {
//     //         console.warn("[listens] No audio ID — skipping");
//     //         return;
//     //     }
//     //     hasCountedListen.current = true;
//     //     try {
//     //         const res = await axios.post("/api/cloudinary/plays", { id });
//     //         console.log("[listens] API response:", res.data);
//     //         if (res.data.success) {
//     //             setAudioDrop((prev) =>
//     //                 prev ? { ...prev, listens: res.data.plays } : prev
//     //             );
//     //         }
//     //     } catch (err) {
//     //         console.error("[listens] Failed to update listens:", err);
//     //     }
//     // };

//     const incrementListens = async () => {
//     const id = audioIdRef.current;
//     if (hasCountedListen.current) return;
//     if (!id) return;
//     hasCountedListen.current = true;
//     try {
//         const res = await axios.post("/api/cloudinary/plays", { id });
//         if (res.data.success) {
//             setAudioDrop((prev) =>
//                 prev ? { ...prev, listens: res.data.plays } : prev
//             );
//         }
//     } catch (err) {
//     if (err instanceof Error) {
//         console.error("[listens] error:", err.message);
//     }
// }
// };

//     // Keep ref always pointing to latest version (no stale closure in event handler)
//     useEffect(() => {
//         incrementListensRef.current = incrementListens;
//     });

//     // ── Auth helpers ─────────────────────────────────────────────────────────
//     const getUserId = () => {
//         if (user?.userId) return user.userId;
//         let userId = localStorage.getItem("audio_user_id");
//         if (!userId) {
//             userId = `user_${Math.random().toString(36).substr(2, 9)}`;
//             localStorage.setItem("audio_user_id", userId);
//         }
//         return userId;
//     };

//     const getUserNameForSignal = () => getUserName();

//     // ── Signal handler ───────────────────────────────────────────────────────
//     const handleSendSignal = async () => {
//         if (!signalMessage.trim() || !audioDrop?.id) return;
//         setSendingSignal(true);
//         try {
//             const response = await axios.post("/api/audio-messages", {
//                 audioId: audioDrop.id,
//                 audioTitle: audioDrop.title,
//                 userId: getUserId(),
//                 userName: getUserNameForSignal(),
//                 message: signalMessage.trim(),
//             });
//             if (response.data.success) {
//                 setSignalsCount((prev) => prev + 1);
//                 setRecentSignals((prev) => [response.data.signal, ...prev].slice(0, 5));
//                 setShowSignalDialog(false);
//                 setSignalMessage("");
//                 alert("Signal sent successfully!");
//             }
//         } catch (error) {
//             console.error("Error sending signal:", error);
//             alert("Failed to send signal. Please try again.");
//         } finally {
//             setSendingSignal(false);
//         }
//     };

//     // ── Fetch audio data ─────────────────────────────────────────────────────
//     useEffect(() => {
//         fetchAudioData();
//     }, [idParam, urlParam]);

//     const fetchAudioData = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             setDuration("0:00");
//             setElapsed(0);
//             setPlaying(false);
//             setSignalsCount(0);
//             setRecentSignals([]);
//             hasCountedListen.current = false;

//             if (urlParam && !idParam) {
//                 const decodedUrl = decodeURIComponent(urlParam);
//                 audioIdRef.current = null; // no id for url-only drops
//                 setAudioDrop({
//                     title: "Audio Track",
//                     subtitle: "Audio Drop",
//                     description: "",
//                     listens: 0,
//                     signals: 0,
//                     duration: "0:00",
//                     engagement: 0,
//                     audioUrl: decodedUrl,
//                 });
//                 setLoading(false);
//                 return;
//             }

//             const response = await axios.get<{
//                 success: boolean;
//                 audioFiles: AudioFile[];
//             }>("/api/cloudinary/audio?limit=100");

//             if (!response.data.success || !response.data.audioFiles.length) {
//                 setError("No audio files available.");
//                 setLoading(false);
//                 return;
//             }

//             const audioFiles = response.data.audioFiles;
//             let target: AudioFile | undefined;

//             if (idParam) {
//                 target = audioFiles.find((a) => a.id === idParam);
//             } else if (urlParam) {
//                 const decodedUrl = decodeURIComponent(urlParam);
//                 target = audioFiles.find((a) => a.url === decodedUrl);
//             } else {
//                 target = audioFiles[0];
//             }

//             if (target) {
//                 const drop = audioFileToAudioDrop(target);
//                 // ← Set synchronously BEFORE setAudioDrop so the ref is ready
//                 // when the audio element's ended event fires
//                 audioIdRef.current = drop.id ?? null;
//                 console.log("[listens] audioIdRef set to:", audioIdRef.current);
//                 setAudioDrop(drop);
//                 await fetchSignalsCount(drop.id!);
//                 await fetchRecentSignals(drop.id!);
//             } else {
//                 setError("Audio drop not found.");
//             }
//         } catch (err) {
//             console.error("Error fetching audio:", err);
//             setError("Failed to load audio.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchSignalsCount = async (audioId: string) => {
//         try {
//             const response = await axios.get(`/api/audio-messages?audioId=${audioId}&count=true`);
//             if (response.data.success) setSignalsCount(response.data.count);
//         } catch (error) {
//             console.error("Error fetching signals count:", error);
//         }
//     };

//     const fetchRecentSignals = async (audioId: string) => {
//         try {
//             const response = await axios.get(`/api/audio-messages?audioId=${audioId}&limit=5`);
//             if (response.data.success) setRecentSignals(response.data.signals);
//         } catch (error) {
//             console.error("Error fetching recent signals:", error);
//         }
//     };

//     // ── Share handlers ───────────────────────────────────────────────────────
//     const openShareDialog = () => { setShowShareDialog(true); setCopied(false); };
//     const closeShareDialog = () => { setShowShareDialog(false); setCopied(false); };

//     const handleShareToWhatsApp = () => {
//         if (!audioDrop) return;
//         const shareText = buildAudioDropShareText(audioDrop, urlParam);
//         const whatsappAppUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
//         const whatsappWebFallbackUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
//         const opened = window.open(whatsappAppUrl, "_self");
//         if (!opened) window.location.href = whatsappWebFallbackUrl;
//     };

//     const handleShareToThreads = () => {
//         if (!audioDrop) return;
//         window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(buildAudioDropShareText(audioDrop, urlParam))}`, "_blank", "noopener,noreferrer");
//     };

//     const handleShareToInstagram = async () => {
//         if (!audioDrop) return;
//         const ok = await copyToClipboard(buildAudioDropShareText(audioDrop, urlParam));
//         if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1600); }
//         window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
//     };

//     const handleShareToLinkedIn = () => {
//         if (!audioDrop) return;
//         const shareUrl = buildAudioDropShareUrl(audioDrop, urlParam);
//         window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
//     };

//     const handleShareToX = () => {
//         if (!audioDrop) return;
//         const shareText = buildAudioDropShareText(audioDrop, urlParam);
//         window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
//     };

//     const handleCopyLink = async () => {
//         if (!audioDrop) return;
//         const ok = await copyToClipboard(buildAudioDropShareText(audioDrop, urlParam));
//         if (!ok) return;
//         setCopied(true);
//         setTimeout(() => setCopied(false), 1600);
//     };

//     // ── Initialize audio element when URL changes ────────────────────────────
//     useEffect(() => {
//         const url = audioDrop?.audioUrl;
//         if (!url) return;

//         // Reset counter + sync id ref synchronously here too (covers audioUrl changes)
//         hasCountedListen.current = false;
//         audioIdRef.current = audioDrop?.id ?? null;
//         console.log("[listens] audio setup — audioIdRef:", audioIdRef.current);

//         if (audioRef.current) {
//             audioRef.current.pause();
//             audioRef.current.src = "";
//         }

//         const audio = new Audio(url);
//         audioRef.current = audio;

//         audio.addEventListener("loadedmetadata", () => {
//             const secs = audio.duration;
//             if (secs && !isNaN(secs) && isFinite(secs) && secs > 0) {
//                 const m = Math.floor(secs / 60);
//                 const s = Math.floor(secs % 60);
//                 setDuration(`${m}:${s.toString().padStart(2, "0")}`);
//             }
//         });

//         audio.addEventListener("ended", () => {
//             setPlaying(false);
//             setElapsed(0);
//             incrementListensRef.current(); // always latest fn, audioIdRef already set
//         });

//         audio.load();

//         return () => {
//             audio.pause();
//             audio.src = "";
//         };
//     }, [audioDrop?.audioUrl]);

//     // ── Play / pause ─────────────────────────────────────────────────────────
//     useEffect(() => {
//         const audio = audioRef.current;
//         if (!audio) return;

//         if (playing) {
//             audio.play().catch(console.error);
//             timerRef.current = setInterval(() => {
//                 setElapsed(audio.currentTime);
//             }, 1000);
//         } else {
//             audio.pause();
//             if (timerRef.current) clearInterval(timerRef.current);
//         }

//         return () => {
//             if (timerRef.current) clearInterval(timerRef.current);
//         };
//     }, [playing]);

//     // ── Loading / error states ───────────────────────────────────────────────
//     if (loading) {
//         return (
//             <div className="flex justify-center items-center bg-[#0d0d10] min-h-screen">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4" />
//                     <p className="text-gray-400">Loading audio...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error || !audioDrop) {
//         return (
//             <div className="flex justify-center items-center bg-[#0d0d10] min-h-screen">
//                 <div className="text-center">
//                     <p className="text-red-400 mb-4">{error || "Audio not found"}</p>
//                     <button onClick={() => window.history.back()} className="bg-pink-500 px-4 py-2 rounded text-white hover:bg-pink-600">
//                         Go Back
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     const totalSecs = parseDurationToSeconds(duration);
//     const mins = Math.floor(elapsed / 60);
//     const secs = Math.floor(elapsed % 60);
//     const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;
//     const pct = totalSecs > 0 ? Math.round((elapsed / totalSecs) * 100) : 0;
//     const engPct = playing ? pct : audioDrop.engagement;

//     return (
//         <div className="flex justify-center items-start bg-[#0d0d10] min-h-screen p-4 sm:p-6 lg:p-10 pb-15 md:pb-20 lg:gap-4">
//             <div className="relative">
//             <div className="relative w-full max-w-[360px] sm:max-w-[400px] bg-[#111114] rounded-[28px] overflow-hidden border border-[#2a2a2e]">

//                 {/* Topbar */}
//                 <div className="flex items-center justify-between px-4 pt-5 pb-3 bg-[#111114]">
//                     <div className="flex items-center gap-3">
//                         <button onClick={() => window.history.back()}>
//                             <div className="w-8 h-8 rounded-full bg-[#1e1e22] flex items-center justify-center cursor-pointer">
//                                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                                     <path d="M9 2L4 7L9 12" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//                                 </svg>
//                             </div>
//                         </button>
//                         <div>
//                             <p className="text-white text-[15px] font-medium leading-tight truncate max-w-[180px]">
//                                 {audioDrop.title}
//                             </p>
//                             <p className="text-[#888] text-[12px] mt-0.5 truncate max-w-[180px]">
//                                 {audioDrop.subtitle || "Audio Drop"}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={openShareDialog}
//                             className="relative w-8 h-8 rounded-full bg-[#1e1e22] flex items-center justify-center cursor-pointer hover:bg-[#2a2a2e] transition"
//                             aria-label="Share audio drop"
//                         >
//                             <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//                                 <circle cx="12" cy="3" r="1.8" stroke="#aaa" strokeWidth="1.4" />
//                                 <circle cx="12" cy="13" r="1.8" stroke="#aaa" strokeWidth="1.4" />
//                                 <circle cx="4" cy="8" r="1.8" stroke="#aaa" strokeWidth="1.4" />
//                                 <path d="M10.3 3.9L5.7 7.1M10.3 12.1L5.7 8.9" stroke="#aaa" strokeWidth="1.4" strokeLinecap="round" />
//                             </svg>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Player */}
//                 <div className="bg-[#1a0a10] mx-3.5 rounded-2xl px-6 pt-7 pb-4 flex flex-col items-center gap-4">
//                     <div className="w-[72px] h-[72px] rounded-full bg-[#c0204a] flex items-center justify-center">
//                         <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
//                             <path d="M5 18v-1C5 10.373 10.373 5 17 5s12 5.373 12 12v1" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
//                             <rect x="3" y="17" width="5" height="9" rx="2.5" fill="#fff" />
//                             <rect x="26" y="17" width="5" height="9" rx="2.5" fill="#fff" />
//                         </svg>
//                     </div>

//                     <button
//                         onClick={() => setPlaying((v) => !v)}
//                         className="w-[52px] h-[52px] rounded-full bg-[#e0185a] hover:bg-[#f01e66] flex items-center justify-center transition"
//                     >
//                         {playing ? (
//                             <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                                 <rect x="5" y="4" width="3" height="12" rx="1" fill="#fff" />
//                                 <rect x="12" y="4" width="3" height="12" rx="1" fill="#fff" />
//                             </svg>
//                         ) : (
//                             <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                                 <path d="M7 4.5L16 10L7 15.5V4.5Z" fill="#fff" />
//                             </svg>
//                         )}
//                     </button>

//                     {/* Progress bar */}
//                     <div className="w-full">
//                         <div className="h-1 bg-[#2a2a2e] rounded-full overflow-hidden mb-1.5">
//                             <div
//                                 className="h-full bg-[#e0185a] rounded-full transition-all duration-300"
//                                 style={{ width: `${pct}%` }}
//                             />
//                         </div>
//                         <div className="flex justify-between text-[11px] text-[#666] font-mono">
//                             <span>{timeStr}</span>
//                             <span>{duration}</span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Body */}
//                 <div className="px-4 pt-4 pb-5 bg-[#111114]">
//                     <h1 className="text-white text-[19px] sm:text-[21px] font-medium leading-snug mb-1">
//                         {audioDrop.title}
//                     </h1>
//                     {audioDrop.speaker && (
//                         <p className="text-[#C9115F] text-[12px] mb-1">by {audioDrop.speaker}</p>
//                     )}
//                     <p className="text-[#888] text-[13px] leading-relaxed mb-4">
//                         {audioDrop.description}
//                     </p>

//                     {/* Stats */}
//                     <div className="grid grid-cols-3 gap-2.5 mb-4">
//                         {[
//                             // { label: "Listens", value: audioDrop.listens.toLocaleString() },
//                             { label: "Signals", value: signalsCount.toLocaleString() },
//                             { label: "Duration", value: duration },
//                         ].map((s, index) => (
//                             <div key={index} className="bg-[#1a1a1e] rounded-xl p-2.5 flex flex-col gap-1.5">
//                                 <div className="flex items-center gap-1.5 text-[#999]">
//                                     <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
//                                         <circle cx="6.5" cy="6.5" r="5" stroke="#999" strokeWidth="1.2" />
//                                         {s.label === "Duration" ? (
//                                             <path d="M6.5 4v2.5l1.5 1.5" stroke="#999" strokeWidth="1.2" strokeLinecap="round" />
//                                         ) : (
//                                             <path d="M4.5 6.5h4M6.5 4.5v4" stroke="#999" strokeWidth="1.2" strokeLinecap="round" />
//                                         )}
//                                     </svg>
//                                     <span className="text-[10px] uppercase tracking-wider text-[#999]">{s.label}</span>
//                                 </div>
//                                 <span className="text-[17px] sm:text-[19px] font-medium text-white">{s.value}</span>
//                             </div>
//                         ))}
//                     </div>

//                     {/* File size */}
//                     {audioDrop.sizeFormatted && (
//                         <div className="flex items-center gap-2 text-[12px] text-[#555] mb-3">
//                             <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
//                                 <rect x="2" y="1.5" width="9" height="10" rx="1.5" stroke="#555" strokeWidth="1.2" />
//                                 <path d="M4.5 5h4M4.5 7.5h2.5" stroke="#555" strokeWidth="1.2" strokeLinecap="round" />
//                             </svg>
//                             File size: {audioDrop.sizeFormatted}
//                         </div>
//                     )}

//                     {/* Meta */}
//                     <div className="flex items-center gap-4 text-[12px] text-[#666] mb-3.5">
//                         <div className="flex items-center gap-1.5">
//                             <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
//                                 <rect x="1.5" y="2.5" width="10" height="9" rx="1.5" stroke="#666" strokeWidth="1.2" />
//                                 <path d="M1.5 5.5h10M4.5 1v3M8.5 1v3" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
//                             </svg>
//                             {audioDrop.date || "Recent"}
//                         </div>
//                         <div className="flex items-center gap-1.5">
//                             <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
//                                 <circle cx="6.5" cy="4.5" r="2.5" stroke="#666" strokeWidth="1.2" />
//                                 <path d="M2 11c0-2 2-3 4.5-3s4.5 1 4.5 3" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
//                             </svg>
//                             {audioDrop.room || "Audio Room"}
//                         </div>
//                     </div>

//                     {/* Engagement bar */}
//                     <div className="mb-5">
//                         <div className="h-1 bg-[#2a2a2e] rounded-full overflow-hidden mb-1.5">
//                             <div
//                                 className="h-full bg-[#e0185a] rounded-full transition-all duration-300"
//                                 style={{ width: `${engPct}%` }}
//                             />
//                         </div>
//                         <p className="text-right text-[11px] text-[#666]">{engPct}% engagement</p>
//                     </div>

//                     {/* Send Signal button */}
//                     <button
//                         onClick={() => setShowSignalDialog(true)}
//                         className="w-full bg-[#1e0a12] border border-[#e0185a] rounded-[14px] py-4 flex items-center justify-center gap-2 text-[#e0185a] text-[15px] font-medium hover:bg-[#2a0f1c] transition"
//                     >
//                         <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
//                             <path d="M9 2C5.7 2 3 4.5 3 7.5c0 1.5.7 2.9 1.9 3.9L4 15l3.5-1.2c.5.2 1 .2 1.5.2C12.3 14 15 11.5 15 8.5S12.3 2 9 2z" stroke="#e0185a" strokeWidth="1.4" strokeLinejoin="round" />
//                             <path d="M6.5 8.5h5M9 6v5" stroke="#e0185a" strokeWidth="1.4" strokeLinecap="round" />
//                         </svg>
//                         Send Signal
//                     </button>
//                 </div>
//             </div>

//             {/* Share Dialog */}
//             {showShareDialog && audioDrop && (
//                 <>
//                     <button
//                         type="button"
//                         aria-label="Close share popup"
//                         className="fixed inset-0 z-40 bg-black/70 lg:hidden"
//                         onClick={closeShareDialog}
//                     />
//                     <div
//                         className="fixed bottom-16 inset-x-4 z-50 mx-auto w-full max-w-[260px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl lg:hidden"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <div className="flex items-center justify-between mb-2">
//                             <p className="text-white text-sm font-semibold">Share</p>
//                             <button onClick={closeShareDialog} className="text-gray-400 hover:text-white transition" aria-label="Close share popup">
//                                 <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
//                                     <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//                                 </svg>
//                             </button>
//                         </div>
//                         <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 overflow-x-auto -ml-1">
//                             <button onClick={handleShareToWhatsApp} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on WhatsApp">
//                                 <img src="/images/share_whatsapp.png" alt="WhatsApp" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                             <button onClick={handleShareToThreads} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Threads">
//                                 <img src="/images/share_thread.png" alt="Threads" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                             <button onClick={handleShareToInstagram} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Instagram">
//                                 <img src="/images/share_insta.png" alt="Instagram" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                             <button onClick={handleShareToLinkedIn} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on LinkedIn">
//                                 <img src="/images/Share_linkedin.png" alt="LinkedIn" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                             <button onClick={handleShareToX} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on X">
//                                 <img src="/images/Share_X.png" alt="X" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                             <button onClick={handleCopyLink} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Copy share link">
//                                 <img src="/images/share_copy_link.png" alt="Copy link" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                         </div>
//                         {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
//                     </div>

//                     <div className="hidden lg:block absolute left-[calc(100%+8px)] top-2 z-50 w-[260px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl">
//                         <div className="flex items-center justify-between mb-2">
//                             <p className="text-white text-sm font-semibold">Share Audio Drop</p>
//                             <button onClick={closeShareDialog} className="text-gray-400 hover:text-white transition" aria-label="Close share panel">
//                                 <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
//                                     <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//                                 </svg>
//                             </button>
//                         </div>

//                         <div className="rounded-xl border border-white/10 bg-[#111114] p-3 mb-2">
//                             <p className="text-white text-sm font-semibold line-clamp-2">{audioDrop.title}</p>
//                             <p className="text-white/65 text-xs mt-1 line-clamp-2">{audioDrop.subtitle || "Audio Drops"}</p>
//                             <p className="text-white/45 text-[11px] mt-2 line-clamp-2 break-all">{buildAudioDropShareUrl(audioDrop, urlParam)}</p>
//                         </div>

//                         <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 -ml-1">
//                             <button onClick={handleShareToWhatsApp} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on WhatsApp">
//                                 <img src="/images/share_whatsapp.png" alt="WhatsApp" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                             <button onClick={handleShareToThreads} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Threads">
//                                 <img src="/images/share_thread.png" alt="Threads" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                             <button onClick={handleShareToInstagram} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Instagram">
//                                 <img src="/images/share_insta.png" alt="Instagram" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                             <button onClick={handleShareToLinkedIn} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on LinkedIn">
//                                 <img src="/images/Share_linkedin.png" alt="LinkedIn" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                             <button onClick={handleShareToX} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on X">
//                                 <img src="/images/Share_X.png" alt="X" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                             <button onClick={handleCopyLink} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Copy share link">
//                                 <img src="/images/share_copy_link.png" alt="Copy link" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                         </div>
//                         {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
//                     </div>
//                 </>
//             )}
//             </div>

//             {/* Signal Dialog */}
//             {showSignalDialog && (
//                 <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowSignalDialog(false)}>
//                     <div className="bg-[#1a1a1e] rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-white text-lg font-semibold">Send a Signal</h3>
//                             <button onClick={() => setShowSignalDialog(false)} className="text-gray-400 hover:text-white transition">
//                                 <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                                     <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//                                 </svg>
//                             </button>
//                         </div>
//                         <p className="text-gray-400 text-sm mb-4">
//                             Share your thoughts about &apos;{audioDrop.title}&apos;
//                         </p>
//                         <textarea
//                             value={signalMessage}
//                             onChange={(e) => setSignalMessage(e.target.value)}
//                             placeholder="Type your message here..."
//                             className="w-full bg-[#111114] text-white text-sm rounded-xl px-4 py-3 border border-[#2a2a2e] focus:outline-none focus:border-[#e0185a] resize-none"
//                             rows={4}
//                             maxLength={500}
//                             autoFocus
//                         />
//                         <div className="flex justify-end gap-3 mt-4">
//                             <button
//                                 onClick={() => setShowSignalDialog(false)}
//                                 className="px-4 py-2 rounded-lg bg-[#2a2a2e] text-gray-300 text-sm font-medium hover:bg-[#3a3a3e] transition"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleSendSignal}
//                                 disabled={!signalMessage.trim() || sendingSignal}
//                                 className="px-4 py-2 rounded-lg bg-[#e0185a] text-white text-sm font-medium hover:bg-[#f01e66] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                             >
//                                 {sendingSignal ? (
//                                     <>
//                                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
//                                         Sending...
//                                     </>
//                                 ) : "Send Signal"}
//                             </button>
//                         </div>
//                         <p className="text-gray-600 text-xs mt-3 text-center">
//                             {500 - signalMessage.length} characters remaining
//                         </p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }











"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

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

interface AudioDrop {
    id?: string;
    title: string;
    subtitle?: string;
    description: string;
    listens: number;
    signals: number;
    duration: string;
    date?: string;
    room?: string;
    engagement: number;
    audioUrl?: string;
    sizeFormatted?: string;
    speaker?: string;
    team1?: string;
    team2?: string;
}

interface SignalMessage {
    id: string;
    audioId: string;
    userId: string;
    userName: string;
    message: string;
    createdAt: number;
}

const parseDurationToSeconds = (duration: string): number => {
    const parts = duration.split(":");
    if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    if (parts.length === 3) return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    return 0;
};

function audioFileToAudioDrop(audio: AudioFile): AudioDrop {
    return {
        id: audio.id,
        title: audio.title,
        subtitle: audio.matchInfo?.type
            ? `${audio.matchInfo.type.replace(/_/g, " ")} — ${audio.matchInfo.team1 ?? ""} vs ${audio.matchInfo.team2 ?? ""}`
            : "Audio Drop",
        description: audio.matchInfo
            ? `${audio.matchInfo.team1 ?? ""} vs ${audio.matchInfo.team2 ?? ""} — ${audio.matchInfo.type?.replace(/_/g, " ") ?? ""}`
            : audio.title,
        listens: 0,
        signals: 0,
        duration: audio.duration,
        date: audio.createdAtFormatted,
        room: audio.matchInfo?.team1
            ? `${audio.matchInfo.team1} vs ${audio.matchInfo.team2}`
            : "Audio Room",
        engagement: 0,
        audioUrl: audio.url,
        sizeFormatted: audio.sizeFormatted,
        speaker: audio.matchInfo?.speaker,
        team1: audio.matchInfo?.team1,
        team2: audio.matchInfo?.team2,
    };
}

const buildAudioDropShareUrl = (audioDrop: AudioDrop, urlParam: string | null) => {
    if (typeof window === "undefined") return "";
    const targetUrl = new URL(`${window.location.origin}/MainModules/AudioDrop/share`);
    if (audioDrop.id) {
        targetUrl.searchParams.set("id", audioDrop.id);
        return targetUrl.toString();
    }
    if (urlParam) {
        targetUrl.searchParams.set("url", urlParam);
        return targetUrl.toString();
    }
    return targetUrl.toString();
};

const buildAudioDropShareText = (audioDrop: AudioDrop, urlParam: string | null) => {
    const shareUrl = buildAudioDropShareUrl(audioDrop, urlParam);
    return [
        `Listen to ${audioDrop.title} on Sportsfan`,
        audioDrop.subtitle || "Audio Drops",
        audioDrop.description || "Latest audio drop from Sportsfan.",
        `View and listen: ${shareUrl}`,
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

export default function AudioDropCard() {
    const { user, getUserName, isAuthenticated } = useAuth();
    const searchParams = useSearchParams();
    const idParam = searchParams.get("id");
    const urlParam = searchParams.get("url");

    const [playing, setPlaying] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState("0:00");
    const [audioDrop, setAudioDrop] = useState<AudioDrop | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ── Audio list & navigation ──────────────────────────────────────────────
    const [allAudioFiles, setAllAudioFiles] = useState<AudioFile[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const [showSignalDialog, setShowSignalDialog] = useState(false);
    const [signalMessage, setSignalMessage] = useState("");
    const [sendingSignal, setSendingSignal] = useState(false);
    const [signalsCount, setSignalsCount] = useState(0);
    const [recentSignals, setRecentSignals] = useState<SignalMessage[]>([]);

    const [showShareDialog, setShowShareDialog] = useState(false);
    const [copied, setCopied] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // ── Listen tracking refs ─────────────────────────────────────────────────
    const hasCountedListen = useRef(false);
    const audioIdRef = useRef<string | null>(null);
    const incrementListensRef = useRef<() => void>(() => {});
    const navigateToAudioRef = useRef<(index: number) => void>(() => {});
    const currentIndexRef = useRef<number>(0);
    const allAudioFilesRef = useRef<AudioFile[]>([]);

    // Keep refs in sync
    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    useEffect(() => {
        allAudioFilesRef.current = allAudioFiles;
    }, [allAudioFiles]);

    // ── incrementListens ─────────────────────────────────────────────────────
    const incrementListens = async () => {
        const id = audioIdRef.current;
        if (hasCountedListen.current) return;
        if (!id) return;
        hasCountedListen.current = true;
        try {
            const res = await axios.post("/api/cloudinary/plays", { id });
            if (res.data.success) {
                setAudioDrop((prev) =>
                    prev ? { ...prev, listens: res.data.plays } : prev
                );
            }
        } catch (err) {
            if (err instanceof Error) console.error("[listens] error:", err.message);
        }
    };

    useEffect(() => {
        incrementListensRef.current = incrementListens;
    });

    // ── Navigate to audio by index ───────────────────────────────────────────
    const navigateToAudio = (index: number) => {
        const files = allAudioFilesRef.current;
        if (index < 0 || index >= files.length) return;
        const target = files[index];
        setCurrentIndex(index);
        setPlaying(false);
        setElapsed(0);
        setDuration("0:00");
        hasCountedListen.current = false;
        audioIdRef.current = target.id;
        const drop = audioFileToAudioDrop(target);
        setAudioDrop(drop);
        fetchSignalsCount(target.id);
        fetchRecentSignals(target.id);
        // Update URL without page reload
        const url = new URL(window.location.href);
        url.searchParams.set("id", target.id);
        window.history.pushState({}, "", url.toString());
    };

    // Keep ref updated
    useEffect(() => {
        navigateToAudioRef.current = navigateToAudio;
    });

    // ── Auth helpers ─────────────────────────────────────────────────────────
    const getUserId = () => {
        if (user?.userId) return user.userId;
        let userId = localStorage.getItem("audio_user_id");
        if (!userId) {
            userId = `user_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem("audio_user_id", userId);
        }
        return userId;
    };

    const getUserNameForSignal = () => getUserName();

    // ── Signal handler ───────────────────────────────────────────────────────
    const handleSendSignal = async () => {
        if (!signalMessage.trim() || !audioDrop?.id) return;
        setSendingSignal(true);
        try {
            const response = await axios.post("/api/audio-messages", {
                audioId: audioDrop.id,
                audioTitle: audioDrop.title,
                userId: getUserId(),
                userName: getUserNameForSignal(),
                message: signalMessage.trim(),
            });
            if (response.data.success) {
                setSignalsCount((prev) => prev + 1);
                setRecentSignals((prev) => [response.data.signal, ...prev].slice(0, 5));
                setShowSignalDialog(false);
                setSignalMessage("");
                alert("Signal sent successfully!");
            }
        } catch (error) {
            console.error("Error sending signal:", error);
            alert("Failed to send signal. Please try again.");
        } finally {
            setSendingSignal(false);
        }
    };

    // ── Fetch audio data ─────────────────────────────────────────────────────
    useEffect(() => {
        fetchAudioData();
    }, [idParam, urlParam]);

    const fetchAudioData = async () => {
        try {
            setLoading(true);
            setError(null);
            setDuration("0:00");
            setElapsed(0);
            setPlaying(false);
            setSignalsCount(0);
            setRecentSignals([]);
            hasCountedListen.current = false;

            if (urlParam && !idParam) {
                const decodedUrl = decodeURIComponent(urlParam);
                audioIdRef.current = null;
                setAudioDrop({
                    title: "Audio Track",
                    subtitle: "Audio Drop",
                    description: "",
                    listens: 0,
                    signals: 0,
                    duration: "0:00",
                    engagement: 0,
                    audioUrl: decodedUrl,
                });
                setLoading(false);
                return;
            }

            const response = await axios.get<{
                success: boolean;
                audioFiles: AudioFile[];
            }>("/api/cloudinary/audio?limit=100");

            if (!response.data.success || !response.data.audioFiles.length) {
                setError("No audio files available.");
                setLoading(false);
                return;
            }

            const audioFiles = response.data.audioFiles;

            // Save full list
            setAllAudioFiles(audioFiles);
            allAudioFilesRef.current = audioFiles;

            let target: AudioFile | undefined;
            let targetIndex = 0;

            if (idParam) {
                const found = audioFiles.findIndex((a) => a.id === idParam);
                targetIndex = found >= 0 ? found : 0;
                target = audioFiles[targetIndex];
            } else if (urlParam) {
                const decodedUrl = decodeURIComponent(urlParam);
                const found = audioFiles.findIndex((a) => a.url === decodedUrl);
                targetIndex = found >= 0 ? found : 0;
                target = audioFiles[targetIndex];
            } else {
                target = audioFiles[0];
                targetIndex = 0;
            }

            setCurrentIndex(targetIndex);
            currentIndexRef.current = targetIndex;

            if (target) {
                const drop = audioFileToAudioDrop(target);
                audioIdRef.current = drop.id ?? null;
                console.log("[listens] audioIdRef set to:", audioIdRef.current);
                setAudioDrop(drop);
                await fetchSignalsCount(drop.id!);
                await fetchRecentSignals(drop.id!);
            } else {
                setError("Audio drop not found.");
            }
        } catch (err) {
            console.error("Error fetching audio:", err);
            setError("Failed to load audio.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSignalsCount = async (audioId: string) => {
        try {
            const response = await axios.get(`/api/audio-messages?audioId=${audioId}&count=true`);
            if (response.data.success) setSignalsCount(response.data.count);
        } catch (error) {
            console.error("Error fetching signals count:", error);
        }
    };

    const fetchRecentSignals = async (audioId: string) => {
        try {
            const response = await axios.get(`/api/audio-messages?audioId=${audioId}&limit=5`);
            if (response.data.success) setRecentSignals(response.data.signals);
        } catch (error) {
            console.error("Error fetching recent signals:", error);
        }
    };

    // ── Share handlers ───────────────────────────────────────────────────────
    const openShareDialog = () => { setShowShareDialog(true); setCopied(false); };
    const closeShareDialog = () => { setShowShareDialog(false); setCopied(false); };

    const handleShareToWhatsApp = () => {
        if (!audioDrop) return;
        const shareText = buildAudioDropShareText(audioDrop, urlParam);
        const whatsappAppUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
        const whatsappWebFallbackUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        const opened = window.open(whatsappAppUrl, "_self");
        if (!opened) window.location.href = whatsappWebFallbackUrl;
    };

    const handleShareToThreads = () => {
        if (!audioDrop) return;
        window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(buildAudioDropShareText(audioDrop, urlParam))}`, "_blank", "noopener,noreferrer");
    };

    const handleShareToInstagram = async () => {
        if (!audioDrop) return;
        const ok = await copyToClipboard(buildAudioDropShareText(audioDrop, urlParam));
        if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1600); }
        window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    };

    const handleShareToLinkedIn = () => {
        if (!audioDrop) return;
        const shareUrl = buildAudioDropShareUrl(audioDrop, urlParam);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
    };

    const handleShareToX = () => {
        if (!audioDrop) return;
        const shareText = buildAudioDropShareText(audioDrop, urlParam);
        window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
    };

    const handleCopyLink = async () => {
        if (!audioDrop) return;
        const ok = await copyToClipboard(buildAudioDropShareText(audioDrop, urlParam));
        if (!ok) return;
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
    };

    // ── Initialize audio element when URL changes ────────────────────────────
    useEffect(() => {
        const url = audioDrop?.audioUrl;
        if (!url) return;

        hasCountedListen.current = false;
        audioIdRef.current = audioDrop?.id ?? null;
        console.log("[listens] audio setup — audioIdRef:", audioIdRef.current);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.addEventListener("loadedmetadata", () => {
            const secs = audio.duration;
            if (secs && !isNaN(secs) && isFinite(secs) && secs > 0) {
                const m = Math.floor(secs / 60);
                const s = Math.floor(secs % 60);
                setDuration(`${m}:${s.toString().padStart(2, "0")}`);
            }
        });

        audio.addEventListener("ended", () => {
            setPlaying(false);
            setElapsed(0);
            incrementListensRef.current();
            // Auto-advance to next
            setTimeout(() => {
                const nextIndex = currentIndexRef.current + 1;
                if (nextIndex < allAudioFilesRef.current.length) {
                    navigateToAudioRef.current(nextIndex);
                }
            }, 1000);
        });

        audio.load();

        return () => {
            audio.pause();
            audio.src = "";
        };
    }, [audioDrop?.audioUrl]);

    // ── Play / pause ─────────────────────────────────────────────────────────
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (playing) {
            audio.play().catch(console.error);
            timerRef.current = setInterval(() => {
                setElapsed(audio.currentTime);
            }, 1000);
        } else {
            audio.pause();
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [playing]);

    // ── Loading / error states ───────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex justify-center items-center bg-[#0d0d10] min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4" />
                    <p className="text-gray-400">Loading audio...</p>
                </div>
            </div>
        );
    }

    if (error || !audioDrop) {
        return (
            <div className="flex justify-center items-center bg-[#0d0d10] min-h-screen">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || "Audio not found"}</p>
                    <button onClick={() => window.history.back()} className="bg-pink-500 px-4 py-2 rounded text-white hover:bg-pink-600">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const totalSecs = parseDurationToSeconds(duration);
    const mins = Math.floor(elapsed / 60);
    const secs = Math.floor(elapsed % 60);
    const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;
    const pct = totalSecs > 0 ? Math.round((elapsed / totalSecs) * 100) : 0;
    const engPct = playing ? pct : audioDrop.engagement;
    const prevAudio = allAudioFiles[currentIndex - 1];
    const nextAudio = allAudioFiles[currentIndex + 1];

    return (
        <div className="flex justify-center items-start bg-[#0d0d10] min-h-screen p-4 sm:p-6 lg:p-10 pb-15 md:pb-20 lg:gap-4">
            <div className="relative">
                <div className="relative w-full max-w-[360px] sm:max-w-[400px] bg-[#111114] rounded-[28px] overflow-hidden border border-[#2a2a2e]">

                    {/* Topbar */}
                    <div className="flex items-center justify-between px-4 pt-5 pb-3 bg-[#111114]">
                        <div className="flex items-center gap-3">
                            <button onClick={() => window.history.back()}>
                                <div className="w-8 h-8 rounded-full bg-[#1e1e22] flex items-center justify-center cursor-pointer">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M9 2L4 7L9 12" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </button>
                            <div>
                                <p className="text-white text-[15px] font-medium leading-tight truncate max-w-[180px]">
                                    {audioDrop.title}
                                </p>
                                <p className="text-[#888] text-[12px] mt-0.5 truncate max-w-[180px]">
                                    {audioDrop.subtitle || "Audio Drop"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={openShareDialog}
                                className="relative w-8 h-8 rounded-full bg-[#1e1e22] flex items-center justify-center cursor-pointer hover:bg-[#2a2a2e] transition"
                                aria-label="Share audio drop"
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <circle cx="12" cy="3" r="1.8" stroke="#aaa" strokeWidth="1.4" />
                                    <circle cx="12" cy="13" r="1.8" stroke="#aaa" strokeWidth="1.4" />
                                    <circle cx="4" cy="8" r="1.8" stroke="#aaa" strokeWidth="1.4" />
                                    <path d="M10.3 3.9L5.7 7.1M10.3 12.1L5.7 8.9" stroke="#aaa" strokeWidth="1.4" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Player */}
                    <div className="bg-[#1a0a10] mx-3.5 rounded-2xl px-6 pt-7 pb-4 flex flex-col items-center gap-4">
                        <div className="w-[72px] h-[72px] rounded-full bg-[#c0204a] flex items-center justify-center">
                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                                <path d="M5 18v-1C5 10.373 10.373 5 17 5s12 5.373 12 12v1" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
                                <rect x="3" y="17" width="5" height="9" rx="2.5" fill="#fff" />
                                <rect x="26" y="17" width="5" height="9" rx="2.5" fill="#fff" />
                            </svg>
                        </div>

                        <button
                            onClick={() => setPlaying((v) => !v)}
                            className="w-[52px] h-[52px] rounded-full bg-[#e0185a] hover:bg-[#f01e66] flex items-center justify-center transition"
                        >
                            {playing ? (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <rect x="5" y="4" width="3" height="12" rx="1" fill="#fff" />
                                    <rect x="12" y="4" width="3" height="12" rx="1" fill="#fff" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7 4.5L16 10L7 15.5V4.5Z" fill="#fff" />
                                </svg>
                            )}
                        </button>

                        {/* Progress bar */}
                        <div className="w-full">
                            <div className="h-1 bg-[#2a2a2e] rounded-full overflow-hidden mb-1.5">
                                <div
                                    className="h-full bg-[#e0185a] rounded-full transition-all duration-300"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[11px] text-[#666] font-mono">
                                <span>{timeStr}</span>
                                <span>{duration}</span>
                            </div>
                        </div>

                        {/* Prev / Next Navigation */}
                        {allAudioFiles.length > 1 && (
                            <div className="flex items-center justify-between w-full">
                                <button
                                    onClick={() => navigateToAudio(currentIndex - 1)}
                                    disabled={currentIndex === 0}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2a0f1c] border border-[#e0185a]/30 text-[#e0185a] text-[12px] font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3a1525] transition"
                                >
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Prev
                                </button>

                                <span className="text-[#666] text-[11px]">
                                    {currentIndex + 1} / {allAudioFiles.length}
                                </span>

                                <button
                                    onClick={() => navigateToAudio(currentIndex + 1)}
                                    disabled={currentIndex === allAudioFiles.length - 1}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2a0f1c] border border-[#e0185a]/30 text-[#e0185a] text-[12px] font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#3a1525] transition"
                                >
                                    Next
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Up Next Preview */}
                        {nextAudio && (
                            <div
                                onClick={() => navigateToAudio(currentIndex + 1)}
                                className="w-full flex items-center gap-2 bg-[#2a0f1c]/60 border border-[#e0185a]/20 rounded-xl px-3 py-2 cursor-pointer hover:bg-[#2a0f1c] transition"
                            >
                                <div className="w-7 h-7 rounded-full bg-[#e0185a]/20 flex items-center justify-center flex-shrink-0">
                                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                                        <path d="M7 4.5L16 10L7 15.5V4.5Z" fill="#e0185a" />
                                    </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[#888] text-[10px] uppercase tracking-wider">Up Next</p>
                                    <p className="text-white text-[12px] font-medium truncate">
                                        {audioFileToAudioDrop(nextAudio).title}
                                    </p>
                                    <p className="text-[#666] text-[10px] truncate">
                                        {nextAudio.matchInfo?.speaker?.replace(/^toss report\s*/i, "").replace(/^script\s*/i, "").replace(/^story\s*/i, "").trim() || "Audio Drop"}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Previous Audio Preview */}
                        {prevAudio && (
                            <div
                                onClick={() => navigateToAudio(currentIndex - 1)}
                                className="w-full flex items-center gap-2 bg-[#1a1a2e]/60 border border-white/10 rounded-xl px-3 py-2 cursor-pointer hover:bg-[#1a1a2e] transition"
                            >
                                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
                                        <path d="M13 4.5L4 10L13 15.5V4.5Z" fill="#aaa" />
                                    </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[#666] text-[10px] uppercase tracking-wider">Previous</p>
                                    <p className="text-[#aaa] text-[12px] font-medium truncate">
                                        {audioFileToAudioDrop(prevAudio).title}
                                    </p>
                                    <p className="text-[#555] text-[10px] truncate">
                                        {prevAudio.matchInfo?.speaker?.replace(/^toss report\s*/i, "").replace(/^script\s*/i, "").replace(/^story\s*/i, "").trim() || "Audio Drop"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <div className="px-4 pt-4 pb-5 bg-[#111114]">
                        <h1 className="text-white text-[19px] sm:text-[21px] font-medium leading-snug mb-1">
                            {audioDrop.title}
                        </h1>
                        {audioDrop.speaker && (
                            <p className="text-[#C9115F] text-[12px] mb-1">by {audioDrop.speaker}</p>
                        )}
                        <p className="text-[#888] text-[13px] leading-relaxed mb-4">
                            {audioDrop.description}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2.5 mb-4">
                            {[
                                { label: "Signals", value: signalsCount.toLocaleString() },
                                { label: "Duration", value: duration },
                            ].map((s, index) => (
                                <div key={index} className="bg-[#1a1a1e] rounded-xl p-2.5 flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1.5 text-[#999]">
                                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                            <circle cx="6.5" cy="6.5" r="5" stroke="#999" strokeWidth="1.2" />
                                            {s.label === "Duration" ? (
                                                <path d="M6.5 4v2.5l1.5 1.5" stroke="#999" strokeWidth="1.2" strokeLinecap="round" />
                                            ) : (
                                                <path d="M4.5 6.5h4M6.5 4.5v4" stroke="#999" strokeWidth="1.2" strokeLinecap="round" />
                                            )}
                                        </svg>
                                        <span className="text-[10px] uppercase tracking-wider text-[#999]">{s.label}</span>
                                    </div>
                                    <span className="text-[17px] sm:text-[19px] font-medium text-white">{s.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* File size */}
                        {audioDrop.sizeFormatted && (
                            <div className="flex items-center gap-2 text-[12px] text-[#555] mb-3">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <rect x="2" y="1.5" width="9" height="10" rx="1.5" stroke="#555" strokeWidth="1.2" />
                                    <path d="M4.5 5h4M4.5 7.5h2.5" stroke="#555" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                                File size: {audioDrop.sizeFormatted}
                            </div>
                        )}

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-[12px] text-[#666] mb-3.5">
                            <div className="flex items-center gap-1.5">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <rect x="1.5" y="2.5" width="10" height="9" rx="1.5" stroke="#666" strokeWidth="1.2" />
                                    <path d="M1.5 5.5h10M4.5 1v3M8.5 1v3" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                                {audioDrop.date || "Recent"}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <circle cx="6.5" cy="4.5" r="2.5" stroke="#666" strokeWidth="1.2" />
                                    <path d="M2 11c0-2 2-3 4.5-3s4.5 1 4.5 3" stroke="#666" strokeWidth="1.2" strokeLinecap="round" />
                                </svg>
                                {audioDrop.room || "Audio Room"}
                            </div>
                        </div>

                        {/* Engagement bar */}
                        <div className="mb-5">
                            <div className="h-1 bg-[#2a2a2e] rounded-full overflow-hidden mb-1.5">
                                <div
                                    className="h-full bg-[#e0185a] rounded-full transition-all duration-300"
                                    style={{ width: `${engPct}%` }}
                                />
                            </div>
                            <p className="text-right text-[11px] text-[#666]">{engPct}% engagement</p>
                        </div>

                        {/* Send Signal button */}
                        <button
                            onClick={() => setShowSignalDialog(true)}
                            className="w-full bg-[#1e0a12] border border-[#e0185a] rounded-[14px] py-4 flex items-center justify-center gap-2 text-[#e0185a] text-[15px] font-medium hover:bg-[#2a0f1c] transition"
                        >
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M9 2C5.7 2 3 4.5 3 7.5c0 1.5.7 2.9 1.9 3.9L4 15l3.5-1.2c.5.2 1 .2 1.5.2C12.3 14 15 11.5 15 8.5S12.3 2 9 2z" stroke="#e0185a" strokeWidth="1.4" strokeLinejoin="round" />
                                <path d="M6.5 8.5h5M9 6v5" stroke="#e0185a" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                            Send Signal
                        </button>
                    </div>
                </div>

                {/* Share Dialog */}
                {showShareDialog && audioDrop && (
                    <>
                        <button
                            type="button"
                            aria-label="Close share popup"
                            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
                            onClick={closeShareDialog}
                        />
                        <div
                            className="fixed bottom-16 inset-x-4 z-50 mx-auto w-full max-w-[260px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl lg:hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-white text-sm font-semibold">Share</p>
                                <button onClick={closeShareDialog} className="text-gray-400 hover:text-white transition" aria-label="Close share popup">
                                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 overflow-x-auto -ml-1">
                                <button onClick={handleShareToWhatsApp} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on WhatsApp">
                                    <img src="/images/share_whatsapp.png" alt="WhatsApp" className="w-full h-full object-cover rounded-full" />
                                </button>
                                <button onClick={handleShareToThreads} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Threads">
                                    <img src="/images/share_thread.png" alt="Threads" className="w-full h-full object-cover rounded-full" />
                                </button>
                                <button onClick={handleShareToInstagram} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Instagram">
                                    <img src="/images/share_insta.png" alt="Instagram" className="w-full h-full object-cover rounded-full" />
                                </button>
                                <button onClick={handleShareToLinkedIn} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on LinkedIn">
                                    <img src="/images/Share_linkedin.png" alt="LinkedIn" className="w-full h-full object-cover rounded-full" />
                                </button>
                                <button onClick={handleShareToX} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on X">
                                    <img src="/images/Share_X.png" alt="X" className="w-full h-full object-cover rounded-full" />
                                </button>
                                <button onClick={handleCopyLink} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Copy share link">
                                    <img src="/images/share_copy_link.png" alt="Copy link" className="w-full h-full object-cover rounded-full" />
                                </button>
                            </div>
                            {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
                        </div>

                        <div className="hidden lg:block absolute left-[calc(100%+8px)] top-2 z-50 w-[260px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-white text-sm font-semibold">Share Audio Drop</p>
                                <button onClick={closeShareDialog} className="text-gray-400 hover:text-white transition" aria-label="Close share panel">
                                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-[#111114] p-3 mb-2">
                                <p className="text-white text-sm font-semibold line-clamp-2">{audioDrop.title}</p>
                                <p className="text-white/65 text-xs mt-1 line-clamp-2">{audioDrop.subtitle || "Audio Drops"}</p>
                                <p className="text-white/45 text-[11px] mt-2 line-clamp-2 break-all">{buildAudioDropShareUrl(audioDrop, urlParam)}</p>
                            </div>
                            <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 -ml-1">
                                <button onClick={handleShareToWhatsApp} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on WhatsApp">
                                    <img src="/images/share_whatsapp.png" alt="WhatsApp" className="w-full h-full object-cover rounded-full" />
                                </button>
                                <button onClick={handleShareToThreads} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Threads">
                                    <img src="/images/share_thread.png" alt="Threads" className="w-full h-full object-cover rounded-full" />
                                </button>
                                <button onClick={handleShareToInstagram} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Instagram">
                                    <img src="/images/share_insta.png" alt="Instagram" className="w-full h-full object-cover rounded-full" />
                                </button>
                                <button onClick={handleShareToLinkedIn} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on LinkedIn">
                                    <img src="/images/Share_linkedin.png" alt="LinkedIn" className="w-full h-full object-cover rounded-full" />
                                </button>
                                <button onClick={handleShareToX} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on X">
                                    <img src="/images/Share_X.png" alt="X" className="w-full h-full object-cover rounded-full" />
                                </button>
                                <button onClick={handleCopyLink} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Copy share link">
                                    <img src="/images/share_copy_link.png" alt="Copy link" className="w-full h-full object-cover rounded-full" />
                                </button>
                            </div>
                            {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
                        </div>
                    </>
                )}
            </div>

            {/* Signal Dialog */}
            {showSignalDialog && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowSignalDialog(false)}>
                    <div className="bg-[#1a1a1e] rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white text-lg font-semibold">Send a Signal</h3>
                            <button onClick={() => setShowSignalDialog(false)} className="text-gray-400 hover:text-white transition">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">
                            Share your thoughts about &apos;{audioDrop.title}&apos;
                        </p>
                        <textarea
                            value={signalMessage}
                            onChange={(e) => setSignalMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full bg-[#111114] text-white text-sm rounded-xl px-4 py-3 border border-[#2a2a2e] focus:outline-none focus:border-[#e0185a] resize-none"
                            rows={4}
                            maxLength={500}
                            autoFocus
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setShowSignalDialog(false)}
                                className="px-4 py-2 rounded-lg bg-[#2a2a2e] text-gray-300 text-sm font-medium hover:bg-[#3a3a3e] transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendSignal}
                                disabled={!signalMessage.trim() || sendingSignal}
                                className="px-4 py-2 rounded-lg bg-[#e0185a] text-white text-sm font-medium hover:bg-[#f01e66] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {sendingSignal ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                        Sending...
                                    </>
                                ) : "Send Signal"}
                            </button>
                        </div>
                        <p className="text-gray-600 text-xs mt-3 text-center">
                            {500 - signalMessage.length} characters remaining
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}