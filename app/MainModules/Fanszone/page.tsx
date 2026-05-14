"use client";

import { useState } from "react";
import Link from "next/link";
import { useLeaderboard } from "@/context/LeaderboardContext";
import { 
  Search, Sparkles, SlidersHorizontal, LogOut, ChevronDown,
  Trophy, Share2, CheckCircle2, 
  Award, TrendingUp, Play, ThumbsUp, Radio, FileText, 
  Gamepad2, UserPlus, Bell, LayoutGrid, Calendar, Filter,
  Download, ChevronLeft, ChevronRight, MoreHorizontal
} from "lucide-react";

// --- MOCK DATA ---
const earningBreakdown = [
  { label: "Watch / Listen", percent: 35, xp: "4,350 XP", color: "#f43f5e" }, // rose-500
  { label: "Social Engagement", percent: 20, xp: "2,500 XP", color: "#3b82f6" }, // blue-500
  { label: "Activities", percent: 25, xp: "3,100 XP", color: "#eab308" }, // yellow-500
  { label: "Fantasy & Predictions", percent: 15, xp: "1,900 XP", color: "#f97316" }, // orange-500
  { label: "Community", percent: 5, xp: "600 XP", color: "#a855f7" }, // purple-500
];

const pointsJourneyData = [
  { label: "Content", percent: 40, xp: "33,860 XP", color: "#f43f5e" }, // rose
  { label: "Engagement", percent: 25, xp: "21,150 XP", color: "#3b82f6" }, // blue
  { label: "Fantasy", percent: 20, xp: "16,930 XP", color: "#eab308" }, // yellow
  { label: "Community", percent: 10, xp: "8,460 XP", color: "#a855f7" }, // purple
  { label: "Bonus", percent: 5, xp: "4,250 XP", color: "#ec4899" }, // pink
];

