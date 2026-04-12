
// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { MoreHorizontal, Search } from "lucide-react";
// import Link from "next/link";
// import { usePlayerProfile360 } from "@/context/PlayerProfile360Context";

// interface CatField {
//     label: string;
//     logo: string;
// }

// interface CategoryField {
//     title: string;
//     image: string;
// }

// interface Post {
//     id: string;
//     playerName: string;
//     title: string;
//     category: CategoryField[];
//     likes: number;
//     comments: number;
//     live: number;
//     shares: number;
//     image: string;
//     logo: string;
//     catlogo: CatField[];
//     hasVideo?: boolean;
//     createdAt: number;
//     updatedAt?: number;
// }




// export default function Player360CardsSection() {
//     // const { data, loading, fetchPlayer360 } = usePlayerProfile360();
//     const {homeData, loading, fetchPlayerHome} = usePlayerProfile360();


//     const [posts, setPosts] = useState<Post[]>([]);
//     const [query, setQuery] = useState("");
//     const [error, setError] = useState<string | null>(null);
//     const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

//      useEffect(() => {
//     if (!playerId) return;
//     fetchPlayerHome(playerId);
//   }, [playerId]);

//     useEffect(() => {
//         if (data?.home) {
//            setPosts(data.home || []);
//         }
//     }, [data]);

//     const getISTTimeAgo = (timestamp: number) => {
//         const now = Date.now();
//         const diff = now - timestamp;

//         const minutes = Math.floor(diff / (1000 * 60));
//         const hours = Math.floor(diff / (1000 * 60 * 60));
//         const days = Math.floor(diff / (1000 * 60 * 60 * 24));

//         if (minutes < 60) return `${minutes}m ago`;
//         if (hours < 24) return `${hours}h ago`;
//         return `${days}d ago`;
//     };

//     const handleImageError = (id: string, type: string) => {
//         setImageErrors(prev => ({
//             ...prev,
//             [`${id}-${type}`]: true
//         }));
//     };

//     const filteredPosts = posts.filter(post =>
//         post.playerName?.toLowerCase().includes(query.toLowerCase()) ||
//         post.title?.toLowerCase().includes(query.toLowerCase())
//     );

