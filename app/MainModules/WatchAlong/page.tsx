


"use client";


import { useRouter } from "next/navigation";
import WatchAlongLobby from "@/src/components/WatchLobby/WatchAlongLobby";


export default function WatchAlongPage() {
  const router = useRouter();
//   const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const handleEnterRoom = (roomId: string) => {
   
    router.push(`/MainModules/WatchAlong/room/${roomId}`);
  };


  return (
    
    // <WatchAlongLobby onEnterRoom={handleEnterRoom} />
    <>
    
    <div className="flex items-center justify-center min-h-screen">
      <img src="/images/watchsoon.png" alt="Watch Along"  className="w-[1000px] h-[600px]  object-fit"/>
    </div>

    </>
   
  )
  
}