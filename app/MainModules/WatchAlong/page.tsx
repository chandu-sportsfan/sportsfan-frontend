


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
    
    <WatchAlongLobby onEnterRoom={handleEnterRoom} />
   
  )
  
}