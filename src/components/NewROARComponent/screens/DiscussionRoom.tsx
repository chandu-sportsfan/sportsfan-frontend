
// import { useState, useEffect, useRef, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { useUserProfile } from "@/context/UserProfileContext";
// import axios from "axios";
// import AvatarWithBadge from "../components/AvatarWithBadge";
// import ReactionPicker, { type Reaction } from "../components/ReactionPicker";
// import ReactionsDialog from "../components/ReactionsDialog";
// import ActiveFansDialog from "../components/ActiveFansDialog";
// import EmojiPicker from "@emoji-mart/react";
// import data from "@emoji-mart/data";
// import { roarApi } from "@/lib/roarApi";
// import { RADIAL_OPTS } from "../constants";
// import {
//   Image, ChevronLeft, Flame, TrendingUp, Zap, History, PenTool,
//   Brain, Users, CheckCircle2, XCircle,
//   Share2, Send, ChevronDown, ChevronUp, Clock,
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
//   currentUserId?: string;
//   onRegisterRefresh?: (fn: () => void) => void;
//   onRegisterReplyUpdate?: (fn: (postId: string, count: number) => void) => void;
//   onFanProfile?: (fan: any) => void;
//   watchAlongRoomId?: string;
// }

// const MODE_COLOR: Record<string, string> = {
//   post: "var(--text-primary)",
//   prediction: "var(--gold)",
//   hottake: "#f87171",
//   debate: "#e91e8c",
//   raw_reactions: "#00e8c6",
// };

// const LOAD_MORE_PAGE_SIZE = 15;

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

// const commentAccentColor = (type: string) => {
//   if (type === "prediction") return "#22c55e";
//   if (type === "hottake") return "#f87171";
//   if (type === "raw_reactions") return "#00e8c6";
//   return "#e91e8c";
// };

// // ── ActiveFansStack ──────────────────────────────────────────────────────────
// function ActiveFansStack({
//   fans, count, totalJoinCount, onClick,
// }: {
//   fans: { uid: string; username: string; avatarUrl?: string | null }[];
//   count: number;
//   totalJoinCount?: number;
//   onClick: () => void;
// }) {
//   if (count === 0 && !totalJoinCount) return null;
//   const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
//   return (
//     <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//       <button type="button" onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
//         <div style={{ display: "flex" }}>
//           {fans.slice(0, 3).map((fan, i) => (
//             <div key={fan.uid} style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #0e0e14", overflow: "hidden", marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i, background: "linear-gradient(135deg,#e91e8c,#ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//               {fan.avatarUrl ? <img src={fan.avatarUrl} alt={fan.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>{fan.username?.[0]?.toUpperCase() || "?"}</span>}
//             </div>
//           ))}
//         </div>
//         <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
//           <span style={{ color: "#fff", fontWeight: 700 }}>{formatCount(count)}</span> active now
//         </span>
//       </button>
//       {totalJoinCount !== undefined && totalJoinCount > 0 && (
//         <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
//           Total Joined <span style={{ color: "#fff", fontWeight: 700 }}>{formatCount(totalJoinCount)}</span>
//         </span>
//       )}
//     </div>
//   );
// }

// // ── Thread sort: interleave replies directly below the comment they @mention ──
// // Input: flat list sorted oldest→newest.
// // Output: reordered so every "@username …" reply sits immediately after
// //         the most recent comment by that username that came before it.

// // Check whether a stored authorUsername matches a @mention token.
// // Handles cases like:
// //   mention="Prince"   username="Prince Chandu"  → match (first word)
// //   mention="Chandu"   username="chandu_srikakulam" → match (first segment before _)
// //   mention="Prince"   username="prince_chandu"   → match (first segment before _)
// function mentionMatchesAuthor(mentionToken: string, authorUsername: string): boolean {
//   const mention = mentionToken.toLowerCase().trim();
//   const uname = (authorUsername ?? "").toLowerCase().trim();

//   // exact full match
//   if (uname === mention) return true;

//   // split username by space, underscore, dot — check if any segment equals mention
//   const segments = uname.split(/[\s_\.]+/).filter(Boolean);
//   if (segments.some(seg => seg === mention)) return true;

//   // check if mention equals the first N words of the display name
//   // e.g. mention="prince chandu" vs username="prince chandu" already caught above,
//   // but also "princechandu" vs segments
//   if (segments.join("") === mention.replace(/\s+/g, "")) return true;

//   return false;
// }

// function threadSort(flat: any[]): any[] {
//   const result: any[] = [];

//   for (const comment of flat) {
//     const text: string = (comment.text ?? "").trimStart();
//     const mentionMatch = text.match(/^@(\S+)/);

//     if (mentionMatch) {
//       const mentionToken = mentionMatch[1];
//       // find the last comment in result whose author matches the @mention
//       let insertAfter = -1;
//       for (let i = result.length - 1; i >= 0; i--) {
//         if (mentionMatchesAuthor(mentionToken, result[i].authorUsername ?? "")) {
//           insertAfter = i;
//           break;
//         }
//       }
//       if (insertAfter >= 0) {
//         // skip past any replies already nested directly under that parent
//         let insertAt = insertAfter + 1;
//         while (
//           insertAt < result.length &&
//           (result[insertAt].text ?? "").trimStart().match(/^@/)
//         ) {
//           insertAt++;
//         }
//         result.splice(insertAt, 0, comment);
//         continue;
//       }
//     }
//     // no mention or mentioned user not found yet → append normally
//     result.push(comment);
//   }

//   return result;
// }

// // ── InlineSection: replies preview + comment input (all-in-one) ──────────────
// // Uses the correct endpoint: /api/roar/rooms/${roomId}/messages/${postId}/comments
// function InlineSection({
//   postId,
//   roomId,
//   isOpen,
//   onOpenFull,
//   accentColor,
//   currentAvatarUrl,
//   onCommentPosted,
// }: {
//   postId: string;
//   roomId: string;
//   isOpen: boolean;
//   onOpenFull: () => void;
//   accentColor: string;
//   currentAvatarUrl?: string;
//   onCommentPosted: () => void;
// }) {
//   const [replies, setReplies] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [commentText, setCommentText] = useState("");
//   const [sending, setSending] = useState(false);
//   // replyTo: { commentId, authorUsername } — for @mention threading
//   const [replyTo, setReplyTo] = useState<{ commentId: string; authorUsername: string } | null>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const fetchReplies = useCallback(async () => {
//     setLoading(true);
//     try {
//       // ✅ correct endpoint: /api/roar/rooms/[roomId]/messages/[msgId]/comments
//       const res = await axios.get(`/api/roar/rooms/${roomId}/messages/${postId}/comments`, {
//         params: { limit: 50 }, // fetch enough to show good preview
//       });
//       const list: any[] = res.data?.comments ?? [];
//       // API returns desc (newest first) → reverse to oldest first → thread sort → take last 4 for preview
//       const oldestFirst = [...list].reverse();
//       const threaded = threadSort(oldestFirst);
//       // show up to 4 comments in inline preview
//       setReplies(threaded.slice(0, 4));
//     } catch {
//       setReplies([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [postId, roomId]);

//   useEffect(() => {
//     if (isOpen) {
//       fetchReplies();
//       setTimeout(() => inputRef.current?.focus(), 180);
//     }
//   }, [isOpen, fetchReplies]);

//   const handleSend = async () => {
//     const fullText = replyTo
//       ? `@${replyTo.authorUsername} ${commentText.trim()}`
//       : commentText.trim();
//     if (!fullText || sending) return;
//     setSending(true);
//     try {
//       // ✅ correct POST endpoint
//       await axios.post(`/api/roar/rooms/${roomId}/messages/${postId}/comments`, { text: fullText });
//       setCommentText("");
//       setReplyTo(null);
//       onCommentPosted();
//       // refresh inline replies after posting so new comment appears in correct threaded position
//       fetchReplies();
//     } catch {
//       // silently fail; parent toast handles errors
//     } finally {
//       setSending(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, height: 0 }}
//       animate={{ opacity: 1, height: "auto" }}
//       exit={{ opacity: 0, height: 0 }}
//       transition={{ duration: 0.22, ease: "easeOut" }}
//       style={{ overflow: "hidden" }}
//       onClick={e => e.stopPropagation()}
//     >
//       <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 0 }}>

//         {/* ── Replies list ── */}
//         {loading ? (
//           <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontStyle: "italic", marginBottom: 8, paddingLeft: 4 }}>Loading replies…</p>
//         ) : replies.length === 0 ? (
//           <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontStyle: "italic", marginBottom: 8, paddingLeft: 4 }}>No replies yet — be the first!</p>
//         ) : (
//           <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
//             {replies.map((r, i) => {
//               // detect if this comment is a reply (@mention at start)
//               const isReply = /^@\S+/.test((r.text ?? "").trimStart());
//               return (
//                 <div
//                   key={r.id ?? r.commentId ?? i}
//                   style={{
//                     display: "flex",
//                     gap: 8,
//                     alignItems: "flex-start",
//                     paddingLeft: isReply ? 28 : 0,
//                     minWidth: 0,
//                     width: "100%",
//                   }}
//                 >
//                   {/* avatar */}
//                   <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#e91e8c,#ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
//                     {r.authorAvatarUrl
//                       ? <img src={r.authorAvatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                       : <span style={{ fontSize: 8, fontWeight: 800, color: "#fff" }}>{(r.authorUsername ?? "?")[0].toUpperCase()}</span>
//                     }
//                   </div>
//                   {/* content */}
//                   <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
//                     {/* author name on its own line — never truncated */}
//                     <span style={{ fontWeight: 700, color: "#fff", fontSize: 13, display: "block", wordBreak: "break-word" }}>
//                       {r.authorUsername ?? "Fan"}
//                     </span>
//                     {/* comment body — @mention highlighted, wraps freely */}
//                     <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.75)", wordBreak: "break-word", overflowWrap: "anywhere" }}>
//                       {isReply ? (() => {
//                         const spaceIdx = (r.text ?? "").indexOf(" ");
//                         const mention = spaceIdx > -1 ? (r.text ?? "").slice(0, spaceIdx) : (r.text ?? "");
//                         const rest = spaceIdx > -1 ? (r.text ?? "").slice(spaceIdx) : "";
//                         return (
//                           <>
//                             <span style={{ color: accentColor, fontWeight: 600 }}>{mention}</span>
//                             {rest}
//                           </>
//                         );
//                       })() : (r.text ?? "")}
//                     </p>
//                     {/* Reply button */}
//                     <button
//                       type="button"
//                       onClick={e => {
//                         e.stopPropagation();
//                         setReplyTo({ commentId: r.id ?? r.commentId, authorUsername: r.authorUsername ?? "Fan" });
//                         setTimeout(() => inputRef.current?.focus(), 80);
//                       }}
//                       style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", padding: 0, marginTop: 3 }}
//                     >
//                       Reply
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//             {/* View all */}
//             <button
//               type="button"
//               onClick={e => { e.stopPropagation(); onOpenFull(); }}
//               style={{ alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: accentColor, padding: 0, marginTop: 2 }}
//             >
//               View all replies →
//             </button>
//           </div>
//         )}

//         {/* ── Reply-to chip ── */}
//         <AnimatePresence>
//           {replyTo && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               style={{ overflow: "hidden", marginBottom: 4 }}
//             >
//               <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 2 }}>
//                 <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Replying to</span>
//                 <span style={{ fontSize: 11, fontWeight: 700, color: accentColor, background: `${accentColor}18`, border: `1px solid ${accentColor}40`, borderRadius: 999, padding: "1px 8px" }}>
//                   @{replyTo.authorUsername}
//                 </span>
//                 <button
//                   type="button"
//                   onClick={e => { e.stopPropagation(); setReplyTo(null); }}
//                   style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: 14, lineHeight: 1, padding: 0 }}
//                 >
//                   ×
//                 </button>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* ── Comment input ── */}
//         <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: `1px solid ${accentColor}40` }}>
//           {currentAvatarUrl ? (
//             <img src={currentAvatarUrl} alt="" style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, objectFit: "cover" }} />
//           ) : (
//             <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#e91e8c,#ff6b35)" }} />
//           )}
//           <input
//             ref={inputRef}
//             type="text"
//             value={commentText}
//             onChange={e => setCommentText(e.target.value)}
//             onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
//             placeholder={replyTo ? `Reply to @${replyTo.authorUsername}…` : "Add a comment…"}
//             style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 13, fontWeight: 500 }}
//           />
//           <button
//             type="button"
//             onClick={e => { e.stopPropagation(); onOpenFull(); }}
//             style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", padding: "0 2px" }}
//           >
//             All
//           </button>
//           <motion.button
//             whileTap={{ scale: 0.9 }}
//             type="button"
//             onClick={e => { e.stopPropagation(); handleSend(); }}
//             disabled={!commentText.trim() || sending}
//             style={{ background: commentText.trim() ? `linear-gradient(135deg,${accentColor},#ff6b35)` : "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: commentText.trim() ? "pointer" : "default", transition: "background 0.2s", flexShrink: 0 }}
//           >
//             <Send size={14} color={commentText.trim() ? "#fff" : "rgba(255,255,255,0.3)"} />
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// // ── QuizCard ─────────────────────────────────────────────────────────────────
// function QuizCard({ post, onToast, onPostClick, roomId, onFanProfile }: { post: any; onToast: (m: string) => void; onPostClick?: (post: any) => void; roomId?: string; onFanProfile?: (fan: any) => void; }) {
//   const [selectedOption, setSelectedOption] = useState<string | null>(post.quizUserAnswer ?? null);
//   const [revealedCorrect, setRevealedCorrect] = useState<string | null>(post.quizCorrectOption ?? null);
//   const [submitting, setSubmitting] = useState(false);
//   const [participants, setParticipants] = useState<number>(post.quizParticipants ?? 0);
//   const hasAnswered = selectedOption !== null;
//   const quizOptions: { label: string; text: string }[] = post.quizOptions ?? [];

//   const handleOptionClick = useCallback(async (label: string) => {
//     if (hasAnswered || submitting) return;
//     setSubmitting(true); setSelectedOption(label);
//     try {
//       const res = await axios.post(`/api/roar/posts/${post.id}/quiz-answer`, { selectedOption: label });
//       if (res.data?.success || res.data?.message === "Already answered") {
//         setRevealedCorrect(res.data.correctOption);
//         setParticipants(res.data.quizParticipants ?? participants + 1);
//         if (res.data.isCorrect) onToast("Correct! +2 points awarded");
//         else onToast(`Wrong! Correct answer was ${res.data.correctOption}`);
//       }
//     } catch { setSelectedOption(null); onToast("Failed to submit answer"); }
//     finally { setSubmitting(false); }
//   }, [hasAnswered, submitting, post.id, participants, onToast]);

//   const getOptionStyle = (label: string): React.CSSProperties => {
//     const isSelected = selectedOption === label;
//     const isCorrect = revealedCorrect === label;
//     const isWrong = hasAnswered && isSelected && revealedCorrect !== null && !isCorrect;
//     if (!hasAnswered) return { padding: "11px 14px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 10, cursor: submitting ? "not-allowed" : "pointer", transition: "all 0.18s", opacity: submitting ? 0.6 : 1 };
//     if (isCorrect) return { padding: "11px 14px", borderRadius: 14, background: "rgba(0,232,198,0.12)", border: "1px solid rgba(0,232,198,0.4)", display: "flex", alignItems: "center", gap: 10, cursor: "default", transition: "all 0.18s" };
//     if (isWrong) return { padding: "11px 14px", borderRadius: 14, background: "rgba(244,67,54,0.1)", border: "1px solid rgba(244,67,54,0.35)", display: "flex", alignItems: "center", gap: 10, cursor: "default", transition: "all 0.18s" };
//     return { padding: "11px 14px", borderRadius: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 10, cursor: "default", opacity: 0.45, transition: "all 0.18s" };
//   };

//   const getLabelColor = (label: string) => {
//     if (!hasAnswered) return "#4A4A62";
//     if (revealedCorrect === label) return "#00E8C6";
//     if (selectedOption === label && revealedCorrect !== label) return "#F44336";
//     return "#4A4A62";
//   };

//   return (
//     <div className="glass-card" style={{ padding: "16px", position: "relative", overflow: "hidden" }}>
//       <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#E91E8C,#FF6B35,#00E8C6)", borderRadius: "28px 28px 0 0" }} />
//       <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
//         <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: "rgba(0,232,198,0.12)", color: "#00E8C6", border: "1px solid rgba(0,232,198,0.25)" }}>🧠 Flash Quiz</span>
//         {hasAnswered && revealedCorrect && <span style={{ fontSize: 10, fontWeight: 700, marginLeft: "auto", color: selectedOption === revealedCorrect ? "#00E8C6" : "#F44336" }}>{selectedOption === revealedCorrect ? "✓ Correct!" : "✗ Wrong"}</span>}
//       </div>
//       <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onFanProfile?.(post.fan); }}>
//         <AvatarWithBadge username={post.fan.username} badge={post.fan.badge} size="sm" avatarUrl={post.fan.avatarUrl} />
//         <div><p style={{ fontWeight: 700, fontSize: 13 }}>{post.fan.username}</p><p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{post.timeAgo}</p></div>
//       </div>
//       <p style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.5, marginBottom: 14, color: "#F5F5FA", cursor: "pointer" }} onClick={() => onPostClick && onPostClick(post)}>{post.quizQuestion || post.text}</p>
//       {quizOptions.length > 0 && (
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
//           {quizOptions.map((opt) => {
//             const isCorrect = hasAnswered && revealedCorrect === opt.label;
//             const isWrong = hasAnswered && selectedOption === opt.label && revealedCorrect !== opt.label && revealedCorrect !== null;
//             return (
//               <motion.div key={opt.label} whileTap={!hasAnswered && !submitting ? { scale: 0.97 } : {}} style={getOptionStyle(opt.label)} onClick={(e) => { e.stopPropagation(); handleOptionClick(opt.label); }}>
//                 <span style={{ fontSize: 11, fontWeight: 800, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em", color: getLabelColor(opt.label), minWidth: 14, flexShrink: 0 }}>{opt.label}</span>
//                 {hasAnswered && isCorrect && <CheckCircle2 size={13} color="#00E8C6" style={{ flexShrink: 0 }} />}
//                 {hasAnswered && isWrong && <XCircle size={13} color="#F44336" style={{ flexShrink: 0 }} />}
//                 <span style={{ fontSize: 12, fontWeight: 500, color: isCorrect ? "#00E8C6" : isWrong ? "#F44336" : hasAnswered ? "rgba(255,255,255,0.35)" : "#9494AD", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{opt.text || `Option ${opt.label}`}</span>
//               </motion.div>
//             );
//           })}
//         </div>
//       )}
//       {!hasAnswered && <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 8, fontStyle: "italic" }}>Tap an option to answer</p>}
//       <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//         <Users size={13} color="#9494AD" />
//         <span style={{ fontSize: 12, fontWeight: 600, color: "#9494AD" }}>{participants > 0 ? `${participants.toLocaleString()} fan${participants === 1 ? "" : "s"} participated` : "Be the first to answer!"}</span>
//       </div>
//     </div>
//   );
// }

