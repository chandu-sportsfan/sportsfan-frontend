// "use client";

// import ROARApp from "@/src/components/NewROARComponent";
// import { Suspense } from "react";

// export default function ROARPage() {
//   return (
//     <div className="relative w-full" style={{ padding: "32px 16px 60px", maxWidth: "1280px", margin: "0 auto" }}>
//       <div style={{ height: "calc(100vh - 140px)", minHeight: "600px", borderRadius: "24px", overflow: "hidden" }}>
//         <Suspense fallback={<div style={{ padding: 20, color: "white", textAlign: "center" }}>Loading ROAR...</div>}>
//           <ROARApp />
//         </Suspense>
//       </div>
//     </div>
//   );
// }



"use client";

import ROARApp from "@/src/components/NewROARComponent";
import { Suspense } from "react";

export default function ROARPage() {
  return (
    <div className="relative w-full max-w-[1280px] mx-auto md:px-4 md:pt-8 md:pb-[60px]">
      <div
        className="h-[100dvh] overflow-hidden rounded-none md:h-[calc(100dvh_-_92px)] md:rounded-[24px]"
      >
        <Suspense fallback={<div className="p-5 text-white text-center">Loading ROAR...</div>}>
          <ROARApp />
        </Suspense>
      </div>
    </div>
  );
}
