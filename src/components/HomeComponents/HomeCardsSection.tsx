// "use client";

// type Stat = {
//   label: string;
//   value: string;
// };

// type CardProps = {
//   id: number;
//   title: string;
//   subtitle: string;
//   image: string;
//   stats: Stat[];
//   buttonText: string;
//   buttonIcon?: "play" | "chart";
// };

// /* ---------------- MOCK DATA ---------------- */
// const homeCardsData: CardProps[] = [
//   {
//     id: 1,
//     title: "SportsFan360",
//     subtitle: "Your ultimate sports companion",
//     image:
//       "https://images.unsplash.com/photo-1505842465776-3a8c9c90b0f1",
//     stats: [
//       { label: "Sports", value: "12+" },
//       { label: "Athletes", value: "500+" },
//       { label: "Active", value: "1.8M" },
//     ],
//     buttonText: "Discover More",
//     buttonIcon: "chart",
//   },
//   {
//     id: 2,
//     title: "IPL T20 2026 360World",
//     subtitle: "Exclusive content from all 10 teams",
//     image:
//       "https://images.unsplash.com/photo-1546519638-68e109498ffc",
//     stats: [
//       { label: "Teams", value: "10" },
//       { label: "Drops", value: "450+" },
//       { label: "Fans", value: "2.3M" },
//     ],
//     buttonText: "Explore 360World",
//     buttonIcon: "play",
//   },
// ];

// /* ---------------- COMPONENT ---------------- */
// export default function HomeCardsSection() {
//   return (
//     <div className="px-4 mt-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {homeCardsData.map((card) => (
//           <div key={card.id} className="bg-[#111] rounded-2xl p-4 shadow-lg">
//             {/* Image */}
//             <div className="relative rounded-xl overflow-hidden">
//               <img src={card.image} className="w-full h-40 object-cover" />

//               <div className="absolute bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
//                 <h2 className="text-lg font-bold">{card.title}</h2>
//                 <p className="text-sm text-gray-300">
//                   {card.subtitle}
//                 </p>
//               </div>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-3 gap-3 mt-4 text-center">
//               {card.stats.map((stat, i) => (
//                 <div key={i} className="bg-[#1c1c1c] p-3 rounded-lg">
//                   <p className="text-gray-400 text-xs">{stat.label}</p>
//                   <p className="font-semibold">{stat.value}</p>
//                 </div>
//               ))}
//             </div>

//             {/* Button */}
//             <button className="mt-4 w-full bg-gradient-to-r from-pink-500 to-orange-500 py-3 rounded-full font-semibold flex items-center justify-center gap-2">
//               {card.buttonIcon === "play" ? "▶" : "📈"}{" "}
//               {card.buttonText}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }











"use client";

type Stat = {
  label: string;
  value: string;
};

type CardProps = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  stats: Stat[];
  buttonText: string;
  buttonIcon?: "play" | "chart";
};

/* ---------------- MOCK DATA ---------------- */
const homeCardsData: CardProps[] = [
  {
    id: 1,
    title: "SportsFan360",
    subtitle: "Your ultimate sports companion",
    image:
      "/images/sportsfan360.png",
    stats: [
      { label: "Sports", value: "12+" },
      { label: "Athletes", value: "500+" },
      { label: "Active", value: "1.8M" },
    ],
    buttonText: "Discover More",
    buttonIcon: "chart",
  },
  {
    id: 2,
    title: "IPL T20 2026 360World",
    subtitle: "Exclusive content from all 10 teams",
    image:
      "/images/ipl360.jpg",
    stats: [
      { label: "Teams", value: "10" },
      { label: "Drops", value: "450+" },
      { label: "Fans", value: "2.3M" },
    ],
    buttonText: "Explore 360World",
    buttonIcon: "play",
  },
];

/* ---------------- COMPONENT ---------------- */
export default function HomeCardsSection() {
  return (
    <div className="mt-6">
      {/* Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {homeCardsData.map((card) => (
          <div
            key={card.id}
            className="min-w-[200px] max-w-[256px] h-[263px] snap-start bg-[#111] rounded-2xl p-2 shadow-lg"
          >
            {/* Image */}
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={card.image}
                className="w-[256px] h-[140px] object-fit rounded-lg"
              />

              <div className="absolute bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
                <h2 className="text-[16px] font-bold">{card.title}</h2>
                <p className="text-[12px] text-gray-300">
                  {card.subtitle}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-2 text-center">
              {card.stats.map((stat, i) => (
                <div key={i} className="bg-[#1c1c1c] p-3 rounded-lg">
                  <p className="text-gray-400 text-[10px]">{stat.label}</p>
                  <p className="font-semibold text-[14px]">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Button */}
            <button className="mt-2 w-full bg-gradient-to-r from-pink-500 to-orange-500 py-1 rounded-full font-semibold text-[14px] flex items-center justify-center gap-2">
              {card.buttonIcon === "play" ? "▶" : "📈"}{" "}
              {card.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}