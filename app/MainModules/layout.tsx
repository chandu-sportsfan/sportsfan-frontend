

"use client";

import BottomNav from "@/src/components/HomeComponents/Bottomnav";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MainModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const sidebarItems = [
    { name: "Feed", icon: "/images/feed.png", href: "/MainModules/HomePage" },
    { name: "Live", icon: "/images/live.png", href: "/MainModules/WatchAlong" },
    { name: "Fantasy", icon: "/images/battle.png", href: "/MainModules/DropScreen" },
    { name: "Store", icon: "/images/store.png", href: "#" },
    { name: "Fan Zone", icon: "/images/profile.png", href: "/MainModules/PlayersProfile" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row items-start">

      {/* Sidebar */}
      <aside className="group hidden lg:flex lg:flex-col w-[84px] hover:w-[248px] shrink-0 border-r border-pink-500/20 self-stretch transition-all duration-300 ease-out bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
        <div className="sticky top-0 h-screen overflow-y-auto px-3 py-4">
          <div className="mb-8 h-10 flex items-center justify-center group-hover:justify-start transition-all duration-300">
            <Image src="/images/Logo.png" alt="SportsFan360 logo" width={34} height={40} className="shrink-0" />
            <span className="ml-3 text-lg font-bold whitespace-nowrap opacity-0 -translate-x-2 max-w-0 overflow-hidden group-hover:opacity-100 group-hover:translate-x-0 group-hover:max-w-[160px] transition-all duration-300">
              SportsFan360
            </span>
          </div>

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
                    className={`shrink-0 transition-all duration-300 ${isActive ? "brightness-75 contrast-90 drop-shadow-[0_0_6px_rgba(244,114,182,0.5)]" : "brightness-55 contrast-90"}`}
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

      {/* Main Content */}
      <main className="flex-1 min-w-0 w-full overflow-x-hidden">
        <div className="w-full max-w-[1600px] mx-auto">
          {children}
        </div>

        <div className="lg:hidden">
          <BottomNav />
        </div>
      </main>
    </div>
  );
}
