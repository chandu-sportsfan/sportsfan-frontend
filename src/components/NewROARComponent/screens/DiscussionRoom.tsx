// // // chandu's code


// import { useState, useEffect, useRef, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import AvatarWithBadge from "../components/AvatarWithBadge";
// import { fmt } from "../utils";
// import { RADIAL_OPTS } from "../constants";
// import {
//   Image, ChevronLeft, Flame, TrendingUp, Zap, History, PenTool,
//   Brain, Users, CheckCircle2, XCircle,
//   Share2,
// } from "lucide-react";

// interface Props {
//   onBack: () => void;
//   onToast: (m: string) => void;
//   roomId?: string;
//   roomName?: string;
//   onPostClick?: (post: any) => void;
//   onCompose?: (type: string | null) => void;
//   fanCount?: number;
//   score?: string;
//   scoreSubtitle?: string;
//   currentAvatarUrl?: string;
//   onRegisterRefresh?: (fn: () => void) => void;
//   onRegisterReplyUpdate?: (fn: (postId: string, count: number) => void) => void;
//   onFanProfile?: (fan: any) => void;
// }

// const MODE_COLOR: Record<string, string> = {
//   post: "var(--text-primary)",
//   prediction: "var(--gold)",
//   hottake: "#f87171",
//   debate: "#e91e8c",
//   raw_reactions: "#00e8c6",
// };

// const MODES = [
//   { key: "post" as const, label: "Post", icon: <PenTool size={13} />, color: "#ffffff", isAction: false },
//   { key: "debate" as const, label: "Debate", icon: <Zap size={13} />, color: "#e91e8c", isAction: false },
//   { key: "prediction" as const, label: "Predict", icon: <TrendingUp size={13} />, color: "#fbbf24", isAction: false },
//   { key: "hottake" as const, label: "Hot Take", icon: <Flame size={13} />, color: "#f87171", isAction: false },
//   { key: "raw_reactions" as const, label: "Raw Reactions", icon: <History size={13} />, color: "#00e8c6", isAction: false },
//   { key: "quiz" as const, label: "Flash Quiz", icon: <Brain size={13} />, color: "#00e8c6", isAction: true },
// ];

// const PLACEHOLDER: Record<string, string> = {
//   post: "Drop your take...",
//   debate: "My debate side: ",
//   prediction: "My prediction: ",
//   hottake: "Drop a hot take...",
//   raw_reactions: "Share your raw reaction...",
// };

// const typeBadgeClass = (type: string) => {
//   const base = "text-[9px] font-extrabold px-1.5 py-0.5 rounded";
//   if (type === "prediction") return `${base} bg-[rgba(255,215,0,0.15)] text-[#fbbf24] border border-[rgba(255,215,0,0.25)]`;
//   if (type === "post") return `${base} bg-[rgba(233,30,140,0.12)] text-[#E91E8C] border border-[rgba(233,30,140,0.2)]`;
//   if (type === "hottake") return `${base} bg-[rgba(239,68,68,0.15)] text-[#f87171] border border-[rgba(239,68,68,0.25)]`;
//   if (type === "debate") return `${base} bg-[rgba(233,30,140,0.15)] text-[#e91e8c] border border-[rgba(233,30,140,0.25)]`;
//   if (type === "raw_reactions") return `${base} bg-[rgba(0,232,198,0.15)] text-[#00e8c6] border border-[rgba(0,232,198,0.25)]`;
//   return `${base} bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] border border-[rgba(255,255,255,0.1)]`;
// };

// const postCardStyle = (type: string): React.CSSProperties => {
//   if (type === "prediction") return { background: "linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,215,0,0.02))", border: "1px solid rgba(255,215,0,0.18)" };
//   if (type === "hottake") return { background: "linear-gradient(135deg,rgba(239,68,68,0.08),rgba(239,68,68,0.02))", border: "1px solid rgba(239,68,68,0.18)" };
//   if (type === "debate") return { background: "linear-gradient(135deg,rgba(233,30,140,0.08),rgba(233,30,140,0.02))", border: "1px solid rgba(233,30,140,0.18)" };
//   if (type === "raw_reactions") return { background: "linear-gradient(135deg,rgba(0,232,198,0.08),rgba(0,232,198,0.02))", border: "1px solid rgba(0,232,198,0.18)" };
//   return {};
// };

// // ── QuizCard ─────────────────────────────────────────────────────────────────
// interface QuizCardProps {
//   post: any;
//   onToast: (m: string) => void;
//   onPostClick?: (post: any) => void;
//   roomId?: string;
//   onFanProfile?: (fan: any) => void;  // ← Add this to QuizCardProps
// }

// type ShareableRoarPost = {
//   id?: string | number;
//   text?: string;
//   authorUsername?: string;
//   fan?: { username?: string };
// };

// const buildRoarPostShareUrl = (post: ShareableRoarPost) => {
//   if (typeof window === "undefined") return "";
//   const targetUrl = new URL(`${window.location.origin}/MainModules/ROAR`);
//   if (post?.id) targetUrl.searchParams.set("post", String(post.id));
//   return targetUrl.toString();
// };

// const buildRoarPostShareText = (post: ShareableRoarPost) => {
//   const shareUrl = buildRoarPostShareUrl(post);
//   const author = post?.fan?.username || post?.authorUsername || "a Sportsfan";
//   return [`Check out this ROAR post by ${author}`, post?.text || "Join the conversation on Sportsfan ROAR.", `View post: ${shareUrl}`].filter(Boolean).join("\n");
// };

// function QuizCard({ post, onToast, onPostClick, roomId, onFanProfile }: QuizCardProps) {
//   const [selectedOption, setSelectedOption] = useState<string | null>(
//     post.quizUserAnswer ?? null,
//   );
//   const [revealedCorrect, setRevealedCorrect] = useState<string | null>(
//     post.quizCorrectOption ?? null,
//   );
//   const [submitting, setSubmitting] = useState(false);
//   const [participants, setParticipants] = useState<number>(post.quizParticipants ?? 0);

//   const hasAnswered = selectedOption !== null;
//   const quizOptions: { label: string; text: string }[] = post.quizOptions ?? [];

//   const handleOptionClick = useCallback(
//     async (label: string) => {
//       if (hasAnswered || submitting) return;
//       setSubmitting(true);
//       setSelectedOption(label);

//       try {
//         const res = await axios.post(
//           `/api/roar/posts/${post.id}/quiz-answer`,
//           { selectedOption: label },
//         );

//         if (res.data?.success || res.data?.message === "Already answered") {
//           setRevealedCorrect(res.data.correctOption);
//           setParticipants(res.data.quizParticipants ?? participants + 1);
//           if (res.data.isCorrect) {
//             onToast("✅ Correct! +2 points awarded");
//           } else {
//             onToast(`❌ Wrong! Correct answer was ${res.data.correctOption}`);
//           }
//         }
//       } catch (err) {
//         console.error("Quiz answer error:", err);
//         setSelectedOption(null);
//         onToast("Failed to submit answer");
//       } finally {
//         setSubmitting(false);
//       }
//     },
//     [hasAnswered, submitting, post.id, participants, onToast],
//   );

//   const getOptionStyle = (label: string): React.CSSProperties => {
//     const isSelected = selectedOption === label;
//     const isCorrect = revealedCorrect === label;
//     const isWrong = hasAnswered && isSelected && revealedCorrect !== null && !isCorrect;

//     if (!hasAnswered) {
//       return {
//         padding: "11px 14px", borderRadius: 14,
//         background: "rgba(255,255,255,0.04)",
//         border: "1px solid rgba(255,255,255,0.1)",
//         display: "flex", alignItems: "center", gap: 10,
//         cursor: submitting ? "not-allowed" : "pointer",
//         transition: "all 0.18s",
//         opacity: submitting ? 0.6 : 1,
//       };
//     }
//     if (isCorrect) {
//       return {
//         padding: "11px 14px", borderRadius: 14,
//         background: "rgba(0,232,198,0.12)",
//         border: "1px solid rgba(0,232,198,0.4)",
//         display: "flex", alignItems: "center", gap: 10,
//         cursor: "default", transition: "all 0.18s",
//       };
//     }
//     if (isWrong) {
//       return {
//         padding: "11px 14px", borderRadius: 14,
//         background: "rgba(244,67,54,0.1)",
//         border: "1px solid rgba(244,67,54,0.35)",
//         display: "flex", alignItems: "center", gap: 10,
//         cursor: "default", transition: "all 0.18s",
//       };
//     }
//     return {
//       padding: "11px 14px", borderRadius: 14,
//       background: "rgba(255,255,255,0.02)",
//       border: "1px solid rgba(255,255,255,0.05)",
//       display: "flex", alignItems: "center", gap: 10,
//       cursor: "default", opacity: 0.45, transition: "all 0.18s",
//     };
//   };

//   const getLabelColor = (label: string) => {
//     if (!hasAnswered) return "#4A4A62";
//     if (revealedCorrect === label) return "#00E8C6";
//     if (selectedOption === label && revealedCorrect !== label) return "#F44336";
//     return "#4A4A62";
//   };

//   return (
//     <div className="glass-card" style={{ padding: "16px", position: "relative", overflow: "hidden" }}>
//       <div style={{
//         position: "absolute", top: 0, left: 0, right: 0, height: 2,
//         background: "linear-gradient(90deg,#E91E8C,#FF6B35,#00E8C6)",
//         borderRadius: "28px 28px 0 0",
//       }} />

//       <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
//         <span style={{
//           fontSize: 10, fontWeight: 800, letterSpacing: "0.06em",
//           padding: "3px 8px", borderRadius: 4, textTransform: "uppercase",
//           background: "rgba(0,232,198,0.12)", color: "#00E8C6",
//           border: "1px solid rgba(0,232,198,0.25)",
//         }}>
//           🧠 Flash Quiz
//         </span>
//         {hasAnswered && revealedCorrect && (
//           <span style={{
//             fontSize: 10, fontWeight: 700, marginLeft: "auto",
//             color: selectedOption === revealedCorrect ? "#00E8C6" : "#F44336",
//           }}>
//             {selectedOption === revealedCorrect ? "✓ Correct!" : "✗ Wrong"}
//           </span>
//         )}
//       </div>

//       <div 
//         style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, cursor: "pointer" }}
//         onClick={(e) => {
//           e.stopPropagation();
//           onFanProfile?.(post.fan);
//         }}
//       >
//         <AvatarWithBadge username={post.fan.username} badge={post.fan.badge} size="sm" avatarUrl={post.fan.avatarUrl} />
//         <div>
//           <p style={{ fontWeight: 700, fontSize: 13 }}>{post.fan.username}</p>
//           <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{post.timeAgo}</p>
//         </div>
//       </div>

//       <p
//         style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.5, marginBottom: 14, color: "#F5F5FA", cursor: "pointer" }}
//         onClick={() => onPostClick && onPostClick(post)}
//       >
//         {post.quizQuestion || post.text}
//       </p>

//       {quizOptions.length > 0 && (
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
//           {quizOptions.map((opt) => {
//             const isCorrect = hasAnswered && revealedCorrect === opt.label;
//             const isWrong = hasAnswered && selectedOption === opt.label && revealedCorrect !== opt.label && revealedCorrect !== null;
//             return (
//               <motion.div
//                 key={opt.label}
//                 whileTap={!hasAnswered && !submitting ? { scale: 0.97 } : {}}
//                 style={getOptionStyle(opt.label)}
//                 onClick={(e) => { e.stopPropagation(); handleOptionClick(opt.label); }}
//               >
//                 <span style={{
//                   fontSize: 11, fontWeight: 800,
//                   fontFamily: "'Bebas Neue', sans-serif",
//                   letterSpacing: "0.04em",
//                   color: getLabelColor(opt.label),
//                   minWidth: 14, flexShrink: 0,
//                 }}>
//                   {opt.label}
//                 </span>
//                 {hasAnswered && isCorrect && <CheckCircle2 size={13} color="#00E8C6" style={{ flexShrink: 0 }} />}
//                 {hasAnswered && isWrong && <XCircle size={13} color="#F44336" style={{ flexShrink: 0 }} />}
//                 <span style={{
//                   fontSize: 12, fontWeight: 500,
//                   color: isCorrect ? "#00E8C6" : isWrong ? "#F44336" : hasAnswered ? "rgba(255,255,255,0.35)" : "#9494AD",
//                   overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
//                 }}>
//                   {opt.text || `Option ${opt.label}`}
//                 </span>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}

//       {!hasAnswered && (
//         <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontStyle: "italic" }}>
//           Tap an option to answer
//         </p>
//       )}

