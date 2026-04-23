// "use client";
// import { useState } from "react";

// type BadgeType = "FEATURE" | "ANALYSIS" | "OPINION" | "NEWS";

// type Article = {
//     id: number;
//     badge: BadgeType;
//     title: string;
//     readTime: string;
//     views: string;
//     image: string;
// };

// const BADGE_COLORS: Record<BadgeType, string> = {
//     FEATURE: "bg-pink-600",
//     ANALYSIS: "bg-orange-500",
//     OPINION: "bg-purple-600",
//     NEWS: "bg-blue-600",
// };

// const ARTICLES: Article[] = [
//     { id: 1, badge: "FEATURE", title: "Virat Kohli: The Modern Day Chase", readTime: "5 min read", views: "24.3K views", image: "/images/cricketarticlesfirst.jpg" },
//     { id: 2, badge: "ANALYSIS", title: "Jasprit Bumrah: Mastering Death Overs", readTime: "6 min read", views: "19.7K views", image: "/images/cricketarticlessecond.jpg" },
//     { id: 3, badge: "OPINION", title: "Rohit Sharma's Legacy at the Top", readTime: "4 min read", views: "31.1K views", image: "/images/cricketarticlesfirst.jpg" },
//     { id: 4, badge: "NEWS", title: "India Squad Named for Australia Test Series", readTime: "3 min read", views: "47.8K views", image: "/images/cricketarticlessecond.jpg" },
//     { id: 5, badge: "FEATURE", title: "The Art of Spin: How India Dominates at Home", readTime: "7 min read", views: "38.2K views", image: "/images/cricketarticlesfirst.jpg" },
//     { id: 6, badge: "ANALYSIS", title: "IPL 2025: Which Teams Have the Edge?", readTime: "8 min read", views: "52.4K views", image: "/images/cricketarticlessecond.jpg" },
// ];

// export default function CricketArticles() {
//     const [showAll, setShowAll] = useState(false);
//     const visible = showAll ? ARTICLES : ARTICLES.slice(0, 2);

//     return (
//         <div className="py-4 px-4 lg:px-6 w-full max-w-full overflow-x-hidden">

//             {/* Header */}
//             <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-[24px] font-bold text-white">Cricket Articles</h2>
//                 <button
//                     onClick={() => setShowAll(v => !v)}
//                     className="text-pink-500 text-sm font-medium hover:opacity-75 transition flex-shrink-0"
//                 >
//                     {showAll ? "Show Less" : "See All"}
//                 </button>
//             </div>

//             {/* Cards - Responsive grid */}
//             <div className="grid grid-cols-1 gap-3 min-h-[150px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4">
//                 {visible.map((article) => (
//                     <div
//                         key={article.id}
//                         className="flex flex-row bg-[#1a1a1a] rounded-md p-2 overflow-hidden border border-white/10 cursor-pointer hover:border-white/20 transition"
//                     >
//                         {/* Image Container */}
//                         <div className="flex items-center justify-center w-[100px] min-w-[100px] flex-shrink-0">
//                             <img
//                                 src={article.image}
//                                 alt={article.title}
//                                 className="w-[100px] h-[100px] object-cover rounded-md"
//                             />
//                         </div>

//                         {/* Body */}
//                         <div className="p-2 flex flex-col justify-center gap-1.5 flex-1 min-w-0">
//                             <span className={`text-[9px] font-medium px-2 py-0.5 rounded-md text-white w-fit tracking-wide ${BADGE_COLORS[article.badge]}`}>
//                                 {article.badge}
//                             </span>
//                             <p className="text-white font-medium text-[11px] leading-snug line-clamp-2">
//                                 {article.title}
//                             </p>
//                             <p className="text-gray-400 text-[10px] whitespace-nowrap">
//                                 {article.readTime}
//                                 <span className="mx-1">•</span>
//                                 {article.views}
//                             </p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }












// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";

// type BadgeType = "FEATURE" | "ANALYSIS" | "OPINION" | "NEWS";

// interface Article {
//     id: string;
//     badge: BadgeType;
//     title: string;
//     readTime: string;
//     views: string;
//     image: string;
//     createdAt: number;
//     updatedAt?: number;
// }

// interface ApiResponse {
//     success: boolean;
//     articles: Article[];
//     pagination: {
//         currentPage: number;
//         totalPages: number;
//         totalItems: number;
//         itemsPerPage: number;
//     };
// }

