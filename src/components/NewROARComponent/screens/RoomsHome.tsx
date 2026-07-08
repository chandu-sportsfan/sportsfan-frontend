

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
//   cricket:  "/images/cricket3.png",
//   football: "/images/fifa2.png",
//   default:  "/images/fifa2.png",
// };

// const INFINITY_ROOM_ID = "vZFu6xEApNRd1aUbDuHW";

// // Temporary: only this room is shown, everything else is hidden.
// // Revert by restoring the old mock-room exclusion filter in `allRooms` below.
// // const ONLY_VISIBLE_ROOM_ID = "2yQvtie7nIcWXDA2iUDj && biDY0WLIZB7wBCaE2Ppx";
// const VISIBLE_ROOM_IDS = ["2yQvtie7nIcWXDA2iUDj", "biDY0WLIZB7wBCaE2Ppx"];


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
//             <span className="text-xs font-bold text-white/90">+{count} </span>Active
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

// function Thumbnail({ room, isInfinityRoom }: { room: Room; isInfinityRoom?: boolean }) {
//   const sport    = (room.sport ?? "default").toLowerCase();
//   const gradient = SPORT_GRADIENT[sport] ?? SPORT_GRADIENT.default;
//   const imgSrc   = isInfinityRoom
//     ? "/images/infinityroom.png"
//     : SPORT_IMAGE[sport] ?? SPORT_IMAGE.default;

//   return (
//     <div
//       className="w-[90px] h-[90px] min-w-[90px] rounded-2xl flex items-center justify-center text-3xl overflow-hidden relative shrink-0"
//       style={{ background: gradient }}
//     >
//       <img
//         src={imgSrc}
//         alt={room.name}
//         className="absolute inset-0 w-full h-full object-fit rounded-2xl"
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

//   const isInfinityRoom = room.roomId === INFINITY_ROOM_ID;

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
//       <Thumbnail room={room} isInfinityRoom={isInfinityRoom} />

//       <div className="flex-1 min-w-0">
//         {sport !== "default" && !isInfinityRoom && <SportBadge sport={sport} />}
//         <div className="flex items-center gap-2 mb-1 min-w-0">
//           <p className="text-[15px] font-extrabold text-white whitespace-normal">
//             {room.name}
//           </p>
//         </div>

//         <p className="text-xs text-white/45 mb-2 leading-snug line-clamp-2">
//           {room.description ?? "Roar conversations"}
//         </p>

//         {/* Hide avatars + active count for infinity room */}
//         {/* {!isInfinityRoom && ( */}
//           <div className="mb-2.5">
//             <StackedAvatars
//               fans={liveFans}
//               count={liveFanCount}
//               loaded={presenceLoaded}
//               totalJoinCount={totalJoinCount}
//             />
//           </div>
//         {/* )} */}

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
//   type PresenceByRoom = {
//     [roomId: string]: { fanCount: number; fans: ActiveFan[]; totalJoinCount?: number };
//   };
//   const [presenceByRoom, setPresenceByRoom] = useState<PresenceByRoom>({});

//   // Temporary: only ONLY_VISIBLE_ROOM_ID is shown, everything else is hidden.
//   const allRooms = rooms.filter(
//   (r) => VISIBLE_ROOM_IDS.includes(r.roomId)
// );

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
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Share2 } from "lucide-react";
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

interface RoomCounts {
  post: number;
  debate: number;
  prediction: number;
  trivia: number;
  battle: number;
}

const EMPTY_COUNTS: RoomCounts = { post: 0, debate: 0, prediction: 0, trivia: 0, battle: 0 };

const SHARE_ACTIONS = [
  { alt: "WhatsApp", src: "/images/share_whatsapp.png" },
  { alt: "Threads", src: "/images/share_thread.png" },
  { alt: "Instagram", src: "/images/share_insta.png" },
  { alt: "LinkedIn", src: "/images/Share_linkedin.png" },
  { alt: "X", src: "/images/Share_X.png" },
  { alt: "Copy", src: "/images/share_copy_link.png" },
];

