



// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { ChevronRight } from "lucide-react";

// const tabs = ["All", "Cricket", "Football"];

// type CardItem = {
//   id: number;
//   title: string;
//   subtitle: string;
//   image: string;
//   url: string;
// };

// type QuickLink = {
//   label: string;
//   icon: string;
//   badge: string | null;
//   badgeColor: string;
//   href: string;
// };

// const quickLinks: QuickLink[] = [
//   { label: "Match Centre", icon: "🏟️", badge: "LIVE", badgeColor: "bg-red-500", href: "/MainModules/Matchcenter" },
//   { label: "Predictions", icon: "🎯", badge: "New", badgeColor: "bg-orange-500", href: "/MainModules/Predictions" },
//   { label: "Community Groups", icon: "👥", badge: null, badgeColor: "", href: "/MainModules/CommunityGroups" },
//   { label: "Fan Battle", icon: "⚔️", badge: null, badgeColor: "", href: "/MainModules/FanBattle" },
// ];

// const cards: CardItem[] = [
//   {
//     id: 1,
//     title: "IPL T20 2026 360World",
//     subtitle: "Exclusive content from all 10 teams",
//     image: "/images/ipl360.jpg",
//     url: "/MainModules/MatchesDropContent",
//   },
//   {
//     id: 2,
//     title: "FIFA World Cup 2026",
//     subtitle: "The world's biggest football tournament",
//     image: "/images/fifa2026.png",
//     url: "/MainModules/MatchesDropContent?team=FIFA",
//   },
//   {
//     id: 3,
//     title: "Women's T20 2026",
//     subtitle: "Exclusive coverage of women's cricket",
//     image: "/images/womens_t20.jpg",
//     url: "/MainModules/MatchesDropContent?team=Women%20T20",
//   },
//   {
//     id: 4,
//     title: "SportsFan360",
//     subtitle: "Your ultimate sports companion",
//     image: "/images/sportsfan360.jpeg",
//     url: "/MainModules/CricketArticles",
//   },
//   {
//     id: 5,
//     title: "My Playlists",
//     subtitle: "All your favorite sports content in one place",
//     image: "/images/cricketarticlessecond.jpg",
//     url: "/MainModules/Playlists",
//   },
// ];

// export default function NewHomePage() {
//   const [activeTab, setActiveTab] = useState("All");

//   return (
//     <div className="bg-black text-white">
//       <div className="max-w-6xl mx-auto px-0.5 pb-6 pt-5">

//         {/* Tab Bar */}
//         <div className="flex gap-2 overflow-x-auto pb-2 mb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === tab
//                   ? "bg-[#7a2000] text-white"
//                   : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
//                 }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Cards Row */}
//         <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
//           {cards.map((card, index) => (
//             <Link
//               key={card.id}
//               href={card.url}
//               className="snap-start flex-shrink-0 w-[calc(100%-24px)] lg:w-[260px]"
//             >
//               <div className="relative bg-[#111] rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-200">
//                 <div className="relative w-full h-[190px] lg:h-[165px]">
//                   <Image
//                     src={card.image}
//                     alt={card.title}
//                     fill
//                     className="object-cover"
//                   />
//                   {/* Gradient overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

//                   {/* Arrow icon — mobile only, top right */}
//                   <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center lg:hidden">
//                     <ChevronRight size={16} className="text-white" />
//                   </div>

//                   {/* Card counter — mobile only, top left */}
//                   <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5 lg:hidden">
//                     <span className="text-white text-[10px] font-semibold">{index + 1}/{cards.length}</span>
//                   </div>

//                   {/* Text */}
//                   <div className="absolute bottom-0 left-0 right-0 p-4">
//                     <h2 className="text-[15px] lg:text-[16px] font-bold leading-tight">{card.title}</h2>
//                     <p className="text-[11px] text-gray-300 mt-1">{card.subtitle}</p>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         {/* Quick Links Row — swipeable on mobile, grid on desktop */}
//         <div className="flex gap-3 overflow-x-auto mt-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:overflow-visible">
//           {quickLinks.map((link) => (
//             <Link key={link.label} href={link.href} className="flex-shrink-0 lg:flex-shrink block">
//               <div className="relative bg-[#1a0800] border border-[#2e1200] rounded-2xl flex flex-col items-center justify-center gap-2 lg:gap-3 hover:bg-[#261000] transition-colors cursor-pointer w-[120px] h-[105px] lg:w-full lg:h-[110px] lg:p-5">
//                 {link.badge && (
//                   <span className={`absolute -top-2 left-1/2 -translate-x-1/2 ${link.badgeColor} text-white text-[9px] lg:text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap`}>
//                     {link.badge}
//                   </span>
//                 )}
//                 <span className="text-3xl lg:text-3xl">{link.icon}</span>
//                 <span className="text-white text-[11px] lg:text-[12px] font-semibold text-center leading-tight px-1">
//                   {link.label}
//                 </span>
//               </div>
//             </Link>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }





