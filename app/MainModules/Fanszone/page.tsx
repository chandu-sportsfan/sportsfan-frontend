"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Trophy, Flame, MessageCircle, Gift, Users, Eye, 
  CheckCircle2, Share2, Award, ChevronRight, Dumbbell, 
  Target, Medal, TrendingUp, X
} from "lucide-react";

// Import your actual Leaderboard Component!
import GlobalLeaderboard from "@/src/components/GlobalLeaderboard-Component/GlobalLeaderboard";

// --- MOCK DATA ---
const monthlyPointsData = {
  "May 2026": { points: "12,450", growth: "+850", chart: [20, 35, 30, 50, 45, 65, 55, 80, 70, 90, 100] },
  "Apr 2026": { points: "11,600", growth: "+1200", chart: [30, 40, 35, 50, 45, 60, 55, 70, 65, 80, 75] },
  "Mar 2026": { points: "10,400", growth: "+900", chart: [20, 25, 30, 40, 35, 50, 45, 60, 55, 65, 70] },
  "Feb 2026": { points: "9,500", growth: "+400", chart: [15, 20, 18, 25, 30, 28, 35, 40, 38, 45, 50] },
  "Jan 2026": { points: "9,100", growth: "+0", chart: [10, 12, 15, 14, 20, 18, 22, 25, 24, 30, 35] },
};

const extendedActivities = [
  { icon: Trophy, color: "text-yellow-500", text: "You predicted PBKS to win Gold!", pts: "+50 XP", time: "2h ago" },
  { icon: CheckCircle2, color: "text-blue-500", text: "Voted in Fan Poll", pts: "+20 XP", time: "1d ago" },
  { icon: Share2, color: "text-emerald-500", text: "Shared a Fan Moment", pts: "+15 XP", time: "2d ago" },
  { icon: MessageCircle, color: "text-pink-500", text: "Started a Watch Party Chat", pts: "+30 XP", time: "3d ago" },
  { icon: Flame, color: "text-orange-500", text: "Maintained 7-day login streak", pts: "+100 XP", time: "4d ago" },
];

const extendedTopFans = [
  { rank: 1, name: "VikramKing", xp: "2,450 XP", img: "12" },
  { rank: 2, name: "BlueArmy", xp: "2,120 XP", img: "13" },
  { rank: 3, name: "RohitFan18", xp: "1,980 XP", img: "14" },
  { rank: 4, name: "PBKSSher", xp: "1,850 XP", img: "15" },
  { rank: 5, name: "CricketCrazy", xp: "1,720 XP", img: "16" },
];

type MonthKey = keyof typeof monthlyPointsData;

// --- REUSABLE STYLED COMPONENTS ---

