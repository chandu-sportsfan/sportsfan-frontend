"use client";

import Link from "next/link";
import React from "react";

const FanBattleHeader: React.FC = () => {
  return (
    <div className="w-full bg-[#121212] px-4 pt-4 pb-4">
      {/* Top Nav */}
      <div className="flex items-center justify-between mb-5">
        <Link href="/MainModules/HomePage">
          <button className="flex items-center justify-center cursor-pointer w-8 h-8 rounded-full bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-colors">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        </Link>

        <span className="text-white text-[15px] font-semibold tracking-wide">
          Fan Battle
        </span>

        <div className="flex items-center gap-1.5 bg-[#1e1e1e] px-3 py-1.5 rounded-full">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="#FFD700"
            stroke="#FFD700"
            strokeWidth="1"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="text-white text-[13px] font-bold">1,240 pts</span>
        </div>
      </div>

      {/* Hero Text */}
      <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight mb-1">
        Test Your Cricket IQ
      </h1>
      <p className="text-[#8a8a8a] text-[13px] sm:text-sm leading-relaxed mb-4">
        Challenge yourself across three difficulty
        <br />
        levels and prove you&apos;re the ultimate cricket fan
      </p>

      {/* Live Match Banner */}
      <div className="w-full rounded-2xl bg-gradient-to-r from-[#2a1a2e] via-[#1e1028] to-[#1a1a2e] p-4 flex items-center justify-between border border-[#3a2040]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#00e676] inline-block animate-pulse" />
            <span className="text-[#00e676] text-[11px] font-bold tracking-widest uppercase">
              Live Now
            </span>
          </div>
          <span className="text-white text-[13px] font-semibold">
            IPL 2026 • Match 24
          </span>
          <span className="text-[#b0b0b0] text-[12px]">RCB vs MI</span>
          <span className="text-white text-[13px] font-bold mt-0.5">
            178/4{" "}
            <span className="text-[#8a8a8a] font-normal text-[11px]">
              (18.2 ov)
            </span>
          </span>
        </div>

        <button className="bg-[#e91e8c] hover:bg-[#d81b80] active:bg-[#c2185b] transition-colors text-white text-[12px] sm:text-[13px] font-bold px-4 py-2.5 rounded-xl whitespace-nowrap shadow-lg shadow-pink-900/40">
          Play Along Live
        </button>
      </div>
    </div>
  );
};

export default FanBattleHeader;