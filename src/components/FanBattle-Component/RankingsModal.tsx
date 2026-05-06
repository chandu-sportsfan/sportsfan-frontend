"use client";

import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type TabType = "live" | "lifetime" | "community";

interface Athlete {
  rank: number;
  name: string;
  sport: string;
  points: number;
  avatarColor: string;
  avatarInitial: string;
  ringColor: string;
}

interface ChatMessage {
  id: number;
  username: string;
  avatarSrc?: string;
  avatarColor: string;
  avatarInitial: string;
  timeAgo: string;
  message: string;
  reactions: string[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const LIVE_ATHLETES: Athlete[] = [
  { rank: 1, name: "Neeraj Chopra", sport: "Javelin Throw", points: 52800, avatarColor: "#e65100", avatarInitial: "N", ringColor: "#ff9800" },
  { rank: 2, name: "Lakshya Sen", sport: "Badminton", points: 38900, avatarColor: "#1565c0", avatarInitial: "L", ringColor: "#2196f3" },
  { rank: 3, name: "Tejaswin Shankar", sport: "High Jump", points: 31516, avatarColor: "#2e7d32", avatarInitial: "T", ringColor: "#00e676" },
  { rank: 4, name: "Shaili Singh", sport: "Long Jump", points: 28400, avatarColor: "#6a1b9a", avatarInitial: "S", ringColor: "#e91e8c" },
  { rank: 5, name: "Avinash Sable", sport: "3000m Steeplechase", points: 24950, avatarColor: "#ad1457", avatarInitial: "A", ringColor: "#e91e8c" },
  { rank: 6, name: "Sreeshankar M", sport: "Long Jump", points: 23458, avatarColor: "#4527a0", avatarInitial: "S", ringColor: "#7c4dff" },
  { rank: 7, name: "Dutee Chand", sport: "100m Sprint", points: 19200, avatarColor: "#00695c", avatarInitial: "D", ringColor: "#00bfa5" },
  { rank: 8, name: "Hima Das", sport: "400m Sprint", points: 17650, avatarColor: "#e65100", avatarInitial: "H", ringColor: "#ff9800" },
];

const LIFETIME_ATHLETES: Athlete[] = [
  { rank: 1, name: "Neeraj Chopra", sport: "Javelin Throw", points: 53821, avatarColor: "#e65100", avatarInitial: "N", ringColor: "#ff9800" },
  { rank: 2, name: "Lakshya Sen", sport: "Badminton", points: 40658, avatarColor: "#1565c0", avatarInitial: "L", ringColor: "#2196f3" },
  { rank: 3, name: "Tejaswin Shankar", sport: "High Jump", points: 33536, avatarColor: "#2e7d32", avatarInitial: "T", ringColor: "#00e676" },
  { rank: 4, name: "Shaili Singh", sport: "Long Jump", points: 30169, avatarColor: "#6a1b9a", avatarInitial: "S", ringColor: "#e91e8c" },
  { rank: 5, name: "Avinash Sable", sport: "3000m Steeplechase", points: 26716, avatarColor: "#ad1457", avatarInitial: "A", ringColor: "#e91e8c" },
  { rank: 6, name: "Sreeshankar M", sport: "Long Jump", points: 24466, avatarColor: "#4527a0", avatarInitial: "S", ringColor: "#7c4dff" },
  { rank: 7, name: "Dutee Chand", sport: "100m Sprint", points: 21800, avatarColor: "#00695c", avatarInitial: "D", ringColor: "#00bfa5" },
  { rank: 8, name: "Hima Das", sport: "400m Sprint", points: 19340, avatarColor: "#e65100", avatarInitial: "H", ringColor: "#ff9800" },
];

const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    username: "Fan_Army",
    avatarColor: "#e65100",
    avatarInitial: "F",
    timeAgo: "Just now",
    message: "Rashid Khan sneaking up! 🎒",
    reactions: ["🎒"],
  },
  {
    id: 2,
    username: "Arjun_MI",
    avatarColor: "#1565c0",
    avatarInitial: "A",
    timeAgo: "2m ago",
    message: "🔥 Rohit on fire! Moving up!",
    reactions: ["🔥", "💪"],
  },
  {
    id: 3,
    username: "Priya_RCB",
    avatarColor: "#ad1457",
    avatarInitial: "P",
    timeAgo: "3m ago",
    message: "King Kohli always on top! 👑",
    reactions: ["👑", "❤️"],
  },
  {
    id: 4,
    username: "Rahul_CSK",
    avatarColor: "#f9a825",
    avatarInitial: "R",
    timeAgo: "4m ago",
    message: "Thala for a reason! 💛",
    reactions: ["💛", "✏️"],
  },
  {
    id: 5,
    username: "Cricket_Dev",
    avatarColor: "#2e7d32",
    avatarInitial: "C",
    timeAgo: "6m ago",
    message: "Bumrah is unstoppable tonight! 🎯",
    reactions: ["🎯", "🔥"],
  },
  {
    id: 6,
    username: "IPL_Maniac",
    avatarColor: "#6a1b9a",
    avatarInitial: "I",
    timeAgo: "8m ago",
    message: "MI always bounce back 💙",
    reactions: ["💙"],
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const LightningIcon = ({ color = "#ff6d00" }: { color?: string }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill={color}>
    <path d="M13 2L4.09 12.96H11L10 22L20.91 11.04H14L13 2Z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const SmileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const InviteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar: React.FC<{ color: string; initial: string; size?: number; rank?: number; ringColor?: string }> = ({
  color, initial, size = 40, rank, ringColor,
}) => (
  <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
    {/* Ring */}
    {ringColor && (
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${ringColor} 0% 75%, #2a2a2a 75% 100%)`,
          padding: "2.5px",
          borderRadius: "50%",
        }}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center text-white font-bold"
          style={{
            backgroundColor: color,
            fontSize: size * 0.38,
          }}
        >
          {initial}
        </div>
      </div>
    )}
    {!ringColor && (
      <div
        className="w-full h-full rounded-full flex items-center justify-center text-white font-bold"
        style={{ backgroundColor: color, fontSize: size * 0.38 }}
      >
        {initial}
      </div>
    )}
    {/* Rank badge */}
    {rank !== undefined && (
      <div
        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold border border-[#121212]"
        style={{
          backgroundColor: rank <= 3 ? "#ff6d00" : "#3a3a3a",
          fontSize: 8,
        }}
      >
        {rank}
      </div>
    )}
  </div>
);

