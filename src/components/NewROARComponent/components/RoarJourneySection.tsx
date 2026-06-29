
"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface RoarJourneySectionProps {
    predictions: number;
    debates: number;
    posts: number;
    badgeSrcs: string[];      // unlocked badge image paths
    onToast: (m: string) => void;
}

function buildShareText(
    predictions: number,
    debates: number,
    posts: number,
    badgeCount: number,
) {
    return [
        "🔥 My Roar Journey on Sportsfan360",
        "",
        `🔮 Predictions: ${predictions}`,
        `⚡ Debates: ${debates}`,
        `✏️ Posts: ${posts}`,
        badgeCount > 0 ? `🏅 Badges Earned: ${badgeCount}` : null,
        "",
        "Join us 👉 https://sportsfan-frontend.vercel.app/",
        "#StartRoaring #Sportsfan360",
    ]
        .filter((l) => l !== null)
        .join("\n");
}

export function RoarJourneySection({
    predictions,
    debates,
    posts,
    badgeSrcs,
    onToast,
}: RoarJourneySectionProps) {
    const [sharing, setSharing] = useState(false);

    // const handleShare = async () => {
    //     if (sharing) return;
    //     setSharing(true);
    //     const text = buildShareText(predictions, debates, posts, badgeSrcs.length);
    //     try {
    //         if (typeof navigator !== "undefined" && navigator.share) {
    //             await navigator.share({ title: "My Roar Journey", text });
    //         } else {
    //             await navigator.clipboard.writeText(text);
    //             onToast("Journey copied to clipboard!");
    //         }
    //     } catch (err: any) {
    //         if (err?.name !== "AbortError") onToast("Could not share.");
    //     } finally {
    //         setSharing(false);
    //     }
    // };

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateShareCard = (): Promise<Blob | null> => {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            canvas.width = 1340;
            canvas.height = 752;
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(null);

            const bg = new window.Image();
            bg.crossOrigin = "anonymous";
            bg.src = "/images/profilecard.png"; // your background image path
            bg.onload = () => {
                ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

                // Stats overlay — position matches the card layout
                const stats = [
                    { icon: "🔮", label: "PREDICTIONS", value: predictions, x: 220 },
                    { icon: "⚡", label: "DEBATES", value: debates, x: 490 },
                    { icon: "✏️", label: "POSTS", value: posts, x: 760 },
                    { icon: "🏅", label: "BADGES EARNED", value: badgeSrcs.length, x: 1030 },
                ];

                stats.forEach(({ icon, label, value, x }) => {
                    const y = 530;

                    // Big number
                    ctx.font = "bold 88px Arial";
                    ctx.fillStyle = label === "PREDICTIONS" ? "#9333EA"
                        : label === "DEBATES" ? "#F97316"
                            : label === "POSTS" ? "#14B8A6"
                                : "#F97316";
                    ctx.textAlign = "center";
                    ctx.fillText(String(value), x + 50, y);

                    // Label
                    ctx.font = "bold 22px Arial";
                    ctx.fillStyle = "#1a1a1a";
                    ctx.fillText(label, x + 50, y + 48);
                });

                canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
            };
            bg.onerror = () => resolve(null);
        });
    };

    const handleShare = async () => {
        if (sharing) return;
        setSharing(true);
        try {
            const blob = await generateShareCard();
            if (blob && typeof navigator !== "undefined" && navigator.share) {
                const file = new File([blob], "my-roar-journey.png", { type: "image/png" });
                if (navigator.canShare?.({ files: [file] })) {
                    await navigator.share({ files: [file], title: "My Roar Journey" });
                    setSharing(false);
                    return;
                }
            }
            // Fallback: download the image
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "my-roar-journey.png";
                a.click();
                URL.revokeObjectURL(url);
                onToast("Card saved! Share it from your gallery.");
            } else {
                // Final fallback: plain text
                await navigator.clipboard?.writeText(
                    buildShareText(predictions, debates, posts, badgeSrcs.length)
                );
                onToast("Copied to clipboard!");
            }
        } catch (err: any) {
            if (err?.name !== "AbortError") onToast("Could not share.");
        } finally {
            setSharing(false);
        }
    };

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
                {/* decorative glow — top-right */}
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
                    <span
                        style={{
                            fontSize: 13, fontWeight: 700, color: "#fff",
                            letterSpacing: "0.01em",
                        }}
                    >
                        Your Roar Journey
                    </span>

                    {/* ROAR. pill */}
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
                            {/* pill */}
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
                            {/* number */}
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
                                    src={src} alt={`Badge ${i + 1}`}
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
                        onClick={handleShare}
                        disabled={sharing}
                        style={{
                            padding: "9px 22px",
                            border: "1.5px solid rgba(255,255,255,0.3)",
                            borderRadius: 999,
                            background: "transparent",
                            color: "#fff", fontSize: 13, fontWeight: 700,
                            cursor: sharing ? "not-allowed" : "pointer",
                            letterSpacing: "0.01em",
                            opacity: sharing ? 0.6 : 1,
                            transition: "opacity 0.15s",
                        }}
                    >
                        {sharing ? "Sharing…" : "Share"}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}