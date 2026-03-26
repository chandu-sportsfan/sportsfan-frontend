"use client";

import { Bell, MessageCircle, Menu, Search, Home } from "lucide-react";

export default function Header() {
  return (
    <div className="p-4 border-b border-pink-500/30">
      
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">SportsFan360</h1>

        <div className="flex gap-3">
          <div className="p-2 rounded-full border border-pink-500">
            <Bell size={16} />
          </div>

          <div className="p-2 rounded-full border border-pink-500">
            <MessageCircle size={16} />
          </div>

          <div className="p-2 rounded-full border border-pink-500">
            <Menu size={16} />
          </div>
        </div>
      </div>

      {/* Search Row */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex items-center gap-2 bg-[#0d1117] px-3 py-2 rounded-full w-full border border-pink-500/20">
          <Search size={16} className="text-pink-500" />

          <input
            placeholder="Search players, teams, stats..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        <div className="p-2 border border-pink-500 rounded-full">
          <Home size={16} />
        </div>
      </div>
    </div>
  );
}