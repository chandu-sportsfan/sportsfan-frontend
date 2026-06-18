// components/NewROARComponent/screens/RoomsHome.tsx

import { useRef } from "react";
import { motion } from "framer-motion";
import type { Room } from "../types";

const SPORT_GRADIENT: Record<string, string> = {
  cricket: "linear-gradient(135deg,#7c3aed,#4f46e5)",
  football: "linear-gradient(135deg,#dc2626,#b45309)",
  default: "linear-gradient(135deg,#e91e8c,#ff6b35)",
};
const SPORT_EMOJI: Record<string, string> = {
  cricket: "🏏",
  football: "⚽",
  default: "🎙️",
};

const INFINITY_ROOM: Room = {
  roomId: "sf360-infinity",
  name: "SF360 Infinity Room",
  description: "Infinite roaring conversations",
  sport: "default",
  isActive: true,
  fanCount: 27,
};

const DOT_COLORS = ["#e91e8c", "#ff6b35", "#00e8c6"];

function StackedAvatars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {DOT_COLORS.map((c, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full border-2 border-[#0e0e14] relative"
            style={{
              background: c,
              marginLeft: i === 0 ? 0 : -8,
              zIndex: DOT_COLORS.length - i,
            }}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-white/45">+{count} fans</span>
    </div>
  );
}

function Thumbnail({ room }: { room: Room }) {
  const sport = (room.sport ?? "default").toLowerCase();
  const gradient = SPORT_GRADIENT[sport] ?? SPORT_GRADIENT.default;
  const emoji = SPORT_EMOJI[sport] ?? SPORT_EMOJI.default;
  return (
    <div
      className="w-[90px] h-[90px] min-w-[90px] rounded-2xl flex items-center justify-center text-3xl overflow-hidden relative shrink-0"
      style={{ background: gradient }}
    >
      <div className="absolute inset-0 bg-black/15 rounded-2xl" />
      <span className="relative z-10">{emoji}</span>
    </div>
  );
}

function RoomCard({
  room,
  index,
  onJoin,
  onToast,
}: {
  room: Room;
  index: number;
  onJoin: (r: Room) => void;
  onToast: (m: string) => void;
}) {
  const isFuture =
    room.scheduledStartTime !== undefined && room.scheduledStartTime > Date.now();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="flex gap-4 items-center py-3.5 border-b border-white/[0.06]"
    >
      <Thumbnail room={room} />
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-extrabold text-white leading-tight mb-1 truncate">
          {room.name}
        </p>
        <p className="text-xs text-white/45 mb-2 leading-snug line-clamp-1">
          {room.description ?? "Roar conversations"}
        </p>
        <div className="mb-2.5">
          <StackedAvatars count={room.fanCount ?? 27} />
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            if (isFuture) { onToast("This room hasn't started yet."); return; }
            onJoin(room);
          }}
          className={[
            "w-full py-2.5 rounded-full text-[13px] font-bold transition-colors duration-150",
            isFuture
              ? "border border-white/20 text-white/30 cursor-not-allowed bg-transparent"
              : "border border-white/20 text-white cursor-pointer bg-transparent hover:border-white/40",
          ].join(" ")}
        >
          {isFuture ? "Coming Soon" : "Join Room"}
        </motion.button>
      </div>
    </motion.div>
  );
}

interface Props {
  rooms: Room[];
  onJoinRoom: (room: Room) => void;
  onToast: (m: string) => void;
}

export default function RoomsHome({ rooms, onJoinRoom, onToast }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const apiRooms = rooms.filter(
    (r) =>
      r.roomId !== "mock-cricket" &&
      r.roomId !== "mock-football" &&
      r.roomId !== INFINITY_ROOM.roomId,
  );

  const allRooms = [INFINITY_ROOM, ...apiRooms];

  // iOS Safari: manually forward touch events so scroll works even when a
  // parent has overflow:hidden. We let the div scroll itself via touch-action.
  const onTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        // Stay above the fixed bottom nav (60px) + safe area
        bottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        // Desktop: no bottom nav to worry about
      }}
      // On desktop screens the bottom nav doesn't exist; override via media query
      className="lg:!bottom-0"
    >
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          padding: "16px 16px 10px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "var(--bg-primary, #0e0e14)",
        }}
      >
        <p className="text-[15px] font-bold text-white">Roar Rooms</p>
      </div>

      {/* 
        Scroll container.
        Key iOS fix: touch-action:pan-y tells the browser this element
        scrolls vertically — even when a parent has overflow:hidden,
        iOS will still allow the touch scroll gesture here.
      */}
      <div
        ref={scrollRef}
        onTouchStart={onTouchStart}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "scroll",          // "scroll" not "auto" — forces scroll layer on iOS
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch" as any,
          touchAction: "pan-y",         // critical: tell iOS this div owns vertical scroll
          overscrollBehavior: "contain",
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 32,
        }}
      >
        {allRooms.map((room, i) => (
          <RoomCard
            key={room.roomId}
            room={room}
            index={i}
            onJoin={onJoinRoom}
            onToast={onToast}
          />
        ))}
        {/* Ensures last item isn't hidden behind anything */}
        <div style={{ height: 86 }} />
      </div>
    </div>
  );
}