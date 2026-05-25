"use client";
import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Trophy,
  Crown,
  RefreshCw,
  MapPin, // New
  XCircle, // New
  Star, // New
  X, // New
  Target, LineChart, Crosshair, Zap, Diamond, Flame
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
// ─── Hardcoded Team Logos (served from /public/teams/) ────────────────────────
const TEAM_LOGOS: Record<string, string> = {
  CSK:  "/teams/CSK.png",
  MI:   "/teams/MI.png",
  RCB:  "/teams/RCB.png",
  KKR:  "/teams/KKR.png",
  SRH:  "/teams/SRH.png",
  RR:   "/teams/RR.png",
  PBKS: "/teams/PBKS.png",
  DC:   "/teams/DC.png",
  GT:   "/teams/GT.png",
  LSG:  "/teams/LSG.png",
};

// ─── Static IPL 2026 Data (as of May 23, 2026 — after Match 68) ───────────────
const STATIC_DATA: StatsData = {

  teamLogos: {},   // unused — handled by TEAM_LOGOS above

  // ── Points Table ──────────────────────────────────────────────────────────
pointsTable: [
  { rank: 1,  abbr: "RCB",  name: "Royal Challengers Bengaluru", qualified: true,  m: 14, w: 9, l: 5,  nr: 0, pts: 18, nrr: "+0.783" },
  { rank: 2,  abbr: "GT",   name: "Gujarat Titans",              qualified: true,  m: 14, w: 9, l: 5,  nr: 0, pts: 18, nrr: "+0.695" },
  { rank: 3,  abbr: "SRH",  name: "Sunrisers Hyderabad",         qualified: true,  m: 14, w: 9, l: 5,  nr: 0, pts: 18, nrr: "+0.524" },
  { rank: 4,  abbr: "RR",   name: "Rajasthan Royals",            qualified: true,  m: 14, w: 8, l: 6,  nr: 0, pts: 16, nrr: "+0.189" },
  { rank: 5,  abbr: "PBKS", name: "Punjab Kings",                qualified: false, m: 14, w: 7, l: 6,  nr: 1, pts: 15, nrr: "+0.309" },
  { rank: 6,  abbr: "DC",   name: "Delhi Capitals",              qualified: false, m: 14, w: 7, l: 7,  nr: 0, pts: 14, nrr: "-0.651" },
  { rank: 7,  abbr: "KKR",  name: "Kolkata Knight Riders",       qualified: false, m: 14, w: 6, l: 7,  nr: 1, pts: 13, nrr: "-0.147" },
  { rank: 8,  abbr: "CSK",  name: "Chennai Super Kings",         qualified: false, m: 14, w: 6, l: 8,  nr: 0, pts: 12, nrr: "-0.345" },
  { rank: 9,  abbr: "MI",   name: "Mumbai Indians",              qualified: false, m: 14, w: 4, l: 10, nr: 0, pts: 8,  nrr: "-0.584" },
  { rank: 10, abbr: "LSG",  name: "Lucknow Super Giants",        qualified: false, m: 14, w: 4, l: 10, nr: 0, pts: 8,  nrr: "-0.740" },
],

  // ── Orange Cap ────────────────────────────────────────────────────────────
 orangeCap: [
  { rank: 1, player: "Sai Sudharsan",       team: "GT", m: 14, runs: 638, avg: "49.08" },
  { rank: 2, player: "Shubman Gill",        team: "GT", m: 13, runs: 616, avg: "47.38" },
  { rank: 3, player: "Heinrich Klaasen",    team: "SRH", m: 14, runs: 606, avg: "50.50" },
  { rank: 4, player: "KL Rahul",            team: "DC", m: 14, runs: 593, avg: "45.62" },
  { rank: 5, player: "Vaibhav Sooryavanshi",team: "RR", m: 14, runs: 583, avg: "41.64" },
],

  // ── Purple Cap ────────────────────────────────────────────────────────────
 purpleCap: [
  { rank: 1, player: "Bhuvneshwar Kumar", team: "RCB", m: 14, wickets: 24, econ: "8.07" },
  { rank: 1, player: "Kagiso Rabada",     team: "GT",  m: 14, wickets: 24, econ: "9.19" },
  { rank: 3, player: "Jofra Archer",      team: "RR",  m: 14, wickets: 21, econ: "8.77" },
  { rank: 3, player: "Anshul Kamboj",     team: "CSK", m: 14, wickets: 21, econ: "10.53" },
  { rank: 5, player: "Rashid Khan",       team: "GT",  m: 14, wickets: 19, econ: "8.72" },
],
  // ── Today's Next Match ────────────────────────────────────────────────────
  todayMatch: {
    teamA: "RCB", teamAFull: "Royal Challengers Bangaluru",
    teamB: "GT",  teamBFull: "Gujarat Titans",
    time: "7:30 PM IST",
    venue: "Himachal Pradesh Cricket Association Stadium, Dharamshala",
    matchNo: 71,
    totalMatches: 74,
  },

  // ── Most Recent Completed Match ───────────────────────────────────────────
  recentMatch: {
    teamA: "DC",
    teamB: "KKR",
    result: "DC Won By 40 Runs",
    scoreA: "203/5",
    oversA: "20.0",
    scoreB: "163/10",
    oversB: "18.4",
  },

  // ── Upcoming Matches (league stage remaining) ─────────────────────────────
  upcomingMatches: [
{
  matchNo: 71, date: "26 May", day: "Tue", time: "7:30 PM IST",
  teamA: "RCB", teamAFull: "Royal Challengers Bengaluru",
  teamB: "GT",  teamBFull: "Gujarat Titans",
  status: "upcoming",
},
{
  matchNo: 72, date: "27 May", day: "Wed", time: "7:30 PM IST",
  teamA: "SRH", teamAFull: "Sunrisers Hyderabad",
  teamB: "RR",  teamBFull: "Rajasthan Royals",
  status: "upcoming",
},
  ],

  // ── Recent Completed Matches ──────────────────────────────────────────────
  recentMatches: [
    {
  matchNo: 70, date: "Yesterday",
  teamA: "DC",  teamAFull: "Delhi Capitals",
  teamB: "KKR", teamBFull: "Kolkata Knight Riders",
  status: "completed",
  result: "Delhi Capitals won by 40 runs (203/5 vs 163 all out)",
},
    {
  matchNo: 69, date: "Yesterday",
  teamA: "RR",  teamAFull: "Rajasthan Royals",
  teamB: "MI",  teamBFull: "Mumbai Indians",
  status: "completed",
  result: "Rajasthan Royals won by 30 runs (205/8 vs 175/9)",
},
 {
      matchNo: 68, date: "23 May", day: "Sat", time: "7:30 PM IST",
      teamA: "LSG",  teamAFull: "Lucknow Super Giants",
      teamB: "PBKS", teamBFull: "Punjab Kings",
      venue: "Ekana Cricket Stadium, Lucknow",
      status: "completed",
      result: "Punjab Kings won by 7 wkts (200/3 vs 196/6)",
    },
    {
      matchNo: 67, date: "22 May", day: "Fri", time: "7:30 PM IST",
      teamA: "RCB",  teamAFull: "Royal Challengers Bengaluru",
      teamB: "SRH",  teamBFull: "Sunrisers Hyderabad",
      venue: "Rajiv Gandhi Intl. Stadium, Hyderabad",
      status: "completed",
      result: "SRH won by 55 runs",
    },
    {
      matchNo: 66, date: "21 May", day: "Thu", time: "7:30 PM IST",
      teamA: "GT",   teamAFull: "Gujarat Titans",
      teamB: "CSK",  teamBFull: "Chennai Super Kings",
      venue: "Narendra Modi Stadium, Ahmedabad",
      status: "completed",
      result: "GT won by 89 runs (229/4 vs 140)",
    },
    {
      matchNo: 65, date: "20 May", day: "Wed", time: "7:30 PM IST",
      teamA: "MI",   teamAFull: "Mumbai Indians",
      teamB: "KKR",  teamBFull: "Kolkata Knight Riders",
      venue: "Wankhede Stadium, Mumbai",
      status: "completed",
      result: "KKR won by 4 wkts",
    },
    {
      matchNo: 64, date: "19 May", day: "Tue", time: "7:30 PM IST",
      teamA: "RR",   teamAFull: "Rajasthan Royals",
      teamB: "LSG",  teamBFull: "Lucknow Super Giants",
      venue: "Sawai Mansingh Stadium, Jaipur",
      status: "completed",
      result: "RR won by 47 runs (225/3 in 19.1 overs)",
    },
    {
      matchNo: 63, date: "18 May", day: "Mon", time: "7:30 PM IST",
      teamA: "SRH",  teamAFull: "Sunrisers Hyderabad",
      teamB: "DC",   teamBFull: "Delhi Capitals",
      venue: "Rajiv Gandhi Intl. Stadium, Hyderabad",
      status: "completed",
      result: "SRH won by 6 wkts",
    },
    {
      matchNo: 62, date: "17 May", day: "Sun", time: "7:30 PM IST",
      teamA: "GT",   teamAFull: "Gujarat Titans",
      teamB: "KKR",  teamBFull: "Kolkata Knight Riders",
      venue: "Narendra Modi Stadium, Ahmedabad",
      status: "completed",
      result: "KKR won by 3 wkts",
    },
    {
      matchNo: 61, date: "17 May", day: "Sun", time: "3:30 PM IST",
      teamA: "PBKS", teamAFull: "Punjab Kings",
      teamB: "RCB",  teamBFull: "Royal Challengers Bengaluru",
      venue: "Punjab Cricket Assoc. Stadium, Mullanpur",
      status: "completed",
      result: "RCB won by 23 runs (222/4 vs 199/8)",
    },
    {
      matchNo: 60, date: "15 May", day: "Fri", time: "7:30 PM IST",
      teamA: "CSK",  teamAFull: "Chennai Super Kings",
      teamB: "RR",   teamBFull: "Rajasthan Royals",
      venue: "MA Chidambaram Stadium, Chennai",
      status: "completed",
      result: "RR won by 5 wkts",
    },
    {
      matchNo: 59, date: "14 May", day: "Thu", time: "7:30 PM IST",
      teamA: "SRH",  teamAFull: "Sunrisers Hyderabad",
      teamB: "GT",   teamBFull: "Gujarat Titans",
      venue: "Rajiv Gandhi Intl. Stadium, Hyderabad",
      status: "completed",
      result: "GT won by 8 wkts",
    },
  ],

  // ── Highest Individual Scores ─────────────────────────────────────────────
highestScores: [
  { rank: 1, player: "KL Rahul",        team: "DC",  score: "152*", sr: "226.86" },
  { rank: 2, player: "Abhishek Sharma", team: "SRH", score: "135*", sr: "198.52" },
  { rank: 3, player: "Ryan Rickelton",  team: "MI",  score: "123*", sr: "223.63" },
  { rank: 4, player: "Sanju Samson",    team: "CSK", score: "115*", sr: "205.35" },
  { rank: 5, player: "Quinton de Kock", team: "MI",  score: "112*", sr: "186.66" },
],

  // ── Playoffs ──────────────────────────────────────────────────────────────
  playoffs: {
    q1: {
      matchNo: 71, date: "26 May", day: "Tue", time: "7:30 PM IST",
      teamA: "RCB",  teamAFull: "Royal Challengers Bengaluru",
      teamB: "GT",   teamBFull: "Gujarat Titans",
      venue: "Himachal Pradesh Cricket Association Stadium, Dharamshala",
      status: "upcoming",
    },
    eliminator: {
      matchNo: 72, date: "27 May", day: "Wed", time: "7:30 PM IST",
      teamA: "SRH",  teamAFull: "Sunrisers Hyderabad",
      teamB: "RR", teamBFull: "Rajasthan Royals",
      venue: "Maharaja Yadavindra Singh PCA Stadium",
      status: "upcoming",
    },
    q2: {
      matchNo: 73, date: "30 May", day: "Sat", time: "7:30 PM IST",
      teamA: "TBD",  teamAFull: "TBD",
      teamB: "TBD",  teamBFull: "TBD",
      venue: "M. Chinnaswamy Stadium, Bengaluru",
      status: "upcoming",
    },
    final: {
      matchNo: 74, date: "1 Jun",  day: "Mon", time: "7:30 PM IST",
      teamA: "TBD",  teamAFull: "TBD",
      teamB: "TBD",  teamBFull: "TBD",
      venue: "M. Chinnaswamy Stadium, Bengaluru",
      status: "upcoming",
    },
  },

  // ── Extra Stats ───────────────────────────────────────────────────────────
  extraStats: {

  battingAvg: [
    { rank: 1, player: "Venkatesh Iyer",     team: "RCB", value: "79.00", subValue: "158" },
    { rank: 2, player: "Quinton de Kock",    team: "MI",  value: "66.00", subValue: "132" },
    { rank: 3, player: "Rinku Singh",        team: "KKR", value: "59.00", subValue: "295" },
    { rank: 4, player: "Anshul Kamboj",      team: "CSK", value: "58.00", subValue: "58" },
    { rank: 5, player: "Shreyas Iyer",       team: "PBKS",value: "55.33", subValue: "498" },
  ],

  bowlingAvg: [
    { rank: 1, player: "Travis Head",        team: "SRH", value: "7.00",  subValue: "1" },
    { rank: 2, player: "Jason Holder",       team: "GT",  value: "16.00", subValue: "13" },
    { rank: 3, player: "Corbin Bosch",       team: "MI",  value: "16.25", subValue: "12" },
    { rank: 4, player: "Ashwani Kumar",      team: "MI",  value: "17.00", subValue: "6" },
    { rank: 5, player: "Jamie Overton",      team: "CSK", value: "17.79", subValue: "14" },
  ],

  bestBowling: [
    { rank: 1, player: "Mohsin Khan",        team: "LSG", value: "5/23", subValue: "" },
    { rank: 2, player: "Josh Hazlewood",     team: "RCB", value: "4/12", subValue: "" },
    { rank: 3, player: "Akeal Hosein",       team: "CSK", value: "4/17", subValue: "" },
    { rank: 4, player: "Jamie Overton",      team: "CSK", value: "4/18", subValue: "" },
    { rank: 5, player: "Bhuvneshwar Kumar",  team: "RCB", value: "4/23", subValue: "" },
  ],

  mostEcon: [
    { rank: 1, player: "Sunil Narine",       team: "KKR", value: "6.65", subValue: "15" },
    { rank: 2, player: "Jason Holder",       team: "GT",  value: "7.34", subValue: "13" },
    { rank: 3, player: "Harpreet Brar",      team: "PBKS",value: "7.50", subValue: "2" },
    { rank: 4, player: "Akeal Hosein",       team: "CSK", value: "8.03", subValue: "8" },
    { rank: 5, player: "Bhuvneshwar Kumar",  team: "RCB", value: "8.07", subValue: "24" },
  ],

  maxSixes: [
    { rank: 1, player: "Vaibhav Sooryavanshi", team: "RR",  value: "53", subValue: "583" },
    { rank: 2, player: "Abhishek Sharma",      team: "SRH", value: "43", subValue: "563" },
    { rank: 3, player: "Ryan Rickelton",       team: "MI",  value: "38", subValue: "448" },
    { rank: 4, player: "Mitchell Marsh",       team: "LSG", value: "36", subValue: "563" },
    { rank: 5, player: "Cooper Connolly",      team: "PBKS",value: "32", subValue: "491" },
    { rank: 5, player: "Priyansh Arya",        team: "PBKS",value: "32", subValue: "364" },
  ],

  maxFours: [
    { rank: 1, player: "Sai Sudharsan",     team: "GT",  value: "62", subValue: "638" },
    { rank: 2, player: "Virat Kohli",       team: "RCB", value: "59", subValue: "557" },
    { rank: 3, player: "Ishan Kishan",      team: "SRH", value: "57", subValue: "569" },
    { rank: 3, player: "Shubman Gill",      team: "GT",  value: "57", subValue: "616" },
    { rank: 5, player: "KL Rahul",          team: "DC",  value: "56", subValue: "593" },
  ],

  boundaries: [
    { rank: 1, player: "Vaibhav Sooryavanshi", team: "RR",  value: "103", subValue: "" },
    { rank: 2, player: "Abhishek Sharma",      team: "SRH", value: "93", subValue: "" },
    { rank: 3, player: "Sai Sudharsan",        team: "GT",  value: "91", subValue: "" },
    { rank: 4, player: "KL Rahul",             team: "DC",  value: "87", subValue: "" },
    { rank: 4, player: "Mitchell Marsh",       team: "LSG", value: "87", subValue: "" },
    { rank: 4, player: "Shubman Gill",         team: "GT",  value: "87", subValue: "" },
  ]

},
};

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
  value: string;
  subValue: string;
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
  playoffs: {
    q1: MatchCard;
    eliminator: MatchCard;
    q2: MatchCard;
    final: MatchCard;
  };
  extraStats: {
    bestBowling: ExtraStatRow[];
    battingAvg: ExtraStatRow[];
    bowlingAvg: ExtraStatRow[];
    mostEcon: ExtraStatRow[];
    maxSixes: ExtraStatRow[];
    maxFours: ExtraStatRow[];
    boundaries: ExtraStatRow[];
  };
}

