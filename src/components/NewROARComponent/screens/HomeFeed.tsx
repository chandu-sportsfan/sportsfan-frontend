// // //chandu's code

// // components/NewROARComponent/screens/HomeFeed.tsx

// import { useState, useEffect, useRef, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";
// import axios from "axios";
// import AvatarWithBadge from "../components/AvatarWithBadge";
// import NewHomePage from "../../NewHomePageComponent/newhomepage";
// import { SplitBar, FilterPills } from "../components/shared";
// import { FEED_POSTS, FEED_FILTERS, BADGE_LABELS, RADIAL_OPTS } from "../constants";
// import { fmt, clamp, formatTimeAgo } from "../utils";
// import {
//   Heart, Share2, Flame, TrendingUp, Zap, History, PenTool,
//   MessageSquare, Trash2, Brain, Users, Clock, CheckCircle2, XCircle,
// } from "lucide-react";
// import type { Room } from "../types";

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
//   return [
//     `Check out this ROAR post by ${author}`,
//     post?.text || "Join the conversation on Sportsfan ROAR.",
//     `View post: ${shareUrl}`,
//   ].filter(Boolean).join("\n");
// };

// const copyToClipboard = async (text: string) => {
//   try {
//     await navigator.clipboard.writeText(text);
//     return true;
//   } catch {
//     try {
//       const input = document.createElement("textarea");
//       input.value = text;
//       input.style.position = "fixed";
//       input.style.opacity = "0";
//       document.body.appendChild(input);
//       input.focus();
//       input.select();
//       const ok = document.execCommand("copy");
//       document.body.removeChild(input);
//       return ok;
//     } catch {
//       return false;
//     }
//   }
// };

// // ── QuizCard — fully self-contained interactive quiz component ───────────────
// interface QuizCardProps {
//   item: any;
//   index: number;
//   activeUsername: string;
//   currentAvatarUrl?: string;
//   onPostClick?: (post: any) => void;
//   onToast: (m: string) => void;
//   renderCardActions: (item: any) => React.ReactNode;
// }

// function QuizCard({
//   item,
//   index,
//   activeUsername,
//   currentAvatarUrl,
//   onPostClick,
//   onToast,
//   renderCardActions,
// }: QuizCardProps) {
//   // If quizUserAnswer is already set (server-side), user has answered before
//   const [selectedOption, setSelectedOption] = useState<string | null>(
//     item.quizUserAnswer ?? null,
//   );
//   // correctOption is only present after answering (server hides it until then)
//   const [revealedCorrect, setRevealedCorrect] = useState<string | null>(
//     item.quizCorrectOption ?? null,
//   );
//   const [submitting, setSubmitting] = useState(false);
//   const [participants, setParticipants] = useState<number>(item.quizParticipants ?? 0);

//   const hasAnswered = selectedOption !== null;

//   const quizOptions: { label: string; text: string }[] = item.quizOptions ?? [];

//   const handleOptionClick = useCallback(
//     async (label: string) => {
//       if (hasAnswered || submitting) return;

//       setSubmitting(true);
//       setSelectedOption(label); // optimistic

//       try {
//         const res = await axios.post(
//           `/api/roar/posts/${item.id}/quiz-answer`,
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
//         // Revert optimistic update on error
//         setSelectedOption(null);
//         onToast("Failed to submit answer");
//       } finally {
//         setSubmitting(false);
//       }
//     },
//     [hasAnswered, submitting, item.id, participants, onToast],
//   );

//   const getOptionStyle = (label: string): React.CSSProperties => {
//     const isSelected = selectedOption === label;
//     const isCorrect = revealedCorrect === label;
//     const isWrong = hasAnswered && isSelected && revealedCorrect !== null && !isCorrect;

//     if (!hasAnswered) {
//       // Pre-answer: neutral hover state, no highlighting
//       return {
//         padding: "11px 14px",
//         borderRadius: 14,
//         background: "rgba(255,255,255,0.04)",
//         border: "1px solid rgba(255,255,255,0.1)",
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//         cursor: submitting ? "not-allowed" : "pointer",
//         transition: "all 0.18s",
//         opacity: submitting ? 0.6 : 1,
//       };
//     }

//     // Post-answer state
//     if (isCorrect) {
//       return {
//         padding: "11px 14px",
//         borderRadius: 14,
//         background: "rgba(0,232,198,0.12)",
//         border: "1px solid rgba(0,232,198,0.4)",
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//         cursor: "default",
//         transition: "all 0.18s",
//       };
//     }

//     if (isWrong) {
//       return {
//         padding: "11px 14px",
//         borderRadius: 14,
//         background: "rgba(244,67,54,0.1)",
//         border: "1px solid rgba(244,67,54,0.35)",
//         display: "flex",
//         alignItems: "center",
//         gap: 10,
//         cursor: "default",
//         transition: "all 0.18s",
//       };
//     }

//     // Other options after answering — dim them
//     return {
//       padding: "11px 14px",
//       borderRadius: 14,
//       background: "rgba(255,255,255,0.02)",
//       border: "1px solid rgba(255,255,255,0.05)",
//       display: "flex",
//       alignItems: "center",
//       gap: 10,
//       cursor: "default",
//       opacity: 0.45,
//       transition: "all 0.18s",
//     };
//   };

//   const getLabelColor = (label: string) => {
//     if (!hasAnswered) return "#4A4A62";
//     if (revealedCorrect === label) return "#00E8C6";
//     if (selectedOption === label && revealedCorrect !== label) return "#F44336";
//     return "#4A4A62";
//   };

//   return (
//     <motion.div
//       key={item.id}
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.04 }}
//       className="glass-card"
//       style={{ padding: "16px", position: "relative", overflow: "hidden" }}
//     // Do NOT propagate card click to onPostClick — options handle their own clicks
//     >
//       {/* Accent stripe */}
//       <div style={{
//         position: "absolute", top: 0, left: 0, right: 0, height: 2,
//         background: "linear-gradient(90deg,#E91E8C,#FF6B35,#00E8C6)",
//         borderRadius: "28px 28px 0 0",
//       }} />

//       {/* Type badge + timer */}
//       <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
//         <span style={{
//           fontSize: 10, fontWeight: 800, letterSpacing: "0.06em",
//           padding: "3px 8px", borderRadius: 4, textTransform: "uppercase",
//           background: "rgba(0,232,198,0.12)", color: "#00E8C6",
//           border: "1px solid rgba(0,232,198,0.25)",
//         }}>
//           🧠 Flash Quiz
//         </span>
//         {/* {item.quizTimer && (
//           <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: "#9494AD" }}>
//             <Clock size={10} />
//             {item.quizTimer}s
//           </span>
//         )} */}
//         {hasAnswered && revealedCorrect && (
//           <span style={{
//             fontSize: 10, fontWeight: 700,
//             color: selectedOption === revealedCorrect ? "#00E8C6" : "#F44336",
//             marginLeft: "auto",
//           }}>
//             {selectedOption === revealedCorrect ? "✓ Correct!" : "✗ Wrong"}
//           </span>
//         )}
//       </div>

//       {/* Author */}
//       <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
//         <AvatarWithBadge
//           username={item.fan.username}
//           badge={item.fan.badge}
//           size="sm"
//           avatarUrl={item.fan.username === activeUsername ? currentAvatarUrl : item.fan.avatarUrl}
//         />
//         <div>
//           <p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p>
//           <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>
//             {BADGE_LABELS[item.fan.badge]} · {item.fan.team} • {formatTimeAgo(item.createdAt)}
//           </p>
//         </div>
//       </div>

//       {/* Question — clicking question text opens post detail */}
//       <p
//         style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.5, marginBottom: 14, color: "#F5F5FA", cursor: "pointer" }}
//         onClick={() => onPostClick && onPostClick(item)}
//       >
//         {item.quizQuestion || item.text}
//       </p>

//       {/* Options — interactive, stop propagation */}
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
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleOptionClick(opt.label);
//                 }}
//               >
//                 {/* Label letter */}
//                 <span style={{
//                   fontSize: 11, fontWeight: 800,
//                   fontFamily: "'Bebas Neue', sans-serif",
//                   letterSpacing: "0.04em",
//                   color: getLabelColor(opt.label),
//                   minWidth: 14, flexShrink: 0,
//                 }}>
//                   {opt.label}
//                 </span>

//                 {/* Status icon (only after answering) */}
//                 {hasAnswered && isCorrect && <CheckCircle2 size={13} color="#00E8C6" style={{ flexShrink: 0 }} />}
//                 {hasAnswered && isWrong && <XCircle size={13} color="#F44336" style={{ flexShrink: 0 }} />}

//                 {/* Option text */}
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

//       {/* Pre-answer CTA */}
//       {!hasAnswered && (
//         <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontStyle: "italic" }}>
//           Tap an option to answer
//         </p>
//       )}

//       {/* Participant count */}
//       <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
//         <Users size={13} color="#9494AD" />
//         <span style={{ fontSize: 12, fontWeight: 600, color: "#9494AD" }}>
//           {participants > 0
//             ? `${participants.toLocaleString()} fan${participants === 1 ? "" : "s"} participated`
//             : "Be the first to answer!"}
//         </span>
//       </div>

//       {renderCardActions(item)}
//     </motion.div>
//   );
// }

// // ── Main HomeFeed ─────────────────────────────────────────────────────────────

// interface Props {
//   onJoinRoom: (room?: any) => void;
//   onLeaderboard: () => void;
//   onFanProfile: () => void;
//   onToast: (m: string) => void;
//   extraItems: any[];
//   showBanner: boolean;
//   onDismissBanner: () => void;
//   userBadge: string;
//   rooms?: Room[];
//   dbPosts?: any[];
//   onPostClick?: (post: any) => void;
//   onVote?: (id: string, vote: "agree" | "disagree" | null) => void;
//   onLike?: (id: string) => void;
//   onDeletePost?: (id: string) => void;
//   userSports?: string[];
//   onQuickCompose?: (t: string) => void;
//   currentUsername?: string;
//   currentAvatarUrl?: string;
// }

