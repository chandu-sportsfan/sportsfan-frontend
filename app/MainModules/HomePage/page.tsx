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
import CricketArticles from "@/src/components/HomeComponents/CricketArticles/index";
import Header from "@/src/components/HomeComponents/Header/index";
import HomeBanners from "@/src/components/HomeComponents/HomeBanners/index";
import HomeCardsSection from "@/src/components/HomeComponents/HomeCards";
import Player360CardsSection from "@/src/components/HomeComponents/Player360Cards";
import Team360CardsSection from "@/src/components/HomeComponents/Team360Cards";
import PollCardsPage from "../PollCards/page";


export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-6 px-4 lg:px-6 py-4 w-full">
        <HomeBanners />
        <ContinueListening />
        <HomeCardsSection />
        <PollCardsPage />
        <Team360CardsSection />
        <Player360CardsSection />
        <CricketArticles />
      </div>
    </div>
  );
}
