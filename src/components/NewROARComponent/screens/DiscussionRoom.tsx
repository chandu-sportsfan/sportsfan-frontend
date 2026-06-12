

// //chandu's code

// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import axios from "axios";
// import AvatarWithBadge from "../components/AvatarWithBadge";
// import { fmt } from "../utils";
// import { Image, ChevronLeft, Flame, TrendingUp, Zap, History, PenTool } from "lucide-react";

// interface Props {
//   onBack: () => void;
//   onToast: (m: string) => void;
//   roomId?: string;
//   roomName?: string;
//   onPostClick?: (post: any) => void;
//   onCompose?: (type: string | null) => void;
//   fanCount?: number;
//   score?: string;
//   scoreSubtitle?: string;
//   currentAvatarUrl?: string;
// }

// const MODE_COLOR: Record<string, string> = {
//   chat: "var(--text-primary)",
//   prediction: "var(--gold)",
//   hottake: "#f87171",
//   debate: "#e91e8c",
//   memory: "#00e8c6",
// };

// const MODES = [
//   { key: "chat" as const,       label: "Post",     icon: <PenTool size={13} />,    color: "#ffffff" },
//   { key: "debate" as const,     label: "Debate",   icon: <Zap size={13} />,        color: "#e91e8c" },
//   { key: "prediction" as const, label: "Predict",  icon: <TrendingUp size={13} />, color: "#fbbf24" },
//   { key: "hottake" as const,    label: "Hot Take", icon: <Flame size={13} />,      color: "#f87171" },
//   { key: "memory" as const,     label: "Memory",   icon: <History size={13} />,    color: "#00e8c6" },
// ];

// const PLACEHOLDER: Record<string, string> = {
//   chat: "Drop your take...",
//   debate: "My debate side: ",
//   prediction: "My prediction: ",
//   hottake: "Drop a hot take...",
//   memory: "Flashback: ",
// };

// const typeBadgeClass = (type: string) => {
//   const base = "text-[9px] font-extrabold px-1.5 py-0.5 rounded";
//   if (type === "prediction") return `${base} bg-[rgba(255,215,0,0.15)] text-[#fbbf24] border border-[rgba(255,215,0,0.25)]`;
//   if (type === "hottake")   return `${base} bg-[rgba(239,68,68,0.15)] text-[#f87171] border border-[rgba(239,68,68,0.25)]`;
//   if (type === "debate")    return `${base} bg-[rgba(233,30,140,0.15)] text-[#e91e8c] border border-[rgba(233,30,140,0.25)]`;
//   if (type === "memory")    return `${base} bg-[rgba(0,232,198,0.15)] text-[#00e8c6] border border-[rgba(0,232,198,0.25)]`;
//   return `${base} bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] border border-[rgba(255,255,255,0.1)]`;
// };

// const postCardStyle = (type: string): React.CSSProperties => {
//   if (type === "prediction") return { background: "linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,215,0,0.02))",   border: "1px solid rgba(255,215,0,0.18)" };
//   if (type === "hottake")   return { background: "linear-gradient(135deg,rgba(239,68,68,0.08),rgba(239,68,68,0.02))",   border: "1px solid rgba(239,68,68,0.18)" };
//   if (type === "debate")    return { background: "linear-gradient(135deg,rgba(233,30,140,0.08),rgba(233,30,140,0.02))", border: "1px solid rgba(233,30,140,0.18)" };
//   if (type === "memory")    return { background: "linear-gradient(135deg,rgba(0,232,198,0.08),rgba(0,232,198,0.02))",   border: "1px solid rgba(0,232,198,0.18)" };
//   return {};
// };

