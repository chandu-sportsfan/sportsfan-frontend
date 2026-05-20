"use client";

import { useState } from "react";
import { MessageCircle, MoreHorizontal, Trash2, Clock } from "lucide-react";
import type { Post } from "@/types/PostPolls";
import PostLikeButton from "./Postlikebutton";
import CommentsSection from "./Commentssection";

interface Props {
  post: Post;
  onLike?: (postId: string, userId: string) => void;
  onDelete?: (id: string) => Promise<void>;
  onVote?: (postId: string, optionId: string, voterId: string) => Promise<void>;
  currentUserId?: string;
}

export default function PostCard({ post, onLike, onDelete, onVote, currentUserId }: Props) {
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Format the timestamp
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

  // Close menu when clicking outside
  const toggleMenu = () => setShowMenu(!showMenu);

  // Check if current user owns the post
  const isOwner = currentUserId && post.userId && currentUserId === post.userId;

  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/8 transition-all duration-200">
      {/* Header - User Info & Three Dots */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={post.userAvatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=default"}
              alt={post.userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#C9115F]/40"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f0f]" />
          </div>
          
          {/* User Info */}
          <div>
            <p className="text-white font-semibold text-sm">
              {post.userName}
            </p>
            <div className="flex items-center gap-2">
              {/* <p className="text-white/40 text-xs">
                {post.userHandle}
              </p> */}
              <span className="text-white/20 text-xs">•</span>
              <div className="flex items-center gap-1">
                <p className="text-white/30 text-xs">
                  {formatTimeAgo(post.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Three Dots Menu - Only show if user owns the post */}
 
         {(currentUserId === post.userId || currentUserId === post.userId || true) && onDelete && (
           <div className="relative">
             <button
               onClick={toggleMenu}
               className="p-2 rounded-full hover:bg-white/10 transition-colors"
               disabled={deleting}
             >
               <MoreHorizontal className="w-4 h-4 text-white/60" />
             </button>
            
             {/* Dropdown Menu */}
             {showMenu && (
               <>
                 {/* Backdrop */}
                 <div 
                   className="fixed inset-0 z-10" 
                   onClick={() => setShowMenu(false)}
                 />
                 {/* Menu */}
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
        <div className={`mb-3 grid gap-2 ${
          post.media.length === 1 ? "grid-cols-1" : 
          post.media.length === 2 ? "grid-cols-2" : 
          "grid-cols-2"
        }`}>
          {post.media.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden bg-zinc-800"
              style={{ aspectRatio: "16/9" }}
            >
              {item.type === "image" ? (
                <img
                  src={item.url}
                  alt={item.name || `media-${idx}`}
                  className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => window.open(item.url, '_blank')}
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

      {/* Poll (if exists) */}
      {post.poll && post.poll.options && post.poll.options.length > 0 && (
        <div className="mb-3 bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="space-y-2">
            {post.poll.options.map((option) => {
              const totalVotes = post.poll?.totalVotes ?? 0;
              const votePercentage = totalVotes > 0
                ? (option.votes / totalVotes) * 100
                : 0;
              
              const endsAt = post.poll?.endsAt ?? 0;
              const isPollEnded = endsAt < Date.now();
              
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    if (post.id && onVote && currentUserId) {
                      onVote(post.id, option.id, currentUserId);
                    }
                  }}
                  disabled={isPollEnded}
                  className="w-full relative group"
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
            {(post.poll?.endsAt ?? 0) < Date.now() 
              ? "Poll ended" 
              : `${post.poll?.totalVotes ?? 0} votes`}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/8">
        {/* Like Button */}
        <PostLikeButton
          postId={post.id ?? ''}
          likes={post.likes || 0}
          likedBy={post.likedBy || []}
          onToggle={(postId: string, userId: string) => {
            if (onLike && currentUserId) {
              onLike(postId, currentUserId);
            }
          }}
        />

        {/* Comments Toggle */}
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          {(post.commentCount || 0) > 0 && (
            <span className="tabular-nums text-xs">{post.commentCount}</span>
          )}
          <span className="text-xs">Comment</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && post.id && (
        <div className="mt-4 pt-4 border-t border-white/8">
          <CommentsSection postId={post.id} />
        </div>
      )}
    </div>
  );
}