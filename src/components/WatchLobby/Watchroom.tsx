// "use client";

// import { useState } from "react";
// import type { Expert } from "./WatchAlongLobby";
// import { ArrowLeft } from "lucide-react";

// import LiveChat   from "./LiveChat";
// import Prediction from "./Prediction";
// import FlashQuiz from "./Flashquiz";
// import EmojiStorm from "./Emojistorm";

// const actionTabs = ["Prediction", "Flash Quiz", "Live Chat", "Emoji Storm"];

// type Props = {
//   expert: Expert;
//   onBack: () => void;
// };

// function TabContent({ activeIndex }: { activeIndex: number }) {
//   switch (activeIndex) {
//     case 0: return <Prediction matchId={currentMatch.id}/>;
//     case 1: return <FlashQuiz />;
//     case 2: return <LiveChat />;
//     case 3: return <EmojiStorm />;
//     default: return null;
//   }
// }

// export default function WatchRoom({ expert, onBack }: Props) {
//   const [activeAction, setActiveAction] = useState(0);

//   return (
//     <div className="min-h-screen bg-[#111] text-white font-sans flex flex-col">

//       {/* ── Shared header ── */}
//       <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-[#222]">
//         <button
//           className="text-white hover:text-pink-500 transition cursor-pointer"
//           onClick={onBack}
//         >
//           <ArrowLeft size={20} />
//         </button>
//         <div className="flex items-center gap-2">
//           <span className="bg-pink-600 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
//             <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
//             LIVE
//           </span>
//           <span className="text-sm font-bold">{expert.name}</span>
//         </div>
//         <button className="text-gray-400 hover:text-white text-lg transition-colors">⊕</button>
//       </div>

//       {/* ── Score bar ── */}
//       <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 border-b border-[#222]">
//         <span className="text-sm font-bold text-pink-500">RCB&nbsp;156/3</span>
//         <span className="text-[11px] text-gray-500">(15.2 ov)</span>
//         <span className="text-[11px] text-gray-500">(20 ov)</span>
//         <span className="text-sm font-bold text-blue-400">158/4&nbsp;MI</span>
//       </div>

//       <div className="flex flex-col lg:flex-row flex-1 min-h-0">

//         {/* ── LEFT: video + action tabs ── */}
//         <div className="flex flex-col lg:flex-1 lg:min-w-0">

//           {/* Video player */}
//           <div className="relative bg-[#1a0a14] w-full aspect-video overflow-hidden">
//             <div className="absolute inset-0 flex items-center justify-center">
//               <button className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-all active:scale-95">
//                 <span className="text-2xl ml-1">▶</span>
//               </button>
//             </div>

//             {/* RCB label */}
//             <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-700 rounded-lg px-3 py-1.5 text-xs font-bold opacity-90">
//               RCB
//             </div>

//             {/* MI label */}
//             <div className="absolute right-4 top-1/2 -translate-y-1/2">
//               <div
//                 className={`w-10 h-10 rounded-full border-2 ${expert.borderColor} bg-[#111] flex items-center justify-center text-xs font-bold text-blue-400`}
//               >
//                 MI
//               </div>
//             </div>

//             {/* Live prediction pill */}
//             <div className="absolute bottom-2.5 left-3 bg-black/80 rounded-full px-3 py-1 text-[11px] flex items-center gap-1.5">
//               <span className="text-pink-500 text-[8px]">▲</span>
//               <span className="text-gray-300">Live Prediction •</span>
//               <span className="text-pink-500 font-bold">00:19</span>
//             </div>

//             {/* Expert avatar */}
//             <div className="absolute bottom-2.5 right-3 flex flex-col items-center gap-0.5">
//               <div
//                 className={`w-9 h-9 rounded-full border-2 ${expert.borderColor} bg-[#333] flex items-center justify-center text-[10px] font-bold`}
//               >
//                 {expert.initials}
//               </div>
//               <span className="text-[9px] text-white">{expert.name.split(" ")[0]}</span>
//             </div>
//           </div>

//           {/* Action tabs */}
//           <div className="flex gap-2 px-4 sm:px-6 py-3 overflow-x-auto scrollbar-hide border-b border-[#222]">
//             {actionTabs.map((tab, i) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveAction(i)}
//                 className={`flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${
//                   activeAction === i
//                     ? "bg-pink-600 text-white"
//                     : "bg-[#222] text-gray-400 hover:bg-[#2a2a2a]"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Mobile/tablet: tab content inline below tabs */}
//           <div className="flex flex-col flex-1 min-h-0 lg:hidden">
//             <TabContent activeIndex={activeAction} />
//           </div>
//         </div>

