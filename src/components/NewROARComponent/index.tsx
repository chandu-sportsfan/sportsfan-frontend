
// //chandu's code

// /**
//  * ROAR — Root component
//  * Thin orchestrator: state management + navigation only.
//  */
// // NewROARComponent/index.tsx
// import { useState, useEffect, useRef, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useSearchParams } from "next/navigation";
// import axios from "axios";

// import { GLOBAL_CSS } from "./constants/styles";
// import { NOTIFICATIONS_DATA } from "./constants";
// import { Toast, BottomNav } from "./components/shared";
// import ComposeModal from "./components/ComposeModal";
// import CreateFlashQuizModal from "./components/CreateFlashQuizModal";
// import PostDetailsOverlay from "./components/PostDetailsOverlay";
// import Onboarding from "./screens/Onboarding";
// import HomeFeed from "./screens/HomeFeed";
// import DiscussionRoom from "./screens/DiscussionRoom";
// import Notifications from "./screens/Notifications";
// import Leaderboard from "./screens/Leaderboard";
// import Profile from "./screens/Profile";
// import type { Notification, Room } from "./types";
// import { useRoarNotifications } from "@/context/RoarNotificationsContext";
// import RoomPostDetailsOverlay from "./components/RoomPostDetailsOverlay";


// export default function ROARApp() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const searchParams = useSearchParams();
//   const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
//   const roomRefreshRef = useRef<(() => void) | null>(null);
//   const roomReplyUpdateRef = useRef<((postId: string, count: number) => void) | null>(null);
//   // ── Bootstrap ──────────────────────────────────────────────────────────────
//   const [mounted, setMounted] = useState(false);
//   const [checkingProfile, setCheckingProfile] = useState(true);
//   const [onboarded, setOnboarded] = useState(false);
//   const [userBadge, setUserBadge] = useState("RISING_FAN");
//   const [userSports, setUserSports] = useState<string[]>([]);
//   const [currentUsername, setCurrentUsername] = useState("RoarUser");
//   const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | undefined>();

//   useEffect(() => {
//     setMounted(true);
//     const checkProfile = async () => {
//       try {
//         const res = await axios.get("/api/roar/profile");
//         if (res.data?.success) {
//           setOnboarded(true);
//           setUserBadge(res.data.user.badge || "RISING_FAN");
//           setUserSports(res.data.user.sports ?? []);
//           setCurrentUsername(res.data.user.username || "RoarUser");
//           setCurrentAvatarUrl(res.data.user.avatarUrl || undefined);
//           try {
//             localStorage.setItem("roar_v2_complete", "1");
//             localStorage.setItem("roar_badge", res.data.user.badge || "RISING_FAN");
//             localStorage.setItem("roar_username", res.data.user.username || "RoarUser");
//             if (res.data.user.avatarUrl) localStorage.setItem("roar_avatar_url", res.data.user.avatarUrl);
//           } catch { }
//         } else {
//           setOnboarded(false);
//         }
//       } catch (err: any) {
//         const status = err.response?.status;
//         if (status === 404 || status === 401) {
//           setOnboarded(false);
//         } else {
//           let hasLocal = false;
//           let badge = "RISING_FAN";
//           try {
//             hasLocal = !!localStorage.getItem("roar_v2_complete");
//             badge = localStorage.getItem("roar_badge") || "RISING_FAN";
//           } catch { }
//           setOnboarded(hasLocal);
//           setUserBadge(badge);
//         }
//       } finally {
//         setCheckingProfile(false);
//       }
//     };
//     checkProfile();
//   }, []);

//   // ── Navigation state ───────────────────────────────────────────────────────
//   const [activeTab, setActiveTab] = useState("home");
//   const [overlay, setOverlay] = useState<string | null>(null);
//   const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
//   const [selectedPost, setSelectedPost] = useState<any | null>(null);

//   // ── Compose ────────────────────────────────────────────────────────────────
//   const [composeOpen, setComposeOpen] = useState(false);
//   const [composeType, setComposeType] = useState<string | null>(null);
//   const [quizOpen, setQuizOpen] = useState(false);

//   const openCompose = (type: string | null = null) => {
//     if (type === "quiz") {
//       setQuizOpen(true);
//       return;
//     }
//     setComposeType(type);
//     setComposeOpen(true);
//   };

//   // ── Toast ──────────────────────────────────────────────────────────────────
//   const [toast, setToast] = useState({ visible: false, message: "" });

//   const showToast = useCallback((msg: string) => {
//     setToast({ visible: true, message: msg });
//     setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3200);
//     setTimeout(() => setToast({ visible: false, message: "" }), 3700);
//   }, []);

//   // ── Notifications ──────────────────────────────────────────────────────────
//   const {
//     roarNotifications: notifications,
//     setRoarNotifications: setNotifications,
//     markRoarRead,
//     markAllRoarRead,
//   } = useRoarNotifications();

//   const [notifSeeded, setNotifSeeded] = useState(false);
//   useEffect(() => {
//     if (!notifSeeded) {
//       setNotifications(NOTIFICATIONS_DATA.map((n) => ({ ...n })));
//       setNotifSeeded(true);
//     }
//   }, [notifSeeded, setNotifications]);

//   // ── Remote data ────────────────────────────────────────────────────────────
//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [dbPosts, setDbPosts] = useState<any[]>([]);
//   const [showBanner, setShowBanner] = useState(true);

//   const fetchPosts = useCallback(async () => {
//     try {
//       const res = await axios.get(`/api/roar/posts?t=${Date.now()}`);
//       if (res.data?.success) setDbPosts(res.data.posts);
//     } catch (err) {
//       console.error("Failed to fetch posts:", err);
//     }
//   }, []);

//   useEffect(() => {
//     const postId = searchParams.get("postId");
//     if (!postId || !onboarded || dbPosts.length === 0) return;
//     const target = dbPosts.find((p) => p.postId === postId || p.id === postId);
//     if (target) {
//       setSelectedPost(target);
//       window.history.replaceState(null, "", window.location.pathname);
//     }
//   }, [searchParams, onboarded, dbPosts]);

//   useEffect(() => {
//     if (!onboarded) return;

//     const fetchRooms = async () => {
//       try {
//         const res = await axios.get(`/api/roar/rooms?t=${Date.now()}`);
//         if (res.data?.success) {
//           setRooms(res.data.rooms);
//           setSelectedRoom((prev) => {
//             if (prev) return prev;
//             return res.data.rooms.length > 0 ? res.data.rooms[0] : null;
//           });
//         }
//       } catch (err) {
//         console.error("Failed to fetch rooms:", err);
//       }
//     };