// export default function DiscussionRoom({
//   onBack, onToast, roomId, roomName, onPostClick,
//   fanCount = 312, score, scoreSubtitle, currentAvatarUrl,
// }: Props) {
//   const [posts, setPosts]               = useState<any[]>([]);
//   const [loading, setLoading]           = useState(true);
//   const [input, setInput]               = useState("");
//   const [mode, setMode]                 = useState<typeof MODES[number]["key"]>("chat");
//   const [uploading, setUploading]       = useState(false);
//   const [attachedUrl, setAttachedUrl]   = useState<string | null>(null);
//   const [attachedType, setAttachedType] = useState<"image" | "video" | null>(null);
//   const [userUsername, setUserUsername] = useState("RoarUser");
//   const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(currentAvatarUrl);

//   const listRef      = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   /* ── user prefs ── */
//   useEffect(() => {
//     try {
//       setUserUsername(localStorage.getItem("roar_username") || "RoarUser");
//       setUserAvatarUrl(currentAvatarUrl || localStorage.getItem("roar_avatar_url") || undefined);
//     } catch {}
//   }, [currentAvatarUrl]);

//   /* ── poll messages ── */
//   useEffect(() => {
//     if (!roomId) return;
//     const fetchMsgs = async () => {
//       try {
//         const res = await axios.get(`/api/roar/rooms/${roomId}/messages`);
//         if (res.data?.success) {
//           setPosts(res.data.messages.map((m: any) => ({
//             id: m.msgId,
//             fan: {
//               username: m.authorUsername,
//               badge: m.authorBadge,
//               avatarUrl: m.authorAvatarUrl || m.avatarUrl || (m.authorUsername === userUsername ? userAvatarUrl : undefined),
//             },
//             text: m.text,
//             fireCount: m.fireCount || 0,
//             nochanceCount: m.noChanceCount || 0,
//             heartCount: m.heartCount || 0,
//             timeAgo: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//             createdAt: m.createdAt,
//             type: m.type,
//             mediaUrls: m.mediaUrls,
//           })));
//         }
//       } catch (e) { console.error(e); }
//       finally { setLoading(false); }
//     };
//     fetchMsgs();
//     const iv = setInterval(fetchMsgs, 3000);
//     return () => clearInterval(iv);
//   }, [roomId, userAvatarUrl, userUsername]);

//   /* ── scroll to bottom on load ── */
//   useEffect(() => {
//     if (!loading && listRef.current)
//       setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight }), 50);
//   }, [loading]);

//   /* ── upload ── */
//   const triggerUpload = (type: "image" | "video") => {
//     setAttachedType(type);
//     if (fileInputRef.current) {
//       fileInputRef.current.accept = type === "image" ? "image/*" : "video/*";
//       fileInputRef.current.click();
//     }
//   };
//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     try {
//       setUploading(true); onToast("Uploading media...");
//       const fd = new FormData(); fd.append("file", file);
//       const res = await axios.post("/api/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
//       if (res.data?.url) { setAttachedUrl(res.data.url); onToast("Media uploaded!"); }
//     } catch { onToast("Upload failed"); setAttachedType(null); }
//     finally { setUploading(false); if (e.target) e.target.value = ""; }
//   };

//   /* ── send ── */
//   const send = async () => {
//     if (!roomId) return;
//     const text = input.trim();
//     if (!text && !attachedUrl) return;
//     try {
//       const res = await axios.post(`/api/roar/rooms/${roomId}/messages`, {
//         text: text || "Shared media", type: mode,
//         mediaUrls: attachedUrl ? [attachedUrl] : undefined,
//       });
//       if (res.data?.success) {
//         const m = res.data.message;
//         setPosts(p => [{
//           id: m.msgId,
//           fan: { username: m.authorUsername, badge: m.authorBadge, avatarUrl: m.authorAvatarUrl || m.avatarUrl || (m.authorUsername === userUsername ? userAvatarUrl : undefined) },
//           text: m.text, fireCount: 0, nochanceCount: 0, heartCount: 0,
//           timeAgo: "now", createdAt: m.createdAt || Date.now(), type: m.type, mediaUrls: m.mediaUrls,
//         }, ...p]);
//         setInput(""); setAttachedUrl(null); setAttachedType(null);
//         setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
//       }
//     } catch { onToast("Failed to send message"); }
//   };