//         {/* ── RIGHT: tab content sidebar — desktop only ── */}
//         <div className="hidden lg:flex lg:flex-col lg:w-[360px] xl:w-[400px] border-l border-[#222]">
//           <TabContent activeIndex={activeAction} />
//         </div>

//       </div>
//     </div>
//   );
// }









// // components/watch-along/WatchRoom.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft } from "lucide-react";
// import { useWatchAlong, Room, Match } from "@/context/WatchAlongContext"
// import LiveChat from "./LiveChat";
// import Prediction from "./Prediction";
// import FlashQuiz from "./Flashquiz";
// import EmojiStorm from "./Emojistorm";

// const actionTabs = ["Prediction", "Flash Quiz", "Live Chat", "Emoji Storm"];

// type Props = {
//   room: Room;
//   onBack: () => void;
// };

// function TabContent({ 
//   activeIndex, 
//   matchId 
// }: { 
//   activeIndex: number; 
//   matchId: string;
// }) {
//   switch (activeIndex) {
//     case 0: return <Prediction matchId={matchId} />;
//     case 1: return <FlashQuiz matchId={matchId} />;
//     case 2: return <LiveChat matchId={matchId} />;
//     case 3: return <EmojiStorm matchId={matchId} />;
//     default: return null;
//   }
// }

// export default function WatchRoom({ room, onBack }: Props) {
//   const [activeAction, setActiveAction] = useState(0);
//   const { matches, fetchMatches, fetchMatchById, currentMatch, setCurrentMatch } = useWatchAlong();
//   const [liveMatch, setLiveMatch] = useState<Match | null>(null);

//   // Fetch match details when room has liveMatchId
//   useEffect(() => {
//     if (room.liveMatchId) {
//       fetchMatchById(room.liveMatchId);
//     }
//   }, [room.liveMatchId, fetchMatchById]);

//   // Update local match state when currentMatch changes
//   useEffect(() => {
//     if (currentMatch?.id === room.liveMatchId) {
//       setLiveMatch(currentMatch);
//     }
//   }, [currentMatch, room.liveMatchId]);

//   // Get user initials for avatar
//   const getUserInitials = (name: string) => {
//     return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
//   };

//   // Format overs display
//   const formatOvers = (overs: string) => {
//     if (!overs) return "0.0 ov";
//     return overs;
//   };

//   return (
//     <div className="min-h-screen bg-[#111] text-white font-sans flex flex-col">

//       {/* ── Shared header ── */}
//       <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-[#222]">
//         <button
//           className="text-white hover:text-pink-500 transition cursor-pointer"
//           onClick={onBack}
//         >
//           <ArrowLeft size={20} />
//         </button>
//         <div className="flex items-center gap-2">
//           {room.isLive && (
//             <span className="bg-pink-600 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
//               <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
//               LIVE
//             </span>
//           )}
//           <span className="text-sm font-bold">{room.name}</span>
//         </div>
//         <button className="text-gray-400 hover:text-white text-lg transition-colors">⊕</button>
//       </div>

//       {/* ── Score bar ── */}
//       <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 border-b border-[#222]">
//         {liveMatch ? (
//           <>
//             <span className="text-sm font-bold text-pink-500">
//               {liveMatch.team1?.name || "TBD"}&nbsp;{liveMatch.team1?.score || "0/0"}
//             </span>
//             <span className="text-[11px] text-gray-500">
//               {formatOvers(liveMatch.team1?.overs)}
//             </span>
//             <span className="text-[11px] text-gray-500">
//               {formatOvers(liveMatch.team2?.overs)}
//             </span>
//             <span className="text-sm font-bold text-blue-400">
//               {liveMatch.team2?.score || "0/0"}&nbsp;{liveMatch.team2?.name || "TBD"}
//             </span>
//           </>
//         ) : (
//           <>
//             <span className="text-sm font-bold text-pink-500">Waiting for match data...</span>
//             <span className="text-[11px] text-gray-500">-</span>
//             <span className="text-[11px] text-gray-500">-</span>
//             <span className="text-sm font-bold text-blue-400">...</span>
//           </>
//         )}
//       </div>

//       <div className="flex flex-col lg:flex-row flex-1 min-h-0">

//         {/* ── LEFT: video + action tabs ── */}
//         <div className="flex flex-col lg:flex-1 lg:min-w-0">

//           {/* Video player */}
//           <div className="relative bg-[#1a0a14] w-full aspect-video overflow-hidden">
//             <div className="absolute inset-0 flex items-center justify-center">
//               <button className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-all active:scale-95">
//                 <span className="text-2xl ml-1">▶</span>
//               </button>
//             </div>

//             {/* Team 1 label (RCB) */}
//             {liveMatch && (
//               <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-700 rounded-lg px-3 py-1.5 text-xs font-bold opacity-90">
//                 {liveMatch.team1?.name || "Team 1"}
//               </div>
//             )}

