

// import { useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import type { Room } from "../types";

// const SPORT_GRADIENT: Record<string, string> = {
//   cricket:  "linear-gradient(135deg,#7c3aed,#4f46e5)",
//   football: "linear-gradient(135deg,#dc2626,#b45309)",
//   default:  "linear-gradient(135deg,#e91e8c,#ff6b35)",
// };

// const SPORT_IMAGE: Record<string, string> = {
//   cricket:  "/images/wt20.png",
//   football: "/images/fifa.png",
//   default:  "/images/fifa.png",
// };

// const ROOM_IMAGE: Record<string, string> = {
//   "sf360-infinity": "/images/infinityroom.png",
// };

// const INFINITY_ROOM: Room = {
//   roomId:      "sf360-infinity",
//   name:        "SF360 Infinity Room",
//   description: "Infinite roaring conversations",
//   sport:       "default",
//   isActive:    true,
//   fanCount:    27,
// };

// interface ActiveFan {
//   uid: string;
//   username: string;
//   avatarUrl?: string | null;
//   badge?: string | null;
// }

// function StackedAvatars({
//   fans,
//   count,
//   loaded,
//   totalJoinCount,
// }: {
//   fans: ActiveFan[];
//   count: number;
//   loaded: boolean;
//   totalJoinCount?: number;
// }) {
//   const DOT_COLORS = ["#e91e8c", "#ff6b35", "#00e8c6"];
//   const hasFans = fans.length > 0;

//   const formatCount = (n: number) =>
//     n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

//   return (
//     <div className="flex flex-col gap-0.5">
//       {/* Row 1: Avatars + Active count */}
//       <div className="flex items-center gap-1.5">
//         <div className="flex">
//           {hasFans
//             ? fans.slice(0, 3).map((fan, i) => (
//                 <div
//                   key={fan.uid}
//                   className="w-6 h-6 rounded-full border-2 border-[#0e0e14] relative overflow-hidden flex items-center justify-center"
//                   style={{
//                     marginLeft: i === 0 ? 0 : -8,
//                     zIndex: 3 - i,
//                     background: fan.avatarUrl
//                       ? undefined
//                       : "linear-gradient(135deg,#e91e8c,#ff6b35)",
//                   }}
//                 >
//                   {fan.avatarUrl ? (
//                     <img
//                       src={fan.avatarUrl}
//                       alt={fan.username}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <span className="text-[9px] font-extrabold text-white">
//                       {fan.username?.[0]?.toUpperCase() || "?"}
//                     </span>
//                   )}
//                 </div>
//               ))
//             : DOT_COLORS.map((c, i) => (
//                 <div
//                   key={i}
//                   className="w-6 h-6 rounded-full border-2 border-[#0e0e14] relative"
//                   style={{
//                     background: c,
//                     marginLeft: i === 0 ? 0 : -8,
//                     zIndex: DOT_COLORS.length - i,
//                     opacity: loaded ? 1 : 0.35,
//                   }}
//                 />
//               ))}
//         </div>
//         {loaded ? (
//           <span className="text-xs font-semibold text-white/45">
//              <span className="text-xs font-bold text-white/90">+{count} </span>Active
//           </span>
//         ) : (
//           <span className="text-xs font-semibold text-white/25">···</span>
//         )}
//       </div>

//       {/* Row 2: Total members joined (only when loaded and > 0) */}
//       {loaded && totalJoinCount !== undefined && totalJoinCount > 0 && (
//         <div className="flex items-center gap-1.5">
//           <span className="text-xs font-semibold text-white/40">
//             Total members joined -
//           </span>
//           <span className="text-xs font-bold text-white/90">
//             {formatCount(totalJoinCount)}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }

// function Thumbnail({ room }: { room: Room }) {
//   const sport    = (room.sport ?? "default").toLowerCase();
//   const gradient = SPORT_GRADIENT[sport] ?? SPORT_GRADIENT.default;
//   const imgSrc   =
//     ROOM_IMAGE[room.roomId] ??
//     SPORT_IMAGE[sport] ??
//     SPORT_IMAGE.default;