const topActivitiesData = [
  { icon: UserPlus, title: "Register on SportsFan360", xp: "+100 XP", desc: "1 time", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: UserPlus, title: "Invite Friends", xp: "+100 XP", desc: "3 invites", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: Gamepad2, title: "Fantasy - Fan Battle", xp: "+50 XP", desc: "7 battles", color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { icon: Play, title: "Play Fantasy Games", xp: "+50 XP", desc: "5 games", color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" },
  { icon: FileText, title: "Read News Article", xp: "+25 XP", desc: "14 articles", color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" },
];

// We will reuse `earningHistoryData` for the main table to save space, 
// as it has the exact structure needed for the All Activities table!

const activityFeedData = [
  { category: "CONTENT", action: "Read: IPL 2026 Dispatch, May 10", points: "+25 XP", time: "2m ago", icon: FileText, color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { category: "ENGAGEMENT", action: "Voted in Poll: Best Knock of the Day", points: "+15 XP", time: "15m ago", icon: CheckCircle2, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  { category: "CONTENT", action: "Watched Video Drop: CSK vs LSG Highlights", points: "+20 XP", time: "20m ago", icon: Play, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { category: "ENGAGEMENT", action: "Liked a Post", points: "+10 XP", time: "35m ago", icon: ThumbsUp, color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" },
  { category: "ENGAGEMENT", action: "Shared a Post", points: "+15 XP", time: "45m ago", icon: Share2, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" },
  { category: "COMMUNITY", action: "Sent 2 Signals to friends", points: "+10 XP", time: "1h ago", icon: Radio, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { category: "FANTASY", action: "Joined IPL Fan Battle", points: "+50 XP", time: "1h ago", icon: Gamepad2, color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { category: "CONTENT", action: "Read News Article: PBKS vs DC Preview", points: "+25 XP", time: "2h ago", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { category: "FANTASY", action: "Invited 2 friends to Fan Battle", points: "+20 XP", time: "3h ago", icon: Gamepad2, color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" },
  { category: "PREDICTIONS", action: "Predicted PBKS to win", points: "+25 XP", time: "3h ago", icon: Trophy, color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20" },
];

const earningHistoryData = [
  { date: "May 11, 2026", time: "10:24 PM", icon: FileText, action: "Read News Article", details: "Read: IPL 2026 Dispatch, May 10", points: "+25 XP", type: "Content", typeColor: "text-yellow-500 border-yellow-500/20 bg-yellow-500/10" },
  { date: "May 11, 2026", time: "09:45 PM", icon: CheckCircle2, action: "Voted in Poll", details: "Poll: Best Knock of the Day", points: "+15 XP", type: "Engagement", typeColor: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10" },
  { date: "May 11, 2026", time: "09:30 PM", icon: Play, action: "Watched Video Drop", details: "CSK vs LSG Highlights", points: "+20 XP", type: "Content", typeColor: "text-emerald-500 border-emerald-500/20 bg-emerald-500/10" },
  { date: "May 11, 2026", time: "08:15 PM", icon: Share2, action: "Shared a Post", details: "Shared match highlights", points: "+15 XP", type: "Engagement", typeColor: "text-purple-500 border-purple-500/20 bg-purple-500/10" },
  { date: "May 11, 2026", time: "07:40 PM", icon: ThumbsUp, action: "Liked a Post", details: "Liked a fan post", points: "+10 XP", type: "Engagement", typeColor: "text-rose-500 border-rose-500/20 bg-rose-500/10" },
  { date: "May 11, 2026", time: "07:20 PM", icon: Radio, action: "Send Signals", details: "Sent 2 signals to friends", points: "+10 XP", type: "Community", typeColor: "text-blue-400 border-blue-500/20 bg-blue-500/10" },
  { date: "May 11, 2026", time: "06:55 PM", icon: Gamepad2, action: "Fantasy - Fan Battle", details: "Joined IPL Fan Battle", points: "+50 XP", type: "Fantasy", typeColor: "text-yellow-500 border-yellow-500/20 bg-yellow-500/10" },
  { date: "May 11, 2026", time: "06:40 PM", icon: Gamepad2, action: "Invite to Fan Battle", details: "Invited 2 friends", points: "+20 XP", type: "Fantasy", typeColor: "text-rose-500 border-rose-500/20 bg-rose-500/10" },
  { date: "May 11, 2026", time: "05:30 PM", icon: Award, action: "Made Prediction", details: "Predicted PBKS to win", points: "+25 XP", type: "Engagement", typeColor: "text-purple-500 border-purple-500/20 bg-purple-500/10" },
  { date: "May 11, 2026", time: "04:15 PM", icon: CheckCircle2, action: "Participated in Poll", details: "Poll: Player of the Match", points: "+15 XP", type: "Engagement", typeColor: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10" },
  { date: "May 11, 2026", time: "03:05 PM", icon: Bell, action: "Requested Drops", details: "Requested CSK Highlights", points: "+15 XP", type: "Content", typeColor: "text-pink-500 border-pink-500/20 bg-pink-500/10" },
  { date: "May 11, 2026", time: "02:20 PM", icon: UserPlus, action: "Registered on SportsFan360", details: "Welcome to SportsFan360!", points: "+100 XP", type: "Account", typeColor: "text-blue-500 border-blue-500/20 bg-blue-500/10" },
  { date: "May 10, 2026", time: "11:10 PM", icon: UserPlus, action: "Invite Friends", details: "Invited 3 friends", points: "+100 XP", type: "Referral", typeColor: "text-emerald-500 border-emerald-500/20 bg-emerald-500/10" },
];

const earnPointsActions = [
  { icon: Play, title: "Watch / Listen to Drops", xp: "+20 XP", desc: "12 Actions", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { icon: ThumbsUp, title: "Like a Post", xp: "+10 XP", desc: "28 Actions", color: "text-rose-500", bg: "bg-rose-500/10" },
  { icon: Share2, title: "Share a Post", xp: "+15 XP", desc: "18 Actions", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: Radio, title: "Send Signals", xp: "+10 XP", desc: "9 Actions", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Bell, title: "Request Drops", xp: "+15 XP", desc: "6 Actions", color: "text-pink-500", bg: "bg-pink-500/10" },
  { icon: FileText, title: "Read News Article", xp: "+25 XP", desc: "14 Articles", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { icon: CheckCircle2, title: "Take Part in Polls", xp: "+15 XP", desc: "8 Polls", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { icon: Gamepad2, title: "Fantasy - Fan Battles", xp: "+50 XP", desc: "7 Battles", color: "text-orange-500", bg: "bg-orange-500/10" },
  { icon: Award, title: "Make Predictions", xp: "+25 XP", desc: "10 Predictions", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { icon: Play, title: "Play Fantasy Games", xp: "+50 XP", desc: "5 Games", color: "text-rose-500", bg: "bg-rose-500/10" },
  { icon: UserPlus, title: "Register on SportsFan360", xp: "+100 XP", desc: "1 Time", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: UserPlus, title: "Invite Friends", xp: "+100 XP", desc: "3 Invites", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: Gamepad2, title: "Invite to Fan Battles", xp: "+20 XP", desc: "4 Invites", color: "text-rose-500", bg: "bg-rose-500/10" },
];

const recentActivityList = [
  { icon: FileText, action: "Read:", detail: "IPL 2026 Dispatch, May 10", xp: "+25 XP", time: "2m ago", color: "text-rose-500" },
  { icon: Play, action: "Watched:", detail: "CSK vs LSG Highlights", xp: "+20 XP", time: "15m ago", color: "text-emerald-500" },
  { icon: Share2, action: "Shared a Post", detail: "", xp: "+15 XP", time: "32m ago", color: "text-purple-500" },
  { icon: CheckCircle2, action: "Voted in Poll:", detail: "Best Knock of the Day", xp: "+15 XP", time: "1h ago", color: "text-blue-500" },
  { icon: Trophy, action: "Predicted PBKS to win", detail: "", xp: "+25 XP", time: "2h ago", color: "text-rose-500" },
];

const trendData = [30, 45, 40, 60, 55, 75, 70, 90, 85, 100];

// --- REUSABLE COMPONENTS ---

function DonutChart({ data, totalPoints }: { data: typeof earningBreakdown, totalPoints?: string }) {
  let cumulativePercent = 0;
  
  return (
    <div className="relative w-40 h-40 md:w-48 md:h-48 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {/* ... circles remain exactly the same ... */}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {/* MAKE POINTS DYNAMIC HERE */}
        <span className="text-xl md:text-2xl font-black text-white">{totalPoints || "0"}</span>
        <span className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">XP</span>
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

export default function FanZoneDashboard() {
  const [activeTab, setActiveTab] = useState("My Analytics");
  
  // 1. Fetch live points from your context
  const { currentUserPoints } = useLeaderboard();
  
  // 2. Format the points with commas (e.g. 55, or 12,450)
  const displayPoints = currentUserPoints ? currentUserPoints.toLocaleString() : "0";

  
// ...

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
              
              <p className="text-xs text-emerald-500 font-bold flex items-center gap-1 mb-6">
                <TrendingUp className="w-3 h-3" /> +850 <span className="text-gray-500 font-medium ml-1">vs Apr 2026</span>
              </p>
              <div className="h-24">
                 <MiniTrendLine data={[20, 30, 25, 40, 35, 50, 45, 60, 55, 70, 80]} />
              </div>
            </div>
          </div>
        </div>

{/* 3. STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          <div className="md:col-span-2 bg-[#09090b] border border-white/10 rounded-2xl p-5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl border-2 border-rose-500 flex items-center justify-center font-black text-2xl text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              7
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-white mb-1">You&apos;re doing great!</h3>
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs text-gray-400">1,550 XP to reach Level 8</p>
                <p className="text-xs font-bold text-gray-400">6,450 / 8,000 XP</p>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-600 to-orange-500 w-[78%] rounded-full relative">
                   <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#09090b] border border-white/10 rounded-2xl p-5 flex items-center justify-between group cursor-pointer hover:border-white/20 transition-colors">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                 <Trophy className="w-6 h-6 text-yellow-500" />
               </div>
               <div>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Your Rank</p>
                 <h3 className="text-2xl font-black text-white leading-tight">24</h3>
                 <p className="text-xs text-emerald-500 font-bold flex items-center gap-1 mt-0.5">
                   ↑ 8 <span className="text-gray-500 font-medium">This Month</span>
                 </p>
               </div>
             </div>
          </div>

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

          {/* NEW LIVE LEADERBOARD BUTTON */}
          <Link href="/MainModules/Leaderboard" className="bg-gradient-to-br from-rose-600 to-orange-500 rounded-2xl p-5 flex flex-col items-center justify-center group hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(225,29,72,0.2)] cursor-pointer border border-rose-400/30">
             <Trophy className="w-7 h-7 text-white mb-1.5 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 drop-shadow-md" />
             <h3 className="text-sm font-black text-white text-center leading-tight tracking-wide drop-shadow-sm">Live<br/>Leaderboard</h3>
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
                    <select className="w-full bg-[#18181b] border border-white/10 text-sm font-bold rounded-xl pl-4 pr-8 py-2.5 text-white focus:outline-none focus:border-rose-500 appearance-none cursor-pointer">
                      <option>May 2026</option>
                      <option>Apr 2026</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <div className="space-y-8">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">This Month</p>
                      <div className="flex items-end gap-3">
                        <h4 className="text-3xl font-black text-white leading-none">{displayPoints} XP</h4>
                        <span className="text-xs text-emerald-500 font-bold mb-0.5">↑ 850 <span className="text-gray-500 font-medium">vs Apr 2026</span></span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">All Time</p>
                      <div className="flex items-end gap-3">
                        <h4 className="text-3xl font-black text-white leading-none">84,650 XP</h4>
                        <span className="text-xs text-gray-500 font-medium mb-0.5">Since Feb 2025</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Col 2: Donut Chart & Legend (Span 5) */}
                <div className="xl:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-6 lg:gap-10 w-full py-6 xl:py-0 border-t border-white/10 xl:border-t-0 xl:border-l xl:pl-8">
                  <DonutChart data={earningBreakdown} totalPoints={displayPoints} />
                  <div className="space-y-4 w-full sm:w-auto">
                    {earningBreakdown.map((item, i) => (
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
                    <h2 className="text-4xl font-black text-white">12</h2>
                    <span className="text-xl font-medium text-gray-400">Days</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-6">Keep it going, don&apos;t break your streak!</p>
                  
                  <div className="flex justify-between items-center">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                      const isActive = idx < 6; // Mocking Mon-Sat as active
                      return (
                        <div key={day} className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]' : 'bg-[#18181b] border-white/10 text-gray-600'}`}>
                            {isActive ? <CheckCircle2 className="w-5 h-5" /> : null}
                          </div>
                          <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>{day}</span>
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
                  <h3 className="text-2xl font-black text-emerald-500">84,650 XP</h3>
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
                    <h2 className="text-4xl font-black text-white">12</h2>
                    <span className="text-xl font-medium text-gray-400">Days</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-6">Keep it going, don&apos;t break your streak!</p>
                  
                  <div className="flex justify-between items-center">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                      const isActive = idx < 6;
                      return (
                        <div key={day} className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]' : 'bg-[#18181b] border-white/10 text-gray-600'}`}>
                            {isActive ? <CheckCircle2 className="w-5 h-5" /> : null}
                          </div>
                          <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>{day}</span>
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
                    <h2 className="text-4xl font-black text-white">12</h2>
                    <span className="text-xl font-medium text-gray-400">Days</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-6">Keep it going, don&apos;t break your streak!</p>
                  
                  <div className="flex justify-between items-center">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                      const isActive = idx < 6;
                      return (
                        <div key={day} className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]' : 'bg-[#18181b] border-white/10 text-gray-600'}`}>
                            {isActive ? <CheckCircle2 className="w-5 h-5" /> : null}
                          </div>
                          <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>{day}</span>
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
                    <h3 className="text-3xl font-black text-emerald-500 mb-2">84,650 XP</h3>
                    <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                      This Period ↑ 24% <span className="text-gray-500 ml-1">vs Apr 1 – Apr 30, 2026</span>
                    </p>
                  </div>
                </div>

                {/* Points Journey */}
                <div className="bg-[#09090b] border border-white/10 rounded-2xl p-6">
                  <h3 className="text-base font-black text-white mb-1">Your Points Journey</h3>
                  <p className="text-xs text-gray-400 font-medium mb-6">See how you&apos;re growing</p>
                  
                  <div className="flex justify-center mb-8">
                    <DonutChart data={pointsJourneyData} />
                  </div>

                  <div className="space-y-4">
                    {pointsJourneyData.map((item, i) => (
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
function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
