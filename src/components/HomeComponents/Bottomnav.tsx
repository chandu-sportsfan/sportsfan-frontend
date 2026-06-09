// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import { Sparkles } from "lucide-react";

// type NavItem = {
//   name: string;
//  logo: string | React.ReactElement;
//   url?: string;
// };


// export default function BottomNav() {
//   const pathname = usePathname();
//   const { user } = useAuth();
//   // const isMatchIntelligence = user?.email?.endsWith("@sportsfan360.com");

//   const bottomNavData: NavItem[] = [
//     { name: "Feed", logo: "/images/feed.png", url: "/MainModules/HomePage" },
//     { name: "Watch Along", logo: "/images/watch.png", url: "/MainModules/WatchAlong" },
//     { name: "Fan Battle", logo: "/images/battle.png", url: "/MainModules/Fantasy" },
//     { 
//       name: "Ask AI", 
//       logo: <Sparkles className="w-5 h-5 text-gradient" />,
//       url: "/MainModules/AskAI" 
//     },
//     { name: "Fan Zone", logo: "/images/profile.png", url: "/MainModules/Fanszone" },
//   ];

//   return (
//     <div className="fixed bottom-0 left-0 w-full bg-black border-t border-pink-500/30 py-2 flex justify-around z-40 overflow-x-hidden">
//       {bottomNavData.map((item, i) => {
//         const isActive = item.url ? pathname.startsWith(item.url) : false;

//         return (
//           <Link
//             key={i}
//             href={item.url || "#"}
//             className="flex-1 min-w-0 flex flex-col items-center text-[10px] sm:text-xs"
//           >
//             <div className={`mb-1 transition-opacity ${isActive ? "opacity-100" : "opacity-50"}`}>
//               <Image
//                 src={item.logo}
//                 alt={item.name}
//                 width={18}
//                 height={18}
//                 className={`object-contain transition-all ${isActive ? "drop-shadow-[0_0_6px_rgba(244,114,182,0.7)]" : ""}`}
//               />
//             </div>
//             <span className={`transition-colors truncate max-w-[72px] ${isActive ? "text-pink-500 font-semibold" : "text-gray-400"}`}>
//               {item.name}
//             </span>
//           </Link>
//         );
//       })}
//     </div>
//   );
// }






"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sparkles } from "lucide-react";

// type NavItem = {
//   name: string;
//   logo: string | React.ReactElement;  // changed from string
//   url?: string;
// };

type NavItem = {
  name: string;
  logo?: string | React.ReactElement;
  icon?: React.ReactElement;
  url?: string;
  href?: string;
};

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const bottomNavData: NavItem[] = [
    // { name: "Feed", logo: "/images/feed.png", url: "/MainModules/HomePage" },
    // { name: "Watch Along", logo: "/images/watch.png", url: "/MainModules/WatchAlong" },
    // { name: "Fan Battle", logo: "/images/battle.png", url: "/MainModules/Fantasy" },
    { 
      name: "Roar", 
      logo: "/images/roar.png",
      url: "/MainModules/ROAR" 
    },
      { 
      name: "Ask AI", 
      icon: <Sparkles className="w-5 h-5 text-gradient" />,
      href: "/MainModules/AskAI" 
    },
    { name: "Fan Zone", logo: "/images/profile.png", url: "/MainModules/Fanszone" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black border-t border-pink-500/30 py-2 flex justify-around z-40 overflow-x-hidden">
      {bottomNavData.map((item, i) => {
        const isActive = item.url ? pathname.startsWith(item.url) : false;

        return (
          <Link
            key={i}
            href={item.url || "#"}
            className="flex-1 min-w-0 flex flex-col items-center text-[10px] sm:text-xs"
          >
            <div className={`mb-1 transition-opacity ${isActive ? "opacity-100" : "opacity-50"}`}>
              {typeof item.logo === "string" ? (  // changed: branch on type
                <Image
                  src={item.logo}
                  alt={item.name}
                  width={18}
                  height={18}
                  className={`object-contain transition-all ${isActive ? "drop-shadow-[0_0_6px_rgba(244,114,182,0.7)]" : ""}`}
                />
              ) : (
                <span className={`transition-all ${isActive ? "text-pink-500 drop-shadow-[0_0_6px_rgba(244,114,182,0.7)]" : "text-gray-400"}`}>
                  {item.logo}
                </span>
              )}
            </div>
            <span className={`transition-colors truncate max-w-[72px] ${isActive ? "text-pink-500 font-semibold" : "text-gray-400"}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}