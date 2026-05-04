"use client";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// 1. Simplified Tab IDs
type TabId = "table" | "caps";

export default function IPLPointsTable() {
    const [tab, setTab] = useState<TabId>("table");
    const [pointsHtml, setPointsHtml] = useState<string>("");
    const [capsHtml, setCapsHtml] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ipl-stats`);
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                
                // Content from route_2.ts CDN links
                setPointsHtml(data.pointsTableHtml || "");
                setCapsHtml(data.capsHtml || "");
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const tabs: { id: TabId; label: string }[] = [
        { id: "table", label: "Points Table" },
        { id: "caps", label: "Orange/Purple Cap" },
    ];

    if (loading) {
        return <div className="text-white text-center mt-20">Loading IPL 2026 Stats...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0d0d10] p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Link href="/MainModules/HomePage" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors w-fit cursor-pointer">
                    <ArrowLeft size={18} />
                    <span className="text-sm">Back</span>
                </Link>

                {/* Main Container */}
                <div className="bg-[#0d0d10] rounded-2xl border border-[#2a2a2e] overflow-hidden flex flex-col">
                    
                    {/* Tab Bar */}
                    <div className="flex border-b border-[#2a2a2e] px-4 bg-[#0d0d10] z-10 relative">
                        {tabs.map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => setTab(id)}
                                className={`px-6 py-4 text-sm font-medium transition-all cursor-pointer ${
                                    tab === id ? "text-[#C9115F] border-b-2 border-[#C9115F]" : "text-gray-400 hover:text-gray-300"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area - Using iframe sandboxing to prevent CSS leaking */}
                    <div className="w-full bg-[#0d0d10] relative">
                        {tab === "table" ? (
                            <iframe 
                                srcDoc={pointsHtml} 
                                className="w-full h-[700px] border-none block"
                                title="IPL 2026 Points Table"
                                sandbox="allow-scripts allow-same-origin"
                            />
                        ) : (
                            <iframe 
                                srcDoc={capsHtml} 
                                className="w-full h-[700px] border-none block"
                                title="IPL 2026 Cap Leaders"
                                sandbox="allow-scripts allow-same-origin"
                            />
                        )}
                    </div>
                    
                </div>
            </div>
        </div>
    );
}
