// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Playlist {
//     id: string;
//     name: string;
//     audioIds: string[];   // holds both audio and video IDs
//     createdAt: number;
//     updatedAt: number;
// }

// // Unified drop item — works for audio and video
// interface DropItem {
//     id: string;
//     title: string;
//     url: string;
//     duration: string;
//     type: "audio" | "video";
//     subtitle: string;
// }

// // ─── Icons ────────────────────────────────────────────────────────────────────

// function PlaylistIcon({ size = 20 }: { size?: number }) {
//     return (
//         <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
//             <path d="M3 5h10M3 9h8M3 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//             <circle cx="16" cy="13" r="3" stroke="currentColor" strokeWidth="1.4" />
//             <path d="M16 11.5V9.5l2.5-.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//     );
// }

// function AudioIcon() {
//     return (
//         <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
//             <path d="M3 9v-2C3 4.686 5.239 2.5 8 2.5S13 4.686 13 7v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
//             <rect x="2" y="8.5" width="3" height="5" rx="1.5" fill="currentColor" />
//             <rect x="11" y="8.5" width="3" height="5" rx="1.5" fill="currentColor" />
//         </svg>
//     );
// }

// function VideoIcon() {
//     return (
//         <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
//             <rect x="1" y="3" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
//             <path d="M11 6l4-2v8l-4-2V6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
//         </svg>
//     );
// }

// function EditIcon() {
//     return (
//         <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//             <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
//         </svg>
//     );
// }

// function TrashIcon() {
//     return (
//         <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//             <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.8 7.5h6.4L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//     );
// }

// function PlayIcon() {
//     return (
//         <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//             <path d="M3 2L10 6L3 10V2Z" fill="currentColor" />
//         </svg>
//     );
// }

// function ChevronRight() {
//     return (
//         <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//             <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//     );
// }

// function ChevronLeft() {
//     return (
//         <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//             <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//     );
// }

// // ─── Confirm Delete Modal ─────────────────────────────────────────────────────

// function ConfirmModal({ title, message, onConfirm, onCancel, loading }: {
//     title: string; message: string; onConfirm: () => void; onCancel: () => void; loading: boolean;
// }) {
//     return (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={onCancel}>
//             <div className="bg-[#1a1a1e] border border-white/10 rounded-2xl p-6 w-[280px] shadow-2xl" onClick={e => e.stopPropagation()}>
//                 <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center mb-4 mx-auto text-red-400">
//                     <TrashIcon />
//                 </div>
//                 <h3 className="text-white text-[15px] font-semibold text-center mb-1">{title}</h3>
//                 <p className="text-[#888] text-[12px] text-center mb-5">{message}</p>
//                 <div className="flex gap-2">
//                     <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-[#2a2a2e] text-[#ccc] text-[13px] font-medium hover:bg-[#3a3a3e] transition">Cancel</button>
//                     <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-[13px] font-medium hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-1.5">
//                         {loading ? <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" /> : <TrashIcon />}
//                         Delete
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ─── Rename Modal ─────────────────────────────────────────────────────────────

// function RenameModal({ playlist, onConfirm, onCancel, loading }: {
//     playlist: Playlist; onConfirm: (name: string) => void; onCancel: () => void; loading: boolean;
// }) {
//     const [name, setName] = useState(playlist.name);
//     return (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={onCancel}>
//             <div className="relative w-[300px] rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
//                 <div className="absolute inset-0 bg-gradient-to-br from-[#3a0a0a] via-[#1a0505] to-[#0d0d10]" />
//                 <div className="relative p-6">
//                     <div className="flex items-center justify-between mb-5">
//                         <span className="text-[11px] px-3 py-1 rounded-full bg-[#C9115F]/20 text-[#C9115F] border border-[#C9115F]/40 font-medium tracking-wide">Rename Playlist</span>
//                         <button onClick={onCancel} className="text-[#555] hover:text-white transition">
//                             <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
//                         </button>
//                     </div>
//                     <h2 className="text-white text-[18px] font-semibold mb-4">Enter new name</h2>
//                     <input
//                         type="text" value={name} onChange={e => setName(e.target.value)}
//                         onKeyDown={e => e.key === "Enter" && name.trim() && onConfirm(name.trim())}
//                         placeholder="Playlist name" autoFocus
//                         className="w-full bg-[#ffffff10] text-white text-[14px] rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#C9115F]/60 placeholder-[#555] mb-5"
//                     />
//                     <div className="flex gap-3">
//                         <button onClick={() => name.trim() && onConfirm(name.trim())} disabled={!name.trim() || loading} className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#C9115F] to-[#e0185a] text-white text-[13px] font-semibold hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center gap-1.5">
//                             {loading && <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />}
//                             Save
//                         </button>
//                         <button onClick={onCancel} className="flex-1 py-3 rounded-full bg-[#2a2a2e] text-[#ccc] text-[13px] font-semibold hover:bg-[#3a3a3e] transition">Cancel</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // ─── Drop Card ────────────────────────────────────────────────────────────────

