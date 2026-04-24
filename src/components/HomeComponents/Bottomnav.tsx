"use client";

import Link from "next/link";
import Image from "next/image";

type NavItem = {
  name: string;
  logo: string;
  url?: string;
};

const bottomNavData: NavItem[] = [
  {
    name: "Feed",
    logo: "/images/feed.png",
    url: "/MainModules/HomePage"
  },
  {
    name: "Watch Along",
    logo: "/images/watch.png",
    url: "/MainModules/WatchAlong"
  },
  {
    name: "Fan Battle",
    logo: "/images/battle.png",
  },
  {
    name: "Store",
    logo: "/images/store.png",
     url: "/MainModules/Store"
  },
  {
    name: "Fan Zone",
    logo: "/images/profile.png",
     url: "/MainModules/Fanszone"
  },
];

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-black border-t border-pink-500/30 py-2 flex justify-around z-50">
      {bottomNavData.map((item, i) => (
        <Link 
          key={i}
          href={item.url || "#"} 
          className="flex flex-col items-center text-[10px] sm:text-xs"
        >
          {/* Logo */}
          <div className={`mb-1 ${i === 0 ? "opacity-100" : "opacity-60"}`}>
            <Image
              src={item.logo}
              alt={item.name}
              width={18}
              height={18}
              className="object-contain"
            />
          </div>

          {/* Name */}
          <span className={i === 0 ? "text-pink-500" : "text-gray-400"}>
            {item.name}
          </span>
        </Link>
      ))}
    </div>
  );
}