// // ── Visibility-aware interval ─────────────────────────────────────────────────
// function useVisibilityInterval(callback: () => void, delay: number) {
//   const savedCallback = useRef(callback);
//   useEffect(() => { savedCallback.current = callback; }, [callback]);
//   useEffect(() => {
//     let id: ReturnType<typeof setInterval>;
//     const start = () => { id = setInterval(() => { if (!document.hidden) savedCallback.current(); }, delay); };
//     const handleVisibility = () => { clearInterval(id); if (!document.hidden) { savedCallback.current(); start(); } };
//     start();
//     document.addEventListener("visibilitychange", handleVisibility);
//     return () => { clearInterval(id); document.removeEventListener("visibilitychange", handleVisibility); };
//   }, [delay]);
// }

// type ShareableRoarPost = { id?: string | number; text?: string; authorUsername?: string; fan?: { username?: string }; };

// function displayUsername(raw: string | undefined | null): string {
//   if (!raw) return "RoarUser";
//   const trimmed = raw.trim();
//   if (!trimmed) return "RoarUser";
//   if (!trimmed.includes("_")) return trimmed;
//   const spaced = trimmed.replace(/_+/g, " ").replace(/\s+/g, " ").trim();
//   if (!spaced) return "RoarUser";
//   return spaced.split(" ").map((word) => (/[A-Z]/.test(word) ? word : word.charAt(0).toUpperCase() + word.slice(1))).join(" ");
// }

// const buildRoarPostShareUrl = (post: ShareableRoarPost) => {
//   if (typeof window === "undefined") return "";
//   const targetUrl = new URL(`${window.location.origin}/MainModules/ROAR`);
//   if (post?.id) targetUrl.searchParams.set("post", String(post.id));
//   return targetUrl.toString();
// };

// const buildRoarPostShareText = (post: ShareableRoarPost) => {
//   const shareUrl = buildRoarPostShareUrl(post);
//   const author = displayUsername(post?.fan?.username || post?.authorUsername || "a Sportsfan");
//   return [`Check out this ROAR post by ${author}`, post?.text || "Join the conversation on Sportsfan ROAR.", `View post: ${shareUrl}`].filter(Boolean).join("\n");
// };

// // ── Main DiscussionRoom ───────────────────────────────────────────────────────
// export default function DiscussionRoom({
//   onBack, onToast, roomId, roomName, onPostClick, onCompose,
//   fanCount = 312, score, scoreSubtitle, currentAvatarUrl, currentUserId: propCurrentUserId, onRegisterRefresh, onRegisterReplyUpdate,
//   onFanProfile, watchAlongRoomId
// }: Props) {
//   const router = useRouter();
//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [input, setInput] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const emojiPickerRef = useRef<HTMLDivElement>(null);
//   const [mode, setMode] = useState<"post" | "debate" | "prediction" | "hottake" | "raw_reactions">("post");
//   const [uploading, setUploading] = useState(false);
//   const [attachedUrl, setAttachedUrl] = useState<string | null>(null);
//   const [attachedType, setAttachedType] = useState<"image" | "video" | null>(null);
//   const [userUsername, setUserUsername] = useState("RoarUser");
//   const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(currentAvatarUrl);
//   const [selectedActionId, setSelectedActionId] = useState("post");
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const [liveCount, setLiveCount] = useState<number>(fanCount ?? 0);
//   const [totalJoinCount, setTotalJoinCount] = useState<number>(0);
//   const [sharePost, setSharePost] = useState<ShareableRoarPost | null>(null);
//   const [copied, setCopied] = useState(false);
//   const { userProfile } = useUserProfile();
//   const [activeFilter, setActiveFilter] = useState<"all" | "post" | "debate" | "prediction">("all");
//   const votingInProgressRef = useRef<Set<string>>(new Set());
//   const currentUserId = propCurrentUserId || userProfile?.actualUserId;
//   const currentUserIdCandidates = [
//     currentUserId,
//     userProfile?.actualUserId,
//     (userProfile as { userId?: string })?.userId,
//     (userProfile as { uid?: string })?.uid,
//     (userProfile as { email?: string })?.email,
//   ].filter(Boolean).map(String);

//   const isCurrentUserAuthor = (post: { authorUid?: unknown; authorEmail?: unknown; fan?: { authorUid?: unknown } }) => {
//     const authorCandidates = [post.authorUid, post.fan?.authorUid, post.authorEmail].filter(Boolean).map(String);
//     return authorCandidates.some(id => currentUserIdCandidates.includes(id));
//   };

//   const latestCreatedAtRef = useRef<number | null>(null);
//   const sendingRef = useRef(false);
//   const [isSending, setIsSending] = useState(false);
//   const [resolvingRoomPredictionId, setResolvingRoomPredictionId] = useState<string | null>(null);

//   // ── Which post has its inline section open (replies + comment input) ─────────
//   const [openInlinePostId, setOpenInlinePostId] = useState<string | null>(null);

//   // ── Notification toast ──────────────────────────────────────────────────────
//   const [notifToast, setNotifToast] = useState<{ message: string; type: "like" | "comment"; } | null>(null);
//   const notifToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   // ── Active fans ─────────────────────────────────────────────────────────────
//   const [activeFans, setActiveFans] = useState<{ uid: string; username: string; avatarUrl?: string | null; badge?: string | null }[]>([]);
//   const [activeFansOpen, setActiveFansOpen] = useState(false);

//   // ── Reactions ───────────────────────────────────────────────────────────────
//   const [localReactions, setLocalReactions] = useState<Record<string, { reaction: Reaction | null; heartCount: number }>>({});
//   const localReactionsRef = useRef<Record<string, { reaction: Reaction | null; heartCount: number }>>({});
//   const pendingReactRef = useRef<Record<string, boolean>>({});
//   const [reactionsMsgId, setReactionsMsgId] = useState<string | null>(null);
//   useEffect(() => { localReactionsRef.current = localReactions; }, [localReactions]);

//   const listRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // ── Pagination ──────────────────────────────────────────────────────────────
//   const [morePosts, setMorePosts] = useState<any[]>([]);
//   const [hasMoreMsgs, setHasMoreMsgs] = useState(true);
//   const [loadingMoreMsgs, setLoadingMoreMsgs] = useState(false);
//   const loadingMoreMsgsRef = useRef(false);
//   const sentinelRef = useRef<HTMLDivElement | null>(null);

//   const topReactionsCache = useRef<Record<string, string[]>>({});
//   const [topReactionsMap, setTopReactionsMap] = useState<Record<string, string[]>>({});

//   const fetchTopReactions = useCallback(async (msgId: string) => {
//     if (topReactionsCache.current[msgId] !== undefined) return;
//     topReactionsCache.current[msgId] = [];
//     try {
//       const url = `/api/roar/posts/${msgId}/reactions${roomId ? `?roomId=${encodeURIComponent(roomId)}` : ""}`;
//       const res = await axios.get(url);
//       const reactors: { reaction: string }[] = res.data?.reactors ?? [];
//       const counts: Record<string, number> = {};
//       reactors.forEach(r => { counts[r.reaction] = (counts[r.reaction] ?? 0) + 1; });
//       const top = Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 3).map(([type]) => type);
//       topReactionsCache.current[msgId] = top;
//       setTopReactionsMap(prev => ({ ...prev, [msgId]: top }));
//     } catch { topReactionsCache.current[msgId] = []; }
//   }, [roomId]);

//   const mapMessage = useCallback((m: any, existing?: any) => {
//     const isPending = pendingReactRef.current[m.msgId];
//     return {
//       id: m.msgId,
//       authorUid: m.authorUid,
//       authorEmail: m.authorEmail,
//       fan: { username: displayUsername(m.authorUsername), authorUid: m.authorUid, badge: m.authorBadge, avatarUrl: m.authorUid === currentUserId ? (userAvatarUrl || m.authorAvatarUrl || m.avatarUrl) : (m.authorAvatarUrl || m.avatarUrl) },
//       text: m.text,
//       fireCount: m.fireCount ?? 0, heartCount: m.heartCount ?? 0, mindblownCount: m.mindblownCount ?? 0,
//       goatCount: m.goatCount ?? 0, clapCount: m.clapCount ?? 0, nochanceCount: m.noChanceCount ?? 0,
//       userReaction: isPending ? (existing?.userReaction ?? null) : (m.userReaction ?? null),
//       replyCount: Math.max(m.replyCount ?? 0, existing?.replyCount ?? 0),
//       agreeCount: m.agreeCount ?? 0, disagreeCount: m.disagreeCount ?? 0,
//       // userVote: m.userVote ?? null, 
//       userVote: (existing?.userVote && !m.userVote) ? existing.userVote : (m.userVote ?? existing?.userVote ?? null),
//       sideA: m.sideA ?? null, sideB: m.sideB ?? null,
//       predictionOptions: Array.isArray(m.predictionOptions) ? m.predictionOptions : [m.sideA, m.sideB].filter(Boolean),
//       predictionOptionCounts: m.predictionOptionCounts ?? {},
//       closesAt: m.closesAt ?? null, closedAt: m.closedAt ?? null,
//       resolvedAt: m.resolvedAt ?? null, correctVote: m.correctVote ?? null,
//       accuracyAwarded: m.accuracyAwarded ?? false,
//       timeAgo: new Date(m.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }) + " · " + new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//       createdAt: m.createdAt, type: m.type, mediaUrls: m.mediaUrls,
//       quizQuestion: m.quizQuestion, quizOptions: m.quizOptions, quizCorrectOption: m.quizCorrectOption,
//       quizUserAnswer: m.quizUserAnswer ?? null, quizTimer: m.quizTimer, quizPoints: m.quizPoints,
//       quizParticipants: m.quizParticipants ?? 0, memGifUrl: m.memGifUrl ?? null, memTag: m.memTag ?? null,
//     };
//   }, [currentUserId, userAvatarUrl]);

//   const loadMoreMsgs = useCallback(async () => {
//     if (!roomId || loadingMoreMsgsRef.current || !hasMoreMsgs) return;
//     const combined = [...posts, ...morePosts];
//     if (combined.length === 0) return;
//     const oldestCreatedAt = combined.reduce((min, p) => (p.createdAt < min ? p.createdAt : min), combined[0].createdAt);
//     loadingMoreMsgsRef.current = true;
//     setLoadingMoreMsgs(true);
//     try {
//       const res = await axios.get(`/api/roar/rooms/${roomId}/messages`, { params: { limit: LOAD_MORE_PAGE_SIZE, lastCreatedAt: oldestCreatedAt } });
//       if (res.data?.success) {
//         const newMsgs: any[] = res.data.messages ?? [];
//         setMorePosts(prev => {
//           const seenIds = new Set([...posts, ...prev].map(p => p.id ?? p.msgId));
//           const fresh = newMsgs.filter(m => !seenIds.has(m.msgId)).map(m => mapMessage(m));
//           return [...fresh, ...prev];
//         });
//         setHasMoreMsgs(Boolean(res.data.pagination?.hasMore));
//       } else { setHasMoreMsgs(false); }
//     } catch (e) { console.error("Failed to load more messages:", e); }
//     finally { loadingMoreMsgsRef.current = false; setLoadingMoreMsgs(false); }
//   }, [roomId, hasMoreMsgs, posts, morePosts, mapMessage]);

//   useEffect(() => {
//     const sentinel = sentinelRef.current;
//     if (!sentinel) return;
//     const observer = new IntersectionObserver((entries) => { if (entries[0]?.isIntersecting) loadMoreMsgs(); }, { root: listRef.current, rootMargin: "200px 0px 0px 0px", threshold: 0 });
//     observer.observe(sentinel);
//     return () => observer.disconnect();
//   }, [loadMoreMsgs]);

//   const openShareDialog = (post: ShareableRoarPost) => { setSharePost(post); setCopied(false); };
//   const closeShareDialog = () => { setSharePost(null); setCopied(false); };
//   const copyToClipboard = async (text: string) => {
//     try { await navigator.clipboard.writeText(text); return true; }
//     catch {
//       try {
//         const el = document.createElement("textarea"); el.value = text; el.style.position = "fixed"; el.style.opacity = "0";
//         document.body.appendChild(el); el.focus(); el.select();
//         const ok = document.execCommand("copy"); document.body.removeChild(el); return ok;
//       } catch { return false; }
//     }
//   };
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

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
//         setShowEmojiPicker(false);
//       }
//     };
//     if (showEmojiPicker) document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [showEmojiPicker]);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) return;
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (!roomId) return;
//     setActiveFans([]); setLiveCount(0); setTotalJoinCount(0);
//     const join = async () => {
//       try {
//         const res = await axios.post(`/api/roar/rooms/${roomId}/presence`);
//         if (res.data?.success) { setLiveCount(res.data.fanCount); if (res.data.totalJoinCount !== undefined) setTotalJoinCount(res.data.totalJoinCount); }
//       } catch (e) { console.error("Join failed:", e); }
//     };
//     const refreshActiveFans = async () => {
//       try {
//         const res = await axios.get(`/api/roar/rooms/${roomId}/presence`);
//         if (res.data?.success) { setActiveFans(res.data.fans ?? []); setLiveCount(res.data.fanCount ?? 0); if (res.data.totalJoinCount !== undefined) setTotalJoinCount(res.data.totalJoinCount); }
//       } catch (e) { console.error("Active fans fetch failed:", e); }
//     };
//     const leaveBeacon = () => { navigator.sendBeacon(`/api/roar/rooms/${roomId}/presence/leave`); };
//     const leaveAxios = () => { axios.delete(`/api/roar/rooms/${roomId}/presence`).catch(() => { }); };
//     // join().then(refreshActiveFans);
//     join().then(() => setTimeout(refreshActiveFans, 2000));
//     const heartbeat = setInterval(() => { if (!document.hidden) join(); }, 30_000);
//     const fanRefresh = setInterval(() => { if (!document.hidden) refreshActiveFans(); }, 120_000);
//     window.addEventListener("beforeunload", leaveBeacon);
//     return () => { leaveAxios(); clearInterval(heartbeat); clearInterval(fanRefresh); window.removeEventListener("beforeunload", leaveBeacon); };
//   }, [roomId]);

//   useEffect(() => {
//     try {
//       setUserUsername(userProfile?.username || localStorage.getItem("roar_username") || "RoarUser");
//       setUserAvatarUrl(currentAvatarUrl || userProfile?.avatarUrl || userProfile?.avatar || localStorage.getItem("roar_avatar_url") || undefined);
//     } catch { }
//   }, [currentAvatarUrl, userProfile]);

//   const fetchMsgs = useCallback(async () => {
//     if (!roomId) return;
//     try {
//       const url = latestCreatedAtRef.current
//         ? `/api/roar/rooms/${roomId}/messages?since=${latestCreatedAtRef.current}&t=${Date.now()}`
//         : `/api/roar/rooms/${roomId}/messages?t=${Date.now()}`;
//       const res = await axios.get(url);
//       if (res.data?.success) {
//         const incoming: any[] = res.data.messages ?? [];
//         if (latestCreatedAtRef.current === null) {
//           setPosts(prev => {
//             const prevMap = Object.fromEntries(prev.map(p => [p.id, p]));
//             return [...res.data.messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((m: any) => mapMessage(m, prevMap[m.msgId]));
//           });
//           if (incoming.length > 0) latestCreatedAtRef.current = Math.max(...incoming.map(m => m.createdAt));
//         } else if (incoming.length > 0) {
//           latestCreatedAtRef.current = Math.max(...incoming.map((m: any) => m.createdAt));
//           setPosts(prev => {
//             const existingIds = new Set(prev.map(p => p.id));
//             const fresh = incoming.filter((m: any) => !existingIds.has(m.msgId)).map((m: any) => ({ ...mapMessage(m), timeAgo: "now" }));
//             return fresh.length > 0 ? [...prev, ...fresh] : prev;
//           });
//         }
//       }
//     } catch (e) { console.error(e); }
//     finally { setLoading(false); }
//   }, [roomId, mapMessage]);

//   useEffect(() => { onRegisterRefresh?.(fetchMsgs); }, [fetchMsgs, onRegisterRefresh]);
//   useEffect(() => {
//     onRegisterReplyUpdate?.((postId, count) => {
//       setPosts(p => p.map(x => x.id === postId ? { ...x, replyCount: count } : x));
//     });
//   }, [onRegisterReplyUpdate]);
//   useEffect(() => { if (!roomId) return; fetchMsgs(); }, [fetchMsgs, roomId]);
//   useVisibilityInterval(fetchMsgs, 15000);

//   const fetchReactionUpdates = useCallback(async () => {
//     // if (!roomId || posts.length === 0) return;
//     if (!roomId) return;
//     try {
//       const res = await axios.get(`/api/roar/rooms/${roomId}/messages?t=${Date.now()}`);
//       if (res.data?.success) {
//         const incoming: any[] = res.data.messages ?? [];
//         setPosts(prev => prev.map(p => {
//           const updated = incoming.find((m: any) => m.msgId === p.id);
//           if (!updated) return p;
//           const isPending = pendingReactRef.current[p.id];
//           // return { ...p, heartCount: isPending ? p.heartCount : (updated.heartCount ?? p.heartCount), userReaction: isPending ? p.userReaction : (updated.userReaction ?? null), replyCount: Math.max(p.replyCount ?? 0, updated.replyCount ?? 0), agreeCount: updated.agreeCount ?? p.agreeCount, disagreeCount: updated.disagreeCount ?? p.disagreeCount };
//           return {
//             ...p,
//             heartCount: isPending ? p.heartCount : (updated.heartCount ?? p.heartCount),
//             userReaction: isPending ? p.userReaction : (updated.userReaction ?? null),
//             replyCount: Math.max(p.replyCount ?? 0, updated.replyCount ?? 0),
//             agreeCount: updated.agreeCount ?? p.agreeCount,
//             disagreeCount: updated.disagreeCount ?? p.disagreeCount,
//             // Never overwrite a local vote with null from polling — server may lag
//             userVote: (p.userVote && !updated.userVote) ? p.userVote : (updated.userVote ?? p.userVote ?? null),
//           };
//         }));
//         setMorePosts(prev => prev.map(p => {
//           const updated = incoming.find((m: any) => m.msgId === p.id);
//           if (!updated) return p;
//           return {
//             ...p,
//             replyCount: Math.max(p.replyCount ?? 0, updated.replyCount ?? 0),
//             agreeCount: updated.agreeCount ?? p.agreeCount,
//             disagreeCount: updated.disagreeCount ?? p.disagreeCount,
//             userVote: (p.userVote && !updated.userVote) ? p.userVote : (updated.userVote ?? p.userVote ?? null),
//           };
//         }));
//         setLocalReactions(prev => {
//           const next = { ...prev };
//           incoming.forEach((m: any) => { if (!pendingReactRef.current[m.msgId]) next[m.msgId] = { reaction: m.userReaction ?? null, heartCount: m.heartCount ?? 0 }; });
//           return next;
//         });
//       }
//     } catch { }
//     // }, [roomId, posts]);
//   }, [roomId]);
//   useVisibilityInterval(fetchReactionUpdates, 5000);

