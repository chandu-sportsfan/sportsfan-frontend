// "use client";

// import { useEffect, useState } from "react";
// import {
//     MessageCircle,
//     MoreHorizontal,
//     Trash2,
//     Repeat2,
//     Share,
//     CheckCircle2,
// } from "lucide-react";
// import axios from "axios";
// import type { Post } from "@/types/PostPolls";
// import PostLikeButton from "./Postlikebutton";
// import CommentsSection from "./Commentssection";

// // Matches both old string format and new object format in votedBy
// type VotedByEntry = { voterId: string; userName: string } | string;

// interface Props {
//     post: Post;
//     onLike?: (postId: string, userId: string) => void;
//     onDelete?: (id: string) => Promise<void>;
//     onVote?: (postId: string, optionId: string, voterId: string, userName: string) => Promise<void>;
//     currentUserId?: string;
//     currentUserName?: string; // ← NEW: display name to store in votedBy
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
//     // Works with both old string entries and new { voterId, userName } objects
//     const hasVoted =
//         Array.isArray(localPoll?.votedBy) &&
//         localPoll.votedBy.some((v: VotedByEntry) =>
//             typeof v === "string"
//                 ? v === currentUserId
//                 : v.voterId === currentUserId
//         );

//     const handleVote = (optionId: string) => {
//         if (!post.id || !onVote || !currentUserId) return;
//         if (hasVoted) return; // client-side guard — server also enforces this

//         if (localPoll) {
//             // Optimistic update
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

//         // Pass userName so the parent can include it in the API call
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
//                         <img
//                             src={
//                                 post.userAvatar ||
//                                 "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
//                             }
//                             alt={post.userName}
//                             className="w-10 h-10 rounded-full object-cover border-2 border-[#C9115F]/40"
//                         />
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
//                     {/* "You voted" badge */}
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
//                 {/* Like */}
//                 <PostLikeButton
//                     postId={post.id ?? ""}
//                     likes={post.likes || 0}
//                     likedBy={post.likedBy || []}
//                     onToggle={(postId: string, userId: string) => {
//                         if (onLike && currentUserId) onLike(postId, currentUserId);
//                     }}
//                 />

//                 {/* Comments */}
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

//                 {/* Repost */}
//                 <button className="flex items-center gap-1.5 text-white/40 hover:text-green-400 transition-colors">
//                     <Repeat2 className="w-5 h-5" />
//                     {(post.repostCount || 0) > 0 && (
//                         <span className="tabular-nums text-sm">
//                             {post.repostCount}
//                         </span>
//                     )}
//                 </button>

//                 {/* Share */}
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

import { useEffect, useState } from "react";
import {
    MessageCircle,
    MoreHorizontal,
    Trash2,
    Repeat2,
    Share,
    CheckCircle2,
    User,
} from "lucide-react";
import axios from "axios";
import type { Post } from "@/types/PostPolls";
import PostLikeButton from "./Postlikebutton";
import CommentsSection from "./Commentssection";

// Matches both old string format and new object format in votedBy
type VotedByEntry = { voterId: string; userName: string } | string;

// Common profile placeholder component - ALWAYS shows an icon
const ProfilePlaceholder = ({ size = 40 }: { name?: string; size?: number }) => {
    return (
        <div 
            className="bg-gradient-to-br from-[#C9115F] to-[#e8185a] rounded-full flex items-center justify-center text-white shadow-inner"
            style={{ width: `${size}px`, height: `${size}px` }}
        >
            <User className="w-5 h-5" style={{ width: size * 0.4, height: size * 0.4 }} />
        </div>
    );
};

interface Props {
    post: Post;
    onLike?: (postId: string, userId: string) => void;
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
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [copied, setCopied] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [localPoll, setLocalPoll] = useState(post.poll);
    const [localCommentCount, setLocalCommentCount] = useState<number>(
        post.commentCount ?? 0
    );
    const [countLoaded, setCountLoaded] = useState(false);

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

    // Fetch real comment count on mount
    useEffect(() => {
        if (!post.id) return;
        axios
            .get(`/api/comments?contentId=${post.id}&contentType=post&limit=20`)
            .then((res) => {
                if (res.data.success) {
                    const comments = res.data.comments ?? [];
                    const total = comments.reduce(
                        (acc: number, c: { replyCount?: number }) =>
                            acc + 1 + (c.replyCount ?? 0),
                        0
                    );
                    setLocalCommentCount(total);
                    setCountLoaded(true);
                }
            })
            .catch(() => {
                // silently fall back to post.commentCount
            });
    }, [post.id]);

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

