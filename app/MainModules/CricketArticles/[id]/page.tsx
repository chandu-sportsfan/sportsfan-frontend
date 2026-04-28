// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import { ArrowLeft } from "lucide-react";

// type BadgeType = "FEATURE" | "ANALYSIS" | "OPINION" | "NEWS";

// interface ArticleDetail {
//     id: string;
//     badge: BadgeType;
//     title: string;
//     readTime: string;
//     views: string;
//     image: string;
//     createdAt: number;
//     updatedAt?: number;
//     description: string[];
// }

// const BADGE_COLORS: Record<BadgeType, string> = {
//     FEATURE: "bg-pink-600",
//     ANALYSIS: "bg-orange-500",
//     OPINION: "bg-purple-600",
//     NEWS: "bg-blue-600",
// };

// export default function CricketArticleDetail() {
//     const { id } = useParams();
//     const router = useRouter();
//     const [article, setArticle] = useState<ArticleDetail | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [copied, setCopied] = useState(false);
//     const [showShareDialog, setShowShareDialog] = useState(false);

//     const buildArticleUrl = (articleId: string) => {
//         if (typeof window === "undefined") return "";
//         return `${window.location.origin}/MainModules/CricketArticles/${articleId}`;
//     };

//     const buildArticleShareText = (target: ArticleDetail) => {
//         const shareUrl = buildArticleUrl(target.id);
//         return [
//             `Read ${target.title} on Sportsfan`,
//             `${target.readTime} • ${target.views}`,
//             `View article: ${shareUrl}`,
//         ].join("\n");
//     };

//     const copyToClipboard = async (text: string) => {
//         try {
//             await navigator.clipboard.writeText(text);
//             return true;
//         } catch {
//             try {
//                 const input = document.createElement("textarea");
//                 input.value = text;
//                 input.style.position = "fixed";
//                 input.style.opacity = "0";
//                 document.body.appendChild(input);
//                 input.focus();
//                 input.select();
//                 const ok = document.execCommand("copy");
//                 document.body.removeChild(input);
//                 return ok;
//             } catch {
//                 return false;
//             }
//         }
//     };

//     const openShareDialog = () => {
//         setShowShareDialog(true);
//         setCopied(false);
//     };

//     const closeShareDialog = () => {
//         setShowShareDialog(false);
//         setCopied(false);
//     };

//     const handleShareToWhatsApp = () => {
//         if (!article) return;
//         const shareText = buildArticleShareText(article);
//         const whatsappAppUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
//         const whatsappWebFallbackUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
//         const opened = window.open(whatsappAppUrl, "_self");
//         if (!opened) {
//             window.location.href = whatsappWebFallbackUrl;
//         }
//     };

//     const handleShareToThreads = () => {
//         if (!article) return;
//         const shareText = buildArticleShareText(article);
//         window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
//     };

//     const handleShareToInstagram = async () => {
//         if (!article) return;
//         const shareText = buildArticleShareText(article);
//         const ok = await copyToClipboard(shareText);
//         if (ok) {
//             setCopied(true);
//             setTimeout(() => setCopied(false), 1600);
//         }
//         window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
//     };

//     const handleShareToLinkedIn = () => {
//         if (!article) return;
//         const shareUrl = buildArticleUrl(article.id);
//         window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
//     };

//     const handleShareToX = () => {
//         if (!article) return;
//         const shareText = buildArticleShareText(article);
//         window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
//     };

//     const handleCopyLink = async () => {
//         if (!article) return;
//         const ok = await copyToClipboard(buildArticleShareText(article));
//         if (!ok) return;
//         setCopied(true);
//         setTimeout(() => setCopied(false), 1600);
//     };

//     useEffect(() => {
//         if (!id) return;
//         const fetchArticle = async () => {
//             try {
//                 const res = await axios.get(`/api/cricket-articles/${id}`);
//                 setArticle(res.data.article);
//             } catch (err) {
//                 setError("Failed to load article.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchArticle();
//     }, [id]);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center min-h-screen bg-[#0d0d10]">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
//             </div>
//         );
//     }

//     if (error || !article) {
//         return (
//             <div className="flex flex-col justify-center items-center min-h-screen bg-[#0d0d10] gap-4">
//                 <p className="text-red-400">{error || "Article not found"}</p>
//                 <button
//                     onClick={() => router.back()}
//                     className="bg-pink-500 px-4 py-2 rounded text-white hover:bg-pink-600"
//                 >
//                     Go Back
//                 </button>
//             </div>
//         );
//     }

