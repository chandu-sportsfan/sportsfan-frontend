// //chandu's code

// // components/NewROARComponent/components/ComposeModal.tsx

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { createPortal } from "react-dom";
// import { COMPOSE_OPTIONS, UPCOMING_MATCHES } from "../constants";
// import type { ComposePayload } from "../types";
// import axios from "axios";

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   onPost: (p: ComposePayload) => void;
//   initialType: string | null;
// }

// export default function ComposeModal({ open, onClose, onPost, initialType }: Props) {
//   const [selected, setSelected] = useState<string | null>(null);
//   const [text, setText] = useState("");
//   const [sideA, setSideA] = useState("");
//   const [sideB, setSideB] = useState("");
//   const [memCtx, setMemCtx] = useState("");
//   const [dbMatches, setDbMatches] = useState<string[]>([]);
//   const [match, setMatch] = useState("None / General");
//   const [confidence, setConf] = useState(7);
//   const [audience, setAud] = useState("Everyone");
//   const [sport, setSport] = useState<string>("");
//   const [postText, setPostText] = useState("");
//   const [mediaFiles, setMediaFiles] = useState<File[]>([]);
//   const [domReady, setDomReady] = useState(false);

//   useEffect(() => { setDomReady(true); }, []);

//   useEffect(() => {
//     const fetchMatches = async () => {
//       try {
//         const res = await axios.get("/api/watch-along/matches");
//         if (res.data?.success && Array.isArray(res.data.matches)) {
//           const formatted = res.data.matches.map((m: any) => {
//             const t1 = m.team1?.name || "Team 1";
//             const t2 = m.team2?.name || "Team 2";
//             const tourney = m.tournament || "";
//             return tourney ? `${t1} vs ${t2} · ${tourney}` : `${t1} vs ${t2}`;
//           });
//           setDbMatches(formatted);
//         }
//       } catch (err) {
//         console.error("Failed to fetch matches for compose:", err);
//       }
//     };
//     fetchMatches();
//   }, []);

//   const matchesList = dbMatches.length > 0 ? ["None / General", ...dbMatches] : ["None / General", ...UPCOMING_MATCHES];
//   const filteredMatches = matchesList.filter((m) => {
//     if (m === "None / General") return true;
//     return sport === "football"
//       ? (m.toLowerCase().includes("isl") || m.toLowerCase().includes("fc") || m.toLowerCase().includes("fifa") || m.toLowerCase().includes("worldcup"))
//       : !(m.toLowerCase().includes("isl") || m.toLowerCase().includes("fc") || m.toLowerCase().includes("fifa") || m.toLowerCase().includes("worldcup"));
//   });

//   useEffect(() => {
//     if (filteredMatches.length > 0 && !filteredMatches.includes(match)) {
//       setMatch(filteredMatches[0]);
//     }
//   }, [sport, dbMatches, match]);

//   useEffect(() => {
//     if (open && initialType) setSelected(initialType);
//     if (!open) reset();
//   }, [open, initialType]);

//   const reset = () => {
//     setSelected(null);
//     setText("");
//     setSideA("");
//     setSideB("");
//     setMemCtx("");
//     setSport("");
//     setPostText("");
//     setMediaFiles([]);
//     setMatch("None / General");
//   };

//   const canPost =
//     (selected === "hot_take" && text.trim()) ||
//     (selected === "prediction" && text.trim()) ||
//     (selected === "debate" && sideA.trim() && sideB.trim()) ||
//     (selected === "memory" && text.trim()) ||
//     (selected === "post" && (postText.trim() || mediaFiles.length > 0));

//   const handlePost = () => {
//     onPost({
//       type: selected!,
//       text: selected === "post" ? postText : text,
//       sideA,
//       sideB,
//       match,
//       confidence,
//       audience,
//       memCtx,
//       sport,
//       mediaFiles: selected === "post" ? mediaFiles : [],
//     });
//     onClose();
//   };

