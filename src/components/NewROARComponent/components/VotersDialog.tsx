// components/NewROARComponent/components/VotersDialog.tsx
//
// Dialog that shows who voted for each side of a debate post.
// Visible only to the post author. Opens from a "View Votes" button on the card.

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AvatarWithBadge from "./AvatarWithBadge";
import { X, Users, Loader2 } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface Voter {
  uid: string;
  username: string;
  avatarUrl?: string;
}

interface VotersData {
  sideA: string;
  sideB: string;
  voters: {
    agree: Voter[];
    disagree: Voter[];
  };
}

interface VotersDialogProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

// ── VotersDialog ─────────────────────────────────────────────────────────────

export default function VotersDialog({ postId, isOpen, onClose }: VotersDialogProps) {
  const [data, setData] = useState<VotersData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // "agree" = sideA tab, "disagree" = sideB tab
  const [activeTab, setActiveTab] = useState<"agree" | "disagree">("agree");

  const fetchVoters = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/roar/posts/${postId}/voters`);
      if (res.data?.success) {
        setData(res.data);
        // Default to the side with more votes
        const agreeCount = res.data.voters.agree.length;
        const disagreeCount = res.data.voters.disagree.length;
        setActiveTab(disagreeCount > agreeCount ? "disagree" : "agree");
      } else {
        setError("Failed to load voters");
      }
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Failed to load voters");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (isOpen) fetchVoters();
    else {
      // Reset on close so next open starts fresh
      setData(null);
      setError(null);
    }
  }, [isOpen, fetchVoters]);

  const activeVoters = data
    ? activeTab === "agree"
      ? data.voters.agree
      : data.voters.disagree
    : [];

  const sideALabel = data?.sideA ?? "Side A";
  const sideBLabel = data?.sideB ?? "Side B";
  const agreeCount = data?.voters.agree.length ?? 0;
  const disagreeCount = data?.voters.disagree.length ?? 0;
  const totalVotes = agreeCount + disagreeCount;
  const agrPct = totalVotes > 0 ? Math.round((agreeCount / totalVotes) * 100) : 50;
  const disPct = 100 - agrPct;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="vd-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 60,
              background: "rgba(0,0,0,0.72)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />

          {/* Panel */}
          <motion.div
            key="vd-panel"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              bottom: 0, left: 0, right: 0,
              zIndex: 61,
              maxWidth: 480,
              margin: "0 auto",
              background: "linear-gradient(160deg, #16161e 0%, #1a1a26 100%)",
              borderRadius: "24px 24px 0 0",
              border: "1px solid rgba(255,255,255,0.08)",
              borderBottom: "none",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
              overflow: "hidden",
              maxHeight: "75vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Drag pill */}
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 4 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
            </div>

            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 18px 14px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={16} color="var(--accent-magenta, #e91e8c)" />
                <span style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>Who Voted</span>
                {totalVotes > 0 && (
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "2px 8px",
                    borderRadius: 999,
                    background: "rgba(233,30,140,0.12)",
                    color: "var(--accent-magenta, #e91e8c)",
                    border: "1px solid rgba(233,30,140,0.25)",
                  }}>
                    {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  width: 30, height: 30,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "rgba(255,255,255,0.6)",
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Split bar */}
            {data && totalVotes > 0 && (
              <div style={{ padding: "12px 18px 0" }}>
                <div style={{
                  display: "flex", borderRadius: 999, overflow: "hidden",
                  height: 7, background: "rgba(255,255,255,0.06)",
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${agrPct}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ background: "var(--accent-magenta, #e91e8c)", height: "100%" }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${disPct}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ background: "#60a5fa", height: "100%" }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-magenta, #e91e8c)" }}>{agrPct}%</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa" }}>{disPct}%</span>
                </div>
              </div>
            )}

            {/* Tab switcher */}
            {data && (
              <div style={{ display: "flex", gap: 8, padding: "10px 18px 0" }}>
                {(["agree", "disagree"] as const).map((tab) => {
                  const isActive = activeTab === tab;
                  const label = tab === "agree" ? sideALabel : sideBLabel;
                  const count = tab === "agree" ? agreeCount : disagreeCount;
                  const color = tab === "agree" ? "var(--accent-magenta, #e91e8c)" : "#60a5fa";
                  const activeBg = tab === "agree"
                    ? "rgba(233,30,140,0.15)"
                    : "rgba(96,165,250,0.15)";
                  return (
                    <motion.button
                      key={tab}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        flex: 1, padding: "9px 12px",
                        borderRadius: 12,
                        border: `1.5px solid ${isActive ? color : "rgba(255,255,255,0.08)"}`,
                        background: isActive ? activeBg : "rgba(255,255,255,0.03)",
                        color: isActive ? color : "rgba(255,255,255,0.45)",
                        fontWeight: 700, fontSize: 12,
                        cursor: "pointer",
                        transition: "all 0.18s",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                      }}
                    >
                      <span style={{
                        overflow: "hidden", textOverflow: "ellipsis",
                        whiteSpace: "nowrap", maxWidth: "100%",
                      }}>
                        {label}
                      </span>
                      <span style={{
                        fontSize: 16, fontWeight: 800,
                        color: isActive ? color : "rgba(255,255,255,0.5)",
                        fontFamily: "'Bebas Neue', sans-serif",
                        letterSpacing: "0.03em",
                      }}>
                        {count}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Voter list */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 18px 24px" }}>

              {/* Loading */}
              {loading && (
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "center", gap: 12, padding: "40px 0",
                }}>
                  <Loader2 size={24} color="var(--accent-magenta, #e91e8c)"
                    style={{ animation: "spin 1s linear infinite" }} />
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
                    Loading voters…
                  </span>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div style={{
                  textAlign: "center", padding: "40px 0",
                  color: "#f87171", fontSize: 13, fontWeight: 600,
                }}>
                  {error}
                </div>
              )}

              {/* Empty state */}
              {!loading && !error && data && activeVoters.length === 0 && (
                <div style={{
                  textAlign: "center", padding: "40px 0",
                  color: "rgba(255,255,255,0.3)", fontSize: 13, fontWeight: 500,
                }}>
                  No votes for {activeTab === "agree" ? sideALabel : sideBLabel} yet
                </div>
              )}

              {/* Rows */}
              {!loading && !error && activeVoters.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: activeTab === "agree" ? -12 : 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: activeTab === "agree" ? 12 : -12 }}
                      transition={{ duration: 0.18 }}
                      style={{ display: "flex", flexDirection: "column", gap: 4 }}
                    >
                      {activeVoters.map((voter, idx) => (
                        <motion.div
                          key={voter.uid}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03, duration: 0.16 }}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "9px 10px",
                            borderRadius: 12,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <AvatarWithBadge
                            username={voter.username}
                            badge="RISING_FAN"
                            size="sm"
                            avatarUrl={voter.avatarUrl}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontWeight: 700, fontSize: 13, color: "#F5F5FA",
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            }}>
                              {voter.username}
                            </p>
                          </div>
                          <span style={{
                            fontSize: 10, fontWeight: 800,
                            padding: "2px 8px", borderRadius: 999,
                            background: activeTab === "agree"
                              ? "rgba(233,30,140,0.12)"
                              : "rgba(96,165,250,0.12)",
                            color: activeTab === "agree"
                              ? "var(--accent-magenta, #e91e8c)"
                              : "#60a5fa",
                            border: `1px solid ${activeTab === "agree"
                              ? "rgba(233,30,140,0.25)"
                              : "rgba(96,165,250,0.25)"}`,
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}>
                            {activeTab === "agree" ? sideALabel : sideBLabel}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}