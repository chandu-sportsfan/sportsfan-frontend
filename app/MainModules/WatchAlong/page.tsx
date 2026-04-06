"use client";

import WatchAlongLobby, { type Expert } from "@/src/components/WatchLobby/WatchAlongLobby";
import WatchRoom from "@/src/components/WatchLobby/Watchroom";
import { useState } from "react";


export default function WatchAlongPage() {
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  return selectedExpert ? (
    <WatchRoom
      expert={selectedExpert}
      onBack={() => setSelectedExpert(null)}
    />
  ) : (
    <WatchAlongLobby onEnterRoom={(expert) => setSelectedExpert(expert)} />
  );
}