
// "use client";
// import { useState, useRef } from "react";
// import { motion } from "framer-motion";

// interface RoarJourneySectionProps {
//     predictions: number;
//     debates: number;
//     posts: number;
//     badgeSrcs: string[];      // unlocked badge image paths
//     onToast: (m: string) => void;
// }

// function buildShareText(
//     predictions: number,
//     debates: number,
//     posts: number,
//     badgeCount: number,
// ) {
//     return [
//         "🔥 My Roar Journey on Sportsfan360",
//         "",
//         `🔮 Predictions: ${predictions}`,
//         `⚡ Debates: ${debates}`,
//         `✏️ Posts: ${posts}`,
//         badgeCount > 0 ? `🏅 Badges Earned: ${badgeCount}` : null,
//         "",
//         "Join us 👉 https://sportsfan-frontend.vercel.app/",
//         "#StartRoaring #Sportsfan360",
//     ]
//         .filter((l) => l !== null)
//         .join("\n");
// }

// export function RoarJourneySection({
//     predictions,
//     debates,
//     posts,
//     badgeSrcs,
//     onToast,
// }: RoarJourneySectionProps) {
//     const [sharing, setSharing] = useState(false);

//     // const handleShare = async () => {
//     //     if (sharing) return;
//     //     setSharing(true);
//     //     const text = buildShareText(predictions, debates, posts, badgeSrcs.length);
//     //     try {
//     //         if (typeof navigator !== "undefined" && navigator.share) {
//     //             await navigator.share({ title: "My Roar Journey", text });
//     //         } else {
//     //             await navigator.clipboard.writeText(text);
//     //             onToast("Journey copied to clipboard!");
//     //         }
//     //     } catch (err: any) {
//     //         if (err?.name !== "AbortError") onToast("Could not share.");
//     //     } finally {
//     //         setSharing(false);
//     //     }
//     // };

//     const canvasRef = useRef<HTMLCanvasElement>(null);

//     const generateShareCard = (): Promise<Blob | null> => {
//         return new Promise((resolve) => {
//             const canvas = document.createElement("canvas");
//             canvas.width = 1340;
//             canvas.height = 752;
//             const ctx = canvas.getContext("2d");
//             if (!ctx) return resolve(null);

//             const bg = new window.Image();
//             bg.crossOrigin = "anonymous";
//             bg.src = "/images/profilecard.png"; // your background image path
//             bg.onload = () => {
//                 ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

//                 // Stats overlay — position matches the card layout
//                 const stats = [
//                     { icon: "🔮", label: "PREDICTIONS", value: predictions, x: 220 },
//                     { icon: "⚡", label: "DEBATES", value: debates, x: 490 },
//                     { icon: "✏️", label: "POSTS", value: posts, x: 760 },
//                     { icon: "🏅", label: "BADGES EARNED", value: badgeSrcs.length, x: 1030 },
//                 ];

//                 stats.forEach(({ icon, label, value, x }) => {
//                     const y = 530;

//                     // Big number
//                     ctx.font = "bold 88px Arial";
//                     ctx.fillStyle = label === "PREDICTIONS" ? "#9333EA"
//                         : label === "DEBATES" ? "#F97316"
//                             : label === "POSTS" ? "#14B8A6"
//                                 : "#F97316";
//                     ctx.textAlign = "center";
//                     ctx.fillText(String(value), x + 50, y);

//                     // Label
//                     ctx.font = "bold 22px Arial";
//                     ctx.fillStyle = "#1a1a1a";
//                     ctx.fillText(label, x + 50, y + 48);
//                 });

//                 canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
//             };
//             bg.onerror = () => resolve(null);
//         });
//     };

