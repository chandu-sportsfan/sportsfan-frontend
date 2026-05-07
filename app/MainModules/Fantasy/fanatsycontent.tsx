'use client';
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CircleCricketClient() {
  const router = useRouter();
  return (
    // REMOVED max-w-6xl mx-auto from here - let parent control the width
    <div className="flex flex-col bg-[#05080f] w-full">
      
      {/* Back button - uncomment if needed */}
      {/* <div className="flex-shrink-0 px-4 py-3 border-b border-white/5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </button>
      </div> */}

     

      {/* Game */}
      <div className="p-3 w-full">
        <div className=" rounded-xl p-0.5">
          <div className="rounded-xl overflow-hidden">
            <iframe
              src="/circle-cricket-game.html"
              title="Circle Cricket PRO"
              className="w-full border-0 block"
              style={{ height: '80vh', width: '100%' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>

    </div>
  );
}