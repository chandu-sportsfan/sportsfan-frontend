'use client';

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CircleCricketClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#05080f]">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </button>

        <div className="bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl p-0.5">
          <div className="bg-[#05080f] rounded-xl overflow-hidden">
            <iframe
              src="/circle-cricket-game.html"
              title="Circle Cricket PRO"
              className="w-full h-[800px] border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
}