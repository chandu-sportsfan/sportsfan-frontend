// "use client";

// /**
//  * /MainModules/Preferences/page.tsx
//  *
//  * Edit all ROAR preferences: sports, teams, and tenure/badge.
//  * Pre-fills from GET /api/roar/profile, saves via PATCH /api/roar/profile.
//  */

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";

// // ─── constants ────────────────────────────────────────────────────────────────

// const TEAMS = [
//   { id: "India",  emoji: "🇮🇳", label: "India",    color: "#FF9800", sport: "cricket"  },
//   { id: "Pak",    emoji: "🇵🇰", label: "Pakistan", color: "#4CAF50", sport: "cricket"  },
//   { id: "Aus",    emoji: "🇦🇺", label: "Aus",      color: "#FFEB3B", sport: "cricket"  },
//   { id: "Eng",    emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", label: "England",  color: "#F44336", sport: "cricket"  },
//   { id: "MI",     emoji: "💙",  label: "MI",       color: "#1565C0", sport: "cricket"  },
//   { id: "CSK",    emoji: "💛",  label: "CSK",      color: "#FFCC00", sport: "cricket"  },
//   { id: "RCB",    emoji: "❤️",  label: "RCB",      color: "#B71C1C", sport: "cricket"  },
//   { id: "KKR",    emoji: "💜",  label: "KKR",      color: "#6A1B9A", sport: "cricket"  },
//   { id: "MCFC",   emoji: "🔵",  label: "MCFC",     color: "#1E88E5", sport: "football" },
//   { id: "BFC",    emoji: "🔴",  label: "BFC",      color: "#E53935", sport: "football" },
//   { id: "MohanB", emoji: "🟢",  label: "Mohun B",  color: "#43A047", sport: "football" },
//   { id: "Kerala", emoji: "🟡",  label: "Kerala",   color: "#FDD835", sport: "football" },
// ];

// const TENURE_OPTIONS = [
//   {
//     id: "rising",
//     label: "Just getting started",
//     sub: "2023+",
//     badge: "RISING_FAN",
//     chip: "Rising Fan ⭐",
//     desc: "New to the game — fresh opinions, fresh takes.",
//     badgeGradient: "linear-gradient(135deg,#44445A,#6B6B8A)",
//     badgeIcon: "⭐",
//   },
//   {
//     id: "seasoned",
//     label: "Been here a while",
//     sub: "2010–2022",
//     badge: "SEASONED_FAN",
//     chip: "Seasoned Fan 🏅",
//     desc: "You've seen the highs and the lows. Still here.",
//     badgeGradient: "linear-gradient(135deg,#8888A0,#666680)",
//     badgeIcon: "🏅",
//   },
//   {
//     id: "og",
//     label: "OG Fan",
//     sub: "Before 2010",
//     badge: "OG_FAN",
//     chip: "OG Fan 👑",
//     desc: "Before the IPL, before T20. True fandom runs deep.",
//     badgeGradient: "linear-gradient(135deg,#B87333,#CD7F32)",
//     badgeIcon: "👑",
//   },
// ];

// const BADGE_MAP: Record<string, string> = {
//   rising: "RISING_FAN",
//   seasoned: "SEASONED_FAN",
//   og: "OG_FAN",
// };

// // ─── types ────────────────────────────────────────────────────────────────────

// interface ProfileData {
//   user: {
//     sports?: string[];
//     teams?: string[];
//     tenure?: string;
//     badge?: string;
//   };
// }

// // ─── tiny helpers ─────────────────────────────────────────────────────────────

// function SectionLabel({ children }: { children: React.ReactNode }) {
//   return (
//     <p className="text-[22px] tracking-[0.06em] text-[#F5F5FA] mb-3 font-['Bebas_Neue',sans-serif]">
//       {children}
//     </p>
//   );
// }

// function SubLabel({ children }: { children: React.ReactNode }) {
//   return (
//     <p className="text-[13px] text-[#9494AD] mb-5 -mt-2 leading-relaxed">
//       {children}
//     </p>
//   );
// }

// function Divider() {
//   return <div className="h-px bg-white/[0.06] my-6" />;
// }

// // ─── main component ───────────────────────────────────────────────────────────

// export default function PreferencesPage() {
//   const router = useRouter();

