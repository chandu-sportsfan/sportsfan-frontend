import React from "react";
import { Bell, MessageCircle, Menu, Search, Home } from "lucide-react";

export default function SportsFanUI() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col justify-between">
            {/* Top Header */}
            <div className="p-4 border-b border-pink-500/30">
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

                {/* Search */}
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

         
            {/* Main Card */}
            <div className="px-4">
                <div className="rounded-2xl overflow-hidden relative">
                    <img
                        src="https://images.unsplash.com/photo-1505842465776-3a8c9c90b0f1"
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
                        <h2 className="font-bold text-lg">TATA IPL T20 2026</h2>
                        <p className="text-xs text-gray-300">
                            Experience cricket&apos; biggest league
                        </p>
                    </div>
                </div>
            </div>

            {/* Continue Listening */}
            <div className="px-4 mt-6">
                <h2 className="text-pink-500 font-semibold mb-3">
                    Continue Listening
                </h2>
                <div className="bg-[#1c2330] rounded-lg p-4 flex items-center gap-3">
                    <div className="bg-pink-500 p-3 rounded-full">
                        ▶
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Rohit Sharma</p>
                        <p className="text-xs text-gray-400">
                            Captaincy Masterclass
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Nav */}
            <div className="flex justify-around items-center py-3 border-t border-pink-500/30 mt-6">
                {["Feed", "Live", "Fantasy", "Store", "Fan Zone"].map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-xs text-gray-400">
                        <div className={`mb-1 ${i === 0 ? "text-pink-500" : ""}`}>
                            ●
                        </div>
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
}
