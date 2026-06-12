"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Trophy, Users, ChevronRight, Play, Tv2 } from "lucide-react";
import { motion } from "framer-motion";
// ─── Data ────────────────────────────────────────────────────────────────────

const upcomingMatches = [
  { date: "11", month: "JUN", day: "11 JUN", t1: "MEX", t1Flag: "🇲🇽", t1Img: "/images/mexico.jpg", t2: "CAN", t2Flag: "🇨🇦", t2Img: "/images/canada.png", time: "7:00 PM", venue: "Estadio Azteca" },
  { date: "11", month: "JUN", day: "11 JUN", t1: "USA", t1Flag: "🇺🇸", t1Img: "/images/usa.png", t2: "CZE", t2Flag: "🇨🇿", t2Img: "/images/czech.png", time: "8:00 PM", venue: "AT&T Stadium" },
  { date: "12", month: "JUN", day: "12 JUN", t1: "ESP", t1Flag: "🇪🇸", t1Img: "/images/spain.jpg", t2: "BRA", t2Flag: "🇧🇷", t2Img: "/images/brazil.png", time: "6:00 PM", venue: "MetLife Stadium" },
];

const groups = [
  {
    name: "GROUP A",
    color: "#C9115F",
    borderColor: "border-[#C9115F]/60",
    headerColor: "text-[#C9115F]",
    teams: [
      { name: "Mexico", flag: "🇲🇽", img: "/images/mexico.jpg" },
      { name: "South Africa", flag: "🇿🇦", img: "/images/south-africa.png" },
      { name: "Korea Republic", flag: "🇰🇷", img: "/images/korea.png" },
      { name: "EURO Play-off D", flag: "🏴", img: "" },
    ],
  },
  {
    name: "GROUP B",
    color: "#a855f7",
    borderColor: "border-purple-500/60",
    headerColor: "text-purple-400",
    teams: [
      { name: "Canada", flag: "🇨🇦", img: "/images/canada.png" },
      { name: "Qatar", flag: "🇶🇦", img: "/images/qatar.png" },
      { name: "Switzerland", flag: "🇨🇭", img: "/images/switzerland.png" },
      { name: "EURO Play-off A", flag: "🏴", img: "" },
    ],
  },
  {
    name: "GROUP C",
    color: "#f97316",
    borderColor: "border-orange-500/60",
    headerColor: "text-orange-400",
    teams: [
      { name: "Brazil", flag: "🇧🇷", img: "/images/brazil.png" },
      { name: "Morocco", flag: "🇲🇦", img: "/images/morocco.png" },
      { name: "Haiti", flag: "🇭🇹", img: "/images/haiti.png" },
      { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", img: "/images/scotland.png" },
    ],
  },
  {
    name: "GROUP D",
    color: "#3b82f6",
    borderColor: "border-blue-500/60",
    headerColor: "text-blue-400",
    teams: [
      { name: "USA", flag: "🇺🇸", img: "/images/usa.png" },
      { name: "Paraguay", flag: "🇵🇾", img: "/images/paraguay.png" },
      { name: "Australia", flag: "🇦🇺", img: "/images/australia.png" },
      { name: "UEFA Play-off C", flag: "🏴", img: "" },
    ],
  },
];

const topPlayers = [
  { name: "Lionel Messi", country: "Argentina", countryFlag: "🇦🇷", num: 10, img: "/images/messi.jpg", gradient: "from-sky-900/60 to-[#1A1A2E]" },
  { name: "Kylian Mbappé", country: "France", countryFlag: "🇫🇷", num: 9, img: "/images/mbappe.jpg", gradient: "from-blue-900/60 to-[#1A1A2E]" },
  { name: "Erling Haaland", country: "Norway", countryFlag: "🇳🇴", num: 9, img: "/images/haaland.jpg", gradient: "from-red-900/60 to-[#1A1A2E]" },
  { name: "Jude Bellingham", country: "England", countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", num: 10, img: "/images/bellingham.jpg", gradient: "from-yellow-900/60 to-[#1A1A2E]" },
  { name: "Vinícius Júnior", country: "Brazil", countryFlag: "🇧🇷", num: 10, img: "/images/vinicius.jpg", gradient: "from-green-900/60 to-[#1A1A2E]" },
];

const hostCities = [
  { name: "Mexico City", stadium: "Estadio Azteca", country: "MEX", countryColor: "text-green-400 bg-green-400/20", img: "/images/mexico-city.jpg" },
  { name: "New York New Jersey", stadium: "MetLife Stadium", country: "USA", countryColor: "text-blue-400 bg-blue-400/20", img: "/images/new-york.jpg" },
  { name: "Toronto", stadium: "BMO Field", country: "CAN", countryColor: "text-red-400 bg-red-400/20", img: "/images/toronto.png" },
];

const tournamentStats = [
  { val: "104", label: "Total Matches", icon: "⚽", color: "#C9115F", border: "border-[#C9115F]/30", bg: "bg-[#C9115F]/10" },
  { val: "48", label: "Teams", icon: "👥", color: "#a855f7", border: "border-purple-500/30", bg: "bg-purple-500/10" },
  { val: "16", label: "Host Cities", icon: "📍", color: "#f97316", border: "border-orange-500/30", bg: "bg-orange-500/10" },
  { val: "39", label: "Days of Action", icon: "📅", color: "#3b82f6", border: "border-blue-500/30", bg: "bg-blue-500/10" },
  { val: "1", label: "Champion", icon: "🏆", color: "#22c55e", border: "border-green-500/30", bg: "bg-green-500/10" },
];

// ─── Countdown Hook ───────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hrs: 0, mins: 0, secs: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hrs: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return timeLeft;
}

// ─── Flag Image with emoji fallback ──────────────────────────────────────────
function FlagImg({ src, alt, emoji, size = 16 }: { src: string; alt: string; emoji: string; size?: number }) {
  const [err, setErr] = useState(false);
  if (err) return <span style={{ fontSize: size }}>{emoji}</span>;
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
      onError={() => setErr(true)}
    />
  );
}

// ─── Player Image with placeholder ───────────────────────────────────────────
function PlayerImg({ src, alt, gradient }: { src: string; alt: string; gradient: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className={`h-36 w-full relative bg-gradient-to-b ${gradient} flex items-end justify-center overflow-hidden`}>
      {!err ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover object-top"
          onError={() => setErr(true)}
        />
      ) : (
        <div className="w-20 h-28 rounded-t-xl bg-white/10 flex items-center justify-center text-4xl mb-0">
          ⚽
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] via-transparent to-transparent" />
    </div>
  );
}

// ─── City Image with placeholder ─────────────────────────────────────────────
function CityImg({ src, alt }: { src: string; alt: string }) {
  const [err, setErr] = useState(false);
  return (
    <div className="absolute inset-0">
      {!err ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setErr(true)} />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-3xl opacity-50">
          🏙️
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FIFAMatchCenter() {
  const kickoff = new Date("2026-06-11T19:00:00-06:00");
  const { days, hrs, mins, secs } = useCountdown(kickoff);
  const router = useRouter();

  return (
    <div
      className="min-h-screen text-white font-sans"
      style={{ background: "linear-gradient(160deg, #04040E 0%, #070718 40%, #0C0820 70%, #07071A 100%)" }}
    >
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            window.history.back();
          } else {
            router.push("/");
          }
        }}
        aria-label="Go back"
        style={{
          position: "fixed",
          marginTop: 5,
          marginLeft: 5,
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.09)",
          border: "1px solid rgba(255,255,255,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 90,
          backdropFilter: "blur(8px)",
          transition: "background 0.18s",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.16)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>

      {/* Ambient top glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[#C9115F]/15 blur-[130px] pointer-events-none z-0" />
      {/* Purple ambient glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[400px] bg-purple-800/10 blur-[150px] pointer-events-none z-0" />
      {/* Bottom ambient */}
      <div className="fixed bottom-0 left-0 w-[600px] h-[300px] bg-blue-900/10 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 p-4 lg:p-6 max-w-[1600px] mx-auto">
        {/* ── Back Button ── */}


        {/* ── TOP ROW ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">

          {/* Hero Banner */}
          <div
            className="xl:col-span-2 relative rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #04040E 0%, #0E0E30 55%, #1A0825 100%)",
              minHeight: 280,
            }}
          >
            {/* Stadium bg image overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/images/stadium-bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center right",
                opacity: 0.28,
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#04040E] via-[#04040E]/75 to-transparent" />
            {/* Pink/purple glow top-right */}
            <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-bl from-[#C9115F]/30 via-purple-700/20 to-transparent pointer-events-none" />
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#04040E]/60 to-transparent pointer-events-none" />

            <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col">
              {/* TOP: Left title/info + Right countdown side by side */}
              <div className="flex items-start justify-between gap-4 flex-1">
                {/* Left: "26" badge + title + description */}
                <div className="flex gap-5 items-start flex-1">
                  {/* Big "26" FIFA logo */}
                  <div className="hidden md:flex flex-col items-center justify-center flex-shrink-0">
                    <div
                      className="w-[72px] h-[72px] rounded-xl flex flex-col items-center justify-center border border-white/15"
                      style={{ background: "linear-gradient(160deg, #00205B 0%, #003087 100%)" }}
                    >
                      <span className="text-white text-3xl font-black leading-none">26</span>
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1 tracking-widest font-bold">FIFA</span>
                  </div>

                  <div className="flex-1">
                    <h1 className="text-3xl lg:text-4xl xl:text-[2.6rem] font-black tracking-tight leading-tight mb-2">
                      FIFA WORLD<br />CUP 2026™
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-gray-300 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-gray-400" />
                        11 JUNE – 19 JULY 2026
                      </span>
                      <span className="text-gray-600">•</span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-gray-400" />
                        USA • CANADA • MEXICO
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-400 leading-relaxed max-w-sm">
                      The biggest stage in football returns! 48 nations, 104 matches, across 16 iconic host cities. One world. One trophy.
                    </p>
                  </div>
                </div>

                {/* Right: Countdown — top-right like in UI */}
                <div
                  className="flex flex-col items-center rounded-2xl p-4 flex-shrink-0 border border-white/10"
                  style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(16px)", minWidth: 210 }}
                >
                  <p className="text-[9px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-3">
                    Countdown to Kickoff
                  </p>
                  <div className="flex gap-2">
                    {[
                      { val: String(days).padStart(3, "0"), label: "DAYS" },
                      { val: String(hrs).padStart(2, "0"), label: "HRS" },
                      { val: String(mins).padStart(2, "0"), label: "MINS" },
                      { val: String(secs).padStart(2, "0"), label: "SECS" },
                    ].map((t, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className="w-12 h-12 flex items-center justify-center text-lg font-black rounded-xl border border-white/10 mb-1"
                          style={{ background: "#07071A" }}
                        >
                          {t.val}
                        </div>
                        <span className="text-[8px] text-gray-500 tracking-wider font-medium">{t.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* BOTTOM: Stat Badges */}
              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  { emoji: "👥", val: "48", label: "Teams" },
                  { emoji: "⚽", val: "104", label: "Matches" },
                  { emoji: "📍", val: "16", label: "Host Cities" },
                  { emoji: "🏆", val: "1", label: "Trophy" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 border border-white/10"
                    style={{ background: "rgba(10,10,22,0.85)", backdropFilter: "blur(8px)" }}
                  >
                    <span className="text-base">{s.emoji}</span>
                    <div>
                      <div className="text-sm font-bold leading-none">{s.val}</div>
                      <div className="text-[9px] text-gray-500 uppercase tracking-wider">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Match Card */}
          <div
            className="relative rounded-2xl overflow-hidden flex flex-col border border-white/10"
            style={{ background: "linear-gradient(160deg, #08081A 0%, #140820 100%)" }}
          >
            <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-tl from-[#C9115F]/20 via-transparent to-transparent pointer-events-none" />
            {/* Diagonal accent line */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9115F]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 p-5 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-300">Next Match</h3>
                <span className="text-[11px] text-gray-400 cursor-pointer hover:text-white flex items-center gap-0.5 transition-colors">
                  View All <ChevronRight size={13} />
                </span>
              </div>

              {/* Teams */}
              <div className="flex justify-between items-center px-2 flex-grow mb-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full border-2 border-white/20 overflow-hidden bg-gradient-to-br from-green-700/40 to-green-900/40 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                    <FlagImg src="/images/mexico.jpg" alt="MEX" emoji="🇲🇽" size={80} />
                  </div>
                  <span className="font-black tracking-widest text-sm">MEXICO</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                    VS
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full border-2 border-white/20 overflow-hidden bg-gradient-to-br from-red-700/40 to-red-900/40 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <FlagImg src="/images/canada.png" alt="CAN" emoji="🇨🇦" size={80} />
                  </div>
                  <span className="font-black tracking-widest text-sm">CANADA</span>
                </div>
              </div>

              {/* Match Details */}
              <div className="rounded-xl border border-white/8 p-3 mb-4 space-y-1.5" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <Calendar size={12} />
                  <span>11 JUN 2026 • 7:00 PM LOCAL</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <MapPin size={12} />
                  <span>Estadio Azteca, Mexico City</span>
                </div>
              </div>

              {/* Match Centre Button */}
              <button className="w-full py-2.5 rounded-xl border border-[#C9115F] text-[#C9115F] text-[12px] font-bold tracking-widest hover:bg-[#C9115F] hover:text-white transition-all duration-200 flex items-center justify-center gap-2">
                MATCH CENTRE <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── MIDDLE ROW ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* Upcoming Matches */}
          <div className="rounded-2xl border border-white/10 p-5" style={{ background: "#08081A" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-200">Upcoming Matches</h3>
              <span className="text-[10px] text-gray-400 cursor-pointer hover:text-white flex items-center gap-0.5 transition-colors">
                View Full Schedule <ChevronRight size={12} />
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {upcomingMatches.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 border border-white/6 hover:border-white/15 transition-all cursor-pointer group"
                  style={{ background: "rgba(10,10,25,0.80)" }}
                >
                  {/* Date block */}
                  <div className="text-center flex-shrink-0 w-10">
                    <div className="text-lg font-black text-white leading-none">{m.date}</div>
                    <div className="text-[9px] text-gray-500 font-bold">{m.month}</div>
                  </div>

                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    {/* Team 1 */}
                    <div className="flex items-center gap-1.5 flex-1">
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 flex items-center justify-center">
                        <FlagImg src={m.t1Img} alt={m.t1} emoji={m.t1Flag} size={28} />
                      </div>
                      <span className="text-[12px] font-bold">{m.t1}</span>
                    </div>
                    <span className="text-[9px] text-gray-500 font-bold px-1">VS</span>
                    {/* Team 2 */}
                    <div className="flex items-center gap-1.5 flex-1 justify-end">
                      <span className="text-[12px] font-bold">{m.t2}</span>
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 flex items-center justify-center">
                        <FlagImg src={m.t2Img} alt={m.t2} emoji={m.t2Flag} size={28} />
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pl-2">
                    <div className="text-[11px] text-[#C9115F] font-bold">{m.time}</div>
                    <div className="text-[9px] text-gray-500 truncate w-24">{m.venue}</div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 text-[11px] font-bold text-[#C9115F] tracking-widest py-2 hover:bg-white/5 rounded-xl transition-colors flex justify-center items-center gap-1">
              VIEW ALL MATCHES <ChevronRight size={13} />
            </button>
          </div>

          {/* Group Stage Overview */}
          <div className="lg:col-span-1 rounded-2xl border border-white/10 p-5" style={{ background: "#08081A" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-200">Group Stage Overview</h3>
              <span className="text-[10px] text-gray-400 cursor-pointer hover:text-white flex items-center gap-0.5 transition-colors">
                View Groups <ChevronRight size={12} />
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {groups.map((g, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-3 border ${g.borderColor} flex flex-col hover:border-opacity-100 transition-all cursor-pointer group`}
                  style={{ background: "rgba(10,10,25,0.85)" }}
                >
                  <h4 className={`text-[10px] font-black text-center mb-3 tracking-widest ${g.headerColor}`}>{g.name}</h4>
                  <div className="flex flex-col gap-2 flex-grow">
                    {g.teams.map((t, ti) => (
                      <div key={ti} className="flex items-center gap-2 text-[11px]">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-700/80 border border-white/10 flex-shrink-0 flex items-center justify-center">
                          {t.img ? (
                            <FlagImg src={t.img} alt={t.name} emoji={t.flag} size={24} />
                          ) : (
                            <span className="text-sm leading-none">{t.flag}</span>
                          )}
                        </div>
                        <span className="truncate text-gray-300 text-[10px]">{t.name}</span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="mt-3 text-center text-[10px] font-bold cursor-pointer transition-colors group-hover:opacity-80"
                    style={{ color: g.color }}
                  >
                    View Group
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Host Cities */}
          <div className="rounded-2xl border border-white/10 p-5" style={{ background: "#08081A" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-200">Host Cities</h3>
              <span className="text-[10px] text-gray-400 cursor-pointer hover:text-white flex items-center gap-0.5 transition-colors">
                View All <ChevronRight size={12} />
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 h-[160px]">
              {/* First 2 cities side by side */}
              {hostCities.slice(0, 2).map((city, i) => (
                <div key={i} className="rounded-xl overflow-hidden relative group cursor-pointer">
                  <CityImg src={city.img} alt={city.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  {/* Pin icon */}
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#C9115F] flex items-center justify-center">
                    <MapPin size={10} className="text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="text-[10px] font-bold leading-tight">{city.name}</div>
                    <div className="text-[8px] text-gray-400 truncate">{city.stadium}</div>
                    <span className={`inline-block text-[8px] mt-1 px-1.5 py-0.5 rounded font-bold ${city.countryColor}`}>
                      {city.country}
                    </span>
                  </div>
                </div>
              ))}

              {/* Row 2: Toronto + More Cities */}
              <div className="rounded-xl overflow-hidden relative group cursor-pointer">
                <CityImg src={hostCities[2].img} alt={hostCities[2].name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#C9115F] flex items-center justify-center">
                  <MapPin size={10} className="text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <div className="text-[10px] font-bold leading-tight">{hostCities[2].name}</div>
                  <div className="text-[8px] text-gray-400 truncate">{hostCities[2].stadium}</div>
                  <span className={`inline-block text-[8px] mt-1 px-1.5 py-0.5 rounded font-bold ${hostCities[2].countryColor}`}>
                    {hostCities[2].country}
                  </span>
                </div>
              </div>

              <div
                className="rounded-xl flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition-opacity border border-[#C9115F]/40"
                style={{ background: "linear-gradient(135deg, rgba(201,17,95,0.25) 0%, rgba(201,17,95,0.10) 100%)" }}
              >
                <span className="text-2xl font-black text-white leading-none">+13</span>
                <span className="text-[10px] text-gray-300 mt-0.5">More Cities</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROW ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

          {/* Tournament Stats */}
          <div className="xl:col-span-2 rounded-2xl border border-white/10 p-5" style={{ background: "#08081A" }}>
            <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-200 mb-4">Tournament Stats</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-3">
              {tournamentStats.map((s, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-4 border ${s.border} flex flex-col items-center text-center justify-center h-24 ${s.bg} hover:scale-[1.02] transition-transform cursor-default`}
                >
                  <span className="text-2xl mb-2 leading-none">{s.icon}</span>
                  <div className="text-lg font-black">{s.val}</div>
                  <div className="text-[8px] text-gray-400 mt-0.5 uppercase tracking-wider leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Players */}
          <div className="xl:col-span-3 rounded-2xl border border-white/10 p-5" style={{ background: "#08081A" }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-200">Top Players to Watch</h3>
              <span className="text-[10px] text-gray-400 cursor-pointer hover:text-white flex items-center gap-0.5 transition-colors">
                View All <ChevronRight size={12} />
              </span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {topPlayers.map((p, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden border border-white/8 flex flex-col group cursor-pointer hover:border-[#C9115F]/40 transition-all"
                  style={{ background: "#0D0D22" }}
                >
                  <PlayerImg src={p.img} alt={p.name} gradient={p.gradient} />
                  <div className="p-2.5 flex flex-col items-center text-center">
                    <h4 className="text-[10px] font-bold leading-tight mb-1">{p.name}</h4>
                    <span className="text-[8px] text-gray-400 flex items-center gap-1 mb-2">
                      <span>{p.countryFlag}</span> {p.country}
                    </span>
                    <div className="border border-[#C9115F]/60 text-[#C9115F] px-2.5 py-0.5 rounded text-[10px] font-black">
                      {p.num}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
