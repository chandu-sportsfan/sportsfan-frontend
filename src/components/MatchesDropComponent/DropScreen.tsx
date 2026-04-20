"use client";
import { useState } from "react";
import { ArrowLeft, Headphones, Play, Users } from "lucide-react";
import Link from "next/link";

interface Drop {
    id: string;
    title: string;
    duration: string;
    plays: string;
    author: string;
    badge: "Inner Room" | "Public";
    type: "audio" | "video";
}

interface DateGroup {
    label: string;
    audioDrops: Drop[];
    videoDrops: Drop[];
}

const mockData: DateGroup[] = [
    {
        label: "Today",
        audioDrops: [
            { id: "a1", title: "Pre-Match Strategy Discussion", duration: "02:12", plays: "12k", author: "Arjun Mehta", badge: "Inner Room", type: "audio" },
            { id: "a2", title: "Pre-Match Strategy Discussion", duration: "02:12", plays: "12k", author: "Arjun Mehta", badge: "Inner Room", type: "audio" },
            { id: "a3", title: "Pre-Match Strategy Discussion", duration: "02:12", plays: "12k", author: "Arjun Mehta", badge: "Inner Room", type: "audio" },
        ],
        videoDrops: [
            { id: "v1", title: "Pre-Match Strategy Discussion", duration: "02:12", plays: "12k", author: "Arjun Mehta", badge: "Inner Room", type: "video" },
            { id: "v2", title: "Pre-Match Strategy Discussion", duration: "02:12", plays: "12k", author: "Arjun Mehta", badge: "Inner Room", type: "video" },
            { id: "v3", title: "Pre-Match Strategy Discussion", duration: "02:12", plays: "12k", author: "Arjun Mehta", badge: "Inner Room", type: "video" },
        ],
    },
    {
        label: "19 Apr",
        audioDrops: [
            { id: "a4", title: "Pre-Match Strategy Discussion", duration: "02:12", plays: "12k", author: "Arjun Mehta", badge: "Inner Room", type: "audio" },
            { id: "a5", title: "Pre-Match Strategy Discussion", duration: "02:12", plays: "12k", author: "Arjun Mehta", badge: "Inner Room", type: "audio" },
        ],
        videoDrops: [
            { id: "v4", title: "Pre-Match Strategy Discussion", duration: "02:12", plays: "12k", author: "Arjun Mehta", badge: "Inner Room", type: "video" },
        ],
    },
];

function DropRow({ drop }: { drop: Drop }) {
    return (
        <div className="flex items-center justify-between px-3 py-3 bg-[#141414] rounded-xl mb-2 gap-3">
            <div className="flex items-center gap-3 min-w-0">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-[#1e1e1e] flex items-center justify-center flex-shrink-0 border border-white/5">
                    {drop.type === "audio" ? (
                        <Headphones size={16} className="text-[#C9115F]" />
                    ) : (
                        <Play size={16} className="text-[#C9115F]" fill="#C9115F" />
                    )}
                </div>

                {/* Info */}
                <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate leading-tight">{drop.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-gray-500 text-xs">{drop.duration}</span>
                        <span className="text-gray-600 text-xs">•</span>
                        <span className="text-gray-500 text-xs">{drop.plays} plays</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                        <Users size={10} className="text-gray-600" />
                        <span className="text-gray-500 text-[11px]">by {drop.author}</span>
                    </div>
                </div>
            </div>

            {/* Badge */}
            <span className="flex-shrink-0 text-[#C9115F] text-xs font-semibold whitespace-nowrap">
                {drop.badge}
            </span>
        </div>
    );
}

function SectionLabel({ label }: { label: string }) {
    const isToday = label === "Today";
    return (
        <div className={`inline-block px-3 py-1 rounded-md mb-4 text-sm font-semibold ${isToday ? "bg-[#b8460a] text-white" : "bg-[#1e1e1e] text-gray-300 border border-white/10"}`}>
            {label}
        </div>
    );
}

export default function FullPlaylist() {
    const [requestText, setRequestText] = useState("");

    return (
        <div className="min-h-screen bg-[#0d0d10] text-white">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5 sticky top-0 bg-[#0d0d10] z-10">
                <Link href='/MainModules/HomePage'>
                    <button className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <ArrowLeft size={20} />
                    </button>
                </Link>
                <div>
                    <h1 className="text-base font-bold text-white leading-tight">RCB vs MI</h1>
                    <p className="text-xs text-gray-500">Full Playlist</p>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 px-4 lg:px-8 py-6 max-w-6xl mx-auto">

                {/* Left: Drops Feed */}
                <div className="flex-1 min-w-0">
                    {mockData.map((group) => (
                        <div key={group.label} className="mb-8">
                            <SectionLabel label={group.label} />

                            {/* Audio Drops */}
                            {group.audioDrops.length > 0 && (
                                <div className="mb-5">
                                    <p className="text-gray-400 text-sm font-medium mb-3">Audio Drops</p>
                                    {group.audioDrops.map((drop) => (
                                        <DropRow key={drop.id} drop={drop} />
                                    ))}
                                </div>
                            )}

                            {/* Video Drops */}
                            {group.videoDrops.length > 0 && (
                                <div>
                                    <p className="text-gray-400 text-sm font-medium mb-3">Video Drops</p>
                                    {group.videoDrops.map((drop) => (
                                        <DropRow key={drop.id} drop={drop} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right: Request a Drop Panel */}
                <div className="w-full lg:w-[340px] flex-shrink-0">
                    <div className="bg-[#141414] rounded-2xl border border-white/5 p-5 lg:sticky lg:top-24">
                        {/* Panel Header */}
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9115F] to-[#e85d04] flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-bold">e</span>
                            </div>
                            <div>
                                <p className="text-white text-sm font-semibold leading-tight">Request a drop</p>
                                <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                                    Want to hear more from Royal Challengers Bengaluru? Request a specific topic or moment!
                                </p>
                            </div>
                        </div>

                        {/* Textarea */}
                        <textarea
                            value={requestText}
                            onChange={(e) => setRequestText(e.target.value)}
                            placeholder="What would you like to hear about?"
                            rows={5}
                            className="w-full bg-[#0d0d10] text-white text-sm placeholder-gray-600 rounded-xl px-4 py-3 border border-white/5 focus:outline-none focus:border-[#C9115F]/50 resize-none transition-colors"
                        />

                        {/* Submit Button */}
                        <button className="w-full mt-4 py-3 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-[#C9115F] to-[#e85d04] hover:opacity-90 transition-opacity active:scale-[0.98]">
                            Submit Request
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}