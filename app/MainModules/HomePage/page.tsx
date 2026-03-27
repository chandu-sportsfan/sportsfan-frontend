// "use client";

// import Header from "@/src/components/HomeComponents/Header";
// import Sidebar from "@/src/components/HomeComponents/Sidebar";
// import BottomNav from "@/src/components/HomeComponents/Bottomnav";
// import HomeBanners from "@/src/components/HomeComponents/HomeBanners";
// import HomeCards from "@/src/components/HomeComponents/HomeCard";
// import Team360CardsSection from "@/src/components/HomeComponents/Team360CardsSection";
// import Player360CardsSection from "@/src/components/HomeComponents/Player360CardsSection";
// import CricketArticles from "@/src/components/HomeComponents/CricketArticles";


// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">

//       {/* Sidebar (Desktop only) */}
//       <div className="hidden lg:block w-[240px]">
//         <Sidebar />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 w-full flex flex-col pb-20">

//         <Header />

//         <div className="w-full overflow-hidden">
//           <HomeBanners />
//         </div>
//         <HomeCards />
//         <Team360CardsSection />
//         <Player360CardsSection />
//         <CricketArticles />

//         {/* Bottom Nav */}
//         <div className="lg:hidden">
//           <BottomNav />
//         </div>
//       </div>
//     </div>
//   );
// }










"use client";

import Header from "@/src/components/HomeComponents/Header";
import Sidebar from "@/src/components/HomeComponents/Sidebar";
import BottomNav from "@/src/components/HomeComponents/Bottomnav";
import HomeBanners from "@/src/components/HomeComponents/HomeBanners";
import HomeCards from "@/src/components/HomeComponents/HomeCard";
import Team360CardsSection from "@/src/components/HomeComponents/Team360CardsSection";
import Player360CardsSection from "@/src/components/HomeComponents/Player360CardsSection";
import CricketArticles from "@/src/components/HomeComponents/CricketArticles";
import ContinueListening from "@/src/components/HomeComponents/ContinueListening";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row overflow-x-hidden">
      
      {/* Sidebar (Desktop only) */}
      <div className="hidden lg:block w-[240px] flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full min-w-0 flex flex-col pb-20">
        
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

        {/* Bottom Nav */}
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}