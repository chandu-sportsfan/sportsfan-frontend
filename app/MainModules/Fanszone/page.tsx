"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { type ActivityItem, useActivity } from "@/context/ActivityContext";
import { useLeaderboard } from "@/context/LeaderboardContext";
import {
  ChevronDown, Trophy, Share2, CheckCircle2,
  Award, TrendingUp, Play, ThumbsUp, FileText,
  Gamepad2, UserPlus, LayoutGrid, Calendar, Filter,
  Download, ChevronLeft, ChevronRight, MoreHorizontal, X, Headphones,
  Megaphone, MessagesSquare, Flame, Sparkles
} from "lucide-react";

// 
// TYPES
// 
type ActivityKey = "audioDrop" | "fanBattle" | "trivia" | "post" | "register" | "invite" | "watchDrop" | "like" | "share" | "other";
type TrendPeriod = "7D" | "30D" | "90D";

interface HistoryItem {
  id: string;
  key: ActivityKey;
  action: string;
  details: string;
  points: number;
  type: string;
  source: string;
  date: string;
  timestamp: number;
  time: string;
  icon: React.ElementType;
  color: string;
  hexColor: string;
  typeColor: string;
}

interface CategoryBreakdown {
  label: string;
  percent: number;
  color: string;
  xp: string;
  xpValue: number;
}

interface LeaderboardContextType {
  currentUserPoints: number;
  currentUserRank: number;
  previousUserRank?: number;
}

const ACTIVITY_META: Record<ActivityKey, {
  action: string; type: string; icon: React.ElementType;
  color: string; hexColor: string; typeColor: string;
}> = {
  audioDrop: {
    action: "Audio Drops", type: "Content", icon: Headphones,
    color: "text-sky-400", hexColor: "#38bdf8",
    typeColor: "text-sky-400 border-sky-400/30 bg-sky-400/5",
  },
  fanBattle: {
    action: "Fan Battles", type: "Fantasy", icon: Gamepad2,
    color: "text-yellow-500", hexColor: "#eab308",
    typeColor: "text-yellow-500 border-yellow-500/30 bg-yellow-500/5",
  },
  trivia: {
    action: "Trivia", type: "Trivia", icon: CheckCircle2,
    color: "text-violet-400", hexColor: "#a78bfa",
    typeColor: "text-violet-400 border-violet-400/30 bg-violet-400/5",
  },
  post: {
    action: "Post Created", type: "Engagement", icon: FileText,
    color: "text-rose-400", hexColor: "#fb7185",
    typeColor: "text-rose-400 border-rose-400/30 bg-rose-400/5",
  },
  register: {
    action: "Registration", type: "Registration", icon: UserPlus,
    color: "text-emerald-500", hexColor: "#10b981",
    typeColor: "text-emerald-500 border-emerald-500/30 bg-emerald-500/5",
  },
  invite: {
    action: "Invite Friend", type: "Referral", icon: UserPlus,
    color: "text-emerald-500", hexColor: "#10b981",
    typeColor: "text-emerald-500 border-emerald-500/30 bg-emerald-500/5",
  },
  watchDrop: {
    action: "Watch Drops", type: "Content", icon: Play,
    color: "text-yellow-500", hexColor: "#eab308",
    typeColor: "text-yellow-500 border-yellow-500/30 bg-yellow-500/5",
  },
  like: {
    action: "Post Like", type: "Engagement", icon: ThumbsUp,
    color: "text-rose-500", hexColor: "#f43f5e",
    typeColor: "text-rose-500 border-rose-500/30 bg-rose-500/5",
  },
  share: {
    action: "Post Share", type: "Engagement", icon: Share2,
    color: "text-purple-500", hexColor: "#a855f7",
    typeColor: "text-purple-500 border-purple-500/30 bg-purple-500/5",
  },
  other: {
    action: "Activity", type: "Activity", icon: Trophy,
    color: "text-gray-300", hexColor: "#d4d4d8",
    typeColor: "text-gray-300 border-gray-400/30 bg-white/5",
  },
};

function makeHistoryItem(
  key: ActivityKey,
  details: string,
  points: number,
  atDate?: Date,
  id = `hi_${Date.now()}`,
  action?: string,
  source?: string
): HistoryItem {
  const d = atDate ?? new Date();
  const meta = ACTIVITY_META[key];
  return {
    id,
    key,
    action: action || meta.action,
    details,
    points,
    type: meta.type,
    source: source || meta.type,
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    timestamp: d.getTime(),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    icon: meta.icon,
    color: meta.color,
    hexColor: meta.hexColor,
    typeColor: meta.typeColor,
  };
}

function normalizeActivityKey(type: string, label: string): ActivityKey {
  const value = `${type} ${label}`.toLowerCase().replace(/[_-]+/g, " ");
  if (value.includes("audio")) return "audioDrop";
  if (value.includes("battle") || value.includes("fantasy")) return "fanBattle";
  if (value.includes("trivia") || value.includes("quiz")) return "trivia";
  if (value.includes("register") || value.includes("signup") || value.includes("sign up")) return "register";
  if (value.includes("invite") || value.includes("referral")) return "invite";
  if (value.includes("watch") || value.includes("video")) return "watchDrop";
  if (value.includes("like")) return "like";
  if (value.includes("share")) return "share";
  if (value.includes("post") || value.includes("create post")) return "post";

  // ── ROAR activity types ──────────────────────────────────────────
  if (value.includes("roar hot take") || value.includes("hot take")) return "fanBattle";
  if (value.includes("roar prediction") || value.includes("prediction")) return "trivia";
  if (value.includes("roar debate") || value.includes("debate")) return "fanBattle";
  if (value.includes("roar memory") || value.includes("memory")) return "post";
  if (value.includes("roar post")) return "post";
  
  return "other";
}

