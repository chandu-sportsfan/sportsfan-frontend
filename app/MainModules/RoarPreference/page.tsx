"use client";

/**
 * /MainModules/Preferences/page.tsx
 *
 * Edit all ROAR preferences: sports, teams, and tenure/badge.
 * Pre-fills from GET /api/roar/profile, saves via PATCH /api/roar/profile.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// ─── constants ────────────────────────────────────────────────────────────────

const TEAMS = [
  { id: "India",  emoji: "🇮🇳", label: "India",    color: "#FF9800", sport: "cricket"  },
  { id: "Pak",    emoji: "🇵🇰", label: "Pakistan", color: "#4CAF50", sport: "cricket"  },
  { id: "Aus",    emoji: "🇦🇺", label: "Aus",      color: "#FFEB3B", sport: "cricket"  },
  { id: "Eng",    emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", label: "England",  color: "#F44336", sport: "cricket"  },
  { id: "MI",     emoji: "💙",  label: "MI",       color: "#1565C0", sport: "cricket"  },
  { id: "CSK",    emoji: "💛",  label: "CSK",      color: "#FFCC00", sport: "cricket"  },
  { id: "RCB",    emoji: "❤️",  label: "RCB",      color: "#B71C1C", sport: "cricket"  },
  { id: "KKR",    emoji: "💜",  label: "KKR",      color: "#6A1B9A", sport: "cricket"  },
  { id: "MCFC",   emoji: "🔵",  label: "MCFC",     color: "#1E88E5", sport: "football" },
  { id: "BFC",    emoji: "🔴",  label: "BFC",      color: "#E53935", sport: "football" },
  { id: "MohanB", emoji: "🟢",  label: "Mohun B",  color: "#43A047", sport: "football" },
  { id: "Kerala", emoji: "🟡",  label: "Kerala",   color: "#FDD835", sport: "football" },
];

const TENURE_OPTIONS = [
  {
    id: "rising",
    label: "Just getting started",
    sub: "2023+",
    badge: "RISING_FAN",
    chip: "Rising Fan ⭐",
    desc: "New to the game — fresh opinions, fresh takes.",
    badgeGradient: "linear-gradient(135deg,#44445A,#6B6B8A)",
    badgeIcon: "⭐",
  },
  {
    id: "seasoned",
    label: "Been here a while",
    sub: "2010–2022",
    badge: "SEASONED_FAN",
    chip: "Seasoned Fan 🏅",
    desc: "You've seen the highs and the lows. Still here.",
    badgeGradient: "linear-gradient(135deg,#8888A0,#666680)",
    badgeIcon: "🏅",
  },
  {
    id: "og",
    label: "OG Fan",
    sub: "Before 2010",
    badge: "OG_FAN",
    chip: "OG Fan 👑",
    desc: "Before the IPL, before T20. True fandom runs deep.",
    badgeGradient: "linear-gradient(135deg,#B87333,#CD7F32)",
    badgeIcon: "👑",
  },
];

const BADGE_MAP: Record<string, string> = {
  rising: "RISING_FAN",
  seasoned: "SEASONED_FAN",
  og: "OG_FAN",
};

// ─── types ────────────────────────────────────────────────────────────────────

interface ProfileData {
  user: {
    sports?: string[];
    teams?: string[];
    tenure?: string;
    badge?: string;
  };
}

// ─── tiny helpers ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[22px] tracking-[0.06em] text-[#F5F5FA] mb-3 font-['Bebas_Neue',sans-serif]">
      {children}
    </p>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] text-[#9494AD] mb-5 -mt-2 leading-relaxed">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="h-px bg-white/[0.06] my-6" />;
}

// ─── main component ───────────────────────────────────────────────────────────

export default function PreferencesPage() {
  const router = useRouter();

  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [sports, setSports]     = useState<string[]>(["cricket"]);
  const [teams, setTeams]       = useState<string[]>([]);
  const [tenure, setTenure]     = useState<string | null>(null);

  // ── load existing prefs ───────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get<ProfileData>("/api/roar/profile");
        if (res.data?.user) {
          const u = res.data.user;
          setSports(u.sports?.length ? u.sports : ["cricket"]);
          setTeams(u.teams ?? []);
          const tenureFromBadge: Record<string, string> = {
            OG_FAN: "og",
            SEASONED_FAN: "seasoned",
            RISING_FAN: "rising",
          };
          setTenure(
            u.tenure ?? (u.badge ? tenureFromBadge[u.badge] ?? "rising" : "rising")
          );
        }
      } catch (err: any) {
        if (err.response?.status === 404 || err.response?.status === 401) {
          router.replace("/MainModules/ROAR");
        } else {
          setError("Failed to load preferences. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  // ── toggle helpers ────────────────────────────────────────────────────────
  const toggleSport = (id: string) =>
    setSports((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const toggleTeam = (id: string) =>
    setTeams((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  // ── save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!sports.length || !tenure) return;
    setSaving(true);
    setError(null);
    try {
      await axios.patch("/api/roar/profile", {
        sports,
        teams,
        tenure,
        badge: BADGE_MAP[tenure] ?? "RISING_FAN",
      });
      setSaved(true);
      setTimeout(() => router.back(), 1200);
    } catch {
      setError("Failed to save preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const canSave = sports.length > 0 && !!tenure && !saving;
  const visibleTeams = sports.length === 0 ? TEAMS : TEAMS.filter((t) => sports.includes(t.sport));

  // ── loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] text-[#F5F5FA] font-['DM_Sans',sans-serif]">
        <style>{KEYFRAMES_CSS}</style>
        <div className="max-w-[560px] mx-auto px-5 py-6 space-y-4">
          <div className="h-8 w-40 rounded-xl bg-white/[0.06] animate-[pref-shimmer_1.5s_ease-in-out_infinite]" />
          <div className="h-20 w-full rounded-2xl bg-white/[0.06] animate-[pref-shimmer_1.5s_ease-in-out_infinite]" />
          <div className="h-20 w-full rounded-2xl bg-white/[0.06] animate-[pref-shimmer_1.5s_ease-in-out_infinite]" />
          <div className="h-36 w-full rounded-2xl bg-white/[0.06] animate-[pref-shimmer_1.5s_ease-in-out_infinite] mt-6" />
          <div className="h-48 w-full rounded-2xl bg-white/[0.06] animate-[pref-shimmer_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    );
  }

  // ── main render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050508] text-[#F5F5FA] font-['DM_Sans',sans-serif] flex flex-col">
      <style>{KEYFRAMES_CSS}</style>

      {/* ── sticky header ── */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-[14px] bg-[rgba(5,5,8,0.92)] backdrop-blur-xl border-b border-white/[0.06]">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#F5F5FA] flex items-center justify-center cursor-pointer flex-shrink-0 hover:bg-white/10 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <h1
          className="text-[28px] tracking-[0.08em] m-0 font-['Bebas_Neue',sans-serif]"
          style={{
            background: "linear-gradient(135deg,#E91E8C,#FF6B35)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Preferences
        </h1>

        <div className="w-9" />
      </div>

      {/* ── scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 max-w-[560px] w-full mx-auto box-border">

        {/* ── error banner ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-300 text-[13px] mb-5"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════════════
            SECTION 1 — SPORT
        ════════════════════ */}
        <section className="mb-2">
          <SectionLabel>Your Sport</SectionLabel>
          <SubLabel>Pick the sports you follow. This shapes your entire feed.</SubLabel>

          <div className="flex flex-col gap-3">
            {[
              { id: "cricket",  emoji: "🏏", label: "Cricket",  fans: "492M"   },
              { id: "football", emoji: "⚽", label: "Football", fans: "138.7M" },
            ].map((sp) => {
              const sel = sports.includes(sp.id);
              return (
                <motion.button
                  key={sp.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleSport(sp.id)}
                  className={[
                    "flex gap-4 items-center px-5 py-4 rounded-3xl cursor-pointer text-left w-full relative transition-colors",
                    sel
                      ? "border-2 border-[#E91E8C] bg-gradient-to-br from-[rgba(233,30,140,0.1)] to-[rgba(255,107,53,0.05)]"
                      : "border-2 border-[#252538] bg-[#0E0E14]",
                  ].join(" ")}
                >
                  <span className="text-4xl">{sp.emoji}</span>
                  <div className="text-left">
                    <p className="font-['Bebas_Neue',sans-serif] text-[26px] leading-none">
                      {sp.label}
                    </p>
                    <p className="text-[12px] text-[#4A4A62] mt-0.5">
                      {sp.fans} fans on ROAR
                    </p>
                  </div>
                  {sel && (
                    <div className="ml-auto w-6 h-6 rounded-full bg-[#E91E8C] flex items-center justify-center text-[13px] text-white flex-shrink-0">
                      ✓
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        <Divider />

        {/* ════════════════════
            SECTION 2 — TEAMS
        ════════════════════ */}
        <section className="mb-2">
          <SectionLabel>Your Teams</SectionLabel>
          <SubLabel>
            {sports.length === 0
              ? "Select a sport above to see teams."
              : "Tap to follow. Your feed will highlight these teams."}
          </SubLabel>

          <AnimatePresence mode="wait">
            <motion.div
              key={sports.join(",")}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-4 gap-3"
            >
              {visibleTeams.map((t) => {
                const sel = teams.includes(t.id);
                return (
                  <motion.button
                    key={t.id}
                    whileTap={{ scale: 0.93 }}
                    animate={{ scale: sel ? 1.06 : 1 }}
                    onClick={() => toggleTeam(t.id)}
                    className={[
                      "flex flex-col items-center gap-1.5 bg-transparent border-none cursor-pointer p-1 rounded-full",
                      sel ? "outline outline-[3px] outline-[#E91E8C]" : "",
                    ].join(" ")}
                  >
                    <span
                      className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-[22px]"
                      style={{ background: `${t.color}33` }}
                    >
                      {t.emoji}
                    </span>
                    <span
                      className={[
                        "text-[10px]",
                        sel ? "text-[#F5F5FA] font-bold" : "text-[#9494AD] font-normal",
                      ].join(" ")}
                    >
                      {t.label}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </section>

        <Divider />

        {/* ════════════════════════
            SECTION 3 — TENURE
        ════════════════════════ */}
        <section className="mb-2">
          <SectionLabel>Fan Tenure</SectionLabel>
          <SubLabel>This sets your legacy badge — it shows on every post you make.</SubLabel>

          <div className="flex flex-col gap-3">
            {TENURE_OPTIONS.map((opt) => {
              const sel = tenure === opt.id;
              return (
                <motion.button
                  key={opt.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTenure(opt.id)}
                  className={[
                    "px-5 py-[18px] rounded-3xl bg-[#0E0E14] text-left cursor-pointer transition-colors w-full relative",
                    sel ? "border-2 border-[#E91E8C]" : "border-2 border-[#252538]",
                  ].join(" ")}
                >
                  {/* top row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-[15px] text-[#F5F5FA]">{opt.label}</p>
                      <p className="text-[12px] text-[#9494AD] mt-0.5">{opt.sub}</p>
                    </div>
                    {sel && (
                      <div className="w-[22px] h-[22px] rounded-full bg-[#E91E8C] flex items-center justify-center text-[12px] text-white flex-shrink-0">
                        ✓
                      </div>
                    )}
                  </div>

                  {/* badge chip */}
                  <span className="inline-block mt-2.5 text-[12px] px-3 py-1 rounded-full bg-[#16161F] text-[#E91E8C]">
                    {opt.chip}
                  </span>

                  {/* expanded badge detail */}
                  <AnimatePresence>
                    {sel && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3.5 p-3 rounded-2xl bg-[rgba(233,30,140,0.07)] border border-[rgba(233,30,140,0.18)]">
                          <p className="text-[10px] text-[#E91E8C] font-extrabold tracking-[0.08em] uppercase mb-1.5">
                            Your Badge
                          </p>
                          <div className="flex items-center gap-2.5">
                            {/* hexagon badge icon */}
                            <div
                              className="w-10 h-10 flex items-center justify-center text-[18px] flex-shrink-0"
                              style={{
                                clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                                background: opt.badgeGradient,
                              }}
                            >
                              {opt.badgeIcon}
                            </div>
                            <div>
                              <p className="font-bold text-[13px] text-[#F5F5FA]">
                                {opt.chip.replace(/[⭐🏅👑]/g, "").trim()}
                              </p>
                              <p className="text-[11px] text-[#4A4A62] mt-0.5">{opt.desc}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ── save bar (normal flow, not fixed) ── */}
        <div className="py-6 pb-10 max-w-[520px] mx-auto w-full">
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.div
                key="saved"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center px-8 py-[14px] rounded-full bg-green-500/10 border border-green-500/30 text-[#00C853] text-[15px] font-bold"
              >
                ✓ Preferences saved
              </motion.div>
            ) : (
              <motion.button
                key="save"
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={!canSave}
                className={[
                  "w-full py-[15px] rounded-full text-white font-['Bebas_Neue',sans-serif] text-[18px] tracking-[0.08em] border-none font-bold transition-opacity",
                  canSave ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-45",
                ].join(" ")}
                style={{
                  background: "linear-gradient(135deg,#E91E8C,#FF6B35)",
                  boxShadow: "0 6px 28px rgba(233,30,140,0.4)",
                }}
              >
                {saving ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span
                      className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-[pref-spin_0.7s_linear_infinite]"
                    />
                    Saving…
                  </span>
                ) : (
                  "Save Preferences"
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

// ─── keyframe CSS (only what Tailwind can't do) ───────────────────────────────

const KEYFRAMES_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

@keyframes pref-spin {
  to { transform: rotate(360deg); }
}
@keyframes pref-shimmer {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 0.9; }
}
`;