//   /* ── react ── */
//   const react = async (id: string, reaction: "fire" | "noChance" | "heart") => {
//     if (!roomId) return;
//     try {
//       await axios.post(`/api/roar/rooms/${roomId}/messages/${id}/react`, { reaction });
//       setPosts(p => p.map(x => x.id !== id ? x :
//         reaction === "fire"  ? { ...x, fireCount: x.fireCount + 1 } :
//         reaction === "heart" ? { ...x, heartCount: (x.heartCount || 0) + 1 } :
//                                { ...x, nochanceCount: x.nochanceCount + 1 }
//       ));
//     } catch (e) { console.error(e); }
//   };

//   /* ────────────────── RENDER ────────────────── */
//   /*
//    * height: 100% fills the motion.div wrapper in index.tsx which itself has
//    * flex:1 + minHeight:0. The overflow:hidden on the page wrapper
//    * (borderRadius + overflow:hidden in ROARPage) clips everything cleanly.
//    * Inside we use a flex column: header (shrink-0) → feed (flex-1, overflow
//    * scroll) → composer (shrink-0). No fixed/absolute needed.
//    */
//   return (
//     <div
//       className="flex flex-col w-full bg-[#0e0e14]"
//       style={{ height: "100%", overflow: "hidden" }}
//     >
//       {/* ── HEADER ── */}
//       <div className="shrink-0 px-4 py-3 bg-[rgba(14,14,20,0.98)] backdrop-blur-[20px] border-b border-[var(--border)]">
//         <div className="flex justify-between items-start">
//           <div className="flex gap-3">
//             <button type="button" onClick={onBack} className="bg-transparent border-none cursor-pointer text-white flex items-center p-0">
//               <ChevronLeft size={24} />
//             </button>
//             <div className="text-left pt-0.5">
//               <p className="font-display text-2xl tracking-[0.04em] m-0 leading-tight text-white font-extrabold uppercase">
//                 {roomName || "WORLDCUP"}
//               </p>
//               <div className="flex items-center gap-1.5 mt-1">
//                 <span className="live-pulse w-1.5 h-1.5 rounded-full bg-[var(--live-green)] inline-block" />
//                 <span className="text-[10px] font-bold text-[var(--live-green)]">LIVE</span>
//                 <span className="text-[11px] text-[var(--text-muted)]">· {fmt(fanCount)} fans</span>
//               </div>
//             </div>
//           </div>

//           {(score || scoreSubtitle) && (
//             <div className="text-right pr-2 -mt-1">
//               {score && <div className="font-display text-[28px] text-[var(--accent-yellow)] leading-none">{score}</div>}
//               {scoreSubtitle && <div className="text-[13px] text-[var(--text-secondary)] mt-1">{scoreSubtitle}</div>}
//             </div>
//           )}
//         </div>

//         <div className="mt-3">
//           <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1">
//             <span>Room Energy</span>
//             <span>{fmt(fanCount)} in room</span>
//           </div>
//           <div className="room-energy-bar room-energy-fast rounded-full" />
//         </div>
//       </div>

//       {/* ── FEED — only this scrolls ── */}
//       <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 flex flex-col gap-3 min-h-0">
//         <AnimatePresence initial={false}>
//           {loading ? (
//             <div className="text-center text-[var(--text-muted)] py-8">Loading messages...</div>
//           ) : posts.length === 0 ? (
//             <div className="text-center text-[var(--text-muted)] py-8">No posts yet. Be the first!</div>
//           ) : (
//             [...posts].reverse().map((p) => (
//               <motion.div
//                 key={p.id}
//                 initial={{ opacity: 0, y: 16 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.22 }}
//                 className="glass-card p-3 cursor-pointer"
//                 style={postCardStyle(p.type)}
//                 onClick={() => onPostClick?.({
//                   id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo,
//                   createdAt: p.createdAt, type: p.type || "chat",
//                   isDbPost: true, roomId, mediaUrls: p.mediaUrls,
//                 })}
//               >
//                 <div className="flex justify-between items-center">
//                   <div className="flex gap-2 items-center">
//                     <AvatarWithBadge username={p.fan.username} badge={p.fan.badge} size="sm" avatarUrl={p.fan.avatarUrl} />
//                     <div>
//                       <p className="font-bold text-[13px]">{p.fan.username}</p>
//                       <p className="text-[10px] text-[var(--text-muted)]">{p.timeAgo}</p>
//                     </div>
//                   </div>
//                   {p.type && p.type !== "chat" && (
//                     <span className={typeBadgeClass(p.type)}>{p.type.toUpperCase()}</span>
//                   )}
//                 </div>