function normalizeTimestamp(createdAt: number): number {
  if (!createdAt) return Date.now();
  return createdAt < 1_000_000_000_000 ? createdAt * 1000 : createdAt;
}

function readableSource(source: string) {
  return source
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function metadataText(metadata: ActivityItem["metadata"]) {
  const keys = [
    "title", "postTitle", "audioTitle", "videoTitle", "battleTitle",
    "matchName", "question", "resourceName", "name", "transactionId",
  ];
  for (const key of keys) {
    const value = metadata?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

function activityToHistoryItem(activity: ActivityItem): HistoryItem {
  const key = normalizeActivityKey(activity.type, activity.label);
  const rawSource = activity.type || key;
  const readable = readableSource(rawSource);
  const details = metadataText(activity.metadata) || activity.label || readable;
  return makeHistoryItem(
    key, details, Number(activity.points) || 0,
    new Date(normalizeTimestamp(activity.createdAt)),
    activity.id, activity.label || ACTIVITY_META[key].action, readable
  );
}

function calculateLevelData(totalXp: number) {
  let level = 1, xpForNextLevel = 1000, xpAccumulated = 0;
  while (totalXp >= xpAccumulated + xpForNextLevel) {
    xpAccumulated += xpForNextLevel;
    level++;
    xpForNextLevel = level * 1000;
  }
  const currentLevelXp = totalXp - xpAccumulated;
  return {
    level, currentLevelXp, xpForNextLevel,
    xpRemaining: xpForNextLevel - currentLevelXp,
    progressPercentage: Math.min(100, Math.round((currentLevelXp / xpForNextLevel) * 100)),
  };
}

function getEarningBreakdown(history: HistoryItem[]): CategoryBreakdown[] {
  if (!history.length) return [];
  const total = history.reduce((s, h) => s + h.points, 0);
  const grouped: Record<string, { label: string; xpValue: number; color: string }> = {};
  history.forEach((h) => {
    if (!grouped[h.key]) grouped[h.key] = { label: h.action, xpValue: 0, color: h.hexColor };
    grouped[h.key].xpValue += h.points;
  });
  return Object.values(grouped).map((g) => ({
    label: g.label, color: g.color, xpValue: g.xpValue,
    percent: total > 0 ? Math.round((g.xpValue / total) * 100) : 0,
    xp: `+${g.xpValue.toLocaleString()} SXP`,
  }));
}

function getDynamicStreakData(history: HistoryItem[]) {
  const today = new Date();
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const weekday = today.getDay();
  const adjustedDay = weekday === 0 ? 6 : weekday - 1;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const historyDates = new Set(
    history.map((h) => {
      const d = new Date(h.timestamp);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    })
  );
  let currentStreak = 0;
  const streakMap = days.map((day, i) => {
    const dayMid = todayMid + (i - adjustedDay) * 86400000;
    const hasActivity = historyDates.has(dayMid);
    const isPast = dayMid < todayMid;
    if (hasActivity) currentStreak++;
    return {
      day, isActive: hasActivity,
      isMissed: !hasActivity && isPast,
      isFuture: dayMid > todayMid,
      isToday: dayMid === todayMid,
    };
  });
  return { streakMap, currentStreak };
}

function getTrendAnalytics(history: HistoryItem[], period: TrendPeriod) {
  const now = Date.now();
  const daysMap: Record<TrendPeriod, number> = { "7D": 7, "30D": 30, "90D": 90 };
  const days = daysMap[period];
  const msPerDay = 86400000;
  const currentStart = now - days * msPerDay;
  const previousStart = currentStart - days * msPerDay;
  const BUCKETS = 10;
  const bucketSize = (days * msPerDay) / BUCKETS;
  const buckets = new Array(BUCKETS).fill(0);
  let currentPts = 0, previousPts = 0;
  history.forEach((item) => {
    const t = item.timestamp;
    if (t >= currentStart && t <= now) {
      currentPts += item.points;
      const idx = Math.min(BUCKETS - 1, Math.floor((t - currentStart) / bucketSize));
      buckets[idx] += item.points;
    } else if (t >= previousStart && t < currentStart) {
      previousPts += item.points;
    }
  });
  let cum = 0;
  const chartData = buckets.map((v) => { cum += v; return cum; });
  const finalChart = currentPts > 0 ? chartData : new Array(BUCKETS).fill(0);
  const percentChange = previousPts > 0
    ? Math.round(((currentPts - previousPts) / previousPts) * 100)
    : currentPts > 0 ? 100 : 0;
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-US", opts);
  const nowDate = new Date(now);
  const labelsMap: Record<TrendPeriod, string[]> = {
    "7D": [
      fmt(new Date(now - 6 * msPerDay), { weekday: "short" }),
      fmt(new Date(now - 4 * msPerDay), { weekday: "short" }),
      fmt(new Date(now - 2 * msPerDay), { weekday: "short" }),
      "Today",
    ],
    "30D": [
      fmt(new Date(now - 30 * msPerDay), { month: "short", day: "numeric" }),
      fmt(new Date(now - 20 * msPerDay), { month: "short", day: "numeric" }),
      fmt(new Date(now - 10 * msPerDay), { month: "short", day: "numeric" }),
      "Today",
    ],
    "90D": [
      fmt(new Date(now - 90 * msPerDay), { month: "short" }),
      fmt(new Date(now - 60 * msPerDay), { month: "short" }),
      fmt(new Date(now - 30 * msPerDay), { month: "short" }),
      fmt(nowDate, { month: "short" }),
    ],
  };
  const vsMap: Record<TrendPeriod, string> = {
    "7D": "vs last week", "30D": "vs last month", "90D": "vs last 90 days",
  };
  return {
    chartData: finalChart, percentChange,
    isPositive: percentChange >= 0,
    labels: labelsMap[period], vsText: vsMap[period], currentPts,
  };
}

// ─────────────────────────────────────────────
// DONUT CHART
// ─────────────────────────────────────────────
function DonutChart({ data, centerPoints }: { data: CategoryBreakdown[]; centerPoints: string }) {
  const RADIUS = 25.91549430918954;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  let offsetPercent = 0;
  const slices = data.map((slice) => {
    const dashLength = (slice.percent / 100) * CIRCUMFERENCE;
    const gapLength = CIRCUMFERENCE - dashLength;
    const rotation = (offsetPercent / 100) * 360 - 90;
    offsetPercent += slice.percent;
    return { ...slice, dashLength, gapLength, rotation };
  });
  const isEmpty = data.length === 0;
  return (
    <div className="relative w-56 h-56 sm:w-44 sm:h-44 xl:w-44 xl:h-44 shrink-0 mx-auto sm:mx-0">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {isEmpty ? (
          <circle cx="50" cy="50" r={RADIUS} fill="transparent" stroke="#27272a" strokeWidth="8" />
        ) : (
          slices.map((slice, i) => (
            <circle
              key={i} cx="50" cy="50" r={RADIUS} fill="transparent"
              stroke={slice.color} strokeWidth="8"
              strokeDasharray={`${slice.dashLength} ${slice.gapLength}`}
              strokeDashoffset={0}
              transform={`rotate(${slice.rotation} 50 50)`}
              className="transition-all duration-1000 ease-out"
            />
          ))
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black text-white">{isEmpty ? "0" : centerPoints}</span>
        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">SXP</span>
        {isEmpty && <span className="text-[10px] text-gray-600 mt-1 font-medium">No activity yet</span>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// BREAKDOWN LEGEND
// Label always fully visible — wraps to multiple lines on mobile, no overlap
// ─────────────────────────────────────────────
function BreakdownLegend({ data }: { data: CategoryBreakdown[] }) {
  if (data.length === 0) {
    return (
      <div className="space-y-3 opacity-40 w-full">
        {["Audio Drops", "Fan Battles", "Trivia", "Post Created"].map((label, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-zinc-700" />
            <span className="text-gray-600 flex-1">{label}</span>
            <span className="text-gray-700">—</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="w-full space-y-3">
      {data.map((item, i) => (
        <div
          key={i}
          className="grid items-start text-sm w-full"
          style={{
            gridTemplateColumns: "10px 1fr auto",
            columnGap: "4px",
          }}
        >
          {/* Color dot — stays top-aligned when label wraps */}
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5"
            style={{ backgroundColor: item.color }}
          />

          {/* Source label — wraps freely, always fully visible, never truncated */}
          <span className="text-gray-300 whitespace-normal break-words">
            {item.label}
          </span>

          {/* Percent + XP — pinned top-right, never overlaps label */}
          <span
            className="whitespace-nowrap flex items-start justify-end"
            style={{ paddingLeft: "12px" }}
          >
            <span className="font-bold text-white">{item.percent}%</span>
            <span className="text-gray-400" style={{ marginLeft: "4px" }}>
              {item.xp}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// MINI TREND LINE
// ─────────────────────────────────────────────
function MiniTrendLine({ data, color = "#f43f5e" }: { data: number[]; color?: string }) {
  if (!data.length) return null;
  const maxVal = Math.max(...data, 1);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;
  const W = 240, H = 80;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - minVal) / range) * H,
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H + 10}`} className="w-full h-20 overflow-visible">
      <path d={d} fill="none" stroke={color} strokeWidth="3" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#fff" />)}
    </svg>
  );
}

function InfoIcon() {
  return (
    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-600 text-[9px] text-gray-500 cursor-help hover:text-gray-300 hover:border-gray-400 transition-colors">
      i
    </span>
  );
}

const earnPointsActions = [
  { icon: Megaphone,       title: "Post On ROAR",       xp: "+2 SXP",  desc: "Per post on ROAR",      color: "text-orange-400", bg: "bg-orange-400/10" },
  { icon: MessagesSquare,  title: "Start a Debate",     xp: "+2 SXP",  desc: "Per debate started",    color: "text-cyan-400",   bg: "bg-cyan-400/10" },
  { icon: Flame,           title: "Posted Hot Take",    xp: "+2 SXP",  desc: "Per hot take posted",   color: "text-amber-500",  bg: "bg-amber-500/10" },
  { icon: TrendingUp,      title: "Prediction Sharing", xp: "+2 SXP",  desc: "Per prediction shared", color: "text-lime-400",   bg: "bg-lime-400/10" },
  { icon: Sparkles,        title: "Memory Shared",      xp: "+2 SXP",  desc: "Per memory shared",     color: "text-pink-400",   bg: "bg-pink-400/10" },
  { icon: Headphones,   title: "Listen Audio Drops",        xp: "+2 SXP",   desc: "Per drop (90%)",     color: "text-sky-400",     bg: "bg-sky-400/10 border-sky-400/20" },
];

const staticTopActivities = [
 { icon: Megaphone,       title: "Post On ROAR",       xp: "+2 SXP",  desc: "Per post on ROAR",      color: "text-orange-400", bg: "bg-orange-400/10" },
  { icon: MessagesSquare,  title: "Start a Debate",     xp: "+2 SXP",  desc: "Per debate started",    color: "text-cyan-400",   bg: "bg-cyan-400/10" },
  { icon: Flame,           title: "Posted Hot Take",    xp: "+2 SXP",  desc: "Per hot take posted",   color: "text-amber-500",  bg: "bg-amber-500/10" },
  { icon: TrendingUp,      title: "Prediction Sharing", xp: "+2 SXP",  desc: "Per prediction shared", color: "text-lime-400",   bg: "bg-lime-400/10" },
  { icon: Sparkles,        title: "Memory Shared",      xp: "+2 SXP",  desc: "Per memory shared",     color: "text-pink-400",   bg: "bg-pink-400/10" },
  { icon: Headphones,   title: "Listen Audio Drops",        xp: "+2 SXP",   desc: "Per drop (90%)",     color: "text-sky-400",     bg: "bg-sky-400/10 border-sky-400/20" },

];

function getCurrentMonthLabel() {
  return new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
function getPreviousMonthLabel() {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const buildFanZoneShareUrl = () => {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/MainModules/Fanszone`;
};

const buildFanZoneShareText = () => {
  const shareUrl = buildFanZoneShareUrl();
  return [
    "Join me on Sportsfan Fanszone",
    "Earn SXP, track your fan activity, and climb the leaderboard.",
    `Join here: ${shareUrl}`,
  ].filter(Boolean).join("\n");
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const input = document.createElement("textarea");
      input.value = text;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.focus();
      input.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(input);
      return ok;
    } catch {
      return false;
    }
  }
};

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
export default function FanZoneDashboard() {
  const [activeTab, setActiveTab] = useState("My Analytics");
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>("30D");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const contextData = useLeaderboard() as LeaderboardContextType | null;
  const currentUserPoints = contextData?.currentUserPoints ?? 0;
  const currentUserRank   = contextData?.currentUserRank   ?? 0;
  const { activities, loading: activitiesLoading } = useActivity();

  const history = useMemo(
    () => activities.map(activityToHistoryItem).sort((a, b) => b.timestamp - a.timestamp),
    [activities]
  );

  const [rankSnapshot, setRankSnapshot] = useState({ prev: 0, current: 0 });
  useEffect(() => {
    if (currentUserRank === 0) return;
    if (rankSnapshot.current !== currentUserRank) {
      setRankSnapshot({ prev: rankSnapshot.current, current: currentUserRank });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserRank]);

  const totalPoints = currentUserPoints > 0
    ? currentUserPoints
    : history.reduce((s, h) => s + h.points, 0);
  const displayPoints = totalPoints.toLocaleString();

  const earningBreakdown = useMemo(() => getEarningBreakdown(history), [history]);
  const trendAnalytics   = useMemo(() => getTrendAnalytics(history, trendPeriod), [history, trendPeriod]);
  const levelData        = useMemo(() => calculateLevelData(totalPoints), [totalPoints]);
  const { streakMap, currentStreak } = useMemo(() => getDynamicStreakData(history), [history]);

  const recentActivityList = useMemo(
    () => history.slice(0, 5).map((h) => ({
      icon: h.icon, action: h.action, detail: h.details,
      xp: h.points, time: h.time, color: h.color, hexColor: h.hexColor,
    })),
    [history]
  );

  const rankDiff  = rankSnapshot.prev > 0 && rankSnapshot.current > 0
    ? Math.abs(rankSnapshot.prev - rankSnapshot.current) : 0;
  const isRankUp  = rankSnapshot.prev > 0 && rankSnapshot.current > 0
    && rankSnapshot.current < rankSnapshot.prev;

  const currentMonthLabel  = getCurrentMonthLabel();
  const previousMonthLabel = getPreviousMonthLabel();

  const openShareDialog = () => { setShowShareDialog(true); setCopied(false); };
  const closeShareDialog = () => { setShowShareDialog(false); setCopied(false); };

  const handleShareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(buildFanZoneShareText())}`, "_blank");
  };
  const handleShareToThreads = () => {
    window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(buildFanZoneShareText())}`, "_blank");
  };
  const handleShareToInstagram = async () => {
    await copyToClipboard(buildFanZoneShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
    window.open("https://www.instagram.com/", "_blank");
  };
  const handleShareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(buildFanZoneShareUrl())}`, "_blank");
  };
  const handleShareToX = () => {
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(buildFanZoneShareText())}`, "_blank");
  };
  const handleCopyLink = async () => {
    const ok = await copyToClipboard(buildFanZoneShareText());
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();

  const thisMonthPoints = useMemo(
    () => history.filter((h) => h.timestamp >= thisMonthStart).reduce((s, h) => s + h.points, 0),
    [history, thisMonthStart]
  );
  const lastMonthPoints = useMemo(
    () => history.filter((h) => h.timestamp >= lastMonthStart && h.timestamp < thisMonthStart).reduce((s, h) => s + h.points, 0),
    [history, lastMonthStart, thisMonthStart]
  );
  const monthDiff = thisMonthPoints - lastMonthPoints;
  const monthPctChange = lastMonthPoints > 0
    ? Math.round((monthDiff / lastMonthPoints) * 100)
    : thisMonthPoints > 0 ? 100 : 0;
  const displayMonthlyPoints = thisMonthPoints.toLocaleString();

  const shareButtons = (size: string) => (
    <>
      {[
        { handler: handleShareToWhatsApp, src: "/images/share_whatsapp.png", alt: "WhatsApp" },
        { handler: handleShareToThreads, src: "/images/share_thread.png", alt: "Threads" },
        { handler: handleShareToInstagram, src: "/images/share_insta.png", alt: "Instagram" },
        { handler: handleShareToLinkedIn, src: "/images/Share_linkedin.png", alt: "LinkedIn" },
        { handler: handleShareToX, src: "/images/Share_X.png", alt: "X" },
        { handler: handleCopyLink, src: "/images/share_copy_link.png", alt: "Copy" },
      ].map(({ handler, src, alt }) => (
        <button
          key={alt}
          onClick={handler}
          className={`${size} shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center`}
          type="button"
        >
          <Image src={src} alt={alt} width={36} height={36} className="w-full h-full object-cover rounded-full" />
        </button>
      ))}
    </>
  );

  // ─── Sub-components ──────────────────────────
  const StreakWidget = () => (
    <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6">
      <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase mb-4 flex items-center gap-1.5">
        Your Streak <InfoIcon />
      </h3>
      <div className="flex items-baseline gap-2 mb-1">
        <h2 className="text-4xl font-black text-white">{currentStreak}</h2>
        <span className="text-xl font-medium text-gray-400">Days</span>
      </div>
      <p className="text-sm text-gray-400 mb-6">Keep it going, don&apos;t break your streak!</p>
      <div className="flex justify-between items-center">
        {streakMap.map((data) => (
          <div key={data.day} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
              data.isActive
                ? "bg-rose-600 border-rose-500 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]"
                : data.isMissed
                  ? "bg-[#0f0a0a] border-red-500/30 text-red-500"
                  : "bg-[#18181b] border-white/10 text-gray-600"
            }`}>
              {data.isActive ? <CheckCircle2 className="w-5 h-5" /> : data.isMissed ? <X className="w-5 h-5 opacity-80" /> : null}
            </div>
            <span className={`text-xs font-bold ${data.isActive || data.isMissed ? "text-white" : "text-gray-500"}`}>
              {data.day}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
//done
  const InviteWidget = () => (
    <div className="bg-[#09090b] border border-rose-500/20 rounded-2xl p-6 flex items-center justify-between overflow-hidden relative group cursor-pointer hover:border-rose-500/50 transition-colors">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-30 group-hover:scale-110 transition-transform duration-500 translate-x-4">
        <UserPlus className="w-32 h-32 text-rose-500" />
      </div>
      <div className="relative z-10">
        <h3 className="text-lg font-black text-white mb-1">Invite Friends</h3>
        <p className="text-sm text-gray-400 mb-4">Share Fan Zone with your friends and bring them into the community!</p>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            openShareDialog();
          }}
          className="bg-gradient-to-r from-rose-600 to-orange-500 text-white text-sm font-bold py-2.5 px-6 rounded-full hover:shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all"
        >
          Invite Now
        </button>
      </div>
    </div>
  );

  const RecentActivityWidget = () => (
    <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 flex flex-col">
      <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase mb-6">Recent Activity</h3>
      <div className="flex-1 space-y-5">
        {recentActivityList.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No activity yet — start earning!</p>
        ) : (
          recentActivityList.map((item, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-8 h-8 rounded-full bg-[#18181b] border border-white/5 flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <p className="text-sm truncate min-w-0">
                  <span className="font-bold text-white mr-1">{item.action}</span>
                  <span className="text-gray-400">{item.detail}</span>
                </p>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="text-sm font-black" style={{ color: item.hexColor }}>+{item.xp} SXP</p>
                <p className="text-[10px] text-gray-500 font-medium">{item.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <button
        onClick={() => setActiveTab("Earning History")}
        className="text-xs font-bold text-rose-500 hover:text-rose-400 text-center w-full mt-6 py-2 border border-rose-500/20 rounded-lg hover:bg-rose-500/5 transition-colors uppercase tracking-widest"
      >
        View All Activity →
      </button>
    </div>
  );

  const HistoryTable = ({ rows }: { rows: HistoryItem[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest w-40">Date</th>
            <th className="py-4 px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Activity</th>
            <th className="py-4 px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Details</th>
            <th className="py-4 px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Points</th>
            <th className="py-4 px-2 pl-8 text-[10px] font-black text-gray-500 uppercase tracking-widest w-40">Source</th>
          </tr>
        </thead>
        <tbody>
          {activitiesLoading ? (
            <tr><td colSpan={5} className="text-center text-gray-500 py-8 text-sm">Loading activity sources...</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={5} className="text-center text-gray-500 py-8 text-sm">No activity recorded yet.</td></tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="py-3 px-2">
                  <p className="text-xs text-gray-300 font-medium">{row.date}</p>
                  <p className="text-[10px] text-gray-500">{row.time}</p>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-colors">
                      <row.icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-xs font-bold text-white">{row.action}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-xs text-gray-400 font-medium">{row.details}</td>
                <td className="py-3 px-2 text-right">
                  <span className="text-xs font-black text-emerald-500">+{row.points}</span>
                </td>
                <td className="py-3 px-2 pl-8">
                  <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold border ${row.typeColor}`}>
                    {row.source}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-rose-500/30 pb-20">
      <main className="max-w-[1400px] mx-auto p-6 space-y-6">

        {/* ── HERO ── */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#09090b] flex items-center min-h-[220px]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1200&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-rose-950/80 to-transparent" />
          <div className="relative z-10 p-8 w-full flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-2 drop-shadow-lg">FAN ZONE</h1>
              <p className="text-lg md:text-xl font-medium text-gray-300 mb-6">Connect. Engage. Belong.</p>
              <div className="flex gap-4">
                <button className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-[0_0_20px_rgba(225,29,72,0.4)]">
                  Connect with Fans
                </button>
                <button className="px-6 py-2.5 rounded-full text-sm font-bold text-white border border-white/20 bg-black/40 hover:bg-white/10 transition-colors backdrop-blur-sm">
                  Watch Live
                </button>
              </div>
            </div>

            {/* Hero Points Card */}
            <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6 w-full md:w-[320px] shadow-2xl relative z-10 hidden md:block">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Points</p>
                <span className="text-xs text-gray-400 font-semibold">{currentMonthLabel}</span>
              </div>
              <h2 className="text-4xl font-black text-white mb-2">{displayPoints} SXP</h2>
              <p className="text-xs font-bold flex items-center gap-1 mb-6"
                style={{ color: monthPctChange >= 0 ? "#10b981" : "#f43f5e" }}>
                <TrendingUp className="w-3 h-3" />
                {monthPctChange >= 0 ? "+" : ""}{monthPctChange}%
                <span className="text-gray-500 font-medium ml-1">vs {previousMonthLabel}</span>
              </p>
              <MiniTrendLine data={trendAnalytics.chartData} />
            </div>
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 bg-[#09090b] border border-white/10 rounded-2xl p-5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl border-2 border-rose-500 flex items-center justify-center font-black text-2xl text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              {levelData.level}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-white mb-1">You&apos;re doing great!</h3>
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs text-gray-400">{levelData.xpRemaining.toLocaleString()} SXP to Level {levelData.level + 1}</p>
                <p className="text-xs font-bold text-gray-400">{levelData.currentLevelXp.toLocaleString()} / {levelData.xpForNextLevel.toLocaleString()} SXP</p>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 to-orange-500 rounded-full relative transition-all duration-1000 ease-in-out"
                  style={{ width: `${levelData.progressPercentage}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#09090b] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Your Rank</p>
              <h3 className="text-2xl font-black text-white leading-tight">
                {rankSnapshot.current > 0 ? `#${rankSnapshot.current}` : "—"}
              </h3>
              {rankDiff > 0 ? (
                <p className={`text-xs font-bold flex items-center gap-1 mt-0.5 ${isRankUp ? "text-emerald-500" : "text-red-500"}`}>
                  {isRankUp ? "↑" : "↓"} {rankDiff} <span className="text-gray-500 font-medium">This Month</span>
                </p>
              ) : (
                <p className="text-xs text-gray-500 font-medium mt-0.5">— No Change</p>
              )}
            </div>
          </div>

          <div className="bg-[#09090b] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Award className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Top 10%</p>
                <h3 className="text-base font-bold text-white">Elite Fan</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Keep Going!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Badges</p>
              <h3 className="text-xl font-black text-white">12</h3>
            </div>
          </div>

          <Link
            href="/MainModules/Leaderboard"
            className="bg-[#09090b] border border-white/10 hover:border-rose-500/50 rounded-2xl p-5 flex flex-col items-center justify-center group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Trophy className="w-7 h-7 text-rose-500 mb-1.5 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 relative z-10" />
            <h3 className="text-sm font-black text-white text-center leading-tight tracking-wide relative z-10">
              Live<br />Leaderboard
            </h3>
          </Link>
        </div>

        {/* ── TABS ── */}
        <div className="border-b border-white/10 flex gap-8 px-2 overflow-x-auto">
          {["My Analytics", "Earning History", "Activity Feed", "All Activities"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold whitespace-nowrap transition-all relative ${
                activeTab === tab ? "text-rose-500" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-500 rounded-t-full shadow-[0_-2px_10px_rgba(244,63,94,0.5)]" />
              )}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════
            TAB: MY ANALYTICS
        ══════════════════════════════════════ */}
        {activeTab === "My Analytics" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* OVERVIEW CARD */}
            <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-8 flex items-center gap-1.5">
                Overview <InfoIcon />
              </h3>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-center">

                {/* Left: month stats */}
                <div className="xl:col-span-3 w-full">
                  <div className="inline-block bg-[#18181b] border border-white/10 text-sm font-bold rounded-xl px-4 py-2 text-white mb-6">
                    {currentMonthLabel}
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">This Month</p>
                      <div className="flex items-end gap-3 flex-wrap">
                        <h4 className="text-3xl font-black text-white leading-none">
                          {thisMonthPoints.toLocaleString()} SXP
                        </h4>
                        <span
                          className="text-xs font-bold mb-0.5"
                          style={{ color: monthPctChange >= 0 ? "#10b981" : "#f43f5e" }}
                        >
                          {monthPctChange >= 0 ? "↑" : "↓"} {Math.abs(monthPctChange)}%{" "}
                          <span className="text-gray-500 font-medium">vs {previousMonthLabel}</span>
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">All Time</p>
                      <div className="flex items-end gap-3 flex-wrap">
                        <h4 className="text-3xl font-black text-white leading-none">{displayPoints} SXP</h4>
                        <span className="text-xs text-gray-500 font-medium mb-0.5">Since Apr 2026</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─────────────────────────────────────────────
                    Middle: donut + legend
                    Stack on mobile, side-by-side on xl
                ───────────────────────────────────────────── */}
                <div className="xl:col-span-5 border-t border-white/10 xl:border-t-0 xl:border-l pt-8 xl:pt-0 xl:pl-4 overflow-hidden">
                  <div className="flex flex-col items-center xl:flex-row xl:items-center xl:justify-start gap-4 xl:gap-1">
                    {/* Donut — centered on mobile, flush-left on xl */}
                    <div className="shrink-0 mx-auto xl:mx-0">
                      <DonutChart data={earningBreakdown} centerPoints={displayMonthlyPoints} />
                    </div>
                    {/* Legend — label wraps freely, never overflows or overlaps */}
                    <div className="w-full xl:flex-1 min-w-0 xl:pl-2">
                      <BreakdownLegend data={earningBreakdown} />
                    </div>
                  </div>
                </div>

                {/* Right: trend */}
                <div className="xl:col-span-4 border-t xl:border-t-0 xl:border-l border-white/10 pt-8 xl:pt-0 xl:pl-8 h-full flex flex-col justify-center w-full">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-[10px] font-black tracking-widest text-gray-500 uppercase flex items-center gap-1.5">
                      Recent Trend <InfoIcon />
                    </h3>
                    <div className="flex gap-1 bg-[#18181b] p-1 rounded-lg border border-white/5">
                      {(["7D", "30D", "90D"] as TrendPeriod[]).map((range) => (
                        <button
                          key={range}
                          onClick={() => setTrendPeriod(range)}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                            trendPeriod === range ? "bg-[#27272a] text-white shadow-sm" : "text-gray-500 hover:text-white"
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                  <h4 className="text-4xl font-black text-emerald-500 mb-2">
                    +{trendAnalytics.currentPts.toLocaleString()} SXP
                  </h4>
                  <p className={`text-xs font-bold mb-6 ${trendAnalytics.isPositive ? "text-emerald-500" : "text-red-500"}`}>
                    {trendAnalytics.isPositive ? "↑" : "↓"} {Math.abs(trendAnalytics.percentChange)}%{" "}
                    <span className="text-gray-500 font-medium ml-1">{trendAnalytics.vsText}</span>
                  </p>
                  <div className="w-full h-24 mt-auto">
                    <MiniTrendLine data={trendAnalytics.chartData} />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-3 px-2">
                    {trendAnalytics.labels.map((label, index) => (
                      <span key={index}>{label}</span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* HOW YOU EARN */}
            <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase mb-6 flex items-center gap-1.5">
                How You Earn Points <InfoIcon />
              </h3>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {earnPointsActions.map((action, i) => (
                    <div key={i} className="bg-[#18181b] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className={`w-10 h-10 rounded-full ${action.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <action.icon className={`w-4 h-4 ${action.color}`} />
                      </div>
                      <h4 className="text-xs font-bold text-gray-300 mb-1">{action.title}</h4>
                      <p className={`text-sm font-black ${action.color} mb-1`}>{action.xp}</p>
                      <p className="text-[10px] text-gray-500">{action.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="w-full lg:w-72 rounded-xl bg-gradient-to-br from-rose-900 to-black border border-rose-500/30 p-6 flex flex-col justify-center relative overflow-hidden group cursor-pointer">
                  <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform duration-500">
                    <Trophy className="w-40 h-40 text-rose-500" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-black text-white mb-2 leading-tight">Maximize Your Points</h3>
                    <p className="text-xs text-gray-300 mb-6 font-medium">Engage more, climb higher!</p>
                    <button
                      onClick={() => setActiveTab("All Activities")}
                      className="bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold py-2.5 px-6 rounded-full w-max shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-colors"
                    >
                      View All Activities →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT + STREAK */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivityWidget />
              <div className="space-y-6">
                <StreakWidget />
                <InviteWidget />
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            TAB: EARNING HISTORY
        ══════════════════════════════════════ */}
        {activeTab === "Earning History" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-black text-white mb-1">Earning History</h3>
                  <p className="text-xs text-gray-400 font-medium">Track how you earn points across all activities.</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Points Earned</p>
                  <h3 className="text-2xl font-black text-emerald-500">{displayPoints} SXP</h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="relative w-48">
                  <LayoutGrid className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                  <select className="w-full bg-[#18181b] border border-white/10 text-xs font-bold rounded-xl pl-10 pr-8 py-3 text-white focus:outline-none focus:border-rose-500 appearance-none cursor-pointer">
                    <option>All Activities</option>
                    <option>Content</option>
                    <option>Engagement</option>
                    <option>Fantasy</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative w-48">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none" />
                  <select className="w-full bg-[#18181b] border border-white/10 text-xs font-bold rounded-xl pl-10 pr-8 py-3 text-white focus:outline-none focus:border-rose-500 appearance-none cursor-pointer">
                    <option>All Time</option>
                    <option>This Month</option>
                    <option>Last 7 Days</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <HistoryTable rows={history} />

              <div className="mt-6 text-center">
                <button className="bg-[#18181b] border border-white/10 text-xs font-bold text-white px-6 py-2.5 rounded-full hover:bg-white/10 transition-colors inline-flex items-center gap-2">
                  Load More <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivityWidget />
              <div className="space-y-6">
                <StreakWidget />
                <InviteWidget />
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            TAB: ACTIVITY FEED
        ══════════════════════════════════════ */}
        {activeTab === "Activity Feed" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div className="lg:col-span-2 bg-[#09090b] border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h3 className="text-lg font-black text-white mb-1">Activity Feed</h3>
                    <p className="text-xs text-gray-400 font-medium">All your recent actions and engagement in one place.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-40 hidden sm:block">
                      <select className="w-full bg-[#18181b] border border-white/10 text-xs font-bold rounded-xl pl-4 pr-8 py-2.5 text-white focus:outline-none focus:border-rose-500 appearance-none cursor-pointer">
                        <option>All Activities</option>
                        <option>Content</option>
                        <option>Engagement</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/5 transition-colors bg-[#18181b]">
                      <Filter className="w-4 h-4" /> Filter
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  {history.slice(0, 10).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border bg-white/5 border-white/10">
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-0.5">{item.source}</p>
                          <p className="text-sm font-bold text-white group-hover:text-rose-100 transition-colors truncate">{item.action}: {item.details}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-sm font-black" style={{ color: item.hexColor }}>+{item.points} SXP</p>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 text-center">
                  <button className="bg-[#18181b] border border-white/10 text-xs font-bold text-white px-6 py-2.5 rounded-full hover:bg-white/10 transition-colors inline-flex items-center gap-2">
                    Load More <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 h-max sticky top-24">
                <h3 className="text-base font-black text-white mb-1">How to Earn Points</h3>
                <p className="text-xs text-gray-400 font-medium mb-6">More actions, more points!</p>
                <div className="flex flex-col gap-4 mb-8 max-h-[500px] overflow-y-auto pr-2">
                  {earnPointsActions.map((action, i) => (
                    <div key={i} className="flex items-center justify-between hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#18181b] flex items-center justify-center border border-white/5">
                          <action.icon className="w-4 h-4 text-gray-400" />
                        </div>
                        <span className="text-xs font-bold text-gray-300">{action.title}</span>
                      </div>
                      <span className={`text-xs font-black ${action.color}`}>{action.xp}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab("All Activities")}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold py-3.5 rounded-xl transition-colors"
                >
                  View All Activities →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivityWidget />
              <div className="space-y-6">
                <StreakWidget />
                <InviteWidget />
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            TAB: ALL ACTIVITIES
        ══════════════════════════════════════ */}
        {activeTab === "All Activities" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              <div className="xl:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white mb-1">All Activities</h3>
                  <p className="text-sm text-gray-400 font-medium">A complete log of everything you&apos;ve done to earn points.</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {[
                      { icon: LayoutGrid, label: "All Activities" },
                      { icon: Filter,     label: "All Categories" },
                      { icon: Filter,     label: "All Types" },
                      { icon: Calendar,   label: currentMonthLabel },
                    ].map(({ icon: Icon, label }, i) => (
                      <div key={i} className="relative w-48">
                        <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                        <select className="w-full bg-[#18181b] border border-white/10 text-xs font-bold rounded-xl pl-9 pr-8 py-2.5 text-white focus:border-rose-500 appearance-none cursor-pointer">
                          <option>{label}</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/5 transition-colors bg-[#18181b]">
                    <Download className="w-4 h-4" /> Export
                  </button>
                </div>

                <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 overflow-x-auto">
                  <HistoryTable rows={history} />
                  <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Showing 1 – {Math.min(history.length, 10)} of {history.length} activities
                    </p>
                    <div className="flex items-center gap-1">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white/5 hover:text-white transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-600 text-white font-bold text-xs">1</button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white/5 hover:text-white transition-colors font-bold text-xs">2</button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white/5 hover:text-white transition-colors font-bold text-xs">3</button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 pointer-events-none">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 border border-white/10 hover:bg-white/5 hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-orange-950 border border-rose-500/30 rounded-2xl p-6 flex items-center justify-between overflow-hidden relative">
                  <div className="flex items-center gap-6 relative z-10">
                    <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                    <div>
                      <h3 className="text-xl font-black text-white mb-1">Keep Going, You&apos;re on Fire!</h3>
                      <p className="text-sm text-gray-300 font-medium">
                        You&apos;ve earned {displayPoints} SXP so far this {currentMonthLabel}.
                      </p>
                    </div>
                  </div>
                  <button className="relative z-10 bg-gradient-to-r from-rose-600 to-orange-500 text-white text-sm font-bold py-3 px-6 rounded-full hover:scale-105 transition-transform">
                    Explore More Ways to Earn →
                  </button>
                </div>
              </div>

              {/* Right sidebar */}
              <div className="space-y-6">
                <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute right-[-20%] top-[-20%] opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Trophy className="w-48 h-48 text-rose-500" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Points Earned</p>
                    <h3 className="text-3xl font-black text-emerald-500 mb-2">{displayPoints} SXP</h3>
                    <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                      {monthPctChange >= 0 ? "↑" : "↓"} {Math.abs(monthPctChange)}%{" "}
                      <span className="text-gray-500 ml-1">vs {previousMonthLabel}</span>
                    </p>
                  </div>
                </div>

                {/* Donut journey — also uses BreakdownLegend */}
                <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-base font-black text-white mb-1">Your Points Journey</h3>
                  <p className="text-xs text-gray-400 font-medium mb-6">See how you&apos;re growing</p>
                  <div className="flex justify-center mb-8">
                    <DonutChart data={earningBreakdown} centerPoints={displayMonthlyPoints} />
                  </div>
                  <BreakdownLegend data={earningBreakdown} />
                </div>

                <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-base font-black text-white mb-1">Top Activities</h3>
                  <p className="text-xs text-gray-400 font-medium mb-6">By points earned</p>
                  <div className="flex flex-col gap-5 mb-6">
                    {staticTopActivities.map((action, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${action.bg}`}>
                          <action.icon className={`w-5 h-5 ${action.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-gray-200 mb-0.5">{action.title}</h4>
                          <p className={`text-xs font-black ${action.color} mb-0.5`}>{action.xp}</p>
                          <p className="text-[10px] text-gray-500 font-medium">{action.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab("Activity Feed")}
                    className="w-full bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 border border-rose-500/20 text-sm font-bold py-3 rounded-xl transition-colors tracking-wide"
                  >
                    View All Activities →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share Dialog */}
        {showShareDialog && (
          <>
            <button type="button" className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={closeShareDialog} />
            <div className="fixed bottom-16 inset-x-4 z-50 mx-auto w-full max-w-[280px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl lg:hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-sm font-semibold">Share</p>
                <button type="button" onClick={closeShareDialog} className="text-gray-400 hover:text-white">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
              </div>
              <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 overflow-x-auto">{shareButtons("w-8 h-8")}</div>
              {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
            </div>
            <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/60" onClick={closeShareDialog}>
              <div className="bg-[#1a1a1e] rounded-2xl border border-white/10 p-4 w-[300px] shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white text-sm font-semibold">Invite Friends</p>
                  <button type="button" onClick={closeShareDialog} className="text-gray-400 hover:text-white">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </button>
                </div>
                <div className="rounded-xl border border-white/10 bg-[#111114] p-3 mb-3">
                  <p className="text-white text-sm font-semibold line-clamp-2">Invite Friends & Earn</p>
                  <p className="text-white/45 text-[11px] mt-2 line-clamp-2 break-all">{buildFanZoneShareUrl()}</p>
                </div>
                <div className="flex flex-row flex-nowrap items-center gap-2 mb-2">{shareButtons("w-9 h-9")}</div>
                {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}
