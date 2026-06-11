import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AvatarWithBadge from "../components/AvatarWithBadge";
import { JOIN_FANS } from "../constants";
import { fmt } from "../utils";
import { Image, Video, ChevronLeft, Flame, TrendingUp, Zap, History, Lock, PenTool } from "lucide-react";

interface Props {
  onBack: () => void;
  onToast: (m: string) => void;
  roomId?: string;
  roomName?: string;
  onPostClick?: (post: any) => void;
  onCompose?: (type: string | null) => void;
  fanCount?: number;
  score?: string;
  scoreSubtitle?: string;
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

export default function DiscussionRoom({ onBack, onToast, roomId, roomName, onPostClick, onCompose, fanCount = 312, score, scoreSubtitle }: Props) {
  const [tab, setTab] = useState("Debate");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"chat" | "prediction" | "hottake" | "debate" | "memory">("chat");
  const [composerPre, setComposerPre] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const modeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (modeMenuRef.current && !modeMenuRef.current.contains(event.target as Node)) {
        setIsModeMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", background: "rgba(14,14,20,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)", flexShrink: 0, zIndex: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "white", display: "flex", alignItems: "center", padding: 0 }}>
              <ChevronLeft size={24} />
            </button>
            <div style={{ textAlign: "left", paddingTop: 2 }}>
              <p className="font-display" style={{ fontSize: 24, letterSpacing: "0.04em", margin: 0, lineHeight: 1.2, color: "white", fontWeight: 800, textTransform: "uppercase" }}>{roomName || "WORLDCUP"}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <span className="live-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--live-green)", display: "inline-block" }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--live-green)" }}>LIVE</span>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>· {fmt(fanCount)} fans</span>
              </div>
            </div>
          </div>

          {(score || scoreSubtitle) && (
            <div style={{ textAlign: "right", paddingRight: 8, marginTop: -4 }}>
              {score && <div className="font-display" style={{ fontSize: 28, color: "var(--accent-yellow)", lineHeight: 1 }}>{score}</div>}
              {scoreSubtitle && <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{scoreSubtitle}</div>}
            </div>
          )}

