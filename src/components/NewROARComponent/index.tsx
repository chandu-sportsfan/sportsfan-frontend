

// //chandu's code

// /**
//  * ROAR — Root component
//  * Thin orchestrator: state management + navigation only.
//  * All screen/component logic lives in its own file.
//  */
// //NewROARComponent/index.tsx
// import { useState, useEffect, useRef, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useSearchParams } from "next/navigation";
// import axios from "axios";

// import { GLOBAL_CSS } from "./constants/styles";
// import { NOTIFICATIONS_DATA } from "./constants";
// import { Toast, BottomNav } from "./components/shared";
// import ComposeModal from "./components/ComposeModal";
// import PostDetailsOverlay from "./components/PostDetailsOverlay";
// import Onboarding from "./screens/Onboarding";
// import HomeFeed from "./screens/HomeFeed";
// import DiscussionRoom from "./screens/DiscussionRoom";
// import Notifications from "./screens/Notifications";
// import Leaderboard from "./screens/Leaderboard";
// import Profile from "./screens/Profile";
// import type { Notification, Room } from "./types";
// import { useRoarNotifications } from "@/context/RoarNotificationsContext";

// export default function ROARApp() {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const searchParams = useSearchParams();
//   const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());

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
//           } catch {}
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
//           } catch {}
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

//   const openCompose = (type: string | null = null) => {
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

//     const navHeight = typeof window !== "undefined"
//      ? (() => {
//          const el = document.querySelector(".roar-bottom-nav");
//          if (!el) return 0;
//          const rect = el.getBoundingClientRect();
//          return Math.max(0, window.innerHeight - rect.top);
//        })()
//      : 0;

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

//     const target = dbPosts.find(
//       (p) => p.postId === postId || p.id === postId,
//     );

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
//           // ── KEY FIX: only set selectedRoom if we don't already have one ──
//           // Previously this ran unconditionally and could override the user
//           // navigating back (overlay=null) by immediately re-selecting a room.
//           setSelectedRoom((prev) => {
//             if (prev) return prev; // keep existing selection
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
//           } catch {}
//         }
//       } catch (err: any) {
//         if (err.response?.status === 404) {
//           setOnboarded(false);
//           try { localStorage.removeItem("roar_v2_complete"); } catch {}
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

//       try {
//         await axios.post(`/api/roar/posts/${postId}/vote`, { vote: voteType });
//         // Removed immediate fetchPosts() to prevent read-after-write DB lag from flickering the UI
//       } catch (err) {
//         console.error("Failed to submit vote:", err);
//         await fetchPosts();
//       }
//     },
//     [fetchPosts],
//   );

//   // const handleLike = useCallback(
//   //   async (postId: string) => {
//   //     setDbPosts((prev) =>
//   //       prev.map((post) => {
//   //         if (post.id === postId || post._id === postId) {
//   //           const userLiked = post.userLiked ?? false;
//   //           return {
//   //             ...post,
//   //             userLiked: !userLiked,
//   //             likeCount: Math.max(0, (post.likeCount ?? 0) + (userLiked ? -1 : 1)),
//   //           };
//   //         }
//   //         return post;
//   //       })
//   //     );

//   //     try {
//   //       await axios.post(`/api/roar/posts/${postId}/like`);
//   //       await fetchPosts();
//   //     } catch (err) {
//   //       console.error("Failed to submit like:", err);
//   //       await fetchPosts();
//   //     }
//   //   },
//   //   [fetchPosts],
//   // );

// const handleLike = useCallback(
//   async (postId: string) => {
//     if (likingPosts.has(postId)) return;
//     setLikingPosts(prev => new Set(prev).add(postId));

//     // Optimistic update
//     setDbPosts((prev) =>
//       prev.map((post) => {
//         if (post.postId === postId || post._id === postId) {
//           const userLiked = post.userLiked ?? false;
//           return {
//             ...post,
//             userLiked: !userLiked,
//             likeCount: Math.max(0, (post.likeCount ?? 0) + (userLiked ? -1 : 1)),
//           };
//         }
//         return post;
//       })
//     );

