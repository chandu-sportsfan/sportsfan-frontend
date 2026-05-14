"use client";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Trophy,
  Crown,
  Users,
  Swords,
  RefreshCw,
  MapPin, // New
  XCircle, // New
  Star, // New
  X // New
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamRow {
  rank: number;
  abbr: string;
  name: string;
  qualified: boolean;
  m: number;
  w: number;
  l: number;
  nr: number;
  pts: number;
  nrr: string;
}

interface PlayerRow {
  rank: number;
  player: string;
  team: string;
  m: number;
  runs?: number;
  wickets?: number;
  avg: string;
  sr?: string;
  hs?: string;
  econ?: string;
}

interface MatchCard {
  matchNo: number;
  date: string;
  day: string;
  time: string;
  teamA: string;
  teamAFull: string;
  teamB: string;
  teamBFull: string;
  venue: string;
  status: "upcoming" | "live" | "completed";
  result?: string;
}

interface HighestScoreRow {
  rank: number;
  player: string;
  team: string;
  score: string;
}

interface MostFiftiesRow {
  rank: number;
  player: string;
  team: string;
  fifties: number;
}

interface TodayMatch {
  teamA: string;
  teamAFull: string;
  teamB: string;
  teamBFull: string;
  time: string;
  venue: string;
  matchNo: number;
  totalMatches: number;
}

interface RecentMatch {
  teamA: string;
  teamB: string;
  result: string;
  scoreA?: string;
  scoreB?: string;
  oversA?: string;
  oversB?: string;
}
interface ExtraStatRow {
  rank: number;
  player: string;
  team: string;
  value: string | number;
  subValue?: string;
}

interface StatsData {
  teamLogos: Record<string, string>;
  pointsTable: TeamRow[];
  orangeCap: PlayerRow[];
  purpleCap: PlayerRow[];
  todayMatch: TodayMatch;
  recentMatch: RecentMatch;
  upcomingMatches: MatchCard[];
  recentMatches: MatchCard[];
  highestScores: HighestScoreRow[];
  mostFifties: MostFiftiesRow[];
  extraStats: {
    bestBowling: ExtraStatRow[];
    battingAvg: ExtraStatRow[];
    bowlingAvg: ExtraStatRow[];
    mostHundreds: ExtraStatRow[];
    mostEcon: ExtraStatRow[];
    maxSixes: ExtraStatRow[];
    maxFours: ExtraStatRow[];
    boundaries: ExtraStatRow[];
  };
    playoffs: {
    q1: MatchCard;
    eliminator: MatchCard;
    q2: MatchCard;
    final: MatchCard;

  };
}