//     // if (loading) {
//     //     return (
//     //         <div className="w-full py-4 px-3 sm:px-4">
//     //             <div className="flex items-center justify-between gap-3 mb-4">
//     //                 <h1 className="text-[18px] sm:text-[20px] font-semibold text-white whitespace-nowrap">
//     //                     Players 360 World
//     //                 </h1>
//     //                 <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-full px-3 py-1.5 w-[160px] sm:w-[200px] md:w-[240px]">
//     //                     <Search className="text-gray-400 shrink-0" size={16} />
//     //                     <input
//     //                         type="text"
//     //                         placeholder="Search..."
//     //                         className="bg-transparent outline-none text-xs sm:text-sm text-white placeholder:text-gray-500 w-full ml-2"
//     //                         disabled
//     //                     />
//     //                 </div>
//     //             </div>
//     //             <p className="text-white p-4">Loading...</p>
//     //         </div>
//     //     );
//     // }

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center bg-[#0d0d10] h-[30px] w-[30px] rounded-lg mx-auto mt-10">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
//                     <p className="text-gray-400">Loading posts...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error || !posts) {
//         return (
//             <div className="flex justify-center items-center bg-[#0d0d10] min-h-screen">
//                 <div className="text-center">
//                     <p className="text-red-400 mb-4">{error || "Video not found"}</p>
//                     <button
//                         onClick={() => window.history.back()}
//                         className="bg-pink-500 px-4 py-2 rounded text-white hover:bg-pink-600"
//                     >
//                         Go Back
//                     </button>
//                 </div>
//             </div>
//         );
//     }
//     return (
//         <div className="w-full py-4">
//             <div className="flex items-center justify-between gap-3 mb-4">
//                 {/* Title */}
//                 <h1 className="text-[18px] sm:text-[20px] font-semibold text-white whitespace-nowrap">
//                     Players 360 World
//                 </h1>

//                 {/* Search Bar */}
//                 <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-full px-3 py-1.5 w-[160px] sm:w-[200px] md:w-[240px] focus-within:border-pink-500 transition">
//                     <Search className="text-gray-400 shrink-0" size={16} />
//                     <input
//                         type="text"
//                         placeholder="Search players..."
//                         value={query}
//                         onChange={(e) => setQuery(e.target.value)}
//                         className="bg-transparent outline-none text-xs sm:text-sm text-white placeholder:text-gray-500 w-full ml-2"
//                     />
//                 </div>
//             </div>

//             {/* Horizontal Scroll Container */}
//             <div className="flex gap-4 overflow-x-auto  [scrollbar-width:none] snap-x snap-mandatory">
//                 {filteredPosts.length > 0 ? (
//                     filteredPosts.map((post) => (
//                         <div
//                             key={post.id}
//                             className="min-w-[280px] sm:min-w-[320px] max-w-[320px] bg-black rounded-xl shadow-sm border border-gray-800 overflow-hidden snap-start"
//                         >
//                             {/* Header */}
//                             <div className="p-3 flex items-center justify-between">
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
//                                         {!imageErrors[`${post.id}-logo`] ? (
//                                             <img
//                                                 src={post.logo}
//                                                 alt={post.playerName}
//                                                 className="w-full h-full object-cover rounded-full"
//                                                 onError={() => handleImageError(post.id, 'logo')}
//                                             />
//                                         ) : (
//                                             <div className="w-full h-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-white text-xs font-bold">
//                                                 {post.playerName?.charAt(0) || 'P'}
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div>
//                                         <h3 className="font-semibold text-white text-sm leading-tight">
//                                             {post.playerName}
//                                         </h3>
//                                         <p className="text-[10px] text-gray-400">
//                                             {getISTTimeAgo(post.createdAt)}
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <MoreHorizontal size={18} className="text-gray-400" />
//                             </div>

//                             {/* Image */}
//                             <div className="relative aspect-video bg-gray-800">
//                                 {!imageErrors[`${post.id}-main`] ? (
//                                     <Image
//                                         src={post.image}
//                                         alt={post.title}
//                                         fill
//                                         className="object-fit w-[296px] h-[180px]"
//                                         onError={() => handleImageError(post.id, 'main')}
//                                     />
//                                 ) : (
//                                     <div className="w-full h-full flex items-center justify-center text-gray-400">
//                                         Image not available
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Content */}
//                             <div className="mb-2 mt-2 ml-2">
//                                 <h4 className="font-semibold text-white text-sm">
//                                     {post.title}
//                                 </h4>
//                                 {post.category && post.category.length > 0 && (
//                                     <div className="flex items-center gap-2 mt-1 flex-wrap">
//                                         {post.category.map((cat, i) => (
//                                             <span
//                                                 key={i}
//                                                 className="border border-gray-200 text-gray-400 text-xs px-2 py-1 rounded-xl"
//                                             >
//                                                 {cat.title}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Stats Section */}
//                             <div className="p-3">
//                                 <div className="flex items-center gap-2 flex-wrap mb-3">
//                                     {post.catlogo && post.catlogo.map((item, i) => (
//                                         <div
//                                             key={i}
//                                             className="flex flex-row gap-2 rounded-2xl px-2 py-1 bg-gray-950 items-center"
//                                         >
//                                             {!imageErrors[`${post.id}-catlogo-${i}`] ? (
//                                                 <img
//                                                     src={item.logo}
//                                                     alt={item.label}
//                                                     className="w-[20px] h-[20px] object-cover"
//                                                     onError={() => handleImageError(post.id, `catlogo-${i}`)}
//                                                 />
//                                             ) : (
//                                                 <div className="w-[20px] h-[20px] bg-gray-700 rounded-full" />
//                                             )}
//                                             <span className="text-sm text-gray-400">
//                                                 {item.label}
//                                             </span>
//                                         </div>
//                                     ))}
//                                     <span className="rounded-2xl px-2 py-1 bg-gray-950">
//                                         <img
//                                             src='/images/share.png'
//                                             alt="share"
//                                             className="w-6 h-6 object-cover"
//                                             onError={(e) => {
//                                                 e.currentTarget.src = '/fallback-share.png';
//                                             }}
//                                         />
//                                     </span>
//                                 </div>

//                                 {/* Buttons */}
//                                 <Link href="/MainModules/PlayersProfile">
//                                     <button
//                                         className="text-xs bg-[#C9115F] w-full py-2 rounded-xl text-white mb-2"
//                                         style={{ fontWeight: 700 }}
//                                     >
//                                         View Full Playlist
//                                     </button>
//                                 </Link>

