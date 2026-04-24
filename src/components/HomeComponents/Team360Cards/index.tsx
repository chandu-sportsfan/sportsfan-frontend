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
    const [sharePost, setSharePost] = useState<Post | null>(null);
    const [copied, setCopied] = useState(false);

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

    const resolveShareImageUrl = (post: Post) => {
        if (!post.image) return "/images/share.png";
        return post.image.startsWith("http") ? post.image : `https://sportsfan360.vercel.app${post.image}`;
    };

    const buildShareUrl = (post: Post) => {
        if (typeof window === "undefined") return "";
        return `${window.location.origin}/MainModules/Team360/share/${post.id}`;
    };

    const buildShareText = (post: Post) => {
        const previewLink = buildShareUrl(post);

        return [
            `${post.teamName} | Team 360 World`,
            post.title,
            `View the photo preview and details:`,
            previewLink,
        ].join("\n");
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            try {
                const input = document.createElement("textarea");
                input.value = text;
                input.style.position = "fixed";
                input.style.opacity = "0";
                document.body.appendChild(input);
                input.focus();
                input.select();
                const ok = document.execCommand("copy");
                document.body.removeChild(input);
                return ok;
            } catch {
                return false;
            }
        }
    };

    const openShare = (post: Post) => {
        setSharePost(post);
        setCopied(false);
    };

    const closeShare = () => {
        setSharePost(null);
        setCopied(false);
    };

    const handleShareToWhatsApp = () => {
        if (!sharePost) return;
        const shareText = buildShareText(sharePost);
        const whatsappAppUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
        const whatsappWebFallbackUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

        const opened = window.open(whatsappAppUrl, "_self");
        if (!opened) {
            window.location.href = whatsappWebFallbackUrl;
        }
    };

    const handleShareToThreads = () => {
        if (!sharePost) return;
        const shareText = buildShareText(sharePost);
        window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
    };

    const handleShareToInstagram = async () => {
        if (!sharePost) return;
        const shareText = buildShareText(sharePost);
        const ok = await copyToClipboard(shareText);
        if (ok) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        }
        window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    };

    const handleShareToLinkedIn = () => {
        if (!sharePost) return;
        const shareUrl = buildShareUrl(sharePost);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
    };

    const handleShareToX = () => {
        if (!sharePost) return;
        const shareText = buildShareText(sharePost);
        window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
    };

    const handleCopyLink = async () => {
        if (!sharePost) return;
        const ok = await copyToClipboard(buildShareText(sharePost));
        if (!ok) return;
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
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
        <div className="w-full py-4">
            <h1 className="text-[20px] text-white" style={{ fontWeight: 700 }}>
                Teams 360 World
            </h1>

            <div className="mt-4 lg:flex lg:items-start lg:gap-4">
                <div className="flex gap-4 overflow-x-auto [scrollbar-width:none] snap-x snap-mandatory lg:flex-1">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="relative min-w-[280px] sm:min-w-[320px] max-w-[320px] snap-start"
                        >
                        <div className="bg-black rounded-xl shadow-sm border border-gray-800 overflow-hidden">
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
                            <Link href={`/MainModules/ClubsProfile?teamProfile=${encodeURIComponent(post.teamName)}`} className="absolute inset-0">
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
                            </Link>
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
                                <button
                                    type="button"
                                    onClick={() => openShare(post)}
                                    className="ml-auto w-7 h-7 rounded-full bg-[#1e1e22] flex items-center justify-center hover:bg-[#2a2a2e] transition"
                                    aria-label={`Share ${post.teamName}`}
                                >
                                    <img src="/images/share.png" alt="Share" className="w-4 h-4 object-contain" />
                                </button>
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

                            {/* <div className="flex gap-2">
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
                            </div> */}
                        </div>
                        </div>

                        {sharePost?.id === post.id && (
                            <div className="hidden lg:block absolute left-[calc(100%+8px)] top-1 z-30 w-[260px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-white text-sm font-semibold">Share Team 360</p>
                                    <button onClick={closeShare} className="text-gray-400 hover:text-white transition" aria-label="Close share panel">
                                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-[#111114] p-3 mb-2">
                                    <p className="text-white text-sm font-semibold line-clamp-1">{post.teamName}</p>
                                    <p className="text-white/65 text-xs mt-1 line-clamp-2">{post.title}</p>
                                </div>

                                <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 -ml-2">
                                    <button onClick={handleShareToWhatsApp} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on WhatsApp">
                                        <img src="/images/share_whatsapp.png" alt="WhatsApp" className="w-full h-full object-cover rounded-full" />
                                    </button>
                                    <button onClick={handleShareToThreads} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Threads">
                                        <img src="/images/share_thread.png" alt="Threads" className="w-full h-full object-cover rounded-full" />
                                    </button>
                                    <button onClick={handleShareToInstagram} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Instagram">
                                        <img src="/images/share_insta.png" alt="Instagram" className="w-full h-full object-cover rounded-full" />
                                    </button>
                                    <button onClick={handleShareToLinkedIn} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on LinkedIn">
                                        <img src="/images/Share_linkedin.png" alt="LinkedIn" className="w-full h-full object-cover rounded-full" />
                                    </button>
                                    <button onClick={handleShareToX} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on X">
                                        <img src="/images/Share_X.png" alt="X" className="w-full h-full object-cover rounded-full" />
                                    </button>
                                    <button onClick={handleCopyLink} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Copy share link">
                                        <img src="/images/share_copy_link.png" alt="Copy link" className="w-full h-full object-cover rounded-full" />
                                    </button>
                                </div>

                                {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
                            </div>
                        )}
                        </div>
                    ))}
                </div>
            </div>

            {sharePost && (
                <>
                    <button
                        type="button"
                        aria-label="Close share popup"
                        className="fixed inset-0 z-40 bg-black/70 lg:hidden"
                        onClick={closeShare}
                    />
                    <div
                        className="fixed bottom-16 inset-x-4 z-50 mx-auto w-full max-w-[260px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl lg:hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-white text-sm font-semibold">Share</p>
                            <button onClick={closeShare} className="text-gray-400 hover:text-white transition" aria-label="Close share popup">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 overflow-x-auto -ml-2">
                            <button onClick={handleShareToWhatsApp} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on WhatsApp">
                                <img src="/images/share_whatsapp.png" alt="WhatsApp" className="w-full h-full object-cover rounded-full" />
                            </button>
                            <button onClick={handleShareToThreads} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Threads">
                                <img src="/images/share_thread.png" alt="Threads" className="w-full h-full object-cover rounded-full" />
                            </button>
                            <button onClick={handleShareToInstagram} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Instagram">
                                <img src="/images/share_insta.png" alt="Instagram" className="w-full h-full object-cover rounded-full" />
                            </button>
                            <button onClick={handleShareToLinkedIn} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on LinkedIn">
                                <img src="/images/Share_linkedin.png" alt="LinkedIn" className="w-full h-full object-cover rounded-full" />
                            </button>
                            <button onClick={handleShareToX} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on X">
                                <img src="/images/Share_X.png" alt="X" className="w-full h-full object-cover rounded-full" />
                            </button>
                            <button onClick={handleCopyLink} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Copy share link">
                                <img src="/images/share_copy_link.png" alt="Copy link" className="w-full h-full object-cover rounded-full" />
                            </button>
                        </div>

                        {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
                    </div>
                </>
            )}
        </div>
    );
}