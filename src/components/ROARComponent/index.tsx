/**
 * ROAR — Complete MVP  (single file, drop into src/ROAR.tsx)
 * Render <ROARApp /> from main.jsx / main.tsx
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

/* ─── STYLES ─────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

/* All selectors scoped to .roar-root to avoid polluting parent page */
.roar-root {
  --bg-primary:#050508;
  --bg-secondary:#0E0E14;
  --bg-tertiary:#16161F;
  --bg-glass:rgba(22,22,31,0.72);
  --accent-magenta:#E91E8C;
  --accent-orange:#FF6B35;
  --accent-yellow:#FFCC00;
  --accent-gradient:linear-gradient(135deg,#E91E8C,#FF6B35);
  --text-primary:#F5F5FA;
  --text-secondary:#9494AD;
  --text-muted:#4A4A62;
  --border:#252538;
  --border-glow:rgba(233,30,140,0.35);
  --live-green:#00E676;
  --gold:#FFB800;
  --correct-green:#00C853;
  --wrong-red:#F44336;
  --pending-amber:#FF9800;
  --teal:#00E8C6;

  /* Layout */
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 600px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}

/* On desktop: let it occupy full width of parent */
@media (min-width: 481px) {
  .roar-root {
    display: flex;
    justify-content: center;
    align-items: stretch;
    background: var(--bg-primary);
  }
  .roar-inner {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: var(--bg-primary);
  }
}

/* On mobile: fill the container */
@media (max-width: 480px) {
  .roar-inner {
    width: 100%;
    position: relative;
    overflow: hidden;
    background: var(--bg-primary);
  }
}

.roar-inner::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.12;
  background-image: radial-gradient(circle, #ffffff1f 1px, transparent 1px);
  background-size: 18px 18px;
}

.roar-inner::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.08;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.35'/%3E%3C/svg%3E");
}

