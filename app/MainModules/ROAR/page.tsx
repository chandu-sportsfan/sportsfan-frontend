// "use client";

// import ROARApp from "@/src/components/NewROARComponent";
// import { Suspense } from "react";

// export default function ROARPage() {
//   return (
//     <div
//       className="relative w-full"
//       style={{
//         height: "100dvh",        // use dvh so mobile browser chrome is accounted for
//         overflow: "hidden",
//         padding: 0,              // remove the padding causing the gap
//         margin: 0,
//         maxWidth: "100%",
//       }}
//     >
//       <Suspense fallback={<div style={{ padding: 20, color: "white", textAlign: "center" }}>Loading ROAR...</div>}>
//         <ROARApp />
//       </Suspense>
//     </div>
//   );
// }
"use client";
import ROARApp from "@/src/components/NewROARComponent";
import { Suspense } from "react";

export default function ROARPage() {
  return (
    <div style={{ 
      position: "fixed",   // fixed so it ignores any parent padding/scroll
      inset: 0,            // top/right/bottom/left: 0
      overflow: "hidden" 
    }}>
      <Suspense fallback={<div style={{ padding: 20, color: "white", textAlign: "center" }}>Loading ROAR...</div>}>
        <ROARApp />
      </Suspense>
    </div>
  );
}