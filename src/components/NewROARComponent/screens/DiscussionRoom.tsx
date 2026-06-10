import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AvatarWithBadge from "../components/AvatarWithBadge";
import { JOIN_FANS } from "../constants";
import { fmt } from "../utils";

interface Props {
  onBack: () => void;
  onToast: (m: string) => void;
  roomId?: string;
  roomName?: string;
  onPostClick?: (post: any) => void;
}

const TABS = ["Debate", "Predictions", "Hot Takes", "Post-Match 🔒"];

const MODE_COLOR: Record<string, string> = {
  chat: "var(--text-primary)",
  prediction: "var(--gold)",
  hottake: "#f87171",
};

const MODE_LABEL: Record<string, string> = {
  chat: "💬 Fire",
  prediction: "📊 Predict",
  hottake: "⚡ Bold Take",
};

export default function DiscussionRoom({ onBack, onToast, roomId, roomName, onPostClick }: Props) {
  const [tab, setTab] = useState("Debate");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"chat" | "prediction" | "hottake">("chat");
  const [fanCount, setFanCount] = useState(312);
  const [joinToast, setJoinToast] = useState<string | null>(null);
  const [composerPre, setComposerPre] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const joinIdx = useRef(0);

  const [userUsername, setUserUsername] = useState("RoarUser");
  const [userBadge, setUserBadge] = useState("RISING_FAN");

  useEffect(() => {
    try {
      setUserUsername(localStorage.getItem("roar_username") || "RoarUser");
      setUserBadge(localStorage.getItem("roar_badge") || "RISING_FAN");
    } catch {}
  }, []);

  useEffect(() => {
    const t = setInterval(() => setFanCount((c) => c + 1), 7000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      const name = JOIN_FANS[joinIdx.current % JOIN_FANS.length];
      joinIdx.current++;
      setJoinToast(`${name} joined the room`);
      setTimeout(() => setJoinToast(null), 2500);
    }, 9000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/roar/rooms/${roomId}/messages`);
        if (res.data?.success) {
          const mapped = res.data.messages.map((m: any) => ({
            id: m.msgId,
            fan: { username: m.authorUsername, badge: m.authorBadge },
            text: m.text,
            fireCount: m.fireCount || 0,
            nochanceCount: m.noChanceCount || 0,
            heartCount: m.heartCount || 0,
            timeAgo: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: m.type,
          }));
          setPosts(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  const send = async () => {
    if (!roomId) return;
    const text = (composerPre || input).trim();
    if (!text) return;
    try {
      const res = await axios.post(`/api/roar/rooms/${roomId}/messages`, { text, type: mode });
      if (res.data?.success) {
        const m = res.data.message;
        setPosts((p) => [{ id: m.msgId, fan: { username: m.authorUsername, badge: m.authorBadge }, text: m.text, fireCount: 0, nochanceCount: 0, heartCount: 0, timeAgo: "now", type: m.type }, ...p]);
        setInput("");
        setComposerPre("");
        setTimeout(() => listRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 50);
      }
    } catch (err) {
      console.error(err);
      onToast("Failed to send message");
    }
  };

  const react = async (id: string, reaction: "fire" | "noChance" | "heart") => {
    if (!roomId) return;
    try {
      await axios.post(`/api/roar/rooms/${roomId}/messages/${id}/react`, { reaction });
      setPosts((p) =>
        p.map((x) =>
          x.id === id
            ? reaction === "fire"
              ? { ...x, fireCount: x.fireCount + 1 }
              : reaction === "heart"
              ? { ...x, heartCount: (x.heartCount || 0) + 1 }
              : { ...x, nochanceCount: x.nochanceCount + 1 }
            : x,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const visiblePosts = posts.filter((p) => {
    if (tab === "Debate") return p.type === "chat" || !p.type;
    if (tab === "Predictions") return p.type === "prediction";
    if (tab === "Hot Takes") return p.type === "hottake";
    return false;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Join toast */}
      <AnimatePresence>
        {joinToast && (
          <motion.div
            initial={{ y: -50 }} animate={{ y: 0 }} exit={{ y: -50 }}
            style={{ position: "absolute", top: 8, left: 0, right: 0, zIndex: 40, padding: "0 16px", pointerEvents: "none" }}
          >
            <div className="glass-card" style={{ padding: "8px 16px", textAlign: "center", fontSize: 13, border: "1px solid rgba(0,230,118,0.25)" }}>
              <span style={{ color: "var(--live-green)" }}>●</span> {joinToast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ padding: "12px 16px", background: "rgba(14,14,20,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)", flexShrink: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--text-primary)" }}>←</button>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p className="font-display" style={{ fontSize: 20, letterSpacing: "0.04em" }}>{roomName || "India vs Pakistan"}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 2 }}>
              <span className="live-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--live-green)", display: "inline-block" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--live-green)" }}>LIVE</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>· {fmt(fanCount)} fans</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p className="font-display" style={{ fontSize: 22, color: "var(--gold)" }}>287/4</p>
            <p style={{ fontSize: 10, color: "var(--text-muted)" }}>IND · 88 ov</p>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>
            <span>Room Energy</span>
            <span>{fmt(fanCount)} in room</span>
          </div>
          <div className="room-energy-bar room-energy-fast" style={{ borderRadius: 999 }} />
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 12, overflowX: "auto" }}>
          {TABS.map((t) => {
            const isLocked = t.includes("🔒");
            return (
              <button
                key={t}
                onClick={() => isLocked ? onToast("🔒 Post-Match stats unlock when the game ends!") : setTab(t)}
                style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: "none", cursor: isLocked ? "not-allowed" : "pointer", background: tab === t ? "var(--accent-magenta)" : "transparent", color: tab === t ? "white" : "var(--text-secondary)", opacity: isLocked ? 0.6 : 1 }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "16px 16px 140px", display: "flex", flexDirection: "column-reverse", gap: 12 }}>
        <AnimatePresence initial={false}>
          {loading ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px 0" }}>Loading messages...</div>
          ) : visiblePosts.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px 0" }}>
              {tab === "Predictions" ? "No predictions yet. Make one to start!" : tab === "Hot Takes" ? "No hot takes yet. Share yours!" : "Welcome to the community chat! Type a message below to start."}
            </div>
          ) : (
            <>
              {visiblePosts.map((p) => {
                const bg = p.type === "prediction" ? "linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,215,0,0.02))" : p.type === "hottake" ? "linear-gradient(135deg,rgba(239,68,68,0.08),rgba(239,68,68,0.02))" : undefined;
                const border = p.type === "prediction" ? "1px solid rgba(255,215,0,0.18)" : p.type === "hottake" ? "1px solid rgba(239,68,68,0.18)" : undefined;

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className="glass-card"
                    style={{ padding: 12, background: bg, border, cursor: "pointer" }}
                    onClick={() => {
                      if (onPostClick) {
                        onPostClick({
                          id: p.id,
                          text: p.text,
                          fan: p.fan,
                          timeAgo: p.timeAgo,
                          type: p.type || "chat",
                          isDbPost: true,
                        });
                      }
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <AvatarWithBadge username={p.fan.username} badge={p.fan.badge} size="sm" />
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 13 }}>{p.fan.username}</p>
                          <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{p.timeAgo}</p>
                        </div>
                      </div>
                      {p.type !== "chat" && p.type && (
                        <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: p.type === "prediction" ? "rgba(255,215,0,0.15)" : "rgba(239,68,68,0.15)", color: p.type === "prediction" ? "#fbbf24" : "#f87171", border: p.type === "prediction" ? "1px solid rgba(255,215,0,0.25)" : "1px solid rgba(239,68,68,0.25)" }}>
                          {p.type === "prediction" ? "PREDICTION" : "HOT TAKE"}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.4, marginTop: 8, color: MODE_COLOR[p.type] || "white" }}>{p.text}</p>
                    <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "flex-end" }}>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); react(p.id, "fire"); }} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.05)", borderRadius: 999, border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-primary)", cursor: "pointer" }}>
                        🔥 {p.fireCount}
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); react(p.id, "heart"); }} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.05)", borderRadius: 999, border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-primary)", cursor: "pointer" }}>
                        ❤️ {p.heartCount || 0}
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); react(p.id, "noChance"); }} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.05)", borderRadius: 999, border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-primary)", cursor: "pointer" }}>
                        No chance {p.nochanceCount}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
              {tab === "Predictions" && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setMode("prediction"); setComposerPre("My prediction: "); }}
                  className="btn-gradient"
                  style={{ width: "100%", padding: "14px", borderRadius: 999, color: "white", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", border: "none", cursor: "pointer", flexShrink: 0, margin: "8px 0 16px" }}
                >
                  MAKE YOUR PREDICTION
                </motion.button>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 12px 14px", background: "rgba(14,14,20,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)", zIndex: 10, display: "flex", flexDirection: "column", gap: 8 }}>
        {composerPre && (
          <div style={{ position: "absolute", bottom: 110, left: 12, right: 12, padding: "8px 12px", borderRadius: 12, background: "var(--bg-tertiary)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 30 }}>
            <p style={{ fontSize: 12, color: MODE_COLOR[mode], fontStyle: "italic" }}>{MODE_LABEL[mode]} preset selected</p>
            <button onClick={() => setComposerPre("")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>✕</button>
          </div>
        )}
        {/* Mode pills */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {(["chat", "prediction", "hottake"] as const).map((m) => {
            const active = mode === m;
            const colorMap = { chat: "#fff", prediction: "var(--gold)", hottake: "#f87171" };
            const bgMap = { chat: "rgba(255,255,255,0.1)", prediction: "rgba(255,215,0,0.1)", hottake: "rgba(239,68,68,0.1)" };
            const borderMap = { chat: "1px solid rgba(255,255,255,0.3)", prediction: "1px solid rgba(255,215,0,0.3)", hottake: "1px solid rgba(239,68,68,0.3)" };

            return (
              <button
                key={m}
                onClick={() => { setMode(m); if (m === "prediction") setComposerPre("My prediction: "); else setComposerPre(""); }}
                style={{ padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, border: active ? borderMap[m] : "1px solid var(--border)", background: active ? bgMap[m] : "rgba(255,255,255,0.03)", color: active ? colorMap[m] : "var(--text-secondary)", cursor: "pointer", transition: "all 0.2s" }}
              >
                {MODE_LABEL[m]}
              </button>
            );
          })}
        </div>

        {/* Input row */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <AvatarWithBadge username={userUsername} badge={userBadge} size="sm" />
          <input
            type="text"
            placeholder="Drop your take..."
            value={composerPre || input}
            onChange={(e) => { if (composerPre) setComposerPre(e.target.value); else setInput(e.target.value); }}
            onKeyDown={(e) => e.key === "Enter" && send()}
            style={{ flex: 1, height: 44, borderRadius: 22, background: "var(--bg-secondary)", border: "1px solid var(--border)", paddingLeft: 16, paddingRight: 16, color: "white", fontSize: 14, outline: "none" }}
          />
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={send}
            style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent-gradient)", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            ↑
          </motion.button>
        </div>
      </div>
    </div>
  );
}
