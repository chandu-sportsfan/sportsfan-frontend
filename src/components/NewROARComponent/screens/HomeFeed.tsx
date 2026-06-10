import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AvatarWithBadge from "../components/AvatarWithBadge";
import { SplitBar, FilterPills } from "../components/shared";
import { FEED_POSTS, FEED_FILTERS, BADGE_LABELS, RADIAL_OPTS, CURRENT_USER } from "../constants";
import { fmt, clamp } from "../utils";
import type { FeedPost, Room } from "../types";

interface Props {
  unreadCount: number;
  onNavigateAlerts: () => void;
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
  userSports?: string[];
  onQuickCompose?: (t: string) => void;
}

export default function HomeFeed({
  unreadCount,
  onNavigateAlerts,
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
  userSports = [],
  onQuickCompose,
}: Props) {
  const [filter, setFilter] = useState("For You");
  const [votes, setVotes] = useState<Record<string, boolean | null>>({});
  const [pcts, setPcts] = useState<Record<string, number>>({});

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
    };
  });

  const allPosts = [...mappedDbPosts, ...extraItems, ...FEED_POSTS];
  const filtered = allPosts.filter((p) => {
    if (filter === "For You") {
      if (userSports && userSports.length > 0) return userSports.map((s) => s.toLowerCase()).includes(p.sport?.toLowerCase());
      return true;
    }
    if (filter === "Cricket") return p.sport === "cricket";
    if (filter === "Football") return p.sport === "football";
    if (filter === "Live") return p.isLive || p.type === "match_room";
    if (filter === "Predictions") return p.type === "prediction";
    return true;
  });

  return (
    <div className="screen-scroll">
      {/* ── Header ── */}
      <div
        className="glass-card"
        style={{ position: "sticky", top: 0, zIndex: 20, margin: "8px 12px 0", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: 20 }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flexShrink: 0 }}>
          <h1 className="logotype" style={{ fontSize: 26, margin: 0, lineHeight: 1 }}>ROAR</h1>
          <div style={{ height: "2px", width: "24px", borderRadius: "999px", marginTop: "3px", background: "#e5003d" }} />
        </div>

        {/* Quick-compose pills */}
        <div style={{ display: "flex", gap: 5, alignItems: "center", flex: 1, justifyContent: "center", padding: "0 8px", overflow: "hidden" }}>
          {RADIAL_OPTS.map((q) => (
            <motion.button
              key={q.id}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onQuickCompose && onQuickCompose(q.id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 2, padding: "6px 7px", borderRadius: 12,
                background: "linear-gradient(145deg, rgba(233,30,140,0.18), rgba(255,107,53,0.10))",
                border: "1px solid rgba(233,30,140,0.35)", cursor: "pointer", flexShrink: 1, minWidth: 0,
                boxShadow: "0 2px 10px rgba(233,30,140,0.2), inset 0 1px 0 rgba(255,255,255,0.07)",
                backdropFilter: "blur(8px)", transition: "box-shadow 0.2s",
              }}
            >
              <span style={{ fontSize: 14, lineHeight: 1 }}>{q.emoji}</span>
              <span style={{ fontSize: 8.5, fontWeight: 700, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", lineHeight: 1, letterSpacing: "0.03em" }}>{q.label}</span>
            </motion.button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onLeaderboard}
            style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            🏆
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onNavigateAlerts}
            style={{ position: "relative", width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            🔔
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: -2, right: -2, minWidth: 16, height: 16, borderRadius: 999, background: "var(--accent-magenta)", fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
                {unreadCount}
              </span>
            )}
          </motion.button>
          <motion.button whileTap={{ scale: 0.93 }} onClick={onFanProfile} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <AvatarWithBadge username={CURRENT_USER.username} badge={userBadge} size="sm" />
          </motion.button>
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
        {/* Live room banners */}
        {rooms
          .filter((r) => r.roomId !== "mock-cricket" && r.roomId !== "mock-football")
          .map((room, idx) => {
            const showThisRoom =
              filter === "Live" ||
              (filter === "For You" && (userSports.length === 0 || userSports.includes(room.sport?.toLowerCase()))) ||
              (filter === "Cricket" && room.sport?.toLowerCase() === "cricket") ||
              (filter === "Football" && room.sport?.toLowerCase() === "football");
            if (!showThisRoom) return null;

            const isBlueStyle = room.sport?.toLowerCase() === "football" || idx % 2 === 1;
            const bg = isBlueStyle ? "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(59,130,246,0.04))" : "linear-gradient(135deg,rgba(233,30,140,0.12),rgba(255,107,53,0.06))";
            const border = isBlueStyle ? "1px solid rgba(59,130,246,0.25)" : "1px solid rgba(233,30,140,0.25)";
            const livePulseBg = isBlueStyle ? "#60a5fa" : "var(--live-green)";
            const liveTextCol = isBlueStyle ? "#60a5fa" : "var(--live-green)";

            return (
              <motion.div
                key={room.roomId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ padding: 16, background: bg, border, cursor: "pointer" }}
                onClick={() => onJoinRoom(room)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span className="live-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: livePulseBg, display: "inline-block" }} />
                      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: liveTextCol }}>LIVE NOW</span>
                    </div>
                    <p className="font-display" style={{ fontSize: isBlueStyle ? 22 : 26, lineHeight: 1 }}>{room.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{room.description || "Discussion Show"}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p className="font-display" style={{ fontSize: isBlueStyle ? 28 : 30, color: "white" }}>LIVE</p>
                    <p style={{ fontSize: 11, color: isBlueStyle ? "#60a5fa" : "var(--text-muted)" }}>Active Now</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => { e.stopPropagation(); onJoinRoom(room); }}
                  className={isBlueStyle ? undefined : "btn-gradient"}
                  style={{ width: "100%", marginTop: 12, padding: "10px 0", borderRadius: 999, fontSize: 13, border: "none", cursor: "pointer", background: isBlueStyle ? "#3b82f6" : undefined, color: "white", fontWeight: 800, fontFamily: isBlueStyle ? "'Bebas Neue',sans-serif" : undefined, letterSpacing: isBlueStyle ? "0.06em" : undefined }}
                >
                  JOIN LIVE · {room.fanCount || 0} fans →
                </motion.button>
              </motion.div>
            );
          })}

        {/* Feed posts */}
        {filtered.map((item, i) => {
          if (item.type === "hot_take" || item.type === "prediction") {
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
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", padding: "3px 8px", borderRadius: 4, background: item.type === "hot_take" ? "rgba(239,68,68,0.12)" : "rgba(255,107,53,0.12)", color: item.type === "hot_take" ? "#f87171" : "var(--accent-orange)", border: `1px solid ${item.type === "hot_take" ? "rgba(239,68,68,0.2)" : "rgba(255,107,53,0.2)"}`, textTransform: "uppercase" }}>
                    {item.type === "hot_take" ? "🔥 Hot Take" : "📊 Prediction"}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: item.sport === "cricket" ? "rgba(34,197,94,0.1)" : "rgba(59,130,246,0.1)", color: item.sport === "cricket" ? "#22c55e" : "#60a5fa", border: `1px solid ${item.sport === "cricket" ? "rgba(34,197,94,0.2)" : "rgba(59,130,246,0.2)"}`, textTransform: "uppercase" }}>
                    {item.sport === "cricket" ? "🏏 Cricket" : "⚽ Football"}
                  </span>
                  {item.following && <span style={{ marginLeft: "auto", fontSize: 9, padding: "3px 8px", borderRadius: 999, background: "rgba(233,30,140,0.15)", color: "var(--accent-magenta)" }}>Following</span>}
                </div>

                {/* Author */}
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                  <AvatarWithBadge username={item.fan.username} badge={item.fan.badge} size="sm" />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13 }}>{item.fan.username}</p>
                    <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} · {item.fan.team}</p>
                  </div>
                </div>

                <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.5, marginBottom: 12 }}>{item.text}</p>
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
                  </>
                )}

                {item.type === "prediction" && (
                  <div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{item.samePredictionCount} fans made the same prediction</p>
                    {(item.counterCount ?? 0) > 0 && <p style={{ fontSize: 12, color: "var(--accent-magenta)", marginTop: 4 }}>{item.counterCount} fans think otherwise →</p>}
                  </div>
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
                    <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]} · {item.fan.team}</p>
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
                    <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{BADGE_LABELS[item.fan.badge]}</p>
                  </div>
                </div>
                <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.55, marginBottom: item.memCtx ? 8 : 0 }}>{item.text}</p>
                {item.memCtx && <p style={{ fontSize: 12, color: "var(--teal)", fontStyle: "italic", borderLeft: "2px solid var(--teal)", paddingLeft: 10, marginTop: 6 }}>{item.memCtx}</p>}
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 10 }}>{fmt(item.fanCount ?? 0)} fans · {item.replies ?? 0} replies</p>
              </motion.div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
