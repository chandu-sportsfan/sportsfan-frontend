"use client";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Trophy,
  Crown,
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

interface StatsData {
  pointsTable: TeamRow[];
  orangeCap: PlayerRow[];
  purpleCap: PlayerRow[];
  todayMatch: TodayMatch;
  recentMatch: RecentMatch;
  upcomingMatches: MatchCard[];
  highestScores: HighestScoreRow[];
  mostFifties: MostFiftiesRow[];
}

type TabId = "table" | "stats" | "matches";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TeamLogo({ abbr, size = "md" }: { abbr: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = { sm: "w-6 h-6", md: "w-8 h-8", lg: "w-12 h-12", xl: "w-16 h-16" };
  return (
    <div className={`${sizes[size]} flex-shrink-0`}>
      <img
        src={`/teams/${abbr.toUpperCase()}.png`}
        alt={abbr}
        className="w-full h-full object-contain"
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
}: {
  todayMatch: TodayMatch;
  recentMatch: RecentMatch;
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
              src={`/teams/${todayMatch.teamA}.png`}
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
              src={`/teams/${todayMatch.teamB}.png`}
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
            <TeamLogo abbr={recentMatch.teamA} size="sm" />
            <span className="text-white font-bold text-sm">{recentMatch.teamA}</span>
            <span className="text-gray-600 text-xs">vs</span>
            <span className="text-white font-bold text-sm">{recentMatch.teamB}</span>
            <TeamLogo abbr={recentMatch.teamB} size="sm" />
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
          <div className="grid grid-cols-2 divide-x divide-[rgba(255,255,255,0.06)]">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TeamLogo abbr={recentMatch.teamA} size="sm" />
                <span className="text-white font-bold">{recentMatch.teamA}</span>
              </div>
              <p className="text-white text-xl font-black">{recentMatch.scoreA || "—"}</p>
              {recentMatch.oversA && (
                <p className="text-gray-500 text-xs mt-1">({recentMatch.oversA} overs)</p>
              )}
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TeamLogo abbr={recentMatch.teamB} size="sm" />
                <span className="text-white font-bold">{recentMatch.teamB}</span>
              </div>
              <p className="text-white text-xl font-black">{recentMatch.scoreB || "—"}</p>
              {recentMatch.oversB && (
                <p className="text-gray-500 text-xs mt-1">({recentMatch.oversB} overs)</p>
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

function CapHoldersSection({
  orangeCap,
  purpleCap,
}: {
  orangeCap: PlayerRow[];
  purpleCap: PlayerRow[];
}) {
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
                <img src="/teams/orange_cap.png" alt="Orange Cap" className="w-5 h-5 object-contain" />
                <span className="text-orange-400 text-xs font-bold tracking-wide">Orange Cap</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <TeamLogo abbr={top1Orange.team} size="md" />
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
                <TeamLogo abbr={top1Purple.team} size="md" />
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
                          <TeamLogo abbr={p.team} size="sm" />
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
                          <TeamLogo abbr={p.team} size="sm" />
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

function PointsTableTab({ rows }: { rows: TeamRow[] }) {
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
                    <TeamLogo abbr={team.abbr} size="sm" />
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

// ─── Stats Tab ────────────────────────────────────────────────────────────────

function StatsTab({
  highestScores,
  mostFifties,
}: {
  highestScores: HighestScoreRow[];
  mostFifties: MostFiftiesRow[];
}) {
  const [viewAll, setViewAll] = useState(false);
  const shownScores = viewAll ? highestScores : highestScores.slice(0, 4);
  const shownFifties = viewAll ? mostFifties : mostFifties.slice(0, 4);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-base">Stats</h3>
        <button
          onClick={() => setViewAll((v) => !v)}
          className="text-xs font-semibold text-[#e91e8c] hover:text-pink-400 transition-colors"
        >
          {viewAll ? "Show Less" : "View All"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Highest Score */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#0d0e1c", border: "1px solid #1e1e30" }}
        >
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#1e1e30]">
            <Trophy size={16} className="text-blue-400" />
            <span className="text-white font-bold text-sm">Highest Score</span>
          </div>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="text-gray-600 text-[10px] uppercase tracking-wider border-b border-[#13131f]">
                <th className="py-2 px-4 text-left w-6">#</th>
                <th className="py-2 px-4 text-left">Player</th>
                <th className="py-2 px-4 text-center">Team</th>
                <th className="py-2 px-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {shownScores.map((row) => (
                <tr key={row.rank} className="border-b border-[#13131f] hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 px-4 text-yellow-500 font-bold">{row.rank}</td>
                  <td className="py-2.5 px-4 text-white">{row.player}</td>
                  <td className="py-2.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <TeamLogo abbr={row.team} size="sm" />
                      <span className="text-gray-400">{row.team}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-right text-white font-bold">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Most Fifties */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#0d0e1c", border: "1px solid #1e1e30" }}
        >
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#1e1e30]">
            <Crown size={16} className="text-purple-400" />
            <span className="text-white font-bold text-sm">Most Fifties</span>
          </div>
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="text-gray-600 text-[10px] uppercase tracking-wider border-b border-[#13131f]">
                <th className="py-2 px-4 text-left w-6">#</th>
                <th className="py-2 px-4 text-left">Player</th>
                <th className="py-2 px-4 text-center">Team</th>
                <th className="py-2 px-4 text-right">Fifties</th>
              </tr>
            </thead>
            <tbody>
              {shownFifties.map((row) => (
                <tr key={row.rank} className="border-b border-[#13131f] hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 px-4 text-yellow-500 font-bold">{row.rank}</td>
                  <td className="py-2.5 px-4 text-white">{row.player}</td>
                  <td className="py-2.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <TeamLogo abbr={row.team} size="sm" />
                      <span className="text-gray-400">{row.team}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 text-right text-purple-400 font-bold">{row.fifties}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Matches Tab ──────────────────────────────────────────────────────────────

function MatchesTab({ matches }: { matches: MatchCard[] }) {
  const shown = matches.slice(0, 4);

  return (
    <div>
      <h3 className="text-white font-bold text-base mb-3">
        Upcoming {shown.length} Matches
      </h3>
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
              {/* Team A */}
              <div className="flex items-center gap-2 flex-1">
                <TeamLogo abbr={match.teamA} size="md" />
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm">{match.teamA}</p>
                  <p className="text-gray-500 text-[11px] truncate max-w-[100px]">{match.teamAFull}</p>
                </div>
              </div>

              {/* VS badge */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0"
                style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
              >
                VS
              </div>

              {/* Team B */}
              <div className="flex items-center gap-2 flex-1 flex-row-reverse sm:flex-row">
                <TeamLogo abbr={match.teamB} size="md" />
                <div className="min-w-0 text-right sm:text-left">
                  <p className="text-white font-bold text-sm">{match.teamB}</p>
                  <p className="text-gray-500 text-[11px] truncate max-w-[100px]">{match.teamBFull}</p>
                </div>
              </div>
            </div>

            {/* Match details */}
            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1.5 sm:w-44 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-gray-400 text-[11px] font-semibold">
                  T20 • Match {match.matchNo}
                </p>
                <p className="text-gray-600 text-[10px] leading-snug">{match.venue}</p>
              </div>
              <button
                className="text-[11px] font-bold text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-full whitespace-nowrap"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                VIEW DETAILS
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Tab Bar ─────────────────────────────────────────────────────────────

function TabBar({
  activeTab,
  onChange,
}: {
  activeTab: TabId;
  onChange: (id: TabId) => void;
}) {
  const tabs: { id: TabId; label: string }[] = [
    { id: "table", label: "POINTS TABLE" },
    { id: "stats", label: "STATS" },
    { id: "matches", label: "MATCHES" },
  ];

  return (
    <div
      className="flex border-b border-[#1e1e30] bg-[#0d0e1c] sticky top-0 z-20"
    >
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`relative flex-1 py-4 text-xs font-bold tracking-widest transition-colors ${
            activeTab === id ? "text-white" : "text-gray-600 hover:text-gray-400"
          }`}
        >
          {label}
          {activeTab === id && (
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full"
              style={{
                width: `${label.length * 7}px`,
                background: "#e91e8c",
                boxShadow: "0 0 8px rgba(233,30,140,0.6)",
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

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
      <div className="max-w-2xl mx-auto px-3 py-4 sm:px-6 sm:py-6">

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
        />

        {/* Cap Holders */}
        <CapHoldersSection
          orangeCap={data.orangeCap}
          purpleCap={data.purpleCap}
        />

        {/* Main card with tabs */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#0d0e1c", border: "1px solid #1e1e30" }}
        >
          <TabBar activeTab={tab} onChange={setTab} />

          <div className="p-4">
            {tab === "table" && <PointsTableTab rows={data.pointsTable} />}
            {tab === "stats" && (
              <StatsTab
                highestScores={data.highestScores ?? []}
                mostFifties={data.mostFifties ?? []}
              />
            )}
            {tab === "matches" && (
              <MatchesTab matches={data.upcomingMatches ?? []} />
            )}
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