//     const topParas = article.description.slice(0, 2);
//     const remainingParas = article.description.slice(2);

//     return (
//         <div className="min-h-screen text-white px-4 py-6 max-w-6xl mx-auto">
//             {/* Back button */}
//             <button
//                 onClick={() => router.back()}
//                 className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
//             >
//                 <ArrowLeft size={18} />
//                 <span className="text-sm">Back</span>
//             </button>

//             {/* Top two-column layout */}
//             <div className="flex flex-col lg:flex-row gap-8">

//                 {/* LEFT — Image, Badge, Title, Meta */}
//                 <div className="lg:w-2/5 flex flex-col gap-4">
//                     <div className="w-full rounded-xl overflow-hidden">
//                         <img
//                             src={article.image}
//                             alt={article.title}
//                             className="w-full object-cover max-h-[300px] lg:max-h-[400px]"
//                         />
//                     </div>

//                     <span className={`text-xs font-bold px-3 py-1 rounded-md text-white w-fit ${BADGE_COLORS[article.badge] || "bg-gray-600"}`}>
//                         {article.badge}
//                     </span>

//                     <h1 className="text-2xl font-bold leading-snug">{article.title}</h1>

//                     <div className="relative flex items-center gap-3">
//                         <p className="text-gray-400 text-sm">
//                             {article.readTime}
//                             <span className="mx-2">•</span>
//                             {article.views}
//                         </p>
//                         <button
//                             type="button"
//                             onClick={openShareDialog}
//                             className="w-8 h-8 rounded-full bg-[#1e1e22] flex items-center justify-center hover:bg-[#2a2a2e] transition"
//                             aria-label="Share article"
//                         >
//                             <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//                                 <circle cx="12" cy="3" r="1.8" stroke="#aaa" strokeWidth="1.4" />
//                                 <circle cx="12" cy="13" r="1.8" stroke="#aaa" strokeWidth="1.4" />
//                                 <circle cx="4" cy="8" r="1.8" stroke="#aaa" strokeWidth="1.4" />
//                                 <path d="M10.3 3.9L5.7 7.1M10.3 12.1L5.7 8.9" stroke="#aaa" strokeWidth="1.4" strokeLinecap="round" />
//                             </svg>
//                         </button>

//                         {showShareDialog && article && (
//                             <div className="hidden lg:block absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 z-50 w-[260px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl">
//                                 <div className="flex items-center justify-between mb-2">
//                                     <p className="text-white text-sm font-semibold">Share Article</p>
//                                     <button onClick={closeShareDialog} className="text-gray-400 hover:text-white transition" aria-label="Close share panel">
//                                         <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
//                                             <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//                                         </svg>
//                                     </button>
//                                 </div>

//                                 <div className="rounded-xl border border-white/10 bg-[#111114] p-3 mb-2">
//                                     <p className="text-white text-sm font-semibold line-clamp-2">{article.title}</p>
//                                     <p className="text-white/65 text-xs mt-1 line-clamp-2">{article.badge}</p>
//                                     <p className="text-white/45 text-[11px] mt-2 line-clamp-2 break-all">{buildArticleUrl(article.id)}</p>
//                                 </div>

//                                 <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 -ml-1">
//                                     <button onClick={handleShareToWhatsApp} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on WhatsApp">
//                                         <img src="/images/share_whatsapp.png" alt="WhatsApp" className="w-full h-full object-cover rounded-full" />
//                                     </button>
//                                     <button onClick={handleShareToThreads} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Threads">
//                                         <img src="/images/share_thread.png" alt="Threads" className="w-full h-full object-cover rounded-full" />
//                                     </button>
//                                     <button onClick={handleShareToInstagram} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Instagram">
//                                         <img src="/images/share_insta.png" alt="Instagram" className="w-full h-full object-cover rounded-full" />
//                                     </button>
//                                     <button onClick={handleShareToLinkedIn} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on LinkedIn">
//                                         <img src="/images/Share_linkedin.png" alt="LinkedIn" className="w-full h-full object-cover rounded-full" />
//                                     </button>
//                                     <button onClick={handleShareToX} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on X">
//                                         <img src="/images/Share_X.png" alt="X" className="w-full h-full object-cover rounded-full" />
//                                     </button>
//                                     <button onClick={handleCopyLink} className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Copy share link">
//                                         <img src="/images/share_copy_link.png" alt="Copy link" className="w-full h-full object-cover rounded-full" />
//                                     </button>
//                                 </div>
//                                 {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* RIGHT — First 2 paragraphs */}
//                 <div className="lg:w-3/5 flex flex-col gap-5 lg:border-l lg:border-white/10 lg:pl-8">
//                     <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-3">
//                         Article
//                     </h2>
//                     {/* {topParas.map((para, index) => (
//                         <p key={index} className="text-gray-300 leading-relaxed text-[15px]">
//                             {para}
//                         </p>
//                     ))} */}
//                     {topParas.map((para, index) => (
//                         <p
//                             key={index}
//                             className="text-gray-300 leading-relaxed text-[15px]"
//                             dangerouslySetInnerHTML={{ __html: para }}
//                         />
//                     ))}

