import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AvatarWithBadge from "../components/AvatarWithBadge";
import { FilterPills } from "../components/shared";
import { BADGE_CONFIG, BADGE_DETAIL, BADGE_LABELS, BADGES_LIST, RIVAL, CURRENT_USER } from "../constants";
import { fmt } from "../utils";

interface Props {
  userBadge: string;
  setUserBadge: (b: string) => void;
  onCompose: () => void;
  onToast: (m: string) => void;
  setOnboarded?: (b: boolean) => void;
}

function AccuracyRing({ percent }: { percent: number }) {
  const displayPercent = isNaN(percent) ? 0 : percent;
  const size = 52, stroke = 4, r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const [off, setOff] = useState(circ);

  useEffect(() => {
    const t = setTimeout(() => setOff(circ - (displayPercent / 100) * circ), 200);
    return () => clearTimeout(t);
  }, [circ, displayPercent]);

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="acc-g-roar">
            <stop offset="0%" stopColor="#E91E8C" />
            <stop offset="100%" stopColor="#FF6B35" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#acc-g-roar)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset 1s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
        <span className="font-display" style={{ fontSize: 13, fontWeight: "bold", color: "#fff" }}>{displayPercent}%</span>
        <span style={{ fontSize: 7, color: "var(--text-muted)", marginTop: 2 }}>Accuracy</span>
      </div>
    </div>
  );
}