//     const handleShare = async () => {
//         if (sharing) return;
//         setSharing(true);
//         try {
//             const blob = await generateShareCard();
//             if (blob && typeof navigator !== "undefined" && navigator.share) {
//                 const file = new File([blob], "my-roar-journey.png", { type: "image/png" });
//                 if (navigator.canShare?.({ files: [file] })) {
//                     await navigator.share({ files: [file], title: "My Roar Journey" });
//                     setSharing(false);
//                     return;
//                 }
//             }
//             // Fallback: download the image
//             if (blob) {
//                 const url = URL.createObjectURL(blob);
//                 const a = document.createElement("a");
//                 a.href = url;
//                 a.download = "my-roar-journey.png";
//                 a.click();
//                 URL.revokeObjectURL(url);
//                 onToast("Card saved! Share it from your gallery.");
//             } else {
//                 // Final fallback: plain text
//                 await navigator.clipboard?.writeText(
//                     buildShareText(predictions, debates, posts, badgeSrcs.length)
//                 );
//                 onToast("Copied to clipboard!");
//             }
//         } catch (err: any) {
//             if (err?.name !== "AbortError") onToast("Could not share.");
//         } finally {
//             setSharing(false);
//         }
//     };

//     const displayedBadges = badgeSrcs.slice(0, 4);

//     return (
//         <div style={{ padding: "0 14px 18px" }}>
//             {/* ── Card ── */}
//             <div
//                 style={{
//                     borderRadius: 20,
//                     overflow: "hidden",
//                     background: "linear-gradient(160deg, #1c1628 0%, #0e0e18 60%, #180e20 100%)",
//                     border: "1px solid rgba(255,255,255,0.07)",
//                     position: "relative",
//                 }}
//             >
//                 {/* decorative glow — top-right */}
//                 <div
//                     style={{
//                         position: "absolute", top: -40, right: -40,
//                         width: 160, height: 160, borderRadius: "50%",
//                         background: "rgba(233,30,140,0.1)", filter: "blur(44px)",
//                         pointerEvents: "none",
//                     }}
//                 />

//                 {/* ── Header row ── */}
//                 <div
//                     style={{
//                         display: "flex", alignItems: "center",
//                         justifyContent: "space-between",
//                         padding: "14px 16px 10px",
//                     }}
//                 >
//                     <span
//                         style={{
//                             fontSize: 13, fontWeight: 700, color: "#fff",
//                             letterSpacing: "0.01em",
//                         }}
//                     >
//                         Your Roar Journey
//                     </span>

//                     {/* ROAR. pill */}
//                     <div
//                         style={{
//                             background: "linear-gradient(135deg, #E91E8C 0%, #FF6B35 100%)",
//                             borderRadius: 8, padding: "3px 10px",
//                         }}
//                     >
//                         <span
//                             style={{
//                                 fontFamily: "'Bebas Neue','Impact','Arial Narrow',sans-serif",
//                                 fontSize: 16, fontWeight: 900,
//                                 letterSpacing: "0.08em", color: "#fff",
//                             }}
//                         >
//                             ROAR.
//                         </span>
//                     </div>
//                 </div>

//                 {/* ── Stats row ── */}
//                 <div
//                     style={{
//                         display: "grid", gridTemplateColumns: "repeat(3,1fr)",
//                         gap: 8, padding: "0 14px 14px",
//                     }}
//                 >
//                     {[
//                         { label: "PREDICT", value: predictions, icon: "🔮", hot: true },
//                         { label: "DEBATE", value: debates, icon: "⚡", hot: false },
//                         { label: "POST", value: posts, icon: "✏️", hot: false },
//                     ].map(({ label, value, icon, hot }) => (
//                         <div
//                             key={label}
//                             style={{
//                                 background: "#0a0a14",
//                                 border: `1px solid ${hot ? "rgba(233,30,140,0.25)" : "rgba(255,255,255,0.06)"}`,
//                                 borderRadius: 16,
//                                 padding: "10px 10px 8px",
//                                 display: "flex", flexDirection: "column",
//                                 alignItems: "flex-start", gap: 6,
//                             }}
//                         >
//                             {/* pill */}
//                             <div
//                                 style={{
//                                     display: "inline-flex", alignItems: "center", gap: 3,
//                                     background: hot ? "rgba(233,30,140,0.18)" : "rgba(255,255,255,0.08)",
//                                     borderRadius: 999, padding: "2px 7px 2px 5px",
//                                 }}
//                             >
//                                 <span style={{ fontSize: 9, lineHeight: 1 }}>{icon}</span>
//                                 <span
//                                     style={{
//                                         fontSize: 8, fontWeight: 800,
//                                         letterSpacing: "0.07em",
//                                         color: hot ? "#E91E8C" : "rgba(255,255,255,0.6)",
//                                         textTransform: "uppercase",
//                                     }}
//                                 >
//                                     {label}
//                                 </span>
//                             </div>
//                             {/* number */}
//                             <span
//                                 style={{
//                                     fontFamily: "'Bebas Neue','Impact','Arial Narrow',sans-serif",
//                                     fontSize: 36, fontWeight: 900,
//                                     color: "#fff", lineHeight: 1, paddingLeft: 2,
//                                 }}
//                             >
//                                 {value}
//                             </span>
//                         </div>
//                     ))}
//                 </div>