//   const inputStyle: React.CSSProperties = {
//     width: "100%",
//     padding: "14px",
//     borderRadius: 16,
//     background: "rgba(0,0,0,0.4)",
//     border: "1px solid var(--border)",
//     resize: "none" as const,
//     outline: "none",
//     color: "var(--text-primary)",
//     fontSize: 16,
//     boxSizing: "border-box",
//   };

//   const modalContent = (
//     <div className="roar-root">
//       <AnimatePresence>
//         {open && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={onClose}
//               style={{
//                 position: "fixed", inset: 0, zIndex: 60,
//                 background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
//               }}
//             />
//             <motion.div
//               initial={{ y: "100%" }}
//               animate={{ y: 0 }}
//               exit={{ y: "100%" }}
//               transition={{ type: "spring", damping: 28, stiffness: 300 }}
//               style={{
//                 position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 70,
//                 background: "var(--bg-glass)", backdropFilter: "blur(20px)",
//                 borderRadius: "32px 32px 0 0",
//                 border: "1px solid rgba(255,255,255,0.08)",
//               }}
//             >
//               <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
//                 <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border)" }} />
//               </div>
//               <div className="mobile-padding-bottom" style={{ padding: "0 20px 40px", maxHeight: "75vh", overflowY: "auto" }}>
//                 {/* Header row with title + X close button */}
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
//                   <h2 className="font-display" style={{ fontSize: 28, letterSpacing: "0.04em", textTransform: "uppercase", margin: 0 }}>
//                     {selected === "hot_take" && "Create Hot Take"}
//                     {selected === "prediction" && "Create Prediction"}
//                     {selected === "debate" && "Create Debate"}
//                     {selected === "memory" && "Create Memory"}
//                     {selected === "post" && "Create Post"}
//                     {!selected && "Create"}
//                   </h2>
//                   <button
//                     onClick={onClose}
//                     style={{
//                       width: 32, height: 32, borderRadius: "50%",
//                       background: "rgba(255,255,255,0.08)",
//                       border: "1px solid var(--border)",
//                       color: "var(--text-secondary)",
//                       fontSize: 16, cursor: "pointer",
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                       flexShrink: 0,
//                     }}
//                     aria-label="Close"
//                   >
//                     ✕
//                   </button>
//                 </div>

//                 {!selected ? (
//                   <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//                     {COMPOSE_OPTIONS.map((opt) => (
//                       <motion.button
//                         key={opt.id}
//                         whileTap={{ scale: 0.98 }}
//                         onClick={() => setSelected(opt.id)}
//                         style={{
//                           padding: "16px", borderRadius: 20,
//                           background: "var(--bg-tertiary)", border: "1px solid var(--border)",
//                           textAlign: "left", cursor: "pointer", width: "100%",
//                         }}
//                       >
//                         <span style={{ fontSize: 28 }}>{opt.emoji}</span>
//                         <p className="font-display" style={{ fontSize: 18, marginTop: 8 }}>{opt.title}</p>
//                         <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{opt.desc}</p>
//                       </motion.button>
//                     ))}
//                   </div>
//                 ) : (
//                   <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
//                     {/* Hot Take / Memory */}
//                     {(selected === "hot_take" || selected === "memory") && (
//                       <>
//                         <textarea
//                           value={text}
//                           onChange={(e) => setText(e.target.value)}
//                           rows={4}
//                           placeholder={selected === "hot_take" ? "What's your boldest take?" : "Your memory or flashback moment..."}
//                           style={inputStyle}
//                         />
//                         {/* {selected === "memory" && (
//                           <input
//                             value={memCtx}
//                             onChange={(e) => setMemCtx(e.target.value)}
//                             placeholder="Which match or moment?"
//                             style={{ ...inputStyle, marginTop: 8, borderRadius: 14 }}
//                           />
//                         )} */}
//                       </>
//                     )}

