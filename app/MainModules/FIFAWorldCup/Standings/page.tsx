"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Trophy, Users, ChevronRight, Play, Tv2 } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const upcomingMatches = [
  { date: "11", month: "JUN", day: "11 JUN", t1: "MEX", t1Flag: "🇲🇽", t1Img: "/images/flags/mexico.jpg", t2: "CAN", t2Flag: "🇨🇦", t2Img: "/images/flags/canada.png", time: "7:00 PM", venue: "Estadio Azteca" },
  { date: "11", month: "JUN", day: "11 JUN", t1: "USA", t1Flag: "🇺🇸", t1Img: "/images/flags/usa.png", t2: "CZE", t2Flag: "🇨🇿", t2Img: "/images/flags/czech.png", time: "8:00 PM", venue: "AT&T Stadium" },
  { date: "12", month: "JUN", day: "12 JUN", t1: "ESP", t1Flag: "🇪🇸", t1Img: "/images/flags/spain.jpg", t2: "BRA", t2Flag: "🇧🇷", t2Img: "/images/flags/brazil.png", time: "6:00 PM", venue: "MetLife Stadium" },
];

const groups = [
  {
    name: "GROUP A",
    color: "#C9115F",
    borderColor: "border-[#C9115F]/60",
    headerColor: "text-[#C9115F]",
    teams: [
      { name: "Mexico", flag: "🇲🇽" },
      { name: "South Africa", flag: "🇿🇦" },
      { name: "Korea Republic", flag: "🇰🇷" },
      { name: "EURO Play-off D", flag: "🏴" },
    ],
  },
  {
    name: "GROUP B",
    color: "#a855f7",
    borderColor: "border-purple-500/60",
    headerColor: "text-purple-400",
    teams: [
      { name: "Canada", flag: "🇨🇦" },
      { name: "Qatar", flag: "🇶🇦" },
      { name: "Switzerland", flag: "🇨🇭" },
      { name: "EURO Play-off A", flag: "🏴" },
    ],
  },
  {
    name: "GROUP C",
    color: "#f97316",
    borderColor: "border-orange-500/60",
    headerColor: "text-orange-400",
    teams: [
      { name: "Brazil", flag: "🇧🇷" },
      { name: "Morocco", flag: "🇲🇦" },
      { name: "Haiti", flag: "🇭🇹" },
      { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
    ],
  },
  {
    name: "GROUP D",
    color: "#3b82f6",
    borderColor: "border-blue-500/60",
    headerColor: "text-blue-400",
    teams: [
      { name: "USA", flag: "🇺🇸" },
      { name: "Paraguay", flag: "🇵🇾" },
      { name: "Australia", flag: "🇦🇺" },
      { name: "UEFA Play-off C", flag: "🏴" },
    ],
  },
];

const topPlayers = [
  { name: "Lionel Messi", country: "Argentina", countryFlag: "🇦🇷", num: 10, img: "/images/players/messi.jpg", gradient: "from-sky-900/60 to-[#1A1A2E]" },
  { name: "Kylian Mbappé", country: "France", countryFlag: "🇫🇷", num: 9, img: "/images/players/mbappe.jpg", gradient: "from-blue-900/60 to-[#1A1A2E]" },
  { name: "Erling Haaland", country: "Norway", countryFlag: "🇳🇴", num: 9, img: "/images/players/haaland.jpg", gradient: "from-red-900/60 to-[#1A1A2E]" },
  { name: "Jude Bellingham", country: "England", countryFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", num: 10, img: "/images/players/bellingham.jpg", gradient: "from-yellow-900/60 to-[#1A1A2E]" },
  { name: "Vinícius Júnior", country: "Brazil", countryFlag: "🇧🇷", num: 10, img: "/images/players/vinicius.jpg", gradient: "from-green-900/60 to-[#1A1A2E]" },
];

const hostCities = [
  { name: "Mexico City", stadium: "Estadio Azteca", country: "MEX", countryColor: "text-green-400 bg-green-400/20", img: "/images/cities/mexico-city.jpg" },
  { name: "New York New Jersey", stadium: "MetLife Stadium", country: "USA", countryColor: "text-blue-400 bg-blue-400/20", img: "/images/cities/new-york.jpg" },
  { name: "Toronto", stadium: "BMO Field", country: "CAN", countryColor: "text-red-400 bg-red-400/20", img: "/images/cities/toronto.png" },
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

  return (
    <div
      className="min-h-screen text-white font-sans"
      style={{ background: "linear-gradient(160deg, #05050F 0%, #0A0A1A 50%, #05050F 100%)" }}
    >
      {/* Ambient top glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#C9115F]/10 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 p-4 lg:p-6 max-w-[1600px] mx-auto">

        {/* ── TOP ROW ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">

          {/* Hero Banner */}
          <div
            className="xl:col-span-2 relative rounded-2xl overflow-hidden min-h-[260px]"
            style={{
              background: "linear-gradient(135deg, #05050F 0%, #12123A 60%, #1A0520 100%)",
            }}
          >
            {/* Stadium bg image overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/images/fifa/stadium-bg.jpg'), url('/fifa/stadium-bg.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center right",
                opacity: 0.35,
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#05050F] via-[#05050F]/80 to-transparent" />
            {/* Pink glow right */}
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#C9115F]/25 via-purple-600/15 to-transparent pointer-events-none" />
            {/* Trophy / logo badge */}
            <div className="absolute right-[36%] top-1/2 -translate-y-1/2 hidden lg:block opacity-80 select-none pointer-events-none">
              <div className="text-[110px] leading-none filter drop-shadow-[0_0_30px_rgba(201,17,95,0.5)]">🏆</div>
            </div>

            <div className="relative z-10 p-6 lg:p-8 flex flex-col md:flex-row justify-between gap-6">
              {/* Left: Title + info + stats */}
              <div className="flex gap-5 items-start">
                {/* Big "26" FIFA logo area */}
                <div className="hidden md:flex flex-col items-center justify-center w-24 flex-shrink-0">
                  <div
                    className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl font-black border border-white/10"
                    style={{ background: "linear-gradient(135deg, #00205B 0%, #003087 100%)" }}
                  >
                    <span className="text-white text-3xl font-black leading-none">26</span>
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 tracking-widest font-bold">FIFA</span>
                </div>

                <div>
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight leading-tight mb-3">
                    FIFA WORLD<br />CUP 2026™
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-300 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      11 JUNE – 19 JULY 2026
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-400" />
                      USA • CANADA • MEXICO
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-md">
                    The biggest stage in football returns! 48 nations, 104 matches, across 16 iconic host cities. One world. One trophy.
                  </p>

                  {/* Stat Badges */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { emoji: "👥", val: "48", label: "Teams" },
                      { emoji: "⚽", val: "104", label: "Matches" },
                      { emoji: "📍", val: "16", label: "Host Cities" },
                      { emoji: "🏆", val: "1", label: "Trophy" },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 border border-white/10"
                        style={{ background: "rgba(26,26,36,0.8)", backdropFilter: "blur(8px)" }}
                      >
                        <span className="text-base">{s.emoji}</span>
                        <div>
                          <div className="text-base font-bold leading-none">{s.val}</div>
                          <div className="text-[9px] text-gray-500 uppercase tracking-wider">{s.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Countdown */}
              <div
                className="flex flex-col items-center justify-center rounded-2xl p-5 flex-shrink-0 self-start mt-2 border border-white/10"
                style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", minWidth: 220 }}
              >
                <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">
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
                        className="w-14 h-14 flex items-center justify-center text-xl font-black rounded-xl border border-white/10 mb-1.5"
                        style={{ background: "#0D0D1A" }}
                      >
                        {t.val}
                      </div>
                      <span className="text-[9px] text-gray-500 tracking-wider font-medium">{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Next Match Card */}
          <div
            className="relative rounded-2xl overflow-hidden flex flex-col border border-white/10"
            style={{ background: "linear-gradient(160deg, #0F0F1E 0%, #1A0A20 100%)" }}
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
                    <FlagImg src="/images/flags/mexico.png" alt="MEX" emoji="🇲🇽" size={80} />
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
                    <FlagImg src="/images/flags/canada.png" alt="CAN" emoji="🇨🇦" size={80} />
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
          <div className="rounded-2xl border border-white/10 p-5" style={{ background: "#0F0F1E" }}>
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
                  style={{ background: "rgba(26,26,36,0.7)" }}
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
          <div className="lg:col-span-1 rounded-2xl border border-white/10 p-5" style={{ background: "#0F0F1E" }}>
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
                  style={{ background: "rgba(26,26,36,0.8)" }}
                >
                  <h4 className={`text-[10px] font-black text-center mb-3 tracking-widest ${g.headerColor}`}>{g.name}</h4>
                  <div className="flex flex-col gap-2 flex-grow">
                    {g.teams.map((t, ti) => (
                      <div key={ti} className="flex items-center gap-2 text-[11px]">
                        <span className="text-base leading-none flex-shrink-0">{t.flag}</span>
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
          <div className="rounded-2xl border border-white/10 p-5" style={{ background: "#0F0F1E" }}>
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
          <div className="xl:col-span-2 rounded-2xl border border-white/10 p-5" style={{ background: "#0F0F1E" }}>
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
          <div className="xl:col-span-3 rounded-2xl border border-white/10 p-5" style={{ background: "#0F0F1E" }}>
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
                  style={{ background: "#1A1A2E" }}
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