//   return (
//     <div
//       className="w-[90px] h-[90px] min-w-[90px] rounded-2xl flex items-center justify-center text-3xl overflow-hidden relative shrink-0"
//       style={{ background: gradient }}
//     >
//       <img
//         src={imgSrc}
//         alt={room.name}
//         className="absolute inset-0 w-full h-full object-cover rounded-2xl"
//         onError={(e) => {
//           (e.currentTarget as HTMLImageElement).style.display = "none";
//         }}
//       />
//       <div className="absolute inset-0 bg-black/15 rounded-2xl" />
//     </div>
//   );
// }

// function SportBadge({ sport }: { sport: string }) {
//   const label = sport.charAt(0).toUpperCase() + sport.slice(1).toLowerCase();
//   const colors: Record<string, string> = {
//     cricket:  "rgba(124,58,237,0.25)",
//     football: "rgba(220,38,38,0.25)",
//     default:  "rgba(233,30,140,0.20)",
//   };
//   const bg = colors[sport.toLowerCase()] ?? colors.default;

//   return (
//     <span
//       className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
//       style={{ background: bg, color: "rgba(255,255,255,0.65)" }}
//     >
//       {label}
//     </span>
//   );
// }

// function RoomCard({
//   room,
//   index,
//   onJoin,
//   onToast,
//   presence,
// }: {
//   room: Room;
//   index: number;
//   onJoin: (r: Room) => void;
//   onToast: (m: string) => void;
//   presence?: { fanCount: number; fans: ActiveFan[]; totalJoinCount?: number };
// }) {
//   const isFuture =
//     room.scheduledStartTime !== undefined &&
//     room.scheduledStartTime > Date.now();

//   const sport = (room.sport ?? "default").toLowerCase();
//   const presenceLoaded = presence !== undefined;
//   const liveFanCount = presence?.fanCount ?? 0;
//   const liveFans = presence?.fans ?? [];
//   const totalJoinCount = presence?.totalJoinCount;

//   const isInfinityRoom = room.roomId === INFINITY_ROOM.roomId; // ← new

//   const handleCardClick = () => {
//     if (isFuture) {
//       onToast("This room hasn't started yet.");
//       return;
//     }
//     onJoin(room);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 14 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.07 }}
//       className="flex gap-4 items-center py-3.5 border-b border-white/[0.06] cursor-pointer hover:bg-white/[0.02] transition-colors duration-150"
//       onClick={handleCardClick}
//     >
//       <Thumbnail room={room} />

//       <div className="flex-1 min-w-0">
//         {sport !== "default" && <SportBadge sport={sport} />}
//         <div className="flex items-center gap-2 mb-1 min-w-0">
//           <p className="text-[15px] font-extrabold text-white whitespace-nowrap">
//             {room.name}
//           </p>
//         </div>

//         <p className="text-xs text-white/45 mb-2 leading-snug line-clamp-2">
//           {room.description ?? "Roar conversations"}
//         </p>

//         {/* Hide avatars + active count for infinity room */}
//         {!isInfinityRoom && (
//           <div className="mb-2.5">
//             <StackedAvatars
//               fans={liveFans}
//               count={liveFanCount}
//               loaded={presenceLoaded}
//               totalJoinCount={totalJoinCount}
//             />
//           </div>
//         )}

//         <motion.button
//           whileTap={{ scale: 0.96 }}
//           onClick={(e) => {
//             e.stopPropagation();
//             if (isFuture) { onToast("This room hasn't started yet."); return; }
//             onJoin(room);
//           }}
//           className={[
//             "w-full py-2.5 rounded-full text-[13px] font-bold transition-colors duration-150",
//             isFuture
//               ? "border border-white/20 text-white/30 cursor-not-allowed bg-transparent"
//               : "border border-white/20 text-white cursor-pointer bg-transparent hover:border-white/40",
//           ].join(" ")}
//         >
//           {isFuture ? "Coming Soon" : "Join Room"}
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// }

