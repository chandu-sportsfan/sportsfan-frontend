import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import AvatarWithBadge from "../components/AvatarWithBadge";
import NewHomePage from "../../NewHomePageComponent/newhomepage";
import { SplitBar, FilterPills } from "../components/shared";
import { FEED_POSTS, FEED_FILTERS, BADGE_LABELS, RADIAL_OPTS, CURRENT_USER } from "../constants";
import { fmt, clamp, formatTimeAgo } from "../utils";
import { Heart, Share2, Flame, TrendingUp, Zap, History, PenTool, MessageSquare, Trash2 } from "lucide-react";
import type { FeedPost, Room } from "../types";

type ShareableRoarPost = {
  id?: string | number;
  text?: string;
  authorUsername?: string;
  fan?: {
    username?: string;
  };
};

const buildRoarPostShareUrl = (post: ShareableRoarPost) => {
  if (typeof window === "undefined") return "";
  const targetUrl = new URL(`${window.location.origin}/MainModules/ROAR`);
  if (post?.id) targetUrl.searchParams.set("post", String(post.id));
  return targetUrl.toString();
};

const buildRoarPostShareText = (post: ShareableRoarPost) => {
  const shareUrl = buildRoarPostShareUrl(post);
  const author = post?.fan?.username || post?.authorUsername || "a Sportsfan";
  return [
    `Check out this ROAR post by ${author}`,
    post?.text || "Join the conversation on Sportsfan ROAR.",
    `View post: ${shareUrl}`,
  ].filter(Boolean).join("\n");
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const input = document.createElement("textarea");
      input.value = text;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.focus();
      input.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(input);
      return ok;
    } catch {
      return false;
    }
  }
};

interface Props {
  // ── unreadCount and onNavigateAlerts REMOVED ──
  // Notifications now live in the global bell (Header). No separate ROAR bell needed.
  onJoinRoom: (room?: any) => void;
  onLeaderboard: () => void;
  onFanProfile: () => void;
  onToast: (m: string) => void;
  extraItems: any[];
  showBanner: boolean;
  onDismissBanner: () => void;
  userBadge: string;
  rooms?: Room[];
  dbPosts?: any[];
  onPostClick?: (post: any) => void;
  onVote?: (id: string, vote: "agree" | "disagree" | null) => void;
  onLike?: (id: string) => void;
  onDeletePost?: (id: string) => void;
  userSports?: string[];
  onQuickCompose?: (t: string) => void;
  currentUsername?: string;
  currentAvatarUrl?: string;
}

