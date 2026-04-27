// "use client";
// import Link from "next/link";
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

// interface MatchInfo {
//   team1?: string;
//   team2?: string;
//   type?: string;
//   speaker?: string;
//   date?: string;
// }

// interface AudioFile {
//   id: string;
//   title: string;
//   url: string;
//   duration: string;
//   createdAt: string;
//   matchInfo?: MatchInfo;
// }

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

// function getDisplayTitle(audio: AudioFile): string {
//   const title = (audio.title || "").toLowerCase();
//   if (title.includes("toss report")) return "TOSS REPORT";
//   if (title.includes("post match")) return "POST MATCH";
//   if (title.includes("pre match")) return "PRE MATCH";
//   if (title.includes("match analysis")) return "MATCH ANALYSIS";
//   if (title.includes("highlights")) return "HIGHLIGHTS";
//   const type = audio.matchInfo?.type;
//   if (type && type !== "unknown") {
//     return type.replace(/_/g, " ").toUpperCase();
//   }
//   return "AUDIO DROP";
// }

// function getSpeakerLabel(audio: AudioFile): string {
//   const speaker = audio.matchInfo?.speaker || "";
//   return speaker
//     .replace(/^toss report\s*/i, "")
//     .replace(/^script\s*/i, "")
//     .replace(/^story\s*/i, "")
//     .trim() || "Audio Drop";
// }

// function LatestAudioList() {
//   const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get(`/api/cloudinary/audio?limit=2`)
//       .then(res => {
//         if (res.data.success) {
//           setAudioFiles(res.data.audioFiles.slice(0, 2));
//         }
//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex flex-col gap-1.5 mt-2">
//         {[1, 2].map((i) => (
//           <div key={i} className="h-8 bg-[#1c1c1c] rounded-lg animate-pulse" />
//         ))}
//       </div>
//     );
//   }

//   if (audioFiles.length === 0) return null;

//   return (
//     <div className="flex flex-col gap-1.5 mt-2">
//       {audioFiles.map((audio) => (
//         <Link
//           key={audio.id}
//           href={`/MainModules/MatchesDropContent/AudioDropScreen?id=${encodeURIComponent(audio.id)}`}
//         >
//           <div className="flex items-center gap-2 bg-[#1c1c1c] rounded-lg px-2 py-1.5 hover:bg-[#2a2a2a] transition-colors">
//             <Mic size={18} className="text-[#C9115F] flex-shrink-0" />
//             <div className="min-w-0 flex-1">
//               <p className="text-white text-[10px] lg:text-[12px] font-medium leading-tight">
//                 {getDisplayTitle(audio)}
//               </p>
//               <p className="text-gray-500 text-[9px] lg:text-[12px] leading-tight">
//                 {getSpeakerLabel(audio)}
//                 {audio.matchInfo?.team1
//                   ? ` · ${audio.matchInfo.team1} vs ${audio.matchInfo.team2}`
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
//         const totalCount = response.data.totalCount || response.data.audioFiles?.length || 0;
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
//                 <img
//                   src={card.image}
//                   className="w-[256px] h-[120px] object-fit rounded-lg"
//                   alt={card.title}
//                 />
//               </Link>
//               <div className="absolute bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent w-full">
//                 <h2 className="text-[14px] font-bold leading-tight">{card.title}</h2>
//                 <p className="text-[10px] text-gray-300">{card.subtitle}</p>
//               </div>
//             </div>

//             {/* Stats - Only show for card 1 */}
//             {card.id === 1 && (
//               <div className="grid grid-cols-3 gap-2 mt-2 text-center">
//                 {card.stats.map((stat, i) => (
//                   <div key={i} className="bg-[#1c1c1c] p-2 rounded-lg">
//                     <p className="text-gray-400 text-[9px]">{stat.label}</p>
//                     <p className="font-semibold text-[12px]">
//                       {loading && card.id === 1 && stat.label === "Drops" ? (
//                         <span className="inline-block w-8 h-3 bg-gray-700 rounded animate-pulse"></span>
//                       ) : (
//                         stat.value
//                       )}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Latest audio drops — only on card 1 */}
//             {card.id === 1 && <LatestAudioList />}

//             {/* Button - Only show for card 1 */}
//             {card.id === 1 && (
//               <div className="mt-auto pt-2">
//                 <Link href={card.buttonUrl || "#"}>
//                   <button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 py-1.5 rounded-full font-semibold text-[13px] flex items-center justify-center gap-2 cursor-pointer">
//                     {card.buttonIcon === "play"
//                       ? <img src="/images/explore.png" alt="Play" />
//                       : <img src="/images/discover.png" alt="Chart" />}
//                     {card.buttonText}
//                   </button>
//                 </Link>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

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
import { Mic, Play } from "lucide-react";
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

interface MatchInfo {
  team1?: string;
  team2?: string;
  type?: string;
  speaker?: string;
  date?: string;
}

interface AudioFile {
  id: string;
  title: string;
  url: string;
  duration: string;
  createdAt: string;
  matchInfo?: MatchInfo;
}