//       <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//         <Users size={13} color="#9494AD" />
//         <span style={{ fontSize: 12, fontWeight: 600, color: "#9494AD" }}>
//           {participants > 0
//             ? `${participants.toLocaleString()} fan${participants === 1 ? "" : "s"} participated`
//             : "Be the first to answer!"}
//         </span>
//       </div>
//     </div>
//   );
// }

// // ── Main DiscussionRoom ───────────────────────────────────────────────────────

// export default function DiscussionRoom({
//   onBack, onToast, roomId, roomName, onPostClick, onCompose,
//   fanCount = 312, score, scoreSubtitle, currentAvatarUrl, onRegisterRefresh, onRegisterReplyUpdate,
//   onFanProfile,  // ← Add this to destructuring
// }: Props) {
//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [input, setInput] = useState("");
//   const [mode, setMode] = useState<"post" | "debate" | "prediction" | "hottake" | "raw_reactions">("post");
//   const [uploading, setUploading] = useState(false);
//   const [attachedUrl, setAttachedUrl] = useState<string | null>(null);
//   const [attachedType, setAttachedType] = useState<"image" | "video" | null>(null);
//   const [userUsername, setUserUsername] = useState("RoarUser");
//   const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(currentAvatarUrl);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedActionId, setSelectedActionId] = useState("post");
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const [liveCount, setLiveCount] = useState<number>(fanCount ?? 0);
//   const [sharePost, setSharePost] = useState<ShareableRoarPost | null>(null);
//   const [copied, setCopied] = useState(false);

//   const listRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const pendingLikes = useRef<Set<string>>(new Set());

//   const openShareDialog = (post: ShareableRoarPost) => { setSharePost(post); setCopied(false); };
//   const closeShareDialog = () => { setSharePost(null); setCopied(false); };
//   const handleShareToWhatsApp = () => { if (!sharePost) return; window.open(`https://wa.me/?text=${encodeURIComponent(buildRoarPostShareText(sharePost))}`, "_blank"); };
//   const handleShareToThreads = () => { if (!sharePost) return; window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(buildRoarPostShareText(sharePost))}`, "_blank"); };
//   const handleShareToInstagram = async () => { if (!sharePost) return; await copyToClipboard(buildRoarPostShareText(sharePost)); setCopied(true); setTimeout(() => setCopied(false), 1600); window.open("https://www.instagram.com/", "_blank"); };
//   const handleShareToLinkedIn = () => { if (!sharePost) return; window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(buildRoarPostShareUrl(sharePost))}`, "_blank"); };
//   const handleShareToX = () => { if (!sharePost) return; window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(buildRoarPostShareText(sharePost))}`, "_blank"); };
//   const handleCopyLink = async () => {
//     if (!sharePost) return;
//     const ok = await copyToClipboard(buildRoarPostShareText(sharePost));
//     if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1600); onToast("Link copied to clipboard!"); }
//   };

//   const shareButtons = (size: string) => (
//     <>
//       {[
//         { handler: handleShareToWhatsApp, src: "/images/share_whatsapp.png", alt: "WhatsApp" },
//         { handler: handleShareToThreads, src: "/images/share_thread.png", alt: "Threads" },
//         { handler: handleShareToInstagram, src: "/images/share_insta.png", alt: "Instagram" },
//         { handler: handleShareToLinkedIn, src: "/images/Share_linkedin.png", alt: "LinkedIn" },
//         { handler: handleShareToX, src: "/images/Share_X.png", alt: "X" },
//         { handler: handleCopyLink, src: "/images/share_copy_link.png", alt: "Copy" },
//       ].map(({ handler, src, alt }) => (
//         <button key={alt} onClick={handler} className={`${size} shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center`} type="button">
//           <img src={src} alt={alt} width={36} height={36} className="w-full h-full object-cover rounded-full" />
//         </button>
//       ))}
//     </>
//   );

//   /* ── close dropdown on outside click ── */
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* ── join / leave counter ── */
//   useEffect(() => {
//     if (!roomId) return;

//     const join = async () => {
//       try {
//         const res = await axios.post(`/api/roar/rooms/${roomId}/presence`);
//         if (res.data?.success) setLiveCount(res.data.fanCount);
//       } catch (e) {
//         console.error("Join failed:", e);
//       }
//     };

//     const leaveBeacon = () => {
//       navigator.sendBeacon(`/api/roar/rooms/${roomId}/presence/leave`);
//     };

//     const leaveAxios = () => {
//       axios.delete(`/api/roar/rooms/${roomId}/presence`).catch(() => { });
//     };

//     join();
//     window.addEventListener("beforeunload", leaveBeacon);

//     return () => {
//       leaveAxios();
//       window.removeEventListener("beforeunload", leaveBeacon);
//     };
//   }, [roomId]);

//   /* ── user prefs ── */
//   useEffect(() => {
//     try {
//       setUserUsername(localStorage.getItem("roar_username") || "RoarUser");
//       setUserAvatarUrl(currentAvatarUrl || localStorage.getItem("roar_avatar_url") || undefined);
//     } catch { }
//   }, [currentAvatarUrl]);

//   /* ── fetch messages ── */
//   const fetchMsgs = useCallback(async () => {
//     if (!roomId) return;
//     try {
//       const res = await axios.get(`/api/roar/rooms/${roomId}/messages?t=${Date.now()}`);
//       if (res.data?.success) {
//         setPosts(prev => {
//           const prevMap = Object.fromEntries(prev.map(p => [p.id, p]));
//           return [...res.data.messages]
//             .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//             .map((m: any) => {
//               const existing = prevMap[m.msgId];
//               const isPending = pendingLikes.current.has(m.msgId);

//               return {
//                 id: m.msgId,
//                 fan: {
//                   username: m.authorUsername,
//                   badge: m.authorBadge,
//                   avatarUrl: m.authorAvatarUrl || m.avatarUrl || (m.authorUsername === userUsername ? userAvatarUrl : undefined),
//                 },
//                 text: m.text,
//                 fireCount: m.fireCount || 0,
//                 nochanceCount: m.noChanceCount || 0,
//                 heartCount: isPending
//                   ? (existing?.heartCount ?? m.heartCount ?? 0)
//                   : (m.heartCount ?? 0),
//                 userLiked: isPending
//                   ? (existing?.userLiked ?? false)
//                   : (m.userLiked ?? existing?.userLiked ?? false),
//                 replyCount: Math.max(m.replyCount ?? 0, existing?.replyCount ?? 0),
//                 agreeCount: m.agreeCount ?? 0,
//                 disagreeCount: m.disagreeCount ?? 0,
//                 userVote: m.userVote ?? null,
//                 sideA: m.sideA ?? null,
//                 sideB: m.sideB ?? null,
//                 timeAgo: new Date(m.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }) + " · " + new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//                 createdAt: m.createdAt,
//                 type: m.type,
//                 mediaUrls: m.mediaUrls,
//                 quizQuestion: m.quizQuestion,
//                 quizOptions: m.quizOptions,
//                 quizCorrectOption: m.quizCorrectOption,
//                 quizUserAnswer: m.quizUserAnswer ?? null,
//                 quizTimer: m.quizTimer,
//                 quizPoints: m.quizPoints,
//                 quizParticipants: m.quizParticipants ?? 0,
//                 memGifUrl: m.memGifUrl ?? null,
//                 memTag: m.memTag ?? null,
//               };
//             });
//         });
//       }
//     } catch (e) { console.error(e); }
//     finally { setLoading(false); }
//   }, [roomId, userAvatarUrl, userUsername]);

//   useEffect(() => {
//     onRegisterRefresh?.(fetchMsgs);
//   }, [fetchMsgs, onRegisterRefresh]);

//   useEffect(() => {
//     onRegisterReplyUpdate?.((postId, count) => {
//       setPosts(p => p.map(x => x.id === postId ? { ...x, replyCount: count } : x));
//     });
//   }, [onRegisterReplyUpdate]);

//   useEffect(() => {
//     if (!roomId) return;
//     fetchMsgs();
//     const iv = setInterval(fetchMsgs, 3000);
//     return () => clearInterval(iv);
//   }, [fetchMsgs, roomId]);

//   /* ── scroll to bottom on load ── */
//   useEffect(() => {
//     if (!loading && listRef.current)
//       setTimeout(() => listRef.current?.scrollTo({ top: 0 }), 50);
//   }, [loading]);

