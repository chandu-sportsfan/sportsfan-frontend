// "use client";

// import { useState, useRef, useEffect, useCallback } from "react";
// import Image from "next/image";
// import {
//   ChevronLeft, Plus, UserPlus, Users, Camera, X, MoreVertical, Mic,
//   CheckCheck, Flag, LogOut, Reply, Edit2, Trash2,
//   Search, BadgeCheck, TrendingUp, Globe, Lock, Radio, Crown, Loader2,
//   AlertCircle,
// } from "lucide-react";
// import { useRouter } from "next/navigation";

// import { useChats, useMessages, useGroups, useCommunities, useCreateChat, timeAgo } from "../../../hooks/useChat";
// import { useAuth } from "@/context/AuthContext";
// import { ChatAPI, GroupAPI, type Chat, type Message, type Group, type Community } from "../../../lib/chatApi";

// // ─── Types ────────────────────────────────────────────────────────────────────

// type TabType = "My Chats" | "Discover Groups" | "Communities";
// type ViewType = "list" | "create_group" | "chat_room" | "group_detail";

// const EMOJIS = ["🤣", "🥳", "🤩", "😡", "😔"];

// type PickerUser = {
//   userId?: string;
//   user_id?: string;
//   id?: string;
//   email?: string;
//   firstName?: string;
//   lastName?: string;
//   name?: string;
//   avatar?: string;
// };

// // ─── Sub-components ───────────────────────────────────────────────────────────

// const ChatAvatar = ({
//   src, name, size = "w-12 h-12", className = "", fallbackBg = "bg-[#2a1a1f]",
// }: { src?: string | null; name: string; size?: string; className?: string; fallbackBg?: string }) => {
//   const [err, setErr] = useState(false);
//   return (
//     <div className={`${size} rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold ${!src || err ? fallbackBg : "bg-[#151515]"} border border-white/5 ${className}`}>
//       {src && !err
//         ? <Image src={src} alt={name} width={56} height={56} className="w-full h-full object-cover" onError={() => setErr(true)} />
//         : <span className="text-xl opacity-80">{name.charAt(0)}</span>}
//     </div>
//   );
// };

// const Spinner = ({ className = "" }: { className?: string }) => (
//   <Loader2 size={20} className={`animate-spin text-[#e91e63] ${className}`} />
// );

// const ErrorBanner = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
//   <div className="flex items-center gap-3 bg-red-900/20 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
//     <AlertCircle size={16} className="flex-shrink-0" />
//     <span className="flex-1">{message}</span>
//     {onRetry && <button onClick={onRetry} className="text-red-300 underline text-xs">Retry</button>}
//   </div>
// );

// const SkeletonRow = () => (
//   <div className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 animate-pulse">
//     <div className="w-14 h-14 rounded-full bg-white/5" />
//     <div className="flex-1 flex flex-col gap-2">
//       <div className="h-4 bg-white/5 rounded w-1/3" />
//       <div className="h-3 bg-white/5 rounded w-2/3" />
//     </div>
//   </div>
// );

// const PrivacyBadge = ({ privacy }: { privacy: string }) => {
//   const map: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
//     public:       { icon: <Globe size={12} />,  label: "Public",       color: "text-blue-400" },
//     closed:       { icon: <Lock size={12} />,   label: "Closed",       color: "text-yellow-500" },
//     private:      { icon: <Lock size={12} />,   label: "Private",      color: "text-orange-500" },
//     announcement: { icon: <Radio size={12} />,  label: "Announcement", color: "text-pink-500" },
//     exclusive:    { icon: <Crown size={12} />,  label: "Exclusive",    color: "text-purple-400" },
//   };
//   const cfg = map[privacy?.toLowerCase()] ?? map.public;
//   return (
//     <span className={`flex items-center gap-1 ${cfg.color} font-medium`}>
//       {cfg.icon} {cfg.label}
//     </span>
//   );
// };

// // ─── WhatsApp-style read receipt ticks ────────────────────────────────────────
// // single grey  = sent
// // double grey  = delivered
// // double blue  = read
// const MessageTicks = ({ isRead, isOptimistic }: { isRead: boolean; isOptimistic: boolean }) => {
//   if (isOptimistic) return <Loader2 size={10} className="animate-spin text-gray-500" />;
//   if (isRead) return <CheckCheck size={14} className="text-blue-400" />;
//   return <CheckCheck size={14} className="text-gray-500" />;
// };

// // ─── User Picker Sheet (portal-free, absolute overlay) ────────────────────────
// const UserPickerSheet = ({
//   open, onClose, onPickUser,
// }: { open: boolean; onClose: () => void; onPickUser: (userId: string) => void }) => {
//   const [search, setSearch] = useState("");
//   const [users, setUsers] = useState<PickerUser[] | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!open) { setSearch(""); return; }
//     const ac = new AbortController();
//     setLoading(true);
//     setError(null);
//     fetch("/api/users", { signal: ac.signal })
//       .then(r => r.json())
//       .then(json => setUsers(Array.isArray(json.users) ? json.users : []))
//       .catch(e => { if (e.name !== "AbortError") setError("Failed to load users"); })
//       .finally(() => setLoading(false));
//     return () => ac.abort();
//   }, [open]);

//   if (!open) return null;

//   const filtered = (users ?? []).filter(u => {
//     const name = `${u.firstName ?? u.name ?? ""} ${u.lastName ?? ""}`.toLowerCase();
//     const email = (u.email ?? "").toLowerCase();
//     return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
//   });

//   return (
//     <div className="absolute inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4">
//       <div className="bg-[#1a1a1a] w-full max-w-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
//         {/* Header */}
//         <div className="flex items-center gap-3 p-4 border-b border-white/5">
//           <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition">
//             <X size={20} />
//           </button>
//           <h3 className="text-lg font-bold">New Chat</h3>
//         </div>

//         {/* Search */}
//         <div className="p-3">
//           <div className="flex items-center gap-3 bg-[#111] rounded-xl px-3 py-2.5 border border-white/5">
//             <Search size={16} className="text-gray-400 flex-shrink-0" />
//             <input
//               autoFocus
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               placeholder="Search by name or email…"
//               className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
//             />
//             {search && <button onClick={() => setSearch("")}><X size={14} className="text-gray-500" /></button>}
//           </div>
//         </div>

//         {/* List */}
//         <div className="max-h-72 overflow-y-auto [&::-webkit-scrollbar]:hidden">
//           {loading && (
//             <div className="flex items-center justify-center py-10 gap-3 text-gray-400 text-sm">
//               <Spinner /> Loading users…
//             </div>
//           )}
//           {error && (
//             <div className="p-4 text-center text-sm text-red-400">{error}</div>
//           )}
//           {!loading && !error && filtered.length === 0 && (
//             <div className="p-6 text-center text-sm text-gray-500">No users found</div>
//           )}
//           {filtered.map(u => {
//             const id = u.userId ?? u.user_id ?? u.id ?? u.email ?? "";
//             const displayName = `${u.firstName ?? u.name ?? ""}${u.lastName ? ` ${u.lastName}` : ""}`.trim() || id;
//             return (
//               <div
//                 key={id}
//                 onClick={() => onPickUser(id)}
//                 className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 transition-colors"
//               >
//                 <ChatAvatar src={u.avatar} name={displayName} size="w-10 h-10" />
//                 <div className="flex-1 min-w-0">
//                   <div className="font-semibold text-sm truncate">{displayName}</div>
//                   {u.email && <div className="text-xs text-gray-400 truncate">{u.email}</div>}
//                 </div>
//                 <div className="w-8 h-8 rounded-full bg-[#e91e63]/10 border border-[#e91e63]/30 flex items-center justify-center flex-shrink-0">
//                   <UserPlus size={14} className="text-[#e91e63]" />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Main component ───────────────────────────────────────────────────────────

// export default function ChatComponent() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const currentUserId = user?.userId ?? user?.email ?? "";

//   // ── View state ──────────────────────────────────────────────────────────────
//   const [view, setView]               = useState<ViewType>("list");
//   const [activeTab, setActiveTab]     = useState<TabType>("My Chats");
//   const [activeChat, setActiveChat]   = useState<Chat | null>(null);
//   const [activeGroup, setActiveGroup] = useState<Group | null>(null);
//   const [search, setSearch]           = useState("");

//   // ── Data hooks ──────────────────────────────────────────────────────────────
//   const chatHook       = useChats();
//   const groupHook      = useGroups();
//   const communityHook  = useCommunities();
//   const messageHook    = useMessages(activeChat?.id ?? null);
//   const createChatHook = useCreateChat();

//   // ── Create group state ──────────────────────────────────────────────────────
//   const [groupName, setGroupName]               = useState("");
//   const [groupDesc, setGroupDesc]               = useState("");
//   const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
//   const [showMembersSheet, setShowMembersSheet]   = useState(false);

