// // "use client";

// // import { useState } from "react";
// // import Image from "next/image";
// // import { MoreHorizontal } from "lucide-react";


// // interface catFields {
// //     label: string;
// //     logo: string;
// // }
// // interface Post {
// //     id: number;
// //     teamName: string;
// //     timeAgo: string;
// //     title: string;
// //     category: string[];
// //     likes: number;
// //     comments: number;
// //     live: number,
// //     shares: number;
// //     image: string;
// //     logo: string;
// //     catlogo: catFields[];
// //     hasVideo?: boolean;
// // }

// // const mockPosts: Post[] = [
// //     {
// //         id: 1,
// //         teamName: "Royal Challengers Bengaluru",
// //         timeAgo: "12m ago",
// //         title: "Let's go!!!",
// //         category: ["Cricket", "Celebration"],
// //         likes: 108,
// //         comments: 0,
// //         live: 100,
// //         shares: 108,
// //         catlogo: [{ label: "20", logo: "/images/profile.png" }, { label: "45", logo: "/images/like.png" }, { label: "150", logo: "/images/live.png" },],
// //         logo: "/images/team360rcblogo.png",
// //         image: "/images/team360rcb.png",
// //     },
// //     {
// //         id: 2,
// //         teamName: "Mumbai Indians",
// //         timeAgo: "4h ago",
// //         title: "Champions mindset",
// //         category: ["Cricket", "MI Family"],
// //         likes: 256,
// //         comments: 0,
// //         live: 50,
// //         shares: 142,
// //         catlogo: [{ label: "66", logo: "/images/profile.png" }, { label: "23", logo: "/images/like.png" }, { label: "250", logo: "/images/live.png" },],
// //         logo: "/images/team360milogo.png",
// //         image: "/images/team360mi.png",
// //     },
// //     {
// //         id: 3,
// //         teamName: "Chennai Super Kings",
// //         timeAgo: "6h ago",
// //         title: "Whistle Podu!",
// //         category: ["Cricket", "Yellow Army"],
// //         likes: 320,
// //         live: 200,
// //         comments: 0,
// //         shares: 165,
// //         catlogo: [{ label: "40", logo: "/images/profile.png" }, { label: "35", logo: "/images/like.png" }, { label: "80", logo: "/images/live.png" },],
// //         logo: "/images/team360csklogo.png",
// //         image: "/images/team360csk.png",
// //     },
// // ];

// // export default function Team360CardsSection() {
// //     const [likedPosts, setLikedPosts] = useState<number[]>([]);

// //     const handleLike = (postId: number) => {
// //         setLikedPosts((prev) =>
// //             prev.includes(postId)
// //                 ? prev.filter((id) => id !== postId)
// //                 : [...prev, postId]
// //         );
// //     };
// //     return (
// //         <div className="w-full py-4 px-3 sm:px-4">
// //             <h1 className="text-[20px] font:bold"
// //             style={{"fontWeight":700}}>Teams 360 World</h1>
// //             {/* Horizontal Scroll Container */}
// //             <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">

// //                 {mockPosts.map((post) => (
// //                     <div
// //                         key={post.id}
// //                         className="min-w-[280px] sm:min-w-[320px] max-w-[320px] bg-black rounded-xl shadow-sm border border-gray-800 overflow-hidden snap-start"
// //                     >
// //                         {/* Header */}
// //                         <div className="p-3 flex items-center justify-between">
// //                             <div className="flex items-center gap-2">
// //                                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-white font-bold text-sm">
// //                                     <img src={post.logo} alt={`${post.teamName} Logo`} className="w-full h-full object-cover" />
// //                                 </div>
// //                                 <div>
// //                                     <h3 className="font-semibold text-white text-sm leading-tight">
// //                                         {post.teamName}
// //                                     </h3>
// //                                     <p className="text-[10px] text-gray-400">
// //                                         {post.timeAgo}
// //                                     </p>
// //                                 </div>
// //                             </div>
// //                             <MoreHorizontal size={18} className="text-gray-400" />
// //                         </div>