// function DropCard({ item, onRemove }: { item: DropItem; onRemove: () => void }) {
//     const router = useRouter();

//     const route = item.type === "video"
//         ? `/MainModules/MatchesDropContent/VideoDropScreen?id=${item.id}`
//         : `/MainModules/MatchesDropContent/AudioDropScreen?id=${item.id}`;

//     return (
//         <div className="group flex items-center gap-3 bg-[#1a1a1e] hover:bg-[#202026] border border-white/5 hover:border-[#C9115F]/20 rounded-xl px-3 py-3 transition-all duration-200">
//             {/* Type badge + play */}
//             <button
//                 onClick={() => router.push(route)}
//                 className="w-8 h-8 rounded-full bg-[#C9115F]/20 hover:bg-[#C9115F] flex items-center justify-center flex-shrink-0 text-[#C9115F] hover:text-white transition-all duration-200"
//             >
//                 <PlayIcon />
//             </button>

//             {/* Info */}
//             <div className="flex-1 min-w-0 cursor-pointer" onClick={() => router.push(route)}>
//                 <div className="flex items-center gap-1.5 mb-0.5">
//                     {/* Audio / Video label */}
//                     <span className={`flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-md ${item.type === "video" ? "bg-blue-500/15 text-blue-400" : "bg-[#C9115F]/15 text-[#C9115F]"}`}>
//                         {item.type === "video" ? <VideoIcon /> : <AudioIcon />}
//                         {item.type === "video" ? "Video" : "Audio"}
//                     </span>
//                 </div>
//                 <p className="text-white text-[13px] font-medium truncate leading-tight">{item.title}</p>
//                 <p className="text-[#666] text-[11px] truncate mt-0.5">{item.subtitle}</p>
//             </div>

//             {/* Duration */}
//             <span className="text-[#555] text-[11px] font-mono flex-shrink-0">{item.duration}</span>

//             {/* Remove */}
//             <button
//                 onClick={onRemove}
//                 className="w-7 h-7 rounded-lg bg-transparent hover:bg-red-500/15 flex items-center justify-center text-[#555] hover:text-red-400 transition opacity-0 group-hover:opacity-100"
//                 title="Remove from playlist"
//             >
//                 <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
//                     <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
//                 </svg>
//             </button>
//         </div>
//     );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────

// export default function PlaylistsPage() {
//     const { user } = useAuth();
//     const router = useRouter();

//     const [playlists, setPlaylists] = useState<Playlist[]>([]);
//     const [loading, setLoading] = useState(true);

//     // Detail view
//     const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
//     const [dropItems, setDropItems] = useState<DropItem[]>([]);
//     const [dropsLoading, setDropsLoading] = useState(false);

//     // All fetched files — keyed by ID for fast lookup
//     const [allItemsMap, setAllItemsMap] = useState<Map<string, DropItem>>(new Map());
//     const [mediaLoaded, setMediaLoaded] = useState(false);

//     // Modals
//     const [renameTarget, setRenameTarget] = useState<Playlist | null>(null);
//     const [deleteTarget, setDeleteTarget] = useState<Playlist | null>(null);
//     const [renameLoading, setRenameLoading] = useState(false);
//     const [deleteLoading, setDeleteLoading] = useState(false);
//     const [removingId, setRemovingId] = useState<string | null>(null);

//     const getUserId = () => user?.userId || null;

//     // ── Fetch playlists ───────────────────────────────────────────────────────
//     useEffect(() => {
//         const userId = getUserId();
//         if (!userId) { setLoading(false); return; }
//         fetchPlaylists(userId);
//     }, [user]);

//     const fetchPlaylists = async (userId: string) => {
//         setLoading(true);
//         try {
//             const res = await axios.get(`/api/playlists?userId=${userId}`);
//             setPlaylists(res.data.playlists || []);
//         } catch (err) {
//             console.error("Error fetching playlists:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ── Fetch ALL audio + video files once, build a unified ID → DropItem map ─
//     useEffect(() => {
//         const fetchAllMedia = async () => {
//             try {
//                 const [audioRes, videoRes] = await Promise.all([
//                     axios.get("/api/cloudinary/audio?limit=200"),
//                     axios.get("/api/cloudinary/video?limit=200"),
//                 ]);

//                 const map = new Map<string, DropItem>();

