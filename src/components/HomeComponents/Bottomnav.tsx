// export default function BottomNav() {
//   return (
//     <div className="fixed bottom-0 left-0 w-full bg-black border-t border-pink-500/30 py-3 flex justify-around z-50">
//       {["Feed", "Live", "Fantasy", "Store", "Fan Zone"].map((item, i) => (
//         <div key={i} className="flex flex-col items-center text-xs text-gray-400">
//           <div className={`mb-1 ${i === 0 ? "text-pink-500" : ""}`}>
//             ●
//           </div>
//           {item}
//         </div>
//       ))}
//     </div>
//   );
// }







"use client";

import Image from "next/image";

type NavItem = {
  name: string;
  logo: string;
};

const bottomNavData: NavItem[] = [
  {
    name: "Feed",
    logo: "/images/feed.png",
  },
  {
    name: "Live",
    logo: "/images/watch.png",
  },
  {
    name: "Battle",
    logo: "/images/battle.png",
  },
  {
    name: "Store",
    logo: "/images/store.png",
  },
  {
    name: "Fan Zone",
    logo: "/images/profile.png",
  },
];

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-black border-t border-pink-500/30 py-2 flex justify-around z-50">
      {bottomNavData.map((item, i) => (
        <div
          key={i}
          className="flex flex-col items-center text-[10px] sm:text-xs text-gray-400"
        >
          {/* Logo */}
          <div
            className={`mb-1 ${
              i === 0 ? "opacity-100" : "opacity-60"
            }`}
          >
            <Image
              src={item.logo}
              alt={item.name}
              width={18}
              height={18}
              className="object-contain"
            />
          </div>

          {/* Name */}
          <span
            className={`${
              i === 0 ? "text-pink-500" : "text-gray-400"
            }`}
          >
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}