// //                         {/* Image */}
// //                         <div className="relative aspect-video bg-gray-100">
// //                             <Image
// //                                 src={post.image}
// //                                 alt={post.title}
// //                                 fill
// //                                 className="object-cover"
// //                             />
// //                         </div>



// //                         {/* Content */}
// //                         <div className="mb-2 mt-2 ml-2">
// //                             <h4 className="font-semibold text-white text-sm">
// //                                 {post.title}
// //                             </h4>
// //                             {post.category.length > 0 && (
// //                                 <div className="flex items-center gap-2 mt-1">
// //                                     {post.category.map((cat, i) => (
// //                                         <span key={i} className="border border-gray-200 text-gray-400 text-xs px-2 py-1 rounded-xl">
// //                                             {cat}
// //                                         </span>
// //                                     ))}
// //                                 </div>
// //                             )}
// //                         </div>

// //                         {/* Actions */}
// //                         <div className="p-3">
// //                             <div className="flex items-center justify-between mb-2">
// //                                 {post.catlogo.length > 0 && (
// //                                     <div className="flex items-center gap-2">
// //                                         {post.catlogo.map((item, i) => (
// //                                             <div key={i} className="flex flex-row gap-2 rounded-2xl px-2 py-1 bg-gray-950 items-center">
// //                                                 <img src={item.logo} alt={item.label} className="w-[20px] h-[20px] object-cover" />
// //                                                 <span className="text-sm md:text-md text-gray-400 mt-1">{item.label}</span>
// //                                             </div>
// //                                         ))}
// //                                         <span className="rounded-2xl px-2 py-1 bg-gray-950">
// //                                             <img src='/images/share.png' alt="share" className="w-6 h-6 object-cover" />
// //                                         </span>
// //                                     </div>
// //                                 )}
// //                             </div>

// //                             {/* Buttons */}
// //                             <button className="text-xs bg-[#A00E4D] font:bold  w-full py-2 rounded-xl text-white mb-2"
// //                             style={{"fontWeight":700,}}>
// //                                 View Full Playlist
// //                             </button>

// //                             <div className="flex gap-2">
// //                                 <button className="text-xs bg-[#CD620E] font:bold w-full rounded-xl py-2 text-white"
// //                                  style={{"fontWeight":700,}}>
// //                                     Stats
// //                                 </button>
// //                                 <button className="text-xs bg-black w-full font:bold rounded-xl py-2 border border-[#CD620E] text-white"
// //                                  style={{"fontWeight":700,}}>
// //                                     Table
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 ))}

// //             </div>
// //         </div>
// //     );
// // }







// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { MoreHorizontal } from "lucide-react";
// import axios from "axios";
// import Link from "next/link";

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
//     teamName: string;
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
// }

// export default function Team360CardsSection() {
//     const [posts, setPosts] = useState<Post[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

//     useEffect(() => {
//         const fetchPosts = async () => {
//             try {
//                 const res = await axios.get("/api/team360");
//                 console.log("Fetched posts:", res.data); // Debug: Check what URLs are coming
//                 setPosts(res.data.posts || []);
//             } catch (error) {
//                 console.error("Failed to fetch team360 posts", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPosts();
//     }, []);

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

//     if (loading) {
//         return <p className="text-white p-4">Loading...</p>;
//     }

//     return (
//         <div className="w-full py-4 px-3 sm:px-4">
//             <h1
//                 className="text-[20px]"
//                 style={{ fontWeight: 700 }}
//             >
//                 Teams 360 World
//             </h1>

//             <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory mt-4">
//                 {posts.map((post) => (
//                     <div
//                         key={post.id}
//                         className="min-w-[280px] sm:min-w-[320px] max-w-[320px] bg-black rounded-xl shadow-sm border border-gray-800 overflow-hidden snap-start"
//                     >
//                         {/* Header */}
//                         <div className="p-3 flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                                 <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
//                                     {!imageErrors[`${post.id}-logo`] ? (
//                                         <img
//                                             src={post.logo}
//                                             alt={post.teamName}
//                                             className="w-full h-full object-cover"
//                                             onError={() => handleImageError(post.id, 'logo')}
//                                         />
//                                     ) : (
//                                         <div className="w-full h-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-white text-xs">
//                                             {post.teamName.charAt(0)}
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <h3 className="font-semibold text-white text-sm leading-tight">
//                                         {post.teamName}
//                                     </h3>
//                                     <p className="text-[10px] text-gray-400">
//                                         {getISTTimeAgo(post.createdAt)}
//                                     </p>
//                                 </div>
//                             </div>