//   const lastNotifCheckRef = useRef<number>(Date.now());
//   const seenNotifIdsRef = useRef<Set<string>>(new Set());
//   useEffect(() => {
//     if (!roomId) return;
//     const checkNotifs = async () => {
//       try {
//         const res = await axios.get("/api/notifications", { params: { uid: userProfile?.actualUserId, email: userProfile?.email } });
//         const notifs: any[] = res.data?.notifications ?? [];
//         const fresh = notifs.filter(n => n.roomId === roomId && !n.isRead && !seenNotifIdsRef.current.has(n.id) && (n.createdAt ?? 0) > lastNotifCheckRef.current);
//         if (fresh.length > 0) {
//           fresh.forEach(n => seenNotifIdsRef.current.add(n.id));
//           const latest = fresh[fresh.length - 1];
//           const type = latest.type === "roar_post_comment" ? "comment" : "like";
//           setNotifToast({ message: latest.message ?? (type === "comment" ? "Someone commented on your post" : "Someone reacted to your post"), type });
//           if (notifToastTimerRef.current) clearTimeout(notifToastTimerRef.current);
//           notifToastTimerRef.current = setTimeout(() => setNotifToast(null), 4000);
//         }
//       } catch { }
//     };
//     lastNotifCheckRef.current = Date.now();
//     const interval = setInterval(checkNotifs, 60000);
//     return () => { clearInterval(interval); if (notifToastTimerRef.current) clearTimeout(notifToastTimerRef.current); };
//   }, [roomId, userProfile?.actualUserId, userProfile?.email]);

//   // useEffect(() => { if (!loading && listRef.current) setTimeout(() => listRef.current?.scrollTo({ top: 0 }), 50); }, [loading]);

//   useEffect(() => {
//     if (!loading && listRef.current)
//       setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight }), 50);
//   }, [loading]);

//   // ADD — scroll to bottom whenever posts array grows
//   const prevPostCountRef = useRef(0);
//   useEffect(() => {
//     const newCount = posts.length;
//     if (newCount > prevPostCountRef.current && listRef.current) {
//       setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
//     }
//     prevPostCountRef.current = newCount;
//   }, [posts.length]);

//   const handleReact = useCallback(async (msgId: string, reaction: Reaction | null) => {
//     if (!roomId || pendingReactRef.current[msgId]) return;
//     const post = posts.find(p => p.id === msgId);
//     const prev = localReactionsRef.current[msgId] ?? { reaction: post?.userReaction ?? null, heartCount: post?.heartCount ?? 0 };
//     const sameReaction = prev.reaction === reaction;
//     const newReaction = sameReaction ? null : reaction;
//     const wasActive = prev.reaction !== null;
//     const newActive = newReaction !== null;
//     const countDelta = newActive && !wasActive ? 1 : (!newActive && wasActive ? -1 : 0);
//     const optimisticState = { reaction: newReaction, heartCount: Math.max(0, prev.heartCount + countDelta) };
//     setLocalReactions(p => ({ ...p, [msgId]: optimisticState }));
//     pendingReactRef.current[msgId] = true;
//     try {
//       const res: any = newReaction === null ? await roarApi.unreactPost(msgId, roomId) : await roarApi.reactPost(msgId, newReaction, roomId);
//       if (res && typeof res.likeCount === "number") setLocalReactions(p => ({ ...p, [msgId]: { ...optimisticState, heartCount: res.likeCount } }));
//     } catch { setLocalReactions(p => ({ ...p, [msgId]: prev })); onToast("Failed to save reaction"); }
//     finally { pendingReactRef.current[msgId] = false; }
//   }, [roomId, posts, onToast]);

//   const getPredictionVoteValue = (optionIndex: number) => (
//     optionIndex === 0 ? "agree" : optionIndex === 1 ? "disagree" : `option_${optionIndex}`
//   );

//   const getPredictionOptionLabel = (voteValue: string | undefined, options: string[]) => {
//     if (!voteValue) return "";
//     if (voteValue === "agree") return options[0] || "Option 1";
//     if (voteValue === "disagree") return options[1] || "Option 2";
//     const optionIndex = Number(voteValue.replace("option_", ""));
//     return Number.isFinite(optionIndex) ? (options[optionIndex] || voteValue) : voteValue;
//   };

//   const formatPredictionCloseLabel = (p: { resolvedAt?: number; closesAt?: number; closedAt?: number }) => {
//     if (p.resolvedAt) return "Resolved";
//     if (!p.closesAt) return "Open";
//     const remaining = p.closesAt - Date.now();
//     if (remaining <= 0 || p.closedAt) return "Closed";
//     const mins = Math.ceil(remaining / 60000);
//     if (mins < 60) return `${mins}m left`;
//     return `${Math.ceil(mins / 60)}h left`;
//   };

//   const resolveRoomPrediction = async (msgId: string, correctVote: string) => {
//     if (!roomId) return;
//     try {
//       setResolvingRoomPredictionId(msgId);
//       const res = await axios.post(`/api/roar/rooms/${roomId}/messages/${msgId}/resolve`, { correctVote });
//       if (res.data?.success) {
//         const resolvedAt = res.data.message?.resolvedAt ?? Date.now();
//         setPosts(prev => prev.map(p => p.id !== msgId ? p : { ...p, resolvedAt, closedAt: res.data.message?.closedAt ?? resolvedAt, correctVote, accuracyAwarded: true }));
//         onToast(`Prediction resolved. ${res.data.correctCount ?? 0} correct fans awarded.`);
//       } else { onToast("Failed to resolve prediction"); }
//     } catch (err: unknown) {
//       const message = axios.isAxiosError(err) ? err.response?.data?.error : undefined;
//       onToast(message || "Failed to resolve prediction");
//     } finally { setResolvingRoomPredictionId(null); }
//   };

//   const triggerUpload = (type: "image" | "video") => {
//     setAttachedType(type);
//     if (fileInputRef.current) { fileInputRef.current.accept = type === "image" ? "image/*" : "video/*"; fileInputRef.current.click(); }
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]; if (!file) return;
//     try {
//       setUploading(true); onToast("Uploading media...");
//       const fd = new FormData(); fd.append("file", file);
//       const res = await axios.post("/api/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
//       if (res.data?.url) { setAttachedUrl(res.data.url); onToast("Media uploaded!"); }
//     } catch { onToast("Upload failed"); setAttachedType(null); }
//     finally { setUploading(false); if (e.target) e.target.value = ""; }
//   };

//   const send = async () => {
//     if (!roomId) return;
//     const text = input.trim();
//     if (!text && !attachedUrl) return;
//     if (sendingRef.current) return;
//     sendingRef.current = true; setIsSending(true);
//     try {
//       const res = await axios.post(`/api/roar/rooms/${roomId}/messages`, { text: text || "Shared media", type: mode, mediaUrls: attachedUrl ? [attachedUrl] : undefined });
//       if (res.data?.success) {
//         const m = res.data.message;
//         setPosts(p => [...p, { id: m.msgId, fan: { username: displayUsername(m.authorUsername), authorUid: m.authorUid, badge: m.authorBadge, avatarUrl: m.authorAvatarUrl || m.avatarUrl || (m.authorUsername === userUsername ? userAvatarUrl : undefined) }, text: m.text, fireCount: m.fireCount ?? 0, heartCount: m.heartCount ?? 0, mindblownCount: m.mindblownCount ?? 0, goatCount: m.goatCount ?? 0, clapCount: m.clapCount ?? 0, nochanceCount: m.noChanceCount ?? 0, userReaction: null, replyCount: 0, agreeCount: 0, disagreeCount: 0, userVote: null, sideA: m.sideA ?? null, sideB: m.sideB ?? null, timeAgo: "now", createdAt: m.createdAt || Date.now(), type: m.type, mediaUrls: m.mediaUrls, quizQuestion: m.quizQuestion, quizOptions: m.quizOptions, quizCorrectOption: m.quizCorrectOption, quizUserAnswer: m.quizUserAnswer ?? null, quizTimer: m.quizTimer, quizPoints: m.quizPoints, quizParticipants: m.quizParticipants ?? 0, memGifUrl: m.memGifUrl ?? null, memTag: m.memTag ?? null }]);
//         setInput(""); setAttachedUrl(null); setAttachedType(null);
//         // setTimeout(() => listRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 50);
//         setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
//       }
//     } catch { onToast("Failed to send message"); }
//     finally { sendingRef.current = false; setIsSending(false); }
//   };

//   const handleBack = (e: React.PointerEvent | React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); onBack(); };
//   const shareRoomLink = () => {
//     if (typeof navigator !== "undefined" && navigator.share) navigator.share({ title: "SF360 Infinity Room", url: window.location.href });
//     else { copyToClipboard(window.location.href); onToast("Link copied!"); }
//   };

//   const composeIconMap: Record<string, React.ReactNode> = {
//     hot_take: <Flame size={13} stroke="url(#dr-pink-orange-grad)" fill="url(#dr-pink-orange-grad)" />,
//     prediction: <TrendingUp size={13} stroke="url(#dr-pink-orange-grad)" />,
//     debate: <Zap size={13} stroke="url(#dr-pink-orange-grad)" fill="url(#dr-pink-orange-grad)" />,
//     memory: <History size={13} stroke="url(#dr-pink-orange-grad)" />,
//     post: <PenTool size={13} stroke="url(#dr-pink-orange-grad)" />,
//     quiz: <Brain size={13} stroke="url(#dr-pink-orange-grad)" />,
//   };

//   const renderReactionPicker = (p: any) => {
//     const lo = localReactions[p.id];
//     const currentReaction: Reaction | null = lo !== undefined ? lo.reaction : (p.userReaction ?? null);
//     const heartCount = lo !== undefined ? lo.heartCount : (p.heartCount ?? 0);
//     return (
//       <div onClick={e => e.stopPropagation()}>
//         <ReactionPicker currentReaction={currentReaction} count={heartCount} onReact={(r) => handleReact(p.id, r)} />
//       </div>
//     );
//   };

//   const REACTION_EMOJI: Record<string, string> = { fire: "🔥", heart: "❤️", mindblown: "🤯", goat: "🐐", clap: "👏", nochance: "🙅", laugh: "😂", sad: "😢", thumb: "👍" };

//   const renderReactionsTrigger = (p: any) => {
//     const lo = localReactions[p.id];
//     const heartCount = lo !== undefined ? lo.heartCount : (p.heartCount ?? 0);
//     if (heartCount === 0) return null;
//     const topReactions = topReactionsMap[p.id] ?? [];
//     if (topReactions.length === 0 && !topReactionsCache.current[p.id]) fetchTopReactions(p.id);
//     const currentReaction = lo?.reaction ?? p.userReaction ?? null;
//     const displayReactions = topReactions.length > 0 ? topReactions : currentReaction ? [currentReaction] : [];
//     if (displayReactions.length === 0) return null;
//     return (
//       <motion.button whileTap={{ scale: 0.93 }} onClick={e => { e.stopPropagation(); setReactionsMsgId(p.id); }} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", marginLeft: "auto", padding: 0 }} title="See who reacted">
//         <div style={{ display: "flex" }}>
//           {displayReactions.map((type, i) => (
//             <div key={type} style={{ width: 20, height: 20, borderRadius: "50%", background: "#1e1e2a", border: "1.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, marginLeft: i === 0 ? 0 : -6, zIndex: displayReactions.length - i, position: "relative" }}>
//               {REACTION_EMOJI[type] ?? "❤️"}
//             </div>
//           ))}
//         </div>
//       </motion.button>
//     );
//   };

//   const renderPostHeader = (p: any, onAvatarClick?: () => void) => (
//     <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, minWidth: 0 }} onClick={e => e.stopPropagation()}>
//       <div style={{ flexShrink: 0, cursor: onAvatarClick ? "pointer" : "default" }} onClick={e => { e.stopPropagation(); onAvatarClick?.(); }}>
//         <AvatarWithBadge username={p.fan.username} badge={p.fan.badge} size="sm" avatarUrl={p.fan.avatarUrl} />
//       </div>
//       <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0, flexWrap: "wrap" }}>
//         <span style={{ fontWeight: 700, fontSize: 13, color: "#fff", whiteSpace: "nowrap", cursor: onAvatarClick ? "pointer" : "default" }} onClick={e => { e.stopPropagation(); onAvatarClick?.(); }}>
//           {p.fan.username}
//         </span>
//         <span style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", whiteSpace: "nowrap" }}>{p.timeAgo}</span>
//         {p.type && (
//           <span className={typeBadgeClass(p.type)}>
//             {p.type === "post" ? "POST" : p.type === "hottake" ? "HOT TAKE" : p.type === "prediction" ? "PREDICTION" : p.type === "debate" ? "DEBATE" : p.type === "raw_reactions" ? "RAW REACTIONS" : p.type.toUpperCase()}
//           </span>
//         )}
//       </div>
//     </div>
//   );

//   // ── Action bar: reactions |  count  | share | emoji bubbles | delete ────
//   // Single comment icon + count + chevron. Clicking icon OR count opens/closes
//   // the InlineSection (which shows replies + input in one panel).
//   const renderActionBar = (p: any, postPayload: any, postType: string) => {
//     const isOpen = openInlinePostId === p.id;
//     const replyCount = p.replyCount || 0;
//     const accent = commentAccentColor(postType);

//     return (
//       <div style={{ marginTop: 2 }}>
//         {/* ── icon row ── */}
//         <div style={{ display: "flex", gap: 14, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10, alignItems: "center" }}>
//           {/* reaction picker */}
//           {renderReactionPicker(p)}

//           {/*  count + chevron — single unit, clicking anywhere toggles */}
//           <button
//             onClick={e => {
//               e.stopPropagation();
//               setOpenInlinePostId(isOpen ? null : p.id);
//             }}
//             style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: isOpen ? accent : "#9494ad", fontSize: 13, fontWeight: 600, transition: "color 0.15s", padding: 0 }}
//           >
//             {/* speech bubble */}
//             <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//             </svg>
//             <span style={{ fontSize: 12 }}>{replyCount}</span>
//             {/* chevron expand/collapse indicator */}
//             {isOpen
//               ? <ChevronUp size={12} style={{ opacity: 0.7 }} />
//               : <ChevronDown size={12} style={{ opacity: 0.5 }} />
//             }
//           </button>

//           {/* share */}
//           <button
//             onClick={e => { e.stopPropagation(); openShareDialog(p); }}
//             style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#9494ad", fontSize: 13, fontWeight: 600 }}
//           >
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
//               <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
//             </svg>
//           </button>

//           {/* reaction emoji bubbles */}
//           {renderReactionsTrigger(p)}

//           {/* delete (author only) */}
//           {isCurrentUserAuthor(p) && (
//             <button
//               onClick={async e => {
//                 e.stopPropagation();
//                 if (!window.confirm("Delete this post?")) return;
//                 try { await axios.delete(`/api/roar/rooms/${roomId}/messages/${p.id}`); setPosts(prev => prev.filter(x => x.id !== p.id)); }
//                 catch { onToast("Failed to delete post"); }
//               }}
//               style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", marginLeft: "auto", padding: 4, borderRadius: "50%" }}
//             >
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
//                 <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
//               </svg>
//             </button>
//           )}
//         </div>

//         {/* ── Inline section: replies list + comment input, toggled together ── */}
//         <AnimatePresence>
//           {isOpen && roomId && (
//             <InlineSection
//               key={`inline-${p.id}`}
//               postId={p.id}
//               roomId={roomId}
//               isOpen={isOpen}
//               onOpenFull={() => { setOpenInlinePostId(null); onPostClick?.(postPayload); }}
//               accentColor={accent}
//               currentAvatarUrl={userAvatarUrl}
//               onCommentPosted={() => {
//                 // bump reply count optimistically
//                 setPosts(prev => prev.map(x => x.id === p.id ? { ...x, replyCount: (x.replyCount || 0) + 1 } : x));
//                 onToast("Comment posted!");
//               }}
//             />
//           )}
//         </AnimatePresence>
//       </div>
//     );
//   };

//   const postCount = posts.filter(p => p.type === "post" || !p.type).length;
//   const debateCount = posts.filter(p => p.type === "debate").length;
//   const predictionCount = posts.filter(p => p.type === "prediction").length;

//   const filteredPosts = activeFilter === "all"
//     ? [...morePosts, ...posts]
//     : [...morePosts, ...posts].filter(p => {
//       if (activeFilter === "post") return p.type === "post" || !p.type;
//       return p.type === activeFilter;
//     });

//   return (
//     <div className="flex flex-col w-full bg-[#0e0e14]" style={{ height: "100%", overflow: "hidden" }}>
//       <svg width="0" height="0" style={{ position: "absolute" }}>
//         <linearGradient id="dr-pink-orange-grad" x1="0%" y1="0%" x2="100%" y2="100%">
//           <stop offset="0%" stopColor="#e91e8c" /><stop offset="100%" stopColor="#ff6b35" />
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
//         <div className="flex justify-between items-start gap-2">
//           <div className="flex items-center gap-3 min-w-0 flex-1">
//             <button type="button" onPointerDown={handleBack} onClick={handleBack} className="bg-transparent border-none cursor-pointer text-white flex items-center p-0 flex-shrink-0" style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
//               <ChevronLeft size={24} />
//             </button>
//             <div className="text-left pt-0.5 min-w-0 flex-1">
//               <p className="font-display text-xl tracking-[0.04em] m-0 leading-tight text-white font-extrabold uppercase truncate">{roomName || "WORLDCUP"}</p>
//               <div className="flex items-center gap-2 flex-wrap">
//                 <div className="flex items-center gap-1">
//                   <span className="live-pulse w-1.5 h-1.5 rounded-full bg-[var(--live-green)] inline-block flex-shrink-0" />
//                   <span className="text-[9px] font-bold text-[var(--live-green)] flex-shrink-0">LIVE</span>
//                 </div>
//                 {/* {watchAlongRoomId && (
//                   <button type="button" onClick={() => router.push(`/MainModules/WatchAlong/room/${watchAlongRoomId}`)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-gradient-to-r from-pink-600 to-rose-600 text-white cursor-pointer shadow-[0_2px_10px_rgba(219,39,119,0.3)] active:scale-95 whitespace-nowrap">
//                     <span>Watchalong</span>
//                     <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block flex-shrink-0" />
//                   </button>
//                 )} */}
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 flex-shrink-0">
//             <button type="button" onClick={shareRoomLink} className="flex-shrink-0 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] rounded-[10px] p-2 cursor-pointer text-[rgba(255,255,255,0.75)] flex items-center justify-center" style={{ width: "36px", height: "36px" }}>
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
//       </div>