//     try {
//       await axios.post(`/api/roar/posts/${postId}/like`);
//       // ✅ Sync server state silently in background — no loading flash
//       fetchPosts();
//     } catch (err) {
//       console.error("Failed to submit like:", err);
//       // Revert on error
//       setDbPosts((prev) =>
//         prev.map((post) => {
//           if (post.postId === postId || post._id === postId) {
//             const userLiked = post.userLiked ?? false;
//             return {
//               ...post,
//               userLiked: !userLiked,
//               likeCount: Math.max(0, (post.likeCount ?? 0) + (userLiked ? 1 : -1)),
//             };
//           }
//           return post;
//         })
//       );
//       showToast("Failed to like post");
//     } finally {
//       setLikingPosts(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(postId);
//         return newSet;
//       });
//     }
//   },
//   [showToast, likingPosts, fetchPosts], // ✅ added fetchPosts
// );

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
//         const postType = ["hot_take", "prediction", "debate", "memory", "post"].includes(payload.type)
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

//         const isInRoom = overlay === "room" && selectedRoom?.roomId;
//         let res;

//         if (isInRoom) {
//           const msgType =
//             postType === "prediction" ? "prediction"
//             : postType === "hot_take" ? "hottake"
//             : "chat";
//           res = await axios.post(`/api/roar/rooms/${selectedRoom.roomId}/messages`, {
//             text: payload.type === "debate"
//               ? `${payload.sideA} VS ${payload.sideB}`
//               : payload.text,
//             type: msgType,
//           });
//         } else {
//           res = await axios.post("/api/roar/posts", {
//             type: postType,
//             text: payload.type === "debate"
//               ? `${payload.sideA} VS ${payload.sideB}`
//               : payload.text,
//             sideA: payload.sideA,
//             sideB: payload.sideB,
//             memCtx: payload.memCtx,
//             sport: payload.sport || "cricket",
//             matchId: payload.match,
//             confidence: payload.confidence,
//             audience: payload.audience,
//             mediaUrls,
//           });
//         }

//         if (res.data?.success) {
//           if (isInRoom) {
//             showToast("✏️ Post is live in room!");
//           } else {
//             const toastMap: Record<string, string> = {
//               hot_take:   "🔥 Hot Take is live · 47 fans may see it",
//               prediction: "📊 Prediction posted · Let's see if you're right",
//               debate:     "⚡ Debate started · Get the fans talking",
//               memory:     "🕰 Memory shared · OG fans will feel this",
//               post:       "✏️ Post is live · Fans can see it now",
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

//   // ── KEY FIX: dedicated back handler that uses onPointerDown so it fires
//   // before any touch-delay or bubbling can re-trigger the room overlay.
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
//     }
//     catch (err) {
//   console.error("Failed to persist onboarding data to localStorage:", err);
// }
//     // try {
//     //   await axios.post("/api/roar/onboarding", {
//     //     sports: prefs.sports || ["cricket"],
//     //     teams: prefs.teams || [],
//     //     tenure: prefs.tenure || "rising",
//     //     badge,
//     //     firstContribution: prefs.firstContribution || null,
//     //   });
//     // } catch (err) {
//     //   console.error("Failed to save onboarding to backend:", err);
//     // }
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
//                 <motion.div key="lb" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
//                   <Leaderboard onBack={() => setOverlay(null)} onCompose={() => openCompose("prediction")} />
//                 </motion.div>
//               ) : isRoom ? (
//                 <motion.div key="room" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
//                   <style dangerouslySetInnerHTML={{ __html: `
//                     #global-header-desktop, #global-header-tablet, #global-header-mobile { display: none !important; }
//                   `}} />
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
//                   />
//                 </motion.div>
//               ) : (
//                 <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
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
//           </div>
//         )}

//         {/* {onboarded && selectedPost && (
//           <PostDetailsOverlay
//             post={selectedPost}
//             onClose={() => setSelectedPost(null)}
//             onToast={showToast}
//             onVote={handleVote}
//             onDeletePost={handleDeletePost}
//             currentUsername={currentUsername}
//             currentAvatarUrl={currentAvatarUrl}
//           />
//         )} */}

