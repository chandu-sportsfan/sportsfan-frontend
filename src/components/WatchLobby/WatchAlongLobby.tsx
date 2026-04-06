"use client";

import { useState } from "react";

export type Expert = {
  id: number;
  name: string;
  role: string;
  badge: string;
  badgeColor: string;
  borderColor: string;
  initials: string;
  watching: string;
  engagement: string;
  active: string;
  isLive?: boolean;
};

const experts: Expert[] = [
  {
    id: 1,
    name: "Harsha Bhogle",
    role: "Cricket Commentary Legend",
    badge: "Legend",
    badgeColor: "bg-pink-600",
    borderColor: "border-pink-500",
    initials: "HB",
    watching: "24,892",
    engagement: "94%",
    active: "2.8k",
    isLive: true,
  },
  {
    id: 2,
    name: "Aakash Chopra",
    role: "Match Tactical Breakdown",
    badge: "Pro Analyst",
    badgeColor: "bg-orange-500",
    borderColor: "border-orange-400",
    initials: "AC",
    watching: "18,542",
    engagement: "89%",
    active: "1.9k",
  },
  {
    id: 3,
    name: "Ravichandra Ashwin",
    role: "Elite Tactical Room",
    badge: "Elite Expert",
    badgeColor: "bg-purple-600",
    borderColor: "border-purple-500",
    initials: "RA",
    watching: "15,234",
    engagement: "91%",
    active: "1.5k",
  },
];

const tabs = ["Match Predictions", "Goal Reactions", "Fan Leaderboard", "Highlights"];

type Props = {
  onEnterRoom: (expert: Expert) => void;
};

export default function WatchAlongLobby({ onEnterRoom }: Props) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-[#111] text-white font-sans">
      <div className="max-w-lg mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button className="text-xl text-gray-400 hover:text-white transition-colors">←</button>
          <h1 className="text-lg font-bold">Watch Along</h1>
        </div>

        {/* Section title */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span className="text-base font-bold">Watch Along – IPL 2026</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all ${
                activeTab === i
                  ? "bg-pink-600 border-pink-600 text-white"
                  : "bg-[#1e1e1e] border-[#333] text-gray-400 hover:border-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Expert Cards */}
        <div className="flex flex-col gap-4">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} onEnter={onEnterRoom} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ExpertCard({ expert, onEnter }: { expert: Expert; onEnter: (e: Expert) => void }) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-4 relative overflow-hidden">
      {/* Badge */}
      <span
        className={`absolute top-0 right-0 ${expert.badgeColor} text-white text-[11px] font-semibold px-3 py-1 rounded-tr-2xl rounded-bl-xl`}
      >
        {expert.badge}
      </span>

      {/* Expert info */}
      <div className="flex items-center gap-3 mb-3 mr-20">
        <div
          className={`w-12 h-12 rounded-full border-2 ${expert.borderColor} bg-[#2a2a2a] flex items-center justify-center text-sm font-bold flex-shrink-0`}
        >
          {expert.initials}
        </div>
        <div>
          <p className="text-base font-bold leading-tight">{expert.name}</p>
          <p className="text-xs text-gray-400">{expert.role}</p>
        </div>
      </div>

      {/* Live match score — only for live expert */}
      {expert.isLive && (
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2.5 mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
              LIVE
            </span>
            <span className="text-[11px] text-gray-400">Match 23 &nbsp; IPL 2026</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-pink-500">RCB 156/3</span>
            <span className="text-xs text-gray-500">vs</span>
            <span className="text-sm font-bold text-blue-400">158/4 MI</span>
          </div>
          <p className="text-[10px] text-gray-600 text-center">
            M. Chinnaswamy Stadium, Bengaluru
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="flex justify-between mb-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold">▲ {expert.watching}</span>
          <span className="text-[10px] text-gray-500">Watching</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-green-400">↑ {expert.engagement}</span>
          <span className="text-[10px] text-gray-500">Engagement</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-green-400">● {expert.active}</span>
          <span className="text-[10px] text-gray-500">Active</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => onEnter(expert)}
        className="w-full py-3 rounded-full text-white text-sm font-bold transition-all active:scale-95 hover:opacity-90"
        style={{ background: "linear-gradient(90deg, #e91e63, #ff5722)" }}
      >
        Enter Watch Room →
      </button>
    </div>
  );
}