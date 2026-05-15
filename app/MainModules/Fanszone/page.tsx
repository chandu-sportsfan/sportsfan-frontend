"use client";

import { useState } from "react";
import Link from "next/link";
import { useLeaderboard } from "@/context/LeaderboardContext";
import { 
  ChevronDown, Trophy, Share2, CheckCircle2, 
  Award, TrendingUp, Play, ThumbsUp, FileText, 
  Gamepad2, UserPlus, LayoutGrid, Calendar, Filter,
 Download, ChevronLeft, ChevronRight, MoreHorizontal, X
} from "lucide-react";

// --- MOCK DATA ---

interface HistoryItem {
  action: string;
  details: string;
  points: number;
  type: string;
  date: string;
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
  icon?: React.ElementType;
  type?: string;
  xpValue?: number;
}

// 1. YOUR EXACT ACTIVITY LEDGER
// (Right now this holds your real 15 XP Fan Battle. Later, fetch this array directly from your backend!)
const exactUserHistory: HistoryItem[] =
  {
    action: "Fan Battles",
    details: "Played a Fan Battle",
    points: 15, // The exact points you earned!
    type: "Fantasy",
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    icon: Gamepad2,
    color: "text-yellow-500", // Tailwind text color
    hexColor: "#eab308",      // Donut Chart stroke color
    typeColor: "text-yellow-500 border-white/10 bg-white/5"
  }
  // When the user does something else, you will just add another object here!
];

// 2. PERFECT BREAKDOWN CALCULATOR
// This calculates the Donut Chart and percentages perfectly based ONLY on your exact ledger.
const getExactEarningBreakdown = (history: typeof exactUserHistory): CategoryBreakdown[] => {
  if (history.length === 0) return [];

  const historyTotal = history.reduce((sum, item) => sum + item.points, 0);

  const grouped = history.reduce((acc, curr) => {
    if (!acc[curr.action]) {
      acc[curr.action] = { label: curr.action, xpValue: 0, color: curr.hexColor };
    }
    acc[curr.action].xpValue += curr.points;
    return acc;
  }, {} as Record<string, any>);

  return Object.values(grouped).map(cat => ({
    ...cat,
    percent: Math.round((cat.xpValue / historyTotal) * 100),
    xp: `+${cat.xpValue.toLocaleString()} XP`
  }));
};

// 2. Dynamic Feed synced perfectly to the breakdown
const generateDynamicHistory = (breakdown: ReturnType<typeof getExactEarningBreakdown>) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  return breakdown.map((item, index) => ({
    date: formattedDate,
    time: `${10 - index}:00 AM`, 
    icon: item.icon,
    action: item.label,
    details: item.label === "Polls & Predictions" ? "Predicted PBKS to win" : `Participated in ${item.label}`,
    points: item.xp,
    type: item.type,
    color: `text-[${item.color}]`,
    typeColor: `text-[${item.color}] border-white/10 bg-white/5`
  }));
};

