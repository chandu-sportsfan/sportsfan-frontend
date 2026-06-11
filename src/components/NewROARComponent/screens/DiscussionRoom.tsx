import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AvatarWithBadge from "../components/AvatarWithBadge";
import { JOIN_FANS } from "../constants";
import { fmt } from "../utils";
import { Image, Video } from "lucide-react";

interface Props {
  onBack: () => void;
  onToast: (m: string) => void;
  roomId?: string;
  roomName?: string;
  onPostClick?: (post: any) => void;
  onCompose?: (type: string | null) => void;
  fanCount?: number;
}

const TABS = ["Debate", "Predictions", "Hot Takes", "Memory", "Post-Match 🔒"];

const MODE_COLOR: Record<string, string> = {
  chat: "var(--text-primary)",
  prediction: "var(--gold)",
  hottake: "#f87171",
  debate: "#e91e8c",
  memory: "#00e8c6",
};

const MODE_LABEL: Record<string, string> = {
  chat: "✏️ Post",
  prediction: "📈 Predict",
  hottake: "🔥 Hot Take",
  debate: "⚡ Debate",
  memory: "⏱️ Memory",
};

export default function DiscussionRoom({ onBack, onToast, roomId, roomName, onPostClick, onCompose, fanCount = 312 }: Props) {
  const [tab, setTab] = useState("Debate");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"chat" | "prediction" | "hottake" | "debate" | "memory">("chat");
  const [composerPre, setComposerPre] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [attachedUrl, setAttachedUrl] = useState<string | null>(null);
  const [attachedType, setAttachedType] = useState<"image" | "video" | null>(null);

  const triggerUpload = (type: "image" | "video") => {
    setAttachedType(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === "image" ? "image/*" : "video/*";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      onToast("Uploading media...");
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.url) {
        setAttachedUrl(res.data.url);
        onToast("Media uploaded successfully!");
      }
    } catch (err) {
      console.error("Upload failed", err);
      onToast("Media upload failed");
      setAttachedType(null);
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const [userUsername, setUserUsername] = useState("RoarUser");
  const [userBadge, setUserBadge] = useState("RISING_FAN");

  useEffect(() => {
    try {
      setUserUsername(localStorage.getItem("roar_username") || "RoarUser");
      setUserBadge(localStorage.getItem("roar_badge") || "RISING_FAN");
    } catch {}
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
            createdAt: m.createdAt,
            type: m.type,
            mediaUrls: m.mediaUrls,
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
    const text = `${composerPre}${input}`.trim();
    if (!text && !attachedUrl) return;
    try {
      const res = await axios.post(`/api/roar/rooms/${roomId}/messages`, {
        text: text || "Shared media",
        type: mode,
        mediaUrls: attachedUrl ? [attachedUrl] : undefined,
      });
      if (res.data?.success) {
        const m = res.data.message;
        setPosts((p) => [{
          id: m.msgId,
          fan: { username: m.authorUsername, badge: m.authorBadge },
          text: m.text,
          fireCount: 0,
          nochanceCount: 0,
          heartCount: 0,
          timeAgo: "now",
          createdAt: m.createdAt || Date.now(),
          type: m.type,
          mediaUrls: m.mediaUrls,
        }, ...p]);
        setInput("");
        setComposerPre("");
        setAttachedUrl(null);
        setAttachedType(null);
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
    if (tab === "Debate") return p.type === "chat" || p.type === "debate" || !p.type;
    if (tab === "Predictions") return p.type === "prediction";
    if (tab === "Hot Takes") return p.type === "hottake";
    if (tab === "Memory") return p.type === "memory";
    return false;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", background: "rgba(14,14,20,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)", flexShrink: 0, zIndex: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--text-primary)" }}>←</button>
          <div style={{ flex: 1, textAlign: "left", paddingLeft: 8 }}>
            <p className="font-display" style={{ fontSize: 20, letterSpacing: "0.04em" }}>{roomName || "India vs Pakistan"}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <span className="live-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--live-green)", display: "inline-block" }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--live-green)" }}>LIVE</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>· {fmt(fanCount)} fans</span>
            </div>
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
                          createdAt: p.createdAt,
                          type: p.type || "chat",
                          isDbPost: true,
                          roomId: roomId,
                          mediaUrls: p.mediaUrls,
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
                        <span style={{
                          fontSize: 9,
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: p.type === "prediction" ? "rgba(255,215,0,0.15)" : p.type === "hottake" ? "rgba(239,68,68,0.15)" : p.type === "debate" ? "rgba(233,30,140,0.15)" : "rgba(0,232,198,0.15)",
                          color: p.type === "prediction" ? "#fbbf24" : p.type === "hottake" ? "#f87171" : p.type === "debate" ? "#e91e8c" : "#00e8c6",
                          border: `1px solid ${p.type === "prediction" ? "rgba(255,215,0,0.25)" : p.type === "hottake" ? "rgba(239,68,68,0.25)" : p.type === "debate" ? "rgba(233,30,140,0.25)" : "rgba(0,232,198,0.25)"}`
                        }}>
                          {p.type.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.4, marginTop: 8, color: MODE_COLOR[p.type] || "white" }}>{p.text}</p>
                    {p.mediaUrls && p.mediaUrls.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                        {p.mediaUrls.map((url: string, idx: number) => {
                          const isVideo = url.endsWith(".mp4") || url.includes("/video/upload/");
                          if (isVideo) {
                            return (
                              <video
                                key={idx}
                                src={url}
                                controls
                                style={{ width: "100%", maxHeight: 200, borderRadius: 8, objectFit: "cover" }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            );
                          }
                          return (
                            <img
                              key={idx}
                              src={url}
                              alt="Message Media"
                              style={{ width: "100%", maxHeight: 200, borderRadius: 8, objectFit: "cover" }}
                            />
                          );
                        })}
                      </div>
                    )}
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
              {tab === "Hot Takes" && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setMode("hottake"); setComposerPre(""); }}
                  className="btn-gradient"
                  style={{ width: "100%", padding: "14px", borderRadius: 999, color: "white", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", border: "none", cursor: "pointer", flexShrink: 0, margin: "8px 0 16px" }}
                >
                  DROP A HOT TAKE
                </motion.button>
              )}
              {tab === "Debate" && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setMode("debate"); setComposerPre("My debate side: "); }}
                  className="btn-gradient"
                  style={{ width: "100%", padding: "14px", borderRadius: 999, color: "white", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", border: "none", cursor: "pointer", flexShrink: 0, margin: "8px 0 16px" }}
                >
                  START A DEBATE
                </motion.button>
              )}
              {tab === "Memory" && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setMode("memory"); setComposerPre("Flashback: "); }}
                  className="btn-gradient"
                  style={{ width: "100%", padding: "14px", borderRadius: 999, color: "white", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", border: "none", cursor: "pointer", flexShrink: 0, margin: "8px 0 16px" }}
                >
                  SHARE A MEMORY
                </motion.button>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Composer */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 12px 14px", background: "rgba(14,14,20,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)", zIndex: 10, display: "flex", flexDirection: "column", gap: 8 }}>
        {composerPre && (
          <div style={{ padding: "8px 12px", borderRadius: 12, background: "var(--bg-tertiary)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: 12, color: MODE_COLOR[mode], fontStyle: "italic" }}>{MODE_LABEL[mode]} preset selected</p>
            <button onClick={() => setComposerPre("")} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>✕</button>
          </div>
        )}
        
        {attachedUrl && (
          <div style={{ padding: "8px 12px", borderRadius: 12, background: "var(--bg-tertiary)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {attachedType === "image" ? (
                <img src={attachedUrl} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} alt="Attached" />
              ) : (
                <video src={attachedUrl} style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
              )}
              <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Media attached</span>
            </div>
            <button onClick={() => { setAttachedUrl(null); setAttachedType(null); }} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>✕</button>
          </div>
        )}

        {/* Mode pills */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", overflowX: "auto", paddingBottom: 4 }}>
          {[
            { id: "hottake", label: "Hot Take", emoji: "🔥", preset: "", activeBg: "rgba(239, 68, 68, 0.15)", activeBorder: "1px solid rgba(239, 68, 68, 0.35)", activeColor: "#f87171" },
            { id: "prediction", label: "Predict", emoji: "📈", preset: "My prediction: ", activeBg: "rgba(255, 184, 0, 0.15)", activeBorder: "1px solid rgba(255, 184, 0, 0.35)", activeColor: "var(--gold)" },
            { id: "debate", label: "Debate", emoji: "⚡", preset: "My debate side: ", activeBg: "rgba(233, 30, 140, 0.15)", activeBorder: "1px solid rgba(233, 30, 140, 0.35)", activeColor: "#e91e8c" },
            { id: "memory", label: "Memory", emoji: "⏱️", preset: "Flashback: ", activeBg: "rgba(0, 232, 198, 0.15)", activeBorder: "1px solid rgba(0, 232, 198, 0.35)", activeColor: "#00e8c6" },
            { id: "chat", label: "Post", emoji: "✒️", preset: "", activeBg: "rgba(255, 255, 255, 0.1)", activeBorder: "1px solid rgba(255, 255, 255, 0.3)", activeColor: "#fff" },
          ].map((item) => {
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setMode(item.id as any);
                  setComposerPre(item.preset);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  border: active ? item.activeBorder : "1px solid var(--border)",
                  background: active ? item.activeBg : "rgba(255,255,255,0.03)",
                  color: active ? item.activeColor : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input row */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <AvatarWithBadge username={userUsername} badge={userBadge} size="sm" />
          
          <button
            onClick={() => triggerUpload("image")}
            disabled={uploading}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}
            title="Upload Image"
          >
            <Image size={20} />
          </button>
          
          <button
            onClick={() => triggerUpload("video")}
            disabled={uploading}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}
            title="Upload Video"
          >
            <Video size={20} />
          </button>

          <input
            type="text"
            placeholder={uploading ? "Uploading media..." : "Drop your take..."}
            disabled={uploading}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            style={{ flex: 1, height: 44, borderRadius: 22, background: "var(--bg-secondary)", border: "1px solid var(--border)", paddingLeft: 16, paddingRight: 16, color: "white", fontSize: 14, outline: "none" }}
          />
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={send}
            disabled={uploading}
            style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent-gradient)", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: uploading ? 0.5 : 1 }}
          >
            ↑
          </motion.button>
        </div>
      </div>
    </div>
  );
}
