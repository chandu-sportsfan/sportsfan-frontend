"use client";

import { useState } from "react";

type CommentItem = {
  id: string;
  user: string;
  initials: string;
  postedAt: string;
  text: string;
};

const defaultComments: CommentItem[] = [
  {
    id: "c1",
    user: "Ayush",
    initials: "A",
    postedAt: "2m ago",
    text: "Nulla quis nunc eget odio eleifend convallis non non odio.",
  },
  {
    id: "c2",
    user: "Ayush",
    initials: "A",
    postedAt: "6m ago",
    text: "Nulla quis nunc eget odio eleifend convallis non non odio.",
  },
  {
    id: "c3",
    user: "Ayush",
    initials: "A",
    postedAt: "10m ago",
    text: "Nulla quis nunc eget odio eleifend convallis non non odio.",
  },
];

interface CommentsSectionProps {
  className?: string;
  heading?: string;
  initialComments?: CommentItem[];
}

export default function CommentsSection({
  className = "",
  heading = "Comments",
  initialComments = defaultComments,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [commentText, setCommentText] = useState("");

  const addComment = () => {
    const text = commentText.trim();
    if (!text) return;

    setComments((prev) => [
      {
        id: `c${Date.now()}`,
        user: "You",
        initials: "Y",
        postedAt: "Just now",
        text,
      },
      ...prev,
    ]);
    setCommentText("");
  };

  return (
    <section className={`mt-5 rounded-[24px] border border-[#26262b] bg-[#0b0b0d] px-4 py-4 ${className}`.trim()}>
      <div className="mb-4">
        <h2 className="text-white text-[18px] font-medium leading-none">{heading}</h2>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3">
            <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 flex items-center justify-center text-white text-[11px] font-semibold">
              {comment.initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-semibold text-[#9f9f9f]">{comment.user}</span>
                <button type="button" className="text-[#8a8a8a] text-[18px] leading-none" aria-label="More options">
                  ⋮
                </button>
              </div>
              <p className="mt-1 text-[13px] leading-snug text-white/90 break-words">{comment.text}</p>
              <p className="mt-1 text-[11px] text-[#6f6f74]">{comment.postedAt}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-full bg-[#242427] px-4 py-2.5">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addComment();
          }}
          placeholder="Add a comment"
          className="flex-1 bg-transparent text-[14px] text-white placeholder:text-[#7f7f84] outline-none"
        />
        <button
          type="button"
          onClick={addComment}
          className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-pink-500 via-pink-600 to-orange-500 flex items-center justify-center text-white shadow-[0_8px_24px_rgba(224,24,90,0.35)]"
          aria-label="Post comment"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M6 11l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}