//   const [loading, setLoading]   = useState(true);
//   const [saving, setSaving]     = useState(false);
//   const [saved, setSaved]       = useState(false);
//   const [error, setError]       = useState<string | null>(null);
//   const [sports, setSports]     = useState<string[]>(["cricket"]);
//   const [teams, setTeams]       = useState<string[]>([]);
//   const [tenure, setTenure]     = useState<string | null>(null);

//   // ── load existing prefs ───────────────────────────────────────────────────
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await axios.get<ProfileData>("/api/roar/profile");
//         if (res.data?.user) {
//           const u = res.data.user;
//           setSports(u.sports?.length ? u.sports : ["cricket"]);
//           setTeams(u.teams ?? []);
//           const tenureFromBadge: Record<string, string> = {
//             OG_FAN: "og",
//             SEASONED_FAN: "seasoned",
//             RISING_FAN: "rising",
//           };
//           setTenure(
//             u.tenure ?? (u.badge ? tenureFromBadge[u.badge] ?? "rising" : "rising")
//           );
//         }
//       } catch (err: any) {
//         if (err.response?.status === 404 || err.response?.status === 401) {
//           router.replace("/MainModules/ROAR");
//         } else {
//           setError("Failed to load preferences. Please try again.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [router]);

//   // ── toggle helpers ────────────────────────────────────────────────────────
//   const toggleSport = (id: string) =>
//     setSports((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

//   const toggleTeam = (id: string) =>
//     setTeams((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

//   // ── save ──────────────────────────────────────────────────────────────────
//   const handleSave = async () => {
//     if (!sports.length || !tenure) return;
//     setSaving(true);
//     setError(null);
//     try {
//       await axios.patch("/api/roar/profile", {
//         sports,
//         teams,
//         tenure,
//         badge: BADGE_MAP[tenure] ?? "RISING_FAN",
//       });
//       setSaved(true);
//       setTimeout(() => router.back(), 1200);
//     } catch {
//       setError("Failed to save preferences. Please try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const canSave = sports.length > 0 && !!tenure && !saving;
//   const visibleTeams = sports.length === 0 ? TEAMS : TEAMS.filter((t) => sports.includes(t.sport));

//   // ── loading skeleton ──────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#050508] text-[#F5F5FA] font-['DM_Sans',sans-serif]">
//         <style>{KEYFRAMES_CSS}</style>
//         <div className="max-w-[560px] mx-auto px-5 py-6 space-y-4">
//           <div className="h-8 w-40 rounded-xl bg-white/[0.06] animate-[pref-shimmer_1.5s_ease-in-out_infinite]" />
//           <div className="h-20 w-full rounded-2xl bg-white/[0.06] animate-[pref-shimmer_1.5s_ease-in-out_infinite]" />
//           <div className="h-20 w-full rounded-2xl bg-white/[0.06] animate-[pref-shimmer_1.5s_ease-in-out_infinite]" />
//           <div className="h-36 w-full rounded-2xl bg-white/[0.06] animate-[pref-shimmer_1.5s_ease-in-out_infinite] mt-6" />
//           <div className="h-48 w-full rounded-2xl bg-white/[0.06] animate-[pref-shimmer_1.5s_ease-in-out_infinite]" />
//         </div>
//       </div>
//     );
//   }

//   // ── main render ───────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-[#050508] text-[#F5F5FA] font-['DM_Sans',sans-serif] flex flex-col">
//       <style>{KEYFRAMES_CSS}</style>

//       {/* ── sticky header ── */}
//       <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-[14px] bg-[rgba(5,5,8,0.92)] backdrop-blur-xl border-b border-white/[0.06]">
//         <button
//           onClick={() => router.back()}
//           className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#F5F5FA] flex items-center justify-center cursor-pointer flex-shrink-0 hover:bg-white/10 transition-colors"
//         >
//           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//             <polyline points="15 18 9 12 15 6" />
//           </svg>
//         </button>

//         <h1
//           className="text-[28px] tracking-[0.08em] m-0 font-['Bebas_Neue',sans-serif]"
//           style={{
//             background: "linear-gradient(135deg,#E91E8C,#FF6B35)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             backgroundClip: "text",
//           }}
//         >
//           Preferences
//         </h1>

//         <div className="w-9" />
//       </div>

//       {/* ── scrollable body ── */}
//       <div className="flex-1 overflow-y-auto px-5 pt-6 max-w-[560px] w-full mx-auto box-border">