//     const fetchUserSports = async () => {
//       try {
//         const res = await axios.get("/api/roar/profile");
//         if (res.data?.success) {
//           setUserSports(res.data.user.sports ?? []);
//           setUserBadge(res.data.user.badge || "RISING_FAN");
//           setCurrentAvatarUrl(res.data.user.avatarUrl || undefined);
//           try {
//             if (res.data.user.avatarUrl) localStorage.setItem("roar_avatar_url", res.data.user.avatarUrl);
//           } catch { }
//         }
//       } catch (err: any) {
//         if (err.response?.status === 404) {
//           setOnboarded(false);
//           try { localStorage.removeItem("roar_v2_complete"); } catch { }
//         }
//       }
//     };

//     fetchRooms();
//     fetchPosts();
//     fetchUserSports();

//     const interval = setInterval(() => {
//       fetchRooms();
//       fetchPosts();
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [onboarded, fetchPosts]); // eslint-disable-line react-hooks/exhaustive-deps

//   useEffect(() => {
//     const syncAvatar = (event?: Event) => {
//       const custom = event as CustomEvent<{ avatarUrl?: string }> | undefined;
//       const avatarFromEvent = custom?.detail?.avatarUrl;
//       try {
//         setCurrentAvatarUrl(avatarFromEvent || localStorage.getItem("roar_avatar_url") || undefined);
//       } catch {
//         setCurrentAvatarUrl(avatarFromEvent || undefined);
//       }
//     };
//     syncAvatar();
//     window.addEventListener("roar-profile-updated", syncAvatar);
//     return () => window.removeEventListener("roar-profile-updated", syncAvatar);
//   }, []);

//   // Sync notifications with live rooms
//   useEffect(() => {
//     if (!rooms.length) return;
//     setNotifications((prev) => {
//       const nonMatch = prev.filter((n) => n.type !== "MATCH_LIVE" && n.type !== "HEATING_UP");
//       const matchNotifs: Notification[] = [];
//       rooms.forEach((room) => {
//         if (!room.isActive) return;
//         const prevLive = prev.find((n) => n.id === `live-${room.roomId}`);
//         const prevHeat = prev.find((n) => n.id === `heat-${room.roomId}`);
//         matchNotifs.push({
//           id: `live-${room.roomId}`,
//           type: "MATCH_LIVE",
//           title: `MATCH LIVE: ${room.name}`,
//           subtitle: `Discussion room is open. ${room.fanCount || 0} fans already debating.`,
//           time: "Just now",
//           read: prevLive ? prevLive.read : false,
//           fan: null,
//           cta: null,
//         });
//         matchNotifs.push({
//           id: `heat-${room.roomId}`,
//           type: "HEATING_UP",
//           title: "This room is heating up 🔥",
//           subtitle: `${room.name} debate: ${room.fanCount || 0} fans live. Jump in.`,
//           time: "15m",
//           read: prevHeat ? prevHeat.read : false,
//           fan: null,
//           cta: null,
//         });
//       });
//       return [...matchNotifs, ...nonMatch];
//     });
//   }, [rooms]); // eslint-disable-line react-hooks/exhaustive-deps

//   // ── Actions ────────────────────────────────────────────────────────────────
//   const handleVote = useCallback(
//     async (postId: string, voteType: "agree" | "disagree" | null) => {
//       setDbPosts((prev) =>
//         prev.map((post) => {
//           if (post.id === postId || post._id === postId || post.postId === postId) {
//             const currentVote = post.userVote;
//             let agreeCount = post.agreeCount ?? 0;
//             let disagreeCount = post.disagreeCount ?? 0;
//             if (currentVote === "agree") agreeCount = Math.max(0, agreeCount - 1);
//             if (currentVote === "disagree") disagreeCount = Math.max(0, disagreeCount - 1);
//             if (voteType === "agree") agreeCount += 1;
//             if (voteType === "disagree") disagreeCount += 1;
//             return { ...post, userVote: voteType, agreeCount, disagreeCount };
//           }
//           return post;
//         })
//       );
//       // try {
//       //   await axios.post(`/api/roar/posts/${postId}/vote`, { vote: voteType });
//       // } catch (err) {
//       //   console.error("Failed to submit vote:", err);
//       //   await fetchPosts();
//       // }
//       try {
//         await axios.post(`/api/roar/posts/${postId}/vote`, { vote: voteType });
//       } catch (err: any) {
//         if (err.response?.status === 409) {
//           // Server says already voted — just sync, don't revert
//           await fetchPosts();
//           return;
//         }
//         console.error("Failed to submit vote:", err);
//         await fetchPosts();
//       }
//     },
//     [fetchPosts],
//   );

//   const handleLike = useCallback(
//     async (postId: string) => {
//       if (likingPosts.has(postId)) return;
//       setLikingPosts(prev => new Set(prev).add(postId));

//       setDbPosts((prev) =>
//         prev.map((post) => {
//           if (post.postId === postId || post._id === postId) {
//             const userLiked = post.userLiked ?? false;
//             return {
//               ...post,
//               userLiked: !userLiked,
//               likeCount: Math.max(0, (post.likeCount ?? 0) + (userLiked ? -1 : 1)),
//             };
//           }
//           return post;
//         })
//       );

//       try {
//         await axios.post(`/api/roar/posts/${postId}/like`);
//         fetchPosts();
//       } catch (err) {
//         console.error("Failed to submit like:", err);
//         setDbPosts((prev) =>
//           prev.map((post) => {
//             if (post.postId === postId || post._id === postId) {
//               const userLiked = post.userLiked ?? false;
//               return {
//                 ...post,
//                 userLiked: !userLiked,
//                 likeCount: Math.max(0, (post.likeCount ?? 0) + (userLiked ? 1 : -1)),
//               };
//             }
//             return post;
//           })
//         );
//         showToast("Failed to like post");
//       } finally {
//         setLikingPosts(prev => {
//           const newSet = new Set(prev);
//           newSet.delete(postId);
//           return newSet;
//         });
//       }
//     },
//     [showToast, likingPosts, fetchPosts],
//   );

