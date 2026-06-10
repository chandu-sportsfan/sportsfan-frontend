import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AvatarWithBadge from "./AvatarWithBadge";
import { SplitBar } from "./shared";
import { clamp } from "../utils";

interface Props {
  post: any;
  onClose: () => void;
  onToast: (m: string) => void;
  onVote: (id: string, vote: "agree" | "disagree" | null) => void;
}

export default function PostDetailsOverlay({ post, onClose, onToast, onVote }: Props) {
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [userUsername, setUserUsername] = useState("RoarUser");
  const [userBadge, setUserBadge] = useState("RISING_FAN");
  const [votes, setVotes] = useState<Record<string, boolean | null>>(() =>
    post.userVote ? { [post.id]: post.userVote === "agree" } : {},
  );
  const [pct, setPct] = useState(post.agreePercent ?? 50);

  useEffect(() => {
    try {
      setUserUsername(localStorage.getItem("roar_username") || "RoarUser");
      setUserBadge(localStorage.getItem("roar_badge") || "RISING_FAN");
    } catch {}
  }, []);

  const fetchComments = useCallback(async () => {
    if (!post?.id) return;
    try {
      if (!post.isDbPost) {
        setComments([
          { commentId: "c1", authorUsername: "KolkataKnight07", authorBadge: "CRICKET_HEAD", text: "IPL crowds are great, but nothing matches the tension of a bilateral series in Test cricket.", heartCount: 50, createdAt: Date.now() - 14400000 },
          { commentId: "c2", authorUsername: "NagpurNight", authorBadge: "ORACLE", text: "@KolkataKnight07 Unpopular but 100% correct. Test cricket is where reputations are truly made.", heartCount: 16, createdAt: Date.now() - 10800000 },
        ]);
        return;
      }
      const res = await axios.get(`/api/roar/posts/${post.id}/comments`);
      if (res.data?.success) setComments(res.data.comments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  }, [post]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const submitComment = async () => {
    if (!commentText.trim()) return;
    try {
      setLoading(true);
      if (!post.isDbPost) {
        setComments((prev) => [...prev, { commentId: `c-${Date.now()}`, authorUsername: userUsername, authorBadge: userBadge, text: commentText.trim(), heartCount: 0, createdAt: Date.now() }]);
        setCommentText("");
        onToast("Comment posted!");
        return;
      }
      const res = await axios.post(`/api/roar/posts/${post.id}/comments`, { text: commentText.trim() });
      if (res.data?.success) { setCommentText(""); fetchComments(); onToast("Comment posted successfully!"); }
    } catch (err) {
      console.error("Failed to submit comment:", err);
      onToast("Error posting comment");
    } finally {
      setLoading(false);
    }
  };

  const reactToComment = async (commentId: string) => {
    try {
      if (!post.isDbPost) {
        setComments((prev) => prev.map((c) => c.commentId === commentId ? { ...c, heartCount: c.heartCount + 1 } : c));
        return;
      }
      const res = await axios.post(`/api/roar/posts/${post.id}/comments/${commentId}/react`);
      if (res.data?.success) setComments((prev) => prev.map((c) => c.commentId === commentId ? { ...c, heartCount: res.data.heartCount } : c));
    } catch (err) {
      console.error("Failed to react to comment:", err);
    }
  };

  const userVote = votes[post.id];

  const handleVoteClick = (agree: boolean) => {
    const prev = votes[post.id];
    let nextVote: boolean | null = agree;
    if (prev === agree) nextVote = null;
    setVotes((v) => ({ ...v, [post.id]: nextVote }));

    let delta = 0;
    if (post.userVote === "agree") {
      if (nextVote === true) delta = 0;
      else if (nextVote === false) delta = -8;
      else delta = -4;
    } else if (post.userVote === "disagree") {
      if (nextVote === true) delta = 8;
      else if (nextVote === false) delta = 0;
      else delta = 4;
    } else {
      if (nextVote === true) delta = 4;
      else if (nextVote === false) delta = -4;
      else delta = 0;
    }

    setPct(clamp(post.agreePercent + delta, 1, 99));
    onVote(post.id, nextVote === true ? "agree" : nextVote === false ? "disagree" : null);
  };

  const headerTitle = post.text.length > 40 ? post.text.slice(0, 40) + "..." : post.text;

  return (
    <AnimatePresence>
      <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "rgba(5, 5, 8, 0.95)", backdropFilter: "blur(10px)", zIndex: 10 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "white", fontSize: 18, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 12, fontWeight: 700, color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "0.03em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {headerTitle}
            </h2>
            <p style={{ fontSize: 9, color: "var(--text-secondary)", margin: "2px 0 0" }}>
              Posted by {post.fan?.username || post.authorUsername} • {post.timeAgo || "2h ago"} • {comments.length} comments
            </p>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", background: "linear-gradient(to bottom, #050508, #0b0b12)" }}>
          {/* Main post card */}
          <div className="glass-card" style={{ padding: "16px", marginBottom: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <AvatarWithBadge username={post.fan?.username || post.authorUsername} badge={post.fan?.badge || post.authorBadge} size="sm" />
              <div>
                <p style={{ fontWeight: 700, fontSize: 13, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                  {post.fan?.username || post.authorUsername}
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E676", display: "inline-block" }} />
                </p>
                <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: 0 }}>{post.timeAgo || "2h ago"}</p>
              </div>
            </div>
            <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.5, marginBottom: 12, color: "white" }}>{post.text}</p>
            {post.mediaUrls && post.mediaUrls.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                {post.mediaUrls.map((url: string, idx: number) => {
                  const isVideo = url.endsWith(".mp4") || url.includes("/video/upload/");
                  if (isVideo) {
                    return (
                      <video
                        key={idx}
                        src={url}
                        controls
                        style={{ width: "100%", maxHeight: 300, borderRadius: 12, objectFit: "cover" }}
                      />
                    );
                  }
                  return (
                    <img
                      key={idx}
                      src={url}
                      alt="Post Media"
                      style={{ width: "100%", maxHeight: 300, borderRadius: 12, objectFit: "cover" }}
                    />
                  );
                })}
              </div>
            )}
            {post.type === "hot_take" && (
              <>
                <div style={{ marginBottom: 10 }}><SplitBar left={pct} /></div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  {[
                    { agree: true, label: "Agree", active: userVote === true, color: "var(--accent-magenta)" },
                    { agree: false, label: "Disagree", active: userVote === false, color: "var(--accent-orange)" },
                  ].map(({ agree, label, active, color }) => (
                    <button
                      key={label}
                      onClick={() => handleVoteClick(agree)}
                      style={{ flex: 1, padding: "10px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer", border: `2px solid ${active ? color : `${color}59`}`, background: active ? color : "transparent", color: active ? "white" : color, transition: "all 0.2s" }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Comments heading */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "white", letterSpacing: "0.06em", textTransform: "uppercase" }}>Comments</span>
            <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>{comments.length} total responses</span>
          </div>

          {/* Comments list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 80 }}>
            {comments.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>No comments yet. Be the first to share your opinion!</p>
            ) : (
              comments.map((comment) => {
                const isReply = comment.text.trim().startsWith("@");
                return (
                  <div
                    key={comment.commentId}
                    style={{ position: "relative", marginLeft: isReply ? 24 : 0, padding: "12px 14px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    {isReply && (
                      <div style={{ position: "absolute", left: -14, top: -12, bottom: "50%", width: 12, borderLeft: "1.5px solid rgba(255,255,255,0.12)", borderBottom: "1.5px solid rgba(255,255,255,0.12)", borderRadius: "0 0 0 8px", pointerEvents: "none" }} />
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <AvatarWithBadge username={comment.authorUsername} badge={comment.authorBadge} size="sm" />
                        <p style={{ fontWeight: 700, fontSize: 12, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                          {comment.authorUsername}
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#E91E8C", display: "inline-block" }} />
                        </p>
                      </div>
                      <span style={{ fontSize: 9, color: "var(--text-muted)" }}>{comment.createdAt ? "4h ago" : "Just now"}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.4, margin: "4px 0" }}>{comment.text}</p>
                    <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 4 }}>
                      <button
                        onClick={() => reactToComment(comment.commentId)}
                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: comment.heartCount > 0 ? "white" : "var(--text-muted)", padding: 0, transition: "all 0.2s" }}
                      >
                        🤍 {comment.heartCount ?? 0}
                      </button>
                      <button
                        onClick={() => setCommentText(`@${comment.authorUsername} `)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, padding: 0 }}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom composer */}
        <div style={{ padding: "12px 20px 24px", background: "rgba(5, 5, 8, 0.95)", borderTop: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "center", zIndex: 10 }}>
          <AvatarWithBadge username={userUsername} badge={userBadge} size="sm" />
          <input
            type="text"
            placeholder="Share your opinion.."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && submitComment()}
            style={{ flex: 1, height: 40, borderRadius: 20, background: "var(--bg-secondary)", border: "1px solid var(--border)", paddingLeft: 16, paddingRight: 16, color: "white", fontSize: 13, outline: "none" }}
          />
          <button
            onClick={submitComment}
            disabled={loading || !commentText.trim()}
            style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--accent-magenta)", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: commentText.trim() ? 1 : 0.5 }}
          >
            ↑
          </button>
        </div>
      </div>
    </AnimatePresence>
  );
}
