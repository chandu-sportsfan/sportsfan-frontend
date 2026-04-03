"use client";

import { Player } from "@/types/player";

interface Props {
  player: Player;
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-[3px] h-5 bg-[#e91e8c] rounded-sm shrink-0" />
      <span className="text-base md:text-lg font-bold text-white">{text}</span>
    </div>
  );
}

export default function PlayerProfileActions({ player }: Props) {
  const careerStatItems = [
    { value: player.stats.runs, label: "RUNS" },
    { value: player.stats.sr, label: "SR" },
    { value: player.stats.avg, label: "AVG" },
  ];

  return (
    <div className="flex flex-col gap-4 px-4 md:px-6 pt-4 pb-4">

      {/* ── Row 1: Follow · Watch Me · Share ── */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Follow – gradient pill */}
        <button className="flex flex-1 items-center justify-center gap-2 h-[46px] md:h-[52px] rounded-full bg-gradient-to-r from-[#e91e8c] to-[#ff5722] text-white text-[14px] md:text-base font-bold tracking-wide border-0 cursor-pointer hover:opacity-90 transition-opacity">
          <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          Follow
        </button>

        {/* Watch Me – outlined */}
        <button className="flex flex-1 items-center justify-center gap-2 h-[46px] md:h-[52px] rounded-full bg-transparent border border-[#e91e8c] text-[#e91e8c] text-[14px] md:text-base font-bold cursor-pointer hover:bg-[#e91e8c]/10 transition-colors">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          Watch Me
        </button>

        {/* Share icon */}
        <button className="flex items-center justify-center w-[46px] h-[46px] md:w-[52px] md:h-[52px] rounded-full bg-transparent border border-[#e91e8c] text-[#e91e8c] cursor-pointer shrink-0 hover:bg-[#e91e8c]/10 transition-colors">
          <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>

      {/* ── Avatar Jersey CTA ── */}
      <button className="flex w-full items-center justify-center gap-2 h-12 md:h-[52px] rounded-full bg-transparent border border-[#e91e8c] text-[#e91e8c] text-[13px] md:text-sm font-bold cursor-pointer hover:bg-[#e91e8c]/10 transition-colors">
        <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H7v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V10h3.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
        </svg>
        Make My Avatar in This Jersey
      </button>

      {/* ── Career Stats ── */}
      <div className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 md:p-5">
        <SectionLabel text="Career Stats" />
        <div className="grid grid-cols-3 gap-3 mt-3">
          {careerStatItems.map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center py-3.5 md:py-5 rounded-xl bg-[#242424]">
              <span className="text-[22px] md:text-[28px] font-extrabold text-white leading-none">{s.value}</span>
              <span className="text-[11px] md:text-xs text-[#777777] mt-1 tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Player Overview ── */}
      <div className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 md:p-5">
        <SectionLabel text="Player Overview" />
        <div className="grid grid-cols-2 gap-3 mt-3">

          <div className="flex flex-col justify-center p-3.5 md:p-4 rounded-xl bg-[#242424] min-h-[70px] md:min-h-[84px]">
            <span className="text-[20px] md:text-[24px] font-extrabold text-white leading-tight">{player.overview.debut}</span>
            <span className="text-[11px] md:text-xs text-[#777777] mt-1">IPL Debut</span>
          </div>

          <div className="flex flex-col justify-center p-3.5 md:p-4 rounded-xl bg-[#242424] min-h-[70px] md:min-h-[84px]">
            <span className="text-[20px] md:text-[24px] font-extrabold text-[#e91e8c] leading-tight">{player.overview.specialization}</span>
            <span className="text-[11px] md:text-xs text-[#777777] mt-1">Specialization</span>
          </div>

          <div className="flex flex-col justify-center p-3.5 md:p-4 rounded-xl bg-[#242424] min-h-[70px] md:min-h-[84px]">
            <span className="text-[15px] md:text-[18px] font-extrabold text-white leading-tight">{player.overview.dob}</span>
            <span className="text-[11px] md:text-xs text-[#777777] mt-1">Date of Birth</span>
          </div>

          <div className="flex flex-col justify-center p-3.5 md:p-4 rounded-xl bg-[#242424] min-h-[70px] md:min-h-[84px]">
            <span className="text-[22px] md:text-[28px] font-extrabold text-[#ff9800] leading-tight">{player.overview.matches}</span>
            <span className="text-[11px] md:text-xs text-[#777777] mt-1">Matches</span>
          </div>
        </div>
      </div>
    </div>
  );
}