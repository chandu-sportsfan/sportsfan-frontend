"use client";

import { useState } from "react";
import { LeaderboardEntry } from "@/types/Polls";

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_GLOBAL: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "u1",
    username: "CricketKing99",
    initials: "CK",
    avatarColor: "#7c3aed",
    totalPoints: 1240,
    correctPredictions: 18,
    totalPredictions: 20,
    rankChange: 2,
    streak: "Perfect streak",
  },
  {
    rank: 2,
    userId: "u2",
    username: "RCBForever",
    initials: "RF",
    avatarColor: "#dc2626",
    totalPoints: 1180,
    correctPredictions: 17,
    totalPredictions: 20,
    rankChange: 1,
  },
  {
    rank: 3,
    userId: "u3",
    username: "MI_Paltan",
    initials: "MP",
    avatarColor: "#0284c7",
    totalPoints: 1050,
    correctPredictions: 15,
    totalPredictions: 20,
    rankChange: -1,
  },
  {
    rank: 4,
    userId: "u4",
    username: "KKR_Superfan",
    initials: "KS",
    avatarColor: "#854d0e",
    totalPoints: 990,
    correctPredictions: 14,
    totalPredictions: 20,
    rankChange: 3,
  },
  {
    rank: 5,
    userId: "u5",
    username: "CSK_Whistle",
    initials: "CW",
    avatarColor: "#ca8a04",
    totalPoints: 920,
    correctPredictions: 13,
    totalPredictions: 20,
    rankChange: -2,
  },
];

const MOCK_FRIENDS: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "f1",
    username: "Priya_IPL",
    initials: "PI",
    avatarColor: "#0891b2",
    totalPoints: 760,
    correctPredictions: 11,
    totalPredictions: 16,
    rankChange: 1,
  },
  {
    rank: 2,
    userId: "f2",
    username: "Arjun_Bets",
    initials: "AB",
    avatarColor: "#16a34a",
    totalPoints: 640,
    correctPredictions: 9,
    totalPredictions: 16,
    rankChange: 0,
  },
  {
    rank: 3,
    userId: "me",
    username: "You",
    initials: "YO",
    avatarColor: "#e91e8c",
    totalPoints: 520,
    correctPredictions: 8,
    totalPredictions: 16,
    pointsToday: 120,
    rankChange: 4,
    isCurrentUser: true,
  },
];

const MOCK_MY_TEAM: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "t1",
    username: "TeamCaptain",
    initials: "TC",
    avatarColor: "#7c3aed",
    totalPoints: 880,
    correctPredictions: 13,
    totalPredictions: 16,
    rankChange: 0,
  },
  {
    rank: 2,
    userId: "me",
    username: "You",
    initials: "YO",
    avatarColor: "#e91e8c",
    totalPoints: 520,
    correctPredictions: 8,
    totalPredictions: 16,
    pointsToday: 120,
    rankChange: 4,
    isCurrentUser: true,
  },
];

const MOCK_DATA: Record<string, LeaderboardEntry[]> = {
  Global: MOCK_GLOBAL,
  Friends: MOCK_FRIENDS,
  "My Team": MOCK_MY_TEAM,
};

const TABS = ["Global", "Friends", "My Team"] as const;
type Tab = (typeof TABS)[number];

// ─── Medal icon ────────────────────────────────────────────────────────────────

function Medal({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-base">🥇</span>;
  if (rank === 2) return <span className="text-base">🥈</span>;
  if (rank === 3) return <span className="text-base">🥉</span>;
  return null;
}

// ─── Single row ────────────────────────────────────────────────────────────────

function LeaderRow({ entry, currentUserRank }: { entry: LeaderboardEntry; currentUserRank?: number }) {
  const showRank = entry.rank <= 3;

  return (
    <div
      className={[
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
        entry.isCurrentUser
          ? "bg-[#e91e8c]/8 border border-[#e91e8c]/20"
          : "hover:bg-white/4",
      ].join(" ")}
    >
      {/* Rank */}
      <div className="w-7 flex-shrink-0 flex items-center justify-center">
        {showRank ? (
          <Medal rank={entry.rank} />
        ) : (
          <span className="text-xs text-white/30 font-mono">
            {entry.isCurrentUser && currentUserRank ? `#${currentUserRank}` : `#${entry.rank}`}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
        style={{ backgroundColor: entry.avatarColor }}
      >
        {entry.initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className={[
            "text-sm font-semibold truncate",
            entry.isCurrentUser ? "text-[#e879f9]" : "text-white",
          ].join(" ")}
        >
          {entry.username}
        </p>
        <p className="text-[11px] text-white/35 truncate">
          {entry.correctPredictions}/{entry.totalPredictions} correct
          {entry.streak ? ` · ${entry.streak}` : ""}
          {entry.isCurrentUser && entry.pointsToday
            ? ` · +${entry.pointsToday} today`
            : ""}
        </p>
      </div>

      {/* Points + rank change */}
      <div className="flex-shrink-0 text-right">
        <p className="text-sm font-black text-white">{entry.totalPoints}</p>
        {entry.rankChange !== undefined && entry.rankChange !== 0 && (
          <p
            className={[
              "text-[10px] font-semibold",
              entry.rankChange > 0 ? "text-emerald-400" : "text-red-400",
            ].join(" ")}
          >
            {entry.rankChange > 0 ? `▲ ${entry.rankChange}` : `▼ ${Math.abs(entry.rankChange)}`}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Leaderboard ──────────────────────────────────────────────────────────

export interface PredictionLeaderboardProps {
  totalParticipants?: number;
  currentUserRank?: number;
  currentUserPoints?: number;
}

export default function PredictionLeaderboard({
  totalParticipants = 12841,
  currentUserRank = 247,
  currentUserPoints = 520,
}: PredictionLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Global");
  const entries = MOCK_DATA[activeTab];
  const currentUser = entries.find((e) => e.isCurrentUser);
  const topEntries = entries.filter((e) => !e.isCurrentUser).slice(0, 5);
  const hiddenCount = Math.max(0, entries.filter((e) => !e.isCurrentUser).length - topEntries.length);

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-[#0d0d1a] border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-[#0a0a16]">
        <div>
          <h2 className="text-base font-bold text-white">Fan Prediction Board</h2>
          <p className="text-[11px] text-white/35 mt-0.5">
            {totalParticipants.toLocaleString()} participants · Updates live
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-white/35">Your rank</p>
          <p className="text-sm font-black text-[#e879f9]">#{currentUserRank}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-3 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
              activeTab === tab
                ? "bg-[#e91e8c] text-white"
                : "bg-white/6 text-white/50 hover:bg-white/10 hover:text-white/80",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="px-2 pb-2 space-y-0.5">
        {topEntries.map((entry) => (
          <LeaderRow key={entry.userId} entry={entry} currentUserRank={currentUserRank} />
        ))}

        {/* Hidden rows indicator */}
        {hiddenCount > 0 && (
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-7" />
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-white/8" />
              ))}
            </div>
            <p className="text-[11px] text-white/30">{hiddenCount} more fans</p>
          </div>
        )}

        {/* Divider */}
        {currentUser && <div className="my-1 border-t border-white/6" />}

        {/* Current user pinned at bottom */}
        {currentUser && (
          <LeaderRow entry={currentUser} currentUserRank={currentUserRank} />
        )}
      </div>
    </div>
  );
}