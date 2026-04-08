// "use client";

// import WatchAlongLobby, { type Expert } from "@/src/components/WatchLobby/WatchAlongLobby";
// import WatchRoom from "@/src/components/WatchLobby/Watchroom";
// import { useState } from "react";


// export default function WatchAlongPage() {
//   const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

//   return selectedExpert ? (
//     <WatchRoom
//       expert={selectedExpert}
//       onBack={() => setSelectedExpert(null)}
//     />
//   ) : (
//     <WatchAlongLobby onEnterRoom={(expert) => setSelectedExpert(expert)} />
//   );
// }



// app/watch-along/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WatchAlongLobby from "@/src/components/WatchLobby/WatchAlongLobby";
import { Room } from "@/context/WatchAlongContext";

export default function WatchAlongPage() {
  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const handleEnterRoom = (roomId: string) => {
    // Navigate to the room page with room ID in URL
    router.push(`/MainModules/WatchAlong/room/${roomId}`);
  };

  // If we have a selected room ID, show the room (but we're using URL navigation now)
  // This approach is cleaner as it allows deep linking and browser back button
  return <WatchAlongLobby onEnterRoom={handleEnterRoom} />;
}