//         {/* ── error banner ── */}
//         <AnimatePresence>
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: -8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-300 text-[13px] mb-5"
//             >
//               {error}
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* ════════════════════
//             SECTION 1 — SPORT
//         ════════════════════ */}
//         <section className="mb-2">
//           <SectionLabel>Your Sport</SectionLabel>
//           <SubLabel>Pick the sports you follow. This shapes your entire feed.</SubLabel>

//           <div className="flex flex-col gap-3">
//             {[
//               { id: "cricket",  emoji: "🏏", label: "Cricket",  fans: "492M"   },
//               { id: "football", emoji: "⚽", label: "Football", fans: "138.7M" },
//             ].map((sp) => {
//               const sel = sports.includes(sp.id);
//               return (
//                 <motion.button
//                   key={sp.id}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => toggleSport(sp.id)}
//                   className={[
//                     "flex gap-4 items-center px-5 py-4 rounded-3xl cursor-pointer text-left w-full relative transition-colors",
//                     sel
//                       ? "border-2 border-[#E91E8C] bg-gradient-to-br from-[rgba(233,30,140,0.1)] to-[rgba(255,107,53,0.05)]"
//                       : "border-2 border-[#252538] bg-[#0E0E14]",
//                   ].join(" ")}
//                 >
//                   <span className="text-4xl">{sp.emoji}</span>
//                   <div className="text-left">
//                     <p className="font-['Bebas_Neue',sans-serif] text-[26px] leading-none">
//                       {sp.label}
//                     </p>
//                     <p className="text-[12px] text-[#4A4A62] mt-0.5">
//                       {sp.fans} fans on ROAR
//                     </p>
//                   </div>
//                   {sel && (
//                     <div className="ml-auto w-6 h-6 rounded-full bg-[#E91E8C] flex items-center justify-center text-[13px] text-white flex-shrink-0">
//                       ✓
//                     </div>
//                   )}
//                 </motion.button>
//               );
//             })}
//           </div>
//         </section>

//         <Divider />

//         {/* ════════════════════
//             SECTION 2 — TEAMS
//         ════════════════════ */}
//         <section className="mb-2">
//           <SectionLabel>Your Teams</SectionLabel>
//           <SubLabel>
//             {sports.length === 0
//               ? "Select a sport above to see teams."
//               : "Tap to follow. Your feed will highlight these teams."}
//           </SubLabel>

//           <AnimatePresence mode="wait">
//             <motion.div
//               key={sports.join(",")}
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.2 }}
//               className="grid grid-cols-4 gap-3"
//             >
//               {visibleTeams.map((t) => {
//                 const sel = teams.includes(t.id);
//                 return (
//                   <motion.button
//                     key={t.id}
//                     whileTap={{ scale: 0.93 }}
//                     animate={{ scale: sel ? 1.06 : 1 }}
//                     onClick={() => toggleTeam(t.id)}
//                     className={[
//                       "flex flex-col items-center gap-1.5 bg-transparent border-none cursor-pointer p-1 rounded-full",
//                       sel ? "outline outline-[3px] outline-[#E91E8C]" : "",
//                     ].join(" ")}
//                   >
//                     <span
//                       className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-[22px]"
//                       style={{ background: `${t.color}33` }}
//                     >
//                       {t.emoji}
//                     </span>
//                     <span
//                       className={[
//                         "text-[10px]",
//                         sel ? "text-[#F5F5FA] font-bold" : "text-[#9494AD] font-normal",
//                       ].join(" ")}
//                     >
//                       {t.label}
//                     </span>
//                   </motion.button>
//                 );
//               })}
//             </motion.div>
//           </AnimatePresence>
//         </section>

//         <Divider />

//         {/* ════════════════════════
//             SECTION 3 — TENURE
//         ════════════════════════ */}
//         <section className="mb-2">
//           <SectionLabel>Fan Tenure</SectionLabel>
//           <SubLabel>This sets your legacy badge — it shows on every post you make.</SubLabel>

//           <div className="flex flex-col gap-3">
//             {TENURE_OPTIONS.map((opt) => {
//               const sel = tenure === opt.id;
//               return (
//                 <motion.button
//                   key={opt.id}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => setTenure(opt.id)}
//                   className={[
//                     "px-5 py-[18px] rounded-3xl bg-[#0E0E14] text-left cursor-pointer transition-colors w-full relative",
//                     sel ? "border-2 border-[#E91E8C]" : "border-2 border-[#252538]",
//                   ].join(" ")}
//                 >
//                   {/* top row */}
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <p className="font-bold text-[15px] text-[#F5F5FA]">{opt.label}</p>
//                       <p className="text-[12px] text-[#9494AD] mt-0.5">{opt.sub}</p>
//                     </div>
//                     {sel && (
//                       <div className="w-[22px] h-[22px] rounded-full bg-[#E91E8C] flex items-center justify-center text-[12px] text-white flex-shrink-0">
//                         ✓
//                       </div>
//                     )}
//                   </div>