//       {/* ── ACTIVE FANS ── */}
//       <div className="shrink-0 px-4 py-0.5 bg-[rgba(14,14,20,0.98)] border-b border-[var(--border)]">
//         <ActiveFansStack fans={activeFans} count={liveCount} totalJoinCount={totalJoinCount} onClick={() => setActiveFansOpen(true)} />
//       </div>

//       {/* ── CATEGORY FILTER ── */}
//       {/* <div className="flex justify-start gap-2 py-2 px-3 overflow-x-auto shrink-0 border-b border-[var(--border)]" style={{ scrollbarWidth: "none" }}> */}
//       <div className="flex justify-start gap-1.5 py-1 px-3 overflow-x-auto shrink-0 border-b border-[var(--border)]" style={{ scrollbarWidth: "none" }}>
//         {(["all", "post", "debate", "prediction"] as const).map((f) => {
//           const isActive = activeFilter === f;
//           const count = f === "post" ? postCount : f === "debate" ? debateCount : f === "prediction" ? predictionCount : 0;
//           const color = f === "post" ? "#e91e8c" : f === "debate" ? "#60a5fa" : f === "prediction" ? "#fbbf24" : "#fff";
//           const label = f === "all" ? "All" : f === "post" ? "Posts" : f === "debate" ? "Debates" : "Predictions";

//           return (
//             <button
//               key={f}
//               type="button"
//               onClick={() => setActiveFilter(f)}
//               // className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap shrink-0 transition-all duration-150"
//               className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 transition-all duration-150"
//               style={{
//                 background: isActive ? `${color}22` : "rgba(255,255,255,0.05)",
//                 border: `1.5px solid ${isActive ? `${color}70` : "rgba(255,255,255,0.1)"}`,
//                 color: isActive ? color : "rgba(255,255,255,0.5)",
//               }}
//             >
//               {f !== "all" && (
//                 // <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
//                 <span className="w-1 h-1 rounded-full shrink-0" style={{ background: color }} />
//               )}
//               {label}
//               {f !== "all" && !isActive && count > 0 && (
//                 <span
//                   // className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full"
//                   className="text-[9px] font-extrabold px-1 py-0.5 rounded-full"
//                   style={{ background: `${color}28`, color }}
//                 >
//                   {count}
//                 </span>
//               )}
//             </button>
//           );
//         })}
//       </div>

//       {/* ── FEED ── */}
//       <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 flex flex-col gap-3 min-h-0">
//         <AnimatePresence initial={false}>
//           {loading ? (
//             <div className="text-center text-[var(--text-muted)] py-8">Loading messages...</div>
//             // ) : posts.length === 0 && morePosts.length === 0 ? (
//             //   <div className="text-center text-[var(--text-muted)] py-8">No posts yet. Be the first!</div>
//             // ) : (
//             //   [...posts, ...morePosts].map((p) => {
//           ) : filteredPosts.length === 0 ? (
//             <div className="text-center text-[var(--text-muted)] py-8">
//               {activeFilter === "all" ? "No posts yet. Be the first!" : `No ${activeFilter}s in this room yet.`}
//             </div>
//           ) : (
//             filteredPosts.map((p) => {

//               /* ── QUIZ ── */
//               if (p.type === "quiz") {
//                 return (
//                   <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
//                     <QuizCard post={p} onToast={onToast} onPostClick={onPostClick} roomId={roomId} onFanProfile={onFanProfile} />
//                   </motion.div>
//                 );
//               }

//               /* ── DEBATE ── */
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
//                 const debatePayload = { id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo, createdAt: p.createdAt, type: "debate", isDbPost: true, roomId, mediaUrls: p.mediaUrls, sideA, sideB };

//                 return (
//                   <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
//                     className="cursor-pointer" style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
//                     onClick={() => onPostClick?.(debatePayload)}
//                   >
//                     {renderPostHeader(p, () => onFanProfile?.(p.fan))}
//                     {questionText && <p style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4, marginBottom: 12, color: "var(--text-primary)" }}>{questionText}</p>}
//                     <div style={{ display: "flex", gap: 8, alignItems: "stretch", marginBottom: 10 }}>
//                       {[
//                         { label: sideA, voted: displayVotedA, color: "var(--accent-magenta)", bg: "rgba(233,30,140,0.08)", border: "rgba(233,30,140,0.3)", voteVal: "agree" as const },
//                         { label: sideB, voted: displayVotedB, color: "#60a5fa", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.3)", voteVal: "disagree" as const },
//                       ].map(({ label, voted, color, bg, border, voteVal }, idx) => (
//                         <>
//                           {idx === 1 && <div key="vs" style={{ display: "flex", alignItems: "center", padding: "0 4px" }}><span className="font-display" style={{ fontSize: 16, color: "var(--text-muted)" }}>VS</span></div>}
//                           <motion.button key={voteVal} whileTap={!hasVoted ? { scale: 0.96 } : {}}
//                             // onClick={async (e) => {
//                             //   e.stopPropagation(); if (hasVoted) return;
//                             //   setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: voteVal, agreeCount: (x.agreeCount ?? 0) + (voteVal === "agree" ? 1 : 0), disagreeCount: (x.disagreeCount ?? 0) + (voteVal === "disagree" ? 1 : 0) }));
//                             //   setOpenInlinePostId(p.id);
//                             //   try {
//                             //     await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: voteVal });
//                             //   } catch { onToast("You've already voted!!"); }
//                             // }}
//                             onClick={async (e) => {
//                               e.stopPropagation();
//                               if (hasVoted || votingInProgressRef.current.has(p.id)) return;
//                               votingInProgressRef.current.add(p.id);
//                               setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: voteVal, agreeCount: (x.agreeCount ?? 0) + (voteVal === "agree" ? 1 : 0), disagreeCount: (x.disagreeCount ?? 0) + (voteVal === "disagree" ? 1 : 0) }));
//                               setOpenInlinePostId(p.id);
//                               try {
//                                 await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: voteVal });
//                               } catch (err: any) {
//                                 const status = err?.response?.status;
//                                 // 409 = already voted on server — keep optimistic state, don't rollback
//                                 if (status !== 409 && status !== 400) {
//                                   setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: null, agreeCount: Math.max(0, (x.agreeCount ?? 0) - (voteVal === "agree" ? 1 : 0)), disagreeCount: Math.max(0, (x.disagreeCount ?? 0) - (voteVal === "disagree" ? 1 : 0)) }));
//                                   onToast("Failed to submit vote");
//                                 }
//                               } finally {
//                                 votingInProgressRef.current.delete(p.id);
//                               }
//                             }}
//                             disabled={hasVoted}
//                             style={{ flex: 1, padding: "12px", borderRadius: 14, textAlign: "center", background: voted ? color : bg, border: `2px solid ${voted ? color : border}`, color: voted ? "white" : "var(--text-primary)", cursor: hasVoted ? "not-allowed" : "pointer", transition: "all 0.2s", opacity: hasVoted && !voted ? 0.35 : 1 }}
//                           >
//                             <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{voted ? "✓ " : ""}{label}</p>
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
//                     <p style={{ fontSize: 11, fontWeight: hasVoted ? 600 : 400, color: hasVoted ? "var(--accent-magenta)" : "var(--text-muted)", marginBottom: 8, fontStyle: hasVoted ? "normal" : "italic" }}>
//                       {hasVoted ? "You've already voted · thanks for joining the debate!" : "Tap a side to vote · results reveal after voting"}
//                     </p>
//                     {renderActionBar(p, debatePayload, "debate")}
//                   </motion.div>
//                 );
//               }

//               /* ── DEFAULT (post / hottake / prediction / raw_reactions) ── */
//               const defaultPayload = { id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo, createdAt: p.createdAt, type: p.type || "post", isDbPost: true, roomId, mediaUrls: p.mediaUrls };

//               return (
//                 <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
//                   className="cursor-pointer" style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
//                   onClick={() => onPostClick?.(defaultPayload)}
//                 >
//                   {renderPostHeader(p, () => onFanProfile?.(p.fan))}
//                   <p className="text-sm leading-snug text-white">{p.text}</p>

//                   {p.type === "raw_reactions" && p.memGifUrl && <img src={p.memGifUrl} alt="reaction gif" style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 12, marginTop: 8 }} />}
//                   {p.type === "raw_reactions" && p.memTag && <span style={{ display: "inline-block", marginTop: 8, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "rgba(0,232,198,0.12)", color: "#00e8c6", border: "1px solid rgba(0,232,198,0.3)", letterSpacing: "0.04em" }}>#{p.memTag}</span>}

//                   {/* ── PREDICTION ── */}
//                   {p.type === "prediction" && (() => {
//                     const liveTotal = (p.agreeCount ?? 0) + (p.disagreeCount ?? 0);
//                     const userVote = p.userVote;
//                     const hasVoted = userVote === "agree" || userVote === "disagree";
//                     const predictionOptions = Array.isArray(p.predictionOptions) && p.predictionOptions.length >= 2 ? p.predictionOptions : [p.sideA || "Option 1", p.sideB || "Option 2"];
//                     const optionCounts = p.predictionOptionCounts ?? {};
//                     const predictionTotal = liveTotal + Object.values(optionCounts).reduce((sum: number, count: unknown) => sum + (Number(count) || 0), 0);
//                     const predictionPct = (count: number) => predictionTotal > 0 ? Math.round((count / predictionTotal) * 100) : 0;
//                     const predAgrPct = predictionPct(p.agreeCount ?? 0);
//                     const predDisAgrPct = predictionPct(p.disagreeCount ?? 0);
//                     const hasPredictionVoted = hasVoted || (typeof userVote === "string" && userVote.startsWith("option_"));
//                     const predictionClosed = Boolean(p.resolvedAt || p.closedAt || (p.closesAt && p.closesAt <= Date.now()));
//                     const isPredictionAuthor = isCurrentUserAuthor(p);
//                     const correctVoteLabel = getPredictionOptionLabel(p.correctVote, predictionOptions);
//                     return (
//                       <>
//                         <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
//                           <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: predictionClosed ? "rgba(244,67,54,0.12)" : "rgba(34,197,94,0.1)", color: predictionClosed ? "#f87171" : "#22c55e", border: `1px solid ${predictionClosed ? "rgba(244,67,54,0.25)" : "rgba(34,197,94,0.22)"}` }}>
//                             <Clock size={11} /> {formatPredictionCloseLabel(p)}
//                           </span>
//                         </div>
//                         <div style={{ display: "flex", gap: 8, marginTop: 10, marginBottom: 4 }}>
//                           {predictionOptions.slice(0, 2).map((label: string, optionIndex: number) => {
//                             const agree = optionIndex === 0;
//                             const pctVal = optionIndex === 0 ? predAgrPct : predDisAgrPct;
//                             const active = optionIndex === 0 ? userVote === "agree" : userVote === "disagree";
//                             return (
//                               <motion.button key={label} disabled={predictionClosed} whileTap={!hasPredictionVoted && !predictionClosed ? { scale: 0.93 } : {}}
//                                 // onClick={async (e) => {
//                                 //   e.stopPropagation();
//                                 //   if (hasPredictionVoted || predictionClosed) return;
//                                 //   try {
//                                 //     await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: agree ? "agree" : "disagree" });
//                                 //     setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: agree ? "agree" : "disagree", agreeCount: (x.agreeCount ?? 0) + (agree ? 1 : 0), disagreeCount: (x.disagreeCount ?? 0) + (!agree ? 1 : 0) }));
//                                 //     setOpenInlinePostId(p.id);
//                                 //   } catch { onToast("You've already voted!!"); }
//                                 // }}
//                                 onClick={async (e) => {
//                                   e.stopPropagation();
//                                   if (hasPredictionVoted || predictionClosed) return;
//                                   setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: agree ? "agree" : "disagree", agreeCount: (x.agreeCount ?? 0) + (agree ? 1 : 0), disagreeCount: (x.disagreeCount ?? 0) + (!agree ? 1 : 0) }));
//                                   // setOpenInlinePostId(p.id);
//                                   try {
//                                     await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: agree ? "agree" : "disagree" });
//                                   } catch { onToast("You've already voted!!"); }
//                                 }}
//                                 style={{ flex: 1, padding: "9px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: hasPredictionVoted || predictionClosed ? "default" : "pointer", border: `2px solid ${active ? "#ff6b35" : "#8b8b8b"}`, background: active ? "rgba(255,107,53,0.24)" : "rgba(255,255,255,0.02)", color: active ? "#fff" : "#d1d1d1", boxShadow: active ? "0 0 14px rgba(255,107,53,0.35)" : "none", transition: "all 0.2s ease-in-out", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: (hasPredictionVoted || predictionClosed) && !active ? 0.4 : 1 }}
//                               >
//                                 {label}
//                                 <span style={{ fontSize: 10, fontWeight: 800, background: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)", borderRadius: 999, padding: "1px 6px" }}>{pctVal}%</span>
//                               </motion.button>
//                             );
//                           })}
//                         </div>
//                         {predictionOptions.length > 2 && (
//                           <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
//                             {predictionOptions.slice(2).map((label: string, idx: number) => {
//                               const voteValue = `option_${idx + 2}`;
//                               const active = userVote === voteValue;
//                               const pctVal = predictionPct(optionCounts[voteValue] ?? 0);
//                               return (
//                                 <button key={`${label}-${idx}`} type="button" disabled={hasPredictionVoted || predictionClosed}
//                                   // onClick={async (e) => {
//                                   //   e.stopPropagation();
//                                   //   if (hasPredictionVoted || predictionClosed) return;
//                                   //   try {
//                                   //     await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: voteValue });
//                                   //     setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: voteValue, predictionOptionCounts: { ...(x.predictionOptionCounts ?? {}), [voteValue]: ((x.predictionOptionCounts ?? {})[voteValue] ?? 0) + 1 } }));
//                                   //     setOpenInlinePostId(p.id);
//                                   //   } catch { onToast("You've already voted!!"); }
//                                   // }}
//                                   onClick={async (e) => {
//                                     e.stopPropagation();
//                                     if (hasPredictionVoted || predictionClosed) return;
//                                     setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: voteValue, predictionOptionCounts: { ...(x.predictionOptionCounts ?? {}), [voteValue]: ((x.predictionOptionCounts ?? {})[voteValue] ?? 0) + 1 } }));
//                                     // setOpenInlinePostId(p.id);
//                                     try {
//                                       await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: voteValue });
//                                     } catch { onToast("You've already voted!!"); }
//                                   }}
//                                   style={{ flex: "1 1 calc(50% - 4px)", minWidth: 0, padding: "9px", borderRadius: 999, fontSize: 12, fontWeight: 700, border: `2px solid ${active ? "#ff6b35" : "#8b8b8b"}`, background: active ? "rgba(255,107,53,0.24)" : "rgba(255,255,255,0.02)", color: active ? "#fff" : "#d1d1d1", boxShadow: active ? "0 0 14px rgba(255,107,53,0.35)" : "none", textAlign: "center", opacity: (hasPredictionVoted || predictionClosed) && !active ? 0.4 : 1, cursor: hasPredictionVoted || predictionClosed ? "default" : "pointer" }}
//                                 >
//                                   {label}
//                                   <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 800, background: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)", borderRadius: 999, padding: "1px 6px" }}>{pctVal}%</span>
//                                 </button>
//                               );
//                             })}
//                           </div>
//                         )}
//                         {predictionClosed && !p.resolvedAt && isPredictionAuthor && (
//                           <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8, marginBottom: 4 }}>
//                             {predictionOptions.map((label: string, optionIndex: number) => (
//                               <button key={`room-resolve-${label}-${optionIndex}`} type="button" disabled={resolvingRoomPredictionId === p.id}
//                                 onClick={(e) => { e.stopPropagation(); resolveRoomPrediction(p.id, getPredictionVoteValue(optionIndex)); }}
//                                 style={{ flex: "1 1 calc(50% - 4px)", minWidth: 0, padding: "9px", borderRadius: 12, fontSize: 12, fontWeight: 800, border: "1px solid rgba(34,197,94,0.35)", background: "rgba(34,197,94,0.1)", color: "#22c55e", cursor: resolvingRoomPredictionId === p.id ? "wait" : "pointer" }}
//                               >
//                                 Resolve: {label}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                         {p.resolvedAt && correctVoteLabel && (
//                           <p style={{ fontSize: 11, color: "#22c55e", fontWeight: 800, marginTop: 8, marginBottom: 4 }}>Correct answer: {correctVoteLabel}</p>
//                         )}
//                       </>
//                     );
//                   })()}

//                   {/* media */}
//                   {p.mediaUrls?.length > 0 && (
//                     <div className="flex flex-col gap-2 mt-2">
//                       {p.mediaUrls.map((url: string, i: number) =>
//                         url.endsWith(".mp4") || url.includes("/video/upload/")
//                           ? <video key={i} src={url} controls className="w-full max-h-[200px] rounded-lg object-cover" onClick={e => e.stopPropagation()} />
//                           : <img key={i} src={url} alt="" className="w-full max-h-[200px] rounded-lg object-cover" />
//                       )}
//                     </div>
//                   )}

