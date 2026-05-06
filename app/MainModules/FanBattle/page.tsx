"use client";

import ChallengesSection from "@/src/components/FanBattle-Component/Challengessection";
import FanBattleHeader from "@/src/components/FanBattle-Component/Fanbattleheader";
import PlayerPowerCarousel from "@/src/components/FanBattle-Component/PlayerPowerCarousel";
import RankingsModal from "@/src/components/FanBattle-Component/RankingsModal";
import React, { useState } from "react";

export default function FanBattlePage() {
  const [isRankingsOpen, setIsRankingsOpen] = useState(false);

  return (
    // ADDED 'relative' and 'overflow-hidden' to trap the modal here!
    <div className="relative overflow-hidden min-h-screen bg-[#121212] flex items-start justify-center">
      <div className="w-full max-w-6xl mx-auto pt-8 pb-15">
        {/* Component 1: Header + Hero + Live Banner */}
        <FanBattleHeader />

        {/* Component 2: Player Power Points Carousel */}
        <PlayerPowerCarousel onShowAll={() => setIsRankingsOpen(true)} />

        {/* Component 3: Challenges + Daily + Performance */}
        <ChallengesSection />
      </div>

      {/* Rankings Modal (now contained within the relative parent) */}
      <RankingsModal
        isOpen={isRankingsOpen}
        onClose={() => setIsRankingsOpen(false)}
      />
    </div>
  );
}