// interface Props {
//   rooms: Room[];
//   onJoinRoom: (room: Room) => void;
//   onToast: (m: string) => void;
// }

// export default function RoomsHome({ rooms, onJoinRoom, onToast }: Props) {
//   const scrollRef = useRef<HTMLDivElement>(null);
//  type PresenceByRoom = {
//     [roomId: string]: { fanCount: number; fans: ActiveFan[]; totalJoinCount?: number };
//   };
//   const [presenceByRoom, setPresenceByRoom] = useState<PresenceByRoom>({});

//   const apiRooms = rooms.filter(
//     (r) =>
//       r.roomId !== "mock-cricket" &&
//       r.roomId !== "mock-football" &&
//       r.roomId !== INFINITY_ROOM.roomId,
//   );

//   const allRooms = [INFINITY_ROOM, ...apiRooms];

//   useEffect(() => {
//     const roomIds = allRooms.map((r) => r.roomId);
//     if (roomIds.length === 0) return;

//     let cancelled = false;
//     const fetchPreview = async () => {
//       try {
//         const res = await axios.post("/api/roar/rooms/presence-preview", { roomIds });
//         if (!cancelled && res.data?.success) setPresenceByRoom(res.data.rooms);
//       } catch (e) {
//         console.error("Presence preview failed:", e);
//       }
//     };

//     fetchPreview();
//     const iv = setInterval(() => {
//       if (!document.hidden) fetchPreview();
//     }, 30_000);
//     return () => { cancelled = true; clearInterval(iv); };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [rooms.length]);

//   return (
//     <div
//       style={{
//         position: "absolute", top: 0, left: 0, right: 0,
//         bottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
//         display: "flex", flexDirection: "column", overflow: "hidden",
//       }}
//       className="lg:!bottom-0"
//     >
//       {/* Header */}
//       <div
//         style={{
//           flexShrink: 0,
//           padding: "16px 16px 10px",
//           borderBottom: "1px solid rgba(255,255,255,0.06)",
//           background: "var(--bg-primary, #0e0e14)",
//         }}
//       >
//         <p className="text-[15px] font-bold text-white">Roar Rooms</p>
//       </div>

//       <div
//         ref={scrollRef}
//         onTouchStart={(e) => e.stopPropagation()}
//         style={{
//           flex: 1, minHeight: 0,
//           overflowY: "scroll", overflowX: "hidden",
//           WebkitOverflowScrolling: "touch" as any,
//           touchAction: "pan-y",
//           overscrollBehavior: "contain",
//           paddingLeft: 16, paddingRight: 16, paddingBottom: 32,
//         }}
//       >
//         {allRooms.map((room, i) => (
//           <RoomCard
//             key={room.roomId}
//             room={room}
//             index={i}
//             onJoin={onJoinRoom}
//             onToast={onToast}
//             presence={presenceByRoom[room.roomId]}
//           />
//         ))}
//         <div style={{ height: 86 }} />
//       </div>
//     </div>
//   );
// }




import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import type { Room } from "../types";

const SPORT_GRADIENT: Record<string, string> = {
  cricket:  "linear-gradient(135deg,#7c3aed,#4f46e5)",
  football: "linear-gradient(135deg,#dc2626,#b45309)",
  default:  "linear-gradient(135deg,#e91e8c,#ff6b35)",
};

const SPORT_IMAGE: Record<string, string> = {
  cricket:  "/images/cricket3.png",
  football: "/images/fifa2.png",
  default:  "/images/fifa2.png",
};

const INFINITY_ROOM_ID = "vZFu6xEApNRd1aUbDuHW";

// Temporary: only this room is shown, everything else is hidden.
// Revert by restoring the old mock-room exclusion filter in `allRooms` below.
// const ONLY_VISIBLE_ROOM_ID = "2yQvtie7nIcWXDA2iUDj && biDY0WLIZB7wBCaE2Ppx";
const VISIBLE_ROOM_IDS = ["2yQvtie7nIcWXDA2iUDj", "biDY0WLIZB7wBCaE2Ppx"];