//   /* ── upload ── */
//   const triggerUpload = (type: "image" | "video") => {
//     setAttachedType(type);
//     if (fileInputRef.current) {
//       fileInputRef.current.accept = type === "image" ? "image/*" : "video/*";
//       fileInputRef.current.click();
//     }
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     try {
//       setUploading(true); onToast("Uploading media...");
//       const fd = new FormData(); fd.append("file", file);
//       const res = await axios.post("/api/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
//       if (res.data?.url) { setAttachedUrl(res.data.url); onToast("Media uploaded!"); }
//     } catch { onToast("Upload failed"); setAttachedType(null); }
//     finally { setUploading(false); if (e.target) e.target.value = ""; }
//   };

//   /* ── send ── */
//   const send = async () => {
//     if (!roomId) return;
//     const text = input.trim();
//     if (!text && !attachedUrl) return;
//     try {
//       const res = await axios.post(`/api/roar/rooms/${roomId}/messages`, {
//         text: text || "Shared media", type: mode,
//         mediaUrls: attachedUrl ? [attachedUrl] : undefined,
//       });
//       if (res.data?.success) {
//         const m = res.data.message;
//         setPosts(p => [{
//           id: m.msgId,
//           fan: {
//             username: m.authorUsername,
//             badge: m.authorBadge,
//             avatarUrl: m.authorAvatarUrl || m.avatarUrl || (m.authorUsername === userUsername ? userAvatarUrl : undefined),
//           },
//           text: m.text,
//           fireCount: 0,
//           nochanceCount: 0,
//           heartCount: 0,
//           userLiked: false,
//           replyCount: 0,
//           agreeCount: 0,
//           disagreeCount: 0,
//           userVote: null,
//           sideA: m.sideA ?? null,
//           sideB: m.sideB ?? null,
//           timeAgo: "now",
//           createdAt: m.createdAt || Date.now(),
//           type: m.type,
//           mediaUrls: m.mediaUrls,
//           quizQuestion: m.quizQuestion,
//           quizOptions: m.quizOptions,
//           quizCorrectOption: m.quizCorrectOption,
//           quizUserAnswer: m.quizUserAnswer ?? null,
//           quizTimer: m.quizTimer,
//           quizPoints: m.quizPoints,
//           quizParticipants: m.quizParticipants ?? 0,
//           memGifUrl: m.memGifUrl ?? null,
//           memTag: m.memTag ?? null,
//         }, ...p]);
//         setInput(""); setAttachedUrl(null); setAttachedType(null);
//         setTimeout(() => listRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 50);
//       }
//     } catch { onToast("Failed to send message"); }
//   };

//   /* ── fire / noChance reactions ── */
//   const react = async (id: string, reaction: "fire" | "noChance") => {
//     if (!roomId) return;
//     setPosts(p => p.map(x => x.id !== id ? x :
//       reaction === "fire"
//         ? { ...x, fireCount: x.fireCount + 1 }
//         : { ...x, nochanceCount: x.nochanceCount + 1 }
//     ));
//     try {
//       await axios.post(`/api/roar/rooms/${roomId}/messages/${id}/react`, { reaction });
//     } catch {
//       setPosts(p => p.map(x => x.id !== id ? x :
//         reaction === "fire"
//           ? { ...x, fireCount: Math.max(0, x.fireCount - 1) }
//           : { ...x, nochanceCount: Math.max(0, x.nochanceCount - 1) }
//       ));
//     }
//   };

//   const handleLike = async (id: string) => {
//     if (!roomId) return;

//     const prev = posts.find(x => x.id === id);
//     if (!prev) return;

//     const wasLiked = prev.userLiked ?? false;
//     pendingLikes.current.add(id);

//     setPosts(p => p.map(x => x.id !== id ? x : {
//       ...x,
//       userLiked: !wasLiked,
//       heartCount: wasLiked
//         ? Math.max(0, (x.heartCount || 0) - 1)
//         : (x.heartCount || 0) + 1,
//     }));

//     try {
//       const res = await axios.post(
//         `/api/roar/rooms/${roomId}/messages/${id}/react`,
//         { reaction: "heart" }
//       );
//       if (res.data?.heartCount !== undefined) {
//         setPosts(p => p.map(x => x.id !== id ? x : {
//           ...x,
//           heartCount: res.data.heartCount,
//         }));
//       }
//     } catch {
//       setPosts(p => p.map(x => x.id !== id ? x : {
//         ...x,
//         userLiked: wasLiked,
//         heartCount: prev.heartCount,
//       }));
//       onToast("Failed to update like");
//     } finally {
//       setTimeout(() => pendingLikes.current.delete(id), 3000);
//     }
//   };

//   const copyToClipboard = async (text: string) => {
//     try { await navigator.clipboard.writeText(text); return true; }
//     catch {
//       try {
//         const input = document.createElement("textarea");
//         input.value = text; input.style.position = "fixed"; input.style.opacity = "0";
//         document.body.appendChild(input); input.focus(); input.select();
//         const ok = document.execCommand("copy"); document.body.removeChild(input); return ok;
//       } catch { return false; }
//     }
//   };

//   /* ── back ── */
//   const handleBack = (e: React.PointerEvent | React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     onBack();
//   };

//   const shareRoomLink = () => {
//     if (typeof navigator !== "undefined" && navigator.share) {
//       navigator.share({ title: "SF360 Infinity Room", url: window.location.href });
//     } else { copyToClipboard(window.location.href); onToast("Link copied!"); }
//   };

//   /* ── compose icon lookup ── */
//   const composeIconMap: Record<string, React.ReactNode> = {
//     hot_take: <Flame size={13} stroke="url(#dr-pink-orange-grad)" fill="url(#dr-pink-orange-grad)" />,
//     prediction: <TrendingUp size={13} stroke="url(#dr-pink-orange-grad)" />,
//     debate: <Zap size={13} stroke="url(#dr-pink-orange-grad)" fill="url(#dr-pink-orange-grad)" />,
//     memory: <History size={13} stroke="url(#dr-pink-orange-grad)" />,
//     post: <PenTool size={13} stroke="url(#dr-pink-orange-grad)" />,
//     quiz: <Brain size={13} stroke="url(#dr-pink-orange-grad)" />,
//   };

//   return (
//     <div className="flex flex-col w-full bg-[#0e0e14]" style={{ height: "100%", overflow: "hidden" }}>
//       <svg width="0" height="0" style={{ position: "absolute" }}>
//         <linearGradient id="dr-pink-orange-grad" x1="0%" y1="0%" x2="100%" y2="100%">
//           <stop offset="0%" stopColor="#e91e8c" />
//           <stop offset="100%" stopColor="#ff6b35" />
//         </linearGradient>
//       </svg>

//       {/* Share dialog */}
//       {sharePost && (
//         <>
//           <button type="button" className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={closeShareDialog} />
//           <div className="fixed bottom-16 inset-x-4 z-50 mx-auto w-full max-w-[280px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl lg:hidden" onClick={e => e.stopPropagation()}>
//             <div className="flex items-center justify-between mb-2">
//               <p className="text-white text-sm font-semibold">Share</p>
//               <button type="button" onClick={closeShareDialog} className="text-gray-400 hover:text-white"><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
//             </div>
//             <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 overflow-x-auto">{shareButtons("w-8 h-8")}</div>
//             {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
//           </div>
//           <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/60" onClick={closeShareDialog}>
//             <div className="bg-[#1a1a1e] rounded-2xl border border-white/10 p-4 w-[300px] shadow-2xl" onClick={e => e.stopPropagation()}>
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-white text-sm font-semibold">Share ROAR Post</p>
//                 <button type="button" onClick={closeShareDialog} className="text-gray-400 hover:text-white"><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
//               </div>
//               <div className="rounded-xl border border-white/10 bg-[#111114] p-3 mb-3">
//                 <p className="text-white text-sm font-semibold line-clamp-2">{sharePost.text || "ROAR Post"}</p>
//                 <p className="text-white/45 text-[11px] mt-2 line-clamp-2 break-all">{buildRoarPostShareUrl(sharePost)}</p>
//               </div>
//               <div className="flex flex-row flex-nowrap items-center gap-2 mb-2">{shareButtons("w-9 h-9")}</div>
//               {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
//             </div>
//           </div>
//         </>
//       )}

//       {/* ── HEADER ── */}
//       <div className="shrink-0 px-4 py-3 bg-[rgba(14,14,20,0.98)] backdrop-blur-[20px] border-b border-[var(--border)]" style={{ overflow: "visible", position: "relative", zIndex: 40 }}>
//         <div className="flex justify-between items-start">
//           <div className="flex items-center gap-3 flex-1 min-w-0">
//             <button
//               type="button"
//               onPointerDown={handleBack}
//               onClick={handleBack}
//               className="bg-transparent border-none cursor-pointer text-white flex items-center p-0 flex-shrink-0"
//               style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
//             >
//               <ChevronLeft size={24} />
//             </button>
//             <div className="text-left pt-0.5 flex-1 min-w-0">
//               <p className="font-display text-2xl tracking-[0.04em] m-0 leading-tight text-white font-extrabold uppercase truncate">
//                 {roomName || "WORLDCUP"}
//               </p>
//               <div className="flex items-center gap-1.5 mt-1">
//                 <span className="live-pulse w-1.5 h-1.5 rounded-full bg-[var(--live-green)] inline-block flex-shrink-0" />
//                 <span className="text-[10px] font-bold text-[var(--live-green)] flex-shrink-0">LIVE</span>
//                 <span className="text-[11px] text-white text-[var(--text-muted)] truncate">· {fmt(liveCount)} joined</span>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 flex-shrink-0 ml-2">
//             <button
//               type="button"
//               onClick={shareRoomLink}
//               className="flex-shrink-0 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] rounded-[10px] p-2 cursor-pointer text-[rgba(255,255,255,0.75)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors"
//               style={{ width: "36px", height: "36px" }}
//             >
//               <Share2 size={18} />
//             </button>

//             {(score || scoreSubtitle) && (
//               <div className="text-right pr-1 flex-shrink-0">
//                 {score && <div className="font-display text-[24px] text-[var(--accent-yellow)] leading-none">{score}</div>}
//                 {scoreSubtitle && <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{scoreSubtitle}</div>}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="mt-3">
//           <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1">
//             <span>Room Energy</span>
//           </div>
//           <div className="room-energy-bar room-energy-fast rounded-full" />
//         </div>
//       </div>

//       {/* ── FEED ── */}
//       <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 flex flex-col gap-3 min-h-0">
//         <AnimatePresence initial={false}>
//           {loading ? (
//             <div className="text-center text-[var(--text-muted)] py-8">Loading messages...</div>
//           ) : posts.length === 0 ? (
//             <div className="text-center text-[var(--text-muted)] py-8">No posts yet. Be the first!</div>
//           ) : (
//             posts.map((p) => {

//               /* ── QUIZ card ── */
//               if (p.type === "quiz") {
//                 return (
//                   <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
//                     <QuizCard post={p} onToast={onToast} onPostClick={onPostClick} roomId={roomId} onFanProfile={onFanProfile} />
//                   </motion.div>
//                 );
//               }

//               /* ── DEBATE card ── */
//               if (p.type === "debate") {
//                 const liveTotal = (p.agreeCount ?? 0) + (p.disagreeCount ?? 0);
//                 const agrPct = liveTotal > 0 ? Math.round(((p.agreeCount ?? 0) / liveTotal) * 100) : 50;
//                 const disAgrPct = 100 - agrPct;
//                 const userVote = p.userVote;
//                 const hasVoted = userVote === "agree" || userVote === "disagree";
//                 const displayVotedA = userVote === "agree";
//                 const displayVotedB = userVote === "disagree";
//                 const rawText = p.text ?? "";
//                 const vsParts = rawText.split(" VS ");
//                 const hasSides = !!(p.sideA || p.sideB);
//                 const sideA = p.sideA || vsParts[0] || "Side A";
//                 const sideB = p.sideB || vsParts[1] || "Side B";
//                 const questionText = hasSides ? rawText : null;

//                 return (
//                   <motion.div
//                     key={p.id}
//                     initial={{ opacity: 0, y: 16 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.22 }}
//                     className="glass-card p-4 cursor-pointer"
//                     style={{ background: "linear-gradient(135deg,rgba(233,30,140,0.08),rgba(233,30,140,0.02))", border: "1px solid rgba(233,30,140,0.18)" }}
//                     onClick={() => onPostClick?.({ id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo, createdAt: p.createdAt, type: "debate", isDbPost: true, roomId, mediaUrls: p.mediaUrls, sideA, sideB })}
//                   >
//                     <div style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
//                       <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: "rgba(233,30,140,0.12)", color: "#e91e8c", border: "1px solid rgba(233,30,140,0.25)" }}>⚡ Debate</span>
//                       {hasVoted && (
//                         <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "rgba(233,30,140,0.08)", color: "#e91e8c", border: "1px solid rgba(233,30,140,0.2)" }}>🗳️ Voted</span>
//                       )}
//                     </div>

//                     <div 
//                       className="flex gap-2 items-center mb-2.5 cursor-pointer"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         onFanProfile?.(p.fan);
//                       }}
//                     >
//                       <AvatarWithBadge username={p.fan.username} badge={p.fan.badge} size="sm" avatarUrl={p.fan.avatarUrl} />
//                       <div>
//                         <p className="font-bold text-[13px]">{p.fan.username}</p>
//                         <p className="text-[10px] text-[var(--text-muted)]">{p.timeAgo}</p>
//                       </div>
//                     </div>

//                     {questionText && (
//                       <p style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, marginBottom: 12, color: "var(--text-primary)" }}>
//                         {questionText}
//                       </p>
//                     )}

//                     <div style={{ display: "flex", gap: 8, alignItems: "stretch", marginBottom: 10 }}>
//                       {[
//                         { label: sideA, voted: displayVotedA, color: "var(--accent-magenta)", bg: "rgba(233,30,140,0.08)", border: "rgba(233,30,140,0.3)", voteVal: "agree" as const },
//                         { label: sideB, voted: displayVotedB, color: "#60a5fa", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.3)", voteVal: "disagree" as const },
//                       ].map(({ label, voted, color, bg, border, voteVal }, idx) => (
//                         <>
//                           {idx === 1 && (
//                             <div key="vs" style={{ display: "flex", alignItems: "center", padding: "0 4px" }}>
//                               <span className="font-display" style={{ fontSize: 16, color: "var(--text-muted)" }}>VS</span>
//                             </div>
//                           )}
//                           <motion.button
//                             key={voteVal}
//                             whileTap={!hasVoted ? { scale: 0.96 } : {}}
//                             onClick={async (e) => {
//                               e.stopPropagation();
//                               if (hasVoted) return;
//                               try {
//                                 await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: voteVal });
//                                 setPosts(prev => prev.map(x => x.id !== p.id ? x : {
//                                   ...x,
//                                   userVote: voteVal,
//                                   agreeCount: (x.agreeCount ?? 0) + (voteVal === "agree" ? 1 : 0),
//                                   disagreeCount: (x.disagreeCount ?? 0) + (voteVal === "disagree" ? 1 : 0),
//                                 }));
//                               } catch { onToast("You've already voted!!"); }
//                             }}
//                             disabled={hasVoted}
//                             style={{
//                               flex: 1, padding: "12px", borderRadius: 14, textAlign: "center",
//                               background: voted ? color : bg,
//                               border: `2px solid ${voted ? color : border}`,
//                               color: voted ? "white" : "var(--text-primary)",
//                               cursor: hasVoted ? "not-allowed" : "pointer",
//                               transition: "all 0.2s",
//                               opacity: hasVoted && !voted ? 0.35 : 1,
//                             }}
//                           >
//                             <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>
//                               {voted ? "✓ " : ""}{label}
//                             </p>
//                           </motion.button>
//                         </>
//                       ))}
//                     </div>

//                     <div style={{ marginBottom: 10 }}>
//                       <div style={{ display: "flex", borderRadius: 999, overflow: "hidden", height: 6, background: "rgba(255,255,255,0.06)" }}>
//                         <div style={{ width: `${agrPct}%`, background: "var(--accent-magenta)", transition: "width 0.4s ease" }} />
//                         <div style={{ width: `${disAgrPct}%`, background: "#60a5fa", transition: "width 0.4s ease" }} />
//                       </div>
//                       <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
//                         <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-magenta)" }}>{agrPct}%</span>
//                         <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{liveTotal} vote{liveTotal !== 1 ? "s" : ""}</span>
//                         <span style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa" }}>{disAgrPct}%</span>
//                       </div>
//                     </div>

//                     <p style={{ fontSize: 11, fontWeight: hasVoted ? 600 : 400, color: hasVoted ? "var(--accent-magenta)" : "var(--text-muted)", marginBottom: 10, fontStyle: hasVoted ? "normal" : "italic" }}>
//                       {hasVoted ? "🗳️ You've already voted · thanks for joining the debate!" : "Tap a side to vote · results reveal after voting"}
//                     </p>

//                     <div style={{ marginTop: 2 }}>
//                       <div style={{ display: "flex", gap: 16, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10 }}>
//                         <button
//                           onClick={e => { e.stopPropagation(); handleLike(p.id); }}
//                           style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: p.userLiked ? "#ff4a7d" : "#9494ad", fontSize: 13, fontWeight: 600 }}
//                         >
//                           <svg width="16" height="16" viewBox="0 0 24 24" fill={p.userLiked ? "#ff4a7d" : "none"} stroke="currentColor" strokeWidth="2">
//                             <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
//                           </svg>
//                           <span>{p.heartCount || 0}</span>
//                         </button>

//                         <button
//                           onClick={e => {
//                             e.stopPropagation();
//                             onPostClick?.({ id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo, createdAt: p.createdAt, type: "debate", isDbPost: true, roomId, mediaUrls: p.mediaUrls, sideA, sideB });
//                           }}
//                           style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#9494ad", fontSize: 13, fontWeight: 600 }}
//                         >
//                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//                           </svg>
//                           <span>{p.replyCount || 0}</span>
//                         </button>

//                         <button
//                           onClick={e => {
//                             e.stopPropagation();
//                             if (navigator.share) {
//                               navigator.share({ title: "ROAR", text: p.text, url: window.location.href });
//                             } else {
//                               navigator.clipboard.writeText(window.location.href);
//                               onToast("Link copied!");
//                             }
//                           }}
//                           style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#9494ad", fontSize: 13, fontWeight: 600 }}
//                         >
//                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                             <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
//                             <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
//                             <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
//                           </svg>
//                           <span>Share</span>
//                         </button>
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               }