//                 <p className="text-sm leading-snug mt-2" style={{ color: MODE_COLOR[p.type] || "white" }}>
//                   {p.text}
//                 </p>

//                 {p.mediaUrls?.length > 0 && (
//                   <div className="flex flex-col gap-2 mt-2">
//                     {p.mediaUrls.map((url: string, i: number) =>
//                       url.endsWith(".mp4") || url.includes("/video/upload/") ? (
//                         <video key={i} src={url} controls className="w-full max-h-[200px] rounded-lg object-cover" onClick={e => e.stopPropagation()} />
//                       ) : (
//                         <img key={i} src={url} alt="" className="w-full max-h-[200px] rounded-lg object-cover" />
//                       )
//                     )}
//                   </div>
//                 )}

//                 <div className="flex gap-2 mt-2.5 justify-end">
//                   {([
//                     { label: `🔥 ${p.fireCount}`,            r: "fire"     as const },
//                     { label: `❤️ ${p.heartCount || 0}`,      r: "heart"    as const },
//                     { label: `No chance ${p.nochanceCount}`,  r: "noChance" as const },
//                   ] as const).map(({ label, r }) => (
//                     <motion.button
//                       key={r} whileTap={{ scale: 0.9 }}
//                       onClick={e => { e.stopPropagation(); react(p.id, r); }}
//                       className="px-3.5 py-1.5 text-xs font-semibold bg-[rgba(255,255,255,0.05)] rounded-full border border-[rgba(255,255,255,0.08)] text-[var(--text-primary)] cursor-pointer"
//                     >
//                       {label}
//                     </motion.button>
//                   ))}
//                 </div>
//               </motion.div>
//             ))
//           )}
//         </AnimatePresence>
//       </div>

//       {/* ── COMPOSER — always at bottom ── */}
//       <div className="shrink-0 px-3 pt-2 pb-4 bg-[rgba(14,14,20,0.98)] backdrop-blur-[20px] border-t border-[var(--border)] flex flex-col gap-2">
//         {/* mode pills */}
//         <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
//           {MODES.map(m => (
//             <button
//               key={m.key}
//               onClick={() => setMode(m.key)}
//               className={[
//                 "flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all duration-150 cursor-pointer shrink-0",
//                 mode === m.key
//                   ? "border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.1)]"
//                   : "border-transparent bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.35)]",
//               ].join(" ")}
//               style={{ color: mode === m.key ? m.color : undefined }}
//             >
//               {m.icon}{m.label}
//             </button>
//           ))}
//         </div>

//         {/* attached media preview */}
//         {attachedUrl && (
//           <div className="px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] flex justify-between items-center">
//             <div className="flex items-center gap-2">
//               {attachedType === "image"
//                 ? <img src={attachedUrl} className="w-10 h-10 rounded-lg object-cover" alt="Attached" />
//                 : <video src={attachedUrl} className="w-10 h-10 rounded-lg object-cover" />}
//               <span className="text-xs text-[var(--text-secondary)]">Media attached</span>
//             </div>
//             <button onClick={() => { setAttachedUrl(null); setAttachedType(null); }} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">✕</button>
//           </div>
//         )}

//         {/* input row */}
//         <div className="flex gap-2 items-center">
//           <button
//             onClick={() => triggerUpload("image")} disabled={uploading}
//             className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer flex items-center p-1 shrink-0"
//           >
//             <Image size={20} />
//           </button>

