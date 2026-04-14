// "use client";

// import BottomNav from "@/src/components/HomeComponents/Bottomnav";

// export default function MainModulesLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row items-start">

//       {/* Sidebar */}
//       <aside className="hidden lg:flex lg:flex-col w-[240px] shrink-0 border-r border-pink-500/20 self-stretch">
//         <div className="sticky top-0 h-screen overflow-y-auto p-4">
//           <h1 className="text-xl font-bold mb-6">SportsFan360</h1>
//           {["Feed", "Watch Along", "Fan Battle", "Store", "Fan Zone", "Host Dashboard"].map((item) => (
//             <div
//               key={item}
//               className="mb-4 text-gray-400 hover:text-pink-500 cursor-pointer transition-colors"
//             >
              
//               {item}
//             </div>
//           ))}
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 min-w-0 w-full overflow-x-hidden">
//         <div className="w-full max-w-[1600px] mx-auto">
//           {children}
//         </div>

//         <div className="lg:hidden">
//           <BottomNav />
//         </div>
//       </main>
//     </div>
//   );
// }




"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BottomNav from "@/src/components/HomeComponents/Bottomnav";

const navItems = [
  { name: "Feed", path: "/MainModules/Feed" },
  { name: "Watch Along", path: "/MainModules/WatchAlong" },
  { name: "Fan Battle", path: "/MainModules/FanBattle" },
  { name: "Store", path: "/MainModules/Store" },
  { name: "Fan Zone", path: "/MainModules/FanZone" },
  { name: "Host Dashboard", path: "/MainModules/HostDashboard" },
];

export default function MainModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row items-start">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-[240px] shrink-0 border-r border-pink-500/20 self-stretch">
        <div className="sticky top-0 h-screen overflow-y-auto p-4">
          <Link href="/MainModules/HomePage">
            <h1 className="text-xl font-bold mb-6 text-white hover:text-pink-500 transition-colors cursor-pointer">
              SportsFan360
            </h1>
          </Link>

          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.name} href={item.path}>
                <div
                  className={`mb-4 cursor-pointer transition-colors ${
                    isActive
                      ? "text-pink-500 font-semibold"
                      : "text-gray-400 hover:text-pink-500"
                  }`}
                >
                  {item.name}
                </div>
              </Link>
            );
          })}
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