//   const handleDeletePost = useCallback(
//     async (postId: string, roomId?: string) => {
//       try {
//         const url = roomId
//           ? `/api/roar/rooms/${roomId}/messages/${postId}`
//           : `/api/roar/posts/${postId}`;
//         const res = await axios.delete(url);
//         if (res.data?.success) {
//           showToast(roomId ? "Message deleted" : "Post deleted");
//           await fetchPosts();
//         } else {
//           showToast(roomId ? "Failed to delete message" : "Failed to delete post");
//         }
//       } catch (err) {
//         console.error("Failed to delete:", err);
//         showToast(roomId ? "Error deleting message" : "Error deleting post");
//       }
//     },
//     [fetchPosts, showToast],
//   );

//   const handlePost = useCallback(
//     async (payload: any) => {
//       try {
//         const postType = ["hot_take", "prediction", "debate", "raw_reactions", "post", "quiz"].includes(payload.type)
//           ? payload.type
//           : "hot_take";

//         let mediaUrls: string[] = [];
//         if (payload.mediaFiles && payload.mediaFiles.length > 0) {
//           showToast("Uploading media...");
//           const uploadPromises = payload.mediaFiles.map(async (file: File) => {
//             const formData = new FormData();
//             formData.append("file", file);
//             const uploadRes = await axios.post("/api/upload", formData, {
//               headers: { "Content-Type": "multipart/form-data" },
//             });
//             return uploadRes.data.url;
//           });
//           mediaUrls = await Promise.all(uploadPromises);
//         }
//         const ROOM_NATIVE_TYPES = ["post", "chat", "hot_take", "hottake", "prediction", "debate", "raw_reactions"];

//         const isRoomNative =
//           overlay === "room" &&
//           selectedRoom?.roomId &&
//           ROOM_NATIVE_TYPES.includes(postType) &&
//           !payload.quizQuestion;

//         let res;

//         if (isRoomNative) {
//           const msgTypeMap: Record<string, string> = {
//             prediction: "prediction",
//             hot_take: "hottake",
//             hottake: "hottake",
//             debate: "debate",
//             raw_reactions: "raw_reactions",
//             post: "post",
//             chat: "chat",
//           };
//           const msgType = msgTypeMap[postType] || "post";

//           // res = await axios.post(`/api/roar/rooms/${selectedRoom.roomId}/messages`, {
//           //   text: postType === "debate"
//           //     ? `${payload.sideA} VS ${payload.sideB}`
//           //     : payload.text,
//           //   type: msgType,
//           //   mediaUrls: payload.mediaUrls,
//           //   sideA: payload.sideA,
//           //   sideB: payload.sideB,
//           // });
//           res = await axios.post(`/api/roar/rooms/${selectedRoom.roomId}/messages`, {
//             text: payload.text,  // debate question — sides are sent separately
//             type: msgType,
//             mediaUrls: payload.mediaUrls,
//             sideA: payload.sideA,
//             sideB: payload.sideB,
//             memGifUrl: payload.gifUrl ?? undefined,   // ← ADD
//             memTag: payload.sf360Tag ?? undefined,
//           });
//           if (res.data?.success) {
//             showToast("Post is live in room!");
//           }
//         }
//         else {
//           res = await axios.post("/api/roar/posts", {
//             type: postType,
//             // text: postType === "quiz"
//             //   ? payload.quizQuestion
//             //   : postType === "debate"
//             //     ? `${payload.sideA} VS ${payload.sideB}`
//             //     : payload.text,
//             text: postType === "quiz"
//               ? payload.quizQuestion
//               : payload.text,
//             sport: payload.sport || "cricket",
//             audience: payload.audience,
//             mediaUrls,
//             ...(postType !== "quiz" && {
//               sideA: payload.sideA,
//               sideB: payload.sideB,
//               memCtx: payload.memCtx,
//               matchId: payload.match,
//               confidence: payload.confidence,
//             }),
//             ...(postType === "quiz" && {
//               quizQuestion: payload.quizQuestion,
//               quizOptions: payload.quizOptions,
//               quizCorrectOption: payload.quizCorrectOption,
//               quizTimer: payload.quizTimer,
//               quizPoints: payload.quizPoints,
//             }),
//             ...(postType === "raw_reactions" && {
//               memGifUrl: payload.gifUrl,
//               memTag: payload.sf360Tag,
//             }),
//           });

//           if (res.data?.success) {
//             const toastMap: Record<string, string> = {
//               hot_take: "🔥 Hot Take is live · 47 fans may see it",
//               prediction: "📊 Prediction posted · Let's see if you're right",
//               debate: "⚡ Debate started · Get the fans talking",
//               raw_reactions: "🎭 Raw Reaction shared · OG fans will feel this",
//               post: "✏️ Post is live · Fans can see it now",
//               quiz: "🧠 Flash Quiz launched · Let the fans answer!",
//             };
//             showToast(toastMap[postType] || "🔥 Your take is live");
//             fetchPosts();
//           }
//         }
//       } catch (err) {
//         console.error("Failed to post:", err);
//         showToast("Failed to create post");
//       }
//       setShowBanner(false);
//     },
//     [showToast, fetchPosts, overlay, selectedRoom],
//   );

//   const handleTab = (tab: string) => {
//     setOverlay(null);
//     if (tab === "discuss") { setOverlay("room"); return; }
//     setActiveTab(tab);
//   };

//   const handleRoomBack = useCallback(() => {
//     setOverlay(null);
//     setActiveTab("home");
//   }, []);

//   const completeOnboarding = useCallback(async (prefs: any) => {
//     const username = prefs.username || "RoarUser";
//     const badge = prefs.badge || "RISING_FAN";
//     setUserSports(prefs.sports ?? []);
//     setUserBadge(badge);
//     setCurrentUsername(username);
//     setOnboarded(true);
//     try {
//       localStorage.setItem("roar_v2_complete", "1");
//       localStorage.setItem("roar_badge", badge);
//       localStorage.setItem("roar_username", username);
//     } catch (err) {
//       console.error("Failed to persist onboarding data to localStorage:", err);
//     }
//   }, []);

//   // ── Derived ────────────────────────────────────────────────────────────────
//   const unreadCount = notifications.filter((n) => !n.read).length;
//   const isRoom = overlay === "room";
//   const isLB = overlay === "leaderboard";