//                 if (audioRes.data.success) {
//                     for (const a of audioRes.data.audioFiles) {
//                         const subtitle = a.matchInfo?.type
//                             ? `${a.matchInfo.type.replace(/_/g, " ")} — ${a.matchInfo.team1 ?? ""} vs ${a.matchInfo.team2 ?? ""}`
//                             : "Audio Drop";
//                         map.set(a.id, { id: a.id, title: a.title, url: a.url, duration: a.duration, type: "audio", subtitle });
//                     }
//                 }

//                 if (videoRes.data.success) {
//                     for (const v of videoRes.data.videoFiles) {
//                         const subtitle = v.playerInfo?.playerName
//                             ? `${v.playerInfo.playerName} · Chapter ${v.playerInfo.chapterNumber}`
//                             : "Video Drop";
//                         map.set(v.id, { id: v.id, title: v.title, url: v.url, duration: v.duration, type: "video", subtitle });
//                     }
//                 }

//                 setAllItemsMap(map);
//                 setMediaLoaded(true);
//             } catch (err) {
//                 console.error("Error fetching media:", err);
//                 setMediaLoaded(true);
//             }
//         };

//         fetchAllMedia();
//     }, []);

//     // ── Resolve drops when opening a playlist ─────────────────────────────────
//     const resolveDrops = (pl: Playlist, map: Map<string, DropItem>) => {
//         return pl.audioIds
//             .map(id => map.get(id))
//             .filter(Boolean) as DropItem[];
//     };

//     const openPlaylist = (pl: Playlist) => {
//         setSelectedPlaylist(pl);
//         setDropsLoading(!mediaLoaded);
//         setDropItems(resolveDrops(pl, allItemsMap));
//     };

//     // Re-resolve if media finishes loading while playlist is already open
//     useEffect(() => {
//         if (mediaLoaded && selectedPlaylist) {
//             setDropItems(resolveDrops(selectedPlaylist, allItemsMap));
//             setDropsLoading(false);
//         }
//     }, [mediaLoaded, allItemsMap]);

//     // ── Rename ────────────────────────────────────────────────────────────────
//     const handleRename = async (newName: string) => {
//         if (!renameTarget) return;
//         setRenameLoading(true);
//         try {
//             const res = await axios.put("/api/playlists", { playlistId: renameTarget.id, userId: getUserId(), action: "rename", name: newName });
//             if (res.data.success) {
//                 const updated = res.data.playlist;
//                 setPlaylists(prev => prev.map(p => p.id === updated.id ? updated : p));
//                 if (selectedPlaylist?.id === updated.id) setSelectedPlaylist(updated);
//                 setRenameTarget(null);
//             }
//         } catch (err) { console.error("Rename error:", err); }
//         finally { setRenameLoading(false); }
//     };

//     // ── Delete ────────────────────────────────────────────────────────────────
//     const handleDelete = async () => {
//         if (!deleteTarget) return;
//         setDeleteLoading(true);
//         try {
//             await axios.delete(`/api/playlists?playlistId=${deleteTarget.id}&userId=${getUserId()}`);
//             setPlaylists(prev => prev.filter(p => p.id !== deleteTarget.id));
//             if (selectedPlaylist?.id === deleteTarget.id) setSelectedPlaylist(null);
//             setDeleteTarget(null);
//         } catch (err) { console.error("Delete error:", err); }
//         finally { setDeleteLoading(false); }
//     };

//     // ── Remove single item ────────────────────────────────────────────────────
//     const handleRemoveDrop = async (itemId: string) => {
//         if (!selectedPlaylist) return;
//         setRemovingId(itemId);
//         try {
//             const res = await axios.put("/api/playlists", { playlistId: selectedPlaylist.id, userId: getUserId(), action: "remove", audioId: itemId });
//             if (res.data.success) {
//                 const updated = res.data.playlist as Playlist;
//                 setPlaylists(prev => prev.map(p => p.id === updated.id ? updated : p));
//                 setSelectedPlaylist(updated);
//                 setDropItems(prev => prev.filter(d => d.id !== itemId));
//             }
//         } catch (err) { console.error("Remove drop error:", err); }
//         finally { setRemovingId(null); }
//     };

//     // ─────────────────────────────────────────────────────────────────────────

//     return (
//         <div className="min-h-screen bg-[#0d0d10]">
//             <div className="max-w-3xl mx-auto px-4 py-6 pb-20">

//                 <Link href="/MainModules/HomePage" className="inline-flex items-center gap-2 text-[#666] hover:text-white mb-6 transition text-sm">
//                     <ArrowLeft size={16} />
//                     Back
//                 </Link>