//                   {/* ── HOT TAKE ── */}
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
//                             <motion.button key={label} whileTap={!hasVoted ? { scale: 0.93 } : {}}
//                               // onClick={async (e) => { e.stopPropagation(); if (hasVoted) return; try { await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: agree ? "agree" : "disagree" }); setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: agree ? "agree" : "disagree", agreeCount: (x.agreeCount ?? 0) + (agree ? 1 : 0), disagreeCount: (x.disagreeCount ?? 0) + (!agree ? 1 : 0) })); setOpenInlinePostId(p.id); } catch { onToast("Failed to submit vote"); } }}
//                               onClick={async (e) => { e.stopPropagation(); if (hasVoted) return; setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: agree ? "agree" : "disagree", agreeCount: (x.agreeCount ?? 0) + (agree ? 1 : 0), disagreeCount: (x.disagreeCount ?? 0) + (!agree ? 1 : 0) })); setOpenInlinePostId(p.id); try { await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: agree ? "agree" : "disagree" }); } catch { onToast("Failed to submit vote"); } }}
//                               style={{ flex: 1, padding: "10px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: hasVoted ? "default" : "pointer", border: `2.5px solid ${color}`, background: active ? color : "rgba(255,255,255,0.02)", color: active ? "white" : color, boxShadow: active ? `0 0 16px ${color}60` : "none", transition: "all 0.2s ease-in-out", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: hasVoted && !active ? 0.4 : 1 }}
//                             >
//                               {active ? `✓ ${agree ? "Agreed" : "Disagreed"}` : label}
//                               <span style={{ fontSize: 10, fontWeight: 800, background: active ? "rgba(255,255,255,0.2)" : `${color}22`, borderRadius: 999, padding: "1px 6px" }}>{pctVal}%</span>
//                             </motion.button>
//                           ))}
//                         </div>
//                       </div>
//                     );
//                   })()}

//                   {renderActionBar(p, { ...defaultPayload, replyCount: p.replyCount }, p.type || "post")}
//                 </motion.div>
//               );
//             })
//           )}
//         </AnimatePresence>

//         {hasMoreMsgs && !loading && (
//           <div ref={sentinelRef} style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
//             {loadingMoreMsgs && <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #E91E8C", animation: "dr-spin 0.8s linear infinite" }} />}
//           </div>
//         )}
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `@keyframes dr-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}` }} />

//       {/* ── CATEGORY PILLS ── */}
//       <div className="flex justify-start gap-1.5 py-1 px-2.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
//         {RADIAL_OPTS.map((q) => {
//           const isActive = q.id === selectedActionId;
//           return (
//             <button key={q.id} type="button"
//               onClick={() => { setSelectedActionId(q.id); onCompose?.(q.id); if (q.id !== "post") setSelectedActionId("post"); }}
//               className={["flex items-center justify-start gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all duration-150 cursor-pointer shrink-0", isActive ? "border-[rgba(233,30,140,0.35)] bg-[rgba(233,30,140,0.12)]" : "border-transparent bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.6)]"].join(" ")}
//             >
//               {composeIconMap[q.id] || <span>{q.emoji}</span>}
//               <span>{q.label}</span>
//             </button>
//           );
//         })}
//       </div>

//       {/* ── COMPOSER ── */}
//       {/* <div className="shrink-0 px-3 pt-2 pb-2 bg-[rgba(14,14,20,0.98)] backdrop-blur-[20px] border-t border-[var(--border)] flex flex-col gap-2">
//         {selectedActionId === "post" && (
//           <>
//             {attachedUrl && (
//               <div className="px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   {attachedType === "image" ? <img src={attachedUrl} className="w-10 h-10 rounded-lg object-cover" alt="Attached" /> : <video src={attachedUrl} className="w-10 h-10 rounded-lg object-cover" />}
//                   <span className="text-xs text-[var(--text-secondary)]">Media attached</span>
//                 </div>
//                 <button type="button" onClick={() => { setAttachedUrl(null); setAttachedType(null); }} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">✕</button>
//               </div>
//             )} */}
//       {/* <div className="flex gap-2 items-center">
//               <button type="button" onClick={() => triggerUpload("image")} disabled={uploading} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer flex items-center p-1 shrink-0">
//                 <Image size={20} />
//               </button>
//               <div className="flex-1 relative">
//                 {input === "" && !uploading && (
//                   <div className="absolute left-4 top-0 bottom-0 flex items-center pointer-events-none">
//                     <span className="text-sm font-medium" style={{ color: MODE_COLOR["post"] || "var(--text-secondary)" }}>{PLACEHOLDER["post"]}</span>
//                   </div>
//                 )}
//                 <input type="text" disabled={uploading} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} className="w-full h-11 rounded-[22px] bg-[var(--bg-secondary)] border border-[var(--border)] pl-4 pr-4 text-white text-base outline-none" />
//               </div>
//               <motion.button whileTap={{ scale: 0.96 }} onClick={send} disabled={uploading || isSending} className={["w-11 h-11 rounded-full border-none text-white text-lg font-bold flex items-center justify-center cursor-pointer shrink-0 bg-[linear-gradient(135deg,#e91e8c,#ff6b35)]", uploading ? "opacity-50" : "opacity-100"].join(" ")}>↑</motion.button>
//             </div> */}

//       {/* ── COMPOSER ── */}
//       <div className="shrink-0 px-3 pt-1.5 pb-1.5 bg-[rgba(14,14,20,0.98)] backdrop-blur-[20px] border-t border-[var(--border)] flex flex-col gap-1.5">
//         {selectedActionId === "post" && (
//           <>
//             {attachedUrl && (
//               <div className="px-2 py-1.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   {attachedType === "image"
//                     ? <img src={attachedUrl} className="w-8 h-8 rounded-lg object-cover" alt="Attached" />
//                     : <video src={attachedUrl} className="w-8 h-8 rounded-lg object-cover" />}
//                   <span className="text-xs text-[var(--text-secondary)]">Media attached</span>
//                 </div>
//                 <button type="button" onClick={() => { setAttachedUrl(null); setAttachedType(null); }} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer text-sm">✕</button>
//               </div>
//             )}

//             {showEmojiPicker && (
//               <div
//                 ref={emojiPickerRef}
//                 className="w-full overflow-hidden rounded-xl border border-white/10"
//                 onClick={e => e.stopPropagation()}
//               >
//                 {/* X close bar — sits above the picker, full width */}
//                 <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a1a24] border-b border-white/10">
//                   <span className="text-[11px] font-semibold text-white/40">Pick an emoji</span>
//                   <button
//                     type="button"
//                     onClick={() => setShowEmojiPicker(false)}
//                     className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 border-none cursor-pointer text-white text-[13px] font-bold leading-none"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 {/* Picker constrained to container width, scrollable internally */}
//                 <div className="max-h-[200px] overflow-y-auto w-full [&>em-emoji-picker]:w-full">
//                   <EmojiPicker
//                     data={data}
//                     theme="dark"
//                     onEmojiSelect={(emoji: any) => {
//                       setInput(prev => prev + emoji.native);
//                     }}
//                     previewPosition="none"
//                     skinTonePosition="none"
//                     perLine={7}
//                   />
//                 </div>
//               </div>
//             )}

//             <div className="flex items-center w-full gap-1">
//               {/* Image attach — left edge */}
//               <button
//                 type="button"
//                 onClick={() => triggerUpload("image")}
//                 disabled={uploading}
//                 className="bg-transparent border-none -ml-2 text-white/40 cursor-pointer flex items-center justify-center p-1 shrink-0"
//               >
//                 <Image size={18} />
//               </button>

//               {/* Emoji toggle */}
//               <button
//                 type="button"
//                 onClick={() => setShowEmojiPicker(prev => !prev)}
//                 className="bg-transparent border-none cursor-pointer -ml-2 flex items-center justify-center p-1 shrink-0 text-[18px] leading-none"
//                 style={{ color: showEmojiPicker ? "#e91e8c" : "rgba(255,255,255,0.4)" }}
//               >
//                 😊
//               </button>

//               {/* Input — fills all remaining space */}
//               <div className="flex-1 relative min-w-0">
//                 {input === "" && !uploading && (
//                   <div className="absolute left-3 top-0 bottom-0 flex items-center pointer-events-none">
//                     <span
//                       className="text-sm font-medium truncate"
//                       style={{ color: MODE_COLOR["post"] || "var(--text-secondary)" }}
//                     >
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
//                   className="w-full h-9 rounded-[18px] bg-[var(--bg-secondary)] border border-[var(--border)] pl-3 pr-3 text-white text-sm outline-none"
//                 />
//               </div>

//               {/* Send — right edge */}
//               <motion.button
//                 whileTap={{ scale: 0.96 }}
//                 onClick={send}
//                 disabled={uploading || isSending}
//                 className="w-7 h-7 rounded-full border-none -mr-2 text-white text-base font-bold flex items-center justify-center cursor-pointer shrink-0 bg-gradient-to-br from-[#e91e8c] to-[#ff6b35]"
//                 style={{ opacity: uploading ? 0.5 : 1 }}
//               >
//                 ↑
//               </motion.button>
//             </div>
//           </>
//         )}
//       </div>

//       <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

//       <ReactionsDialog postId={reactionsMsgId ?? ""} isOpen={reactionsMsgId !== null} onClose={() => setReactionsMsgId(null)} onFanProfile={onFanProfile} roomId={roomId} />
//       {/* <ActiveFansDialog roomId={roomId} isOpen={activeFansOpen} onClose={() => setActiveFansOpen(false)} onFanProfile={onFanProfile} /> */}
//       <ActiveFansDialog
//         roomId={roomId}
//         isOpen={activeFansOpen}
//         onClose={() => setActiveFansOpen(false)}
//         onFanProfile={onFanProfile}
//         prefetchedFans={activeFans}
//         prefetchedCount={liveCount}
//       />


//       {/* ── Notification toast ── */}
//       <AnimatePresence>
//         {notifToast && (
//           <motion.div initial={{ opacity: 0, y: -60, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -40, scale: 0.95 }} transition={{ duration: 0.22, ease: "easeOut" }} onClick={() => setNotifToast(null)}
//             style={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 100, display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 20, background: notifToast.type === "comment" ? "rgba(147,51,234,0.92)" : "rgba(233,30,140,0.92)", backdropFilter: "blur(12px)", border: `1px solid ${notifToast.type === "comment" ? "rgba(147,51,234,0.5)" : "rgba(233,30,140,0.5)"}`, boxShadow: `0 8px 32px ${notifToast.type === "comment" ? "rgba(147,51,234,0.35)" : "rgba(233,30,140,0.35)"}`, cursor: "pointer", wordBreak: "break-word" }}
//           >
//             <span style={{ fontSize: 16, flexShrink: 0 }}>{notifToast.type === "comment" ? "💬" : "❤️"}</span>
//             <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", wordBreak: "break-word" }}>{notifToast.message}</span>
//             <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", flexShrink: 0, marginLeft: 4 }}>tap to dismiss</span>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }







import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfile } from "@/context/UserProfileContext";
import axios from "axios";
import AvatarWithBadge from "../components/AvatarWithBadge";
import ReactionPicker, { type Reaction } from "../components/ReactionPicker";
import ReactionsDialog from "../components/ReactionsDialog";
import ActiveFansDialog from "../components/ActiveFansDialog";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { roarApi } from "@/lib/roarApi";
import { RADIAL_OPTS } from "../constants";
import {
  Image, ChevronLeft, Flame, TrendingUp, Zap, History, PenTool,
  Brain, Users, CheckCircle2, XCircle,
  Share2, Send, ChevronDown, ChevronUp, Clock,
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
  currentUserId?: string;
  onRegisterRefresh?: (fn: () => void) => void;
  onRegisterReplyUpdate?: (fn: (postId: string, count: number) => void) => void;
  onFanProfile?: (fan: any) => void;
  watchAlongRoomId?: string;
}

// ── Quick-react options (cricket moments only) ────────────────────────────────
// These appear in the + panel above the composer and post directly as styled cards.
// Post/Prediction/Debate stay in the RADIAL_OPTS pills row below composer.
const QUICK_REACT_OPTS = [
  { id: "qr_wicket",   label: "Wicket!",   emoji: "🎯" },
  { id: "qr_six",      label: "Six!!",     emoji: "💪" },
  { id: "qr_four",     label: "Four!",     emoji: "🏏" },
  { id: "qr_boundary", label: "Boundary!", emoji: "💥" },
];

// Per quick-react ID: gradient colours for the feed card background
const QUICK_REACT_GRADIENTS: Record<string, string> = {
  qr_wicket:   "linear-gradient(135deg,#e91e8c,#c2185b)",
  qr_six:      "linear-gradient(135deg,#f59e0b,#d97706)",
  qr_four:     "linear-gradient(135deg,#f97316,#ea580c)",
  qr_boundary: "linear-gradient(135deg,#10b981,#059669)",
};

const MODE_COLOR: Record<string, string> = {
  post: "var(--text-primary)",
  prediction: "var(--gold)",
  hottake: "#f87171",
  debate: "#e91e8c",
  raw_reactions: "#00e8c6",
};

const LOAD_MORE_PAGE_SIZE = 15;

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

const commentAccentColor = (type: string) => {
  if (type === "prediction") return "#22c55e";
  if (type === "hottake") return "#f87171";
  if (type === "raw_reactions") return "#00e8c6";
  return "#e91e8c";
};

// ── ActiveFansStack ──────────────────────────────────────────────────────────
function ActiveFansStack({
  fans, count, totalJoinCount, onClick,
}: {
  fans: { uid: string; username: string; avatarUrl?: string | null }[];
  count: number;
  totalJoinCount?: number;
  onClick: () => void;
}) {
  if (count === 0 && !totalJoinCount) return null;
  const formatCount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <button type="button" onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        <div style={{ display: "flex" }}>
          {fans.slice(0, 3).map((fan, i) => (
            <div key={fan.uid} style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #0e0e14", overflow: "hidden", marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i, background: "linear-gradient(135deg,#e91e8c,#ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {fan.avatarUrl ? <img src={fan.avatarUrl} alt={fan.username} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>{fan.username?.[0]?.toUpperCase() || "?"}</span>}
            </div>
          ))}
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
          <span style={{ color: "#fff", fontWeight: 700 }}>{formatCount(count)}</span> active now
        </span>
      </button>
      {totalJoinCount !== undefined && totalJoinCount > 0 && (
        <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>
          Total Joined <span style={{ color: "#fff", fontWeight: 700 }}>{formatCount(totalJoinCount)}</span>
        </span>
      )}
    </div>
  );
}

function mentionMatchesAuthor(mentionToken: string, authorUsername: string): boolean {
  const mention = mentionToken.toLowerCase().trim();
  const uname = (authorUsername ?? "").toLowerCase().trim();
  if (uname === mention) return true;
  const segments = uname.split(/[\s_\.]+/).filter(Boolean);
  if (segments.some(seg => seg === mention)) return true;
  if (segments.join("") === mention.replace(/\s+/g, "")) return true;
  return false;
}

function threadSort(flat: any[]): any[] {
  const result: any[] = [];
  for (const comment of flat) {
    const text: string = (comment.text ?? "").trimStart();
    const mentionMatch = text.match(/^@(\S+)/);
    if (mentionMatch) {
      const mentionToken = mentionMatch[1];
      let insertAfter = -1;
      for (let i = result.length - 1; i >= 0; i--) {
        if (mentionMatchesAuthor(mentionToken, result[i].authorUsername ?? "")) {
          insertAfter = i;
          break;
        }
      }
      if (insertAfter >= 0) {
        let insertAt = insertAfter + 1;
        while (
          insertAt < result.length &&
          (result[insertAt].text ?? "").trimStart().match(/^@/)
        ) {
          insertAt++;
        }
        result.splice(insertAt, 0, comment);
        continue;
      }
    }
    result.push(comment);
  }
  return result;
}

// ── InlineSection ─────────────────────────────────────────────────────────────
function InlineSection({
  postId, roomId, isOpen, onOpenFull, accentColor, currentAvatarUrl, onCommentPosted,
}: {
  postId: string; roomId: string; isOpen: boolean; onOpenFull: () => void;
  accentColor: string; currentAvatarUrl?: string; onCommentPosted: () => void;
}) {
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<{ commentId: string; authorUsername: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchReplies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/roar/rooms/${roomId}/messages/${postId}/comments`, { params: { limit: 50 } });
      const list: any[] = res.data?.comments ?? [];
      const oldestFirst = [...list].reverse();
      const threaded = threadSort(oldestFirst);
      setReplies(threaded.slice(0, 4));
    } catch { setReplies([]); }
    finally { setLoading(false); }
  }, [postId, roomId]);

  useEffect(() => {
    if (isOpen) { fetchReplies(); setTimeout(() => inputRef.current?.focus(), 180); }
  }, [isOpen, fetchReplies]);

  const handleSend = async () => {
    const fullText = replyTo ? `@${replyTo.authorUsername} ${commentText.trim()}` : commentText.trim();
    if (!fullText || sending) return;
    setSending(true);
    try {
      await axios.post(`/api/roar/rooms/${roomId}/messages/${postId}/comments`, { text: fullText });
      setCommentText(""); setReplyTo(null); onCommentPosted(); fetchReplies();
    } catch { }
    finally { setSending(false); }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ overflow: "hidden" }} onClick={e => e.stopPropagation()}
    >
      <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 0 }}>
        {loading ? (
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontStyle: "italic", marginBottom: 8, paddingLeft: 4 }}>Loading replies…</p>
        ) : replies.length === 0 ? (
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontStyle: "italic", marginBottom: 8, paddingLeft: 4 }}>No replies yet — be the first!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
            {replies.map((r, i) => {
              const isReply = /^@\S+/.test((r.text ?? "").trimStart());
              return (
                <div key={r.id ?? r.commentId ?? i} style={{ display: "flex", gap: 8, alignItems: "flex-start", paddingLeft: isReply ? 28 : 0, minWidth: 0, width: "100%" }}>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#e91e8c,#ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {r.authorAvatarUrl ? <img src={r.authorAvatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 8, fontWeight: 800, color: "#fff" }}>{(r.authorUsername ?? "?")[0].toUpperCase()}</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                    <span style={{ fontWeight: 700, color: "#fff", fontSize: 13, display: "block", wordBreak: "break-word" }}>{r.authorUsername ?? "Fan"}</span>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "rgba(255,255,255,0.75)", wordBreak: "break-word", overflowWrap: "anywhere" }}>
                      {isReply ? (() => {
                        const spaceIdx = (r.text ?? "").indexOf(" ");
                        const mention = spaceIdx > -1 ? (r.text ?? "").slice(0, spaceIdx) : (r.text ?? "");
                        const rest = spaceIdx > -1 ? (r.text ?? "").slice(spaceIdx) : "";
                        return (<><span style={{ color: accentColor, fontWeight: 600 }}>{mention}</span>{rest}</>);
                      })() : (r.text ?? "")}
                    </p>
                    <button type="button" onClick={e => { e.stopPropagation(); setReplyTo({ commentId: r.id ?? r.commentId, authorUsername: r.authorUsername ?? "Fan" }); setTimeout(() => inputRef.current?.focus(), 80); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", padding: 0, marginTop: 3 }}>Reply</button>
                  </div>
                </div>
              );
            })}
            <button type="button" onClick={e => { e.stopPropagation(); onOpenFull(); }} style={{ alignSelf: "flex-start", background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, color: accentColor, padding: 0, marginTop: 2 }}>View all replies →</button>
          </div>
        )}

        <AnimatePresence>
          {replyTo && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 2 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Replying to</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: accentColor, background: `${accentColor}18`, border: `1px solid ${accentColor}40`, borderRadius: 999, padding: "1px 8px" }}>@{replyTo.authorUsername}</span>
                <button type="button" onClick={e => { e.stopPropagation(); setReplyTo(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 16, background: "rgba(255,255,255,0.04)", border: `1px solid ${accentColor}40` }}>
          {currentAvatarUrl ? <img src={currentAvatarUrl} alt="" style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, objectFit: "cover" }} /> : <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#e91e8c,#ff6b35)" }} />}
          <input ref={inputRef} type="text" value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSend(); }} placeholder={replyTo ? `Reply to @${replyTo.authorUsername}…` : "Add a comment…"} style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 13, fontWeight: 500 }} />
          <button type="button" onClick={e => { e.stopPropagation(); onOpenFull(); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", padding: "0 2px" }}>All</button>
          <motion.button whileTap={{ scale: 0.9 }} type="button" onClick={e => { e.stopPropagation(); handleSend(); }} disabled={!commentText.trim() || sending} style={{ background: commentText.trim() ? `linear-gradient(135deg,${accentColor},#ff6b35)` : "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: commentText.trim() ? "pointer" : "default", transition: "background 0.2s", flexShrink: 0 }}>
            <Send size={14} color={commentText.trim() ? "#fff" : "rgba(255,255,255,0.3)"} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── QuizCard ──────────────────────────────────────────────────────────────────
function QuizCard({ post, onToast, onPostClick, roomId, onFanProfile }: { post: any; onToast: (m: string) => void; onPostClick?: (post: any) => void; roomId?: string; onFanProfile?: (fan: any) => void; }) {
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
        if (res.data.isCorrect) onToast("Correct! +2 points awarded");
        else onToast(`Wrong! Correct answer was ${res.data.correctOption}`);
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

// ── Visibility-aware interval ─────────────────────────────────────────────────
function useVisibilityInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback);
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    const start = () => { id = setInterval(() => { if (!document.hidden) savedCallback.current(); }, delay); };
    const handleVisibility = () => { clearInterval(id); if (!document.hidden) { savedCallback.current(); start(); } };
    start();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", handleVisibility); };
  }, [delay]);
}

