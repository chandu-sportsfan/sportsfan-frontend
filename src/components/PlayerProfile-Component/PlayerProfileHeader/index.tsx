"use client";
import { Player } from "@/types/player";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  player: Player;
}

interface Post {
  id: string;
  playerName: string;
  title: string;
  likes: number;
  comments: number;
  live: number;
  shares: number;
  image: string;
  logo: string;
  hasVideo?: boolean;
  createdAt: number;
  updatedAt?: number;
  playerProfilesId?: string;
}


// === HOME CARD TYPES ===
type CatLogo = {
  label: string;
  logo: string;
};

type Category = {
  title: string;
  image: string;
};

type HomeItem = {
  id: string;
  playerProfilesId: string;
  playerName: string;
  hasVideo: boolean;
  createdAt: number;
  shares: number;
  image: string;
  comments: number;
  catlogo: CatLogo[];
  logo: string;
  title: string;
  category: Category[];
  live: number;
  likes: number;
  updatedAt: number;
};



// === MAIN API RESPONSE TYPES ===
type Player360Data = {
  home: HomeItem[];
};



type ApiResponse = {
  success: boolean;
  data: Player360Data;
};

export default function PlayerProfileHeader({ player }: Props) {

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPlayerData();
    }
  }, [id]);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        `/api/player-profile/search/${id}`
      );

      console.log("API Response:", response.data);

      if (response.data.success && response.data.data) {
        // Set home posts
        if (response.data.data.home && response.data.data.home.length > 0) {
          setPosts(response.data.data.home);
        }

     
      }
    } catch (error) {
      console.error("Failed to fetch player data:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center px-4 md:px-6 pt-6 md:pt-8 pb-2 gap-4 md:gap-5">

      {/* Gradient ring avatar */}
      <div className="rounded-full p-[3px] bg-gradient-to-br from-[#e91e8c] to-[#ff5722] w-28 h-28 md:w-36 md:h-36 lg:w-32 lg:h-32 shrink-0">
        <div className="w-full h-full rounded-full overflow-hidden bg-[#111111]">

           {posts.map((post, index) => (
            <div key={index}>
              <img
                src={post.image}
                alt={post.playerName}
                className="w-full h-full object-cover object-top"
              />
            </div>
          ))} 

         

        </div>
      </div>

      {/* Name + Team */}
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-[28px] md:text-[36px] lg:text-[32px] font-extrabold text-white tracking-tight leading-none text-center">
          {player.name}
        </h1>
        <p className="text-sm md:text-base font-semibold text-[#e91e8c] tracking-wide text-center">
          {player.team}
        </p>
      </div>

      {/* Style pills */}
      <div className="flex items-center gap-3">
        <span className="px-4 md:px-5 py-2 rounded-full bg-[#1c1c1c] border border-[#363636] text-[#d4d4d4] text-[13px] md:text-sm font-medium">
          {player.battingStyle}
        </span>
        <span className="px-4 md:px-5 py-2 rounded-full bg-[#e91e8c] text-white text-[13px] md:text-sm font-semibold">
          {player.bowlingStyle}
        </span>
      </div>

      {/* About card */}
      <div className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 md:p-5 mt-1">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-[3px] h-5 bg-[#e91e8c] rounded-sm shrink-0" />
          <span className="text-base md:text-lg font-bold text-white">About</span>
        </div>
        <p className="text-[13px] md:text-sm text-[#9a9a9a] leading-[1.75]">
          {player.about}
        </p>
      </div>
    </div>
  );
}