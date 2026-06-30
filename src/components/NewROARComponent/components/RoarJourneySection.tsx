"use client";
import { useState, useRef, useEffect } from "react";
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
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // ── Preload the background image on mount ───────────────────────────────
    // This is the key fix. If the image is loaded *inside* the click handler,
    // the wait on bg.onload can take long enough (network + decode) that
    // Chrome's "transient user activation" window expires before
    // navigator.share() is called — at which point share() throws silently
    // and the code falls through to the clipboard/download fallback, which
    // looks exactly like "sharing isn't working."
    // By preloading once on mount, the tap handler only does fast, local
    // canvas work — no network wait — so the gesture stays "fresh."
    const bgImageRef = useRef<HTMLImageElement | null>(null);
    const [bgFailed, setBgFailed] = useState(false);

    useEffect(() => {
        const img = new window.Image();
        // Same-origin image in /public — crossOrigin is defensive only.
        img.crossOrigin = "anonymous";
        img.onload = () => {
            bgImageRef.current = img;
        };
        img.onerror = () => {
            console.error(
                "[RoarJourneySection] Failed to load /images/profilecard.png — " +
                "check the file exists in /public/images and the path is correct."
            );
            setBgFailed(true);
        };
        img.src = "/images/profilecard.png";
    }, []);

    const generateShareCard = (): Promise<Blob | null> => {
        return new Promise((resolve) => {
            const bg = bgImageRef.current;
            if (!bg) {
                resolve(null);
                return;
            }

            const canvas = document.createElement("canvas");
            canvas.width = 1340;
            canvas.height = 752;
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(null);

            try {
                ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            } catch (e) {
                // Tainted canvas (CORS) — should not happen for same-origin
                // /public assets, but bail safely if it ever does.
                console.error("[RoarJourneySection] Canvas draw failed (possible CORS taint):", e);
                resolve(null);
                return;
            }

            const stats = [
                { label: "PREDICTIONS", value: predictions, x: 220 },
                { label: "DEBATES", value: debates, x: 490 },
                { label: "POSTS", value: posts, x: 760 },
                { label: "BADGES EARNED", value: badgeSrcs.length, x: 1030 },
            ];

            stats.forEach(({ label, value, x }) => {
                const y = 530;

                ctx.font = "bold 88px Arial";
                ctx.fillStyle = label === "PREDICTIONS" ? "#9333EA"
                    : label === "DEBATES" ? "#F97316"
                        : label === "POSTS" ? "#14B8A6"
                            : "#F97316";
                ctx.textAlign = "center";
                ctx.fillText(String(value), x + 50, y);

                ctx.font = "bold 22px Arial";
                ctx.fillStyle = "#1a1a1a";
                ctx.fillText(label, x + 50, y + 48);
            });

            canvas.toBlob((blob) => resolve(blob), "image/png", 0.95);
        });
    };

    const handleShare = async () => {
        if (sharing) return;
        setSharing(true);

        // Helpful diagnostics — safe to remove once confirmed working.
        if (typeof window !== "undefined" && window.isSecureContext === false) {
            console.warn(
                "[RoarJourneySection] navigator.share requires a secure context " +
                "(HTTPS or localhost). Current page is not secure — this alone " +
                "will silently disable native sharing."
            );
        }
        if (typeof navigator === "undefined" || !navigator.share) {
            console.warn("[RoarJourneySection] navigator.share is not available in this browser/context.");
        }

        try {
            const blob = await generateShareCard();

            if (blob) {
                const file = new File([blob], "my-roar-journey.png", { type: "image/png" });

                if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
                    try {
                        await navigator.share({ files: [file], title: "My Roar Journey" });
                        setSharing(false);
                        return;
                    } catch (shareErr: any) {
                        if (shareErr?.name === "AbortError") {
                            // User cancelled the share sheet — not an error.
                            setSharing(false);
                            return;
                        }
                        console.error("[RoarJourneySection] navigator.share threw:", shareErr);
                        // fall through to download fallback below
                    }
                } else {
                    console.warn(
                        "[RoarJourneySection] canShare({files}) returned false — " +
                        "browser can't share this file type here, falling back to download."
                    );
                }

                // Fallback: download the image
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "my-roar-journey.png";
                a.click();
                URL.revokeObjectURL(url);
                onToast("Card saved! Share it from your gallery.");
            } else {
                // No blob — background image likely failed to load/preload.
                if (bgFailed) {
                    onToast("Couldn't load the share card image.");
                } else {
                    await navigator.clipboard?.writeText(
                        buildShareText(predictions, debates, posts, badgeSrcs.length)
                    );
                    onToast("Copied to clipboard!");
                }
            }
        } catch (err: any) {
            if (err?.name !== "AbortError") {
                console.error("[RoarJourneySection] handleShare failed:", err);
                onToast("Could not share.");
            }
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