type ShareableRoarPost = { id?: string | number; text?: string; authorUsername?: string; fan?: { username?: string }; };

function displayUsername(raw: string | undefined | null): string {
  if (!raw) return "RoarUser";
  const trimmed = raw.trim();
  if (!trimmed) return "RoarUser";
  if (!trimmed.includes("_")) return trimmed;
  const spaced = trimmed.replace(/_+/g, " ").replace(/\s+/g, " ").trim();
  if (!spaced) return "RoarUser";
  return spaced.split(" ").map((word) => (/[A-Z]/.test(word) ? word : word.charAt(0).toUpperCase() + word.slice(1))).join(" ");
}

const buildRoarPostShareUrl = (post: ShareableRoarPost) => {
  if (typeof window === "undefined") return "";
  const targetUrl = new URL(`${window.location.origin}/MainModules/ROAR`);
  if (post?.id) targetUrl.searchParams.set("post", String(post.id));
  return targetUrl.toString();
};

const buildRoarPostShareText = (post: ShareableRoarPost) => {
  const shareUrl = buildRoarPostShareUrl(post);
  const author = displayUsername(post?.fan?.username || post?.authorUsername || "a Sportsfan");
  return [`Check out this ROAR post by ${author}`, post?.text || "Join the conversation on Sportsfan ROAR.", `View post: ${shareUrl}`].filter(Boolean).join("\n");
};

