// "use client";

// import ContinueListening from "@/src/components/HomeComponents/ContinueListening/index";
// import CricketArticles from "@/src/components/HomeComponents/CricketArticles/index";
// import Header from "@/src/components/HomeComponents/Header/index";
// import HomeBanners from "@/src/components/HomeComponents/HomeBanners/index";
// import HomeCardsSection from "@/src/components/HomeComponents/HomeCards";
// import Player360CardsSection from "@/src/components/HomeComponents/Player360Cards";
// import Team360CardsSection from "@/src/components/HomeComponents/Team360Cards";



// export default function HomePage() {
//   return (
//     <div className="flex flex-col w-full">
//       <Header />
//       <div className="flex flex-col gap-6 px-4 lg:px-6 py-4 w-full">
//         <HomeBanners />
//         {/* <ContinueListening /> */}
//         <HomeCardsSection />
//         <Team360CardsSection />
//         <Player360CardsSection  />
//         <CricketArticles />
//       </div>
//     </div>
//   );
// }





"use client";

import ContinueListening from "@/src/components/HomeComponents/ContinueListening/index";
// Removed Header import from here
import HomeBanners from "@/src/components/HomeComponents/HomeBanners/index";
import HomeCardsSection from "@/src/components/HomeComponents/HomeCards";
import Player360CardsSection from "@/src/components/HomeComponents/Player360Cards";
import Team360CardsSection from "@/src/components/HomeComponents/Team360Cards";
import PollCardsPage from "../PollCards/page";
import NewsCenter from "@/src/components/HomeComponents/NewsCenter";
import IPLSpotlight from "../IPLSpotlight/page";
import SocialFeedSection from "@/src/components/CreatePost-Component/SocialFeedSection";
import FifaWorldSection from "@/src/components/HomeComponents/FifaWorldSection";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* <Header /> -> REMOVED to prevent duplication with layout.tsx */}
      <div className="flex flex-col gap-6 px-4 lg:px-6 py-4 w-full">
        <HomeBanners />
        <IPLSpotlight />
        
        <FifaWorldSection />

        <ContinueListening />
        <HomeCardsSection />
        <PollCardsPage />
        <Team360CardsSection />
        {/* <Player360CardsSection /> */}
        <SocialFeedSection />
        <NewsCenter />
      </div>
    </div>
  );
}
