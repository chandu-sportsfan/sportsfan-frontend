// components/NewROARComponent/components/ReactionPicker.tsx
// Hover over the like button → floating reaction bar with 5 options.
// Selecting one fires onReact(reaction). Clicking the active reaction removes it.

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export type Reaction = "heart" | "fire" | "laugh" | "sad" | "thumb";

export const REACTIONS: { id: Reaction; emoji: string; label: string }[] = [
  { id: "heart", emoji: "❤️", label: "Love" },
  { id: "fire",  emoji: "🔥", label: "Fire" },
  { id: "laugh", emoji: "😂", label: "Haha" },
  { id: "sad",   emoji: "😢", label: "Sad"  },
  { id: "thumb", emoji: "👍", label: "Like" },
];

export function reactionEmoji(r: Reaction | null | undefined): string {
  if (!r) return "♡";
  return REACTIONS.find((x) => x.id === r)?.emoji ?? "❤️";
}

interface Props {
  currentReaction: Reaction | null;
  count: number;
  onReact: (r: Reaction | null) => void;
  disabled?: boolean;
}

export default function ReactionPicker({ currentReaction, count, onReact, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<Reaction | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = () => window.matchMedia("(hover: none)").matches;


  const scheduleOpen = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    hoverTimer.current = setTimeout(() => setOpen(true), 280);
  }, []);

  const scheduleClose = useCallback(() => {
    if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; }
    closeTimer.current = setTimeout(() => { setOpen(false); setHovered(null); }, 350);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  useEffect(() => () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // const handleMainClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (open) { setOpen(false); return; }
  //   if (disabled) return;
  //   if (currentReaction) { onReact(null); } // toggle off
  //   else { onReact("heart"); } // default quick-tap = heart
  // };

  const handleMainClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    if (isTouchDevice()) {
      // Mobile: first tap opens picker, picker selection reacts,
      // tapping active reaction undoes it
      if (open) {
        setOpen(false);
        return;
      }
      if (currentReaction) {
        // Already reacted — undo on tap
        onReact(null);
        return;
      }
      // No reaction yet — open picker
      setOpen(true);
      return;
    }

    // Desktop fallback (shouldn't normally reach here since hover handles it)
    if (open) { setOpen(false); return; }
    if (currentReaction) { onReact(null); }
    else { onReact("heart"); }
  };

  const handleReactSelect = (e: React.MouseEvent, r: Reaction) => {
    e.stopPropagation();
    onReact(currentReaction === r ? null : r);
    setOpen(false);
    setHovered(null);
  };

  const active = currentReaction !== null;
  const displayEmoji = reactionEmoji(currentReaction);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
    >
      {/* ── Reaction popover ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="picker"
            initial={{ opacity: 0, y: 6, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.85 }}
            transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              bottom: "calc(100% + 10px)",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 4,
              padding: "8px 10px",
              borderRadius: 999,
              background: "rgba(22,22,32,0.97)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.06) inset",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              zIndex: 200,
              whiteSpace: "nowrap",
            }}
          >
            {/* Arrow */}
            <div style={{
              position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
              width: 10, height: 10, background: "rgba(22,22,32,0.97)",
              border: "1px solid rgba(255,255,255,0.12)", borderTop: "none", borderLeft: "none",
              rotate: "45deg",
            }} />

            {REACTIONS.map((r, idx) => {
              const isActive = currentReaction === r.id;
              const isHov = hovered === r.id;
              return (
                <motion.button
                  key={r.id}
                  initial={{ opacity: 0, y: 8, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.03, type: "spring", stiffness: 400, damping: 20 }}
                  whileHover={{ scale: 1.35, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  onHoverStart={() => setHovered(r.id)}
                  onHoverEnd={() => setHovered(null)}
                  onClick={(e) => handleReactSelect(e, r.id)}
                  title={r.label}
                  style={{
                    background: isActive ? "rgba(233,30,140,0.18)" : "none",
                    border: isActive ? "1px solid rgba(233,30,140,0.35)" : "1px solid transparent",
                    borderRadius: "50%",
                    width: 38, height: 38,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    fontSize: isHov ? 24 : 20,
                    transition: "font-size 0.12s, background 0.15s",
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  {r.emoji}
                  {/* Label tooltip */}
                  <AnimatePresence>
                    {isHov && (
                      <motion.span
                        initial={{ opacity: 0, y: 4, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          position: "absolute", bottom: "calc(100% + 6px)",
                          left: "50%", transform: "translateX(-50%)",
                          fontSize: 10, fontWeight: 700, color: "#fff",
                          background: "rgba(0,0,0,0.75)", borderRadius: 6,
                          padding: "2px 6px", whiteSpace: "nowrap", pointerEvents: "none",
                        }}
                      >
                        {r.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main button ── */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={handleMainClick}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: disabled ? "default" : "pointer",
          color: active ? "#ff4a7d" : "#9494ad",
          fontSize: 13, fontWeight: 600,
          padding: "2px 0",
          userSelect: "none",
        }}
      >
        <motion.span
          key={displayEmoji}
          initial={{ scale: 1.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 18 }}
          style={{ fontSize: 16, lineHeight: 1, display: "inline-block" }}
        >
          {active ? displayEmoji : <Heart size={18} strokeWidth={2} />}
        </motion.span>
        <span>{count > 0 ? count : ""}</span>
      </motion.button>
    </div>
  );
}