type TabId = "table" | "stats" | "matches" | "playoffs";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TeamLogo({ abbr, logos, size = "md" }: { abbr: string; logos?: Record<string, string>; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = { sm: "w-6 h-6", md: "w-8 h-8", lg: "w-12 h-12", xl: "w-16 h-16" };
  const src = logos?.[abbr] || `/teams/${abbr?.toUpperCase()}.png`;
  return (
    <div className={`${sizes[size]} flex-shrink-0 flex items-center justify-center`}>
      <img
        src={src}
        alt={abbr}
        className="w-full h-full object-contain"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.3"; }}
      />
    </div>
  );
}

function cleanPlayer(name: string) {
  return name.replace(/[🟠🟣]/g, "").trim();
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection({
  todayMatch,
  recentMatch,
  logos, // <--- Add this
}: {
  todayMatch: TodayMatch;
  recentMatch: RecentMatch;
  logos: Record<string, string>; // <--- Add this
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-2xl border border-[#1e1e30] overflow-hidden mb-4"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, rgba(30,60,120,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(80,20,80,0.3) 0%, transparent 60%), #0b0c1a",
      }}
    >
      {/* Match info row */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: "rgba(30,80,200,0.3)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.25)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"
          />
          Today • {todayMatch.time}
        </span>
        <span
          className="text-xs px-3 py-1.5 rounded-full text-gray-400"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          T20 • Match {todayMatch.matchNo} of {todayMatch.totalMatches}
        </span>
      </div>

      {/* Teams row */}
      <div className="flex items-center justify-between px-6 py-4">
        {/* Team A */}
        <div className="flex flex-col items-center gap-2 w-28 sm:w-36">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(30,80,200,0.2) 0%, transparent 70%)",
            }}
          >
            <img
              src={logos[todayMatch.teamA] || `/teams/${todayMatch.teamA}.png`}
              alt={todayMatch.teamA}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg"
            />
          </div>
          <span className="text-white text-xl sm:text-2xl font-black tracking-wide">
            {todayMatch.teamA}
          </span>
        </div>

        {/* VS */}
        <div className="flex flex-col items-center gap-1">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-gray-400"
            style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
          >
            VS
          </div>
          <p className="text-[10px] text-gray-500 text-center max-w-[140px] leading-relaxed hidden sm:block">
            {todayMatch.venue}
          </p>
        </div>

        {/* Team B */}
        <div className="flex flex-col items-center gap-2 w-28 sm:w-36">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(180,30,30,0.2) 0%, transparent 70%)",
            }}
          >
            <img
              src={logos[todayMatch.teamB] || `/teams/${todayMatch.teamB}.png`}
              alt={todayMatch.teamB}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg"
            />
          </div>
          <span className="text-white text-xl sm:text-2xl font-black tracking-wide">
            {todayMatch.teamB}
          </span>
        </div>
      </div>

      {/* Venue (mobile) */}
      <p className="text-[11px] text-gray-500 text-center px-4 pb-2 sm:hidden leading-snug">
        {todayMatch.venue}
      </p>

      {/* Recent match ticker */}
      <div className="mx-4 mb-2 mt-1">
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl "
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Label */}
          <span className="text-[10px] font-bold text-gray-500 tracking-widest whitespace-nowrap">
            RECENT MATCH
          </span>
          {/* Teams — centered */}
          <div className="flex items-center justify-center gap-2 flex-1">
            <TeamLogo abbr={recentMatch.teamA} size="sm" logos={logos} />
            <span className="text-white font-bold text-sm">{recentMatch.teamA}</span>
            <span className="text-gray-600 text-xs">vs</span>
            <span className="text-white font-bold text-sm">{recentMatch.teamB}</span>
            <TeamLogo abbr={recentMatch.teamB} size="sm" logos={logos} />
          </div>
          {/* Result — right aligned */}
          <span className="text-gray-300 text-xs whitespace-nowrap">{recentMatch.result}</span>
        </div>
      </div>

      {/* Expand toggle */}
      <div className="flex justify-center pb-3">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Expanded scorecard */}
      {expanded && (
        <div
          className="mx-4 mb-4 rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.3)" }}
        >
          <div className="px-4 py-2 border-b border-[rgba(255,255,255,0.06)]">
            <span className="text-xs text-gray-500 font-semibold tracking-wider">MATCH SCORECARD</span>
          </div>
          {/* Inside HeroSection's expanded scorecard block: */}
          <div className="grid grid-cols-2 divide-x divide-[rgba(255,255,255,0.06)]">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TeamLogo abbr={recentMatch.teamA} size="sm" logos={logos} />
                <span className="text-white font-bold">{recentMatch.teamA}</span>
              </div>
              <p className="text-white text-xl font-black">{recentMatch.scoreA || "N/A"}</p>
              {recentMatch.oversA ? (
                <p className="text-gray-500 text-xs mt-1">({recentMatch.oversA} overs)</p>
              ) : (
                <p className="text-gray-500 text-xs mt-1 min-h-[16px]"></p>
              )}
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TeamLogo abbr={recentMatch.teamB} size="sm" logos={logos} />
                <span className="text-white font-bold">{recentMatch.teamB}</span>
              </div>
              <p className="text-white text-xl font-black">{recentMatch.scoreB || "N/A"}</p>
              {recentMatch.oversB ? (
                <p className="text-gray-500 text-xs mt-1">({recentMatch.oversB} overs)</p>
              ) : (
                <p className="text-gray-500 text-xs mt-1 min-h-[16px]"></p>
              )}
            </div>
          </div>
          <div
            className="px-4 py-3 text-center"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(233,30,140,0.06)" }}
          >
            <p className="text-[#e91e8c] text-sm font-semibold">{recentMatch.result}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Cap Holders Section ──────────────────────────────────────────────────────

