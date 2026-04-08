// "use client";

// import { useState } from "react";
// import { ClubProfile } from "@/types/ClubProfile";

// interface Props {
//   club: ClubProfile;
// }


// type Tab = "Drops" | "Videos" | "Live" | "Posts";
// const TABS: Tab[] = ["Drops", "Videos", "Live", "Posts"];

// function SectionLabel({ text }: { text: string }) {
//   return (
//     <div className="flex items-center gap-2">
//       <div className="w-[3px] h-5 bg-[#e91e8c] rounded-sm shrink-0" />
//       <span className="text-base md:text-lg font-bold text-white">{text}</span>
//     </div>
//   );
// }

// function TabIcon({ tab, isActive }: { tab: Tab; isActive: boolean }) {
//   const stroke = isActive ? "#fff" : "#888888";
//   if (tab === "Drops") return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-white" : "bg-[#e91e8c]"}`} />;
//   if (tab === "Videos") return (
//     <svg width="13" height="13" fill="none" stroke={stroke} strokeWidth="2" viewBox="0 0 24 24">
//       <rect x="2" y="7" width="15" height="10" rx="2" /><path d="m17 9 5 3-5 3V9z" />
//     </svg>
//   );
//   if (tab === "Live") return (
//     <svg width="13" height="13" fill="none" stroke={stroke} strokeWidth="2" viewBox="0 0 24 24">
//       <polygon points="5 3 19 12 5 21 5 3" />
//     </svg>
//   );
//   if (tab === "Posts") return <span className={`text-[14px] leading-none ${isActive ? "text-white" : "text-[#888888]"}`}>#</span>;
//   return null;
// }

// export default function ClubGamePlan({ club }: Props) {
//   const [activeTab, setActiveTab] = useState<Tab>("Drops");
//   const { strengths, media } = club;
//   const strategyTags = [
//   "Aggressive Batting",
//   "Spin-Pace Balance",
//   "Death Bowling",
// ];

//   return (
//     <div className="flex flex-col gap-4 px-4 md:px-6 pb-10">

//       {/* ── Game Plan card ── */}
//       <div className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 md:p-5">
//         <SectionLabel text="Game Plan" />
//         <p className="text-[13px] md:text-sm font-bold text-white mt-3 mb-2.5">Team Strategy</p>

//         {/* 1-col mobile, 2-col tablet+ */}
//         <div className="border border-[#2a2a2a] p-6 bg-[#0d0d0d] rounded-xl">
//           {/* Description */}
//           <p className="text-[#d1d1d1] text-[15px] leading-[1.7] mb-8">
//             RCB employs an aggressive batting approach with a focus on
//             powerplay dominance and explosive finishes. The team relies on a
//             balanced squad with quality spinners for middle overs and pace for
//             death bowling.
//           </p>

//           {/* Pills */}
//           <div className="flex flex-col gap-4">
//             {strategyTags.map((tag, index) => (
//               <div
//                 key={index}
//                 className={`inline-flex w-fit px-6 py-3 rounded-full border text-[12px] font-semibold
//                   ${
//                     index === 1
//                       ? "border-[#ff7a00] text-[#ff7a00]"
//                       : "border-[#ff007f] text-[#ff007f]"
//                   }`}
//               >
//                 {tag}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── Media card ── */}
//       <div className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">

//         {/* Tab bar */}
//         <div className="flex items-center gap-1 px-3 py-2.5 border-b border-[#2a2a2a]">
//           {TABS.map((tab) => {
//             const isActive = activeTab === tab;
//             return (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`flex items-center gap-1.5 h-[34px] md:h-[38px] px-3.5 md:px-4 rounded-full text-[13px] md:text-sm font-bold border-0 cursor-pointer transition-colors duration-200
//                   ${isActive ? "bg-[#e91e8c] text-white" : "bg-transparent text-[#888888] hover:text-[#cccccc]"}`}
//               >
//                 <TabIcon tab={tab} isActive={isActive} />
//                 {tab}
//               </button>
//             );
//           })}
//         </div>

       
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 p-3 md:p-4">
//           {media.map((item, i) => (
//             <div key={i} className="flex flex-col gap-1.5">
//               <div className="relative rounded-xl overflow-hidden aspect-video bg-[#242424]">
//                 <img
//                   src={item.thumbnail}
//                   alt={item.title}
//                   className="w-full h-full object-cover block"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50 flex items-center justify-center">
//                   <div className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/20 backdrop-blur-sm">
//                     <svg width="13" height="13" fill="white" viewBox="0 0 24 24">
//                       <polygon points="5 3 19 12 5 21 5 3" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//               <p className="text-[12px] md:text-[13px] font-semibold text-white leading-[1.45]">{item.title}</p>
//               <p className="text-[11px] md:text-xs text-[#777777]">{item.views} views · {item.time}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }









"use client";

import { useState } from "react";
import { ClubProfile } from "@/types/ClubProfile";

interface Props {
  club: ClubProfile;
}

type Tab = "Drops" | "Videos" | "Live" | "Posts";
const TABS: Tab[] = ["Drops", "Videos", "Live", "Posts"];

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-[3px] h-5 bg-[#e91e8c] rounded-sm shrink-0" />
      <span className="text-base md:text-lg font-bold text-white">{text}</span>
    </div>
  );
}

function TabIcon({ tab, isActive }: { tab: Tab; isActive: boolean }) {
  const stroke = isActive ? "#fff" : "#888888";
  if (tab === "Drops") return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-white" : "bg-[#e91e8c]"}`} />;
  if (tab === "Videos") return (
    <svg width="13" height="13" fill="none" stroke={stroke} strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="7" width="15" height="10" rx="2" /><path d="m17 9 5 3-5 3V9z" />
    </svg>
  );
  if (tab === "Live") return (
    <svg width="13" height="13" fill="none" stroke={stroke} strokeWidth="2" viewBox="0 0 24 24">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
  if (tab === "Posts") return <span className={`text-[14px] leading-none ${isActive ? "text-white" : "text-[#888888]"}`}>#</span>;
  return null;
}

export default function ClubGamePlan({ club }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("Drops");
  const { strengths, insights, name, about } = club;
  
  // Use dynamic strengths from API or fallback
  const strategyTags = strengths && strengths.length > 0 
    ? strengths 
    : [
        "Aggressive Batting",
        "Spin-Pace Balance", 
        "Death Bowling",
      ];
  
  // Generate team description from insights or use dynamic about text
  const teamDescription = insights && insights.length > 0 && insights[0].description
    ? insights[0].description
    : about || `${name} is a professional Twenty20 cricket team that competes in the Indian Premier League. The team is known for its competitive spirit and passionate fan base.`;

  return (
    <div className="flex flex-col gap-4 px-4 md:px-6 pb-10">

      {/* ── Game Plan card ── */}
      <div className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 md:p-5">
        <SectionLabel text="Game Plan" />
        <p className="text-[13px] md:text-sm font-bold text-white mt-3 mb-2.5">Team Strategy</p>

        <div className="border border-[#2a2a2a] p-6 bg-[#0d0d0d] rounded-xl">
          {/* Dynamic Description */}
          <p className="text-[#d1d1d1] text-[15px] leading-[1.7] mb-8">
            {teamDescription}
          </p>

          {/* Dynamic Pills based on strengths */}
          <div className="flex flex-col gap-4">
            {strategyTags.map((tag, index) => (
              <div
                key={index}
                className={`inline-flex w-fit px-6 py-3 rounded-full border text-[12px] font-semibold
                  ${
                    index === 1
                      ? "border-[#ff7a00] text-[#ff7a00]"
                      : "border-[#ff007f] text-[#ff007f]"
                  }`}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Media card ── */}
      <div className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">

        {/* Tab bar */}
        <div className="flex items-center gap-1 px-3 py-2.5 border-b border-[#2a2a2a]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 h-[34px] md:h-[38px] px-3.5 md:px-4 rounded-full text-[13px] md:text-sm font-bold border-0 cursor-pointer transition-colors duration-200
                  ${isActive ? "bg-[#e91e8c] text-white" : "bg-transparent text-[#888888] hover:text-[#cccccc]"}`}
              >
                <TabIcon tab={tab} isActive={isActive} />
                {tab}
              </button>
            );
          })}
        </div>

        {/* Dynamic Media Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 p-3 md:p-4">
          {club.media && club.media.length > 0 ? (
            club.media.map((item, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="relative rounded-xl overflow-hidden aspect-video bg-[#242424] group cursor-pointer">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/20 backdrop-blur-sm">
                      <svg width="13" height="13" fill="white" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="text-[12px] md:text-[13px] font-semibold text-white leading-[1.45] line-clamp-2">{item.title}</p>
                <p className="text-[11px] md:text-xs text-[#777777]">{item.views} views · {item.time}</p>
              </div>
            ))
          ) : (
            // Fallback when no media is available
            <div className="col-span-2 lg:col-span-4 text-center py-8 text-gray-400">
              No media content available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}