



// // "use client";

// // import { useEffect, useState } from "react";
// // import PostFeed from "./PostFeed";
// // import FeedTabs from "./Feedtabs";
// // import { usePosts } from "../../../hooks/Useposts";

// // function getVoterId(): string {
// //   if (typeof window === "undefined") return "anon";
// //   let id = sessionStorage.getItem("voterId");
// //   if (!id) {
// //     id = `user_${Math.random().toString(36).slice(2, 10)}`;
// //     sessionStorage.setItem("voterId", id);
// //   }
// //   return id;
// // }

// // export default function SocialFeedSection() {
// //   const { posts, loading, hasMore, fetchPosts, deletePost, votePoll, togglePostLike, error } =
// //     usePosts();
// //   const [voterId] = useState<string>(getVoterId);

// //   useEffect(() => {
// //     fetchPosts(true);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   const handleTabChange = (tabId: string) => {
// //     // Re-fetch or filter posts based on tab if needed
// //     // fetchPosts(true, { filter: tabId });
// //     console.log("Active tab:", tabId);
// //   };

// //   const handleCommentAdded = async (..._args: any[]) => {};
// //   const handleCommentDeleted = async (..._args: any[]) => {};

// //   return (
// //     <section className="w-full">
// //       {/* Tab Navigation */}
// //       <FeedTabs onChange={handleTabChange} />

// //       {error && (
// //         <div className="mb-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
// //           {error}
// //         </div>
// //       )}

// //       <PostFeed
// //         posts={posts}
// //         loading={loading}
// //         hasMore={hasMore}
// //         onLoadMore={() => fetchPosts(false)}
// //         onDelete={deletePost}
// //         onVote={votePoll}
// //         onLike={togglePostLike}
// //         onCommentAdded={handleCommentAdded}
// //         onCommentDeleted={handleCommentDeleted}
// //         currentUserId={voterId}
// //       />
// //     </section>
// //   );
// // }




// "use client";

// import { useEffect, useState } from "react";
// import PostFeed from "./PostFeed";
// import FeedTabs from "./Feedtabs";
// import { usePosts } from "../../../hooks/Useposts";
// import { useAuth } from "@/context/AuthContext";

// function getVoterId(): string {
//   if (typeof window === "undefined") return "anon";
//   let id = sessionStorage.getItem("voterId");
//   if (!id) {
//     id = `user_${Math.random().toString(36).slice(2, 10)}`;
//     sessionStorage.setItem("voterId", id);
//   }
//   return id;
// }

// export default function SocialFeedSection() {
//   const { posts, loading, hasMore, fetchPosts, deletePost, votePoll, togglePostLike, error } =
//     usePosts();
//   const { user, getUserDisplayName } = useAuth();
//   const [voterId] = useState<string>(getVoterId);
//   const currentUserName = user ? getUserDisplayName() : "Anonymous";

//   useEffect(() => {
//     fetchPosts(true);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleTabChange = (tabId: string) => {
//     console.log("Active tab:", tabId);
//   };

//   const handleCommentAdded = (postId: string) => {
//     console.log("Comment added to post:", postId);
//   };

//   const handleCommentDeleted = (postId: string) => {
//     console.log("Comment deleted from post:", postId);
//   };

//   return (
//     <section className="w-full">
//       <FeedTabs onChange={handleTabChange} />

//       {error && (
//         <div className="mb-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
//           {error}
//         </div>
//       )}

//       <PostFeed
//         posts={posts}
//         loading={loading}
//         hasMore={hasMore}
//         onLoadMore={() => fetchPosts(false)}
//         onDelete={deletePost}
//         onVote={votePoll}
//         onLike={togglePostLike}
//         onCommentAdded={handleCommentAdded}
//         onCommentDeleted={handleCommentDeleted}
//         currentUserId={voterId}
//         currentUserName={currentUserName}
//       />
//     </section>
//   );
// }





// SocialFeedSection.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PostFeed from "./PostFeed";
import FeedTabs from "./Feedtabs";
import { usePosts } from "../../../hooks/Useposts";
import { useAuth } from "@/context/AuthContext";
import type { Post } from "@/types/PostPolls";

type ReactionId = "like" | "love" | "haha" | "wow" | "sad" | "angry";

const REACTION_LABELS: Record<ReactionId, string> = {
  like: "liked",
  love: "loved",
  haha: "laughed at",
  wow: "reacted wow to",
  sad: "reacted sad to",
  angry: "reacted angry to",
};

async function sendNotification(payload: {
  recipientEmail: string;
  type: string;
  message: string;
}) {
  try {
    await axios.post("/api/notifications", {
      ...payload,
      isRead: false,
    });
  } catch (err) {
    // Notifications are best-effort — never block the UI action
    console.error("Failed to send notification:", err);
  }
}

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
  const { user, getUserDisplayName } = useAuth();
  const [voterId] = useState<string>(getVoterId);
  const currentUserName = user ? getUserDisplayName() : "Anonymous";

  // Keep a ref-like map of posts for notification lookup (post owner's email)
  const [postMap, setPostMap] = useState<Record<string, Post>>({});
  useEffect(() => {
    setPostMap((prev) => {
      const next = { ...prev };
      posts.forEach((p) => { if (p.id) next[p.id] = p; });
      return next;
    });
  }, [posts]);

  useEffect(() => { fetchPosts(true); }, []); // eslint-disable-line

  const handleTabChange = (tabId: string) => console.log("Active tab:", tabId);

  // ── Like handler — also fires notification ─────────────────────────────────
  const handleLike = useCallback(
    (postId: string, userId: string, reaction?: ReactionId) => {
      togglePostLike(postId, userId, reaction);

      if (!reaction) return; // user is un-liking — no notification

      const post = postMap[postId];
        console.log("[notif debug] post:", post?.userEmail, "currentUser:", user?.email);
      if (!post) return;

      const postOwnerEmail = post.userEmail; // ensure your Post type has userEmail
      if (!postOwnerEmail) return;
      if (postOwnerEmail === user?.email) return; // don't notify yourself

      const verb = REACTION_LABELS[reaction] ?? "reacted to";
      sendNotification({
        recipientEmail: postOwnerEmail,
        type: "post_reaction",
        message: `${currentUserName} ${verb} your post`,
      });
    },
    [togglePostLike, postMap, user, currentUserName]
  );

  // ── Comment handler — also fires notification ──────────────────────────────
  const handleCommentAdded = useCallback(
    (postId: string) => {
      const post = postMap[postId];
      if (!post) return;

      const postOwnerEmail = post.userEmail;
      if (!postOwnerEmail) return;
      if (postOwnerEmail === user?.email) return;

      sendNotification({
        recipientEmail: postOwnerEmail,
        type: "post_comment",
        message: `${currentUserName} commented on your post`,
      });
    },
    [postMap, user, currentUserName]
  );

  const handleCommentDeleted = useCallback(
    (postId: string) => console.log("Comment deleted from post:", postId),
    []
  );

  return (
    <section className="w-full">
      {/* <FeedTabs onChange={handleTabChange} /> */}
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
        onLike={handleLike}
        onCommentAdded={handleCommentAdded}
        onCommentDeleted={handleCommentDeleted}
        currentUserId={voterId}
        currentUserName={currentUserName}
      />
    </section>
  );
}