//   // ── User picker — BELONGS ON THE LIST VIEW ──────────────────────────────────
//   const [showUserPicker, setShowUserPicker] = useState(false);

//   // ── Chat room state ──────────────────────────────────────────────────────────
//   const [messageInput, setMessageInput]         = useState("");
//   const [replyingTo, setReplyingTo]             = useState<Message | null>(null);
//   const [editingMsg, setEditingMsg]             = useState<Message | null>(null);
//   const [deletingMsgId, setDeletingMsgId]       = useState<string | null>(null);
//   const [activeMenuMsgId, setActiveMenuMsgId]   = useState<string | null>(null);
//   const [toastMsg, setToastMsg]                 = useState<string | null>(null);

//   // ── UI state ────────────────────────────────────────────────────────────────
//   const [showAddMenu, setShowAddMenu]   = useState(false);
//   const [showGroupMenu, setShowGroupMenu] = useState(false);
//   const [joinLoading, setJoinLoading]   = useState<string | null>(null);
//   const [dmCreating, setDmCreating]     = useState(false);

//   const menuRef       = useRef<HTMLDivElement | null>(null);
//   const groupMenuRef  = useRef<HTMLDivElement | null>(null);
//   const chatScrollRef = useRef<HTMLDivElement>(null);
//   const inputRef      = useRef<HTMLInputElement>(null);

//   // ── Close menus on outside click ────────────────────────────────────────────
//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowAddMenu(false);
//       if (groupMenuRef.current && !groupMenuRef.current.contains(e.target as Node)) setShowGroupMenu(false);
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // ── Auto-scroll to bottom on new messages ───────────────────────────────────
//   useEffect(() => {
//     if (chatScrollRef.current) {
//       chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
//     }
//   }, [messageHook.messages]);

//   // ── Focus input when entering chat room ─────────────────────────────────────
//   useEffect(() => {
//     if (view === "chat_room") {
//       setTimeout(() => inputRef.current?.focus(), 100);
//     }
//   }, [view]);

//   // ── Toast helper ─────────────────────────────────────────────────────────────
//   const showToast = useCallback((msg: string) => {
//     setToastMsg(msg);
//     setTimeout(() => setToastMsg(null), 3000);
//   }, []);

//   // ── Open chat room ───────────────────────────────────────────────────────────
//   const openChat = useCallback((chat: Chat) => {
//     setActiveChat(chat);
//     setMessageInput("");
//     setReplyingTo(null);
//     setEditingMsg(null);
//     setView("chat_room");
//   }, []);

//   // ── Open group detail ────────────────────────────────────────────────────────
//   const openGroupDetail = useCallback((group: Group) => {
//     setActiveGroup(group);
//     setView("group_detail");
//   }, []);

//   // ── Handle picking a user to start a DM ─────────────────────────────────────
//   const handlePickUser = useCallback(async (userId: string) => {
//     setShowUserPicker(false);
//     setDmCreating(true);
//     try {
//       const res = await ChatAPI.createDM(userId);
//       chatHook.prependChat(res.chat);
//       openChat(res.chat);
//       showToast("Chat opened!");
//     } catch (e) {
//       showToast(e instanceof Error ? e.message : "Failed to create chat");
//     } finally {
//       setDmCreating(false);
//     }
//   }, [chatHook, openChat, showToast]);

//   // ── Send / edit message ──────────────────────────────────────────────────────
//   const handleSend = useCallback(async () => {
//     const text = messageInput.trim();
//     if (!text || !activeChat) return;
//     setMessageInput("");

//     if (editingMsg) {
//       await messageHook.editMessage(editingMsg.id, text);
//       setEditingMsg(null);
//       return;
//     }

//     await messageHook.send(text, replyingTo ? { replyToId: replyingTo.id } : undefined);
//     setReplyingTo(null);
//     chatHook.refresh();
//   }, [messageInput, activeChat, editingMsg, replyingTo, messageHook, chatHook]);

//   // ── Confirm delete message ───────────────────────────────────────────────────
//   const confirmDelete = useCallback(async () => {
//     if (!deletingMsgId) return;
//     await messageHook.deleteMessage(deletingMsgId);
//     setDeletingMsgId(null);
//     setActiveMenuMsgId(null);
//   }, [deletingMsgId, messageHook]);

//   // ── Create group chat ────────────────────────────────────────────────────────
//   const handleCreateGroup = useCallback(async () => {
//     if (!groupName.trim()) return;
//     const chat = await createChatHook.createGroup(groupName.trim(), selectedMemberIds);
//     if (chat) {
//       chatHook.prependChat(chat);
//       setGroupName(""); setGroupDesc(""); setSelectedMemberIds([]);
//       openChat(chat);
//       showToast("Group created!");
//     }
//   }, [groupName, selectedMemberIds, createChatHook, chatHook, openChat, showToast]);

//   // ── Join group ───────────────────────────────────────────────────────────────
//   const handleJoinGroup = useCallback(async (groupId: string) => {
//     setJoinLoading(groupId);
//     try {
//       const res = await GroupAPI.join(groupId);
//       if (res.status === "joined") {
//         showToast("Joined group!");
//         groupHook.refresh();
//         const group = groupHook.groups.find(g => g.id === groupId);
//         if (group?.chatId) {
//           const chatRes = await ChatAPI.get(group.chatId);
//           chatHook.prependChat(chatRes.chat);
//           openChat(chatRes.chat);
//         } else {
//           setView("list");
//           setActiveTab("My Chats");
//           chatHook.refresh();
//         }
//       } else {
//         showToast("Join request sent — awaiting approval.");
//         setView("list");
//       }
//     } catch (e) {
//       showToast(e instanceof Error ? e.message : "Failed to join group");
//     } finally {
//       setJoinLoading(null);
//     }
//   }, [groupHook, chatHook, openChat, showToast]);

//   // ── Leave group ───────────────────────────────────────────────────────────────
//   const handleLeaveGroup = useCallback(async () => {
//     if (!activeChat) return;
//     try {
//       await ChatAPI.delete(activeChat.id);
//       chatHook.removeChat(activeChat.id);
//       setShowGroupMenu(false);
//       setView("list");
//       setActiveTab("Discover Groups");
//       showToast("Left group");
//     } catch (e) {
//       showToast(e instanceof Error ? e.message : "Failed to leave group");
//     }
//   }, [activeChat, chatHook, showToast]);

//   // ── Search filter ─────────────────────────────────────────────────────────────
//   const filterBySearch = <T extends { name: string }>(items: T[]) =>
//     search.trim() ? items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())) : items;

//   // ════════════════════════════════════════════════════════════════════════════
//   // VIEW: CREATE GROUP
//   // ════════════════════════════════════════════════════════════════════════════
//   if (view === "create_group") {
//     return (
//       <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
//         <div className="flex items-center gap-4 mb-8">
//           <button onClick={() => setView("list")} className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-xl font-bold">Create Group</h1>
//         </div>

//         <div className="flex flex-col gap-6">
//           <div className="flex justify-center">
//             <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/5 transition">
//               <Camera size={24} className="text-gray-500" />
//             </div>
//           </div>

//           <input
//             className="w-full bg-[#111] p-4 rounded-xl border border-white/10 outline-none focus:border-pink-500/50 transition"
//             placeholder="Group name"
//             value={groupName}
//             onChange={e => setGroupName(e.target.value)}
//           />
//           <input
//             className="w-full bg-[#111] p-4 rounded-xl border border-white/10 outline-none focus:border-pink-500/50 transition"
//             placeholder="Enter group description"
//             value={groupDesc}
//             onChange={e => setGroupDesc(e.target.value)}
//           />

//           <button
//             onClick={() => setShowMembersSheet(true)}
//             className="w-full p-4 rounded-xl bg-[#1a1a1a] border border-pink-500/20 text-left flex justify-between items-center hover:bg-white/5 transition"
//           >
//             <span className="text-gray-400">Add members</span>
//             <span className="text-pink-500 font-bold">{selectedMemberIds.length} selected</span>
//           </button>

//           {createChatHook.error && <ErrorBanner message={createChatHook.error} />}

//           <button
//             onClick={handleCreateGroup}
//             disabled={!groupName.trim() || createChatHook.loading}
//             className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 font-bold mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
//           >
//             {createChatHook.loading ? <><Spinner /> Creating…</> : "Create"}
//           </button>
//         </div>

