
"use client";
import Link from "next/link";
import { Mic, Play, List } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

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

interface Playlist {
  id: string;
  name: string;
  audioIds: string[];
  createdAt: number;
  updatedAt: number;
}

interface Team360Post {
  id: string;
  teamName: string;
}

interface Team360Playlist {
  id: string;
  team360PostId: string;
  audioDrops: unknown[];
  videoDrops: unknown[];
  createdAt: number;
  updatedAt: number;
}

interface TeamPlaylistItem {
  id: string;
  title: string;
  dropCount: number;
  href: string;
}

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

// IPL Teams mapping for filtering
const IPL_TEAMS: Record<string, string[]> = {
  "Mumbai Indians": ["MI", "Mumbai"],
  "Chennai Super Kings": ["CSK", "Chennai"],
  "Royal Challengers Bengaluru": ["RCB", "Bengaluru", "Bangalore"],
  "Sunrisers Hyderabad": ["SRH", "Hyderabad"],
  "Kolkata Knight Riders": ["KKR", "Kolkata"],
  "Delhi Capitals": ["DC", "Delhi"],
  "Rajasthan Royals": ["RR", "Rajasthan"],
  "Punjab Kings": ["PBKS", "Punjab"],
  "Lucknow Super Giants": ["LSG", "Lucknow"],
  "Gujarat Titans": ["GT", "Gujarat"],
};

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
      { label: "Plays", value: "0" },
    ],
    buttonText: "View Full Playlist",
    buttonIcon: "play",
    buttonUrl: "/MainModules/Playlists"
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
  {
    id: 3,
    title: "My Playlists",
    subtitle: "All your favorite sports content in one place",
    image: "/images/cricketarticlessecond.jpg",
    profileUrl: "/MainModules/Playlists",
    stats: [
      { label: "Playlists", value: "0" },
      { label: "Total Drops", value: "0" },
      { label: "Saved", value: "0" },
    ],
    buttonText: "View All Playlists",
    buttonIcon: "chart",
    buttonUrl: "/MainModules/Playlists"
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

// Newest-first sort by createdAt
function newestFirst<T extends { createdAt: string }>(arr: T[]): T[] {
  return [...arr].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Format number (e.g., 1200 → "1.2K")
function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// Check if a drop is from an IPL match
function isIPLDrop(matchInfo?: MatchInfo, title?: string): boolean {
  if (!matchInfo) return false;
  
  // Check if team1 or team2 is an IPL team
  const teams = [matchInfo.team1, matchInfo.team2];
  const allTeamKeys = Object.keys(IPL_TEAMS);
  
  return teams.some(team => team && allTeamKeys.includes(team));
}

// Extract match name from audio title (e.g., "GT vs RCB" from "GT vs RCB - TOSS REPORT")
function extractMatchName(title: string): string {
  if (!title) return "";
  
  // Try to extract text before " - " which typically separates match name from type
  const dashIndex = title.indexOf(" - ");
  if (dashIndex > 0) {
    return title.substring(0, dashIndex).trim();
  }
  
  // If no dash found, try to extract before common keywords
  const keywords = ["TOSS REPORT", "POST MATCH", "PRE MATCH", "MATCH ANALYSIS", "HIGHLIGHTS"];
  for (const keyword of keywords) {
    if (title.toUpperCase().includes(keyword)) {
      const keywordIndex = title.toUpperCase().indexOf(keyword);
      return title.substring(0, keywordIndex).trim();
    }
  }
  
  return "";
}

// ── Latest Playlists List ─────────────────────────────────────────────────────
function LatestPlaylistsList({ userId }: { userId: string | null }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [teamPlaylists, setTeamPlaylists] = useState<TeamPlaylistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);

      try {
        const requests: Promise<any>[] = [];
        if (userId) {
          requests.push(axios.get(`/api/playlists?userId=${userId}`));
        } else {
          requests.push(Promise.resolve({ data: { success: true, playlists: [] } }));
        }
        requests.push(axios.get("/api/team360"));
        requests.push(axios.get("/api/team360-playlist"));

        const [userPlaylistsRes, teamPostsRes, teamPlaylistsRes] = await Promise.all(requests);

        if (userPlaylistsRes.data.success) {
          const sorted = (userPlaylistsRes.data.playlists || []).sort((a: Playlist, b: Playlist) => b.createdAt - a.createdAt);
          setPlaylists(sorted.slice(0, 3));
        } else {
          setPlaylists([]);
        }

        const teamPosts: Team360Post[] = teamPostsRes.data.posts || [];
        const teamNameById = new Map(teamPosts.map((post) => [post.id, post.teamName] as const));

        const latestTeamPlaylists = (teamPlaylistsRes.data?.success && Array.isArray(teamPlaylistsRes.data.playlists)
          ? (teamPlaylistsRes.data.playlists as Team360Playlist[])
          : [])
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 3)
          .map((playlist) => {
            const dropCount = (playlist.audioDrops?.length || 0) + (playlist.videoDrops?.length || 0);
            const teamName = teamNameById.get(playlist.team360PostId) || "Team 360 Playlist";

            return {
              id: playlist.id,
              title: teamName,
              dropCount,
              href: `/MainModules/MatchesDropContent?team=${encodeURIComponent(teamName)}`,
            };
          });

        setTeamPlaylists(latestTeamPlaylists);
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setPlaylists([]);
        setTeamPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-2 mt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-[#1c1c1c] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      {playlists.length > 0 ? (
        playlists.map((playlist) => (
          <Link
            key={playlist.id}
            href={`/MainModules/Playlists?playlistId=${playlist.id}`}
          >
            <div className="flex items-center gap-2 bg-[#1c1c1c] rounded-lg px-2 py-2 hover:bg-[#2a2a2a] transition-colors cursor-pointer">
              <List size={18} className="text-[#C9115F] flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-white text-[11px] lg:text-[12px] font-medium leading-tight truncate">
                  {playlist.name}
                </p>
                <p className="text-gray-500 text-[9px] lg:text-[10px] leading-tight">
                  {playlist.audioIds.length} {playlist.audioIds.length === 1 ? "drop" : "drops"}
                </p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="mt-1 text-center py-2">
          <p className="text-gray-500 text-[11px]">No personal playlists yet</p>
          <p className="text-gray-600 text-[9px] mt-1">Team 360 playlists are shown below if available</p>
        </div>
      )}

      {teamPlaylists.length > 0 && (
        <div className="pt-2">
          <p className="text-gray-500 text-[10px] font-medium uppercase tracking-wide mb-1">Team 360 Playlists</p>
          <div className="flex flex-col gap-2">
            {teamPlaylists.map((playlist) => (
              <Link key={playlist.id} href={playlist.href}>
                <div className="flex items-center gap-2 bg-[#1c1c1c] rounded-lg px-2 py-2 hover:bg-[#2a2a2a] transition-colors cursor-pointer">
                  <List size={18} className="text-[#C9115F] flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-[11px] lg:text-[12px] font-medium leading-tight truncate">
                      {playlist.title}
                    </p>
                    <p className="text-gray-500 text-[9px] lg:text-[10px] leading-tight">
                      {playlist.dropCount} {playlist.dropCount === 1 ? "drop" : "drops"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Latest Audio List (IPL + Fallback) ─────────────────────────────────────
function LatestAudioList() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/cloudinary/audio?limit=50`)
      .then(res => {
        if (res.data.success) {
          // Sort all by newest first
          const sorted = newestFirst(res.data.audioFiles as AudioFile[]);
          
          // Try to filter for IPL drops
          const iplDrops = sorted.filter((audio: AudioFile) => 
            isIPLDrop(audio.matchInfo, audio.title)
          );
          
          // Use IPL drops if we have at least 2, otherwise use latest drops
          const dropsToShow = iplDrops.length >= 2 ? iplDrops : sorted;
          setAudioFiles(dropsToShow.slice(0, 2));
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
                {extractMatchName(audio.title)
                  ? `${getSpeakerLabel(audio)} · ${extractMatchName(audio.title)}`
                  : `${getDisplayTitle(audio)} · ${getSpeakerLabel(audio)}`
                }
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── Latest Video List (IPL + Fallback) ─────────────────────────────────────
function LatestVideoList() {
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/cloudinary/video?limit=50`)
      .then(res => {
        if (res.data.success) {
          // Sort all by newest first
          const sorted = newestFirst(res.data.videoFiles as VideoFile[]);
          
          // Try to filter for IPL videos by checking title for IPL team names
          const iplVideos = sorted.filter((video: VideoFile) => {
            const title = video.title.toUpperCase();
            const allTeamKeys = Object.keys(IPL_TEAMS);
            
            // Check if title contains any IPL team name or abbreviation
            return allTeamKeys.some(team => {
              const abbrs = IPL_TEAMS[team];
              return abbrs.some(abbr => title.includes(abbr.toUpperCase()));
            });
          });
          
          // Use IPL videos if we have at least 2, otherwise use latest videos
          const videosToShow = iplVideos.length >= 2 ? iplVideos : sorted;
          setVideoFiles(videosToShow.slice(0, 2));
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

  if (videoFiles.length === 0) return null;

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
  const { user } = useAuth();
  const [cardsData, setCardsData] = useState<CardProps[]>(homeCardsData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [playlistStats, setPlaylistStats] = useState({ totalPlaylists: 0, totalDrops: 0 });

  const userId = user?.userId || null;

  // Fetch playlist stats
  useEffect(() => {
    if (!userId) return;

    const fetchPlaylistStats = async () => {
      try {
        const res = await axios.get(`/api/playlists?userId=${userId}`);
        if (res.data.success) {
          const playlists = res.data.playlists || [];
          const totalPlaylists = playlists.length;
          const totalDrops = playlists.reduce((sum: number, p: Playlist) => sum + p.audioIds.length, 0);
          
          setPlaylistStats({ totalPlaylists, totalDrops });
          
          // Update the My Playlists card stats
          setCardsData(prevCards =>
            prevCards.map(card =>
              card.id === 3
                ? {
                    ...card,
                    stats: card.stats.map(stat => {
                      if (stat.label === "Playlists") return { ...stat, value: totalPlaylists.toString() };
                      if (stat.label === "Total Drops") return { ...stat, value: totalDrops.toString() };
                      if (stat.label === "Saved") return { ...stat, value: formatNumber(totalDrops) };
                      return stat;
                    }),
                  }
                : card
            )
          );
        }
      } catch (err) {
        console.error("Error fetching playlist stats:", err);
      }
    };

    fetchPlaylistStats();
  }, [userId]);

  // Fetch drops and plays stats for IPL card
  useEffect(() => {
    const fetchDrops = async () => {
      try {
        const [audioRes, playsRes] = await Promise.allSettled([
          axios.get(`/api/cloudinary/audio`),
          axios.get(`/api/cloudinary/plays`),
        ]);

        const totalCount =
          audioRes.status === "fulfilled"
            ? audioRes.value.data.totalCount || audioRes.value.data.audioFiles?.length || 0
            : 0;

        const playsMap: Record<string, number> =
          playsRes.status === "fulfilled" ? playsRes.value.data.plays || {} : {};

        const totalPlays = Object.values(playsMap).reduce((sum, n) => sum + n, 0);

        setCardsData(prevCards =>
          prevCards.map(card =>
            card.id === 1
              ? {
                  ...card,
                  stats: card.stats.map(stat => {
                    if (stat.label === "Drops") return { ...stat, value: totalCount.toString() };
                    if (stat.label === "Plays") return { ...stat, value: formatNumber(totalPlays) };
                    return stat;
                  }),
                }
              : card
          )
        );
      } catch (err: unknown) {
        console.log("Stats fetch error:", err);
        setError("Failed to load stats.");
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

            {/* Stats - For IPL card */}
            {card.id === 1 && (
              <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                {card.stats.map((stat, i) => (
                  <div key={i} className="bg-[#1c1c1c] p-2 rounded-lg">
                    <p className="text-gray-400 text-[9px]">{stat.label}</p>
                    <p className="font-semibold text-[12px]">
                      {loading && card.id === 1 && (stat.label === "Drops" || stat.label === "Plays") ? (
                        <span className="inline-block w-8 h-3 bg-gray-700 rounded animate-pulse"></span>
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Stats - For My Playlists card */}
            {card.id === 3 && (
              <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                {card.stats.map((stat, i) => (
                  <div key={i} className="bg-[#1c1c1c] p-2 rounded-lg">
                    <p className="text-gray-400 text-[9px]">{stat.label}</p>
                    <p className="font-semibold text-[12px] text-white">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Latest drops — only on IPL card (id: 1) */}
            {card.id === 1 && (
              <>
                <p className="text-gray-500 text-[10px] mt-3 mb-1 font-medium uppercase tracking-wide">
                  Latest Drops
                </p>
                <LatestAudioList />
                <LatestVideoList />
              </>
            )}

            {/* Latest Playlists — only on My Playlists card (id: 3) */}
            {card.id === 3 && (
              <>
                <p className="text-gray-500 text-[10px] mt-3 mb-1 font-medium uppercase tracking-wide">
                  Recent Playlists
                </p>
                <LatestPlaylistsList userId={userId} />
              </>
            )}

            {/* Button - Show for card 1 and card 3 */}
            {(card.id === 1 || card.id === 3) && (
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

            {/* Button - Show for card 1 and card 3 */}
{(card.id === 1) && (
  <div className="mt-auto pt-2 flex flex-col gap-2">
    
    {/* Points Table Button — only for IPL card */}
    {card.id === 1 && (
      <Link href="/MainModules/Matchcenter">
        <button className="w-full bg-[#1c1c1c] border border-[#C9115F]/40 py-1.5 rounded-full font-semibold text-[13px] flex items-center justify-center gap-2 cursor-pointer text-white hover:bg-[#2a2a2a] transition-colors">
          <span>🏆</span>
          IPL 2026 Points Table
        </button>
      </Link>
    )}

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