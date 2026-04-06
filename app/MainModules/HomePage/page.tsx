// // app/MainModules/HomePage/page.tsx
// "use client";

// import Header from "@/src/components/HomeComponents/Header";
// import HomeBanners from "@/src/components/HomeComponents/HomeBanners";
// import HomeCards from "@/src/components/HomeComponents/HomeCard";
// import Team360CardsSection from "@/src/components/HomeComponents/Team360CardsSection";
// import Player360CardsSection from "@/src/components/HomeComponents/Player360CardsSection";
// import CricketArticles from "@/src/components/HomeComponents/CricketArticles";
// import ContinueListening from "@/src/components/HomeComponents/ContinueListening";

// export default function HomePage() {
//   return (
//     <>
//       <Header />

//       <div className="w-full overflow-x-hidden">
//         <HomeBanners />
//       </div>
      
//       <div className="w-full overflow-x-hidden">
//         <ContinueListening />
//       </div>
      
//       <div className="w-full overflow-x-hidden">
//         <HomeCards />
//       </div>
      
//       <div className="w-full overflow-x-hidden">
//         <Team360CardsSection />
//       </div>
      
//       <div className="w-full overflow-x-hidden">
//         <Player360CardsSection />
//       </div>
      
//       <div className="w-full overflow-x-hidden">
//         <CricketArticles />
//       </div>
//     </>
//   );
// }






// "use client";

// import Header from "@/src/components/HomeComponents/Header";
// import HomeBanners from "@/src/components/HomeComponents/HomeBanners";
// import HomeCards from "@/src/components/HomeComponents/HomeCard";
// import Team360CardsSection from "@/src/components/HomeComponents/Team360CardsSection";
// import Player360CardsSection from "@/src/components/HomeComponents/Player360CardsSection";
// import CricketArticles from "@/src/components/HomeComponents/CricketArticles";
// import ContinueListening from "@/src/components/HomeComponents/ContinueListening";

// export default function HomePage() {
//   return (
//     <>
//       <Header />

//       <main className="w-full px-4 lg:px-6">
//         <HomeBanners />

//         <div className="space-y-6">
//           <ContinueListening />
//           <HomeCards />
//           <Team360CardsSection />
//           <Player360CardsSection />
//           <CricketArticles />
//         </div>
//       </main>
//     </>
//   );
// }





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
    <div className="flex flex-col w-full">
      <Header />
      <div className="flex flex-col gap-6 px-4 lg:px-6 py-4 w-full">
        <HomeBanners />
        <ContinueListening />
        <HomeCards />
        <Team360CardsSection />
        <Player360CardsSection />
        <CricketArticles />
      </div>
    </div>
  );
}