// const BADGE_COLORS: Record<BadgeType, string> = {
//     FEATURE: "bg-pink-600",
//     ANALYSIS: "bg-orange-500",
//     OPINION: "bg-purple-600",
//     NEWS: "bg-blue-600",
// };

// export default function CricketArticles() {
//     const [articles, setArticles] = useState<Article[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [showAll, setShowAll] = useState(false);
//     const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

//     useEffect(() => {
//         const fetchArticles = async () => {
//             try {
//                 const res = await axios.get<ApiResponse>("/api/cricket-articles");
//                 console.log("Fetched articles:", res.data); // Debug
//                 setArticles(res.data.articles || []);
//             } catch (error) {
//                 console.error("Failed to fetch cricket articles", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchArticles();
//     }, []);

//     const handleImageError = (id: string) => {
//         setImageErrors(prev => ({
//             ...prev,
//             [id]: true
//         }));
//     };

//     const visible = showAll ? articles : articles.slice(0, 4); // Show 4 initially, all when "See All" clicked

//     if (loading) {
//         return (
//             <div className="py-4 px-4 lg:px-6 w-full max-w-full overflow-x-hidden">
//                 <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-[24px] font-bold text-white">Cricket Articles</h2>
//                 </div>
//                 <p className="text-gray-400">Loading articles...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="py-4 px-4 lg:px-6 w-full max-w-full overflow-x-hidden">

//             {/* Header */}
//             <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-[24px] font-bold text-white">Cricket Articles</h2>
//                 {articles.length > 4 && (
//                     <button
//                         onClick={() => setShowAll(v => !v)}
//                         className="text-pink-500 text-sm font-medium hover:opacity-75 transition flex-shrink-0"
//                     >
//                         {showAll ? "Show Less" : "See All"}
//                     </button>
//                 )}
//             </div>

//             {/* Cards - Responsive grid */}
//             {articles.length > 0 ? (
//                 <div className="grid grid-cols-1 gap-3 min-h-[150px] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4">
//                     {visible.map((article) => (
//                         <div
//                             key={article.id}
//                             className="flex flex-row bg-[#1a1a1a] rounded-md p-2 overflow-hidden border border-white/10 cursor-pointer hover:border-white/20 transition"
//                         >
//                             {/* Image Container */}
//                             <div className="flex items-center justify-center w-[100px] min-w-[100px] flex-shrink-0">
//                                 {!imageErrors[article.id] ? (
//                                     <img
//                                         src={article.image}
//                                         alt={article.title}
//                                         className="w-[100px] h-[100px] object-cover rounded-md"
//                                         onError={() => handleImageError(article.id)}
//                                     />
//                                 ) : (
//                                     <div className="w-[100px] h-[100px] bg-gray-800 rounded-md flex items-center justify-center text-gray-500 text-xs">
//                                         No image
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Body */}
//                             <div className="p-2 flex flex-col justify-center gap-1.5 flex-1 min-w-0">
//                                 <span className={`text-[9px] font-medium px-2 py-0.5 rounded-md text-white w-fit tracking-wide ${BADGE_COLORS[article.badge] || "bg-gray-600"}`}>
//                                     {article.badge}
//                                 </span>
//                                 <p className="text-white font-medium text-[11px] leading-snug line-clamp-2">
//                                     {article.title}
//                                 </p>
//                                 <p className="text-gray-400 text-[10px] whitespace-nowrap">
//                                     {article.readTime}
//                                     <span className="mx-1">•</span>
//                                     {article.views}
//                                 </p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <div className="text-center py-10">
//                     <p className="text-gray-400">No articles available</p>
//                 </div>
//             )}
//         </div>
//     );
// }






"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

type BadgeType = "FEATURE" | "ANALYSIS" | "OPINION" | "NEWS";

interface Article {
    id: string;
    badge: BadgeType;
    title: string;
    author: string;
    description: string[];
    readTime: string;
    views: string;
    image: string;
    createdAt: number;
    updatedAt?: number;
}

