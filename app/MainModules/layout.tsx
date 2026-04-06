

"use client";

import BottomNav from "@/src/components/HomeComponents/Bottomnav";

export default function MainModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row items-start">

      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-[240px] shrink-0 border-r border-pink-500/20 self-stretch">
        <div className="sticky top-0 h-screen overflow-y-auto p-4">
          <h1 className="text-xl font-bold mb-6">SportsFan360</h1>
          {["Feed", "Live", "Fantasy", "Store", "Fan Zone"].map((item) => (
            <div
              key={item}
              className="mb-4 text-gray-400 hover:text-pink-500 cursor-pointer transition-colors"
            >
              {item}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 w-full overflow-x-hidden">
        <div className="w-full max-w-[1600px] mx-auto">
          {children}
        </div>

        <div className="lg:hidden">
          <BottomNav />
        </div>
      </main>
    </div>
  );
}
