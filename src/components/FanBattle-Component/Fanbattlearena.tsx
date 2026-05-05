"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Player {
  id: number;
  name: string;
  nameDev: string;
  team: string;
  role: string;
  jerseyNumber: number;
  runs: number;
  strikeRate: number;
  age: number;
  medals: number;
  jerseyColor: { from: string; to: string; stroke: string; glow: string; innerStroke: string };
}

const players: Player[] = [
  {
    id: 1,
    name: "Virat Kohli",
    nameDev: "विराट कोहली",
    team: "Royal Challengers Bangalore",
    role: "BATSMAN",
    jerseyNumber: 18,
    runs: 8074,
    strikeRate: 130.4,
    age: 35,
    medals: 12,
    jerseyColor: { from: "#dc2626", to: "#7f1d1d", stroke: "#ef4444", glow: "rgba(220,38,38,0.45)", innerStroke: "#fca5a5" },
  },
  {
    id: 2,
    name: "Rohit Sharma",
    nameDev: "रोहित शर्मा",
    team: "Mumbai Indians",
    role: "BATSMAN",
    jerseyNumber: 45,
    runs: 6628,
    strikeRate: 128.9,
    age: 37,
    medals: 15,
    jerseyColor: { from: "#1d4ed8", to: "#1e3a8a", stroke: "#3b82f6", glow: "rgba(29,78,216,0.45)", innerStroke: "#93c5fd" },
  },
  {
    id: 3,
    name: "Jasprit Bumrah",
    nameDev: "जसप्रीत बुमराह",
    team: "Mumbai Indians",
    role: "BOWLER",
    jerseyNumber: 93,
    runs: 56,
    strikeRate: 102.3,
    age: 30,
    medals: 9,
    jerseyColor: { from: "#0891b2", to: "#164e63", stroke: "#06b6d4", glow: "rgba(8,145,178,0.45)", innerStroke: "#a5f3fc" },
  },
  {
    id: 4,
    name: "MS Dhoni",
    nameDev: "महेंद्र सिंह धोनी",
    team: "Chennai Super Kings",
    role: "WICKET KEEPER",
    jerseyNumber: 7,
    runs: 5082,
    strikeRate: 135.2,
    age: 42,
    medals: 18,
    jerseyColor: { from: "#ca8a04", to: "#713f12", stroke: "#eab308", glow: "rgba(202,138,4,0.45)", innerStroke: "#fde047" },
  },
  {
    id: 5,
    name: "Hardik Pandya",
    nameDev: "हार्दिक पांड्या",
    team: "Mumbai Indians",
    role: "ALL ROUNDER",
    jerseyNumber: 33,
    runs: 3412,
    strikeRate: 147.8,
    age: 30,
    medals: 11,
    jerseyColor: { from: "#7c3aed", to: "#3b0764", stroke: "#8b5cf6", glow: "rgba(124,58,237,0.45)", innerStroke: "#c4b5fd" },
  },
  {
    id: 6,
    name: "KL Rahul",
    nameDev: "केएल राहुल",
    team: "Lucknow Super Giants",
    role: "BATSMAN",
    jerseyNumber: 1,
    runs: 4683,
    strikeRate: 134.6,
    age: 32,
    medals: 8,
    jerseyColor: { from: "#059669", to: "#064e3b", stroke: "#10b981", glow: "rgba(5,150,105,0.45)", innerStroke: "#6ee7b7" },
  },
  {
    id: 7,
    name: "Suryakumar Yadav",
    nameDev: "सूर्यकुमार यादव",
    team: "Mumbai Indians",
    role: "BATSMAN",
    jerseyNumber: 63,
    runs: 3963,
    strikeRate: 157.3,
    age: 33,
    medals: 7,
    jerseyColor: { from: "#db2777", to: "#831843", stroke: "#ec4899", glow: "rgba(219,39,119,0.45)", innerStroke: "#f9a8d4" },
  },
];

