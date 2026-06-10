import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AvatarWithBadge from "../components/AvatarWithBadge";
import { TENURE_OPTIONS, TEAMS, HOT_TAKE_PREVIEWS, BADGE_DETAIL } from "../constants";

interface Props {
  onComplete: (prefs: any) => void;
}

const SLIDE = {
  enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
};

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [sports, setSports] = useState<string[]>(["cricket"]);
  const [teams, setTeams] = useState<string[]>(["India", "MI"]);
  const [tenure, setTenure] = useState<string | null>(null);
  const [firstVote, setFirstVote] = useState<string | null>(null);
  const [showLive, setShowLive] = useState(false);

  const selectedTenure = TENURE_OPTIONS.find((t) => t.id === tenure);

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  const handleCompleteOnboarding = async () => {
    try {
      const contributionText =
        firstVote === "agree" || firstVote === "disagree"
          ? sports.includes("cricket")
            ? "Virat Kohli in 2025 is better than Sachin Tendulkar ever was. Change my mind."
            : "ISL is now world-class football. Change my mind."
          : firstVote;

      await axios.post("/api/roar/onboarding", {
        sports,
        teams,
        tenure,
        badge: selectedTenure?.badge || "RISING_FAN",
        firstContribution: contributionText,
      });

      onComplete({
        sports,
        teams,
        tenure,
        badge: selectedTenure?.badge || "RISING_FAN",
        firstContribution: contributionText,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        position: "absolute", inset: 0, zIndex: 50,
        background: "var(--bg-primary)", overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: 48, paddingBottom: 16 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: 8, borderRadius: 4, transition: "all 0.3s",
              width: i <= step ? 24 : 8,
              background: i <= step ? "var(--accent-magenta)" : "var(--border)",
            }}
          />
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", position: "relative" }}>
        <AnimatePresence mode="wait" custom={dir}>

          {/* Step 0 — splash */}
          {step === 0 && (
            <motion.div
              key="s0" custom={dir} variants={SLIDE}
              initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "75vh", padding: "0 32px", textAlign: "center" }}
            >
              <h1 className="logotype" style={{ fontSize: 96, lineHeight: 1, letterSpacing: "0.1em" }}>ROAR</h1>
              <p style={{ color: "var(--text-secondary)", marginTop: 16 }}>Your sport. Your voice. Your reputation.</p>
              <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 8 }}>Where Indian fans build their legacy</p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => go(1)}
                className="btn-gradient btn-pulse"
                style={{ marginTop: 48, width: "100%", maxWidth: 280, height: 52, borderRadius: 999, fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.1em", border: "none", cursor: "pointer" }}
              >
                I'M A FAN →
              </motion.button>
            </motion.div>
          )}

          {/* Step 1 — sport + teams */}
          {step === 1 && (
            <motion.div
              key="s1" custom={dir} variants={SLIDE}
              initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
              style={{ padding: "0 24px 40px" }}
            >
              <h2 className="font-display" style={{ fontSize: 40, lineHeight: 1.1, marginBottom: 8 }}>Claim your allegiance.</h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>This is how other fans will know you</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { id: "cricket", emoji: "🏏", label: "Cricket", fans: "492M" },
                  { id: "football", emoji: "⚽", label: "Football", fans: "138.7M" },
                ].map((sp) => {
                  const sel = sports.includes(sp.id);
                  return (
                    <motion.button
                      key={sp.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSports((p) => p.includes(sp.id) ? p.filter((x) => x !== sp.id) : [...p, sp.id])}
                      className={sel ? "gradient-border" : ""}
                      style={{
                        display: "flex", gap: 16, alignItems: "center",
                        padding: "16px 20px", borderRadius: 24,
                        border: `2px solid ${sel ? "transparent" : "var(--border)"}`,
                        background: "var(--bg-secondary)", cursor: "pointer", textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: 40 }}>{sp.emoji}</span>
                      <div>
                        <p className="font-display" style={{ fontSize: 28, lineHeight: 1 }}>{sp.label}</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{sp.fans} fans on ROAR</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <p className="font-display" style={{ fontSize: 22, marginTop: 28, marginBottom: 12 }}>Pick your teams</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {TEAMS.map((t) => {
                  const sel = teams.includes(t.id);
                  return (
                    <motion.button
                      key={t.id}
                      animate={{ scale: sel ? 1.08 : 1 }}
                      onClick={() => setTeams((p) => p.includes(t.id) ? p.filter((x) => x !== t.id) : [...p, t.id])}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                        background: "none", border: "none", cursor: "pointer",
                        outline: sel ? `3px solid var(--accent-magenta)` : undefined,
                        borderRadius: 999, padding: 4,
                      }}
                    >
                      <span style={{ width: 52, height: 52, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: `${t.color}44` }}>
                        {t.emoji}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>{t.label}</span>
                    </motion.button>
                  );
                })}
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => sports.length && go(2)}
                disabled={!sports.length}
                className="btn-gradient"
                style={{ width: "100%", marginTop: 28, height: 52, borderRadius: 999, fontSize: 16, border: "none", cursor: "pointer", opacity: sports.length ? 1 : 0.4 }}
              >
                THESE ARE MY TEAMS →
              </motion.button>
            </motion.div>
          )}

          {/* Step 2 — tenure */}
          {step === 2 && (
            <motion.div
              key="s2" custom={dir} variants={SLIDE}
              initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
              style={{ padding: "0 24px" }}
            >
              <h2 className="font-display" style={{ fontSize: 40, lineHeight: 1.1 }}>How long have you been a fan?</h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8, marginBottom: 24 }}>Your starter badge depends on this</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {TENURE_OPTIONS.map((opt) => {
                  const sel = tenure === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTenure(opt.id)}
                      style={{
                        padding: "20px", borderRadius: 24,
                        background: "var(--bg-secondary)",
                        border: `2px solid ${sel ? "var(--accent-magenta)" : "var(--border)"}`,
                        textAlign: "left", cursor: "pointer", transition: "border-color 0.2s",
                      }}
                    >
                      <p style={{ fontWeight: 700, fontSize: 15 }}>{opt.label}</p>
                      <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{opt.sub}</p>
                      <span style={{ display: "inline-block", marginTop: 10, fontSize: 12, padding: "4px 12px", borderRadius: 999, background: "var(--bg-tertiary)", color: "var(--accent-magenta)" }}>
                        {opt.chip}
                      </span>
                      {sel && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          style={{ marginTop: 14, padding: "12px", borderRadius: 16, background: "rgba(233,30,140,0.08)", border: "1px solid rgba(233,30,140,0.2)" }}
                        >
                          <p style={{ fontSize: 11, color: "var(--accent-magenta)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                            Your Starter Badge
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 44, height: 44,
                              clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                              background: opt.id === "og" ? "linear-gradient(135deg,#B87333,#CD7F32)" : opt.id === "seasoned" ? "linear-gradient(135deg,#8888A0,#666680)" : "linear-gradient(135deg,#44445A,#6B6B8A)",
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                            }}>
                              {opt.id === "og" ? "👑" : opt.id === "seasoned" ? "🏅" : "⭐"}
                            </div>
                            <div>
                              <p style={{ fontWeight: 700, fontSize: 14 }}>{opt.chip.replace(/[⭐🏅👑]/g, "").trim()}</p>
                              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{BADGE_DETAIL[opt.badge]?.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => tenure && go(3)}
                disabled={!tenure}
                className="btn-gradient"
                style={{ width: "100%", marginTop: 24, height: 52, borderRadius: 999, fontSize: 16, border: "none", cursor: "pointer", opacity: tenure ? 1 : 0.4 }}
              >
                CLAIM MY BADGE →
              </motion.button>
            </motion.div>
          )}

          {/* Step 3 — social proof */}
          {step === 3 && (
            <motion.div
              key="s3" custom={dir} variants={SLIDE}
              initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
              style={{ padding: "0 24px" }}
            >
              <h2 className="font-display" style={{ fontSize: 48, lineHeight: 1.1 }}>You're not alone.</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 28 }}>
                {[
                  { n: "492M", l: "Cricket fans" },
                  { n: "138.7M", l: "Football fans" },
                  { n: "1,247", l: "Debating now" },
                ].map((s) => (
                  <div key={s.l} style={{ textAlign: "center" }}>
                    <p className="font-display" style={{ fontSize: 28, color: "white" }}>{s.n}</p>
                    <p style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>{s.l}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 28, marginBottom: 12 }}>What fans are saying right now</p>
              {HOT_TAKE_PREVIEWS.map((ht) => (
                <div key={ht.id} className="glass-card" style={{ padding: "12px 16px", marginBottom: 8, opacity: 0.9 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                    <AvatarWithBadge username={ht.fan.username} badge={ht.fan.badge} size="sm" />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{ht.fan.username}</span>
                  </div>
                  <p style={{ fontSize: 13 }}>{ht.text}</p>
                </div>
              ))}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => go(4)}
                className="btn-gradient"
                style={{ width: "100%", marginTop: 24, height: 52, borderRadius: 999, fontSize: 16, border: "none", cursor: "pointer" }}
              >
                ENTER ROAR →
              </motion.button>
            </motion.div>
          )}

          {/* Step 4 — first take */}
          {step === 4 && (
            <motion.div
              key="s4" custom={dir} variants={SLIDE}
              initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}
              style={{ padding: "0 24px 40px" }}
            >
              <h2 className="font-display" style={{ fontSize: 40, lineHeight: 1.1 }}>Before you go in —</h2>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>Drop one take. It takes 10 seconds. This is what ROAR is about.</p>
              <div className="glass-card" style={{ padding: 20, marginTop: 24 }}>
                <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.5 }}>
                  {sports.includes("cricket")
                    ? "Kohli in 2025 is better than Sachin ever was. Agree or disagree?"
                    : "ISL is now world-class football. Agree or disagree?"}
                </p>
              </div>
              {!firstVote ? (
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  {["agree", "disagree"].map((v) => (
                    <motion.button
                      key={v}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setFirstVote(v);
                        setTimeout(() => setShowLive(true), 400);
                      }}
                      style={{
                        flex: 1, padding: "16px", borderRadius: 20, fontSize: 18, fontWeight: 700, cursor: "pointer",
                        border: `2px solid ${v === "agree" ? "var(--accent-magenta)" : "var(--accent-orange)"}`,
                        background: "transparent",
                        color: v === "agree" ? "var(--accent-magenta)" : "var(--accent-orange)",
                      }}
                    >
                      {v === "agree" ? "Agree 🔥" : "Disagree 💀"}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 24, textAlign: "center" }}>
                  <p style={{ color: "var(--text-secondary)" }}>Your first take is live. 47 fans are about to see it.</p>
                  {showLive && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={handleCompleteOnboarding}
                      className="btn-gradient"
                      style={{ width: "100%", marginTop: 24, height: 52, borderRadius: 999, fontSize: 16, border: "none", cursor: "pointer" }}
                    >
                      LET'S GO →
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
