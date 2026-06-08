"use client";

import ROARApp from "@/src/components/ROARComponent";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ROARPage() {
  return (
    <div className="relative min-h-screen pt-8 pb-15 px-4 lg:px-8 max-w-7xl mx-auto w-full">
      <Link href="/MainModules/HomePage" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition cursor-pointer bg-transparent border-none">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>
      </Link>
      <ROARApp />
    </div>
  );
}
