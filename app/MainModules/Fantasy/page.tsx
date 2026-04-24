// 'use client'

// import { ArrowLeft } from "lucide-react";
// import type { Metadata } from "next";
// import { useRouter } from "next/navigation";
// export const metadata: Metadata = {
//   title: "Circle Cricket PRO - Play Cricket Game | SportsFan360",
//   description: "Play Circle Cricket PRO - an interactive cricket game",
// };

// export default function CircleCricketPage() {
//     const router = useRouter()
//   return (
//     <div className="min-h-screen bg-[#05080f]">
//       <div className="container mx-auto px-4 py-8">
//         <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl p-0.5">
//              {/* Back button */}
//             <button
//                 onClick={() => router.back()}
//                 className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
//             >
//                 <ArrowLeft size={18} />
//                 <span className="text-sm">Back</span>
//             </button>

//           <div className="bg-[#05080f] rounded-xl overflow-hidden">
//             <iframe
//               src="/circle-cricket-game.html"
//               title="Circle Cricket PRO"
//               className="w-full h-[800px] border-0"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import type { Metadata } from "next";
import CircleCricketClient from "./fanatsycontent";
export const metadata: Metadata = {
  title: "Circle Cricket PRO - Play Cricket Game | SportsFan360",
  description: "Play Circle Cricket PRO - an interactive cricket game where you bat against the computer. Choose your difficulty and format!",
  openGraph: {
    title: "Circle Cricket PRO | SportsFan360",
    description: "Interactive cricket batting game - Play now!",
    images: ["/images/circle-cricket-og.jpg"],
  },
};

export default function CircleCricketPage() {
  return <CircleCricketClient />;
}