//                             <MoreHorizontal
//                                 size={18}
//                                 className="text-gray-400"
//                             />
//                         </div>

//                         {/* Main Image */}
//                         <div className="relative aspect-video bg-gray-800">
//                             {!imageErrors[`${post.id}-main`] ? (
//                                 <img
//                                     src={post.image}
//                                     alt={post.title}
//                                     className="w-[296px] h-[180px] md:w-full md:h-full object-cover"
//                                     onError={() => handleImageError(post.id, 'main')}
//                                 />
//                             ) : (
//                                 <div className="w-full h-full flex items-center justify-center text-gray-400">
//                                     Image not available
//                                 </div>
//                             )}
//                         </div>

//                         {/* Content */}
//                         <div className="mb-2 mt-2 ml-2">
//                             <h4 className="font-semibold text-white text-sm">
//                                 {post.title}
//                             </h4>

//                             {post.category.length > 0 && (
//                                 <div className="flex items-center gap-2 mt-1 flex-wrap">
//                                     {post.category.map((cat, i) => (
//                                         <span
//                                             key={i}
//                                             className="border border-gray-200 text-gray-400 text-xs px-2 py-1 rounded-xl"
//                                         >
//                                             {cat.title}
//                                         </span>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>

//                         {/* Stats */}
//                         <div className="p-3">
//                             <div className="flex items-center gap-2 flex-wrap mb-3">
//                                 {post.catlogo.map((item, i) => (
//                                     <div
//                                         key={i}
//                                         className="flex flex-row gap-2 rounded-2xl px-2 py-1 bg-gray-950 items-center"
//                                     >
//                                         {!imageErrors[`${post.id}-catlogo-${i}`] ? (
//                                             <img
//                                                 src={item.logo}
//                                                 alt={item.label}
//                                                 className="w-[20px] h-[20px] object-cover"
//                                                 onError={() => handleImageError(post.id, `catlogo-${i}`)}
//                                             />
//                                         ) : (
//                                             <div className="w-[20px] h-[20px] bg-gray-700 rounded-full" />
//                                         )}
//                                         <span className="text-sm text-gray-400">
//                                             {item.label}
//                                         </span>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* Buttons */}
//                             <Link href={`/MainModules/DropScreen`} >
//                                 <button
//                                     className="text-xs bg-[#A00E4D] w-full py-2 rounded-xl text-white mb-2"
//                                     style={{ fontWeight: 700 }}
//                                 >
//                                     View Full Playlist
//                                 </button>
//                             </Link>

//                             <div className="flex gap-2">
//                                 <button
//                                     className="text-xs bg-[#CD620E] w-full rounded-xl py-2 text-white"
//                                     style={{ fontWeight: 700 }}
//                                 >
//                                     Stats
//                                 </button>

//                                 <button
//                                     className="text-xs bg-black w-full rounded-xl py-2 border border-[#CD620E] text-white"
//                                     style={{ fontWeight: 700 }}
//                                 >
//                                     Table
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }






"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import axios from "axios";
import Link from "next/link";

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
    teamName: string;
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
}

