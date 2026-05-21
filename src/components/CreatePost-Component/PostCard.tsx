// "use client";

// import { useEffect, useState } from "react";
// import {
//     MessageCircle,
//     MoreHorizontal,
//     Trash2,
//     Repeat2,
//     Share,
//     CheckCircle2,
//     User,
// } from "lucide-react";
// import axios from "axios";
// import type { Post } from "@/types/PostPolls";
// import PostLikeButton from "./Postlikebutton";
// import CommentsSection from "./Commentssection";

// // Matches both old string format and new object format in votedBy
// type VotedByEntry = { voterId: string; userName: string } | string;

// // Common profile placeholder component - ALWAYS shows an icon
// const ProfilePlaceholder = ({ size = 40 }: { name?: string; size?: number }) => {
//     return (
//         <div 
//             className="bg-gradient-to-br from-[#C9115F] to-[#e8185a] rounded-full flex items-center justify-center text-white shadow-inner"
//             style={{ width: `${size}px`, height: `${size}px` }}
//         >
//             <User className="w-5 h-5" style={{ width: size * 0.4, height: size * 0.4 }} />
//         </div>
//     );
// };

// interface Props {
//     post: Post;
//     onLike?: (postId: string, userId: string) => void;
//     onDelete?: (id: string) => Promise<void>;
//     onVote?: (postId: string, optionId: string, voterId: string, userName: string) => Promise<void>;
//     currentUserId?: string;
//     currentUserName?: string;
//     onCommentAdded?: (postId: string) => void;
//     onCommentDeleted?: (postId: string) => void;
// }

// export default function PostCard({
//     post,
//     onLike,
//     onDelete,
//     onVote,
//     currentUserId,
//     currentUserName = "Anonymous",
//     onCommentAdded,
//     onCommentDeleted,
// }: Props) {
//     const [showComments, setShowComments] = useState(false);
//     const [showMenu, setShowMenu] = useState(false);
//     const [deleting, setDeleting] = useState(false);
//     const [localPoll, setLocalPoll] = useState(post.poll);
//     const [localCommentCount, setLocalCommentCount] = useState<number>(
//         post.commentCount ?? 0
//     );
//     const [countLoaded, setCountLoaded] = useState(false);

//     const formatTimeAgo = (timestamp: number): string => {
//         const now = Date.now();
//         const diff = now - timestamp;
//         const seconds = Math.floor(diff / 1000);
//         const minutes = Math.floor(seconds / 60);
//         const hours = Math.floor(minutes / 60);
//         const days = Math.floor(hours / 24);
//         if (days > 0) return `${days}d ago`;
//         if (hours > 0) return `${hours}h ago`;
//         if (minutes > 0) return `${minutes}m ago`;
//         return `${seconds}s ago`;
//     };

//     // Fetch real comment count on mount
//     useEffect(() => {
//         if (!post.id) return;
//         axios
//             .get(`/api/comments?contentId=${post.id}&contentType=post&limit=20`)
//             .then((res) => {
//                 if (res.data.success) {
//                     const comments = res.data.comments ?? [];
//                     const total = comments.reduce(
//                         (acc: number, c: { replyCount?: number }) =>
//                             acc + 1 + (c.replyCount ?? 0),
//                         0
//                     );
//                     setLocalCommentCount(total);
//                     setCountLoaded(true);
//                 }
//             })
//             .catch(() => {
//                 // silently fall back to post.commentCount
//             });
//     }, [post.id]);

//     const handleDelete = async () => {
//         if (!onDelete || !post.id) return;
//         if (!confirm("Are you sure you want to delete this post?")) return;
//         setDeleting(true);
//         try {
//             await onDelete(post.id);
//         } catch (error) {
//             console.error("Failed to delete post:", error);
//         } finally {
//             setDeleting(false);
//             setShowMenu(false);
//         }
//     };

//     const toggleMenu = () => setShowMenu(!showMenu);

//     const isOwner =
//         currentUserId && post.userId && currentUserId === post.userId;

//     useEffect(() => {
//         setLocalPoll(post.poll);
//     }, [post.poll]);