export default function FanBattleCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayNumber, setDisplayNumber] = useState<number | string>("--");
  const [isScanning, setIsScanning] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const startX = useRef(0);
  const startY = useRef(0);
  const isDraggingRef = useRef(false);
  const dragXRef = useRef(0);
  const lockAxis = useRef<"h" | "v" | null>(null);
  const scanInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const player = players[currentIndex];
  const color = player.jerseyColor;

  const startScan = useCallback((index: number) => {
    setIsScanning(true);
    let count = 0;
    const maxCount = 18;
    if (scanInterval.current) clearInterval(scanInterval.current);
    scanInterval.current = setInterval(() => {
      setDisplayNumber(Math.floor(Math.random() * 99) + 1);
      count++;
      if (count >= maxCount) {
        clearInterval(scanInterval.current!);
        setDisplayNumber(players[index].jerseyNumber);
        setIsScanning(false);
      }
    }, 60);
  }, []);

  useEffect(() => {
    setDisplayNumber(player.jerseyNumber);
    if (scanTimeout.current) clearTimeout(scanTimeout.current);
    scanTimeout.current = setTimeout(() => startScan(currentIndex), 300);
    const interval = setInterval(() => startScan(currentIndex), 3000);
    return () => {
      clearInterval(interval);
      if (scanInterval.current) clearInterval(scanInterval.current);
      if (scanTimeout.current) clearTimeout(scanTimeout.current);
    };
  }, [currentIndex, player.jerseyNumber, startScan]);

  const animateSwipe = useCallback(
    (dir: "left" | "right") => {
      if (isAnimatingOut) return;
      setSwipeDir(dir);
      setIsAnimatingOut(true);
      setIsDragging(false);
      setTimeout(() => {
        setCurrentIndex((prev) =>
          dir === "left" ? (prev + 1) % players.length : (prev - 1 + players.length) % players.length
        );
        setIsAnimatingOut(false);
        setSwipeDir(null);
        setDragX(0);
        dragXRef.current = 0;
      }, 340);
    },
    [isAnimatingOut]
  );

  // Touch handling
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const onTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      isDraggingRef.current = true;
      lockAxis.current = null;
      dragXRef.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.touches[0].clientX - startX.current;
      const dy = e.touches[0].clientY - startY.current;

      if (!lockAxis.current) {
        lockAxis.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      }
      if (lockAxis.current === "v") return;

      e.preventDefault();
      dragXRef.current = dx;
      setDragX(dx);
      setIsDragging(true);
    };

    const onTouchEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      const dx = dragXRef.current;
      setIsDragging(false);
      if (lockAxis.current === "h") {
        if (dx < -60) animateSwipe("left");
        else if (dx > 60) animateSwipe("right");
        else {
          setDragX(0);
          dragXRef.current = 0;
        }
      } else {
        setDragX(0);
        dragXRef.current = 0;
      }
      lockAxis.current = null;
    };

    card.addEventListener("touchstart", onTouchStart, { passive: true });
    card.addEventListener("touchmove", onTouchMove, { passive: false });
    card.addEventListener("touchend", onTouchEnd);

    return () => {
      card.removeEventListener("touchstart", onTouchStart);
      card.removeEventListener("touchmove", onTouchMove);
      card.removeEventListener("touchend", onTouchEnd);
    };
  }, [animateSwipe]);

  // Mouse/pointer handling
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    startX.current = e.clientX;
    isDraggingRef.current = true;
    dragXRef.current = 0;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || e.pointerType === "touch") return;
    const dx = e.clientX - startX.current;
    dragXRef.current = dx;
    setDragX(dx);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    const dx = dragXRef.current;
    if (dx < -60) animateSwipe("left");
    else if (dx > 60) animateSwipe("right");
    else {
      setDragX(0);
      dragXRef.current = 0;
    }
  };

  const cardTransform: React.CSSProperties = isAnimatingOut
    ? {
        transform: `translateX(${swipeDir === "left" ? -460 : 460}px) rotate(${swipeDir === "left" ? -14 : 14}deg)`,
        opacity: 0,
        transition: "transform 0.34s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease",
      }
    : isDragging
    ? {
        transform: `translateX(${dragX}px) rotate(${dragX * 0.045}deg)`,
        transition: "none",
        cursor: "grabbing",
      }
    : {
        transform: "translateX(0px) rotate(0deg)",
        opacity: 1,
        transition: "transform 0.44s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease",
        cursor: "grab",
      };

  const likeOpacity = dragX > 40 ? Math.min((dragX - 40) / 90, 1) : 0;
  const skipOpacity = dragX < -40 ? Math.min((-dragX - 40) / 90, 1) : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#07070f] py-6 px-4 select-none overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between mb-5">
        <div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Fan Battle</h1>
          <p className="text-gray-500 text-xs mt-0.5">Shake or swipe to show your support</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 bg-[#160d25] border border-fuchsia-800 text-fuchsia-400 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-fuchsia-900/30 transition-colors">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            Create
          </button>
          <button className="flex items-center gap-1.5 bg-[#160d25] border border-fuchsia-800 text-fuchsia-400 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-fuchsia-900/30 transition-colors">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <circle cx="5" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="11" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
              <path d="M1 14c0-2.2 1.8-4 4-4h6c2.2 0 4 1.8 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Invite
          </button>
        </div>
      </div>

      {/* Card stack area */}
      <div className="w-full max-w-sm relative" style={{ perspective: "1200px" }}>
        {/* Ghost cards behind */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "#0c091a",
            border: "1px solid rgba(255,255,255,0.05)",
            transform: "scale(0.94) translateY(12px)",
            zIndex: 0,
          }}
        />
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "#0a0814",
            border: "1px solid rgba(255,255,255,0.04)",
            transform: "scale(0.97) translateY(6px)",
            zIndex: 1,
          }}
        />

        {/* Main card */}
        <div
          ref={cardRef}
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(150deg, #130820 0%, #0c0c1a 45%, #150a0a 100%)",
            border: `1px solid ${color.stroke}44`,
            boxShadow: `0 0 60px ${color.glow}, 0 24px 60px rgba(0,0,0,0.7), inset 0 0 50px rgba(0,0,0,0.5)`,
            zIndex: 2,
            minHeight: 410,
            willChange: "transform",
            ...cardTransform,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* Corner brackets */}
          {[
            "top-3 left-3 border-t-2 border-l-2",
            "top-3 right-3 border-t-2 border-r-2",
            "bottom-3 left-3 border-b-2 border-l-2",
            "bottom-3 right-3 border-b-2 border-r-2",
          ].map((cls, i) => (
            <div key={i} className={`absolute w-5 h-5 ${cls} rounded-sm`} style={{ borderColor: `${color.stroke}70` }} />
          ))}

          {/* Ambient dots */}
          <div className="absolute left-4 top-1/2 w-1.5 h-1.5 rounded-full" style={{ background: `${color.stroke}55` }} />
          <div className="absolute right-4 top-1/2 w-1.5 h-1.5 rounded-full" style={{ background: `${color.stroke}55` }} />

          {/* Top accent stripe */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${color.stroke}cc, transparent)` }}
          />

          {/* LIKE stamp */}
          <div
            className="absolute inset-0 flex items-center justify-start pl-7 pointer-events-none z-10"
            style={{ opacity: likeOpacity, transition: isDragging ? "none" : "opacity 0.15s" }}
          >
            <div
              className="font-black text-2xl tracking-widest border-4 rounded-xl px-4 py-2"
              style={{ borderColor: "#4ade80", color: "#4ade80", transform: "rotate(-14deg)", textShadow: "0 0 12px rgba(74,222,128,0.5)" }}
            >
              LIKE
            </div>
          </div>

          {/* SKIP stamp */}
          <div
            className="absolute inset-0 flex items-center justify-end pr-7 pointer-events-none z-10"
            style={{ opacity: skipOpacity, transition: isDragging ? "none" : "opacity 0.15s" }}
          >
            <div
              className="font-black text-2xl tracking-widest border-4 rounded-xl px-4 py-2"
              style={{ borderColor: "#f87171", color: "#f87171", transform: "rotate(14deg)", textShadow: "0 0 12px rgba(248,113,113,0.5)" }}
            >
              SKIP
            </div>
          </div>

          <div className="flex flex-col items-center pt-8 pb-5 px-5">
            {/* Jersey with unique color */}
            <div className="relative flex items-center justify-center mb-4" style={{ width: 130, height: 138 }}>
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at center, ${color.glow} 0%, transparent 68%)`,
                  filter: "blur(16px)",
                  transform: "scale(1.4)",
                }}
              />
              <svg width="118" height="128" viewBox="0 0 110 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id={`jg${player.id}`} x1="0" y1="0" x2="110" y2="120" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={color.from} stopOpacity="0.96" />
                    <stop offset="100%" stopColor={color.to} stopOpacity="0.96" />
                  </linearGradient>
                </defs>
                <path
                  d="M30 8 L10 28 L22 34 L22 108 L88 108 L88 34 L100 28 L80 8 L70 18 C65 22 45 22 40 18 Z"
                  fill={`url(#jg${player.id})`}
                  stroke={color.stroke}
                  strokeWidth="1.6"
                />
                <path
                  d="M30 8 L10 28 L22 34 L22 108 L88 108 L88 34 L100 28 L80 8 L70 18 C65 22 45 22 40 18 Z"
                  fill="none"
                  stroke={color.innerStroke}
                  strokeWidth="0.5"
                  opacity="0.35"
                />
                <text
                  x="55"
                  y="78"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={isScanning ? "33" : "38"}
                  fontWeight="bold"
                  fontFamily="monospace"
                  opacity={isScanning ? "0.6" : "1"}
                  style={{ transition: isScanning ? "none" : "font-size 0.2s", filter: isScanning ? "blur(0.8px)" : "none" }}
                >
                  {displayNumber}
                </text>
              </svg>

              {isScanning && (
                <div
                  className="absolute left-2 right-2 h-px pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${color.stroke}cc, transparent)`,
                    animation: "scanLine 0.18s linear infinite",
                    top: "50%",
                  }}
                />
              )}
            </div>

            {/* Name */}
            <h2 className="text-white text-lg font-bold text-center leading-snug">
              {player.name}{" "}
              <span style={{ color: color.stroke }}>({player.nameDev})</span>
            </h2>
            <p className="text-gray-500 text-xs mt-1 text-center">{player.team}</p>

            {/* Role badge */}
            <div className="flex items-center gap-2 mt-3 mb-4">
              <span
                className="text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-sm"
                style={{ background: `linear-gradient(90deg, ${color.from}, ${color.to})` }}
              >
                {player.role}
              </span>
              <span className="text-gray-500 text-xs">• India Cricket</span>
            </div>

            {/* Stats */}
            <div className="w-full grid grid-cols-3 gap-2 mb-3">
              {[
                { label: "RUNS", value: player.runs.toLocaleString() },
                { label: "MEDALS", value: player.medals },
                { label: "AGE", value: player.age },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center rounded-xl py-2.5"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <span className="text-white text-sm font-bold leading-tight">{value}</span>
                  <span className="text-gray-600 text-[9px] font-bold tracking-widest mt-0.5">{label}</span>
                </div>
              ))}
            </div>

            {/* Strike rate */}
            <div
              className="w-full flex items-center justify-between rounded-xl px-4 py-2 mb-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="text-gray-500 text-[10px] font-bold tracking-widest">STRIKE RATE</span>
              <span className="text-white text-sm font-bold">{player.strikeRate.toFixed(1)}</span>
            </div>

            {/* Jersey number pill */}
            <div
              className="px-10 py-2 rounded-full font-bold text-white text-sm tracking-widest"
              style={{
                background: `linear-gradient(90deg, ${color.from}, ${color.to})`,
                boxShadow: `0 0 22px ${color.glow}`,
              }}
            >
              # {player.jerseyNumber}
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div
        className="w-full max-w-sm mt-4 flex items-center justify-between px-5 py-3.5 rounded-2xl"
        style={{ background: "#0e0e18", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={() => animateSwipe("right")}
          className="flex items-center gap-2 text-gray-400 text-xs font-medium hover:text-white transition-colors group"
        >
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-700 group-hover:border-gray-500 transition-colors text-sm"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            ←
          </span>
          Swipe left to skip
        </button>
        <button
          onClick={() => animateSwipe("left")}
          className="flex items-center gap-2 text-xs font-semibold transition-colors"
          style={{ color: color.stroke }}
        >
          Swipe right to like
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
            style={{
              background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
              boxShadow: `0 0 14px ${color.glow}`,
            }}
          >
            →
          </span>
        </button>
      </div>

      <p className="text-gray-700 text-[9px] tracking-widest mt-3 uppercase">Tap card for full details</p>

      {/* Dot indicators */}
      <div className="flex gap-1.5 mt-2.5">
        {players.map((p, i) => (
          <button
            key={i}
            onClick={() => !isAnimatingOut && setCurrentIndex(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === currentIndex ? 18 : 6,
              height: 6,
              background: i === currentIndex ? p.jerseyColor.stroke : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { top: 22%; }
          50%  { top: 78%; }
          100% { top: 22%; }
        }
      `}</style>
    </div>
  );
}