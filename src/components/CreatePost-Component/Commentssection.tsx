"use client";

import { useState, useEffect, useRef } from "react";
import { Heart, Reply, Trash2, ChevronDown, ChevronUp, Send, Loader2 } from "lucide-react";
import { useComments, Comment } from "@/hooks/Usecomments";
import { useAuth } from "@/context/AuthContext";

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
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  const initials = name.slice(0, 2).toUpperCase();
  const colors = [
    "bg-pink-600", "bg-purple-600", "bg-blue-600",
    "bg-green-600", "bg-orange-600", "bg-red-600",
  ];
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

// ─── Single Comment Row ───────────────────────────────────────────────────────
function CommentRow({
  comment,
  currentUserId,
  onLike,
  onDelete,
  onReply,
  isReply = false,
  parentCommentId,
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
            <span className="text-white text-sm font-semibold leading-tight truncate">
              {comment.userName}
            </span>
            <span className="text-white/30 text-xs flex-shrink-0">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="text-white/80 text-sm leading-relaxed break-words">{comment.commentText}</p>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-4 mt-1 px-1">
          <button
            onClick={() => onLike(comment.id, isReply, parentCommentId)}
            className={`flex items-center gap-1 text-xs transition-colors ${
              isLiked ? "text-[#C9115F]" : "text-white/40 hover:text-white/70"
            }`}
          >
            <Heart
              className="w-3.5 h-3.5"
              fill={isLiked ? "currentColor" : "none"}
            />
            {comment.likes > 0 && <span>{comment.likes}</span>}
          </button>

          {!isReply && (
            <button
              onClick={() => onReply(comment.id, comment.userName)}
              className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              <Reply className="w-3.5 h-3.5" />
              Reply
              {(comment.replyCount || 0) > 0 && (
                <span className="text-white/30">{comment.replyCount}</span>
              )}
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

// ─── Comment Thread (with expandable replies) ─────────────────────────────────
function CommentThread({
  comment,
  currentUserId,
  replies,
  onLike,
  onDelete,
  onReply,
  onLoadReplies,
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
    if (!expanded && replies.length === 0) {
      onLoadReplies(comment.id);
    }
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

      {/* Expand/collapse replies */}
      {hasReplies && (
        <button
          onClick={handleToggleReplies}
          className="flex items-center gap-1.5 ml-11 text-xs text-[#C9115F] hover:text-[#e8185a] transition-colors w-fit"
        >
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
          {expanded ? "Hide" : `View ${comment.replyCount} ${comment.replyCount === 1 ? "reply" : "replies"}`}
        </button>
      )}

      {/* Replies */}
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

// ─── Main CommentsSection ─────────────────────────────────────────────────────
interface Props {
  postId: string;
  initialCount?: number;
}

export default function CommentsSection({ postId, initialCount = 0 }: Props) {
  const { user, getUserName, getUserDisplayName } = useAuth();
  const {
    comments,
    replies,
    loading,
    hasMore,
    fetchComments,
    fetchReplies,
    postComment,
    toggleLike,
    deleteComment,
  } = useComments(postId);

  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<{ commentId: string; userName: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchComments(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

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
      console.error("Failed to post comment:", err);
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

  const currentUserId = user?.userId || user?.email || "";

  return (
    <div className="flex flex-col gap-4">
      {/* Comment input */}
      <div className="flex items-center gap-2">
        <Avatar name={getUserDisplayName()} size={8} />
        <div className="flex-1 relative">
          {replyTo && (
            <div className="flex items-center gap-1 mb-1 text-xs text-[#C9115F]">
              <Reply className="w-3 h-3" />
              Replying to @{replyTo.userName}
              <button
                onClick={() => { setReplyTo(null); setText(""); }}
                className="ml-1 text-white/30 hover:text-white/60"
              >✕</button>
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
              className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none disabled:opacity-50"
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

      {/* Comments list */}
      {loading && comments.length === 0 ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-white/30" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-white/25 text-sm text-center py-2">
          No comments yet. Be the first!
        </p>
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
              onClick={() => fetchComments()}
              disabled={loading}
              className="text-white/40 text-sm hover:text-white/70 transition-colors text-center py-1"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Load more comments"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}