// ─── Rank Number ─────────────────────────────────────────────────────────────
const RankBadge: React.FC<{ rank: number }> = ({ rank }) => (
  <span
    className="text-[15px] font-black w-8 text-center flex-shrink-0"
    style={{ color: rank <= 3 ? "#ffa726" : "#666" }}
  >
    #{rank}
  </span>
);

// ─── Athlete Row ─────────────────────────────────────────────────────────────
const AthleteRow: React.FC<{ athlete: Athlete; isTop3: boolean }> = ({ athlete, isTop3 }) => (
  <div
    className={`flex items-center gap-3 px-4 py-3.5 border-b border-[#1e1e1e] ${
      isTop3 ? "bg-[#161616]" : ""
    }`}
  >
    <RankBadge rank={athlete.rank} />
    <Avatar
      color={athlete.avatarColor}
      initial={athlete.avatarInitial}
      size={42}
      rank={athlete.rank}
      ringColor={isTop3 ? athlete.ringColor : undefined}
    />
    <div className="flex-1 min-w-0">
      <p className="text-white text-[13px] font-semibold truncate">{athlete.name}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: athlete.ringColor }}
        />
        <span className="text-[#666] text-[11px]">{athlete.sport}</span>
      </div>
    </div>
    <div className="flex items-center gap-1 flex-shrink-0">
      <LightningIcon color={isTop3 ? "#ff6d00" : "#ff6d00"} />
      <span className="text-[#ff6d00] text-[14px] font-black">
        {athlete.points.toLocaleString()}
      </span>
    </div>
  </div>
);

