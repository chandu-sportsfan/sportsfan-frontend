


// import { useState, useEffect, useCallback, useRef } from "react";
// import { AnimatePresence } from "framer-motion";
// import axios from "axios";
// import AvatarWithBadge from "./AvatarWithBadge";
// import { SplitBar } from "./shared";
// import { clamp, formatTimeAgo } from "../utils";
// import { ChevronLeft, Trash2, X } from "lucide-react";

// interface Props {
//   post: any;
//   onClose: () => void;
//   onToast: (m: string) => void;
//   onVote: (id: string, vote: "agree" | "disagree" | null) => void;
//   onDeletePost?: (id: string, roomId?: string) => void;
//   currentUsername?: string;
//   currentAvatarUrl?: string;
//   bottomNavHeight?: number;
// }

// export default function PostDetailsOverlay({
//   post,
//   onClose,
//   onToast,
//   onVote,
//   onDeletePost,
//   currentUsername,
//   currentAvatarUrl,
//   bottomNavHeight = 0,
// }: Props) {
//   const [comments, setComments] = useState<any[]>([]);
//   const [commentText, setCommentText] = useState("");
//   const [replyTo, setReplyTo] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [userUsername, setUserUsername] = useState("RoarUser");
//   const activeUsername = currentUsername || userUsername;
//   const [userBadge, setUserBadge] = useState("RISING_FAN");
//   const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(currentAvatarUrl);
//   const [votes, setVotes] = useState<Record<string, boolean | null>>(() =>
//     post.userVote ? { [post.id]: post.userVote === "agree" } : {},
//   );
//   const [pct, setPct] = useState(post.agreePercent ?? 50);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [headerHeight, setHeaderHeight] = useState(0);
//   const [sidebarWidth, setSidebarWidth] = useState(0);

//   // Check for mobile screen and get header height & sidebar width
//   useEffect(() => {
//     const checkLayout = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);

//       // Get header height dynamically
//       const header = document.querySelector('header');
//       if (header) {
//         setHeaderHeight(header.getBoundingClientRect().height);
//       } else {
//         setHeaderHeight(60); // Default fallback
//       }

//       // Get sidebar width on desktop only
//       if (!mobile) {
//         const sidebar = document.querySelector('aside');
//         if (sidebar) {
//           setSidebarWidth(sidebar.getBoundingClientRect().width);
//         } else {
//           setSidebarWidth(84); // Default collapsed width
//         }
//       } else {
//         setSidebarWidth(0);
//       }
//     };

//     checkLayout();
//     window.addEventListener("resize", checkLayout);

//     // Watch for sidebar hover/expand events
//     const sidebar = document.querySelector('aside');
//     if (sidebar) {
//       const updateSidebarWidth = () => {
//         if (window.innerWidth >= 768) {
//           setSidebarWidth(sidebar.getBoundingClientRect().width);
//         }
//       };
//       sidebar.addEventListener('mouseenter', updateSidebarWidth);
//       sidebar.addEventListener('mouseleave', updateSidebarWidth);

//       return () => {
//         window.removeEventListener("resize", checkLayout);
//         sidebar.removeEventListener('mouseenter', updateSidebarWidth);
//         sidebar.removeEventListener('mouseleave', updateSidebarWidth);
//       };
//     }

//     return () => window.removeEventListener("resize", checkLayout);
//   }, []);

//   useEffect(() => {
//     try {
//       setUserUsername(localStorage.getItem("roar_username") || "RoarUser");
//       setUserBadge(localStorage.getItem("roar_badge") || "RISING_FAN");
//       setUserAvatarUrl(currentAvatarUrl || localStorage.getItem("roar_avatar_url") || undefined);
//     } catch {}
//   }, [currentAvatarUrl]);

//   const fetchComments = useCallback(async () => {
//     if (!post?.id) return;
//     try {
//       const res = await axios.get(`/api/roar/posts/${post.id}/comments`, {
//         params: { roomId: post.roomId },
//       });
//       if (res.data?.success) setComments(res.data.comments);
//     } catch (err) {
//       console.error("Failed to fetch comments:", err);
//     }
//   }, [post]);

//   useEffect(() => { fetchComments(); }, [fetchComments]);

//   const handleReply = (username: string) => {
//     setReplyTo(username);
//     setCommentText("");
//     setTimeout(() => inputRef.current?.focus(), 50);
//   };

//   const clearReply = () => {
//     setReplyTo(null);
//     setCommentText("");
//   };