interface VideoFile {
  id: string;
  title: string;
  url: string;
  duration: string;
  createdAt: string;
  playerInfo?: {
    playerName?: string;
    chapter?: string;
    chapterNumber?: number;
  };
}

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

function getDisplayTitle(audio: AudioFile): string {
  const title = (audio.title || "").toLowerCase();
  if (title.includes("toss report")) return "TOSS REPORT";
  if (title.includes("post match")) return "POST MATCH";
  if (title.includes("pre match")) return "PRE MATCH";
  if (title.includes("match analysis")) return "MATCH ANALYSIS";
  if (title.includes("highlights")) return "HIGHLIGHTS";
  const type = audio.matchInfo?.type;
  if (type && type !== "unknown") {
    return type.replace(/_/g, " ").toUpperCase();
  }
  return "AUDIO DROP";
}

function getSpeakerLabel(audio: AudioFile): string {
  const speaker = audio.matchInfo?.speaker || "";
  return speaker
    .replace(/^toss report\s*/i, "")
    .replace(/^script\s*/i, "")
    .replace(/^story\s*/i, "")
    .trim() || "Audio Drop";
}

// ── Latest Audio List ─────────────────────────────────────────────────────────
function LatestAudioList() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/cloudinary/audio?limit=2`)
      .then(res => {
        if (res.data.success) {
          setAudioFiles(res.data.audioFiles.slice(0, 2));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-1.5 mt-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-8 bg-[#1c1c1c] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (audioFiles.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 mt-2">
      {audioFiles.map((audio) => (
        <Link
          key={audio.id}
          href={`/MainModules/MatchesDropContent/AudioDropScreen?id=${encodeURIComponent(audio.id)}`}
        >
          <div className="flex items-center gap-2 bg-[#1c1c1c] rounded-lg px-2 py-1.5 hover:bg-[#2a2a2a] transition-colors">
            <Mic size={18} className="text-[#C9115F] flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-white text-[10px] lg:text-[12px] font-medium leading-tight">
                {getDisplayTitle(audio)}
              </p>
              <p className="text-gray-500 text-[9px] lg:text-[12px] leading-tight">
                {getSpeakerLabel(audio)}
                {audio.matchInfo?.team1
                  ? ` · ${audio.matchInfo.team1} vs ${audio.matchInfo.team2}`
                  : ""}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── Latest Video List ─────────────────────────────────────────────────────────
function LatestVideoList() {
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/cloudinary/video?limit=2`)
      .then(res => {
        console.log("[LatestVideoList] API response:", res.data);
        if (res.data.success) {
          setVideoFiles(res.data.videoFiles.slice(0, 2));
          console.log("[LatestVideoList] videoFiles set:", res.data.videoFiles.slice(0, 2));
        }
      })
      .catch((err) => {
        console.error("[LatestVideoList] Error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-1.5 mt-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-8 bg-[#1c1c1c] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (videoFiles.length === 0) {
    console.log("[LatestVideoList] No video files to show");
    return null;
  }

  return (
    <div className="flex flex-col gap-1.5 mt-2">
      {videoFiles.map((video) => (
        <Link
          key={video.id}
          href={`/MainModules/MatchesDropContent/VideoDropScreen?id=${encodeURIComponent(video.id)}`}
        >
          <div className="flex items-center gap-2 bg-[#1c1c1c] rounded-lg px-2 py-1.5 hover:bg-[#2a2a2a] transition-colors">
            <Play size={18} className="text-[#C9115F] flex-shrink-0" fill="#C9115F" />
            <div className="min-w-0 flex-1">
              <p className="text-white text-[10px] lg:text-[12px] font-medium leading-tight">
                {video.title}
              </p>
              <p className="text-gray-500 text-[9px] lg:text-[12px] leading-tight">
                {video.playerInfo?.playerName
                  ? `${video.playerInfo.playerName.charAt(0).toUpperCase() + video.playerInfo.playerName.slice(1)} · Chapter ${video.playerInfo.chapterNumber}`
                  : "Video Drop"}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function HomeCardsSection() {
  const [cardsData, setCardsData] = useState<CardProps[]>(homeCardsData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrops = async () => {
      try {
        const response = await axios.get(`/api/cloudinary/audio`);
        const totalCount = response.data.totalCount || response.data.audioFiles?.length || 0;
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

            {/* Latest audio drops — only on card 1 */}
            {card.id === 1 && (
              <>
                <p className="text-gray-500 text-[10px] mt-3 mb-1 font-medium uppercase tracking-wide">
                  Latest Drops
                </p>
                <LatestAudioList />

                {/* <p className="text-gray-500 text-[10px] mt-3 mb-1 font-medium uppercase tracking-wide">
                  Latest Videos
                </p> */}
                <LatestVideoList />
              </>
            )}

            {/* Button - Only show for card 1 */}
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

      {error && (
        <div className="text-center text-red-500 text-xs mt-4">
          {error}
        </div>
      )}
    </div>
  );
}