// export default function HomeFeed({
//   onJoinRoom,
//   onLeaderboard,
//   onFanProfile,
//   onToast,
//   extraItems,
//   showBanner,
//   onDismissBanner,
//   userBadge,
//   rooms = [],
//   dbPosts = [],
//   onPostClick,
//   onVote,
//   onLike,
//   onDeletePost,
//   userSports = [],
//   onQuickCompose,
//   currentUsername: propUsername,
//   currentAvatarUrl,
// }: Props) {
//   const [filter, setFilter] = useState("For You");
//   const [votes, setVotes] = useState<Record<string, boolean | null>>({});
//   const [localLikes, setLocalLikes] = useState<Record<string, { userLiked: boolean; likeCount: number }>>({});
//   const [lastActionAt, setLastActionAt] = useState<Record<string, number>>({});
//   const [pcts, setPcts] = useState<Record<string, number>>({});
//   const [now, setNow] = useState(Date.now());
//   const [localUsername, setLocalUsername] = useState("RoarUser");
//   const [sharePost, setSharePost] = useState<ShareableRoarPost | null>(null);
//   const [copied, setCopied] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedActionId, setSelectedActionId] = useState("post");
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (dbPosts.length === 0) return;
//     setLocalLikes((prev) => {
//       if (Object.keys(prev).length === 0) return prev;
//       const next = { ...prev };
//       dbPosts.forEach((p) => {
//         const local = next[p.postId];
//         if (!local) return;
//         if (local.userLiked === (p.userLiked ?? false) && local.likeCount === (p.likeCount ?? 0)) {
//           delete next[p.postId];
//         }
//       });
//       return next;
//     });
//   }, [dbPosts]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     try { setLocalUsername(localStorage.getItem("roar_username") || "RoarUser"); } catch { }
//   }, []);

//   const activeUsername = propUsername || localUsername;

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
//           <Image src={src} alt={alt} width={36} height={36} className="w-full h-full object-cover rounded-full" />
//         </button>
//       ))}
//     </>
//   );

//   const formatCountdown = (diffMs: number) => {
//     const diffSec = Math.floor(diffMs / 1000);
//     const secs = diffSec % 60;
//     const mins = Math.floor(diffSec / 60) % 60;
//     const hrs = Math.floor(diffSec / 3600);
//     const pad = (n: number) => String(n).padStart(2, "0");
//     if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
//     return `${pad(mins)}:${pad(secs)}`;
//   };

//   // useEffect(() => {
//   //   if (dbPosts.length > 0) {
//   //     const syncedVotes: Record<string, boolean | null> = { ...votes };
//   //     const syncedLikes: Record<string, { userLiked: boolean; likeCount: number }> = { ...localLikes };
//   //     const nowMs = Date.now();
//   //     dbPosts.forEach((p) => {
//   //       const lastAction = lastActionAt[p.postId] || 0;
//   //       if (nowMs - lastAction < 15000) return;
//   //       syncedVotes[p.postId] = p.userVote ? p.userVote === "agree" : null;
//   //       syncedLikes[p.postId] = { userLiked: p.userLiked ?? false, likeCount: p.likeCount ?? 0 };
//   //     });
//   //     setVotes(syncedVotes);
//   //     setLocalLikes(syncedLikes);
//   //   }
//   // }, [dbPosts, lastActionAt]);

//   useEffect(() => {
//     if (dbPosts.length === 0) return;
//     const nowMs = Date.now();
//     setVotes((prev) => {
//       const next = { ...prev };
//       dbPosts.forEach((p) => {
//         const id = p.postId;
//         const lastAction = lastActionAt[id] || 0;
//         if (nowMs - lastAction < 15000) return;
//         if (p.userVote === "agree") next[id] = true;
//         else if (p.userVote === "disagree") next[id] = false;
//         else next[id] = null;
//       });
//       return next;
//     });
//     setLocalLikes((prev) => {
//       const next = { ...prev };
//       dbPosts.forEach((p) => {
//         const id = p.postId;
//         const lastAction = lastActionAt[id] || 0;
//         if (nowMs - lastAction < 15000) return;
//         next[id] = { userLiked: p.userLiked ?? false, likeCount: p.likeCount ?? 0 };
//       });
//       return next;
//     });
//   }, [dbPosts, lastActionAt]);

//   // const vote = (
//   //   id: string,
//   //   agree: boolean,
//   //   initialAgreePercent: number,
//   //   initialUserVote: "agree" | "disagree" | null,
//   //   isDbPost?: boolean,
//   // ) => {
//   //   const prev = votes[id];
//   //   let nextVote: boolean | null = agree;
//   //   if (prev === agree) nextVote = null;
//   //   setVotes((v) => ({ ...v, [id]: nextVote }));
//   //   setLastActionAt((prev) => ({ ...prev, [id]: Date.now() }));

//   //   let delta = 0;
//   //   if (initialUserVote === "agree") {
//   //     if (nextVote === true) delta = 0;
//   //     else if (nextVote === false) delta = -6;
//   //     else delta = -3;
//   //   } else if (initialUserVote === "disagree") {
//   //     if (nextVote === true) delta = 6;
//   //     else if (nextVote === false) delta = 0;
//   //     else delta = 3;
//   //   } else {
//   //     if (nextVote === true) delta = 3;
//   //     else if (nextVote === false) delta = -3;
//   //     else delta = 0;
//   //   }
//   //   setPcts((p) => ({ ...p, [id]: clamp(initialAgreePercent + delta, 1, 99) }));

//   //   if (isDbPost && onVote) {
//   //     onVote(id, nextVote === true ? "agree" : nextVote === false ? "disagree" : null);
//   //   }
//   // };

//   const vote = (
//     id: string,
//     agree: boolean,
//     initialAgreePercent: number,
//     initialUserVote: "agree" | "disagree" | null,
//     isDbPost?: boolean,
//   ) => {
//     // Block if already voted
//     const currentVote = votes[id];
//     const alreadyVoted =
//       currentVote === true || currentVote === false ||
//       initialUserVote === "agree" || initialUserVote === "disagree";
//     if (alreadyVoted) return;

//     const nextVote: boolean = agree;
//     setVotes((v) => ({ ...v, [id]: nextVote }));
//     setLastActionAt((prev) => ({ ...prev, [id]: Date.now() }));

//     const delta = agree ? 3 : -3;
//     setPcts((p) => ({ ...p, [id]: clamp(initialAgreePercent + delta, 1, 99) }));

//     if (isDbPost && onVote) {
//       onVote(id, agree ? "agree" : "disagree");
//     }
//   };

//   const renderCardActions = (item: any) => {
//     const likeOverride = localLikes[item.id];
//     const userLiked = likeOverride !== undefined ? likeOverride.userLiked : (item.userLiked ?? false);
//     const likeCount = likeOverride !== undefined ? likeOverride.likeCount : (item.likeCount ?? 0);