    const openShareDialog = () => {
        setShowShareDialog(true);
        setCopied(false);
    };

    const closeShareDialog = () => {
        setShowShareDialog(false);
        setCopied(false);
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

    const buildPostShareUrl = () => {
        if (typeof window === "undefined") return "";
        return `${window.location.origin}${window.location.pathname}${window.location.search}`;
    };

    const buildPostShareText = () => {
        const previewText = post.content?.trim() || "Check out this post";
        const previewLink = buildPostShareUrl();
        return [
            previewText,
            `View post: ${previewLink}`,
        ].filter(Boolean).join("\n");
    };

    const handleShareToWhatsApp = () => {
        const shareText = buildPostShareText();
        const whatsappAppUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
        const whatsappWebFallbackUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

        const opened = window.open(whatsappAppUrl, "_self");
        if (!opened) {
            window.location.href = whatsappWebFallbackUrl;
        }
    };

    const handleShareToThreads = () => {
        const shareText = buildPostShareText();
        window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
    };

    const handleShareToInstagram = async () => {
        const shareText = buildPostShareText();
        await copyToClipboard(shareText);
        setCopied(true);
        window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
        setTimeout(() => setCopied(false), 1600);
    };

    const handleShareToLinkedIn = () => {
        const shareUrl = buildPostShareUrl();
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
    };

    const handleShareToX = () => {
        const shareText = buildPostShareText();
        window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
    };

    const handleCopyLink = async () => {
        const ok = await copyToClipboard(buildPostShareText());
        if (!ok) return;
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
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
                <button
                    key={alt}
                    onClick={handler}
                    className={`${size} shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center`}
                    aria-label={`Share on ${alt}`}
                >
                    <img src={src} alt={alt} className="w-full h-full object-cover rounded-full" />
                </button>
            ))}
        </>
    );

    const isOwner =
        currentUserId && post.userId && currentUserId === post.userId;

    useEffect(() => {
        setLocalPoll(post.poll);
    }, [post.poll]);

    // Only sync from prop if we haven't loaded the real count yet
    useEffect(() => {
        if (!countLoaded) {
            setLocalCommentCount(post.commentCount ?? 0);
        }
    }, [post.commentCount, countLoaded]);

    // ── Vote guard ────────────────────────────────────────────────────────────
    const hasVoted =
        Array.isArray(localPoll?.votedBy) &&
        localPoll.votedBy.some((v: VotedByEntry) =>
            typeof v === "string"
                ? v === currentUserId
                : v.voterId === currentUserId
        );

    const handleVote = (optionId: string) => {
        if (!post.id || !onVote || !currentUserId) return;
        if (hasVoted) return;

        if (localPoll) {
            const optimisticEntry: VotedByEntry = {
                voterId: currentUserId,
                userName: currentUserName,
            };
            const updated = {
                ...localPoll,
                totalVotes: (localPoll.totalVotes ?? 0) + 1,
                options: localPoll.options.map((opt) =>
                    opt.id === optionId
                        ? { ...opt, votes: opt.votes + 1 }
                        : opt
                ),
                votedBy: [...(localPoll.votedBy ?? []), optimisticEntry],
            };
            setLocalPoll(updated);
        }

        onVote(post.id, optionId, currentUserId, currentUserName);
    };

    const handleCommentAdded = () => {
        setLocalCommentCount((prev) => prev + 1);
        onCommentAdded?.(post.id!);
    };

    const handleCommentDeleted = () => {
        setLocalCommentCount((prev) => Math.max(0, prev - 1));
        onCommentDeleted?.(post.id!);
    };

    const handleCountLoaded = (count: number) => {
        setLocalCommentCount(count);
        setCountLoaded(true);
    };

    return (
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/8 transition-all duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                        {/* ALWAYS show profile icon - no text, just icon */}
                        <ProfilePlaceholder size={40} />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f0f]" />
                    </div>
                    <div>
                        <p className="text-white font-semibold text-sm">
                            {post.userName}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-white/20 text-xs">•</span>
                            <p className="text-white/30 text-xs">
                                {formatTimeAgo(post.createdAt)}
                            </p>
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
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
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
                <p className="text-white text-sm mb-3 leading-relaxed">
                    {post.content}
                </p>
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
                                <img
                                    src={item.url}
                                    alt={item.name || `media-${idx}`}
                                    className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
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
                                totalVotes > 0
                                    ? (option.votes / totalVotes) * 100
                                    : 0;
                            const isPollEnded =
                                (localPoll.endsAt ?? 0) < Date.now();
                            const isDisabled = isPollEnded || hasVoted;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleVote(option.id)}
                                    disabled={isDisabled}
                                    className={`w-full relative group transition-opacity ${
                                        isDisabled
                                            ? "cursor-not-allowed opacity-80"
                                            : "hover:opacity-90"
                                    }`}
                                >
                                    <div className="relative bg-white/10 rounded-lg overflow-hidden">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C9115F]/30 to-[#e8185a]/30 rounded-lg transition-all duration-300"
                                            style={{ width: `${votePercentage}%` }}
                                        />
                                        <div className="relative px-3 py-2 flex justify-between items-center">
                                            <span className="text-white text-sm">
                                                {option.text}
                                            </span>
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
                    likes={post.likes || 0}
                    likedBy={post.likedBy || []}
                    onToggle={(postId: string, userId: string) => {
                        if (onLike && currentUserId) onLike(postId, currentUserId);
                    }}
                />

                <button
                    onClick={() => setShowComments((prev) => !prev)}
                    className={`flex items-center gap-1.5 transition-colors ${
                        showComments
                            ? "text-[#C9115F]"
                            : "text-white/40 hover:text-white/70"
                    }`}
                >
                    <MessageCircle className="w-4 h-4" />
                    {localCommentCount > 0 && (
                        <span className="tabular-nums text-sm">
                            {localCommentCount}
                        </span>
                    )}
                </button>

                <button className="flex items-center gap-1.5 text-white/40 hover:text-green-400 transition-colors">
                    <Repeat2 className="w-5 h-5" />
                    {(post.repostCount || 0) > 0 && (
                        <span className="tabular-nums text-sm">
                            {post.repostCount}
                        </span>
                    )}
                </button>

                <button
                    onClick={openShareDialog}
                    className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors"
                >
                    <Share className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                </button>
            </div>

            {showShareDialog && (
                <>
                    <button type="button" className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={closeShareDialog} />
                    <div className="fixed bottom-16 inset-x-4 z-50 mx-auto w-full max-w-[280px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl lg:hidden" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-white text-sm font-semibold">Share</p>
                            <button onClick={closeShareDialog} className="text-gray-400 hover:text-white" aria-label="Close share dialog">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            </button>
                        </div>
                        <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 overflow-x-auto">{shareButtons("w-8 h-8")}</div>
                        {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
                    </div>
                    <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/60" onClick={closeShareDialog}>
                        <div className="bg-[#1a1a1e] rounded-2xl border border-white/10 p-4 w-[300px] shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-white text-sm font-semibold">Share Post</p>
                                <button onClick={closeShareDialog} className="text-gray-400 hover:text-white" aria-label="Close share dialog">
                                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                                </button>
                            </div>
                            <div className="rounded-xl border border-white/10 bg-[#111114] p-3 mb-3">
                                <p className="text-white text-sm font-semibold line-clamp-2">{post.content?.slice(0, 60) || "Post"}</p>
                                <p className="text-white/45 text-[11px] mt-2 line-clamp-2 break-all">{buildPostShareUrl()}</p>
                            </div>
                            <div className="flex flex-row flex-nowrap items-center gap-2 mb-2">{shareButtons("w-9 h-9")}</div>
                            {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
                        </div>
                    </div>
                </>
            )}

            {/* Comments Section */}
            {showComments && post.id && (
                <div className="mt-4 pt-4 border-t border-white/8">
                    <CommentsSection
                        contentId={post.id}
                        contentType="post"
                        contentTitle={post.content?.slice(0, 100) || "Post"}
                        onCommentAdded={handleCommentAdded}
                        onCommentDeleted={handleCommentDeleted}
                        onCountLoaded={handleCountLoaded}
                    />
                </div>
            )}
        </div>
    );
}