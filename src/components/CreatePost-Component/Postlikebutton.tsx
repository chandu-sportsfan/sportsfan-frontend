"use client";

import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Props {
  postId: string;
  likes: number;
  likedBy: string[];
  onToggle: (postId: string, userId: string) => void;
}

export default function PostLikeButton({ postId, likes, likedBy, onToggle }: Props) {
  const { user } = useAuth();
  const userId = user?.userId || user?.email || "";
  const isLiked = !!userId && likedBy?.includes(userId);

  const handleClick = () => {
    if (!userId) return; // require auth
    onToggle(postId, userId);
  };

  return (
    <button
      onClick={handleClick}
      disabled={!userId}
      className={`flex items-center gap-1.5 text-sm transition-all duration-200 active:scale-90 ${
        isLiked
          ? "text-[#C9115F]"
          : "text-white/40 hover:text-white/70"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
      title={isLiked ? "Unlike" : "Like"}
    >
      <Heart
        className="w-4 h-4 transition-transform duration-150"
        fill={isLiked ? "currentColor" : "none"}
        style={{ transform: isLiked ? "scale(1.15)" : "scale(1)" }}
      />
      {likes > 0 && <span className="tabular-nums">{likes}</span>}
    </button>
  );
}