//           <div className="flex-1 relative">
//             {input === "" && !uploading && (
//               <div className="absolute left-4 top-0 bottom-0 flex items-center pointer-events-none">
//                 <span className="text-sm font-medium" style={{ color: MODE_COLOR[mode] || "var(--text-secondary)" }}>
//                   {PLACEHOLDER[mode]}
//                 </span>
//               </div>
//             )}
//             <input
//               type="text"
//               disabled={uploading}
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={e => e.key === "Enter" && send()}
//               className="w-full h-11 rounded-[22px] bg-[var(--bg-secondary)] border border-[var(--border)] pl-4 pr-4 text-white text-base outline-none"
//             />
//           </div>

//           <motion.button
//             whileTap={{ scale: 0.96 }}
//             onClick={send}
//             disabled={uploading}
//             className={[
//               "w-11 h-11 rounded-full border-none text-white text-lg font-bold flex items-center justify-center cursor-pointer shrink-0",
//               "bg-[linear-gradient(135deg,#e91e8c,#ff6b35)]",
//               uploading ? "opacity-50" : "opacity-100",
//             ].join(" ")}
//           >
//             ↑
//           </motion.button>
//         </div>
//       </div>

//       <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
//     </div>
//   );
// }





import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AvatarWithBadge from "../components/AvatarWithBadge";
import { fmt } from "../utils";
import { Image, ChevronLeft, Flame, TrendingUp, Zap, History, PenTool } from "lucide-react";

interface Props {
  onBack: () => void;
  onToast: (m: string) => void;
  roomId?: string;
  roomName?: string;
  onPostClick?: (post: any) => void;
  onCompose?: (type: string | null) => void;
  fanCount?: number;
  score?: string;
  scoreSubtitle?: string;
  currentAvatarUrl?: string;
}

const MODE_COLOR: Record<string, string> = {
  chat: "var(--text-primary)",
  prediction: "var(--gold)",
  hottake: "#f87171",
  debate: "#e91e8c",
  memory: "#00e8c6",
};

const MODES = [
  { key: "chat" as const,       label: "Post",     icon: <PenTool size={13} />,    color: "#ffffff" },
  { key: "debate" as const,     label: "Debate",   icon: <Zap size={13} />,        color: "#e91e8c" },
  { key: "prediction" as const, label: "Predict",  icon: <TrendingUp size={13} />, color: "#fbbf24" },
  { key: "hottake" as const,    label: "Hot Take", icon: <Flame size={13} />,      color: "#f87171" },
  { key: "memory" as const,     label: "Memory",   icon: <History size={13} />,    color: "#00e8c6" },
];

const PLACEHOLDER: Record<string, string> = {
  chat: "Drop your take...",
  debate: "My debate side: ",
  prediction: "My prediction: ",
  hottake: "Drop a hot take...",
  memory: "Flashback: ",
};

const typeBadgeClass = (type: string) => {
  const base = "text-[9px] font-extrabold px-1.5 py-0.5 rounded";
  if (type === "prediction") return `${base} bg-[rgba(255,215,0,0.15)] text-[#fbbf24] border border-[rgba(255,215,0,0.25)]`;
  if (type === "hottake")   return `${base} bg-[rgba(239,68,68,0.15)] text-[#f87171] border border-[rgba(239,68,68,0.25)]`;
  if (type === "debate")    return `${base} bg-[rgba(233,30,140,0.15)] text-[#e91e8c] border border-[rgba(233,30,140,0.25)]`;
  if (type === "memory")    return `${base} bg-[rgba(0,232,198,0.15)] text-[#00e8c6] border border-[rgba(0,232,198,0.25)]`;
  return `${base} bg-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.5)] border border-[rgba(255,255,255,0.1)]`;
};

