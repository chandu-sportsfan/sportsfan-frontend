// src/components/HomeComponents/ContinueListening.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface VideoProgress {
    videoId: string;
    title: string;
    subtitle: string;
    elapsed: number;
    durationSeconds: number;
    pct: number;
    url: string;
    pausedAt: number;
}

export default function ContinueListening() {
    const { user } = useAuth();
    const [inProgress, setInProgress] = useState<VideoProgress[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("🔍 useEffect triggered");
        console.log("🔍 user object:", user);
        console.log("🔍 userId:", user?.userId);
        
        if (!user?.userId) {
            console.log("❌ No userId, setting loading false");
            setLoading(false);
            return;
        }

        console.log("✅ Fetching progress for userId:", user.userId);
        
        const fetchProgress = async () => {
            try {
                const response = await axios.get(`/api/video-progress?userId=${user.userId}`);
                console.log("📦 Raw API response:", response);
                console.log("📦 Response data:", response.data);
                
                if (response.data.success) {
                    console.log("✅ Success! Progress array:", response.data.progress);
                    console.log("✅ Array length:", response.data.progress?.length);
                    setInProgress(response.data.progress || []);
                } else {
                    console.log("❌ API returned success: false");
                    setError("API returned error");
                }
            } catch (err) {
                console.error("❌ Fetch error:", err);
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [user?.userId]); // Dependency on userId

    console.log("🎨 Rendering - loading:", loading, "inProgress length:", inProgress.length, "error:", error);
    
    if (loading) {
        console.log("⏳ Showing loading state");
        return (
            <div className="w-full">
                <h2 className="text-pink-500 text-lg sm:text-xl font-semibold mb-3">
                    Continue Watching
                </h2>
                <div className="text-gray-400">Loading...</div>
            </div>
        );
    }
    
    if (error) {
        console.log("⚠️ Showing error state");
        return (
            <div className="w-full">
                <h2 className="text-pink-500 text-lg sm:text-xl font-semibold mb-3">
                    Continue Watching
                </h2>
                <div className="text-red-400">Error: {error}</div>
            </div>
        );
    }
    
    if (inProgress.length === 0) {
        console.log("⚠️ No progress data to display");
        return null;
    }

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    console.log("✅ Rendering with data:", inProgress.length, "items");
    
    return (
        <div className="w-full">
            <h2 className="text-pink-500 text-lg sm:text-xl font-semibold mb-3">
                Continue Watching
            </h2>

            <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] pb-1">
                {inProgress.map((item) => (
                    <Link
                        key={item.videoId}
                        href={`/MainModules/MatchesDropContent/VideoDropScreen?id=${encodeURIComponent(item.videoId)}&resume=${item.elapsed}`}
                    >
                        <div className="min-w-[280px] sm:min-w-[320px] bg-gradient-to-r from-[#1A2B3A] to-[#0f1a24] rounded-xl flex-shrink-0 hover:brightness-110 transition-all cursor-pointer overflow-hidden">
                            <div className="h-[3px] bg-[#1e1e22] w-full">
                                <div
                                    className="h-full bg-[#e0185a] transition-all"
                                    style={{ width: `${item.pct}%` }}
                                />
                            </div>
                            <div className="h-[80px] sm:h-[88px] flex items-center gap-4 px-5">
                                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shrink-0">
                                    <span className="text-white text-xs ml-0.5">▶</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[#C9115F] font-semibold text-sm sm:text-base truncate">
                                        {item.title}
                                    </p>
                                    <p className="text-gray-400 text-xs sm:text-sm truncate">
                                        {item.subtitle}
                                    </p>
                                    <p className="text-[#555] text-[10px] mt-0.5">
                                        Resume from {formatTime(item.elapsed)} · {item.pct}% watched
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}