//                   {/* badge chip */}
//                   <span className="inline-block mt-2.5 text-[12px] px-3 py-1 rounded-full bg-[#16161F] text-[#E91E8C]">
//                     {opt.chip}
//                   </span>

//                   {/* expanded badge detail */}
//                   <AnimatePresence>
//                     {sel && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         exit={{ opacity: 0, height: 0 }}
//                         className="overflow-hidden"
//                       >
//                         <div className="mt-3.5 p-3 rounded-2xl bg-[rgba(233,30,140,0.07)] border border-[rgba(233,30,140,0.18)]">
//                           <p className="text-[10px] text-[#E91E8C] font-extrabold tracking-[0.08em] uppercase mb-1.5">
//                             Your Badge
//                           </p>
//                           <div className="flex items-center gap-2.5">
//                             {/* hexagon badge icon */}
//                             <div
//                               className="w-10 h-10 flex items-center justify-center text-[18px] flex-shrink-0"
//                               style={{
//                                 clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
//                                 background: opt.badgeGradient,
//                               }}
//                             >
//                               {opt.badgeIcon}
//                             </div>
//                             <div>
//                               <p className="font-bold text-[13px] text-[#F5F5FA]">
//                                 {opt.chip.replace(/[⭐🏅👑]/g, "").trim()}
//                               </p>
//                               <p className="text-[11px] text-[#4A4A62] mt-0.5">{opt.desc}</p>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </motion.button>
//               );
//             })}
//           </div>
//         </section>

//         {/* ── save bar (normal flow, not fixed) ── */}
//         <div className="py-6 pb-10 max-w-[520px] mx-auto w-full">
//           <AnimatePresence mode="wait">
//             {saved ? (
//               <motion.div
//                 key="saved"
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 className="flex items-center justify-center px-8 py-[14px] rounded-full bg-green-500/10 border border-green-500/30 text-[#00C853] text-[15px] font-bold"
//               >
//                 ✓ Preferences saved
//               </motion.div>
//             ) : (
//               <motion.button
//                 key="save"
//                 whileTap={{ scale: 0.97 }}
//                 onClick={handleSave}
//                 disabled={!canSave}
//                 className={[
//                   "w-full py-[15px] rounded-full text-white font-['Bebas_Neue',sans-serif] text-[18px] tracking-[0.08em] border-none font-bold transition-opacity",
//                   canSave ? "cursor-pointer opacity-100" : "cursor-not-allowed opacity-45",
//                 ].join(" ")}
//                 style={{
//                   background: "linear-gradient(135deg,#E91E8C,#FF6B35)",
//                   boxShadow: "0 6px 28px rgba(233,30,140,0.4)",
//                 }}
//               >
//                 {saving ? (
//                   <span className="flex items-center gap-2 justify-center">
//                     <span
//                       className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-[pref-spin_0.7s_linear_infinite]"
//                     />
//                     Saving…
//                   </span>
//                 ) : (
//                   "Save Preferences"
//                 )}
//               </motion.button>
//             )}
//           </AnimatePresence>
//         </div>

//       </div>
//     </div>
//   );
// }

// // ─── keyframe CSS (only what Tailwind can't do) ───────────────────────────────

// const KEYFRAMES_CSS = `
// @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

// @keyframes pref-spin {
//   to { transform: rotate(360deg); }
// }
// @keyframes pref-shimmer {
//   0%, 100% { opacity: 0.5; }
//   50%       { opacity: 0.9; }
// }
// `;




'use client';


import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AvatarWithBadge from "../../../src/components/NewROARComponent/components/AvatarWithBadge";

interface Props {
  onComplete: (prefs: any) => void;
}

const SLIDE = {
  enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
};

// TODO: replace placeholder image paths once final assets land
const SPORT_OPTIONS = [
  {
    id: "cricket",
    label: "Cricket",
    tagline: "Lives for sixes and controversies.",
    image: "/assets/onboarding/cricket-ball.png",
  },
  {
    id: "football",
    label: "Football",
    tagline: "Lives for goals and last-minute drama.",
    image: "/assets/onboarding/football.png",
  },
];

