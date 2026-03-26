


"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";


interface catFields {
    label: string;
    logo: string;
}
interface Post {
    id: number;
    teamName: string;
    timeAgo: string;
    title: string;
    category: string[];
    likes: number;
    comments: number;
    live: number,
    shares: number;
    image: string;
    logo: string;
    catlogo: catFields[];
    hasVideo?: boolean;
}

const mockPosts: Post[] = [
    {
        id: 1,
        teamName: "Virat Kholi",
        timeAgo: "12m ago",
        title: "Let's go!!!",
        category: ["Cricket", "Celebration"],
        likes: 108,
        comments: 0,
        live: 100,
        shares: 108,
        catlogo: [{ label: "20", logo: "/images/profile.png" }, { label: "45", logo: "/images/like.png" }, { label: "150", logo: "/images/live.png" },],
        logo : "/images/team360rcblogo.png",
        image: "/images/playerrcb.jpg",
    },
    {
        id: 2,
        teamName: "Rohit Sharma",
        timeAgo: "4h ago",
        title: "Champions mindset",
        category: ["Cricket", "MI Family"],
        likes: 256,
        comments: 0,
        live: 50,
        shares: 142,
         catlogo: [{ label: "66", logo: "/images/profile.png" }, { label: "23", logo: "/images/like.png" }, { label: "250", logo: "/images/live.png" },],
        logo : "/images/team360milogo.png",
        image: "/images/playermi.png",
    },
    {
        id: 3,
        teamName: "Mahendra Singh Dhoni",
        timeAgo: "6h ago",
        title: "Whistle Podu!",
        category: ["Cricket", "Yellow Army"],
        likes: 320,
        live: 200,
        comments: 0,
        shares: 165,
         catlogo: [{ label: "40", logo: "/images/profile.png" }, { label: "35", logo: "/images/like.png" }, { label: "80", logo: "/images/live.png" },],
        logo : "/images/team360csklogo.png",
        image: "/images/playercsk.jpg",
    },
];

export default function Player360CardsSection() {
    const [likedPosts, setLikedPosts] = useState<number[]>([]);

    const handleLike = (postId: number) => {
        setLikedPosts((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
    };
    return (
        <div className="w-full py-4 px-3 sm:px-4">
            {/* Horizontal Scroll Container */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">

                {mockPosts.map((post) => (
                    <div
                        key={post.id}
                        className="min-w-[280px] sm:min-w-[320px] max-w-[320px] bg-black rounded-xl shadow-sm border border-gray-800 overflow-hidden snap-start"
                    >
                        {/* Header */}
                        <div className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-white font-bold text-sm">
                                    <img src={post.logo} alt={`${post.teamName} Logo`} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-sm leading-tight">
                                        {post.teamName}
                                    </h3>
                                    <p className="text-[10px] text-gray-400">
                                        {post.timeAgo}
                                    </p>
                                </div>
                            </div>
                            <MoreHorizontal size={18} className="text-gray-400" />
                        </div>

                        {/* Image */}
                        <div className="relative aspect-video bg-gray-100">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-fit"
                            />
                        </div>



                        {/* Content */}
                        <div className="mb-2 mt-2 ml-2">
                            <h4 className="font-semibold text-white text-sm">
                                {post.title}
                            </h4>
                            {post.category.length > 0 && (
                                <div className="flex items-center gap-2 mt-1">
                                    {post.category.map((cat, i) => (
                                        <span key={i} className="border border-gray-200 text-gray-400 text-xs px-2 py-1 rounded-xl">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="p-3">
                            <div className="flex items-center justify-between mb-2">
                                {post.catlogo.length > 0 && (
                                    <div className="flex items-center gap-4">
                                        {post.catlogo.map((item, i) => (
                                            <div key={i} className="flex flex-row gap-2 rounded-2xl px-2 py-1 bg-gray-950 items-center">
                                                <img src={item.logo} alt={item.label} className="w-6 h-6 object-cover" />
                                                <span className="text-xs text-gray-400 mt-1">{item.label}</span>
                                            </div>
                                        ))}
                                          <span className="rounded-2xl px-2 py-1 bg-gray-950">
                                                    <img src='/images/share.png' alt="share" className="w-6 h-6 object-cover" />
                                                </span>
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <button className="text-xs bg-[#A00E4D] w-full py-2 rounded-xl text-white mb-2">
                                View Full Playlist
                            </button>

                            <div className="flex gap-2">
                                <button className="text-xs bg-[#CD620E] w-full rounded-xl py-2 text-white">
                                    Stats
                                </button>
                                <button className="text-xs bg-black w-full rounded-xl py-2 border border-[#CD620E] text-white">
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