//             {/* Team 2 label (MI) */}
//             {liveMatch && (
//               <div className="absolute right-4 top-1/2 -translate-y-1/2">
//                 <div
//                   className={`w-10 h-10 rounded-full border-2 ${room.borderColor} bg-[#111] flex items-center justify-center text-xs font-bold text-blue-400`}
//                 >
//                   {liveMatch.team2?.name || "T2"}
//                 </div>
//               </div>
//             )}

//             {/* Live prediction pill */}
//             <div className="absolute bottom-2.5 left-3 bg-black/80 rounded-full px-3 py-1 text-[11px] flex items-center gap-1.5">
//               <span className="text-pink-500 text-[8px]">▲</span>
//               <span className="text-gray-300">Live Prediction •</span>
//               <span className="text-pink-500 font-bold">00:19</span>
//             </div>

//             {/* Expert avatar */}
//             <div className="absolute bottom-2.5 right-3 flex flex-col items-center gap-0.5">
//               <div
//                 className={`w-9 h-9 rounded-full border-2 ${room.borderColor} bg-[#333] flex items-center justify-center text-[10px] font-bold overflow-hidden`}
//               >
//                 {room.displayPicture ? (
//                   <img 
//                     src={room.displayPicture} 
//                     alt={room.name}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   getUserInitials(room.name)
//                 )}
//               </div>
//               <span className="text-[9px] text-white">{room.name.split(" ")[0]}</span>
//             </div>
//           </div>

//           {/* Action tabs */}
//           <div className="flex gap-2 px-4 sm:px-6 py-3 overflow-x-auto scrollbar-hide border-b border-[#222]">
//             {actionTabs.map((tab, i) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveAction(i)}
//                 className={`flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${
//                   activeAction === i
//                     ? "bg-pink-600 text-white"
//                     : "bg-[#222] text-gray-400 hover:bg-[#2a2a2a]"
//                 }`}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Mobile/tablet: tab content inline below tabs */}
//           <div className="flex flex-col flex-1 min-h-0 lg:hidden">
//             <TabContent activeIndex={activeAction} matchId={room.liveMatchId} />
//           </div>
//         </div>

//         {/* ── RIGHT: tab content sidebar — desktop only ── */}
//         <div className="hidden lg:flex lg:flex-col lg:w-[360px] xl:w-[400px] border-l border-[#222]">
//           <TabContent activeIndex={activeAction} matchId={room.liveMatchId} />
//         </div>

//       </div>
//     </div>
//   );
// }







// components/watch-along/WatchRoom.tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useWatchAlong, Room, Match } from "@/context/WatchAlongContext";
import Prediction from "@/src/components/WatchLobby/Prediction";
import FlashQuiz from "@/src/components/WatchLobby/Flashquiz";
import LiveChat from "@/src/components/WatchLobby/LiveChat";
import EmojiStorm from "@/src/components/WatchLobby/Emojistorm";

const actionTabs = ["Prediction", "Flash Quiz", "Live Chat", "Emoji Storm"];

type Props = {
  room: Room;
  onBack: () => void;
};

function TabContent({ 
  activeIndex, 
  matchId 
}: { 
  activeIndex: number; 
  matchId: string | undefined;  // Allow undefined
}) {
  // Don't render if matchId is not available
  if (!matchId) {
    return (
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500 text-sm">Waiting for match data...</p>
        </div>
      </div>
    );
  }

  switch (activeIndex) {
    case 0: return <Prediction matchId={matchId} />;
    case 1: return <FlashQuiz matchId={matchId} />;
    case 2: return <LiveChat matchId={matchId} />;
    case 3: return <EmojiStorm matchId={matchId} />;
    default: return null;
  }
}

