// "use client";
// import Link from "next/link";
// import { useAudio } from "@/context/AudioContext";
// import { Mic } from "lucide-react";
// import { useEffect, useState } from "react";
// import axios from "axios";

// type Stat = {
//   label: string;
//   value: string;
// };

// type CardProps = {
//   id: number;
//   title: string;
//   subtitle: string;
//   profileUrl: string;
//   image: string;
//   stats: Stat[];
//   buttonText: string;
//   buttonIcon?: "play" | "chart";
//   buttonUrl?: string;
// };

// /*  MOCK DATA - will be updated dynamically */
// const homeCardsData: CardProps[] = [
//   {
//     id: 1,
//     title: "IPL T20 2026 360World",
//     subtitle: "Exclusive content from all 10 teams",
//     image: "/images/ipl360.jpg",
//     profileUrl: "",
//     stats: [
//       { label: "Teams", value: "10" },
//       { label: "Drops", value: "0" },
//       { label: "Fans", value: "2.3M" },
//     ],
//     buttonText: "View Playlist",
//     buttonIcon: "play",
//     buttonUrl: "/MainModules/MatchesDropContent"
//   },
//   {
//     id: 2,
//     title: "SportsFan360",
//     subtitle: "Your ultimate sports companion",
//     image: "/images/sportsfan360.jpeg",
//     profileUrl: "/MainModules/sportsfanprofile",
//     stats: [
//       { label: "Sports", value: "12+" },
//       { label: "Athletes", value: "500+" },
//       { label: "Active", value: "1.8M" },
//     ],
//     buttonText: "View Full Playlist",
//     buttonIcon: "chart",
//     buttonUrl: ""
//   },
// ];

// function LatestAudioList() {
//   const { audioFiles, loading } = useAudio();
//   const latest = audioFiles.slice(0, 2);

//   if (loading) {
//     return (
//       <div className="flex flex-col gap-1.5 mt-2">
//         {[1, 2].map((i) => (
//           <div key={i} className="h-8 bg-[#1c1c1c] rounded-lg animate-pulse" />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-1.5 mt-2">
//       {latest.map((audio) => (
//         <Link
//           key={audio.id}
//           href={`/MainModules/MatchesDropContent/AudioDropScreen?id=${encodeURIComponent(audio.id)}`}
//         >
//           <div className="flex items-center gap-2 bg-[#1c1c1c] rounded-lg px-2 py-1.5 hover:bg-[#2a2a2a] transition-colors">
//             <Mic size={18} className="text-[#C9115F] flex-shrink-0" />
//             <div className="min-w-0 flex-1">
//               <p className="text-white text-[10px] lg:text-[12px] font-medium leading-tight capitalize">
//                 {audio.matchInfo?.type
//                   ? `${audio.matchInfo.type.replace(/_/g, " ")}`
//                   : audio.title}
//               </p>
//               <p className="text-gray-500 text-[9px] lg:text-[12px] leading-tight">
//                 {audio.matchInfo?.speaker
//                   ? `Audio Drop - ${audio.matchInfo.speaker}`
//                   : "Audio Drop"}
//                 {audio.matchInfo?.team1
//                   ? ` on the ${audio.matchInfo.team1} vs ${audio.matchInfo.team2}`
//                   : ""}
//               </p>
//             </div>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }

// export default function HomeCardsSection() {
//   const [cardsData, setCardsData] = useState<CardProps[]>(homeCardsData);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDrops = async () => {
//       try {
//         const response = await axios.get(`/api/cloudinary/audio`);
        
//         // Get total count from the response
//         const totalCount = response.data.totalCount || response.data.audioFiles?.length || 0;
        
//         // Update the drops count in the first card (id: 1)
//         setCardsData(prevCards => 
//           prevCards.map(card => 
//             card.id === 1 
//               ? {
//                   ...card,
//                   stats: card.stats.map(stat => 
//                     stat.label === "Drops" 
//                       ? { ...stat, value: totalCount.toString() }
//                       : stat
//                   )
//                 }
//               : card
//           )
//         );
//       } catch (err: unknown) {
//         console.log("Audio drop count error:", err);
//         setError("Failed to load audio drops count.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDrops();
//   }, []);