// ─── Chat Message ─────────────────────────────────────────────────────────────
const ChatBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => (
  <div className="flex items-start gap-3 px-4 py-3">
    <Avatar color={msg.avatarColor} initial={msg.avatarInitial} size={38} />
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-white text-[13px] font-bold">{msg.username}</span>
        <span className="text-[#555] text-[10px]">{msg.timeAgo}</span>
      </div>
      <div className="inline-block bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl rounded-tl-sm px-3 py-2 max-w-[80%]">
        <p className="text-[#e0e0e0] text-[13px] leading-relaxed">{msg.message}</p>
      </div>
      {/* Reaction pills */}
      {msg.reactions.length > 0 && (
        <div className="flex gap-1.5 mt-1.5">
          {msg.reactions.map((r, i) => (
            <button
              key={i}
              className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-full px-2 py-0.5 text-[13px] transition-colors"
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

// ─── Main Modal ───────────────────────────────────────────────────────────────
interface RankingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RankingsModal: React.FC<RankingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>("live");
  const [search, setSearch] = useState("");
  const [chatInput, setChatInput] = useState("");

  if (!isOpen) return null;

  const athletes = activeTab === "live" ? LIVE_ATHLETES : LIFETIME_ATHLETES;
  const filtered = athletes.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.sport.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#121212]">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3 bg-[#121212]">
        <div>
          <h2 className="text-white text-[18px] font-black leading-tight">
            {activeTab === "community" ? "Live Community" : "Rankings"}
          </h2>
          <p className="text-[#555] text-[11px] mt-0.5">
            {activeTab === "live"
              ? "Live Rankings"
              : activeTab === "lifetime"
              ? "All-Time Rankings"
              : "Community Chat"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-[#1e1e1e] hover:bg-[#2a2a2a] flex items-center justify-center transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex gap-0 px-4 mb-0 border-b border-[#1e1e1e]">
        {(["live", "lifetime", "community"] as TabType[]).map((tab) => {
          const label = tab === "live" ? "Live" : tab === "lifetime" ? "Lifetime" : "Live Community";
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex items-center gap-1.5 px-4 py-3 text-[13px] font-semibold transition-colors ${
                isActive ? "text-white" : "text-[#555] hover:text-[#888]"
              }`}
            >
              {(tab === "live" || tab === "community") && (
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    tab === "live" ? "bg-[#00e676]" : "bg-[#00e676]"
                  } ${isActive ? "animate-pulse" : "opacity-50"}`}
                />
              )}
              {label}
              {/* Active underline */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full"
                  style={{
                    background:
                      tab === "live"
                        ? "#ff6d00"
                        : tab === "lifetime"
                        ? "#ff6d00"
                        : "#00e676",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Rankings tabs */}
        {(activeTab === "live" || activeTab === "lifetime") && (
          <>
            {/* Search + Share row */}
            <div className="flex gap-2 px-4 py-3">
              <div className="flex-1 flex items-center gap-2 bg-[#1a1a1a] border border-[#252525] rounded-xl px-3 py-2.5">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-white text-[13px] placeholder-[#444] outline-none"
                />
              </div>
              {activeTab === "live" && (
                <button className="flex items-center gap-1.5 bg-[#ff6d00] hover:bg-[#e65100] transition-colors px-3 py-2 rounded-xl text-white text-[12px] font-bold">
                  <ShareIcon />
                  Share
                </button>
              )}
            </div>

            {/* List */}
            <div className="pb-4">
              {filtered.map((a) => (
                <AthleteRow key={a.rank} athlete={a} isTop3={a.rank <= 3} />
              ))}
              {filtered.length === 0 && (
                <p className="text-[#555] text-[13px] text-center py-10">No players found</p>
              )}
            </div>
          </>
        )}

        {/* Community tab */}
        {activeTab === "community" && (
          <>
            {/* Live count + Invite */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e]">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 bg-[#0d2b1a] border border-[#1a4a2a] text-[#00e676] text-[11px] font-bold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse" />
                  Live
                </span>
                <span className="text-[#555] text-[12px]">4 messages</span>
              </div>
              <button className="flex items-center gap-1.5 border border-[#e65100] text-[#e65100] hover:bg-[#1f0f00] transition-colors text-[12px] font-semibold px-3 py-1.5 rounded-xl">
                <InviteIcon />
                Invite
              </button>
            </div>

            {/* Messages */}
            <div className="pb-24">
              {CHAT_MESSAGES.map((msg) => (
                <ChatBubble key={msg.id} msg={msg} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Chat Input (community only) ── */}
      {activeTab === "community" && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#121212] border-t border-[#1e1e1e] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[#1a1a1a] border border-[#252525] rounded-2xl px-4 py-2.5">
              <input
                type="text"
                placeholder="Cheer for your player..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-transparent text-white text-[13px] placeholder-[#444] outline-none"
              />
              <button className="text-[#555] hover:text-[#888] transition-colors">
                <SmileIcon />
              </button>
            </div>
            <button className="w-10 h-10 rounded-full bg-[#ff6d00] hover:bg-[#e65100] active:bg-[#d84315] flex items-center justify-center transition-colors flex-shrink-0">
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingsModal;
