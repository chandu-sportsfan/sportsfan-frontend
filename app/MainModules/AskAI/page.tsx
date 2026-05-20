//"use client";
//
//import React from "react";
//import { X } from "lucide-react";
//import { useRouter } from "next/navigation";
//import AskAI from "@/src/components/AskAI/AskAI";
//
//export default function AskAIPage() {
//  const router = useRouter();
//
//  return (
//    <div className="flex flex-col w-full relative">
//      <button
//        type="button"
//        onClick={() => router.back()}
//        className="absolute top-4 right-4 z-20 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-white hover:bg-white/10 transition-colors"
//        aria-label="Close Ask AI page"
//      >
//        <span>Close</span>
//        <X className="h-4 w-4" />
//      </button>
//
//      <div className="w-full flex items-center justify-center px-4 lg:px-6 py-0 min-h-screen pb-56 lg:pb-72">
//        <div className="w-full max-w-[1200px]">
//          <AskAI />
//        </div>
//      </div>
//    </div>
//  );
//}
"use client";

import React from "react";

export default function AskAIPage() {
  return (
    <div className="w-full h-[calc(100vh-104px)] md:h-[calc(100vh-64px)] overflow-hidden bg-black">
      <iframe
        src="https://ask-ai-two-murex.vercel.app/"
        className="w-full h-full border-0"
        title="Ask AI"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}