//         {/* Members selection sheet */}
//         {showMembersSheet && (
//           <div className="absolute inset-0 bg-[#0a0a0a] z-50 p-6">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold">Add Members</h2>
//               <button onClick={() => setShowMembersSheet(false)} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5">
//                 <X size={18} />
//               </button>
//             </div>
//             {/* Use UserPickerSheet logic inline here */}
//             <UserPickerSheet
//               open={showMembersSheet}
//               onClose={() => setShowMembersSheet(false)}
//               onPickUser={id => {
//                 setSelectedMemberIds(prev =>
//                   prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
//                 );
//               }}
//             />
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   // VIEW: GROUP DETAIL
//   // ════════════════════════════════════════════════════════════════════════════
//   if (view === "group_detail" && activeGroup) {
//     const isJoining = joinLoading === activeGroup.id;
//     return (
//       <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
//         <div className="flex items-center gap-4 p-4 bg-[#111] border-b border-white/5">
//           <button onClick={() => setView("list")} className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5">
//             <ChevronLeft size={22} />
//           </button>
//           <h1 className="text-lg font-bold truncate">{activeGroup.name}</h1>
//         </div>

//         <div className="p-6 flex flex-col gap-6">
//           <div className="flex items-center gap-5">
//             <div className="w-20 h-20 rounded-2xl bg-[#2a1a1f] border border-pink-500/10 flex items-center justify-center flex-shrink-0">
//               <Users size={32} className="text-[#e91e63]" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold">{activeGroup.name}</h2>
//               <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
//                 <PrivacyBadge privacy={activeGroup.privacy} />
//                 <span>·</span>
//                 <span>{activeGroup.memberCount.toLocaleString()} members</span>
//               </div>
//               {activeGroup.isTrending && (
//                 <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-[#e91e63] text-xs font-bold">
//                   <TrendingUp size={10} /> TRENDING
//                 </div>
//               )}
//             </div>
//           </div>

//           {activeGroup.description && (
//             <p className="text-gray-300 text-sm leading-relaxed bg-[#111] p-4 rounded-xl border border-white/5">
//               {activeGroup.description}
//             </p>
//           )}

//           <button
//             onClick={() => handleJoinGroup(activeGroup.id)}
//             disabled={isJoining}
//             className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 font-bold flex items-center justify-center gap-2 disabled:opacity-60"
//           >
//             {isJoining
//               ? <><Spinner /> Joining…</>
//               : activeGroup.privacy === "closed" ? "Request to Join" : "Join Group"
//             }
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   // VIEW: CHAT ROOM
//   // ════════════════════════════════════════════════════════════════════════════
//   if (view === "chat_room" && activeChat) {
//     return (
//       <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans relative">

//         {/* ── Header ── */}
//         <div className="flex items-center justify-between p-4 bg-[#111] border-b border-white/5 z-20">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => { setView("list"); setActiveChat(null); }}
//               className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 transition"
//             >
//               <ChevronLeft size={22} />
//             </button>
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <ChatAvatar src={activeChat.avatarUrl} name={activeChat.name} size="w-10 h-10" />
//                 {activeChat.isOnline && (
//                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]" />
//                 )}
//               </div>
//               <div>
//                 <h1 className="text-[16px] font-bold flex items-center gap-1">
//                   {activeChat.name}
//                   {activeChat.isVerified && <BadgeCheck size={14} className="text-blue-500" />}
//                 </h1>
//                 {activeChat.type === "group"
//                   ? <span className="text-xs text-gray-400">{activeChat.participantIds.length} members</span>
//                   : activeChat.isOnline
//                     ? <span className="text-xs text-green-400">Online</span>
//                     : <span className="text-xs text-gray-500">
//                         {activeChat.lastMessageAt ? `Last seen ${timeAgo(activeChat.lastMessageAt)}` : "Offline"}
//                       </span>
//                 }
//               </div>
//             </div>
//           </div>

//           {activeChat.type === "group" && (
//             <div className="relative" ref={groupMenuRef}>
//               <button
//                 onClick={() => setShowGroupMenu(!showGroupMenu)}
//                 className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 transition"
//               >
//                 <MoreVertical size={20} />
//               </button>
//               {showGroupMenu && (
//                 <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-1 z-50">
//                   <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm font-medium text-gray-200">
//                     <Flag size={16} /> Report group
//                   </button>
//                   <button
//                     onClick={handleLeaveGroup}
//                     className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm font-medium text-red-500"
//                   >
//                     <LogOut size={16} /> Leave group
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ── Messages ── */}
//         <div
//           ref={chatScrollRef}
//           className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
//           onClick={() => setActiveMenuMsgId(null)}
//         >
//           {/* Loading state */}
//           {messageHook.loading && messageHook.messages.length === 0 && (
//             <div className="flex justify-center py-16"><Spinner /></div>
//           )}

//           {messageHook.error && <ErrorBanner message={messageHook.error} />}

//           {/* Toast */}
//           {toastMsg && (
//             <div className="flex justify-center sticky top-2 z-10 mb-2">
//               <div className="bg-[#222]/90 backdrop-blur-md text-gray-200 px-5 py-2 rounded-full text-sm shadow-xl border border-white/10">
//                 {toastMsg}
//               </div>
//             </div>
//           )}

//           {/* Empty state */}
//           {!messageHook.loading && messageHook.messages.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-600">
//               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
//                 <Mic size={28} />
//               </div>
//               <p className="text-sm">No messages yet. Say hi! 👋</p>
//             </div>
//           )}

//           {/* ── Message bubbles ── */}
//           {messageHook.messages.map((msg, idx) => {
//             const isMe = msg.senderId === currentUserId;
//             const isDeleted = !!msg.deletedAt;
//             const showMenu = activeMenuMsgId === msg.id;
//             const isOptimistic = msg.id.startsWith("optimistic_");
//             const prevMsg = idx > 0 ? messageHook.messages[idx - 1] : null;
//             const isSameSenderAsPrev = prevMsg?.senderId === msg.senderId;
//             const replyMsg = msg.replyToId ? messageHook.messages.find(m => m.id === msg.replyToId) : null;

//             return (
//               <div
//                 key={msg.id}
//                 className={`flex ${isMe ? "justify-end" : "justify-start"} ${isSameSenderAsPrev ? "mt-0.5" : "mt-3"}`}
//               >
//                 {/* Avatar for others in group chat */}
//                 {!isMe && activeChat.type === "group" && !isSameSenderAsPrev && (
//                   <ChatAvatar src={null} name={msg.senderId} size="w-7 h-7" className="mr-2 mt-1 self-end flex-shrink-0" />
//                 )}
//                 {!isMe && activeChat.type === "group" && isSameSenderAsPrev && (
//                   <div className="w-7 mr-2 flex-shrink-0" />
//                 )}

//                 <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[72%] relative`}>

//                   {/* Reply preview */}
//                   {replyMsg && !isDeleted && (
//                     <div className={`text-xs px-3 py-1.5 rounded-t-lg mb-[-6px] max-w-full truncate border-l-2 ${
//                       isMe ? "bg-[#c01854] text-pink-200 border-pink-300 self-end" : "bg-[#2a2a2a] text-gray-300 border-gray-500 self-start"
//                     }`}>
//                       <span className="font-medium">{replyMsg.senderId === currentUserId ? "You" : replyMsg.senderId}</span>
//                       <span className="ml-1 opacity-80">{replyMsg.content.slice(0, 50)}</span>
//                     </div>
//                   )}

//                   {/* Bubble */}
//                   <div
//                     onClick={e => {
//                       e.stopPropagation();
//                       if (!isDeleted) setActiveMenuMsgId(showMenu ? null : msg.id);
//                     }}
//                     className={`
//                       px-4 py-2 text-[14.5px] leading-relaxed cursor-pointer select-none relative
//                       ${isOptimistic ? "opacity-70" : "opacity-100"}
//                       ${isDeleted
//                         ? "bg-[#1a1a1a] text-gray-500 italic rounded-2xl text-sm"
//                         : isMe
//                           ? "bg-[#e91e63] text-white rounded-2xl rounded-br-sm"
//                           : "bg-[#262626] text-white rounded-2xl rounded-bl-sm"
//                       }
//                     `}
//                   >
//                     {isDeleted ? "This message was deleted." : msg.content}

//                     {/* Timestamp + ticks inline at end of last line */}
//                     {!isDeleted && (
//                       <span className={`inline-flex items-center gap-1 ml-2 float-right mt-1 ${isMe ? "text-pink-200/70" : "text-gray-500"} text-[10px] leading-none`}>
//                         {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                         {isMe && <MessageTicks isRead={msg.isRead} isOptimistic={isOptimistic} />}
//                       </span>
//                     )}
//                   </div>

//                   {/* Message action menu */}
//                   {showMenu && !isDeleted && (
//                     <div
//                       className={`absolute z-50 top-0 w-56 bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isMe ? "right-full mr-2" : "left-full ml-2"}`}
//                       onClick={e => e.stopPropagation()}
//                     >
//                       {/* Emoji reactions */}
//                       <div className="flex items-center justify-around px-3 py-2.5 border-b border-white/5 bg-[#252525]">
//                         {EMOJIS.map(emoji => (
//                           <button
//                             key={emoji}
//                             onClick={() => setActiveMenuMsgId(null)}
//                             className="text-xl hover:scale-125 active:scale-110 transition-transform"
//                           >
//                             {emoji}
//                           </button>
//                         ))}
//                       </div>