// {onboarded && selectedPost && (
//   // <div className="roar-fixed-portal">
//     <PostDetailsOverlay
//       post={selectedPost}
//       onClose={() => setSelectedPost(null)}
//       onToast={showToast}
//       onVote={handleVote}
//       onDeletePost={handleDeletePost}
//       currentUsername={currentUsername}
//       currentAvatarUrl={currentAvatarUrl}
//       bottomNavHeight={navHeight}
//     />
//   // {/* </div> */}
// )}
//         {onboarded && (
//           <ComposeModal
//             open={composeOpen}
//             onClose={() => { setComposeOpen(false); setComposeType(null); }}
//             onPost={handlePost}
//             initialType={composeType}
//           />
//         )}
//       </div>
//     </div>
//   );
// }


/**
 * ROAR — Root component
 * Thin orchestrator: state management + navigation only.
 */
// NewROARComponent/index.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import axios from "axios";

import { GLOBAL_CSS } from "./constants/styles";
import { NOTIFICATIONS_DATA } from "./constants";
import { Toast, BottomNav } from "./components/shared";
import ComposeModal from "./components/ComposeModal";
import CreateFlashQuizModal from "./components/CreateFlashQuizModal";
import PostDetailsOverlay from "./components/PostDetailsOverlay";
import Onboarding from "./screens/Onboarding";
import HomeFeed from "./screens/HomeFeed";
import DiscussionRoom from "./screens/DiscussionRoom";
import Notifications from "./screens/Notifications";
import Leaderboard from "./screens/Leaderboard";
import Profile from "./screens/Profile";
import type { Notification, Room } from "./types";
import { useRoarNotifications } from "@/context/RoarNotificationsContext";
import RoomPostDetailsOverlay from "./components/RoomPostDetailsOverlay";


