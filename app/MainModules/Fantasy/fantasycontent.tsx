// "use client";

// import ChallengesSection from "@/src/components/FanBattle-Component/Challengessection";
// import FanBattleCard from "@/src/components/FanBattle-Component/Fanbattlearena";
// import FanBattleHeader from "@/src/components/FanBattle-Component/Fanbattleheader";
// import PlayerPowerCarousel from "@/src/components/FanBattle-Component/PlayerPowerCarousel";
// import RankingsModal from "@/src/components/FanBattle-Component/RankingsModal";
// import React, { useState } from "react";
// import CircleCricketClient from "./fanatsycontent";

// const tabs = [
//   { id: "fan-battle", label: "Fan Battle", hasNew: true },
//   { id: "predictions", label: "Predictions & Polls", hasNew: true },
//   { id: "fantasy", label: "Fantasy Games", hasNew: false },
// ];

// export default function FanBattlePage() {
//   const [isRankingsOpen, setIsRankingsOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("fan-battle");

//   return (
//     <div className="relative overflow-hidden min-h-screen bg-[#121212] flex items-start justify-center">
//       <div className="w-full max-w-6xl mx-auto pt-8 pb-15">
//         {/* Component 1: Header + Hero + Live Banner */}
//         <FanBattleHeader />

//         {/* Tabs Section */}
//         <div className="mt-6 px-4">
//           {/* Tab Bar */}
//           <div className="relative flex items-center gap-1 border-b border-white/10">
//             {tabs.map((tab) => {
//               const isActive = activeTab === tab.id;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`relative flex items-center gap-2 px-5 py-3 text-sm font-semibold tracking-wide transition-all duration-200 whitespace-nowrap
//                     ${isActive
//                       ? "text-white"
//                       : "text-white/40 hover:text-white/70"
//                     }`}
//                 >
//                   {tab.label}

//                   {/* NEW badge */}
//                   {tab.hasNew && (
//                     <span className="flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold tracking-widest uppercase rounded-sm bg-[#FF3B5C] text-white leading-none">
//                       NEW
//                     </span>
//                   )}

//                   {/* Active underline indicator */}
//                   {isActive && (
//                     <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF3B5C] to-[#FF8C42] rounded-t-full" />
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="mt-4">
//           {activeTab === "fan-battle" && (
//             <>
//               {/* Component 2: Player Power Points Carousel */}
//               <PlayerPowerCarousel onShowAll={() => setIsRankingsOpen(true)} />
//               <FanBattleCard />
              
            
//             </>
//           )}

//           {activeTab === "predictions" && (
//             <div className="flex flex-col items-center justify-center text-white/30">
//                 <ChallengesSection />
//             </div>
//           )}

//           {activeTab === "fantasy" && (
//             <div className="w-full">
//              <CircleCricketClient />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Rankings Modal */}
//       <RankingsModal
//         isOpen={isRankingsOpen}
//         onClose={() => setIsRankingsOpen(false)}
//       />
//     </div>
//   );
// }








"use client";

import ChallengesSection from "@/src/components/FanBattle-Component/Challengessection";
import FanBattleCard from "@/src/components/FanBattle-Component/Fanbattlearena";
import PlayerPowerCarousel from "@/src/components/FanBattle-Component/PlayerPowerCarousel";
import RankingsModal from "@/src/components/FanBattle-Component/RankingsModal";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FantasyGamesHub from "../FantasyGames/page";
import { Sword, BarChart2, Trophy, ArrowLeft } from "lucide-react";
import Link from "next/link";

const tabs = [
  { id: "fan-battle", label: "Fan Battle", icon: Sword, hasNew: true },
  { id: "predictions", label: "Predictions & Polls", icon: BarChart2, hasNew: true },
  { id: "fantasy", label: "Fantasy Games", icon: Trophy, hasNew: false },
];

export default function FanBattlePage() {
  const searchParams = useSearchParams();
  const [isRankingsOpen, setIsRankingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("fan-battle");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabs.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#121212] flex items-start justify-center">
      <div className="w-full max-w-6xl mx-auto pt-8 pb-15">
        <Link href="/MainModules/HomePage" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition px-4">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition cursor-pointer">
            <ArrowLeft size={18} />
             <span className="text-sm">Back</span>
          </button>
        </Link>
        {/* Component 1: Header + Hero + Live Banner */}
        {/* <FanBattleHeader /> */}

        {/* Tabs Section */}
        <div className="mt-8 px-4 overflow-hidden">
          {/* Tab Bar - Premium Pill Style */}
          <div
            className="flex justify-start items-center gap-2 overflow-x-auto rounded-2xl border border-white/5 bg-[#1a1a1a]/80 p-1.5 shadow-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex min-w-max items-center justify-center gap-2 px-4 py-3 rounded-xl text-[11px] sm:px-5 sm:py-3.5 sm:text-sm font-bold tracking-wide transition-all duration-300 text-center whitespace-nowrap shrink-0 snap-start group min-h-[52px]
                    ${isActive
                      ? "text-white shadow-lg shadow-pink-500/20"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    }`}
                  style={isActive ? { background: "linear-gradient(90deg, #e91e8c, #ff6b35)" } : {}}
                >
                  <Icon size={16} className={`${isActive ? "text-white" : "text-white/40 group-hover:text-white/70"} transition-colors`} />

                  <span className="block leading-tight text-[11px] sm:text-sm">{tab.label}</span>

                  {tab.hasNew && (
                    <span className={`flex items-center justify-center px-1.5 py-0.5 text-[8px] font-black tracking-tighter uppercase rounded-md leading-none
                      ${isActive ? "bg-white text-[#e91e8c]" : "bg-[#e91e8c] text-white"}`}>
                      NEW
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "fan-battle" && (
            <>
              {/* Component 2: Player Power Points Carousel */}
              <PlayerPowerCarousel onShowAll={() => setIsRankingsOpen(true)} />
              <FanBattleCard />
            </>
          )}

          {activeTab === "predictions" && (
            <div className="flex flex-col items-center justify-center text-white/30">
              <ChallengesSection />
            </div>
          )}

          {activeTab === "fantasy" && (
            <div className="w-full">
              <FantasyGamesHub />
            </div>
          )}
        </div>
      </div>

      {/* Rankings Modal */}
      <RankingsModal
        isOpen={isRankingsOpen}
        onClose={() => setIsRankingsOpen(false)}
      />
    </div>
  );
}