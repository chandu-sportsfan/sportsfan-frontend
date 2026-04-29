// // "use client";

// // import BottomNav from "@/src/components/HomeComponents/Bottomnav";

// // export default function MainModulesLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   return (
// //     <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row items-start">

// //       {/* Sidebar */}
// //       <aside className="hidden lg:flex lg:flex-col w-[240px] shrink-0 border-r border-pink-500/20 self-stretch">
// //         <div className="sticky top-0 h-screen overflow-y-auto p-4">
// //           <h1 className="text-xl font-bold mb-6">SportsFan360</h1>
// //           {["Feed", "Watch Along", "Fan Battle", "Store", "Fan Zone", "Host Dashboard"].map((item) => (
// //             <div
// //               key={item}
// //               className="mb-4 text-gray-400 hover:text-pink-500 cursor-pointer transition-colors"
// //             >

// //               {item}
// //             </div>
// //           ))}
// //         </div>
// //       </aside>

// //       {/* Main Content */}
// //       <main className="flex-1 min-w-0 w-full overflow-x-hidden">
// //         <div className="w-full max-w-[1600px] mx-auto">
// //           {children}
// //         </div>

// //         <div className="lg:hidden">
// //           <BottomNav />
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }




// "use client";


// import BottomNav from "@/src/components/HomeComponents/Bottomnav";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";



// export default function MainModulesLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();

//   const sidebarItems = [
//     { name: "Feed", icon: "/images/feed.png", href: "/MainModules/HomePage" },
//     { name: "Live", icon: "/images/live.png", href: "/MainModules/WatchAlong" },
//     { name: "Fantasy", icon: "/images/battle.png", href: "/MainModules/DropScreen" },
//     { name: "Store", icon: "/images/store.png", href: "#" },
//     { name: "Fan Zone", icon: "/images/profile.png", href: "/MainModules/PlayersProfile" },
//     { name: "Host Dashboard", icon: "/images/profile.png", href: "/MainModules/HostDashboard" },
//   ];

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row items-start">
//       {/* Sidebar */}
//       <aside className="group hidden lg:flex lg:flex-col w-[84px] hover:w-[248px] shrink-0 border-r border-pink-500/20 self-stretch transition-all duration-300 ease-out bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
//         <div className="sticky top-0 h-screen overflow-y-auto px-3 py-4">
//           <div className="mb-8 h-10 flex items-center justify-center group-hover:justify-start transition-all duration-300">
//             <Image src="/images/Logo.png" alt="SportsFan360 logo" width={34} height={40} className="shrink-0" />
//             <span className="ml-3 text-lg font-bold whitespace-nowrap opacity-0 -translate-x-2 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:translate-x-0 group-hover:max-w-[160px] transition-all duration-300">
//               SportsFan360
//             </span>
//           </div>

//           <nav className="space-y-2">
//             {sidebarItems.map((item) => {
//               const isActive =
//                 item.href !== "#" &&
//                 (pathname === item.href || pathname.startsWith(`${item.href}/`));

//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`mx-auto flex w-12 group-hover:w-full items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3 rounded-xl px-0 group-hover:px-3 py-2.5 transition-all duration-300 ${isActive
//                       ? "text-pink-300 bg-pink-500/15 ring-1 ring-pink-400/40"
//                       : "text-gray-300 hover:text-pink-400 hover:bg-white/5"
//                     }`}
//                 >
//                   <Image
//                     src={item.icon}
//                     alt={`${item.name} icon`}
//                     width={22}
//                     height={22}
//                     className={`shrink-0 transition-all duration-300 ${isActive ? "brightness-75 contrast-90 drop-shadow-[0_0_6px_rgba(244,114,182,0.5)]" : "brightness-55 contrast-90"}`}
//                   />
//                   <span className="whitespace-nowrap opacity-0 -translate-x-2 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:translate-x-0 group-hover:max-w-[140px] transition-all duration-300">
//                     {item.name}
//                   </span>
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 min-w-0 w-full overflow-x-hidden">
//         <div className="w-full max-w-[1600px] mx-auto">
//           {children}
//         </div>

//         <div className="lg:hidden">
//           <BottomNav />
//         </div>
//       </main>
//     </div>
//   );
// }





"use client";

import BottomNav from "@/src/components/HomeComponents/Bottomnav";
import InviteFriendModal from "@/src/components/InviteFriendModal";
import axios from "axios";
import { UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// ─── Types 
interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  role: "host" | "user";
  status: string;
}

