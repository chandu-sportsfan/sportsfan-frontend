"use client";

import ROARApp from "@/src/components/NewROARComponent";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ROARPage() {
  return (
    <div className="relative w-full" style={{ padding: "32px 16px 60px", maxWidth: "1280px", margin: "0 auto" }}>
      {/* <Link href="/MainModules/HomePage" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition cursor-pointer bg-transparent border-none">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>
      </Link> */}
      {/* Give ROARApp a fixed viewport height so its internal absolute/flex children don't collapse */}
      <div style={{ height: "calc(100vh - 140px)", minHeight: "600px", borderRadius: "24px", overflow: "hidden" }}>
        <ROARApp />
      </div>
    </div>
  );
}