//               /* ── DEFAULT message card ── */
//               return (
//                 <motion.div
//                   key={p.id}
//                   initial={{ opacity: 0, y: 16 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.22 }}
//                   className="glass-card p-3 cursor-pointer"
//                   style={postCardStyle(p.type)}
//                   onClick={() => onPostClick?.({ id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo, createdAt: p.createdAt, type: p.type || "post", isDbPost: true, roomId, mediaUrls: p.mediaUrls })}
//                 >
//                   <div 
//                     className="flex justify-between items-center cursor-pointer"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onFanProfile?.(p.fan);
//                     }}
//                   >
//                     <div className="flex gap-2 items-center">
//                       <AvatarWithBadge username={p.fan.username} badge={p.fan.badge} size="sm" avatarUrl={p.fan.avatarUrl} />
//                       <div>
//                         <p className="font-bold text-[13px]">{p.fan.username}</p>
//                         <p className="text-[10px] text-[var(--text-muted)]">{p.timeAgo}</p>
//                       </div>
//                     </div>
//                     {p.type && (
//                       <span className={typeBadgeClass(p.type)}>
//                         {p.type === "post" ? "✏️ POST"
//                           : p.type === "hottake" ? "🔥 HOT TAKE"
//                             : p.type === "prediction" ? "📊 PREDICT"
//                               : p.type === "debate" ? "⚡ DEBATE"
//                                 : p.type === "raw_reactions" ? "🕰 Raw REACTIONS"
//                                   : p.type.toUpperCase()}
//                       </span>
//                     )}
//                   </div>

//                   <p className="text-sm leading-snug mt-2" style={{ color: MODE_COLOR[p.type] || "white" }}>
//                     {p.text}
//                   </p>

//                   {p.type === "raw_reactions" && p.memGifUrl && (
//                     <img src={p.memGifUrl} alt="reaction gif" style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 12, marginTop: 8 }} />
//                   )}
//                   {p.type === "raw_reactions" && p.memTag && (
//                     <span style={{ display: "inline-block", marginTop: 8, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "rgba(0,232,198,0.12)", color: "#00e8c6", border: "1px solid rgba(0,232,198,0.3)", letterSpacing: "0.04em" }}>
//                       #{p.memTag}
//                     </span>
//                   )}

//                   {p.type === "prediction" && (() => {
//                     const liveTotal = (p.agreeCount ?? 0) + (p.disagreeCount ?? 0);
//                     const agrPct = liveTotal > 0 ? Math.round(((p.agreeCount ?? 0) / liveTotal) * 100) : 50;
//                     const disAgrPct = 100 - agrPct;
//                     const userVote = p.userVote;
//                     const hasVoted = userVote === "agree" || userVote === "disagree";
//                     return (
//                       <div style={{ display: "flex", gap: 8, marginTop: 10, marginBottom: 4 }}>
//                         {[
//                           { agree: true, label: "Support", pctVal: agrPct, active: userVote === "agree", color: "#22c55e" },
//                           { agree: false, label: "Counter", pctVal: disAgrPct, active: userVote === "disagree", color: "var(--accent-magenta)" },
//                         ].map(({ agree, label, pctVal, active, color }) => (
//                           <motion.button
//                             key={label}
//                             whileTap={!hasVoted ? { scale: 0.93 } : {}}
//                             onClick={async (e) => {
//                               e.stopPropagation();
//                               if (hasVoted) return;
//                               try {
//                                 await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: agree ? "agree" : "disagree" });
//                                 setPosts(prev => prev.map(x => x.id !== p.id ? x : {
//                                   ...x,
//                                   userVote: agree ? "agree" : "disagree",
//                                   agreeCount: (x.agreeCount ?? 0) + (agree ? 1 : 0),
//                                   disagreeCount: (x.disagreeCount ?? 0) + (!agree ? 1 : 0),
//                                 }));
//                               } catch { onToast("You've already voted!!"); }
//                             }}
//                             style={{
//                               flex: 1, padding: "9px", borderRadius: 999, fontSize: 12, fontWeight: 700,
//                               cursor: hasVoted ? "default" : "pointer",
//                               border: `2px solid ${color}`,
//                               background: active ? color : "rgba(255,255,255,0.02)",
//                               color: active ? "white" : color,
//                               boxShadow: active ? `0 0 14px ${color}50` : "none",
//                               transition: "all 0.2s ease-in-out",
//                               display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
//                               opacity: hasVoted && !active ? 0.4 : 1,
//                             }}
//                           >
//                             {active ? `✓ ${agree ? "Supported" : "Countered"}` : label}
//                             <span style={{ fontSize: 10, fontWeight: 800, background: active ? "rgba(255,255,255,0.2)" : `${color}22`, borderRadius: 999, padding: "1px 6px" }}>
//                               {pctVal}%
//                             </span>
//                           </motion.button>
//                         ))}
//                       </div>
//                     );
//                   })()}

//                   {p.mediaUrls?.length > 0 && (
//                     <div className="flex flex-col gap-2 mt-2">
//                       {p.mediaUrls.map((url: string, i: number) =>
//                         url.endsWith(".mp4") || url.includes("/video/upload/") ? (
//                           <video key={i} src={url} controls className="w-full max-h-[200px] rounded-lg object-cover" onClick={e => e.stopPropagation()} />
//                         ) : (
//                           <img key={i} src={url} alt="" className="w-full max-h-[200px] rounded-lg object-cover" />
//                         )
//                       )}
//                     </div>
//                   )}

//                   {p.type === "hottake" && (() => {
//                     const liveTotal = (p.agreeCount ?? 0) + (p.disagreeCount ?? 0);
//                     const agrPct = liveTotal > 0 ? Math.round(((p.agreeCount ?? 0) / liveTotal) * 100) : 50;
//                     const disAgrPct = 100 - agrPct;
//                     const userVote = p.userVote;
//                     const hasVoted = userVote === "agree" || userVote === "disagree";
//                     return (
//                       <div style={{ marginTop: 10, marginBottom: 4 }}>
//                         <div style={{ display: "flex", borderRadius: 999, overflow: "hidden", height: 5, background: "rgba(255,255,255,0.06)", marginBottom: 8 }}>
//                           <div style={{ width: `${agrPct}%`, background: "var(--accent-magenta)", transition: "width 0.4s ease" }} />
//                           <div style={{ width: `${disAgrPct}%`, background: "var(--accent-orange)", transition: "width 0.4s ease" }} />
//                         </div>
//                         <div style={{ display: "flex", gap: 8 }}>
//                           {[
//                             { agree: true, label: "Agree", pctVal: agrPct, active: userVote === "agree", color: "var(--accent-magenta)" },
//                             { agree: false, label: "Disagree", pctVal: disAgrPct, active: userVote === "disagree", color: "var(--accent-orange)" },
//                           ].map(({ agree, label, pctVal, active, color }) => (
//                             <motion.button
//                               key={label}
//                               whileTap={!hasVoted ? { scale: 0.93 } : {}}
//                               onClick={async (e) => {
//                                 e.stopPropagation();
//                                 if (hasVoted) return;
//                                 try {
//                                   await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: agree ? "agree" : "disagree" });
//                                   setPosts(prev => prev.map(x => x.id !== p.id ? x : {
//                                     ...x,
//                                     userVote: agree ? "agree" : "disagree",
//                                     agreeCount: (x.agreeCount ?? 0) + (agree ? 1 : 0),
//                                     disagreeCount: (x.disagreeCount ?? 0) + (!agree ? 1 : 0),
//                                   }));
//                                 } catch { onToast("Failed to submit vote"); }
//                               }}
//                               style={{
//                                 flex: 1, padding: "10px", borderRadius: 999, fontSize: 12, fontWeight: 700,
//                                 cursor: hasVoted ? "default" : "pointer",
//                                 border: `2.5px solid ${color}`,
//                                 background: active ? color : "rgba(255,255,255,0.02)",
//                                 color: active ? "white" : color,
//                                 boxShadow: active ? `0 0 16px ${color}60` : "none",
//                                 transition: "all 0.2s ease-in-out",
//                                 display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
//                                 opacity: hasVoted && !active ? 0.4 : 1,
//                               }}
//                             >
//                               {active ? `✓ ${agree ? "Agreed" : "Disagreed"}` : label}
//                               <span style={{ fontSize: 10, fontWeight: 800, background: active ? "rgba(255,255,255,0.2)" : `${color}22`, borderRadius: 999, padding: "1px 6px" }}>
//                                 {pctVal}%
//                               </span>
//                             </motion.button>
//                           ))}
//                         </div>
//                       </div>
//                     );
//                   })()}

//                   <div style={{ marginTop: 10 }}>
//                     <div className="flex gap-2 mb-2.5">
//                       {([
//                         { label: `🔥 ${p.fireCount}`, r: "fire" as const },
//                         { label: `❤️ ${p.heartCount || 0}`, r: "heart" as const },
//                       ] as const).map(({ label, r }) => (
//                         <motion.button
//                           key={r}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={e => {
//                             e.stopPropagation();
//                             if (r === "heart") {
//                               handleLike(p.id);
//                             } else {
//                               react(p.id, r);
//                             }
//                           }}
//                           className="px-3.5 py-1.5 text-xs font-semibold bg-[rgba(255,255,255,0.05)] rounded-full border border-[rgba(255,255,255,0.08)] text-[var(--text-primary)] cursor-pointer"
//                         >
//                           {label}
//                         </motion.button>
//                       ))}
//                     </div>

//                     <div style={{ display: "flex", gap: 16, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10 }}>
//                       <button
//                         onClick={e => { e.stopPropagation(); handleLike(p.id); }}
//                         style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: p.userLiked ? "#ff4a7d" : "#9494ad", fontSize: 13, fontWeight: 600 }}
//                       >
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill={p.userLiked ? "#ff4a7d" : "none"} stroke="currentColor" strokeWidth="2">
//                           <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
//                         </svg>
//                         <span>{p.heartCount || 0}</span>
//                       </button>

//                       <button
//                         onClick={e => { e.stopPropagation(); onPostClick?.({ id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo, createdAt: p.createdAt, type: p.type || "post", isDbPost: true, roomId, mediaUrls: p.mediaUrls, replyCount: p.replyCount }); }}
//                         style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#9494ad", fontSize: 13, fontWeight: 600 }}
//                       >
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                           <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//                         </svg>
//                         <span>{p.replyCount || 0}</span>
//                       </button>

//                       <button
//                         onClick={e => {
//                           e.stopPropagation();
//                           if (navigator.share) {
//                             navigator.share({ title: "ROAR", text: p.text, url: window.location.href });
//                           } else {
//                             navigator.clipboard.writeText(window.location.href);
//                             onToast("Link copied!");
//                           }
//                         }}
//                         style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#9494ad", fontSize: 13, fontWeight: 600 }}
//                       >
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                           <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
//                           <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
//                           <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
//                         </svg>
//                         <span>Share</span>
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })
//           )}
//         </AnimatePresence>
//       </div>