const trendData = [30, 45, 40, 60, 55, 75, 70, 90, 85, 100];
const topActivitiesData = [
  { icon: UserPlus, title: "Register on SportsFan360", xp: "+100 XP", desc: "1 time", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: UserPlus, title: "Invite Friends", xp: "+100 XP", desc: "3 invites", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: Gamepad2, title: "Fantasy - Fan Battle", xp: "+50 XP", desc: "7 battles", color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" },
];

const activityFeedData = [
  { category: "CONTENT", action: "Read: IPL 2026 Dispatch", points: "+25 XP", time: "2m ago", icon: FileText, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { category: "ENGAGEMENT", action: "Voted in Poll", points: "+15 XP", time: "15m ago", icon: CheckCircle2, color: "text-indigo-400", bg: "bg-indigo-500/10" },
];

const earnPointsActions = [
  { icon: Play, title: "Watch / Listen to Drops", xp: "+20 XP", desc: "12 Actions", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { icon: ThumbsUp, title: "Like a Post", xp: "+10 XP", desc: "28 Actions", color: "text-rose-500", bg: "bg-rose-500/10" },
  { icon: Share2, title: "Share a Post", xp: "+15 XP", desc: "18 Actions", color: "text-purple-500", bg: "bg-purple-500/10" },
];

// --- REUSABLE COMPONENTS ---

function DonutChart({ data, totalPoints }: { data: CategoryBreakdown[], totalPoints?: string }) {
  let currentOffset = 0;
  const slices = data.map((slice) => {
    const dasharray = `${slice.percent} 100`;
    const dashoffset = -currentOffset;
    currentOffset += slice.percent;
    return { ...slice, dasharray, dashoffset };
  });

  return (
    <div className="relative w-56 h-56 md:w-64 md:h-64 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {slices.map((slice, i) => (
          <circle
            key={i}
            cx="50" cy="50" r="15.91549430918954"
            fill="transparent"
            stroke={slice.color}
            strokeWidth="6"
            strokeDasharray={slice.dasharray}
            strokeDashoffset={slice.dashoffset}
            className="transition-all duration-1000 ease-out"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl md:text-4xl font-black text-white">{totalPoints || "0"}</span>
        <span className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">XP</span>
      </div>
    </div>
  );
}

function MiniTrendLine({ data }: { data: number[] }) {
  const maxVal = Math.max(...data);
  // Add a little padding to the bottom so the line doesn't hit the absolute edge
  const minVal = Math.min(...data) - 10; 
  const range = maxVal - minVal;

  return (
    // Removed preserveAspectRatio="none" and used a wider viewBox (240x120) 
    // so it naturally matches the aspect ratio of the card without stretching dots.
    <svg viewBox="0 -10 240 120" className="w-full h-24 overflow-visible">
      {/* The Glow Effect */}
      <path 
        d={`M ${data.map((val, idx) => `${(idx / (data.length - 1)) * 240},${100 - ((val - minVal) / range) * 100}`).join(" L ")}`} 
        fill="none" 
        stroke="#f43f5e" 
        strokeWidth="4" 
        className="drop-shadow-[0_4px_12px_rgba(244,63,94,0.8)]"
      />
      {/* The White Dots */}
      {data.map((val, idx) => {
        const x = (idx / (data.length - 1)) * 240;
        const y = 100 - ((val - minVal) / range) * 100;
        return <circle key={idx} cx={x} cy={y} r="4" fill="#fff" />;
      })}
    </svg>
  );
}




const getDynamicStreakData = (historyData: ReturnType<typeof generateDynamicHistory>) => {
  const today = new Date();
  const currentDayOfWeek = today.getDay(); 
  const adjustedDay = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; 
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  let currentStreak = 0;
  
  const streakMap = days.map((dayName, index) => {
    const dateOfThisDay = new Date(today);
    dateOfThisDay.setDate(today.getDate() - adjustedDay + index);
    const formattedDate = dateOfThisDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const hasActivity = historyData.some(item => item.date === formattedDate);
    const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const thisDayAtMidnight = new Date(dateOfThisDay.getFullYear(), dateOfThisDay.getMonth(), dateOfThisDay.getDate()).getTime();
    
    const isPast = thisDayAtMidnight < todayAtMidnight;
    const isToday = thisDayAtMidnight === todayAtMidnight;
    
    if (hasActivity) currentStreak++;

    return {
      day: dayName,
      isActive: hasActivity, // Tick
      isMissed: !hasActivity && isPast, // Cross (only if in the past)
      isFutureOrEmptyToday: (!hasActivity && isToday) || thisDayAtMidnight > todayAtMidnight // Blank
    };
  });

  return { streakMap, currentStreak };
};

const calculateLevelData = (totalXp: number) => {
  let level = 1;
  let xpForNextLevel = 1000;
  let xpAccumulated = 0;

  // Scale up: Level 1 requires 1000, Level 2 requires 2000, etc.
  while (totalXp >= xpAccumulated + xpForNextLevel) {
    xpAccumulated += xpForNextLevel;
    level++;
    xpForNextLevel = level * 1000; 
  }

  const currentLevelXp = totalXp - xpAccumulated;
  const xpRemaining = xpForNextLevel - currentLevelXp;
  // Calculate percentage for the progress bar (capped between 0 and 100)
  const progressPercentage = Math.min(100, Math.max(0, (currentLevelXp / xpForNextLevel) * 100));

  return {
    level,
    currentLevelXp,
    xpForNextLevel,
    xpRemaining,
    progressPercentage,
  };
};

// Add a quick interface to prevent TypeScript 'any' errors
interface LeaderboardContextType {
  currentUserPoints?: number;
  currentUserRank?: number;
  previousUserRank?: number;
}

export default function FanZoneDashboard() {
  const [activeTab, setActiveTab] = useState("My Analytics");
  const [selectedMonth, setSelectedMonth] = useState("May 2026");
  
  const contextData = useLeaderboard() as LeaderboardContextType | null;
  const currentUserPoints = contextData?.currentUserPoints ?? 0;
  const currentUserRank = contextData?.currentUserRank ?? 0;
  const previousUserRank = contextData?.previousUserRank ?? 0;
  
  // 1. Math and Feeds
 // 1. Math and Exact Feeds
  const displayPoints = currentUserPoints.toLocaleString();
  
  // Use the exact ledger for 100% accurate Recent Activity
  const earningHistoryData = exactUserHistory; 
  
  // Calculate perfect percentages based ONLY on the exact ledger
  const dynamicEarningBreakdown = getExactEarningBreakdown(earningHistoryData);
  
  // 2. Dropdown Logic
  const monthDisplayPoints = selectedMonth === "May 2026" ? displayPoints : "0";
  const vsMonthText = selectedMonth === "May 2026" ? "vs Apr 2026" : "vs Mar 2026";

  // 3. Rank & Streak Logic
 const rankDiff = previousUserRank > 0 ? Math.abs(previousUserRank - currentUserRank) : 0;
  const isRankUp = previousUserRank > 0 && currentUserRank < previousUserRank;
  const levelData = calculateLevelData(currentUserPoints);
  const { streakMap, currentStreak } = getDynamicStreakData(earningHistoryData);
  
  // 4. GENERATE RECENT ACTIVITY LIST (Fixed Syntax)
const recentActivityList = earningHistoryData.slice(0, 5).map(item => ({
  icon: item.icon, // This stores the component reference
  action: item.action,
  detail: item.details,
  xp: item.points,
  time: item.time,
  color: item.color
}));

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-rose-500/30 pb-20">
      
      {/* 1. TOP NAVIGATION BAR */}

      <main className="max-w-[1400px] mx-auto p-6 space-y-6">
        
        {/* 2. HERO SECTION */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#09090b] flex items-center min-h-[220px]">
          {/* Background Image & Gradients */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1200&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-rose-950/80 to-transparent" />
          
          <div className="relative z-10 p-8 w-full flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-2 drop-shadow-lg">
                FAN ZONE
              </h1>
              <p className="text-lg md:text-xl font-medium text-gray-300 mb-6">
                Connect. Engage. Belong.
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-[0_0_20px_rgba(225,29,72,0.4)]">
                  Connect with Fans
                </button>
                <button className="px-6 py-2.5 rounded-full text-sm font-bold text-white border border-white/20 bg-black/40 hover:bg-white/10 transition-colors backdrop-blur-sm">
                  Watch Live
                </button>
              </div>
            </div>

            
            {/* Total Points Mini-Card overlaid on right */}
            <div className="bg-[#09090b] border border-white/5 rounded-2xl p-6 w-full md:w-[320px] shadow-2xl relative z-10 hidden md:block">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Points</p>
                <button className="text-xs text-gray-400 flex items-center gap-1 hover:text-white">
                  May 2026 <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              
              {/* DYNAMIC POINTS HERE */}
              <h2 className="text-4xl font-black text-white mb-2">{displayPoints} XP</h2>
              
              {/* DYNAMIC UPDATE */}
              <p className="text-xs text-emerald-500 font-bold flex items-center gap-1 mb-6">
                <TrendingUp className="w-3 h-3" /> +{displayPoints} <span className="text-gray-500 font-medium ml-1">Current Points</span>
              </p>
              
              <div className="h-24">
                 <MiniTrendLine data={[20, 30, 25, 40, 35, 50, 45, 60, 55, 70, 80]} />
              </div>
            </div>
          </div>
        </div>
        {/* 3. STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          {/* 1. Dynamic Leveling Card */}
          <div className="md:col-span-2 bg-[#09090b] border border-white/10 rounded-2xl p-5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl border-2 border-rose-500 flex items-center justify-center font-black text-2xl text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              {levelData.level}
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-white mb-1">You&apos;re doing great!</h3>
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs text-gray-400">{levelData.xpRemaining.toLocaleString()} XP to reach Level {levelData.level + 1}</p>
                <p className="text-xs font-bold text-gray-400">{levelData.currentLevelXp.toLocaleString()} / {levelData.xpForNextLevel.toLocaleString()} XP</p>
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

          {/* 2. Dynamic Rank Tracking Card */}
          <div className="bg-[#09090b] border border-white/10 rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:border-white/20 transition-colors">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                 <Trophy className="w-6 h-6 text-yellow-500" />
               </div>
               <div>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Your Rank</p>
                 <h3 className="text-2xl font-black text-white leading-tight">{currentUserRank > 0 ? currentUserRank : "-"}</h3>
                 {rankDiff > 0 ? (
                   <p className={`text-xs font-bold flex items-center gap-1 mt-0.5 ${isRankUp ? 'text-emerald-500' : 'text-red-500'}`}>
                     {isRankUp ? '↑' : '↓'} {rankDiff} <span className="text-gray-500 font-medium">This Month</span>
                   </p>
                 ) : (
                   <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1">
                     - <span className="text-gray-500 font-medium">No Change</span>
                   </p>
                 )}
               </div>
             </div>
          </div>

          {/* 3. Static Badges Box */}
          <div className="bg-[#09090b] border border-white/10 rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:border-white/20 transition-colors">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                 <Award className="w-6 h-6 text-purple-500" />
               </div>
               <div>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Top 10%</p>
                 <h3 className="text-base font-bold text-white leading-tight">Elite Fan</h3>
                 <p className="text-xs text-gray-500 font-medium mt-0.5">Keep Going!</p>
               </div>
             </div>
             <div className="text-right flex flex-col justify-center h-full">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Badges</p>
                <h3 className="text-xl font-black text-white">12</h3>
                <span className="text-[10px] text-rose-500 font-bold mt-1 block group-hover:text-rose-400">View All →</span>
             </div>
          </div>

          {/* 4. Live Leaderboard Button (Themed) */}
          <Link href="/MainModules/Leaderboard" className="bg-[#09090b] border border-white/10 hover:border-rose-500/50 rounded-2xl p-5 flex flex-col items-center justify-center group hover:scale-[1.02] transition-all cursor-pointer shadow-[0_0_15px_rgba(225,29,72,0.05)] hover:shadow-[0_0_25px_rgba(225,29,72,0.15)] relative overflow-hidden">
             {/* Subtle background glow effect on hover */}
             <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             
             <Trophy className="w-7 h-7 text-rose-500 mb-1.5 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 drop-shadow-md relative z-10" />
             <h3 className="text-sm font-black text-white text-center leading-tight tracking-wide drop-shadow-sm group-hover:text-rose-100 transition-colors relative z-10">Live<br/>Leaderboard</h3>
          </Link>

        </div>

        {/* 4. TABS NAVIGATION */}
        <div className="border-b border-white/10 flex gap-8 px-2 overflow-x-auto custom-scrollbar">
          {/* ---> Update this array below <--- */}
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

        {/* 5. TAB CONTENT - MY ANALYTICS */}
        {activeTab === "My Analytics" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
          {/* Overview Card */}
            <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-8 flex items-center gap-1.5">
                Overview <InfoIcon />
              </h3>
              
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Col 1: Left Stats (Span 3) */}
                <div className="xl:col-span-3 w-full">
                  <div className="relative w-40 mb-8 hidden sm:block">
                    <select 
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full bg-[#18181b] border border-white/10 text-sm font-bold rounded-xl pl-4 pr-8 py-2.5 text-white focus:outline-none focus:border-rose-500 appearance-none cursor-pointer"
                    >
                      <option value="May 2026">May 2026</option>
                      <option value="Apr 2026">Apr 2026</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">This Month</p>
                      <div className="flex items-end gap-3">
                        <h4 className="text-3xl font-black text-white leading-none">{monthDisplayPoints} XP</h4>
                       <span className="text-xs text-emerald-500 font-bold mb-0.5">↑ {monthDisplayPoints} <span className="text-gray-500 font-medium">{vsMonthText}</span></span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">All Time</p>
                      <div className="flex items-end gap-3">
                        <h4 className="text-3xl font-black text-white leading-none">{displayPoints} XP</h4>
                        <span className="text-xs text-gray-500 font-medium mb-0.5">Since Apr 2026</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Col 2: Donut Chart & Legend (Span 5) */}
                <div className="xl:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-6 lg:gap-10 w-full py-6 xl:py-0 border-t border-white/10 xl:border-t-0 xl:border-l xl:pl-8">
                 <DonutChart data={dynamicEarningBreakdown} totalPoints={displayPoints} />
<div className="space-y-4 w-full sm:w-auto">
  {dynamicEarningBreakdown.map((item, i) => (
                      <div key={i} className="flex items-center justify-between sm:justify-start gap-4 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-3 w-40">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-300">{item.label}</span>
                        </div>
                        <div className="flex items-center justify-end gap-4">
                          <span className="font-bold text-white w-10 text-right">{item.percent}%</span>
                          <span className="text-gray-400 w-20 text-right">{item.xp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Col 3: Recent Trend (Span 4) */}
                <div className="xl:col-span-4 border-t xl:border-t-0 xl:border-l border-white/10 pt-8 xl:pt-0 xl:pl-8 h-full flex flex-col justify-center w-full">
                  <div className="flex justify-between items-start mb-6">
                     <h3 className="text-[10px] font-black tracking-widest text-gray-500 uppercase flex items-center gap-1.5">
                       Recent Trend <InfoIcon />
                     </h3>
                     <div className="flex gap-1 bg-[#18181b] p-1 rounded-lg border border-white/5">
                       {["7D", "30D", "90D"].map((range) => (
                         <button key={range} className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${range === "30D" ? "bg-[#27272a] text-white shadow-sm" : "text-gray-500 hover:text-white"}`}>
                           {range}
                         </button>
                       ))}
                     </div>
                  </div>
                  <h4 className="text-4xl font-black text-emerald-500 mb-2">+2,450 XP</h4>
                  <p className="text-xs text-emerald-500 font-bold mb-6">
                    ↑ 24% <span className="text-gray-500 font-medium">vs Apr 2026</span>
                  </p>
                  <div className="w-full h-24 mt-auto">
                     <MiniTrendLine data={trendData} />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-3 px-2">
                    <span>May 1</span>
                    <span>May 11</span>
                    <span>May 21</span>
                    <span>May 31</span>
                  </div>
                </div>
              </div>
            </div>

            {/* How You Earn Points Grid */}
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

                {/* Promo Card */}
                <div className="w-full lg:w-72 rounded-xl bg-gradient-to-br from-rose-900 to-black border border-rose-500/30 p-6 flex flex-col justify-center relative overflow-hidden group cursor-pointer">
                  <div className="absolute -right-6 -bottom-6 opacity-20 group-hover:scale-110 transition-transform duration-500">
                    <Trophy className="w-40 h-40 text-rose-500" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-black text-white mb-2 leading-tight">Maximize Your Points</h3>
                    <p className="text-xs text-gray-300 mb-6 font-medium">Engage more, climb higher!</p>
                    <button className="bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold py-2.5 px-6 rounded-full w-max shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-colors">
                      View All Activities →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Recent Activity & Streak */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Activity List */}
              <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 flex flex-col">
                <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase mb-6">Recent Activity</h3>
                <div className="flex-1 space-y-5">
                  {recentActivityList.map((item, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full bg-[#18181b] border border-white/5 flex items-center justify-center ${item.color}`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <p className="text-sm">
                          <span className="font-bold text-white mr-1">{item.action}</span>
                          <span className="text-gray-400">{item.detail}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${item.color}`}>{item.xp}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="text-xs font-bold text-rose-500 hover:text-rose-400 text-center w-full mt-6 py-2 border border-rose-500/20 rounded-lg hover:bg-rose-500/5 transition-colors uppercase tracking-widest">
                  View All Activity →
                </button>
              </div>

              {/* Streak & Invite */}
              <div className="space-y-6">
                
                {/* Streak Card */}
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
                    {streakMap.map((data) => {
                    return (
                      <div key={data.day} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          data.isActive 
                            ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]' 
                            : data.isMissed 
                              ? 'bg-[#0f0a0a] border-red-500/30 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)]'
                              : 'bg-[#18181b] border-white/10 text-gray-600'
                        }`}>
                          {data.isActive ? <CheckCircle2 className="w-5 h-5" /> : data.isMissed ? <X className="w-5 h-5 opacity-80" /> : null}
                        </div>
                        <span className={`text-xs font-bold ${data.isActive || data.isMissed ? 'text-white' : 'text-gray-500'}`}>{data.day}</span>
                      </div>
                    );
                  })}
                  </div>
                </div>

                {/* Invite Promo */}
                <div className="bg-[#09090b] border border-rose-500/20 rounded-2xl p-6 flex items-center justify-between overflow-hidden relative group cursor-pointer hover:border-rose-500/50 transition-colors">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-30 group-hover:scale-110 transition-transform duration-500 translate-x-4">
                    <UserPlus className="w-32 h-32 text-rose-500" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-black text-white mb-1">Invite Friends & Earn</h3>
                    <p className="text-sm text-gray-400 mb-4">Earn 100 XP for each friend who joins!</p>
                    <button className="bg-gradient-to-r from-rose-600 to-orange-500 text-white text-sm font-bold py-2.5 px-6 rounded-full hover:shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all">
                      Invite Now
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* 6. TAB CONTENT - EARNING HISTORY */}
        {activeTab === "Earning History" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h3 className="text-lg font-black text-white mb-1">Earning History</h3>
                  <p className="text-xs text-gray-400 font-medium">Track how you earn points across all activities.</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Points Earned</p>
                  <h3 className="text-2xl font-black text-emerald-500">{displayPoints} XP</h3>
                </div>
              </div>

              {/* Filters */}
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

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-4 px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest w-40">Date</th>
                      <th className="py-4 px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Activity</th>
                      <th className="py-4 px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Details</th>
                      <th className="py-4 px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Points</th>
                      <th className="py-4 px-2 pl-8 text-[10px] font-black text-gray-500 uppercase tracking-widest w-32">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earningHistoryData.map((row, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
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
                        <td className="py-3 px-2 text-xs text-gray-400 font-medium">
                          {row.details}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className="text-xs font-black text-emerald-500">{row.points}</span>
                        </td>
                        <td className="py-3 px-2 pl-8">
                          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold border ${row.typeColor}`}>
                            {row.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Load More Button */}
              <div className="mt-6 text-center">
                <button className="bg-[#18181b] border border-white/10 text-xs font-bold text-white px-6 py-2.5 rounded-full hover:bg-white/10 transition-colors inline-flex items-center gap-2">
                  Load More <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Row: Recent Activity & Streak (Duplicated for consistency as seen in screenshot) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 flex flex-col">
                <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase mb-6">Recent Activity</h3>
                <div className="flex-1 space-y-5">
                  {recentActivityList.map((item, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full bg-[#18181b] border border-white/5 flex items-center justify-center ${item.color}`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <p className="text-sm">
                          <span className="font-bold text-white mr-1">{item.action}</span>
                          <span className="text-gray-400">{item.detail}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${item.color}`}>{item.xp}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="text-xs font-bold text-rose-500 hover:text-rose-400 text-center w-full mt-6 py-2 border border-rose-500/20 rounded-lg hover:bg-rose-500/5 transition-colors uppercase tracking-widest">
                  View All Activity →
                </button>
              </div>

              <div className="space-y-6">
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
                   {streakMap.map((data) => {
                    return (
                      <div key={data.day} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          data.isActive 
                            ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]' 
                            : data.isMissed 
                              ? 'bg-[#0f0a0a] border-red-500/30 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)]'
                              : 'bg-[#18181b] border-white/10 text-gray-600'
                        }`}>
                          {data.isActive ? <CheckCircle2 className="w-5 h-5" /> : data.isMissed ? <X className="w-5 h-5 opacity-80" /> : null}
                        </div>
                        <span className={`text-xs font-bold ${data.isActive || data.isMissed ? 'text-white' : 'text-gray-500'}`}>{data.day}</span>
                      </div>
                    );
                  })}
                  </div>
                </div>

                <div className="bg-[#09090b] border border-rose-500/20 rounded-2xl p-6 flex items-center justify-between overflow-hidden relative group cursor-pointer hover:border-rose-500/50 transition-colors">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-30 group-hover:scale-110 transition-transform duration-500 translate-x-4">
                    <UserPlus className="w-32 h-32 text-rose-500" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-black text-white mb-1">Invite Friends & Earn</h3>
                    <p className="text-sm text-gray-400 mb-4">Earn 100 XP for each friend who joins!</p>
                    <button className="bg-gradient-to-r from-rose-600 to-orange-500 text-white text-sm font-bold py-2.5 px-6 rounded-full hover:shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all">
                      Invite Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 7. TAB CONTENT - ACTIVITY FEED */}
        {activeTab === "Activity Feed" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Activity Feed List */}
              <div className="lg:col-span-2 bg-[#09090b] border border-white/10 rounded-2xl p-6">
                
                {/* Header & Filters */}
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

                {/* Feed Items */}
                <div className="space-y-1">
                  {activityFeedData.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${item.bg}`}>
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black tracking-widest text-gray-500 uppercase mb-0.5">{item.category}</p>
                          <p className="text-sm font-bold text-white group-hover:text-rose-100 transition-colors">{item.action}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${item.color}`}>{item.points}</p>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                <div className="mt-6 pt-4 border-t border-white/5 text-center">
                  <button className="bg-[#18181b] border border-white/10 text-xs font-bold text-white px-6 py-2.5 rounded-full hover:bg-white/10 transition-colors inline-flex items-center gap-2">
                    Load More <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: How to Earn Points Sidebar */}
              <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 h-max sticky top-24">
                <h3 className="text-base font-black text-white mb-1">How to Earn Points</h3>
                <p className="text-xs text-gray-400 font-medium mb-6">More actions, more points!</p>
                
                <div className="flex flex-col gap-4 mb-8 h-[500px] overflow-y-auto custom-scrollbar pr-2">
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

                <button className="w-full bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold py-3.5 rounded-xl transition-colors shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_25px_rgba(225,29,72,0.5)]">
                  View All Activities →
                </button>
              </div>
            </div>

            {/* Bottom Row: Recent Activity & Streak (Duplicated for consistency) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 flex flex-col">
                <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase mb-6">Recent Activity</h3>
                <div className="flex-1 space-y-5">
                  {recentActivityList.map((item, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full bg-[#18181b] border border-white/5 flex items-center justify-center ${item.color}`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <p className="text-sm">
                          <span className="font-bold text-white mr-1">{item.action}</span>
                          <span className="text-gray-400">{item.detail}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${item.color}`}>{item.xp}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="text-xs font-bold text-rose-500 hover:text-rose-400 text-center w-full mt-6 py-2 border border-rose-500/20 rounded-lg hover:bg-rose-500/5 transition-colors uppercase tracking-widest">
                  View All Activity →
                </button>
              </div>

              <div className="space-y-6">
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
                    {streakMap.map((data) => {
                    return (
                      <div key={data.day} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          data.isActive 
                            ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]' 
                            : data.isMissed 
                              ? 'bg-[#0f0a0a] border-red-500/30 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)]'
                              : 'bg-[#18181b] border-white/10 text-gray-600'
                        }`}>
                          {data.isActive ? <CheckCircle2 className="w-5 h-5" /> : data.isMissed ? <X className="w-5 h-5 opacity-80" /> : null}
                        </div>
                        <span className={`text-xs font-bold ${data.isActive || data.isMissed ? 'text-white' : 'text-gray-500'}`}>{data.day}</span>
                      </div>
                    );
                  })}
                  </div>
                </div>

                <div className="bg-[#09090b] border border-rose-500/20 rounded-2xl p-6 flex items-center justify-between overflow-hidden relative group cursor-pointer hover:border-rose-500/50 transition-colors">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-30 group-hover:scale-110 transition-transform duration-500 translate-x-4">
                    <UserPlus className="w-32 h-32 text-rose-500" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg font-black text-white mb-1">Invite Friends & Earn</h3>
                    <p className="text-sm text-gray-400 mb-4">Earn 100 XP for each friend who joins!</p>
                    <button className="bg-gradient-to-r from-rose-600 to-orange-500 text-white text-sm font-bold py-2.5 px-6 rounded-full hover:shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all">
                      Invite Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 8. TAB CONTENT - ALL ACTIVITIES */}
        {activeTab === "All Activities" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Left Column: Full Table */}
              <div className="xl:col-span-2 space-y-6">
                
                {/* Header & Filters */}
                <div className="flex flex-col gap-4 mb-2">
                  <div>
                    <h3 className="text-xl font-black text-white mb-1">All Activities</h3>
                    <p className="text-sm text-gray-400 font-medium">A complete log of everything you&apos;ve done to earn points.</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative w-40">
                        <LayoutGrid className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                        <select className="w-full bg-[#18181b] border border-white/10 text-xs font-bold rounded-xl pl-9 pr-8 py-2.5 text-white focus:border-rose-500 appearance-none cursor-pointer">
                          <option>All Activities</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <div className="relative w-40">
                        <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                        <select className="w-full bg-[#18181b] border border-white/10 text-xs font-bold rounded-xl pl-9 pr-8 py-2.5 text-white focus:border-rose-500 appearance-none cursor-pointer">
                          <option>All Categories</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <div className="relative w-36">
                        <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                        <select className="w-full bg-[#18181b] border border-white/10 text-xs font-bold rounded-xl pl-9 pr-8 py-2.5 text-white focus:border-rose-500 appearance-none cursor-pointer">
                          <option>All Types</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <div className="relative w-48">
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                        <select className="w-full bg-[#18181b] border border-white/10 text-xs font-bold rounded-xl pl-9 pr-8 py-2.5 text-white focus:border-rose-500 appearance-none cursor-pointer">
                          <option>May 1 - May 31, 2026</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                    
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/5 transition-colors bg-[#18181b]">
                      <Download className="w-4 h-4" /> Export
                    </button>
                  </div>
                </div>

                {/* The Table */}
                <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-4 px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest w-40">Date & Time</th>
                        <th className="py-4 px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Activity</th>
                        <th className="py-4 px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Details</th>
                        <th className="py-4 px-2 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Points</th>
                        <th className="py-4 px-2 pl-8 text-[10px] font-black text-gray-500 uppercase tracking-widest w-32">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* We slice earningHistoryData to show how pagination would look */}
                      {earningHistoryData.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
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
                          <td className="py-3 px-2 text-xs text-gray-400 font-medium">
                            {row.details}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="text-xs font-black text-emerald-500">{row.points}</span>
                          </td>
                          <td className="py-3 px-2 pl-8">
                            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold border ${row.typeColor}`}>
                              {row.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Showing 1 – 10 of 142 activities
                    </p>
                    <div className="flex items-center gap-1">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white/5 hover:text-white transition-colors border border-transparent">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-600 text-white font-bold text-xs shadow-[0_0_10px_rgba(225,29,72,0.5)]">
                        1
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white/5 hover:text-white transition-colors font-bold text-xs">
                        2
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white/5 hover:text-white transition-colors font-bold text-xs">
                        3
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 pointer-events-none">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white/5 hover:text-white transition-colors font-bold text-xs">
                        8
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 border border-white/10 hover:bg-white/5 hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Keep Going Promo */}
                <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-orange-950 border border-rose-500/30 rounded-2xl p-6 flex items-center justify-between overflow-hidden relative">
                   <div className="flex items-center gap-6 relative z-10">
                     <Trophy className="w-16 h-16 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                     <div>
                       <h3 className="text-xl font-black text-white mb-1">Keep Going, You&apos;re on Fire!</h3>
                       <p className="text-sm text-gray-300 font-medium">You&apos;ve earned 24% more points this month.</p>
                     </div>
                   </div>
                   <button className="relative z-10 bg-gradient-to-r from-rose-600 to-orange-500 text-white text-sm font-bold py-3 px-6 rounded-full shadow-[0_0_15px_rgba(225,29,72,0.4)] hover:scale-105 transition-transform">
                     Explore More Ways to Earn →
                   </button>
                </div>
              </div>

              {/* Right Column: Sidebar */}
              <div className="space-y-6">
                
                {/* Total Points Header */}
                <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute right-[-20%] top-[-20%] opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Trophy className="w-48 h-48 text-rose-500" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Points Earned</p>
                    <h3 className="text-3xl font-black text-emerald-500 mb-2">{displayPoints} XP</h3>
<p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
  This Period ↑ 100% <span className="text-gray-500 ml-1">vs Apr 2026</span>
</p>
                  </div>
                </div>

                {/* Points Journey */}
                <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-base font-black text-white mb-1">Your Points Journey</h3>
                  <p className="text-xs text-gray-400 font-medium mb-6">See how you&apos;re growing</p>
                  
                  <div className="flex justify-center mb-8">
                    <DonutChart data={dynamicEarningBreakdown} totalPoints={displayPoints} />
                  </div>

                  <div className="space-y-4">
                    {dynamicEarningBreakdown.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-300">{item.label}</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="font-bold text-white text-right w-10">{item.percent}%</span>
                          <span className="text-gray-400 text-right w-20">({item.xp})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Activities */}
                <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-base font-black text-white mb-1">Top Activities</h3>
                  <p className="text-xs text-gray-400 font-medium mb-6">By points earned</p>
                  
                  <div className="flex flex-col gap-5 mb-6">
                    {topActivitiesData.map((action, i) => (
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

                  <button className="w-full bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 border border-rose-500/20 text-sm font-bold py-3 rounded-xl transition-colors tracking-wide">
                    View All Activities →
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

// Small helper icon component
function InfoIcon() {
  return (
    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-600 text-[9px] text-gray-500 cursor-help hover:text-gray-300 hover:border-gray-400 transition-colors">
      i
    </span>
  );
}

// Simple star icon SVG with proper TypeScript types
// function StarIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
//       <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
//     </svg>
//   );
// }