.roar-root * {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
.roar-root *::-webkit-scrollbar { width:0; height:0; }
.roar-root textarea,
.roar-root input,
.roar-root select { -webkit-appearance:none; }

.roar-root .font-display { font-family:'Bebas Neue',sans-serif; }
.roar-root .logotype {
  font-family:'Bebas Neue',sans-serif;
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.08em;
}
.roar-root .btn-gradient {
  background: var(--accent-gradient);
  color: white;
  font-weight: 700;
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 0.06em;
  transition: transform 0.2s, box-shadow 0.2s;
}
.roar-root .btn-gradient:active { transform: scale(0.98); }
.roar-root .btn-gradient:hover { box-shadow: 0 0 28px rgba(233,30,140,0.45); }
.roar-root .glass-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 28px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04);
}
.roar-root .pill-nav-dock {
  padding: 6px 8px;
  border-radius: 999px;
  background: rgba(14,14,20,0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
}
.roar-root .live-pulse { animation: roar-livePulse 2s ease-in-out infinite; }
@keyframes roar-livePulse {
  0%,100% { opacity:1; transform:scale(1); }
  50% { opacity:0.5; transform:scale(0.85); }
}
@keyframes roar-driftUp {
  0% { opacity: 0; transform: translateY(0) scale(1); }
  10% { opacity: 0.3; }
  90% { opacity: 0.15; }
  100% { opacity: 0; transform: translateY(-100vh) scale(0.8); }
}
.roar-root .oracle-ring-animate {
  animation: roar-oracleShimmer 3s linear infinite;
  transform-origin: center;
}
@keyframes roar-oracleShimmer {
  0%   { stroke-dashoffset:0;   transform:rotate(0deg); }
  100% { stroke-dashoffset:-80; transform:rotate(360deg); }
}
.roar-root .room-energy-bar {
  height: 3px;
  background: var(--accent-gradient);
  animation: roar-energyPulse 1.5s ease-in-out infinite;
}
.roar-root .room-energy-fast { animation-duration: 0.6s; }
@keyframes roar-energyPulse {
  0%,100% { opacity:0.6; transform:scaleX(0.95); }
  50%     { opacity:1;   transform:scaleX(1); }
}
.roar-root .btn-pulse { animation: roar-btnPulse 2.5s ease-in-out infinite; }
@keyframes roar-btnPulse {
  0%,100% { transform:scale(1); }
  50%     { transform:scale(1.02); }
}
.roar-root .screen-scroll {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 24px;
}
.roar-root .gradient-border {
  position: relative;
  background: var(--bg-secondary);
  border-radius: 28px;
}
.roar-root .gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 2px;
  border-radius: inherit;
  background: var(--accent-gradient);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
.roar-root .glow-magenta-sm { box-shadow: 0 0 14px rgba(233,30,140,0.4); }
.roar-root .pill-frame {
  border-radius: 999px;
  padding: 6px;
  background: linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 12px 40px rgba(0,0,0,0.5);
}

/* Portal targets inside roar-root for fixed positioning */
.roar-root .roar-fixed-portal {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}
.roar-root .roar-fixed-portal > * {
  pointer-events: auto;
}
`;

/* ─── MOCK DATA ──────────────────────────────────────────────────────────── */

const avatarUrl = (u: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u)}&backgroundColor=0E0E14`;

const BADGE_LABELS: Record<string, string> = {
  ORACLE: "Oracle 👁",
  BOLD_CALLER: "Bold Caller ⚡",
  CRICKET_HEAD: "Cricket Head 🏏",
  CONTRARIAN: "Contrarian 🔥",
  OG_FAN: "OG Fan 👑",
  SEASONED_FAN: "Seasoned Fan 🏅",
  RISING_FAN: "Rising Fan ⭐",
};

const BADGE_CONFIG: Record<string, any> = {
  ORACLE: {
    gradient: ["#FFB800", "#FF9800", "#FFB800"],
    icon: "👁",
    iconBg: "#FFB800",
    glow: "0 0 24px rgba(255,184,0,0.65)",
    animated: true,
  },
  BOLD_CALLER: {
    gradient: ["#E91E8C", "#FF6B35"],
    icon: "⚡",
    iconBg: "#E91E8C",
    glow: "0 0 20px rgba(233,30,140,0.55)",
    animated: false,
  },
  CRICKET_HEAD: {
    gradient: ["#1565C0", "#00BCD4"],
    icon: "🏏",
    iconBg: "#1565C0",
    glow: "none",
    animated: false,
  },
  CONTRARIAN: {
    gradient: ["#7B1FA2", "#E040FB"],
    icon: "🔥",
    iconBg: "#7B1FA2",
    glow: "none",
    dashed: true,
    animated: false,
  },
  OG_FAN: {
    gradient: ["#B87333", "#CD7F32", "#8B4513"],
    icon: "👑",
    iconBg: "#B87333",
    glow: "none",
    animated: false,
  },
  SEASONED_FAN: {
    gradient: ["#8888A0", "#666680"],
    icon: "🏅",
    iconBg: "#666680",
    glow: "none",
    animated: false,
  },
  RISING_FAN: {
    gradient: null,
    icon: "⭐",
    iconBg: "#44445A",
    glow: "none",
    borderOnly: true,
    animated: false,
  },
};

const BADGE_DETAIL: Record<string, any> = {
  ORACLE: {
    name: "Oracle",
    description: "Top 5% prediction accuracy over 30+ predictions.",
    rarity: "Legendary · Top 3%",
    howTo: "Get 75%+ accuracy over 30 predictions",
    gradient: "linear-gradient(135deg,#FFB800,#FF9800)",
  },
  BOLD_CALLER: {
    name: "Bold Caller",
    description: "You call the unexpected and get it right.",
    rarity: "Rare · Top 12%",
    howTo: "Make 3 correct bold predictions",
    gradient: "linear-gradient(135deg,#E91E8C,#FF6B35)",
  },
  CRICKET_HEAD: {
    name: "Cricket Head",
    description: "All-in on cricket. The game is your religion.",
    rarity: "Common",
    howTo: "Vote on 20 cricket debates",
    gradient: "linear-gradient(135deg,#1565C0,#00BCD4)",
  },
  CONTRARIAN: {
    name: "Contrarian",
    description: "Always on the other side. And often right.",
    rarity: "Uncommon · Top 22%",
    howTo: "Disagree on 10 majority positions",
    gradient: "linear-gradient(135deg,#7B1FA2,#E040FB)",
  },
  OG_FAN: {
    name: "OG Fan",
    description: "Before 2010. True fandom runs deep.",
    rarity: "Epic · Top 8%",
    howTo: "Set tenure to before 2010",
    gradient: "linear-gradient(135deg,#B87333,#CD7F32)",
  },
  SEASONED_FAN: {
    name: "Seasoned Fan",
    description: "You've seen the highs and lows. Still here.",
    rarity: "Uncommon",
    howTo: "Set tenure to 2010-2022",
    gradient: "linear-gradient(135deg,#8888A0,#666680)",
  },
  RISING_FAN: {
    name: "Rising Fan",
    description: "Welcome to ROAR. Your legacy starts now.",
    rarity: "Common",
    howTo: "Complete onboarding",
    gradient: "linear-gradient(135deg,#44445A,#6B6B8A)",
  },
};

const TENURE_OPTIONS = [
  {
    id: "rising",
    label: "Just getting started",
    sub: "2023+",
    badge: "RISING_FAN",
    chip: "Rising Fan ⭐",
    desc: "New to the game — fresh opinions, fresh takes.",
  },
  {
    id: "seasoned",
    label: "Been here a while",
    sub: "2010–2022",
    badge: "SEASONED_FAN",
    chip: "Seasoned Fan 🏅",
    desc: "You've seen the highs and the lows. Still here.",
  },
  {
    id: "og",
    label: "OG Fan",
    sub: "Before 2010",
    badge: "OG_FAN",
    chip: "OG Fan 👑",
    desc: "Before the IPL, before T20. True fandom runs deep.",
  },
];

const TEAMS = [
  {
    id: "India",
    emoji: "🇮🇳",
    label: "India",
    color: "#FF9800",
    sport: "cricket",
  },
  {
    id: "Pak",
    emoji: "🇵🇰",
    label: "Pakistan",
    color: "#4CAF50",
    sport: "cricket",
  },
  { id: "Aus", emoji: "🇦🇺", label: "Aus", color: "#FFEB3B", sport: "cricket" },
  {
    id: "Eng",
    emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    label: "England",
    color: "#F44336",
    sport: "cricket",
  },
  { id: "MI", emoji: "💙", label: "MI", color: "#1565C0", sport: "cricket" },
  { id: "CSK", emoji: "💛", label: "CSK", color: "#FFCC00", sport: "cricket" },
  { id: "RCB", emoji: "❤️", label: "RCB", color: "#B71C1C", sport: "cricket" },
  { id: "KKR", emoji: "💜", label: "KKR", color: "#6A1B9A", sport: "cricket" },
  {
    id: "MCFC",
    emoji: "🔵",
    label: "MCFC",
    color: "#1E88E5",
    sport: "football",
  },
  { id: "BFC", emoji: "🔴", label: "BFC", color: "#E53935", sport: "football" },
  {
    id: "MohanB",
    emoji: "🟢",
    label: "Mohun B",
    color: "#43A047",
    sport: "football",
  },
  {
    id: "Kerala",
    emoji: "🟡",
    label: "Kerala",
    color: "#FDD835",
    sport: "football",
  },
];

const FEED_POSTS = [
  {
    id: "ht1",
    type: "hot_take",
    sport: "cricket",
    fan: { username: "Arjun_80s", badge: "OG_FAN", team: "India" },
    text: "Virat Kohli in 2025 is better than Sachin Tendulkar ever was. Change my mind.",
    agreePercent: 24,
    fanCount: 8821,
    replies: 234,
    following: false,
    isLive: false,
  },
  {
    id: "ht2",
    type: "hot_take",
    sport: "football",
    fan: { username: "MumbaiCity_Fan", badge: "BOLD_CALLER", team: "MCFC" },
    text: "ISL is genuinely world-class football now. The quality this season has been incredible.",
    agreePercent: 68,
    fanCount: 1230,
    replies: 89,
    following: true,
    isLive: true,
  },
  {
    id: "pr1",
    type: "prediction",
    sport: "cricket",
    fan: { username: "StatsKing_99", badge: "ORACLE", team: "India" },
    text: "Bumrah takes 5+ wickets in today's first innings.",
    match: "IND vs AUS · 3rd Test",
    samePredictionCount: 1240,
    counterCount: 89,
  },
  {
    id: "pr2",
    type: "prediction",
    sport: "football",
    fan: { username: "GoalMachine_9", badge: "BOLD_CALLER", team: "MCFC" },
    text: "Mumbai City FC wins the ISL title this season. Book it.",
    match: "ISL 2025",
    samePredictionCount: 567,
    counterCount: 200,
  },
  {
    id: "ht3",
    type: "hot_take",
    sport: "cricket",
    fan: { username: "PakFan_K", badge: "CONTRARIAN", team: "Pak" },
    text: "India vs Pakistan is the greatest sporting rivalry in the world. Super Bowl, El Clásico — all secondary.",
    agreePercent: 82,
    fanCount: 15200,
    replies: 903,
    following: false,
    isLive: false,
  },
  {
    id: "ht4",
    type: "hot_take",
    sport: "football",
    fan: { username: "KeralaFan_12", badge: "CRICKET_HEAD", team: "Kerala" },
    text: "Kerala Blasters fans are the best football supporters in Asia. Jawaharlal Nehru Stadium atmosphere is unreal.",
    agreePercent: 77,
    fanCount: 4100,
    replies: 312,
    following: false,
    isLive: false,
  },
  {
    id: "ht5",
    type: "hot_take",
    sport: "cricket",
    fan: { username: "DelhiDaredevil", badge: "RISING_FAN", team: "RCB" },
    text: "RCB has the most loyal fanbase of any team in any sport in India. The loyalty despite the trophies is unmatched.",
    agreePercent: 61,
    fanCount: 6300,
    replies: 512,
    following: false,
    isLive: false,
  },
  {
    id: "ht6",
    type: "hot_take",
    sport: "football",
    fan: { username: "BFCArmy", badge: "SEASONED_FAN", team: "BFC" },
    text: "Bengaluru FC era is over. New generation clubs will dominate ISL by 2027.",
    agreePercent: 44,
    fanCount: 890,
    replies: 78,
    following: false,
    isLive: false,
  },
];

const ROOM_POSTS = [
  {
    id: "rp1",
    fan: { username: "Rahul_77", badge: "BOLD_CALLER" },
    text: "Kohli is going to smash this bowling attack today. 80+ guaranteed.",
    fireCount: 14,
    nochanceCount: 3,
    timeAgo: "2m",
    type: "prediction",
  },
  {
    id: "rp2",
    fan: { username: "SportsMumbai", badge: "CONTRARIAN" },
    text: "This pitch looks dry. Spinners will dominate by innings 2. Bumrah is a back-up plan today.",
    fireCount: 31,
    nochanceCount: 8,
    timeAgo: "4m",
    type: "hottake",
  },
  {
    id: "rp3",
    fan: { username: "CricketGuru", badge: "ORACLE" },
    text: "Bumrah is the GOAT. No debate. Anyone who disagrees hasn't watched real cricket.",
    fireCount: 89,
    nochanceCount: 12,
    timeAgo: "6m",
    type: "chat",
  },
  {
    id: "rp4",
    fan: { username: "StatsKing_99", badge: "ORACLE" },
    text: "India has never lost a day-night test at home. That streak ends today or it doesn't.",
    fireCount: 45,
    nochanceCount: 5,
    timeAgo: "9m",
    type: "hottake",
  },
  {
    id: "rp5",
    fan: { username: "Priya_Cricket", badge: "RISING_FAN" },
    text: "My prediction: Jadeja takes 4 wickets. Writing this here so you all remember.",
    fireCount: 7,
    nochanceCount: 22,
    timeAgo: "12m",
    type: "prediction",
  },
];

const JOIN_FANS = [
  "Rahul_K",
  "Sanjay_MI",
  "Priya77",
  "CricFan_Delhi",
  "TheRealRohan",
  "MumbaiMagic",
  "FootyFirst",
  "KohliArmy",
];

const NOTIFICATIONS_DATA = [
  {
    id: "n1",
    type: "PREDICTION_OK",
    title: "You called it! 🎯",
    subtitle:
      "Your prediction 'Kohli 80+' vs Australia was CORRECT. +50 rep points.",
    time: "2m",
    read: false,
    fan: { username: "StatsKing_99", badge: "ORACLE" },
    cta: "See your accuracy",
  },
  {
    id: "n2",
    type: "CHALLENGE",
    title: "StatsKing_99 challenged your take.",
    subtitle:
      "They said Rohit is more consistent than Kohli in tests. Reply now.",
    time: "8m",
    read: false,
    fan: { username: "StatsKing_99", badge: "ORACLE" },
    cta: null,
  },

  {
    id: "n5",
    type: "BADGE",
    title: "Badge Unlocked: Bold Caller ⚡",
    subtitle: "You called 3 unexpected outcomes correctly. Rare badge earned.",
    time: "2h",
    read: true,
    fan: null,
    cta: null,
  },
  {
    id: "n6",
    type: "PREDICTION_FAIL",
    title: "Wrong call — but a bold one 💪",
    subtitle:
      "Your prediction 'Jadeja 4 wickets' was incorrect. It stays on profile.",
    time: "3h",
    read: true,
    fan: { username: "Priya_Cricket", badge: "RISING_FAN" },
    cta: null,
  },
  {
    id: "n7",
    type: "RIVAL",
    title: "Your rival won a debate.",
    subtitle:
      "Arjun_80s was right about Kohli vs AUS. Your score: 2 wins, 5 losses.",
    time: "5h",
    read: true,
    fan: { username: "Arjun_80s", badge: "OG_FAN" },
    cta: "Challenge them",
  },
  {
    id: "n8",
    type: "FAN_OF_WEEK",
    title: "Fan of the Week: Arjun_80s 🏆",
    subtitle: "82% accuracy this week. 47 correct predictions.",
    time: "1d",
    read: true,
    fan: { username: "Arjun_80s", badge: "OG_FAN" },
    cta: null,
  },
  {
    id: "n9",
    type: "WEEKLY",
    title: "Monday Bold Call is live!",
    subtitle: "This week: Will India win the series vs AUS? 3,200 fans voted.",
    time: "1d",
    read: true,
    fan: null,
    cta: "Cast your call",
  },
];

const LEADERBOARD_DATA = [
  {
    rank: 1,
    username: "OracleKing_IND",
    badge: "ORACLE",
    accuracy: 84,
    predictions: 127,
    team: "India",
    reputationScore: 9800,
  },
  {
    rank: 2,
    username: "Arjun_80s",
    badge: "OG_FAN",
    accuracy: 79,
    predictions: 98,
    team: "India",
    reputationScore: 8200,
  },
  {
    rank: 3,
    username: "StatsKing_99",
    badge: "ORACLE",
    accuracy: 77,
    predictions: 143,
    team: "India",
    reputationScore: 7900,
  },
  {
    rank: 4,
    username: "CricFanatic",
    badge: "CRICKET_HEAD",
    accuracy: 74,
    predictions: 61,
    team: "MI",
    reputationScore: 6100,
  },
  {
    rank: 5,
    username: "PakFan_K",
    badge: "CONTRARIAN",
    accuracy: 71,
    predictions: 89,
    team: "Pak",
    reputationScore: 5400,
  },
  {
    rank: 6,
    username: "MumbaiCity_Fan",
    badge: "BOLD_CALLER",
    accuracy: 69,
    predictions: 54,
    team: "MCFC",
    reputationScore: 4300,
  },
  {
    rank: 7,
    username: "KeralaFan_12",
    badge: "CRICKET_HEAD",
    accuracy: 67,
    predictions: 72,
    team: "Kerala",
    reputationScore: 3700,
  },
  {
    rank: 8,
    username: "GoalMachine_9",
    badge: "BOLD_CALLER",
    accuracy: 65,
    predictions: 38,
    team: "MCFC",
    reputationScore: 3100,
  },
  {
    rank: 9,
    username: "DelhiDaredevil",
    badge: "RISING_FAN",
    accuracy: 62,
    predictions: 29,
    team: "RCB",
    reputationScore: 2100,
  },
  {
    rank: 10,
    username: "BFCArmy",
    badge: "SEASONED_FAN",
    accuracy: 60,
    predictions: 45,
    team: "BFC",
    reputationScore: 1800,
  },
  {
    rank: 23,
    username: "RoarUser",
    badge: "RISING_FAN",
    accuracy: 55,
    predictions: 12,
    team: "India",
    reputationScore: 520,
  },
];

const CURRENT_USER = {
  username: "RoarUser",
  handle: "roaruser",
  badge: "RISING_FAN" as string,
  fanSince: "2019",
  yearsFandom: 6,
  accuracy: 55,
  predictionCount: 12,
  hotTakeCount: 8,
  reputationScore: 520,
  teams: ["India", "MI"],
  rank: 23,
};

const USER_PREDICTIONS = [
  {
    id: "up1",
    text: "Kohli scores 80+ against Australia in the 3rd Test.",
    match: "IND vs AUS 3rd Test",
    status: "CORRECT",
    date: "2 days ago",
  },
  {
    id: "up2",
    text: "India wins the series 3-1 vs England.",
    match: "IND vs ENG Series",
    status: "WRONG",
    date: "1 week ago",
  },
  {
    id: "up3",
    text: "Bumrah takes 5+ wickets in first innings.",
    match: "IND vs AUS 3rd Test",
    status: "PENDING",
    date: "Today",
  },
  {
    id: "up4",
    text: "CSK lifts IPL trophy 2025.",
    match: "IPL 2025 Final",
    status: "CORRECT",
    date: "2 months ago",
  },
];

const USER_HOT_TAKES = [
  {
    id: "uht1",
    text: "Jadeja is the most complete cricketer India has ever produced.",
    agreePercent: 72,
    controversial: false,
    top: true,
  },
  {
    id: "uht2",
    text: "ISL will overtake IPL in viewership by 2028.",
    agreePercent: 29,
    controversial: true,
    top: false,
  },
  {
    id: "uht3",
    text: "RCB will never win the IPL. Scientifically impossible.",
    agreePercent: 61,
    controversial: false,
    top: false,
  },
];

const BADGES_LIST = [
  { id: "ORACLE", unlocked: false, progress: 62, earnedDate: undefined },
  {
    id: "BOLD_CALLER",
    unlocked: true,
    progress: 100,
    earnedDate: "Earned 3 days ago",
  },
  {
    id: "CRICKET_HEAD",
    unlocked: true,
    progress: 100,
    earnedDate: "Earned 2 weeks ago",
  },
  { id: "CONTRARIAN", unlocked: false, progress: 40, earnedDate: undefined },
  { id: "OG_FAN", unlocked: false, progress: 0, earnedDate: undefined },
  { id: "SEASONED_FAN", unlocked: false, progress: 0, earnedDate: undefined },
  {
    id: "RISING_FAN",
    unlocked: true,
    progress: 100,
    earnedDate: "Earned on signup",
  },
];

const RIVAL = {
  fan: { username: "Arjun_80s", badge: "OG_FAN" },
  badge: "OG_FAN",
  disagreements: 7,
  rivalWins: 5,
  yourWins: 2,
  topDisagreement:
    '"Sachin was better than Kohli in all formats" — still debating this one.',
};

const HOT_TAKE_PREVIEWS = [
  {
    id: "lp1",
    fan: { username: "Arjun_80s", badge: "OG_FAN" },
    text: "Sachin vs Kohli debate is over. It was never close.",
  },
  {
    id: "lp2",
    fan: { username: "PakFan_K", badge: "CONTRARIAN" },
    text: "India vs Pakistan is must-watch. Forget the Champions Trophy.",
  },
  {
    id: "lp3",
    fan: { username: "CricGuru", badge: "ORACLE" },
    text: "Bumrah is the best bowler alive. Not even debatable.",
  },
];

const UPCOMING_MATCHES = [
  "IND vs AUS 3rd Test",
  "IND vs ENG ODI Series",
  "ISL: MCFC vs BFC",
  "ISL: Kerala vs Mohun B",
];

/* ─── TINY HELPERS ───────────────────────────────────────────────────────── */

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

/* ─── AVATAR WITH BADGE ──────────────────────────────────────────────────── */

function AvatarWithBadge({
  username,
  badge = "RISING_FAN",
  size = "md",
}: {
  username: string;
  badge?: string;
  size?: "sm" | "md" | "lg";
}) {
  const SIZES: Record<string, any> = {
    sm: { outer: 38, avatar: 28, ring: 34, icon: 16, stroke: 3 },
    md: { outer: 52, avatar: 40, ring: 48, icon: 20, stroke: 3.5 },
    lg: { outer: 80, avatar: 64, ring: 76, icon: 24, stroke: 4 },
  };
  const s = SIZES[size] || SIZES.md;
  const cfg = BADGE_CONFIG[badge] || BADGE_CONFIG.RISING_FAN;
  const gradId = `rg-${username}-${size}`.replace(/[^a-zA-Z0-9]/g, "");
  const radius = (s.ring - s.stroke) / 2;
  const cx = s.outer / 2;
  const circ = 2 * Math.PI * radius;

  return (
    <div
      style={{
        width: s.outer,
        height: s.outer,
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width={s.outer}
        height={s.outer}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          {cfg.gradient && (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              {cfg.gradient.map((c: string, i: number) => (
                <stop
                  key={i}
                  offset={`${(i / (cfg.gradient.length - 1)) * 100}%`}
                  stopColor={c}
                />
              ))}
            </linearGradient>
          )}
        </defs>
        <circle
          cx={cx}
          cy={cx}
          r={radius}
          fill="none"
          stroke={cfg.borderOnly ? "var(--border)" : `url(#${gradId})`}
          strokeWidth={s.stroke}
          strokeDasharray={
            cfg.dashed
              ? "6 4"
              : cfg.animated
                ? `${circ * 0.25} ${circ * 0.75}`
                : undefined
          }
          strokeLinecap="round"
          className={cfg.animated ? "oracle-ring-animate" : ""}
          style={{ transformOrigin: `${cx}px ${cx}px` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          width: s.avatar,
          height: s.avatar,
          top: (s.outer - s.avatar) / 2,
          left: (s.outer - s.avatar) / 2,
          borderRadius: "50%",
          overflow: "hidden",
          background: "var(--bg-tertiary)",
          boxShadow: cfg.glow !== "none" ? cfg.glow : undefined,
        }}
      >
        <img
          src={avatarUrl(username)}
          alt={username}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
      </div>
      <div
        style={{
          position: "absolute",
          width: s.icon,
          height: s.icon,
          bottom: 0,
          right: 0,
          borderRadius: "50%",
          background: cfg.iconBg,
          border: "2px solid var(--bg-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: s.icon <= 16 ? 8 : s.icon <= 20 ? 10 : 12,
          zIndex: 10,
        }}
      >
        {cfg.icon}
      </div>
    </div>
  );
}

/* ─── SPLIT BAR ──────────────────────────────────────────────────────────── */

function SplitBar({ left }: { left: number }) {
  return (
    <div
      style={{
        position: "relative",
        height: 12,
        borderRadius: 999,
        overflow: "hidden",
        background: "var(--bg-tertiary)",
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${left}%` }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: "0 auto 0 0",
          background: "var(--accent-magenta)",
        }}
      />
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${100 - left}%` }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: "0 0 0 auto",
          background: "var(--accent-orange)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 8px",
          fontSize: 10,
          fontWeight: 700,
          color: "white",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <span>{left}%</span>
        <span>{100 - left}%</span>
      </div>
    </div>
  );
}

/* ─── TOAST ──────────────────────────────────────────────────────────────── */

function Toast({
  message,
  visible,
  containerRef,
}: {
  message: string;
  visible: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <AnimatePresence>
      {visible && message && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          style={{
            position: "absolute",
            top: 16,
            left: 12,
            right: 12,
            zIndex: 200,
            padding: "12px 20px",
            borderRadius: 20,
            textAlign: "center",
            fontWeight: 700,
            fontSize: 14,
            background: "var(--accent-magenta)",
            color: "white",
            boxShadow: "0 0 28px rgba(233,30,140,0.5)",
            pointerEvents: "none",
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── SCREEN: ONBOARDING ─────────────────────────────────────────────────── */

function Onboarding({ onComplete }: { onComplete: (prefs: any) => void }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [sports, setSports] = useState<string[]>(["cricket"]);
  const [teams, setTeams] = useState<string[]>(["India", "MI"]);
  const [tenure, setTenure] = useState<string | null>(null);
  const [firstVote, setFirstVote] = useState<string | null>(null);
  const [showLive, setShowLive] = useState(false);

  const handleCompleteOnboarding = async () => {
    try {
      // setLoading(true);
      const contributionText = firstVote === "agree" || firstVote === "disagree"
        ? (sports.includes("cricket")
          ? "Virat Kohli in 2025 is better than Sachin Tendulkar ever was. Change my mind."
          : "ISL is now world-class football. Change my mind.")
        : firstVote;

      await axios.post("/api/roar/onboarding", {
        sports,
        teams,
        tenure,
        badge: selectedTenure?.badge || "RISING_FAN",
        firstContribution: contributionText,
      });

      onComplete({
        sports,
        teams,
        tenure,
        badge: selectedTenure?.badge || "RISING_FAN",
        firstContribution: contributionText,
      });
    } catch (err) {
      console.error(err);
    } finally {
      // setLoading(false);
    }
  };
  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  const slide = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  const selectedTenure = TENURE_OPTIONS.find((t) => t.id === tenure);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        background: "var(--bg-primary)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Progress dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          paddingTop: 48,
          paddingBottom: 16,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: 8,
              borderRadius: 4,
              transition: "all 0.3s",
              width: i <= step ? 24 : 8,
              background: i <= step ? "var(--accent-magenta)" : "var(--border)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
        }}
      >
        <AnimatePresence mode="wait" custom={dir}>
          {/* Step 0 — splash */}
          {step === 0 && (
            <motion.div
              key="s0"
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "75vh",
                padding: "0 32px",
                textAlign: "center",
              }}
            >
              <h1
                className="logotype"
                style={{ fontSize: 96, lineHeight: 1, letterSpacing: "0.1em" }}
              >
                ROAR
              </h1>
              <p style={{ color: "var(--text-secondary)", marginTop: 16 }}>
                Your sport. Your voice. Your reputation.
              </p>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: 13,
                  marginTop: 8,
                }}
              >
                Where Indian fans build their legacy
              </p>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => go(1)}
                className="btn-gradient btn-pulse"
                style={{
                  marginTop: 48,
                  width: "100%",
                  maxWidth: 280,
                  height: 52,
                  borderRadius: 999,
                  fontSize: 18,
                  fontFamily: "'Bebas Neue',sans-serif",
                  letterSpacing: "0.1em",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                I'M A FAN →
              </motion.button>
            </motion.div>
          )}

          {/* Step 1 — sport + teams */}
          {step === 1 && (
            <motion.div
              key="s1"
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              style={{ padding: "0 24px 40px" }}
            >
              <h2
                className="font-display"
                style={{ fontSize: 40, lineHeight: 1.1, marginBottom: 8 }}
              >
                Claim your allegiance.
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginBottom: 20,
                }}
              >
                This is how other fans will know you
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {[
                  {
                    id: "cricket",
                    emoji: "🏏",
                    label: "Cricket",
                    fans: "492M",
                  },
                  {
                    id: "football",
                    emoji: "⚽",
                    label: "Football",
                    fans: "138.7M",
                  },
                ].map((sp) => {
                  const sel = sports.includes(sp.id);
                  return (
                    <motion.button
                      key={sp.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setSports((p) =>
                          p.includes(sp.id)
                            ? p.filter((x) => x !== sp.id)
                            : [...p, sp.id],
                        )
                      }
                      className={sel ? "gradient-border" : ""}
                      style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "center",
                        padding: "16px 20px",
                        borderRadius: 24,
                        border: `2px solid ${sel ? "transparent" : "var(--border)"}`,
                        background: "var(--bg-secondary)",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: 40 }}>{sp.emoji}</span>
                      <div>
                        <p
                          className="font-display"
                          style={{ fontSize: 28, lineHeight: 1 }}
                        >
                          {sp.label}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          {sp.fans} fans on ROAR
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              <p
                className="font-display"
                style={{ fontSize: 22, marginTop: 28, marginBottom: 12 }}
              >
                Pick your teams
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 12,
                }}
              >
                {TEAMS.map((t) => {
                  const sel = teams.includes(t.id);
                  return (
                    <motion.button
                      key={t.id}
                      animate={{ scale: sel ? 1.08 : 1 }}
                      onClick={() =>
                        setTeams((p) =>
                          p.includes(t.id)
                            ? p.filter((x) => x !== t.id)
                            : [...p, t.id],
                        )
                      }
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        outline: sel
                          ? `3px solid var(--accent-magenta)`
                          : undefined,
                        borderRadius: 999,
                        padding: 4,
                      }}
                    >
                      <span
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                          background: `${t.color}44`,
                        }}
                      >
                        {t.emoji}
                      </span>
                      <span
                        style={{ fontSize: 10, color: "var(--text-secondary)" }}
                      >
                        {t.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => sports.length && go(2)}
                disabled={!sports.length}
                className="btn-gradient"
                style={{
                  width: "100%",
                  marginTop: 28,
                  height: 52,
                  borderRadius: 999,
                  fontSize: 16,
                  border: "none",
                  cursor: "pointer",
                  opacity: sports.length ? 1 : 0.4,
                }}
              >
                THESE ARE MY TEAMS →
              </motion.button>
            </motion.div>
          )}

          {/* Step 2 — tenure */}
          {step === 2 && (
            <motion.div
              key="s2"
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              style={{ padding: "0 24px" }}
            >
              <h2
                className="font-display"
                style={{ fontSize: 40, lineHeight: 1.1 }}
              >
                How long have you been a fan?
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginTop: 8,
                  marginBottom: 24,
                }}
              >
                Your starter badge depends on this
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {TENURE_OPTIONS.map((opt) => {
                  const sel = tenure === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTenure(opt.id)}
                      style={{
                        padding: "20px",
                        borderRadius: 24,
                        background: "var(--bg-secondary)",
                        border: `2px solid ${sel ? "var(--accent-magenta)" : "var(--border)"}`,
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "border-color 0.2s",
                      }}
                    >
                      <p style={{ fontWeight: 700, fontSize: 15 }}>
                        {opt.label}
                      </p>
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--text-secondary)",
                          marginTop: 2,
                        }}
                      >
                        {opt.sub}
                      </p>
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: 10,
                          fontSize: 12,
                          padding: "4px 12px",
                          borderRadius: 999,
                          background: "var(--bg-tertiary)",
                          color: "var(--accent-magenta)",
                        }}
                      >
                        {opt.chip}
                      </span>
                      {sel && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          style={{
                            marginTop: 14,
                            padding: "12px",
                            borderRadius: 16,
                            background: "rgba(233,30,140,0.08)",
                            border: "1px solid rgba(233,30,140,0.2)",
                          }}
                        >
                          <p
                            style={{
                              fontSize: 11,
                              color: "var(--accent-magenta)",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              marginBottom: 6,
                            }}
                          >
                            Your Starter Badge
                          </p>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                clipPath:
                                  "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                                background:
                                  opt.id === "og"
                                    ? "linear-gradient(135deg,#B87333,#CD7F32)"
                                    : opt.id === "seasoned"
                                      ? "linear-gradient(135deg,#8888A0,#666680)"
                                      : "linear-gradient(135deg,#44445A,#6B6B8A)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 20,
                              }}
                            >
                              {opt.id === "og"
                                ? "👑"
                                : opt.id === "seasoned"
                                  ? "🏅"
                                  : "⭐"}
                            </div>
                            <div>
                              <p style={{ fontWeight: 700, fontSize: 14 }}>
                                {opt.chip.replace(/[⭐🏅👑]/g, "").trim()}
                              </p>
                              <p
                                style={{
                                  fontSize: 11,
                                  color: "var(--text-muted)",
                                  marginTop: 2,
                                }}
                              >
                                {BADGE_DETAIL[opt.badge]?.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => tenure && go(3)}
                disabled={!tenure}
                className="btn-gradient"
                style={{
                  width: "100%",
                  marginTop: 24,
                  height: 52,
                  borderRadius: 999,
                  fontSize: 16,
                  border: "none",
                  cursor: "pointer",
                  opacity: tenure ? 1 : 0.4,
                }}
              >
                CLAIM MY BADGE →
              </motion.button>
            </motion.div>
          )}

          {/* Step 3 — social proof */}
          {step === 3 && (
            <motion.div
              key="s3"
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              style={{ padding: "0 24px" }}
            >
              <h2
                className="font-display"
                style={{ fontSize: 48, lineHeight: 1.1 }}
              >
                You're not alone.
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 12,
                  marginTop: 28,
                }}
              >
                {[
                  { n: "492M", l: "Cricket fans" },
                  { n: "138.7M", l: "Football fans" },
                  { n: "1,247", l: "Debating now" },
                ].map((s) => (
                  <div key={s.l} style={{ textAlign: "center" }}>
                    <p
                      className="font-display"
                      style={{ fontSize: 28, color: "white" }}
                    >
                      {s.n}
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        marginTop: 4,
                      }}
                    >
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  marginTop: 28,
                  marginBottom: 12,
                }}
              >
                What fans are saying right now
              </p>
              {HOT_TAKE_PREVIEWS.map((ht) => (
                <div
                  key={ht.id}
                  className="glass-card"
                  style={{
                    padding: "12px 16px",
                    marginBottom: 8,
                    opacity: 0.9,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <AvatarWithBadge
                      username={ht.fan.username}
                      badge={ht.fan.badge}
                      size="sm"
                    />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>
                      {ht.fan.username}
                    </span>
                  </div>
                  <p style={{ fontSize: 13 }}>{ht.text}</p>
                </div>
              ))}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => go(4)}
                className="btn-gradient"
                style={{
                  width: "100%",
                  marginTop: 24,
                  height: 52,
                  borderRadius: 999,
                  fontSize: 16,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ENTER ROAR →
              </motion.button>
            </motion.div>
          )}

          {/* Step 4 — first take */}
          {step === 4 && (
            <motion.div
              key="s4"
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              style={{ padding: "0 24px 40px" }}
            >
              <h2
                className="font-display"
                style={{ fontSize: 40, lineHeight: 1.1 }}
              >
                Before you go in —
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginTop: 8,
                }}
              >
                Drop one take. It takes 10 seconds. This is what ROAR is about.
              </p>
              <div
                className="glass-card"
                style={{ padding: 20, marginTop: 24 }}
              >
                <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.5 }}>
                  {sports.includes("cricket")
                    ? "Kohli in 2025 is better than Sachin ever was. Agree or disagree?"
                    : "ISL is now world-class football. Agree or disagree?"}
                </p>
              </div>
              {!firstVote ? (
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  {["agree", "disagree"].map((v) => (
                    <motion.button
                      key={v}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setFirstVote(v);
                        setTimeout(() => setShowLive(true), 400);
                      }}
                      style={{
                        flex: 1,
                        padding: "16px",
                        borderRadius: 20,
                        fontSize: 18,
                        fontWeight: 700,
                        cursor: "pointer",
                        border: `2px solid ${v === "agree" ? "var(--accent-magenta)" : "var(--accent-orange)"}`,
                        background: "transparent",
                        color:
                          v === "agree"
                            ? "var(--accent-magenta)"
                            : "var(--accent-orange)",
                      }}
                    >
                      {v === "agree" ? "Agree 🔥" : "Disagree 💀"}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ marginTop: 24, textAlign: "center" }}
                >
                  <p style={{ color: "var(--text-secondary)" }}>
                    Your first take is live. 47 fans are about to see it.
                  </p>
                  {showLive && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={handleCompleteOnboarding}
                      className="btn-gradient"
                      style={{
                        width: "100%",
                        marginTop: 24,
                        height: 52,
                        borderRadius: 999,
                        fontSize: 16,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      LET'S GO →
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── COMPOSE MODAL ──────────────────────────────────────────────────────── */

const COMPOSE_OPTIONS = [
  {
    id: "hot_take",
    emoji: "🔥",
    title: "Drop a Hot Take",
    desc: "Say what others won't",
  },
  {
    id: "prediction",
    emoji: "📊",
    title: "Make a Prediction",
    desc: "Put your reputation on the line",
  },
  {
    id: "debate",
    emoji: "⚡",
    title: "Start a Debate",
    desc: "Two sides. One winner.",
  },
  {
    id: "memory",
    emoji: "🕰",
    title: "Share a Memory",
    desc: "Flashback moment",
  },
];

function ComposeModal({
  open,
  onClose,
  onPost,
  initialType,
}: {
  open: boolean;
  onClose: () => void;
  onPost: (p: any) => void;
  initialType: string | null;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [sideA, setSideA] = useState("");
  const [sideB, setSideB] = useState("");
  const [memCtx, setMemCtx] = useState("");
  const [match, setMatch] = useState(UPCOMING_MATCHES[0]);
  const [confidence, setConf] = useState(7);
  const [audience, setAud] = useState("Everyone");
  const [sport, setSport] = useState("cricket");

  useEffect(() => {
    if (open && initialType) setSelected(initialType);
    if (!open) reset();
  }, [open, initialType]);

  const reset = () => {
    setSelected(null);
    setText("");
    setSideA("");
    setSideB("");
    setMemCtx("");
    setSport("cricket");
  };
  const canPost =
    (selected === "hot_take" && text.trim()) ||
    (selected === "prediction" && text.trim()) ||
    (selected === "debate" && sideA.trim() && sideB.trim()) ||
    (selected === "memory" && text.trim());
  const handlePost = () => {
    onPost({
      type: selected,
      text,
      sideA,
      sideB,
      match,
      confidence,
      audience,
      memCtx,
      sport,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 60,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
            }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 70,
              background: "var(--bg-glass)",
              backdropFilter: "blur(20px)",
              borderRadius: "32px 32px 0 0",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "12px 0 4px",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  background: "var(--border)",
                }}
              />
            </div>
            <div
              style={{
                padding: "0 20px 40px",
                maxHeight: "75vh",
                overflowY: "auto",
              }}
            >
              <h2
                className="font-display"
                style={{
                  fontSize: 28,
                  letterSpacing: "0.04em",
                  marginBottom: 16,
                }}
              >
                Create
              </h2>
              {!selected ? (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {COMPOSE_OPTIONS.map((opt) => (
                    <motion.button
                      key={opt.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelected(opt.id)}
                      style={{
                        padding: "16px",
                        borderRadius: 20,
                        background: "var(--bg-tertiary)",
                        border: "1px solid var(--border)",
                        textAlign: "left",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <span style={{ fontSize: 28 }}>{opt.emoji}</span>
                      <p
                        className="font-display"
                        style={{ fontSize: 18, marginTop: 8 }}
                      >
                        {opt.title}
                      </p>
                      <p
                        style={{ fontSize: 13, color: "var(--text-secondary)" }}
                      >
                        {opt.desc}
                      </p>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      fontSize: 13,
                      color: "var(--accent-magenta)",
                      marginBottom: 12,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    ← Back
                  </button>
                  {(selected === "hot_take" || selected === "memory") && (
                    <>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        placeholder={
                          selected === "hot_take"
                            ? "What's your boldest take?"
                            : "Your memory or flashback moment..."
                        }
                        style={{
                          width: "100%",
                          padding: "14px",
                          borderRadius: 16,
                          background: "rgba(0,0,0,0.4)",
                          border: "1px solid var(--border)",
                          resize: "none",
                          outline: "none",
                          color: "var(--text-primary)",
                          fontSize: 14,
                        }}
                      />
                      {selected === "memory" && (
                        <input
                          value={memCtx}
                          onChange={(e) => setMemCtx(e.target.value)}
                          placeholder="Which match or moment?"
                          style={{
                            width: "100%",
                            marginTop: 8,
                            padding: "12px",
                            borderRadius: 14,
                            background: "rgba(0,0,0,0.4)",
                            border: "1px solid var(--border)",
                            outline: "none",
                            color: "var(--text-primary)",
                            fontSize: 13,
                          }}
                        />
                      )}
                    </>
                  )}
                  {selected === "prediction" && (
                    <>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={3}
                        placeholder="Your prediction..."
                        style={{
                          width: "100%",
                          padding: "14px",
                          borderRadius: 16,
                          background: "rgba(0,0,0,0.4)",
                          border: "1px solid var(--border)",
                          resize: "none",
                          outline: "none",
                          color: "var(--text-primary)",
                          fontSize: 14,
                          fontStyle: "italic",
                        }}
                      />
                      <label
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          marginTop: 12,
                          display: "block",
                        }}
                      >
                        Match
                      </label>
                      <select
                        value={match}
                        onChange={(e) => setMatch(e.target.value)}
                        style={{
                          width: "100%",
                          marginTop: 4,
                          padding: "10px 12px",
                          borderRadius: 14,
                          background: "rgba(0,0,0,0.4)",
                          border: "1px solid var(--border)",
                          color: "var(--text-primary)",
                          fontSize: 13,
                        }}
                      >
                        {UPCOMING_MATCHES.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <label
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          marginTop: 12,
                          display: "block",
                        }}
                      >
                        Confidence: {confidence}/10
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={confidence}
                        onChange={(e) => setConf(+e.target.value)}
                        style={{
                          width: "100%",
                          accentColor: "var(--accent-magenta)",
                          marginTop: 4,
                        }}
                      />
                    </>
                  )}
                  {selected === "debate" && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <input
                        value={sideA}
                        onChange={(e) => setSideA(e.target.value)}
                        placeholder="Side A"
                        style={{
                          padding: "12px",
                          borderRadius: 14,
                          background: "rgba(0,0,0,0.4)",
                          border: "1px solid var(--border)",
                          outline: "none",
                          color: "var(--text-primary)",
                          fontSize: 13,
                        }}
                      />
                      <p
                        className="font-display"
                        style={{
                          textAlign: "center",
                          color: "var(--text-muted)",
                        }}
                      >
                        VS
                      </p>
                      <input
                        value={sideB}
                        onChange={(e) => setSideB(e.target.value)}
                        placeholder="Side B"
                        style={{
                          padding: "12px",
                          borderRadius: 14,
                          background: "rgba(0,0,0,0.4)",
                          border: "1px solid var(--border)",
                          outline: "none",
                          color: "var(--text-primary)",
                          fontSize: 13,
                        }}
                      />
                    </div>
                  )}
                  {(selected === "hot_take" || selected === "prediction") && (
                    <>
                      <label
                        style={{
                          fontSize: 11,
                          color: "var(--text-muted)",
                          display: "block",
                          marginTop: 16,
                          marginBottom: 4,
                        }}
                      >
                        Sport
                      </label>
                      <div style={{ display: "flex", gap: 8, marginTop: 4, marginBottom: 12 }}>
                        <button
                          type="button"
                          onClick={() => setSport("cricket")}
                          style={{
                            flex: 1,
                            padding: "8px",
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            border: sport === "cricket" ? "1px solid var(--accent-magenta)" : "1px solid var(--border)",
                            background: sport === "cricket" ? "rgba(233,30,140,0.15)" : "transparent",
                            color: sport === "cricket" ? "var(--accent-magenta)" : "var(--text-secondary)",
                          }}
                        >
                          🏏 Cricket
                        </button>
                        <button
                          type="button"
                          onClick={() => setSport("football")}
                          style={{
                            flex: 1,
                            padding: "8px",
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            border: sport === "football" ? "1px solid #3b82f6" : "1px solid var(--border)",
                            background: sport === "football" ? "rgba(59,130,246,0.15)" : "transparent",
                            color: sport === "football" ? "#3b82f6" : "var(--text-secondary)",
                          }}
                        >
                          ⚽ Football
                        </button>
                      </div>
                    </>
                  )}
                  <label
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      display: "block",
                      marginTop: 16,
                      marginBottom: 4,
                    }}
                  >
                    Who can see this?
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAud(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 14,
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                      marginBottom: 16,
                    }}
                  >
                    {[
                      "Everyone",
                      "Cricket fans",
                      "Football fans",
                      "MI fans only",
                    ].map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    disabled={!canPost}
                    onClick={handlePost}
                    className="btn-gradient"
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: 999,
                      fontSize: 16,
                      border: "none",
                      cursor: "pointer",
                      opacity: canPost ? 1 : 0.4,
                    }}
                  >
                    POST TO ROAR
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── BOTTOM NAV ─────────────────────────────────────────────────────────── */

const NAV_TABS = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "discuss", label: "Discuss", icon: "💬" },
  { id: "compose", label: "", icon: "+" },
  { id: "profile", label: "You", icon: "👤" },
  { id: "alerts", label: "Alerts", icon: "🔔" },
];
const RADIAL_OPTS = [
  { id: "hot_take", label: "Hot Take", emoji: "🔥" },
  { id: "prediction", label: "Predict", emoji: "📊" },
  { id: "debate", label: "Debate", emoji: "⚡" },
  { id: "memory", label: "Memory", emoji: "🕰" },
];

function BottomNav({
  activeTab,
  onTabChange,
  onCompose,
  onQuickCompose,
  unreadCount,
  matchLive,
  badgeNearUnlock,
}: {
  activeTab: string;
  onTabChange: (t: string) => void;
  onCompose: () => void;
  onQuickCompose: (t: string) => void;
  unreadCount: number;
  matchLive: boolean;
  badgeNearUnlock: boolean;
}) {
  const [radial, setRadial] = useState(false);
  const pressRef = useRef<any>(null);

  const down = () => {
    pressRef.current = setTimeout(() => setRadial(true), 320);
  };
  const up = () => {
    clearTimeout(pressRef.current);
    if (!radial) onCompose();
    setRadial(false);
  };

  return (
    <>
      <AnimatePresence>
        {radial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 55,
              pointerEvents: "auto",
            }}
            onClick={() => setRadial(false)}
          >
            <div
              style={{
                position: "absolute",
                bottom: 90,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 12,
              }}
            >
              {RADIAL_OPTS.map((q, i) => (
                <motion.button
                  key={q.id}
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: i * 0.05, type: "spring" }}
                  onClick={() => {
                    onQuickCompose(q.id);
                    setRadial(false);
                  }}
                  className="glass-card"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    cursor: "pointer",
                    border: "none",
                    gap: 2,
                  }}
                >
                  {q.emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        style={{
          flexShrink: 0,
          zIndex: 50,
          pointerEvents: "none",
          paddingBottom: 16,
          paddingTop: 12,
          background: "transparent",
        }}
      >
        <div
          className="pill-nav-dock"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            margin: "0 auto",
            maxWidth: 420,
            width: "calc(100% - 24px)",
            pointerEvents: "auto",
          }}
        >
          {NAV_TABS.map((tab) => {
            if (tab.id === "compose") {
              return (
                <button
                  key="compose"
                  onMouseDown={down}
                  onMouseUp={up}
                  onMouseLeave={() => clearTimeout(pressRef.current)}
                  onTouchStart={down}
                  onTouchEnd={up}
                  style={{
                    position: "relative",
                    marginTop: -32,
                    zIndex: 10,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className="btn-gradient"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      boxShadow: "0 6px 28px rgba(233,30,140,0.5)",
                    }}
                  >
                    +
                  </motion.div>
                </button>
              );
            }
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                animate={{ scale: isActive ? [1, 1.15, 1] : 1 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  padding: "8px 12px",
                  borderRadius: 999,
                  minWidth: 52,
                  background: isActive ? "white" : "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 18, position: "relative" }}>
                  {tab.icon}
                  {tab.id === "discuss" && matchLive && (
                    <span
                      className="live-pulse"
                      style={{
                        position: "absolute",
                        top: -2,
                        right: -2,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--wrong-red)",
                        display: "block",
                      }}
                    />
                  )}
                  {tab.id === "profile" && badgeNearUnlock && (
                    <span
                      style={{
                        position: "absolute",
                        top: -2,
                        right: -2,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--gold)",
                        display: "block",
                      }}
                    />
                  )}
                  {tab.id === "alerts" && unreadCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -8,
                        minWidth: 15,
                        height: 15,
                        borderRadius: 999,
                        background: "var(--accent-magenta)",
                        fontSize: 9,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 700,
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: isActive ? "#0A0A0F" : "var(--text-secondary)",
                  }}
                >
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ─── SCREEN: HOME FEED ──────────────────────────────────────────────────── */

const FEED_FILTERS = ["For You", "Cricket", "Football", "Live", "Predictions"];

function HomeFeed({
  unreadCount,
  onNavigateAlerts,
  onJoinRoom,
  onLeaderboard,
  onFanProfile,
  onToast,
  extraItems,
  showBanner,
  onDismissBanner,
  userBadge,
  rooms,
  dbPosts = [],
  onPostClick,
  onVote,
}: {
  unreadCount: number;
  onNavigateAlerts: () => void;
  onJoinRoom: (room?: any) => void;
  onLeaderboard: () => void;
  onFanProfile: () => void;
  onToast: (m: string) => void;
  extraItems: any[];
  showBanner: boolean;
  onDismissBanner: () => void;
  userBadge: string;
  rooms?: any[];
  dbPosts?: any[];
  onPostClick?: (post: any) => void;
  onVote?: (id: string, vote: "agree" | "disagree" | null) => void;
}) {
  const [filter, setFilter] = useState("For You");
  const [votes, setVotes] = useState<Record<string, boolean | null>>({});
  const [pcts, setPcts] = useState<Record<string, number>>({});

  const vote = (id: string, agree: boolean, basePercent: number, isDbPost?: boolean) => {
    const prev = votes[id];
    let nextVote: boolean | null = agree;
    if (prev === agree) {
      nextVote = null;
    }
    setVotes((v) => ({ ...v, [id]: nextVote }));
    setPcts((p) => ({
      ...p,
      [id]: clamp(basePercent + (nextVote === true ? 4 : nextVote === false ? -4 : 0), 5, 95),
    }));

    if (isDbPost && onVote) {
      onVote(id, nextVote === true ? "agree" : nextVote === false ? "disagree" : null);
    }
  };

  const mappedDbPosts = dbPosts.map((p) => {
    const agreeCount = p.agreeCount ?? 0;
    const disagreeCount = p.disagreeCount ?? 0;
    const totalVotes = agreeCount + disagreeCount;
    const agreePercent = totalVotes > 0 ? Math.round((agreeCount / totalVotes) * 100) : 50;
    return {
      id: p.postId,
      type: p.type,
      sport: p.sport || "cricket",
      fan: {
        username: p.authorUsername || "RoarUser",
        badge: p.authorBadge || "RISING_FAN",
        team: p.sport === "cricket" ? "India" : "MCFC",
      },
      text: p.text,
      agreePercent,
      fanCount: totalVotes + (p.type === "hot_take" ? 47 : 1240),
      replies: p.replyCount ?? 0,
      following: false,
      isLive: false,
      match: p.matchId || (p.type === "prediction" ? (p.sport === "cricket" ? "IND vs AUS · 3rd Test" : "ISL 2025") : undefined),
      samePredictionCount: p.type === "prediction" ? (p.agreeCount ?? 0) : undefined,
      counterCount: p.type === "prediction" ? (p.disagreeCount ?? 0) : undefined,
      isDbPost: true,
    };
  });

  const allPosts = [...mappedDbPosts, ...extraItems, ...FEED_POSTS];
  const filtered = allPosts.filter((p) => {
    if (filter === "For You") return true;
    if (filter === "Cricket") return p.sport === "cricket";
    if (filter === "Football") return p.sport === "football";
    if (filter === "Live") return p.isLive || p.type === "match_room";
    if (filter === "Predictions") return p.type === "prediction";
    return true;
  });

  const showLiveBanner = false;
  const showFootyBanner = false;

  return (
    <div className="screen-scroll">
      {/* Header */}
      <div
        className="glass-card"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          margin: "8px 12px 0",
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 20,
        }}
      >
        <h1 className="logotype" style={{ fontSize: 26 }}>
          ROAR
        </h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onLeaderboard}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            🏆
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onNavigateAlerts}
            style={{
              position: "relative",
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "none",
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            🔔
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 999,
                  background: "var(--accent-magenta)",
                  fontSize: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                }}
              >
                {unreadCount}
              </span>
            )}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onFanProfile}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <AvatarWithBadge
              username={CURRENT_USER.username}
              badge={userBadge}
              size="sm"
            />
          </motion.button>
        </div>
      </div>

      {showBanner && (
        <div
          style={{
            margin: "8px 16px",
            padding: "10px 14px",
            borderRadius: 16,
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: 12, color: "var(--text-secondary)", flex: 1 }}>
            Your feed is personalising. Make a prediction or react to a take.
          </p>
          <button
            onClick={onDismissBanner}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              marginLeft: 8,
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Filters */}
      <div
        style={{
          padding: "10px 16px",
          display: "flex",
          gap: 8,
          overflowX: "auto",
        }}
      >
        {FEED_FILTERS.map((f) => (
          <motion.button
            key={f}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(f)}
            style={{
              flexShrink: 0,
              padding: "8px 16px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              border: filter !== f ? "1px solid var(--border)" : "none",
              cursor: "pointer",
              background: filter === f ? "var(--accent-magenta)" : undefined,
              color: filter === f ? "white" : "var(--text-secondary)",
              boxShadow:
                filter === f ? "0 4px 14px rgba(233,30,140,0.35)" : undefined,
              backgroundImage:
                filter === f ? "var(--accent-gradient)" : undefined,
            }}
          >
            {f}
          </motion.button>
        ))}
      </div>

      <div
        style={{
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Original Cricket Banner */}
        {showLiveBanner && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{
              padding: 16,
              background: "linear-gradient(135deg,rgba(233,30,140,0.12),rgba(255,107,53,0.06))",
              border: "1px solid rgba(233,30,140,0.25)",
              cursor: "pointer",
            }}
            onClick={() => onJoinRoom({ roomId: "mock-cricket", name: "India vs Australia" })}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span className="live-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--live-green)", display: "inline-block" }} />
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "var(--live-green)" }}>LIVE NOW</span>
                </div>
                <p className="font-display" style={{ fontSize: 26, lineHeight: 1 }}>India vs Australia</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>3rd Test · Day 2 · Adelaide Oval</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="font-display" style={{ fontSize: 30, color: "white" }}>287/4</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>IND · 68 overs</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                onJoinRoom({ roomId: "mock-cricket", name: "India vs Australia" });
              }}
              className="btn-gradient"
              style={{ width: "100%", marginTop: 12, padding: "10px 0", borderRadius: 999, fontSize: 13, border: "none", cursor: "pointer" }}
            >
              JOIN LIVE · 1,247 fans →
            </motion.button>
          </motion.div>
        )}

        {/* Original Football Banner */}
        {showFootyBanner && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
            style={{
              padding: 16,
              background: "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(59,130,246,0.04))",
              border: "1px solid rgba(59,130,246,0.25)",
              cursor: "pointer",
            }}
            onClick={() => onJoinRoom({ roomId: "mock-football", name: "Mumbai City vs Bengaluru FC" })}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span className="live-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#60a5fa", display: "inline-block" }} />
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "#60a5fa" }}>LIVE NOW</span>
                </div>
                <p className="font-display" style={{ fontSize: 22, lineHeight: 1 }}>Mumbai City vs Bengaluru FC</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>ISL 2025 · 67' · Mumbai Football Arena</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="font-display" style={{ fontSize: 28, color: "white" }}>2 — 1</p>
                <p style={{ fontSize: 11, color: "#60a5fa" }}>MCFC lead</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                e.stopPropagation();
                onJoinRoom({ roomId: "mock-football", name: "Mumbai City vs Bengaluru FC" });
              }}
              style={{ width: "100%", marginTop: 12, padding: "10px 0", borderRadius: 999, fontSize: 13, border: "none", cursor: "pointer", background: "#3b82f6", color: "white", fontWeight: 800, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.06em" }}
            >
              JOIN LIVE · 634 fans →
            </motion.button>
          </motion.div>
        )}

        {/* Dynamic Backend-fetched Banners */}
        {rooms &&
          rooms
            .filter((r) => r.roomId !== "mock-cricket" && r.roomId !== "mock-football")
            .map((room, idx) => {
              const showThisRoom =
                filter === "Live" ||
                filter === "For You" ||
                (filter === "Cricket" && room.sport?.toLowerCase() === "cricket") ||
                (filter === "Football" && room.sport?.toLowerCase() === "football");

              if (!showThisRoom) return null;

              const isBlueStyle = room.sport?.toLowerCase() === "football" || idx % 2 === 1;
              const bg = isBlueStyle
                ? "linear-gradient(135deg,rgba(59,130,246,0.12),rgba(59,130,246,0.04))"
                : "linear-gradient(135deg,rgba(233,30,140,0.12),rgba(255,107,53,0.06))";
              const border = isBlueStyle ? "1px solid rgba(59,130,246,0.25)" : "1px solid rgba(233,30,140,0.25)";
              const btnBg = isBlueStyle ? "#3b82f6" : undefined;
              const btnClass = isBlueStyle ? undefined : "btn-gradient";
              const livePulseBg = isBlueStyle ? "#60a5fa" : "var(--live-green)";
              const liveTextCol = isBlueStyle ? "#60a5fa" : "var(--live-green)";

              return (
                <motion.div
                  key={room.roomId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card"
                  style={{
                    padding: 16,
                    background: bg,
                    border: border,
                    cursor: "pointer",
                  }}
                  onClick={() => onJoinRoom(room)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <span className="live-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: livePulseBg, display: "inline-block" }} />
                        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: liveTextCol }}>LIVE NOW</span>
                      </div>
                      <p className="font-display" style={{ fontSize: isBlueStyle ? 22 : 26, lineHeight: 1 }}>{room.name}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{room.description || "Discussion Show"}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p className="font-display" style={{ fontSize: isBlueStyle ? 28 : 30, color: "white" }}>LIVE</p>
                      <p style={{ fontSize: 11, color: isBlueStyle ? "#60a5fa" : "var(--text-muted)" }}>Active Now</p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onJoinRoom(room);
                    }}
                    className={btnClass}
                    style={{
                      width: "100%",
                      marginTop: 12,
                      padding: "10px 0",
                      borderRadius: 999,
                      fontSize: 13,
                      border: "none",
                      cursor: "pointer",
                      background: btnBg,
                      color: "white",
                      fontWeight: 800,
                      fontFamily: isBlueStyle ? "'Bebas Neue',sans-serif" : undefined,
                      letterSpacing: isBlueStyle ? "0.06em" : undefined,
                    }}
                  >
                    JOIN LIVE · {room.fanCount || 0} fans →
                  </motion.button>
                </motion.div>
              );
            })}

        {filtered.map((item, i) => {
          if (item.type === "hot_take" || item.type === "prediction") {
            const pct = pcts[item.id] ?? item.agreePercent ?? 50;
            const userVote = votes[item.id];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card"
                style={{ padding: "16px", cursor: "pointer" }}
                onClick={() => onPostClick && onPostClick(item)}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      padding: "3px 8px",
                      borderRadius: 4,
                      background:
                        item.type === "hot_take"
                          ? "rgba(239,68,68,0.12)"
                          : "rgba(255,107,53,0.12)",
                      color:
                        item.type === "hot_take"
                          ? "#f87171"
                          : "var(--accent-orange)",
                      border: `1px solid ${item.type === "hot_take" ? "rgba(239,68,68,0.2)" : "rgba(255,107,53,0.2)"}`,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.type === "hot_take" ? "🔥 Hot Take" : "📊 Prediction"}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: "3px 8px",
                      borderRadius: 4,
                      background:
                        item.sport === "cricket"
                          ? "rgba(34,197,94,0.1)"
                          : "rgba(59,130,246,0.1)",
                      color: item.sport === "cricket" ? "#22c55e" : "#60a5fa",
                      border: `1px solid ${item.sport === "cricket" ? "rgba(34,197,94,0.2)" : "rgba(59,130,246,0.2)"}`,
                      textTransform: "uppercase",
                    }}
                  >
                    {item.sport === "cricket" ? "🏏 Cricket" : "⚽ Football"}
                  </span>
                  {item.following && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 9,
                        padding: "3px 8px",
                        borderRadius: 999,
                        background: "rgba(233,30,140,0.15)",
                        color: "var(--accent-magenta)",
                      }}
                    >
                      Following
                    </span>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <AvatarWithBadge
                    username={item.fan.username}
                    badge={item.fan.badge}
                    size="sm"
                  />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13 }}>
                      {item.fan.username}
                    </p>
                    <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>
                      {BADGE_LABELS[item.fan.badge]} · {item.fan.team}
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    lineHeight: 1.5,
                    marginBottom: 12,
                  }}
                >
                  {item.text}
                </p>
                {item.match && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--accent-magenta)",
                      marginBottom: 8,
                      fontWeight: 600,
                    }}
                  >
                    {item.match}
                  </p>
                )}
                {item.type === "hot_take" && (
                  <>
                    <div style={{ marginBottom: 10 }}>
                      <SplitBar left={pct} />
                    </div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        marginBottom: 12,
                      }}
                    >
                      {fmt(item.fanCount)} fans · {item.replies} replies
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          vote(item.id, true, item.agreePercent ?? 50, item.isDbPost);
                        }}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          border: `2px solid ${userVote === true ? "var(--accent-magenta)" : "rgba(233,30,140,0.35)"}`,
                          background:
                            userVote === true
                              ? "var(--accent-magenta)"
                              : "transparent",
                          color:
                            userVote === true
                              ? "white"
                              : "var(--accent-magenta)",
                          transition: "all 0.2s",
                        }}
                      >
                        {userVote === true ? "✓ Agreed" : "Agree"}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          vote(item.id, false, item.agreePercent ?? 50, item.isDbPost);
                        }}
                        style={{
                          flex: 1,
                          padding: "10px",
                          borderRadius: 999,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          border: `2px solid ${userVote === false ? "var(--accent-orange)" : "rgba(255,107,53,0.35)"}`,
                          background:
                            userVote === false
                              ? "var(--accent-orange)"
                              : "transparent",
                          color:
                            userVote === false
                              ? "white"
                              : "var(--accent-orange)",
                          transition: "all 0.2s",
                        }}
                      >
                        {userVote === false ? "✓ Disagreed" : "Disagree"}
                      </motion.button>
                    </div>
                  </>
                )}
                {item.type === "prediction" && (
                  <div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                      {item.samePredictionCount} fans made the same prediction
                    </p>
                    {item.counterCount > 0 && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--accent-magenta)",
                          marginTop: 4,
                        }}
                      >
                        {item.counterCount} fans think otherwise →
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

