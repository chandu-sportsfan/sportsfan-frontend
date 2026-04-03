// app/MainModules/layout.tsx
"use client";

import Sidebar from "@/src/components/HomeComponents/Sidebar";
import BottomNav from "@/src/components/HomeComponents/Bottomnav";

export default function MainModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white lg:grid lg:grid-cols-[240px_1fr]">
      
      {/* Sidebar */}
      <div className="hidden lg:block bg-black border-r border-pink-500/20">
        <div className="sticky top-0 h-screen overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-6">SportsFan360</h1>
          {["Feed", "Live", "Fantasy", "Store", "Fan Zone"].map((item) => (
            <div key={item} className="mb-4 text-gray-400 hover:text-pink-500 cursor-pointer">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          {children}
        </div>
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}