//   // ── Loading spinner ────────────────────────────────────────────────────────
//   if (!mounted || checkingProfile) {
//     return (
//       <div
//         className="roar-root"
//         style={{ minHeight: "600px", height: "100%", background: "#050508", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderRadius: "24px", border: "1px solid #252538" }}
//       >
//         <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
//         <div style={{ textAlign: "center", zIndex: 10 }}>
//           <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #E91E8C", borderRadius: "50%", animation: "roar-spin 1s linear infinite", margin: "0 auto 16px" }} />
//           <style dangerouslySetInnerHTML={{ __html: `@keyframes roar-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }` }} />
//           <div style={{ color: "#9494AD", fontSize: "14px", fontFamily: "sans-serif", fontWeight: 500 }}>Loading ROAR...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`roar-root${isRoom ? " roar-room-active" : ""}`}>
//       <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

//       <div className="roar-inner" ref={containerRef} style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
//         {/* Ambient background */}
//         <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 90% 55% at 50% -15%,rgba(233,30,140,0.18),transparent 55%),radial-gradient(ellipse 70% 45% at 100% 80%,rgba(255,107,53,0.12),transparent 50%),radial-gradient(ellipse 50% 40% at 0% 60%,rgba(0,232,198,0.08),transparent 45%),var(--bg-primary)" }} />

//         {/* Floating sparks */}
//         <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
//           {[
//             { left: "12%", color: "var(--accent-magenta)", size: 3, duration: "14s", delay: "0s" },
//             { left: "28%", color: "var(--accent-orange)", size: 4, duration: "18s", delay: "2s" },
//             { left: "50%", color: "var(--teal)", size: 3, duration: "15s", delay: "5s" },
//             { left: "72%", color: "var(--accent-magenta)", size: 4, duration: "20s", delay: "1s" },
//             { left: "88%", color: "var(--accent-yellow)", size: 3, duration: "16s", delay: "7s" },
//           ].map(({ left, color, size, duration, delay }) => (
//             <div
//               key={left}
//               style={{ position: "absolute", bottom: -10, left, width: size, height: size, borderRadius: "50%", background: color, animation: `roar-driftUp ${duration} linear infinite ${delay}` }}
//             />
//           ))}
//         </div>

//         {/* ROAR watermark */}
//         <div style={{ position: "absolute", bottom: 88, right: 0, left: 0, textAlign: "right", paddingRight: 12, fontFamily: "'Bebas Neue',sans-serif", fontSize: 72, color: "white", opacity: 0.04, pointerEvents: "none", zIndex: 0, letterSpacing: "0.1em" }}>ROAR</div>

//         {/* Toast */}
//         <Toast message={toast.message} visible={toast.visible} />

//         {/* Onboarding */}
//         {!onboarded && <Onboarding onComplete={completeOnboarding} />}

//         {/* Main content */}
//         {onboarded && (
//           <div style={{ position: "relative", zIndex: 1, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
//             <AnimatePresence mode="wait">
//               {isLB ? (
//                 <motion.div
//                   key="lb"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.18 }}
//                   style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
//                 >
//                   <Leaderboard onBack={() => setOverlay(null)} onCompose={() => openCompose("prediction")} />
//                 </motion.div>
//               ) : isRoom ? (
//                 <motion.div
//                   key="room"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.18 }}
//                   style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
//                 >
//                   <style dangerouslySetInnerHTML={{ __html: `#global-header-desktop, #global-header-tablet, #global-header-mobile { display: none !important; }` }} />
//                   <DiscussionRoom
//                     roomId={selectedRoom?.roomId}
//                     roomName={selectedRoom?.name}
//                     fanCount={selectedRoom?.fanCount}
//                     score={selectedRoom?.score}
//                     scoreSubtitle={selectedRoom?.scoreSubtitle}
//                     onBack={handleRoomBack}
//                     onToast={showToast}
//                     onPostClick={(post) => setSelectedPost(post)}
//                     onCompose={(type) => openCompose(type)}
//                     currentAvatarUrl={currentAvatarUrl}
//                     onRegisterRefresh={(fn) => { roomRefreshRef.current = fn; }}
//                     onRegisterReplyUpdate={(fn) => { roomReplyUpdateRef.current = fn; }}
//                   />
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   key={activeTab}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.18 }}
//                   style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
//                 >
//                   {activeTab === "home" && (
//                     <HomeFeed
//                       onJoinRoom={(room) => { if (room) setSelectedRoom(room); else if (rooms.length) setSelectedRoom(rooms[0]); setOverlay("room"); }}
//                       onLeaderboard={() => setOverlay("leaderboard")}
//                       onFanProfile={() => setActiveTab("profile")}
//                       onToast={showToast}
//                       extraItems={[]}
//                       showBanner={showBanner}
//                       onDismissBanner={() => setShowBanner(false)}
//                       userBadge={userBadge}
//                       rooms={rooms}
//                       dbPosts={dbPosts}
//                       onPostClick={(post) => setSelectedPost(post)}
//                       onVote={handleVote}
//                       onLike={handleLike}
//                       onDeletePost={handleDeletePost}
//                       userSports={userSports}
//                       onQuickCompose={(t) => openCompose(t)}
//                       currentUsername={currentUsername}
//                       currentAvatarUrl={currentAvatarUrl}
//                     />
//                   )}
//                   {activeTab === "profile" && (
//                     <Profile
//                       userBadge={userBadge}
//                       setUserBadge={setUserBadge}
//                       onCompose={() => openCompose("prediction")}
//                       onToast={showToast}
//                       setOnboarded={setOnboarded}
//                       onNavigateTab={handleTab}
//                     />
//                   )}
//                   {activeTab === "alerts" && (
//                     <Notifications
//                       notifications={notifications}
//                       onMarkRead={(id) => markRoarRead(id)}
//                       onMarkAllRead={markAllRoarRead}
//                       onCompose={() => openCompose()}
//                       onJoinRoom={(room) => { if (room) setSelectedRoom(room); else if (rooms.length) setSelectedRoom(rooms[0]); setOverlay("room"); }}
//                       onNavigateTab={handleTab}
//                       rooms={rooms}
//                     />
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* PostDetailsOverlay lives INSIDE the main content div so it sits
//                 within roar-inner's bounds — the app header and sidebar remain
//                 visible outside this container on desktop. position:absolute
//                 fills roar-inner exactly with no JS measurement needed. */}
//             {/* {onboarded && selectedPost && (
//               <PostDetailsOverlay
//                 post={selectedPost}
//                 // onClose={() => setSelectedPost(null)}
//                 onClose={(updatedReplyCount?: number) => {
//                   if (selectedPost && updatedReplyCount !== undefined && overlay === "room") {
//                     roomReplyUpdateRef.current?.(selectedPost.id, updatedReplyCount);
//                   }
//                   setSelectedPost(null);
//                   roomRefreshRef.current?.();
//                 }}
//                 onToast={showToast}
//                 onVote={handleVote}
//                 onDeletePost={handleDeletePost}
//                 currentUsername={currentUsername}
//                 currentAvatarUrl={currentAvatarUrl}

