


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
  onRepost: (postId: string) => Promise<void>;
  onQuoteRepost: (postId: string, quoteText: string) => Promise<void>;
  currentUserId: string;
  currentUserName: string;
  onCommentAdded: (postId: string) => void;
  onCommentDeleted: (postId: string) => void;
  postMap?: Record<string, Post>;
  filterType?: "top" | "recent";
  onFilterChange?: (filterType: "top" | "recent") => void;
}

export default function PostFeed({
  posts,
  loading,
  hasMore,
  onLoadMore,
  onDelete,
  onVote,
  onLike,
  onRepost,
  onQuoteRepost,
  currentUserId,
  currentUserName,
  onCommentAdded,
  onCommentDeleted,
  postMap,
  filterType = "recent",
  onFilterChange,
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
      {/* Filter Bar */}
      <div className="flex gap-2 px-4 py-3  rounded-lg ml-auto">
        <button
          onClick={() => onFilterChange?.("recent")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterType === "recent"
              ? "bg-[#C9115F] text-white text-[10px] lg:text-[15px]"
              : "bg-white/10 text-white/70 text-[10px] lg:text-[15px] hover:bg-white/20"
          }`}
        >
          Recent
        </button>
        <button
          onClick={() => onFilterChange?.("top")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterType === "top"
              ? "bg-[#C9115F] text-[10px] lg:text-[15px] text-white"
              : "bg-white/10 text-white/70 text-[10px] lg:text-[15px] hover:bg-white/20"
          }`}
        >
          Top
        </button>
      </div>

      {posts.map((post, index) => (
        <PostCard
          key={post.id ?? index}
          post={post}
          postMap={postMap}
          onDelete={onDelete}
          onVote={onVote}
          onLike={onLike}
          onRepost={onRepost}
          onQuoteRepost={onQuoteRepost}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
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