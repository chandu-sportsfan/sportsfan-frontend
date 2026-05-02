// 'use client';

// import { ArrowLeft } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function CircleCricketClient() {
//   const router = useRouter();

//   return (
//     // Use fixed positioning to escape any parent layout constraints
//     <div className="fixed inset-0 bg-[#05080f] flex flex-col z-40 mb-20">
      
//       {/* Back button — fixed height header */}
//       <div className="flex-shrink-0 px-4 py-3 border-b border-white/5">
//         <button
//           onClick={() => router.back()}
//           className="flex items-center gap-2 text-gray-400 hover:text-white transition group"
//         >
//           <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
//           <span className="text-sm">Back</span>
//         </button>
//       </div>

//       {/* Game — takes all remaining height */}
//       <div className="flex-1 overflow-hidden p-3">
//         <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl p-0.5 h-full ">
//           <div className="bg-[#05080f] rounded-xl overflow-hidden h-full">
//             <iframe
//               src="/circle-cricket-game.html"
//               title="Circle Cricket PRO"
//               className="w-full h-full border-0 block"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//             />
//           </div>
//         </div>
//       </div>

//     </div>
//   );
// }





'use client';
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CircleCricketClient() {
  const router = useRouter();
  return (
    <div className="flex flex-col bg-[#05080f] min-h-screen">
      
      {/* Back button */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-white/5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      <div>
        <Link href="/MainModules/FanBattle" className="ml-auto">
          <button className="text-2xl text-white font-bold px-4 py-3 border-b border-white/5">
           Fan Battle
          </button>
          </Link>
      </div>

      {/* Game */}
      <div className="p-3">
        <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl p-0.5">
          <div className="bg-[#05080f] rounded-xl overflow-hidden">
            <iframe
              src="/circle-cricket-game.html"
              title="Circle Cricket PRO"
              className="w-full border-0 block"
              style={{ height: '80vh' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>

    </div>
  );
}