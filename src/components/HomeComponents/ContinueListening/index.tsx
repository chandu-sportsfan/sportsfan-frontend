// "use client";

// type Item = {
//     id: number;
//     title: string;
//     subtitle: string;
//     image: string;
// };

// const mockData: Item[] = [
//     {
//         id: 1,
//         title: "Rohit Sharma",
//         subtitle: "Captaincy Masterclass",
//         image: "https://images.unsplash.com/photo-1505842465776-3a8c9c90b0f1",
//     },
//     {
//         id: 2,
//         title: "Virat Kohli",
//         subtitle: "Chasing Legends",
//         image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
//     },
//     {
//         id: 3,
//         title: "MS Dhoni",
//         subtitle: "Finisher Stories",
//         image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
//     },
// ];

// export default function ContinueListening() {
//     return (
//         <div className="px-4 py-2 mt-2">
//             {/* Title */}
//             <h2 className="text-pink-500 text-lg sm:text-xl md:text-2xl font-semibold mb-4">
//                 Continue Listening
//             </h2>

//             {/* Horizontal Scroll */}
//             <div className="flex gap-2 overflow-x-auto no-scrollbar">
//                 {mockData.map((item) => (
//                     <div
//                         key={item.id}
//                         className="min-w-[260px] sm:min-w-[300px] md:min-w-[300px] lg:min-w-[300px] h-[72px] sm:h-[72px] md:h-[92px] bg-[background:#1A2B3A] relative rounded-lg overflow-hidden flex-shrink-0"
//                     >

//                         {/* Content */}
//                         <div className="relative z-10 h-full flex items-center justify-center gap-8 px-5">
//                             {/* Play Button */}
//                             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-full flex items-center justify-center">
//                                 ▶
//                             </div>
//                             {/* Text */}
//                             <div>
//                                 <h3 className="text-[#C9115F] font-semibold text-sm sm:text-base md:text-lg">
//                                     {item.title}
//                                 </h3>
//                                 <p className="text-gray-300 text-xs sm:text-sm">
//                                     {item.subtitle}
//                                 </p>
//                             </div>


//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }











// "use client";

// type Item = {
//     id: number;
//     title: string;
//     subtitle: string;
//     image: string;
// };

// const mockData: Item[] = [
//     {
//         id: 1,
//         title: "Rohit Sharma",
//         subtitle: "Captaincy Masterclass",
//         image: "https://images.unsplash.com/photo-1505842465776-3a8c9c90b0f1",
//     },
//     {
//         id: 2,
//         title: "Virat Kohli",
//         subtitle: "Chasing Legends",
//         image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
//     },
//     {
//         id: 3,
//         title: "MS Dhoni",
//         subtitle: "Finisher Stories",
//         image: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
//     },
// ];

// export default function ContinueListening() {
//     return (
//         <div className="px-4 py-2 mt-2">
//             {/* Title */}
//             <h2 className="text-pink-500 text-lg sm:text-xl md:text-2xl font-semibold mb-4">
//                 Continue Listening
//             </h2>

//             {/* Horizontal Scroll - Fixed alignment */}
//             <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
//                 {mockData.map((item, index) => (
//                     <div
//                         key={item.id}
//                         className="min-w-[280px] sm:min-w-[320px] md:min-w-[340px] h-[80px] sm:h-[88px] md:h-[96px] bg-gradient-to-r from-[#1A2B3A] to-[#0f1a24] rounded-xl overflow-hidden flex-shrink-0 transform transition-transform hover:scale-105"
//                         style={{
//                             transform: index % 2 === 0 ? 'rotate(0.5deg)' : 'rotate(-0.3deg)',
//                         }}
//                     >
//                         {/* Content */}
//                         <div className="relative z-10 h-full flex items-center justify-between px-6">
//                             {/* Play Button with pulse effect */}
//                             <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
//                                 <span className="text-white text-sm ml-0.5">▶</span>
//                             </div>
                            
//                             {/* Text */}
//                             <div className="flex-1 ml-4">
//                                 <h3 className="text-[#C9115F] font-semibold text-sm sm:text-base md:text-lg">
//                                     {item.title}
//                                 </h3>
//                                 <p className="text-gray-300 text-xs sm:text-sm">
//                                     {item.subtitle}
//                                 </p>
//                             </div>

//                             {/* Duration badge */}
//                             <div className="bg-black/50 rounded-full px-2 py-1">
//                                 <span className="text-gray-400 text-xs">2d ago</span>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }




// "use client";

// type Item = {
//   id: number;
//   title: string;
//   subtitle: string;
// };

// const mockData: Item[] = [
//   { id: 1, title: "Rohit Sharma", subtitle: "Captaincy Masterclass" },
//   { id: 2, title: "Virat Kohli", subtitle: "Chasing Legends" },
//   { id: 3, title: "MS Dhoni", subtitle: "Finisher Stories" },
// ];

// export default function ContinueListening() {
//   return (
//     <div className="py-2 mt-2">
//       <h2 className="text-pink-500 text-lg sm:text-xl md:text-2xl font-semibold mb-4">
//         Continue Listening
//       </h2>

//       <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
//         {mockData.map((item) => (
//           <div
//             key={item.id}
//             className="min-w-[280px] sm:min-w-[320px] md:min-w-[340px] h-[80px] sm:h-[88px] md:h-[96px] bg-gradient-to-r from-[#1A2B3A] to-[#0f1a24] rounded-xl overflow-hidden flex-shrink-0 hover:brightness-110 transition-all"
//             //  NO style={{ transform: rotate() }} here
//           >
//             <div className="h-full flex items-center justify-between px-6">
//               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-full flex items-center justify-center shadow-lg shrink-0">
//                 <span className="text-white text-sm ml-0.5">▶</span>
//               </div>

//               <div className="flex-1 ml-4">
//                 <h3 className="text-[#C9115F] font-semibold text-sm sm:text-base">
//                   {item.title}
//                 </h3>
//                 <p className="text-gray-300 text-xs sm:text-sm">{item.subtitle}</p>
//               </div>

//               <div className="bg-black/50 rounded-full px-2 py-1 shrink-0">
//                 <span className="text-gray-400 text-xs">2d ago</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }






// src/components/HomeComponents/ContinueListening.tsx
"use client";

type Item = {
  id: number;
  title: string;
  subtitle: string;
};

const mockData: Item[] = [
  { id: 1, title: "Rohit Sharma", subtitle: "Captaincy Masterclass" },
  { id: 2, title: "Virat Kohli", subtitle: "Chasing Legends" },
  { id: 3, title: "MS Dhoni", subtitle: "Finisher Stories" },
];

export default function ContinueListening() {
  return (
    <div className="w-full">
      <h2 className="text-pink-500 text-lg sm:text-xl font-semibold mb-3">
        Continue Listening
      </h2>

      <div className="flex gap-3 overflow-x-auto  [scrollbar-width:none] pb-1">
        {mockData.map((item) => (
          <div
            key={item.id}
           
            className="min-w-[280px] sm:min-w-[320px] h-[80px] sm:h-[88px] bg-gradient-to-r from-[#1A2B3A] to-[#0f1a24] rounded-xl flex-shrink-0 hover:brightness-110 transition-all cursor-pointer"
          >
            <div className="h-full flex items-center gap-4 px-5">
              {/* Play button */}
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xs ml-0.5">▶</span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-[#C9115F] font-semibold text-sm sm:text-base truncate">
                  {item.title}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm truncate">
                  {item.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}