//                 {/* ── Badges earned ── */}
//                 <div style={{ padding: "0 14px 14px" }}>
//                     <p
//                         style={{
//                             fontSize: 11, fontWeight: 700,
//                             letterSpacing: "0.08em",
//                             color: "rgba(255,255,255,0.45)",
//                             marginBottom: 10, textTransform: "uppercase",
//                         }}
//                     >
//                         Badges Earned
//                     </p>
//                     <div style={{ display: "flex", gap: 10 }}>
//                         {displayedBadges.map((src, i) => (
//                             <div
//                                 key={i}
//                                 style={{
//                                     width: 58, height: 58, borderRadius: 14,
//                                     background: "rgba(255,255,255,0.04)",
//                                     border: "1px solid rgba(255,255,255,0.07)",
//                                     display: "flex", alignItems: "center",
//                                     justifyContent: "center", overflow: "hidden", flexShrink: 0,
//                                 }}
//                             >
//                                 <img
//                                     src={src} alt={`Badge ${i + 1}`}
//                                     style={{ width: 48, height: 48, objectFit: "contain" }}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 {/* ── Footer ── */}
//                 <div
//                     style={{
//                         display: "flex", alignItems: "center",
//                         justifyContent: "space-between",
//                         padding: "10px 14px 16px",
//                     }}
//                 >
//                     <div>
//                         <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: "0 0 2px" }}>
//                             Join us at Sportsfan360
//                         </p>
//                         <p
//                             style={{
//                                 fontSize: 10, fontWeight: 800, margin: 0,
//                                 background: "linear-gradient(90deg,#E91E8C,#FF6B35)",
//                                 WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//                             }}
//                         >
//                             #StartRoaring
//                         </p>
//                     </div>

//                     <motion.button
//                         whileTap={{ scale: 0.91 }}
//                         onClick={handleShare}
//                         disabled={sharing}
//                         style={{
//                             padding: "9px 22px",
//                             border: "1.5px solid rgba(255,255,255,0.3)",
//                             borderRadius: 999,
//                             background: "transparent",
//                             color: "#fff", fontSize: 13, fontWeight: 700,
//                             cursor: sharing ? "not-allowed" : "pointer",
//                             letterSpacing: "0.01em",
//                             opacity: sharing ? 0.6 : 1,
//                             transition: "opacity 0.15s",
//                         }}
//                     >
//                         {sharing ? "Sharing…" : "Share"}
//                     </motion.button>
//                 </div>
//             </div>
//         </div>
//     );
// }




"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface RoarJourneySectionProps {
    predictions: number;
    debates: number;
    posts: number;
    badgeSrcs: string[];
    onToast: (m: string) => void;
}