export default function Profile({ userBadge, setUserBadge, onCompose, onToast, setOnboarded }: Props) {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [predTab, setPredTab] = useState("All");
  const [badgeModal, setBadgeModal] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [fanMatchOpen, setFanMatchOpen] = useState(false);
  const [rivalFollowed, setRivalFollowed] = useState(false);
  const [editName, setEditName] = useState("");
  const [editFavPlayer, setEditFavPlayer] = useState("");
  const [editAbout, setEditAbout] = useState("");
  const [editShowPredHistory, setEditShowPredHistory] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/roar/profile");
        if (res.data?.success) {
          setProfileData(res.data);
          if (res.data.user?.badge) setUserBadge(res.data.user.badge);
          if (res.data.user?.username) setEditName(res.data.user.username);
          if (res.data.user?.favPlayer !== undefined) setEditFavPlayer(res.data.user.favPlayer || "");
          if (res.data.user?.about !== undefined) setEditAbout(res.data.user.about || "");
          if (res.data.user?.showPredHistory !== undefined) setEditShowPredHistory(res.data.user.showPredHistory !== false);
        }
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 404) {
          try { localStorage.removeItem("roar_v2_complete"); } catch {}
          setOnboarded?.(false);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setUserBadge, setOnboarded]);

  if (loading || !profileData) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "var(--text-muted)" }}>Loading profile...</div>;
  }

  const user = profileData.user || CURRENT_USER;
  const badges = profileData.badges?.length > 0 ? profileData.badges : BADGES_LIST;
  const predictions = profileData.predictions || [];
  const hotTakes = profileData.hotTakes || [];
  const rival = profileData.rival || RIVAL;

  const filteredPreds = predictions.filter((p: any) =>
    predTab === "All" ||
    (predTab === "Correct" && (p.status === "settled_correct" || p.status === "CORRECT")) ||
    (predTab === "Wrong" && (p.status === "settled_wrong" || p.status === "WRONG")) ||
    (predTab === "Pending" && (p.status === "active" || p.status === "PENDING")),
  );

  const unlocked = badges.filter((b: any) => b.unlocked).length;

  const inputStyle: React.CSSProperties = { width: "100%", height: 48, borderRadius: 14, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", padding: "0 14px", color: "white", fontSize: 15, marginBottom: 16, outline: "none", boxSizing: "border-box" };

  return (
    <div className="screen-scroll">
      {/* ── Header ── */}
      <div style={{ padding: "24px 16px 0", textAlign: "center", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "center", position: "relative", width: 96, margin: "0 auto" }}>
          <AvatarWithBadge username={user.username || CURRENT_USER.username} badge={userBadge} size="lg" />
          <div onClick={() => onToast("Upload avatar feature coming soon!")} style={{ position: "absolute", bottom: 0, right: 4, width: 20, height: 20, borderRadius: "50%", background: "var(--accent-magenta)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--bg-primary)", color: "#fff", fontSize: 12, fontWeight: 900, cursor: "pointer" }}>+</div>
        </div>
        <h1 className="font-display" style={{ fontSize: 32, letterSpacing: "0.04em", marginTop: 14, color: "#fff" }}>{user.username ? user.username.toUpperCase() : "ROARFAN"}</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>@{user.handle || CURRENT_USER.handle}</p>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>Fan since {user.fanSince || CURRENT_USER.fanSince} · {user.yearsFandom || CURRENT_USER.yearsFandom || 1} years · {BADGE_LABELS[userBadge]}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
          {["var(--accent-magenta)", "var(--teal)", "var(--accent-orange)"].map((bg, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: bg }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
          <button onClick={() => setEditOpen(true)} style={{ flex: 1, maxWidth: 140, padding: "10px 0", background: "none", border: "1px solid var(--border)", borderRadius: 24, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Edit Profile</button>
          <button onClick={() => setShareOpen(true)} className="btn-gradient" style={{ flex: 1, maxWidth: 140, padding: "10px 0", border: "none", borderRadius: 24, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Share Profile</button>
        </div>
      </div>

      {/* ── Stats (4-col) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: "20px 16px 0" }}>
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 4px", minHeight: 74 }}>
          <AccuracyRing percent={user.accuracy || 0} />
        </div>
        {[
          { value: user.predictionCount || 0, label: "Predictions" },
          { value: user.hotTakeCount || 0, label: "Hot Takes" },
          { value: fmt(user.reputationScore || 0), label: "Rep" },
        ].map(({ value, label }) => (
          <div key={label} className="glass-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 4px", minHeight: 74, textAlign: "center" }}>
            <span className="font-display" style={{ fontSize: 22, color: "#fff", lineHeight: 1 }}>{value}</span>
            <span style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 4 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Rival ── */}
      <div style={{ padding: "24px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 18, color: "var(--accent-magenta)", letterSpacing: "0.05em" }}>YOUR RIVAL THIS MONTH</h3>
          <span style={{ fontSize: 11, color: "var(--accent-magenta)", fontWeight: 600, cursor: "pointer" }} onClick={() => setFanMatchOpen(true)}>See Fan Match →</span>
        </div>
        <div className="gradient-border" style={{ padding: 16, background: "rgba(22, 22, 31, 0.6)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <AvatarWithBadge username={rival.fan?.username || RIVAL.fan.username} badge={rival.badge || RIVAL.badge} size="md" />
            <div>
              <h4 className="font-display" style={{ fontSize: 16, color: "#fff", letterSpacing: "0.03em" }}>
                {(rival.fan?.username || RIVAL.fan.username).toUpperCase()} · {BADGE_LABELS[rival.badge || RIVAL.badge]?.toUpperCase()}
              </h4>
              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "var(--text-secondary)" }}><strong style={{ color: "#fff" }}>{rival.disagreements || RIVAL.disagreements}</strong> DISAGREEMENTS</span>
                <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>They won: <strong style={{ color: "var(--wrong-red)" }}>{rival.rivalWins || RIVAL.rivalWins}</strong></span>
                <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>You won: <strong style={{ color: "var(--correct-green)" }}>{rival.yourWins || RIVAL.yourWins}</strong></span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 12, fontStyle: "italic", lineHeight: 1.4, paddingLeft: 8, borderLeft: "2px solid var(--accent-magenta)" }}>
            {rival.topDisagreement || RIVAL.topDisagreement}
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button onClick={() => setRivalFollowed(!rivalFollowed)} style={{ flex: 1, padding: "8px 0", fontSize: 12, fontWeight: 700, border: "1px solid var(--border)", background: rivalFollowed ? "rgba(255,255,255,0.08)" : "none", color: "#fff", borderRadius: 20, cursor: "pointer" }}>
              {rivalFollowed ? "✓ Following" : "Follow Rival"}
            </button>
            <button onClick={() => onToast("Challenged rival to a prediction duel!")} className="btn-gradient" style={{ flex: 1, padding: "8px 0", fontSize: 12, borderRadius: 20, border: "none", cursor: "pointer" }}>
              CHALLENGE →
            </button>
          </div>
        </div>
      </div>

      {/* ── Badges ── */}
      <div style={{ padding: "24px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>
            YOUR BADGES <span style={{ color: "var(--text-muted)" }}>{unlocked}/{badges.length}</span>
          </h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, padding: "4px 8px" }}>
          {badges.map((b: any) => {
            const cfg = BADGE_CONFIG[b.badgeId || b.id] || BADGE_CONFIG.RISING_FAN;
            const isUnlocked = b.unlocked;
            return (
              <div key={b.badgeId || b.id} onClick={() => setBadgeModal(b)} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", opacity: isUnlocked ? 1 : 0.4 }}>
                <div style={{ position: "relative", width: 68, height: 76, background: isUnlocked && cfg.gradient ? `linear-gradient(135deg, ${cfg.gradient[0]}, ${cfg.gradient[1] || cfg.gradient[0]})` : "rgba(255,255,255,0.06)", clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isUnlocked ? "0 4px 12px rgba(0,0,0,0.3)" : "none" }}>
                  <div style={{ position: "absolute", inset: 2, background: isUnlocked ? "none" : "var(--bg-primary)", clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                    {cfg.icon}
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", marginTop: 8, textAlign: "center" }}>{cfg.name?.toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Calls ── */}
      <div style={{ padding: "24px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>YOUR CALLS</h3>
          <span style={{ fontSize: 11, color: "var(--live-green)", fontWeight: 700 }}>{user.accuracy || 0}% accurate</span>
        </div>
        <div style={{ overflow: "hidden", paddingBottom: 10 }}>
          <FilterPills options={["All", "Correct", "Wrong", "Pending"]} active={predTab} onChange={setPredTab} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredPreds.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)", fontSize: 13 }}>No calls found.</p>
          ) : (
            filteredPreds.map((p: any) => {
              const isCorrect = p.status === "CORRECT" || p.status === "settled_correct";
              const isWrong = p.status === "WRONG" || p.status === "settled_wrong";
              const statusText = isCorrect ? "CORRECT" : isWrong ? "WRONG" : "PENDING";
              const statusColor = isCorrect ? "var(--correct-green)" : isWrong ? "var(--wrong-red)" : "var(--pending-amber)";

              return (
                <div key={p.id || p.postId} className="glass-card" style={{ padding: 14, background: "rgba(22, 22, 31, 0.4)", border: "1px solid rgba(255,255,255,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>{p.matchId || "GENERAL"}</span>
                    <span style={{ fontSize: 10, fontWeight: 900, color: statusColor, background: `${statusColor}18`, padding: "2px 6px", borderRadius: 4 }}>{statusText}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#fff", lineHeight: 1.4 }}>{p.text}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "Today"}
                    </span>
                    <button onClick={() => onToast("Shared call legacy link!")} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 10, cursor: "pointer", textDecoration: "underline" }}>Share</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Takes ── */}
      <div style={{ padding: "24px 16px 80px" }}>
        <h3 className="font-display" style={{ fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 12 }}>YOUR TAKES</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {hotTakes.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)", fontSize: 13 }}>No hot takes created.</p>
          ) : (
            hotTakes.map((ht: any) => {
              const agree = ht.agreeCount || 0;
              const disagree = ht.disagreeCount || 0;
              const total = agree + disagree || 1;
              const agreePct = Math.round((agree / total) * 100) || 50;

              return (
                <div key={ht.id || ht.postId} className="glass-card" style={{ padding: 14, background: "rgba(22, 22, 31, 0.4)", border: "1px solid rgba(255,255,255,0.03)" }}>
                  <p style={{ fontSize: 14, color: "#fff", lineHeight: 1.4, marginBottom: 10 }}>{ht.text}</p>
                  <div style={{ position: "relative", width: "100%", height: 16, background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${agreePct}%`, background: "var(--accent-gradient)", transition: "width 1s" }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px", fontSize: 9, fontWeight: 700, color: "#fff" }}>
                      <span>{agreePct}% Agree</span>
                      <span>{100 - agreePct}% Disagree</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Edit Profile Modal ── */}
      <AnimatePresence>
        {editOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "absolute", inset: 0, zIndex: 110, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={() => setEditOpen(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 300 }} onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "rgba(18,18,28,0.98)", borderRadius: "28px 28px 0 0", border: "1px solid rgba(255,255,255,0.08)", padding: "20px 20px 36px", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.18)" }} />
              </div>
              <h3 className="font-display" style={{ fontSize: 22, marginBottom: 20, letterSpacing: "0.05em" }}>EDIT PROFILE</h3>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 6 }}>Display name</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={inputStyle} />
              <label style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 6 }}>Favourite player</label>
              <input type="text" value={editFavPlayer} onChange={(e) => setEditFavPlayer(e.target.value)} placeholder="e.g. Rohit Sharma" style={inputStyle} />
              <label style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 6 }}>About me (140 chars)</label>
              <textarea value={editAbout} onChange={(e) => setEditAbout(e.target.value.slice(0, 140))} rows={4} style={{ width: "100%", borderRadius: 14, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 14px", color: "white", fontSize: 14, marginBottom: 16, outline: "none", resize: "vertical", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box" }} />
              <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, cursor: "pointer" }}>
                <input type="checkbox" checked={editShowPredHistory} onChange={(e) => setEditShowPredHistory(e.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--accent-magenta)", cursor: "pointer", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>Show prediction history to other fans</span>
              </label>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="btn-gradient"
                onClick={async () => {
                  try {
                    await axios.patch("/api/roar/profile", { username: editName, favPlayer: editFavPlayer, about: editAbout, showPredHistory: editShowPredHistory });
                    setEditOpen(false);
                    onToast("Profile updated successfully");
                  } catch { onToast("Failed to update profile"); }
                }}
                style={{ width: "100%", padding: "16px 0", borderRadius: 999, fontSize: 16, fontWeight: 800, border: "none", cursor: "pointer", letterSpacing: "0.06em" }}
              >
                SAVE
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Share Modal ── */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShareOpen(false)} style={{ position: "absolute", inset: 0, zIndex: 110, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="glass-card" style={{ width: "100%", maxWidth: 300, padding: 24, textAlign: "center", background: "var(--bg-secondary)" }}>
              <div style={{ display: "inline-flex", width: 54, height: 54, borderRadius: "50%", background: "rgba(0,230,118,0.1)", alignItems: "center", justifyContent: "center", color: "var(--live-green)", fontSize: 24, marginBottom: 14 }}>✓</div>
              <h3 className="font-display" style={{ fontSize: 24, marginBottom: 8 }}>LEGACY SHARE LINK</h3>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4, marginBottom: 16 }}>Share your prediction accuracy and unlocked legacy badges!</p>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); setShareOpen(false); onToast("Link copied to clipboard!"); }} className="btn-gradient" style={{ width: "100%", padding: "12px 0", border: "none", borderRadius: 12, cursor: "pointer" }}>
                Copy Link
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Badge Detail Modal ── */}
      <AnimatePresence>
        {badgeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBadgeModal(null)} style={{ position: "absolute", inset: 0, zIndex: 110, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="glass-card" style={{ width: "100%", maxWidth: 300, padding: 20, textAlign: "center", background: "var(--bg-secondary)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{BADGE_CONFIG[badgeModal.badgeId || badgeModal.id]?.icon}</div>
              <h3 className="font-display" style={{ fontSize: 26, marginBottom: 4 }}>{BADGE_CONFIG[badgeModal.badgeId || badgeModal.id]?.name}</h3>
              <p style={{ fontSize: 10, color: "var(--accent-magenta)", fontWeight: 700, letterSpacing: "0.05em" }}>{badgeModal.unlocked ? "UNLOCKED" : "LOCKED"}</p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 10, lineHeight: 1.4 }}>{BADGE_DETAIL[badgeModal.badgeId || badgeModal.id]?.description || "Unlock by building your legacy!"}</p>
              <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, margin: "16px 0 6px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${badgeModal.progress}%`, background: "var(--accent-magenta)" }} />
              </div>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Progress: {badgeModal.progress}%</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fan Match Modal ── */}
      <AnimatePresence>
        {fanMatchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFanMatchOpen(false)} style={{ position: "absolute", inset: 0, zIndex: 110, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="glass-card" style={{ width: "100%", maxWidth: 320, padding: 20, background: "var(--bg-secondary)" }}>
              <h3 className="font-display" style={{ fontSize: 24, marginBottom: 4, textAlign: "center", color: "#fff" }}>YOUR FAN MATCH TRIBE</h3>
              <p style={{ fontSize: 11, color: "var(--text-secondary)", textAlign: "center", lineHeight: 1.4, marginBottom: 16 }}>We analyzed your takes & predictions to find similar fans.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { username: "Rahul_77", badge: "BOLD_CALLER", similarity: 72 },
                  { username: "StatsKing_99", badge: "ORACLE", similarity: 68 },
                  { username: "MumbaiMagic", badge: "RISING_FAN", similarity: 61 },
                ].map((fan) => (
                  <div key={fan.username} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <AvatarWithBadge username={fan.username} badge={fan.badge} size="sm" />
                      <div>
                        <h4 className="font-display" style={{ fontSize: 14, color: "#fff" }}>{fan.username.toUpperCase()}</h4>
                        <p style={{ fontSize: 10, color: "var(--text-muted)" }}>{BADGE_LABELS[fan.badge]}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 16, fontWeight: 800 }}>{fan.similarity}%</span>
                      <p style={{ fontSize: 8, color: "var(--text-muted)" }}>Match</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setFanMatchOpen(false)} className="btn-gradient" style={{ width: "100%", marginTop: 18, padding: "12px 0", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 13 }}>Close Tribe</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
