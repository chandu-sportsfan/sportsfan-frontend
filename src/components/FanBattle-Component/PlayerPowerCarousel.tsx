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
      <svg width={size} height={size} className="-rotate-90" style={{ display: "block" }}>
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
      <span
        className="absolute inset-0 flex items-center justify-center text-[13px] font-bold"
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
};

// ─── Trend Arrow ─────────────────────────────────────────────────────────────
const TrendArrow: React.FC<{ trend: "up" | "down" }> = ({ trend }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill={trend === "up" ? "#00e676" : "#ef5350"}
    className="flex-shrink-0"
  >
    {trend === "up" ? (
      <path d="M7 14l5-5 5 5H7z" />
    ) : (
      <path d="M7 10l5 5 5-5H7z" />
    )}
  </svg>
);

// ─── Lightning bolt icon ──────────────────────────────────────────────────────
const LightningIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#00e676">
    <path d="M13 2L4.09 12.96H11L10 22L20.91 11.04H14L13 2Z" />
  </svg>
);

// ─── Player Card ──────────────────────────────────────────────────────────────
const PlayerPowerCard: React.FC<{ player: PlayerCard }> = ({ player }) => (
  <div className="relative flex-shrink-0 w-[155px] rounded-2xl bg-[#1a1a1a] border border-[#252525] p-3.5 flex flex-col gap-2.5">
    {/* LIVE badge */}
    {player.isLive && (
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#1f0a0a] border border-[#4a1a1a] rounded-full px-1.5 py-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e53935] animate-pulse" />
        <span className="text-[#e53935] text-[8px] font-bold tracking-widest uppercase">
          Live
        </span>
      </div>
    )}

    {/* Ring + points */}
    <div className="flex items-center gap-2.5">
      <RingIndicator
        value={player.ringValue}
        max={player.ringMax}
        color={player.ringColor}
        size={52}
      />
      <div className="flex flex-col min-w-0">
        <span className="text-white text-[12px] font-bold leading-tight truncate">
          {player.name.length > 10 ? player.name.slice(0, 10) + "…" : player.name}
        </span>
        <div className="flex items-center gap-1 mt-0.5">
          <LightningIcon />
          <span className="text-[#00e676] text-[13px] font-bold">
            {player.points.toLocaleString()}
          </span>
        </div>
      </div>
    </div>

    {/* Delta */}
    <div className="flex items-center gap-1">
      <TrendArrow trend={player.trend} />
      <span
        className="text-[11px] font-semibold"
        style={{ color: player.trend === "up" ? "#00e676" : "#ef5350" }}
      >
        {player.trend === "up" ? "+" : "-"}
        {Math.abs(player.delta)}
      </span>
      <span className="text-[#555] text-[10px]">from {player.prevPoints.toLocaleString()}</span>
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
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-white text-[15px] font-bold leading-tight">
            Player Power Points
          </h2>
          <p className="text-[#e53935] text-[11px] mt-0.5 leading-snug max-w-[220px]">
            Hey! Don&apos;t let your favorite players drop their Power!
          </p>
        </div>
        <button
          onClick={onShowAll}
          className="text-[#e91e8c] text-[12px] font-semibold hover:text-[#ff4db8] transition-colors whitespace-nowrap mt-0.5 flex-shrink-0"
        >
          Show All
        </button>
      </div>

      {/* Subtitle */}
      <p className="text-[#555] text-[11px] mb-3 leading-relaxed">
        Players earn Power Points when fans Like, Echo, Quote, Watch Videos, and Post
        about them on SportsFan360.
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