export function RoarJourneySection({
    predictions,
    debates,
    posts,
    badgeSrcs,
    onToast,
}: RoarJourneySectionProps) {
    const [sharing, setSharing] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [cardImageUrl, setCardImageUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    // ── Generate card with stats overlaid ──────────────────────────────────────
    const generateCard = useCallback(async (): Promise<string | null> => {
        return new Promise((resolve) => {
            setIsGenerating(true);

            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = "/images/profilecard.png";

            img.onload = () => {
                try {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    if (!ctx) { setIsGenerating(false); return resolve(null); }

                    canvas.width = img.width;
                    canvas.height = img.height;
                    setImageDimensions({ width: img.width, height: img.height });

                    ctx.drawImage(img, 0, 0);

                    // Base design is 1536x1024 — scale only if the loaded asset differs
                    const scaleX = canvas.width / 1536;
                    const scaleY = canvas.height / 1024;

                    // Number positions sit directly ABOVE each label, inside the white panel
                    const stats = [
                        { value: predictions.toString(), x: 285 * scaleX, y: 745 * scaleY, color: "#5B21B6" },
                        { value: debates.toString(), x: 620 * scaleX, y: 745 * scaleY, color: "#EA580C" },
                        { value: posts.toString(), x: 932 * scaleX, y: 745 * scaleY, color: "#0D9488" },
                        { value: badgeSrcs.length.toString(), x: 1255 * scaleX, y: 745 * scaleY, color: "#DB2777" },
                    ];

                    const fontSize = 64 * Math.min(scaleX, scaleY);

                    stats.forEach(({ value, x, y, color }) => {
                        ctx.shadowColor = "rgba(0,0,0,0.15)";
                        ctx.shadowBlur = 4;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 2;

                        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
                        ctx.fillStyle = color;
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        ctx.fillText(value, x, y);

                        ctx.shadowColor = "transparent";
                        ctx.shadowBlur = 0;
                        ctx.shadowOffsetY = 0;
                    });

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const url = URL.createObjectURL(blob);
                            setCardImageUrl(url);
                            setIsGenerating(false);
                            resolve(url);
                        } else {
                            setIsGenerating(false);
                            resolve(null);
                        }
                    }, "image/png", 0.95);
                } catch (error) {
                    console.error("Error generating card:", error);
                    setIsGenerating(false);
                    resolve(null);
                }
            };

            img.onerror = (event: string | Event) => {
                const errorMsg = typeof event === 'string' ? event : 'Failed to load image';
                console.error("Failed to load card image:", errorMsg);
                setIsGenerating(false);
                resolve(null);
            };
        });
    }, [predictions, debates, posts, badgeSrcs.length]);

    // ── Pre-generate card when stats change ───────────────────────────────────
    useEffect(() => {
        if (predictions !== undefined && debates !== undefined && posts !== undefined) {
            generateCard();
        }
    }, [predictions, debates, posts]);

    // ── Share handler ──────────────────────────────────────────────────────────
    const handleShare = async () => {
        if (sharing || isGenerating) return;
        setSharing(true);

        try {
            let url = cardImageUrl;
            if (!url) {
                url = await generateCard();
            }

            if (!url) {
                const text = buildShareText();
                await copyToClipboard(text);
                onToast("Copied to clipboard!");
                setSharing(false);
                return;
            }

            // Download the image
            const link = document.createElement("a");
            link.href = url;
            link.download = "my-roar-journey.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            onToast("Card downloaded! Share it from your gallery.");

        } catch (error) {
            console.error("Share error:", error);
            onToast("Failed to share. Please try again.");
        } finally {
            setSharing(false);
        }
    };

    // ── Build share text (fallback) ───────────────────────────────────────────
    const buildShareText = useCallback(() => {
        return [
            "🔥 My Roar Journey on Sportsfan360",
            "",
            `🔮 Predictions: ${predictions}`,
            `⚡ Debates: ${debates}`,
            `✏️ Posts: ${posts}`,
            badgeSrcs.length > 0 ? `🏅 Badges Earned: ${badgeSrcs.length}` : null,
            "",
            "Join us 👉 https://sportsfan-frontend.vercel.app/MainModules/ROAR",
            "#StartRoaring #Sportsfan360",
        ]
            .filter((l) => l !== null)
            .join("\n");
    }, [predictions, debates, posts, badgeSrcs.length]);

    // ── Copy helper ──────────────────────────────────────────────────────────
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            try {
                const el = document.createElement("textarea");
                el.value = text;
                el.style.cssText = "position:fixed;opacity:0";
                document.body.appendChild(el);
                el.focus();
                el.select();
                const ok = document.execCommand("copy");
                document.body.removeChild(el);
                return ok;
            } catch {
                return false;
            }
        }
    };

    // ── Share actions ─────────────────────────────────────────────────────────
    const shareActions = [
        {
            alt: "Download Image",
            src: "/images/share_copy_link.png",
            handler: handleShare
        },
        {
            alt: "WhatsApp",
            src: "/images/share_whatsapp.png",
            handler: () => {
                const text = buildShareText();
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
            }
        },
        {
            alt: "X",
            src: "/images/Share_X.png",
            handler: () => {
                const text = buildShareText();
                window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
            }
        },
        {
            alt: "Copy Text",
            src: "/images/share_copy_link.png",
            handler: async () => {
                const text = buildShareText();
                const ok = await copyToClipboard(text);
                if (ok) {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1600);
                    onToast("Copied to clipboard!");
                }
            }
        },
    ];

    const displayedBadges = badgeSrcs.slice(0, 4);

    return (
        <div style={{ padding: "0 14px 18px" }}>
            {/* ── Card ── */}
            <div
                style={{
                    borderRadius: 20,
                    overflow: "hidden",
                    background: "linear-gradient(160deg, #1c1628 0%, #0e0e18 60%, #180e20 100%)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    position: "relative",
                }}
            >
                {/* Decorative glow */}
                <div
                    style={{
                        position: "absolute", top: -40, right: -40,
                        width: 160, height: 160, borderRadius: "50%",
                        background: "rgba(233,30,140,0.1)", filter: "blur(44px)",
                        pointerEvents: "none",
                    }}
                />

                {/* ── Header row ── */}
                <div
                    style={{
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 16px 10px",
                    }}
                >
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.01em" }}>
                        Your Roar Journey
                    </span>

                    <div
                        style={{
                            background: "linear-gradient(135deg, #E91E8C 0%, #FF6B35 100%)",
                            borderRadius: 8, padding: "3px 10px",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "'Bebas Neue','Impact','Arial Narrow',sans-serif",
                                fontSize: 16, fontWeight: 900,
                                letterSpacing: "0.08em", color: "#fff",
                            }}
                        >
                            ROAR.
                        </span>
                    </div>
                </div>

                {/* ── Stats row ── */}
                <div
                    style={{
                        display: "grid", gridTemplateColumns: "repeat(3,1fr)",
                        gap: 8, padding: "0 14px 14px",
                    }}
                >
                    {[
                        { label: "PREDICT", value: predictions, icon: "🔮", hot: true },
                        { label: "DEBATE", value: debates, icon: "⚡", hot: false },
                        { label: "POST", value: posts, icon: "✏️", hot: false },
                    ].map(({ label, value, icon, hot }) => (
                        <div
                            key={label}
                            style={{
                                background: "#0a0a14",
                                border: `1px solid ${hot ? "rgba(233,30,140,0.25)" : "rgba(255,255,255,0.06)"}`,
                                borderRadius: 16,
                                padding: "10px 10px 8px",
                                display: "flex", flexDirection: "column",
                                alignItems: "flex-start", gap: 6,
                            }}
                        >
                            <div
                                style={{
                                    display: "inline-flex", alignItems: "center", gap: 3,
                                    background: hot ? "rgba(233,30,140,0.18)" : "rgba(255,255,255,0.08)",
                                    borderRadius: 999, padding: "2px 7px 2px 5px",
                                }}
                            >
                                <span style={{ fontSize: 9, lineHeight: 1 }}>{icon}</span>
                                <span
                                    style={{
                                        fontSize: 8, fontWeight: 800,
                                        letterSpacing: "0.07em",
                                        color: hot ? "#E91E8C" : "rgba(255,255,255,0.6)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {label}
                                </span>
                            </div>
                            <span
                                style={{
                                    fontFamily: "'Bebas Neue','Impact','Arial Narrow',sans-serif",
                                    fontSize: 36, fontWeight: 900,
                                    color: "#fff", lineHeight: 1, paddingLeft: 2,
                                }}
                            >
                                {value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* ── Badges earned ── */}
                <div style={{ padding: "0 14px 14px" }}>
                    <p
                        style={{
                            fontSize: 11, fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "rgba(255,255,255,0.45)",
                            marginBottom: 10, textTransform: "uppercase",
                        }}
                    >
                        Badges Earned
                    </p>
                    <div style={{ display: "flex", gap: 10 }}>
                        {displayedBadges.map((src, i) => (
                            <div
                                key={i}
                                style={{
                                    width: 58, height: 58, borderRadius: 14,
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", overflow: "hidden", flexShrink: 0,
                                }}
                            >
                                <img
                                    src={src}
                                    alt={`Badge ${i + 1}`}
                                    style={{ width: 48, height: 48, objectFit: "contain" }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Footer ── */}
                <div
                    style={{
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px 16px",
                    }}
                >
                    <div>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: "0 0 2px" }}>
                            Join us at Sportsfan360
                        </p>
                        <p
                            style={{
                                fontSize: 10, fontWeight: 800, margin: 0,
                                background: "linear-gradient(90deg,#E91E8C,#FF6B35)",
                                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                            }}
                        >
                            #StartRoaring
                        </p>
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.91 }}
                        onClick={() => setShareOpen(true)}
                        disabled={isGenerating}
                        style={{
                            padding: "9px 22px",
                            border: "1.5px solid rgba(255,255,255,0.3)",
                            borderRadius: 999,
                            background: "transparent",
                            color: "#fff", fontSize: 13, fontWeight: 700,
                            cursor: isGenerating ? "not-allowed" : "pointer",
                            letterSpacing: "0.01em",
                            opacity: isGenerating ? 0.6 : 1,
                        }}
                    >
                        {isGenerating ? "Generating..." : "Share"}
                    </motion.button>
                </div>
            </div>

            {/* ── Share Modal ── */}
            {shareOpen && (
                <>
                    {/* Mobile overlay */}
                    <div
                        className="fixed inset-0 z-40 bg-black/70 lg:hidden"
                        onClick={() => setShareOpen(false)}
                    />

                    {/* Mobile share modal */}
                    <div
                        className="fixed bottom-16 inset-x-4 z-50 mx-auto w-full max-w-[280px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl lg:hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-white text-sm font-semibold">Share Journey</p>
                            <button
                                type="button"
                                onClick={() => setShareOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 overflow-x-auto">
                            {shareActions.map(({ alt, src, handler }) => (
                                <button
                                    key={alt}
                                    onClick={handler}
                                    type="button"
                                    className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center"
                                >
                                    <img
                                        src={src}
                                        alt={alt}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </button>
                            ))}
                        </div>

                        {copied && (
                            <p className="text-xs text-emerald-400">Copied to clipboard!</p>
                        )}
                    </div>

                    {/* Desktop share modal */}
                    <div
                        className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/60"
                        onClick={() => setShareOpen(false)}
                    >
                        <div
                            className="bg-[#1a1a1e] rounded-2xl border border-white/10 p-4 w-[320px] shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-white text-sm font-semibold">Share Your Roar Journey</p>
                                <button
                                    type="button"
                                    onClick={() => setShareOpen(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-[#111114] p-3 mb-3">
                                <p className="text-white text-sm font-semibold">My Roar Journey</p>
                                <p className="text-white/45 text-[11px] mt-2">
                                    🔮 Predictions: {predictions} | ⚡ Debates: {debates} | ✏️ Posts: {posts}
                                </p>
                                {badgeSrcs.length > 0 && (
                                    <p className="text-white/45 text-[11px] mt-1">
                                        🏅 Badges: {badgeSrcs.length}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-row flex-nowrap items-center gap-2 mb-2">
                                {shareActions.map(({ alt, src, handler }) => (
                                    <button
                                        key={alt}
                                        onClick={handler}
                                        type="button"
                                        className="w-9 h-9 shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center"
                                    >
                                        <img
                                            src={src}
                                            alt={alt}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </button>
                                ))}
                            </div>

                            {copied && (
                                <p className="text-xs text-emerald-400">Copied to clipboard!</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}