"use client";

import React from "react";

export default function AskAIPage() {
  return (
    <div className="w-full h-[calc(100vh-104px)] md:h-[calc(100vh-64px)] overflow-hidden bg-black">
      <iframe
        src="https://ask-ai-two-murex.vercel.app/"
        className="w-full h-full border-0"
        title="Ask AI"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}