"use client";

import ChallengesSection from "@/src/components/FanBattle-Component/Challengessection";
import FanBattleHeader from "@/src/components/FanBattle-Component/Fanbattleheader";
import React from "react";


export default function FanBattlePage() {
  return (
    <div className="min-h-screen bg-[#121212] flex items-start justify-center">
      <div className="w-full max-w-6xl mx-auto pt-8 pb-15">
        {/* Component 1: Header + Hero + Live Banner */}
        <FanBattleHeader />

        {/* Component 2: Challenges + Daily + Performance */}
        <ChallengesSection />
      </div>
    </div>
  );
}