//                       {/* Actions */}
//                       <button
//                         onClick={() => { setReplyingTo(msg); setActiveMenuMsgId(null); }}
//                         className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-gray-200 transition-colors"
//                       >
//                         <Reply size={15} className="text-gray-400" /> Reply
//                       </button>

//                       {isMe && (
//                         <>
//                           <button
//                             onClick={() => { setEditingMsg(msg); setMessageInput(msg.content); setActiveMenuMsgId(null); setTimeout(() => inputRef.current?.focus(), 50); }}
//                             className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-gray-200 transition-colors"
//                           >
//                             <Edit2 size={15} className="text-gray-400" /> Edit
//                           </button>
//                           <button
//                             onClick={() => { setDeletingMsgId(msg.id); setActiveMenuMsgId(null); }}
//                             className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-red-500 transition-colors"
//                           >
//                             <Trash2 size={15} /> Delete
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* ── Input area ── */}
//         <div className="bg-[#0a0a0a] border-t border-white/5 px-4 pb-4 pt-2 z-20">
//           {/* Reply / edit banner */}
//           {(replyingTo || editingMsg) && (
//             <div className="flex items-center justify-between bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 mb-2">
//               <div className="flex flex-col min-w-0">
//                 <span className="text-xs font-semibold text-[#e91e63]">
//                   {editingMsg ? "Editing message" : "Replying to message"}
//                 </span>
//                 <span className="text-xs text-gray-400 truncate">
//                   {editingMsg ? editingMsg.content : replyingTo?.content}
//                 </span>
//               </div>
//               <button
//                 onClick={() => { setReplyingTo(null); setEditingMsg(null); setMessageInput(""); }}
//                 className="ml-3 p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition flex-shrink-0"
//               >
//                 <X size={13} />
//               </button>
//             </div>
//           )}

//           <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-full px-4 py-3 border border-white/10">
//             <input
//               ref={inputRef}
//               type="text"
//               value={messageInput}
//               onChange={e => setMessageInput(e.target.value)}
//               placeholder={editingMsg ? "Edit your message..." : "Message…"}
//               className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm"
//               onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
//             />
//             {messageInput.trim() ? (
//               <button
//                 onClick={handleSend}
//                 disabled={messageHook.sending}
//                 className="w-9 h-9 flex items-center justify-center rounded-full bg-[#e91e63] hover:bg-pink-600 transition disabled:opacity-50 flex-shrink-0"
//               >
//                 {messageHook.sending
//                   ? <Loader2 size={16} className="animate-spin text-white" />
//                   : <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth={2.5}><path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" /></svg>
//                 }
//               </button>
//             ) : (
//               <button className="text-gray-400 hover:text-white transition">
//                 <Mic size={20} />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ── Delete confirmation modal ── */}
//         {deletingMsgId && (
//           <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
//             <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-sm border border-white/10 shadow-2xl">
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="text-lg font-bold">Delete message?</h3>
//                 <button onClick={() => setDeletingMsgId(null)} className="p-1 hover:bg-white/10 rounded-full transition">
//                   <X size={20} className="text-gray-400" />
//                 </button>
//               </div>
//               <p className="text-gray-400 text-sm mb-6">This will delete the message for everyone. This action cannot be undone.</p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setDeletingMsgId(null)}
//                   className="px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/10 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={confirmDelete}
//                   className="px-5 py-2.5 rounded-full text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition shadow-lg shadow-red-600/20"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ════════════════════════════════════════════════════════════════════════════
//   // VIEW: MAIN LIST
//   // ════════════════════════════════════════════════════════════════════════════
//   return (
//     <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden font-sans flex flex-col">
//       <div className="max-w-2xl mx-auto w-full relative z-10 flex flex-col h-screen">

//         {/* ── Header ── */}
//         <div className="flex items-center justify-between p-4 bg-[#0a0a0a]">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => router.back()}
//               className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 transition"
//             >
//               <ChevronLeft size={22} />
//             </button>
//             <h1 className="text-2xl font-bold tracking-wide">Messages</h1>
//           </div>
//           <div className="flex items-center gap-2">
//             {dmCreating && <Spinner />}
//             <div className="relative" ref={menuRef}>
//               <button
//                 onClick={() => setShowAddMenu(!showAddMenu)}
//                 className="w-10 h-10 flex items-center justify-center rounded bg-gradient-to-br from-pink-500 to-orange-500 hover:opacity-90 transition shadow-lg shadow-pink-500/20"
//               >
//                 <Plus size={22} />
//               </button>
//               {showAddMenu && (
//                 <div className="absolute right-0 top-full mt-3 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-1">
//                   <button
//                     onClick={() => {
//                       setShowAddMenu(false);
//                       setShowUserPicker(true); // ← opens on the LIST view, not create_group
//                     }}
//                     className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm font-medium text-gray-200 transition-colors"
//                   >
//                     <UserPlus size={18} className="text-gray-400" /> New chat
//                   </button>
//                   <button
//                     onClick={() => { setShowAddMenu(false); setView("create_group"); }}
//                     className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm font-medium text-gray-200 transition-colors"
//                   >
//                     <Users size={18} className="text-gray-400" /> Create group
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ── Search ── */}
//         <div className="px-4 mb-4">
//           <div className="flex items-center gap-3 bg-[#151515] rounded-xl px-4 py-3 border border-white/5 focus-within:border-pink-500/50 transition">
//             <Search size={18} className="text-gray-500" />
//             <input
//               type="text"
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               placeholder="Search chats & groups..."
//               className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500"
//             />
//             {search && (
//               <button onClick={() => setSearch("")}>
//                 <X size={16} className="text-gray-500" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* ── Tabs ── */}
//         <div className="flex px-4 mb-4">
//           {(["My Chats", "Discover Groups", "Communities"] as TabType[]).map((tab, i) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`flex-1 py-3 text-sm font-bold transition-colors ${i === 1 ? "border-x border-black" : ""} ${activeTab === tab ? "bg-[#e91e63] text-white" : "bg-[#1a1a1a] text-gray-400 hover:bg-[#222]"}`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* ── Chat / Group / Community lists ── */}
//         <div className="flex-1 overflow-y-auto px-4 pb-20 flex flex-col gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

//           {/* MY CHATS */}
//           {activeTab === "My Chats" && (
//             <>
//               {chatHook.error && <ErrorBanner message={chatHook.error} onRetry={chatHook.refresh} />}
//               {chatHook.loading && chatHook.chats.length === 0 && (
//                 <>{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</>
//               )}
//               {filterBySearch(chatHook.chats).map(chat => (
//                 <div
//                   key={chat.id}
//                   onClick={() => openChat(chat)}
//                   className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 cursor-pointer hover:bg-white/5 active:bg-white/10 transition-colors"
//                 >
//                   <div className="relative flex-shrink-0">
//                     <ChatAvatar src={chat.avatarUrl} name={chat.name} size="w-14 h-14" />
//                     {chat.isOnline && (
//                       <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]" />
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center justify-between mb-0.5">
//                       <h2 className="text-white font-bold text-[15px] truncate flex items-center gap-1.5">
//                         {chat.name}
//                         {chat.isVerified && <BadgeCheck size={15} className="text-blue-500 flex-shrink-0" />}
//                       </h2>
//                       <span className="text-[11px] text-gray-500 whitespace-nowrap ml-2 flex-shrink-0">
//                         {chat.lastMessageAt ? timeAgo(chat.lastMessageAt) : ""}
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <p className="text-sm text-gray-400 truncate pr-3">
//                         {chat.lastMessageContent || "Tap to chat"}
//                       </p>
//                       {chat.unreadCount > 0 && (
//                         <div className="bg-[#e91e63] text-white text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/20 flex-shrink-0">
//                           {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {chatHook.hasMore && (
//                 <button onClick={chatHook.loadMore} disabled={chatHook.loading} className="text-xs text-gray-500 hover:text-gray-300 text-center py-3 flex items-center justify-center gap-2">
//                   {chatHook.loading ? <Spinner /> : "Load more chats"}
//                 </button>
//               )}
//               {!chatHook.loading && chatHook.chats.length === 0 && (
//                 <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-600">
//                   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
//                     <Users size={28} />
//                   </div>
//                   <p className="text-sm">No chats yet. Start a conversation!</p>
//                   <button onClick={() => setShowUserPicker(true)} className="px-4 py-2 rounded-full bg-[#e91e63]/10 border border-[#e91e63]/30 text-[#e91e63] text-sm font-medium hover:bg-[#e91e63]/20 transition">
//                     New Chat
//                   </button>
//                 </div>
//               )}
//             </>
//           )}