export default function WatchRoom({ room, onBack }: Props) {
  const [activeAction, setActiveAction] = useState(0);
  const { fetchMatchById, currentMatch } = useWatchAlong();
  const [liveMatch, setLiveMatch] = useState<Match | null>(null);
  const [isLoadingMatch, setIsLoadingMatch] = useState(false);

  // Fetch match details when room has liveMatchId
  useEffect(() => {
    const loadMatch = async () => {
      if (room?.liveMatchId && !liveMatch) {
        setIsLoadingMatch(true);
        try {
          await fetchMatchById(room.liveMatchId);
        } catch (error) {
          console.error("Failed to fetch match:", error);
        } finally {
          setIsLoadingMatch(false);
        }
      }
    };
    
    loadMatch();
  }, [room?.liveMatchId, fetchMatchById, liveMatch]);

  // Update local match state when currentMatch changes
  useEffect(() => {
    if (currentMatch?.id === room?.liveMatchId) {
      setLiveMatch(currentMatch);
    }
  }, [currentMatch, room?.liveMatchId]);

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Format overs display
  const formatOvers = (overs: string) => {
    if (!overs) return "0.0 ov";
    return overs;
  };

  // Show loading state while room is being loaded
  if (!room) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white font-sans flex flex-col">

      {/* ── Shared header ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 border-b border-[#222]">
        <button
          className="text-white hover:text-pink-500 transition cursor-pointer"
          onClick={onBack}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          {room.isLive && (
            <span className="bg-pink-600 text-white text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
              LIVE
            </span>
          )}
          <span className="text-sm font-bold">{room.name || "Watch Room"}</span>
        </div>
        <button className="text-gray-400 hover:text-white text-lg transition-colors">⊕</button>
      </div>

      {/* ── Score bar ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2 border-b border-[#222]">
        {isLoadingMatch ? (
          <>
            <span className="text-sm text-gray-400">Loading match...</span>
            <span className="text-[11px] text-gray-500">-</span>
            <span className="text-[11px] text-gray-500">-</span>
            <span className="text-sm text-gray-400">...</span>
          </>
        ) : liveMatch ? (
          <>
            <span className="text-sm font-bold text-pink-500">
              {liveMatch.team1?.name || "TBD"}&nbsp;{liveMatch.team1?.score || "0/0"}
            </span>
            <span className="text-[11px] text-gray-500">
              {formatOvers(liveMatch.team1?.overs)}
            </span>
            <span className="text-[11px] text-gray-500">
              {formatOvers(liveMatch.team2?.overs)}
            </span>
            <span className="text-sm font-bold text-blue-400">
              {liveMatch.team2?.score || "0/0"}&nbsp;{liveMatch.team2?.name || "TBD"}
            </span>
          </>
        ) : (
          <>
            <span className="text-sm font-bold text-pink-500">Waiting for match data...</span>
            <span className="text-[11px] text-gray-500">-</span>
            <span className="text-[11px] text-gray-500">-</span>
            <span className="text-sm font-bold text-blue-400">...</span>
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0">

        {/* ── LEFT: video + action tabs ── */}
        <div className="flex flex-col lg:flex-1 lg:min-w-0">

          {/* Video player */}
          <div className="relative bg-[#1a0a14] w-full aspect-video overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-all active:scale-95">
                <span className="text-2xl ml-1">▶</span>
              </button>
            </div>

            {/* Team 1 label */}
            {liveMatch && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-700 rounded-lg px-3 py-1.5 text-xs font-bold opacity-90">
                {liveMatch.team1?.name || "Team 1"}
              </div>
            )}

            {/* Team 2 label */}
            {liveMatch && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div
                  className={`w-10 h-10 rounded-full border-2 ${room.borderColor || "border-pink-500"} bg-[#111] flex items-center justify-center text-xs font-bold text-blue-400`}
                >
                  {liveMatch.team2?.name?.slice(0, 2) || "T2"}
                </div>
              </div>
            )}

            {/* Live prediction pill */}
            <div className="absolute bottom-2.5 left-3 bg-black/80 rounded-full px-3 py-1 text-[11px] flex items-center gap-1.5">
              <span className="text-pink-500 text-[8px]">▲</span>
              <span className="text-gray-300">Live Prediction •</span>
              <span className="text-pink-500 font-bold">00:19</span>
            </div>

            {/* Expert avatar */}
            <div className="absolute bottom-2.5 right-3 flex flex-col items-center gap-0.5">
              <div
                className={`w-[150px] h-[150px] rounded-full border-2 ${room.borderColor || "border-pink-500"} bg-[#333] flex items-center justify-center text-[10px] font-bold overflow-hidden`}
              >
                {room.displayPicture ? (
                  <img 
                    src={room.displayPicture} 
                    alt={room.name}
                    className="w-[150px] h-[150px] object-cover"
                  />
                ) : (
                  getUserInitials(room.name)
                )}
              </div>
              <span className="text-[12px] text-white">{room.name?.split(" ")[0] || "Expert"}</span>
            </div>
          </div>

          {/* Action tabs */}
          <div className="flex gap-2 px-4 sm:px-6 py-3 overflow-x-auto scrollbar-hide border-b border-[#222]">
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

          {/* Mobile/tablet: tab content inline below tabs */}
          <div className="flex flex-col flex-1 min-h-0 lg:hidden">
            <TabContent activeIndex={activeAction} matchId={room.liveMatchId} />
          </div>
        </div>

        {/* ── RIGHT: tab content sidebar — desktop only ── */}
        <div className="hidden lg:flex lg:flex-col lg:w-[360px] xl:w-[400px] border-l border-[#222]">
          <TabContent activeIndex={activeAction} matchId={room.liveMatchId} />
        </div>

      </div>
    </div>
  );
}