//   return (
//     <div className="mt-6">
//       <div className="flex gap-4 overflow-x-auto [scrollbar-width:none] snap-x snap-mandatory">
//         {cardsData.map((card) => (
//           <div
//             key={card.id}
//             className="min-w-[200px] max-w-[256px] snap-start bg-[#111] rounded-2xl p-3 shadow-lg flex flex-col h-fit"
//           >
//             {/* Image */}
//             <div className="relative rounded-xl overflow-hidden flex-shrink-0">
//               <Link href={card.profileUrl}>
//               <img
//                 src={card.image}
//                 className="w-[256px] h-[120px] object-fit rounded-lg"
//                 alt={card.title}
//               />
//               </Link>
//               <div className="absolute bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent w-full">
//                 <h2 className="text-[14px] font-bold leading-tight">{card.title}</h2>
//                 <p className="text-[10px] text-gray-300">{card.subtitle}</p>
//               </div>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-3 gap-2 mt-2 text-center">
//               {card.stats.map((stat, i) => (
//                 <div key={i} className="bg-[#1c1c1c] p-2 rounded-lg">
//                   <p className="text-gray-400 text-[9px]">{stat.label}</p>
//                   <p className="font-semibold text-[12px]">
//                     {loading && card.id === 1 && stat.label === "Drops" ? (
//                       <span className="inline-block w-8 h-3 bg-gray-700 rounded animate-pulse"></span>
//                     ) : (
//                       stat.value
//                     )}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             {/* Latest audio drops — only on card 1 (IPL T20) */}
//             {card.id === 1 && <LatestAudioList />}

//             {/* Button */}
//             <div className="mt-auto pt-2">
//               <Link href={card.buttonUrl || "#"}>
//                 <button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 py-1.5 rounded-full font-semibold text-[13px] flex items-center justify-center gap-2 cursor-pointer">
//                   {card.buttonIcon === "play"
//                     ? <img src="/images/explore.png" alt="Play" />
//                     : <img src="/images/discover.png" alt="Chart" />}
//                   {card.buttonText}
//                 </button>
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {/* Show error message if any */}
//       {error && (
//         <div className="text-center text-red-500 text-xs mt-4">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// }







"use client";
import Link from "next/link";
import { useAudio } from "@/context/AudioContext";
import { Mic } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

type Stat = {
  label: string;
  value: string;
};

type CardProps = {
  id: number;
  title: string;
  subtitle: string;
  profileUrl: string;
  image: string;
  stats: Stat[];
  buttonText: string;
  buttonIcon?: "play" | "chart";
  buttonUrl?: string;
};

/*  MOCK DATA - will be updated dynamically */
const homeCardsData: CardProps[] = [
  {
    id: 1,
    title: "IPL T20 2026 360World",
    subtitle: "Exclusive content from all 10 teams",
    image: "/images/ipl360.jpg",
    profileUrl: "",
    stats: [
      { label: "Teams", value: "10" },
      { label: "Drops", value: "0" },
      { label: "Fans", value: "2.3M" },
    ],
    buttonText: "View Playlist",
    buttonIcon: "play",
    buttonUrl: "/MainModules/MatchesDropContent"
  },
  {
    id: 2,
    title: "SportsFan360",
    subtitle: "Your ultimate sports companion",
    image: "/images/sportsfan360.jpeg",
    profileUrl: "/MainModules/sportsfanprofile",
    stats: [
      { label: "Sports", value: "12+" },
      { label: "Athletes", value: "500+" },
      { label: "Active", value: "1.8M" },
    ],
    buttonText: "View Full Playlist",
    buttonIcon: "chart",
    buttonUrl: ""
  },
];