const postCardStyle = (type: string): React.CSSProperties => {
  if (type === "prediction") return { background: "linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,215,0,0.02))",   border: "1px solid rgba(255,215,0,0.18)" };
  if (type === "hottake")   return { background: "linear-gradient(135deg,rgba(239,68,68,0.08),rgba(239,68,68,0.02))",   border: "1px solid rgba(239,68,68,0.18)" };
  if (type === "debate")    return { background: "linear-gradient(135deg,rgba(233,30,140,0.08),rgba(233,30,140,0.02))", border: "1px solid rgba(233,30,140,0.18)" };
  if (type === "memory")    return { background: "linear-gradient(135deg,rgba(0,232,198,0.08),rgba(0,232,198,0.02))",   border: "1px solid rgba(0,232,198,0.18)" };
  return {};
};

export default function DiscussionRoom({
  onBack, onToast, roomId, roomName, onPostClick,
  fanCount = 312, score, scoreSubtitle, currentAvatarUrl,
}: Props) {
  const [posts, setPosts]               = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [input, setInput]               = useState("");
  const [mode, setMode]                 = useState<typeof MODES[number]["key"]>("chat");
  const [uploading, setUploading]       = useState(false);
  const [attachedUrl, setAttachedUrl]   = useState<string | null>(null);
  const [attachedType, setAttachedType] = useState<"image" | "video" | null>(null);
  const [userUsername, setUserUsername] = useState("RoarUser");
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(currentAvatarUrl);

  const listRef      = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── user prefs ── */
  useEffect(() => {
    try {
      setUserUsername(localStorage.getItem("roar_username") || "RoarUser");
      setUserAvatarUrl(currentAvatarUrl || localStorage.getItem("roar_avatar_url") || undefined);
    } catch {}
  }, [currentAvatarUrl]);

  /* ── poll messages ── */
  useEffect(() => {
    if (!roomId) return;
    const fetchMsgs = async () => {
      try {
        const res = await axios.get(`/api/roar/rooms/${roomId}/messages?t=${Date.now()}`);
        if (res.data?.success) {
          setPosts(res.data.messages.map((m: any) => ({
            id: m.msgId,
            fan: {
              username: m.authorUsername,
              badge: m.authorBadge,
              avatarUrl: m.authorAvatarUrl || m.avatarUrl || (m.authorUsername === userUsername ? userAvatarUrl : undefined),
            },
            text: m.text,
            fireCount: m.fireCount || 0,
            nochanceCount: m.noChanceCount || 0,
            heartCount: m.heartCount || 0,
            timeAgo: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: m.createdAt,
            type: m.type,
            mediaUrls: m.mediaUrls,
          })));
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchMsgs();
    const iv = setInterval(fetchMsgs, 3000);
    return () => clearInterval(iv);
  }, [roomId, userAvatarUrl, userUsername]);

  /* ── scroll to bottom on load ── */
  useEffect(() => {
    if (!loading && listRef.current)
      setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight }), 50);
  }, [loading]);

  /* ── upload ── */
  const triggerUpload = (type: "image" | "video") => {
    setAttachedType(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === "image" ? "image/*" : "video/*";
      fileInputRef.current.click();
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true); onToast("Uploading media...");
      const fd = new FormData(); fd.append("file", file);
      const res = await axios.post("/api/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data?.url) { setAttachedUrl(res.data.url); onToast("Media uploaded!"); }
    } catch { onToast("Upload failed"); setAttachedType(null); }
    finally { setUploading(false); if (e.target) e.target.value = ""; }
  };

  /* ── send ── */
  const send = async () => {
    if (!roomId) return;
    const text = input.trim();
    if (!text && !attachedUrl) return;
    try {
      const res = await axios.post(`/api/roar/rooms/${roomId}/messages`, {
        text: text || "Shared media", type: mode,
        mediaUrls: attachedUrl ? [attachedUrl] : undefined,
      });
      if (res.data?.success) {
        const m = res.data.message;
        setPosts(p => [{
          id: m.msgId,
          fan: { username: m.authorUsername, badge: m.authorBadge, avatarUrl: m.authorAvatarUrl || m.avatarUrl || (m.authorUsername === userUsername ? userAvatarUrl : undefined) },
          text: m.text, fireCount: 0, nochanceCount: 0, heartCount: 0,
          timeAgo: "now", createdAt: m.createdAt || Date.now(), type: m.type, mediaUrls: m.mediaUrls,
        }, ...p]);
        setInput(""); setAttachedUrl(null); setAttachedType(null);
        setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
      }
    } catch { onToast("Failed to send message"); }
  };

  /* ── react ── */
  const react = async (id: string, reaction: "fire" | "noChance" | "heart") => {
    if (!roomId) return;
    try {
      await axios.post(`/api/roar/rooms/${roomId}/messages/${id}/react`, { reaction });
      setPosts(p => p.map(x => x.id !== id ? x :
        reaction === "fire"  ? { ...x, fireCount: x.fireCount + 1 } :
        reaction === "heart" ? { ...x, heartCount: (x.heartCount || 0) + 1 } :
                               { ...x, nochanceCount: x.nochanceCount + 1 }
      ));
    } catch (e) { console.error(e); }
  };

  /* ── back: use onPointerDown so it fires immediately on mobile
        without the 300ms touch delay that can cause mis-navigation ── */
  const handleBack = (e: React.PointerEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onBack();
  };

  return (
    <div
      className="flex flex-col w-full bg-[#0e0e14]"
      style={{ height: "100%", overflow: "hidden" }}
    >
      {/* ── HEADER ── */}
      <div className="shrink-0 px-4 py-3 bg-[rgba(14,14,20,0.98)] backdrop-blur-[20px] border-b border-[var(--border)]">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            {/* onPointerDown fires immediately on touch; onClick kept for mouse */}
            <button
              type="button"
              onPointerDown={handleBack}
              onClick={handleBack}
              className="bg-transparent border-none cursor-pointer text-white flex items-center p-0"
              style={{ touchAction: "manipulation", WebkitTapHighlightColor: "transparent" }}
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-left pt-0.5">
              <p className="font-display text-2xl tracking-[0.04em] m-0 leading-tight text-white font-extrabold uppercase">
                {roomName || "WORLDCUP"}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="live-pulse w-1.5 h-1.5 rounded-full bg-[var(--live-green)] inline-block" />
                <span className="text-[10px] font-bold text-[var(--live-green)]">LIVE</span>
                <span className="text-[11px] text-[var(--text-muted)]">· {fmt(fanCount)} fans</span>
              </div>
            </div>
          </div>

          {(score || scoreSubtitle) && (
            <div className="text-right pr-2 -mt-1">
              {score && <div className="font-display text-[28px] text-[var(--accent-yellow)] leading-none">{score}</div>}
              {scoreSubtitle && <div className="text-[13px] text-[var(--text-secondary)] mt-1">{scoreSubtitle}</div>}
            </div>
          )}
        </div>

        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1">
            <span>Room Energy</span>
            <span>{fmt(fanCount)} in room</span>
          </div>
          <div className="room-energy-bar room-energy-fast rounded-full" />
        </div>
      </div>

      {/* ── FEED — only this scrolls ── */}
      <div ref={listRef} className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 flex flex-col gap-3 min-h-0">
        <AnimatePresence initial={false}>
          {loading ? (
            <div className="text-center text-[var(--text-muted)] py-8">Loading messages...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-[var(--text-muted)] py-8">No posts yet. Be the first!</div>
          ) : (
            [...posts].reverse().map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                className="glass-card p-3 cursor-pointer"
                style={postCardStyle(p.type)}
                onClick={() => onPostClick?.({
                  id: p.id, text: p.text, fan: p.fan, timeAgo: p.timeAgo,
                  createdAt: p.createdAt, type: p.type || "chat",
                  isDbPost: true, roomId, mediaUrls: p.mediaUrls,
                })}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <AvatarWithBadge username={p.fan.username} badge={p.fan.badge} size="sm" avatarUrl={p.fan.avatarUrl} />
                    <div>
                      <p className="font-bold text-[13px]">{p.fan.username}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{p.timeAgo}</p>
                    </div>
                  </div>
                  {p.type && p.type !== "chat" && (
                    <span className={typeBadgeClass(p.type)}>{p.type.toUpperCase()}</span>
                  )}
                </div>

                <p className="text-sm leading-snug mt-2" style={{ color: MODE_COLOR[p.type] || "white" }}>
                  {p.text}
                </p>

                {p.mediaUrls?.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {p.mediaUrls.map((url: string, i: number) =>
                      url.endsWith(".mp4") || url.includes("/video/upload/") ? (
                        <video key={i} src={url} controls className="w-full max-h-[200px] rounded-lg object-cover" onClick={e => e.stopPropagation()} />
                      ) : (
                        <img key={i} src={url} alt="" className="w-full max-h-[200px] rounded-lg object-cover" />
                      )
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-2.5 justify-end">
                  {([
                    { label: `🔥 ${p.fireCount}`,            r: "fire"     as const },
                    { label: `❤️ ${p.heartCount || 0}`,      r: "heart"    as const },
                    { label: `No chance ${p.nochanceCount}`,  r: "noChance" as const },
                  ] as const).map(({ label, r }) => (
                    <motion.button
                      key={r} whileTap={{ scale: 0.9 }}
                      onClick={e => { e.stopPropagation(); react(p.id, r); }}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-[rgba(255,255,255,0.05)] rounded-full border border-[rgba(255,255,255,0.08)] text-[var(--text-primary)] cursor-pointer"
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* ── COMPOSER — always at bottom ── */}
      <div className="shrink-0 px-3 pt-2 pb-4 bg-[rgba(14,14,20,0.98)] backdrop-blur-[20px] border-t border-[var(--border)] flex flex-col gap-2">
        {/* mode pills */}
        <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {MODES.map(m => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMode(m.key)}
              className={[
                "flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all duration-150 cursor-pointer shrink-0",
                mode === m.key
                  ? "border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.1)]"
                  : "border-transparent bg-[rgba(255,255,255,0.04)] text-[rgba(255,255,255,0.35)]",
              ].join(" ")}
              style={{ color: mode === m.key ? m.color : undefined }}
            >
              {m.icon}{m.label}
            </button>
          ))}
        </div>

        {/* attached media preview */}
        {attachedUrl && (
          <div className="px-3 py-2 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] flex justify-between items-center">
            <div className="flex items-center gap-2">
              {attachedType === "image"
                ? <img src={attachedUrl} className="w-10 h-10 rounded-lg object-cover" alt="Attached" />
                : <video src={attachedUrl} className="w-10 h-10 rounded-lg object-cover" />}
              <span className="text-xs text-[var(--text-secondary)]">Media attached</span>
            </div>
            <button type="button" onClick={() => { setAttachedUrl(null); setAttachedType(null); }} className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer">✕</button>
          </div>
        )}

        {/* input row */}
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => triggerUpload("image")} disabled={uploading}
            className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer flex items-center p-1 shrink-0"
          >
            <Image size={20} />
          </button>

          <div className="flex-1 relative">
            {input === "" && !uploading && (
              <div className="absolute left-4 top-0 bottom-0 flex items-center pointer-events-none">
                <span className="text-sm font-medium" style={{ color: MODE_COLOR[mode] || "var(--text-secondary)" }}>
                  {PLACEHOLDER[mode]}
                </span>
              </div>
            )}
            <input
              type="text"
              disabled={uploading}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              className="w-full h-11 rounded-[22px] bg-[var(--bg-secondary)] border border-[var(--border)] pl-4 pr-4 text-white text-base outline-none"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={send}
            disabled={uploading}
            className={[
              "w-11 h-11 rounded-full border-none text-white text-lg font-bold flex items-center justify-center cursor-pointer shrink-0",
              "bg-[linear-gradient(135deg,#e91e8c,#ff6b35)]",
              uploading ? "opacity-50" : "opacity-100",
            ].join(" ")}
          >
            ↑
          </motion.button>
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
    </div>

  );

}