//       {/* ── CATEGORY PILLS ── */}
//       <div className="flex gap-1.5 py-1 px-2.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
//         {RADIAL_OPTS.map((q) => {
//           const isActive = q.id === selectedActionId;
//           return (
//             <button
//               key={q.id}
//               type="button"
//               onClick={() => {
//                 if (q.id === "post") {
//                   onCompose?.(q.id);
//                   setSelectedActionId("post");
//                   return;
//                 }
//                 setSelectedActionId(q.id);
//                 onCompose?.(q.id);
//                 setSelectedActionId("post");
//               }}
//               className={[
//                 "flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all duration-150 cursor-pointer shrink-0",
//                 isActive
//                   ? "border-[rgba(233,30,140,0.35)] bg-[rgba(233,30,140,0.12)]"
//                   : "border-transparent bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.6)]",
//               ].join(" ")}
//             >
//               {composeIconMap[q.id] || <span>{q.emoji}</span>}
//               {q.label}
//             </button>
//           );
//         })}
//       </div>

//       {/* ── COMPOSER ── */}
//       <div className="shrink-0 px-3 pt-2 pb-2 bg-[rgba(14,14,20,0.98)] backdrop-blur-[20px] border-t border-[var(--border)] flex flex-col gap-2">
//         {selectedActionId === "post" && (
//           <>
//             {attachedUrl && (
//               <div className="px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   {attachedType === "image"
//                     ? <img src={attachedUrl} className="w-10 h-10 rounded-lg object-cover" alt="Attached" />
//                     : <video src={attachedUrl} className="w-10 h-10 rounded-lg object-cover" />}
//                   <span className="text-xs text-[var(--text-secondary)]">Media attached</span>
//                 </div>
//                 <button type="button" onClick={() => { setAttachedUrl(null); setAttachedType(null); }} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">✕</button>
//               </div>
//             )}

//             <div className="flex gap-2 items-center">
//               <button
//                 type="button"
//                 onClick={() => triggerUpload("image")}
//                 disabled={uploading}
//                 className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer flex items-center p-1 shrink-0"
//               >
//                 <Image size={20} />
//               </button>

//               <div className="flex-1 relative">
//                 {input === "" && !uploading && (
//                   <div className="absolute left-4 top-0 bottom-0 flex items-center pointer-events-none">
//                     <span className="text-sm font-medium" style={{ color: MODE_COLOR["post"] || "var(--text-secondary)" }}>
//                       {PLACEHOLDER["post"]}
//                     </span>
//                   </div>
//                 )}
//                 <input
//                   type="text"
//                   disabled={uploading}
//                   value={input}
//                   onChange={e => setInput(e.target.value)}
//                   onKeyDown={e => e.key === "Enter" && send()}
//                   className="w-full h-11 rounded-[22px] bg-[var(--bg-secondary)] border border-[var(--border)] pl-4 pr-4 text-white text-base outline-none"
//                 />
//               </div>

//               <motion.button
//                 whileTap={{ scale: 0.96 }}
//                 onClick={send}
//                 disabled={uploading}
//                 className={[
//                   "w-11 h-11 rounded-full border-none text-white text-lg font-bold flex items-center justify-center cursor-pointer shrink-0",
//                   "bg-[linear-gradient(135deg,#e91e8c,#ff6b35)]",
//                   uploading ? "opacity-50" : "opacity-100",
//                 ].join(" ")}
//               >
//                 ↑
//               </motion.button>
//             </div>
//           </>
//         )}
//       </div>

//       <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
//     </div>
//   );
// }







import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AvatarWithBadge from "../components/AvatarWithBadge";
import { fmt } from "../utils";
import { RADIAL_OPTS } from "../constants";
import {
  Image, ChevronLeft, Flame, TrendingUp, Zap, History, PenTool,
  Brain, Users, CheckCircle2, XCircle,
  Share2, Send,
} from "lucide-react";

interface Props {
  onBack: () => void;
  onToast: (m: string) => void;
  roomId?: string;
  roomName?: string;
  onPostClick?: (post: any) => void;
  onCompose?: (type: string | null) => void;
  fanCount?: number;
  score?: string;
  scoreSubtitle?: string;
  currentAvatarUrl?: string;
  onRegisterRefresh?: (fn: () => void) => void;
  onRegisterReplyUpdate?: (fn: (postId: string, count: number) => void) => void;
  onFanProfile?: (fan: any) => void;
}

const MODE_COLOR: Record<string, string> = {
  post: "var(--text-primary)",
  prediction: "var(--gold)",
  hottake: "#f87171",
  debate: "#e91e8c",
  raw_reactions: "#00e8c6",
};

const MODES = [
  { key: "post" as const, label: "Post", icon: <PenTool size={13} />, color: "#ffffff", isAction: false },
  { key: "debate" as const, label: "Debate", icon: <Zap size={13} />, color: "#e91e8c", isAction: false },
  { key: "prediction" as const, label: "Predict", icon: <TrendingUp size={13} />, color: "#fbbf24", isAction: false },
  { key: "hottake" as const, label: "Hot Take", icon: <Flame size={13} />, color: "#f87171", isAction: false },
  { key: "raw_reactions" as const, label: "Raw Reactions", icon: <History size={13} />, color: "#00e8c6", isAction: false },
  { key: "quiz" as const, label: "Flash Quiz", icon: <Brain size={13} />, color: "#00e8c6", isAction: true },
];

const PLACEHOLDER: Record<string, string> = {
  post: "Drop your take...",
  debate: "My debate side: ",
  prediction: "My prediction: ",
  hottake: "Drop a hot take...",
  raw_reactions: "Share your raw reaction...",
};

const typeBadgeClass = (type: string) => {
  const base = "text-[9px] font-extrabold px-1.5 py-0.5 rounded";
  if (type === "prediction") return `${base} bg-[rgba(255,215,0,0.15)] text-[#fbbf24] border border-[rgba(255,215,0,0.25)]`;
  if (type === "post") return `${base} bg-[rgba(233,30,140,0.12)] text-[#E91E8C] border border-[rgba(233,30,140,0.2)]`;
  if (type === "hottake") return `${base} bg-[rgba(239,68,68,0.15)] text-[#f87171] border border-[rgba(239,68,68,0.25)]`;
  if (type === "debate") return `${base} bg-[rgba(233,30,140,0.15)] text-[#e91e8c] border border-[rgba(233,30,140,0.25)]`;
  if (type === "raw_reactions") return `${base} bg-[rgba(0,232,198,0.15)] text-[#00e8c6] border border-[rgba(0,232,198,0.25)]`;
  return `${base} bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] border border-[rgba(255,255,255,0.1)]`;
};

const postCardStyle = (type: string): React.CSSProperties => {
  if (type === "prediction") return { background: "linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,215,0,0.02))", border: "1px solid rgba(255,215,0,0.18)" };
  if (type === "hottake") return { background: "linear-gradient(135deg,rgba(239,68,68,0.08),rgba(239,68,68,0.02))", border: "1px solid rgba(239,68,68,0.18)" };
  if (type === "debate") return { background: "linear-gradient(135deg,rgba(233,30,140,0.08),rgba(233,30,140,0.02))", border: "1px solid rgba(233,30,140,0.18)" };
  if (type === "raw_reactions") return { background: "linear-gradient(135deg,rgba(0,232,198,0.08),rgba(0,232,198,0.02))", border: "1px solid rgba(0,232,198,0.18)" };
  return {};
};

// ── InlineCommentInput ────────────────────────────────────────────────────────
// Slides in after voting on debate/prediction. Calls same API as
// RoomPostDetailsOverlay: POST /api/roar/posts/${postId}/comments with roomId.
// The comment icon (MessageSquare) still opens RoomPostDetailsOverlay unchanged.
interface InlineCommentInputProps {
  postId: string;
  roomId: string;
  onSubmit: (postId: string, text: string) => Promise<void>;
  onOpenFull: () => void;
  accentColor?: string;
  placeholder?: string;
}

function InlineCommentInput({
  postId, roomId, onSubmit, onOpenFull,
  accentColor = "#e91e8c",
  placeholder = "Add your take...",
}: InlineCommentInputProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 120);
  }, []);

  const handleSend = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try { await onSubmit(postId, trimmed); setText(""); }
    finally { setSending(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: "auto", marginTop: 10 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ overflow: "hidden" }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "8px 10px", borderRadius: 16,
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${accentColor}40`,
      }}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSend(e as any); }}
          placeholder={placeholder}
          style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 13, fontWeight: 500 }}
        />
        {/* "All" → opens RoomPostDetailsOverlay, same as comment icon */}
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onOpenFull(); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", padding: "0 2px" }}
        >
          All
        </button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={handleSend}
          disabled={!text.trim() || sending}
          style={{
            background: text.trim() ? `linear-gradient(135deg,${accentColor},#ff6b35)` : "rgba(255,255,255,0.08)",
            border: "none", borderRadius: "50%", width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: text.trim() ? "pointer" : "default",
            transition: "background 0.2s", flexShrink: 0,
          }}
        >
          <Send size={14} color={text.trim() ? "#fff" : "rgba(255,255,255,0.3)"} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── QuizCard ─────────────────────────────────────────────────────────────────
interface QuizCardProps {
  post: any;
  onToast: (m: string) => void;
  onPostClick?: (post: any) => void;
  roomId?: string;
  onFanProfile?: (fan: any) => void;
}

type ShareableRoarPost = {
  id?: string | number;
  text?: string;
  authorUsername?: string;
  fan?: { username?: string };
};

const buildRoarPostShareUrl = (post: ShareableRoarPost) => {
  if (typeof window === "undefined") return "";
  const targetUrl = new URL(`${window.location.origin}/MainModules/ROAR`);
  if (post?.id) targetUrl.searchParams.set("post", String(post.id));
  return targetUrl.toString();
};

const buildRoarPostShareText = (post: ShareableRoarPost) => {
  const shareUrl = buildRoarPostShareUrl(post);
  const author = post?.fan?.username || post?.authorUsername || "a Sportsfan";
  return [`Check out this ROAR post by ${author}`, post?.text || "Join the conversation on Sportsfan ROAR.", `View post: ${shareUrl}`].filter(Boolean).join("\n");
};

function QuizCard({ post, onToast, onPostClick, roomId, onFanProfile }: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(post.quizUserAnswer ?? null);
  const [revealedCorrect, setRevealedCorrect] = useState<string | null>(post.quizCorrectOption ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [participants, setParticipants] = useState<number>(post.quizParticipants ?? 0);
  const hasAnswered = selectedOption !== null;
  const quizOptions: { label: string; text: string }[] = post.quizOptions ?? [];

  const handleOptionClick = useCallback(async (label: string) => {
    if (hasAnswered || submitting) return;
    setSubmitting(true); setSelectedOption(label);
    try {
      const res = await axios.post(`/api/roar/posts/${post.id}/quiz-answer`, { selectedOption: label });
      if (res.data?.success || res.data?.message === "Already answered") {
        setRevealedCorrect(res.data.correctOption);
        setParticipants(res.data.quizParticipants ?? participants + 1);
        if (res.data.isCorrect) onToast("✅ Correct! +2 points awarded");
        else onToast(`❌ Wrong! Correct answer was ${res.data.correctOption}`);
      }
    } catch { setSelectedOption(null); onToast("Failed to submit answer"); }
    finally { setSubmitting(false); }
  }, [hasAnswered, submitting, post.id, participants, onToast]);

  const getOptionStyle = (label: string): React.CSSProperties => {
    const isSelected = selectedOption === label;
    const isCorrect = revealedCorrect === label;
    const isWrong = hasAnswered && isSelected && revealedCorrect !== null && !isCorrect;
    if (!hasAnswered) return { padding: "11px 14px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 10, cursor: submitting ? "not-allowed" : "pointer", transition: "all 0.18s", opacity: submitting ? 0.6 : 1 };
    if (isCorrect) return { padding: "11px 14px", borderRadius: 14, background: "rgba(0,232,198,0.12)", border: "1px solid rgba(0,232,198,0.4)", display: "flex", alignItems: "center", gap: 10, cursor: "default", transition: "all 0.18s" };
    if (isWrong) return { padding: "11px 14px", borderRadius: 14, background: "rgba(244,67,54,0.1)", border: "1px solid rgba(244,67,54,0.35)", display: "flex", alignItems: "center", gap: 10, cursor: "default", transition: "all 0.18s" };
    return { padding: "11px 14px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 10, cursor: "default", opacity: 0.45, transition: "all 0.18s" };
  };

  const getLabelColor = (label: string) => {
    if (!hasAnswered) return "#4A4A62";
    if (revealedCorrect === label) return "#00E8C6";
    if (selectedOption === label && revealedCorrect !== label) return "#F44336";
    return "#4A4A62";
  };

  return (
    <div className="glass-card" style={{ padding: "16px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#E91E8C,#FF6B35,#00E8C6)", borderRadius: "28px 28px 0 0" }} />
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: "rgba(0,232,198,0.12)", color: "#00E8C6", border: "1px solid rgba(0,232,198,0.25)" }}>🧠 Flash Quiz</span>
        {hasAnswered && revealedCorrect && <span style={{ fontSize: 10, fontWeight: 700, marginLeft: "auto", color: selectedOption === revealedCorrect ? "#00E8C6" : "#F44336" }}>{selectedOption === revealedCorrect ? "✓ Correct!" : "✗ Wrong"}</span>}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onFanProfile?.(post.fan); }}>
        <AvatarWithBadge username={post.fan.username} badge={post.fan.badge} size="sm" avatarUrl={post.fan.avatarUrl} />
        <div><p style={{ fontWeight: 700, fontSize: 13 }}>{post.fan.username}</p><p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{post.timeAgo}</p></div>
      </div>
      <p style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.5, marginBottom: 14, color: "#F5F5FA", cursor: "pointer" }} onClick={() => onPostClick && onPostClick(post)}>{post.quizQuestion || post.text}</p>
      {quizOptions.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {quizOptions.map((opt) => {
            const isCorrect = hasAnswered && revealedCorrect === opt.label;
            const isWrong = hasAnswered && selectedOption === opt.label && revealedCorrect !== opt.label && revealedCorrect !== null;
            return (
              <motion.div key={opt.label} whileTap={!hasAnswered && !submitting ? { scale: 0.97 } : {}} style={getOptionStyle(opt.label)} onClick={(e) => { e.stopPropagation(); handleOptionClick(opt.label); }}>
                <span style={{ fontSize: 11, fontWeight: 800, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em", color: getLabelColor(opt.label), minWidth: 14, flexShrink: 0 }}>{opt.label}</span>
                {hasAnswered && isCorrect && <CheckCircle2 size={13} color="#00E8C6" style={{ flexShrink: 0 }} />}
                {hasAnswered && isWrong && <XCircle size={13} color="#F44336" style={{ flexShrink: 0 }} />}
                <span style={{ fontSize: 12, fontWeight: 500, color: isCorrect ? "#00E8C6" : isWrong ? "#F44336" : hasAnswered ? "rgba(255,255,255,0.35)" : "#9494AD", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{opt.text || `Option ${opt.label}`}</span>
              </motion.div>
            );
          })}
        </div>
      )}
      {!hasAnswered && <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontStyle: "italic" }}>Tap an option to answer</p>}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Users size={13} color="#9494AD" />
        <span style={{ fontSize: 12, fontWeight: 600, color: "#9494AD" }}>{participants > 0 ? `${participants.toLocaleString()} fan${participants === 1 ? "" : "s"} participated` : "Be the first to answer!"}</span>
      </div>
    </div>
  );
}

