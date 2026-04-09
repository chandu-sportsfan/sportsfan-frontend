// "use client";

// import PlayerGamePlan from "@/src/components/PlayerProfile-Component/PlayerGamePlan/index";
// import PlayerProfileActions from "@/src/components/PlayerProfile-Component/PlayerProfileActions/index";
// import PlayerProfileHeader from "@/src/components/PlayerProfile-Component/PlayerProfileHeader/index";
// import PlayerSeasonStats from "@/src/components/PlayerProfile-Component/PlayerSeasonStats/index";
// import { Player } from "@/types/player";

// // ─── Mock Data 
// const mockPlayer: Player = {
//   name: "Virat Kohli",
//   team: "Royal Challengers Bengaluru",
//   battingStyle: "Right-Hand Bat",
//   bowlingStyle: "Right-Arm Medium",
//   avatar:
//     "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Virat_Kohli_in_2016.jpg/800px-Virat_Kohli_in_2016.jpg",
//   about:
//     "Made his IPL debut in 2008 after a U-19 World Cup win and became a pillar of RCB. Captain from 2013–2021, he led them to the 2016 final with a record 973 runs. The only player with 8000+ IPL runs, he was retained for IPL 2025 after an Orange Cap-winning 2024 season.",
//   stats: { runs: "6211", sr: "130.4", avg: "31.3" },
//   overview: { debut: "2008", specialization: "Batter", dob: "05 Nov 1988", matches: "267" },
//   season: {
//     year: "2025",
//     runs: "741",
//     strikeRate: "154.70",
//     average: "38.99",
//     fifties: 4,
//     hundreds: 1,
//     highestScore: "113*",
//     fours: 64,
//     sixes: 38,
//     award: "Orange Cap Winner",
//     awardSub: "Most runs in IPL 2024",
//   },
//   insights: [
//     {
//       title: "IPL Legend",
//       description:
//         "Only player to cross 8000 runs in IPL history. Holds the record for most runs in a single season (973 in 2016) and has won the Orange Cap twice.",
//     },
//   ],
//   strengths: [
//     "Exceptional consistency in run-scoring",
//     "Outstanding under pressure situations",
//     "Strong against pace and spin bowling",
//     "Fitness and athleticism on the field",
//   ],
//   media: [
//     {
//       title: "Virat Kohli's Century Highlights",
//       views: "2.4M",
//       time: "2h ago",
//       thumbnail: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&q=80",
//     },
//     {
//       title: "Best Moments from RCB",
//       views: "1.8M",
//       time: "5h ago",
//       thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80",
//     },
//     {
//       title: "Top 10 Sixes – IPL 2025",
//       views: "980K",
//       time: "1d ago",
//       thumbnail: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&q=80",
//     },
//     {
//       title: "RCB vs MI – Match Recap",
//       views: "3.1M",
//       time: "2d ago",
//       thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
//     },
//   ],
// };

// //  Page 
// export default function PlayerProfilePage() {
//   return (
//     <div className="min-h-screen bg-[#111111] font-sans">

//       {/* ── Sticky Top Nav ── */}
//       <div className="sticky top-0 z-50 flex items-center px-4 md:px-8 lg:px-12 py-3.5 bg-[#111111]/90 backdrop-blur-md border-b border-[#1f1f1f]">
//         <button className="bg-transparent border-0 p-0 cursor-pointer text-[#e0e0e0] flex items-center hover:text-white transition-colors"
//          onClick={()=> window.history.back()}>
//           <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
//             <path d="M19 12H5" /><path d="M12 5l-7 7 7 7" />
//           </svg>
//         </button>
//         <span className="flex-1 text-center text-[17px] md:text-xl font-bold text-white tracking-tight">
//           Player Profile
//         </span>
//         <div className="w-[22px]" />
//       </div>

//       {/* ── Content wrapper ── */}
//       <div className="w-full max-w-[1280px] mx-auto">

      
//         {/* ── Mobile + Tablet: single column ── */}
//         <div className="block lg:hidden">
//           <div className="max-w-[640px] mx-auto">
//             <PlayerProfileHeader player={mockPlayer} />
//             <PlayerProfileActions player={mockPlayer} />
//             <PlayerSeasonStats player={mockPlayer} />
//             <PlayerGamePlan player={mockPlayer} />
//           </div>
//         </div>

//         {/* ── Desktop: two-column layout ── */}
//         <div className="hidden lg:flex lg:items-start lg:gap-6 xl:gap-8 px-8 xl:px-12 py-6">

//           {/* Left column — sticky sidebar */}
//           <div className="sticky top-[65px] w-[360px] xl:w-[400px] shrink-0 flex flex-col overflow-y-auto max-h-[calc(100vh-65px)] [scrollbar-width:none]">
//             <PlayerProfileHeader player={mockPlayer} />
//             <PlayerProfileActions player={mockPlayer} />
//           </div>

//           {/* Right column — scrollable content */}
//           <div className="flex-1 min-w-0 flex flex-col pb-10">
//             <PlayerSeasonStats player={mockPlayer} />
//             <PlayerGamePlan player={mockPlayer} />
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }












"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import PlayerGamePlan from "@/src/components/PlayerProfile-Component/PlayerGamePlan/index";
import PlayerProfileActions from "@/src/components/PlayerProfile-Component/PlayerProfileActions/index";
import PlayerProfileHeader from "@/src/components/PlayerProfile-Component/PlayerProfileHeader/index";
import PlayerSeasonStats from "@/src/components/PlayerProfile-Component/PlayerSeasonStats/index";

// import { usePlayerProfile } from "@/context/PlayerProfileContext";
import { Player } from "@/types/player";
import { usePlayerProfile360 } from "@/context/PlayerProfile360Context";

export default function PlayerProfilePage() {
  const params = useParams();
  const playerId = params?.id as string;

  const { data: Player360Data, loading, fetchPlayer360 } = usePlayerProfile360();
  console.log("Player360Data", Player360Data);

 useEffect(() => {
  if (!playerId) return;
  fetchPlayer360(playerId);
}, [playerId, fetchPlayer360]);

if (loading) {
  return (
    <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      <p className="text-white">Loading posts</p>
    </div>
  );
}

if (!Player360Data) {
  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center text-white">
      No player data found
    </div>
  );
}

  const player: Player = {
    name: Player360Data.profile?.name || "",
    team: Player360Data.profile?.team || "",
    battingStyle: Player360Data.profile?.battingStyle || "",
    bowlingStyle: Player360Data.profile?.bowlingStyle || "",
    avatar: Player360Data.profile?.avatar || "",
    about: Player360Data.profile?.about || "",

    stats: {
      runs: Player360Data.profile?.stats?.runs || "0",
      sr: Player360Data.profile?.stats?.sr || "0",
      avg: Player360Data.profile?.stats?.avg || "0",
    },

    overview: {
      debut: Player360Data.profile?.overview?.iplDebut || "",
      specialization: Player360Data.profile?.overview?.specialization || "",
      dob: Player360Data.profile?.overview?.dob || "",
      matches: Player360Data.profile?.overview?.matches || "",
    }, 

   season: {
  year: Player360Data.season?.season?.year || "",
  runs: Player360Data.season?.season?.runs || "0",
  strikeRate: Player360Data.season?.season?.strikeRate || "0",
  average: Player360Data.season?.season?.average || "0",
  fifties: Player360Data.season?.season?.fifties || 0,
  hundreds: Player360Data.season?.season?.hundreds || 0,
  highestScore: Player360Data.season?.season?.highestScore || "0",
  fours: Player360Data.season?.season?.fours || 0,
  sixes: Player360Data.season?.season?.sixes || 0,
  award: Player360Data.season?.season?.award || "",
  awardSub: Player360Data.season?.season?.awardSub || "",
  wickets: Player360Data.season?.season?.wickets || 0,
  bowlingAvg: Player360Data.season?.season?.bowlingAvg || "0",
  economy: Player360Data.season?.season?.economy || "0",
  bowlingSR: Player360Data.season?.season?.bowlingSR || "0",
  bestBowling: Player360Data.season?.season?.bestBowling || "",
  threeWicketHauls: Player360Data.season?.season?.threeWicketHauls || 0,
  fiveWicketHauls: Player360Data.season?.season?.fiveWicketHauls || 0,
  foursConceded: Player360Data.season?.season?.foursConceded || 0,
  sixesConceded: Player360Data.season?.season?.sixesConceded || 0,
},

    insights: Player360Data.insights?.insights || [],
    strengths: Player360Data.insights?.strengths || [],
    media: Player360Data.media?.mediaItems || [],
  };

  return (
    <div className="min-h-screen bg-[#111111] font-sans">

      {/* ── Sticky Top Nav ── */}
      <div className="sticky top-0 z-50 flex items-center px-4 md:px-8 lg:px-12 py-3.5 bg-[#111111]/90 backdrop-blur-md border-b border-[#1f1f1f]">
        <button
          className="bg-transparent border-0 p-0 cursor-pointer text-[#e0e0e0] flex items-center hover:text-white transition-colors"
          onClick={() => window.history.back()}
        >
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path d="M19 12H5" />
            <path d="M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="flex-1 text-center text-[17px] md:text-xl font-bold text-white tracking-tight">
          Player Profile
        </span>
        <div className="w-[22px]" />
      </div>

      {/* ── Content wrapper ── */}
      <div className="w-full max-w-[1280px] mx-auto">

        {/* ── Mobile + Tablet: single column ── */}
        <div className="block lg:hidden">
          <div className="max-w-[640px] mx-auto">
            <PlayerProfileHeader player={player} />
            <PlayerProfileActions player={player} />
            <PlayerSeasonStats player={player} />
            <PlayerGamePlan player={player} />
          </div>
        </div>

        {/* ── Desktop: two-column layout ── */}
        <div className="hidden lg:flex lg:items-start lg:gap-6 xl:gap-8 px-8 xl:px-12 py-6">

          {/* Left column — sticky sidebar */}
          <div className="sticky top-[65px] w-[360px] xl:w-[400px] shrink-0 flex flex-col overflow-y-auto max-h-[calc(100vh-65px)] [scrollbar-width:none]">
            <PlayerProfileHeader player={player} />
            <PlayerProfileActions player={player} />
          </div>

          {/* Right column — scrollable content */}
          <div className="flex-1 min-w-0 flex flex-col pb-10">
            <PlayerSeasonStats player={player} />
            <PlayerGamePlan player={player} />
          </div>
        </div>
      </div>
    </div>
  );
}