//           {/* DISCOVER GROUPS */}
//           {activeTab === "Discover Groups" && (
//             <>
//               {groupHook.error && <ErrorBanner message={groupHook.error} onRetry={groupHook.refresh} />}
//               {groupHook.loading && groupHook.groups.length === 0 && (
//                 <>{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</>
//               )}
//               {filterBySearch(groupHook.groups).map(group => (
//                 <div
//                   key={group.id}
//                   onClick={() => openGroupDetail(group)}
//                   className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 cursor-pointer hover:bg-white/5 transition-colors"
//                 >
//                   <div className="w-14 h-14 rounded-lg bg-[#2a1a1f] border border-pink-500/10 flex items-center justify-center flex-shrink-0">
//                     <Users size={24} className="text-[#e91e63]" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center justify-between mb-1">
//                       <h2 className="text-white font-bold text-[15px] truncate pr-2">{group.name}</h2>
//                       {group.isTrending && (
//                         <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-[#e91e63] text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
//                           <TrendingUp size={10} /> Trending
//                         </div>
//                       )}
//                     </div>
//                     <p className="text-sm text-gray-400 truncate mb-1.5">{group.description || "Join the conversation"}</p>
//                     <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
//                       <PrivacyBadge privacy={group.privacy} />
//                       <span className="flex items-center gap-1"><Users size={11} /> {group.memberCount.toLocaleString()}</span>
//                       <span>· {timeAgo(group.lastActivityAt)}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {groupHook.hasMore && (
//                 <button onClick={groupHook.loadMore} disabled={groupHook.loading} className="text-xs text-gray-500 hover:text-gray-300 text-center py-3 flex items-center justify-center gap-2">
//                   {groupHook.loading ? <Spinner /> : "Load more groups"}
//                 </button>
//               )}
//               {!groupHook.loading && groupHook.groups.length === 0 && (
//                 <p className="text-gray-500 text-center mt-10 text-sm">No groups found.</p>
//               )}
//             </>
//           )}

//           {/* COMMUNITIES */}
//           {activeTab === "Communities" && (
//             <>
//               {communityHook.error && <ErrorBanner message={communityHook.error} />}
//               {communityHook.loading && communityHook.communities.length === 0 && (
//                 <>{[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}</>
//               )}
//               {filterBySearch(communityHook.communities).map((community: Community) => (
//                 <div
//                   key={community.id}
//                   className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 cursor-pointer hover:bg-white/5 transition-colors"
//                 >
//                   <div className="w-14 h-14 rounded-lg bg-[#1a1c2a] border border-blue-500/10 flex items-center justify-center flex-shrink-0">
//                     <Users size={24} className="text-blue-400" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 mb-1">
//                       <h2 className="text-white font-bold text-[15px] truncate">{community.name}</h2>
//                       {community.isVerified && <BadgeCheck size={15} className="text-blue-500 flex-shrink-0" />}
//                     </div>
//                     <p className="text-sm text-gray-400 truncate mb-1.5">{community.description || "A community"}</p>
//                     <div className="flex items-center gap-3 text-xs text-gray-500">
//                       <span className="flex items-center gap-1"><Users size={11} /> {community.memberCount.toLocaleString()} members</span>
//                       <span>· {community.groupCount} groups</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {communityHook.hasMore && (
//                 <button onClick={communityHook.loadMore} disabled={communityHook.loading} className="text-xs text-gray-500 hover:text-gray-300 text-center py-3 flex items-center justify-center gap-2">
//                   {communityHook.loading ? <Spinner /> : "Load more communities"}
//                 </button>
//               )}
//               {!communityHook.loading && communityHook.communities.length === 0 && (
//                 <p className="text-gray-500 text-center mt-10 text-sm">No communities yet.</p>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* ── User Picker Sheet — rendered ON the list view ── */}
//       <UserPickerSheet
//         open={showUserPicker}
//         onClose={() => setShowUserPicker(false)}
//         onPickUser={handlePickUser}
//       />
//     </div>
//   );
// }







"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ChevronLeft, Plus, UserPlus, Users, Camera, X, MoreVertical, Mic,
  CheckCheck, Flag, LogOut, Reply, Edit2, Trash2,
  Search, BadgeCheck, TrendingUp, Globe, Lock, Radio, Crown, Loader2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useChats, useMessages, useGroups, useCommunities, useCreateChat, timeAgo } from "../../../hooks/useChat";
import { useAuth } from "@/context/AuthContext";
import { ChatAPI, GroupAPI, resolveChatName, type Chat, type Message, type Group, type Community } from "../../../lib/chatApi";

type TabType  = "My Chats" | "Discover Groups" | "Communities";
type ViewType = "list" | "create_group" | "chat_room" | "group_detail";

const EMOJIS = ["🤣", "🥳", "🤩", "😡", "😔"];

type PickerUser = {
  userId?: string; user_id?: string; id?: string;
  email?: string; firstName?: string; lastName?: string; name?: string; avatar?: string;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const ChatAvatar = ({ src, name, size = "w-12 h-12", className = "", fallbackBg = "bg-[#2a1a1f]" }: {
  src?: string | null; name: string; size?: string; className?: string; fallbackBg?: string;
}) => {
  const [err, setErr] = useState(false);
  const letter = (name || "?").charAt(0).toUpperCase();
  return (
    <div className={`${size} rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold ${!src || err ? fallbackBg : "bg-[#151515]"} border border-white/5 ${className}`}>
      {src && !err
        ? <Image src={src} alt={name} width={56} height={56} className="w-full h-full object-cover" onError={() => setErr(true)} />
        : <span className="text-xl opacity-80">{letter}</span>}
    </div>
  );
};

const Spinner = ({ className = "" }: { className?: string }) => (
  <Loader2 size={20} className={`animate-spin text-[#e91e63] ${className}`} />
);

const ErrorBanner = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex items-center gap-3 bg-red-900/20 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
    <AlertCircle size={16} className="flex-shrink-0" />
    <span className="flex-1">{message}</span>
    {onRetry && <button onClick={onRetry} className="text-red-300 underline text-xs">Retry</button>}
  </div>
);

const SkeletonRow = () => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 animate-pulse">
    <div className="w-14 h-14 rounded-full bg-white/5" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-4 bg-white/5 rounded w-1/3" />
      <div className="h-3 bg-white/5 rounded w-2/3" />
    </div>
  </div>
);

const PrivacyBadge = ({ privacy }: { privacy: string }) => {
  const map: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
    public:       { icon: <Globe size={12} />,  label: "Public",       color: "text-blue-400" },
    closed:       { icon: <Lock size={12} />,   label: "Closed",       color: "text-yellow-500" },
    private:      { icon: <Lock size={12} />,   label: "Private",      color: "text-orange-500" },
    announcement: { icon: <Radio size={12} />,  label: "Announcement", color: "text-pink-500" },
    exclusive:    { icon: <Crown size={12} />,  label: "Exclusive",    color: "text-purple-400" },
  };
  const cfg = map[privacy?.toLowerCase()] ?? map.public;
  return <span className={`flex items-center gap-1 ${cfg.color} font-medium`}>{cfg.icon} {cfg.label}</span>;
};

// ── WhatsApp-style ticks ──────────────────────────────────────────────────────
const MessageTicks = ({ isRead, isOptimistic }: { isRead: boolean; isOptimistic: boolean }) => {
  if (isOptimistic) return <Loader2 size={10} className="animate-spin text-gray-500" />;
  if (isRead)       return <CheckCheck size={14} className="text-blue-400" />;
  return              <CheckCheck size={14} className="text-gray-500" />;
};

