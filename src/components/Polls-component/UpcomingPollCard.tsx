"use client";

import React, { useState, useEffect } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const SwordIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
    <path d="M13 19l6-6" />
    <path d="M16 16l4 4" />
    <path d="M19 21l2-2" />
    <path d="M6 3v3" />
    <path d="M3 6h3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function UpcomingPollCard() {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 14, s: 32 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        if (s > 0) {
          s--;
        } else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (val: number) => val.toString().padStart(2, "0");

  return (
    <div className="relative w-[260px] h-[340px] rounded-xl border border-[#ff2a85] shadow-[0_0_15px_rgba(255,42,133,0.25)] bg-[#0d0508] overflow-hidden flex flex-col p-4">
      
      {/* Background Gradient & Subtle Noise */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3a0a1f] to-[#0a0508] opacity-60" />
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '12px 12px' }} 
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col items-center">
        
        {/* Top Badge */}
        <div className="bg-[#ff2a85] text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 mt-1 shadow-[0_0_10px_rgba(255,42,133,0.5)]">
          <CalendarIcon />
          Upcoming Poll
        </div>

        {/* Sparkles */}
        <div className="mt-4 text-[#ffb0d0] text-lg">
          ✨
        </div>

        {/* Titles */}
        <h3 className="text-white text-[15px] font-bold mt-1 text-center leading-tight">
          Next Match Prediction
        </h3>
        <p className="text-[#a0a0a0] text-[12px] font-medium mt-1">
          New poll arriving in
        </p>

        {/* Timer */}
        <div className="text-[#ff2a85] text-[20px] font-mono font-bold tracking-wider mt-1 drop-shadow-[0_0_8px_rgba(255,42,133,0.4)]">
          {formatTime(timeLeft.h)}h : {formatTime(timeLeft.m)}m : {formatTime(timeLeft.s)}s
        </div>

        {/* Locked Options Container */}
        <div className="w-full mt-5 space-y-2">
          {/* Option 1 */}
          <div className="w-full bg-[#1e1e2e]/40 border border-[#2a2a3e] rounded-lg px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#555]"><SwordIcon /></span>
              <span className="text-[#777] text-[12px] font-medium">Who will win the toss?</span>
            </div>
            <span className="text-[#444]"><LockIcon /></span>
          </div>

          {/* Option 2 */}
          <div className="w-full bg-[#1e1e2e]/40 border border-[#2a2a3e] rounded-lg px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#555]"><SwordIcon /></span>
              <span className="text-[#777] text-[12px] font-medium">Top scorer prediction</span>
            </div>
            <span className="text-[#444]"><LockIcon /></span>
          </div>
        </div>

        {/* CLEANED UP Footer Button */}
        <div className="w-full mt-auto bg-[#181824] border border-white/5 rounded-lg py-2.5 flex items-center justify-center gap-2 shadow-inner">
          <span className="text-[#8a8a9e]"><ClockIcon /></span>
          <span className="text-[#a1a1b5] text-[12px] font-semibold tracking-wide">Poll Opens Soon</span>
        </div>

      </div>
    </div>
  );
}