function buildRoomShareUrl(room: Room) {
  if (typeof window === "undefined") {
    return `https://sportsfan-frontend.vercel.app/MainModules/ROAR?room=${room.roomId}`;
  }
  const url = new URL(`${window.location.origin}/MainModules/ROAR`);
  url.searchParams.set("room", room.roomId);
  return url.toString();
}

function buildRoomShareText(room: Room, counts: RoomCounts, shareUrl: string) {
  return [
    `🔥 ${room.name} is heating up on Sportsfan360!`,
    "",
    `✏️ Posts: ${counts.post}`,
    `⚡ Debates: ${counts.debate}`,
    `🔮 Predictions: ${counts.prediction}`,
    `🧠 Trivia: ${counts.trivia}`,
    `⚔️ Battles: ${counts.battle}`,
    "",
    `Join the room 👉 ${shareUrl}`,
    "#StartRoaring #Sportsfan360",
  ].join("\n");
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
  onShare,
}: {
  room: Room;
  index: number;
  onJoin: (r: Room) => void;
  onToast: (m: string) => void;
  presence?: { fanCount: number; fans: ActiveFan[]; totalJoinCount?: number };
  onShare: (room: Room) => void;
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

        <div className="mb-2.5">
          <StackedAvatars
            fans={liveFans}
            count={liveFanCount}
            loaded={presenceLoaded}
            totalJoinCount={totalJoinCount}
          />
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={(e) => {
              e.stopPropagation();
              if (isFuture) { onToast("This room hasn't started yet."); return; }
              onJoin(room);
            }}
            className={[
              "flex-1 py-1 rounded-full text-[13px] font-bold transition-colors duration-150",
              isFuture
                ? "border border-white/20 text-white/30 cursor-not-allowed bg-transparent"
                : "border border-white/20 text-white cursor-pointer bg-transparent hover:border-white/40",
            ].join(" ")}
          >
            {isFuture ? "Coming Soon" : "Join Room"}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onShare(room);
            }}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/70 shrink-0 bg-transparent hover:border-white/40 hover:text-white transition-colors duration-150"
            title="Share room stats"
          >
            <Share2 size={14} />
          </motion.button>
        </div>
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

  // ── Share modal state ──
  const [shareRoom, setShareRoom] = useState<Room | null>(null);
  const [shareCounts, setShareCounts] = useState<RoomCounts | null>(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareRequestTokenRef = useRef<symbol | null>(null);

  // Temporary: only VISIBLE_ROOM_IDS are shown, everything else is hidden.
  const allRooms = rooms.filter((r) => VISIBLE_ROOM_IDS.includes(r.roomId));

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

  // Lock body scroll when share modal is open
  useEffect(() => {
    document.body.style.overflow = shareRoom ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [shareRoom]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const el = document.createElement("textarea");
        el.value = text;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.focus();
        el.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(el);
        return ok;
      } catch {
        return false;
      }
    }
  };

  const handleShare = async (room: Room) => {
    const requestId = Symbol();
    shareRequestTokenRef.current = requestId;
    setShareRoom(room);
    setShareCounts(null);
    setCopied(false);
    setShareLoading(true);
    try {
      const res = await axios.get(`/api/roar/rooms/${room.roomId}/messages`, {
        params: { limit: 1 },
      });
      if (shareRequestTokenRef.current !== requestId) return;
      setShareCounts(res.data?.counts ?? EMPTY_COUNTS);
    } catch (e) {
      console.error("Failed to fetch room stats for share:", e);
      if (shareRequestTokenRef.current !== requestId) return;
      setShareCounts(EMPTY_COUNTS);
      onToast("Couldn't load latest stats — sharing basic info.");
    } finally {
      if (shareRequestTokenRef.current === requestId) setShareLoading(false);
    }
  };

  const closeShare = () => {
    shareRequestTokenRef.current = null;
    setShareRoom(null);
    setShareCounts(null);
    setShareLoading(false);
    setCopied(false);
  };

  const shareUrl = shareRoom ? buildRoomShareUrl(shareRoom) : "";
  const shareText = shareRoom && shareCounts ? buildRoomShareText(shareRoom, shareCounts, shareUrl) : "";

  const handleShareToWhatsApp = () => {
    if (!shareText) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };
  const handleShareToThreads = () => {
    if (!shareText) return;
    window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`, "_blank");
  };
  const handleShareToInstagram = async () => {
    if (!shareText) return;
    await copyToClipboard(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
    window.open("https://www.instagram.com/", "_blank");
  };
  const handleShareToLinkedIn = () => {
    if (!shareUrl) return;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
  };
  const handleShareToX = () => {
    if (!shareText) return;
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
  };
  const handleCopyLink = async () => {
    if (!shareText) return;
    const ok = await copyToClipboard(shareText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      onToast("Copied to clipboard!");
    }
  };

  const handlerMap: Record<string, () => void> = {
    WhatsApp: handleShareToWhatsApp,
    Threads: handleShareToThreads,
    Instagram: handleShareToInstagram,
    LinkedIn: handleShareToLinkedIn,
    X: handleShareToX,
    Copy: handleCopyLink,
  };

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
            onShare={handleShare}
          />
        ))}
        <div style={{ height: 86 }} />
      </div>

      {/* ── Share Modal ── */}
      <AnimatePresence>
        {shareRoom && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeShare}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 200,
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(4px)",
              }}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed z-[210] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[320px] bg-[#1a1a1e] rounded-2xl border border-white/10 p-3.5 shadow-2xl max-h-[85vh] overflow-y-auto box-border"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-white text-sm font-bold m-0 min-w-0 truncate">
                  Share {shareRoom.name}
                </p>
                <button
                  type="button"
                  onClick={closeShare}
                  className="w-6 h-6 rounded-full bg-white/[0.06] border-none text-white/60 text-xs cursor-pointer flex items-center justify-center shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Stats preview */}
              {shareLoading ? (
                <p className="text-[11px] text-white/40 text-center py-4">
                  Loading stats…
                </p>
              ) : shareCounts && (
                <div className="grid grid-cols-3 gap-1.5 mb-3.5">
                  {[
                    { label: "Posts", value: shareCounts.post, color: "#e91e8c" },
                    { label: "Debates", value: shareCounts.debate, color: "#60a5fa" },
                    { label: "Predictions", value: shareCounts.prediction, color: "#fbbf24" },
                    { label: "Trivia", value: shareCounts.trivia, color: "#22c55e" },
                    { label: "Battles", value: shareCounts.battle, color: "#f97316" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-[#0a0a14] border border-white/[0.06] rounded-[10px] py-2 px-1 text-center min-w-0"
                    >
                      <div
                        className="font-extrabold leading-none"
                        style={{ fontSize: "clamp(14px, 4.5vw, 18px)", color: s.color }}
                      >
                        {s.value}
                      </div>
                      <div className="text-[7px] text-white/45 uppercase font-bold tracking-wide mt-1 truncate">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Share Icons */}
              <div
                className="grid grid-cols-3 gap-2 mb-1"
                style={{
                  opacity: shareLoading ? 0.4 : 1,
                  pointerEvents: shareLoading ? "none" : "auto",
                }}
              >
                {SHARE_ACTIONS.map(({ alt, src }) => (
                  <button
                    key={alt}
                    type="button"
                    onClick={handlerMap[alt]}
                    className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer p-0 min-w-0"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <img
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <span className="text-[7px] text-white/35 font-medium whitespace-nowrap">
                      {alt}
                    </span>
                  </button>
                ))}
              </div>

              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-emerald-400 text-center font-semibold mt-2 mb-0"
                >
                  ✓ Copied!
                </motion.p>
              )}

              <button
                type="button"
                onClick={closeShare}
                className="mt-3 py-1.5 w-full bg-white/[0.04] border border-white/[0.06] rounded-lg text-white/40 text-[11px] font-medium cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}