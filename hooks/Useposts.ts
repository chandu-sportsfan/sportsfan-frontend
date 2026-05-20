"use client";

import { useState, useCallback, useEffect } from "react";
import type { Post, CreatePostPayload } from "@/types/PostPolls";
import axios from "axios";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<{
    lastDocId: string;
    lastDocCreatedAt: number;
  } | null>(null);

  const fetchPosts = useCallback(
    async (reset = false) => {
      setLoading(true);
      setError(null);
      try {
        const cursor =
          !reset && nextCursor
            ? `&lastDocId=${nextCursor.lastDocId}&lastDocCreatedAt=${nextCursor.lastDocCreatedAt}`
            : "";
        const res = await axios.get(`/api/createpost?limit=10${cursor}`);
        const json = res.data;
        if (!json.success) throw new Error(json.error);

        setPosts((prev) => (reset ? json.posts : [...prev, ...json.posts]));
        setHasMore(json.pagination.hasMore);
        setNextCursor(json.pagination.nextCursor);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    },
    [nextCursor]
  );

    useEffect(() => {
    fetchPosts(true);
  }, []);


  // In usePosts hook, modify the createPost function:
const createPost = useCallback(
  async (formData: FormData, userId: string, userName: string, userEmail?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/createpost", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const json = res.data;
      if (!json.success) throw new Error(json.error);

      const newPost = json.data as Post;
      setPosts((prev) => [newPost, ...prev]);

      // Award points
      try {
        if (newPost.id) {
          await awardPostPoints(userId, userName, userEmail, newPost.id);
        }
      } catch (pointsErr) {
        console.warn("[usePosts] Failed to award points:", pointsErr);
      }

      return newPost;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create post";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  },
  []
);

  const deletePost = useCallback(async (id: string) => {
    try {
      const res = await axios.delete(`/api/createpost/${id}`);
      const json = res.data;
      if (!json.success) throw new Error(json.error);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete post";
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const votePoll = useCallback(
    async (postId: string, optionId: string, voterId: string) => {
      try {
        const res = await axios.post(`/api/createpost/polls/${postId}/vote`, {
          optionId,
          voterId,
        });
        const json = res.data;
        if (!json.success) throw new Error(json.error);
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? (json.data as Post) : p))
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to cast vote";
        setError(msg);
        throw new Error(msg);
      }
    },
    []
  );

  // ── Like a post (one per user) ────────────────────────────────────────────
  const togglePostLike = useCallback(async (postId: string, userId: string) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const likedBy: string[] = p.likedBy || [];
        const alreadyLiked = likedBy.includes(userId);
        return {
          ...p,
          likes: (p.likes || 0) + (alreadyLiked ? -1 : 1),
          likedBy: alreadyLiked
            ? likedBy.filter((id) => id !== userId)
            : [...likedBy, userId],
        };
      })
    );

    try {
      const post = posts.find((p) => p.id === postId);
      const alreadyLiked = post?.likedBy?.includes(userId);
      await axios.put(`/api/createpost/${postId}/like`, {
        userId,
        action: alreadyLiked ? "unlike" : "like",
      });
    } catch (err) {
      // Revert optimistic update on failure
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          const likedBy: string[] = p.likedBy || [];
          const wasLiked = likedBy.includes(userId);
          return {
            ...p,
            likes: (p.likes || 0) + (wasLiked ? -1 : 1),
            likedBy: wasLiked
              ? likedBy.filter((id) => id !== userId)
              : [...likedBy, userId],
          };
        })
      );
      console.error("[usePosts] Like failed:", err);
    }
  }, [posts]);

  return {
    posts,
    loading,
    error,
    hasMore,
    fetchPosts,
    createPost,
    deletePost,
    votePoll,
    togglePostLike,
  };
}

// ─── Award 12 points for creating a post ─────────────────────────────────────
// Calls the same awardUserPoints utility via a lightweight API route.
// The transactionId is deterministic so double-submits are safe.
async function awardPostPoints(
  userId: string,
  userName: string,
  userEmail: string | undefined,
  postId: string
) {
  await axios.post("/api/user-points", {
    actualUserId: userId,
    userName,
    userEmail: userEmail || "",
    points: 12,
    reason: "CREATE_POST",
    transactionId: `${userId}_${postId}_CREATE_POST`,
    metadata: { postId },
  });
}