interface ApiResponse {
    success: boolean;
    articles: Article[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

const BADGE_COLORS: Record<BadgeType, string> = {
    FEATURE: "bg-pink-600",
    ANALYSIS: "bg-orange-500",
    OPINION: "bg-purple-600",
    NEWS: "bg-blue-600",
};

export default function CricketArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);
    const router = useRouter();
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await axios.get<ApiResponse>("/api/cricket-articles");
                console.log("Fetched articles:", res.data);
                setArticles(res.data.articles || []);
            } catch (error) {
                console.error("Failed to fetch cricket articles", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const handleImageError = (id: string) => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
    };

    const visible = showAll ? articles : articles.slice(0, 4);


    if (loading) {
        return (
            <div className="flex justify-center items-center bg-[#0d0d10] min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading posts...</p>
                </div>
            </div>
        );
    }

    if (error || !articles) {
        return (
            <div className="flex justify-center items-center bg-[#0d0d10] w-[30px] h-[30px] rounded-lg mx-auto mt-10">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || "Articles not found"}</p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-pink-500 px-4 py-2 rounded text-white hover:bg-pink-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="mb-8 lg:px-6 w-[100%] max-w-full overflow-x-hidden pb-10">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[24px] font-bold text-white">Cricket Articles</h2>
                {articles.length > 4 && (
                    <button
                        onClick={() => setShowAll(v => !v)}
                        className="text-pink-500 text-sm font-medium hover:opacity-75 transition flex-shrink-0"
                    >
                        {showAll ? "Show Less" : "See All"}
                    </button>
                )}
            </div>

            {/* Cards */}
            {articles.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 min-h-[150px] md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 lg:gap-4">
                    {visible.map((article) => (
                        // <div
                        //     key={article.id}
                        //     onClick={() => router.push(`/MainModules/CricketArticles/${article.id}`)}
                        //     className="flex flex-col sm:flex-row bg-[#1a1a1a] rounded-md p-2 overflow-hidden border border-white/10 cursor-pointer hover:border-white/20 transition"
                        //  >
                        //     {/* Image */}
                        //     <div className="flex flex-col items-start justify-start w-full sm:w-[150px] sm:min-w-[150px] flex-shrink-0">
                        //         {!imageErrors[article.id] ? (
                        //             <img
                        //                 src={article.image}
                        //                 alt={article.title}
                        //                 className="w-full h-[100px] sm:w-[150px] sm:h-[80px] object-cover rounded-md"
                        //                 onError={() => handleImageError(article.id)}
                        //             />
                        //         ) : (
                        //             <div className="w-[100px] h-[100px] bg-gray-800 rounded-md flex items-center justify-center text-gray-500 text-xs">
                        //                 No image
                        //             </div>
                        //         )}
                        //           <p className="text-gray-400 text-[12px] whitespace-nowrap -mt-0 lg:-mt-6">
                        //             {article.readTime}
                        //             <span className="mx-1">•</span>
                        //             {article.views}
                        //         </p>
                        //     </div>

                        //     {/* Body */}
                        //     <div className="p-2 flex flex-col justify-start items-start md:justify-center gap-1.5 flex-1 ml-4 lg:ml-6 min-w-0">
                        //         <span className={`text-[12px] font-bold px-2 py-0.5 rounded-md text-white w-fit tracking-wide ${BADGE_COLORS[article.badge] || "bg-gray-600"}`}>
                        //             {article.badge}
                        //         </span>
                        //         <p className="text-white font-bold text-[16px] leading-snug line-clamp-2">
                        //             {article.title}
                        //         </p>
                        //         <p className="text-gray-400 font-bold text-[12px] leading-snug line-clamp-2">
                        //             Author - {article.author}
                        //         </p>
                        //         {/* <p className="text-gray-400 font-bold text-[16px] leading-snug line-clamp-2">
                        //             {article.description && article.description.length > 0
                        //                 ? article.description[0]
                        //                 : "No description available"}
                        //         </p> */}
                        //         <p
                        //             className="text-gray-400 font-bold text-[16px] leading-snug line-clamp-2"
                        //             dangerouslySetInnerHTML={{
                        //                 __html: article.description?.[0] ?? "No description available"
                        //             }}
                        //         />
                        //         <p
                        //             onClick={() => router.push(`/MainModules/CricketArticles/${article.id}`)} >
                        //             <span className="text-blue-400 text-[15px]">Read more ...</span>
                        //         </p>

                        //     </div>
                        // </div>




                        // <div
                        //     key={article.id}
                        //     onClick={() => router.push(`/MainModules/CricketArticles/${article.id}`)}
                        //     className="flex flex-col sm:flex-row bg-[#1a1a1a] rounded-md overflow-hidden border border-white/10 cursor-pointer hover:border-white/20 transition"
                        //    >
                        //     {/* Image */}

                        //     {/* <div className="relative w-full sm:w-[150px] sm:min-w-[150px] flex-shrink-0"> */}
                        //      <div className="relative w-full sm:w-[250px] sm:min-w-[250px] lg:w-[300px] lg:min-w-[300px] flex-shrink-0">
                        //         {!imageErrors[article.id] ? (
                        //             <img
                        //                 src={article.image}
                        //                 alt={article.title}
                        //                 className="w-full h-[120px] sm:w-[150px] sm:h-full  object-cover lg:object-fit"
                        //                 onError={() => handleImageError(article.id)}
                        //             />
                        //         ) : (
                        //             <div className="w-full h-[180px] sm:w-[150px] sm:h-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs">
                        //                 No image
                        //             </div>
                        //         )}
                        //         {/* Read time overlaid on image bottom */}
                        //         <p className="absolute bottom-2 left-2 text-white text-[11px] bg-black/60 px-2 py-0.5 rounded whitespace-nowrap">
                        //             {article.readTime}
                        //             <span className="mx-1">•</span>
                        //             {article.views}
                        //         </p>
                        //     </div>

                        //     {/* Body */}
                        //     <div className="p-3 flex flex-col justify-start gap-1.5 flex-1 min-w-0">
                        //         <span className={`text-[12px] font-bold px-2 py-0.5 rounded-md text-white w-fit tracking-wide ${BADGE_COLORS[article.badge] || "bg-gray-600"}`}>
                        //             {article.badge}
                        //         </span>
                        //         <p className="text-white font-bold text-[16px] leading-snug line-clamp-2">
                        //             {article.title}
                        //         </p>
                        //         <p className="text-gray-400 font-bold text-[12px] leading-snug">
                        //             Author - {article.author}
                        //         </p>
                        //         <p
                        //             className="text-gray-400 text-[13px] leading-snug line-clamp-2"
                        //             dangerouslySetInnerHTML={{
                        //                 __html: article.description?.[0] ?? "No description available"
                        //             }}
                        //         />
                        //         <span className="text-blue-400 text-[14px]">Read more ...</span>
                        //     </div>
                        // </div>



                        <div
                            key={article.id}
                            onClick={() => router.push(`/MainModules/CricketArticles/${article.id}`)}
                            className="flex flex-col sm:flex-row bg-[#1a1a1a] rounded-md overflow-hidden border border-white/10 cursor-pointer hover:border-white/20 transition"
                        >
                            {/* Image - Remove any margins */}
                            <div className="relative w-full sm:w-[250px] sm:min-w-[250px] lg:w-[300px] lg:min-w-[300px] flex-shrink-0">
                                {!imageErrors[article.id] ? (
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-[120px] sm:h-full object-fit"
                                        onError={() => handleImageError(article.id)}
                                    />
                                ) : (
                                    <div className="w-full h-[180px] sm:h-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs">
                                        No image
                                    </div>
                                )}
                                {/* Read time overlaid on image bottom */}
                                <p className="absolute bottom-2 left-2 text-white text-[11px] bg-black/60 px-2 py-0.5 rounded whitespace-nowrap">
                                    {article.readTime}
                                    <span className="mx-1">•</span>
                                    {article.views}
                                </p>
                            </div>

                            {/* Body - Reduce padding and remove gaps */}
                            <div className="p-2 sm:p-2.5 flex flex-col justify-center gap-1 flex-1 min-w-0">
                                {/* Reduced padding from p-3 to p-2, gap from gap-1.5 to gap-1 */}
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md text-white w-fit tracking-wide ${BADGE_COLORS[article.badge] || "bg-gray-600"}`}>
                                    {article.badge}
                                </span>
                                <p className="text-white font-bold text-[15px] leading-snug line-clamp-2">
                                    {article.title}
                                </p>
                                <p className="text-gray-400 text-[11px] leading-snug">
                                    Author - {article.author}
                                </p>
                                <p
                                    className="text-gray-400 text-[12px] leading-snug line-clamp-2"
                                    dangerouslySetInnerHTML={{
                                        __html: article.description?.[0] ?? "No description available"
                                    }}
                                />
                                <span className="text-blue-400 text-[13px]">Read more ...</span>
                            </div>
                        </div>


                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-400">No articles available</p>
                </div>
            )}
        </div>
    );
}