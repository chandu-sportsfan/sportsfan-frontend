"use client";

import { useState } from "react";
import Image from "next/image";

const tabs = ["All", "Cricket", "Football",];

const quickLinks = [
  { label: "Match Centre", icon: "🏟️", badge: "LIVE", badgeColor: "bg-red-500" },
  { label: "Predictions", icon: "🎯", badge: "New", badgeColor: "bg-orange-500" },
  { label: "Community Groups", icon: "👥", badge: null, badgeColor: "" },
  { label: "Fan Battle", icon: "⚔️", badge: null, badgeColor: "" },
];

export default function NewHomePage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-0.5 pb-10 pt-5">

        {/* Tab Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#7a2000] text-white"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Hero Card — FIFA World Cup */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-4 min-h-[210px]">
          {/* Background image — replace src with your image path e.g. "/images/fifa-bg.jpg" */}
          <Image
            src="/images/fifawc.png"
            alt="FIFA World Cup 2026"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
              Football
            </span>
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              LIVE
            </span>
          </div>

          {/* Right arrow */}
          <button className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-[#7a2000] rounded-full w-9 h-9 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Bottom text */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h2 className="text-white text-xl sm:text-2xl font-extrabold leading-tight">
              FIFA World Cup 2026
            </h2>
            <p className="text-green-400 text-sm font-semibold mt-0.5">Live Now</p>
            <p className="text-white/75 text-sm mt-0.5">
              Brazil vs Argentina <span className="text-white font-bold mx-1">•</span> 2-1
            </p>
          </div>
        </div>

        {/* Quick Links Row */}
        <div className="flex gap-3 overflow-x-auto pb-1 mb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {quickLinks.map((link) => (
            <button
              key={link.label}
              className="relative flex-shrink-0 w-[100px] bg-[#1a0800] border border-[#2e1200] rounded-2xl p-3 flex flex-col items-center gap-2 hover:bg-[#261000] transition-colors"
            >
              {link.badge && (
                <span className={`absolute -top-2 left-1/2 -translate-x-1/2 ${link.badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>
                  {link.badge}
                </span>
              )}
              <span className="text-2xl">{link.icon}</span>
              <span className="text-white text-[11px] font-semibold text-center leading-tight">
                {link.label}
              </span>
            </button>
          ))}
        </div>

        {/* Cricket Card — ICC Women's T20 */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-white">
          {/* Background image — replace src with your image path e.g. "/images/t20-bg.jpg" */}
          <div className="relative h-[140px] sm:h-[160px]">
            <Image
              src="/images/t20wc.png"
              alt="ICC Women's T20 World Cup"
              fill
              className="object-fit opacity-25"
            />
            {/* Content over image */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              <span className="self-start bg-neutral-200 text-neutral-700 text-xs font-semibold px-3 py-1 rounded-full">
                Cricket
              </span>
              <div>
                <p className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase">
                  ICC Women's T20
                </p>
                <h3 className="text-neutral-900 text-2xl sm:text-3xl font-black leading-none tracking-tight">
                  WORLD CUP
                </h3>
                <p className="text-purple-700 text-[10px] font-bold tracking-wider uppercase mt-0.5">
                  England &amp; Wales 2026
                </p>
              </div>
            </div>

            {/* T20 lightning watermark */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10">
              <svg viewBox="0 0 60 80" className="w-14 h-20 fill-purple-900">
                <polygon points="38,0 12,44 30,44 22,80 52,30 32,30" />
              </svg>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="bg-white border-t border-neutral-100 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-neutral-900 text-sm font-bold">Womens T20 WorldCup</p>
              <p className="text-neutral-500 text-xs mt-0.5">1 Match Today</p>
              <p className="text-neutral-700 text-xs font-semibold">Playbook</p>
            </div>
            <button className="bg-purple-700 rounded-full w-9 h-9 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}