//     // Only sync from prop if we haven't loaded the real count yet
//     useEffect(() => {
//         if (!countLoaded) {
//             setLocalCommentCount(post.commentCount ?? 0);
//         }
//     }, [post.commentCount, countLoaded]);

//     // ── Vote guard ────────────────────────────────────────────────────────────
//     const hasVoted =
//         Array.isArray(localPoll?.votedBy) &&
//         localPoll.votedBy.some((v: VotedByEntry) =>
//             typeof v === "string"
//                 ? v === currentUserId
//                 : v.voterId === currentUserId
//         );

//     const handleVote = (optionId: string) => {
//         if (!post.id || !onVote || !currentUserId) return;
//         if (hasVoted) return;

//         if (localPoll) {
//             const optimisticEntry: VotedByEntry = {
//                 voterId: currentUserId,
//                 userName: currentUserName,
//             };
//             const updated = {
//                 ...localPoll,
//                 totalVotes: (localPoll.totalVotes ?? 0) + 1,
//                 options: localPoll.options.map((opt) =>
//                     opt.id === optionId
//                         ? { ...opt, votes: opt.votes + 1 }
//                         : opt
//                 ),
//                 votedBy: [...(localPoll.votedBy ?? []), optimisticEntry],
//             };
//             setLocalPoll(updated);
//         }

//         onVote(post.id, optionId, currentUserId, currentUserName);
//     };

//     const handleCommentAdded = () => {
//         setLocalCommentCount((prev) => prev + 1);
//         onCommentAdded?.(post.id!);
//     };

//     const handleCommentDeleted = () => {
//         setLocalCommentCount((prev) => Math.max(0, prev - 1));
//         onCommentDeleted?.(post.id!);
//     };

//     const handleCountLoaded = (count: number) => {
//         setLocalCommentCount(count);
//         setCountLoaded(true);
//     };

