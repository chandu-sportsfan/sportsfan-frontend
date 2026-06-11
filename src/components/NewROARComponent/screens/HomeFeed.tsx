import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AvatarWithBadge from "../components/AvatarWithBadge";
import NewHomePage from "../../NewHomePageComponent/newhomepage";
import { SplitBar, FilterPills } from "../components/shared";
import { FEED_POSTS, FEED_FILTERS, BADGE_LABELS, RADIAL_OPTS, CURRENT_USER } from "../constants";
import { fmt, clamp, formatTimeAgo } from "../utils";
import { Heart, Share2, Flame, TrendingUp, Zap, History, PenTool, MessageSquare, Trash2 } from "lucide-react";
import type { FeedPost, Room } from "../types";

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
}: Props) {
  const [filter, setFilter] = useState("For You");
  const [votes, setVotes] = useState<Record<string, boolean | null>>({});
  const [pcts, setPcts] = useState<Record<string, number>>({});
  const [now, setNow] = useState(Date.now());
  const [localUsername, setLocalUsername] = useState("RoarUser");

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
            const shareUrl = window.location.origin + "/MainModules/ROAR?post=" + item.id;
            if (navigator.share) {
              navigator.share({
                title: 'ROAR Post',
                url: shareUrl,
              }).catch(() => {});
            } else {
              navigator.clipboard.writeText(shareUrl);
              onToast("Link copied to clipboard!");
            }
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
      fan: { username: p.authorUsername || "RoarUser", badge: p.authorBadge || "RISING_FAN", team: p.sport === "cricket" ? "India" : "MCFC" },
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
      {/* SVG Gradient Definition */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <linearGradient id="pink-orange-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e91e8c" />
          <stop offset="100%" stopColor="#ff6b35" />
        </linearGradient>
      </svg>

      {/* ── Header ── */}
      <div
        className="glass-card"
        style={{ position: "sticky", top: 0, zIndex: 20, margin: "8px 12px 0", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: 20 }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flexShrink: 0 }}>
          <h1 className="logotype" style={{ fontSize: 34, margin: 0, lineHeight: 1 }}>ROAR</h1>
          <div style={{ height: "2px", width: "32px", borderRadius: "999px", marginTop: "3px", background: "#e5003d" }} />
        </div>

        {/* Quick-compose pills — profile button and gold bell REMOVED */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {RADIAL_OPTS.map((q) => {
              const icons: Record<string, React.ReactNode> = {
                hot_take: <Flame size={16} stroke="url(#pink-orange-grad)" fill="url(#pink-orange-grad)" />,
                prediction: <TrendingUp size={16} stroke="url(#pink-orange-grad)" />,
                debate: <Zap size={16} stroke="url(#pink-orange-grad)" fill="url(#pink-orange-grad)" />,
                memory: <History size={16} stroke="url(#pink-orange-grad)" />,
                post: <PenTool size={16} stroke="url(#pink-orange-grad)" />,
              };

              const icon = icons[q.id] || <span>{q.emoji}</span>;

              return (
                <motion.button
                  key={q.id}
                  whileTap={{ scale: 0.93 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onQuickCompose && onQuickCompose(q.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    padding: "8px 12px",
                    borderRadius: 14,
                    background: "linear-gradient(145deg, rgba(233,30,140,0.18), rgba(255,107,53,0.10))",
                    border: "1px solid rgba(233,30,140,0.35)",
                    cursor: "pointer",
                    flexShrink: 1,
                    minWidth: 0,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.2s",
                  }}
                >
                  {icon}
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(255,255,255,0.9)", whiteSpace: "nowrap", lineHeight: 1, letterSpacing: "0.03em" }}>
                    {q.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Onboarding banner */}
      {showBanner && (
        <div style={{ margin: "8px 16px", padding: "10px 14px", borderRadius: 16, background: "var(--bg-tertiary)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", flex: 1 }}>Your feed is personalising. Make a prediction or react to a take.</p>
          <button onClick={onDismissBanner} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", marginLeft: 8 }}>✕</button>
        </div>
      )}

      {/* Filters */}
      <div style={{ padding: "10px 16px", overflow: "hidden", position: "relative" }}>
        <FilterPills options={FEED_FILTERS} active={filter} onChange={setFilter} />
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
                  <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" />
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
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>{fmt(item.fanCount ?? 0)} fans · {item.replies ?? 0} replies</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[
                        { agree: true, label: "Agree", active: userVote === true, color: "var(--accent-magenta)" },
                        { agree: false, label: "Disagree", active: userVote === false, color: "var(--accent-orange)" },
                      ].map(({ agree, label, active, color }) => (
                        <motion.button
                          key={label}
                          whileTap={{ scale: 0.93 }}
                          onClick={(e) => { e.stopPropagation(); vote(item.id, agree, item.agreePercent, item.userVote, item.isDbPost); }}
                          style={{ flex: 1, padding: "10px", borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: "pointer", border: `2px solid ${active ? color : `${color}59`}`, background: active ? color : "transparent", color: active ? "white" : color, transition: "all 0.2s" }}
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
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item.samePredictionCount} fans made the same prediction</p>
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
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card" style={{ padding: "16px", cursor: "pointer" }} onClick={() => onPostClick && onPostClick(item)}>
                <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, textTransform: "uppercase", background: "rgba(233,30,140,0.12)", color: "var(--accent-magenta)", border: "1px solid rgba(233,30,140,0.25)" }}>⚡ Debate</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                  <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p>
                    <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} · {item.fan.team} • {formatTimeAgo(item.createdAt)}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
                  <div style={{ flex: 1, padding: "12px", borderRadius: 14, textAlign: "center", background: "rgba(233,30,140,0.1)", border: "1px solid rgba(233,30,140,0.3)" }}>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>{item.sideA || (item.text?.split(" VS ")[0]) || "Side A"}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", padding: "0 4px" }}>
                    <span className="font-display" style={{ fontSize: 16, color: "var(--text-muted)" }}>VS</span>
                  </div>
                  <div style={{ flex: 1, padding: "12px", borderRadius: 14, textAlign: "center", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)" }}>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>{item.sideB || (item.text?.split(" VS ")[1]) || "Side B"}</p>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 10 }}>{fmt(item.fanCount ?? 0)} fans · {item.replies ?? 0} replies</p>
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
                  <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p>
                    <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} • {formatTimeAgo(item.createdAt)}</p>
                  </div>
                </div>
                <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.55, marginBottom: item.memCtx ? 8 : 0 }}>{item.text}</p>
                {item.memCtx && <p style={{ fontSize: 12, color: "var(--teal)", fontStyle: "italic", borderLeft: "2px solid var(--teal)", paddingLeft: 10, marginTop: 6 }}>{item.memCtx}</p>}
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 10 }}>{fmt(item.fanCount ?? 0)} fans · {item.replies ?? 0} replies</p>
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