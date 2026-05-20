



// "use client";

// import { useEffect, useState } from "react";
// import PostFeed from "./PostFeed";
// import FeedTabs from "./Feedtabs";
// import { usePosts } from "../../../hooks/Useposts";

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
//   const [voterId] = useState<string>(getVoterId);

//   useEffect(() => {
//     fetchPosts(true);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const handleTabChange = (tabId: string) => {
//     // Re-fetch or filter posts based on tab if needed
//     // fetchPosts(true, { filter: tabId });
//     console.log("Active tab:", tabId);
//   };

//   const handleCommentAdded = async (..._args: any[]) => {};
//   const handleCommentDeleted = async (..._args: any[]) => {};

//   return (
//     <section className="w-full">
//       {/* Tab Navigation */}
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
//       />
//     </section>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import PostFeed from "./PostFeed";
import FeedTabs from "./Feedtabs";
import { usePosts } from "../../../hooks/Useposts";
import { useAuth } from "@/context/AuthContext";

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

  useEffect(() => {
    fetchPosts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (tabId: string) => {
    console.log("Active tab:", tabId);
  };

  const handleCommentAdded = (postId: string) => {
    console.log("Comment added to post:", postId);
  };

  const handleCommentDeleted = (postId: string) => {
    console.log("Comment deleted from post:", postId);
  };

  return (
    <section className="w-full">
      <FeedTabs onChange={handleTabChange} />

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
        onCommentAdded={handleCommentAdded}
        onCommentDeleted={handleCommentDeleted}
        currentUserId={voterId}
        currentUserName={currentUserName}
      />
    </section>
  );
}