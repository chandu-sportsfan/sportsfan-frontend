"use client";

import { useEffect, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import PostCard from "./PostCard";
import type { Post } from "@/types/PostPolls";
import NewsFeedWidget from "./NewsFeedWidget";

interface Props {
  posts: Post[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onDelete: (id: string) => Promise<void>;
  onVote: (postId: string, optionId: string, voterId: string, userName: string) => Promise<void>;
  onLike: (postId: string, userId: string) => void;
  currentUserId: string;
  currentUserName: string; // ← NEW
  onCommentAdded: (postId: string) => void;
  onCommentDeleted: (postId: string) => void;
  
}

export default function PostFeed({
  posts,
  loading,
  hasMore,
  onLoadMore,
  onDelete,
  onVote,
  onLike,
  currentUserId,
  currentUserName, // ← NEW
  onCommentAdded,
  onCommentDeleted,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { rootMargin: "200px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  if (!loading && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center">
          <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 8h10M7 12h6m-6 4h10M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
            />
          </svg>
        </div>
        <p className="text-white/30 text-sm">No posts yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 mx-auto max-w-4xl gap-3 items-start">
      {posts.map((post,index) => (
        <PostCard
          key={index}
          post={post}
          onDelete={onDelete}
          onVote={onVote}
          onLike={onLike}
          currentUserId={currentUserId}
          currentUserName={currentUserName} // ← NEW
          onCommentAdded={onCommentAdded}
          onCommentDeleted={onCommentDeleted}
        />
      ))}

      <NewsFeedWidget />

      <div ref={sentinelRef} />

      {loading && (
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 text-[#C9115F] animate-spin" />
        </div>
      )}
    </div>
  );
}