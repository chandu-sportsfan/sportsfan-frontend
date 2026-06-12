"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Trophy,
  MapPin,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";
import BackButton from "@/src/components/ReusableComponent/BackButton";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamRow {
  rank: number;
  abbr: string;
  flag: string;
  name: string;
  group: string;
  p: number;
  w: number;
  l: number;
  nrr: string;
  pts: number;
  qualified?: boolean;
}

interface PlayerRow {
  rank: number;
  player: string;
  country: string;
  flag: string;
  m: number;
  runs?: number;
  wickets?: number;
  avg: string;
  sr?: string;
  econ?: string;
}

interface MatchCard {
  matchNo: number;
  date: string;
  time?: string;
  teamA: string;
  teamAFull: string;
  teamAFlag: string;
  teamB: string;
  teamBFull: string;
  teamBFlag: string;
  venue?: string;
  group?: string;
  status: "upcoming" | "live" | "completed";
  result?: string;
  scoreA?: string;
  scoreB?: string;
  oversA?: string;
  oversB?: string;
}

interface NextMatch {
  matchNo: number;
  group: string;
  label?: string;
  teamA: string;
  teamAFull: string;
  teamAFlag: string;
  teamB: string;
  teamBFull: string;
  teamBFlag: string;
  date: string;
  time: string;
  venue: string;
}

interface TournamentStats {
  matches: number;
  teams: number;
  venues: number;
  daysToGo: number;
  dates: string;
  location: string;
}

type TabId = "table" | "stats" | "matches" | "semifinals";

// ─── Country flags (emoji) ────────────────────────────────────────────────────
const COUNTRY_FLAGS: Record<string, string> = {
  "AUS-W": "🇦🇺",
  "BAN-W": "🇧🇩",
  "ENG-W": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "IND-W": "🇮🇳",
  "NZ-W": "🇳🇿",
  "PAK-W": "🇵🇰",
  "SA-W": "🇿🇦",
  "SL-W": "🇱🇰",
  "WI-W": "🌴",
  "SCO-W": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "IRE-W": "🇮🇪",
  "TBC": "❓",
};

// ─── Static Data ──────────────────────────────────────────────────────────────

const TOURNAMENT: TournamentStats = {
  matches: 33,
  teams: 12,
  venues: 7,
  daysToGo: 26,
  dates: "11 JUN – 5 JULY 2026",
  location: "ENGLAND & WALES",
};

const NEXT_MATCH: NextMatch = {
  matchNo: 1,
  group: "Group A",
  label: "OPENING MATCH",
  teamA: "ENG-W",
  teamAFull: "England Women",
  teamAFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  teamB: "IND-W",
  teamBFull: "India Women",
  teamBFlag: "🇮🇳",
  date: "11 JUN 2026",
  time: "3:00 PM IST",
  venue: "Edgbaston, Birmingham",
};

const GLANCE = [
  { icon: "calendar", label: "MATCHES", value: "33" },
  { icon: "users", label: "TEAMS", value: "12" },
  { icon: "pin", label: "VENUES", value: "7" },
  { icon: "clock", label: "TOURNAMENT DATES", value: "11 JUN – 5 JULY 2026" },
];