//     return (
//         <div className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/8 transition-all duration-200">
//             {/* Header */}
//             <div className="flex items-start justify-between mb-3">
//                 <div className="flex items-center gap-3">
//                     <div className="relative shrink-0">
//                         {/* ALWAYS show profile icon - no text, just icon */}
//                         <ProfilePlaceholder size={40} />
//                         <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f0f]" />
//                     </div>
//                     <div>
//                         <p className="text-white font-semibold text-sm">
//                             {post.userName}
//                         </p>
//                         <div className="flex items-center gap-2">
//                             <span className="text-white/20 text-xs">•</span>
//                             <p className="text-white/30 text-xs">
//                                 {formatTimeAgo(post.createdAt)}
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {isOwner && onDelete && (
//                     <div className="relative">
//                         <button
//                             onClick={toggleMenu}
//                             className="p-2 rounded-full hover:bg-white/10 transition-colors"
//                             disabled={deleting}
//                         >
//                             <MoreHorizontal className="w-4 h-4 text-white/60" />
//                         </button>
//                         {showMenu && (
//                             <>
//                                 <div
//                                     className="fixed inset-0 z-10"
//                                     onClick={() => setShowMenu(false)}
//                                 />
//                                 <div className="absolute right-0 top-8 z-20 bg-[#1a1a1a] rounded-xl shadow-lg border border-white/10 overflow-hidden min-w-[140px]">
//                                     <button
//                                         onClick={handleDelete}
//                                         disabled={deleting}
//                                         className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
//                                     >
//                                         <Trash2 className="w-4 h-4" />
//                                         {deleting ? "Deleting..." : "Delete Post"}
//                                     </button>
//                                 </div>
//                             </>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* Content */}
//             {post.content && (
//                 <p className="text-white text-sm mb-3 leading-relaxed">
//                     {post.content}
//                 </p>
//             )}

//             {/* Media Grid */}
//             {post.media && post.media.length > 0 && (
//                 <div
//                     className={`mb-3 grid gap-2 ${
//                         post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
//                     }`}
//                 >
//                     {post.media.map((item, idx) => (
//                         <div
//                             key={idx}
//                             className="relative rounded-xl overflow-hidden bg-zinc-800"
//                             style={{ aspectRatio: "56/25" }}
//                         >
//                             {item.type === "image" ? (
//                                 <img
//                                     src={item.url}
//                                     alt={item.name || `media-${idx}`}
//                                     className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
//                                     onClick={() => window.open(item.url, "_blank")}
//                                 />
//                             ) : (
//                                 <video
//                                     src={item.url}
//                                     className="w-full h-full object-cover"
//                                     controls
//                                     preload="metadata"
//                                 />
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Poll */}
//             {localPoll && localPoll.options && localPoll.options.length > 0 && (
//                 <div className="mb-3 bg-white/5 rounded-xl p-3 border border-white/10">
//                     {hasVoted && (
//                         <div className="flex items-center gap-1.5 mb-2 text-[#C9115F] text-xs">
//                             <CheckCircle2 className="w-3.5 h-3.5" />
//                             <span>You voted</span>
//                         </div>
//                     )}

//                     <div className="space-y-2">
//                         {localPoll.options.map((option) => {
//                             const totalVotes = localPoll.totalVotes ?? 0;
//                             const votePercentage =
//                                 totalVotes > 0
//                                     ? (option.votes / totalVotes) * 100
//                                     : 0;
//                             const isPollEnded =
//                                 (localPoll.endsAt ?? 0) < Date.now();
//                             const isDisabled = isPollEnded || hasVoted;

//                             return (
//                                 <button
//                                     key={option.id}
//                                     onClick={() => handleVote(option.id)}
//                                     disabled={isDisabled}
//                                     className={`w-full relative group transition-opacity ${
//                                         isDisabled
//                                             ? "cursor-not-allowed opacity-80"
//                                             : "hover:opacity-90"
//                                     }`}
//                                 >
//                                     <div className="relative bg-white/10 rounded-lg overflow-hidden">
//                                         <div
//                                             className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C9115F]/30 to-[#e8185a]/30 rounded-lg transition-all duration-300"
//                                             style={{ width: `${votePercentage}%` }}
//                                         />
//                                         <div className="relative px-3 py-2 flex justify-between items-center">
//                                             <span className="text-white text-sm">
//                                                 {option.text}
//                                             </span>
//                                             <span className="text-white/50 text-xs">
//                                                 {votePercentage.toFixed(0)}% ({option.votes})
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </button>
//                             );
//                         })}
//                     </div>

//                     <div className="mt-2 text-xs text-white/30 text-center">
//                         {(localPoll.endsAt ?? 0) < Date.now()
//                             ? "Poll ended"
//                             : `${localPoll.totalVotes ?? 0} votes`}
//                     </div>
//                 </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/8">
//                 <PostLikeButton
//                     postId={post.id ?? ""}
//                     likes={post.likes || 0}
//                     likedBy={post.likedBy || []}
//                     onToggle={(postId: string, userId: string) => {
//                         if (onLike && currentUserId) onLike(postId, currentUserId);
//                     }}
//                 />

//                 <button
//                     onClick={() => setShowComments((prev) => !prev)}
//                     className={`flex items-center gap-1.5 transition-colors ${
//                         showComments
//                             ? "text-[#C9115F]"
//                             : "text-white/40 hover:text-white/70"
//                     }`}
//                 >
//                     <MessageCircle className="w-4 h-4" />
//                     {localCommentCount > 0 && (
//                         <span className="tabular-nums text-sm">
//                             {localCommentCount}
//                         </span>
//                     )}
//                 </button>

//                 <button className="flex items-center gap-1.5 text-white/40 hover:text-green-400 transition-colors">
//                     <Repeat2 className="w-5 h-5" />
//                     {(post.repostCount || 0) > 0 && (
//                         <span className="tabular-nums text-sm">
//                             {post.repostCount}
//                         </span>
//                     )}
//                 </button>

//                 <button
//                     onClick={() => {
//                         if (navigator.share) {
//                             navigator.share({
//                                 title: post.content?.slice(0, 60) || "Post",
//                                 url: window.location.href,
//                             });
//                         } else {
//                             navigator.clipboard.writeText(window.location.href);
//                         }
//                     }}
//                     className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors"
//                 >
//                     <Share className="w-4 h-4" />
//                     <span className="text-sm">Share</span>
//                 </button>
//             </div>

//             {/* Comments Section */}
//             {showComments && post.id && (
//                 <div className="mt-4 pt-4 border-t border-white/8">
//                     <CommentsSection
//                         contentId={post.id}
//                         contentType="post"
//                         contentTitle={post.content?.slice(0, 100) || "Post"}
//                         onCommentAdded={handleCommentAdded}
//                         onCommentDeleted={handleCommentDeleted}
//                         onCountLoaded={handleCountLoaded}
//                     />
//                 </div>
//             )}
//         </div>
//     );
// }





"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
    MessageCircle,
    MoreHorizontal,
    Trash2,
    Repeat2,
    Share,
    CheckCircle2,
    User,
} from "lucide-react";
import type { Post } from "@/types/PostPolls";
import PostLikeButton from "./Postlikebutton";
import CommentsSection from "./Commentssection";