//   const submitComment = async () => {
//     const fullText = replyTo ? `@${replyTo} ${commentText.trim()}` : commentText.trim();
//     if (!fullText.trim()) return;
//     try {
//       setLoading(true);
//       const res = await axios.post(`/api/roar/posts/${post.id}/comments`, {
//         text: fullText,
//         roomId: post.roomId,
//       });
//       if (res.data?.success) {
//         setCommentText("");
//         setReplyTo(null);
//         fetchComments();
//         onToast("Comment posted successfully!");
//         setTimeout(() => {
//           scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
//         }, 400);
//       }
//     } catch (err) {
//       console.error("Failed to submit comment:", err);
//       onToast("Error posting comment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reactToComment = async (commentId: string) => {
//     try {
//       const res = await axios.post(`/api/roar/posts/${post.id}/comments/${commentId}/react`);
//       if (res.data?.success)
//         setComments((prev) =>
//           prev.map((c) =>
//             c.commentId === commentId ? { ...c, heartCount: res.data.heartCount } : c,
//           ),
//         );
//     } catch (err) {
//       console.error("Failed to react to comment:", err);
//     }
//   };

//   const userVote = votes[post.id];

//   const handleVoteClick = (agree: boolean) => {
//     const prev = votes[post.id];
//     let nextVote: boolean | null = agree;
//     if (prev === agree) nextVote = null;
//     setVotes((v) => ({ ...v, [post.id]: nextVote }));

//     let delta = 0;
//     if (post.userVote === "agree") {
//       if (nextVote === true) delta = 0;
//       else if (nextVote === false) delta = -8;
//       else delta = -4;
//     } else if (post.userVote === "disagree") {
//       if (nextVote === true) delta = 8;
//       else if (nextVote === false) delta = 0;
//       else delta = 4;
//     } else {
//       if (nextVote === true) delta = 4;
//       else if (nextVote === false) delta = -4;
//       else delta = 0;
//     }

//     setPct(clamp(post.agreePercent + delta, 1, 99));
//     onVote(post.id, nextVote === true ? "agree" : nextVote === false ? "disagree" : null);
//   };

//   const canSubmit = commentText.trim().length > 0;

