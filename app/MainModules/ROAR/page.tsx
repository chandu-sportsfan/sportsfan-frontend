"use client";

import ROARApp from "@/src/components/NewROARComponent";

export default function ROARPage() {
  return (
    <div className="relative w-full" style={{ padding: "32px 16px 60px", maxWidth: "1280px", margin: "0 auto" }}>
      <div style={{ height: "calc(100vh - 140px)", minHeight: "600px", borderRadius: "24px", overflow: "hidden" }}>
        <ROARApp />
      </div>
    </div>
  );
}