type ReactionId = "like" | "love" | "haha" | "wow" | "sad" | "angry";
type VotedByEntry = { voterId: string; userName: string } | string;

const ProfilePlaceholder = ({ size = 40 }: { name?: string; size?: number }) => (
    <div
        className="bg-gradient-to-br from-[#C9115F] to-[#e8185a] rounded-full flex items-center justify-center text-white shadow-inner"
        style={{ width: `${size}px`, height: `${size}px` }}
    >
        <User className="w-5 h-5" style={{ width: size * 0.4, height: size * 0.4 }} />
    </div>
);

interface Props {
    post: Post;
    onLike?: (postId: string, userId: string, reaction?: ReactionId) => void;
    onDelete?: (id: string) => Promise<void>;
    onVote?: (postId: string, optionId: string, voterId: string, userName: string) => Promise<void>;
    currentUserId?: string;
    currentUserName?: string;
    onCommentAdded?: (postId: string) => void;
    onCommentDeleted?: (postId: string) => void;
}

export default function PostCard({
    post,
    onLike,
    onDelete,
    onVote,
    currentUserId,
    currentUserName = "Anonymous",
    onCommentAdded,
    onCommentDeleted,
}: Props) {
    const [showComments, setShowComments] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [localPoll, setLocalPoll] = useState(post.poll);

    // Comment count — null means unknown (don't show), number means known
    const [localCommentCount, setLocalCommentCount] = useState<number | null>(
        typeof post.commentCount === "number" ? post.commentCount : null
    );

    // Likes & reactions — local optimistic state
    const [localLikes, setLocalLikes] = useState(post.likes || 0);
    const [localLikedBy, setLocalLikedBy] = useState<string[]>(post.likedBy || []);
    const [localReactions, setLocalReactions] = useState<Record<string, string>>(
        (post.reactions as Record<string, string>) || {}
    );

    const formatTimeAgo = (timestamp: number): string => {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return `${seconds}s ago`;
    };

    const handleDelete = async () => {
        if (!onDelete || !post.id) return;
        if (!confirm("Are you sure you want to delete this post?")) return;
        setDeleting(true);
        try {
            await onDelete(post.id);
        } catch (error) {
            console.error("Failed to delete post:", error);
        } finally {
            setDeleting(false);
            setShowMenu(false);
        }
    };

    const toggleMenu = () => setShowMenu(!showMenu);
    const isOwner = currentUserId && post.userId && currentUserId === post.userId;

    useEffect(() => { setLocalPoll(post.poll); }, [post.poll]);

    useEffect(() => {
        if (typeof post.commentCount === "number") {
            setLocalCommentCount(post.commentCount);
        }
    }, [post.commentCount]);

    // Re-sync likes/reactions from parent ONLY when the user hasn't just
    // made an optimistic update. We guard by checking if localReactions
    // already has a value for the current user before overwriting.
    useEffect(() => {
        setLocalLikes(post.likes || 0);
        setLocalLikedBy(post.likedBy || []);
        // Only sync reactions from the server if we don't have a pending
        // optimistic value for this user, to avoid the flicker.
        setLocalReactions((prev) => {
            const incoming = (post.reactions as Record<string, string>) || {};
            if (!currentUserId) return incoming;
            // If the user has a locally-set reaction not yet confirmed by
            // the server, keep it; otherwise take the server value.
            const merged = { ...incoming };
            if (prev[currentUserId] && !incoming[currentUserId]) {
                merged[currentUserId] = prev[currentUserId];
            }
            return merged;
        });
    }, [post.likes, post.likedBy, post.reactions, currentUserId]);

    const hasVoted =
        Array.isArray(localPoll?.votedBy) &&
        localPoll.votedBy.some((v: VotedByEntry) =>
            typeof v === "string" ? v === currentUserId : v.voterId === currentUserId
        );

    const handleVote = (optionId: string) => {
        if (!post.id || !onVote || !currentUserId || hasVoted) return;
        if (localPoll) {
            const updated = {
                ...localPoll,
                totalVotes: (localPoll.totalVotes ?? 0) + 1,
                options: localPoll.options.map((opt) =>
                    opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
                ),
                votedBy: [
                    ...(localPoll.votedBy ?? []),
                    { voterId: currentUserId, userName: currentUserName },
                ],
            };
            setLocalPoll(updated);
        }
        onVote(post.id, optionId, currentUserId, currentUserName);
    };

    const handleCommentCountLoaded = useCallback((count: number) => {
        setLocalCommentCount((prev) => (prev === null ? count : prev));
    }, []);

    const handleCommentAdded = useCallback(() => {
        setLocalCommentCount((prev) => (prev === null ? 1 : prev + 1));
        onCommentAdded?.(post.id!);
    }, [onCommentAdded, post.id]);

    const handleCommentDeleted = useCallback(() => {
        setLocalCommentCount((prev) => (prev === null ? 0 : Math.max(0, prev - 1)));
        onCommentDeleted?.(post.id!);
    }, [onCommentDeleted, post.id]);

    const commentCountDisplay =
        localCommentCount !== null && localCommentCount > 0 ? localCommentCount : null;

    // ── Reaction toggle handler ──────────────────────────────────────────────
    const handleReactionToggle = (
        postId: string,
        userId: string,
        reaction?: ReactionId
    ) => {
        if (!currentUserId) return;

        const wasLiked = localLikedBy.includes(currentUserId);

        if (!reaction) {
            // ── Remove reaction ──────────────────────────────────────────────
            setLocalLikedBy((prev) => prev.filter((id) => id !== currentUserId));
            setLocalLikes((prev) => Math.max(0, prev - 1));
            setLocalReactions((prev) => {
                const next = { ...prev };
                delete next[currentUserId];
                return next;
            });
        } else {
            // ── Add or change reaction ───────────────────────────────────────
            if (!wasLiked) {
                setLocalLikedBy((prev) => [...prev, currentUserId]);
                setLocalLikes((prev) => prev + 1);
            }
            // Persist the chosen emoji reaction for this user
            setLocalReactions((prev) => ({ ...prev, [currentUserId]: reaction }));
        }

        // ── Persist via parent, passing reaction so the server can store it ──
        // Note: onLike receives the reaction so it can persist the type.
        // If your parent handler only toggles a boolean, update it to also
        // accept and store the reaction parameter.
        onLike?.(postId, userId, reaction);
    };

    return (
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/8 transition-all duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                        <ProfilePlaceholder size={40} />
                    </div>
                    <div>
                        <p className="text-white font-semibold text-sm">{post.userName}</p>
                        <div className="flex items-center gap-2">
                            <span className="text-white/20 text-xs">•</span>
                            <p className="text-white/30 text-xs">{formatTimeAgo(post.createdAt)}</p>
                        </div>
                    </div>
                </div>

                {isOwner && onDelete && (
                    <div className="relative">
                        <button
                            onClick={toggleMenu}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            disabled={deleting}
                        >
                            <MoreHorizontal className="w-4 h-4 text-white/60" />
                        </button>
                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                <div className="absolute right-0 top-8 z-20 bg-[#1a1a1a] rounded-xl shadow-lg border border-white/10 overflow-hidden min-w-[140px]">
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {deleting ? "Deleting..." : "Delete Post"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            {post.content && (
                <p className="text-white text-sm mb-3 leading-relaxed">{post.content}</p>
            )}

            {/* Media Grid */}
            {post.media && post.media.length > 0 && (
                <div
                    className={`mb-3 grid gap-2 ${
                        post.media.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    }`}
                >
                    {post.media.map((item, idx) => (
                        <div
                            key={idx}
                            className="relative rounded-xl overflow-hidden bg-zinc-800"
                            style={{ aspectRatio: "56/25" }}
                        >
                            {item.type === "image" ? (
                                <Image
                                    src={item.url}
                                    alt={item.name || `media-${idx}`}
                                    fill
                                    className="object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                                    onClick={() => window.open(item.url, "_blank")}
                                />
                            ) : (
                                <video
                                    src={item.url}
                                    className="w-full h-full object-cover"
                                    controls
                                    preload="metadata"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Poll */}
            {localPoll && localPoll.options && localPoll.options.length > 0 && (
                <div className="mb-3 bg-white/5 rounded-xl p-3 border border-white/10">
                    {hasVoted && (
                        <div className="flex items-center gap-1.5 mb-2 text-[#C9115F] text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>You voted</span>
                        </div>
                    )}
                    <div className="space-y-2">
                        {localPoll.options.map((option) => {
                            const totalVotes = localPoll.totalVotes ?? 0;
                            const votePercentage =
                                totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                            const isPollEnded = (localPoll.endsAt ?? 0) < Date.now();
                            const isDisabled = isPollEnded || hasVoted;
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleVote(option.id)}
                                    disabled={isDisabled}
                                    className={`w-full relative group transition-opacity ${
                                        isDisabled ? "cursor-not-allowed opacity-80" : "hover:opacity-90"
                                    }`}
                                >
                                    <div className="relative bg-white/10 rounded-lg overflow-hidden">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C9115F]/30 to-[#e8185a]/30 rounded-lg transition-all duration-300"
                                            style={{ width: `${votePercentage}%` }}
                                        />
                                        <div className="relative px-3 py-2 flex justify-between items-center">
                                            <span className="text-white text-sm">{option.text}</span>
                                            <span className="text-white/50 text-xs">
                                                {votePercentage.toFixed(0)}% ({option.votes})
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-2 text-xs text-white/30 text-center">
                        {(localPoll.endsAt ?? 0) < Date.now()
                            ? "Poll ended"
                            : `${localPoll.totalVotes ?? 0} votes`}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/8">
                <PostLikeButton
                    postId={post.id ?? ""}
                    likes={localLikes}
                    likedBy={localLikedBy}
                    reactions={localReactions}
                    onToggle={handleReactionToggle}
                />

                <button
                    onClick={() => setShowComments((prev) => !prev)}
                    className={`flex items-center gap-1.5 transition-colors ${
                        showComments ? "text-[#C9115F]" : "text-white/40 hover:text-white/70"
                    }`}
                >
                    <MessageCircle className="w-4 h-4" />
                    {commentCountDisplay !== null && (
                        <span className="tabular-nums text-sm">{commentCountDisplay}</span>
                    )}
                </button>

                <button className="flex items-center gap-1.5 text-white/40 hover:text-green-400 transition-colors">
                    <Repeat2 className="w-5 h-5" />
                    {(post.repostCount || 0) > 0 && (
                        <span className="tabular-nums text-sm">{post.repostCount}</span>
                    )}
                </button>

                <button
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: post.content?.slice(0, 60) || "Post",
                                url: window.location.href,
                            });
                        } else {
                            navigator.clipboard.writeText(window.location.href);
                        }
                    }}
                    className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors"
                >
                    <Share className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && post.id && (
                <div className="mt-4 pt-4 border-t border-white/8">
                    <CommentsSection
                        contentId={post.id}
                        contentType="post"
                        contentTitle={post.content?.slice(0, 100) || "Post"}
                        onCommentAdded={handleCommentAdded}
                        onCommentDeleted={handleCommentDeleted}
                        onCommentCountLoaded={handleCommentCountLoaded}
                    />
                </div>
            )}
        </div>
    );
}