//               />
//             )} */}
//             {onboarded && selectedPost && (
//               overlay === "room" ? (
//                 <RoomPostDetailsOverlay
//                   post={selectedPost}
//                   onClose={(count?) => {
//                     if (selectedPost && count !== undefined) roomReplyUpdateRef.current?.(selectedPost.id, count);
//                     setSelectedPost(null);
//                     roomRefreshRef.current?.();
//                   }}
//                   onToast={showToast}
//                   onVote={handleVote}
//                   onDeletePost={handleDeletePost}
//                   currentUsername={currentUsername}
//                   currentAvatarUrl={currentAvatarUrl}
//                 />
//               ) : (
//                 <PostDetailsOverlay
//                   post={selectedPost}
//                   onClose={(count?) => { setSelectedPost(null); }}
//                   onToast={showToast}
//                   onVote={handleVote}
//                   onDeletePost={handleDeletePost}
//                   currentUsername={currentUsername}
//                   currentAvatarUrl={currentAvatarUrl}
//                 />
//               )
//             )}
//           </div>
//         )}
//       </div>

//       {/* ── Modals live OUTSIDE roar-inner so overflow:hidden never clips them ── */}

//       {/* Standard compose modal (hot take, prediction, debate, memory, post) */}
//       {onboarded && (
//         <ComposeModal
//           open={composeOpen}
//           onClose={() => { setComposeOpen(false); setComposeType(null); }}
//           onPost={handlePost}
//           initialType={composeType}
//           onOpenQuiz={() => { setComposeOpen(false); setComposeType(null); setQuizOpen(true); }}
//         />
//       )}

//       {/* Flash Quiz dedicated modal */}
//       {onboarded && (
//         <CreateFlashQuizModal
//           open={quizOpen}
//           onClose={() => setQuizOpen(false)}
//           onPost={handlePost}
//         />
//       )}
//     </div>
//   );
// }







//chandu's code

/**
 * ROAR — Root component
 * Thin orchestrator: state management + navigation only.
 */

// NewROARComponent/index.tsx
// Home tab now shows RoomsHome (rooms list).
// Entering a room shows DiscussionRoom with icon-pill composer.

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { emitSxpActivityRefresh } from "@/lib/sxpEvents";

import { GLOBAL_CSS } from "./constants/styles";
import { NOTIFICATIONS_DATA } from "./constants";
import { Toast } from "./components/shared";
import ComposeModal from "./components/ComposeModal";
import CreateFlashQuizModal from "./components/CreateFlashQuizModal";
import PostDetailsOverlay from "./components/PostDetailsOverlay";
import Onboarding from "./screens/Onboarding";
import RoomsHome from "./screens/RoomsHome";
import HomeFeed from "./screens/HomeFeed";             // SF360 Infinity Room = posts feed
import DiscussionRoom from "./screens/DiscussionRoom";
import Notifications from "./screens/Notifications";
import Leaderboard from "./screens/Leaderboard";
import Profile from "./screens/Profile";
import type { Notification, Room } from "./types";
import { useRoarNotifications } from "@/context/RoarNotificationsContext";
import { RoarProfileProvider, useRoarProfileContext } from "@/context/RoarProfileContext";
import RoomPostDetailsOverlay from "./components/RoomPostDetailsOverlay";