type TabId = "table" | "stats" | "matches" | "playoffs";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TeamLogo({ abbr, size = "md" }: { abbr: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = { sm: "w-6 h-6", md: "w-8 h-8", lg: "w-12 h-12", xl: "w-16 h-16" };
  const src = TEAM_LOGOS[abbr] ?? (abbr && abbr !== "TBD" ? `/teams/${abbr.toUpperCase()}.png` : null);
  return (
    <div className={`${sizes[size]} flex-shrink-0 flex items-center justify-center bg-white/5 rounded-full overflow-hidden`}>
      {src ? (
        <img
          src={src}
          alt={abbr}
          className="w-full h-full object-contain"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      ) : (
        <span className="text-[9px] font-bold text-gray-500 uppercase">{abbr?.slice(0,3) || ""}</span>
      )}
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
              src={TEAM_LOGOS[todayMatch.teamA] ?? `/teams/${todayMatch.teamA}.png`}
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
              src={TEAM_LOGOS[todayMatch.teamB] ?? `/teams/${todayMatch.teamB}.png`}
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
          {/* Inside HeroSection's expanded scorecard block: */}
          <div className="grid grid-cols-2 divide-x divide-[rgba(255,255,255,0.06)]">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TeamLogo abbr={recentMatch.teamA} size="sm" />
                <span className="text-white font-bold">{recentMatch.teamA}</span>
              </div>
              <p className="text-white text-xl font-black">{recentMatch.scoreA || "-"}</p>
              {recentMatch.oversA ? (
                <p className="text-gray-500 text-xs mt-1">({recentMatch.oversA} overs)</p>
              ) : (
                <p className="text-gray-500 text-xs mt-1 min-h-[16px]"></p>
              )}
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TeamLogo abbr={recentMatch.teamB} size="sm" />
                <span className="text-white font-bold">{recentMatch.teamB}</span>
              </div>
              <p className="text-white text-xl font-black">{recentMatch.scoreB || "-"}</p>
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

function CapHoldersSection({ orangeCap, purpleCap }: { orangeCap: PlayerRow[]; purpleCap: PlayerRow[] }) {
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
                <TeamLogo abbr={top1Orange.team} size="sm" />
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


function StatCard({
  title, subtitle, icon, data, valueLabel, subValueLabel, limit
}: {
  title: string; subtitle?: string; icon: React.ReactNode;
  data: { rank: number; player: string; team: string; mainValue: string | number; subValue?: string | number }[];
  valueLabel: string; subValueLabel?: string; limit?: number;
}) {
  const shownData = limit ? data.slice(0, limit) : data;

  if (!data || data.length === 0) return null;

  return (
    <div className="rounded-xl overflow-hidden flex flex-col h-full" style={{ background: "#0d0e1c", border: "1px solid #1e1e30" }}>
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#1e1e30]">
        {icon}
        <div>
          <span className="text-white font-bold text-sm uppercase tracking-wider">{title}</span>
          {subtitle && <p className="text-[9px] text-gray-500 uppercase tracking-widest">{subtitle}</p>}
        </div>
      </div>
      {/* 🛠️ Removed overflow-x-auto here */}
      <div className="flex-1">
        {/* 🛠️ Removed min-w-[300px] here */}
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="text-gray-600 text-[10px] uppercase tracking-wider border-b border-[#13131f]">
              <th className="py-2 px-3 text-left w-6">#</th>
              <th className="py-2 px-3 text-left">Player</th>
              <th className="py-2 px-3 text-center">Team</th>
              <th className="py-2 px-3 text-right">{valueLabel}</th>
              {subValueLabel && <th className="py-2 px-3 text-right">{subValueLabel}</th>}
            </tr>
          </thead>
          <tbody>
            {shownData.map((row, idx) => (
              <tr key={`${row.rank}-${idx}`} className="border-b border-[#13131f] hover:bg-white/[0.02] transition-colors">
                <td className="py-2.5 px-3">
                  {idx === 0 ? (
                    <div className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold text-[10px]">
                      1
                    </div>
                  ) : (
                    <span className="text-gray-500 font-bold">{row.rank}</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-white font-medium">{row.player}</td>
                <td className="py-2.5 px-3 text-center">
                  <div className="flex items-center justify-center">
                    <TeamLogo abbr={row.team} size="sm" />
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right text-yellow-500 font-bold">{row.mainValue}</td>
                {subValueLabel && <td className="py-2.5 px-3 text-right text-gray-400">{row.subValue}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// ─── Stats Tab ────────────────────────────────────────────────────────────────

function StatsTab({ data }: { data: StatsData }) {
  const [viewAll, setViewAll] = useState(false);
  const limit = viewAll ? undefined : 5;

  // 1. Define a union type of all possible stat rows
  type AnyStatRow = HighestScoreRow | ExtraStatRow;

  // 2. Safely type the array and use Record to access dynamic keys without 'any'
  const mapData = (arr: AnyStatRow[] | undefined, mainKey: string, subKey?: string) => 
    (arr || []).map(item => {
      // Safely treat the item as a dictionary to extract the dynamic values
      const record = item as unknown as Record<string, string | number | undefined>;
      
      return {
        rank: item.rank,
        player: item.player,
        team: item.team,
        mainValue: record[mainKey] || record["value"] || "", 
        subValue: subKey ? (record[subKey] || record["subValue"]) : undefined
      };
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-white font-bold text-base">Tournament Statistics</h3>
        <button
          onClick={() => setViewAll((v) => !v)}
          className="text-xs font-semibold text-[#e91e8c] hover:text-pink-400 transition-colors bg-pink-500/10 px-3 py-1.5 rounded-full"
        >
          {viewAll ? "Show Top 5" : "View Top 10"}
        </button>
      </div>

      {/* 3-Column Grid for Desktop, 2 for Tablet, 1 for Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        
        <StatCard
          title="Highest Individual Scores"
          subtitle="IPL 2026 • Top 10"
          icon={<Target size={16} className="text-purple-400" />}
          data={mapData(data.highestScores, "score")}
          valueLabel="Score"
          limit={limit}
        />

        <StatCard
          title="Best Batting Average"
          subtitle="IPL 2026 • Min 5 Innings"
          icon={<LineChart size={16} className="text-blue-400" />}
          data={mapData(data.extraStats?.battingAvg, "value", "subValue")}
          valueLabel="Average"
          subValueLabel="Runs"
          limit={limit}
        />

        <StatCard
          title="Best Bowling Average"
          subtitle="IPL 2026 • Min 5 Wickets"
          icon={<Crosshair size={16} className="text-pink-400" />}
          data={mapData(data.extraStats?.bowlingAvg, "value", "subValue")}
          valueLabel="Average"
          subValueLabel="Wkts"
          limit={limit}
        />

        <StatCard
          title="Best Bowling Figures"
          subtitle="IPL 2026 • Top 10"
          icon={<Zap size={16} className="text-yellow-400" />}
          data={mapData(data.extraStats?.bestBowling, "value")}
          valueLabel="Figures"
          limit={limit}
        />

        <StatCard
          title="Most Economical Bowlers"
          subtitle="IPL 2026 • Min 5 Wickets"
          icon={<Diamond size={16} className="text-cyan-400" />}
          data={mapData(data.extraStats?.mostEcon, "value", "subValue")}
          valueLabel="Economy"
          subValueLabel="Wkts" // Or matches depending on your subValue data
          limit={limit}
        />

        <StatCard
          title="Maximum Sixes"
          subtitle="IPL 2026 • Top 10"
          icon={<Star size={16} className="text-rose-400" />}
          data={mapData(data.extraStats?.maxSixes, "value")}
          valueLabel="Sixes"
          limit={limit}
        />

        <StatCard
          title="Maximum Fours"
          subtitle="IPL 2026 • Top 10"
          icon={<Flame size={16} className="text-orange-500" />}
          data={mapData(data.extraStats?.maxFours, "value")}
          valueLabel="Fours"
          limit={limit}
        />

        <StatCard
          title="Total Boundaries"
          subtitle="IPL 2026 • Fours + Sixes"
          icon={<Trophy size={16} className="text-emerald-400" />}
          data={mapData(data.extraStats?.boundaries, "value")}
          valueLabel="Boundaries"
          limit={limit}
        />

      </div>
    </div>
  );
}

// ─── Matches Tab ──────────────────────────────────────────────────────────────

function MatchesTab({ upcomingMatches, recentMatches }: { upcomingMatches: MatchCard[], recentMatches: MatchCard[] }) {
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
                <TeamLogo abbr={match.teamA} size="md" />
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
                <TeamLogo abbr={match.teamB} size="md"/>
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
                      <TeamLogo abbr={p.q1.teamA} size="sm"  />
                      <span className="text-white text-xs font-bold">{p.q1.teamAFull}</span>
                    </div>
                  </div>
                  <div className="text-center text-[10px] font-bold text-gray-500 my-1">VS</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs font-bold w-3">{getRank(p.q1.teamB)}</span>
                      <TeamLogo abbr={p.q1.teamB} size="sm" />
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
                      <TeamLogo abbr={p.eliminator.teamA} size="sm" />
                      <span className="text-white text-xs font-bold">{p.eliminator.teamAFull}</span>
                    </div>
                  </div>
                  <div className="text-center text-[10px] font-bold text-gray-500 my-1">VS</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs font-bold w-3">{getRank(p.eliminator.teamB)}</span>
                      <TeamLogo abbr={p.eliminator.teamB} size="sm" />
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
                          <TeamLogo abbr={team.abbr} size="sm" />
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
                      <TeamLogo abbr={item.match.teamA} size="lg" />
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
                      <TeamLogo abbr={item.match.teamB} size="lg" />
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IPLDashboard() {
  const [tab, setTab] = useState<TabId>("table");
  const data = STATIC_DATA;

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
        />

        {/* Cap Holders */}
        <CapHoldersSection
          orangeCap={data.orangeCap}
          purpleCap={data.purpleCap}
        />

        {/* Main card with tabs */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#0d0e1c", border: "1px solid #1e1e30" }}>
          <TabBar activeTab={tab} onChange={setTab} />
          <div className="p-4">
            {tab === "table" && <PointsTableTab rows={data.pointsTable} />}
            {tab === "stats" && <StatsTab data={data} />}
            {tab === "matches" && <MatchesTab upcomingMatches={data.upcomingMatches} recentMatches={data.recentMatches} />}
            
            {/* Update this line: */}
            {tab === "playoffs" && <PlayoffsTab data={data} setTab={setTab} />}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-700 text-[11px] mt-4">
          All times are in IST • Data as of 23 May 2026 (Match 68)
        </p>
      </div>
    </div>
  );
}