//                                 <div className="flex gap-2">
//                                     <button
//                                         className="text-xs bg-[#CD620E] w-full rounded-xl py-2 text-white"
//                                         style={{ fontWeight: 700 }}
//                                     >
//                                         Player Stats
//                                     </button>
//                                     <button
//                                         className="text-xs bg-black w-full rounded-xl py-2 border border-[#CD620E] text-white"
//                                         style={{ fontWeight: 700 }}
//                                     >
//                                         Highlight
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <div className="w-full text-center py-10">
//                         <p className="text-gray-400">No players found matching.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }



"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { usePlayerProfile360 } from "@/context/PlayerProfile360Context";

interface CatField {
    label: string;
    logo: string;
}

interface CategoryField {
    title: string;
    image: string;
}

interface Post {
    id: string;
    playerName: string;
    title: string;
    category: CategoryField[];
    likes: number;
    comments: number;
    live: number;
    shares: number;
    image: string;
    logo: string;
    catlogo: CatField[];
    hasVideo?: boolean;
    createdAt: number;
    updatedAt?: number;
    playerProfilesId?: string; // Add playerId field
}

export default function Player360CardsSection() {
    const { homeData, loading, fetchPlayerHome } = usePlayerProfile360();

    const [posts, setPosts] = useState<Post[]>([]);
    const [query, setQuery] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchPlayerHome().catch(err => {
                console.error("Failed to fetch:", err);
                setError("Failed to load posts");
            });
        }
    }, [fetchPlayerHome]);

    useEffect(() => {
        if (homeData?.home) {
            setPosts(homeData.home || []);
            setError(null);
        }
    }, [homeData]);

    const getISTTimeAgo = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;

        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const handleImageError = (id: string, type: string) => {
        setImageErrors(prev => ({
            ...prev,
            [`${id}-${type}`]: true
        }));
    };

    const filteredPosts = posts.filter(post =>
        post.playerName?.toLowerCase().includes(query.toLowerCase()) ||
        post.title?.toLowerCase().includes(query.toLowerCase())
    );

    if (loading && !posts.length) {
        return (
            <div className="flex justify-center items-center bg-[#0d0d10] w-[15px] h-[15px] rounded-lg mx-auto mt-10">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading posts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center bg-[#0d0d10] min-h-[200px]">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            hasFetched.current = false;
                            fetchPlayerHome();
                        }}
                        className="bg-pink-500 px-4 py-2 rounded text-white hover:bg-pink-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="w-full py-4">
                <div className="flex items-center justify-between gap-3 mb-4">
                    <h1 className="text-[18px] sm:text-[20px] font-semibold text-white whitespace-nowrap">
                        Players 360 World
                    </h1>
                    <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-full px-3 py-1.5 w-[160px] sm:w-[200px] md:w-[240px]">
                        <Search className="text-gray-400 shrink-0" size={16} />
                        <input
                            type="text"
                            placeholder="Search players..."
                            className="bg-transparent outline-none text-xs sm:text-sm text-white placeholder:text-gray-500 w-full ml-2"
                            disabled
                        />
                    </div>
                </div>
                <div className="w-full text-center py-10">
                    <p className="text-gray-400">No posts available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full py-4">
            <div className="flex items-center justify-between lg:justify-start lg:gap-4 gap-3 mb-4">
                {/* Title */}
                <h1 className="text-[18px] sm:text-[20px] font-semibold text-white whitespace-nowrap">
                    Players 360 World
                </h1>

                {/* Search Bar */}
                <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-full px-3 py-1.5 w-[160px] sm:w-[200px] md:w-[240px] focus-within:border-pink-500 transition">
                    <Search className="text-gray-400 shrink-0" size={16} />
                    <input
                        type="text"
                        placeholder="Search players..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="bg-transparent outline-none text-xs sm:text-sm text-white placeholder:text-gray-500 w-full ml-2"
                    />
                </div>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex gap-4 overflow-x-auto [scrollbar-width:none] snap-x snap-mandatory">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className="min-w-[280px] sm:min-w-[320px] max-w-[320px] bg-black rounded-xl shadow-sm border border-gray-800 overflow-hidden snap-start"
                        >
                            {/* Header */}
                            <div className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                                        {!imageErrors[`${post.id}-logo`] ? (
                                            <img
                                                src={post.logo}
                                                alt={post.playerName}
                                                className="w-full h-full object-cover rounded-full"
                                                onError={() => handleImageError(post.id, 'logo')}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-white text-xs font-bold">
                                                {post.playerName?.charAt(0) || 'P'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-sm leading-tight">
                                            {post.playerName}
                                        </h3>
                                        <p className="text-[10px] text-gray-400">
                                            {getISTTimeAgo(post.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <MoreHorizontal size={18} className="text-gray-400" />
                            </div>

                            {/* Image */}
                            <div className="relative aspect-video bg-gray-800">
                                {!imageErrors[`${post.id}-main`] ? (
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover"
                                        onError={() => handleImageError(post.id, 'main')}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 100 100"
                                            className="w-20 h-20 opacity-40"
                                            fill="none"
                                        >
                                            {/* Body */}
                                            <circle cx="50" cy="28" r="12" fill="#9ca3af" />
                                            {/* Torso */}
                                            <rect x="36" y="42" width="28" height="26" rx="4" fill="#9ca3af" />
                                            {/* Legs */}
                                            <rect x="36" y="66" width="11" height="18" rx="3" fill="#9ca3af" />
                                            <rect x="53" y="66" width="11" height="18" rx="3" fill="#9ca3af" />
                                            {/* Bat arm */}
                                            <rect x="64" y="44" width="7" height="28" rx="3" fill="#9ca3af" transform="rotate(20 64 44)" />
                                            {/* Bat blade */}
                                            <rect x="70" y="56" width="6" height="18" rx="2" fill="#6b7280" transform="rotate(20 70 56)" />
                                            {/* Ball */}
                                            <circle cx="22" cy="62" r="6" fill="#6b7280" />
                                            <path d="M19 59 Q22 62 19 65" stroke="#9ca3af" strokeWidth="1" />
                                            <path d="M25 59 Q22 62 25 65" stroke="#9ca3af" strokeWidth="1" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="mb-2 mt-2 ml-2">
                                <h4 className="font-semibold text-white text-sm">
                                    {post.title}
                                </h4>
                                {post.category && post.category.length > 0 && (
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        {post.category.map((cat, i) => (
                                            <span
                                                key={i}
                                                className="border border-gray-200 text-gray-400 text-xs px-2 py-1 rounded-xl"
                                            >
                                                {cat.title}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Stats Section */}
                            <div className="p-3">
                                <div className="flex items-center gap-2 flex-wrap mb-3">
                                    {post.catlogo && post.catlogo.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-row gap-2 rounded-2xl px-2 py-1 bg-gray-950 items-center"
                                        >
                                            {!imageErrors[`${post.id}-catlogo-${i}`] ? (
                                                <img
                                                    src={item.logo}
                                                    alt={item.label}
                                                    className="w-[20px] h-[20px] object-cover"
                                                    onError={() => handleImageError(post.id, `catlogo-${i}`)}
                                                />
                                            ) : (
                                                <div className="w-[20px] h-[20px] bg-gray-700 rounded-full" />
                                            )}
                                            <span className="text-sm text-gray-400">
                                                {item.label}
                                            </span>
                                        </div>
                                    ))}
                                    <span className="rounded-2xl px-2 py-1 bg-gray-950">
                                        <img
                                            src='/images/share.png'
                                            alt="share"
                                            className="w-6 h-6 object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = '/fallback-share.png';
                                            }}
                                        />
                                    </span>
                                </div>

                                {/* Buttons */}
                                {/* Updated Link to include player ID */}
                                {/* <Link href={`/MainModules/PlayersProfile?${post.playerId || post.id}?tab=highlights`}> */}
                                <Link href={`/MainModules/PlayersProfile?id=${post.playerProfilesId || post.id}&tab=highlights`}>
                                    <button
                                        className="text-xs bg-[#C9115F] w-full py-2 rounded-xl text-white mb-2"
                                        style={{ fontWeight: 700 }}
                                    >
                                        View Full Playlist
                                    </button>
                                </Link>


                                <div className="flex gap-2">
                                    <button
                                        className="text-xs bg-[#CD620E] w-full rounded-xl py-2 text-white"
                                        style={{ fontWeight: 700 }}
                                    >
                                        Player Stats
                                    </button>
                                    <button
                                        className="text-xs bg-black w-full rounded-xl py-2 border border-[#CD620E] text-white"
                                        style={{ fontWeight: 700 }}
                                    >
                                        Highlight
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full text-center py-10">
                        <p className="text-gray-400">No players found matching &apos;{query}&apos;.</p>
                    </div>
                )}
            </div>
        </div>
    );
}