// ── User Picker Sheet ─────────────────────────────────────────────────────────
const UserPickerSheet = ({ open, onClose, onPickUser }: {
  open: boolean; onClose: () => void; onPickUser: (userId: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const [users, setUsers]   = useState<PickerUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!open) { setSearch(""); return; }
    const ac = new AbortController();
    setLoading(true); setError(null);
    fetch("/api/users", { signal: ac.signal })
      .then(r => r.json())
      .then(json => setUsers(Array.isArray(json.users) ? json.users : []))
      .catch(e => { if (e.name !== "AbortError") setError("Failed to load users"); })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [open]);

  if (!open) return null;

  const filtered = (users ?? []).filter(u => {
    const name  = `${u.firstName ?? u.name ?? ""} ${u.lastName ?? ""}`.toLowerCase();
    const email = (u.email ?? "").toLowerCase();
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
  });

  return (
    <div className="absolute inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-[#1a1a1a] w-full max-w-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3 p-4 border-b border-white/5">
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition"><X size={20} /></button>
          <h3 className="text-lg font-bold">New Chat</h3>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-3 bg-[#111] rounded-xl px-3 py-2.5 border border-white/5">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500" />
            {search && <button onClick={() => setSearch("")}><X size={14} className="text-gray-500" /></button>}
          </div>
        </div>
        <div className="max-h-72 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          {loading  && <div className="flex items-center justify-center py-10 gap-3 text-gray-400 text-sm"><Spinner /> Loading users…</div>}
          {error    && <div className="p-4 text-center text-sm text-red-400">{error}</div>}
          {!loading && !error && filtered.length === 0 && <div className="p-6 text-center text-sm text-gray-500">No users found</div>}
          {filtered.map((u, i) => {
            const id = u.userId ?? u.user_id ?? u.id ?? u.email ?? "";
            const displayName = `${u.firstName ?? u.name ?? ""}${u.lastName ? ` ${u.lastName}` : ""}`.trim() || id;
            return (
              <div key={`${id}-${i}`} onClick={() => onPickUser(id)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 transition-colors">
                <ChatAvatar src={u.avatar} name={displayName} size="w-10 h-10" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{displayName}</div>
                  {u.email && <div className="text-xs text-gray-400 truncate">{u.email}</div>}
                </div>
                <div className="w-8 h-8 rounded-full bg-[#e91e63]/10 border border-[#e91e63]/30 flex items-center justify-center flex-shrink-0">
                  <UserPlus size={14} className="text-[#e91e63]" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function ChatComponent() {
  const router = useRouter();
  const { user } = useAuth();

  // ── FIX #1: derive currentUserId once here and pass it down everywhere ───────
  // useAuth() may return the user asynchronously. We memo it so child calls
  // don't get an empty string on first render.
  const currentUserId = user?.userId ?? user?.userId ?? user?.uid ?? user?.email ?? "";

  // ── View state ───────────────────────────────────────────────────────────────
  const [view, setView]               = useState<ViewType>("list");
  const [activeTab, setActiveTab]     = useState<TabType>("My Chats");
  const [activeChat, setActiveChat]   = useState<Chat | null>(null);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [search, setSearch]           = useState("");

  // ── Data hooks ───────────────────────────────────────────────────────────────
  const chatHook      = useChats();
  const groupHook     = useGroups();
  const communityHook = useCommunities();

  // FIX #1: pass currentUserId directly into useMessages
  const messageHook   = useMessages(activeChat?.id ?? null, currentUserId);
  const createChatHook = useCreateChat();

  // ── Create group state ───────────────────────────────────────────────────────
  const [groupName, setGroupName]                 = useState("");
  const [groupDesc, setGroupDesc]                 = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [showMembersSheet, setShowMembersSheet]   = useState(false);
  const [showUserPicker, setShowUserPicker]       = useState(false);

  // ── Chat room state ──────────────────────────────────────────────────────────
  const [messageInput, setMessageInput]       = useState("");
  const [replyingTo, setReplyingTo]           = useState<Message | null>(null);
  const [editingMsg, setEditingMsg]           = useState<Message | null>(null);
  const [deletingMsgId, setDeletingMsgId]     = useState<string | null>(null);
  const [activeMenuMsgId, setActiveMenuMsgId] = useState<string | null>(null);
  const [toastMsg, setToastMsg]               = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu]         = useState(false);
  const [showGroupMenu, setShowGroupMenu]     = useState(false);
  const [joinLoading, setJoinLoading]         = useState<string | null>(null);
  const [dmCreating, setDmCreating]           = useState(false);

  const menuRef       = useRef<HTMLDivElement | null>(null);
  const groupMenuRef  = useRef<HTMLDivElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef      = useRef<HTMLInputElement>(null);

  // ── Close menus on outside click ─────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowAddMenu(false);
      if (groupMenuRef.current && !groupMenuRef.current.contains(e.target as Node)) setShowGroupMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Auto-scroll to bottom on new messages ────────────────────────────────────
  useEffect(() => {
    if (chatScrollRef.current) chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [messageHook.messages]);

  // ── Focus input when entering chat room ──────────────────────────────────────
  useEffect(() => {
    if (view === "chat_room") setTimeout(() => inputRef.current?.focus(), 100);
  }, [view]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }, []);

  // ── FIX #2: clear unread badge instantly when chat is opened ─────────────────
  const openChat = useCallback((chat: Chat) => {
    setActiveChat(chat);
    setMessageInput("");
    setReplyingTo(null);
    setEditingMsg(null);
    chatHook.markChatAsRead(chat.id);   // ← zeroes the red badge immediately
    setView("chat_room");
  }, [chatHook]);

  const openGroupDetail = useCallback((group: Group) => {
    setActiveGroup(group);
    setView("group_detail");
  }, []);

  const handlePickUser = useCallback(async (userId: string) => {
    setShowUserPicker(false);
    setDmCreating(true);
    try {
      const res = await ChatAPI.createDM(userId);
      chatHook.prependChat(res.chat);
      openChat(res.chat);
      showToast("Chat opened!");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to create chat");
    } finally {
      setDmCreating(false);
    }
  }, [chatHook, openChat, showToast]);

  const handleSend = useCallback(async () => {
    const text = messageInput.trim();
    if (!text || !activeChat) return;
    setMessageInput("");
    if (editingMsg) {
      await messageHook.editMessage(editingMsg.id, text);
      setEditingMsg(null);
      return;
    }
    await messageHook.send(text, replyingTo ? { replyToId: replyingTo.id } : undefined);
    setReplyingTo(null);
    chatHook.refresh();
  }, [messageInput, activeChat, editingMsg, replyingTo, messageHook, chatHook]);

  const confirmDelete = useCallback(async () => {
    if (!deletingMsgId) return;
    await messageHook.deleteMessage(deletingMsgId);
    setDeletingMsgId(null);
    setActiveMenuMsgId(null);
  }, [deletingMsgId, messageHook]);

  const handleCreateGroup = useCallback(async () => {
    if (!groupName.trim()) return;
    const chat = await createChatHook.createGroup(groupName.trim(), selectedMemberIds);
    if (chat) {
      chatHook.prependChat(chat);
      setGroupName(""); setGroupDesc(""); setSelectedMemberIds([]);
      openChat(chat);
      showToast("Group created!");
    }
  }, [groupName, selectedMemberIds, createChatHook, chatHook, openChat, showToast]);

  const handleJoinGroup = useCallback(async (groupId: string) => {
    setJoinLoading(groupId);
    try {
      const res = await GroupAPI.join(groupId);
      if (res.status === "joined") {
        showToast("Joined group!");
        groupHook.refresh();
        const group = groupHook.groups.find(g => g.id === groupId);
        if (group?.chatId) {
          const chatRes = await ChatAPI.get(group.chatId);
          chatHook.prependChat(chatRes.chat);
          openChat(chatRes.chat);
        } else {
          setView("list"); setActiveTab("My Chats"); chatHook.refresh();
        }
      } else {
        showToast("Join request sent — awaiting approval.");
        setView("list");
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to join group");
    } finally {
      setJoinLoading(null);
    }
  }, [groupHook, chatHook, openChat, showToast]);

  const handleLeaveGroup = useCallback(async () => {
    if (!activeChat) return;
    try {
      await ChatAPI.delete(activeChat.id);
      chatHook.removeChat(activeChat.id);
      setShowGroupMenu(false);
      setView("list"); setActiveTab("Discover Groups");
      showToast("Left group");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to leave group");
    }
  }, [activeChat, chatHook, showToast]);

  const filterBySearch = <T extends { name: string }>(items: T[]) =>
    search.trim() ? items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())) : items;

  // ════════════════════════════════════════════════════════════════════════════
  // VIEW: CREATE GROUP
  // ════════════════════════════════════════════════════════════════════════════
  if (view === "create_group") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setView("list")} className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5"><ChevronLeft size={24} /></button>
          <h1 className="text-xl font-bold">Create Group</h1>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10 cursor-pointer hover:bg-white/5 transition"><Camera size={24} className="text-gray-500" /></div>
          </div>
          <input className="w-full bg-[#111] p-4 rounded-xl border border-white/10 outline-none focus:border-pink-500/50 transition" placeholder="Group name" value={groupName} onChange={e => setGroupName(e.target.value)} />
          <input className="w-full bg-[#111] p-4 rounded-xl border border-white/10 outline-none focus:border-pink-500/50 transition" placeholder="Enter group description" value={groupDesc} onChange={e => setGroupDesc(e.target.value)} />
          <button onClick={() => setShowMembersSheet(true)} className="w-full p-4 rounded-xl bg-[#1a1a1a] border border-pink-500/20 text-left flex justify-between items-center hover:bg-white/5 transition">
            <span className="text-gray-400">Add members</span>
            <span className="text-pink-500 font-bold">{selectedMemberIds.length} selected</span>
          </button>
          {createChatHook.error && <ErrorBanner message={createChatHook.error} />}
          <button onClick={handleCreateGroup} disabled={!groupName.trim() || createChatHook.loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 font-bold mt-4 disabled:opacity-50 flex items-center justify-center gap-2">
            {createChatHook.loading ? <><Spinner /> Creating…</> : "Create"}
          </button>
        </div>
        {showMembersSheet && (
          <div className="absolute inset-0 bg-[#0a0a0a] z-50 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add Members</h2>
              <button onClick={() => setShowMembersSheet(false)} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5"><X size={18} /></button>
            </div>
            <UserPickerSheet open={showMembersSheet} onClose={() => setShowMembersSheet(false)} onPickUser={id => {
              setSelectedMemberIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
            }} />
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // VIEW: GROUP DETAIL
  // ════════════════════════════════════════════════════════════════════════════
  if (view === "group_detail" && activeGroup) {
    const isJoining = joinLoading === activeGroup.id;
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
        <div className="flex items-center gap-4 p-4 bg-[#111] border-b border-white/5">
          <button onClick={() => setView("list")} className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5"><ChevronLeft size={22} /></button>
          <h1 className="text-lg font-bold truncate">{activeGroup.name}</h1>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#2a1a1f] border border-pink-500/10 flex items-center justify-center flex-shrink-0"><Users size={32} className="text-[#e91e63]" /></div>
            <div>
              <h2 className="text-2xl font-bold">{activeGroup.name}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                <PrivacyBadge privacy={activeGroup.privacy} /><span>·</span>
                <span>{activeGroup.memberCount.toLocaleString()} members</span>
              </div>
              {activeGroup.isTrending && <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-[#e91e63] text-xs font-bold"><TrendingUp size={10} /> TRENDING</div>}
            </div>
          </div>
          {activeGroup.description && <p className="text-gray-300 text-sm leading-relaxed bg-[#111] p-4 rounded-xl border border-white/5">{activeGroup.description}</p>}
          <button onClick={() => handleJoinGroup(activeGroup.id)} disabled={isJoining} className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 font-bold flex items-center justify-center gap-2 disabled:opacity-60">
            {isJoining ? <><Spinner /> Joining…</> : activeGroup.privacy === "closed" ? "Request to Join" : "Join Group"}
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // VIEW: CHAT ROOM
  // ════════════════════════════════════════════════════════════════════════════
  if (view === "chat_room" && activeChat) {
    // FIX #2: resolve display name for DMs
    const chatDisplayName = resolveChatName(activeChat, currentUserId);

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans relative">

        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#111] border-b border-white/5 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => { setView("list"); setActiveChat(null); }} className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 transition">
              <ChevronLeft size={22} />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <ChatAvatar src={activeChat.avatarUrl} name={chatDisplayName} size="w-10 h-10" />
                {activeChat.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]" />}
              </div>
              <div>
                <h1 className="text-[16px] font-bold flex items-center gap-1">
                  {chatDisplayName}
                  {activeChat.isVerified && <BadgeCheck size={14} className="text-blue-500" />}
                </h1>
                {activeChat.type === "group"
                  ? <span className="text-xs text-gray-400">{activeChat.participantIds.length} members</span>
                  : activeChat.isOnline
                    ? <span className="text-xs text-green-400">Online</span>
                    : <span className="text-xs text-gray-500">{activeChat.lastMessageAt ? `Last seen ${timeAgo(activeChat.lastMessageAt)}` : "Offline"}</span>
                }
              </div>
            </div>
          </div>
          {activeChat.type === "group" && (
            <div className="relative" ref={groupMenuRef}>
              <button onClick={() => setShowGroupMenu(!showGroupMenu)} className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 transition"><MoreVertical size={20} /></button>
              {showGroupMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-1 z-50">
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm font-medium text-gray-200"><Flag size={16} /> Report group</button>
                  <button onClick={handleLeaveGroup} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm font-medium text-red-500"><LogOut size={16} /> Leave group</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Messages */}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" onClick={() => setActiveMenuMsgId(null)}>
          {messageHook.loading && messageHook.messages.length === 0 && <div className="flex justify-center py-16"><Spinner /></div>}
          {messageHook.error && <ErrorBanner message={messageHook.error} />}
          {toastMsg && (
            <div className="flex justify-center sticky top-2 z-10 mb-2">
              <div className="bg-[#222]/90 backdrop-blur-md text-gray-200 px-5 py-2 rounded-full text-sm shadow-xl border border-white/10">{toastMsg}</div>
            </div>
          )}
          {!messageHook.loading && messageHook.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-600">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center"><Mic size={28} /></div>
              <p className="text-sm">No messages yet. Say hi! 👋</p>
            </div>
          )}

          {messageHook.messages.map((msg, idx) => {
            // FIX #1: isMe uses the currentUserId passed into useMessages
            const isMe        = msg.senderId === currentUserId;
            const isDeleted   = !!msg.deletedAt;
            const showMenu    = activeMenuMsgId === msg.id;
            const isOptimistic = msg.id.startsWith("optimistic_");
            const prevMsg     = idx > 0 ? messageHook.messages[idx - 1] : null;
            const isSameSender = prevMsg?.senderId === msg.senderId;
            const replyMsg    = msg.replyToId ? messageHook.messages.find(m => m.id === msg.replyToId) : null;

            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} ${isSameSender ? "mt-0.5" : "mt-3"}`}>
                {/* Avatar for other users in group chats */}
                {!isMe && activeChat.type === "group" && !isSameSender && (
                  <ChatAvatar src={null} name={msg.senderId} size="w-7 h-7" className="mr-2 mt-1 self-end flex-shrink-0" />
                )}
                {!isMe && activeChat.type === "group" && isSameSender && <div className="w-7 mr-2 flex-shrink-0" />}

                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[72%] relative`}>
                  {/* Reply preview */}
                  {replyMsg && !isDeleted && (
                    <div className={`text-xs px-3 py-1.5 rounded-t-lg mb-[-6px] max-w-full truncate border-l-2 ${isMe ? "bg-[#c01854] text-pink-200 border-pink-300 self-end" : "bg-[#2a2a2a] text-gray-300 border-gray-500 self-start"}`}>
                      <span className="font-medium">{replyMsg.senderId === currentUserId ? "You" : replyMsg.senderId}</span>
                      <span className="ml-1 opacity-80">{replyMsg.content.slice(0, 50)}</span>
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    onClick={e => { e.stopPropagation(); if (!isDeleted) setActiveMenuMsgId(showMenu ? null : msg.id); }}
                    className={`px-4 py-2 text-[14.5px] leading-relaxed cursor-pointer select-none relative ${isOptimistic ? "opacity-70" : "opacity-100"} ${
                      isDeleted        ? "bg-[#1a1a1a] text-gray-500 italic rounded-2xl text-sm"
                      : isMe           ? "bg-[#e91e63] text-white rounded-2xl rounded-br-sm"
                                       : "bg-[#262626] text-white rounded-2xl rounded-bl-sm"
                    }`}
                  >
                    {isDeleted ? "This message was deleted." : msg.content}
                    {!isDeleted && (
                      <span className={`inline-flex items-center gap-1 ml-2 float-right mt-1 ${isMe ? "text-pink-200/70" : "text-gray-500"} text-[10px] leading-none`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {/* FIX #3: ticks only shown for my own messages */}
                        {isMe && <MessageTicks isRead={msg.isRead} isOptimistic={isOptimistic} />}
                      </span>
                    )}
                  </div>

                  {/* Message action menu */}
                  {showMenu && !isDeleted && (
                    <div className={`absolute z-50 top-0 w-56 bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${isMe ? "right-full mr-2" : "left-full ml-2"}`} onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-around px-3 py-2.5 border-b border-white/5 bg-[#252525]">
                        {EMOJIS.map(emoji => <button key={emoji} onClick={() => setActiveMenuMsgId(null)} className="text-xl hover:scale-125 active:scale-110 transition-transform">{emoji}</button>)}
                      </div>
                      <button onClick={() => { setReplyingTo(msg); setActiveMenuMsgId(null); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-gray-200 transition-colors"><Reply size={15} className="text-gray-400" /> Reply</button>
                      {isMe && (
                        <>
                          <button onClick={() => { setEditingMsg(msg); setMessageInput(msg.content); setActiveMenuMsgId(null); setTimeout(() => inputRef.current?.focus(), 50); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-gray-200 transition-colors"><Edit2 size={15} className="text-gray-400" /> Edit</button>
                          <button onClick={() => { setDeletingMsgId(msg.id); setActiveMenuMsgId(null); }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 text-sm text-red-500 transition-colors"><Trash2 size={15} /> Delete</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="bg-[#0a0a0a] border-t border-white/5 px-4 pb-4 pt-2 z-20">
          {(replyingTo || editingMsg) && (
            <div className="flex items-center justify-between bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 mb-2">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#e91e63]">{editingMsg ? "Editing message" : "Replying to message"}</span>
                <span className="text-xs text-gray-400 truncate">{editingMsg ? editingMsg.content : replyingTo?.content}</span>
              </div>
              <button onClick={() => { setReplyingTo(null); setEditingMsg(null); setMessageInput(""); }} className="ml-3 p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition flex-shrink-0"><X size={13} /></button>
            </div>
          )}
          <div className="flex items-center gap-3 bg-[#1a1a1a] rounded-full px-4 py-3 border border-white/10">
            <input ref={inputRef} type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} placeholder={editingMsg ? "Edit your message..." : "Message…"} className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm" onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
            {messageInput.trim()
              ? <button onClick={handleSend} disabled={messageHook.sending} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#e91e63] hover:bg-pink-600 transition disabled:opacity-50 flex-shrink-0">
                  {messageHook.sending ? <Loader2 size={16} className="animate-spin text-white" /> : <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth={2.5}><path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" /></svg>}
                </button>
              : <button className="text-gray-400 hover:text-white transition"><Mic size={20} /></button>
            }
          </div>
        </div>

        {/* Delete confirmation */}
        {deletingMsgId && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
            <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-sm border border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Delete message?</h3>
                <button onClick={() => setDeletingMsgId(null)} className="p-1 hover:bg-white/10 rounded-full transition"><X size={20} className="text-gray-400" /></button>
              </div>
              <p className="text-gray-400 text-sm mb-6">This will delete the message for everyone. This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeletingMsgId(null)} className="px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/10 transition">Cancel</button>
                <button onClick={confirmDelete} className="px-5 py-2.5 rounded-full text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition shadow-lg shadow-red-600/20">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // VIEW: MAIN LIST
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden font-sans flex flex-col">
      <div className="max-w-2xl mx-auto w-full relative z-10 flex flex-col h-screen">

        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded bg-[#1a1a1a] border border-white/5 hover:bg-white/10 transition"><ChevronLeft size={22} /></button>
            <h1 className="text-2xl font-bold tracking-wide">Messages</h1>
          </div>
          <div className="flex items-center gap-2">
            {dmCreating && <Spinner />}
            <div className="relative" ref={menuRef}>
              <button onClick={() => setShowAddMenu(!showAddMenu)} className="w-10 h-10 flex items-center justify-center rounded bg-gradient-to-br from-pink-500 to-orange-500 hover:opacity-90 transition shadow-lg shadow-pink-500/20"><Plus size={22} /></button>
              {showAddMenu && (
                <div className="absolute right-0 top-full mt-3 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-1">
                  <button onClick={() => { setShowAddMenu(false); setShowUserPicker(true); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm font-medium text-gray-200 transition-colors"><UserPlus size={18} className="text-gray-400" /> New chat</button>
                  <button onClick={() => { setShowAddMenu(false); setView("create_group"); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-sm font-medium text-gray-200 transition-colors"><Users size={18} className="text-gray-400" /> Create group</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 mb-4">
          <div className="flex items-center gap-3 bg-[#151515] rounded-xl px-4 py-3 border border-white/5 focus-within:border-pink-500/50 transition">
            <Search size={18} className="text-gray-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chats & groups..." className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-500" />
            {search && <button onClick={() => setSearch("")}><X size={16} className="text-gray-500" /></button>}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 mb-4">
          {(["My Chats", "Discover Groups", "Communities"] as TabType[]).map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-sm font-bold transition-colors ${i === 1 ? "border-x border-black" : ""} ${activeTab === tab ? "bg-[#e91e63] text-white" : "bg-[#1a1a1a] text-gray-400 hover:bg-[#222]"}`}>{tab}</button>
          ))}
        </div>

        {/* Lists */}
        <div className="flex-1 overflow-y-auto px-4 pb-20 flex flex-col gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

          {/* MY CHATS */}
          {activeTab === "My Chats" && (
            <>
              {chatHook.error && <ErrorBanner message={chatHook.error} onRetry={chatHook.refresh} />}
              {chatHook.loading && chatHook.chats.length === 0 && <>{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</>}
              {filterBySearch(chatHook.chats).map(chat => {
                // FIX #2: always resolve the display name before rendering
                const displayName = resolveChatName(chat, currentUserId);
                return (
                  <div key={chat.id} onClick={() => openChat(chat)} className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 cursor-pointer hover:bg-white/5 active:bg-white/10 transition-colors">
                    <div className="relative flex-shrink-0">
                      <ChatAvatar src={chat.avatarUrl} name={displayName} size="w-14 h-14" />
                      {chat.isOnline && <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h2 className="text-white font-bold text-[15px] truncate flex items-center gap-1.5">
                          {displayName}
                          {chat.isVerified && <BadgeCheck size={15} className="text-blue-500 flex-shrink-0" />}
                        </h2>
                        <span className="text-[11px] text-gray-500 whitespace-nowrap ml-2 flex-shrink-0">{chat.lastMessageAt ? timeAgo(chat.lastMessageAt) : ""}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400 truncate pr-3">{chat.lastMessageContent || "Tap to chat"}</p>
                        {chat.unreadCount > 0 && (
                          <div className="bg-[#e91e63] text-white text-[10px] font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/20 flex-shrink-0">
                            {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {chatHook.hasMore && <button onClick={chatHook.loadMore} disabled={chatHook.loading} className="text-xs text-gray-500 hover:text-gray-300 text-center py-3 flex items-center justify-center gap-2">{chatHook.loading ? <Spinner /> : "Load more chats"}</button>}
              {!chatHook.loading && chatHook.chats.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-600">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center"><Users size={28} /></div>
                  <p className="text-sm">No chats yet. Start a conversation!</p>
                  <button onClick={() => setShowUserPicker(true)} className="px-4 py-2 rounded-full bg-[#e91e63]/10 border border-[#e91e63]/30 text-[#e91e63] text-sm font-medium hover:bg-[#e91e63]/20 transition">New Chat</button>
                </div>
              )}
            </>
          )}

          {/* DISCOVER GROUPS */}
          {activeTab === "Discover Groups" && (
            <>
              {groupHook.error && <ErrorBanner message={groupHook.error} onRetry={groupHook.refresh} />}
              {groupHook.loading && groupHook.groups.length === 0 && <>{[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}</>}
              {filterBySearch(groupHook.groups).map(group => (
                <div key={group.id} onClick={() => openGroupDetail(group)} className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                  <div className="w-14 h-14 rounded-lg bg-[#2a1a1f] border border-pink-500/10 flex items-center justify-center flex-shrink-0"><Users size={24} className="text-[#e91e63]" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-white font-bold text-[15px] truncate pr-2">{group.name}</h2>
                      {group.isTrending && <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-[#e91e63] text-[10px] font-bold uppercase tracking-wider flex-shrink-0"><TrendingUp size={10} /> Trending</div>}
                    </div>
                    <p className="text-sm text-gray-400 truncate mb-1.5">{group.description || "Join the conversation"}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                      <PrivacyBadge privacy={group.privacy} />
                      <span className="flex items-center gap-1"><Users size={11} /> {group.memberCount.toLocaleString()}</span>
                      <span>· {timeAgo(group.lastActivityAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {groupHook.hasMore && <button onClick={groupHook.loadMore} disabled={groupHook.loading} className="text-xs text-gray-500 hover:text-gray-300 text-center py-3 flex items-center justify-center gap-2">{groupHook.loading ? <Spinner /> : "Load more groups"}</button>}
              {!groupHook.loading && groupHook.groups.length === 0 && <p className="text-gray-500 text-center mt-10 text-sm">No groups found.</p>}
            </>
          )}

          {/* COMMUNITIES */}
          {activeTab === "Communities" && (
            <>
              {communityHook.error && <ErrorBanner message={communityHook.error} />}
              {communityHook.loading && communityHook.communities.length === 0 && <>{[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}</>}
              {filterBySearch(communityHook.communities).map((community: Community) => (
                <div key={community.id} className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                  <div className="w-14 h-14 rounded-lg bg-[#1a1c2a] border border-blue-500/10 flex items-center justify-center flex-shrink-0"><Users size={24} className="text-blue-400" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-white font-bold text-[15px] truncate">{community.name}</h2>
                      {community.isVerified && <BadgeCheck size={15} className="text-blue-500 flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-gray-400 truncate mb-1.5">{community.description || "A community"}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Users size={11} /> {community.memberCount.toLocaleString()} members</span>
                      <span>· {community.groupCount} groups</span>
                    </div>
                  </div>
                </div>
              ))}
              {communityHook.hasMore && <button onClick={communityHook.loadMore} disabled={communityHook.loading} className="text-xs text-gray-500 hover:text-gray-300 text-center py-3 flex items-center justify-center gap-2">{communityHook.loading ? <Spinner /> : "Load more communities"}</button>}
              {!communityHook.loading && communityHook.communities.length === 0 && <p className="text-gray-500 text-center mt-10 text-sm">No communities yet.</p>}
            </>
          )}
        </div>
      </div>

      {/* User Picker — rendered on the list view */}
      <UserPickerSheet open={showUserPicker} onClose={() => setShowUserPicker(false)} onPickUser={handlePickUser} />
    </div>
  );
}