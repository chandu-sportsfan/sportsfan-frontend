"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";

export default function GlobalActionBar() {
  return (
    <>
      {/* Feedback Button - Bottom Right */}
      <div className="fixed bottom-20 right-4 md:bottom-20 md:right-6 lg:bottom-6 lg:right-6 z-50">
        <Link href="/MainModules/Feedback">
          <button
            className="group relative flex items-center justify-center w-7 h-7 lg:w-14 lg:h-14 rounded-full bg-gradient-to-r from-[#C9115F] to-[#e85d04] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Give Feedback"
            title="Give Feedback"
          >
            {/* Tooltip */}
            <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Give Feedback
            </span>

            {/* Icon */}
            <Pencil className="text-white w-3 h-3 md:w-6 md:h-6" />

            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full animate-ping bg-[#C9115F] opacity-40"></span>
          </button>
        </Link>
      </div>
    </>
  );
}