          {/* Dropdown */}
          <div style={{ position: "relative" }} ref={dropdownRef}>
            {(() => {
              const icons: Record<string, React.ReactNode> = {
                "Hot Takes": <Flame size={16} stroke="url(#pink-orange-grad)" fill="url(#pink-orange-grad)" />,
                "Predictions": <TrendingUp size={16} stroke="url(#pink-orange-grad)" />,
                "Debate": <Zap size={16} stroke="url(#pink-orange-grad)" fill="url(#pink-orange-grad)" />,
                "Memory": <History size={16} stroke="url(#pink-orange-grad)" />,
                "Post-Match 🔒": <Lock size={16} stroke="url(#pink-orange-grad)" />,
              };
              const selectedIcon = icons[tab] || <PenTool size={16} stroke="url(#pink-orange-grad)" />;

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
                  <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.03em" }}>{tab.replace(" 🔒", "")}</span>
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
                  {TABS.map((t) => {
                    const isLocked = t.includes("🔒");
                    const isActive = t === tab;
                    const iconsWhite: Record<string, React.ReactNode> = {
                      "Hot Takes": <Flame size={18} color="white" />,
                      "Predictions": <TrendingUp size={18} color="white" />,
                      "Debate": <Zap size={18} color="white" />,
                      "Memory": <History size={18} color="white" />,
                      "Post-Match 🔒": <Lock size={18} color="white" />,
                    };
                    const icon = iconsWhite[t] || <PenTool size={18} color="white" />;
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          if (isLocked) {
                            onToast("🔒 Post-Match stats unlock when the game ends!");
                          } else {
                            setTab(t);
                            setIsDropdownOpen(false);
                          }
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          borderRadius: 12,
                          background: isActive ? "linear-gradient(145deg, rgba(233,30,140,0.18), rgba(255,107,53,0.10))" : "transparent",
                          border: isActive ? "1px solid rgba(233,30,140,0.35)" : "1px solid transparent",
                          color: "white",
                          cursor: isLocked ? "not-allowed" : "pointer",
                          textAlign: "left",
                          transition: "all 0.2s",
                          opacity: isLocked ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive && !isLocked) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                          else if (isActive) e.currentTarget.style.boxShadow = "0 0 10px rgba(229,0,61,0.2)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.background = "transparent";
                          else e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{t.replace(" 🔒", "")}</span>
                        </div>
                        {isLocked && <Lock size={12} color="var(--text-muted)" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", marginBottom: 4 }}>
            <span>Room Energy</span>
            <span>{fmt(fanCount)} in room</span>
          </div>
          <div className="room-energy-bar room-energy-fast" style={{ borderRadius: 999 }} />
        </div>
      </div>

      {/* Fixed CTA Buttons */}
      <div style={{ padding: "16px 16px 0", flexShrink: 0 }}>
        {tab === "Predictions" && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => { setMode("prediction"); setComposerPre("My prediction: "); }}
            className="btn-gradient"
            style={{ width: "100%", padding: "14px", borderRadius: 999, color: "white", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", border: "none", cursor: "pointer", margin: 0 }}
          >
            MAKE YOUR PREDICTION
          </motion.button>
        )}
        {tab === "Hot Takes" && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => { setMode("hottake"); setComposerPre(""); }}
            className="btn-gradient"
            style={{ width: "100%", padding: "14px", borderRadius: 999, color: "white", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", border: "none", cursor: "pointer", margin: 0 }}
          >
            DROP A HOT TAKE
          </motion.button>
        )}
        {tab === "Debate" && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => { setMode("debate"); setComposerPre("My debate side: "); }}
            className="btn-gradient"
            style={{ width: "100%", padding: "14px", borderRadius: 999, color: "white", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", border: "none", cursor: "pointer", margin: 0 }}
          >
            START A DEBATE
          </motion.button>
        )}
        {tab === "Memory" && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => { setMode("memory"); setComposerPre("Flashback: "); }}
            className="btn-gradient"
            style={{ width: "100%", padding: "14px", borderRadius: 999, color: "white", fontSize: 14, fontWeight: 700, letterSpacing: "0.06em", border: "none", cursor: "pointer", margin: 0 }}
          >
            SHARE A MEMORY
          </motion.button>
        )}
      </div>

      {/* Messages */}
      <div ref={listRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column-reverse", justifyContent: "flex-end", gap: 12 }}>
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
      <div style={{ position: "relative", padding: "10px 12px 32px", background: "rgba(14,14,20,0.92)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)", zIndex: 10, display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
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

        {/* Input row */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", position: "relative" }}>
          
          <button
            onClick={() => triggerUpload("image")}
            disabled={uploading}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", padding: 4 }}
            title="Upload Image"
          >
            <Image size={20} />
          </button>
          
          <div style={{ position: "relative" }} ref={modeMenuRef}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 18,
                fontWeight: 300,
                flexShrink: 0
              }}
            >
              {isModeMenuOpen ? "×" : "+"}
            </motion.button>

            <AnimatePresence>
              {isModeMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: 0,
                    marginBottom: 12,
                    background: "#1c1c21",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 16,
                    padding: "12px 8px",
                    width: 220,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
                    zIndex: 30,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4
                  }}
                >
                  <div style={{ padding: "0 8px 8px", fontSize: 10, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em" }}>POST AS</div>
                  {[
                    { id: "hottake", title: "Fire", subtitle: "Hot take, no filter", icon: "🔥", preset: "", activeBg: "rgba(239, 68, 68, 0.15)" },
                    { id: "prediction", title: "Predict", subtitle: "Forecast what's next", icon: "📈", preset: "My prediction: ", activeBg: "rgba(255, 184, 0, 0.15)" },
                    { id: "debate", title: "Bold Take", subtitle: "Controversial opinion", icon: "⚡", preset: "My debate side: ", activeBg: "rgba(233, 30, 140, 0.15)" },
                    { id: "memory", title: "Memory", subtitle: "Share a flashback", icon: "⏱️", preset: "Flashback: ", activeBg: "rgba(0, 232, 198, 0.15)" },
                    { id: "chat", title: "Normal Post", subtitle: "Just chatting", icon: "✒️", preset: "", activeBg: "rgba(255,255,255,0.1)" }
                  ].map((item) => {
                    const active = mode === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setMode(item.id as any);
                          setComposerPre(item.preset);
                          setIsModeMenuOpen(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px",
                          borderRadius: 12,
                          background: active ? item.activeBg : "transparent",
                          border: "none",
                          color: "white",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => !active && (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                        onMouseLeave={(e) => !active && (e.currentTarget.style.background = "transparent")}
                      >
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <span style={{ fontSize: 20 }}>{item.icon}</span>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: 15, fontWeight: 600 }}>{item.title}</span>
                            <span style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{item.subtitle}</span>
                          </div>
                        </div>
                        {active && <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#e91e8c", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "white", fontSize: 10 }}>✓</span></div>}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="text"
              placeholder={uploading ? "Uploading media..." : "Drop your take..."}
              disabled={uploading}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              style={{ width: "100%", height: 44, borderRadius: 22, background: "var(--bg-secondary)", border: "1px solid var(--border)", paddingLeft: 16, paddingRight: 16, color: "white", fontSize: 14, outline: "none" }}
            />
            {(() => {
              const selectedItem = [
                { id: "hottake", title: "Fire", subtitle: "Hot take, no filter", icon: "🔥", color: "#f87171" },
                { id: "prediction", title: "Predict", subtitle: "Forecast what's next", icon: "📈", color: "var(--gold)" },
                { id: "debate", title: "Bold Take", subtitle: "Controversial opinion", icon: "⚡", color: "#e91e8c" },
                { id: "memory", title: "Memory", subtitle: "Share a flashback", icon: "⏱️", color: "#00e8c6" },
                { id: "chat", title: "Normal Post", subtitle: "Just chatting", icon: "✒️", color: "#fff" }
              ].find(i => i.id === mode);
              
              if (!selectedItem || selectedItem.id === "chat") return null;
              return (
                <div style={{ position: "absolute", top: "100%", left: 16, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13 }}>{selectedItem.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: selectedItem.color }}>{selectedItem.title}</span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", marginLeft: 2 }}>{selectedItem.subtitle}</span>
                </div>
              );
            })()}
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={send}
            disabled={uploading}
            style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent-gradient)", border: "none", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: uploading ? 0.5 : 1, flexShrink: 0 }}
          >
            ↑
          </motion.button>
        </div>
      </div>
    </div>
  );
}