// ── Main DiscussionRoom ───────────────────────────────────────────────────────
export default function DiscussionRoom({
  onBack, onToast, roomId, roomName, onPostClick, onCompose,
  fanCount = 312, score, scoreSubtitle, currentAvatarUrl, currentUserId: propCurrentUserId, onRegisterRefresh, onRegisterReplyUpdate,
  onFanProfile, watchAlongRoomId
}: Props) {
  const router = useRouter();
  const phog = usePostHog();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showQuickCompose, setShowQuickCompose] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"post" | "debate" | "prediction" | "hottake" | "raw_reactions">("post");
  const [uploading, setUploading] = useState(false);
  const [attachedUrl, setAttachedUrl] = useState<string | null>(null);
  const [attachedType, setAttachedType] = useState<"image" | "video" | null>(null);
  const [userUsername, setUserUsername] = useState("RoarUser");
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(currentAvatarUrl);
  const [selectedActionId, setSelectedActionId] = useState("post");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [liveCount, setLiveCount] = useState<number>(fanCount ?? 0);
  const [totalJoinCount, setTotalJoinCount] = useState<number>(0);
  const [sharePost, setSharePost] = useState<ShareableRoarPost | null>(null);
  const [copied, setCopied] = useState(false);
  const { userProfile } = useUserProfile();
  const [activeFilter, setActiveFilter] = useState<"all" | "post" | "debate" | "prediction">("all");
  const votingInProgressRef = useRef<Set<string>>(new Set());
  const currentUserId = propCurrentUserId || userProfile?.actualUserId;
  const currentUserIdCandidates = [
    currentUserId,
    userProfile?.actualUserId,
    (userProfile as { userId?: string })?.userId,
    (userProfile as { uid?: string })?.uid,
    (userProfile as { email?: string })?.email,
  ].filter(Boolean).map(String);

  const isCurrentUserAuthor = (post: { authorUid?: unknown; authorEmail?: unknown; fan?: { authorUid?: unknown } }) => {
    const authorCandidates = [post.authorUid, post.fan?.authorUid, post.authorEmail].filter(Boolean).map(String);
    return authorCandidates.some(id => currentUserIdCandidates.includes(id));
  };

  const latestCreatedAtRef = useRef<number | null>(null);
  const sendingRef = useRef(false);
  const [isSending, setIsSending] = useState(false);
  const [resolvingRoomPredictionId, setResolvingRoomPredictionId] = useState<string | null>(null);
  const [openInlinePostId, setOpenInlinePostId] = useState<string | null>(null);
  const [notifToast, setNotifToast] = useState<{ message: string; type: "like" | "comment"; } | null>(null);
  const notifToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeFans, setActiveFans] = useState<{ uid: string; username: string; avatarUrl?: string | null; badge?: string | null }[]>([]);
  const [activeFansOpen, setActiveFansOpen] = useState(false);
  const [localReactions, setLocalReactions] = useState<Record<string, { reaction: Reaction | null; heartCount: number }>>({});
  const localReactionsRef = useRef<Record<string, { reaction: Reaction | null; heartCount: number }>>({});
  const pendingReactRef = useRef<Record<string, boolean>>({});
  const [reactionsMsgId, setReactionsMsgId] = useState<string | null>(null);
  useEffect(() => { localReactionsRef.current = localReactions; }, [localReactions]);

  const listRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [morePosts, setMorePosts] = useState<any[]>([]);
  const [hasMoreMsgs, setHasMoreMsgs] = useState(true);
  const [loadingMoreMsgs, setLoadingMoreMsgs] = useState(false);
  const loadingMoreMsgsRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const topReactionsCache = useRef<Record<string, string[]>>({});
  const [topReactionsMap, setTopReactionsMap] = useState<Record<string, string[]>>({});

  const fetchTopReactions = useCallback(async (msgId: string) => {
    if (topReactionsCache.current[msgId] !== undefined) return;
    topReactionsCache.current[msgId] = [];
    try {
      const url = `/api/roar/posts/${msgId}/reactions${roomId ? `?roomId=${encodeURIComponent(roomId)}` : ""}`;
      const res = await axios.get(url);
      const reactors: { reaction: string }[] = res.data?.reactors ?? [];
      const counts: Record<string, number> = {};
      reactors.forEach(r => { counts[r.reaction] = (counts[r.reaction] ?? 0) + 1; });
      const top = Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 3).map(([type]) => type);
      topReactionsCache.current[msgId] = top;
      setTopReactionsMap(prev => ({ ...prev, [msgId]: top }));
    } catch { topReactionsCache.current[msgId] = []; }
  }, [roomId]);

  const mapMessage = useCallback((m: any, existing?: any) => {
    const isPending = pendingReactRef.current[m.msgId];
    return {
      id: m.msgId, authorUid: m.authorUid, authorEmail: m.authorEmail,
      fan: { username: displayUsername(m.authorUsername), authorUid: m.authorUid, badge: m.authorBadge, avatarUrl: m.authorUid === currentUserId ? (userAvatarUrl || m.authorAvatarUrl || m.avatarUrl) : (m.authorAvatarUrl || m.avatarUrl) },
      text: m.text,
      fireCount: m.fireCount ?? 0, heartCount: m.heartCount ?? 0, mindblownCount: m.mindblownCount ?? 0,
      goatCount: m.goatCount ?? 0, clapCount: m.clapCount ?? 0, nochanceCount: m.noChanceCount ?? 0,
      userReaction: isPending ? (existing?.userReaction ?? null) : (m.userReaction ?? null),
      replyCount: Math.max(m.replyCount ?? 0, existing?.replyCount ?? 0),
      agreeCount: m.agreeCount ?? 0, disagreeCount: m.disagreeCount ?? 0,
      userVote: (existing?.userVote && !m.userVote) ? existing.userVote : (m.userVote ?? existing?.userVote ?? null),
      sideA: m.sideA ?? null, sideB: m.sideB ?? null,
      predictionOptions: Array.isArray(m.predictionOptions) ? m.predictionOptions : [m.sideA, m.sideB].filter(Boolean),
      predictionOptionCounts: m.predictionOptionCounts ?? {},
      closesAt: m.closesAt ?? null, closedAt: m.closedAt ?? null,
      resolvedAt: m.resolvedAt ?? null, correctVote: m.correctVote ?? null,
      accuracyAwarded: m.accuracyAwarded ?? false,
      timeAgo: new Date(m.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }) + " · " + new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: m.createdAt, type: m.type, mediaUrls: m.mediaUrls,
      quizQuestion: m.quizQuestion, quizOptions: m.quizOptions, quizCorrectOption: m.quizCorrectOption,
      quizUserAnswer: m.quizUserAnswer ?? null, quizTimer: m.quizTimer, quizPoints: m.quizPoints,
      quizParticipants: m.quizParticipants ?? 0, memGifUrl: m.memGifUrl ?? null, memTag: m.memTag ?? null,
    };
  }, [currentUserId, userAvatarUrl]);

  const loadMoreMsgs = useCallback(async () => {
    if (!roomId || loadingMoreMsgsRef.current || !hasMoreMsgs) return;
    const combined = [...posts, ...morePosts];
    if (combined.length === 0) return;
    const oldestCreatedAt = combined.reduce((min, p) => (p.createdAt < min ? p.createdAt : min), combined[0].createdAt);
    loadingMoreMsgsRef.current = true; setLoadingMoreMsgs(true);
    try {
      const res = await axios.get(`/api/roar/rooms/${roomId}/messages`, { params: { limit: LOAD_MORE_PAGE_SIZE, lastCreatedAt: oldestCreatedAt } });
      if (res.data?.success) {
        const newMsgs: any[] = res.data.messages ?? [];
        setMorePosts(prev => {
          const seenIds = new Set([...posts, ...prev].map(p => p.id ?? p.msgId));
          const fresh = newMsgs.filter(m => !seenIds.has(m.msgId)).map(m => mapMessage(m));
          return [...fresh, ...prev];
        });
        setHasMoreMsgs(Boolean(res.data.pagination?.hasMore));
      } else { setHasMoreMsgs(false); }
    } catch (e) { console.error("Failed to load more messages:", e); }
    finally { loadingMoreMsgsRef.current = false; setLoadingMoreMsgs(false); }
  }, [roomId, hasMoreMsgs, posts, morePosts, mapMessage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver((entries) => { if (entries[0]?.isIntersecting) loadMoreMsgs(); }, { root: listRef.current, rootMargin: "200px 0px 0px 0px", threshold: 0 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMoreMsgs]);

  const openShareDialog = (post: ShareableRoarPost) => { setSharePost(post); setCopied(false); };
  const closeShareDialog = () => { setSharePost(null); setCopied(false); };
  const copyToClipboard = async (text: string) => {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      try {
        const el = document.createElement("textarea"); el.value = text; el.style.position = "fixed"; el.style.opacity = "0";
        document.body.appendChild(el); el.focus(); el.select();
        const ok = document.execCommand("copy"); document.body.removeChild(el); return ok;
      } catch { return false; }
    }
  };
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
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) setShowEmojiPicker(false);
    };
    if (showEmojiPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) return;
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!roomId) return;
    setActiveFans([]); setLiveCount(0); setTotalJoinCount(0);
    const join = async () => {
      try {
        const res = await axios.post(`/api/roar/rooms/${roomId}/presence`);
        if (res.data?.success) { setLiveCount(res.data.fanCount); if (res.data.totalJoinCount !== undefined) setTotalJoinCount(res.data.totalJoinCount); }
      } catch (e) { console.error("Join failed:", e); }
    };
    const refreshActiveFans = async () => {
      try {
        const res = await axios.get(`/api/roar/rooms/${roomId}/presence`);
        if (res.data?.success) { setActiveFans(res.data.fans ?? []); setLiveCount(res.data.fanCount ?? 0); if (res.data.totalJoinCount !== undefined) setTotalJoinCount(res.data.totalJoinCount); }
      } catch (e) { console.error("Active fans fetch failed:", e); }
    };
    const leaveBeacon = () => { navigator.sendBeacon(`/api/roar/rooms/${roomId}/presence/leave`); };
    const leaveAxios = () => { axios.delete(`/api/roar/rooms/${roomId}/presence`).catch(() => { }); };
    join().then(() => setTimeout(refreshActiveFans, 2000));
    const heartbeat = setInterval(() => { if (!document.hidden) join(); }, 30_000);
    const fanRefresh = setInterval(() => { if (!document.hidden) refreshActiveFans(); }, 120_000);
    window.addEventListener("beforeunload", leaveBeacon);
    return () => { leaveAxios(); clearInterval(heartbeat); clearInterval(fanRefresh); window.removeEventListener("beforeunload", leaveBeacon); };
  }, [roomId]);

  useEffect(() => {
    try {
      setUserUsername(userProfile?.username || localStorage.getItem("roar_username") || "RoarUser");
      setUserAvatarUrl(currentAvatarUrl || userProfile?.avatarUrl || userProfile?.avatar || localStorage.getItem("roar_avatar_url") || undefined);
    } catch { }
  }, [currentAvatarUrl, userProfile]);

  const fetchMsgs = useCallback(async () => {
    if (!roomId) return;
    try {
      const url = latestCreatedAtRef.current
        ? `/api/roar/rooms/${roomId}/messages?since=${latestCreatedAtRef.current}&t=${Date.now()}`
        : `/api/roar/rooms/${roomId}/messages?t=${Date.now()}`;
      const res = await axios.get(url);
      if (res.data?.success) {
        const incoming: any[] = res.data.messages ?? [];
        if (latestCreatedAtRef.current === null) {
          setPosts(prev => {
            const prevMap = Object.fromEntries(prev.map(p => [p.id, p]));
            return [...res.data.messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((m: any) => mapMessage(m, prevMap[m.msgId]));
          });
          if (incoming.length > 0) latestCreatedAtRef.current = Math.max(...incoming.map(m => m.createdAt));
        } else if (incoming.length > 0) {
          latestCreatedAtRef.current = Math.max(...incoming.map((m: any) => m.createdAt));
          setPosts(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const fresh = incoming.filter((m: any) => !existingIds.has(m.msgId)).map((m: any) => ({ ...mapMessage(m), timeAgo: "now" }));
            return fresh.length > 0 ? [...prev, ...fresh] : prev;
          });
        }
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [roomId, mapMessage]);

  useEffect(() => { onRegisterRefresh?.(fetchMsgs); }, [fetchMsgs, onRegisterRefresh]);
  useEffect(() => {
    onRegisterReplyUpdate?.((postId, count) => {
      setPosts(p => p.map(x => x.id === postId ? { ...x, replyCount: count } : x));
    });
  }, [onRegisterReplyUpdate]);
  useEffect(() => { if (!roomId) return; fetchMsgs(); }, [fetchMsgs, roomId]);
  useVisibilityInterval(fetchMsgs, 15000);

  const fetchReactionUpdates = useCallback(async () => {
    if (!roomId) return;
    try {
      const res = await axios.get(`/api/roar/rooms/${roomId}/messages?t=${Date.now()}`);
      if (res.data?.success) {
        const incoming: any[] = res.data.messages ?? [];
        setPosts(prev => prev.map(p => {
          const updated = incoming.find((m: any) => m.msgId === p.id);
          if (!updated) return p;
          const isPending = pendingReactRef.current[p.id];
          return {
            ...p,
            heartCount: isPending ? p.heartCount : (updated.heartCount ?? p.heartCount),
            userReaction: isPending ? p.userReaction : (updated.userReaction ?? null),
            replyCount: Math.max(p.replyCount ?? 0, updated.replyCount ?? 0),
            agreeCount: updated.agreeCount ?? p.agreeCount,
            disagreeCount: updated.disagreeCount ?? p.disagreeCount,
            userVote: (p.userVote && !updated.userVote) ? p.userVote : (updated.userVote ?? p.userVote ?? null),
          };
        }));
        setMorePosts(prev => prev.map(p => {
          const updated = incoming.find((m: any) => m.msgId === p.id);
          if (!updated) return p;
          return {
            ...p,
            replyCount: Math.max(p.replyCount ?? 0, updated.replyCount ?? 0),
            agreeCount: updated.agreeCount ?? p.agreeCount,
            disagreeCount: updated.disagreeCount ?? p.disagreeCount,
            userVote: (p.userVote && !updated.userVote) ? p.userVote : (updated.userVote ?? p.userVote ?? null),
          };
        }));
        setLocalReactions(prev => {
          const next = { ...prev };
          incoming.forEach((m: any) => { if (!pendingReactRef.current[m.msgId]) next[m.msgId] = { reaction: m.userReaction ?? null, heartCount: m.heartCount ?? 0 }; });
          return next;
        });
      }
    } catch { }
  }, [roomId]);
  useVisibilityInterval(fetchReactionUpdates, 5000);

  const lastNotifCheckRef = useRef<number>(Date.now());
  const seenNotifIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!roomId) return;
    const checkNotifs = async () => {
      try {
        const res = await axios.get("/api/notifications", { params: { uid: userProfile?.actualUserId, email: userProfile?.email } });
        const notifs: any[] = res.data?.notifications ?? [];
        const fresh = notifs.filter(n => n.roomId === roomId && !n.isRead && !seenNotifIdsRef.current.has(n.id) && (n.createdAt ?? 0) > lastNotifCheckRef.current);
        if (fresh.length > 0) {
          fresh.forEach(n => seenNotifIdsRef.current.add(n.id));
          const latest = fresh[fresh.length - 1];
          const type = latest.type === "roar_post_comment" ? "comment" : "like";
          setNotifToast({ message: latest.message ?? (type === "comment" ? "Someone commented on your post" : "Someone reacted to your post"), type });
          if (notifToastTimerRef.current) clearTimeout(notifToastTimerRef.current);
          notifToastTimerRef.current = setTimeout(() => setNotifToast(null), 4000);
        }
      } catch { }
    };
    lastNotifCheckRef.current = Date.now();
    const interval = setInterval(checkNotifs, 60000);
    return () => { clearInterval(interval); if (notifToastTimerRef.current) clearTimeout(notifToastTimerRef.current); };
  }, [roomId, userProfile?.actualUserId, userProfile?.email]);

  useEffect(() => {
    if (!loading && listRef.current)
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight }), 50);
  }, [loading]);

  const prevPostCountRef = useRef(0);
  useEffect(() => {
    const newCount = posts.length;
    if (newCount > prevPostCountRef.current && listRef.current) {
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
    }
    prevPostCountRef.current = newCount;
  }, [posts.length]);

  const handleReact = useCallback(async (msgId: string, reaction: Reaction | null) => {
    if (!roomId || pendingReactRef.current[msgId]) return;
    const post = posts.find(p => p.id === msgId);
    const prev = localReactionsRef.current[msgId] ?? { reaction: post?.userReaction ?? null, heartCount: post?.heartCount ?? 0 };
    const sameReaction = prev.reaction === reaction;
    const newReaction = sameReaction ? null : reaction;
    const wasActive = prev.reaction !== null;
    const newActive = newReaction !== null;
    const countDelta = newActive && !wasActive ? 1 : (!newActive && wasActive ? -1 : 0);
    const optimisticState = { reaction: newReaction, heartCount: Math.max(0, prev.heartCount + countDelta) };
    setLocalReactions(p => ({ ...p, [msgId]: optimisticState }));
    pendingReactRef.current[msgId] = true;
    try {
      const res: any = newReaction === null ? await roarApi.unreactPost(msgId, roomId) : await roarApi.reactPost(msgId, newReaction, roomId);
      if (res && typeof res.likeCount === "number") setLocalReactions(p => ({ ...p, [msgId]: { ...optimisticState, heartCount: res.likeCount } }));
    } catch { setLocalReactions(p => ({ ...p, [msgId]: prev })); onToast("Failed to save reaction"); }
    finally { pendingReactRef.current[msgId] = false; }
  }, [roomId, posts, onToast]);

  const getPredictionVoteValue = (optionIndex: number) => (
    optionIndex === 0 ? "agree" : optionIndex === 1 ? "disagree" : `option_${optionIndex}`
  );

  const getPredictionOptionLabel = (voteValue: string | undefined, options: string[]) => {
    if (!voteValue) return "";
    if (voteValue === "agree") return options[0] || "Option 1";
    if (voteValue === "disagree") return options[1] || "Option 2";
    const optionIndex = Number(voteValue.replace("option_", ""));
    return Number.isFinite(optionIndex) ? (options[optionIndex] || voteValue) : voteValue;
  };

  const formatPredictionCloseLabel = (p: { resolvedAt?: number; closesAt?: number; closedAt?: number }) => {
    if (p.resolvedAt) return "Resolved";
    if (!p.closesAt) return "Open";
    const remaining = p.closesAt - Date.now();
    if (remaining <= 0 || p.closedAt) return "Closed";
    const mins = Math.ceil(remaining / 60000);
    if (mins < 60) return `${mins}m left`;
    return `${Math.ceil(mins / 60)}h left`;
  };

  const resolveRoomPrediction = async (msgId: string, correctVote: string) => {
    if (!roomId) return;
    try {
      setResolvingRoomPredictionId(msgId);
      const res = await axios.post(`/api/roar/rooms/${roomId}/messages/${msgId}/resolve`, { correctVote });
      if (res.data?.success) {
        const resolvedAt = res.data.message?.resolvedAt ?? Date.now();
        setPosts(prev => prev.map(p => p.id !== msgId ? p : { ...p, resolvedAt, closedAt: res.data.message?.closedAt ?? resolvedAt, correctVote, accuracyAwarded: true }));
        onToast(`Prediction resolved. ${res.data.correctCount ?? 0} correct fans awarded.`);
      } else { onToast("Failed to resolve prediction"); }
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.error : undefined;
      onToast(message || "Failed to resolve prediction");
    } finally { setResolvingRoomPredictionId(null); }
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
    if (sendingRef.current) return;
    sendingRef.current = true; setIsSending(true);
    try {
      const res = await axios.post(`/api/roar/rooms/${roomId}/messages`, { text: text || "Shared media", type: mode, mediaUrls: attachedUrl ? [attachedUrl] : undefined });
      if (res.data?.success) {
        const m = res.data.message;
        setPosts(p => [...p, { id: m.msgId, fan: { username: displayUsername(m.authorUsername), authorUid: m.authorUid, badge: m.authorBadge, avatarUrl: m.authorAvatarUrl || m.avatarUrl || (m.authorUsername === userUsername ? userAvatarUrl : undefined) }, text: m.text, fireCount: m.fireCount ?? 0, heartCount: m.heartCount ?? 0, mindblownCount: m.mindblownCount ?? 0, goatCount: m.goatCount ?? 0, clapCount: m.clapCount ?? 0, nochanceCount: m.noChanceCount ?? 0, userReaction: null, replyCount: 0, agreeCount: 0, disagreeCount: 0, userVote: null, sideA: m.sideA ?? null, sideB: m.sideB ?? null, timeAgo: "now", createdAt: m.createdAt || Date.now(), type: m.type, mediaUrls: m.mediaUrls, quizQuestion: m.quizQuestion, quizOptions: m.quizOptions, quizCorrectOption: m.quizCorrectOption, quizUserAnswer: m.quizUserAnswer ?? null, quizTimer: m.quizTimer, quizPoints: m.quizPoints, quizParticipants: m.quizParticipants ?? 0, memGifUrl: m.memGifUrl ?? null, memTag: m.memTag ?? null }]);
        setInput(""); setAttachedUrl(null); setAttachedType(null);
        setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
      }
    } catch { onToast("Failed to send message"); }
    finally { sendingRef.current = false; setIsSending(false); }
  };

  // ── Handle quick-react post (cricket moments) ────────────────────────────────
  const handleQuickReactPost = async (opt: typeof QUICK_REACT_OPTS[0]) => {
    if (!roomId) return;
    setShowQuickCompose(false);
    const memTag = opt.id.replace("qr_", ""); // e.g. "wicket"
    try {
      const res = await axios.post(`/api/roar/rooms/${roomId}/messages`, {
        text: opt.label,
        type: "post",   // posts as a normal post
        memTag,         // stored so the feed renders the gradient card
      });
      if (res.data?.success) {
        const m = res.data.message;
        setPosts(p => [...p, {
          id: m.msgId,
          fan: { username: displayUsername(m.authorUsername), authorUid: m.authorUid, badge: m.authorBadge, avatarUrl: m.authorAvatarUrl || userAvatarUrl },
          text: m.text,
          fireCount: 0, heartCount: 0, mindblownCount: 0, goatCount: 0, clapCount: 0, nochanceCount: 0,
          userReaction: null, replyCount: 0, agreeCount: 0, disagreeCount: 0, userVote: null,
          timeAgo: "now", createdAt: m.createdAt || Date.now(),
          type: "post",
          memTag,
          memGifUrl: null,
          mediaUrls: [],
        }]);
        setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
        onToast(`${opt.emoji} ${opt.label} posted!`);
      }
    } catch { onToast("Failed to post"); }
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

  const renderReactionPicker = (p: any) => {
    const lo = localReactions[p.id];
    const currentReaction: Reaction | null = lo !== undefined ? lo.reaction : (p.userReaction ?? null);
    const heartCount = lo !== undefined ? lo.heartCount : (p.heartCount ?? 0);
    return (
      <div onClick={e => e.stopPropagation()}>
        <ReactionPicker
          currentReaction={currentReaction}
          count={heartCount}
          onReact={(r) => handleReact(p.id, r)}
          postId={p.id}
          roomId={roomId}
        />
      </div>
    );
  };

  const REACTION_EMOJI: Record<string, string> = { fire: "🔥", heart: "❤️", mindblown: "🤯", goat: "🐐", clap: "👏", nochance: "🙅", laugh: "😂", sad: "😢", thumb: "👍" };

  const renderReactionsTrigger = (p: any) => {
    const lo = localReactions[p.id];
    const heartCount = lo !== undefined ? lo.heartCount : (p.heartCount ?? 0);
    if (heartCount === 0) return null;
    const topReactions = topReactionsMap[p.id] ?? [];
    if (topReactions.length === 0 && !topReactionsCache.current[p.id]) fetchTopReactions(p.id);
    const currentReaction = lo?.reaction ?? p.userReaction ?? null;
    const displayReactions = topReactions.length > 0 ? topReactions : currentReaction ? [currentReaction] : [];
    if (displayReactions.length === 0) return null;
    return (
      <motion.button whileTap={{ scale: 0.93 }} onClick={e => { e.stopPropagation(); setReactionsMsgId(p.id); }} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", marginLeft: "auto", padding: 0 }} title="See who reacted">
        <div style={{ display: "flex" }}>
          {displayReactions.map((type, i) => (
            <div key={type} style={{ width: 20, height: 20, borderRadius: "50%", background: "#1e1e2a", border: "1.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, marginLeft: i === 0 ? 0 : -6, zIndex: displayReactions.length - i, position: "relative" }}>
              {REACTION_EMOJI[type] ?? "❤️"}
            </div>
          ))}
        </div>
      </motion.button>
    );
  };

  const renderPostHeader = (p: any, onAvatarClick?: () => void) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, minWidth: 0 }} onClick={e => e.stopPropagation()}>
      <div style={{ flexShrink: 0, cursor: onAvatarClick ? "pointer" : "default" }} onClick={e => { e.stopPropagation(); onAvatarClick?.(); }}>
        <AvatarWithBadge username={p.fan.username} badge={p.fan.badge} size="sm" avatarUrl={p.fan.avatarUrl} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0, flexWrap: "wrap" }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: "#fff", whiteSpace: "nowrap", cursor: onAvatarClick ? "pointer" : "default" }} onClick={e => { e.stopPropagation(); onAvatarClick?.(); }}>
          {p.fan.username}
        </span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.38)", whiteSpace: "nowrap" }}>{p.timeAgo}</span>
        {p.type && (
          <span className={typeBadgeClass(p.type)}>
            {p.type === "post" ? "POST" : p.type === "hottake" ? "HOT TAKE" : p.type === "prediction" ? "PREDICTION" : p.type === "debate" ? "DEBATE" : p.type === "raw_reactions" ? "RAW REACTIONS" : p.type.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );

  const renderActionBar = (p: any, postPayload: any, postType: string) => {
    const isOpen = openInlinePostId === p.id;
    const replyCount = p.replyCount || 0;
    const accent = commentAccentColor(postType);
    return (
      <div style={{ marginTop: 2 }}>
        <div style={{ display: "flex", gap: 14, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10, alignItems: "center" }}>
          {renderReactionPicker(p)}
          <button
            onClick={e => { e.stopPropagation(); setOpenInlinePostId(isOpen ? null : p.id); }}
            style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: isOpen ? accent : "#9494ad", fontSize: 13, fontWeight: 600, transition: "color 0.15s", padding: 0 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span style={{ fontSize: 12 }}>{replyCount}</span>
            {isOpen ? <ChevronUp size={12} style={{ opacity: 0.7 }} /> : <ChevronDown size={12} style={{ opacity: 0.5 }} />}
          </button>
          <button onClick={e => { e.stopPropagation(); openShareDialog(p); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#9494ad", fontSize: 13, fontWeight: 600 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
          {renderReactionsTrigger(p)}
          {isCurrentUserAuthor(p) && (
            <button
              onClick={async e => {
                e.stopPropagation();
                if (!window.confirm("Delete this post?")) return;
                try { await axios.delete(`/api/roar/rooms/${roomId}/messages/${p.id}`); setPosts(prev => prev.filter(x => x.id !== p.id)); }
                catch { onToast("Failed to delete post"); }
              }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", marginLeft: "auto", padding: 4, borderRadius: "50%" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
              </svg>
            </button>
          )}
        </div>
        <AnimatePresence>
          {isOpen && roomId && (
            <InlineSection
              key={`inline-${p.id}`}
              postId={p.id} roomId={roomId} isOpen={isOpen}
              onOpenFull={() => { setOpenInlinePostId(null); onPostClick?.(postPayload); }}
              accentColor={accent} currentAvatarUrl={userAvatarUrl}
              onCommentPosted={() => {
                setPosts(prev => prev.map(x => x.id === p.id ? { ...x, replyCount: (x.replyCount || 0) + 1 } : x));
                onToast("Comment posted!");
              }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  const postCount = posts.filter(p => p.type === "post" || !p.type).length;
  const debateCount = posts.filter(p => p.type === "debate").length;
  const predictionCount = posts.filter(p => p.type === "prediction").length;

  const filteredPosts = activeFilter === "all"
    ? [...morePosts, ...posts]
    : [...morePosts, ...posts].filter(p => {
      if (activeFilter === "post") return p.type === "post" || !p.type;
      return p.type === activeFilter;
    });

  return (
    <div className="flex flex-col w-full bg-[#0e0e14]" style={{ height: "100%", overflow: "hidden" }}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <linearGradient id="dr-pink-orange-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e91e8c" /><stop offset="100%" stopColor="#ff6b35" />
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
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button type="button" onPointerDown={handleBack} onClick={handleBack} className="bg-transparent border-none cursor-pointer text-white flex items-center p-0 flex-shrink-0" style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}>
              <ChevronLeft size={24} />
            </button>
            <div className="text-left pt-0.5 min-w-0 flex-1">
              <p className="font-display text-xl tracking-[0.04em] m-0 leading-tight text-white font-extrabold uppercase truncate">{roomName || "WORLDCUP"}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="live-pulse w-1.5 h-1.5 rounded-full bg-[var(--live-green)] inline-block flex-shrink-0" />
                  <span className="text-[9px] font-bold text-[var(--live-green)] flex-shrink-0">LIVE</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button type="button" onClick={shareRoomLink} className="flex-shrink-0 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] rounded-[10px] p-2 cursor-pointer text-[rgba(255,255,255,0.75)] flex items-center justify-center" style={{ width: "36px", height: "36px" }}>
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
      </div>

      {/* ── ACTIVE FANS ── */}
      <div className="shrink-0 px-4 py-0.5 bg-[rgba(14,14,20,0.98)] border-b border-[var(--border)]">
        <ActiveFansStack fans={activeFans} count={liveCount} totalJoinCount={totalJoinCount} onClick={() => setActiveFansOpen(true)} />
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div className="flex justify-start gap-1.5 py-1 px-3 overflow-x-auto shrink-0 border-b border-[var(--border)]" style={{ scrollbarWidth: "none" }}>
        {(["all", "post", "debate", "prediction"] as const).map((f) => {
          const isActive = activeFilter === f;
          const count = f === "post" ? postCount : f === "debate" ? debateCount : f === "prediction" ? predictionCount : 0;
          const color = f === "post" ? "#e91e8c" : f === "debate" ? "#60a5fa" : f === "prediction" ? "#fbbf24" : "#fff";
          const label = f === "all" ? "All" : f === "post" ? "Posts" : f === "debate" ? "Debates" : "Predictions";
          return (
            <button key={f} type="button" onClick={() => setActiveFilter(f)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 transition-all duration-150"
              style={{ background: isActive ? `${color}22` : "rgba(255,255,255,0.05)", border: `1.5px solid ${isActive ? `${color}70` : "rgba(255,255,255,0.1)"}`, color: isActive ? color : "rgba(255,255,255,0.5)" }}
            >
              {f !== "all" && <span className="w-1 h-1 rounded-full shrink-0" style={{ background: color }} />}
              {label}
              {f !== "all" && !isActive && count > 0 && (
                <span className="text-[9px] font-extrabold px-1 py-0.5 rounded-full" style={{ background: `${color}28`, color }}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── FEED ── */}
      <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 flex flex-col gap-3 min-h-0">
        <AnimatePresence initial={false}>
          {loading ? (
            <div className="text-center text-[var(--text-muted)] py-8">Loading messages...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center text-[var(--text-muted)] py-8">
              {activeFilter === "all" ? "No posts yet. Be the first!" : `No ${activeFilter}s in this room yet.`}
            </div>
          ) : (
            filteredPosts.map((p) => {

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
                const debatePayload = { id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo, createdAt: p.createdAt, type: "debate", isDbPost: true, roomId, mediaUrls: p.mediaUrls, sideA, sideB };
                return (
                  <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
                    className="cursor-pointer" style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                    onClick={() => onPostClick?.(debatePayload)}
                  >
                    {renderPostHeader(p, () => onFanProfile?.(p.fan))}
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
                              if (hasVoted || votingInProgressRef.current.has(p.id)) return;
                              votingInProgressRef.current.add(p.id);
                              setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: voteVal, agreeCount: (x.agreeCount ?? 0) + (voteVal === "agree" ? 1 : 0), disagreeCount: (x.disagreeCount ?? 0) + (voteVal === "disagree" ? 1 : 0) }));
                              setOpenInlinePostId(p.id);
                              try {
                                await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: voteVal });
                                if (phog) {
                                  phog.capture("poll_voted", {
                                    poll_id: p.id,
                                    poll_type: "debate_vs",
                                    option_id: voteVal,
                                    room_id: roomId
                                  });
                                }
                              } catch (err: any) {
                                const status = err?.response?.status;
                                if (status !== 409 && status !== 400) {
                                  setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: null, agreeCount: Math.max(0, (x.agreeCount ?? 0) - (voteVal === "agree" ? 1 : 0)), disagreeCount: Math.max(0, (x.disagreeCount ?? 0) - (voteVal === "disagree" ? 1 : 0)) }));
                                  onToast("Failed to submit vote");
                                }
                              } finally { votingInProgressRef.current.delete(p.id); }
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
                      {hasVoted ? "You've already voted · thanks for joining the debate!" : "Tap a side to vote · results reveal after voting"}
                    </p>
                    {renderActionBar(p, debatePayload, "debate")}
                  </motion.div>
                );
              }

              /* ── DEFAULT (post / hottake / prediction / raw_reactions) ── */
              const defaultPayload = { id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo, createdAt: p.createdAt, type: p.type || "post", isDbPost: true, roomId, mediaUrls: p.mediaUrls };

              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
                  className="cursor-pointer" style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                  onClick={() => onPostClick?.(defaultPayload)}
                >
                  {renderPostHeader(p, () => onFanProfile?.(p.fan))}

                  {/* ── Cricket quick-react card (memTag on any post type) ── */}
                  {p.memTag && ["wicket", "six", "four", "boundary"].includes(p.memTag) ? (
                    <div style={{
                      background: QUICK_REACT_GRADIENTS[`qr_${p.memTag}`] || "linear-gradient(135deg,#e91e8c,#ff6b35)",
                      borderRadius: 16, padding: "28px 16px", textAlign: "center", marginTop: 4, marginBottom: 4,
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                      position: "relative", overflow: "hidden",
                    }}>
                      <div style={{ fontSize: 32, lineHeight: 1 }}>
                        {p.memTag === "wicket" && "🎯 🏏"}
                        {p.memTag === "six" && "💪 6️⃣"}
                        {p.memTag === "four" && "🏏 ⚡"}
                        {p.memTag === "boundary" && "🏏 💥"}
                      </div>
                      <p style={{ margin: 0, fontWeight: 900, fontSize: 20, color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
                        {p.text}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm leading-snug text-white">{p.text}</p>
                      {p.type === "raw_reactions" && p.memGifUrl && <img src={p.memGifUrl} alt="reaction gif" style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 12, marginTop: 8 }} />}
                      {p.type === "raw_reactions" && p.memTag && !["wicket", "six", "four", "boundary"].includes(p.memTag) && (
                        <span style={{ display: "inline-block", marginTop: 8, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: "rgba(0,232,198,0.12)", color: "#00e8c6", border: "1px solid rgba(0,232,198,0.3)", letterSpacing: "0.04em" }}>#{p.memTag}</span>
                      )}
                    </>
                  )}

                  {/* ── PREDICTION ── */}
                  {p.type === "prediction" && (() => {
                    const liveTotal = (p.agreeCount ?? 0) + (p.disagreeCount ?? 0);
                    const userVote = p.userVote;
                    const hasVoted = userVote === "agree" || userVote === "disagree";
                    const predictionOptions = Array.isArray(p.predictionOptions) && p.predictionOptions.length >= 2 ? p.predictionOptions : [p.sideA || "Option 1", p.sideB || "Option 2"];
                    const optionCounts = p.predictionOptionCounts ?? {};
                    const predictionTotal = liveTotal + Object.values(optionCounts).reduce((sum: number, count: unknown) => sum + (Number(count) || 0), 0);
                    const predictionPct = (count: number) => predictionTotal > 0 ? Math.round((count / predictionTotal) * 100) : 0;
                    const predAgrPct = predictionPct(p.agreeCount ?? 0);
                    const predDisAgrPct = predictionPct(p.disagreeCount ?? 0);
                    const hasPredictionVoted = hasVoted || (typeof userVote === "string" && userVote.startsWith("option_"));
                    const predictionClosed = Boolean(p.resolvedAt || p.closedAt || (p.closesAt && p.closesAt <= Date.now()));
                    const isPredictionAuthor = isCurrentUserAuthor(p);
                    const correctVoteLabel = getPredictionOptionLabel(p.correctVote, predictionOptions);
                    return (
                      <>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: predictionClosed ? "rgba(244,67,54,0.12)" : "rgba(34,197,94,0.1)", color: predictionClosed ? "#f87171" : "#22c55e", border: `1px solid ${predictionClosed ? "rgba(244,67,54,0.25)" : "rgba(34,197,94,0.22)"}` }}>
                            <Clock size={11} /> {formatPredictionCloseLabel(p)}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 10, marginBottom: 4 }}>
                          {predictionOptions.slice(0, 2).map((label: string, optionIndex: number) => {
                            const agree = optionIndex === 0;
                            const pctVal = optionIndex === 0 ? predAgrPct : predDisAgrPct;
                            const active = optionIndex === 0 ? userVote === "agree" : userVote === "disagree";
                            return (
                              <motion.button key={label} disabled={predictionClosed} whileTap={!hasPredictionVoted && !predictionClosed ? { scale: 0.93 } : {}}
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (hasPredictionVoted || predictionClosed) return;
                                  setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: agree ? "agree" : "disagree", agreeCount: (x.agreeCount ?? 0) + (agree ? 1 : 0), disagreeCount: (x.disagreeCount ?? 0) + (!agree ? 1 : 0) }));
                                  try {
                                    await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: agree ? "agree" : "disagree" });
                                    if (phog) {
                                      phog.capture("poll_voted", {
                                        poll_id: p.id,
                                        poll_type: p.type || "prediction",
                                        option_id: agree ? "agree" : "disagree",
                                        room_id: roomId
                                      });
                                      phog.capture("submit_prediction", {
                                        post_id: p.id,
                                        room_id: roomId,
                                        option_id: agree ? "agree" : "disagree"
                                      });
                                    }
                                  } catch { onToast("You've already voted!!"); }
                                }}
                                style={{ flex: 1, padding: "9px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: hasPredictionVoted || predictionClosed ? "default" : "pointer", border: `2px solid ${active ? "#ff6b35" : "#8b8b8b"}`, background: active ? "rgba(255,107,53,0.24)" : "rgba(255,255,255,0.02)", color: active ? "#fff" : "#d1d1d1", boxShadow: active ? "0 0 14px rgba(255,107,53,0.35)" : "none", transition: "all 0.2s ease-in-out", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: (hasPredictionVoted || predictionClosed) && !active ? 0.4 : 1 }}
                              >
                                {label}
                                <span style={{ fontSize: 10, fontWeight: 800, background: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)", borderRadius: 999, padding: "1px 6px" }}>{pctVal}%</span>
                              </motion.button>
                            );
                          })}
                        </div>
                        {predictionOptions.length > 2 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
                            {predictionOptions.slice(2).map((label: string, idx: number) => {
                              const voteValue = `option_${idx + 2}`;
                              const active = userVote === voteValue;
                              const pctVal = predictionPct(optionCounts[voteValue] ?? 0);
                              return (
                                <button key={`${label}-${idx}`} type="button" disabled={hasPredictionVoted || predictionClosed}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    if (hasPredictionVoted || predictionClosed) return;
                                    setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: voteValue, predictionOptionCounts: { ...(x.predictionOptionCounts ?? {}), [voteValue]: ((x.predictionOptionCounts ?? {})[voteValue] ?? 0) + 1 } }));
                                    try {
                                      await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: voteValue });
                                      if (phog) {
                                        phog.capture("poll_voted", {
                                          poll_id: p.id,
                                          poll_type: p.type || "prediction",
                                          option_id: voteValue,
                                          room_id: roomId
                                        });
                                        phog.capture("submit_prediction", {
                                          post_id: p.id,
                                          room_id: roomId,
                                          option_id: voteValue
                                        });
                                      }
                                    } catch { onToast("You've already voted!!"); }
                                  }}
                                  style={{ flex: "1 1 calc(50% - 4px)", minWidth: 0, padding: "9px", borderRadius: 999, fontSize: 12, fontWeight: 700, border: `2px solid ${active ? "#ff6b35" : "#8b8b8b"}`, background: active ? "rgba(255,107,53,0.24)" : "rgba(255,255,255,0.02)", color: active ? "#fff" : "#d1d1d1", boxShadow: active ? "0 0 14px rgba(255,107,53,0.35)" : "none", textAlign: "center", opacity: (hasPredictionVoted || predictionClosed) && !active ? 0.4 : 1, cursor: hasPredictionVoted || predictionClosed ? "default" : "pointer" }}
                                >
                                  {label}
                                  <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 800, background: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)", borderRadius: 999, padding: "1px 6px" }}>{pctVal}%</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                        {predictionClosed && !p.resolvedAt && isPredictionAuthor && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8, marginBottom: 4 }}>
                            {predictionOptions.map((label: string, optionIndex: number) => (
                              <button key={`room-resolve-${label}-${optionIndex}`} type="button" disabled={resolvingRoomPredictionId === p.id}
                                onClick={(e) => { e.stopPropagation(); resolveRoomPrediction(p.id, getPredictionVoteValue(optionIndex)); }}
                                style={{ flex: "1 1 calc(50% - 4px)", minWidth: 0, padding: "9px", borderRadius: 12, fontSize: 12, fontWeight: 800, border: "1px solid rgba(34,197,94,0.35)", background: "rgba(34,197,94,0.1)", color: "#22c55e", cursor: resolvingRoomPredictionId === p.id ? "wait" : "pointer" }}
                              >
                                Resolve: {label}
                              </button>
                            ))}
                          </div>
                        )}
                        {p.resolvedAt && correctVoteLabel && (
                          <p style={{ fontSize: 11, color: "#22c55e", fontWeight: 800, marginTop: 8, marginBottom: 4 }}>Correct answer: {correctVoteLabel}</p>
                        )}
                      </>
                    );
                  })()}

                  {/* media */}
                  {p.mediaUrls?.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                      {p.mediaUrls.map((url: string, i: number) =>
                        url.endsWith(".mp4") || url.includes("/video/upload/")
                          ? <video key={i} src={url} controls className="w-full max-h-[200px] rounded-lg object-cover" onClick={e => e.stopPropagation()} />
                          : <img key={i} src={url} alt="" className="w-full max-h-[200px] rounded-lg object-cover" />
                      )}
                    </div>
                  )}

                  {/* ── HOT TAKE ── */}
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
                                setPosts(prev => prev.map(x => x.id !== p.id ? x : { ...x, userVote: agree ? "agree" : "disagree", agreeCount: (x.agreeCount ?? 0) + (agree ? 1 : 0), disagreeCount: (x.disagreeCount ?? 0) + (!agree ? 1 : 0) }));
                                setOpenInlinePostId(p.id);
                                try {
                                  await axios.post(`/api/roar/rooms/${roomId}/messages/${p.id}/vote`, { vote: agree ? "agree" : "disagree" });
                                  if (phog) {
                                    phog.capture("poll_voted", {
                                      poll_id: p.id,
                                      poll_type: p.type || "hot_take",
                                      option_id: agree ? "agree" : "disagree",
                                      room_id: roomId
                                    });
                                  }
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

                  {renderActionBar(p, { ...defaultPayload, replyCount: p.replyCount }, p.type || "post")}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {hasMoreMsgs && !loading && (
          <div ref={sentinelRef} style={{ display: "flex", justifyContent: "center", padding: "16px 0" }}>
            {loadingMoreMsgs && <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #E91E8C", animation: "dr-spin 0.8s linear infinite" }} />}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes dr-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}` }} />

      {/* ── CATEGORY PILLS — hidden when quick compose is open ── */}
      {!showQuickCompose && (
        <div className="flex justify-start gap-1.5 py-1 px-2.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {RADIAL_OPTS.map((q) => {
            const isActive = q.id === selectedActionId;
            return (
              <button key={q.id} type="button"
                onClick={() => { setSelectedActionId(q.id); onCompose?.(q.id); if (q.id !== "post") setSelectedActionId("post"); }}
                className={["flex items-center justify-start gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all duration-150 cursor-pointer shrink-0", isActive ? "border-[rgba(233,30,140,0.35)] bg-[rgba(233,30,140,0.12)]" : "border-transparent bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.6)]"].join(" ")}
              >
                {composeIconMap[q.id] || <span>{q.emoji}</span>}
                <span>{q.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── COMPOSER ── */}
      <div className="shrink-0 px-3 pt-1.5 pb-1.5 bg-[rgba(14,14,20,0.98)] backdrop-blur-[20px] border-t border-[var(--border)] flex flex-col gap-1.5">
        {selectedActionId === "post" && (
          <>
            {/* ── Quick Compose Panel ── */}
            <AnimatePresence>
              {showQuickCompose && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ paddingBottom: 6, paddingTop: 2 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                      Quick Post
                    </p>
                    <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
                      {QUICK_REACT_OPTS.map((q) => (
                        <motion.button
                          key={q.id}
                          type="button"
                          whileTap={{ scale: 0.93 }}
                          onClick={() => handleQuickReactPost(q)}
                          style={{
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "7px 14px",
                            borderRadius: 999,
                            border: q.id.includes("wicket") ? "1px solid rgba(233,30,140,0.4)"
                              : q.id.includes("six") ? "1px solid rgba(245,158,11,0.4)"
                              : q.id.includes("four") ? "1px solid rgba(249,115,22,0.4)"
                              : "1px solid rgba(16,185,129,0.4)",
                            background: q.id.includes("wicket") ? "rgba(233,30,140,0.12)"
                              : q.id.includes("six") ? "rgba(245,158,11,0.12)"
                              : q.id.includes("four") ? "rgba(249,115,22,0.12)"
                              : "rgba(16,185,129,0.12)",
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span style={{ fontSize: 14 }}>{q.emoji}</span>
                          <span>{q.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {attachedUrl && (
              <div className="px-2 py-1.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {attachedType === "image"
                    ? <img src={attachedUrl} className="w-8 h-8 rounded-lg object-cover" alt="Attached" />
                    : <video src={attachedUrl} className="w-8 h-8 rounded-lg object-cover" />}
                  <span className="text-xs text-[var(--text-secondary)]">Media attached</span>
                </div>
                <button type="button" onClick={() => { setAttachedUrl(null); setAttachedType(null); }} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer text-sm">✕</button>
              </div>
            )}

            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="w-full overflow-hidden rounded-xl border border-white/10" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a1a24] border-b border-white/10">
                  <span className="text-[11px] font-semibold text-white/40">Pick an emoji</span>
                  <button type="button" onClick={() => setShowEmojiPicker(false)} className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 border-none cursor-pointer text-white text-[13px] font-bold leading-none">✕</button>
                </div>
                <div className="max-h-[200px] overflow-y-auto w-full [&>em-emoji-picker]:w-full">
                  <EmojiPicker data={data} theme="dark" onEmojiSelect={(emoji: any) => { setInput(prev => prev + emoji.native); }} previewPosition="none" skinTonePosition="none" perLine={7} />
                </div>
              </div>
            )}

            <div className="flex items-center w-full gap-1">
              {/* Image attach */}
              <button type="button" onClick={() => triggerUpload("image")} disabled={uploading} className="bg-transparent border-none -ml-2 text-white/40 cursor-pointer flex items-center justify-center p-1 shrink-0">
                <Image size={18} />
              </button>

              {/* + Quick compose toggle */}
              <button
                type="button"
                onClick={() => { setShowQuickCompose(prev => !prev); setShowEmojiPicker(false); }}
                className="bg-transparent border-none cursor-pointer flex items-center justify-center p-1 shrink-0"
                style={{
                  color: showQuickCompose ? "#e91e8c" : "rgba(255,255,255,0.4)",
                  fontSize: 20,
                  fontWeight: 300,
                  lineHeight: 1,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: showQuickCompose ? "rgba(233,30,140,0.12)" : "transparent",
                  border: showQuickCompose ? "1px solid rgba(233,30,140,0.3)" : "1px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {showQuickCompose ? "✕" : "+"}
              </button>

              {/* Emoji toggle */}
              <button
                type="button"
                onClick={() => { setShowEmojiPicker(prev => !prev); setShowQuickCompose(false); }}
                className="bg-transparent border-none cursor-pointer -ml-1 flex items-center justify-center p-1 shrink-0 text-[18px] leading-none"
                style={{ color: showEmojiPicker ? "#e91e8c" : "rgba(255,255,255,0.4)" }}
              >
                😊
              </button>

              {/* Input */}
              <div className="flex-1 relative min-w-0">
                {input === "" && !uploading && (
                  <div className="absolute left-3 top-0 bottom-0 flex items-center pointer-events-none">
                    <span className="text-sm font-medium truncate" style={{ color: MODE_COLOR["post"] || "var(--text-secondary)" }}>{PLACEHOLDER["post"]}</span>
                  </div>
                )}
                <input
                  type="text" disabled={uploading} value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  className="w-full h-9 rounded-[18px] bg-[var(--bg-secondary)] border border-[var(--border)] pl-3 pr-3 text-white text-sm outline-none"
                />
              </div>

              {/* Send */}
              <motion.button
                whileTap={{ scale: 0.96 }} onClick={send} disabled={uploading || isSending}
                className="w-7 h-7 rounded-full border-none -mr-2 text-white text-base font-bold flex items-center justify-center cursor-pointer shrink-0 bg-gradient-to-br from-[#e91e8c] to-[#ff6b35]"
                style={{ opacity: uploading ? 0.5 : 1 }}
              >
                ↑
              </motion.button>
            </div>
          </>
        )}
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      <ReactionsDialog postId={reactionsMsgId ?? ""} isOpen={reactionsMsgId !== null} onClose={() => setReactionsMsgId(null)} onFanProfile={onFanProfile} roomId={roomId} />
      <ActiveFansDialog
        roomId={roomId}
        isOpen={activeFansOpen}
        onClose={() => setActiveFansOpen(false)}
        onFanProfile={onFanProfile}
        prefetchedFans={activeFans}
        prefetchedCount={liveCount}
      />

      {/* ── Notification toast ── */}
      <AnimatePresence>
        {notifToast && (
          <motion.div initial={{ opacity: 0, y: -60, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -40, scale: 0.95 }} transition={{ duration: 0.22, ease: "easeOut" }} onClick={() => setNotifToast(null)}
            style={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 100, display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 20, background: notifToast.type === "comment" ? "rgba(147,51,234,0.92)" : "rgba(233,30,140,0.92)", backdropFilter: "blur(12px)", border: `1px solid ${notifToast.type === "comment" ? "rgba(147,51,234,0.5)" : "rgba(233,30,140,0.5)"}`, boxShadow: `0 8px 32px ${notifToast.type === "comment" ? "rgba(147,51,234,0.35)" : "rgba(233,30,140,0.35)"}`, cursor: "pointer", wordBreak: "break-word" }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>{notifToast.type === "comment" ? "💬" : "❤️"}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", wordBreak: "break-word" }}>{notifToast.message}</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", flexShrink: 0, marginLeft: 4 }}>tap to dismiss</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}