function CapHoldersSection({ orangeCap, purpleCap, logos }: { orangeCap: PlayerRow[]; purpleCap: PlayerRow[]; logos: Record<string, string> }) {
  const [showAll, setShowAll] = useState(false);
  const [capTab, setCapTab] = useState<"orange" | "purple">("orange");
  const top1Orange = orangeCap[0];
  const top1Purple = purpleCap[0];

  return (
    <div
      className="rounded-2xl border border-[#1e1e30] mb-4 overflow-hidden"
      style={{ background: "#0d0e1c" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e30]">
        <h2 className="text-white font-bold text-base">Current Cap Holders</h2>
        <button
          onClick={() => setShowAll((v) => !v)}
          className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          {showAll ? "Show Less" : "Show All"}
          <ChevronRight
            size={14}
            className={`transition-transform duration-300 ${showAll ? "rotate-90" : ""}`}
          />
        </button>
      </div>

      {/* Default view: top 1 cards */}
      {!showAll && top1Orange && top1Purple && (
        <div className="grid grid-cols-2 gap-3 p-3">
          {/* Orange Cap Card */}
          <div
            className="rounded-xl p-3 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(180,60,0,0.4) 0%, rgba(80,25,0,0.6) 100%)",
              border: "1px solid rgba(251,146,60,0.3)",
            }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background:
                  "radial-gradient(ellipse at bottom right, rgba(251,146,60,0.6) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-2">
                <img src="/teams/orange_cap.png" alt="Orange Cap" className="w-5 h-5 objeAct-contain" />
                <span className="text-orange-400 text-xs font-bold tracking-wide">Orange Cap</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <TeamLogo abbr={top1Orange.team} size="sm" logos={logos} />
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm leading-tight truncate">
                    {cleanPlayer(top1Orange.player)}
                  </p>
                  <p className="text-orange-300/70 text-xs">{top1Orange.team}</p>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-2xl font-black">{top1Orange.runs}</span>
                <span className="text-orange-300/70 text-xs">Runs</span>
              </div>
            </div>
          </div>

          {/* Purple Cap Card */}
          <div
            className="rounded-xl p-3 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(90,0,160,0.4) 0%, rgba(40,0,80,0.6) 100%)",
              border: "1px solid rgba(192,132,252,0.3)",
            }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background:
                  "radial-gradient(ellipse at bottom right, rgba(192,132,252,0.6) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-2">
                <img src="/teams/purple_cap.png" alt="Purple Cap" className="w-5 h-5 object-contain" />
                <span className="text-purple-400 text-xs font-bold tracking-wide">Purple Cap</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <TeamLogo abbr={top1Purple.team} size="md" logos={logos} />
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm leading-tight truncate">
                    {cleanPlayer(top1Purple.player)}
                  </p>
                  <p className="text-purple-300/70 text-xs">{top1Purple.team}</p>
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-2xl font-black">{top1Purple.wickets}</span>
                <span className="text-purple-300/70 text-xs">Wickets</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded view: single table with Orange / Purple sub-tabs */}
      {showAll && (
        <div>
          {/* Sub-tab bar */}
          <div className="flex border-b border-[#1e1e30]">
            <button
              onClick={() => setCapTab("orange")}
              className={`flex items-center gap-2 flex-1 justify-center py-3 text-xs font-bold tracking-wide transition-colors relative ${
                capTab === "orange" ? "text-orange-400" : "text-gray-600 hover:text-gray-400"
              }`}
            >
              <img src="/teams/orange_cap.png" alt="" className="w-4 h-4 object-contain" />
              ORANGE CAP
              {capTab === "orange" && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-20 rounded-full"
                  style={{ background: "#f97316" }}
                />
              )}
            </button>
            <button
              onClick={() => setCapTab("purple")}
              className={`flex items-center gap-2 flex-1 justify-center py-3 text-xs font-bold tracking-wide transition-colors relative ${
                capTab === "purple" ? "text-purple-400" : "text-gray-600 hover:text-gray-400"
              }`}
            >
              <img src="/teams/purple_cap.png" alt="" className="w-4 h-4 object-contain" />
              PURPLE CAP
              {capTab === "purple" && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-20 rounded-full"
                  style={{ background: "#a855f7" }}
                />
              )}
            </button>
          </div>

          {/* Orange Cap table */}
          {capTab === "orange" && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[380px] border-collapse text-xs">
                <thead>
                  <tr className="text-gray-600 text-[10px] uppercase tracking-wider border-b border-[#1e1e30]">
                    <th className="py-2.5 px-4 text-left w-8">#</th>
                    <th className="py-2.5 px-4 text-left">Player</th>
                    <th className="py-2.5 px-4 text-center">MAT</th>
                    <th className="py-2.5 px-4 text-center">Runs</th>
                    <th className="py-2.5 px-4 text-center">SR</th>
                  </tr>
                </thead>
                <tbody>
                  {orangeCap.map((p) => (
                    <tr key={p.rank} className="border-b border-[#13131f] hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-4 text-orange-500 font-bold">{p.rank}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <TeamLogo abbr={p.team} size="sm" logos={logos} />
                          <div className="min-w-0">
                            <p className="text-white whitespace-nowrap">{cleanPlayer(p.player)}</p>
                            <p className="text-gray-600 text-[10px]">{p.team}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-center text-gray-400">{p.m}</td>
                      <td className="py-2.5 px-4 text-center text-orange-400 font-bold">{p.runs}</td>
                      <td className="py-2.5 px-4 text-center text-gray-400">{p.sr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Purple Cap table */}
          {capTab === "purple" && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[380px] border-collapse text-xs">
                <thead>
                  <tr className="text-gray-600 text-[10px] uppercase tracking-wider border-b border-[#1e1e30]">
                    <th className="py-2.5 px-4 text-left w-8">#</th>
                    <th className="py-2.5 px-4 text-left">Player</th>
                    <th className="py-2.5 px-4 text-center">MAT</th>
                    <th className="py-2.5 px-4 text-center">Wkts</th>
                    <th className="py-2.5 px-4 text-center">Econ</th>
                  </tr>
                </thead>
                <tbody>
                  {purpleCap.map((p) => (
                    <tr key={p.rank} className="border-b border-[#13131f] hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-4 text-purple-500 font-bold">{p.rank}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <TeamLogo abbr={p.team} size="sm" logos={logos} />
                          <div className="min-w-0">
                            <p className="text-white whitespace-nowrap">{cleanPlayer(p.player)}</p>
                            <p className="text-gray-600 text-[10px]">{p.team}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-center text-gray-400">{p.m}</td>
                      <td className="py-2.5 px-4 text-center text-purple-400 font-bold">{p.wickets}</td>
                      <td className="py-2.5 px-4 text-center text-gray-400">{p.econ}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ─── Points Table Tab ─────────────────────────────────────────────────────────

function PointsTableTab({ rows, logos }: { rows: TeamRow[]; logos: Record<string, string> }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-base">Points Table</h3>
        <span className="text-xs text-gray-500">All times in IST</span>
      </div>
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full min-w-[580px] border-collapse text-sm">
          <thead>
            <tr className="text-gray-500 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3 text-left w-8">#</th>
              <th className="py-3 px-3 text-left min-w-[160px]">Team</th>
              <th className="py-3 px-3 text-center">M</th>
              <th className="py-3 px-3 text-center">W</th>
              <th className="py-3 px-3 text-center">L</th>
              <th className="py-3 px-3 text-center">NR</th>
              <th className="py-3 px-3 text-center">PTS</th>
              <th className="py-3 px-3 text-center">NRR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((team) => (
              <tr
                key={team.abbr}
                className={`border-t transition-colors hover:bg-white/[0.03] ${
                  team.rank === 4
                    ? "border-t-[#2a2a3e]"
                    : "border-t-[#13131f]"
                }`}
                style={
                  team.qualified
                    ? { borderLeft: "2px solid #eab308" }
                    : { borderLeft: "2px solid transparent" }
                }
              >
                <td className={`py-3 px-3 font-bold text-sm ${team.qualified ? "text-yellow-400" : "text-gray-600"}`}>
                  {team.rank}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2.5">
                    <TeamLogo abbr={team.abbr} size="sm" logos={logos} />
                    <span className="text-white font-medium whitespace-nowrap text-sm">{team.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center text-gray-400 whitespace-nowrap">{team.m}</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-semibold whitespace-nowrap">{team.w}</td>
                <td className="py-3 px-3 text-center text-rose-400 font-semibold whitespace-nowrap">{team.l}</td>
                <td className="py-3 px-3 text-center text-gray-500 whitespace-nowrap">{team.nr}</td>
                <td className="py-3 px-3 text-center text-white font-bold whitespace-nowrap">{team.pts}</td>
                <td className={`py-3 px-3 text-center font-medium whitespace-nowrap ${
                  String(team.nrr).startsWith("+") ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {team.nrr}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function StatCard({ 
  title, 
  icon: Icon, 
  rows, 
  logos, 
  valueLabel, 
  accentColor 
}: { 
  title: string; 
  icon: React.ElementType; 
  rows: ExtraStatRow[]; 
  logos: Record<string, string>; 
  valueLabel: string; 
  accentColor: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#0d0e1c", border: "1px solid #1e1e30" }}>
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#1e1e30]">
        <Icon size={16} className={accentColor} />
        <span className="text-white font-bold text-sm">{title}</span>
      </div>
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="text-gray-600 text-[10px] uppercase tracking-wider border-b border-[#13131f]">
            <th className="py-2 px-4 text-left w-6">#</th>
            <th className="py-2 px-4 text-left">Player</th>
            <th className="py-2 px-4 text-right">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[#13131f] hover:bg-white/[0.02] transition-colors">
              <td className="py-2.5 px-4 text-yellow-500 font-bold">{row.rank}</td>
              <td className="py-2.5 px-4">
                <div className="flex items-center gap-2">
                  <TeamLogo abbr={row.team} size="sm" logos={logos} />
                  <div className="min-w-0">
                    <p className="text-white truncate">{row.player}</p>
                    <p className="text-[9px] text-gray-500 uppercase">
                      {row.team} {row.subValue ? `• ${row.subValue}` : ""}
                    </p>
                  </div>
                </div>
              </td>
              <td className={`py-2.5 px-4 text-right font-bold ${accentColor}`}>
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// ─── Stats Tab ────────────────────────────────────────────────────────────────

function StatsTab({ data }: { data: StatsData }) {
  const [viewAll, setViewAll] = useState(false);
  const logos = data.teamLogos;
  const extra = data.extraStats;

  // Helper to limit rows shown based on the View All toggle
  const limit = (arr: ExtraStatRow[]) => viewAll ? arr : arr.slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-base">Season Leaders</h3>
        <button 
          onClick={() => setViewAll(!viewAll)} 
          className="text-xs font-semibold text-[#e91e8c] hover:text-pink-400 transition-colors"
        >
          {viewAll ? "Show Less" : "View All"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Row 1: Traditional Stats (Mapped to match ExtraStatRow shape) */}
        <StatCard 
          title="Highest Score" 
          icon={Trophy} 
          rows={limit(data.highestScores.map(r => ({ rank: r.rank, player: r.player, team: r.team, value: r.score })))} 
          logos={logos} 
          valueLabel="Runs" 
          accentColor="text-blue-400" 
        />
        <StatCard 
          title="Most Fifties" 
          icon={Crown} 
          rows={limit(data.mostFifties.map(r => ({ rank: r.rank, player: r.player, team: r.team, value: r.fifties })))} 
          logos={logos} 
          valueLabel="50s" 
          accentColor="text-purple-400" 
        />

        {/* Row 2: Boundaries */}
        <StatCard title="Maximum Sixes" icon={Swords} rows={limit(extra.maxSixes)} logos={logos} valueLabel="6s" accentColor="text-orange-400" />
        <StatCard title="Maximum Fours" icon={Star} rows={limit(extra.maxFours)} logos={logos} valueLabel="4s" accentColor="text-yellow-400" />

        {/* Row 3: Performance Averages */}
        <StatCard title="Batting Average" icon={Users} rows={limit(extra.battingAvg)} logos={logos} valueLabel="Avg" accentColor="text-emerald-400" />
        <StatCard title="Bowling Average" icon={RefreshCw} rows={limit(extra.bowlingAvg)} logos={logos} valueLabel="Avg" accentColor="text-rose-400" />

        {/* Row 4: Bowling Efficiency */}
        <StatCard title="Best Bowling Figures" icon={Trophy} rows={limit(extra.bestBowling)} logos={logos} valueLabel="BBI" accentColor="text-blue-300" />
        <StatCard title="Most Economical" icon={Crown} rows={limit(extra.mostEcon)} logos={logos} valueLabel="Econ" accentColor="text-indigo-400" />

        {/* Row 5: Milestones */}
        <StatCard title="Most Hundreds" icon={Star} rows={limit(extra.mostHundreds)} logos={logos} valueLabel="100s" accentColor="text-amber-400" />
        <StatCard title="Total Boundaries" icon={Swords} rows={limit(extra.boundaries)} logos={logos} valueLabel="Total" accentColor="text-pink-400" />
      </div>
    </div>
  );
}

// ─── Matches Tab ──────────────────────────────────────────────────────────────

function MatchesTab({ upcomingMatches, recentMatches, logos }: { upcomingMatches: MatchCard[], recentMatches: MatchCard[], logos: Record<string, string> }) {
  const [subTab, setSubTab] = useState<"upcoming" | "recent">("upcoming");
  const [viewAll, setViewAll] = useState(false);

  const activeList = subTab === "upcoming" ? upcomingMatches : recentMatches;
  const shown = viewAll ? activeList : activeList.slice(0, 4);

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex border-b border-[#1e1e30] mb-4">
        <button
          onClick={() => { setSubTab("upcoming"); setViewAll(false); }}
          className={`flex-1 py-3 text-xs font-bold tracking-wide transition-colors relative ${subTab === "upcoming" ? "text-white" : "text-gray-600 hover:text-gray-400"}`}
        >
          UPCOMING
          {subTab === "upcoming" && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-16 bg-[#e91e8c] rounded-full" />}
        </button>
        <button
          onClick={() => { setSubTab("recent"); setViewAll(false); }}
          className={`flex-1 py-3 text-xs font-bold tracking-wide transition-colors relative ${subTab === "recent" ? "text-white" : "text-gray-600 hover:text-gray-400"}`}
        >
          RECENT
          {subTab === "recent" && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-16 bg-[#e91e8c] rounded-full" />}
        </button>
      </div>

      {/* Header & Toggle */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-white font-bold text-sm">
          {subTab === "upcoming" ? "Upcoming" : "Recent"} Matches
        </h3>
        {activeList.length > 4 && (
          <button
            onClick={() => setViewAll((v) => !v)}
            className="text-xs font-semibold text-[#e91e8c] hover:text-pink-400 transition-colors"
          >
            {viewAll ? "Show Less" : "View All"}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-0">
        {shown.map((match, i) => (
          <div
            key={match.matchNo}
            className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-4 ${
              i < shown.length - 1 ? "border-b border-[#2a2a3e]" : ""
            } hover:bg-white/[0.02] transition-colors`}
          >
            {/* Date/time */}
            <div className="flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-0 sm:w-24 flex-shrink-0">
              <div>
                <p className="text-white font-bold text-sm">{match.date}</p>
                <p className="text-gray-500 text-xs">{match.day}</p>
              </div>
              <p className="text-[#e91e8c] text-xs font-semibold">{match.time}</p>
            </div>

            {/* Teams */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-1">
                <TeamLogo abbr={match.teamA} size="md" logos={logos} />
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm">{match.teamA}</p>
                  <p className="text-gray-500 text-[11px] truncate max-w-[100px]">{match.teamAFull}</p>
                </div>
              </div>

              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0"
                style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
              >
                VS
              </div>

              <div className="flex items-center gap-2 flex-1 flex-row-reverse sm:flex-row">
                <TeamLogo abbr={match.teamB} size="md" logos={logos} />
                <div className="min-w-0 text-right sm:text-left">
                  <p className="text-white font-bold text-sm">{match.teamB}</p>
                  <p className="text-gray-500 text-[11px] truncate max-w-[100px]">{match.teamBFull}</p>
                </div>
              </div>
            </div>

            {/* Match details / Results */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1.5 sm:w-44 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-gray-400 text-[11px] font-semibold">
                  T20 • Match {match.matchNo}
                </p>
                <p className="text-gray-600 text-[10px] leading-snug">{match.venue}</p>
              </div>
              
              {/* Conditional Result (Only shows on Recent Tab) */}
              {subTab === "recent" && match.result && (
                <p className="text-[11px] font-bold text-emerald-400 sm:text-right mt-1 w-full sm:w-auto text-center">
                  {match.result}
                </p>
              )}
            </div>
          </div>
        ))}
        
        {shown.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm">
            No {subTab} matches available.
          </div>
        )}
      </div>
    </div>
  );
}

function PlayoffsTab({ data, setTab }: { data: StatsData; setTab: (id: TabId) => void }) {
  const p = data.playoffs;
  const getRank = (abbr: string) => {
    const team = data.pointsTable.find((t) => t.abbr === abbr);
    return team ? team.rank : "-";
  };
  const top4 = data.pointsTable.slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 🛠️ INJECTED CSS TO FORCE-HIDE DESKTOP SCROLLBARS */}
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none !important; }
        .hide-scroll { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}</style>

      {/* ─── LEFT COLUMN (Bracket & Qualification) ─── */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* BRACKET CONTAINER */}
        <div className="bg-[#0b0c1a] border border-[#1e1e30] rounded-[1rem] p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">IPL 2026 Playoffs Bracket</h3>
            <span className="text-xs text-gray-500">All times in IST</span>
          </div>

          {/* 🛠️ APPLIED THE NEW 'hide-scroll' CLASS HERE */}
          <div className="overflow-x-auto hide-scroll relative w-full">
            <div className="relative min-w-[780px] h-[520px]">
              
              {/* SVG Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                  <marker id="arrowGreen" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
                  </marker>
                  <marker id="arrowRed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                  </marker>
                  <marker id="arrowYellow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#eab308" />
                  </marker>
                  <marker id="arrowBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                  </marker>
                </defs>

                {/* Q1 to Final (WINNER - Green) */}
                <path d="M 280 85 L 415 85" fill="none" stroke="#22c55e" strokeWidth="1.5" markerEnd="url(#arrowGreen)" />
                <text x="325" y="75" fill="#22c55e" fontSize="10" fontWeight="bold">WINNER</text>

                {/* Q1 to Q2 (LOSER - Red) */}
                <path d="M 280 120 L 320 120 L 320 230 L 415 230" fill="none" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrowRed)" />
                <text x="330" y="220" fill="#ef4444" fontSize="10" fontWeight="bold">LOSER</text>

                {/* Eliminator to Q2 (WINNER - Yellow) */}
                <path d="M 280 320 L 415 320" fill="none" stroke="#eab308" strokeWidth="1.5" markerEnd="url(#arrowYellow)" />
                <text x="325" y="310" fill="#eab308" fontSize="10" fontWeight="bold">WINNER</text>

                {/* Eliminator to Eliminated (LOSER - Red) - FIXED SPACING */}
                <path d="M 140 375 L 140 405" fill="none" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrowRed)" />
                <text x="150" y="395" fill="#ef4444" fontSize="10" fontWeight="bold">LOSER</text>

                {/* Q2 to Final (WINNER - Blue) */}
                <path d="M 690 280 L 750 280 L 750 115 L 700 115" fill="none" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arrowBlue)" />
              </svg>

              {/* 1. Qualifier 1 Node */}
              <div className="absolute top-[20px] left-[10px] w-[270px] bg-[#111827] border border-[#1e3a8a] rounded-xl overflow-hidden z-10 shadow-lg">
                <div className="bg-[#1e3a8a]/20 py-1.5 text-center border-b border-[#1e3a8a]">
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Qualifier 1</span>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs font-bold w-3">{getRank(p.q1.teamA)}</span>
                      <TeamLogo abbr={p.q1.teamA} size="sm" logos={data.teamLogos} />
                      <span className="text-white text-xs font-bold">{p.q1.teamAFull}</span>
                    </div>
                  </div>
                  <div className="text-center text-[10px] font-bold text-gray-500 my-1">VS</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs font-bold w-3">{getRank(p.q1.teamB)}</span>
                      <TeamLogo abbr={p.q1.teamB} size="sm" logos={data.teamLogos} />
                      <span className="text-white text-xs font-bold">{p.q1.teamBFull}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/[0.02] py-2 px-3 border-t border-[#1e1e30] flex items-center justify-between text-[10px] text-gray-400">
                  <span>{p.q1.date.replace("2026", "").trim()} • {p.q1.time.replace(" IST", "")}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} /> {p.q1.venue.split(",")[0]}</span>
                </div>
              </div>

              {/* 2. Eliminator Node - Adjusted Position */}
              <div className="absolute top-[240px] left-[10px] w-[270px] bg-[#111827] border border-[#4c1d95] rounded-xl overflow-hidden z-10 shadow-lg">
                <div className="bg-[#4c1d95]/20 py-1.5 text-center border-b border-[#4c1d95]">
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Eliminator</span>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs font-bold w-3">{getRank(p.eliminator.teamA)}</span>
                      <TeamLogo abbr={p.eliminator.teamA} size="sm" logos={data.teamLogos} />
                      <span className="text-white text-xs font-bold">{p.eliminator.teamAFull}</span>
                    </div>
                  </div>
                  <div className="text-center text-[10px] font-bold text-gray-500 my-1">VS</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs font-bold w-3">{getRank(p.eliminator.teamB)}</span>
                      <TeamLogo abbr={p.eliminator.teamB} size="sm" logos={data.teamLogos} />
                      <span className="text-white text-xs font-bold">{p.eliminator.teamBFull}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/[0.02] py-2 px-3 border-t border-[#1e1e30] flex items-center justify-between text-[10px] text-gray-400">
                  <span>{p.eliminator.date.replace("2026", "").trim()} • {p.eliminator.time.replace(" IST", "")}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} /> {p.eliminator.venue.split(",")[0]}</span>
                </div>
              </div>

              {/* Eliminated Box - Adjusted Position to prevent overlap */}
              <div className="absolute top-[415px] left-[10px] w-[270px] bg-red-950/30 border border-red-900 rounded-xl py-3 flex flex-col items-center justify-center z-10">
                <div className="flex items-center gap-2 text-red-500 mb-1">
                  <XCircle size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">Eliminated</span>
                </div>
                <span className="text-[10px] text-gray-400">Season ends</span>
              </div>

              {/* 3. Qualifier 2 Node */}
              <div className="absolute top-[220px] left-[425px] w-[265px] bg-[#111827] border border-[#4c1d95] rounded-xl overflow-hidden z-10 shadow-lg">
                <div className="bg-[#4c1d95]/20 py-1.5 text-center border-b border-[#4c1d95]">
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Qualifier 2</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="text-center">
                    <span className="text-white text-xs font-bold block mb-1">Loser of</span>
                    <span className="text-gray-400 text-[10px]">Qualifier 1</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[9px] font-bold text-gray-400">VS</div>
                  <div className="text-center">
                    <span className="text-white text-xs font-bold block mb-1">Winner of</span>
                    <span className="text-gray-400 text-[10px]">Eliminator</span>
                  </div>
                </div>
                <div className="bg-white/[0.02] py-2 px-3 border-t border-[#1e1e30] flex items-center justify-between text-[10px] text-gray-400">
                  <span>{p.q2.date.replace("2026", "").trim()} • {p.q2.time.replace(" IST", "")}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} /> {p.q2.venue.split(",")[0]}</span>
                </div>
              </div>

              {/* 4. Final Node */}
              <div className="absolute top-[35px] left-[425px] w-[265px] bg-[#1a180b] border border-yellow-600/50 rounded-xl overflow-hidden z-10 shadow-[0_0_20px_rgba(202,138,4,0.1)]">
                <div className="bg-yellow-600/20 py-1.5 text-center border-b border-yellow-600/30">
                  <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Final</span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="text-center flex flex-col items-center">
                    <Trophy size={20} className="text-yellow-500 mb-2" />
                    <span className="text-white text-xs font-bold block">Winner of</span>
                    <span className="text-gray-400 text-[10px]">Qualifier 1</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[9px] font-bold text-gray-400">VS</div>
                  <div className="text-center flex flex-col items-center">
                    <Trophy size={20} className="text-yellow-500 mb-2" />
                    <span className="text-white text-xs font-bold block">Winner of</span>
                    <span className="text-gray-400 text-[10px]">Qualifier 2</span>
                  </div>
                </div>
                <div className="bg-white/[0.02] py-2 px-3 border-t border-[#1e1e30] flex items-center justify-between text-[10px] text-gray-400">
                  <span>{p.final.date.replace("2026", "").trim()} • {p.final.time.replace(" IST", "")}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} /> {p.final.venue.split(",")[0]}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Bracket Legend */}
          <div className="mt-4 pt-4 border-t border-[#1e1e30] flex flex-wrap items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2 text-white"><span className="w-4 h-0.5 bg-green-500"></span> Direct to Final</div>
            <div className="flex items-center gap-2 text-white"><span className="w-4 h-0.5 bg-yellow-500"></span> Second Chance</div>
            <div className="flex items-center gap-2 text-white"><span className="w-4 h-0.5 bg-red-500"></span> Knockout</div>
            <div className="flex items-center gap-2 text-white"><span className="w-4 h-0.5 bg-blue-500"></span> To Final</div>
          </div>
        </div>

        {/* BOTTOM LEFT: How it Works & Qualification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* How it works (Takes up 5/12 of the space) */}
          <div className="md:col-span-5 bg-[#0b0c1a] border border-[#1e1e30] rounded-[1rem] p-5 flex flex-col">
            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-6">How it works</h4>
            <div className="space-y-5 flex-1 flex flex-col justify-center">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0"><Star size={12} fill="currentColor" /></div>
                <p className="text-xs text-gray-400 leading-relaxed">Top 2 teams from the points table qualify for Qualifier 1.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0"><X size={12} strokeWidth={3} /></div>
                <p className="text-xs text-gray-400 leading-relaxed">Teams finishing 3rd and 4th play the Eliminator.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0"><RefreshCw size={12} /></div>
                <p className="text-xs text-gray-400 leading-relaxed">The loser of Qualifier 1 gets another chance in Qualifier 2.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0"><Trophy size={12} /></div>
                <p className="text-xs text-gray-400 leading-relaxed">Winner of Qualifier 1 and Winner of Qualifier 2 face off in the Final.</p>
              </div>
            </div>
          </div>

          {/* Team Qualification */}
          <div className="md:col-span-7 bg-[#0b0c1a] border border-[#1e1e30] rounded-[1rem] p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest">Team Qualification</h4>
              
              {/* 2. Add the onClick handler here */}
              <button 
                onClick={() => setTab("table")} 
                className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
              >
                View Points Table &gt;
              </button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-600 border-b border-[#1e1e30]">
                    <th className="pb-2 font-medium w-6">#</th>
                    <th className="pb-2 font-medium">TEAM</th>
                    <th className="pb-2 font-medium text-center w-8">P</th>
                    <th className="pb-2 font-medium text-center w-10">PTS</th>
                    <th className="pb-2 font-medium text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e30]/50">
                  {top4.map((team, idx) => (
                    <tr key={team.abbr}>
                      <td className="py-3 text-gray-400">{team.rank}</td>
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2">
                          <TeamLogo abbr={team.abbr} size="sm" logos={data.teamLogos} />
                          <span className="text-white whitespace-nowrap overflow-hidden text-ellipsis block max-w-[120px] sm:max-w-[180px]">
                            {team.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-center text-gray-400">{team.m}</td>
                      <td className="py-3 text-center text-white font-bold">{team.pts}</td>
                      
                      {/* 3. Fix the Pill Formatting Here */}
                      <td className="py-3 text-right">
                        {idx < 2 ? (
                          <span className="inline-block px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/30">
                            Qualified
                          </span>
                        ) : (
                          <div className="inline-flex flex-col items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 leading-tight">
                            <span>Qualified</span>
                            <span>(Eliminator)</span>
                          </div>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT COLUMN (Schedule & Reminder) ─── */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Playoff Matches */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-4">Playoff Matches</h4>
          <div className="space-y-3">
            {[
              { match: p.q1, title: "Qualifier 1" },
              { match: p.eliminator, title: "Eliminator" },
              { match: p.q2, title: "Qualifier 2" },
              { match: p.final, title: "Final" }
            ].map((item, i) => (
              <div key={i} className="bg-[#0b0c1a] border border-[#1e1e30] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Upcoming</span>
                  <span className="text-white text-xs font-bold">{item.title}</span>
                </div>
                
                <div className="flex items-center justify-between px-2 mb-4">
                  <div className="flex flex-col items-center gap-2 w-16 text-center">
                    {item.match.teamA.includes("Winner") || item.match.teamA.includes("Loser") || item.match.teamA === "TBD" ? (
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-[9px] text-gray-500 font-bold">TBD</span>
                      </div>
                    ) : (
                      <TeamLogo abbr={item.match.teamA} size="lg" logos={data.teamLogos} />
                    )}
                    <span className="text-white text-xs font-bold leading-tight">{item.match.teamA}</span>
                  </div>

                  <div className="w-6 h-6 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0">
                    VS
                  </div>

                  <div className="flex flex-col items-center gap-2 w-16 text-center">
                    {item.match.teamB.includes("Winner") || item.match.teamB.includes("Loser") || item.match.teamB === "TBD" ? (
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-[9px] text-gray-500 font-bold">TBD</span>
                      </div>
                    ) : (
                      <TeamLogo abbr={item.match.teamB} size="lg" logos={data.teamLogos} />
                    )}
                    <span className="text-white text-xs font-bold leading-tight">{item.match.teamB}</span>
                  </div>
                </div>

                <div className="text-center border-t border-[#1e1e30] pt-3">
                  <p className="text-[10px] text-gray-400 mb-1">{item.match.date} • {item.match.day} • {item.match.time}</p>
                  <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
                    <MapPin size={10} />
                    {item.match.venue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Format Reminder Banner */}
        <div className="bg-gradient-to-br from-[#2e1065] to-[#1e1b4b] border border-purple-800/50 rounded-xl p-5 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={16} className="text-purple-300" />
              <h4 className="text-white font-bold text-xs uppercase tracking-widest">Format Reminder</h4>
            </div>
            <p className="text-xs text-purple-200/80 leading-relaxed max-w-[90%]">
              Top 2 teams get two chances to reach the Final. <br />
              3rd and 4th placed teams play the Eliminator.
            </p>
          </div>
          {/* Faint decorative circle background simulating stadium lighting */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>
        </div>

      </div> {/* <--- THIS CLOSES THE ENTIRE 4-COLUMN RIGHT SIDE */}
    </div> 
  );
}
function TabBar({ activeTab, onChange }: { activeTab: TabId; onChange: (id: TabId) => void }) {
  const tabs: { id: TabId; label: string; isNew?: boolean }[] = [
    { id: "table", label: "POINTS TABLE" },
    { id: "stats", label: "STATS" },
    { id: "matches", label: "MATCHES" },
    { id: "playoffs", label: "PLAYOFFS", isNew: true },
  ];

  return (
    <div className="flex border-b border-[#1e1e30] bg-[#0d0e1c] sticky top-0 z-20 overflow-x-auto no-scrollbar">
      {tabs.map(({ id, label, isNew }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`relative flex-1 min-w-[100px] py-4 text-[10px] font-bold tracking-widest transition-colors flex items-center justify-center gap-1 ${
            activeTab === id ? "text-white" : "text-gray-600 hover:text-gray-400"
          }`}
        >
          {label}
          {isNew && (
            <span className="text-[8px] bg-[#e91e8c] text-white px-1 rounded-sm leading-none py-0.5 animate-pulse">New</span>
          )}
          {activeTab === id && (
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full"
              style={{ width: `40px`, background: "#e91e8c", boxShadow: "0 0 8px rgba(233,30,140,0.6)" }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Main Tab Bar ─────────────────────────────────────────────────────────────



// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IPLDashboard() {
  const [tab, setTab] = useState<TabId>("table");
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ipl-stats`
        );
        if (!res.ok) throw new Error("fetch failed");
        setData(await res.json());
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0c16] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#e91e8c] border-t-transparent animate-spin" />
          <p className="text-gray-400 text-sm">Loading IPL 2026 Stats…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0b0c16] flex items-center justify-center">
        <p className="text-rose-400 text-sm">Failed to load stats. Please try again.</p>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#0b0c16]" style={{ fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif" }}>
    {/* This conditional logic expands the page only for the playoffs tab */}
    <div className={`mx-auto px-3 py-4 sm:px-6 sm:py-6 transition-all duration-500 ${
      tab === "playoffs" ? "max-w-7xl" : "max-w-4xl"
    }`}>

        {/* Back button */}
        <Link
          href="/MainModules/HomePage"
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Back</span>
        </Link>

        {/* IPL Logo / Title */}
        <div className="flex items-center gap-3 mb-4">
          <img src="/teams/ipl_logo.png" alt="IPL" className="w-10 h-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div>
            <h1 className="text-white font-black text-xl tracking-tight leading-none">IPL 2026</h1>
            <p className="text-gray-500 text-xs mt-0.5">Indian Premier League</p>
          </div>
        </div>

        {/* Hero */}
        <HeroSection
          todayMatch={data.todayMatch}
          recentMatch={data.recentMatch}
          logos={data.teamLogos}
        />

        {/* Cap Holders */}
        <CapHoldersSection
          orangeCap={data.orangeCap}
          purpleCap={data.purpleCap}
          logos={data.teamLogos}
        />

        {/* Main card with tabs */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#0d0e1c", border: "1px solid #1e1e30" }}>
          <TabBar activeTab={tab} onChange={setTab} />
          <div className="p-4">
            {tab === "table" && <PointsTableTab rows={data.pointsTable} logos={data.teamLogos} />}
            {tab === "stats" && <StatsTab data={data} />}
            {tab === "matches" && <MatchesTab upcomingMatches={data.upcomingMatches} recentMatches={data.recentMatches} logos={data.teamLogos} />}
            
            {/* Update this line: */}
            {tab === "playoffs" && <PlayoffsTab data={data} setTab={setTab} />}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-700 text-[11px] mt-4">
          All times are in IST • Data updates automatically
        </p>
      </div>
    </div>
  );
}