// TODO: placeholder badge — swap for real FIRST_ROAR entry in BADGE_CONFIG / BADGE_DETAIL once defined
const FIRST_ROAR_BADGE = {
  id: "FIRST_ROAR",
  name: "FIRST ROAR",
  icon: "🐯",
  gradient: "linear-gradient(135deg,#FF9800,#FF5722)",
  repPoints: 2,
};

export default function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [sports, setSports] = useState<string[]>(["cricket"]);
  const [firstVote, setFirstVote] = useState<string | null>(null);

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  const debatePrompt = sports.includes("football")
    ? "Mbapp\u00e9 is the most dangerous player in world football right now."
    : "Virat Kohli in 2025 is better than Sachin Tendulkar ever was.";

  const handleVote = (v: string) => {
    setFirstVote(v);
    setTimeout(() => go(3), 350);
  };

  const handleCompleteOnboarding = async () => {
    try {
      await axios.post("/api/roar/onboarding", {
        sports,
        badge: "RISING_FAN",
        firstContribution: debatePrompt,
        firstVote,
        repPointsAwarded: FIRST_ROAR_BADGE.repPoints,
      });

      onComplete({
        sports,
        badge: "RISING_FAN",
        firstContribution: debatePrompt,
        firstVote,
        repPointsAwarded: FIRST_ROAR_BADGE.repPoints,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] overflow-hidden flex flex-col">
      {/* Logo */}
      <div className="pt-10 pl-6">
        <h1 className="logotype text-[28px] leading-none tracking-[0.08em]">ROAR</h1>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-6 pb-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i <= step ? 24 : 8,
              background: i <= step ? "var(--accent-magenta)" : "var(--border)",
            }}
          />
        ))}
      </div>

      <div
        className="flex-1 overflow-y-auto overflow-x-hidden relative"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          {/* Step 0 — sample profile card / value prop */}
          {step === 0 && (
            <motion.div
              key="s0"
              custom={dir}
              variants={SLIDE}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center"
            >
              <div className="glass-card w-full max-w-[320px] px-5 py-5 relative">
                <div className="flex items-center gap-3">
                  <AvatarWithBadge username="messi_90s" badge="OG_FAN" size="md" />
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[15px]">messi_90s</span>
                      <span
                        className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                        style={{
                          background: "linear-gradient(135deg,#7B61FF,#E91E8C)",
                          color: "#fff",
                        }}
                      >
                        OG Fan
                      </span>
                    </div>
                    <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
                      Sports Oracle · Football
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[
                    { v: "71%", l: "Accuracy" },
                    { v: "67", l: "Predictions" },
                    { v: "412", l: "Rep pts" },
                    { v: "203", l: "Followers" },
                  ].map((s) => (
                    <div key={s.l} className="bg-[var(--bg-tertiary)] rounded-2xl py-2.5 text-center">
                      <p className="font-display text-[18px] leading-none">{s.v}</p>
                      <p className="text-[9px] text-[var(--text-muted)] mt-1">{s.l}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-[var(--text-secondary)]">Rep Points</span>
                    <span className="text-[var(--accent-orange)]">412 points</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: "62%", background: "linear-gradient(90deg,#FFB800,#FF5722)" }}
                    />
                  </div>
                </div>
              </div>

              <h2 className="font-display text-[34px] leading-[1.05] mt-10 uppercase">
                Build your true sportsfan identity
              </h2>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => go(1)}
                className="btn-gradient mt-10 w-full max-w-[280px] h-[52px] rounded-full text-[18px] border-none cursor-pointer"
                style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.08em" }}
              >
                LET'S GO
              </motion.button>
            </motion.div>
          )}

          {/* Step 1 — sport selection */}
          {step === 1 && (
            <motion.div
              key="s1"
              custom={dir}
              variants={SLIDE}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="px-6 pb-24 pt-10 flex flex-col min-h-[75vh]"
            >
              <div className="flex flex-col gap-4">
                {SPORT_OPTIONS.map((sp) => {
                  const sel = sports.includes(sp.id);
                  return (
                    <motion.button
                      key={sp.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setSports((p) =>
                          p.includes(sp.id) ? p.filter((x) => x !== sp.id) : [...p, sp.id]
                        )
                      }
                      className={`flex gap-4 items-center px-5 py-4 rounded-3xl bg-[var(--bg-secondary)] cursor-pointer text-left border-2 ${
                        sel ? "gradient-border border-transparent" : "border-[var(--border)]"
                      }`}
                    >
                      <img
                        src={sp.image}
                        alt={sp.label}
                        className="w-[44px] h-[44px] object-contain shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-[16px] leading-tight">{sp.label}</p>
                        <p className="text-[12px] text-[var(--text-muted)] mt-0.5">{sp.tagline}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex-1" />

              <h2 className="font-display text-[40px] leading-[1.05] mt-8 uppercase">
                What do you follow?
              </h2>
              <p className="text-[13px] text-[var(--text-muted)] mt-2">
                Select one or both. You can change this later.
              </p>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => sports.length && go(2)}
                disabled={!sports.length}
                className={`btn-gradient w-full mt-7 h-[52px] rounded-full text-base border-none cursor-pointer transition-opacity ${
                  sports.length ? "opacity-100" : "opacity-40"
                }`}
              >
                START ROARING!
              </motion.button>
            </motion.div>
          )}

          {/* Step 2 — pick a side (debate) */}
          {step === 2 && (
            <motion.div
              key="s2"
              custom={dir}
              variants={SLIDE}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="px-6 pb-20 pt-10 flex flex-col min-h-[75vh]"
            >
              <div className="glass-card px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AvatarWithBadge username="roar_bot" badge="ORACLE" size="sm" />
                    <div>
                      <p className="text-[13px] font-semibold leading-none">@roar_bot</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1">12:32</p>
                    </div>
                  </div>
                  <span
                    className="text-[11px] px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: "var(--bg-tertiary)", color: "var(--accent-orange)" }}
                  >
                    ⚡ Debate
                  </span>
                </div>

                <p className="text-[15px] leading-relaxed mb-4">{debatePrompt}</p>

                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVote("agree")}
                    className="flex-1 py-3 rounded-2xl text-[15px] font-semibold cursor-pointer bg-[var(--bg-tertiary)] border-none flex items-center justify-center gap-2"
                  >
                    Agree 👍
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVote("disagree")}
                    className="flex-1 py-3 rounded-2xl text-[15px] font-semibold cursor-pointer bg-[var(--bg-tertiary)] border-none flex items-center justify-center gap-2"
                  >
                    Disagree 👎
                  </motion.button>
                </div>
              </div>

              <div className="flex-1" />

              <h2 className="font-display text-[40px] leading-[1.05] mt-8 uppercase">
                Pick a side
              </h2>
              <p className="text-[13px] text-[var(--text-muted)] mt-2">
                You'll earn Rep Points everytime you take part in debate.
              </p>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => firstVote && go(3)}
                disabled={!firstVote}
                className={`btn-gradient w-full mt-7 h-[52px] rounded-full text-base border-none cursor-pointer transition-opacity ${
                  firstVote ? "opacity-100" : "opacity-40"
                }`}
              >
                CONTINUE
              </motion.button>
            </motion.div>
          )}

          {/* Step 3 — badge reveal */}
          {step === 3 && (
            <motion.div
              key="s3"
              custom={dir}
              variants={SLIDE}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center min-h-[75vh] px-8 text-center"
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 14 }}
                className="w-[140px] h-[140px] flex items-center justify-center text-[64px]"
                style={{
                  clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                  background: FIRST_ROAR_BADGE.gradient,
                }}
              >
                {FIRST_ROAR_BADGE.icon}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5 px-4 py-1.5 rounded-full text-[13px] font-bold"
                style={{ background: "rgba(255,87,34,0.15)", color: "var(--accent-orange)" }}
              >
                +{FIRST_ROAR_BADGE.repPoints} Rep Points
              </motion.div>

              <p className="text-[12px] tracking-[0.15em] uppercase text-[var(--accent-orange)] font-bold mt-7">
                Earned Badge
              </p>
              <h2 className="font-display text-[44px] leading-none uppercase mt-2">
                {FIRST_ROAR_BADGE.name}
              </h2>
              <p className="text-[13px] text-[var(--text-secondary)] mt-2">
                +{FIRST_ROAR_BADGE.repPoints} Rep Points added
              </p>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCompleteOnboarding}
                className="btn-gradient mt-10 w-full max-w-[280px] h-[52px] rounded-full text-base border-none cursor-pointer"
              >
                CONTINUE
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}