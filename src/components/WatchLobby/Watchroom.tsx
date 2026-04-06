"use client";

import { useState } from "react";
import type { Expert } from "./WatchAlongLobby";

type ChatMessage = {
  user: string;
  time: string;
  text: string;
  color: string;
};

const initialChats: ChatMessage[] = [
  { user: "Rajesh",    time: "00:12", text: "Amazing shot! 🔥",                   color: "text-pink-400"   },
  { user: "Priya",     time: "00:15", text: "What a catch!",                       color: "text-purple-400" },
  { user: "Arjun",     time: "00:18", text: "RCB needs wickets here",              color: "text-orange-400" },
  { user: "Neha",      time: "00:21", text: "Great analysis!",                     color: "text-blue-400"   },
  { user: "Vikram",    time: "00:24", text: "Rohit on fire 🔥",                    color: "text-green-400"  },
  { user: "Siddharth", time: "00:27", text: "This over will decide the game!",     color: "text-pink-400"   },
  { user: "Meera",     time: "00:30", text: "Harsha's commentary is 🔥🔥",        color: "text-orange-400" },
];

const actionTabs = ["Prediction", "Flash Quiz", "Create Poll", "Emoji Storm"];

type Props = {
  expert: Expert;
  onBack: () => void;
};

export default function WatchRoom({ expert, onBack }: Props) {
  const [activeAction, setActiveAction] = useState(0);
  const [chats, setChats] = useState<ChatMessage[]>(initialChats);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    const now = new Date();
    const t = `${now.getMinutes().toString().padStart(2, "0")}:${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
    setChats((prev) => [
      ...prev,
      { user: "You", time: t, text: message, color: "text-pink-400" },
    ]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#111] text-white font-sans flex flex-col">
      <div className="max-w-lg mx-auto w-full flex flex-col flex-1">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#222]">
          <button
            onClick={onBack}
            className="text-xl text-gray-400 hover:text-white transition-colors"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <span className="bg-pink-600 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
              LIVE
            </span>
            <span className="text-sm font-bold">{expert.name}</span>
          </div>
          <button className="text-gray-400 hover:text-white text-lg transition-colors">⊕</button>
        </div>

        {/* Score bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#111] border-b border-[#222]">
          <span className="text-sm font-bold text-pink-500">RCB&nbsp;156/3</span>
          <span className="text-[11px] text-gray-500">(15.2 ov)</span>
          <span className="text-[11px] text-gray-500">(20 ov)</span>
          <span className="text-sm font-bold text-blue-400">158/4&nbsp;MI</span>
        </div>

        {/* Video player */}
        <div className="relative bg-[#1a0a14] w-full aspect-video overflow-hidden">
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-all active:scale-95">
              <span className="text-2xl ml-1">▶</span>
            </button>
          </div>

          {/* RCB label */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-700 rounded-lg px-3 py-1.5 text-xs font-bold opacity-90">
            RCB
          </div>

          {/* MI label */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div
              className={`w-10 h-10 rounded-full border-2 ${expert.borderColor} bg-[#111] flex items-center justify-center text-xs font-bold text-blue-400`}
            >
              MI
            </div>
          </div>

          {/* Live prediction pill */}
          <div className="absolute bottom-2.5 left-3 bg-black/80 rounded-full px-3 py-1 text-[11px] flex items-center gap-1.5">
            <span className="text-pink-500 text-[8px]">▲</span>
            <span className="text-gray-300">Live Prediction •</span>
            <span className="text-pink-500 font-bold">00:19</span>
          </div>

          {/* Expert avatar */}
          <div className="absolute bottom-2.5 right-3 flex flex-col items-center gap-0.5">
            <div
              className={`w-9 h-9 rounded-full border-2 ${expert.borderColor} bg-[#333] flex items-center justify-center text-[10px] font-bold`}
            >
              {expert.initials}
            </div>
            <span className="text-[9px] text-white">{expert.name.split(" ")[0]}</span>
          </div>
        </div>

        {/* Action tabs */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-[#222]">
          {actionTabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveAction(i)}
              className={`flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                activeAction === i
                  ? "bg-pink-600 text-white"
                  : "bg-[#222] text-gray-400 hover:bg-[#2a2a2a]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Live Chat */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold">💬 Live Chat</span>
            <span className="text-sm text-gray-500">2.8k</span>
          </div>

          <div className="flex flex-col gap-3">
            {chats.map((msg, i) => (
              <div key={i}>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-[13px] font-bold ${msg.color}`}>{msg.user}</span>
                  <span className="text-[10px] text-gray-600">{msg.time}</span>
                </div>
                <p className="text-[13px] text-gray-300 mt-0.5">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat input */}
        <div className="flex items-center gap-2.5 px-4 py-3 border-t border-[#222]">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type message..."
            className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-pink-500 transition-colors"
          />
          <button
            onClick={handleSend}
            className="bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}