//                 {/* ── Detail View ── */}
//                 {selectedPlaylist ? (
//                     <>
//                         <div className="flex items-start justify-between mb-6">
//                             <div className="flex items-center gap-3">
//                                 <button onClick={() => setSelectedPlaylist(null)} className="w-8 h-8 rounded-full bg-[#1e1e22] flex items-center justify-center text-[#888] hover:text-white hover:bg-[#2a2a2e] transition flex-shrink-0">
//                                     <ChevronLeft />
//                                 </button>
//                                 <div>
//                                     <h1 className="text-white text-[20px] font-semibold leading-tight">{selectedPlaylist.name}</h1>
//                                     <p className="text-[#666] text-[12px] mt-0.5">{selectedPlaylist.audioIds.length} drops</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 <button onClick={() => setRenameTarget(selectedPlaylist)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e1e22] text-[#aaa] hover:text-white hover:bg-[#2a2a2e] text-[12px] font-medium transition">
//                                     <EditIcon />Rename
//                                 </button>
//                                 <button onClick={() => setDeleteTarget(selectedPlaylist)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e1e22] text-red-400 hover:bg-red-500/15 text-[12px] font-medium transition">
//                                     <TrashIcon />Delete
//                                 </button>
//                             </div>
//                         </div>

//                         {dropsLoading ? (
//                             <div className="flex flex-col gap-3">
//                                 {[1, 2, 3].map(i => <div key={i} className="h-[56px] bg-[#1a1a1e] rounded-xl animate-pulse" />)}
//                             </div>
//                         ) : dropItems.length === 0 ? (
//                             <div className="flex flex-col items-center justify-center py-16 text-center">
//                                 <div className="w-14 h-14 rounded-full bg-[#1a1a1e] flex items-center justify-center mb-4 text-[#444]">
//                                     <PlaylistIcon size={22} />
//                                 </div>
//                                 <p className="text-[#555] text-[13px]">No drops in this playlist yet.</p>
//                                 <p className="text-[#444] text-[11px] mt-1">Open an Audio or Video Drop and tap the playlist icon to add it.</p>
//                             </div>
//                         ) : (
//                             <div className="flex flex-col gap-2">
//                                 {dropItems.map(item => (
//                                     <div key={item.id} className={removingId === item.id ? "opacity-40 pointer-events-none" : ""}>
//                                         <DropCard item={item} onRemove={() => handleRemoveDrop(item.id)} />
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </>
//                 ) : (
//                     <>
//                         {/* ── Playlists List ── */}
//                         <div className="flex items-center justify-between mb-6">
//                             <div>
//                                 <h1 className="text-white text-[22px] font-semibold">My Playlists</h1>
//                                 <p className="text-[#666] text-[12px] mt-0.5">{playlists.length} playlist{playlists.length !== 1 ? "s" : ""}</p>
//                             </div>
//                             <div className="w-9 h-9 rounded-full bg-[#1e1e22] flex items-center justify-center text-[#C9115F]">
//                                 <PlaylistIcon size={18} />
//                             </div>
//                         </div>

//                         {loading ? (
//                             <div className="flex flex-col gap-3">
//                                 {[1, 2, 3, 4].map(i => <div key={i} className="h-[72px] bg-[#1a1a1e] rounded-2xl animate-pulse" />)}
//                             </div>
//                         ) : playlists.length === 0 ? (
//                             <div className="flex flex-col items-center justify-center py-20 text-center">
//                                 <div className="w-16 h-16 rounded-full bg-[#1a1a1e] flex items-center justify-center mb-4 text-[#444]">
//                                     <PlaylistIcon size={24} />
//                                 </div>
//                                 <p className="text-[#666] text-[14px] font-medium">No playlists yet</p>
//                                 <p className="text-[#444] text-[12px] mt-1 max-w-[220px]">Open any Audio or Video Drop and tap the playlist icon to create one.</p>
//                             </div>
//                         ) : (
//                             <div className="flex flex-col gap-3">
//                                 {playlists.map((pl, idx) => (
//                                     <div
//                                         key={pl.id}
//                                         className="group relative flex items-center gap-4 bg-[#111114] hover:bg-[#16161a] border border-[#1e1e22] hover:border-[#C9115F]/25 rounded-2xl px-4 py-4 transition-all duration-200 cursor-pointer"
//                                         style={{ animationDelay: `${idx * 40}ms` }}
//                                         onClick={() => openPlaylist(pl)}
//                                     >
//                                         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9115F]/30 to-[#3a0a0a] flex items-center justify-center flex-shrink-0 text-[#C9115F]">
//                                             <PlaylistIcon size={20} />
//                                         </div>
//                                         <div className="flex-1 min-w-0">
//                                             <p className="text-white text-[14px] font-medium truncate">{pl.name}</p>
//                                             <p className="text-[#555] text-[11px] mt-0.5">{pl.audioIds.length} drop{pl.audioIds.length !== 1 ? "s" : ""}</p>
//                                         </div>
//                                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
//                                             <button onClick={e => { e.stopPropagation(); setRenameTarget(pl); }} className="w-7 h-7 rounded-lg bg-[#2a2a2e] flex items-center justify-center text-[#888] hover:text-white hover:bg-[#3a3a3e] transition" title="Rename">
//                                                 <EditIcon />
//                                             </button>
//                                             <button onClick={e => { e.stopPropagation(); setDeleteTarget(pl); }} className="w-7 h-7 rounded-lg bg-[#2a2a2e] flex items-center justify-center text-red-400 hover:bg-red-500/15 transition" title="Delete">
//                                                 <TrashIcon />
//                                             </button>
//                                         </div>
//                                         <ChevronRight />
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>