export default function Team360CardsSection() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    // Add admin base URL
    const ADMIN_BASE_URL = 'https://sportsfan360.vercel.app';


    const getFullImageUrl = (path: string) => {
        if (!path) return "";

        return path.startsWith("http")
            ? path
            : `https://sportsfan360.vercel.app${path}`;
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get("/api/team360");
                console.log("Fetched posts:", res.data);

                // Transform posts to add full URLs for debugging
                const transformedPosts = res.data.posts?.map((post: Post) => ({
                    ...post,
                    logoFullUrl: getFullImageUrl(post.logo),
                    imageFullUrl: getFullImageUrl(post.image),
                    catlogo: post.catlogo?.map(logo => ({
                        ...logo,
                        fullUrl: getFullImageUrl(logo.logo)
                    })),
                    category: post.category?.map(cat => ({
                        ...cat,
                        fullUrl: getFullImageUrl(cat.image)
                    }))
                })) || [];

                setPosts(transformedPosts);
            } catch (error) {
                console.error("Failed to fetch team360 posts", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

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

    const handleImageError = (id: string, type: string, url: string) => {
        console.error(`Image failed to load: ${type} - URL: ${url}`);
        setImageErrors(prev => ({
            ...prev,
            [`${id}-${type}`]: true
        }));
    };

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

    if (error || !posts) {
        return (
            <div className="flex justify-center items-center bg-[#0d0d10] w-[30px] h-[30px] rounded-lg mx-auto mt-10">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || "Posts not found"}</p>
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
        <div className="w-full py-4 px-3 sm:px-4">
            <h1 className="text-[20px] text-white" style={{ fontWeight: 700 }}>
                Teams 360 World
            </h1>

            <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory mt-4">
                {posts.map((post) => (
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
                                            src={getFullImageUrl(post.logo)}
                                            alt={post.teamName}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.log(`Logo error for ${post.teamName}:`, e.currentTarget.src);
                                                handleImageError(post.id, 'logo', e.currentTarget.src);
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-white text-xs">
                                            {post.teamName.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-white text-sm leading-tight">
                                        {post.teamName}
                                    </h3>
                                    <p className="text-[10px] text-gray-400">
                                        {getISTTimeAgo(post.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <MoreHorizontal size={18} className="text-gray-400" />
                        </div>

                        {/* Main Image */}
                        <div className="relative aspect-video bg-gray-800">
                            {!imageErrors[`${post.id}-main`] ? (
                                <img
                                    src={getFullImageUrl(post.image)}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.log(`Main image error for ${post.title}:`, e.currentTarget.src);
                                        handleImageError(post.id, 'main', e.currentTarget.src);
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    Image not available
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
                                            className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-400 text-xs px-2 py-1 rounded-xl"
                                        >
                                            {cat.image && (
                                                <img
                                                    src={getFullImageUrl(cat.image)}
                                                    alt={cat.title}
                                                    className="w-3.5 h-3.5 object-cover rounded-sm shrink-0"
                                                />
                                            )}
                                            {cat.title}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="p-3">
                            <div className="flex items-center gap-2 flex-row mb-3 whitespace-nowrap">
                                {post.catlogo && post.catlogo.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-row gap-2 rounded-2xl px-2 py-1 bg-gray-950 items-center"
                                    >
                                        {!imageErrors[`${post.id}-catlogo-${i}`] ? (
                                            <img
                                                src={getFullImageUrl(item.logo)}
                                                alt={item.label}
                                                className="w-[20px] h-[20px] object-cover"
                                                onError={(e) => {
                                                    console.log(`Catlogo error for ${item.label}:`, e.currentTarget.src);
                                                    handleImageError(post.id, `catlogo-${i}`, e.currentTarget.src);
                                                }}
                                            />
                                        ) : (
                                            <div className="w-[20px] h-[20px] bg-gray-700 rounded-full" />
                                        )}
                                        <span className="text-sm text-gray-400">
                                            {item.label}
                                        </span>
                                    </div>

                                ))}
                                <img src="/images/share.png" alt="Category Share" />
                            </div>

                            {/* Buttons */}
                            <Link href={`/MainModules/DropScreen?teamName=${encodeURIComponent(post.teamName)}&postId=${post.id}`} >
                                <button
                                    className="text-xs bg-[#C9115F] w-full py-2 rounded-xl text-white mb-2 cursor-pointer"
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
                                    Stats
                                </button>

                                <button
                                    className="text-xs bg-black w-full rounded-xl py-2 border border-[#CD620E] text-white"
                                    style={{ fontWeight: 700 }}
                                >
                                    Table
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}