"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const tabs = ["All", "Cricket", "Football"];

type CardItem = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  url: string;
};

type QuickLink = {
  label: string;
  icon: string;
  badge: string | null;
  badgeColor: string;
  href: string;
};

const quickLinks: QuickLink[] = [
  { label: "Match Centre",     icon: "🏟️", badge: "LIVE", badgeColor: "bg-red-500",    href: "/MainModules/Matchcenter"     },
  { label: "Predictions",      icon: "🎯", badge: "New",  badgeColor: "bg-orange-500", href: "/MainModules/Predictions"     },
  { label: "Community Groups", icon: "👥", badge: null,   badgeColor: "",              href: "/MainModules/Chat" },
  { label: "Fan Battle",       icon: "⚔️", badge: null,   badgeColor: "",              href: "/MainModules/Fantasy"       },
];

const cards: CardItem[] = [
  {
    id: 1,
    title: "IPL T20 2026 360World",
    subtitle: "Exclusive content from all 10 teams",
    image: "/images/ipl360.jpg",
    url: "/MainModules/MatchesDropContent",
  },
  {
    id: 2,
    title: "FIFA World Cup 2026",
    subtitle: "The world's biggest football tournament",
    image: "/images/fifa2026.png",
    url: "/MainModules/MatchesDropContent?team=FIFA",
  },
  {
    id: 3,
    title: "Women's T20 2026",
    subtitle: "Exclusive coverage of women's cricket",
    image: "/images/womens_t20.jpg",
    url: "/MainModules/MatchesDropContent?team=Women%20T20",
  },
  {
    id: 4,
    title: "SportsFan360",
    subtitle: "Your ultimate sports companion",
    image: "/images/sportsfan360.jpeg",
    url: "/MainModules/CricketArticles",
  },
  {
    id: 5,
    title: "My Playlists",
    subtitle: "All your favorite sports content in one place",
    image: "/images/cricketarticlessecond.jpg",
    url: "/MainModules/Playlists",
  },
];

export default function NewHomePage() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeCard, setActiveCard] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth - 24; // matches w-[calc(100%-24px)]
    const index = Math.round(el.scrollLeft / (cardWidth + 12)); // 12 = gap-3
    setActiveCard(Math.min(index, cards.length - 1));
  };

  return (
    <div className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-0.5 pb-6 pt-5">

        {/* Tab Bar */}
        {/* <div className="flex gap-2 overflow-x-auto pb-2 mb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#7a2000] text-white"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div> */}

        {/* Cards Row */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        >
          {cards.map((card) => (
            <Link
              key={card.id}
              href={card.url}
              className="snap-start flex-shrink-0 w-[calc(100%-24px)] lg:w-[260px]"
            >
              <div className="relative bg-[#111] rounded-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-200">
                <div className="relative w-full h-[190px] lg:h-[165px]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h2 className="text-[15px] lg:text-[16px] font-bold leading-tight">{card.title}</h2>
                    <p className="text-[11px] text-gray-300 mt-1">{card.subtitle}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Dot indicators — mobile only */}
        <div className="flex items-center justify-center gap-1.5 mt-3 lg:hidden">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === activeCard
                  ? "w-5 h-2 bg-[#C9115F]"
                  : "w-2 h-2 bg-neutral-600"
              }`}
            />
          ))}
        </div>

        {/* Quick Links Row — swipeable on mobile, grid on desktop */}
        <div className="flex gap-3 overflow-x-auto mt-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex-shrink-0 lg:flex-shrink-[unset] block pt-3"
            >
              <div className="relative bg-[#1a0800] border border-orange-200 rounded-2xl flex flex-col items-center justify-center gap-2 lg:gap-3 hover:bg-[#261000] transition-colors cursor-pointer w-[120px] h-[105px] lg:w-full lg:h-[110px] lg:p-5">
                {link.badge && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 ${link.badgeColor} text-white text-[9px] lg:text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap z-10`}>
                    {link.badge}
                  </span>
                )}
                <span className="text-3xl">{link.icon}</span>
                <span className="text-white text-[11px] lg:text-[12px] font-semibold text-center leading-tight px-2">
                  {link.label}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}