// ── Main DiscussionRoom ───────────────────────────────────────────────────────

export default function DiscussionRoom({
  onBack, onToast, roomId, roomName, onPostClick, onCompose,
  fanCount = 312, score, scoreSubtitle, currentAvatarUrl, onRegisterRefresh, onRegisterReplyUpdate,
  onFanProfile,
}: Props) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"post" | "debate" | "prediction" | "hottake" | "raw_reactions">("post");
  const [uploading, setUploading] = useState(false);
  const [attachedUrl, setAttachedUrl] = useState<string | null>(null);
  const [attachedType, setAttachedType] = useState<"image" | "video" | null>(null);
  const [userUsername, setUserUsername] = useState("RoarUser");
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(currentAvatarUrl);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState("post");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [liveCount, setLiveCount] = useState<number>(fanCount ?? 0);
  const [sharePost, setSharePost] = useState<ShareableRoarPost | null>(null);
  const [copied, setCopied] = useState(false);

  // Which post id has the inline comment box open (null = none)
  const [inlineCommentPostId, setInlineCommentPostId] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingLikes = useRef<Set<string>>(new Set());

  const openShareDialog = (post: ShareableRoarPost) => { 
    setSharePost(post); 
    setCopied(false); 
    try { posthog.capture("content_shared", { post_id: post.id }); } catch(e) {}
  };
  const closeShareDialog = () => { setSharePost(null); setCopied(false); };
  const handleShareToWhatsApp = () => { if (!sharePost) return; window.open(`https://wa.me/?text=${encodeURIComponent(buildRoarPostShareText(sharePost))}`, "_blank"); };
  const handleShareToThreads = () => { if (!sharePost) return; window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(buildRoarPostShareText(sharePost))}`, "_blank"); };
  const handleShareToInstagram = async () => { if (!sharePost) return; await copyToClipboard(buildRoarPostShareText(sharePost)); setCopied(true); setTimeout(() => setCopied(false), 1600); window.open("https://www.instagram.com/", "_blank"); };
  const handleShareToLinkedIn = () => { if (!sharePost) return; window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(buildRoarPostShareUrl(sharePost))}`, "_blank"); };
  const handleShareToX = () => { if (!sharePost) return; window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(buildRoarPostShareText(sharePost))}`, "_blank"); };
  const handleCopyLink = async () => {
    if (!sharePost) return;
    const ok = await copyToClipboard(buildRoarPostShareText(sharePost));
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1600); onToast("Link copied to clipboard!"); }
  };

  const shareButtons = (size: string) => (
    <>
      {[
        { handler: handleShareToWhatsApp, src: "/images/share_whatsapp.png", alt: "WhatsApp" },
        { handler: handleShareToThreads, src: "/images/share_thread.png", alt: "Threads" },
        { handler: handleShareToInstagram, src: "/images/share_insta.png", alt: "Instagram" },
        { handler: handleShareToLinkedIn, src: "/images/Share_linkedin.png", alt: "LinkedIn" },
        { handler: handleShareToX, src: "/images/Share_X.png", alt: "X" },
        { handler: handleCopyLink, src: "/images/share_copy_link.png", alt: "Copy" },
      ].map(({ handler, src, alt }) => (
        <button key={alt} onClick={handler} className={`${size} shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center`} type="button">
          <img src={src} alt={alt} width={36} height={36} className="w-full h-full object-cover rounded-full" />
        </button>
      ))}
    </>
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const join = async () => {
      try { const res = await axios.post(`/api/roar/rooms/${roomId}/presence`); if (res.data?.success) setLiveCount(res.data.fanCount); } catch (e) { console.error("Join failed:", e); }
    };
    const leaveBeacon = () => { navigator.sendBeacon(`/api/roar/rooms/${roomId}/presence/leave`); };
    const leaveAxios = () => { axios.delete(`/api/roar/rooms/${roomId}/presence`).catch(() => {}); };
    join();
    window.addEventListener("beforeunload", leaveBeacon);
    return () => { leaveAxios(); window.removeEventListener("beforeunload", leaveBeacon); };
  }, [roomId]);

  useEffect(() => {
    try {
      setUserUsername(localStorage.getItem("roar_username") || "RoarUser");
      setUserAvatarUrl(currentAvatarUrl || localStorage.getItem("roar_avatar_url") || undefined);
    } catch {}
  }, [currentAvatarUrl]);

  const fetchMsgs = useCallback(async () => {
    if (!roomId) return;
    try {
      const res = await axios.get(`/api/roar/rooms/${roomId}/messages?t=${Date.now()}`);
      if (res.data?.success) {
        setPosts(prev => {
          const prevMap = Object.fromEntries(prev.map(p => [p.id, p]));
          return [...res.data.messages]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((m: any) => {
              const existing = prevMap[m.msgId];
              const isPending = pendingLikes.current.has(m.msgId);
              return {
                id: m.msgId,
                fan: { username: m.authorUsername, badge: m.authorBadge, avatarUrl: m.authorAvatarUrl || m.avatarUrl || (m.authorUsername === userUsername ? userAvatarUrl : undefined) },
                text: m.text,
                fireCount: m.fireCount || 0,
                nochanceCount: m.noChanceCount || 0,
                heartCount: isPending ? (existing?.heartCount ?? m.heartCount ?? 0) : (m.heartCount ?? 0),
                userLiked: isPending ? (existing?.userLiked ?? false) : (m.userLiked ?? existing?.userLiked ?? false),
                replyCount: Math.max(m.replyCount ?? 0, existing?.replyCount ?? 0),
                agreeCount: m.agreeCount ?? 0,
                disagreeCount: m.disagreeCount ?? 0,
                userVote: m.userVote ?? null,
                sideA: m.sideA ?? null,
                sideB: m.sideB ?? null,
                timeAgo: new Date(m.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }) + " · " + new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                createdAt: m.createdAt,
                type: m.type,
                mediaUrls: m.mediaUrls,
                quizQuestion: m.quizQuestion,
                quizOptions: m.quizOptions,
                quizCorrectOption: m.quizCorrectOption,
                quizUserAnswer: m.quizUserAnswer ?? null,
                quizTimer: m.quizTimer,
                quizPoints: m.quizPoints,
                quizParticipants: m.quizParticipants ?? 0,
                memGifUrl: m.memGifUrl ?? null,
                memTag: m.memTag ?? null,
              };
            });
        });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [roomId, userAvatarUrl, userUsername]);

  useEffect(() => { onRegisterRefresh?.(fetchMsgs); }, [fetchMsgs, onRegisterRefresh]);
  useEffect(() => { onRegisterReplyUpdate?.((postId, count) => { setPosts(p => p.map(x => x.id === postId ? { ...x, replyCount: count } : x)); }); }, [onRegisterReplyUpdate]);
  useEffect(() => { if (!roomId) return; fetchMsgs(); const iv = setInterval(fetchMsgs, 3000); return () => clearInterval(iv); }, [fetchMsgs, roomId]);
  useEffect(() => { if (!loading && listRef.current) setTimeout(() => listRef.current?.scrollTo({ top: 0 }), 50); }, [loading]);

  // ── Inline comment submit (same API as RoomPostDetailsOverlay) ──────────────
  const handleInlineCommentSubmit = async (postId: string, text: string) => {
    try {
      // Identical to RoomPostDetailsOverlay's submitComment:
      // POST /api/roar/posts/${postId}/comments  with { text, roomId }
      const res = await axios.post(`/api/roar/posts/${postId}/comments`, {
        text,
        roomId,
      });
      if (res.data?.success) {
        onToast("💬 Comment posted!");
        // bump local reply count so the comment icon counter updates immediately
        setPosts(p => p.map(x => x.id === postId ? { ...x, replyCount: (x.replyCount || 0) + 1 } : x));
      } else {
        onToast("Failed to post comment");
      }
    } catch {
      onToast("Failed to post comment");
    }
    setInlineCommentPostId(null);
  };

  const triggerUpload = (type: "image" | "video") => {
    setAttachedType(type);
    if (fileInputRef.current) { fileInputRef.current.accept = type === "image" ? "image/*" : "video/*"; fileInputRef.current.click(); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      setUploading(true); onToast("Uploading media...");
      const fd = new FormData(); fd.append("file", file);
      const res = await axios.post("/api/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data?.url) { setAttachedUrl(res.data.url); onToast("Media uploaded!"); }
    } catch { onToast("Upload failed"); setAttachedType(null); }
    finally { setUploading(false); if (e.target) e.target.value = ""; }
  };

  const send = async () => {
    if (!roomId) return;
    const text = input.trim();
    if (!text && !attachedUrl) return;
    try {
      const res = await axios.post(`/api/roar/rooms/${roomId}/messages`, { text: text || "Shared media", type: mode, mediaUrls: attachedUrl ? [attachedUrl] : undefined });
      if (res.data?.success) {
        const m = res.data.message;
        setPosts(p => [{
          id: m.msgId,
          fan: { username: m.authorUsername, badge: m.authorBadge, avatarUrl: m.authorAvatarUrl || m.avatarUrl || (m.authorUsername === userUsername ? userAvatarUrl : undefined) },
          text: m.text, fireCount: 0, nochanceCount: 0, heartCount: 0, userLiked: false, replyCount: 0,
          agreeCount: 0, disagreeCount: 0, userVote: null, sideA: m.sideA ?? null, sideB: m.sideB ?? null,
          timeAgo: "now", createdAt: m.createdAt || Date.now(), type: m.type, mediaUrls: m.mediaUrls,
          quizQuestion: m.quizQuestion, quizOptions: m.quizOptions, quizCorrectOption: m.quizCorrectOption,
          quizUserAnswer: m.quizUserAnswer ?? null, quizTimer: m.quizTimer, quizPoints: m.quizPoints,
          quizParticipants: m.quizParticipants ?? 0, memGifUrl: m.memGifUrl ?? null, memTag: m.memTag ?? null,
        }, ...p]);
        setInput(""); setAttachedUrl(null); setAttachedType(null);
        setTimeout(() => listRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 50);
      }
    } catch { onToast("Failed to send message"); }
  };

  const react = async (id: string, reaction: "fire" | "noChance") => {
    if (!roomId) return;
    setPosts(p => p.map(x => x.id !== id ? x : reaction === "fire" ? { ...x, fireCount: x.fireCount + 1 } : { ...x, nochanceCount: x.nochanceCount + 1 }));
    try { await axios.post(`/api/roar/rooms/${roomId}/messages/${id}/react`, { reaction }); }
    catch { setPosts(p => p.map(x => x.id !== id ? x : reaction === "fire" ? { ...x, fireCount: Math.max(0, x.fireCount - 1) } : { ...x, nochanceCount: Math.max(0, x.nochanceCount - 1) })); }
  };

  const handleLike = async (id: string) => {
    if (!roomId) return;
    const prev = posts.find(x => x.id === id); if (!prev) return;
    const wasLiked = prev.userLiked ?? false;
    pendingLikes.current.add(id);
    setPosts(p => p.map(x => x.id !== id ? x : { ...x, userLiked: !wasLiked, heartCount: wasLiked ? Math.max(0, (x.heartCount || 0) - 1) : (x.heartCount || 0) + 1 }));
    try {
      const res = await axios.post(`/api/roar/rooms/${roomId}/messages/${id}/react`, { reaction: "heart" });
      if (res.data?.heartCount !== undefined) setPosts(p => p.map(x => x.id !== id ? x : { ...x, heartCount: res.data.heartCount }));
    } catch {
      setPosts(p => p.map(x => x.id !== id ? x : { ...x, userLiked: wasLiked, heartCount: prev.heartCount }));
      onToast("Failed to update like");
    } finally { setTimeout(() => pendingLikes.current.delete(id), 3000); }
  };

  const copyToClipboard = async (text: string) => {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      try {
        const input = document.createElement("textarea");
        input.value = text; input.style.position = "fixed"; input.style.opacity = "0";
        document.body.appendChild(input); input.focus(); input.select();
        const ok = document.execCommand("copy"); document.body.removeChild(input); return ok;
      } catch { return false; }
    }
  };

  const handleBack = (e: React.PointerEvent | React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); onBack(); };
  const shareRoomLink = () => {
    if (typeof navigator !== "undefined" && navigator.share) navigator.share({ title: "SF360 Infinity Room", url: window.location.href });
    else { copyToClipboard(window.location.href); onToast("Link copied!"); }
  };

  const composeIconMap: Record<string, React.ReactNode> = {
    hot_take: <Flame size={13} stroke="url(#dr-pink-orange-grad)" fill="url(#dr-pink-orange-grad)" />,
    prediction: <TrendingUp size={13} stroke="url(#dr-pink-orange-grad)" />,
    debate: <Zap size={13} stroke="url(#dr-pink-orange-grad)" fill="url(#dr-pink-orange-grad)" />,
    memory: <History size={13} stroke="url(#dr-pink-orange-grad)" />,
    post: <PenTool size={13} stroke="url(#dr-pink-orange-grad)" />,
    quiz: <Brain size={13} stroke="url(#dr-pink-orange-grad)" />,
  };

  return (
    <div className="flex flex-col w-full bg-[#0e0e14]" style={{ height: "100%", overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <linearGradient id="dr-pink-orange-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e91e8c" />
          <stop offset="100%" stopColor="#ff6b35" />
        </linearGradient>
      </svg>

      {/* Share dialog */}
      {sharePost && (
        <>
          <button type="button" className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={closeShareDialog} />
          <div className="fixed bottom-16 inset-x-4 z-50 mx-auto w-full max-w-[280px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl lg:hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm font-semibold">Share</p>
              <button type="button" onClick={closeShareDialog} className="text-gray-400 hover:text-white"><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
            </div>
            <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 overflow-x-auto">{shareButtons("w-8 h-8")}</div>
            {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
          </div>
          <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/60" onClick={closeShareDialog}>
            <div className="bg-[#1a1a1e] rounded-2xl border border-white/10 p-4 w-[300px] shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm font-semibold">Share ROAR Post</p>
                <button type="button" onClick={closeShareDialog} className="text-gray-400 hover:text-white"><svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#111114] p-3 mb-3">
                <p className="text-white text-sm font-semibold line-clamp-2">{sharePost.text || "ROAR Post"}</p>
                <p className="text-white/45 text-[11px] mt-2 line-clamp-2 break-all">{buildRoarPostShareUrl(sharePost)}</p>
              </div>
              <div className="flex flex-row flex-nowrap items-center gap-2 mb-2">{shareButtons("w-9 h-9")}</div>
              {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
            </div>
          </div>
        </>
      )}

      {/* ── HEADER ── */}
      <div className="shrink-0 px-4 py-3 bg-[rgba(14,14,20,0.98)] backdrop-blur-[20px] border-b border-[var(--border)]" style={{ overflow: "visible", position: "relative", zIndex: 40 }}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button type="button" onPointerDown={handleBack} onClick={handleBack} className="bg-transparent border-none cursor-pointer text-white flex items-center p-0 flex-shrink-0" style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
              <ChevronLeft size={24} />
            </button>
            <div className="text-left pt-0.5 flex-1 min-w-0">
              <p className="font-display text-2xl tracking-[0.04em] m-0 leading-tight text-white font-extrabold uppercase truncate">{roomName || "WORLDCUP"}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="live-pulse w-1.5 h-1.5 rounded-full bg-[var(--live-green)] inline-block flex-shrink-0" />
                <span className="text-[10px] font-bold text-[var(--live-green)] flex-shrink-0">LIVE</span>
                <span className="text-[11px] text-white text-[var(--text-muted)] truncate">· {fmt(liveCount)} joined</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button type="button" onClick={shareRoomLink} className="flex-shrink-0 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] rounded-[10px] p-2 cursor-pointer text-[rgba(255,255,255,0.75)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] transition-colors" style={{ width: "36px", height: "36px" }}>
              <Share2 size={18} />
            </button>
            {(score || scoreSubtitle) && (
              <div className="text-right pr-1 flex-shrink-0">
                {score && <div className="font-display text-[24px] text-[var(--accent-yellow)] leading-none">{score}</div>}
                {scoreSubtitle && <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">{scoreSubtitle}</div>}
              </div>
            )}
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1"><span>Room Energy</span></div>
          <div className="room-energy-bar room-energy-fast rounded-full" />
        </div>
      </div>

      {/* ── FEED ── */}
      <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 flex flex-col gap-3 min-h-0">
        <AnimatePresence initial={false}>
          {loading ? (
            <div className="text-center text-[var(--text-muted)] py-8">Loading messages...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-[var(--text-muted)] py-8">No posts yet. Be the first!</div>
          ) : (
            posts.map((p) => {

              /* ── QUIZ ── */
              if (p.type === "quiz") {
                return (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
                    <QuizCard post={p} onToast={onToast} onPostClick={onPostClick} roomId={roomId} onFanProfile={onFanProfile} />
                  </motion.div>
                );
              }

              /* ── DEBATE ── */
              if (p.type === "debate") {
                const liveTotal = (p.agreeCount ?? 0) + (p.disagreeCount ?? 0);
                const agrPct = liveTotal > 0 ? Math.round(((p.agreeCount ?? 0) / liveTotal) * 100) : 50;
                const disAgrPct = 100 - agrPct;
                const userVote = p.userVote;
                const hasVoted = userVote === "agree" || userVote === "disagree";
                const displayVotedA = userVote === "agree";
                const displayVotedB = userVote === "disagree";
                const rawText = p.text ?? "";
                const vsParts = rawText.split(" VS ");
                const hasSides = !!(p.sideA || p.sideB);
                const sideA = p.sideA || vsParts[0] || "Side A";
                const sideB = p.sideB || vsParts[1] || "Side B";
                const questionText = hasSides ? rawText : null;

                return (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="glass-card p-4 cursor-pointer"
                    style={{ background: "linear-gradient(135deg,rgba(233,30,140,0.08),rgba(233,30,140,0.02))", border: "1px solid rgba(233,30,140,0.18)" }}
                    onClick={() => onPostClick?.({ id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo, createdAt: p.createdAt, type: "debate", isDbPost: true, roomId, mediaUrls: p.mediaUrls, sideA, sideB })}
                  >
                    <div style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: "rgba(233,30,140,0.12)", color: "#e91e8c", border: "1px solid rgba(233,30,140,0.25)" }}>⚡ Debate</span>
                      {hasVoted && <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "rgba(233,30,140,0.08)", color: "#e91e8c", border: "1px solid rgba(233,30,140,0.2)" }}>🗳️ Voted</span>}
                    </div>
                    <div className="flex gap-2 items-center mb-2.5 cursor-pointer" onClick={(e) => { e.stopPropagation(); onFanProfile?.(p.fan); }}>
                      <AvatarWithBadge username={p.fan.username} badge={p.fan.badge} size="sm" avatarUrl={p.fan.avatarUrl} />
                      <div><p className="font-bold text-[13px]">{p.fan.username}</p><p className="text-[10px] text-[var(--text-muted)]">{p.timeAgo}</p></div>
                    </div>
                    {questionText && <p style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, marginBottom: 12, color: "var(--text-primary)" }}>{questionText}</p>}
                    <div style={{ display: "flex", gap: 8, alignItems: "stretch", marginBottom: 10 }}>
                      {[
                        { label: sideA, voted: displayVotedA, color: "var(--accent-magenta)", bg: "rgba(233,30,140,0.08)", border: "rgba(233,30,140,0.3)", voteVal: "agree" as const },
                        { label: sideB, voted: displayVotedB, color: "#60a5fa", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.3)", voteVal: "disagree" as const },
                      ].map(({ label, voted, color, bg, border, voteVal }, idx) => (
                        <>
                          {idx === 1 && <div key="vs" style={{ display: "flex", alignItems: "center", padding: "0 4px" }}><span className="font-display" style={{ fontSize: 16, color: "var(--text-muted)" }}>VS</span></div>}
                          <motion.button key={voteVal} whileTap={!hasVoted ? { scale: 0.96 } : {}}
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (hasVoted) return;
                              try {
                                await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: voteVal });
                                setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: voteVal, agreeCount: (x.agreeCount ?? 0) + (voteVal === "agree" ? 1 : 0), disagreeCount: (x.disagreeCount ?? 0) + (voteVal === "disagree" ? 1 : 0) }));
                                // open inline comment box
                                setInlineCommentPostId(p.id);
                              } catch { onToast("You've already voted!!"); }
                            }}
                            disabled={hasVoted}
                            style={{ flex: 1, padding: "12px", borderRadius: 14, textAlign: "center", background: voted ? color : bg, border: `2px solid ${voted ? color : border}`, color: voted ? "white" : "var(--text-primary)", cursor: hasVoted ? "not-allowed" : "pointer", transition: "all 0.2s", opacity: hasVoted && !voted ? 0.35 : 1 }}
                          >
                            <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{voted ? "✓ " : ""}{label}</p>
                          </motion.button>
                        </>
                      ))}
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", borderRadius: 999, overflow: "hidden", height: 6, background: "rgba(255,255,255,0.06)" }}>
                        <div style={{ width: `${agrPct}%`, background: "var(--accent-magenta)", transition: "width 0.4s ease" }} />
                        <div style={{ width: `${disAgrPct}%`, background: "#60a5fa", transition: "width 0.4s ease" }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-magenta)" }}>{agrPct}%</span>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{liveTotal} vote{liveTotal !== 1 ? "s" : ""}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa" }}>{disAgrPct}%</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 11, fontWeight: hasVoted ? 600 : 400, color: hasVoted ? "var(--accent-magenta)" : "var(--text-muted)", marginBottom: 8, fontStyle: hasVoted ? "normal" : "italic" }}>
                      {hasVoted ? "🗳️ You've already voted · thanks for joining the debate!" : "Tap a side to vote · results reveal after voting"}
                    </p>
                    {/* ── Inline comment box after voting on debate ── */}
                    <AnimatePresence>
                      {inlineCommentPostId === p.id && (
                        <InlineCommentInput
                          key={`ic-${p.id}`}
                          postId={p.id}
                          roomId={roomId!}
                          onSubmit={handleInlineCommentSubmit}
                          onOpenFull={() => {
                            setInlineCommentPostId(null);
                            onPostClick?.({ id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo, createdAt: p.createdAt, type: "debate", isDbPost: true, roomId, mediaUrls: p.mediaUrls, sideA, sideB });
                          }}
                          accentColor="#e91e8c"
                          placeholder="Share your thoughts on this debate..."
                        />
                      )}
                    </AnimatePresence>
                    <div style={{ marginTop: 2 }}>
                      <div style={{ display: "flex", gap: 16, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10 }}>
                        <button onClick={e => { e.stopPropagation(); handleLike(p.id); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: p.userLiked ? "#ff4a7d" : "#9494ad", fontSize: 13, fontWeight: 600 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={p.userLiked ? "#ff4a7d" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                          <span>{p.heartCount || 0}</span>
                        </button>
                        {/* Comment icon → still opens RoomPostDetailsOverlay */}
                        <button onClick={e => { e.stopPropagation(); onPostClick?.({ id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo, createdAt: p.createdAt, type: "debate", isDbPost: true, roomId, mediaUrls: p.mediaUrls, sideA, sideB }); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#9494ad", fontSize: 13, fontWeight: 600 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                          <span>{p.replyCount || 0}</span>
                        </button>
                        <button onClick={e => { e.stopPropagation(); openShareDialog(p); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#9494ad", fontSize: 13, fontWeight: 600 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              /* ── DEFAULT (post / hottake / prediction / raw_reactions) ── */
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="glass-card p-3 cursor-pointer" style={postCardStyle(p.type)}
                  onClick={() => onPostClick?.({ id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo, createdAt: p.createdAt, type: p.type || "post", isDbPost: true, roomId, mediaUrls: p.mediaUrls })}
                >
                  <div className="flex justify-between items-center cursor-pointer" onClick={(e) => { e.stopPropagation(); onFanProfile?.(p.fan); }}>
                    <div className="flex gap-2 items-center">
                      <AvatarWithBadge username={p.fan.username} badge={p.fan.badge} size="sm" avatarUrl={p.fan.avatarUrl} />
                      <div><p className="font-bold text-[13px]">{p.fan.username}</p><p className="text-[10px] text-[var(--text-muted)]">{p.timeAgo}</p></div>
                    </div>
                    {p.type && (
                      <span className={typeBadgeClass(p.type)}>
                        {p.type === "post" ? "✏️ POST" : p.type === "hottake" ? "🔥 HOT TAKE" : p.type === "prediction" ? "📊 PREDICT" : p.type === "debate" ? "⚡ DEBATE" : p.type === "raw_reactions" ? "🕰 Raw REACTIONS" : p.type.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-snug mt-2" style={{ color: MODE_COLOR[p.type] || "white" }}>{p.text}</p>
                  {p.type === "raw_reactions" && p.memGifUrl && <img src={p.memGifUrl} alt="reaction gif" style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 12, marginTop: 8 }} />}
                  {p.type === "raw_reactions" && p.memTag && <span style={{ display: "inline-block", marginTop: 8, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "rgba(0,232,198,0.12)", color: "#00e8c6", border: "1px solid rgba(0,232,198,0.3)", letterSpacing: "0.04em" }}>#{p.memTag}</span>}

                  {p.type === "prediction" && (() => {
                    const liveTotal = (p.agreeCount ?? 0) + (p.disagreeCount ?? 0);
                    const agrPct = liveTotal > 0 ? Math.round(((p.agreeCount ?? 0) / liveTotal) * 100) : 50;
                    const disAgrPct = 100 - agrPct;
                    const userVote = p.userVote;
                    const hasVoted = userVote === "agree" || userVote === "disagree";
                    return (
                      <>
                        <div style={{ display: "flex", gap: 8, marginTop: 10, marginBottom: 4 }}>
                          {[
                            { agree: true, label: "Support", pctVal: agrPct, active: userVote === "agree", color: "#22c55e" },
                            { agree: false, label: "Counter", pctVal: disAgrPct, active: userVote === "disagree", color: "var(--accent-magenta)" },
                          ].map(({ agree, label, pctVal, active, color }) => (
                            <motion.button key={label} whileTap={!hasVoted ? { scale: 0.93 } : {}}
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (hasVoted) return;
                                try {
                                  await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: agree ? "agree" : "disagree" });
                                  setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: agree ? "agree" : "disagree", agreeCount: (x.agreeCount ?? 0) + (agree ? 1 : 0), disagreeCount: (x.disagreeCount ?? 0) + (!agree ? 1 : 0) }));
                                  // open inline comment box
                                  setInlineCommentPostId(p.id);
                                } catch { onToast("You've already voted!!"); }
                              }}
                              style={{ flex: 1, padding: "9px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: hasVoted ? "default" : "pointer", border: `2px solid ${color}`, background: active ? color : "rgba(255,255,255,0.02)", color: active ? "white" : color, boxShadow: active ? `0 0 14px ${color}50` : "none", transition: "all 0.2s ease-in-out", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: hasVoted && !active ? 0.4 : 1 }}
                            >
                              {active ? `✓ ${agree ? "Supported" : "Countered"}` : label}
                              <span style={{ fontSize: 10, fontWeight: 800, background: active ? "rgba(255,255,255,0.2)" : `${color}22`, borderRadius: 999, padding: "1px 6px" }}>{pctVal}%</span>
                            </motion.button>
                          ))}
                        </div>
                        {/* ── Inline comment box after voting on prediction ── */}
                        <AnimatePresence>
                          {inlineCommentPostId === p.id && (
                            <InlineCommentInput
                              key={`ic-${p.id}`}
                              postId={p.id}
                              roomId={roomId!}
                              onSubmit={handleInlineCommentSubmit}
                              onOpenFull={() => {
                                setInlineCommentPostId(null);
                                onPostClick?.({ id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo, createdAt: p.createdAt, type: p.type, isDbPost: true, roomId, mediaUrls: p.mediaUrls });
                              }}
                              accentColor="#22c55e"
                              placeholder="Share your thoughts on this..."
                            />
                          )}
                        </AnimatePresence>
                      </>
                    );
                  })()}

                  {p.mediaUrls?.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                      {p.mediaUrls.map((url: string, i: number) =>
                        url.endsWith(".mp4") || url.includes("/video/upload/")
                          ? <video key={i} src={url} controls className="w-full max-h-[200px] rounded-lg object-cover" onClick={e => e.stopPropagation()} />
                          : <img key={i} src={url} alt="" className="w-full max-h-[200px] rounded-lg object-cover" />
                      )}
                    </div>
                  )}

                  {p.type === "hottake" && (() => {
                    const liveTotal = (p.agreeCount ?? 0) + (p.disagreeCount ?? 0);
                    const agrPct = liveTotal > 0 ? Math.round(((p.agreeCount ?? 0) / liveTotal) * 100) : 50;
                    const disAgrPct = 100 - agrPct;
                    const userVote = p.userVote;
                    const hasVoted = userVote === "agree" || userVote === "disagree";
                    return (
                      <div style={{ marginTop: 10, marginBottom: 4 }}>
                        <div style={{ display: "flex", borderRadius: 999, overflow: "hidden", height: 5, background: "rgba(255,255,255,0.06)", marginBottom: 8 }}>
                          <div style={{ width: `${agrPct}%`, background: "var(--accent-magenta)", transition: "width 0.4s ease" }} />
                          <div style={{ width: `${disAgrPct}%`, background: "var(--accent-orange)", transition: "width 0.4s ease" }} />
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          {[
                            { agree: true, label: "Agree", pctVal: agrPct, active: userVote === "agree", color: "var(--accent-magenta)" },
                            { agree: false, label: "Disagree", pctVal: disAgrPct, active: userVote === "disagree", color: "var(--accent-orange)" },
                          ].map(({ agree, label, pctVal, active, color }) => (
                            <motion.button key={label} whileTap={!hasVoted ? { scale: 0.93 } : {}}
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (hasVoted) return;
                                try {
                                  await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: agree ? "agree" : "disagree" });
                                  setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: agree ? "agree" : "disagree", agreeCount: (x.agreeCount ?? 0) + (agree ? 1 : 0), disagreeCount: (x.disagreeCount ?? 0) + (!agree ? 1 : 0) }));
                                } catch { onToast("Failed to submit vote"); }
                              }}
                              style={{ flex: 1, padding: "10px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: hasVoted ? "default" : "pointer", border: `2.5px solid ${color}`, background: active ? color : "rgba(255,255,255,0.02)", color: active ? "white" : color, boxShadow: active ? `0 0 16px ${color}60` : "none", transition: "all 0.2s ease-in-out", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: hasVoted && !active ? 0.4 : 1 }}
                            >
                              {active ? `✓ ${agree ? "Agreed" : "Disagreed"}` : label}
                              <span style={{ fontSize: 10, fontWeight: 800, background: active ? "rgba(255,255,255,0.2)" : `${color}22`, borderRadius: 999, padding: "1px 6px" }}>{pctVal}%</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  <div style={{ marginTop: 10 }}>
                    <div className="flex gap-2 mb-2.5">
                      {([{ label: `🔥 ${p.fireCount}`, r: "fire" as const }, { label: `❤️ ${p.heartCount || 0}`, r: "heart" as const }] as const).map(({ label, r }) => (
                        <motion.button key={r} whileTap={{ scale: 0.9 }} onClick={e => { e.stopPropagation(); if (r === "heart") handleLike(p.id); else react(p.id, r); }} className="px-3.5 py-1.5 text-xs font-semibold bg-[rgba(255,255,255,0.05)] rounded-full border border-[rgba(255,255,255,0.08)] text-[var(--text-primary)] cursor-pointer">{label}</motion.button>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 16, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10 }}>
                      <button onClick={e => { e.stopPropagation(); handleLike(p.id); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: p.userLiked ? "#ff4a7d" : "#9494ad", fontSize: 13, fontWeight: 600 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={p.userLiked ? "#ff4a7d" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                        <span>{p.heartCount || 0}</span>
                      </button>
                      {/* Comment icon → still opens RoomPostDetailsOverlay */}
                      <button onClick={e => { e.stopPropagation(); onPostClick?.({ id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo, createdAt: p.createdAt, type: p.type || "post", isDbPost: true, roomId, mediaUrls: p.mediaUrls, replyCount: p.replyCount }); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#9494ad", fontSize: 13, fontWeight: 600 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        <span>{p.replyCount || 0}</span>
                      </button>
                      <button onClick={e => { e.stopPropagation(); openShareDialog(p); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#9494ad", fontSize: 13, fontWeight: 600 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* ── CATEGORY PILLS ── */}
      <div className="flex gap-1.5 py-1 px-2.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {RADIAL_OPTS.map((q) => {
          const isActive = q.id === selectedActionId;
          return (
            <button key={q.id} type="button"
              onClick={() => { if (q.id === "post") { onCompose?.(q.id); setSelectedActionId("post"); return; } setSelectedActionId(q.id); onCompose?.(q.id); setSelectedActionId("post"); }}
              className={["flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all duration-150 cursor-pointer shrink-0", isActive ? "border-[rgba(233,30,140,0.35)] bg-[rgba(233,30,140,0.12)]" : "border-transparent bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.6)]"].join(" ")}
            >
              {composeIconMap[q.id] || <span>{q.emoji}</span>}
              {q.label}
            </button>
          );
        })}
      </div>

      {/* ── COMPOSER ── */}
      <div className="shrink-0 px-3 pt-2 pb-2 bg-[rgba(14,14,20,0.98)] backdrop-blur-[20px] border-t border-[var(--border)] flex flex-col gap-2">
        {selectedActionId === "post" && (
          <>
            {attachedUrl && (
              <div className="px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {attachedType === "image" ? <img src={attachedUrl} className="w-10 h-10 rounded-lg object-cover" alt="Attached" /> : <video src={attachedUrl} className="w-10 h-10 rounded-lg object-cover" />}
                  <span className="text-xs text-[var(--text-secondary)]">Media attached</span>
                </div>
                <button type="button" onClick={() => { setAttachedUrl(null); setAttachedType(null); }} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">✕</button>
              </div>
            )}
            <div className="flex gap-2 items-center">
              <button type="button" onClick={() => triggerUpload("image")} disabled={uploading} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer flex items-center p-1 shrink-0">
                <Image size={20} />
              </button>
              <div className="flex-1 relative">
                {input === "" && !uploading && (
                  <div className="absolute left-4 top-0 bottom-0 flex items-center pointer-events-none">
                    <span className="text-sm font-medium" style={{ color: MODE_COLOR["post"] || "var(--text-secondary)" }}>{PLACEHOLDER["post"]}</span>
                  </div>
                )}
                <input type="text" disabled={uploading} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} className="w-full h-11 rounded-[22px] bg-[var(--bg-secondary)] border border-[var(--border)] pl-4 pr-4 text-white text-base outline-none" />
              </div>
              <motion.button whileTap={{ scale: 0.96 }} onClick={send} disabled={uploading} className={["w-11 h-11 rounded-full border-none text-white text-lg font-bold flex items-center justify-center cursor-pointer shrink-0", "bg-[linear-gradient(135deg,#e91e8c,#ff6b35)]", uploading ? "opacity-50" : "opacity-100"].join(" ")}>↑</motion.button>
            </div>
          </>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
    </div>
  );
}