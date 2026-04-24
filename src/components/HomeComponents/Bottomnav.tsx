"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavItem = {
  name: string;
  logo: string;
  url?: string;
};

const bottomNavData: NavItem[] = [
  { name: "Feed", logo: "/images/feed.png", url: "/MainModules/HomePage" },
  { name: "Watch Along", logo: "/images/watch.png", url: "/MainModules/WatchAlong" },
  { name: "Fan Battle", logo: "/images/battle.png", url: "/MainModules/Fantasy" },
  { name: "Store", logo: "/images/store.png", url: "/MainModules/Store" },
  { name: "Fan Zone", logo: "/images/profile.png", url: "/MainModules/Fanszone" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black border-t border-pink-500/30 py-2 flex justify-around z-50">
      {bottomNavData.map((item, i) => {
        const isActive = item.url ? pathname.startsWith(item.url) : false;

        return (
          <Link
            key={i}
            href={item.url || "#"}
            className="flex flex-col items-center text-[10px] sm:text-xs"
          >
            <div className={`mb-1 transition-opacity ${isActive ? "opacity-100" : "opacity-50"}`}>
              <Image
                src={item.logo}
                alt={item.name}
                width={18}
                height={18}
                className={`object-contain transition-all ${isActive ? "drop-shadow-[0_0_6px_rgba(244,114,182,0.7)]" : ""}`}
              />
            </div>
            <span className={`transition-colors ${isActive ? "text-pink-500 font-semibold" : "text-gray-400"}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}