export default function ROARApp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
  const roomRefreshRef = useRef<(() => void) | null>(null);
  const roomReplyUpdateRef = useRef<((postId: string, count: number) => void) | null>(null);
  // ── Bootstrap ──────────────────────────────────────────────────────────────
  const [mounted, setMounted] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [onboarded, setOnboarded] = useState(false);
  const [userBadge, setUserBadge] = useState("RISING_FAN");
  const [userSports, setUserSports] = useState<string[]>([]);
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
            localStorage.setItem("roar_badge", res.data.user.badge || "RISING_FAN");
            localStorage.setItem("roar_username", res.data.user.username || "RoarUser");
            if (res.data.user.avatarUrl) localStorage.setItem("roar_avatar_url", res.data.user.avatarUrl);
          } catch { }
        } else {
          setOnboarded(false);
        }
      } catch (err: any) {
        const status = err.response?.status;
        if (status === 404 || status === 401) {
          setOnboarded(false);
        } else {
          let hasLocal = false;
          let badge = "RISING_FAN";
          try {
            hasLocal = !!localStorage.getItem("roar_v2_complete");
            badge = localStorage.getItem("roar_badge") || "RISING_FAN";
          } catch { }
          setOnboarded(hasLocal);
          setUserBadge(badge);
        }
      } finally {
        setCheckingProfile(false);
      }
    };
    checkProfile();
  }, []);

  // ── Navigation state ───────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("home");
  const [overlay, setOverlay] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  // ── Compose ────────────────────────────────────────────────────────────────
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeType, setComposeType] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  const openCompose = (type: string | null = null) => {
    if (type === "quiz") {
      setQuizOpen(true);
      return;
    }
    setComposeType(type);
    setComposeOpen(true);
  };

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState({ visible: false, message: "" });

  const showToast = useCallback((msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3200);
    setTimeout(() => setToast({ visible: false, message: "" }), 3700);
  }, []);

  // ── Notifications ──────────────────────────────────────────────────────────
  const {
    roarNotifications: notifications,
    setRoarNotifications: setNotifications,
    markRoarRead,
    markAllRoarRead,
  } = useRoarNotifications();

  const [notifSeeded, setNotifSeeded] = useState(false);
  useEffect(() => {
    if (!notifSeeded) {
      setNotifications(NOTIFICATIONS_DATA.map((n) => ({ ...n })));
      setNotifSeeded(true);
    }
  }, [notifSeeded, setNotifications]);

  // ── Remote data ────────────────────────────────────────────────────────────
  const [rooms, setRooms] = useState<Room[]>([]);
  const [dbPosts, setDbPosts] = useState<any[]>([]);
  const [showBanner, setShowBanner] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get(`/api/roar/posts?t=${Date.now()}`);
      if (res.data?.success) setDbPosts(res.data.posts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  }, []);

  useEffect(() => {
    const postId = searchParams.get("postId");
    if (!postId || !onboarded || dbPosts.length === 0) return;
    const target = dbPosts.find((p) => p.postId === postId || p.id === postId);
    if (target) {
      setSelectedPost(target);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [searchParams, onboarded, dbPosts]);

  useEffect(() => {
    if (!onboarded) return;

    const fetchRooms = async () => {
      try {
        const res = await axios.get(`/api/roar/rooms?t=${Date.now()}`);
        if (res.data?.success) {
          setRooms(res.data.rooms);
          setSelectedRoom((prev) => {
            if (prev) return prev;
            return res.data.rooms.length > 0 ? res.data.rooms[0] : null;
          });
        }
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };

    const fetchUserSports = async () => {
      try {
        const res = await axios.get("/api/roar/profile");
        if (res.data?.success) {
          setUserSports(res.data.user.sports ?? []);
          setUserBadge(res.data.user.badge || "RISING_FAN");
          setCurrentAvatarUrl(res.data.user.avatarUrl || undefined);
          try {
            if (res.data.user.avatarUrl) localStorage.setItem("roar_avatar_url", res.data.user.avatarUrl);
          } catch { }
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setOnboarded(false);
          try { localStorage.removeItem("roar_v2_complete"); } catch { }
        }
      }
    };

    fetchRooms();
    fetchPosts();
    fetchUserSports();

    const interval = setInterval(() => {
      fetchRooms();
      fetchPosts();
    }, 5000);
    return () => clearInterval(interval);
  }, [onboarded, fetchPosts]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const syncAvatar = (event?: Event) => {
      const custom = event as CustomEvent<{ avatarUrl?: string }> | undefined;
      const avatarFromEvent = custom?.detail?.avatarUrl;
      try {
        setCurrentAvatarUrl(avatarFromEvent || localStorage.getItem("roar_avatar_url") || undefined);
      } catch {
        setCurrentAvatarUrl(avatarFromEvent || undefined);
      }
    };
    syncAvatar();
    window.addEventListener("roar-profile-updated", syncAvatar);
    return () => window.removeEventListener("roar-profile-updated", syncAvatar);
  }, []);

  // Sync notifications with live rooms
  useEffect(() => {
    if (!rooms.length) return;
    setNotifications((prev) => {
      const nonMatch = prev.filter((n) => n.type !== "MATCH_LIVE" && n.type !== "HEATING_UP");
      const matchNotifs: Notification[] = [];
      rooms.forEach((room) => {
        if (!room.isActive) return;
        const prevLive = prev.find((n) => n.id === `live-${room.roomId}`);
        const prevHeat = prev.find((n) => n.id === `heat-${room.roomId}`);
        matchNotifs.push({
          id: `live-${room.roomId}`,
          type: "MATCH_LIVE",
          title: `MATCH LIVE: ${room.name}`,
          subtitle: `Discussion room is open. ${room.fanCount || 0} fans already debating.`,
          time: "Just now",
          read: prevLive ? prevLive.read : false,
          fan: null,
          cta: null,
        });
        matchNotifs.push({
          id: `heat-${room.roomId}`,
          type: "HEATING_UP",
          title: "This room is heating up 🔥",
          subtitle: `${room.name} debate: ${room.fanCount || 0} fans live. Jump in.`,
          time: "15m",
          read: prevHeat ? prevHeat.read : false,
          fan: null,
          cta: null,
        });
      });
      return [...matchNotifs, ...nonMatch];
    });
  }, [rooms]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleVote = useCallback(
    async (postId: string, voteType: "agree" | "disagree" | null) => {
      setDbPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId || post._id === postId || post.postId === postId) {
            const currentVote = post.userVote;
            let agreeCount = post.agreeCount ?? 0;
            let disagreeCount = post.disagreeCount ?? 0;
            if (currentVote === "agree") agreeCount = Math.max(0, agreeCount - 1);
            if (currentVote === "disagree") disagreeCount = Math.max(0, disagreeCount - 1);
            if (voteType === "agree") agreeCount += 1;
            if (voteType === "disagree") disagreeCount += 1;
            return { ...post, userVote: voteType, agreeCount, disagreeCount };
          }
          return post;
        })
      );
      // try {
      //   await axios.post(`/api/roar/posts/${postId}/vote`, { vote: voteType });
      // } catch (err) {
      //   console.error("Failed to submit vote:", err);
      //   await fetchPosts();
      // }
      try {
        await axios.post(`/api/roar/posts/${postId}/vote`, { vote: voteType });
      } catch (err: any) {
        if (err.response?.status === 409) {
          // Server says already voted — just sync, don't revert
          await fetchPosts();
          return;
        }
        console.error("Failed to submit vote:", err);
        await fetchPosts();
      }
    },
    [fetchPosts],
  );

  const handleLike = useCallback(
    async (postId: string) => {
      if (likingPosts.has(postId)) return;
      setLikingPosts(prev => new Set(prev).add(postId));

      setDbPosts((prev) =>
        prev.map((post) => {
          if (post.postId === postId || post._id === postId) {
            const userLiked = post.userLiked ?? false;
            return {
              ...post,
              userLiked: !userLiked,
              likeCount: Math.max(0, (post.likeCount ?? 0) + (userLiked ? -1 : 1)),
            };
          }
          return post;
        })
      );

      try {
        await axios.post(`/api/roar/posts/${postId}/like`);
        fetchPosts();
      } catch (err) {
        console.error("Failed to submit like:", err);
        setDbPosts((prev) =>
          prev.map((post) => {
            if (post.postId === postId || post._id === postId) {
              const userLiked = post.userLiked ?? false;
              return {
                ...post,
                userLiked: !userLiked,
                likeCount: Math.max(0, (post.likeCount ?? 0) + (userLiked ? 1 : -1)),
              };
            }
            return post;
          })
        );
        showToast("Failed to like post");
      } finally {
        setLikingPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      }
    },
    [showToast, likingPosts, fetchPosts],
  );

  const handleDeletePost = useCallback(
    async (postId: string, roomId?: string) => {
      try {
        const url = roomId
          ? `/api/roar/rooms/${roomId}/messages/${postId}`
          : `/api/roar/posts/${postId}`;
        const res = await axios.delete(url);
        if (res.data?.success) {
          showToast(roomId ? "Message deleted" : "Post deleted");
          await fetchPosts();
        } else {
          showToast(roomId ? "Failed to delete message" : "Failed to delete post");
        }
      } catch (err) {
        console.error("Failed to delete:", err);
        showToast(roomId ? "Error deleting message" : "Error deleting post");
      }
    },
    [fetchPosts, showToast],
  );

  const handlePost = useCallback(
    async (payload: any) => {
      try {
        const postType = ["hot_take", "prediction", "debate", "memory", "post", "quiz"].includes(payload.type)
          ? payload.type
          : "hot_take";

        let mediaUrls: string[] = [];
        if (payload.mediaFiles && payload.mediaFiles.length > 0) {
          showToast("Uploading media...");
          const uploadPromises = payload.mediaFiles.map(async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await axios.post("/api/upload", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            return uploadRes.data.url;
          });
          mediaUrls = await Promise.all(uploadPromises);
        }
        const ROOM_NATIVE_TYPES = ["post", "chat", "hot_take", "hottake", "prediction", "debate", "memory"];

        const isRoomNative =
          overlay === "room" &&
          selectedRoom?.roomId &&
          ROOM_NATIVE_TYPES.includes(postType) &&
          !payload.quizQuestion;

        let res;

        if (isRoomNative) {
          const msgTypeMap: Record<string, string> = {
            prediction: "prediction",
            hot_take: "hottake",
            hottake: "hottake",
            debate: "debate",
            memory: "memory",
            post: "post",
            chat: "chat",
          };
          const msgType = msgTypeMap[postType] || "post";

          // res = await axios.post(`/api/roar/rooms/${selectedRoom.roomId}/messages`, {
          //   text: postType === "debate"
          //     ? `${payload.sideA} VS ${payload.sideB}`
          //     : payload.text,
          //   type: msgType,
          //   mediaUrls: payload.mediaUrls,
          //   sideA: payload.sideA,
          //   sideB: payload.sideB,
          // });
          res = await axios.post(`/api/roar/rooms/${selectedRoom.roomId}/messages`, {
            text: payload.text,  // debate question — sides are sent separately
            type: msgType,
            mediaUrls: payload.mediaUrls,
            sideA: payload.sideA,
            sideB: payload.sideB,
          });
          if (res.data?.success) {
            showToast("✏️ Post is live in room!");
          }
        }
        else {
          res = await axios.post("/api/roar/posts", {
            type: postType,
            // text: postType === "quiz"
            //   ? payload.quizQuestion
            //   : postType === "debate"
            //     ? `${payload.sideA} VS ${payload.sideB}`
            //     : payload.text,
            text: postType === "quiz"
              ? payload.quizQuestion
              : payload.text,
            sport: payload.sport || "cricket",
            audience: payload.audience,
            mediaUrls,
            ...(postType !== "quiz" && {
              sideA: payload.sideA,
              sideB: payload.sideB,
              memCtx: payload.memCtx,
              matchId: payload.match,
              confidence: payload.confidence,
            }),
            ...(postType === "quiz" && {
              quizQuestion: payload.quizQuestion,
              quizOptions: payload.quizOptions,
              quizCorrectOption: payload.quizCorrectOption,
              quizTimer: payload.quizTimer,
              quizPoints: payload.quizPoints,
            }),
          });

          if (res.data?.success) {
            const toastMap: Record<string, string> = {
              hot_take: "🔥 Hot Take is live · 47 fans may see it",
              prediction: "📊 Prediction posted · Let's see if you're right",
              debate: "⚡ Debate started · Get the fans talking",
              memory: "🕰 Memory shared · OG fans will feel this",
              post: "✏️ Post is live · Fans can see it now",
              quiz: "🧠 Flash Quiz launched · Let the fans answer!",
            };
            showToast(toastMap[postType] || "🔥 Your take is live");
            fetchPosts();
          }
        }
      } catch (err) {
        console.error("Failed to post:", err);
        showToast("Failed to create post");
      }
      setShowBanner(false);
    },
    [showToast, fetchPosts, overlay, selectedRoom],
  );

  const handleTab = (tab: string) => {
    setOverlay(null);
    if (tab === "discuss") { setOverlay("room"); return; }
    setActiveTab(tab);
  };

  const handleRoomBack = useCallback(() => {
    setOverlay(null);
    setActiveTab("home");
  }, []);

  const completeOnboarding = useCallback(async (prefs: any) => {
    const username = prefs.username || "RoarUser";
    const badge = prefs.badge || "RISING_FAN";
    setUserSports(prefs.sports ?? []);
    setUserBadge(badge);
    setCurrentUsername(username);
    setOnboarded(true);
    try {
      localStorage.setItem("roar_v2_complete", "1");
      localStorage.setItem("roar_badge", badge);
      localStorage.setItem("roar_username", username);
    } catch (err) {
      console.error("Failed to persist onboarding data to localStorage:", err);
    }
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const unreadCount = notifications.filter((n) => !n.read).length;
  const isRoom = overlay === "room";
  const isLB = overlay === "leaderboard";

  // ── Loading spinner ────────────────────────────────────────────────────────
  if (!mounted || checkingProfile) {
    return (
      <div
        className="roar-root"
        style={{ minHeight: "600px", height: "100%", background: "#050508", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderRadius: "24px", border: "1px solid #252538" }}
      >
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
        <div style={{ textAlign: "center", zIndex: 10 }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.1)", borderTop: "3px solid #E91E8C", borderRadius: "50%", animation: "roar-spin 1s linear infinite", margin: "0 auto 16px" }} />
          <style dangerouslySetInnerHTML={{ __html: `@keyframes roar-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }` }} />
          <div style={{ color: "#9494AD", fontSize: "14px", fontFamily: "sans-serif", fontWeight: 500 }}>Loading ROAR...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`roar-root${isRoom ? " roar-room-active" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <div className="roar-inner" ref={containerRef} style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Ambient background */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 90% 55% at 50% -15%,rgba(233,30,140,0.18),transparent 55%),radial-gradient(ellipse 70% 45% at 100% 80%,rgba(255,107,53,0.12),transparent 50%),radial-gradient(ellipse 50% 40% at 0% 60%,rgba(0,232,198,0.08),transparent 45%),var(--bg-primary)" }} />

        {/* Floating sparks */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
          {[
            { left: "12%", color: "var(--accent-magenta)", size: 3, duration: "14s", delay: "0s" },
            { left: "28%", color: "var(--accent-orange)", size: 4, duration: "18s", delay: "2s" },
            { left: "50%", color: "var(--teal)", size: 3, duration: "15s", delay: "5s" },
            { left: "72%", color: "var(--accent-magenta)", size: 4, duration: "20s", delay: "1s" },
            { left: "88%", color: "var(--accent-yellow)", size: 3, duration: "16s", delay: "7s" },
          ].map(({ left, color, size, duration, delay }) => (
            <div
              key={left}
              style={{ position: "absolute", bottom: -10, left, width: size, height: size, borderRadius: "50%", background: color, animation: `roar-driftUp ${duration} linear infinite ${delay}` }}
            />
          ))}
        </div>

        {/* ROAR watermark */}
        <div style={{ position: "absolute", bottom: 88, right: 0, left: 0, textAlign: "right", paddingRight: 12, fontFamily: "'Bebas Neue',sans-serif", fontSize: 72, color: "white", opacity: 0.04, pointerEvents: "none", zIndex: 0, letterSpacing: "0.1em" }}>ROAR</div>

        {/* Toast */}
        <Toast message={toast.message} visible={toast.visible} />

        {/* Onboarding */}
        {!onboarded && <Onboarding onComplete={completeOnboarding} />}

        {/* Main content */}
        {onboarded && (
          <div style={{ position: "relative", zIndex: 1, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <AnimatePresence mode="wait">
              {isLB ? (
                <motion.div
                  key="lb"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
                >
                  <Leaderboard onBack={() => setOverlay(null)} onCompose={() => openCompose("prediction")} />
                </motion.div>
              ) : isRoom ? (
                <motion.div
                  key="room"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
                >
                  <style dangerouslySetInnerHTML={{ __html: `#global-header-desktop, #global-header-tablet, #global-header-mobile { display: none !important; }` }} />
                  <DiscussionRoom
                    roomId={selectedRoom?.roomId}
                    roomName={selectedRoom?.name}
                    fanCount={selectedRoom?.fanCount}
                    score={selectedRoom?.score}
                    scoreSubtitle={selectedRoom?.scoreSubtitle}
                    onBack={handleRoomBack}
                    onToast={showToast}
                    onPostClick={(post) => setSelectedPost(post)}
                    onCompose={(type) => openCompose(type)}
                    currentAvatarUrl={currentAvatarUrl}
                    onRegisterRefresh={(fn) => { roomRefreshRef.current = fn; }}
                    onRegisterReplyUpdate={(fn) => { roomReplyUpdateRef.current = fn; }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
                >
                  {activeTab === "home" && (
                    <HomeFeed
                      onJoinRoom={(room) => { if (room) setSelectedRoom(room); else if (rooms.length) setSelectedRoom(rooms[0]); setOverlay("room"); }}
                      onLeaderboard={() => setOverlay("leaderboard")}
                      onFanProfile={() => setActiveTab("profile")}
                      onToast={showToast}
                      extraItems={[]}
                      showBanner={showBanner}
                      onDismissBanner={() => setShowBanner(false)}
                      userBadge={userBadge}
                      rooms={rooms}
                      dbPosts={dbPosts}
                      onPostClick={(post) => setSelectedPost(post)}
                      onVote={handleVote}
                      onLike={handleLike}
                      onDeletePost={handleDeletePost}
                      userSports={userSports}
                      onQuickCompose={(t) => openCompose(t)}
                      currentUsername={currentUsername}
                      currentAvatarUrl={currentAvatarUrl}
                    />
                  )}
                  {activeTab === "profile" && (
                    <Profile
                      userBadge={userBadge}
                      setUserBadge={setUserBadge}
                      onCompose={() => openCompose("prediction")}
                      onToast={showToast}
                      setOnboarded={setOnboarded}
                      onNavigateTab={handleTab}
                    />
                  )}
                  {activeTab === "alerts" && (
                    <Notifications
                      notifications={notifications}
                      onMarkRead={(id) => markRoarRead(id)}
                      onMarkAllRead={markAllRoarRead}
                      onCompose={() => openCompose()}
                      onJoinRoom={(room) => { if (room) setSelectedRoom(room); else if (rooms.length) setSelectedRoom(rooms[0]); setOverlay("room"); }}
                      onNavigateTab={handleTab}
                      rooms={rooms}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* PostDetailsOverlay lives INSIDE the main content div so it sits
                within roar-inner's bounds — the app header and sidebar remain
                visible outside this container on desktop. position:absolute
                fills roar-inner exactly with no JS measurement needed. */}
            {/* {onboarded && selectedPost && (
              <PostDetailsOverlay
                post={selectedPost}
                // onClose={() => setSelectedPost(null)}
                onClose={(updatedReplyCount?: number) => {
                  if (selectedPost && updatedReplyCount !== undefined && overlay === "room") {
                    roomReplyUpdateRef.current?.(selectedPost.id, updatedReplyCount);
                  }
                  setSelectedPost(null);
                  roomRefreshRef.current?.();
                }}
                onToast={showToast}
                onVote={handleVote}
                onDeletePost={handleDeletePost}
                currentUsername={currentUsername}
                currentAvatarUrl={currentAvatarUrl}

              />
            )} */}
            {onboarded && selectedPost && (
              overlay === "room" ? (
                <RoomPostDetailsOverlay
                  post={selectedPost}
                  onClose={(count?) => {
                    if (selectedPost && count !== undefined) roomReplyUpdateRef.current?.(selectedPost.id, count);
                    setSelectedPost(null);
                    roomRefreshRef.current?.();
                  }}
                  onToast={showToast}
                  onVote={handleVote}
                  onDeletePost={handleDeletePost}
                  currentUsername={currentUsername}
                  currentAvatarUrl={currentAvatarUrl}
                />
              ) : (
                <PostDetailsOverlay
                  post={selectedPost}
                  onClose={(count?) => { setSelectedPost(null); }}
                  onToast={showToast}
                  onVote={handleVote}
                  onDeletePost={handleDeletePost}
                  currentUsername={currentUsername}
                  currentAvatarUrl={currentAvatarUrl}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* ── Modals live OUTSIDE roar-inner so overflow:hidden never clips them ── */}

      {/* Standard compose modal (hot take, prediction, debate, memory, post) */}
      {onboarded && (
        <ComposeModal
          open={composeOpen}
          onClose={() => { setComposeOpen(false); setComposeType(null); }}
          onPost={handlePost}
          initialType={composeType}
          onOpenQuiz={() => { setComposeOpen(false); setComposeType(null); setQuizOpen(true); }}
        />
      )}

      {/* Flash Quiz dedicated modal */}
      {onboarded && (
        <CreateFlashQuizModal
          open={quizOpen}
          onClose={() => setQuizOpen(false)}
          onPost={handlePost}
        />
      )}
    </div>
  );
}