//                 </div>
//             </div>

//             {/* Remaining paragraphs — full width below */}
//             {/* {remainingParas.length > 0 && (
//                 <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 pb-12">
//                     {remainingParas.map((para, index) => (
//                         <p key={index} className="text-gray-300 leading-relaxed text-[15px]">
//                             {para}
//                         </p>
//                     ))}
//                 </div>
//             )} */}
//             {remainingParas.map((para, index) => (
//                 <p
//                     key={index}
//                     className="text-gray-300 leading-relaxed text-[15px]"
//                     dangerouslySetInnerHTML={{ __html: para }}
//                 />
//             ))}

//             {showShareDialog && article && (
//                 <>
//                     <button
//                         type="button"
//                         aria-label="Close share popup"
//                         className="fixed inset-0 z-40 bg-black/70 lg:hidden"
//                         onClick={closeShareDialog}
//                     />
//                     <div
//                         className="fixed bottom-16 inset-x-4 z-50 mx-auto w-full max-w-[260px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl lg:hidden"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <div className="flex items-center justify-between mb-2">
//                             <p className="text-white text-sm font-semibold">Share</p>
//                             <button onClick={closeShareDialog} className="text-gray-400 hover:text-white transition" aria-label="Close share popup">
//                                 <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
//                                     <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//                                 </svg>
//                             </button>
//                         </div>

//                         <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 overflow-x-auto -ml-1">
//                             <button onClick={handleShareToWhatsApp} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on WhatsApp">
//                                 <img src="/images/share_whatsapp.png" alt="WhatsApp" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                             <button onClick={handleShareToThreads} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Threads">
//                                 <img src="/images/share_thread.png" alt="Threads" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                             <button onClick={handleShareToInstagram} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on Instagram">
//                                 <img src="/images/share_insta.png" alt="Instagram" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                             <button onClick={handleShareToLinkedIn} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on LinkedIn">
//                                 <img src="/images/Share_linkedin.png" alt="LinkedIn" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                             <button onClick={handleShareToX} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Share on X">
//                                 <img src="/images/Share_X.png" alt="X" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                             <button onClick={handleCopyLink} className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 p-0 flex items-center justify-center" aria-label="Copy share link">
//                                 <img src="/images/share_copy_link.png" alt="Copy link" className="w-full h-full object-cover rounded-full" />
//                             </button>
//                         </div>

//                         {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
//                     </div>

//                 </>
//             )}
//         </div>
//     );
// }