interface ActiveFan {
  uid: string;
  username: string;
  avatarUrl?: string | null;
  badge?: string | null;
}

function StackedAvatars({
  fans,
  count,
  loaded,
  totalJoinCount,
}: {
  fans: ActiveFan[];
  count: number;
  loaded: boolean;
  totalJoinCount?: number;
}) {
  const DOT_COLORS = ["#e91e8c", "#ff6b35", "#00e8c6"];
  const hasFans = fans.length > 0;

  const formatCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

  return (
    <div className="flex flex-col gap-0.5">
      {/* Row 1: Avatars + Active count */}
      <div className="flex items-center gap-1.5">
        <div className="flex">
          {hasFans
            ? fans.slice(0, 3).map((fan, i) => (
                <div
                  key={fan.uid}
                  className="w-6 h-6 rounded-full border-2 border-[#0e0e14] relative overflow-hidden flex items-center justify-center"
                  style={{
                    marginLeft: i === 0 ? 0 : -8,
                    zIndex: 3 - i,
                    background: fan.avatarUrl
                      ? undefined
                      : "linear-gradient(135deg,#e91e8c,#ff6b35)",
                  }}
                >
                  {fan.avatarUrl ? (
                    <img
                      src={fan.avatarUrl}
                      alt={fan.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[9px] font-extrabold text-white">
                      {fan.username?.[0]?.toUpperCase() || "?"}
                    </span>
                  )}
                </div>
              ))
            : DOT_COLORS.map((c, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-[#0e0e14] relative"
                  style={{
                    background: c,
                    marginLeft: i === 0 ? 0 : -8,
                    zIndex: DOT_COLORS.length - i,
                    opacity: loaded ? 1 : 0.35,
                  }}
                />
              ))}
        </div>
        {loaded ? (
          <span className="text-xs font-semibold text-white/45">
            <span className="text-xs font-bold text-white/90">+{count} </span>Active
          </span>
        ) : (
          <span className="text-xs font-semibold text-white/25">···</span>
        )}
      </div>

      {/* Row 2: Total members joined (only when loaded and > 0) */}
      {loaded && totalJoinCount !== undefined && totalJoinCount > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-white/40">
            Total members joined -
          </span>
          <span className="text-xs font-bold text-white/90">
            {formatCount(totalJoinCount)}
          </span>
        </div>
      )}
    </div>
  );
}

function Thumbnail({ room, isInfinityRoom }: { room: Room; isInfinityRoom?: boolean }) {
  const sport    = (room.sport ?? "default").toLowerCase();
  const gradient = SPORT_GRADIENT[sport] ?? SPORT_GRADIENT.default;
  const imgSrc   = isInfinityRoom
    ? "/images/infinityroom.png"
    : SPORT_IMAGE[sport] ?? SPORT_IMAGE.default;

  return (
    <div
      className="w-[90px] h-[90px] min-w-[90px] rounded-2xl flex items-center justify-center text-3xl overflow-hidden relative shrink-0"
      style={{ background: gradient }}
    >
      <img
        src={imgSrc}
        alt={room.name}
        className="absolute inset-0 w-full h-full object-fit rounded-2xl"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <div className="absolute inset-0 bg-black/15 rounded-2xl" />
    </div>
  );
}

function SportBadge({ sport }: { sport: string }) {
  const label = sport.charAt(0).toUpperCase() + sport.slice(1).toLowerCase();
  const colors: Record<string, string> = {
    cricket:  "rgba(124,58,237,0.25)",
    football: "rgba(220,38,38,0.25)",
    default:  "rgba(233,30,140,0.20)",
  };
  const bg = colors[sport.toLowerCase()] ?? colors.default;

  return (
    <span
      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ background: bg, color: "rgba(255,255,255,0.65)" }}
    >
      {label}
    </span>
  );
}