const GROUP_A: TeamRow[] = [
  { rank: 1, abbr: "AUS-W", flag: "🇦🇺", name: "Australia Women", group: "A", p: 0, w: 0, l: 0, nrr: "0.000", pts: 0 },
  { rank: 2, abbr: "ENG-W", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", name: "England Women", group: "A", p: 0, w: 0, l: 0, nrr: "0.000", pts: 0 },
  { rank: 3, abbr: "NZ-W", flag: "🇳🇿", name: "New Zealand Women", group: "A", p: 0, w: 0, l: 0, nrr: "0.000", pts: 0 },
  { rank: 4, abbr: "SA-W", flag: "🇿🇦", name: "South Africa Women", group: "A", p: 0, w: 0, l: 0, nrr: "0.000", pts: 0 },
  { rank: 5, abbr: "SCO-W", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", name: "Scotland Women", group: "A", p: 0, w: 0, l: 0, nrr: "0.000", pts: 0 },
  { rank: 6, abbr: "IRE-W", flag: "🇮🇪", name: "Ireland Women", group: "A", p: 0, w: 0, l: 0, nrr: "0.000", pts: 0 },
];

const GROUP_B: TeamRow[] = [
  { rank: 1, abbr: "IND-W", flag: "🇮🇳", name: "India Women", group: "B", p: 0, w: 0, l: 0, nrr: "0.000", pts: 0 },
  { rank: 2, abbr: "PAK-W", flag: "🇵🇰", name: "Pakistan Women", group: "B", p: 0, w: 0, l: 0, nrr: "0.000", pts: 0 },
  { rank: 3, abbr: "WI-W", flag: "🌴", name: "West Indies Women", group: "B", p: 0, w: 0, l: 0, nrr: "0.000", pts: 0 },
  { rank: 4, abbr: "SL-W", flag: "🇱🇰", name: "Sri Lanka Women", group: "B", p: 0, w: 0, l: 0, nrr: "0.000", pts: 0 },
  { rank: 5, abbr: "BAN-W", flag: "🇧🇩", name: "Bangladesh Women", group: "B", p: 0, w: 0, l: 0, nrr: "0.000", pts: 0 },
  { rank: 6, abbr: "TBC", flag: "❓", name: "TBC", group: "B", p: 0, w: 0, l: 0, nrr: "0.000", pts: 0 },
];

const ORANGE_CAP: PlayerRow[] = [
  { rank: 1, player: "Smriti Mandhana", country: "IND-W", flag: "🇮🇳", m: 0, runs: 0, avg: "-", sr: "-" },
  { rank: 2, player: "Heather Knight", country: "ENG-W", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", m: 0, runs: 0, avg: "-", sr: "-" },
  { rank: 3, player: "Beth Mooney", country: "AUS-W", flag: "🇦🇺", m: 0, runs: 0, avg: "-", sr: "-" },
  { rank: 4, player: "Nat Sciver-Brunt", country: "ENG-W", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", m: 0, runs: 0, avg: "-", sr: "-" },
  { rank: 5, player: "Laura Wolvaardt", country: "SA-W", flag: "🇿🇦", m: 0, runs: 0, avg: "-", sr: "-" },
];

const PURPLE_CAP: PlayerRow[] = [
  { rank: 1, player: "Sophie Ecclestone", country: "ENG-W", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", m: 0, wickets: 0, avg: "-", econ: "-" },
  { rank: 2, player: "Shabnim Ismail", country: "SA-W", flag: "🇿🇦", m: 0, wickets: 0, avg: "-", econ: "-" },
  { rank: 3, player: "Ashleigh Gardner", country: "AUS-W", flag: "🇦🇺", m: 0, wickets: 0, avg: "-", econ: "-" },
  { rank: 4, player: "Deepti Sharma", country: "IND-W", flag: "🇮🇳", m: 0, wickets: 0, avg: "-", econ: "-" },
  { rank: 5, player: "Marizanne Kapp", country: "SA-W", flag: "🇿🇦", m: 0, wickets: 0, avg: "-", econ: "-" },
];

const UPCOMING_MATCHES: MatchCard[] = [
  {
    matchNo: 1, date: "11 Jun", time: "3:00 PM IST",
    teamA: "ENG-W", teamAFull: "England Women", teamAFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    teamB: "IND-W", teamBFull: "India Women", teamBFlag: "🇮🇳",
    venue: "Edgbaston, Birmingham", group: "Group A", status: "upcoming",
  },
  {
    matchNo: 2, date: "12 Jun", time: "3:00 PM IST",
    teamA: "AUS-W", teamAFull: "Australia Women", teamAFlag: "🇦🇺",
    teamB: "NZ-W", teamBFull: "New Zealand Women", teamBFlag: "🇳🇿",
    venue: "Lord's, London", group: "Group A", status: "upcoming",
  },
  {
    matchNo: 3, date: "13 Jun", time: "3:00 PM IST",
    teamA: "SA-W", teamAFull: "South Africa Women", teamAFlag: "🇿🇦",
    teamB: "SCO-W", teamBFull: "Scotland Women", teamBFlag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    venue: "The Oval, London", group: "Group A", status: "upcoming",
  },
  {
    matchNo: 4, date: "14 Jun", time: "3:00 PM IST",
    teamA: "WI-W", teamBFull: "Pakistan Women", teamAFlag: "🌴",
    teamB: "PAK-W", teamAFull: "West Indies Women", teamBFlag: "🇵🇰",
    venue: "Headingley, Leeds", group: "Group B", status: "upcoming",
  },
  {
    matchNo: 5, date: "15 Jun", time: "3:00 PM IST",
    teamA: "IND-W", teamAFull: "India Women", teamAFlag: "🇮🇳",
    teamB: "IRE-W", teamBFull: "Ireland Women", teamBFlag: "🇮🇪",
    venue: "Trent Bridge, Nottingham", group: "Group A", status: "upcoming",
  },
];

const SEMIFINAL_MATCHES: MatchCard[] = [
  {
    matchNo: 32, date: "2 Jul",
    teamA: "TBC", teamAFull: "Group A Winner", teamAFlag: "❓",
    teamB: "TBC", teamBFull: "Group B Runner Up", teamBFlag: "❓",
    venue: "Lord's, London", status: "upcoming",
  },
  {
    matchNo: 33, date: "3 Jul",
    teamA: "TBC", teamAFull: "Group B Winner", teamAFlag: "❓",
    teamB: "TBC", teamBFull: "Group A Runner Up", teamBFlag: "❓",
    venue: "Lord's, London", status: "upcoming",
  },
];

const FINAL_MATCH: MatchCard = {
  matchNo: 34, date: "5 Jul",
  teamA: "TBC", teamAFull: "Semi-Final 1 Winner", teamAFlag: "❓",
  teamB: "TBC", teamBFull: "Semi-Final 2 Winner", teamBFlag: "❓",
  venue: "Lord's, London", status: "upcoming",
};

const PARTICIPATING_TEAMS = [
  { abbr: "AUS-W", flag: "🇦🇺" },
  { abbr: "BAN-W", flag: "🇧🇩" },
  { abbr: "ENG-W", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { abbr: "IND-W", flag: "🇮🇳" },
  { abbr: "NZ-W", flag: "🇳🇿" },
  { abbr: "PAK-W", flag: "🇵🇰" },
  { abbr: "SA-W", flag: "🇿🇦" },
  { abbr: "SL-W", flag: "🇱🇰" },
  { abbr: "WI-W", flag: "🌴" },
  { abbr: "SCO-W", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { abbr: "IRE-W", flag: "🇮🇪" },
  { abbr: "TBC", flag: "❓" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FlagAvatar({ flag, size = "md" }: { flag: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: "w-8  h-8  text-base",
    md: "w-12 h-12 text-2xl",
    lg: "w-16 h-16 text-4xl",
    xl: "w-20 h-20 text-5xl",
  };
  return (
    <div
      className={`${sizes[size]} flex-shrink-0 flex items-center justify-center rounded-full border border-white/10`}
      style={{ background: "rgba(255,255,255,0.06)" }}
    >
      <span>{flag}</span>
    </div>
  );
}

// ─── Team Logo ────────────────────────────────────────────────────────────────

function TeamLogo({ team, size = 40 }: { team: string; size?: number }) {
  return (
    <div
      style={{ width: size, height: size, position: "relative", flexShrink: 0 }}
    >
      <Image
        src={`/images/${team.toLowerCase()}.png`}
        alt={team}
        fill
        className="object-contain"
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}

// ─── Hero Banner ──────────────────────────────────────────────────────────────

function HeroBanner() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-5"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6)),url('/images/womens_t20_hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        border: "1px solid rgba(233,30,140,0.25)",
        minHeight: 200,
      }}
    >
      {/* Glow orbs */}
      <div className="absolute -top-10 -left-10 w-52 h-52 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(233,30,140,0.25) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-10 right-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(100,30,200,0.2) 0%, transparent 70%)" }} />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 pt-5 pb-4 gap-4">
        {/* Left: logo + text */}
        <div className="flex items-center gap-4">
          {/* ICC T20 Womens logo */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <Image
              src="/images/womens_t20_logo.png"
              alt="logo"
              fill
              className="object-contain"
            />
          </div>

          <div>
            <p className="text-[#e91e8c] text-[10px] font-bold tracking-widest uppercase mb-0.5">ICC</p>
            <h1 className="text-white font-black text-2xl sm:text-3xl leading-none tracking-tight">
              WOMEN'S T20
            </h1>
            <h1 className="text-white font-black text-2xl sm:text-3xl leading-none tracking-tight mb-1">
              WORLD CUP 2026
            </h1>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-white/60 text-[10px]">
                <Calendar size={10} />
                {TOURNAMENT.dates}
              </span>
              <span className="flex items-center gap-1 text-white/60 text-[10px]">
                <MapPin size={10} />
                {TOURNAMENT.location}
              </span>
            </div>
            <p className="text-white/50 text-[11px] mt-1.5 leading-snug">
              The biggest stage in women's T20 cricket returns!<br />
              12 teams, 33 matches, 7 iconic venues. One champion.
            </p>
          </div>
        </div>

        {/* Right: Trophy illustration */}
        <div className="flex-shrink-0 hidden sm:flex items-center justify-center w-44 h-44">
          <div className="relative w-44 h-44">
            <Image
              src="/images/trophy.png"
              alt="trophy"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div
        className="relative z-10 flex items-center divide-x px-5 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", divideColor: "rgba(255,255,255,0.08)" }}
      >
        {[
          { icon: <Calendar size={14} />, value: TOURNAMENT.matches, label: "MATCHES" },
          { icon: <Users size={14} />, value: TOURNAMENT.teams, label: "TEAMS" },
          { icon: <Clock size={14} />, value: TOURNAMENT.daysToGo, label: "DAYS TO GO" },
        ].map((s, i) => (
          <div key={i} className={`flex items-center gap-2 px-4 ${i === 0 ? "pl-0" : ""}`}>
            <span className="text-[#e91e8c]">{s.icon}</span>
            <div>
              <p className="text-white font-black text-lg leading-none">{s.value}</p>
              <p className="text-white/40 text-[9px] tracking-widest uppercase">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Next Match + Tournament At a Glance ─────────────────────────────────────

function NextMatchAndGlance() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      {/* Next Match */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "#0d0e1c", border: "1px solid #1e1e30" }}
      >
        <div className="px-4 pt-3 pb-2">
          <p
            className="text-[#e91e8c] text-[9px] font-black tracking-widest uppercase mb-2"
          >
            NEXT MATCH
          </p>

          {/* Opening match badge */}
          <div className="flex items-center gap-2 mb-3">
            {NEXT_MATCH.label && (
              <span
                className="text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest"
                style={{ background: "#e91e8c", color: "#fff" }}
              >
                {NEXT_MATCH.label}
              </span>
            )}
            <span className="text-gray-500 text-[10px]">
              Match {NEXT_MATCH.matchNo} • {NEXT_MATCH.group}
            </span>
          </div>

          {/* Teams VS row */}
          <div className="flex items-center justify-between gap-2 mb-3">
            {/* Team A */}
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <TeamLogo team={NEXT_MATCH.teamA} size={60} />
              <span className="text-white font-black text-sm tracking-wide">{NEXT_MATCH.teamA}</span>
            </div>

            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0"
              style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
            >
              VS
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <TeamLogo team={NEXT_MATCH.teamB} size={60} />
              <span className="text-white font-black text-sm tracking-wide">{NEXT_MATCH.teamB}</span>
            </div>
          </div>

          {/* Date/time/venue */}
          <div className="flex flex-col gap-1 mb-3">
            <div className="flex items-center gap-1.5 text-white/50 text-[10px]">
              <Calendar size={10} />
              {NEXT_MATCH.date} • {NEXT_MATCH.time}
            </div>
            <div className="flex items-center gap-1.5 text-white/50 text-[10px]">
              <MapPin size={10} />
              {NEXT_MATCH.venue}
            </div>
          </div>

          <button
            className="w-full py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
            style={{ background: "transparent", border: "1.5px solid #e91e8c", color: "#e91e8c" }}
          >
            VIEW MATCH CENTRE
          </button>
        </div>
      </div>

      {/* Tournament At a Glance */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "#0d0e1c", border: "1px solid #1e1e30" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e30]">
          <p className="text-[#e91e8c] text-[10px] font-black tracking-widest uppercase">
            TOURNAMENT AT A GLANCE
          </p>
          <ChevronRight size={14} className="text-gray-500" />
        </div>
        <div className="divide-y divide-[#1e1e30]">
          {[
            { icon: <Calendar size={14} />, label: "MATCHES", value: "33" },
            { icon: <Users size={14} />, label: "TEAMS", value: "12" },
            { icon: <MapPin size={14} />, label: "VENUES", value: "7" },
            { icon: <Clock size={14} />, label: "TOURNAMENT DATES", value: "11 JUN – 5 JULY 2026" },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="text-[#e91e8c]">{row.icon}</span>
                <span className="text-white/50 text-[10px] font-bold tracking-widest uppercase">{row.label}</span>
              </div>
              <span className="text-white font-black text-sm">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Points Table Tab ──────────────────────────────────────────────────────────

function PointsTableTab() {
  const [activeGroup, setActiveGroup] = useState<"A" | "B">("A");
  const rows = activeGroup === "A" ? GROUP_A : GROUP_B;

  return (
    <div>
      {/* Group selector */}
      <div className="flex gap-2 mb-4">
        {(["A", "B"] as const).map((g) => (
          <button
            key={g}
            onClick={() => setActiveGroup(g)}
            className={`flex-1 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${activeGroup === g ? "text-white" : "text-gray-600 hover:text-gray-400"
              }`}
            style={{
              background: activeGroup === g ? "rgba(233,30,140,0.15)" : "rgba(255,255,255,0.03)",
              border: activeGroup === g ? "1px solid rgba(233,30,140,0.4)" : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Group {g}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs min-w-[400px]">
          <thead>
            <tr className="text-gray-600 text-[10px] uppercase tracking-wider border-b border-[#1e1e30]">
              <th className="py-2.5 px-3 text-left w-6">#</th>
              <th className="py-2.5 px-3 text-left">TEAM</th>
              <th className="py-2.5 px-3 text-center">P</th>
              <th className="py-2.5 px-3 text-center">W</th>
              <th className="py-2.5 px-3 text-center">L</th>
              <th className="py-2.5 px-3 text-center">NRR</th>
              <th className="py-2.5 px-3 text-center">PTS</th>
              <th className="py-2.5 px-3 text-center">FORM</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.abbr} className="border-b border-[#13131f] hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-3 text-gray-500 font-bold">{row.rank}</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <TeamLogo team={row.abbr} size={35} />
                    <div>
                      <p className="text-white font-bold whitespace-nowrap">{row.abbr}</p>
                      <p className="text-gray-600 text-[9px] truncate max-w-[120px]">{row.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-center text-gray-400">{row.p}</td>
                <td className="py-3 px-3 text-center text-gray-400">{row.w}</td>
                <td className="py-3 px-3 text-center text-gray-400">{row.l}</td>
                <td className="py-3 px-3 text-center text-gray-400">{row.nrr}</td>
                <td className="py-3 px-3 text-center text-white font-black">{row.pts}</td>
                <td className="py-3 px-3 text-center">
                  <span className="text-[9px] text-gray-600 italic">-</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pre-tournament notice */}
      <div
        className="flex items-center gap-2 mt-4 px-4 py-3 rounded-xl"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-gray-500 text-sm">🔒</span>
        <p className="text-gray-500 text-[11px]">Standings will be updated once the tournament begins.</p>
      </div>
    </div>
  );
}

// ─── Stats Tab ────────────────────────────────────────────────────────────────

function StatsTab() {
  const [capTab, setCapTab] = useState<"runs" | "wickets">("runs");

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex border-b border-[#1e1e30] mb-4">
        <button
          onClick={() => setCapTab("runs")}
          className={`flex-1 py-2.5 text-[10px] font-black tracking-widest uppercase relative transition-colors ${capTab === "runs" ? "text-orange-400" : "text-gray-600 hover:text-gray-400"}`}
        >
          🟠 MOST RUNS
          {capTab === "runs" && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-20 rounded-full" style={{ background: "#f97316" }} />}
        </button>
        <button
          onClick={() => setCapTab("wickets")}
          className={`flex-1 py-2.5 text-[10px] font-black tracking-widest uppercase relative transition-colors ${capTab === "wickets" ? "text-purple-400" : "text-gray-600 hover:text-gray-400"}`}
        >
          🟣 MOST WICKETS
          {capTab === "wickets" && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-20 rounded-full" style={{ background: "#a855f7" }} />}
        </button>
      </div>

      {/* Pre-tournament notice */}
      <div
        className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <span className="text-gray-500 text-sm">📊</span>
        <p className="text-gray-500 text-[11px]">Stats will be updated live once the tournament begins on 11 Jun 2026.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs min-w-[360px]">
          <thead>
            <tr className="text-gray-600 text-[10px] uppercase tracking-wider border-b border-[#1e1e30]">
              <th className="py-2.5 px-3 text-left w-6">#</th>
              <th className="py-2.5 px-3 text-left">PLAYER</th>
              <th className="py-2.5 px-3 text-center">M</th>
              {capTab === "runs" ? (
                <>
                  <th className="py-2.5 px-3 text-center">RUNS</th>
                  <th className="py-2.5 px-3 text-center">AVG</th>
                  <th className="py-2.5 px-3 text-center">SR</th>
                </>
              ) : (
                <>
                  <th className="py-2.5 px-3 text-center">WKTS</th>
                  <th className="py-2.5 px-3 text-center">AVG</th>
                  <th className="py-2.5 px-3 text-center">ECON</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {(capTab === "runs" ? ORANGE_CAP : PURPLE_CAP).map((p) => (
              <tr key={p.rank} className="border-b border-[#13131f] hover:bg-white/[0.02] transition-colors">
                <td className={`py-2.5 px-3 font-bold ${capTab === "runs" ? "text-orange-500" : "text-purple-500"}`}>{p.rank}</td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{p.flag}</span>
                    <div>
                      <p className="text-white font-semibold whitespace-nowrap">{p.player}</p>
                      <p className="text-gray-600 text-[9px]">{p.country}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-center text-gray-400">{p.m}</td>
                {capTab === "runs" ? (
                  <>
                    <td className="py-2.5 px-3 text-center text-orange-400 font-bold">{p.runs}</td>
                    <td className="py-2.5 px-3 text-center text-gray-400">{p.avg}</td>
                    <td className="py-2.5 px-3 text-center text-gray-400">{p.sr}</td>
                  </>
                ) : (
                  <>
                    <td className="py-2.5 px-3 text-center text-purple-400 font-bold">{p.wickets}</td>
                    <td className="py-2.5 px-3 text-center text-gray-400">{p.avg}</td>
                    <td className="py-2.5 px-3 text-center text-gray-400">{p.econ}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Matches Tab ──────────────────────────────────────────────────────────────

function MatchesTab() {
  return (
    <div className="flex flex-col gap-3">
      {UPCOMING_MATCHES.map((m) => (
        <div
          key={m.matchNo}
          className="rounded-xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-3 py-2 border-b border-[rgba(255,255,255,0.05)]"
          >
            <div className="flex items-center gap-2">
              {m.group && (
                <span
                  className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest"
                  style={{ background: "rgba(233,30,140,0.15)", color: "#e91e8c" }}
                >
                  {m.group}
                </span>
              )}
              <span className="text-gray-600 text-[10px]">Match {m.matchNo}</span>
            </div>
            <span className="text-gray-600 text-[10px]">{m.date} • {m.time}</span>
          </div>

          {/* Teams */}
          <div className="flex items-center px-3 py-3 gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <TeamLogo team={m.teamA} size={40} />
              <span className="text-white font-bold text-sm">{m.teamA}</span>
            </div>
            <span
              className="text-[10px] font-bold text-gray-500 px-2 py-1 rounded"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              vs
            </span>
            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
              <span className="text-white font-bold text-sm">{m.teamB}</span>
              <TeamLogo team={m.teamB} size={40} />
            </div>
          </div>

          {/* Venue */}
          {m.venue && (
            <div
              className="flex items-center gap-1.5 px-3 py-2 border-t border-[rgba(255,255,255,0.04)]"
            >
              <MapPin size={10} className="text-gray-600" />
              <span className="text-gray-600 text-[10px]">{m.venue}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Semifinals/Knockouts Tab ─────────────────────────────────────────────────

function SemifinalsTab() {
  return (
    <div>
      {/* Header */}
      <div
        className="rounded-2xl p-4 mb-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(100,30,200,0.3) 0%, rgba(233,30,140,0.2) 100%)",
          border: "1px solid rgba(233,30,140,0.3)",
        }}
      >
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full pointer-events-none" style={{ background: "rgba(233,30,140,0.15)", filter: "blur(20px)" }} />
        <p className="text-[#e91e8c] text-[9px] font-black tracking-widest uppercase mb-1">KNOCKOUT STAGE</p>
        <h3 className="text-white font-black text-base mb-1">Semi-finals & Final</h3>
        <p className="text-gray-400 text-[11px] leading-snug">Top 2 teams from each group advance to the semi-finals.</p>
      </div>

      {/* Semis */}
      <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">SEMI-FINALS</p>
      <div className="flex flex-col gap-3 mb-4">
        {SEMIFINAL_MATCHES.map((m, i) => (
          <div
            key={m.matchNo}
            className="rounded-xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-[rgba(255,255,255,0.05)]">
              <span className="text-gray-500 text-[10px] font-bold">Semi-Final {i + 1} • Match {m.matchNo}</span>
              <span className="text-gray-600 text-[10px]">{m.date} Jul 2026</span>
            </div>
            <div className="flex items-center px-3 py-3 gap-3">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-2xl">{m.teamAFlag}</span>
                <span className="text-white/60 text-sm">{m.teamAFull}</span>
              </div>
              <span className="text-gray-600 text-[10px] font-bold">vs</span>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className="text-white/60 text-sm">{m.teamBFull}</span>
                <span className="text-2xl">{m.teamBFlag}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 border-t border-[rgba(255,255,255,0.04)]">
              <MapPin size={10} className="text-gray-600" />
              <span className="text-gray-600 text-[10px]">{m.venue}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Final */}
      <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-2">FINAL</p>
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(233,30,140,0.1) 0%, rgba(100,30,200,0.1) 100%)",
          border: "1px solid rgba(233,30,140,0.35)",
        }}
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-[rgba(233,30,140,0.15)]">
          <div className="flex items-center gap-2">
            <Trophy size={12} className="text-[#e91e8c]" />
            <span className="text-[#e91e8c] text-[10px] font-black uppercase tracking-widest">FINAL • Match {FINAL_MATCH.matchNo}</span>
          </div>
          <span className="text-gray-500 text-[10px]">{FINAL_MATCH.date} Jul 2026</span>
        </div>
        <div className="flex items-center px-3 py-3 gap-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-2xl">{FINAL_MATCH.teamAFlag}</span>
            <span className="text-white/60 text-sm">{FINAL_MATCH.teamAFull}</span>
          </div>
          <span className="text-[#e91e8c] text-[10px] font-black">vs</span>
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-white/60 text-sm">{FINAL_MATCH.teamBFull}</span>
            <span className="text-2xl">{FINAL_MATCH.teamBFlag}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-2 border-t border-[rgba(233,30,140,0.1)]">
          <MapPin size={10} className="text-[#e91e8c]/60" />
          <span className="text-gray-500 text-[10px]">{FINAL_MATCH.venue}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

function TabBar({ activeTab, onChange }: { activeTab: TabId; onChange: (id: TabId) => void }) {
  const tabs: { id: TabId; label: string }[] = [
    { id: "table", label: "POINTS TABLE" },
    { id: "stats", label: "STATS" },
    { id: "matches", label: "MATCHES" },
    { id: "semifinals", label: "KNOCKOUTS" },
  ];
  return (
    <div className="flex border-b border-[#1e1e30] bg-[#0d0e1c] sticky top-0 z-20 overflow-x-auto no-scrollbar">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`relative flex-1 min-w-[90px] py-4 text-[10px] font-black tracking-widest transition-colors flex items-center justify-center ${activeTab === id ? "text-white" : "text-gray-600 hover:text-gray-400"
            }`}
        >
          {label}
          {activeTab === id && (
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full"
              style={{ width: 40, background: "#e91e8c", boxShadow: "0 0 8px rgba(233,30,140,0.6)" }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Latest News Placeholder ──────────────────────────────────────────────────

function LatestNews() {
  return (
    <div className="mb-4">
      <p className="text-[#e91e8c] text-[10px] font-black tracking-widest uppercase mb-3">LATEST NEWS</p>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="h-16 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span className="text-gray-600 text-2xl">📰</span>
            </div>
            <div className="p-2">
              <div className="h-2 bg-white/10 rounded mb-1 w-full animate-pulse" />
              <div className="h-2 bg-white/10 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <button
        className="w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
        style={{ background: "transparent", border: "1.5px solid rgba(233,30,140,0.4)", color: "#e91e8c" }}
      >
        VIEW ALL NEWS
      </button>
    </div>
  );
}

// ─── Tournament Overview + Participating Teams ─────────────────────────────

function BottomSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mb-4">
      {/* Overview */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "#0d0e1c", border: "1px solid #1e1e30" }}
      >
        <p className="text-[#e91e8c] text-[10px] font-black tracking-widest uppercase mb-3">TOURNAMENT OVERVIEW</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { icon: "🏏", label: "TEAMS", value: "12" },
            { icon: "📅", label: "MATCHES", value: "33" },
            { icon: "📍", label: "VENUES", value: "7" },
            { icon: "⏳", label: "DAYS TO GO", value: "26" },
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="text-white font-black text-lg leading-none">{s.value}</p>
                <p className="text-white/40 text-[8px] tracking-widest uppercase">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-white/40 text-[10px] mb-1">
          <Calendar size={10} />
          11 JUNE – 5 JULY 2026
        </div>
        <div className="flex items-center gap-1.5 text-white/40 text-[10px]">
          <MapPin size={10} />
          ENGLAND & WALES
        </div>
      </div>

      {/* Participating Teams */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "#0d0e1c", border: "1px solid #1e1e30" }}
      >
        <p className="text-[#e91e8c] text-[10px] font-black tracking-widest uppercase mb-3">PARTICIPATING TEAMS</p>
        <div className="grid grid-cols-6 gap-2">
          {PARTICIPATING_TEAMS.map((t) => (
            <div key={t.abbr} className="flex flex-col items-center gap-1">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <TeamLogo team={t.abbr} size={40} />
              </div>
              <span className="text-white/50 text-[8px] font-bold text-center leading-none">{t.abbr}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WomensT20Dashboard() {
  const [tab, setTab] = useState<TabId>("table");

  return (
    <div className="min-h-screen bg-[#0b0c16]" style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}>
      <div className="mx-auto px-3 py-4 sm:px-6 sm:py-6 max-w-4xl">
        {/* Back */}
        <BackButton />
        {/* Hero */}
        <HeroBanner />

        {/* Next Match + At a Glance */}
        <NextMatchAndGlance />

        {/* Points Table card with tabs */}
        <div
          className="rounded-2xl overflow-hidden mb-4"
          style={{ background: "#0d0e1c", border: "1px solid #1e1e30" }}
        >
          <TabBar activeTab={tab} onChange={setTab} />
          <div className="p-4">
            {tab === "table" && <PointsTableTab />}
            {tab === "stats" && <StatsTab />}
            {tab === "matches" && <MatchesTab />}
            {tab === "semifinals" && <SemifinalsTab />}
          </div>
        </div>

        {/* Latest News */}
        <LatestNews />

        {/* Bottom: Overview + Teams */}
        <BottomSection />

        <p className="text-center text-gray-700 text-[11px] mt-4">
          All times are in IST • Timings and matchups are subject to change
        </p>
      </div>
    </div>
  );
}