"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import CommentsSection from "@/src/components/CommentsSection";

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
    const [copied, setCopied] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);

    const buildArticleUrl = (articleId: string) => {
        if (typeof window === "undefined") return "";
        return `${window.location.origin}/MainModules/CricketArticles/${articleId}`;
    };

    const buildArticleShareText = (target: ArticleDetail) => {
        const shareUrl = buildArticleUrl(target.id);
        return [
            `Read ${target.title} on Sportsfan`,
            `${target.readTime} • ${target.views}`,
            `View article: ${shareUrl}`,
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

    const openShareDialog = () => {
        setShowShareDialog(true);
        setCopied(false);
    };

    const closeShareDialog = () => {
        setShowShareDialog(false);
        setCopied(false);
    };

    const handleShareToWhatsApp = () => {
        if (!article) return;
        const shareText = buildArticleShareText(article);
        const whatsappAppUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
        const whatsappWebFallbackUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        const opened = window.open(whatsappAppUrl, "_self");
        if (!opened) {
            window.location.href = whatsappWebFallbackUrl;
        }
    };

    const handleShareToThreads = () => {
        if (!article) return;
        const shareText = buildArticleShareText(article);
        window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
    };

    const handleShareToInstagram = async () => {
        if (!article) return;
        const shareText = buildArticleShareText(article);
        const ok = await copyToClipboard(shareText);
        if (ok) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        }
        window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    };

    const handleShareToLinkedIn = () => {
        if (!article) return;
        const shareUrl = buildArticleUrl(article.id);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
    };

    const handleShareToX = () => {
        if (!article) return;
        const shareText = buildArticleShareText(article);
        window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
    };

    const handleCopyLink = async () => {
        if (!article) return;
        const ok = await copyToClipboard(buildArticleShareText(article));
        if (!ok) return;
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
    };

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

                    <div className="relative flex items-center gap-3">
                        <p className="text-gray-400 text-sm">
                            {article.readTime}
                            <span className="mx-2">•</span>
                            {article.views}
                        </p>
                        <button
                            type="button"
                            onClick={openShareDialog}
                            className="w-8 h-8 rounded-full bg-[#1e1e22] flex items-center justify-center hover:bg-[#2a2a2e] transition"
                            aria-label="Share article"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="12" cy="3" r="1.8" stroke="#aaa" strokeWidth="1.4" />
                                <circle cx="12" cy="13" r="1.8" stroke="#aaa" strokeWidth="1.4" />
                                <circle cx="4" cy="8" r="1.8" stroke="#aaa" strokeWidth="1.4" />
                                <path d="M10.3 3.9L5.7 7.1M10.3 12.1L5.7 8.9" stroke="#aaa" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                        </button>

                        {showShareDialog && article && (
                            <div className="hidden lg:block absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 z-50 w-[260px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-white text-sm font-semibold">Share Article</p>
                                    <button onClick={closeShareDialog} className="text-gray-400 hover:text-white transition" aria-label="Close share panel">
                                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-[#111114] p-3 mb-2">
                                    <p className="text-white text-sm font-semibold line-clamp-2">{article.title}</p>
                                    <p className="text-white/65 text-xs mt-1 line-clamp-2">{article.badge}</p>
                                    <p className="text-white/45 text-[11px] mt-2 line-clamp-2 break-all">{buildArticleUrl(article.id)}</p>
                                </div>

                                <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 -ml-1">
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

                    {/* Desktop comments under meta/views */}
                    <div className="hidden lg:block mt-6">
                         <CommentsSection
                                                    contentId={article.id || ""}
                                                    contentType="article"
                                                    contentTitle={article.title}
                                                    className="mt-5"
                                                />
                    </div>
                </div>

                {/* RIGHT — First 2 paragraphs */}
                <div className="lg:w-3/5 flex flex-col gap-5 lg:border-l lg:border-white/10 lg:pl-8">
                    <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-3">
                        Article
                    </h2>
                    {/* {topParas.map((para, index) => (
                        <p key={index} className="text-gray-300 leading-relaxed text-[15px]">
                            {para}
                        </p>
                    ))} */}
                    {topParas.map((para, index) => (
                        <p
                            key={index}
                            className="text-gray-300 leading-relaxed text-[15px]"
                            dangerouslySetInnerHTML={{ __html: para }}
                        />
                    ))}

                </div>
            </div>

            {/* Remaining paragraphs — full width below */}
            {/* {remainingParas.length > 0 && (
                <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-6 pb-12">
                    {remainingParas.map((para, index) => (
                        <p key={index} className="text-gray-300 leading-relaxed text-[15px]">
                            {para}
                        </p>
                    ))}
                </div>
            )} */}
            {remainingParas.map((para, index) => (
                <p
                    key={index}
                    className="text-gray-300 leading-relaxed text-[15px]"
                    dangerouslySetInnerHTML={{ __html: para }}
                />
            ))}

            {/* Comments section (mobile only) */}
            <div className="mt-8 lg:hidden">
                 <CommentsSection
                                            contentId={article.id || ""}
                                            contentType="article"
                                            contentTitle={article.title}
                                            className="mt-5"
                                        />
            </div>

            {showShareDialog && article && (
                <>
                    <button
                        type="button"
                        aria-label="Close share popup"
                        className="fixed inset-0 z-40 bg-black/70 lg:hidden"
                        onClick={closeShareDialog}
                    />
                    <div
                        className="fixed bottom-16 inset-x-4 z-50 mx-auto w-full max-w-[260px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl lg:hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-white text-sm font-semibold">Share</p>
                            <button onClick={closeShareDialog} className="text-gray-400 hover:text-white transition" aria-label="Close share popup">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 overflow-x-auto -ml-1">
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