export default function ROARApp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
  const roomRefreshRef = useRef<(() => void) | null>(null);
  const roomReplyUpdateRef = useRef<((postId: string, count: number) => void) | null>(null);

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  const [mounted, setMounted]             = useState(false);
  const [checkingProfile, setChecking]    = useState(true);
  const [onboarded, setOnboarded]         = useState(false);
  const [userBadge, setUserBadge]         = useState("RISING_FAN");
  const [userSports, setUserSports]       = useState<string[]>([]);
  const [currentUsername, setCurrentUsername] = useState("RoarUser");
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | undefined>();

  useEffect(() => {
    setMounted(true);
    const checkProfile = async () => {
      try {
        const res = await axios.get("/api/roar/profile");
        if (res.data?.success) {
          setOnboarded(true);
          setUserBadge(res.data.user.badge || "RISING_FAN");
          setUserSports(res.data.user.sports ?? []);
          setCurrentUsername(res.data.user.username || "RoarUser");
          setCurrentAvatarUrl(res.data.user.avatarUrl || undefined);
          try {
            localStorage.setItem("roar_v2_complete", "1");
            localStorage.setItem("roar_badge",    res.data.user.badge    || "RISING_FAN");
            localStorage.setItem("roar_username", res.data.user.username || "RoarUser");
            if (res.data.user.avatarUrl) localStorage.setItem("roar_avatar_url", res.data.user.avatarUrl);
          } catch {}
        } else { setOnboarded(false); }
      } catch (err: any) {
        const status = err.response?.status;
        if (status === 404 || status === 401) { setOnboarded(false); }
        else {
          let hasLocal = false; let badge = "RISING_FAN";
          try { hasLocal = !!localStorage.getItem("roar_v2_complete"); badge = localStorage.getItem("roar_badge") || "RISING_FAN"; } catch {}
          setOnboarded(hasLocal); setUserBadge(badge);
        }
      } finally { setChecking(false); }
    };
    checkProfile();
  }, []);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]       = useState("home");
  const [overlay, setOverlay]           = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const { viewingUsername, profileData, openProfile, closeProfile } = useRoarProfileContext();

  const handleFanProfileClick = useCallback((fan: any) => {
    if (fan.username === currentUsername) {
      setActiveTab("profile");
      setOverlay(null);
      setSelectedPost(null);
    } else {
      openProfile(fan.username);
    }
  }, [currentUsername, openProfile]);

  // ── Compose ────────────────────────────────────────────────────────────────
  const [composeOpen, setComposeOpen]   = useState(false);
  const [composeType, setComposeType]   = useState<string | null>(null);
  const [quizOpen, setQuizOpen]         = useState(false);

  const openCompose = (type: string | null = null) => {
    if (type === "quiz") { setQuizOpen(true); return; }
    setComposeType(type); setComposeOpen(true);
  };

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState({ visible: false, message: "" });
  const showToast = useCallback((msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3200);
    setTimeout(() => setToast({ visible: false, message: "" }), 3700);
  }, []);

  // ── Notifications ──────────────────────────────────────────────────────────
  const { roarNotifications: notifications, setRoarNotifications: setNotifications, markRoarRead, markAllRoarRead } = useRoarNotifications();
  const [notifSeeded, setNotifSeeded] = useState(false);
  useEffect(() => {
    if (!notifSeeded) { setNotifications(NOTIFICATIONS_DATA.map(n => ({ ...n }))); setNotifSeeded(true); }
  }, [notifSeeded, setNotifications]);

  // ── Remote data ────────────────────────────────────────────────────────────
  const [rooms, setRooms]     = useState<Room[]>([]);
  const [dbPosts, setDbPosts] = useState<any[]>([]);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get(`/api/roar/posts?t=${Date.now()}`);
      if (res.data?.success) setDbPosts(res.data.posts);
    } catch (err) { console.error("Failed to fetch posts:", err); }
  }, []);

  useEffect(() => {
    const postId = searchParams.get("postId");
    if (!postId || !onboarded || dbPosts.length === 0) return;
    const target = dbPosts.find(p => p.postId === postId || p.id === postId);
    if (target) { setSelectedPost(target); window.history.replaceState(null, "", window.location.pathname); }
  }, [searchParams, onboarded, dbPosts]);

  useEffect(() => {
    if (!onboarded) return;

    const fetchRooms = async () => {
      try {
        const res = await axios.get(`/api/roar/rooms?t=${Date.now()}`);
        console.log("rooms res:", res);
        if (res.data?.success) {
          setRooms(res.data.rooms);
          setSelectedRoom(prev => {
            if (prev) return prev;
            return res.data.rooms.length > 0 ? res.data.rooms[0] : null;
          });
        }
      } catch (err) { console.error("Failed to fetch rooms:", err); }
    };

    const fetchUserSports = async () => {
      try {
        const res = await axios.get("/api/roar/profile");
        if (res.data?.success) {
          setUserSports(res.data.user.sports ?? []);
          setUserBadge(res.data.user.badge || "RISING_FAN");
          setCurrentAvatarUrl(res.data.user.avatarUrl || undefined);
          try { if (res.data.user.avatarUrl) localStorage.setItem("roar_avatar_url", res.data.user.avatarUrl); } catch {}
        }
      } catch (err: any) {
        if (err.response?.status === 404) { setOnboarded(false); try { localStorage.removeItem("roar_v2_complete"); } catch {} }
      }
    };

    fetchRooms(); fetchPosts(); fetchUserSports();
    const interval = setInterval(() => { fetchRooms(); fetchPosts(); }, 5000);
    return () => clearInterval(interval);
  }, [onboarded, fetchPosts]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const syncAvatar = (event?: Event) => {
      const custom = event as CustomEvent<{ avatarUrl?: string }> | undefined;
      try { setCurrentAvatarUrl(custom?.detail?.avatarUrl || localStorage.getItem("roar_avatar_url") || undefined); }
      catch { setCurrentAvatarUrl(custom?.detail?.avatarUrl || undefined); }
    };
    syncAvatar();
    window.addEventListener("roar-profile-updated", syncAvatar);
    return () => window.removeEventListener("roar-profile-updated", syncAvatar);
  }, []);

  // Sync live-room notifications
  useEffect(() => {
    if (!rooms.length) return;
    setNotifications(prev => {
      const nonMatch = prev.filter(n => n.type !== "MATCH_LIVE" && n.type !== "HEATING_UP");
      const matchNotifs: Notification[] = [];
      rooms.forEach(room => {
        if (!room.isActive) return;
        const prevLive = prev.find(n => n.id === `live-${room.roomId}`);
        const prevHeat = prev.find(n => n.id === `heat-${room.roomId}`);
        matchNotifs.push({ id: `live-${room.roomId}`, type: "MATCH_LIVE", title: `MATCH LIVE: ${room.name}`, subtitle: `${room.fanCount || 0} fans already debating.`, time: "Just now", read: prevLive ? prevLive.read : false, fan: null, cta: null });
        matchNotifs.push({ id: `heat-${room.roomId}`, type: "HEATING_UP", title: "This room is heating up 🔥", subtitle: `${room.name}: ${room.fanCount || 0} fans live.`, time: "15m", read: prevHeat ? prevHeat.read : false, fan: null, cta: null });
      });
      return [...matchNotifs, ...nonMatch];
    });
  }, [rooms]); // eslint-disable-line react-hooks/exhaustive-deps


  // ── Actions ────────────────────────────────────────────────────────────────
  const handleVote = useCallback(async (postId: string, voteType: "agree" | "disagree" | null) => {
    setDbPosts(prev => prev.map(post => {
      if (post.id === postId || post._id === postId || post.postId === postId) {
        let ag = post.agreeCount ?? 0; let di = post.disagreeCount ?? 0;
        if (post.userVote === "agree")    ag = Math.max(0, ag - 1);
        if (post.userVote === "disagree") di = Math.max(0, di - 1);
        if (voteType === "agree")    ag += 1;
        if (voteType === "disagree") di += 1;
        return { ...post, userVote: voteType, agreeCount: ag, disagreeCount: di };
      }
      return post;
    }));
    try {
      await axios.post(`/api/roar/posts/${postId}/vote`, { vote: voteType });
    } catch (err: any) {
      if (err.response?.status === 409) { await fetchPosts(); return; }
      console.error("Failed to submit vote:", err); await fetchPosts();
    }
  }, [fetchPosts]);

  const handleLike = useCallback(async (postId: string) => {
    if (likingPosts.has(postId)) return;
    setLikingPosts(prev => new Set(prev).add(postId));
    setDbPosts(prev => prev.map(post => {
      if (post.postId === postId || post._id === postId) {
        const ul = post.userLiked ?? false;
        return { ...post, userLiked: !ul, likeCount: Math.max(0, (post.likeCount ?? 0) + (ul ? -1 : 1)) };
      }
      return post;
    }));
    try { await axios.post(`/api/roar/posts/${postId}/like`); fetchPosts(); }
    catch {
      setDbPosts(prev => prev.map(post => {
        if (post.postId === postId || post._id === postId) {
          const ul = post.userLiked ?? false;
          return { ...post, userLiked: !ul, likeCount: Math.max(0, (post.likeCount ?? 0) + (ul ? 1 : -1)) };
        }
        return post;
      }));
      showToast("Failed to like post");
    }
    finally { setLikingPosts(prev => { const s = new Set(prev); s.delete(postId); return s; }); }
  }, [showToast, likingPosts, fetchPosts]);

  const handleDeletePost = useCallback(async (postId: string, roomId?: string) => {
    try {
      const url = roomId ? `/api/roar/rooms/${roomId}/messages/${postId}` : `/api/roar/posts/${postId}`;
      const res = await axios.delete(url);
      if (res.data?.success) { showToast(roomId ? "Message deleted" : "Post deleted"); await fetchPosts(); }
      else showToast(roomId ? "Failed to delete message" : "Failed to delete post");
    } catch { showToast(roomId ? "Error deleting message" : "Error deleting post"); }
  }, [fetchPosts, showToast]);

  const handlePost = useCallback(async (payload: any) => {
    try {
      const postType = ["hot_take", "prediction", "debate", "raw_reactions", "post", "quiz"].includes(payload.type) ? payload.type : "hot_take";
      let mediaUrls: string[] = [];
      if (payload.mediaFiles?.length > 0) {
        showToast("Uploading media...");
        mediaUrls = await Promise.all(payload.mediaFiles.map(async (file: File) => {
          const fd = new FormData(); fd.append("file", file);
          const r = await axios.post("/api/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
          return r.data.url;
        }));
      }
      const ROOM_NATIVE = ["post", "chat", "hot_take", "hottake", "prediction", "debate", "raw_reactions"];
      const isRoomNative = overlay === "room" && selectedRoom?.roomId && ROOM_NATIVE.includes(postType) && !payload.quizQuestion;

      if (isRoomNative) {
        const msgTypeMap: Record<string, string> = { prediction: "prediction", hot_take: "hottake", hottake: "hottake", debate: "debate", raw_reactions: "raw_reactions", post: "post", chat: "chat" };
        const res = await axios.post(`/api/roar/rooms/${selectedRoom!.roomId}/messages`, {
          text: payload.text, type: msgTypeMap[postType] || "post",
          mediaUrls: payload.mediaUrls, sideA: payload.sideA, sideB: payload.sideB,
          memGifUrl: payload.gifUrl ?? undefined, memTag: payload.sf360Tag ?? undefined,
        });
        if (res.data?.success) { showToast("Post is live in room!"); roomRefreshRef.current?.(); }
      } else {
        const res = await axios.post("/api/roar/posts", {
          type: postType,
          text: postType === "quiz" ? payload.quizQuestion : payload.text,
          sport: payload.sport || "cricket", audience: payload.audience, mediaUrls,
          ...(postType !== "quiz" && { sideA: payload.sideA, sideB: payload.sideB, memCtx: payload.memCtx, matchId: payload.match, confidence: payload.confidence }),
          ...(postType === "quiz" && { quizQuestion: payload.quizQuestion, quizOptions: payload.quizOptions, quizCorrectOption: payload.quizCorrectOption, quizTimer: payload.quizTimer, quizPoints: payload.quizPoints }),
          ...(postType === "raw_reactions" && { memGifUrl: payload.gifUrl, memTag: payload.sf360Tag }),
        });
        if (res.data?.success) {
          const toastMap: Record<string, string> = { hot_take: "🔥 Hot Take is live", prediction: "📊 Prediction posted", debate: "⚡ Debate started", raw_reactions: "🎭 Raw Reaction shared", post: "✏️ Post is live", quiz: "🧠 Flash Quiz launched!" };
          showToast(toastMap[postType] || "🔥 Your take is live");
          fetchPosts();
        }
      }
    } catch { showToast("Failed to create post"); }
  }, [showToast, fetchPosts, overlay, selectedRoom]);

  const handleTab = (tab: string) => {
    setOverlay(null);
    if (tab === "discuss") { setOverlay("room"); return; }
    setActiveTab(tab);
  };

  const completeOnboarding = useCallback(async (prefs: any) => {
    const username = prefs.username || "RoarUser";
    const badge    = prefs.badge    || "RISING_FAN";
    setUserSports(prefs.sports ?? []); setUserBadge(badge); setCurrentUsername(username); setOnboarded(true);
    try { localStorage.setItem("roar_v2_complete", "1"); localStorage.setItem("roar_badge", badge); localStorage.setItem("roar_username", username); } catch {}
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const isRoom     = overlay === "room";
  const isInfinity = overlay === "infinity";
  const isLB       = overlay === "leaderboard";
  const isFullScreenOverlay = isRoom || isInfinity;

   useEffect(() => {
  if (isFullScreenOverlay) document.body.classList.add("roar-room-active");
  else document.body.classList.remove("roar-room-active");
  return () => document.body.classList.remove("roar-room-active");
}, [isFullScreenOverlay]);

  // ── Loading spinner ────────────────────────────────────────────────────────
  if (!mounted || checkingProfile) {
    return (
      <div className="roar-root" style={{ minHeight: "600px", height: "100%", background: "#050508", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderRadius: "24px", border: "1px solid #252538" }}>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        <div style={{ textAlign: "center", zIndex: 10 }}>
          <div style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #E91E8C", borderRadius: "50%", animation: "roar-spin 1s linear infinite", margin: "0 auto 16px" }} />
          <style dangerouslySetInnerHTML={{ __html: `@keyframes roar-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}` }} />
          <div style={{ color: "#9494AD", fontSize: 14, fontFamily: "sans-serif", fontWeight: 500 }}>Loading ROAR...</div>
        </div>
      </div>
    );
  }

  return (
    // <div className={`roar-root${isRoom ? " roar-room-active" : ""}`}>
    <div className={`roar-root${isFullScreenOverlay ? " roar-room-active" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <div className="roar-inner" ref={containerRef} style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Ambient background */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 90% 55% at 50% -15%,rgba(233,30,140,0.18),transparent 55%),radial-gradient(ellipse 70% 45% at 100% 80%,rgba(255,107,53,0.12),transparent 50%),radial-gradient(ellipse 50% 40% at 0% 60%,rgba(0,232,198,0.08),transparent 45%),var(--bg-primary)" }} />
        {/* Floating sparks */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
          {[{ left: "12%", color: "var(--accent-magenta)", size: 3, duration: "14s", delay: "0s" }, { left: "28%", color: "var(--accent-orange)", size: 4, duration: "18s", delay: "2s" }, { left: "50%", color: "var(--teal)", size: 3, duration: "15s", delay: "5s" }, { left: "72%", color: "var(--accent-magenta)", size: 4, duration: "20s", delay: "1s" }, { left: "88%", color: "var(--accent-yellow)", size: 3, duration: "16s", delay: "7s" }].map(({ left, color, size, duration, delay }) => (
            <div key={left} style={{ position: "absolute", bottom: -10, left, width: size, height: size, borderRadius: "50%", background: color, animation: `roar-driftUp ${duration} linear infinite ${delay}` }} />
          ))}
        </div>
        {/* ROAR watermark */}
        <div style={{ position: "absolute", bottom: 88, right: 0, left: 0, textAlign: "right", paddingRight: 12, fontFamily: "'Bebas Neue',sans-serif", fontSize: 72, color: "white", opacity: 0.04, pointerEvents: "none", zIndex: 0, letterSpacing: "0.1em" }}>ROAR</div>

        <Toast message={toast.message} visible={toast.visible} />

        {!onboarded && <Onboarding onComplete={completeOnboarding} />}

        {onboarded && (
          <div style={{ position: "relative", zIndex: 1, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <AnimatePresence mode="wait">
              {isLB ? (
                <motion.div key="lb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <Leaderboard onBack={() => setOverlay(null)} onCompose={() => openCompose("prediction")} />
                </motion.div>
              ) : isInfinity ? (
                // SF360 Infinity Room → original HomeFeed (all posts)
                <motion.div key="infinity" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <style dangerouslySetInnerHTML={{ __html: `#global-header-desktop,#global-header-tablet,#global-header-mobile{display:none!important}` }} />
                  <HomeFeed
                    onJoinRoom={room => { if (room) setSelectedRoom(room); else if (rooms.length) setSelectedRoom(rooms[0]); setOverlay("room"); }}
                    onLeaderboard={() => setOverlay("leaderboard")}
                    onFanProfile={() => setActiveTab("profile")}
                    onToast={showToast}
                    extraItems={[]}
                    showBanner={false}
                    onDismissBanner={() => {}}
                    userBadge={userBadge}
                    rooms={rooms}
                    dbPosts={dbPosts}
                    onPostClick={post => setSelectedPost(post)}
                    onVote={handleVote}
                    onLike={handleLike}
                    onDeletePost={handleDeletePost}
                    userSports={userSports}
                    onQuickCompose={t => openCompose(t)}
                    currentUsername={currentUsername}
                    currentAvatarUrl={currentAvatarUrl}
                    onBack={() => { setOverlay(null); setActiveTab("home"); }}
                  />
                </motion.div>
              ) : isRoom ? (
                <motion.div key="room" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <style dangerouslySetInnerHTML={{ __html: `#global-header-desktop,#global-header-tablet,#global-header-mobile{display:none!important}` }} />
                  <DiscussionRoom
                    roomId={selectedRoom?.roomId}
                    roomName={selectedRoom?.name}
                    fanCount={selectedRoom?.fanCount}
                    score={selectedRoom?.score}
                    scoreSubtitle={selectedRoom?.scoreSubtitle}
                    onBack={() => { setOverlay(null); setActiveTab("home"); }}
                    onToast={showToast}
                    onPostClick={post => setSelectedPost(post)}
                    onCompose={type => openCompose(type)}
                    currentAvatarUrl={currentAvatarUrl}
                    onRegisterRefresh={fn => { roomRefreshRef.current = fn; }}
                    onRegisterReplyUpdate={fn => { roomReplyUpdateRef.current = fn; }}
                  />
                </motion.div>
              ) : (
                <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  {/* HOME TAB → RoomsHome */}
                  {activeTab === "home" && (
                    <RoomsHome
                      rooms={rooms}
                      onJoinRoom={room => {
                        if (room?.roomId === "sf360-infinity") {
                          // Infinity Room = the old HomeFeed (all posts)
                          setOverlay("infinity");
                        } else {
                          if (room) setSelectedRoom(room);
                          else if (rooms.length) setSelectedRoom(rooms[0]);
                          setOverlay("room");
                        }
                      }}
                      onToast={showToast}
                    />
                  )}
                  {activeTab === "profile" && (
                    <Profile userBadge={userBadge} setUserBadge={setUserBadge} onCompose={() => openCompose("prediction")} onToast={showToast} setOnboarded={setOnboarded} onNavigateTab={handleTab} />
                  )}
                  {activeTab === "alerts" && (
                    <Notifications notifications={notifications} onMarkRead={id => markRoarRead(id)} onMarkAllRead={markAllRoarRead} onCompose={() => openCompose()} onJoinRoom={room => { if (room) setSelectedRoom(room); else if (rooms.length) setSelectedRoom(rooms[0]); setOverlay("room"); }} onNavigateTab={handleTab} rooms={rooms} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {onboarded && selectedPost && (
              overlay === "room" ? (
                <RoomPostDetailsOverlay
                  post={selectedPost}
                  onClose={(count?) => { if (selectedPost && count !== undefined) roomReplyUpdateRef.current?.(selectedPost.id, count); setSelectedPost(null); roomRefreshRef.current?.(); }}
                  onToast={showToast} onVote={handleVote} onDeletePost={handleDeletePost}
                  currentUsername={currentUsername} currentAvatarUrl={currentAvatarUrl}
                />
              ) : (
                <PostDetailsOverlay
                  post={selectedPost}
                  onClose={() => setSelectedPost(null)}
                  onToast={showToast} onVote={handleVote} onDeletePost={handleDeletePost}
                  currentUsername={currentUsername} currentAvatarUrl={currentAvatarUrl}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Modals outside roar-inner */}
      {onboarded && (
        <ComposeModal open={composeOpen} onClose={() => { setComposeOpen(false); setComposeType(null); }} onPost={handlePost} initialType={composeType} onOpenQuiz={() => { setComposeOpen(false); setComposeType(null); setQuizOpen(true); }} />
      )}
      {onboarded && (
        <CreateFlashQuizModal open={quizOpen} onClose={() => setQuizOpen(false)} onPost={handlePost} />
      )}

    </div>
  );
}