//     return (
//       <div style={{ display: "flex", gap: 16, marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             setLocalLikes((prev) => ({
//               ...prev,
//               [item.id]: { userLiked: !userLiked, likeCount: Math.max(0, likeCount + (userLiked ? -1 : 1)) },
//             }));
//             setLastActionAt((prev) => ({ ...prev, [item.id]: Date.now() }));
//             if (onLike) onLike(item.id);
//           }}
//           style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: userLiked ? "#ff4a7d" : "#9494ad", fontSize: 13, fontWeight: 600 }}
//         >
//           <Heart size={16} fill={userLiked ? "#ff4a7d" : "none"} />
//           <span>{likeCount}</span>
//         </button>
//         <button
//           onClick={(e) => { e.stopPropagation(); if (onPostClick) onPostClick(item); }}
//           style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#9494ad", fontSize: 13, fontWeight: 600 }}
//         >
//           <MessageSquare size={16} />
//           <span>{item.replies || 0}</span>
//         </button>
//         <button
//           onClick={(e) => { e.stopPropagation(); openShareDialog(item); }}
//           style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#9494ad", fontSize: 13, fontWeight: 600 }}
//         >
//           <Share2 size={16} />
//           <span>Share</span>
//         </button>
//         {item.fan?.username === activeUsername && (
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               if (window.confirm("Are you sure you want to delete this post?")) {
//                 if (onDeletePost) onDeletePost(item.id);
//               }
//             }}
//             style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#f87171", marginLeft: "auto", padding: "4px", borderRadius: "50%" }}
//           >
//             <Trash2 size={16} />
//           </button>
//         )}
//       </div>
//     );
//   };

//   const mappedDbPosts = dbPosts.map((p) => {
//     const agreeCount = p.agreeCount ?? 0;
//     const disagreeCount = p.disagreeCount ?? 0;
//     const totalVotes = agreeCount + disagreeCount;
//     const agreePercent = totalVotes > 0 ? Math.round((agreeCount / totalVotes) * 100) : 50;
//     return {
//       id: p.postId,
//       type: p.type,
//       sport: p.sport || "cricket",
//       fan: {
//         username: p.authorUsername || "RoarUser",
//         badge: p.authorBadge || "RISING_FAN",
//         team: p.sport === "cricket" ? "India" : "MCFC",
//         avatarUrl: p.authorAvatarUrl || p.avatarUrl ||
//           (p.authorUsername === activeUsername ? currentAvatarUrl : undefined),
//       },
//       text: p.text,
//       agreePercent,
//       agreeCount,
//       disagreeCount,
//       fanCount: totalVotes + (p.type === "hot_take" ? 47 : 1240),
//       replies: p.replyCount ?? 0,
//       following: false,
//       isLive: false,
//       match: p.matchId || (p.type === "prediction"
//         ? (p.sport === "cricket" ? "IND vs AUS · 3rd Test" : "ISL 2025")
//         : undefined),
//       samePredictionCount: p.type === "prediction" ? agreeCount : undefined,
//       counterCount: p.type === "prediction" ? disagreeCount : undefined,
//       isDbPost: true,
//       userVote: p.userVote,
//       sideA: p.sideA,
//       sideB: p.sideB,
//       memCtx: p.memCtx,
//       mediaUrls: p.mediaUrls,
//       memGifUrl: p.memGifUrl,
//     memTag: p.memTag,
//       likeCount: p.likeCount ?? 0,
//       userLiked: p.userLiked ?? false,
//       createdAt: p.createdAt,
//       // Quiz — correctOption is undefined until user answers (hidden by GET route)
//       quizQuestion: p.quizQuestion,
//       quizOptions: p.quizOptions,
//       quizCorrectOption: p.quizCorrectOption,   // undefined if not yet answered
//       quizUserAnswer: p.quizUserAnswer,       // null = not answered
//       quizTimer: p.quizTimer,
//       quizPoints: p.quizPoints,
//       quizParticipants: p.quizParticipants ?? 0,
//     };
//   });

//   const allPosts = [...mappedDbPosts, ...extraItems, ...FEED_POSTS];
//   const filtered = allPosts.filter((p) => {
//     if (filter === "For You") {
//       if (userSports && userSports.length > 0) return userSports.map((s) => s.toLowerCase()).includes(p.sport?.toLowerCase());
//       return true;
//     }
//     if (filter === "Cricket") return p.sport?.toLowerCase() === "cricket";
//     if (filter === "Football") return p.sport?.toLowerCase() === "football";
//     if (filter === "Live") return p.isLive || p.type === "match_room";
//     if (filter === "Predictions") return p.type === "prediction";
//     return true;
//   });

//   return (
//     <div className="screen-scroll">
//       {/* Share Dialog */}
//       {sharePost && (
//         <>
//           <button type="button" className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={closeShareDialog} />
//           <div className="fixed bottom-16 inset-x-4 z-50 mx-auto w-full max-w-[280px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl lg:hidden" onClick={e => e.stopPropagation()}>
//             <div className="flex items-center justify-between mb-2">
//               <p className="text-white text-sm font-semibold">Share</p>
//               <button type="button" onClick={closeShareDialog} className="text-gray-400 hover:text-white">
//                 <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
//               </button>
//             </div>
//             <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 overflow-x-auto">{shareButtons("w-8 h-8")}</div>
//             {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
//           </div>
//           <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/60" onClick={closeShareDialog}>
//             <div className="bg-[#1a1a1e] rounded-2xl border border-white/10 p-4 w-[300px] shadow-2xl" onClick={e => e.stopPropagation()}>
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-white text-sm font-semibold">Share ROAR Post</p>
//                 <button type="button" onClick={closeShareDialog} className="text-gray-400 hover:text-white">
//                   <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
//                 </button>
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

//       <svg width="0" height="0" style={{ position: "absolute" }}>
//         <linearGradient id="pink-orange-grad" x1="0%" y1="0%" x2="100%" y2="100%">
//           <stop offset="0%" stopColor="#e91e8c" />
//           <stop offset="100%" stopColor="#ff6b35" />
//         </linearGradient>
//       </svg>

//       {/* Sticky Header */}
//       <div style={{ position: "sticky", top: 0, zIndex: 30, background: "var(--bg-primary)", paddingBottom: 4, overflow: "visible" }}>
//         <div className="glass-card" style={{ margin: "8px 12px 0", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12, borderRadius: 20, overflow: "visible", position: "relative", zIndex: 40 }}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flexShrink: 0 }}>
//               <h1 className="logotype" style={{ fontSize: 34, margin: 0, lineHeight: 1 }}>ROAR</h1>
//               <div style={{ height: "2px", width: "32px", borderRadius: "999px", marginTop: "3px", background: "#e5003d" }} />
//             </div>

//             <div style={{ position: "relative" }} ref={dropdownRef}>
//               {(() => {
//                 const selectedOption = RADIAL_OPTS.find((q) => q.id === selectedActionId) || RADIAL_OPTS[4];
//                 const icons: Record<string, React.ReactNode> = {
//                   hot_take: <Flame size={16} stroke="url(#pink-orange-grad)" fill="url(#pink-orange-grad)" />,
//                   prediction: <TrendingUp size={16} stroke="url(#pink-orange-grad)" />,
//                   debate: <Zap size={16} stroke="url(#pink-orange-grad)" fill="url(#pink-orange-grad)" />,
//                   raw_reactions: <History size={16} stroke="url(#pink-orange-grad)" />,
//                   post: <PenTool size={16} stroke="url(#pink-orange-grad)" />,
//                   quiz: <Brain size={16} stroke="url(#pink-orange-grad)" />,
//                 };
//                 const selectedIcon = icons[selectedOption.id] || <span>{selectedOption.emoji}</span>;
//                 return (
//                   <motion.button
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                     style={{
//                       display: "flex", alignItems: "center", gap: 8,
//                       padding: "8px 16px", borderRadius: 999,
//                       background: "linear-gradient(145deg, rgba(233,30,140,0.18), rgba(255,107,53,0.10))",
//                       border: "1px solid rgba(233,30,140,0.35)",
//                       boxShadow: "0 4px 15px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
//                       backdropFilter: "blur(8px)",
//                       color: "rgba(255,255,255,0.9)", cursor: "pointer", transition: "all 0.2s",
//                     }}
//                   >
//                     {selectedIcon}
//                     <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.03em" }}>{selectedOption.label}</span>
//                     <span style={{ fontSize: 10, marginLeft: 2, color: "rgba(255,255,255,0.7)" }}>{isDropdownOpen ? "▲" : "▼"}</span>
//                   </motion.button>
//                 );
//               })()}

//               <AnimatePresence>
//                 {isDropdownOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
//                     transition={{ duration: 0.15 }}
//                     style={{
//                       position: "absolute", top: "100%", right: 0, marginTop: 8,
//                       background: "#121214", border: "1px solid rgba(255,255,255,0.05)",
//                       borderRadius: 16, padding: 8, display: "flex", flexDirection: "column", gap: 6,
//                       minWidth: 180, boxShadow: "0 10px 40px rgba(0,0,0,0.8)", zIndex: 30,
//                       maxHeight: "60vh", overflowY: "auto", scrollbarWidth: "none",
//                     }}
//                   >
//                     {RADIAL_OPTS.map((q) => {
//                       const icons: Record<string, React.ReactNode> = {
//                         hot_take: <Flame size={18} color="white" />,
//                         prediction: <TrendingUp size={18} color="white" />,
//                         debate: <Zap size={18} color="white" />,
//                         memory: <History size={18} color="white" />,
//                         post: <PenTool size={18} color="white" />,
//                         quiz: <Brain size={18} color="white" />,
//                       };
//                       const icon = icons[q.id] || <span>{q.emoji}</span>;
//                       const isActive = q.id === selectedActionId;
//                       return (
//                         <button
//                           key={q.id}
//                           onClick={() => { setSelectedActionId(q.id); setIsDropdownOpen(false); if (onQuickCompose) onQuickCompose(q.id); }}
//                           style={{
//                             display: "flex", alignItems: "center", gap: 12,
//                             padding: "10px 12px", borderRadius: 12,
//                             background: isActive ? "linear-gradient(145deg,rgba(233,30,140,0.18),rgba(255,107,53,0.10))" : "transparent",
//                             border: isActive ? "1px solid rgba(233,30,140,0.35)" : "1px solid transparent",
//                             color: "white", cursor: "pointer", textAlign: "left", transition: "all 0.2s",
//                           }}
//                           onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
//                           onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
//                         >
//                           <div style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.02)" }}>
//                             {icon}
//                           </div>
//                           <span style={{ fontSize: 13, fontWeight: 500 }}>{q.label}</span>
//                         </button>
//                       );
//                     })}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>
//         <div style={{ padding: "10px 16px", overflow: "hidden", position: "relative" }}>
//           <FilterPills options={FEED_FILTERS} active={filter} onChange={setFilter} />
//         </div>
//       </div>

//       {/* Feed content */}
//       <div style={{ padding: "0 16px 120px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
//         <NewHomePage sportFilter={filter === "Cricket" ? "cricket" : filter === "Football" ? "football" : undefined} />

//         {/* Live room banners */}
//         {rooms
//           .filter((r) => r.roomId !== "mock-cricket" && r.roomId !== "mock-football")
//           .map((room, idx) => {
//             const showThisRoom =
//               filter === "Live" ||
//               (filter === "For You" && (userSports.length === 0 || userSports.includes(room.sport?.toLowerCase() ?? ""))) ||
//               (filter === "Cricket" && room.sport?.toLowerCase() === "cricket") ||
//               (filter === "Football" && room.sport?.toLowerCase() === "football");
//             if (!showThisRoom) return null;
//             const isFuture = room.scheduledStartTime && room.scheduledStartTime > now;
//             const diff = isFuture && room.scheduledStartTime ? room.scheduledStartTime - now : 0;
//             const isBlueStyle = room.sport?.toLowerCase() === "football" || idx % 2 === 1;
//             const bg = isBlueStyle ? "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(59,130,246,0.04))" : "linear-gradient(135deg,rgba(233,30,140,0.12),rgba(255,107,53,0.06))";
//             const border = isBlueStyle ? "1px solid rgba(59,130,246,0.25)" : "1px solid rgba(233,30,140,0.25)";
//             const livePulseBg = isFuture ? "var(--accent-orange)" : (isBlueStyle ? "#60a5fa" : "var(--live-green)");
//             const liveTextCol = isFuture ? "var(--accent-orange)" : (isBlueStyle ? "#60a5fa" : "var(--live-green)");
//             const liveLabel = isFuture ? "STARTS IN" : "LIVE NOW";

//             return (
//               <motion.div
//                 key={room.roomId}
//                 initial={{ opacity: 0, y: 8 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="glass-card"
//                 style={{ padding: 16, background: bg, border, cursor: isFuture ? "default" : "pointer" }}
//                 onClick={() => { if (!isFuture) onJoinRoom(room); else onToast("This discussion room hasn't started yet."); }}
//               >
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//                   <div>
//                     <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
//                       <span className={isFuture ? undefined : "live-pulse"} style={{ width: 8, height: 8, borderRadius: "50%", background: livePulseBg, display: "inline-block" }} />
//                       <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: liveTextCol }}>{liveLabel}</span>
//                     </div>
//                     <p className="font-display" style={{ fontSize: isBlueStyle ? 22 : 26, lineHeight: 1 }}>{room.name}</p>
//                     <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{room.description || "Discussion Show"}</p>
//                   </div>
//                   <div style={{ textAlign: "right" }}>
//                     <p className="font-display" style={{ fontSize: isBlueStyle ? 28 : 30, color: "white" }}>{isFuture ? "SOON" : "LIVE"}</p>
//                     <p style={{ fontSize: 11, color: isBlueStyle ? "#60a5fa" : "var(--text-muted)" }}>{isFuture ? "Scheduled" : "Active Now"}</p>
//                   </div>
//                 </div>
//                 {isFuture ? (
//                   <button disabled style={{ width: "100%", marginTop: 12, padding: "10px 0", borderRadius: 999, fontSize: 13, border: "1px solid rgba(255,255,255,0.08)", cursor: "not-allowed", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)", fontWeight: 800, letterSpacing: "0.06em" }}>
//                     STARTS IN {formatCountdown(diff)}
//                   </button>
//                 ) : (
//                   <motion.button
//                     whileTap={{ scale: 0.97 }}
//                     onClick={(e) => { e.stopPropagation(); onJoinRoom(room); }}
//                     className={isBlueStyle ? undefined : "btn-gradient"}
//                     style={{ width: "100%", marginTop: 12, padding: "10px 0", borderRadius: 999, fontSize: 13, border: "none", cursor: "pointer", background: isBlueStyle ? "#3b82f6" : undefined, color: "white", fontWeight: 800, fontFamily: isBlueStyle ? "'Bebas Neue',sans-serif" : undefined, letterSpacing: isBlueStyle ? "0.06em" : undefined }}
//                   >
//                     JOIN LIVE
//                   </motion.button>
//                 )}
//               </motion.div>
//             );
//           })}

//         {/* Feed posts */}
//         {filtered.map((item, i) => {

//           // ── QUIZ ───────────────────────────────────────────────────────────
//           if (item.type === "quiz") {
//             return (
//               <QuizCard
//                 key={item.id}
//                 item={item}
//                 index={i}
//                 activeUsername={activeUsername}
//                 currentAvatarUrl={currentAvatarUrl}
//                 onPostClick={onPostClick}
//                 onToast={onToast}
//                 renderCardActions={renderCardActions}
//               />
//             );
//           }

//           // ── HOT TAKE / PREDICTION / POST ───────────────────────────────────
//           if (item.type === "hot_take" || item.type === "prediction" || item.type === "post") {
//             const pct = pcts[item.id] ?? item.agreePercent ?? 50;
//             const userVote = votes[item.id];
//             const liveTotal = (item.agreeCount ?? 0) + (item.disagreeCount ?? 0);
//             const agrPct = liveTotal > 0 ? Math.round(((item.agreeCount ?? 0) / liveTotal) * 100) : pct;
//             const disAgrPct = liveTotal > 0 ? Math.round(((item.disagreeCount ?? 0) / liveTotal) * 100) : (100 - pct);

//             return (
//               <motion.div
//                 key={item.id}
//                 initial={{ opacity: 0, y: 16 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.04 }}
//                 className="glass-card"
//                 style={{ padding: "16px", cursor: "pointer" }}
//                 onClick={() => onPostClick && onPostClick(item)}
//               >
//                 <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
//                   <span style={{
//                     fontSize: 10, fontWeight: 800, letterSpacing: "0.06em",
//                     padding: "3px 8px", borderRadius: 4, textTransform: "uppercase",
//                     background: item.type === "hot_take" ? "rgba(239,68,68,0.12)" : item.type === "post" ? "rgba(233,30,140,0.12)" : "rgba(255,107,53,0.12)",
//                     color: item.type === "hot_take" ? "#f87171" : item.type === "post" ? "var(--accent-magenta)" : "var(--accent-orange)",
//                     border: `1px solid ${item.type === "hot_take" ? "rgba(239,68,68,0.2)" : item.type === "post" ? "rgba(233,30,140,0.2)" : "rgba(255,107,53,0.2)"}`,
//                   }}>
//                     {item.type === "hot_take" ? "🔥 Hot Take" : item.type === "post" ? "✏️ Post" : "📊 Prediction"}
//                   </span>
//                   {item.type !== "post" && (
//                     <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: item.sport === "cricket" ? "rgba(34,197,94,0.1)" : "rgba(59,130,246,0.1)", color: item.sport === "cricket" ? "#22c55e" : "#60a5fa", border: `1px solid ${item.sport === "cricket" ? "rgba(34,197,94,0.2)" : "rgba(59,130,246,0.2)"}`, textTransform: "uppercase" }}>
//                       {item.sport === "cricket" ? "🏏 Cricket" : "⚽ Football"}
//                     </span>
//                   )}
//                   {item.following && <span style={{ marginLeft: "auto", fontSize: 9, padding: "3px 8px", borderRadius: 999, background: "rgba(233,30,140,0.15)", color: "var(--accent-magenta)" }}>Following</span>}
//                 </div>

//                 <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
//                   <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" avatarUrl={item.fan.avatarUrl} />
//                   <div>
//                     <p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p>
//                     <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} · {item.fan.team} • {formatTimeAgo(item.createdAt)}</p>
//                   </div>
//                 </div>

//                 <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.5, marginBottom: 12 }}>{item.text}</p>

//                 {item.mediaUrls && item.mediaUrls.length > 0 && (
//                   <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
//                     {item.mediaUrls.map((url: string, idx: number) => {
//                       const isVideo = url.endsWith(".mp4") || url.includes("/video/upload/");
//                       if (isVideo) return <video key={idx} src={url} controls style={{ width: "100%", maxHeight: 300, borderRadius: 12, objectFit: "cover" }} onClick={(e) => e.stopPropagation()} />;
//                       return <img key={idx} src={url} alt="Post Media" style={{ width: "100%", maxHeight: 300, borderRadius: 12, objectFit: "cover" }} />;
//                     })}
//                   </div>
//                 )}

//                 {item.match && <p style={{ fontSize: 11, color: "var(--accent-magenta)", marginBottom: 8, fontWeight: 600 }}>{item.match}</p>}

//                 {item.type === "hot_take" && (
//                   <>
//                     <div style={{ marginBottom: 10 }}><SplitBar left={pct} /></div>
//                     <p style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, marginBottom: 12 }}>{fmt(item.fanCount ?? 0)} fans · {item.replies ?? 0} replies</p>
//                     <div style={{ display: "flex", gap: 8 }}>
//                       {[
//                         { agree: true, label: "Agree", pctVal: agrPct, active: userVote === true, color: "var(--accent-magenta)" },
//                         { agree: false, label: "Disagree", pctVal: disAgrPct, active: userVote === false, color: "var(--accent-orange)" },
//                       ].map(({ agree, label, pctVal, active, color }) => (
//                         <motion.button
//                           key={label}
//                           whileTap={{ scale: 0.93 }}
//                           onClick={(e) => { e.stopPropagation(); vote(item.id, agree, item.agreePercent, item.userVote, item.isDbPost); }}
//                           style={{
//                             flex: 1, padding: "10px", borderRadius: 999, fontSize: 13, fontWeight: 700,
//                             cursor: "pointer", border: `2.5px solid ${color}`,
//                             background: active ? color : "rgba(255,255,255,0.02)",
//                             color: active ? "white" : color,
//                             boxShadow: active ? `0 0 16px ${color}60` : "none",
//                             transition: "all 0.2s ease-in-out",
//                             display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
//                           }}
//                         >
//                           {active ? `✓ ${agree ? "Agreed" : "Disagreed"}` : label}
//                           <span style={{ fontSize: 11, fontWeight: 800, opacity: 0.9, background: active ? "rgba(255,255,255,0.2)" : `${color}22`, borderRadius: 999, padding: "1px 7px" }}>
//                             {pctVal}%
//                           </span>
//                         </motion.button>
//                       ))}
//                     </div>
//                     {renderCardActions(item)}
//                   </>
//                 )}

//                 {/* {item.type === "prediction" && (
//                   <div>
//                     <p style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>{item.samePredictionCount} fans made the same prediction</p>
//                     {(item.counterCount ?? 0) > 0 && <p style={{ fontSize: 12, color: "var(--accent-magenta)", marginTop: 4 }}>{item.counterCount} fans think otherwise →</p>}
//                     {renderCardActions(item)}
//                   </div>
//                 )} */}
//                 {item.type === "prediction" && (
//                   <div>
//                     <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
//                       {[
//                         { agree: true, label: "Support", pctVal: agrPct, active: userVote === true, color: "#22c55e" },
//                         { agree: false, label: "Counter", pctVal: disAgrPct, active: userVote === false, color: "var(--accent-magenta)" },
//                       ].map(({ agree, label, pctVal, active, color }) => (
//                         <motion.button
//                           key={label}
//                           whileTap={{ scale: 0.93 }}
//                           onClick={(e) => { e.stopPropagation(); vote(item.id, agree, item.agreePercent, item.userVote, item.isDbPost); }}
//                           style={{
//                             flex: 1, padding: "10px", borderRadius: 999, fontSize: 13, fontWeight: 700,
//                             cursor: "pointer", border: `2.5px solid ${color}`,
//                             background: active ? color : "rgba(255,255,255,0.02)",
//                             color: active ? "white" : color,
//                             boxShadow: active ? `0 0 16px ${color}60` : "none",
//                             transition: "all 0.2s ease-in-out",
//                             display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
//                           }}
//                         >
//                           {active ? `✓ ${agree ? "Supported" : "Countered"}` : label}
//                           <span style={{ fontSize: 11, fontWeight: 800, opacity: 0.9, background: active ? "rgba(255,255,255,0.2)" : `${color}22`, borderRadius: 999, padding: "1px 7px" }}>
//                             {pctVal}%
//                           </span>
//                         </motion.button>
//                       ))}
//                     </div>
//                     {renderCardActions(item)}
//                   </div>
//                 )}

//                 {item.type === "post" && renderCardActions(item)}
//               </motion.div>
//             );
//           }

//           // ── DEBATE ─────────────────────────────────────────────────────────
//           // if (item.type === "debate") {
//           //   const userVote = votes[item.id];
//           //   return (
//           //     <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card" style={{ padding: "16px", cursor: "pointer" }} onClick={() => onPostClick && onPostClick(item)}>
//           //       <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
//           //         <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: "rgba(233,30,140,0.12)", color: "var(--accent-magenta)", border: "1px solid rgba(233,30,140,0.25)" }}>⚡ Debate</span>
//           //       </div>
//           //       <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
//           //         <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" avatarUrl={item.fan.avatarUrl} />
//           //         <div>
//           //           <p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p>
//           //           <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} · {item.fan.team} • {formatTimeAgo(item.createdAt)}</p>
//           //         </div>
//           //       </div>
//           //       <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
//           //         {[
//           //           { agree: true,  side: item.sideA || item.text?.split(" VS ")[0] || "Side A", color: "var(--accent-magenta)", voted: userVote === true  },
//           //           { agree: false, side: item.sideB || item.text?.split(" VS ")[1] || "Side B", color: "var(--accent-orange)",  voted: userVote === false },
//           //         ].map(({ agree, side, color, voted }, idx) => (
//           //           <>
//           //             {idx === 1 && <div key="vs" style={{ display: "flex", alignItems: "center", padding: "0 4px" }}><span className="font-display" style={{ fontSize: 16, color: "var(--text-muted)" }}>VS</span></div>}
//           //             <motion.button
//           //               key={String(agree)}
//           //               whileTap={{ scale: 0.96 }}
//           //               onClick={(e) => { e.stopPropagation(); vote(item.id, agree, item.agreePercent || 50, item.userVote, item.isDbPost); }}
//           //               style={{ flex: 1, padding: "12px", borderRadius: 14, textAlign: "center", background: voted ? color : agree ? "rgba(233,30,140,0.08)" : "rgba(59,130,246,0.08)", border: `2px solid ${voted ? color : agree ? "rgba(233,30,140,0.3)" : "rgba(59,130,246,0.3)"}`, color: voted ? "white" : "var(--text-primary)", cursor: "pointer", transition: "all 0.2s" }}
//           //             >
//           //               <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{voted && "✓ "}{side}</p>
//           //             </motion.button>
//           //           </>
//           //         ))}
//           //       </div>
//           //       <p style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, marginTop: 10 }}>{fmt(item.fanCount ?? 0)} fans · {item.replies ?? 0} replies</p>
//           //       {renderCardActions(item)}
//           //     </motion.div>
//           //   );
//           // }

//           // ── DEBATE ─────────────────────────────────────────────────────────────
//           // if (item.type === "debate") {
//           //   // const userVote = votes[item.id];
//           //   // const hasVoted = userVote !== undefined && userVote !== null;
//           //   const userVote = votes[item.id];
//           //   const serverVote = item.userVote; // "agree" | "disagree" | null from DB
//           //   const hasVoted =
//           //     userVote === true || userVote === false ||
//           //     serverVote === "agree" || serverVote === "disagree";
//           //   const displayVotedAgree =
//           //     userVote === true ||
//           //     (!Object.prototype.hasOwnProperty.call(votes, item.id) && serverVote === "agree");
//           //   const displayVotedDisagree =
//           //     userVote === false ||
//           //     (!Object.prototype.hasOwnProperty.call(votes, item.id) && serverVote === "disagree");

//           //   const liveTotal = (item.agreeCount ?? 0) + (item.disagreeCount ?? 0);
//           //   const agrPct = liveTotal > 0 ? Math.round(((item.agreeCount ?? 0) / liveTotal) * 100) : 50;
//           //   const disAgrPct = 100 - agrPct;

//           //   return (
//           //     <motion.div
//           //       key={item.id}
//           //       initial={{ opacity: 0, y: 16 }}
//           //       animate={{ opacity: 1, y: 0 }}
//           //       transition={{ delay: i * 0.04 }}
//           //       className="glass-card"
//           //       style={{ padding: "16px", cursor: "pointer" }}
//           //       onClick={() => onPostClick && onPostClick(item)}
//           //     >
//           //       {/* Badge */}
//           //       <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
//           //         <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: "rgba(233,30,140,0.12)", color: "var(--accent-magenta)", border: "1px solid rgba(233,30,140,0.25)" }}>⚡ Debate</span>
//           //       </div>

//           //       {/* Author */}
//           //       <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
//           //         <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" avatarUrl={item.fan.avatarUrl} />
//           //         <div>
//           //           <p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p>
//           //           <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} · {item.fan.team} • {formatTimeAgo(item.createdAt)}</p>
//           //         </div>
//           //       </div>

//           //       {/* Debate question */}
//           //       {item.text && (
//           //         <p style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, marginBottom: 12, color: "var(--text-primary)" }}>
//           //           {item.text}
//           //         </p>
//           //       )}

//           //       {/* Side buttons */}
//           //       <div style={{ display: "flex", gap: 8, alignItems: "stretch", marginBottom: 10 }}>
//           //         {[
//           //           { agree: true, side: item.sideA || item.text?.split(" VS ")[0] || "Side A", color: "var(--accent-magenta)", bg: "rgba(233,30,140,0.08)", border: "rgba(233,30,140,0.3)", voted: userVote === true },
//           //           { agree: false, side: item.sideB || item.text?.split(" VS ")[1] || "Side B", color: "#60a5fa", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.3)", voted: userVote === false },
//           //         ].map(({ agree, side, color, bg, border, voted }, idx) => (
//           //           <>
//           //             {idx === 1 && (
//           //               <div key="vs" style={{ display: "flex", alignItems: "center", padding: "0 4px" }}>
//           //                 <span className="font-display" style={{ fontSize: 16, color: "var(--text-muted)" }}>VS</span>
//           //               </div>
//           //             )}
//           //             <motion.button
//           //               key={String(agree)}
//           //               whileTap={!hasVoted ? { scale: 0.96 } : {}}
//           //               onClick={(e) => {
//           //                 e.stopPropagation();
//           //                 if (hasVoted) return; // ← one vote only
//           //                 vote(item.id, agree, item.agreePercent || 50, item.userVote, item.isDbPost);
//           //               }}
//           //               style={{
//           //                 flex: 1, padding: "12px", borderRadius: 14, textAlign: "center",
//           //                 background: voted ? color : bg,
//           //                 border: `2px solid ${voted ? color : border}`,
//           //                 color: voted ? "white" : "var(--text-primary)",
//           //                 cursor: hasVoted ? "default" : "pointer",
//           //                 transition: "all 0.2s",
//           //                 opacity: hasVoted && !voted ? 0.5 : 1,
//           //               }}
//           //             >
//           //               <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>
//           //                 {voted ? "✓ " : ""}{side}
//           //               </p>
//           //             </motion.button>
//           //           </>
//           //         ))}
//           //       </div>

//           //       {/* Split progress bar — only shown after voting */}
//           //       {hasVoted && (
//           //         <div style={{ marginBottom: 10 }}>
//           //           <div style={{ display: "flex", borderRadius: 999, overflow: "hidden", height: 6, background: "rgba(255,255,255,0.06)" }}>
//           //             <div style={{ width: `${agrPct}%`, background: "var(--accent-magenta)", transition: "width 0.4s ease" }} />
//           //             <div style={{ width: `${disAgrPct}%`, background: "#60a5fa", transition: "width 0.4s ease" }} />
//           //           </div>
//           //           <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
//           //             <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-magenta)" }}>{agrPct}%</span>
//           //             <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{fmt(liveTotal)} votes</span>
//           //             <span style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa" }}>{disAgrPct}%</span>
//           //           </div>
//           //         </div>
//           //       )}

//           //       {!hasVoted && (
//           //         <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontStyle: "italic" }}>
//           //           Tap a side to vote · results reveal after voting
//           //         </p>
//           //       )}

//           //       {renderCardActions(item)}
//           //     </motion.div>
//           //   );
//           // }


//           // ── DEBATE ─────────────────────────────────────────────────────────────────
//           if (item.type === "debate") {
//             // const userVote = votes[item.id];
//             // const serverVote = item.userVote;
//             // const hasVoted =
//             //   userVote === true || userVote === false ||
//             //   serverVote === "agree" || serverVote === "disagree";
//             // const displayVotedAgree =
//             //   userVote === true ||
//             //   (!Object.prototype.hasOwnProperty.call(votes, item.id) && serverVote === "agree");
//             // const displayVotedDisagree =
//             //   userVote === false ||
//             //   (!Object.prototype.hasOwnProperty.call(votes, item.id) && serverVote === "disagree");
//             const userVote = votes[item.id];
//             const serverVote = item.userVote;
//             const hasVoted =
//               userVote === true || userVote === false ||
//               (userVote === undefined && (serverVote === "agree" || serverVote === "disagree"));
//             const displayVotedAgree =
//               userVote === true ||
//               (userVote === undefined && serverVote === "agree");
//             const displayVotedDisagree =
//               userVote === false ||
//               (userVote === undefined && serverVote === "disagree");
//             const liveTotal = (item.agreeCount ?? 0) + (item.disagreeCount ?? 0);
//             const agrPct = liveTotal > 0 ? Math.round(((item.agreeCount ?? 0) / liveTotal) * 100) : 50;
//             const disAgrPct = 100 - agrPct;

//             return (
//               <motion.div
//                 key={item.id}
//                 initial={{ opacity: 0, y: 16 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: i * 0.04 }}
//                 className="glass-card"
//                 style={{ padding: "16px", cursor: "pointer" }}
//                 onClick={() => onPostClick && onPostClick(item)}
//               >
//                 {/* Badge */}
//                 <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
//                   <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: "rgba(233,30,140,0.12)", color: "var(--accent-magenta)", border: "1px solid rgba(233,30,140,0.25)" }}>⚡ Debate</span>
//                   {hasVoted && (
//                     <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "rgba(233,30,140,0.08)", color: "var(--accent-magenta)", border: "1px solid rgba(233,30,140,0.2)" }}>
//                       🗳️ Already Voted
//                     </span>
//                   )}
//                 </div>

//                 {/* Author */}
//                 <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
//                   <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" avatarUrl={item.fan.avatarUrl} />
//                   <div>
//                     <p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p>
//                     <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} · {item.fan.team} • {formatTimeAgo(item.createdAt)}</p>
//                   </div>
//                 </div>

//                 {/* Debate question */}
//                 {item.text && (
//                   <p style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, marginBottom: 12, color: "var(--text-primary)" }}>
//                     {item.text}
//                   </p>
//                 )}

//                 {/* Side buttons */}
//                 <div style={{ display: "flex", gap: 8, alignItems: "stretch", marginBottom: 10 }}>
//                   {[
//                     { agree: true, side: item.sideA || "Side A", color: "var(--accent-magenta)", bg: "rgba(233,30,140,0.08)", border: "rgba(233,30,140,0.3)", voted: displayVotedAgree },
//                     { agree: false, side: item.sideB || "Side B", color: "#60a5fa", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.3)", voted: displayVotedDisagree },
//                   ].map(({ agree, side, color, bg, border, voted }, idx) => (
//                     <>
//                       {idx === 1 && (
//                         <div key="vs" style={{ display: "flex", alignItems: "center", padding: "0 4px" }}>
//                           <span className="font-display" style={{ fontSize: 16, color: "var(--text-muted)" }}>VS</span>
//                         </div>
//                       )}
//                       <motion.button
//                         key={String(agree)}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           if (hasVoted) return;
//                           vote(item.id, agree, item.agreePercent || 50, item.userVote, item.isDbPost);
//                         }}
//                         disabled={hasVoted}
//                         style={{
//                           flex: 1, padding: "12px", borderRadius: 14, textAlign: "center",
//                           background: voted ? color : bg,
//                           border: `2px solid ${voted ? color : border}`,
//                           color: voted ? "white" : "var(--text-primary)",
//                           cursor: hasVoted ? "not-allowed" : "pointer",
//                           transition: "all 0.2s",
//                           opacity: hasVoted && !voted ? 0.35 : 1,
//                         }}
//                       >
//                         <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>
//                           {voted ? "✓ " : ""}{side}
//                         </p>
//                       </motion.button>
//                     </>
//                   ))}
//                 </div>

//                 {/* Progress bar — always visible */}
//                 <div style={{ marginBottom: 10 }}>
//                   <div style={{ display: "flex", borderRadius: 999, overflow: "hidden", height: 6, background: "rgba(255,255,255,0.06)" }}>
//                     <div style={{ width: `${agrPct}%`, background: "var(--accent-magenta)", transition: "width 0.4s ease" }} />
//                     <div style={{ width: `${disAgrPct}%`, background: "#60a5fa", transition: "width 0.4s ease" }} />
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
//                     <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-magenta)" }}>{agrPct}%</span>
//                     <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{fmt(liveTotal)} votes</span>
//                     <span style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa" }}>{disAgrPct}%</span>
//                   </div>
//                 </div>

//                 {/* Status message — always visible */}
//                 <p style={{
//                   fontSize: 11,
//                   fontWeight: hasVoted ? 600 : 400,
//                   color: hasVoted ? "var(--accent-magenta)" : "var(--text-muted)",
//                   marginBottom: 8,
//                   fontStyle: hasVoted ? "normal" : "italic",
//                 }}>
//                   {hasVoted ? "🗳️ You've already voted · thanks for joining the debate!" : "Tap a side to vote · results reveal after voting"}
//                 </p>

//                 {renderCardActions(item)}
//               </motion.div>
//             );
//           }
//           // ── MEMORY ─────────────────────────────────────────────────────────
//           if (item.type === "raw_reactions") {
//             return (
//               <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card" style={{ padding: "16px", cursor: "pointer" }} onClick={() => onPostClick && onPostClick(item)}>
//                 <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
//                   <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: "rgba(0,232,198,0.1)", color: "var(--teal)", border: "1px solid rgba(0,232,198,0.25)" }}>🕰 Raw Reactions</span>
//                 </div>
//                 <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
//                   <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" avatarUrl={item.fan.avatarUrl} />
//                   <div>
//                     <p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p>
//                     <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} • {formatTimeAgo(item.createdAt)}</p>
//                   </div>
//                 </div>
//                 <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.55, marginBottom: item.memCtx ? 8 : 0 }}>{item.text}</p>
//                 {item.memCtx && <p style={{ fontSize: 12, color: "var(--teal)", fontStyle: "italic", borderLeft: "2px solid var(--teal)", paddingLeft: 10, marginTop: 6 }}>{item.memCtx}</p>}
//                 {item.memGifUrl && (
//                   <img
//                     src={item.memGifUrl}
//                     alt=""
//                     style={{ width: "100%", maxHeight: 180, borderRadius: 10, objectFit: "cover", marginTop: 8 }}
//                   />
//                 )}
//                 {item.memTag && (
//                   <span style={{ fontSize: 11, fontWeight: 700, color: "var(--teal)", marginTop: 6, display: "inline-block" }}>
//                     #{item.memTag}
//                   </span>
//                 )}
//                 <p style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, marginTop: 10 }}>{fmt(item.fanCount ?? 0)} fans · {item.replies ?? 0} replies</p>
//                 {renderCardActions(item)}
//               </motion.div>
//             );
//           }

//           return null;
//         })}
//       </div>
//     </div>
//   );
// }



// components/NewROARComponent/screens/HomeFeed.tsx

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import AvatarWithBadge from "../components/AvatarWithBadge";
import { SplitBar } from "../components/shared";
import { FEED_POSTS, BADGE_LABELS } from "../constants";
import { fmt, clamp, formatTimeAgo } from "../utils";
import {
  Heart, Share2, Flame, TrendingUp, Zap, History, PenTool,
  MessageSquare, Trash2, Brain, Users, CheckCircle2, XCircle, ChevronLeft, ImageIcon,
} from "lucide-react";
import type { Room } from "../types";

const COMPOSE_ACTIONS = [
  { id: "hot_take",      label: "Hot Take",    Icon: Flame      },
  { id: "prediction",    label: "Predict",      Icon: TrendingUp },
  { id: "debate",        label: "Debate",       Icon: Zap        },
  { id: "raw_reactions", label: "Raw Reactions",Icon: History    },
  { id: "post",          label: "Post",         Icon: PenTool    },
];

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

interface QuizCardProps {
  item: any; index: number; activeUsername: string; currentAvatarUrl?: string;
  onPostClick?: (post: any) => void; onToast: (m: string) => void;
  renderCardActions: (item: any) => React.ReactNode;
}

function QuizCard({ item, index, activeUsername, currentAvatarUrl, onPostClick, onToast, renderCardActions }: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(item.quizUserAnswer ?? null);
  const [revealedCorrect, setRevealedCorrect] = useState<string | null>(item.quizCorrectOption ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [participants, setParticipants] = useState<number>(item.quizParticipants ?? 0);
  const hasAnswered = selectedOption !== null;
  const quizOptions: { label: string; text: string }[] = item.quizOptions ?? [];

  const handleOptionClick = useCallback(async (label: string) => {
    if (hasAnswered || submitting) return;
    setSubmitting(true); setSelectedOption(label);
    try {
      const res = await axios.post(`/api/roar/posts/${item.id}/quiz-answer`, { selectedOption: label });
      if (res.data?.success || res.data?.message === "Already answered") {
        setRevealedCorrect(res.data.correctOption);
        setParticipants(res.data.quizParticipants ?? participants + 1);
        if (res.data.isCorrect) onToast("✅ Correct! +2 points awarded");
        else onToast(`❌ Wrong! Correct answer was ${res.data.correctOption}`);
      }
    } catch { setSelectedOption(null); onToast("Failed to submit answer"); }
    finally { setSubmitting(false); }
  }, [hasAnswered, submitting, item.id, participants, onToast]);

  const getOptionStyle = (label: string): React.CSSProperties => {
    const isCorrect = hasAnswered && revealedCorrect === label;
    const isWrong   = hasAnswered && selectedOption === label && revealedCorrect !== null && !isCorrect;
    const base: React.CSSProperties = { padding: "11px 14px", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, transition: "all 0.18s" };
    if (!hasAnswered) return { ...base, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.6 : 1 };
    if (isCorrect)   return { ...base, background: "rgba(0,232,198,0.12)", border: "1px solid rgba(0,232,198,0.4)", cursor: "default" };
    if (isWrong)     return { ...base, background: "rgba(244,67,54,0.1)",  border: "1px solid rgba(244,67,54,0.35)", cursor: "default" };
    return { ...base, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", cursor: "default", opacity: 0.45 };
  };

  const getLabelColor = (label: string) => {
    if (!hasAnswered) return "#4A4A62";
    if (revealedCorrect === label) return "#00E8C6";
    if (selectedOption === label && revealedCorrect !== label) return "#F44336";
    return "#4A4A62";
  };

  return (
    <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="glass-card" style={{ padding: "16px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#E91E8C,#FF6B35,#00E8C6)", borderRadius: "28px 28px 0 0" }} />
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: "rgba(0,232,198,0.12)", color: "#00E8C6", border: "1px solid rgba(0,232,198,0.25)" }}>🧠 Flash Quiz</span>
        {hasAnswered && revealedCorrect && <span style={{ fontSize: 10, fontWeight: 700, color: selectedOption === revealedCorrect ? "#00E8C6" : "#F44336", marginLeft: "auto" }}>{selectedOption === revealedCorrect ? "✓ Correct!" : "✗ Wrong"}</span>}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
        <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" avatarUrl={item.fan.username === activeUsername ? currentAvatarUrl : item.fan.avatarUrl} />
        <div><p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p><p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} · {item.fan.team} • {formatTimeAgo(item.createdAt)}</p></div>
      </div>
      <p style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.5, marginBottom: 14, color: "#F5F5FA", cursor: "pointer" }} onClick={() => onPostClick?.(item)}>{item.quizQuestion || item.text}</p>
      {quizOptions.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {quizOptions.map((opt) => {
            const isCorrect = hasAnswered && revealedCorrect === opt.label;
            const isWrong   = hasAnswered && selectedOption === opt.label && revealedCorrect !== opt.label && revealedCorrect !== null;
            return (
              <motion.div key={opt.label} whileTap={!hasAnswered && !submitting ? { scale: 0.97 } : {}} style={getOptionStyle(opt.label)} onClick={(e) => { e.stopPropagation(); handleOptionClick(opt.label); }}>
                <span style={{ fontSize: 11, fontWeight: 800, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.04em", color: getLabelColor(opt.label), minWidth: 14, flexShrink: 0 }}>{opt.label}</span>
                {hasAnswered && isCorrect && <CheckCircle2 size={13} color="#00E8C6" style={{ flexShrink: 0 }} />}
                {hasAnswered && isWrong   && <XCircle size={13} color="#F44336" style={{ flexShrink: 0 }} />}
                <span style={{ fontSize: 12, fontWeight: 500, color: isCorrect ? "#00E8C6" : isWrong ? "#F44336" : hasAnswered ? "rgba(255,255,255,0.35)" : "#9494AD", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{opt.text || `Option ${opt.label}`}</span>
              </motion.div>
            );
          })}
        </div>
      )}
      {!hasAnswered && <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 6, fontStyle: "italic" }}>Tap an option to answer</p>}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        <Users size={13} color="#9494AD" />
        <span style={{ fontSize: 12, fontWeight: 600, color: "#9494AD" }}>{participants > 0 ? `${participants.toLocaleString()} fan${participants === 1 ? "" : "s"} participated` : "Be the first to answer!"}</span>
      </div>
      {renderCardActions(item)}
    </motion.div>
  );
}

interface Props {
  onJoinRoom: (room?: any) => void; onLeaderboard: () => void; onFanProfile: () => void;
  onToast: (m: string) => void; extraItems: any[]; showBanner: boolean; onDismissBanner: () => void;
  userBadge: string; rooms?: Room[]; dbPosts?: any[]; onPostClick?: (post: any) => void;
  onVote?: (id: string, vote: "agree" | "disagree" | null) => void; onLike?: (id: string) => void;
  onDeletePost?: (id: string) => void; userSports?: string[]; onQuickCompose?: (t: string) => void;
  currentUsername?: string; currentAvatarUrl?: string; onBack?: () => void;
}

export default function HomeFeed({
  onJoinRoom, onLeaderboard, onFanProfile, onToast, extraItems, showBanner, onDismissBanner,
  userBadge, rooms = [], dbPosts = [], onPostClick, onVote, onLike, onDeletePost,
  userSports = [], onQuickCompose, currentUsername: propUsername, currentAvatarUrl, onBack,
}: Props) {
  const [votes, setVotes]           = useState<Record<string, boolean | null>>({});
  const [localLikes, setLocalLikes] = useState<Record<string, { userLiked: boolean; likeCount: number }>>({});
  const [lastActionAt, setLastActionAt] = useState<Record<string, number>>({});
  const [pcts, setPcts]             = useState<Record<string, number>>({});
  const [localUsername, setLocalUsername] = useState("RoarUser");
  const [sharePost, setSharePost]   = useState<ShareableRoarPost | null>(null);
  const [copied, setCopied]         = useState(false);
  const [input, setInput]           = useState("");
  const [uploading, setUploading]   = useState(false);
  const [attachedUrl, setAttachedUrl]   = useState<string | null>(null);
  const [attachedType, setAttachedType] = useState<"image" | "video" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { try { setLocalUsername(localStorage.getItem("roar_username") || "RoarUser"); } catch {} }, []);
  const activeUsername = propUsername || localUsername;

  const openShareDialog  = (post: ShareableRoarPost) => { setSharePost(post); setCopied(false); };
  const closeShareDialog = () => { setSharePost(null); setCopied(false); };
  const handleShareToWhatsApp  = () => { if (!sharePost) return; window.open(`https://wa.me/?text=${encodeURIComponent(buildRoarPostShareText(sharePost))}`, "_blank"); };
  const handleShareToThreads   = () => { if (!sharePost) return; window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(buildRoarPostShareText(sharePost))}`, "_blank"); };
  const handleShareToInstagram = async () => { if (!sharePost) return; await copyToClipboard(buildRoarPostShareText(sharePost)); setCopied(true); setTimeout(() => setCopied(false), 1600); window.open("https://www.instagram.com/", "_blank"); };
  const handleShareToLinkedIn  = () => { if (!sharePost) return; window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(buildRoarPostShareUrl(sharePost))}`, "_blank"); };
  const handleShareToX         = () => { if (!sharePost) return; window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(buildRoarPostShareText(sharePost))}`, "_blank"); };
  const handleCopyLink = async () => {
    if (!sharePost) return;
    const ok = await copyToClipboard(buildRoarPostShareText(sharePost));
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1600); onToast("Link copied to clipboard!"); }
  };

  const shareButtons = (size: string) => (
    <>
      {[
        { handler: handleShareToWhatsApp,  src: "/images/share_whatsapp.png",  alt: "WhatsApp"  },
        { handler: handleShareToThreads,   src: "/images/share_thread.png",    alt: "Threads"   },
        { handler: handleShareToInstagram, src: "/images/share_insta.png",     alt: "Instagram" },
        { handler: handleShareToLinkedIn,  src: "/images/Share_linkedin.png",  alt: "LinkedIn"  },
        { handler: handleShareToX,         src: "/images/Share_X.png",         alt: "X"         },
        { handler: handleCopyLink,         src: "/images/share_copy_link.png", alt: "Copy"      },
      ].map(({ handler, src, alt }) => (
        <button key={alt} onClick={handler} className={`${size} shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center`} type="button">
          <Image src={src} alt={alt} width={36} height={36} className="w-full h-full object-cover rounded-full" />
        </button>
      ))}
    </>
  );

  useEffect(() => {
    if (dbPosts.length === 0) return;
    const nowMs = Date.now();
    setVotes(prev => {
      const next = { ...prev };
      dbPosts.forEach(p => {
        const id = p.postId; if (nowMs - (lastActionAt[id] || 0) < 15000) return;
        if (p.userVote === "agree") next[id] = true;
        else if (p.userVote === "disagree") next[id] = false;
        else next[id] = null;
      });
      return next;
    });
    setLocalLikes(prev => {
      const next = { ...prev };
      dbPosts.forEach(p => {
        const id = p.postId; if (nowMs - (lastActionAt[id] || 0) < 15000) return;
        next[id] = { userLiked: p.userLiked ?? false, likeCount: p.likeCount ?? 0 };
      });
      return next;
    });
  }, [dbPosts, lastActionAt]);

  const vote = (id: string, agree: boolean, initialAgreePercent: number, initialUserVote: "agree" | "disagree" | null, isDbPost?: boolean) => {
    const cv = votes[id];
    if (cv === true || cv === false || initialUserVote === "agree" || initialUserVote === "disagree") return;
    setVotes(v => ({ ...v, [id]: agree }));
    setLastActionAt(p => ({ ...p, [id]: Date.now() }));
    setPcts(p => ({ ...p, [id]: clamp(initialAgreePercent + (agree ? 3 : -3), 1, 99) }));
    if (isDbPost && onVote) onVote(id, agree ? "agree" : "disagree");
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

  const sendQuickPost = async () => {
    const text = input.trim();
    if (!text && !attachedUrl) return;
    try {
      await axios.post("/api/roar/posts", { type: "post", text: text || "Shared media", sport: "cricket", mediaUrls: attachedUrl ? [attachedUrl] : undefined });
      onToast("✏️ Post is live!");
      setInput(""); setAttachedUrl(null); setAttachedType(null);
    } catch { onToast("Failed to post"); }
  };

  const renderCardActions = (item: any) => {
    const lo = localLikes[item.id];
    const userLiked = lo !== undefined ? lo.userLiked : (item.userLiked ?? false);
    const likeCount = lo !== undefined ? lo.likeCount : (item.likeCount ?? 0);
    return (
      <div style={{ display: "flex", gap: 16, marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
        <button onClick={e => { e.stopPropagation(); setLocalLikes(p => ({ ...p, [item.id]: { userLiked: !userLiked, likeCount: Math.max(0, likeCount + (userLiked ? -1 : 1)) } })); setLastActionAt(p => ({ ...p, [item.id]: Date.now() })); onLike?.(item.id); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: userLiked ? "#ff4a7d" : "#9494ad", fontSize: 13, fontWeight: 600 }}>
          <Heart size={16} fill={userLiked ? "#ff4a7d" : "none"} /><span>{likeCount}</span>
        </button>
        <button onClick={e => { e.stopPropagation(); onPostClick?.(item); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#9494ad", fontSize: 13, fontWeight: 600 }}>
          <MessageSquare size={16} /><span>{item.replies || 0}</span>
        </button>
        <button onClick={e => { e.stopPropagation(); openShareDialog(item); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#9494ad", fontSize: 13, fontWeight: 600 }}>
          <Share2 size={16} /><span>Share</span>
        </button>
        {item.fan?.username === activeUsername && (
          <button onClick={e => { e.stopPropagation(); if (window.confirm("Delete this post?")) onDeletePost?.(item.id); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#f87171", marginLeft: "auto", padding: 4, borderRadius: "50%" }}>
            <Trash2 size={16} />
          </button>
        )}
      </div>
    );
  };

  const mappedDbPosts = dbPosts.map(p => {
    const ag = p.agreeCount ?? 0; const di = p.disagreeCount ?? 0; const tot = ag + di;
    return {
      id: p.postId, type: p.type, sport: p.sport || "cricket",
      fan: { username: p.authorUsername || "RoarUser", badge: p.authorBadge || "RISING_FAN", team: p.sport === "cricket" ? "India" : "MCFC", avatarUrl: p.authorAvatarUrl || p.avatarUrl || (p.authorUsername === activeUsername ? currentAvatarUrl : undefined) },
      text: p.text, agreePercent: tot > 0 ? Math.round((ag / tot) * 100) : 50,
      agreeCount: ag, disagreeCount: di, fanCount: tot + (p.type === "hot_take" ? 47 : 1240),
      replies: p.replyCount ?? 0, following: false, isLive: false,
      match: p.matchId || (p.type === "prediction" ? (p.sport === "cricket" ? "IND vs AUS · 3rd Test" : "ISL 2025") : undefined),
      isDbPost: true, userVote: p.userVote, sideA: p.sideA, sideB: p.sideB, memCtx: p.memCtx,
      mediaUrls: p.mediaUrls, memGifUrl: p.memGifUrl, memTag: p.memTag,
      likeCount: p.likeCount ?? 0, userLiked: p.userLiked ?? false, createdAt: p.createdAt,
      quizQuestion: p.quizQuestion, quizOptions: p.quizOptions, quizCorrectOption: p.quizCorrectOption,
      quizUserAnswer: p.quizUserAnswer, quizTimer: p.quizTimer, quizPoints: p.quizPoints, quizParticipants: p.quizParticipants ?? 0,
    };
  });

  const allPosts = [...mappedDbPosts, ...extraItems, ...FEED_POSTS];

  const shareRoomLink = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "SF360 Infinity Room", url: window.location.href });
    } else { copyToClipboard(window.location.href); onToast("Link copied!"); }
  };

  return (
    // Outer: flex column, fills its motion.div parent (which is flex:1 minHeight:0)
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflow: "hidden", position: "relative" }}>

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

      {/* HEADER */}
      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 12px", background: "rgba(14,14,20,0.98)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", zIndex: 30 }}>
        <button type="button" onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "white", display: "flex", alignItems: "center", padding: 0, marginRight: 10 }}>
          <ChevronLeft size={26} />
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: "0.04em", color: "#fff", margin: 0, lineHeight: 1.1 }}>SF360 Infinity Room</p>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
            <span className="live-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--live-green)", display: "inline-block" }} />
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", color: "var(--live-green)" }}>LIVE</span>
          </div>
        </div>
        <button type="button" onClick={shareRoomLink} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "8px 10px", cursor: "pointer", color: "rgba(255,255,255,0.75)", display: "flex", alignItems: "center" }}>
          <Share2 size={18} />
        </button>
      </div>

      {/* POSTS FEED — flex:1 + minHeight:0 makes it fill remaining space and scroll */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch" as any,
        touchAction: "pan-y",
        padding: "12px 16px 0",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingBottom: 24 }}>
          {allPosts.map((item, i) => {
            if (item.type === "quiz") {
              return <QuizCard key={item.id} item={item} index={i} activeUsername={activeUsername} currentAvatarUrl={currentAvatarUrl} onPostClick={onPostClick} onToast={onToast} renderCardActions={renderCardActions} />;
            }

            if (item.type === "hot_take" || item.type === "prediction" || item.type === "post") {
              const pct = pcts[item.id] ?? item.agreePercent ?? 50;
              const userVote  = votes[item.id];
              const liveTotal = (item.agreeCount ?? 0) + (item.disagreeCount ?? 0);
              const agrPct    = liveTotal > 0 ? Math.round(((item.agreeCount ?? 0) / liveTotal) * 100) : pct;
              const disAgrPct = liveTotal > 0 ? Math.round(((item.disagreeCount ?? 0) / liveTotal) * 100) : 100 - pct;
              return (
                <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card" style={{ padding: 16, cursor: "pointer" }} onClick={() => onPostClick?.(item)}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: item.type === "hot_take" ? "rgba(239,68,68,0.12)" : item.type === "post" ? "rgba(233,30,140,0.12)" : "rgba(255,107,53,0.12)", color: item.type === "hot_take" ? "#f87171" : item.type === "post" ? "var(--accent-magenta)" : "var(--accent-orange)", border: `1px solid ${item.type === "hot_take" ? "rgba(239,68,68,0.2)" : item.type === "post" ? "rgba(233,30,140,0.2)" : "rgba(255,107,53,0.2)"}` }}>{item.type === "hot_take" ? "🔥 Hot Take" : item.type === "post" ? "✏️ Post" : "📊 Prediction"}</span>
                    {item.type !== "post" && <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: item.sport === "cricket" ? "rgba(34,197,94,0.1)" : "rgba(59,130,246,0.1)", color: item.sport === "cricket" ? "#22c55e" : "#60a5fa", border: `1px solid ${item.sport === "cricket" ? "rgba(34,197,94,0.2)" : "rgba(59,130,246,0.2)"}`, textTransform: "uppercase" }}>{item.sport === "cricket" ? "🏏 Cricket" : "⚽ Football"}</span>}
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                    <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" avatarUrl={item.fan.avatarUrl} />
                    <div><p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p><p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} · {item.fan.team} • {formatTimeAgo(item.createdAt)}</p></div>
                  </div>
                  <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.5, marginBottom: 12 }}>{item.text}</p>
                  {item.mediaUrls?.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                      {item.mediaUrls.map((url: string, idx: number) => url.endsWith(".mp4") || url.includes("/video/upload/") ? <video key={idx} src={url} controls style={{ width: "100%", maxHeight: 300, borderRadius: 12, objectFit: "cover" }} onClick={e => e.stopPropagation()} /> : <img key={idx} src={url} alt="" style={{ width: "100%", maxHeight: 300, borderRadius: 12, objectFit: "cover" }} />)}
                    </div>
                  )}
                  {item.match && <p style={{ fontSize: 11, color: "var(--accent-magenta)", marginBottom: 8, fontWeight: 600 }}>{item.match}</p>}
                  {item.type === "hot_take" && (
                    <>
                      <div style={{ marginBottom: 10 }}><SplitBar left={pct} /></div>
                      <p style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, marginBottom: 12 }}>{fmt(item.fanCount ?? 0)} fans · {item.replies ?? 0} replies</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        {[{ agree: true, label: "Agree", pctVal: agrPct, active: userVote === true, color: "var(--accent-magenta)" }, { agree: false, label: "Disagree", pctVal: disAgrPct, active: userVote === false, color: "var(--accent-orange)" }].map(({ agree, label, pctVal, active, color }) => (
                          <motion.button key={label} whileTap={{ scale: 0.93 }} onClick={e => { e.stopPropagation(); vote(item.id, agree, item.agreePercent, item.userVote, item.isDbPost); }} style={{ flex: 1, padding: 10, borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer", border: `2.5px solid ${color}`, background: active ? color : "rgba(255,255,255,0.02)", color: active ? "white" : color, boxShadow: active ? `0 0 16px ${color}60` : "none", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            {active ? `✓ ${agree ? "Agreed" : "Disagreed"}` : label}
                            <span style={{ fontSize: 11, fontWeight: 800, background: active ? "rgba(255,255,255,0.2)" : `${color}22`, borderRadius: 999, padding: "1px 7px" }}>{pctVal}%</span>
                          </motion.button>
                        ))}
                      </div>
                      {renderCardActions(item)}
                    </>
                  )}
                  {item.type === "prediction" && (
                    <div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                        {[{ agree: true, label: "Support", pctVal: agrPct, active: userVote === true, color: "#22c55e" }, { agree: false, label: "Counter", pctVal: disAgrPct, active: userVote === false, color: "var(--accent-magenta)" }].map(({ agree, label, pctVal, active, color }) => (
                          <motion.button key={label} whileTap={{ scale: 0.93 }} onClick={e => { e.stopPropagation(); vote(item.id, agree, item.agreePercent, item.userVote, item.isDbPost); }} style={{ flex: 1, padding: 10, borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer", border: `2.5px solid ${color}`, background: active ? color : "rgba(255,255,255,0.02)", color: active ? "white" : color, boxShadow: active ? `0 0 16px ${color}60` : "none", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                            {active ? `✓ ${agree ? "Supported" : "Countered"}` : label}
                            <span style={{ fontSize: 11, fontWeight: 800, background: active ? "rgba(255,255,255,0.2)" : `${color}22`, borderRadius: 999, padding: "1px 7px" }}>{pctVal}%</span>
                          </motion.button>
                        ))}
                      </div>
                      {renderCardActions(item)}
                    </div>
                  )}
                  {item.type === "post" && renderCardActions(item)}
                </motion.div>
              );
            }

            if (item.type === "debate") {
              const userVote  = votes[item.id]; const sv = item.userVote;
              const hasVoted  = userVote === true || userVote === false || (userVote === undefined && (sv === "agree" || sv === "disagree"));
              const votedA    = userVote === true  || (userVote === undefined && sv === "agree");
              const votedB    = userVote === false || (userVote === undefined && sv === "disagree");
              const liveTotal = (item.agreeCount ?? 0) + (item.disagreeCount ?? 0);
              const agrPct    = liveTotal > 0 ? Math.round(((item.agreeCount ?? 0) / liveTotal) * 100) : 50;
              const disAgrPct = 100 - agrPct;
              return (
                <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card" style={{ padding: 16, cursor: "pointer" }} onClick={() => onPostClick?.(item)}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: "rgba(233,30,140,0.12)", color: "var(--accent-magenta)", border: "1px solid rgba(233,30,140,0.25)" }}>⚡ Debate</span>
                    {hasVoted && <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "rgba(233,30,140,0.08)", color: "var(--accent-magenta)", border: "1px solid rgba(233,30,140,0.2)" }}>🗳️ Already Voted</span>}
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                    <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" avatarUrl={item.fan.avatarUrl} />
                    <div><p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p><p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} · {item.fan.team} • {formatTimeAgo(item.createdAt)}</p></div>
                  </div>
                  {item.text && <p style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, marginBottom: 12, color: "var(--text-primary)" }}>{item.text}</p>}
                  <div style={{ display: "flex", gap: 8, alignItems: "stretch", marginBottom: 10 }}>
                    {[{ agree: true, side: item.sideA || "Side A", color: "var(--accent-magenta)", bg: "rgba(233,30,140,0.08)", border: "rgba(233,30,140,0.3)", voted: votedA }, { agree: false, side: item.sideB || "Side B", color: "#60a5fa", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.3)", voted: votedB }].map(({ agree, side, color, bg, border, voted }, idx) => (
                      <>
                        {idx === 1 && <div key="vs" style={{ display: "flex", alignItems: "center", padding: "0 4px" }}><span className="font-display" style={{ fontSize: 16, color: "var(--text-muted)" }}>VS</span></div>}
                        <motion.button key={String(agree)} onClick={e => { e.stopPropagation(); if (!hasVoted) vote(item.id, agree, item.agreePercent || 50, item.userVote, item.isDbPost); }} disabled={hasVoted} style={{ flex: 1, padding: 12, borderRadius: 14, textAlign: "center", background: voted ? color : bg, border: `2px solid ${voted ? color : border}`, color: voted ? "white" : "var(--text-primary)", cursor: hasVoted ? "not-allowed" : "pointer", transition: "all 0.2s", opacity: hasVoted && !voted ? 0.35 : 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{voted ? "✓ " : ""}{side}</p>
                        </motion.button>
                      </>
                    ))}
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", borderRadius: 999, overflow: "hidden", height: 6, background: "rgba(255,255,255,0.06)" }}>
                      <div style={{ width: `${agrPct}%`, background: "var(--accent-magenta)", transition: "width 0.4s" }} />
                      <div style={{ width: `${disAgrPct}%`, background: "#60a5fa", transition: "width 0.4s" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-magenta)" }}>{agrPct}%</span>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{fmt(liveTotal)} votes</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa" }}>{disAgrPct}%</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, fontWeight: hasVoted ? 600 : 400, color: hasVoted ? "var(--accent-magenta)" : "var(--text-muted)", marginBottom: 8, fontStyle: hasVoted ? "normal" : "italic" }}>{hasVoted ? "🗳️ You've already voted · thanks!" : "Tap a side to vote · results reveal after voting"}</p>
                  {renderCardActions(item)}
                </motion.div>
              );
            }

            if (item.type === "raw_reactions") {
              return (
                <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card" style={{ padding: 16, cursor: "pointer" }} onClick={() => onPostClick?.(item)}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: "rgba(0,232,198,0.1)", color: "var(--teal)", border: "1px solid rgba(0,232,198,0.25)" }}>🕰 Raw Reactions</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                    <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" avatarUrl={item.fan.avatarUrl} />
                    <div><p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p><p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} • {formatTimeAgo(item.createdAt)}</p></div>
                  </div>
                  <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.55, marginBottom: item.memCtx ? 8 : 0 }}>{item.text}</p>
                  {item.memCtx && <p style={{ fontSize: 12, color: "var(--teal)", fontStyle: "italic", borderLeft: "2px solid var(--teal)", paddingLeft: 10, marginTop: 6 }}>{item.memCtx}</p>}
                  {item.memGifUrl && <img src={item.memGifUrl} alt="" style={{ width: "100%", maxHeight: 180, borderRadius: 10, objectFit: "cover", marginTop: 8 }} />}
                  {item.memTag && <span style={{ fontSize: 11, fontWeight: 700, color: "var(--teal)", marginTop: 6, display: "inline-block" }}>#{item.memTag}</span>}
                  <p style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, marginTop: 10 }}>{fmt(item.fanCount ?? 0)} fans · {item.replies ?? 0} replies</p>
                  {renderCardActions(item)}
                </motion.div>
              );
            }

            return null;
          })}
        </div>
      </div>

      {/* ── BOTTOM COMPOSER ──
          flexShrink:0 as a flex-column sibling — naturally sits below the scroll
          area. No position:sticky needed (and sticky breaks with overflow:hidden
          parents anyway). This renders on both mobile and desktop. */}
      <div style={{
        flexShrink: 0,
        zIndex: 40,
        background: "rgba(14,14,20,0.98)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
      }}>
        {/* Input row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px 8px" }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendQuickPost()}
            placeholder="What's on your mind?"
            disabled={uploading}
            style={{ flex: 1, height: 42, borderRadius: 999, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", paddingLeft: 16, paddingRight: 12, color: "white", fontSize: 14, outline: "none" }}
          />
          <button type="button" onClick={() => triggerUpload("image")} disabled={uploading} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", padding: 4, display: "flex", alignItems: "center" }}>
            <ImageIcon size={22} />
          </button>
        </div>

        {/* Attached media preview */}
        {attachedUrl && (
          <div style={{ margin: "0 14px 8px", padding: "8px 12px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {attachedType === "image" ? <img src={attachedUrl} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} alt="" /> : <video src={attachedUrl} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />}
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Media attached</span>
            </div>
            <button type="button" onClick={() => { setAttachedUrl(null); setAttachedType(null); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16 }}>✕</button>
          </div>
        )}

        {/* Category icon pill buttons */}
        <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "8px 8px 10px" }}>
          {COMPOSE_ACTIONS.map(({ id, label, Icon }) => (
            <motion.button
              key={id}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (id === "post" && (input.trim() || attachedUrl)) { sendQuickPost(); }
                else { onQuickCompose?.(id); }
              }}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "6px 4px", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, cursor: "pointer", margin: "0 3px", color: "rgba(255,255,255,0.75)" }}
            >
              <Icon size={18} />
              <span style={{ fontSize: 10, fontWeight: 600, lineHeight: 1, textAlign: "center" }}>{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
    </div>
  );
}