//                     {/* Prediction */}
//                     {selected === "prediction" && (
//                       <>
//                         <textarea
//                           value={text}
//                           onChange={(e) => setText(e.target.value)}
//                           rows={3}
//                           placeholder="Your prediction..."
//                           style={{ ...inputStyle, fontStyle: "italic" }}
//                         />
//                         {/* <input
//                           type="range" min={1} max={10} value={confidence}
//                           onChange={(e) => setConf(+e.target.value)}
//                           style={{ width: "100%", accentColor: "var(--accent-magenta)", marginTop: 4 }}
//                         /> */}
//                       </>
//                     )}

//                     {/* Debate */}
//                     {selected === "debate" && (
//                       <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//                         <input value={sideA} onChange={(e) => setSideA(e.target.value)} placeholder="Create a debate"
//                           style={{ ...inputStyle, borderRadius: 14 }} />
//                       </div>
//                     )}

//                     {/* Post (media) */}
//                     {selected === "post" && (
//                       <>
//                         <textarea
//                           value={postText}
//                           onChange={(e) => setPostText(e.target.value)}
//                           rows={4}
//                           placeholder="Share anything with your fellow fans..."
//                           style={inputStyle}
//                         />
//                         <div
//                           style={{
//                             marginTop: 12, border: "2px dashed rgba(233,30,140,0.35)",
//                             borderRadius: 16, padding: "20px", textAlign: "center",
//                             cursor: "pointer", background: "rgba(233,30,140,0.04)",
//                           }}
//                           onClick={() => document.getElementById("roar-media-upload")?.click()}
//                         >
//                           <input
//                             id="roar-media-upload" type="file" accept="image/*,video/*,.gif"
//                             multiple style={{ display: "none" }}
//                             onChange={(e) => setMediaFiles(Array.from(e.target.files || []))}
//                           />
//                           {mediaFiles.length === 0 ? (
//                             <>
//                               <p style={{ fontSize: 28, marginBottom: 8 }}>🖼️</p>
//                               <p style={{ fontSize: 13, color: "var(--accent-magenta)", fontWeight: 700 }}>
//                                 Tap to add Photo / Video / GIF
//                               </p>
//                               <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
//                                 Supports JPG, PNG, GIF, MP4
//                               </p>
//                             </>
//                           ) : (
//                             <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
//                               {mediaFiles.map((file, i) => (
//                                 <div key={i} style={{
//                                   padding: "6px 12px", borderRadius: 999,
//                                   background: "rgba(233,30,140,0.15)", border: "1px solid rgba(233,30,140,0.3)",
//                                   fontSize: 12, color: "var(--accent-magenta)",
//                                   display: "flex", alignItems: "center", gap: 6,
//                                 }}>
//                                   {file.type.startsWith("video") ? "🎥" : "🖼️"} {file.name.slice(0, 20)}
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       setMediaFiles((prev) => prev.filter((_, idx) => idx !== i));
//                                     }}
//                                     style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 12, padding: 0 }}
//                                   >✕</button>
//                                 </div>
//                               ))}
//                               <p style={{ width: "100%", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
//                                 Tap to add more
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                       </>
//                     )}

//                     {/* Sport selector */}
//                     {(selected === "hot_take" || selected === "prediction" || selected === "debate" || selected === "memory" || selected === "post") && (
//                       <>
//                         <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginTop: 16, marginBottom: 4 }}>Sport</label>
//                         <div style={{ display: "flex", gap: 8, marginTop: 4, marginBottom: 12 }}>
//                           {[
//                             { id: "cricket", label: "🏏 Cricket", activeColor: "var(--accent-magenta)", activeBg: "rgba(233,30,140,0.15)", activeBorder: "var(--accent-magenta)" },
//                             { id: "football", label: "⚽ Football", activeColor: "#3b82f6", activeBg: "rgba(59,130,246,0.15)", activeBorder: "#3b82f6" },
//                           ].map((sp) => {
//                             const isActive = sport === sp.id;
//                             return (
//                               <button
//                                 key={sp.id}
//                                 type="button"
//                                 onClick={() => setSport(sp.id)}
//                                 style={{
//                                   flex: 1, padding: "8px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
//                                   border: `1px solid ${isActive ? sp.activeBorder : "var(--border)"}`,
//                                   background: isActive ? sp.activeBg : "transparent",
//                                   color: isActive ? sp.activeColor : "var(--text-secondary)",
//                                 }}
//                               >
//                                 {sp.label}
//                               </button>
//                             );
//                           })}
//                         </div>
//                       </>
//                     )}