// ─── Host Sidebar (for Host users) 
function HostSidebar({ user }: { user: UserProfile }) {
  const pathname = usePathname();

  const hostItems = [
    {
      name: "Dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      href: "/MainModules/HostDashboard",
    },
    {
      name: "Analytics",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      href: "/MainModules/LiveRoomControlPanel",
    },
    {
      name: "Profile",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      href: "/MainModules/HostDashboard/Profile",
    },
    {
      name: "Settings",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: "/MainModules/HostDashboard/Settings",
    },
    {
      name: "Menu",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      href: "/MainModules/HostDashboard/Menu",
    },
  ];

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";

  return (
    <aside className="group hidden lg:flex lg:flex-col w-[72px] hover:w-[240px] shrink-0 border-r border-white/5 self-stretch transition-all duration-300 ease-out bg-[#111113]">
      <div className="sticky top-0 h-screen overflow-y-auto flex flex-col px-3 py-5">

        {/* User Profile Header */}
        <div className="mb-6 flex items-center gap-0 group-hover:gap-3 overflow-hidden transition-all duration-300">
          <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
          <div className="opacity-0 -translate-x-2 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:translate-x-0 group-hover:max-w-[160px] transition-all duration-300 whitespace-nowrap">
            <p className="text-sm font-semibold text-white leading-tight">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
          </div>
        </div>

        <div className="mb-4 h-px bg-white/5" />

        <nav className="space-y-1 flex-1">
          {hostItems.map((item) => {
            const isActive =
              item.href !== "#" &&
              (pathname === item.href || pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3 rounded-xl px-0 group-hover:px-3 py-2.5 w-10 group-hover:w-full mx-auto transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500/20 to-pink-600/20 text-white ring-1 ring-orange-400/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={isActive ? "text-orange-400" : ""}>{item.icon}</span>
                <span className="whitespace-nowrap text-sm font-medium opacity-0 -translate-x-2 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:translate-x-0 group-hover:max-w-[140px] transition-all duration-300">
                  {item.name}
                </span>
                {isActive && (
                  <span className="absolute left-1 w-1 h-5 rounded-full bg-gradient-to-b from-orange-400 to-pink-500 group-hover:hidden" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

// ─── User Sidebar (for regular users) ──────────────────────────────────────────
function UserSidebar() {
  const pathname = usePathname();

  const sidebarItems = [
    { name: "Feed", icon: "/images/feed.png", href: "/MainModules/HomePage" },
    { name: "Watch Along", icon: "/images/live.png", href: "/MainModules/WatchAlong" },
    { name: "Fantasy", icon: "/images/battle.png", href: "/MainModules/Fantasy" },
    { name: "Store", icon: "/images/store.png", href: "/MainModules/Store" },
    { name: "Fan Zone", icon: "/images/profile.png", href: "/MainModules/Fanszone" },
  ];

  return (
    <aside className="group hidden lg:flex lg:flex-col w-[84px] hover:w-[248px] shrink-0 border-r border-pink-500/20 self-stretch transition-all duration-300 ease-out bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
      <div className="sticky top-0 h-screen overflow-y-auto px-3 py-4">
        <Link href="/MainModules/HomePage" className="mb-8 h-10 flex items-center justify-center group-hover:justify-start transition-all duration-300 rounded-xl hover:bg-white/5 px-0 group-hover:px-3">
          <Image src="/images/Logo.png" alt="SportsFan360 logo" width={34} height={40} className="shrink-0" />
          <span className="ml-3 text-lg font-bold whitespace-nowrap opacity-0 -translate-x-2 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:translate-x-0 group-hover:max-w-[160px] transition-all duration-300">
            SportsFan360
          </span>
        </Link>

        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive =
              item.href !== "#" &&
              (pathname === item.href || pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`mx-auto flex w-12 group-hover:w-full items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3 rounded-xl px-0 group-hover:px-3 py-2.5 transition-all duration-300 ${
                  isActive
                    ? "text-pink-300 bg-pink-500/15 ring-1 ring-pink-400/40"
                    : "text-gray-300 hover:text-pink-400 hover:bg-white/5"
                }`}
              >
                <Image
                  src={item.icon}
                  alt={`${item.name} icon`}
                  width={22}
                  height={22}
                  className={`shrink-0 transition-all duration-300 ${
                    isActive
                      ? "brightness-75 contrast-90 drop-shadow-[0_0_6px_rgba(244,114,182,0.5)]"
                      : "brightness-55 contrast-90"
                  }`}
                />
                <span className="whitespace-nowrap opacity-0 -translate-x-2 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:translate-x-0 group-hover:max-w-[140px] transition-all duration-300">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function MainModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await axios.get("/api/auth/host/me", {
          withCredentials: true,
        });
        console.log("response data :", response)
        if (response.data?.success && response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
         if (axios.isAxiosError(error) && error.response?.status === 401) {
            return; // silently ignore, Google session handles auth
        }
        console.error("fetchCurrentUser error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentUser();
  }, []);

  // Show appropriate sidebar based on user role
  const renderSidebar = () => {
    if (loading) {
      return <aside className="hidden lg:flex w-[84px] shrink-0 border-r border-white/5 self-stretch bg-black" />;
    }
    
    // Host users get HostSidebar
    if (user?.role === "host") {
      return <HostSidebar user={user} />;
    }
    
    // Regular users get UserSidebar
    return <UserSidebar />;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row items-start">
      {renderSidebar()}

      <main className="flex-1 min-w-0 w-full overflow-x-hidden">
        <div className="w-full max-w-[1600px] mx-auto">{children}</div>

        <div className="fixed bottom-27 right-6 md:bottom-22 md:right-6 z-50">
          <button
            onClick={() => setIsInviteOpen(true)}
            className="group relative flex items-center justify-center w-7 h-7 lg:w-14 lg:h-14 rounded-full bg-gradient-to-r from-[#C9115F] to-[#e85d04] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Invite a Friend"
          >
            <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Invite a Friend
            </span>

            <UserPlus className="text-white w-3 h-3 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="lg:hidden">
          <BottomNav />
        </div>
      </main>

      <InviteFriendModal
        open={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        shareUrl={pathname}
      />
    </div>
  );
}