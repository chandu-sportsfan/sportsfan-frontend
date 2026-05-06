"use client";

import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlayerCard {
  id: number;
  name: string;
  ringValue: number;
  ringMax: number;
  ringColor: string;
  points: number;
  delta: number;
  prevPoints: number;
  isLive?: boolean;
  trend: "up" | "down";
}

// ─── Circular Ring SVG ────────────────────────────────────────────────────────
const RingIndicator: React.FC<{
  value: number;
  max: number;
  color: string;
  size?: number;
}> = ({ value, max, color, size = 56 }) => {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const fill = (value / max) * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" style={{ display: "block", filter: `drop-shadow(0 0 8px ${color}40)` }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2a2a2a"
          strokeWidth="4"
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${fill} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      {/* Center value */}
      <span className="absolute inset-0 flex items-center justify-center text-[18px] font-black" style={{ color }}>
        {value}
      </span>
    </div>
  );
};

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5722" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="3" />
  </svg>
);

const TrendArrow: React.FC<{ trend: "up" | "down" }> = ({ trend }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={trend === "up" ? "#00e676" : "#ef5350"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
    {trend === "up" ? <path d="M7 17L17 7M17 7H9M17 7V15" /> : <path d="M7 7L17 17M17 17H9M17 17V9" />}
  </svg>
);
// (You can delete the LightningIcon entirely)

// ─── Player Card ──────────────────────────────────────────────────────────────
const PlayerPowerCard: React.FC<{ player: PlayerCard }> = ({ player }) => (
  <div className="relative flex-shrink-0 w-[240px] rounded-none border border-[#2a2a2a] bg-[#0c0c0c] hover:bg-[#111] transition-colors p-4 pr-5 flex gap-4">
    
    {/* LIVE badge */}
    {player.isLive && (
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#1a0a00] border border-[#ff5722] rounded-full px-2.5 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5722] animate-pulse" />
        <span className="text-[#ff5722] text-[10px] font-bold tracking-widest uppercase">Live</span>
      </div>
    )}

    {/* Ring */}
    <div className="flex items-center justify-center">
      <RingIndicator value={player.ringValue} max={player.ringMax} color={player.ringColor} size={64} />
    </div>

    {/* Info block */}
    <div className="flex flex-col justify-center flex-1 min-w-0 pt-1">
      <span className="text-[#e0e0e0] text-[16px] font-bold truncate w-[110px] mb-1">
        {player.name}
      </span>
      
      <div className="flex items-center gap-1.5">
        <span className="text-[#00e676] text-[24px] font-black leading-none">{player.points.toLocaleString()}</span>
        <TrendArrow trend={player.trend} />
      </div>

      <div className="flex items-center gap-1 mt-1.5">
        <span className="text-[12px] font-bold" style={{ color: player.trend === "up" ? "#00e676" : "#ef5350" }}>
          {player.trend === "up" ? "+" : "-"}{Math.abs(player.delta)}
        </span>
        <span className="text-[#666] text-[12px]">from {player.prevPoints}</span>
      </div>
    </div>
  </div>
);

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PLAYER_DATA: PlayerCard[] = [
  {
    id: 1,
    name: "Neeraj Chopra",
    ringValue: 87,
    ringMax: 100,
    ringColor: "#00e676",
    points: 1523,
    delta: 36,
    prevPoints: 1487,
    isLive: false,
    trend: "up",
  },
  {
    id: 2,
    name: "Shaili Singh",
    ringValue: 21,
    ringMax: 100,
    ringColor: "#00e676",
    points: 1245,
    delta: 47,
    prevPoints: 1198,
    isLive: true,
    trend: "up",
  },
  {
    id: 3,
    name: "Lakshya Sen",
    ringValue: 64,
    ringMax: 100,
    ringColor: "#e91e8c",
    points: 980,
    delta: 12,
    prevPoints: 968,
    isLive: true,
    trend: "up",
  },
  {
    id: 4,
    name: "Tejaswin",
    ringValue: 45,
    ringMax: 100,
    ringColor: "#ff9800",
    points: 854,
    delta: 8,
    prevPoints: 862,
    isLive: false,
    trend: "down",
  },
  {
    id: 5,
    name: "Avinash Sable",
    ringValue: 33,
    ringMax: 100,
    ringColor: "#00e676",
    points: 720,
    delta: 22,
    prevPoints: 698,
    isLive: false,
    trend: "up",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
interface PlayerPowerCarouselProps {
  onShowAll: () => void;
}

const PlayerPowerCarousel: React.FC<PlayerPowerCarouselProps> = ({ onShowAll }) => {
  return (
    <div className="w-full bg-[#121212] px-4 pb-4">
      {/* Header row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h2 className="text-white text-[20px] font-black leading-tight">Player Power Points</h2>
            <InfoIcon />
          </div>
          <p className="text-[#ff5722] text-[13px] font-medium leading-snug">
            Hey! Don't let your favorite players drop their Power!
          </p>
        </div>
        <button onClick={onShowAll} className="text-[#ff5722] text-[14px] font-bold hover:text-[#ff8a50] transition-colors whitespace-nowrap mt-1 flex-shrink-0 underline underline-offset-4">
          Show All
        </button>
      </div>

      {/* Subtitle */}
      <p className="text-[#888] text-[13px] mb-4 leading-relaxed max-w-[95%]">
        Players earn Power Points when fans Like, Echo, Quote, Watch Videos, and Post about them on SportsFan360.
      </p>

      {/* Scrollable cards - Auto Marquee */}
      <div className="overflow-hidden relative w-full pb-1">
        <style>{`
          @keyframes infinite-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: infinite-scroll 20s linear infinite;
            width: max-content; /* Critical for continuous scroll */
          }
          .animate-scroll:hover {
            animation-play-state: paused; /* Pauses when user hovers over it! */
          }
        `}</style>
        
        {/* We map the array TWICE so the loop is perfectly seamless */}
        <div className="flex gap-3 animate-scroll">
          {[...PLAYER_DATA, ...PLAYER_DATA].map((player, index) => (
            <PlayerPowerCard key={`${player.id}-${index}`} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerPowerCarousel;