//                     <motion.button
//                       whileTap={{ scale: 0.97 }}
//                       disabled={!canPost}
//                       onClick={handlePost}
//                       className="btn-gradient"
//                       style={{ width: "100%", padding: "14px", borderRadius: 999, fontSize: 16, border: "none", cursor: "pointer", opacity: canPost ? 1 : 0.4 }}
//                     >
//                       POST TO ROAR
//                     </motion.button>
//                   </motion.div>
//                 )}
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );

//   if (!domReady) return null;
//   return createPortal(modalContent, document.body);
// }




// components/NewROARComponent/components/ComposeModal.tsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { COMPOSE_OPTIONS, UPCOMING_MATCHES } from "../constants";
import type { ComposePayload } from "../types";
import axios from "axios";

interface Props {
  open: boolean;
  onClose: () => void;
  onPost: (p: ComposePayload) => void;
  initialType: string | null;
  onOpenQuiz?: () => void; // NEW — handed off from index.tsx
}

export default function ComposeModal({ open, onClose, onPost, initialType, onOpenQuiz }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [sideA, setSideA] = useState("");
  const [sideB, setSideB] = useState("");
  const [memCtx, setMemCtx] = useState("");
  const [dbMatches, setDbMatches] = useState<string[]>([]);
  const [match, setMatch] = useState("None / General");
  const [confidence, setConf] = useState(7);
  const [audience, setAud] = useState("Everyone");
  const [sport, setSport] = useState<string>("");
  const [postText, setPostText] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [domReady, setDomReady] = useState(false);

  useEffect(() => { setDomReady(true); }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get("/api/watch-along/matches");
        if (res.data?.success && Array.isArray(res.data.matches)) {
          const formatted = res.data.matches.map((m: any) => {
            const t1 = m.team1?.name || "Team 1";
            const t2 = m.team2?.name || "Team 2";
            const tourney = m.tournament || "";
            return tourney ? `${t1} vs ${t2} · ${tourney}` : `${t1} vs ${t2}`;
          });
          setDbMatches(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch matches for compose:", err);
      }
    };
    fetchMatches();
  }, []);

  const matchesList = dbMatches.length > 0 ? ["None / General", ...dbMatches] : ["None / General", ...UPCOMING_MATCHES];
  const filteredMatches = matchesList.filter((m) => {
    if (m === "None / General") return true;
    return sport === "football"
      ? (m.toLowerCase().includes("isl") || m.toLowerCase().includes("fc") || m.toLowerCase().includes("fifa") || m.toLowerCase().includes("worldcup"))
      : !(m.toLowerCase().includes("isl") || m.toLowerCase().includes("fc") || m.toLowerCase().includes("fifa") || m.toLowerCase().includes("worldcup"));
  });

  useEffect(() => {
    if (filteredMatches.length > 0 && !filteredMatches.includes(match)) {
      setMatch(filteredMatches[0]);
    }
  }, [sport, dbMatches, match]);

  useEffect(() => {
    if (open && initialType) {
      // If quiz was requested directly (e.g. from RADIAL_OPTS), hand off immediately
      if (initialType === "quiz") {
        if (onOpenQuiz) {
          onClose();
          onOpenQuiz();
          return;
        }
      }
      setSelected(initialType);
    }
    if (!open) reset();
  }, [open, initialType]);

  const reset = () => {
    setSelected(null);
    setText("");
    setSideA("");
    setSideB("");
    setMemCtx("");
    setSport("");
    setPostText("");
    setMediaFiles([]);
    setMatch("None / General");
  };

  const canPost =
    (selected === "hot_take" && text.trim()) ||
    (selected === "prediction" && text.trim()) ||
    // (selected === "debate" && sideA.trim() && sideB.trim()) ||
    (selected === "debate" && text.trim() && sideA.trim() && sideB.trim()) ||
    (selected === "memory" && text.trim()) ||
    (selected === "post" && (postText.trim() || mediaFiles.length > 0));

  const handlePost = () => {
    onPost({
      type: selected!,
      text: selected === "post" ? postText : text,
      sideA,
      sideB,
      match,
      confidence,
      audience,
      memCtx,
      sport,
      mediaFiles: selected === "post" ? mediaFiles : [],
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    borderRadius: 16,
    background: "rgba(0,0,0,0.4)",
    border: "1px solid var(--border)",
    resize: "none" as const,
    outline: "none",
    color: "var(--text-primary)",
    fontSize: 16,
    boxSizing: "border-box",
  };

  const modalContent = (
    <div className="roar-root">
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              style={{
                position: "fixed", inset: 0, zIndex: 10060,
                background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
              }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              style={{
                position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 10070,
                background: "var(--bg-glass)", backdropFilter: "blur(20px)",
                borderRadius: "32px 32px 0 0",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
                <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--border)" }} />
              </div>
              <div className="mobile-padding-bottom" style={{ padding: "0 20px 40px", maxHeight: "75vh", overflowY: "auto" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h2 className="font-display" style={{ fontSize: 28, letterSpacing: "0.04em", textTransform: "uppercase", margin: 0 }}>
                    {selected === "hot_take" && "Create Hot Take"}
                    {selected === "prediction" && "Create Prediction"}
                    {selected === "debate" && "Create Debate"}
                    {selected === "memory" && "Create Memory"}
                    {selected === "post" && "Create Post"}
                    {!selected && "Create"}
                  </h2>
                  <button
                    onClick={onClose}
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      fontSize: 16, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                {!selected ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {COMPOSE_OPTIONS.map((opt) => (
                      <motion.button
                        key={opt.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          // Quiz: close this modal and open the dedicated quiz modal
                          if (opt.id === "quiz") {
                            onClose();
                            if (onOpenQuiz) onOpenQuiz();
                            return;
                          }
                          setSelected(opt.id);
                        }}
                        style={{
                          padding: "16px", borderRadius: 20,
                          background: "var(--bg-tertiary)", border: "1px solid var(--border)",
                          textAlign: "left", cursor: "pointer", width: "100%",
                        }}
                      >
                        <span style={{ fontSize: 28 }}>{opt.emoji}</span>
                        <p className="font-display" style={{ fontSize: 18, marginTop: 8 }}>{opt.title}</p>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{opt.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Hot Take / Memory */}
                    {(selected === "hot_take" || selected === "memory") && (
                      <>
                        <textarea
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          rows={4}
                          placeholder={selected === "hot_take" ? "What's your boldest take?" : "Your memory or flashback moment..."}
                          style={inputStyle}
                        />
                      </>
                    )}

                    {/* Prediction */}
                    {selected === "prediction" && (
                      <>
                        <textarea
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          rows={3}
                          placeholder="Your prediction..."
                          style={{ ...inputStyle, fontStyle: "italic" }}
                        />
                      </>
                    )}

                    {/* Debate */}
                    {/* {selected === "debate" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <input value={sideA} onChange={(e) => setSideA(e.target.value)} placeholder="Create a debate"
                          style={{ ...inputStyle, borderRadius: 14 }} />
                      </div>
                    )} */}
                    {/* Debate */}
                    {selected === "debate" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Debate Question *</label>
                        <input
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="e.g., Sachin vs Kohli — who's the GOAT?"
                          style={{ ...inputStyle, borderRadius: 14 }}
                        />
                        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Side A *</label>
                            <input
                              value={sideA}
                              onChange={(e) => setSideA(e.target.value)}
                              placeholder="e.g., Sachin"
                              style={{ ...inputStyle, borderRadius: 14 }}
                            />
                          </div>
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                            <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Side B *</label>
                            <input
                              value={sideB}
                              onChange={(e) => setSideB(e.target.value)}
                              placeholder="e.g., Kohli"
                              style={{ ...inputStyle, borderRadius: 14 }}
                            />
                          </div>
                        </div>
                        <label style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Context / Description</label>
                        <textarea
                          value={memCtx}
                          onChange={(e) => setMemCtx(e.target.value)}
                          rows={3}
                          placeholder="Add background, stats, or reasoning (optional)"
                          style={{ ...inputStyle, borderRadius: 14 }}
                        />
                      </div>
                    )}

                    {/* Post (media) */}
                    {selected === "post" && (
                      <>
                        <textarea
                          value={postText}
                          onChange={(e) => setPostText(e.target.value)}
                          rows={4}
                          placeholder="Share anything with your fellow fans..."
                          style={inputStyle}
                        />
                        <div
                          style={{
                            marginTop: 12, border: "2px dashed rgba(233,30,140,0.35)",
                            borderRadius: 16, padding: "20px", textAlign: "center",
                            cursor: "pointer", background: "rgba(233,30,140,0.04)",
                          }}
                          onClick={() => document.getElementById("roar-media-upload")?.click()}
                        >
                          <input
                            id="roar-media-upload" type="file" accept="image/*,video/*,.gif"
                            multiple style={{ display: "none" }}
                            onChange={(e) => setMediaFiles(Array.from(e.target.files || []))}
                          />
                          {mediaFiles.length === 0 ? (
                            <>
                              <p style={{ fontSize: 28, marginBottom: 8 }}>🖼️</p>
                              <p style={{ fontSize: 13, color: "var(--accent-magenta)", fontWeight: 700 }}>
                                Tap to add Photo / Video / GIF
                              </p>
                              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                                Supports JPG, PNG, GIF, MP4
                              </p>
                            </>
                          ) : (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                              {mediaFiles.map((file, i) => (
                                <div key={i} style={{
                                  padding: "6px 12px", borderRadius: 999,
                                  background: "rgba(233,30,140,0.15)", border: "1px solid rgba(233,30,140,0.3)",
                                  fontSize: 12, color: "var(--accent-magenta)",
                                  display: "flex", alignItems: "center", gap: 6,
                                }}>
                                  {file.type.startsWith("video") ? "🎥" : "🖼️"} {file.name.slice(0, 20)}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMediaFiles((prev) => prev.filter((_, idx) => idx !== i));
                                    }}
                                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 12, padding: 0 }}
                                  >✕</button>
                                </div>
                              ))}
                              <p style={{ width: "100%", fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                                Tap to add more
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Sport selector */}
                    {(selected === "hot_take" || selected === "prediction" || selected === "debate" || selected === "memory" || selected === "post") && (
                      <>
                        <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginTop: 16, marginBottom: 4 }}>Sport</label>
                        <div style={{ display: "flex", gap: 8, marginTop: 4, marginBottom: 12 }}>
                          {[
                            { id: "cricket", label: "🏏 Cricket", activeColor: "var(--accent-magenta)", activeBg: "rgba(233,30,140,0.15)", activeBorder: "var(--accent-magenta)" },
                            { id: "football", label: "⚽ Football", activeColor: "#3b82f6", activeBg: "rgba(59,130,246,0.15)", activeBorder: "#3b82f6" },
                          ].map((sp) => {
                            const isActive = sport === sp.id;
                            return (
                              <button
                                key={sp.id}
                                type="button"
                                onClick={() => setSport(sp.id)}
                                style={{
                                  flex: 1, padding: "8px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer",
                                  border: `1px solid ${isActive ? sp.activeBorder : "var(--border)"}`,
                                  background: isActive ? sp.activeBg : "transparent",
                                  color: isActive ? sp.activeColor : "var(--text-secondary)",
                                }}
                              >
                                {sp.label}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      disabled={!canPost}
                      onClick={handlePost}
                      className="btn-gradient"
                      style={{ width: "100%", padding: "14px", borderRadius: 999, fontSize: 16, border: "none", cursor: "pointer", opacity: canPost ? 1 : 0.4 }}
                    >
                      POST TO ROAR
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  if (!domReady) return null;
  return createPortal(modalContent, document.body);
}