function RoomCard({
  room,
  index,
  onJoin,
  onToast,
  presence,
}: {
  room: Room;
  index: number;
  onJoin: (r: Room) => void;
  onToast: (m: string) => void;
  presence?: { fanCount: number; fans: ActiveFan[]; totalJoinCount?: number };
}) {
  const isFuture =
    room.scheduledStartTime !== undefined &&
    room.scheduledStartTime > Date.now();

  const sport = (room.sport ?? "default").toLowerCase();
  const presenceLoaded = presence !== undefined;
  const liveFanCount = presence?.fanCount ?? 0;
  const liveFans = presence?.fans ?? [];
  const totalJoinCount = presence?.totalJoinCount;

  const isInfinityRoom = room.roomId === INFINITY_ROOM_ID;

  const handleCardClick = () => {
    if (isFuture) {
      onToast("This room hasn't started yet.");
      return;
    }
    onJoin(room);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="flex gap-4 items-center py-3.5 border-b border-white/[0.06] cursor-pointer hover:bg-white/[0.02] transition-colors duration-150"
      onClick={handleCardClick}
    >
      <Thumbnail room={room} isInfinityRoom={isInfinityRoom} />

      <div className="flex-1 min-w-0">
        {sport !== "default" && !isInfinityRoom && <SportBadge sport={sport} />}
        <div className="flex items-center gap-2 mb-1 min-w-0">
          <p className="text-[15px] font-extrabold text-white whitespace-normal">
            {room.name}
          </p>
        </div>

        <p className="text-xs text-white/45 mb-2 leading-snug line-clamp-2">
          {room.description ?? "Roar conversations"}
        </p>

        {/* Hide avatars + active count for infinity room */}
        {/* {!isInfinityRoom && ( */}
          <div className="mb-2.5">
            <StackedAvatars
              fans={liveFans}
              count={liveFanCount}
              loaded={presenceLoaded}
              totalJoinCount={totalJoinCount}
            />
          </div>
        {/* )} */}

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={(e) => {
            e.stopPropagation();
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
  type PresenceByRoom = {
    [roomId: string]: { fanCount: number; fans: ActiveFan[]; totalJoinCount?: number };
  };
  const [presenceByRoom, setPresenceByRoom] = useState<PresenceByRoom>({});

  // Temporary: only ONLY_VISIBLE_ROOM_ID is shown, everything else is hidden.
  const allRooms = rooms.filter(
  (r) => VISIBLE_ROOM_IDS.includes(r.roomId)
);

  useEffect(() => {
    const roomIds = allRooms.map((r) => r.roomId);
    if (roomIds.length === 0) return;

    let cancelled = false;
    const fetchPreview = async () => {
      try {
        const res = await axios.post("/api/roar/rooms/presence-preview", { roomIds });
        if (!cancelled && res.data?.success) setPresenceByRoom(res.data.rooms);
      } catch (e) {
        console.error("Presence preview failed:", e);
      }
    };

    fetchPreview();
    const iv = setInterval(() => {
      if (!document.hidden) fetchPreview();
    }, 30_000);
    return () => { cancelled = true; clearInterval(iv); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms.length]);

  return (
    <div
      style={{
        position: "absolute", top: 0, left: 0, right: 0,
        bottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}
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

      <div
        ref={scrollRef}
        onTouchStart={(e) => e.stopPropagation()}
        style={{
          flex: 1, minHeight: 0,
          overflowY: "scroll", overflowX: "hidden",
          WebkitOverflowScrolling: "touch" as any,
          touchAction: "pan-y",
          overscrollBehavior: "contain",
          paddingLeft: 16, paddingRight: 16, paddingBottom: 32,
        }}
      >
        {allRooms.map((room, i) => (
          <RoomCard
            key={room.roomId}
            room={room}
            index={i}
            onJoin={onJoinRoom}
            onToast={onToast}
            presence={presenceByRoom[room.roomId]}
          />
        ))}
        <div style={{ height: 86 }} />
      </div>
    </div>
  );
}