/* ─── SCREEN: DISCUSSION ROOM ────────────────────────────────────────────── */

function DiscussionRoom({
  onBack,
  onToast,
  roomId,
  roomName,
}: {
  onBack: () => void;
  onToast: (m: string) => void;
  roomId?: string;
  roomName?: string;
}) {
  const [tab, setTab] = useState("Debate");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"chat" | "prediction" | "hottake">("chat");
  const [fanCount, setFanCount] = useState(312);
  const [joinToast, setJoinToast] = useState<string | null>(null);
  const [composerPre, setComposerPre] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const joinIdx = useRef(0);
  const TABS = ["Debate", "Predictions", "Hot Takes", "Post-Match 🔒"];

  const [userUsername, setUserUsername] = useState("RoarUser");
  const [userBadge, setUserBadge] = useState("RISING_FAN");
  useEffect(() => {
    try {
      setUserUsername(localStorage.getItem("roar_username") || "RoarUser");
      setUserBadge(localStorage.getItem("roar_badge") || "RISING_FAN");
    } catch {}
  }, []);

  useEffect(() => {
    const t = setInterval(() => setFanCount((c) => c + 1), 7000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      const name = JOIN_FANS[joinIdx.current % JOIN_FANS.length];
      joinIdx.current++;
      setJoinToast(`${name} joined the room`);
      setTimeout(() => setJoinToast(null), 2500);
    }, 9000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!roomId) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/roar/rooms/${roomId}/messages`);
        if (res.data?.success) {
          const mapped = res.data.messages.map((m: any) => ({
            id: m.msgId,
            fan: { username: m.authorUsername, badge: m.authorBadge },
            text: m.text,
            fireCount: m.fireCount || 0,
            nochanceCount: m.noChanceCount || 0,
            timeAgo: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: m.type,
          }));
          setPosts(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  const send = async () => {
    if (!roomId) return;
    const text = (composerPre || input).trim();
    if (!text) return;
    try {
      const res = await axios.post(`/api/roar/rooms/${roomId}/messages`, {
        text,
        type: mode,
      });
      if (res.data?.success) {
        const m = res.data.message;
        setPosts((p) => [
          {
            id: m.msgId,
            fan: { username: m.authorUsername, badge: m.authorBadge },
            text: m.text,
            fireCount: 0,
            nochanceCount: 0,
            timeAgo: "now",
            type: m.type,
          },
          ...p,
        ]);
        setInput("");
        setComposerPre("");
        setTimeout(
          () => listRef.current?.scrollTo({ top: 0, behavior: "smooth" }),
          50,
        );
      }
    } catch (err) {
      console.error(err);
      onToast("Failed to send message");
    }
  };

  const fire = async (id: string) => {
    if (!roomId) return;
    try {
      await axios.post(`/api/roar/rooms/${roomId}/messages/${id}/react`, {
        reaction: "fire",
      });
      setPosts((p) =>
        p.map((x) => (x.id === id ? { ...x, fireCount: x.fireCount + 1 } : x)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const noChance = async (id: string) => {
    if (!roomId) return;
    try {
      await axios.post(`/api/roar/rooms/${roomId}/messages/${id}/react`, {
        reaction: "noChance",
      });
      setPosts((p) =>
        p.map((x) =>
          x.id === id ? { ...x, nochanceCount: x.nochanceCount + 1 } : x,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const modeColor: Record<string, string> = {
    chat: "var(--text-primary)",
    prediction: "var(--gold)",
    hottake: "#f87171",
  };
  const modeLabel: Record<string, string> = {
    chat: "💬 Fire",
    prediction: "📊 Predict",
    hottake: "⚡ Bold Take",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Join toast */}
      <AnimatePresence>
        {joinToast && (
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            exit={{ y: -50 }}
            style={{
              position: "absolute",
              top: 8,
              left: 0,
              right: 0,
              zIndex: 40,
              padding: "0 16px",
              pointerEvents: "none",
            }}
          >
            <div
              className="glass-card"
              style={{
                padding: "8px 16px",
                textAlign: "center",
                fontSize: 13,
                border: "1px solid rgba(0,230,118,0.25)",
              }}
            >
              <span style={{ color: "var(--live-green)" }}>●</span> {joinToast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ padding: '12px 16px', background: 'rgba(14,14,20,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', flexShrink: 0, zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text-primary)' }}>←</button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p className="font-display" style={{ fontSize: 20, letterSpacing: '0.04em' }}>{roomName || "India vs Pakistan"}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 2 }}>
              <span className="live-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--live-green)', display: 'inline-block' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--live-green)' }}>LIVE</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {fmt(fanCount)} fans</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="font-display" style={{ fontSize: 22, color: 'var(--gold)' }}>287/4</p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>IND · 88 ov</p>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 4 }}>
            <span>Room Energy</span><span>{fmt(fanCount)} in room</span>
          </div>
          <div className="room-energy-bar room-energy-fast" style={{ borderRadius: 999 }} />
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 12, overflowX: 'auto' }}>
          {TABS.map(t => {
            const isLocked = t.includes("🔒");
            return (
              <button
                key={t}
                onClick={() => {
                  if (isLocked) {
                    onToast("🔒 Post-Match stats unlock when the game ends!");
                  } else {
                    setTab(t);
                  }
                }}
                style={{
                  flexShrink: 0,
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  background: tab === t ? 'var(--accent-magenta)' : 'transparent',
                  color: tab === t ? 'white' : 'var(--text-secondary)',
                  opacity: isLocked ? 0.6 : 1,
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 16px 140px",
          display: "flex",
          flexDirection: "column-reverse",
          gap: 12,
        }}
      >
        <AnimatePresence initial={false}>
          {loading ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px 0" }}>
              Loading messages...
            </div>
          ) : tab === "Post-Match" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
              <p className="font-display" style={{ fontSize: 20, color: "white" }}>
                MATCH ENDED · INDIA WON BY 6 WICKETS
              </p>
              <div
                className="glass-card"
                style={{
                  padding: 16,
                  border: "1px solid var(--correct-green)",
                  background: "rgba(0,200,83,0.05)",
                }}
              >
                <p style={{ fontWeight: 700, fontSize: 14, color: "white" }}>Kohli scores 80+</p>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "var(--correct-green)",
                    marginTop: 4,
                    display: "inline-block",
                  }}
                >
                  CORRECT
                </span>
              </div>
              <div
                className="glass-card"
                style={{
                  padding: 16,
                  border: "1px solid var(--wrong-red)",
                  background: "rgba(244,67,54,0.05)",
                }}
              >
                <p style={{ fontWeight: 700, fontSize: 14, color: "white" }}>Bumrah 5 wickets</p>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: "var(--wrong-red)",
                    marginTop: 4,
                    display: "inline-block",
                  }}
                >
                  WRONG
                </span>
              </div>
            </div>
          ) : posts.filter((p) => {
              if (tab === "Debate") return p.type === "chat" || !p.type;
              if (tab === "Predictions") return p.type === "prediction";
              if (tab === "Hot Takes") return p.type === "hottake";
              return false;
            }).length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px 0" }}>
              {tab === "Predictions"
                ? "No predictions yet. Make one to start!"
                : tab === "Hot Takes"
                ? "No hot takes yet. Share yours!"
                : "Welcome to the community chat! Type a message below to start."}
            </div>
          ) : (
            <>
              {posts
                .filter((p) => {
                  if (tab === "Debate") return p.type === "chat" || !p.type;
                  if (tab === "Predictions") return p.type === "prediction";
                  if (tab === "Hot Takes") return p.type === "hottake";
                  return false;
                })
                .map((p, i) => {
                  const bg =
                    p.type === "prediction"
                      ? "linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,215,0,0.02))"
                      : p.type === "hottake"
                        ? "linear-gradient(135deg,rgba(239,68,68,0.08),rgba(239,68,68,0.02))"
                        : undefined;
                  const border =
                    p.type === "prediction"
                      ? "1px solid rgba(255,215,0,0.18)"
                      : p.type === "hottake"
                        ? "1px solid rgba(239,68,68,0.18)"
                        : undefined;

                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22 }}
                      className="glass-card"
                      style={{ padding: 12, background: bg, border }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <AvatarWithBadge
                            username={p.fan.username}
                            badge={p.fan.badge}
                            size="sm"
                          />
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 13 }}>
                              {p.fan.username}
                            </p>
                            <p style={{ fontSize: 10, color: "var(--text-muted)" }}>
                              {BADGE_LABELS[p.fan.badge] || "Fan"} · {p.timeAgo}
                            </p>
                          </div>
                        </div>

                        {p.type !== "chat" && (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 800,
                              padding: "2px 6px",
                              borderRadius: 4,
                              background:
                                p.type === "prediction"
                                  ? "rgba(255,215,0,0.15)"
                                  : "rgba(239,68,68,0.15)",
                              color: p.type === "prediction" ? "#fbbf24" : "#f87171",
                              border:
                                p.type === "prediction"
                                  ? "1px solid rgba(255,215,0,0.25)"
                                  : "1px solid rgba(239,68,68,0.25)",
                            }}
                          >
                            {p.type === "prediction" ? "PREDICTION" : "HOT TAKE"}
                          </span>
                        )}
                      </div>

                      <p
                        style={{
                          fontSize: 14,
                          lineHeight: 1.4,
                          marginTop: 8,
                          color: modeColor[p.type] || "white",
                        }}
                      >
                        {p.text}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginTop: 10,
                          justifyContent: "flex-end",
                        }}
                      >
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => fire(p.id)}
                          style={{
                            padding: "6px 14px",
                            fontSize: 12,
                            fontWeight: 600,
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: 999,
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "var(--text-primary)",
                            cursor: "pointer",
                          }}
                        >
                          🔥 {p.fireCount}
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => noChance(p.id)}
                          style={{
                            padding: "6px 14px",
                            fontSize: 12,
                            fontWeight: 600,
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: 999,
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "var(--text-primary)",
                            cursor: "pointer",
                          }}
                        >
                          No chance {p.nochanceCount}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              {tab === "Predictions" && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setMode("prediction");
                    setComposerPre("My prediction: ");
                  }}
                  className="btn-gradient"
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: 999,
                    color: "white",
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    border: "none",
                    cursor: "pointer",
                    flexShrink: 0,
                    margin: "8px 0 16px",
                  }}
                >
                  MAKE YOUR PREDICTION
                </motion.button>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "10px 12px 14px",
          background: "rgba(14,14,20,0.92)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid var(--border)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Quick preset triggers */}
        {composerPre && (
          <div
            style={{
              position: "absolute",
              bottom: 110,
              left: 12,
              right: 12,
              padding: "8px 12px",
              borderRadius: 12,
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 30,
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: modeColor[mode],
                fontStyle: "italic",
              }}
            >
              {modeLabel[mode]} preset selected
            </p>
            <button
              onClick={() => setComposerPre("")}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Pills for mode switching */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {(["chat", "prediction", "hottake"] as const).map((m) => {
            const active = mode === m;
            const label = modeLabel[m];
            const activeColor = modeColor[m];

            let border = "1px solid var(--border)";
            let bg = "rgba(255,255,255,0.03)";
            let color = "var(--text-secondary)";

            if (active) {
              bg = m === "prediction"
                ? "rgba(255,215,0,0.1)"
                : m === "hottake"
                  ? "rgba(239,68,68,0.1)"
                  : "rgba(255,255,255,0.1)";
              border = m === "prediction"
                ? "1px solid rgba(255,215,0,0.3)"
                : m === "hottake"
                  ? "1px solid rgba(239,68,68,0.3)"
                  : "1px solid rgba(255,255,255,0.3)";
              color = activeColor;
            }

            return (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  if (m === "prediction") {
                    setComposerPre("My prediction: ");
                  } else {
                    setComposerPre("");
                  }
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                  border,
                  background: bg,
                  color,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "all 0.2s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Input Row */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <AvatarWithBadge
            username={userUsername}
            badge={userBadge}
            size="sm"
          />

          <div
            style={{
              flex: 1,
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Drop your take..."
              value={composerPre || input}
              onChange={(e) => {
                if (composerPre) {
                  setComposerPre(e.target.value);
                } else {
                  setInput(e.target.value);
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && send()}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 22,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                paddingLeft: 16,
                paddingRight: 16,
                color: "white",
                fontSize: 14,
                outline: "none",
              }}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={send}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--accent-magenta)",
              backgroundImage: "var(--accent-gradient)",
              border: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            ↑
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ─── SCREEN: NOTIFICATIONS ──────────────────────────────────────────────── */

const NOTIF_FILTERS = ["All", "Predictions", "Challenges", "Badges", "Match"];
const TYPE_STYLES: Record<string, any> = {
  PREDICTION_OK: {
    color: "var(--correct-green)",
    label: "PREDICTION ✓",
    pulse: false,
  },
  PREDICTION_FAIL: {
    color: "var(--wrong-red)",
    label: "PREDICTION ✗",
    pulse: false,
  },
  CHALLENGE: {
    color: "var(--accent-magenta)",
    label: "CHALLENGE",
    pulse: false,
  },
  HEATING_UP: {
    color: "var(--accent-orange)",
    label: "HEATING UP",
    pulse: false,
  },
  MATCH_LIVE: { color: "var(--live-green)", label: "MATCH LIVE", pulse: true },
  BADGE: { color: "var(--gold)", label: "BADGE", pulse: false },
  RIVAL: { color: "var(--accent-magenta)", label: "RIVAL", pulse: false },
  FAN_OF_WEEK: { color: "var(--gold)", label: "FAN OF WEEK", pulse: false },
  WEEKLY: { color: "#9C27B0", label: "BOLD CALL", pulse: false },
};

function Notifications({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onCompose,
  onJoinRoom,
  onNavigateTab,
  rooms = [],
}: {
  notifications: any[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onCompose: () => void;
  onJoinRoom: (room?: any) => void;
  onNavigateTab: (tab: string) => void;
  rooms?: any[];
}) {
  const [filter, setFilter] = useState("All");

  const unread = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Predictions") return n.type.includes("PREDICTION");
    if (filter === "Challenges")
      return n.type === "CHALLENGE" || n.type === "RIVAL";
    if (filter === "Badges")
      return n.type === "BADGE" || n.type === "FAN_OF_WEEK";
    if (filter === "Match")
      return n.type === "MATCH_LIVE" || n.type === "HEATING_UP";
    return true;
  });

  const findRoomForNotification = (n: any) => {
    if (!rooms || rooms.length === 0) return null;
    const matchText = `${n.title} ${n.subtitle}`.toLowerCase();
    
    // Find room name mentioned in the notification
    const matchedRoom = rooms.find(room => 
      matchText.includes(room.name.toLowerCase()) ||
      room.name.toLowerCase().includes("india") ||
      room.name.toLowerCase().includes("australia")
    );
    
    return matchedRoom || rooms[0];
  };

  return (
    <div className="screen-scroll">
      <div
        style={{
          padding: "16px 16px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1
            className="font-display"
            style={{ fontSize: 40, letterSpacing: "0.04em" }}
          >
            Alerts
          </h1>
          {unread > 0 && (
            <span
              style={{
                display: "inline-block",
                marginTop: 4,
                padding: "2px 10px",
                borderRadius: 999,
                background: "var(--accent-magenta)",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {unread} unread
            </span>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onMarkAllRead}
          style={{
            fontSize: 12,
            color: "var(--accent-magenta)",
            background: "none",
            border: "none",
            cursor: "pointer",
            marginTop: 8,
            fontWeight: 700,
          }}
        >
          Mark all read
        </motion.button>
      </div>
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          gap: 8,
          overflowX: "auto",
        }}
      >
        {NOTIF_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flexShrink: 0,
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              background:
                filter === f ? "var(--accent-magenta)" : "var(--bg-tertiary)",
              color: filter === f ? "white" : "var(--text-secondary)",
              boxShadow:
                filter === f ? "0 4px 14px rgba(233,30,140,0.35)" : undefined,
            }}
          >
            {f}
          </button>
        ))}
      </div>
      <div
        style={{
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <AnimatePresence>
          {filtered.map((n, i) => {
            const style = TYPE_STYLES[n.type] || TYPE_STYLES.CHALLENGE;
            const targetRoom = findRoomForNotification(n);
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => {
                  onMarkRead(n.id);
                  if (n.type === "MATCH_LIVE" || n.type === "HEATING_UP") {
                    onJoinRoom(targetRoom);
                    return;
                  }
                  if (n.type === "CHALLENGE") {
                    onCompose();
                    return;
                  }
                  if (
                    n.type.includes("PREDICTION") ||
                    n.type === "BADGE" ||
                    n.type === "FAN_OF_WEEK"
                  ) {
                    onNavigateTab("profile");
                    return;
                  }
                  onNavigateTab("home");
                }}
                style={{
                  position: "relative",
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 24,
                  textAlign: "left",
                  cursor: "pointer",
                  background: n.read
                    ? "rgba(14,14,20,0.9)"
                    : "rgba(22,22,31,0.95)",
                  border: `1px solid var(--border)`,
                  borderLeft: `3px solid ${n.read ? "var(--border)" : style.color}`,
                  transition: "background 0.2s",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: 999,
                    background: `${style.color}22`,
                    color: style.color,
                    letterSpacing: "0.06em",
                  }}
                >
                  {style.pulse && (
                    <span
                      className="live-pulse"
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--live-green)",
                        marginRight: 4,
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                  {style.label}
                </span>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 10,
                    alignItems: "flex-start",
                  }}
                >
                  {n.fan && (
                    <div style={{ flexShrink: 0 }}>
                      <AvatarWithBadge
                        username={n.fan.username}
                        badge={n.fan.badge}
                        size="sm"
                      />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "white",
                        lineHeight: 1.4,
                      }}
                    >
                      {n.title}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-secondary)",
                        marginTop: 4,
                      }}
                    >
                      {n.subtitle}
                    </p>
                    {n.cta && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (n.type.includes("PREDICTION"))
                            onNavigateTab("profile");
                          else onCompose();
                        }}
                        style={{
                          marginTop: 6,
                          fontSize: 12,
                          color: "var(--accent-magenta)",
                          fontWeight: 700,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {n.cta} →
                      </button>
                    )}
                    {n.type === "MATCH_LIVE" && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onJoinRoom(targetRoom);
                        }}
                        className="btn-gradient"
                        style={{
                          marginTop: 8,
                          padding: "6px 16px",
                          borderRadius: 999,
                          fontSize: 12,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Join the room →
                      </motion.button>
                    )}
                  </div>
                </div>
                <p
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    fontSize: 11,
                    color: "var(--text-muted)",
                  }}
                >
                  {n.time}
                </p>
                {!n.read && (
                  <span
                    style={{
                      position: "absolute",
                      top: 14,
                      right: 14,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--accent-magenta)",
                      display: "block",
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── SCREEN: LEADERBOARD ────────────────────────────────────────────────── */

const LB_TABS = ["All Time", "This Month", "Cricket", "Football"];

function Leaderboard({
  onBack,
  onCompose,
}: {
  onBack: () => void;
  onCompose: () => void;
}) {
  const [tab, setTab] = useState("All Time");
  const list = LEADERBOARD_DATA;
  const podium = list.slice(0, 3);
  const podiumOrder = [podium[1], podium[0], podium[2]];
  const RANK_COLOR = ["#C0C0C0", "#FFB800", "#CD7F32"];

  return (
    <div className="screen-scroll">
      <div
        style={{
          padding: "16px 16px 0",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={onBack}
          style={{
            fontSize: 22,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-primary)",
          }}
        >
          ←
        </button>
        <h1
          className="font-display"
          style={{ fontSize: 40, letterSpacing: "0.04em" }}
        >
          Leaderboards
        </h1>
      </div>
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          gap: 8,
          overflowX: "auto",
        }}
      >
        {LB_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flexShrink: 0,
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              background:
                tab === t ? "var(--accent-magenta)" : "var(--bg-tertiary)",
              color: tab === t ? "white" : "var(--text-secondary)",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 8,
          padding: "24px 16px 16px",
        }}
      >
        {podiumOrder.map(
          (fan, i) =>
            fan && (
              <motion.div
                key={fan.username}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                style={{ textAlign: "center", flex: i === 1 ? 1.2 : 1 }}
              >
                <AvatarWithBadge
                  username={fan.username}
                  badge={fan.badge}
                  size={i === 1 ? "lg" : "md"}
                />
                <p
                  className="font-display"
                  style={{
                    fontSize: 13,
                    marginTop: 8,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 90,
                    margin: "8px auto 0",
                  }}
                >
                  {fan.username.split("_")[0]}
                </p>
                <p
                  className="font-display"
                  style={{
                    fontSize: 22,
                    color: RANK_COLOR[i === 1 ? 1 : i === 0 ? 0 : 2],
                  }}
                >
                  {fan.accuracy}%
                </p>
              </motion.div>
            ),
        )}
      </div>
      <div
        style={{
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {list.map((fan, i) => {
          const isYou = fan.username === CURRENT_USER.username;
          const accColor =
            fan.accuracy >= 70
              ? "var(--correct-green)"
              : fan.accuracy >= 60
                ? "var(--pending-amber)"
                : "var(--text-muted)";
          return (
            <motion.div
              key={fan.username}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 20,
                background: "var(--bg-secondary)",
                border: `1px solid ${isYou ? "var(--accent-magenta)" : "var(--border)"}`,
                borderLeft: isYou
                  ? "4px solid var(--accent-magenta)"
                  : undefined,
              }}
            >
              <span
                className="font-display"
                style={{
                  fontSize: 24,
                  width: 32,
                  textAlign: "center",
                  color:
                    ["#FFB800", "#C0C0C0", "#CD7F32"][fan.rank - 1] ||
                    "var(--text-muted)",
                  flexShrink: 0,
                }}
              >
                {fan.rank}
              </span>
              <AvatarWithBadge
                username={fan.username}
                badge={fan.badge}
                size="sm"
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {fan.username}
                  {isYou && (
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: 10,
                        color: "var(--accent-magenta)",
                      }}
                    >
                      You
                    </span>
                  )}
                </p>
                <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>
                  {BADGE_LABELS[fan.badge]} · {fan.team}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p
                  className="font-display"
                  style={{ fontSize: 22, color: accColor }}
                >
                  {fan.accuracy}%
                </p>
                <p style={{ fontSize: 10, color: "var(--text-muted)" }}>
                  {fan.predictions} calls
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
      {CURRENT_USER.rank > 10 && (
        <div style={{ position: "sticky", bottom: 0, padding: "12px 16px" }}>
          <div
            className="glass-card"
            style={{
              padding: "14px 16px",
              borderLeft: "4px solid var(--accent-magenta)",
            }}
          >
            <p style={{ fontSize: 13 }}>
              You're ranked #{CURRENT_USER.rank} · {CURRENT_USER.accuracy}%
              accuracy · {23 - 10} spots from top 10
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onCompose}
              className="btn-gradient"
              style={{
                marginTop: 10,
                width: "100%",
                padding: "10px",
                borderRadius: 999,
                fontSize: 13,
                border: "none",
                cursor: "pointer",
              }}
            >
              Make a prediction →
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── SCREEN: PROFILE ────────────────────────────────────────────────────── */

function AccuracyRing({ percent }: { percent: number }) {
  const size = 88,
    stroke = 7,
    r = (size - stroke) / 4,
    circ = 2 * Math.PI * r;
  const [off, setOff] = useState(circ);
  useEffect(() => {
    const t = setTimeout(() => setOff(circ - (percent / 100) * circ), 200);
    return () => clearTimeout(t);
  }, [circ, percent]);
  return (
    <svg width={size} height={size}>
      <defs>
        <linearGradient id="acc-g-roar">
          <stop offset="0%" stopColor="#E91E8C" />
          <stop offset="100%" stopColor="#FF6B35" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2 - 18}
        cy={size / 2 - 18}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2 + 18}
        cy={size / 2 - 18}
        r={r}
        fill="none"
        stroke="url(#acc-g-roar)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1s" }}
      />
    </svg>
  );
}

function Profile({
  userBadge,
  setUserBadge,
  onCompose,
  onToast,
  setOnboarded,
}: {
  userBadge: string;
  setUserBadge: (b: string) => void;
  onCompose: () => void;
  onToast: (m: string) => void;
  setOnboarded?: (b: boolean) => void;
}) {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [predTab, setPredTab] = useState("All");
  const [badgeModal, setBadgeModal] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [rivalFollowed, setRivalFollowed] = useState(false);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/roar/profile");
        if (res.data?.success) {
          setProfileData(res.data);
          if (res.data.user?.badge) {
            setUserBadge(res.data.user.badge);
          }
          if (res.data.user?.username) {
            setEditName(res.data.user.username);
          }
        }
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 404) {
          try {
            localStorage.removeItem("roar_v2_complete");
          } catch {}
          setOnboarded?.(false);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setUserBadge, setOnboarded]);

  if (loading || !profileData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
        Loading profile...
      </div>
    );
  }

  const user = profileData.user || CURRENT_USER;
  const badges = profileData.badges && profileData.badges.length > 0 ? profileData.badges : BADGES_LIST;
  const predictions = profileData.predictions || [];
  const hotTakes = profileData.hotTakes || [];
  const rival = profileData.rival || RIVAL;

  const filteredPreds = predictions.filter(
    (p: any) => predTab === "All" || p.status?.toUpperCase() === predTab.toUpperCase() || (predTab === "Correct" && (p.status === "settled_correct" || p.status === "CORRECT")) || (predTab === "Wrong" && (p.status === "settled_wrong" || p.status === "WRONG")) || (predTab === "Pending" && (p.status === "active" || p.status === "PENDING"))
  );
  const unlocked = badges.filter((b: any) => b.unlocked).length;

  return (
    <div className="screen-scroll">
      {/* Top Header Section */}
      <div style={{ padding: "24px 16px 0", textAlign: "center", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "center", position: "relative", width: 96, margin: "0 auto" }}>
          <AvatarWithBadge
            username={user.username || CURRENT_USER.username}
            badge={userBadge}
            size="lg"
          />
          {/* Plus icon on Avatar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 4,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "var(--accent-magenta)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--bg-primary)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 900,
              cursor: "pointer"
            }}
            onClick={() => onToast("Upload avatar feature coming soon!")}
          >
            +
          </div>
        </div>
        <h1
          className="font-display"
          style={{ fontSize: 32, letterSpacing: "0.04em", marginTop: 14, color: "#fff" }}
        >
          {user.username ? user.username.toUpperCase() : "ROARFAN"}
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
          @{user.handle || CURRENT_USER.handle}
        </p>
        <p
          style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}
        >
          Fan since {user.fanSince || CURRENT_USER.fanSince} · {user.yearsFandom || CURRENT_USER.yearsFandom || 1} years ·{" "}
          {BADGE_LABELS[userBadge]}
        </p>

        {/* 3 dots/circles underneath */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-magenta)" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--teal)" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-orange)" }} />
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <button
            onClick={() => setEditOpen(true)}
            style={{
              flex: 1,
              maxWidth: 140,
              padding: "10px 0",
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 24,
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setShareOpen(true)}
            className="btn-gradient"
            style={{
              flex: 1,
              maxWidth: 140,
              padding: "10px 0",
              border: "none",
              borderRadius: 24,
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Share Profile
          </button>
        </div>
      </div>

      {/* Stats Cards (4 items in 1 row) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: "20px 16px 0" }}>
        {/* 1st block: Accuracy Ring */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 4px", minHeight: 74 }}>
          <AccuracyRing percent={user.accuracy || 0} size={50} stroke={4} />
        </div>
        {/* 2nd block: Predictions */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 4px", minHeight: 74, textAlign: "center" }}>
          <span className="font-display" style={{ fontSize: 22, color: "#fff", lineHeight: 1 }}>{user.predictionCount || 0}</span>
          <span style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 4 }}>Predictions</span>
        </div>
        {/* 3rd block: Hot Takes */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 4px", minHeight: 74, textAlign: "center" }}>
          <span className="font-display" style={{ fontSize: 22, color: "#fff", lineHeight: 1 }}>{user.hotTakeCount || 0}</span>
          <span style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 4 }}>Hot Takes</span>
        </div>
        {/* 4th block: Rep */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 4px", minHeight: 74, textAlign: "center" }}>
          <span className="font-display" style={{ fontSize: 22, color: "#fff", lineHeight: 1 }}>{fmt(user.reputationScore || 0)}</span>
          <span style={{ fontSize: 9, color: "var(--text-muted)", marginTop: 4 }}>Rep</span>
        </div>
      </div>

      {/* Rival Card */}
      <div style={{ padding: "24px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 18, color: "var(--accent-magenta)", letterSpacing: "0.05em" }}>
            YOUR RIVAL THIS MONTH
          </h3>
          <span style={{ fontSize: 11, color: "var(--accent-magenta)", fontWeight: 600, cursor: "pointer" }} onClick={() => onToast("Feature coming soon!")}>
            See Fan Match →
          </span>
        </div>

        <div className="gradient-border" style={{ padding: 16, background: "rgba(22, 22, 31, 0.6)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <AvatarWithBadge
                username={rival.fan?.username || RIVAL.fan.username}
                badge={rival.badge || RIVAL.badge}
                size="md"
              />
            </div>
            <div>
              <h4 className="font-display" style={{ fontSize: 16, color: "#fff", letterSpacing: "0.03em" }}>
                {(rival.fan?.username || RIVAL.fan.username).toUpperCase()} · {BADGE_LABELS[rival.badge || RIVAL.badge]?.toUpperCase()}
              </h4>
              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>
                  <strong style={{ color: "#fff" }}>{rival.disagreements || RIVAL.disagreements}</strong> DISAGREEMENTS
                </span>
                <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>
                  They won: <strong style={{ color: "var(--wrong-red)" }}>{rival.rivalWins || RIVAL.rivalWins}</strong>
                </span>
                <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>
                  You won: <strong style={{ color: "var(--correct-green)" }}>{rival.yourWins || RIVAL.yourWins}</strong>
                </span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 12, fontStyle: "italic", lineHeight: 1.4, paddingLeft: 8, borderLeft: "2px solid var(--accent-magenta)" }}>
            {rival.topDisagreement || RIVAL.topDisagreement}
          </p>

          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              onClick={() => setRivalFollowed(!rivalFollowed)}
              className="btn-pill"
              style={{
                flex: 1,
                padding: "8px 0",
                fontSize: 12,
                fontWeight: 700,
                border: "1px solid var(--border)",
                background: rivalFollowed ? "rgba(255,255,255,0.08)" : "none",
                color: "#fff",
                borderRadius: 20,
                cursor: "pointer"
              }}
            >
              {rivalFollowed ? "✓ Following" : "Follow Rival"}
            </button>
            <button
              onClick={() => onToast("Challenged rival to a prediction duel!")}
              className="btn-gradient"
              style={{
                flex: 1,
                padding: "8px 0",
                fontSize: 12,
                borderRadius: 20,
                border: "none",
                cursor: "pointer"
              }}
            >
              CHALLENGE →
            </button>
          </div>
        </div>
      </div>

      {/* Badges Hexagonal Layout */}
      <div style={{ padding: "24px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 18, color: "#fff", letterSpacing: "0.03em" }}>
            YOUR BADGES <span style={{ color: "var(--text-muted)" }}>{unlocked}/{badges.length}</span>
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, padding: "4px 8px" }}>
          {badges.map((b: any) => {
            const cfg = BADGE_CONFIG[b.badgeId] || BADGE_CONFIG.RISING_FAN;
            const isUnlocked = b.unlocked;
            return (
              <div
                key={b.badgeId}
                onClick={() => setBadgeModal(b)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  opacity: isUnlocked ? 1 : 0.4
                }}
              >
                {/* Hexagon icon */}
                <div
                  style={{
                    position: "relative",
                    width: 68,
                    height: 76,
                    background: isUnlocked ? cfg.color || "var(--accent-gradient)" : "rgba(255,255,255,0.06)",
                    clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: isUnlocked ? "0 4px 12px rgba(0,0,0,0.3)" : "none"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 2,
                      background: isUnlocked ? "none" : "var(--bg-primary)",
                      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28
                    }}
                  >
                    {cfg.icon}
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", marginTop: 8, textAlign: "center" }}>
                  {cfg.name?.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calls Section */}
      <div style={{ padding: "24px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 className="font-display" style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>
            YOUR CALLS
          </h3>
          <span style={{ fontSize: 11, color: "var(--live-green)", fontWeight: 700 }}>
            {user.accuracy || 0}% accurate
          </span>
        </div>

        {/* Filter buttons */}
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10 }}>
          {["All", "Correct", "Wrong", "Pending"].map((t) => {
            const active = predTab === t;
            return (
              <button
                key={t}
                onClick={() => setPredTab(t)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  border: active ? "none" : "1px solid var(--border)",
                  background: active ? "var(--accent-gradient)" : "rgba(255,255,255,0.03)",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Calls Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredPreds.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)", fontSize: 13 }}>
              No calls found.
            </p>
          ) : (
            filteredPreds.map((p: any) => {
              const isCorrect = p.status === "CORRECT" || p.status === "settled_correct";
              const isWrong = p.status === "WRONG" || p.status === "settled_wrong";
              const isPending = !isCorrect && !isWrong;

              const statusText = isCorrect ? "CORRECT" : isWrong ? "WRONG" : "PENDING";
              const statusColor = isCorrect
                ? "var(--correct-green)"
                : isWrong
                  ? "var(--wrong-red)"
                  : "var(--pending-amber)";

              return (
                <div
                  key={p.id || p.postId}
                  className="glass-card"
                  style={{
                    padding: 14,
                    background: "rgba(22, 22, 31, 0.4)",
                    border: "1px solid rgba(255,255,255,0.03)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>
                      {p.matchId || "GENERAL"}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 900,
                        color: statusColor,
                        background: `${statusColor}18`,
                        padding: "2px 6px",
                        borderRadius: 4
                      }}
                    >
                      {statusText}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: "#fff", lineHeight: 1.4 }}>
                    {p.text}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                    <span style={{ fontSize: 10, color: "var(--text-muted)" }}>
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Today"}
                    </span>
                    <button
                      onClick={() => onToast("Shared call legacy link!")}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 10, cursor: "pointer", textDecoration: "underline" }}
                    >
                      Share
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Takes Section */}
      <div style={{ padding: "24px 16px 80px" }}>
        <h3 className="font-display" style={{ fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 12 }}>
          YOUR TAKES
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {hotTakes.length === 0 ? (
            <p style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)", fontSize: 13 }}>
              No hot takes created.
            </p>
          ) : (
            hotTakes.map((ht: any) => {
              const agree = ht.agreeCount || 0;
              const disagree = ht.disagreeCount || 0;
              const total = agree + disagree || 1;
              const agreePct = Math.round((agree / total) * 100) || 50;
              const disagreePct = 100 - agreePct;

              return (
                <div
                  key={ht.id || ht.postId}
                  className="glass-card"
                  style={{
                    padding: 14,
                    background: "rgba(22, 22, 31, 0.4)",
                    border: "1px solid rgba(255,255,255,0.03)"
                  }}
                >
                  <p style={{ fontSize: 14, color: "#fff", lineHeight: 1.4, marginBottom: 10 }}>
                    {ht.text}
                  </p>
                  
                  {/* Percentage bar */}
                  <div style={{ position: "relative", width: "100%", height: 16, background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${agreePct}%`, background: "var(--accent-gradient)", transition: "width 1s" }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px", fontSize: 9, fontWeight: 700, color: "#fff" }}>
                      <span>{agreePct}% Agree</span>
                      <span>{disagreePct}% Disagree</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 110,
              background: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card animate-glow"
              style={{
                width: "100%",
                maxWidth: 320,
                padding: 20,
                background: "var(--bg-secondary)",
              }}
            >
              <h3
                className="font-display"
                style={{ fontSize: 24, marginBottom: 16 }}
              >
                EDIT PROFILE
              </h3>
              <label
                style={{
                  fontSize: 11,
                  color: "var(--text-secondary)",
                  fontWeight: 700,
                }}
              >
                DISPLAY NAME
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{
                  width: "100%",
                  height: 40,
                  borderRadius: 10,
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  padding: "0 12px",
                  color: "white",
                  fontSize: 14,
                  marginTop: 6,
                  marginBottom: 16,
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setEditOpen(false)}
                  className="btn-pill"
                  style={{ flex: 1, padding: "10px 0" }}
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await axios.patch("/api/roar/profile", { username: editName });
                      setEditOpen(false);
                      onToast("Profile updated successfully");
                    } catch (err) {
                      console.error(err);
                      onToast("Failed to update profile");
                    }
                  }}
                  className="btn-gradient"
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Legacy Modal */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShareOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 110,
              background: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card animate-glow"
              style={{
                width: "100%",
                maxWidth: 300,
                padding: 24,
                textAlign: "center",
                background: "var(--bg-secondary)",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  background: "rgba(0,230,118,0.1)",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--live-green)",
                  fontSize: 24,
                  marginBottom: 14,
                }}
              >
                ✓
              </div>
              <h3
                className="font-display"
                style={{ fontSize: 24, marginBottom: 8 }}
              >
                LEGACY SHARE LINK
              </h3>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  lineHeight: 1.4,
                  marginBottom: 16,
                }}
              >
                Share your prediction accuracy and unlocked legacy badges with the sportsfan community!
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShareOpen(false);
                  onToast("Link copied to clipboard!");
                }}
                className="btn-gradient"
                style={{
                  width: "100%",
                  padding: "12px 0",
                  border: "none",
                  borderRadius: 12,
                  cursor: "pointer",
                }}
              >
                Copy Link
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Progress detail Modal */}
      <AnimatePresence>
        {badgeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBadgeModal(null)}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 110,
              background: "rgba(0,0,0,0.85)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card animate-glow"
              style={{
                width: "100%",
                maxWidth: 300,
                padding: 20,
                textAlign: "center",
                background: "var(--bg-secondary)",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>
                {BADGE_CONFIG[badgeModal.badgeId]?.icon}
              </div>
              <h3
                className="font-display"
                style={{ fontSize: 26, marginBottom: 4 }}
              >
                {BADGE_CONFIG[badgeModal.badgeId]?.name}
              </h3>
              <p
                style={{
                  fontSize: 10,
                  color: "var(--accent-magenta)",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                {badgeModal.unlocked ? "UNLOCKED" : "LOCKED"}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  marginTop: 10,
                  lineHeight: 1.4,
                }}
              >
                {BADGE_CONFIG[badgeModal.badgeId]?.sub || "Unlock by building your legacy!"}
              </p>
              <div
                style={{
                  height: 6,
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 3,
                  margin: "16px 0 6px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${badgeModal.progress}%`,
                    background: "var(--accent-magenta)",
                  }}
                />
              </div>
              <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Progress: {badgeModal.progress}%
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── COMPONENT: POST DETAILS OVERLAY (Reddit Style) ────────────────────── */

function PostDetailsOverlay({
  post,
  onClose,
  onToast,
  onVote,
}: {
  post: any;
  onClose: () => void;
  onToast: (m: string) => void;
  onVote: (id: string, vote: "agree" | "disagree" | null) => void;
}) {
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [userUsername, setUserUsername] = useState("RoarUser");
  const [userBadge, setUserBadge] = useState("RISING_FAN");
  const [votes, setVotes] = useState<Record<string, boolean | null>>({});
  const [pct, setPct] = useState(post.agreePercent ?? 50);

  useEffect(() => {
    try {
      setUserUsername(localStorage.getItem("roar_username") || "RoarUser");
      setUserBadge(localStorage.getItem("roar_badge") || "RISING_FAN");
    } catch {}
  }, []);

  const fetchComments = useCallback(async () => {
    if (!post?.id) return;
    try {
      if (!post.isDbPost) {
        setComments([
          {
            commentId: "c1",
            authorUsername: "KolkataKnight07",
            authorBadge: "CRICKET_HEAD",
            text: "IPL crowds are great, but nothing matches the tension of a bilateral series in Test cricket. Five days of tactical battle > 4 hours of cheerleaders.",
            heartCount: 50,
            createdAt: Date.now() - 14400000,
          },
          {
            commentId: "c2",
            authorUsername: "NagpurNight",
            authorBadge: "ORACLE",
            text: "@KolkataKnight07 Unpopular but 100% correct. Test cricket is where reputations are truly made.",
            heartCount: 16,
            createdAt: Date.now() - 10800000,
          },
        ]);
        return;
      }
      const res = await axios.get(`/api/roar/posts/${post.id}/comments`);
      if (res.data?.success) {
        setComments(res.data.comments);
      }
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  }, [post]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const submitComment = async () => {
    if (!commentText.trim()) return;
    try {
      setLoading(true);
      if (!post.isDbPost) {
        setComments((prev) => [
          ...prev,
          {
            commentId: `c-${Date.now()}`,
            authorUsername: userUsername,
            authorBadge: userBadge,
            text: commentText.trim(),
            heartCount: 0,
            createdAt: Date.now(),
          },
        ]);
        setCommentText("");
        onToast("Comment posted!");
        return;
      }

      const res = await axios.post(`/api/roar/posts/${post.id}/comments`, {
        text: commentText.trim(),
      });
      if (res.data?.success) {
        setCommentText("");
        fetchComments();
        onToast("Comment posted successfully!");
      }
    } catch (err) {
      console.error("Failed to submit comment:", err);
      onToast("Error posting comment");
    } finally {
      setLoading(false);
    }
  };

  const reactToComment = async (commentId: string) => {
    try {
      if (!post.isDbPost) {
        setComments((prev) =>
          prev.map((c) =>
            c.commentId === commentId ? { ...c, heartCount: c.heartCount + 1 } : c
          )
        );
        return;
      }
      const res = await axios.post(`/api/roar/posts/${post.id}/comments/${commentId}/react`);
      if (res.data?.success) {
        setComments((prev) =>
          prev.map((c) =>
            c.commentId === commentId ? { ...c, heartCount: res.data.heartCount } : c
          )
        );
      }
    } catch (err) {
      console.error("Failed to react to comment:", err);
    }
  };

  const userVote = votes[post.id];
  const handleVoteClick = (agree: boolean) => {
    const prev = votes[post.id];
    let nextVote: boolean | null = agree;
    if (prev === agree) {
      nextVote = null;
    }
    setVotes((v) => ({ ...v, [post.id]: nextVote }));
    setPct(post.agreePercent + (nextVote === true ? 4 : nextVote === false ? -4 : 0));
    onVote(post.id, nextVote === true ? "agree" : nextVote === false ? "disagree" : null);
  };

  // Truncate text for header title
  const headerTitle = post.text.length > 40 ? post.text.slice(0, 40) + "..." : post.text;

  return (
    <AnimatePresence>
      <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", background: "var(--bg-primary)" }}>
        {/* Header (Matching Screenshot 2) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            background: "rgba(5, 5, 8, 0.95)",
            backdropFilter: "blur(10px)",
            zIndex: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            ←
          </button>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            <h2
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "white",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {headerTitle}
            </h2>
            <p style={{ fontSize: 9, color: "var(--text-secondary)", margin: "2px 0 0" }}>
              Posted by {post.fan?.username || post.authorUsername} • {post.timeAgo || "2h ago"} • {comments.length} comments
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", background: "linear-gradient(to bottom, #050508, #0b0b12)" }}>
          {/* Main Post Card */}
          <div
            className="glass-card"
            style={{
              padding: "16px",
              marginBottom: 20,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <AvatarWithBadge username={post.fan?.username || post.authorUsername} badge={post.fan?.badge || post.authorBadge} size="sm" />
              <div>
                <p style={{ fontWeight: 700, fontSize: 13, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                  {post.fan?.username || post.authorUsername}
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00E676", display: "inline-block" }} />
                </p>
                <p style={{ fontSize: 10, color: "var(--text-secondary)", margin: 0 }}>
                  {post.timeAgo || "2h ago"}
                </p>
              </div>
            </div>

            <p style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.5, marginBottom: 12, color: "white" }}>
              {post.text}
            </p>

            {post.type === "hot_take" && (
              <>
                <div style={{ marginBottom: 10 }}>
                  <SplitBar left={pct} />
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    onClick={() => handleVoteClick(true)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      border: `2px solid ${userVote === true ? "var(--accent-magenta)" : "rgba(233,30,140,0.35)"}`,
                      background: userVote === true ? "var(--accent-magenta)" : "transparent",
                      color: userVote === true ? "white" : "var(--accent-magenta)",
                      transition: "all 0.2s",
                    }}
                  >
                    Agree
                  </button>
                  <button
                    onClick={() => handleVoteClick(false)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      border: `2px solid ${userVote === false ? "var(--accent-orange)" : "rgba(255,107,53,0.35)"}`,
                      background: userVote === false ? "var(--accent-orange)" : "transparent",
                      color: userVote === false ? "white" : "var(--accent-orange)",
                      transition: "all 0.2s",
                    }}
                  >
                    Disagree
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Comments Heading Section (Matching Screenshot 2) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "white", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Comments
            </span>
            <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>
              {comments.length} total responses
            </span>
          </div>

          {/* Comments List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 80 }}>
            {comments.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>
                No comments yet. Be the first to share your opinion!
              </p>
            ) : (
              comments.map((comment) => {
                const isReply = comment.text.trim().startsWith("@");
                // Clean text for presentation (optional, but keep it original)
                return (
                  <div
                    key={comment.commentId}
                    style={{
                      position: "relative",
                      marginLeft: isReply ? 24 : 0,
                      padding: "12px 14px",
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    {/* Thread connector line for nested replies */}
                    {isReply && (
                      <div
                        style={{
                          position: "absolute",
                          left: -14,
                          top: -12,
                          bottom: "50%",
                          width: 12,
                          borderLeft: "1.5px solid rgba(255,255,255,0.12)",
                          borderBottom: "1.5px solid rgba(255,255,255,0.12)",
                          borderRadius: "0 0 0 8px",
                          pointerEvents: "none",
                        }}
                      />
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <AvatarWithBadge username={comment.authorUsername} badge={comment.authorBadge} size="sm" />
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 12, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                            {comment.authorUsername}
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#E91E8C", display: "inline-block" }} />
                          </p>
                        </div>
                      </div>
                      <span style={{ fontSize: 9, color: "var(--text-muted)" }}>
                        {comment.createdAt ? "4h ago" : "Just now"}
                      </span>
                    </div>

                    <p style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.4, margin: "4px 0" }}>
                      {comment.text}
                    </p>

                    <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 4 }}>
                      <button
                        onClick={() => reactToComment(comment.commentId)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                          color: comment.heartCount > 0 ? "white" : "var(--text-muted)",
                          padding: 0,
                          transition: "all 0.2s",
                        }}
                      >
                        🤍 {comment.heartCount ?? 0}
                      </button>
                      <button
                        onClick={() => {
                          setCommentText(`@${comment.authorUsername} `);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 11,
                          color: "var(--text-muted)",
                          fontWeight: 600,
                          padding: 0,
                        }}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Composer (Matching Screenshot 2) */}
        <div
          style={{
            padding: "12px 20px 24px",
            background: "rgba(5, 5, 8, 0.95)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: 10,
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <AvatarWithBadge username={userUsername} badge={userBadge} size="sm" />
          <input
            type="text"
            placeholder="Share your opinion.."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && submitComment()}
            style={{
              flex: 1,
              height: 40,
              borderRadius: 20,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              paddingLeft: 16,
              paddingRight: 16,
              color: "white",
              fontSize: 13,
              outline: "none",
            }}
          />
          <button
            onClick={submitComment}
            disabled={loading || !commentText.trim()}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "var(--accent-magenta)",
              border: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              opacity: commentText.trim() ? 1 : 0.5,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </AnimatePresence>
  );
}

/* ─── ROOT APP ────────────────────────────────────────────────────────────── */

export default function ROARApp() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [userBadge, setUserBadge] = useState("RISING_FAN");

  useEffect(() => {
    setMounted(true);
    try {
      setOnboarded(!!localStorage.getItem("roar_v2_complete"));
      setUserBadge(localStorage.getItem("roar_badge") || "RISING_FAN");
    } catch {}
  }, []);

  const [activeTab, setActiveTab] = useState("home");
  const [overlay, setOverlay] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeType, setComposeType] = useState<string | null>(null);
  const [toast, setToast] = useState({ visible: false, message: "" });

  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);

  // Elevate notifications state to parent so mark read is permanent
  const [notifications, setNotifications] = useState(
    NOTIFICATIONS_DATA.map((n) => ({ ...n })),
  );
  const [extraItems, setExtraItems] = useState<any[]>([]);
  const [showBanner, setShowBanner] = useState(true);
  const [dbPosts, setDbPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get("/api/roar/posts");
      if (res.data?.success) {
        setDbPosts(res.data.posts);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("/api/roar/rooms");
        if (res.data?.success) {
          setRooms(res.data.rooms);
          if (res.data.rooms.length > 0 && !selectedRoom) {
            setSelectedRoom(res.data.rooms[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };
    if (onboarded) {
      fetchRooms();
      fetchPosts();
    }
  }, [onboarded, fetchPosts]);

  useEffect(() => {
    if (rooms) {
      setNotifications((prev) => {
        // Keep non-match notifications (badges, challenges, etc.)
        const nonMatchNotifs = prev.filter(
          (n) => n.type !== "MATCH_LIVE" && n.type !== "HEATING_UP"
        );
        
        // Generate new match notifications from active rooms
        const matchNotifs: any[] = [];
        rooms.forEach((room) => {
          if (room.isActive) {
            const existingLive = prev.find((n) => n.id === `live-${room.roomId}`);
            const existingHeat = prev.find((n) => n.id === `heat-${room.roomId}`);

            matchNotifs.push({
              id: `live-${room.roomId}`,
              type: "MATCH_LIVE",
              title: `MATCH LIVE: ${room.name}`,
              subtitle: `Discussion room is open. ${room.fanCount || 0} fans already debating.`,
              time: "Just now",
              read: existingLive ? existingLive.read : false,
              fan: null,
              cta: null,
            });

            matchNotifs.push({
              id: `heat-${room.roomId}`,
              type: "HEATING_UP",
              title: "This room is heating up 🔥",
              subtitle: `${room.name} debate: ${room.fanCount || 0} fans live. Jump in.`,
              time: "15m",
              read: existingHeat ? existingHeat.read : false,
              fan: null,
              cta: null,
            });
          }
        });
        
        return [...matchNotifs, ...nonMatchNotifs];
      });
    }
  }, [rooms]);

  const handleVote = useCallback(async (postId: string, voteType: "agree" | "disagree" | null) => {
    try {
      await axios.post(`/api/roar/posts/${postId}/vote`, { vote: voteType });
      fetchPosts();
    } catch (err) {
      console.error("Failed to submit vote:", err);
    }
  }, [fetchPosts]);

  const showToast = useCallback((msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3200);
    setTimeout(() => setToast({ visible: false, message: "" }), 3700);
  }, []);

  const handlePost = useCallback(
    async (payload: any) => {
      try {
        const res = await axios.post("/api/roar/posts", {
          type: payload.type === "hot_take" ? "hot_take" : "prediction",
          text: payload.text,
          sport: payload.sport || "cricket",
          matchId: payload.match,
          confidence: payload.confidence,
          audience: payload.audience,
        });
        if (res.data?.success) {
          showToast("🔥 Your take is live · 47 fans may see it");
          fetchPosts();
        }
      } catch (err) {
        console.error("Failed to post:", err);
        showToast("Failed to create post");
      }
      setShowBanner(false);
    },
    [showToast, fetchPosts],
  );

  const completeOnboarding = useCallback((prefs: any) => {
    const badge = prefs.badge || "RISING_FAN";
    setUserBadge(badge);
    setOnboarded(true);
    try {
      localStorage.setItem("roar_v2_complete", "1");
      localStorage.setItem("roar_badge", badge);
    } catch {}
  }, []);

  const handleTab = (tab: string) => {
    setOverlay(null);
    if (tab === "discuss") {
      setOverlay("room");
      return;
    }
    setActiveTab(tab);
  };

  const openCompose = (type: string | null = null) => {
    setComposeType(type);
    setComposeOpen(true);
  };

  const showMain = !overlay;
  const isRoom = overlay === "room";
  const isLB = overlay === "leaderboard";

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!mounted) {
    return (
      <div className="roar-root" style={{ minHeight: "100vh", background: "var(--bg-primary)" }} />
    );
  }

  return (
    <div className="roar-root">
      {/* Scoped styles */}
      <style>{GLOBAL_CSS}</style>

      <div
        className="roar-inner"
        ref={containerRef}
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Ambient background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            background:
              "radial-gradient(ellipse 90% 55% at 50% -15%,rgba(233,30,140,0.18),transparent 55%),radial-gradient(ellipse 70% 45% at 100% 80%,rgba(255,107,53,0.12),transparent 50%),radial-gradient(ellipse 50% 40% at 0% 60%,rgba(0,232,198,0.08),transparent 45%),var(--bg-primary)",
          }}
        />

        {/* Floating Spark Particles */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <div style={{ position: "absolute", bottom: -10, left: "12%", width: 3, height: 3, borderRadius: "50%", background: "var(--accent-magenta)", animation: "roar-driftUp 14s linear infinite" }} />
          <div style={{ position: "absolute", bottom: -10, left: "28%", width: 4, height: 4, borderRadius: "50%", background: "var(--accent-orange)", animation: "roar-driftUp 18s linear infinite 2s" }} />
          <div style={{ position: "absolute", bottom: -10, left: "50%", width: 3, height: 3, borderRadius: "50%", background: "var(--teal)", animation: "roar-driftUp 15s linear infinite 5s" }} />
          <div style={{ position: "absolute", bottom: -10, left: "72%", width: 4, height: 4, borderRadius: "50%", background: "var(--accent-magenta)", animation: "roar-driftUp 20s linear infinite 1s" }} />
          <div style={{ position: "absolute", bottom: -10, left: "88%", width: 3, height: 3, borderRadius: "50%", background: "var(--accent-yellow)", animation: "roar-driftUp 16s linear infinite 7s" }} />
        </div>

        {/* ROAR watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 88,
            right: 0,
            left: 0,
            textAlign: "right",
            paddingRight: 12,
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 72,
            color: "white",
            opacity: 0.04,
            pointerEvents: "none",
            zIndex: 0,
            letterSpacing: "0.1em",
          }}
        >
          ROAR
        </div>

        {/* Toast — positioned inside roar-inner, not fixed */}
        <Toast
          message={toast.message}
          visible={toast.visible}
          containerRef={containerRef}
        />

        {/* Onboarding */}
        {!onboarded && <Onboarding onComplete={completeOnboarding} />}

        {/* Main app - Now flex 1 to prevent overlap with bottom dock */}
        {onboarded && (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              {isLB ? (
                <motion.div
                  key="lb"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ height: "100%" }}
                >
                  <Leaderboard
                    onBack={() => setOverlay(null)}
                    onCompose={() => openCompose("prediction")}
                  />
                </motion.div>
              ) : isRoom ? (
                <motion.div
                  key="room"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <DiscussionRoom
                    roomId={selectedRoom?.roomId}
                    roomName={selectedRoom?.name}
                    onBack={() => {
                      setOverlay(null);
                      setActiveTab("home");
                    }}
                    onToast={showToast}
                  />
                </motion.div>
              ) : showMain ? (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ height: "100%" }}
                >
                  {activeTab === "home" && (
                    <HomeFeed
                      unreadCount={unreadCount}
                      onNavigateAlerts={() => setActiveTab("alerts")}
                      onJoinRoom={(room) => {
                        if (room) {
                          setSelectedRoom(room);
                        } else if (rooms.length > 0) {
                          setSelectedRoom(rooms[0]);
                        }
                        setOverlay("room");
                      }}
                      onLeaderboard={() => setOverlay("leaderboard")}
                      onFanProfile={() => setActiveTab("profile")}
                      onToast={showToast}
                      extraItems={extraItems}
                      showBanner={showBanner}
                      onDismissBanner={() => setShowBanner(false)}
                      userBadge={userBadge}
                      rooms={rooms}
                      dbPosts={dbPosts}
                      onPostClick={(post) => setSelectedPost(post)}
                      onVote={handleVote}
                    />
                  )}
                  {activeTab === "profile" && (
                    <Profile
                      userBadge={userBadge}
                      setUserBadge={setUserBadge}
                      onCompose={() => openCompose("prediction")}
                      onToast={showToast}
                      setOnboarded={setOnboarded}
                    />
                  )}
                  {activeTab === "alerts" && (
                    <Notifications
                      notifications={notifications}
                      onMarkRead={(id) =>
                        setNotifications((p) =>
                          p.map((n) =>
                            n.id === id ? { ...n, read: true } : n,
                          ),
                        )
                      }
                      onMarkAllRead={() =>
                        setNotifications((p) =>
                          p.map((n) => ({ ...n, read: true })),
                        )
                      }
                      onCompose={() => openCompose()}
                      onJoinRoom={(room) => {
                        if (room) {
                          setSelectedRoom(room);
                        } else if (rooms.length > 0) {
                          setSelectedRoom(rooms[0]);
                        }
                        setOverlay("room");
                      }}
                      onNavigateTab={handleTab}
                      rooms={rooms}
                    />
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )}

        {/* Bottom nav — Flex child sitting cleanly below the content area */}
        {onboarded && (
          <BottomNav
            activeTab={isRoom ? "discuss" : activeTab}
            onTabChange={handleTab}
            onCompose={() => openCompose()}
            onQuickCompose={(t) => openCompose(t)}
            unreadCount={unreadCount}
            matchLive
            badgeNearUnlock
          />
        )}

        {/* Post details overlay */}
        {onboarded && selectedPost && (
          <PostDetailsOverlay
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            onToast={showToast}
            onVote={handleVote}
          />
        )}

        {/* Compose modal */}
        {onboarded && (
          <ComposeModal
            open={composeOpen}
            onClose={() => {
              setComposeOpen(false);
              setComposeType(null);
            }}
            onPost={handlePost}
            initialType={composeType}
          />
        )}
      </div>
    </div>
  );
}