function PremiumCard({
  children,
  className = "",
  onClick,
  hoverEffect = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={[
        "relative rounded-2xl border border-white/10",
        "bg-[#09090b]", 
        "shadow-[0_8px_32px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)]",
        "transition-all duration-300 ease-out",
        onClick ? "cursor-pointer" : "",
        hoverEffect
          ? "hover:-translate-y-1 hover:border-rose-500/40 hover:shadow-[0_16px_48px_rgba(0,0,0,0.9),0_0_32px_rgba(244,63,94,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]"
          : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function NeonSlider({
  percent,
  colorClass = "from-rose-600 to-orange-500",
  height = "h-1.5",
  glowColor = "#f43f5e"
}: {
  percent: number;
  colorClass?: string;
  height?: string;
  glowColor?: string;
}) {
  return (
    <div className={`relative w-full ${height} bg-zinc-900 rounded-full overflow-visible shadow-inner`}>
      <div
        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${colorClass} transition-all duration-700`}
        style={{ width: `${percent}%` }}
      >
        <span
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white z-10"
          style={{
            boxShadow: `0 0 10px 2px ${glowColor}, 0 0 20px 6px ${glowColor}80` 
          }}
        />
      </div>
    </div>
  );
}

export default function FansonePage() {
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>("May 2026");
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [showAllTopFans, setShowAllTopFans] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);

  const currentMonthData = monthlyPointsData[selectedMonth];

  const generateChartPoints = (chartArray: number[]) => {
    const maxVal = Math.max(...chartArray);
    return chartArray.map((val, idx) => {
      const x = (idx / (chartArray.length - 1)) * 100;
      const y = 100 - (val / maxVal) * 80;
      return `${x},${y}`;
    }).join(" L ");
  };

  const chartLinePoints = `M ${generateChartPoints(currentMonthData.chart)}`;
  const chartFillPoints = `${chartLinePoints} L 100,100 L 0,100 Z`;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6 lg:p-8 font-sans relative overflow-x-hidden">
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-4 gap-6">

        <div className="xl:col-span-3 flex flex-col gap-6">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <PremiumCard className="p-5 flex flex-col justify-between">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-600 to-orange-500 blur-md opacity-70 animate-pulse" />
                  <Image
                    src="https://i.pravatar.cc/150?img=11"
                    alt="Profile"
                    width={64}
                    height={64}
                    unoptimized
                    className="relative w-full h-full rounded-full object-cover border-2 border-zinc-900"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight flex items-center gap-1.5 text-white">
                    PBKS_SuperFan
                    <CheckCircle2 className="w-4 h-4 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,1)]" />
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Rising Fan{" "}
                    <span className="ml-1.5 inline-block border border-white/10 bg-zinc-800 px-2 py-0.5 rounded text-[10px] text-gray-300 font-semibold uppercase tracking-wider">
                      Level 7
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-xs font-bold mb-2 text-rose-500">
                  <span>6,250 / 8,000 XP</span>
                </div>
                <NeonSlider percent={78} />
              </div>

              <div className="flex justify-between items-center text-center">
                {[
                  { Icon: Trophy, label: "Auction\nWinner", color: "text-yellow-500", glow: "rgba(234,179,8,0.8)" },
                  { Icon: Target, label: "Top\nPredictor", color: "text-rose-500", glow: "rgba(244,63,94,0.8)" },
                  { Icon: Flame, label: "Loyal\nFan", color: "text-orange-500", glow: "rgba(249,115,22,0.8)" },
                ].map(({ Icon, label, color, glow }, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 group cursor-pointer">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-900 border border-white/5 transition-all duration-300 group-hover:scale-110 group-hover:border-white/20`}
                      style={{ boxShadow: `0 0 15px ${glow.replace("0.8", "0")}` }}
                    >
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <span className="text-[10px] text-gray-400 leading-tight whitespace-pre-line font-medium">{label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-[10px] text-gray-500 mb-2 flex items-center gap-1 tracking-widest uppercase font-bold">
                  Team Loyalty
                  <span className="w-3.5 h-3.5 rounded-full border border-gray-600 text-[8px] flex items-center justify-center text-gray-500">i</span>
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black tracking-tighter text-zinc-800 select-none">PBKS</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold tracking-tight text-white">Punjab Kings</p>
                    <div className="flex items-center gap-2 mt-2">
                      <NeonSlider percent={78} colorClass="from-blue-700 to-sky-400" glowColor="#38bdf8" />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5">Die-Hard PBKS Fan • 78%</p>
                  </div>
                </div>
              </div>
            </PremiumCard>

            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-white/10 group min-h-[250px] flex flex-col justify-center shadow-[0_16px_48px_rgba(0,0,0,0.8)] bg-black">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-screen"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1200&auto=format&fit=crop')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-rose-950/80 to-orange-900/60 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/30 to-transparent mix-blend-color-dodge" />

              <div className="relative z-10 p-8 max-w-sm">
                <h1 className="text-6xl font-black tracking-tighter mb-2 text-white drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]">
                  FAN ZONE
                </h1>
                <p className="text-base font-bold tracking-widest uppercase mb-3 text-rose-400 drop-shadow-md">
                  Connect • Engage • Belong
                </p>
                <p className="text-sm text-gray-300 mb-8 leading-relaxed font-medium">
                  The ultimate space for true fans to connect, compete and celebrate.
                </p>

                <div className="flex gap-4">
                  <button className="px-6 py-3 rounded-xl text-sm font-black tracking-wide text-white transition-all duration-300 bg-gradient-to-r from-rose-600 to-orange-500 shadow-[0_0_20px_rgba(244,63,94,0.5)] hover:shadow-[0_0_30px_rgba(244,63,94,0.8)] hover:scale-105 border border-rose-400/50">
                    Connect with Fans
                  </button>
                  <button className="px-6 py-3 rounded-xl text-sm font-bold tracking-wide text-white border border-white/20 bg-black/40 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                    Watch Live
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { icon: MessageCircle, color: "text-rose-500", glow: "rgba(244,63,94,0.5)", title: "Live Discussions", desc: "Chat, polls & reactions", meta: "1.2K online" },
              { icon: Trophy, color: "text-yellow-500", glow: "rgba(234,179,8,0.5)", title: "Fan Challenges", desc: "Compete & earn badges", meta: "5 Active" },
              { icon: Gift, color: "text-pink-500", glow: "rgba(236,72,153,0.5)", title: "Rewards & Perks", desc: "Exclusive rewards for fans", meta: "12 New" },
              { icon: Award, color: "text-orange-500", glow: "rgba(249,115,22,0.5)", title: "Leaderboard", desc: "Rank up & earn bragging rights", meta: "Top 12%", onClick: () => setIsLeaderboardModalOpen(true) },
              { icon: Users, color: "text-violet-500", glow: "rgba(139,92,246,0.5)", title: "Connect with Fans", desc: "Grow your network worldwide", meta: "2.4K Fans" },
            ].map((item, idx) => (
              <PremiumCard key={idx} onClick={item.onClick} hoverEffect className="p-4 flex flex-col justify-between min-h-[130px] group/card">
                <div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-zinc-900 border border-white/5 transition-all duration-300 group-hover/card:bg-white/5"
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <h3 className="text-sm font-bold tracking-tight mb-1 text-white">{item.title}</h3>
                  <p className="text-[10px] text-gray-400 leading-snug mb-3">{item.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
                    <Users className="w-3 h-3" /> {item.meta}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-600 group-hover/card:text-white group-hover/card:translate-x-1 transition-all" />
                </div>
              </PremiumCard>
            ))}
          </div>

          <PremiumCard className="p-6 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 w-full">
              <h3 className="text-lg font-black tracking-tight mb-1 text-white">Engage & Earn Points</h3>
              <p className="text-xs text-gray-400 mb-6 font-medium">Participate in activities and earn exciting points</p>

              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Eye, title: "Watch Live", pts: "+20 XP", color: "text-sky-500" },
                  { icon: CheckCircle2, title: "Vote & Polls", pts: "+15 XP", color: "text-violet-500" },
                  { icon: MessageCircle, title: "Live Chat", pts: "+10 XP", color: "text-pink-500" },
                  { icon: Share2, title: "Share Moments", pts: "+25 XP", color: "text-orange-500" },
                  { icon: Trophy, title: "Complete Challenges", pts: "+50 XP", color: "text-yellow-500" },
                ].map((act, i) => (
                  <div key={i} className="flex flex-col gap-1.5 group cursor-pointer hover:-translate-y-0.5 transition-transform">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
                      <act.icon className={`w-4 h-4 ${act.color}`} />
                      {act.title}
                    </div>
                    <span className={`text-xs font-black ${act.color} drop-shadow-md`}>{act.pts}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-80 rounded-xl p-5 border border-white/10 bg-zinc-900/50 flex-shrink-0">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl border-2 border-rose-500 flex items-center justify-center font-black text-xl text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4),inset_0_0_10px_rgba(244,63,94,0.2)]">
                  7
                </div>
                <div>
                  <h4 className="text-sm font-black text-white tracking-tight">You&apos;re doing great!</h4>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">1,550 XP to reach Level 8</p>
                </div>
              </div>
              <NeonSlider percent={65} />
              <div className="text-right mt-3">
                <button className="text-[10px] font-bold text-rose-500 hover:text-rose-400 uppercase tracking-widest transition-colors">
                  View All Activities →
                </button>
              </div>
            </div>
          </PremiumCard>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="rounded-2xl p-6 relative overflow-hidden border border-rose-500/30 group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(225,29,72,0.4)] bg-gradient-to-br from-rose-950 via-black to-black">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-600/40 via-transparent to-transparent pointer-events-none" />
              
              <Trophy className="absolute -bottom-4 -right-4 text-rose-500/10 pointer-events-none transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125" style={{ width: 140, height: 140 }} />

              <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-2 text-rose-500">
                  Upcoming Challenge
                </h3>
                <h2 className="text-2xl font-black tracking-tight mb-2 text-white">
                  Predict the Match Winner
                </h2>
                <p className="text-xs text-gray-400 mb-6 font-medium">
                  Predict the winner &amp; score big!
                </p>

                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-black tracking-tight bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                    <Trophy className="w-3 h-3" /> 50 XP
                  </span>
                  <span className="text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-gray-300 font-bold bg-white/10 border border-white/10">
                    ⏱ 3 Days Left
                  </span>
                </div>

                <button className="w-full py-3 rounded-xl text-sm font-black tracking-wide text-white transition-all duration-300 bg-gradient-to-r from-rose-600 to-orange-500 shadow-[0_0_20px_rgba(244,63,94,0.5)] border border-rose-400/50 hover:scale-[1.02]">
                  Participate Now
                </button>
              </div>
            </div>

            <PremiumCard className="p-6 flex flex-col" hoverEffect>
              <h3 className="text-xs font-black tracking-widest text-gray-400 mb-5 uppercase">Today&apos;s Top Fans</h3>
              <div className="flex flex-col gap-4 flex-1">
                {extendedTopFans.slice(0, showAllTopFans ? undefined : 3).map((fan) => (
                  <div key={fan.rank} className="flex items-center justify-between group/fan hover:bg-zinc-900 rounded-lg px-2 -mx-2 transition-colors py-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-black w-4 text-center ${
                          fan.rank === 1 ? "text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,1)]"
                        : fan.rank === 2 ? "text-slate-300 drop-shadow-[0_0_5px_rgba(203,213,225,1)]"
                        : fan.rank === 3 ? "text-amber-600 drop-shadow-[0_0_5px_rgba(217,119,6,1)]"
                        : "text-gray-600"
                      }`}>
                        {fan.rank}
                      </span>
                      <div className="relative">
                        <Image 
                          src={`https://i.pravatar.cc/150?img=${fan.img}`} 
                          alt={fan.name} 
                          width={32} 
                          height={32} 
                          unoptimized
                          className="w-8 h-8 rounded-full object-cover border-2 border-zinc-900" 
                        />
                        {fan.rank <= 3 && (
                          <div className="absolute inset-0 rounded-full" style={{
                            boxShadow: fan.rank === 1 ? "0 0 10px 1px rgba(234,179,8,0.8)"
                                     : fan.rank === 2 ? "0 0 10px 1px rgba(203,213,225,0.6)"
                                     : "0 0 10px 1px rgba(217,119,6,0.6)"
                          }} />
                        )}
                      </div>
                      <span className="text-xs font-bold text-white tracking-tight">{fan.name}</span>
                    </div>
                    <span className="text-[11px] font-black text-rose-500">{fan.xp}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowAllTopFans(!showAllTopFans)} className="text-[10px] font-bold text-rose-500 hover:text-rose-400 uppercase tracking-widest mt-4">
                {showAllTopFans ? "Show Less ↑" : "View Leaderboard →"}
              </button>
            </PremiumCard>

            <PremiumCard className="p-6 flex flex-col" hoverEffect>
              <h3 className="text-xs font-black tracking-widest text-gray-400 mb-5 uppercase">Recent Activity</h3>
              <div className="flex flex-col gap-4 flex-1">
                {extendedActivities.slice(0, showAllActivity ? undefined : 3).map((act, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 group/act hover:bg-zinc-900 rounded-lg px-2 -mx-2 transition-colors py-1">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-black border border-white/10">
                        <act.icon className={`w-4 h-4 ${act.color}`} />
                      </div>
                      <span className="text-xs font-medium text-gray-300 truncate group-hover/act:text-white transition-colors">
                        {act.text}
                      </span>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className={`text-[11px] font-black ${act.color}`}>{act.pts}</span>
                      <span className="text-[9px] text-gray-500 font-bold mt-0.5">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowAllActivity(!showAllActivity)} className="text-[10px] font-bold text-rose-500 hover:text-rose-400 uppercase tracking-widest mt-4">
                {showAllActivity ? "Show Less ↑" : "View All Activity →"}
              </button>
            </PremiumCard>

          </div>
        </div>

        <div className="flex flex-col gap-6">

          <PremiumCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black tracking-widest uppercase text-gray-400">Fan Meter</h3>
              <button className="text-[10px] text-rose-500 hover:text-rose-400 font-bold uppercase tracking-wider">
                View History
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {[
                { icon: Dumbbell, title: "Training Session", mood: "😍", status: "HIGH", percent: 85, high: true },
                { icon: Target, title: "Match Moment", mood: "🤯", status: "HIGH", percent: 75, high: true },
                { icon: Medal, title: "Medal Ceremony", mood: "🥺", status: "LOW", percent: 25, high: false },
              ].map((meter, i) => (
                <div key={i}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${meter.high ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                      <meter.icon className={`w-4 h-4 ${meter.high ? "text-emerald-500" : "text-rose-500"}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight">{meter.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">You&apos;re feeling {meter.mood}</p>
                      <p className={`text-[10px] font-bold mt-0.5 ${meter.high ? "text-emerald-500" : "text-rose-500"}`}>
                        Fan energy is {meter.status} right now
                      </p>
                    </div>
                  </div>
                  <div className="relative w-full h-2 bg-zinc-900 rounded-full shadow-inner">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${meter.high ? 'bg-gradient-to-r from-emerald-700 to-emerald-400' : 'bg-gradient-to-r from-rose-700 to-rose-400'}`}
                      style={{ width: `${meter.percent}%`, boxShadow: meter.high ? "0 0 10px rgba(52,211,153,0.6)" : "0 0 10px rgba(244,63,94,0.6)" }}
                    />
                    <Flame
                      className={`absolute -top-1.5 w-4 h-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] ${meter.high ? "text-emerald-300" : "text-orange-400"}`}
                      style={{ left: `calc(${meter.percent}% - 8px)` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>

          <PremiumCard className="p-6 overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Points</p>
                  <h3 className="text-2xl font-black tracking-tighter flex items-center gap-2 text-white">
                    {currentMonthData.points} XP
                    {currentMonthData.growth !== "+0" && (
                      <span className="text-[11px] text-emerald-500 flex items-center font-bold tracking-tight drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">
                        <TrendingUp className="w-3 h-3 mr-0.5" /> {currentMonthData.growth}
                      </span>
                    )}
                  </h3>
                </div>
              </div>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value as MonthKey)}
                className="bg-black border border-white/10 text-xs font-bold rounded-lg px-2 py-1.5 text-gray-300 focus:outline-none focus:border-rose-500/50 cursor-pointer"
              >
                {Object.keys(monthlyPointsData).map((month) => (
                  <option key={month} value={month} className="bg-zinc-900">{month}</option>
                ))}
              </select>
            </div>

            <div className="relative h-24 w-full mt-2 -mx-2">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(244,63,94,0.5)" />
                    <stop offset="100%" stopColor="rgba(244,63,94,0)" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <path d={chartFillPoints} fill="url(#chartGradient)" className="transition-all duration-700 ease-in-out" />
                <path d={chartLinePoints} fill="none" stroke="#f43f5e" strokeWidth="1.5" filter="url(#glow)" className="transition-all duration-700 ease-in-out" />
                {currentMonthData.chart.map((val, idx) => {
                  const maxVal = Math.max(...currentMonthData.chart);
                  const x = (idx / (currentMonthData.chart.length - 1)) * 100;
                  const y = 100 - (val / maxVal) * 80;
                  return (
                    <circle key={idx} cx={x} cy={y} r={idx === currentMonthData.chart.length - 1 ? "2.5" : "1"} 
                            fill="#fff" filter={idx === currentMonthData.chart.length - 1 ? "url(#glow)" : ""} 
                            className="transition-all duration-700 ease-in-out" />
                  );
                })}
              </svg>
            </div>
          </PremiumCard>

          <div className="relative rounded-2xl overflow-hidden border border-rose-500/30 group cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-[0_16px_40px_rgba(0,0,0,0.8)] bg-black">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60 mix-blend-screen"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=600&auto=format&fit=crop')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-rose-950/80 to-transparent mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/30 to-transparent mix-blend-color-dodge" />

            <div className="relative z-10 p-6">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-rose-500">
                Next Up
              </p>
              <h2 className="text-2xl font-black tracking-tight mb-1 text-white">India vs Australia</h2>
              <p className="text-xs text-gray-300 font-bold flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,1)]" />
                12 May 2026 • 7:30 PM
              </p>
              <p className="text-xs text-gray-400 font-medium mb-5">
                Gear up, predict &amp; cheer for India!
              </p>
              <button className="px-6 py-2.5 rounded-xl text-sm font-black tracking-wide text-white transition-all duration-300 bg-gradient-to-r from-rose-600 to-orange-500 shadow-[0_0_20px_rgba(244,63,94,0.5)] border border-rose-400/50 hover:scale-105">
                Get Ready
              </button>
            </div>
          </div>

        </div>
      </div>

      {isLeaderboardModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setIsLeaderboardModalOpen(false)}
        >
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl border border-white/10 overflow-hidden bg-[#09090b] shadow-[0_32px_80px_rgba(0,0,0,0.9),0_0_64px_rgba(244,63,94,0.15)]">
            <button
              onClick={() => setIsLeaderboardModalOpen(false)}
              className="absolute top-4 right-4 z-[60] w-10 h-10 rounded-full flex items-center justify-center bg-black/50 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="overflow-y-auto w-full h-full custom-scrollbar">
               <GlobalLeaderboard />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
