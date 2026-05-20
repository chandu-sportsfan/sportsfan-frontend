"use client";

import { useEffect, useState } from "react";
import PostFeed from "./PostFeed";
import { usePosts } from "../../../hooks/Useposts";

// A stable anonymous voter ID stored in sessionStorage so votes persist per tab
function getVoterId(): string {
  if (typeof window === "undefined") return "anon";
  let id = sessionStorage.getItem("voterId");
  if (!id) {
    id = `user_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem("voterId", id);
  }
  return id;
}

export default function SocialFeedSection() {
  const { posts, loading, hasMore, fetchPosts, deletePost, votePoll, togglePostLike, error } =
    usePosts();
  const [voterId] = useState<string>(getVoterId);

  useEffect(() => {
    fetchPosts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-lg tracking-tight">Fan Posts</h2>
        {loading && posts.length === 0 && (
          <span className="text-white/30 text-xs">Loading…</span>
        )}
      </div>

      {error && (
        <div className="mb-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <PostFeed
        posts={posts}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={() => fetchPosts(false)}
        onDelete={deletePost}
        onVote={votePoll}
        onLike={togglePostLike}
        currentUserId={voterId}
      />
    </section>
  );
}