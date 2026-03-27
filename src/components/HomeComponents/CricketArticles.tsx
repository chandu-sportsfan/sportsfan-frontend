"use client";
import { useState } from "react";

type BadgeType = "FEATURE" | "ANALYSIS" | "OPINION" | "NEWS";

type Article = {
    id: number;
    badge: BadgeType;
    title: string;
    readTime: string;
    views: string;
    image: string;
};

const BADGE_COLORS: Record<BadgeType, string> = {
    FEATURE: "bg-pink-600",
    ANALYSIS: "bg-orange-500",
    OPINION: "bg-purple-600",
    NEWS: "bg-blue-600",
};

const ARTICLES: Article[] = [
    { id: 1, badge: "FEATURE", title: "Virat Kohli: The Modern Day Chase", readTime: "5 min read", views: "24.3K views", image: "/images/cricketarticlesfirst.jpg" },
    { id: 2, badge: "ANALYSIS", title: "Jasprit Bumrah: Mastering Death Overs", readTime: "6 min read", views: "19.7K views", image: "/images/cricketarticlessecond.jpg" },
    { id: 3, badge: "OPINION", title: "Rohit Sharma's Legacy at the Top", readTime: "4 min read", views: "31.1K views", image: "/images/cricketarticlesfirst.jpg" },
    { id: 4, badge: "NEWS", title: "India Squad Named for Australia Test Series", readTime: "3 min read", views: "47.8K views", image: "/images/cricketarticlessecond.jpg" },
    { id: 5, badge: "FEATURE", title: "The Art of Spin: How India Dominates at Home", readTime: "7 min read", views: "38.2K views", image: "/images/cricketarticlesfirst.jpg" },
    { id: 6, badge: "ANALYSIS", title: "IPL 2025: Which Teams Have the Edge?", readTime: "8 min read", views: "52.4K views", image: "/images/cricketarticlessecond.jpg" },
];

export default function CricketArticles() {
    const [showAll, setShowAll] = useState(false);
    const visible = showAll ? ARTICLES : ARTICLES.slice(0, 2);

    return (
        <div className="py-4 px-4 lg:px-6 w-full max-w-full overflow-x-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[24px] font-bold text-white">Cricket Articles</h2>
                <button
                    onClick={() => setShowAll(v => !v)}
                    className="text-pink-500 text-sm font-medium hover:opacity-75 transition flex-shrink-0"
                >
                    {showAll ? "Show Less" : "See All"}
                </button>
            </div>

            {/* Cards - Responsive grid */}
            <div className="grid grid-cols-1 gap-3 min-h-[150px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4">
                {visible.map((article) => (
                    <div
                        key={article.id}
                        className="flex flex-row bg-[#1a1a1a] rounded-md p-2 overflow-hidden border border-white/10 cursor-pointer hover:border-white/20 transition"
                    >
                        {/* Image Container */}
                        <div className="flex items-center justify-center w-[100px] min-w-[100px] flex-shrink-0">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-[100px] h-[100px] object-cover rounded-md"
                            />
                        </div>

                        {/* Body */}
                        <div className="p-2 flex flex-col justify-center gap-1.5 flex-1 min-w-0">
                            <span className={`text-[9px] font-medium px-2 py-0.5 rounded-md text-white w-fit tracking-wide ${BADGE_COLORS[article.badge]}`}>
                                {article.badge}
                            </span>
                            <p className="text-white font-medium text-[11px] leading-snug line-clamp-2">
                                {article.title}
                            </p>
                            <p className="text-gray-400 text-[10px] whitespace-nowrap">
                                {article.readTime}
                                <span className="mx-1">•</span>
                                {article.views}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}