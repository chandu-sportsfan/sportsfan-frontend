// app/MainModules/HomePage/page.tsx
"use client";

import Header from "@/src/components/HomeComponents/Header";
import HomeBanners from "@/src/components/HomeComponents/HomeBanners";
import HomeCards from "@/src/components/HomeComponents/HomeCard";
import Team360CardsSection from "@/src/components/HomeComponents/Team360CardsSection";
import Player360CardsSection from "@/src/components/HomeComponents/Player360CardsSection";
import CricketArticles from "@/src/components/HomeComponents/CricketArticles";
import ContinueListening from "@/src/components/HomeComponents/ContinueListening";

export default function HomePage() {
  return (
    <>
      <Header />

      <div className="w-full overflow-x-hidden">
        <HomeBanners />
      </div>
      
      <div className="w-full overflow-x-hidden">
        <ContinueListening />
      </div>
      
      <div className="w-full overflow-x-hidden">
        <HomeCards />
      </div>
      
      <div className="w-full overflow-x-hidden">
        <Team360CardsSection />
      </div>
      
      <div className="w-full overflow-x-hidden">
        <Player360CardsSection />
      </div>
      
      <div className="w-full overflow-x-hidden">
        <CricketArticles />
      </div>
    </>
  );
}