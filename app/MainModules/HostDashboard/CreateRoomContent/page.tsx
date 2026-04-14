// import CreateRoomStep1 from "@/src/components/HostDashboardComponents/CreateRoomStep1";
// import CreateRoomStep2 from "@/src/components/HostDashboardComponents/CreateRoomStep2";
// import CreateRoomStep3 from "@/src/components/HostDashboardComponents/CreateRoomStep3";
// import CreateRoomStep4 from "@/src/components/HostDashboardComponents/CreateRoomStep4";



// export default function HostDashboardPage() {
//   return (
//     <div>
//         <CreateRoomStep1 />
//         <CreateRoomStep2 />
//         <CreateRoomStep3 />
//         <CreateRoomStep4 />
//     </div>
        
//   );
// }

"use client";

import CreateRoomStep1 from "@/src/components/HostDashboardComponents/CreateRoomStep1";
import CreateRoomStep2 from "@/src/components/HostDashboardComponents/CreateRoomStep2";
import CreateRoomStep3 from "@/src/components/HostDashboardComponents/CreateRoomStep3";
import CreateRoomStep4 from "@/src/components/HostDashboardComponents/CreateRoomStep4";
import { useState } from "react";


const TOTAL_STEPS = 4;

export default function HostDashboardPage() {
  const [step, setStep] = useState(1);

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goPrev = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div>
      {step === 1 && (
        <CreateRoomStep1
          currentStep={step}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
      {step === 2 && (
        <CreateRoomStep2
          currentStep={step}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
      {step === 3 && (
        <CreateRoomStep3
          currentStep={step}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
      {step === 4 && (
        <CreateRoomStep4
          currentStep={step}
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
    </div>
  );
}