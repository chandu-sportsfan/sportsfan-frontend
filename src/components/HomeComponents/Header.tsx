// "use client";

// import { Bell, MessageCircle, Menu, Search, Home } from "lucide-react";
// import LogoutButton from "./LogoutButton";

// export default function Header() {
//   return (
//     <div className="p-4 border-pink-500/30">
      
//       {/* Top Row */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-lg font-semibold">SportsFan360</h1>

//         <div className="flex gap-3">
//           <div className="p-2 rounded-full border border-pink-500">
//             <Bell size={16} />
//           </div>

//           <div className="p-2 rounded-full border border-pink-500">
//             <MessageCircle size={16} />
//           </div>
         
//           <div className="p-2 rounded-full border border-pink-500">
//             <Menu size={16} />
//           </div>
//            <LogoutButton />

//         </div>
//       </div>

//       {/* Search Row */}
//       <div className="mt-4 flex items-center gap-2">
//         <div className="flex items-center gap-2 bg-[#0d1117] px-3 py-2 rounded-full w-full border border-pink-500/20">
//           <Search size={16} className="text-pink-500" />

//           <input
//             placeholder="Search players, teams, stats..."
//             className="bg-transparent outline-none text-sm w-full"
//           />
//         </div>

//         <div className="p-2 border border-pink-500 rounded-full">
//           <Home size={16} />
//         </div>
//       </div>
//     </div>
//   );
// }






// src/components/HomeComponents/Header.tsx
"use client";

import { Bell, MessageCircle, Menu, Search, Home } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function Header() {
  return (
    // ✅ Full-width header with border-b so it visually separates from content below
    <div className="w-full px-4 lg:px-6 py-3 border-b border-pink-500/20 bg-black flex flex-col gap-3">

      {/* Top row: title (mobile only — hidden on desktop since sidebar has it) + icons */}
      <div className="flex items-center justify-between">
        {/* Title — visible only on mobile; desktop sidebar already shows it */}
        <h1 className="text-lg font-semibold lg:hidden">SportsFan360</h1>
        {/* On desktop, left side is empty so icons stay right-aligned */}
        <div className="hidden lg:block" />

        <div className="flex gap-2 items-center">
          <button className="p-2 rounded-full border border-pink-500 text-white">
            <Bell size={16} />
          </button>
          <button className="p-2 rounded-full border border-pink-500 text-white">
            <MessageCircle size={16} />
          </button>
          <button className="p-2 rounded-full border border-pink-500 text-white">
            <Menu size={16} />
          </button>
          <LogoutButton />
        </div>
      </div>

      {/* Search row */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-[#0d1117] px-3 py-2 rounded-full flex-1 border border-pink-500/20">
          <Search size={16} className="text-pink-500 shrink-0" />
          <input
            placeholder="Search players, teams, stats..."
            className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-500"
          />
        </div>
        <button className="p-2 border border-pink-500 rounded-full text-white shrink-0">
          <Home size={16} />
        </button>
      </div>

    </div>
  );
}