//             {renameTarget && <RenameModal playlist={renameTarget} onConfirm={handleRename} onCancel={() => setRenameTarget(null)} loading={renameLoading} />}
//             {deleteTarget && <ConfirmModal title="Delete Playlist" message={`"${deleteTarget.name}" will be permanently deleted.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleteLoading} />}
//         </div>
//     );
// }
















"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Playlist {
    id: string;
    name: string;
    audioIds: string[];   // holds all item IDs (audio, video, article)
    createdAt: number;
    updatedAt: number;
}

// Unified drop item — works for audio, video, and article
interface DropItem {
    id: string;
    title: string;
    url: string;
    duration: string;
    type: "audio" | "video" | "article";
    subtitle: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function PlaylistIcon({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            <path d="M3 5h10M3 9h8M3 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="16" cy="13" r="3" stroke="currentColor" strokeWidth="1.4" />
            <path d="M16 11.5V9.5l2.5-.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function AudioIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 9v-2C3 4.686 5.239 2.5 8 2.5S13 4.686 13 7v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <rect x="2" y="8.5" width="3" height="5" rx="1.5" fill="currentColor" />
            <rect x="11" y="8.5" width="3" height="5" rx="1.5" fill="currentColor" />
        </svg>
    );
}

function VideoIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="3" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M11 6l4-2v8l-4-2V6z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
    );
}

function ArticleIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1.5" y="1.5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3.5 4h5M3.5 6h4M3.5 8h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
    );
}

function EditIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.8 7.5h6.4L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function PlayIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 2L10 6L3 10V2Z" fill="currentColor" />
        </svg>
    );
}

function ChevronRight() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function ChevronLeft() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────