export default function HomeFeed({
  onJoinRoom,
  onLeaderboard,
  onFanProfile,
  onToast,
  extraItems,
  showBanner,
  onDismissBanner,
  userBadge,
  rooms = [],
  dbPosts = [],
  onPostClick,
  onVote,
  onLike,
  onDeletePost,
  userSports = [],
  onQuickCompose,
  currentUsername: propUsername,
  currentAvatarUrl,
}: Props) {
  const [filter, setFilter] = useState("For You");
  const [votes, setVotes] = useState<Record<string, boolean | null>>({});
  const [pcts, setPcts] = useState<Record<string, number>>({});
  const [now, setNow] = useState(Date.now());
  const [localUsername, setLocalUsername] = useState("RoarUser");
  const [sharePost, setSharePost] = useState<ShareableRoarPost | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState("post");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      setLocalUsername(localStorage.getItem("roar_username") || "RoarUser");
    } catch {}
  }, []);

  const activeUsername = propUsername || localUsername;

  const openShareDialog = (post: ShareableRoarPost) => { setSharePost(post); setCopied(false); };
  const closeShareDialog = () => { setSharePost(null); setCopied(false); };

  const handleShareToWhatsApp = () => {
    if (!sharePost) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(buildRoarPostShareText(sharePost))}`, "_blank");
  };
  const handleShareToThreads = () => {
    if (!sharePost) return;
    window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(buildRoarPostShareText(sharePost))}`, "_blank");
  };
  const handleShareToInstagram = async () => {
    if (!sharePost) return;
    await copyToClipboard(buildRoarPostShareText(sharePost));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
    window.open("https://www.instagram.com/", "_blank");
  };
  const handleShareToLinkedIn = () => {
    if (!sharePost) return;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(buildRoarPostShareUrl(sharePost))}`, "_blank");
  };
  const handleShareToX = () => {
    if (!sharePost) return;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(buildRoarPostShareText(sharePost))}`, "_blank");
  };
  const handleCopyLink = async () => {
    if (!sharePost) return;
    const ok = await copyToClipboard(buildRoarPostShareText(sharePost));
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      onToast("Link copied to clipboard!");
    }
  };

  const shareButtons = (size: string) => (
    <>
      {[
        { handler: handleShareToWhatsApp, src: "/images/share_whatsapp.png", alt: "WhatsApp" },
        { handler: handleShareToThreads, src: "/images/share_thread.png", alt: "Threads" },
        { handler: handleShareToInstagram, src: "/images/share_insta.png", alt: "Instagram" },
        { handler: handleShareToLinkedIn, src: "/images/Share_linkedin.png", alt: "LinkedIn" },
        { handler: handleShareToX, src: "/images/Share_X.png", alt: "X" },
        { handler: handleCopyLink, src: "/images/share_copy_link.png", alt: "Copy" },
      ].map(({ handler, src, alt }) => (
        <button
          key={alt}
          onClick={handler}
          className={`${size} shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center`}
          type="button"
        >
          <Image src={src} alt={alt} width={36} height={36} className="w-full h-full object-cover rounded-full" />
        </button>
      ))}
    </>
  );

  const formatCountdown = (diffMs: number) => {
    const diffSec = Math.floor(diffMs / 1000);
    const secs = diffSec % 60;
    const mins = Math.floor(diffSec / 60) % 60;
    const hrs = Math.floor(diffSec / 3600);
    const pad = (num: number) => String(num).padStart(2, "0");
    if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    return `${pad(mins)}:${pad(secs)}`;
  };

  useEffect(() => {
    if (dbPosts.length > 0) {
      setPcts({});
      const synced: Record<string, boolean | null> = {};
      dbPosts.forEach((p) => {
        if (p.userVote) synced[p.postId] = p.userVote === "agree";
        else synced[p.postId] = null;
      });
      setVotes(synced);
    }
  }, [dbPosts]);

  const vote = (
    id: string,
    agree: boolean,
    initialAgreePercent: number,
    initialUserVote: "agree" | "disagree" | null,
    isDbPost?: boolean,
  ) => {
    const prev = votes[id];
    let nextVote: boolean | null = agree;
    if (prev === agree) nextVote = null;
    setVotes((v) => ({ ...v, [id]: nextVote }));

    let delta = 0;
    if (initialUserVote === "agree") {
      if (nextVote === true) delta = 0;
      else if (nextVote === false) delta = -6;
      else delta = -3;
    } else if (initialUserVote === "disagree") {
      if (nextVote === true) delta = 6;
      else if (nextVote === false) delta = 0;
      else delta = 3;
    } else {
      if (nextVote === true) delta = 3;
      else if (nextVote === false) delta = -3;
      else delta = 0;
    }

    setPcts((p) => ({ ...p, [id]: clamp(initialAgreePercent + delta, 1, 99) }));

    if (isDbPost && onVote) {
      onVote(id, nextVote === true ? "agree" : nextVote === false ? "disagree" : null);
    }
  };

  const renderCardActions = (item: any) => {
    return (
      <div style={{ display: "flex", gap: 16, marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onLike) onLike(item.id);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: item.userLiked ? "#ff4a7d" : "#9494ad",
            fontSize: 13,
            fontWeight: 600,
            transition: "color 0.2s",
          }}
        >
          <Heart size={16} fill={item.userLiked ? "#ff4a7d" : "none"} />
          <span>{item.likeCount || 0}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onPostClick) onPostClick(item);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9494ad",
            fontSize: 13,
            fontWeight: 600,
            transition: "color 0.2s",
          }}
        >
          <MessageSquare size={16} />
          <span>{item.replies || 0}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openShareDialog(item);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9494ad",
            fontSize: 13,
            fontWeight: 600,
            transition: "color 0.2s",
          }}
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>
        {item.fan?.username === activeUsername && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Are you sure you want to delete this post?")) {
                if (onDeletePost) onDeletePost(item.id);
              }
            }}
            title="Delete Post"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#f87171",
              transition: "color 0.2s, transform 0.1s",
              marginLeft: "auto",
              padding: "4px",
              borderRadius: "50%",
            }}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    );
  };

  const mappedDbPosts = dbPosts.map((p) => {
    const agreeCount = p.agreeCount ?? 0;
    const disagreeCount = p.disagreeCount ?? 0;
    const totalVotes = agreeCount + disagreeCount;
    const agreePercent = totalVotes > 0 ? Math.round((agreeCount / totalVotes) * 100) : 50;
    return {
      id: p.postId,
      type: p.type,
      sport: p.sport || "cricket",
      fan: {
        username: p.authorUsername || "RoarUser",
        badge: p.authorBadge || "RISING_FAN",
        team: p.sport === "cricket" ? "India" : "MCFC",
        avatarUrl: p.authorAvatarUrl || p.avatarUrl || (p.authorUsername === activeUsername ? currentAvatarUrl : undefined),
      },
      text: p.text,
      agreePercent,
      fanCount: totalVotes + (p.type === "hot_take" ? 47 : 1240),
      replies: p.replyCount ?? 0,
      following: false,
      isLive: false,
      match: p.matchId || (p.type === "prediction" ? (p.sport === "cricket" ? "IND vs AUS · 3rd Test" : "ISL 2025") : undefined),
      samePredictionCount: p.type === "prediction" ? (p.agreeCount ?? 0) : undefined,
      counterCount: p.type === "prediction" ? (p.disagreeCount ?? 0) : undefined,
      isDbPost: true,
      userVote: p.userVote,
      sideA: p.sideA,
      sideB: p.sideB,
      memCtx: p.memCtx,
      mediaUrls: p.mediaUrls,
      likeCount: p.likeCount ?? 0,
      userLiked: p.userLiked ?? false,
      createdAt: p.createdAt,
    };
  });

  const allPosts = [...mappedDbPosts, ...extraItems, ...FEED_POSTS];
  const filtered = allPosts.filter((p) => {
    if (filter === "For You") {
      if (userSports && userSports.length > 0) return userSports.map((s) => s.toLowerCase()).includes(p.sport?.toLowerCase());
      return true;
    }
    if (filter === "Cricket") return p.sport?.toLowerCase() === "cricket";
    if (filter === "Football") return p.sport?.toLowerCase() === "football";
    if (filter === "Live") return p.isLive || p.type === "match_room";
    if (filter === "Predictions") return p.type === "prediction";
    return true;
  });

  return (
    <div className="screen-scroll">
      {/* Share Dialog */}
      {sharePost && (
        <>
          <button type="button" className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={closeShareDialog} />
          <div className="fixed bottom-16 inset-x-4 z-50 mx-auto w-full max-w-[280px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl lg:hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm font-semibold">Share</p>
              <button type="button" onClick={closeShareDialog} className="text-gray-400 hover:text-white">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 overflow-x-auto">{shareButtons("w-8 h-8")}</div>
            {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
          </div>
          <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/60" onClick={closeShareDialog}>
            <div className="bg-[#1a1a1e] rounded-2xl border border-white/10 p-4 w-[300px] shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm font-semibold">Share ROAR Post</p>
                <button type="button" onClick={closeShareDialog} className="text-gray-400 hover:text-white">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#111114] p-3 mb-3">
                <p className="text-white text-sm font-semibold line-clamp-2">{sharePost.text || "ROAR Post"}</p>
                <p className="text-white/45 text-[11px] mt-2 line-clamp-2 break-all">{buildRoarPostShareUrl(sharePost)}</p>
              </div>
              <div className="flex flex-row flex-nowrap items-center gap-2 mb-2">{shareButtons("w-9 h-9")}</div>
              {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
            </div>
          </div>
        </>
      )}

      {/* SVG Gradient Definition */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <linearGradient id="pink-orange-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e91e8c" />
          <stop offset="100%" stopColor="#ff6b35" />
        </linearGradient>
      </svg>

      {/* ── Sticky Header Section ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "var(--bg-primary)", paddingBottom: 4 }}>
        {/* ── Header ── */}
        <div
          className="glass-card"
          style={{ margin: "8px 12px 0", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12, borderRadius: 20, overflow: "visible", position: "relative", zIndex: 40 }}
        >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flexShrink: 0 }}>
            <h1 className="logotype" style={{ fontSize: 34, margin: 0, lineHeight: 1 }}>ROAR</h1>
            <div style={{ height: "2px", width: "32px", borderRadius: "999px", marginTop: "3px", background: "#e5003d" }} />
          </div>

          <div style={{ position: "relative" }} ref={dropdownRef}>
            {(() => {
              const selectedOption = RADIAL_OPTS.find((q) => q.id === selectedActionId) || RADIAL_OPTS[4];
              const icons: Record<string, React.ReactNode> = {
                hot_take: <Flame size={16} stroke="url(#pink-orange-grad)" fill="url(#pink-orange-grad)" />,
                prediction: <TrendingUp size={16} stroke="url(#pink-orange-grad)" />,
                debate: <Zap size={16} stroke="url(#pink-orange-grad)" fill="url(#pink-orange-grad)" />,
                memory: <History size={16} stroke="url(#pink-orange-grad)" />,
                post: <PenTool size={16} stroke="url(#pink-orange-grad)" />,
              };
              const selectedIcon = icons[selectedOption.id] || <span>{selectedOption.emoji}</span>;

              return (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 16px",
                    borderRadius: 999,
                    background: "linear-gradient(145deg, rgba(233,30,140,0.18), rgba(255,107,53,0.10))",
                    border: "1px solid rgba(233,30,140,0.35)",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
                    backdropFilter: "blur(8px)",
                    color: "rgba(255,255,255,0.9)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {selectedIcon}
                  <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.03em" }}>{selectedOption.label}</span>
                  <span style={{ fontSize: 10, marginLeft: 2, color: "rgba(255,255,255,0.7)" }}>{isDropdownOpen ? "▲" : "▼"}</span>
                </motion.button>
              );
            })()}

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: 8,
                    background: "#121214",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 16,
                    padding: 8,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    minWidth: 180,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
                    zIndex: 30,
                  }}
                >
                  {RADIAL_OPTS.map((q) => {
                    const icons: Record<string, React.ReactNode> = {
                      hot_take: <Flame size={18} color="white" />,
                      prediction: <TrendingUp size={18} color="white" />,
                      debate: <Zap size={18} color="white" />,
                      memory: <History size={18} color="white" />,
                      post: <PenTool size={18} color="white" />,
                    };
                    const icon = icons[q.id] || <span>{q.emoji}</span>;
                    const isActive = q.id === selectedActionId;
                    return (
                      <button
                        key={q.id}
                        onClick={() => {
                          setSelectedActionId(q.id);
                          setIsDropdownOpen(false);
                          if (onQuickCompose) onQuickCompose(q.id);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 12px",
                          borderRadius: 12,
                          background: isActive ? "linear-gradient(145deg, rgba(233,30,140,0.18), rgba(255,107,53,0.10))" : "transparent",
                          border: isActive ? "1px solid rgba(233,30,140,0.35)" : "1px solid transparent",
                          color: "white",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                          else e.currentTarget.style.boxShadow = "0 0 10px rgba(229,0,61,0.2)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.background = "transparent";
                          else e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div style={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: 8, 
                          border: "1px solid rgba(255,255,255,0.1)", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          background: "rgba(255,255,255,0.02)"
                        }}>
                          {icon}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{q.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Onboarding banner */}
      {/* {showBanner && (
        <div style={{ margin: "8px 16px", padding: "10px 14px", borderRadius: 16, background: "var(--bg-tertiary)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", flex: 1 }}>Your feed is personalising. Make a prediction or react to a take.</p>
          <button onClick={onDismissBanner} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", marginLeft: 8 }}>✕</button>
        </div>
      )} */}

        {/* Filters */}
        <div style={{ padding: "10px 16px", overflow: "hidden", position: "relative" }}>
          <FilterPills options={FEED_FILTERS} active={filter} onChange={setFilter} />
        </div>
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 14 }}>
        <NewHomePage sportFilter={filter === "Cricket" ? "cricket" : filter === "Football" ? "football" : undefined} />

        {/* Live room banners */}
        {rooms
          .filter((r) => r.roomId !== "mock-cricket" && r.roomId !== "mock-football")
          .map((room, idx) => {
            const showThisRoom =
              filter === "Live" ||
              //(filter === "For You" && (userSports.length === 0 || userSports.includes(room.sport?.toLowerCase()))) ||
              (filter === "For You" && (userSports.length === 0 || userSports.includes(room.sport?.toLowerCase() ?? ''))) ||
              (filter === "Cricket" && room.sport?.toLowerCase() === "cricket") ||
              (filter === "Football" && room.sport?.toLowerCase() === "football");
            if (!showThisRoom) return null;
            const isFuture = room.scheduledStartTime && room.scheduledStartTime > now;
            const diff = isFuture && room.scheduledStartTime ? room.scheduledStartTime - now : 0;

            const isBlueStyle = room.sport?.toLowerCase() === "football" || idx % 2 === 1;
            const bg = isBlueStyle ? "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(59,130,246,0.04))" : "linear-gradient(135deg,rgba(233,30,140,0.12),rgba(255,107,53,0.06))";
            const border = isBlueStyle ? "1px solid rgba(59,130,246,0.25)" : "1px solid rgba(233,30,140,0.25)";
            const livePulseBg = isFuture ? "var(--accent-orange)" : (isBlueStyle ? "#60a5fa" : "var(--live-green)");
            const liveTextCol = isFuture ? "var(--accent-orange)" : (isBlueStyle ? "#60a5fa" : "var(--live-green)");
            const liveLabel = isFuture ? "STARTS IN" : "LIVE NOW";

            return (
              <motion.div
                key={room.roomId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ padding: 16, background: bg, border, cursor: isFuture ? "default" : "pointer" }}
                onClick={() => { if (!isFuture) onJoinRoom(room); else onToast("This discussion room hasn't started yet."); }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span className={isFuture ? undefined : "live-pulse"} style={{ width: 8, height: 8, borderRadius: "50%", background: livePulseBg, display: "inline-block" }} />
                      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: liveTextCol }}>{liveLabel}</span>
                    </div>
                    <p className="font-display" style={{ fontSize: isBlueStyle ? 22 : 26, lineHeight: 1 }}>{room.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{room.description || "Discussion Show"}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p className="font-display" style={{ fontSize: isBlueStyle ? 28 : 30, color: "white" }}>{isFuture ? "SOON" : "LIVE"}</p>
                    <p style={{ fontSize: 11, color: isBlueStyle ? "#60a5fa" : "var(--text-muted)" }}>{isFuture ? "Scheduled" : "Active Now"}</p>
                  </div>
                </div>
                {isFuture ? (
                  <button
                    disabled
                    style={{ width: "100%", marginTop: 12, padding: "10px 0", borderRadius: 999, fontSize: 13, border: "1px solid rgba(255,255,255,0.08)", cursor: "not-allowed", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)", fontWeight: 800, letterSpacing: "0.06em" }}
                  >
                    STARTS IN {formatCountdown(diff)}
                  </button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => { e.stopPropagation(); onJoinRoom(room); }}
                    className={isBlueStyle ? undefined : "btn-gradient"}
                    style={{ width: "100%", marginTop: 12, padding: "10px 0", borderRadius: 999, fontSize: 13, border: "none", cursor: "pointer", background: isBlueStyle ? "#3b82f6" : undefined, color: "white", fontWeight: 800, fontFamily: isBlueStyle ? "'Bebas Neue',sans-serif" : undefined, letterSpacing: isBlueStyle ? "0.06em" : undefined }}
                  >
                    JOIN LIVE · {room.fanCount || 0} fans →
                  </motion.button>
                )}
              </motion.div>
            );
          })}

        {/* Feed posts */}
        {filtered.map((item, i) => {
          if (item.type === "hot_take" || item.type === "prediction" || item.type === "post") {
            const pct = pcts[item.id] ?? item.agreePercent ?? 50;
            const userVote = votes[item.id];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card"
                style={{ padding: "16px", cursor: "pointer" }}
                onClick={() => onPostClick && onPostClick(item)}
              >
                {/* Type + sport badges */}
                <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      padding: "3px 8px",
                      borderRadius: 4,
                      background:
                        item.type === "hot_take"
                          ? "rgba(239,68,68,0.12)"
                          : item.type === "post"
                            ? "rgba(233,30,140,0.12)"
                            : "rgba(255,107,53,0.12)",
                      color:
                        item.type === "hot_take"
                          ? "#f87171"
                          : item.type === "post"
                            ? "var(--accent-magenta)"
                            : "var(--accent-orange)",
                      border: `1px solid ${
                        item.type === "hot_take"
                          ? "rgba(239,68,68,0.2)"
                          : item.type === "post"
                            ? "rgba(233,30,140,0.2)"
                            : "rgba(255,107,53,0.2)"
                      }`,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.type === "hot_take"
                      ? "🔥 Hot Take"
                      : item.type === "post"
                        ? "✏️ Post"
                        : "📊 Prediction"}
                  </span>
                  {item.type !== "post" && (
                    <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: item.sport === "cricket" ? "rgba(34,197,94,0.1)" : "rgba(59,130,246,0.1)", color: item.sport === "cricket" ? "#22c55e" : "#60a5fa", border: `1px solid ${item.sport === "cricket" ? "rgba(34,197,94,0.2)" : "rgba(59,130,246,0.2)"}`, textTransform: "uppercase" }}>
                      {item.sport === "cricket" ? "🏏 Cricket" : "⚽ Football"}
                    </span>
                  )}
                  {item.following && <span style={{ marginLeft: "auto", fontSize: 9, padding: "3px 8px", borderRadius: 999, background: "rgba(233,30,140,0.15)", color: "var(--accent-magenta)" }}>Following</span>}
                </div>

                {/* Author */}
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                  <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" avatarUrl={item.fan.avatarUrl} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p>
                    <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} · {item.fan.team} • {formatTimeAgo(item.createdAt)}</p>
                  </div>
                </div>

                <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.5, marginBottom: 12 }}>{item.text}</p>
                {item.mediaUrls && item.mediaUrls.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                    {item.mediaUrls.map((url: string, idx: number) => {
                      const isVideo = url.endsWith(".mp4") || url.includes("/video/upload/");
                      if (isVideo) {
                        return (
                          <video
                            key={idx}
                            src={url}
                            controls
                            style={{ width: "100%", maxHeight: 300, borderRadius: 12, objectFit: "cover" }}
                            onClick={(e) => e.stopPropagation()}
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
                {item.match && <p style={{ fontSize: 11, color: "var(--accent-magenta)", marginBottom: 8, fontWeight: 600 }}>{item.match}</p>}

                {item.type === "hot_take" && (
                  <>
                    <div style={{ marginBottom: 10 }}><SplitBar left={pct} /></div>
                    <p style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, marginBottom: 12 }}>{fmt(item.fanCount ?? 0)} fans · {item.replies ?? 0} replies</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[
                        { agree: true, label: "Agree", active: userVote === true, color: "var(--accent-magenta)" },
                        { agree: false, label: "Disagree", active: userVote === false, color: "var(--accent-orange)" },
                      ].map(({ agree, label, active, color }) => (
                        <motion.button
                          key={label}
                          whileTap={{ scale: 0.93 }}
                          onClick={(e) => { e.stopPropagation(); vote(item.id, agree, item.agreePercent, item.userVote, item.isDbPost); }}
                          style={{
                            flex: 1,
                            padding: "10px",
                            borderRadius: 999,
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: "pointer",
                            border: `2.5px solid ${color}`,
                            background: active ? color : "rgba(255, 255, 255, 0.02)",
                            color: active ? "white" : color,
                            boxShadow: active ? `0 0 16px ${color}60` : "none",
                            transition: "all 0.2s ease-in-out",
                          }}
                        >
                          {active ? `✓ ${agree ? "Agreed" : "Disagreed"}` : label}
                        </motion.button>
                      ))}
                    </div>
                    {renderCardActions(item)}
                  </>
                )}

                {item.type === "prediction" && (
                  <div>
                    <p style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500 }}>{item.samePredictionCount} fans made the same prediction</p>
                    {(item.counterCount ?? 0) > 0 && <p style={{ fontSize: 12, color: "var(--accent-magenta)", marginTop: 4 }}>{item.counterCount} fans think otherwise →</p>}
                    {renderCardActions(item)}
                  </div>
                )}

                {item.type === "post" && (
                  renderCardActions(item)
                )}
              </motion.div>
            );
          }

          if (item.type === "debate") {
            const userVote = votes[item.id];
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card" style={{ padding: "16px", cursor: "pointer" }} onClick={() => onPostClick && onPostClick(item)}>
                <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: "rgba(233,30,140,0.12)", color: "var(--accent-magenta)", border: "1px solid rgba(233,30,140,0.25)" }}>⚡ Debate</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                  <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" avatarUrl={item.fan.avatarUrl} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p>
                    <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} · {item.fan.team} • {formatTimeAgo(item.createdAt)}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={(e) => { e.stopPropagation(); vote(item.id, true, item.agreePercent || 50, item.userVote, item.isDbPost); }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: 14,
                      textAlign: "center",
                      background: userVote === true ? "var(--accent-magenta)" : "rgba(233,30,140,0.08)",
                      border: `2px solid ${userVote === true ? "var(--accent-magenta)" : "rgba(233,30,140,0.3)"}`,
                      color: userVote === true ? "white" : "var(--text-primary)",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>
                      {userVote === true && "✓ "}
                      {item.sideA || (item.text?.split(" VS ")[0]) || "Side A"}
                    </p>
                  </motion.button>
                  <div style={{ display: "flex", alignItems: "center", padding: "0 4px" }}>
                    <span className="font-display" style={{ fontSize: 16, color: "var(--text-muted)" }}>VS</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={(e) => { e.stopPropagation(); vote(item.id, false, item.agreePercent || 50, item.userVote, item.isDbPost); }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: 14,
                      textAlign: "center",
                      background: userVote === false ? "var(--accent-orange)" : "rgba(59,130,246,0.08)",
                      border: `2px solid ${userVote === false ? "var(--accent-orange)" : "rgba(59,130,246,0.3)"}`,
                      color: userVote === false ? "white" : "var(--text-primary)",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>
                      {userVote === false && "✓ "}
                      {item.sideB || (item.text?.split(" VS ")[1]) || "Side B"}
                    </p>
                  </motion.button>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, marginTop: 10 }}>{fmt(item.fanCount ?? 0)} fans · {item.replies ?? 0} replies</p>
                {renderCardActions(item)}
              </motion.div>
            );
          }

          if (item.type === "memory") {
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card" style={{ padding: "16px", cursor: "pointer" }} onClick={() => onPostClick && onPostClick(item)}>
                <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: "rgba(0,232,198,0.1)", color: "var(--teal)", border: "1px solid rgba(0,232,198,0.25)" }}>🕰 Memory</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                  <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" avatarUrl={item.fan.avatarUrl} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p>
                    <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} • {formatTimeAgo(item.createdAt)}</p>
                  </div>
                </div>
                <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.55, marginBottom: item.memCtx ? 8 : 0 }}>{item.text}</p>
                {item.memCtx && <p style={{ fontSize: 12, color: "var(--teal)", fontStyle: "italic", borderLeft: "2px solid var(--teal)", paddingLeft: 10, marginTop: 6 }}>{item.memCtx}</p>}
                <p style={{ fontSize: 12, color: "var(--text-primary)", fontWeight: 500, marginTop: 10 }}>{fmt(item.fanCount ?? 0)} fans · {item.replies ?? 0} replies</p>
                {renderCardActions(item)}
              </motion.div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