function LatestAudioList() {
  const { audioFiles, loading } = useAudio();
  const latest = audioFiles.slice(0, 2);

  if (loading) {
    return (
      <div className="flex flex-col gap-1.5 mt-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-8 bg-[#1c1c1c] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 mt-2">
      {latest.map((audio) => (
        <Link
          key={audio.id}
          href={`/MainModules/MatchesDropContent/AudioDropScreen?id=${encodeURIComponent(audio.id)}`}
        >
          <div className="flex items-center gap-2 bg-[#1c1c1c] rounded-lg px-2 py-1.5 hover:bg-[#2a2a2a] transition-colors">
            <Mic size={18} className="text-[#C9115F] flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-white text-[10px] lg:text-[12px] font-medium leading-tight capitalize">
                {audio.matchInfo?.type
                  ? `${audio.matchInfo.type.replace(/_/g, " ")}`
                  : audio.title}
              </p>
              <p className="text-gray-500 text-[9px] lg:text-[12px] leading-tight">
                {audio.matchInfo?.speaker
                  ? `Audio Drop - ${audio.matchInfo.speaker}`
                  : "Audio Drop"}
                {audio.matchInfo?.team1
                  ? ` on the ${audio.matchInfo.team1} vs ${audio.matchInfo.team2}`
                  : ""}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function HomeCardsSection() {
  const [cardsData, setCardsData] = useState<CardProps[]>(homeCardsData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrops = async () => {
      try {
        const response = await axios.get(`/api/cloudinary/audio`);
        
        // Get total count from the response
        const totalCount = response.data.totalCount || response.data.audioFiles?.length || 0;
        
        // Update the drops count in the first card (id: 1)
        setCardsData(prevCards => 
          prevCards.map(card => 
            card.id === 1 
              ? {
                  ...card,
                  stats: card.stats.map(stat => 
                    stat.label === "Drops" 
                      ? { ...stat, value: totalCount.toString() }
                      : stat
                  )
                }
              : card
          )
        );
      } catch (err: unknown) {
        console.log("Audio drop count error:", err);
        setError("Failed to load audio drops count.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrops();
  }, []);

  return (
    <div className="mt-6">
      <div className="flex gap-4 overflow-x-auto [scrollbar-width:none] snap-x snap-mandatory">
        {cardsData.map((card) => (
          <div
            key={card.id}
            className="min-w-[200px] max-w-[256px] snap-start bg-[#111] rounded-2xl p-3 shadow-lg flex flex-col h-fit"
          >
            {/* Image */}
            <div className="relative rounded-xl overflow-hidden flex-shrink-0">
              <Link href={card.profileUrl}>
              <img
                src={card.image}
                className="w-[256px] h-[120px] object-fit rounded-lg"
                alt={card.title}
              />
              </Link>
              <div className="absolute bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent w-full">
                <h2 className="text-[14px] font-bold leading-tight">{card.title}</h2>
                <p className="text-[10px] text-gray-300">{card.subtitle}</p>
              </div>
            </div>

            {/* Stats - Only show for card 1 */}
            {card.id === 1 && (
              <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                {card.stats.map((stat, i) => (
                  <div key={i} className="bg-[#1c1c1c] p-2 rounded-lg">
                    <p className="text-gray-400 text-[9px]">{stat.label}</p>
                    <p className="font-semibold text-[12px]">
                      {loading && card.id === 1 && stat.label === "Drops" ? (
                        <span className="inline-block w-8 h-3 bg-gray-700 rounded animate-pulse"></span>
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Latest audio drops — only on card 1 (IPL T20) */}
            {card.id === 1 && <LatestAudioList />}

            {/* Button - Only show for card 1, hide for card 2 */}
            {card.id === 1 && (
              <div className="mt-auto pt-2">
                <Link href={card.buttonUrl || "#"}>
                  <button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 py-1.5 rounded-full font-semibold text-[13px] flex items-center justify-center gap-2 cursor-pointer">
                    {card.buttonIcon === "play"
                      ? <img src="/images/explore.png" alt="Play" />
                      : <img src="/images/discover.png" alt="Chart" />}
                    {card.buttonText}
                  </button>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Show error message if any */}
      {error && (
        <div className="text-center text-red-500 text-xs mt-4">
          {error}
        </div>
      )}
    </div>
  );
}