function ConfirmModal({ title, message, onConfirm, onCancel, loading }: {
    title: string; message: string; onConfirm: () => void; onCancel: () => void; loading: boolean;
}) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={onCancel}>
            <div className="bg-[#1a1a1e] border border-white/10 rounded-2xl p-6 w-[280px] shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center mb-4 mx-auto text-red-400">
                    <TrashIcon />
                </div>
                <h3 className="text-white text-[15px] font-semibold text-center mb-1">{title}</h3>
                <p className="text-[#888] text-[12px] text-center mb-5">{message}</p>
                <div className="flex gap-2">
                    <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-[#2a2a2e] text-[#ccc] text-[13px] font-medium hover:bg-[#3a3a3e] transition">Cancel</button>
                    <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-[13px] font-medium hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-1.5">
                        {loading ? <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" /> : <TrashIcon />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Rename Modal ─────────────────────────────────────────────────────────────

function RenameModal({ playlist, onConfirm, onCancel, loading }: {
    playlist: Playlist; onConfirm: (name: string) => void; onCancel: () => void; loading: boolean;
}) {
    const [name, setName] = useState(playlist.name);
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={onCancel}>
            <div className="relative w-[300px] rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#3a0a0a] via-[#1a0505] to-[#0d0d10]" />
                <div className="relative p-6">
                    <div className="flex items-center justify-between mb-5">
                        <span className="text-[11px] px-3 py-1 rounded-full bg-[#C9115F]/20 text-[#C9115F] border border-[#C9115F]/40 font-medium tracking-wide">Rename Playlist</span>
                        <button onClick={onCancel} className="text-[#555] hover:text-white transition">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </button>
                    </div>
                    <h2 className="text-white text-[18px] font-semibold mb-4">Enter new name</h2>
                    <input
                        type="text" value={name} onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && name.trim() && onConfirm(name.trim())}
                        placeholder="Playlist name" autoFocus
                        className="w-full bg-[#ffffff10] text-white text-[14px] rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#C9115F]/60 placeholder-[#555] mb-5"
                    />
                    <div className="flex gap-3">
                        <button onClick={() => name.trim() && onConfirm(name.trim())} disabled={!name.trim() || loading} className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#C9115F] to-[#e0185a] text-white text-[13px] font-semibold hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center gap-1.5">
                            {loading && <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />}
                            Save
                        </button>
                        <button onClick={onCancel} className="flex-1 py-3 rounded-full bg-[#2a2a2e] text-[#ccc] text-[13px] font-semibold hover:bg-[#3a3a3e] transition">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Drop Card ────────────────────────────────────────────────────────────────

function DropCard({ item, onRemove }: { item: DropItem; onRemove: () => void }) {
    const router = useRouter();

    const getRoute = () => {
        if (item.type === "video") {
            return `/MainModules/MatchesDropContent/VideoDropScreen?id=${item.id}`;
        } else if (item.type === "audio") {
            return `/MainModules/MatchesDropContent/AudioDropScreen?id=${item.id}`;
        } else {
            return `/MainModules/CricketArticles/${item.id}`;
        }
    };

    const route = getRoute();

    return (
        <div className="group flex items-center gap-3 bg-[#1a1a1e] hover:bg-[#202026] border border-white/5 hover:border-[#C9115F]/20 rounded-xl px-3 py-3 transition-all duration-200">
            {/* Type badge + play/read button */}
            <button
                onClick={() => router.push(route)}
                className="w-8 h-8 rounded-full bg-[#C9115F]/20 hover:bg-[#C9115F] flex items-center justify-center flex-shrink-0 text-[#C9115F] hover:text-white transition-all duration-200"
            >
                {item.type === "article" ? <ArticleIcon /> : <PlayIcon />}
            </button>

            {/* Info */}
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => router.push(route)}>
                <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-md ${
                        item.type === "video" ? "bg-blue-500/15 text-blue-400" : 
                        item.type === "audio" ? "bg-[#C9115F]/15 text-[#C9115F]" : 
                        "bg-green-500/15 text-green-400"
                    }`}>
                        {item.type === "video" ? <VideoIcon /> : 
                         item.type === "audio" ? <AudioIcon /> : 
                         <ArticleIcon />}
                        {item.type === "video" ? "Video" : item.type === "audio" ? "Audio" : "Article"}
                    </span>
                </div>
                <p className="text-white text-[13px] font-medium truncate leading-tight">{item.title}</p>
                <p className="text-[#666] text-[11px] truncate mt-0.5">{item.subtitle}</p>
            </div>

            {/* Duration/Read time */}
            <span className="text-[#555] text-[11px] font-mono flex-shrink-0">{item.duration}</span>

            {/* Remove button */}
            <button
                onClick={onRemove}
                className="w-7 h-7 rounded-lg bg-transparent hover:bg-red-500/15 flex items-center justify-center text-[#555] hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                title="Remove from playlist"
            >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
            </button>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PlaylistsPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [loading, setLoading] = useState(true);

    // Detail view
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
    const [dropItems, setDropItems] = useState<DropItem[]>([]);
    const [dropsLoading, setDropsLoading] = useState(false);

    // All fetched files — keyed by ID for fast lookup
    const [allItemsMap, setAllItemsMap] = useState<Map<string, DropItem>>(new Map());
    const [mediaLoaded, setMediaLoaded] = useState(false);

    // Modals
    const [renameTarget, setRenameTarget] = useState<Playlist | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Playlist | null>(null);
    const [renameLoading, setRenameLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const getUserId = () => user?.userId || null;

    // ── Fetch playlists ───────────────────────────────────────────────────────
    useEffect(() => {
        const userId = getUserId();
        if (!userId) { setLoading(false); return; }
        fetchPlaylists(userId);
    }, [user]);

    const fetchPlaylists = async (userId: string) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/playlists?userId=${userId}`);
            setPlaylists(res.data.playlists || []);
        } catch (err) {
            console.error("Error fetching playlists:", err);
        } finally {
            setLoading(false);
        }
    };

    // ── Fetch ALL audio + video + article files once, build a unified ID → DropItem map ─
    useEffect(() => {
        const fetchAllMedia = async () => {
            try {
                const [audioRes, videoRes, articleRes] = await Promise.all([
                    axios.get("/api/cloudinary/audio?limit=200"),
                    axios.get("/api/cloudinary/video?limit=200"),
                    axios.get("/api/cricket-articles?limit=200"),
                ]);

                const map = new Map<string, DropItem>();

                // Process audio files
                if (audioRes.data.success) {
                    for (const a of audioRes.data.audioFiles) {
                        const subtitle = a.matchInfo?.type
                            ? `${a.matchInfo.type.replace(/_/g, " ")} — ${a.matchInfo.team1 ?? ""} vs ${a.matchInfo.team2 ?? ""}`
                            : "Audio Drop";
                        map.set(a.id, { 
                            id: a.id, 
                            title: a.title, 
                            url: a.url, 
                            duration: a.duration, 
                            type: "audio", 
                            subtitle 
                        });
                    }
                }

                // Process video files
                if (videoRes.data.success) {
                    for (const v of videoRes.data.videoFiles) {
                        const subtitle = v.playerInfo?.playerName
                            ? `${v.playerInfo.playerName} · Chapter ${v.playerInfo.chapterNumber}`
                            : "Video Drop";
                        map.set(v.id, { 
                            id: v.id, 
                            title: v.title, 
                            url: v.url, 
                            duration: v.duration, 
                            type: "video", 
                            subtitle 
                        });
                    }
                }

                // Process articles
                if (articleRes.data.success && articleRes.data.articles) {
                    for (const a of articleRes.data.articles) {
                        map.set(a.id, { 
                            id: a.id, 
                            title: a.title, 
                            url: `/MainModules/CricketArticles/${a.id}`, 
                            duration: a.readTime || "5 min", 
                            type: "article", 
                            subtitle: `${a.badge || "Article"} • ${a.views || "0"} views` 
                        });
                    }
                }

                setAllItemsMap(map);
                setMediaLoaded(true);
            } catch (err) {
                console.error("Error fetching media:", err);
                setMediaLoaded(true);
            }
        };

        fetchAllMedia();
    }, []);

    // ── Resolve drops when opening a playlist ─────────────────────────────────
    const resolveDrops = (pl: Playlist, map: Map<string, DropItem>) => {
        return pl.audioIds
            .map(id => map.get(id))
            .filter(Boolean) as DropItem[];
    };

    const openPlaylist = (pl: Playlist) => {
        setSelectedPlaylist(pl);
        setDropsLoading(!mediaLoaded);
        setDropItems(resolveDrops(pl, allItemsMap));
    };

    // Re-resolve if media finishes loading while playlist is already open
    useEffect(() => {
        if (mediaLoaded && selectedPlaylist) {
            setDropItems(resolveDrops(selectedPlaylist, allItemsMap));
            setDropsLoading(false);
        }
    }, [mediaLoaded, allItemsMap, selectedPlaylist]);

    // ── Rename ────────────────────────────────────────────────────────────────
    const handleRename = async (newName: string) => {
        if (!renameTarget) return;
        setRenameLoading(true);
        try {
            const res = await axios.put("/api/playlists", { playlistId: renameTarget.id, userId: getUserId(), action: "rename", name: newName });
            if (res.data.success) {
                const updated = res.data.playlist;
                setPlaylists(prev => prev.map(p => p.id === updated.id ? updated : p));
                if (selectedPlaylist?.id === updated.id) setSelectedPlaylist(updated);
                setRenameTarget(null);
            }
        } catch (err) { console.error("Rename error:", err); }
        finally { setRenameLoading(false); }
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await axios.delete(`/api/playlists?playlistId=${deleteTarget.id}&userId=${getUserId()}`);
            setPlaylists(prev => prev.filter(p => p.id !== deleteTarget.id));
            if (selectedPlaylist?.id === deleteTarget.id) setSelectedPlaylist(null);
            setDeleteTarget(null);
        } catch (err) { console.error("Delete error:", err); }
        finally { setDeleteLoading(false); }
    };

    // ── Remove single item ────────────────────────────────────────────────────
    const handleRemoveDrop = async (itemId: string) => {
        if (!selectedPlaylist) return;
        setRemovingId(itemId);
        try {
            const res = await axios.put("/api/playlists", { playlistId: selectedPlaylist.id, userId: getUserId(), action: "remove", audioId: itemId });
            if (res.data.success) {
                const updated = res.data.playlist as Playlist;
                setPlaylists(prev => prev.map(p => p.id === updated.id ? updated : p));
                setSelectedPlaylist(updated);
                setDropItems(prev => prev.filter(d => d.id !== itemId));
            }
        } catch (err) { console.error("Remove drop error:", err); }
        finally { setRemovingId(null); }
    };

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-[#0d0d10]">
            <div className="max-w-3xl mx-auto px-4 py-6 pb-20">

                <Link href="/MainModules/HomePage" className="inline-flex items-center gap-2 text-[#666] hover:text-white mb-6 transition text-sm">
                    <ArrowLeft size={16} />
                    Back
                </Link>

                {/* ── Detail View ── */}
                {selectedPlaylist ? (
                    <>
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setSelectedPlaylist(null)} className="w-8 h-8 rounded-full bg-[#1e1e22] flex items-center justify-center text-[#888] hover:text-white hover:bg-[#2a2a2e] transition flex-shrink-0">
                                    <ChevronLeft />
                                </button>
                                <div>
                                    <h1 className="text-white text-[20px] font-semibold leading-tight">{selectedPlaylist.name}</h1>
                                    <p className="text-[#666] text-[12px] mt-0.5">{selectedPlaylist.audioIds.length} drops</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setRenameTarget(selectedPlaylist)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e1e22] text-[#aaa] hover:text-white hover:bg-[#2a2a2e] text-[12px] font-medium transition">
                                    <EditIcon />Rename
                                </button>
                                <button onClick={() => setDeleteTarget(selectedPlaylist)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1e1e22] text-red-400 hover:bg-red-500/15 text-[12px] font-medium transition">
                                    <TrashIcon />Delete
                                </button>
                            </div>
                        </div>

                        {dropsLoading ? (
                            <div className="flex flex-col gap-3">
                                {[1, 2, 3].map(i => <div key={i} className="h-[56px] bg-[#1a1a1e] rounded-xl animate-pulse" />)}
                            </div>
                        ) : dropItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-14 h-14 rounded-full bg-[#1a1a1e] flex items-center justify-center mb-4 text-[#444]">
                                    <PlaylistIcon size={22} />
                                </div>
                                <p className="text-[#555] text-[13px]">No drops in this playlist yet.</p>
                                <p className="text-[#444] text-[11px] mt-1">Open any Audio, Video, or Article and tap the playlist icon to add it.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {dropItems.map(item => (
                                    <div key={item.id} className={removingId === item.id ? "opacity-40 pointer-events-none" : ""}>
                                        <DropCard item={item} onRemove={() => handleRemoveDrop(item.id)} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* ── Playlists List ── */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-white text-[22px] font-semibold">My Playlists</h1>
                                <p className="text-[#666] text-[12px] mt-0.5">{playlists.length} playlist{playlists.length !== 1 ? "s" : ""}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-[#1e1e22] flex items-center justify-center text-[#C9115F]">
                                <PlaylistIcon size={18} />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col gap-3">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-[72px] bg-[#1a1a1e] rounded-2xl animate-pulse" />)}
                            </div>
                        ) : playlists.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 rounded-full bg-[#1a1a1e] flex items-center justify-center mb-4 text-[#444]">
                                    <PlaylistIcon size={24} />
                                </div>
                                <p className="text-[#666] text-[14px] font-medium">No playlists yet</p>
                                <p className="text-[#444] text-[12px] mt-1 max-w-[220px]">Open any Audio, Video, or Article and tap the playlist icon to create one.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {playlists.map((pl, idx) => (
                                    <div
                                        key={pl.id}
                                        className="group relative flex items-center gap-4 bg-[#111114] hover:bg-[#16161a] border border-[#1e1e22] hover:border-[#C9115F]/25 rounded-2xl px-4 py-4 transition-all duration-200 cursor-pointer"
                                        style={{ animationDelay: `${idx * 40}ms` }}
                                        onClick={() => openPlaylist(pl)}
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C9115F]/30 to-[#3a0a0a] flex items-center justify-center flex-shrink-0 text-[#C9115F]">
                                            <PlaylistIcon size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-[14px] font-medium truncate">{pl.name}</p>
                                            <p className="text-[#555] text-[11px] mt-0.5">{pl.audioIds.length} drop{pl.audioIds.length !== 1 ? "s" : ""}</p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                            <button onClick={e => { e.stopPropagation(); setRenameTarget(pl); }} className="w-7 h-7 rounded-lg bg-[#2a2a2e] flex items-center justify-center text-[#888] hover:text-white hover:bg-[#3a3a3e] transition" title="Rename">
                                                <EditIcon />
                                            </button>
                                            <button onClick={e => { e.stopPropagation(); setDeleteTarget(pl); }} className="w-7 h-7 rounded-lg bg-[#2a2a2e] flex items-center justify-center text-red-400 hover:bg-red-500/15 transition" title="Delete">
                                                <TrashIcon />
                                            </button>
                                        </div>
                                        <ChevronRight />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {renameTarget && <RenameModal playlist={renameTarget} onConfirm={handleRename} onCancel={() => setRenameTarget(null)} loading={renameLoading} />}
            {deleteTarget && <ConfirmModal title="Delete Playlist" message={`"${deleteTarget.name}" will be permanently deleted.`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleteLoading} />}
        </div>
    );
}