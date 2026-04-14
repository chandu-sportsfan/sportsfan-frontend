// app/MainModules/WatchAlong/room/[id]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWatchAlong } from "@/context/WatchAlongContext";
import WatchRoom from "@/src/components/WatchLobby/Watchroom";


export default function WatchRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.id as string;
  
  const { 
    currentRoom, 
    fetchRoomById, 
    loading,
    error 
  } = useWatchAlong();

  useEffect(() => {
    if (roomId) {
      fetchRoomById(roomId);
    }
  }, [roomId, fetchRoomById]);

  if (loading && !currentRoom) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => router.push("/MainModules/WatchAlong")}
            className="text-pink-500 hover:text-pink-400"
          >
            Go Back 123
          </button>
        </div>
      </div>
    );
  }

if (error && !currentRoom) {
    return (
        <div className="min-h-screen bg-[#111] flex items-center justify-center">
            <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button 
                    onClick={() => router.push("/MainModules/WatchAlong")}
                    className="text-pink-500 hover:text-pink-400"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}

  if (!currentRoom) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Room not found</p>
          <button 
            onClick={() => router.push("/MainModules/WatchAlong")}
            className="mt-4 text-pink-500 hover:text-pink-400"
          >
            Go Back 
          </button>
        </div>
      </div>
    );
  }

  return (
    <WatchRoom
      room={currentRoom} 
      onBack={() => router.push("/MainModules/WatchAlong")} 
    />
  );
}