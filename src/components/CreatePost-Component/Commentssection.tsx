"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, Reply, Trash2, ChevronDown, ChevronUp, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface Comment {
    id: string;
    commentText: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    userEmail?: string;
    parentCommentId?: string;
    likes: number;
    likedBy: string[];
    replyCount?: number;
    createdAt: number;
    updatedAt: number;
}

function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}d`;
}

function Avatar({ name, avatar, size = 8 }: { name: string; avatar?: string; size?: number }) {
    const sizeClass = `w-${size} h-${size}`;
    if (avatar) {
        return <img src={avatar} alt={name} className={`${sizeClass} rounded-full object-cover flex-shrink-0`} />;
    }
    const initials = name.slice(0, 2).toUpperCase();
    const colors = ["bg-pink-600", "bg-purple-600", "bg-blue-600", "bg-green-600", "bg-orange-600", "bg-red-600"];
    const color = colors[name.charCodeAt(0) % colors.length];
    return (
        <div
            className={`${sizeClass} ${color} rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold`}
            style={{ fontSize: size < 8 ? "10px" : "13px" }}
        >
            {initials}
        </div>
    );
}

function CommentRow({
    comment, currentUserId, onLike, onDelete, onReply, isReply = false, parentCommentId,
}: {
    comment: Comment;
    currentUserId: string;
    onLike: (commentId: string, isReply: boolean, parentCommentId?: string) => void;
    onDelete: (commentId: string, parentCommentId?: string) => void;
    onReply: (commentId: string, userName: string) => void;
    isReply?: boolean;
    parentCommentId?: string;
}) {
    const isLiked = comment.likedBy?.includes(currentUserId);
    const isOwner = comment.userId === currentUserId;

    return (
        <div className={`flex gap-3 ${isReply ? "pl-10" : ""}`}>
            <Avatar name={comment.userName} avatar={comment.userAvatar} size={isReply ? 6 : 8} />
            <div className="flex-1 min-w-0">
                <div className="bg-white/5 rounded-2xl px-3 py-2.5">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white text-sm font-semibold leading-tight truncate">{comment.userName}</span>
                        <span className="text-white/30 text-xs flex-shrink-0">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed break-words">{comment.commentText}</p>
                </div>
                <div className="flex items-center gap-4 mt-1 px-1">
                    <button
                        onClick={() => onLike(comment.id, isReply, parentCommentId)}
                        className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? "text-[#C9115F]" : "text-white/40 hover:text-white/70"}`}
                    >
                        <Heart className="w-3.5 h-3.5" fill={isLiked ? "currentColor" : "none"} />
                        {comment.likes > 0 && <span>{comment.likes}</span>}
                    </button>
                    {!isReply && (
                        <button
                            onClick={() => onReply(comment.id, comment.userName)}
                            className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors"
                        >
                            <Reply className="w-3.5 h-3.5" />
                            Reply
                            {/* {(comment.replyCount || 0) > 0 && (
                                <span className="text-white/30">{comment.replyCount}</span>
                            )} */}
                        </button>
                    )}
                    {isOwner && (
                        <button
                            onClick={() => onDelete(comment.id, parentCommentId)}
                            className="flex items-center gap-1 text-xs text-white/25 hover:text-red-400 transition-colors ml-auto"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function CommentThread({
    comment, currentUserId, replies, onLike, onDelete, onReply, onLoadReplies,
}: {
    comment: Comment;
    currentUserId: string;
    replies: Comment[];
    onLike: (commentId: string, isReply: boolean, parentCommentId?: string) => void;
    onDelete: (commentId: string, parentCommentId?: string) => void;
    onReply: (commentId: string, userName: string) => void;
    onLoadReplies: (commentId: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const hasReplies = (comment.replyCount || 0) > 0;

    const handleToggleReplies = () => {
        if (!expanded && replies.length === 0) onLoadReplies(comment.id);
        setExpanded((v) => !v);
    };

    return (
        <div className="flex flex-col gap-2">
            <CommentRow
                comment={comment}
                currentUserId={currentUserId}
                onLike={onLike}
                onDelete={onDelete}
                onReply={onReply}
            />
            {hasReplies && (
                <button
                    onClick={handleToggleReplies}
                    className="flex items-center gap-1.5 ml-9 text-xs text-[#C9115F] hover:text-[#e8185a] transition-colors w-fit"
                >
                    {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {expanded
                        ? "Hide"
                        : `View ${comment.replyCount} ${comment.replyCount === 1 ? "reply" : "replies"}`}
                </button>
            )}
            {expanded && replies.length > 0 && (
                <div className="flex flex-col gap-3 mt-1">
                    {replies.map((reply) => (
                        <CommentRow
                            key={reply.id}
                            comment={reply}
                            currentUserId={currentUserId}
                            onLike={onLike}
                            onDelete={onDelete}
                            onReply={onReply}
                            isReply
                            parentCommentId={comment.id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

interface Props {
    contentId: string;
    contentType: "article" | "post";
    contentTitle?: string;
    className?: string;
    onCommentAdded?: () => void;
    onCommentDeleted?: () => void;
    onCountLoaded?: (count: number) => void; // ← NEW
}

export default function CommentsSection({
    contentId,
    contentType,
    contentTitle,
    className = "",
    onCommentAdded,
    onCommentDeleted,
    onCountLoaded, // ← NEW
}: Props) {
    const { user, getUserDisplayName, user: authUser } = useAuth();

    const [comments, setComments] = useState<Comment[]>([]);
    const [replies, setReplies] = useState<Record<string, Comment[]>>({});
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [text, setText] = useState("");
    const [replyTo, setReplyTo] = useState<{ commentId: string; userName: string } | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const lastDocIdRef = useRef<string | null>(null);
    const currentUserId = authUser?.userId || authUser?.email || "";
    const displayName = user ? getUserDisplayName() : "Guest";

    const fetchComments = useCallback(async (reset = false, signal?: AbortSignal) => {
        setLoading(true);
        try {
            if (reset) lastDocIdRef.current = null;
            const cursor = lastDocIdRef.current ? `&lastDocId=${lastDocIdRef.current}` : "";
            const url = `/api/comments?contentId=${contentId}&contentType=${contentType}&limit=20${cursor}`;
            const res = await axios.get(url, { signal });
            const data = res.data;

            if (data.success) {
                const newComments: Comment[] = data.comments ?? [];
                setComments((prev) => (reset ? newComments : [...prev, ...newComments]));
                setHasMore(data.pagination?.hasMore ?? false);
                if (newComments.length > 0) {
                    lastDocIdRef.current = newComments[newComments.length - 1].id;
                }

                // ← NEW: on first load, report total top-level count to parent
                if (reset && onCountLoaded) {
                    // Sum top-level comments + their reply counts for total
                    const totalReplies = newComments.reduce(
                        (acc, c) => acc + (c.replyCount ?? 0),
                        0
                    );
                    onCountLoaded(newComments.length + totalReplies);
                }
            }
        } catch (error: unknown) {
            if (axios.isCancel(error) || (error instanceof Error && error.name === "CanceledError")) {
                return;
            }
            console.error("[CommentsSection] fetch failed:", error);
        } finally {
            setLoading(false);
        }
    }, [contentId, contentType, onCountLoaded]);

    useEffect(() => {
        const controller = new AbortController();
        lastDocIdRef.current = null;
        fetchComments(true, controller.signal);
        return () => controller.abort();
    }, [contentId, contentType]);

    const fetchReplies = useCallback(async (commentId: string) => {
        try {
            const res = await axios.get(
                `/api/comments/${contentType}/${contentId}/replies/${commentId}`
            );
            const data = res.data;
            if (data.success) {
                setReplies((prev) => ({ ...prev, [commentId]: data.replies }));
            }
        } catch (error) {
            console.error("[CommentsSection] fetch replies failed:", error);
        }
    }, [contentId, contentType]);

    const postComment = useCallback(async (commentData: {
        commentText: string;
        userId: string;
        userName: string;
        userEmail?: string;
        parentCommentId?: string;
    }) => {
        const res = await axios.post(`/api/comments`, {
            ...commentData,
            contentType,
            contentId,
            contentTitle: contentTitle || "",
        });
        const data = res.data;

        if (data.success) {
            const newComment = data.comment;
            if (commentData.parentCommentId) {
                setReplies((prev) => ({
                    ...prev,
                    [commentData.parentCommentId!]: [
                        ...(prev[commentData.parentCommentId!] || []),
                        newComment,
                    ],
                }));
                setComments((prev) =>
                    prev.map((c) =>
                        c.id === commentData.parentCommentId
                            ? { ...c, replyCount: (c.replyCount || 0) + 1 }
                            : c
                    )
                );
            } else {
                setComments((prev) => [newComment, ...prev]);
                onCommentAdded?.();
            }
        }
        return data;
    }, [contentId, contentType, contentTitle, onCommentAdded]);

    const toggleLike = useCallback(async (
        commentId: string, userId: string, isReply: boolean, parentCommentId?: string
    ) => {
        try {
            const res = await axios.post(`/api/comments/${commentId}/like`, { userId });
            const data = res.data;
            if (data.success) {
                const updated = data.comment;
                if (isReply && parentCommentId) {
                    setReplies((prev) => ({
                        ...prev,
                        [parentCommentId]: prev[parentCommentId]?.map((c) =>
                            c.id === commentId ? updated : c
                        ) || [],
                    }));
                } else {
                    setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
                }
            }
        } catch (error) {
            console.error("[CommentsSection] like failed:", error);
        }
    }, []);

    const deleteComment = useCallback(async (
        commentId: string, userId: string, parentCommentId?: string
    ) => {
        try {
            const res = await axios.delete(`/api/comments/${commentId}`, { data: { userId } });
            const data = res.data;
            if (data.success) {
                if (parentCommentId) {
                    setReplies((prev) => ({
                        ...prev,
                        [parentCommentId]: prev[parentCommentId]?.filter((c) => c.id !== commentId) || [],
                    }));
                    setComments((prev) =>
                        prev.map((c) =>
                            c.id === parentCommentId
                                ? { ...c, replyCount: Math.max(0, (c.replyCount || 0) - 1) }
                                : c
                        )
                    );
                } else {
                    setComments((prev) => prev.filter((c) => c.id !== commentId));
                    onCommentDeleted?.();
                }
            }
        } catch (error) {
            console.error("[CommentsSection] delete failed:", error);
        }
    }, [onCommentDeleted]);

    const handleReply = (commentId: string, userName: string) => {
        setReplyTo({ commentId, userName });
        setText(`@${userName} `);
        inputRef.current?.focus();
    };

    const handleSubmit = async () => {
        if (!text.trim() || !user) return;
        setSubmitting(true);
        try {
            await postComment({
                commentText: text.trim(),
                userId: user.userId || user.email,
                userName: getUserDisplayName(),
                userEmail: user.email,
                parentCommentId: replyTo?.commentId,
            });
            setText("");
            setReplyTo(null);
        } catch (err) {
            console.error("[CommentsSection] submit failed:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = (commentId: string, isReply: boolean, parentCommentId?: string) => {
        if (!user) return;
        toggleLike(commentId, user.userId || user.email, isReply, parentCommentId);
    };

    const handleDelete = async (commentId: string, parentCommentId?: string) => {
        if (!user) return;
        await deleteComment(commentId, user.userId || user.email, parentCommentId);
    };

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <div className="flex items-center gap-2">
                <Avatar name={displayName} size={8} />
                <div className="flex-1 relative">
                    {replyTo && (
                        <div className="flex items-center gap-1 mb-1 text-xs text-[#C9115F]">
                            <Reply className="w-3 h-3" />
                            Replying to @{replyTo.userName}
                            <button
                                onClick={() => { setReplyTo(null); setText(""); }}
                                className="ml-1 text-white/30 hover:text-white/60"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    <div className="flex items-center bg-white/8 rounded-2xl border border-white/10 focus-within:border-[#C9115F]/50 transition-colors overflow-hidden pr-1">
                        <input
                            ref={inputRef}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            placeholder={user ? "Add a comment…" : "Sign in to comment"}
                            disabled={!user || submitting}
                            className="flex-1 bg-transparent px-1 py-2.5 text-sm text-white placeholder-white/25 outline-none disabled:opacity-50"
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={!text.trim() || !user || submitting}
                            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 enabled:hover:bg-[#C9115F]/20 enabled:text-[#C9115F] text-white/30"
                        >
                            {submitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {loading && comments.length === 0 ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-white/30" />
                </div>
            ) : comments.length === 0 ? (
                <p className="text-white/25 text-sm text-center py-2">No comments yet. Be the first!</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {comments.map((comment) => (
                        <CommentThread
                            key={comment.id}
                            comment={comment}
                            currentUserId={currentUserId}
                            replies={replies[comment.id] || []}
                            onLike={handleLike}
                            onDelete={handleDelete}
                            onReply={handleReply}
                            onLoadReplies={fetchReplies}
                        />
                    ))}
                    {hasMore && (
                        <button
                            onClick={() => fetchComments(false)}
                            disabled={loading}
                            className="text-white/40 text-sm hover:text-white/70 transition-colors text-center py-1"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                            ) : (
                                "Load more comments"
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}