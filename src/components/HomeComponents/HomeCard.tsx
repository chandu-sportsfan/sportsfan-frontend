"use client";

import HomeCardsSection from "./HomeCardsSection";

export default function HomeCards() {
  return (
    <div className="px-4 mt-6">
      <div className="flex gap-4 overflow-x-auto  [scrollbar-width:none]">
        <HomeCardsSection />
      </div>
    </div>
  );
}