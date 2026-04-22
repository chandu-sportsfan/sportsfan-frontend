"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

type BadgeType = "FEATURE" | "ANALYSIS" | "OPINION" | "NEWS";

interface ArticleDetail {
    id: string;
    badge: BadgeType;
    title: string;
    readTime: string;
    views: string;
    image: string;
    createdAt: number;
    updatedAt?: number;
    description: string[];
}

const BADGE_COLORS: Record<BadgeType, string> = {
    FEATURE: "bg-pink-600",
    ANALYSIS: "bg-orange-500",
    OPINION: "bg-purple-600",
    NEWS: "bg-blue-600",
};

export default function CricketArticleDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [article, setArticle] = useState<ArticleDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchArticle = async () => {
            try {
                const res = await axios.get(`/api/cricket-articles/${id}`);
                setArticle(res.data.article);
            } catch (err) {
                setError("Failed to load article.");
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#0d0d10]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-[#0d0d10] gap-4">
                <p className="text-red-400">{error || "Article not found"}</p>
                <button
                    onClick={() => router.back()}
                    className="bg-pink-500 px-4 py-2 rounded text-white hover:bg-pink-600"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const topParas = article.description.slice(0, 2);
    const remainingParas = article.description.slice(2);

    return (
        <div className="min-h-screen text-white px-4 py-6 max-w-6xl mx-auto">
            {/* Back button */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
            >
                <ArrowLeft size={18} />
                <span className="text-sm">Back</span>
            </button>

            {/* Top two-column layout */}
            <div className="flex flex-col lg:flex-row gap-8">

                {/* LEFT — Image, Badge, Title, Meta */}
                <div className="lg:w-2/5 flex flex-col gap-4">
                    <div className="w-full rounded-xl overflow-hidden">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="w-full object-cover max-h-[300px] lg:max-h-[400px]"
                        />
                    </div>

                    <span className={`text-xs font-bold px-3 py-1 rounded-md text-white w-fit ${BADGE_COLORS[article.badge] || "bg-gray-600"}`}>
                        {article.badge}
                    </span>

                    <h1 className="text-2xl font-bold leading-snug">{article.title}</h1>

                    <p className="text-gray-400 text-sm">
                        {article.readTime}
                        <span className="mx-2">•</span>
                        {article.views}
                    </p>
                </div>

                {/* RIGHT — First 2 paragraphs */}
                <div className="lg:w-3/5 flex flex-col gap-5 lg:border-l lg:border-white/10 lg:pl-8">
                    <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-3">
                        Article
                    </h2>
                    {topParas.map((para, index) => (
                        <p key={index} className="text-gray-300 leading-relaxed text-[15px]">
                            {para}
                        </p>
                    ))}
                </div>
            </div>

            {/* Remaining paragraphs — full width below */}
            {remainingParas.length > 0 && (
                <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 pb-12">
                    {remainingParas.map((para, index) => (
                        <p key={index} className="text-gray-300 leading-relaxed text-[15px]">
                            {para}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}