//   return (
//     <AnimatePresence>
//       <div
//         style={{
//           position: "fixed",
//           // On mobile: cover everything (top: 0, left: 0)
//           // On desktop: start below header and after sidebar
//           top: isMobile ? 0 : headerHeight,
//           left: isMobile ? 0 : sidebarWidth,
//           right: 0,
//           bottom: 0,
//           zIndex: 1000,
//           display: "flex",
//           flexDirection: "column",
//           background: "var(--bg-primary, #050508)",
//           overflow: "hidden",
//           pointerEvents: "auto",
//           transition: "left 0.2s ease", // Smooth transition when sidebar expands/collapses
//         }}
//       >
//         {/* Header - Only show on mobile, hide on desktop since desktop has its own header */}
//         {isMobile && (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 14,
//               padding: "16px 20px",
//               borderBottom: "1px solid var(--border, #252538)",
//               background: "rgba(5, 5, 8, 0.97)",
//               backdropFilter: "blur(10px)",
//               flexShrink: 0,
//             }}
//           >
//             <button
//               onClick={onClose}
//               style={{
//                 background: "none",
//                 border: "none",
//                 color: "white",
//                 cursor: "pointer",
//                 padding: 4,
//                 display: "flex",
//                 alignItems: "center",
//                 minWidth: 36,
//                 minHeight: 36,
//               }}
//             >
//               <ChevronLeft size={22} />
//             </button>
//             <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
//               <h2 style={{ fontSize: 12, fontWeight: 700, color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "0.03em" }}>
//                 Post
//               </h2>
//               <p style={{ fontSize: 9, color: "var(--text-secondary, #9494AD)", margin: "2px 0 0" }}>
//                 Posted by {post.fan?.username || post.authorUsername} •{" "}
//                 {formatTimeAgo(post.createdAt)} • {comments.length} comments
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Desktop header - minimal version without back button since desktop has its own navigation */}
//         {!isMobile && (
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "12px 20px",
//               borderBottom: "1px solid var(--border, #252538)",
//               background: "rgba(5, 5, 8, 0.97)",
//               backdropFilter: "blur(10px)",
//               flexShrink: 0,
//             }}
//           >
//             <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
//               <h2 style={{ fontSize: 12, fontWeight: 700, color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "0.03em" }}>
//                 Post Details
//               </h2>
//               <p style={{ fontSize: 9, color: "var(--text-secondary, #9494AD)", margin: "2px 0 0" }}>
//                 {comments.length} comments
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               style={{
//                 background: "rgba(255,255,255,0.1)",
//                 border: "none",
//                 color: "white",
//                 cursor: "pointer",
//                 padding: "6px 12px",
//                 borderRadius: 8,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 4,
//                 fontSize: 12,
//               }}
//             >
//               <X size={14} />
//               Close
//             </button>
//           </div>
//         )}

//         {/* Scrollable area */}
//         <div
//           ref={scrollRef}
//           style={{
//             flex: 1,
//             minHeight: 0,
//             overflowY: "auto",
//             overflowX: "hidden",
//             WebkitOverflowScrolling: "touch",
//             padding: "16px 20px",
//             paddingBottom: isMobile ? "100px" : "80px",
//             background: "linear-gradient(to bottom, #050508, #0b0b12)",
//           }}
//         >
//           {/* Post card */}
//           <div style={{ padding: 16, marginBottom: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20 }}>
//             <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
//               <AvatarWithBadge
//                 username={post.fan?.username || post.authorUsername}
//                 badge={post.fan?.badge || post.authorBadge}
//                 size="sm"
//                 avatarUrl={
//                   post.fan?.avatarUrl || post.authorAvatarUrl || post.avatarUrl ||
//                   ((post.fan?.username || post.authorUsername) === activeUsername ? userAvatarUrl : undefined)
//                 }
//               />
//               <div>
//                 <p style={{ fontWeight: 700, fontSize: 13, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
//                   {post.fan?.username || post.authorUsername}
//                   <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E676", display: "inline-block" }} />
//                 </p>
//                 <p style={{ fontSize: 10, color: "var(--text-secondary, #9494AD)", margin: 0 }}>{formatTimeAgo(post.createdAt)}</p>
//               </div>
//             </div>

//             <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.5, marginBottom: 12, color: "white" }}>{post.text}</p>

//             {post.mediaUrls && post.mediaUrls.length > 0 && (
//               <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
//                 {post.mediaUrls.map((url: string, idx: number) => {
//                   const isVideo = url.endsWith(".mp4") || url.includes("/video/upload/");
//                   return isVideo
//                     ? <video key={idx} src={url} controls style={{ width: "100%", maxHeight: 300, borderRadius: 12, objectFit: "cover" }} />
//                     : <img key={idx} src={url} alt="Post Media" style={{ width: "100%", maxHeight: 300, borderRadius: 12, objectFit: "cover" }} />;
//                 })}
//               </div>
//             )}

//             {post.type === "hot_take" && (
//               <>
//                 <div style={{ marginBottom: 10 }}><SplitBar left={pct} /></div>
//                 <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
//                   {[
//                     { agree: true, label: "Agree", active: userVote === true, color: "var(--accent-magenta, #E91E8C)" },
//                     { agree: false, label: "Disagree", active: userVote === false, color: "var(--accent-orange, #FF6B35)" },
//                   ].map(({ agree, label, active, color }) => (
//                     <button key={label} onClick={() => handleVoteClick(agree)} style={{ flex: 1, padding: "12px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer", border: `2.5px solid ${color}`, background: active ? color : "rgba(255,255,255,0.02)", color: active ? "white" : color, transition: "all 0.22s ease-in-out" }}>
//                       {active ? `✓ ${label}d` : label}
//                     </button>
//                   ))}
//                 </div>
//               </>
//             )}

//             <div style={{ display: "flex", alignItems: "center", marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
//               {(post.fan?.username === activeUsername || post.authorUsername === activeUsername) && (
//                 <button
//                   onClick={(e) => { e.stopPropagation(); if (window.confirm("Delete this post?")) { if (onDeletePost) { onDeletePost(post.id, post.roomId); onClose(); } } }}
//                   style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: "#f87171", marginLeft: "auto", padding: 4, borderRadius: "50%" }}
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Comments heading */}
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
//             <span style={{ fontSize: 11, fontWeight: 800, color: "white", letterSpacing: "0.06em", textTransform: "uppercase" }}>Comments</span>
//             <span style={{ fontSize: 10, color: "var(--text-secondary, #9494AD)" }}>{comments.length} total</span>
//           </div>

//           {/* Comments list */}
//           <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 8 }}>
//             {comments.length === 0 ? (
//               <p style={{ fontSize: 13, color: "var(--text-muted, #4A4A62)", textAlign: "center", padding: "20px 0" }}>
//                 No comments yet. Be the first!
//               </p>
//             ) : (
//               comments.map((comment) => {
//                 const isReply = comment.text.trim().startsWith("@");
//                 return (
//                   <div key={comment.commentId} style={{ position: "relative", marginLeft: isReply ? 24 : 0, padding: "12px 14px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: 6 }}>
//                     {isReply && <div style={{ position: "absolute", left: -14, top: -12, bottom: "50%", width: 12, borderLeft: "1.5px solid rgba(255,255,255,0.12)", borderBottom: "1.5px solid rgba(255,255,255,0.12)", borderRadius: "0 0 0 8px", pointerEvents: "none" }} />}
//                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                       <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
//                         <AvatarWithBadge username={comment.authorUsername} badge={comment.authorBadge} size="sm" avatarUrl={comment.authorAvatarUrl || comment.avatarUrl || (comment.authorUsername === activeUsername ? userAvatarUrl : undefined)} />
//                         <p style={{ fontWeight: 700, fontSize: 12, color: "white", margin: 0 }}>{comment.authorUsername}</p>
//                       </div>
//                       <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                         <span style={{ fontSize: 9, color: "var(--text-muted, #4A4A62)" }}>{formatTimeAgo(comment.createdAt)}</span>
//                         {comment.authorUsername === activeUsername && (
//                           <button onClick={async (e) => { e.stopPropagation(); if (window.confirm("Delete comment?")) { try { await axios.delete(`/api/roar/posts/${post.id}/comments/${comment.commentId}`); onToast("Deleted"); fetchComments(); } catch { onToast("Failed"); } } }} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", display: "flex", alignItems: "center", padding: 2 }}>
//                             <Trash2 size={12} />
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                     <p style={{ fontSize: 13, color: "var(--text-primary, #F5F5FA)", lineHeight: 1.4, margin: "4px 0" }}>{comment.text}</p>
//                     <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 4 }}>
//                       <button onClick={() => reactToComment(comment.commentId)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: comment.heartCount > 0 ? "white" : "var(--text-muted, #4A4A62)", padding: 0 }}>
//                         🤍 {comment.heartCount ?? 0}
//                       </button>
//                       <button onClick={() => handleReply(comment.authorUsername)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--text-muted, #4A4A62)", fontWeight: 600, padding: 0 }}>
//                         Reply
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>

//         {/* Composer */}
//         <div style={{ 
//           flexShrink: 0, 
//           background: "rgba(5,5,8,0.97)", 
//           borderTop: "1px solid var(--border, #252538)",
//           paddingBottom: isMobile ? "calc(env(safe-area-inset-bottom, 12px) + 70px)" : "env(safe-area-inset-bottom, 12px)",
//           position: "relative",
//           zIndex: 10,
//         }}>
//           {replyTo && (
//             <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px 0" }}>
//               <span style={{ fontSize: 11, color: "var(--text-secondary, #9494AD)" }}>Replying to</span>
//               <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(233,30,140,0.15)", border: "1px solid rgba(233,30,140,0.35)", borderRadius: 999, padding: "2px 8px 2px 6px", fontSize: 12, fontWeight: 700, color: "#E91E8C", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
//                 @{replyTo}
//                 <button onClick={clearReply} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#E91E8C", display: "flex", alignItems: "center", marginLeft: 2, flexShrink: 0 }}>
//                   <X size={11} />
//                 </button>
//               </span>
//             </div>
//           )}
//           <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "10px 16px 12px" }}>
//             <AvatarWithBadge username={userUsername} badge={userBadge} size="sm" avatarUrl={userAvatarUrl} />
//             <input
//               ref={inputRef}
//               type="text"
//               placeholder={replyTo ? "Write your reply…" : "Share your opinion.."}
//               value={commentText}
//               onChange={(e) => setCommentText(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && !loading && submitComment()}
//               style={{ flex: 1, minWidth: 0, height: 40, borderRadius: 20, background: "var(--bg-secondary, #0E0E14)", border: "1px solid var(--border, #252538)", paddingLeft: 16, paddingRight: 16, color: "white", fontSize: 16, outline: "none" }}
//             />
//             <button
//               onClick={submitComment}
//               disabled={loading || !canSubmit}
//               style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--accent-magenta, #E91E8C)", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: canSubmit ? "pointer" : "default", opacity: canSubmit ? 1 : 0.5, flexShrink: 0, transition: "opacity 0.2s" }}
//             >
//               ↑
//             </button>
//           </div>
//         </div>
//       </div>
//     </AnimatePresence>
//   );
// }





import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import AvatarWithBadge from "./AvatarWithBadge";
import { SplitBar } from "./shared";
import { clamp, formatTimeAgo } from "../utils";
import { ChevronLeft, Trash2, X, User, Loader2, Search } from "lucide-react";

interface Props {
  post: any;
  onClose: () => void;
  onToast: (m: string) => void;
  onVote: (id: string, vote: "agree" | "disagree" | null) => void;
  onDeletePost?: (id: string, roomId?: string) => void;
  currentUsername?: string;
  currentAvatarUrl?: string;
  bottomNavHeight?: number;
}

interface MentionUser {
  userId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatarUrl?: string;
  email?: string;
}

export default function PostDetailsOverlay({
  post,
  onClose,
  onToast,
  onVote,
  onDeletePost,
  currentUsername,
  currentAvatarUrl,
  bottomNavHeight = 0,
}: Props) {
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userUsername, setUserUsername] = useState("RoarUser");
  const activeUsername = currentUsername || userUsername;
  const [userBadge, setUserBadge] = useState("RISING_FAN");
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(currentAvatarUrl);
  const [votes, setVotes] = useState<Record<string, boolean | null>>(() =>
    post.userVote ? { [post.id]: post.userVote === "agree" } : {},
  );
  const [pct, setPct] = useState(post.agreePercent ?? 50);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState(0);

  // Mention states
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionUsers, setMentionUsers] = useState<MentionUser[]>([]);
  const [showMentionPopup, setShowMentionPopup] = useState(false);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [mentionLoading, setMentionLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<MentionUser[]>([]);
  useEffect(() => {
    const checkLayout = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      const header = document.querySelector("header");
      setHeaderHeight(header ? header.getBoundingClientRect().height : 60);
      if (!mobile) {
        const sidebar = document.querySelector("aside");
        setSidebarWidth(sidebar ? sidebar.getBoundingClientRect().width : 84);
      } else {
        setSidebarWidth(0);
      }
    };

    checkLayout();
    window.addEventListener("resize", checkLayout);

    // ✅ FIX — observe every resize on the sidebar, including CSS transitions
    const sidebar = document.querySelector("aside");
    let ro: ResizeObserver | null = null;
    if (sidebar) {
      ro = new ResizeObserver((entries) => {
        if (window.innerWidth < 768) return;
        const width = entries[0]?.contentRect.width ?? 0;
        setSidebarWidth(width);
      });
      ro.observe(sidebar);
    }

    return () => {
      window.removeEventListener("resize", checkLayout);
      ro?.disconnect();
    };
  }, []);

  const hasUnderscore = (u: any): boolean => {
    const username = u.username || u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim();
    const emailLocal = (u.email || "").split("@")[0];
    return username.includes("_") || emailLocal.includes("_");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users", { withCredentials: true });
        if (res.data?.users) {
          const seen = new Set<string>();
          const formattedUsers = res.data.users
            .filter((u: any) => {
              const username = u.username || u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim();
              return username !== activeUsername && !hasUnderscore(u);
            })
            .map((u: any) => ({
              userId: u.userId || u.id,
              username: u.username,
              firstName: u.firstName,
              lastName: u.lastName,
              name: u.name,
              avatarUrl: u.avatarUrl || u.avatar,
              email: u.email,
            }))
            .filter((u: MentionUser) => {
              const key = u.userId || u.username;
              if (!key || seen.has(key)) return false;
              const displayName = u.username || u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim();
              if (displayName.includes("_")) return false;
              seen.add(key);
              return true;
            });
          setAllUsers(formattedUsers);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setAllUsers([
          { userId: "1", username: "johndoe", firstName: "John", lastName: "Doe", email: "john@example.com" },
          { userId: "2", username: "janesmith", firstName: "Jane", lastName: "Smith", email: "jane@example.com" },
          { userId: "3", username: "mikewilson", firstName: "Mike", lastName: "Wilson", email: "mike@example.com" },
          { userId: "4", username: "sarahparker", firstName: "Sarah", lastName: "Parker", email: "sarah@example.com" },
          { userId: "5", username: "chrisevans", firstName: "Chris", lastName: "Evans", email: "chris@example.com" },
        ]);
      }
    };
    fetchUsers();
  }, [activeUsername]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    setCommentText(value);
    setCursorPosition(cursorPos);

    const textBeforeCursor = value.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1) {
      const afterAt = textBeforeCursor.slice(lastAtIndex + 1);
      if (!afterAt.includes(" ")) {
        setMentionQuery(afterAt);
        if (afterAt.trim() === "") {
          setMentionUsers(allUsers.slice(0, 8));
          setShowMentionPopup(allUsers.length > 0);
        } else {
          const filtered = allUsers
            .filter((user) => {
              const searchStr = `${user.username || ""} ${user.firstName || ""} ${user.lastName || ""} ${user.email || ""}`.toLowerCase();
              return searchStr.includes(afterAt.toLowerCase());
            })
            .slice(0, 8);
          setMentionUsers(filtered);
          setShowMentionPopup(filtered.length > 0);
        }
        setMentionIndex(0);
        return;
      }
    }

    setShowMentionPopup(false);
    setMentionUsers([]);
  };

  const insertMention = (user: MentionUser) => {
    const displayName =
      user.username ||
      user.name ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.email?.split("@")[0] ||
      "user";
    const mentionText = `@${displayName} `;
    const textBeforeCursor = commentText.slice(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    const textBeforeMention = commentText.slice(0, lastAtIndex);
    const textAfterCursor = commentText.slice(cursorPosition);
    setCommentText(`${textBeforeMention}${mentionText}${textAfterCursor}`);
    setShowMentionPopup(false);
    setMentionUsers([]);
    setTimeout(() => {
      if (inputRef.current) {
        const newCursorPos = lastAtIndex + mentionText.length;
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showMentionPopup && mentionUsers.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setMentionIndex((prev) => (prev + 1) % mentionUsers.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setMentionIndex((prev) => (prev - 1 + mentionUsers.length) % mentionUsers.length);
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        if (mentionUsers[mentionIndex]) insertMention(mentionUsers[mentionIndex]);
      } else if (e.key === "Escape") {
        setShowMentionPopup(false);
        setMentionUsers([]);
      }
    } else if (e.key === "Enter" && !e.shiftKey && !showMentionPopup) {
      e.preventDefault();
      submitComment();
    }
  };

  useEffect(() => {
    try {
      setUserUsername(localStorage.getItem("roar_username") || "RoarUser");
      setUserBadge(localStorage.getItem("roar_badge") || "RISING_FAN");
      setUserAvatarUrl(currentAvatarUrl || localStorage.getItem("roar_avatar_url") || undefined);
    } catch { }
  }, [currentAvatarUrl]);

  const fetchComments = useCallback(async () => {
    if (!post?.id) return;
    try {
      const res = await axios.get(`/api/roar/posts/${post.id}/comments`, {
        params: { roomId: post.roomId },
      });
      if (res.data?.success) setComments(res.data.comments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  }, [post]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleReply = (username: string) => {
    setReplyTo(username);
    setCommentText("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const clearReply = () => {
    setReplyTo(null);
    setCommentText("");
  };

  const submitComment = async () => {
    const fullText = replyTo ? `@${replyTo} ${commentText.trim()}` : commentText.trim();
    if (!fullText.trim()) return;
    try {
      setLoading(true);
      const res = await axios.post(`/api/roar/posts/${post.id}/comments`, {
        text: fullText,
        roomId: post.roomId,
      });
      if (res.data?.success) {
        setCommentText("");
        setReplyTo(null);
        fetchComments();
        onToast("Comment posted successfully!");
        setTimeout(() => {
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        }, 400);
      }
    } catch (err) {
      console.error("Failed to submit comment:", err);
      onToast("Error posting comment");
    } finally {
      setLoading(false);
    }
  };

  const reactToComment = async (commentId: string) => {
    try {
      const res = await axios.post(`/api/roar/posts/${post.id}/comments/${commentId}/react`);
      if (res.data?.success)
        setComments((prev) =>
          prev.map((c) =>
            c.commentId === commentId ? { ...c, heartCount: res.data.heartCount } : c,
          ),
        );
    } catch (err) {
      console.error("Failed to react to comment:", err);
    }
  };

  const userVote = votes[post.id];

  const handleVoteClick = (agree: boolean) => {
    const prev = votes[post.id];
    let nextVote: boolean | null = agree;
    if (prev === agree) nextVote = null;
    setVotes((v) => ({ ...v, [post.id]: nextVote }));

    let delta = 0;
    if (post.userVote === "agree") {
      if (nextVote === true) delta = 0;
      else if (nextVote === false) delta = -8;
      else delta = -4;
    } else if (post.userVote === "disagree") {
      if (nextVote === true) delta = 8;
      else if (nextVote === false) delta = 0;
      else delta = 4;
    } else {
      if (nextVote === true) delta = 4;
      else if (nextVote === false) delta = -4;
      else delta = 0;
    }

    setPct(clamp(post.agreePercent + delta, 1, 99));
    onVote(post.id, nextVote === true ? "agree" : nextVote === false ? "disagree" : null);
  };

  const canSubmit = commentText.trim().length > 0;

  // Dynamic positioning via CSS variables (Tailwind can't handle runtime values)
  const overlayStyle = {
    "--overlay-top": isMobile ? "0px" : `${headerHeight}px`,
    "--overlay-left": isMobile ? "0px" : `${sidebarWidth}px`,
  } as React.CSSProperties;

  return (
    <AnimatePresence>
      {/* Overlay wrapper */}
      <div
        className="fixed right-0 bottom-0 z-[1000] flex flex-col overflow-hidden pointer-events-auto bg-[#050508]"
        style={{
          top: isMobile ? 0 : headerHeight,
          left: isMobile ? 0 : sidebarWidth,
          transition: "left 0.2s ease",
        }}
      >
        {/* Mobile header */}
        {isMobile && (
          <div className="flex items-center gap-[14px] px-5 py-4 pt-30 border-b border-[#252538] bg-[rgba(5,5,8,0.97)] backdrop-blur-[10px] shrink-0">
            <button
              onClick={onClose}
              className="bg-transparent border-none text-white cursor-pointer p-1 flex items-center min-w-9 min-h-9"
            >
              <ChevronLeft size={22} />
            </button>
            <div className="flex flex-col flex-1 min-w-0">
              <h2 className="text-[12px] font-bold text-white m-0 uppercase tracking-[0.03em]">
                Post
              </h2>
              <p className="text-[9px] text-[#9494AD] mt-0.5 mb-0">
                Posted by {post.fan?.username || post.authorUsername} •{" "}
                {formatTimeAgo(post.createdAt)} • {comments.length} comments
              </p>
            </div>
          </div>
        )}

        {/* Desktop header */}
        {!isMobile && (
          <div className="flex items-center gap-3 px-5 py-3 border-b border-[#252538] bg-[rgba(5,5,8,0.97)] backdrop-blur-[10px] shrink-0">
            <button
              onClick={onClose}
              className="bg-transparent border-none text-white cursor-pointer p-1 flex items-center min-w-9 min-h-9"
            >
              <ChevronLeft size={22} />
            </button>
            <h2 className="text-[12px] font-bold text-white m-0 uppercase tracking-[0.03em]">
              Post Details
            </h2>
            <p className="text-[9px] text-[#9494AD] m-0">{comments.length} comments</p>
          </div>
        )}

        {/* Scrollable area */}
        <div
          ref={scrollRef}
          className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch] px-5 pt-4 bg-gradient-to-b from-[#050508] to-[#0b0b12] ${isMobile ? "pb-[100px]" : "pb-[80px]"
            }`}
        >
          {/* Post card */}
          <div className="p-4 mb-5 bg-white/[0.03] border border-white/[0.06] rounded-[20px]">
            <div className="flex gap-2.5 items-center mb-3">
              <AvatarWithBadge
                username={post.fan?.username || post.authorUsername}
                badge={post.fan?.badge || post.authorBadge}
                size="sm"
                avatarUrl={
                  post.fan?.avatarUrl ||
                  post.authorAvatarUrl ||
                  post.avatarUrl ||
                  ((post.fan?.username || post.authorUsername) === activeUsername
                    ? userAvatarUrl
                    : undefined)
                }
              />
              <div>
                <p className="font-bold text-[13px] text-white m-0 flex items-center gap-1">
                  {post.fan?.username || post.authorUsername}
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] inline-block" />
                </p>
                <p className="text-[10px] text-[#9494AD] m-0">{formatTimeAgo(post.createdAt)}</p>
              </div>
            </div>

            <p className="font-semibold text-[15px] leading-[1.5] mb-3 text-white">{post.text}</p>

            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div className="flex flex-col gap-2 mb-3">
                {post.mediaUrls.map((url: string, idx: number) => {
                  const isVideo = url.endsWith(".mp4") || url.includes("/video/upload/");
                  return isVideo ? (
                    <video
                      key={idx}
                      src={url}
                      controls
                      className="w-full max-h-[300px] rounded-xl object-cover"
                    />
                  ) : (
                    <img
                      key={idx}
                      src={url}
                      alt="Post Media"
                      className="w-full max-h-[300px] rounded-xl object-cover"
                    />
                  );
                })}
              </div>
            )}

            {post.type === "hot_take" && (
              <>
                <div className="mb-2.5">
                  <SplitBar left={pct} />
                </div>
                <div className="flex gap-2 mt-3">
                  {[
                    {
                      agree: true,
                      label: "Agree",
                      active: userVote === true,
                      color: "#E91E8C",
                    },
                    {
                      agree: false,
                      label: "Disagree",
                      active: userVote === false,
                      color: "#FF6B35",
                    },
                  ].map(({ agree, label, active, color }) => (
                    <button
                      key={label}
                      onClick={() => handleVoteClick(agree)}
                      className="flex-1 py-3 rounded-full text-[13px] font-bold cursor-pointer transition-all duration-[220ms] ease-in-out border-[2.5px]"
                      style={{
                        borderColor: color,
                        background: active ? color : "rgba(255,255,255,0.02)",
                        color: active ? "white" : color,
                      }}
                    >
                      {active ? `✓ ${label}d` : label}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex items-center mt-4 border-t border-white/[0.06] pt-3">
              {(post.fan?.username === activeUsername ||
                post.authorUsername === activeUsername) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this post?")) {
                        if (onDeletePost) {
                          onDeletePost(post.id, post.roomId);
                          onClose();
                        }
                      }
                    }}
                    className="flex items-center justify-center bg-transparent border-none cursor-pointer text-[#f87171] ml-auto p-1 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
            </div>
          </div>

          {/* Comments heading */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-[11px] font-extrabold text-white tracking-[0.06em] uppercase">
              Comments
            </span>
            <span className="text-[10px] text-[#9494AD]">{comments.length} total</span>
          </div>

          {/* Comments list */}
          <div className="flex flex-col gap-3 pb-2">
            {comments.length === 0 ? (
              <p className="text-[13px] text-[#4A4A62] text-center py-5">
                No comments yet. Be the first!
              </p>
            ) : (
              comments.map((comment) => {
                const isReply = comment.text.trim().startsWith("@");
                return (
                  <div
                    key={comment.commentId}
                    className={`relative p-3 px-[14px] rounded-2xl bg-white/[0.03] border border-white/[0.05] flex flex-col gap-1.5 ${isReply ? "ml-6" : "ml-0"
                      }`}
                  >
                    {isReply && (
                      <div className="absolute -left-[14px] top-[-12px] bottom-1/2 w-3 border-l-[1.5px] border-b-[1.5px] border-white/[0.12] rounded-bl-lg pointer-events-none" />
                    )}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <AvatarWithBadge
                          username={comment.authorUsername}
                          badge={comment.authorBadge}
                          size="sm"
                          avatarUrl={
                            comment.authorAvatarUrl ||
                            comment.avatarUrl ||
                            (comment.authorUsername === activeUsername ? userAvatarUrl : undefined)
                          }
                        />
                        <p className="font-bold text-[12px] text-white m-0">
                          {comment.authorUsername}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-[#4A4A62]">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                        {comment.authorUsername === activeUsername && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (window.confirm("Delete comment?")) {
                                try {
                                  await axios.delete(
                                    `/api/roar/posts/${post.id}/comments/${comment.commentId}`,
                                  );
                                  onToast("Deleted");
                                  fetchComments();
                                } catch {
                                  onToast("Failed");
                                }
                              }
                            }}
                            className="bg-transparent border-none text-[#f87171] cursor-pointer flex items-center p-0.5"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-[13px] text-[#F5F5FA] leading-[1.4] my-1">
                      {comment.text}
                    </p>
                    <div className="flex gap-[14px] items-center mt-1">
                      <button
                        onClick={() => reactToComment(comment.commentId)}
                        className={`bg-transparent border-none cursor-pointer flex items-center gap-1 text-[12px] p-0 ${comment.heartCount > 0 ? "text-white" : "text-[#4A4A62]"
                          }`}
                      >
                        🤍 {comment.heartCount ?? 0}
                      </button>
                      <button
                        onClick={() => handleReply(comment.authorUsername)}
                        className="bg-transparent border-none cursor-pointer text-[11px] text-[#4A4A62] font-semibold p-0"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Composer with mention popup */}
        <div
          className={`shrink-0 bg-[rgba(5,5,8,0.97)] border-t border-[#252538] relative z-10 ${isMobile
              ? "pb-[calc(env(safe-area-inset-bottom,12px)+70px)]"
              : "pb-[env(safe-area-inset-bottom,12px)]"
            }`}
        >
          {replyTo && (
            <div className="flex items-center gap-1.5 px-4 pt-1.5">
              <span className="text-[11px] text-[#9494AD]">Replying to</span>
              <span className="inline-flex items-center gap-1 bg-[rgba(233,30,140,0.15)] border border-[rgba(233,30,140,0.35)] rounded-full py-0.5 pl-1.5 pr-2 text-[12px] font-bold text-[#E91E8C] max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap">
                @{replyTo}
                <button
                  onClick={clearReply}
                  className="bg-transparent border-none p-0 cursor-pointer text-[#E91E8C] flex items-center ml-0.5 shrink-0"
                >
                  <X size={11} />
                </button>
              </span>
            </div>
          )}

          {/* Mention Popup */}
          {showMentionPopup && mentionUsers.length > 0 && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#181c24] rounded-2xl border border-[rgba(200,112,90,0.2)] overflow-hidden z-20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-h-[300px] overflow-y-auto">
              {mentionUsers.map((user, idx) => {
                const displayName =
                  user.username ||
                  user.name ||
                  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                  user.email?.split("@")[0] ||
                  "user";
                const isSelected = idx === mentionIndex;
                return (
                  <button
                    key={user.userId}
                    onClick={() => insertMention(user)}
                    onMouseEnter={() => setMentionIndex(idx)}
                    className={`flex items-center gap-3 px-4 py-2.5 w-full border-none cursor-pointer transition-colors duration-150 ${isSelected ? "bg-[rgba(200,112,90,0.15)]" : "bg-transparent"
                      }`}
                  >
                    <AvatarWithBadge
                      username={displayName}
                      badge="RISING_FAN"
                      size="sm"
                      avatarUrl={user.avatarUrl}
                    />
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-[13px] text-white m-0">{displayName}</p>
                      {user.email && (
                        <p className="text-[10px] text-[#7a6a65] m-0">{user.email}</p>
                      )}
                    </div>
                    <User size={14} className="text-[#c8705a]" />
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex gap-2 items-center px-4 pt-2.5 pb-3 relative">
            <AvatarWithBadge
              username={userUsername}
              badge={userBadge}
              size="sm"
              avatarUrl={userAvatarUrl}
            />
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                placeholder={replyTo ? "Write your reply…" : "Share your opinion..."}
                value={commentText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full h-10 rounded-full bg-[#0E0E14] border border-[#252538] pl-4 pr-4 text-white text-[16px] outline-none"
              />
              <div className="absolute -bottom-5 left-4 text-[10px] text-[#7a6a65]">
                Type to search for users...
              </div>
            </div>
            <button
              onClick={submitComment}
              disabled={loading || !canSubmit}
              className={`w-[38px] h-[38px] rounded-full bg-[#E91E8C] border-none text-white flex items-center justify-center shrink-0 transition-opacity duration-200 ${canSubmit ? "cursor-pointer opacity-100" : "cursor-default opacity-50"
                }`}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "↑"}
            </button>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}