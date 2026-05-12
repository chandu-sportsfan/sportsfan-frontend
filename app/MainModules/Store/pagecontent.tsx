// "use client";

// import React from "react";

// // ─── Data ─────────────────────────────────────────────────────────────────────

// const data = {
//   report_date: "2026-05-12",
//   meta: {
//     title: "IPL 2026 Pulse — May 12",
//     subtitle: "24-Hour Sentiment Report",
//     summary: "DC keep playoffs alive with record chase at Dharamshala. PBKS spiral deepens — 4 straight losses. GT vs SRH tonight in Ahmedabad.",
//   },
//   match_result: {
//     match_number: 55,
//     date: "2026-05-11",
//     venue: "HPCA Stadium, Dharamshala",
//     team1: { name: "Punjab Kings", short: "PBKS", score: "210/5", overs: 20, result: "lost" },
//     team2: { name: "Delhi Capitals", short: "DC", score: "216/7", overs: 19, result: "won" },
//     result: "DC won by 3 wickets",
//     note: "Highest ever successful chase at Dharamshala. No over of spin bowled by either side — only 2nd time in IPL history.",
//     player_of_match: "Madhav Tiwari (2/40 + 18* off 8)",
//   },
//   tonight: {
//     match_number: 56,
//     teams: "Gujarat Titans vs Sunrisers Hyderabad",
//     venue: "Narendra Modi Stadium, Ahmedabad",
//     time: "7:30 PM IST",
//     context: "Both on 14 pts. Winner goes to 16 and near playoff certainty.",
//     badge: "Winner goes #1 + near playoff lock",
//   },
//   kpis: [
//     { value: "3", label: "DC's winning margin — wickets", sub: "Record chase at Dharamshala — 211 gunned down in 19 ov", color: "#4a9eff" },
//     { value: "4", label: "PBKS losses in a row", sub: "Table toppers → 4th · 3 must-wins to qualify", color: "#C41E1E" },
//     { value: "14", label: "Points — GT and SRH tonight", sub: "Both on 14 pts from 11 games · Winner to 16", color: "#FFD84A" },
//     { value: "8", label: "Teams still in playoff contention", sub: "Only MI + LSG eliminated · All others alive", color: "#2bdd8c" },
//   ],
//   quotes: [
//     { text: "I won't beat around the bush; I'll just say fielding and bowling again. I feel it was 30 runs more on this wicket given how the ball was seaming and the variable bounce.", speaker: "Shreyas Iyer", role: "PBKS captain · post-match Dharamshala", badge: "Self-critical", badgeClass: "red" },
//     { text: "It was a thought but the way it was seaming, if we had executed our lines and lengths, we may have gotten wickets. But we did not. We fell short of planning.", speaker: "Shreyas Iyer", role: "PBKS captain · on not bowling Chahal all game", badge: "Tactical regret", badgeClass: "gold" },
//     { text: "Very happy with how the team played. In the bowling, first 3-4 overs they had 60 runs but to finish with only 72 in the powerplay — that was a winning moment. The future is strong.", speaker: "Axar Patel", role: "DC captain · post-match", badge: "Composed leader", badgeClass: "green" },
//     { text: "We were behind. Axar has been working very hard. Tonight it came off. That is why he has been playing for so long — dug in deep and came out with good energy. We complement each other well.", speaker: "David Miller", role: "DC batter · on his partnership with Axar", badge: "Partnership quality", badgeClass: "green" },
//     { text: "I would like to say I am a 100 percent bowler and a 100 percent batter. The wicket was helping the length balls, and I was sticking to that. Lucky to bowl four overs for the team.", speaker: "Madhav Tiwari", role: "DC · Player of the Match · debut all-rounder", badge: "Poised on debut", badgeClass: "gold" },
//     { text: "He's becoming sort of an artist now. He's just becoming so, so good at what he's doing.", speaker: "Ambati Rayudu", role: "Commentator · on Bhuvneshwar Kumar's IPL 2026 season", badge: "High praise", badgeClass: "blue" },
//     { text: "SRH arrive with momentum in their batting unit but must overcome a poor record against GT in Ahmedabad, as both teams eye No. 1 spot.", speaker: "ESPNcricinfo", role: "Match preview · GT vs SRH tonight", badge: "Tonight's frame", badgeClass: "neutral" },
//   ],
//   points_table: [
//     { rank: 1, team: "RCB", played: 11, won: 7, points: 14, form: ["W","W","W","L","W"], playoff_zone: true, color: "#cc0000" },
//     { rank: 2, team: "SRH", played: 11, won: 7, points: 14, form: ["W","W","W","L","W"], playoff_zone: true, color: "#f26522" },
//     { rank: 3, team: "GT",  played: 11, won: 7, points: 14, form: ["W","W","W","W","L"], playoff_zone: true, color: "#1d4e9b" },
//     { rank: 4, team: "PBKS",played: 11, won: 6, points: 13, form: ["L","L","L","L","W"], playoff_zone: true, color: "#dd4444" },
//     { rank: 5, team: "CSK", played: 11, won: 6, points: 12, form: ["W","W","W","L","W"], playoff_zone: false, color: "#f9cd05" },
//     { rank: 6, team: "RR",  played: 10, won: 6, points: 12, form: ["L","W","L","W","W"], playoff_zone: false, color: "#254aa5" },
//     { rank: 7, team: "DC",  played: 12, won: 5, points: 10, form: ["W","L","L","L","W"], playoff_zone: false, color: "#2561ae" },
//     { rank: 8, team: "KKR", played: 11, won: 4, points: 8,  form: ["W","W","W","L","L"], playoff_zone: false, color: "#3a225d" },
//     { rank: 9, team: "MI",  played: 11, won: 3, points: 6,  form: ["L","L","L","L","L"], playoff_zone: false, color: "#004c93", eliminated: true },
//     { rank: 10,team: "LSG", played: 11, won: 3, points: 6,  form: ["L","L","L","L","W"], playoff_zone: false, color: "#a5c8e1", eliminated: true },
//   ],
//   top_searches: [
//     { rank: 1,  query: "GT vs SRH tonight Ahmedabad", heat: "hot" },
//     { rank: 2,  query: "Axar Patel 56 DC vs PBKS", heat: "hot" },
//     { rank: 3,  query: "David Miller return DC", heat: "hot" },
//     { rank: 4,  query: "IPL 2026 points table May 12", heat: "hot" },
//     { rank: 5,  query: "PBKS 4 losses in a row", heat: "hot" },
//     { rank: 6,  query: "Madhav Tiwari debut Player of Match", heat: "warm" },
//     { rank: 7,  query: "DC highest chase Dharamshala record", heat: "warm" },
//     { rank: 8,  query: "Priyansh Arya 56 first over record", heat: "warm" },
//     { rank: 9,  query: "PBKS playoff chances 3 games left", heat: "warm" },
//     { rank: 10, query: "GT SRH playing 11 tonight", heat: "warm" },
//     { rank: 11, query: "Shubman Gill GT vs SRH", heat: "normal" },
//     { rank: 12, query: "Travis Head SRH Ahmedabad", heat: "normal" },
//     { rank: 13, query: "Yuzvendra Chahal not bowled PBKS", heat: "normal" },
//     { rank: 14, query: "RCB NRR lead over SRH GT", heat: "normal" },
//     { rank: 15, query: "Axar Patel first fifty IPL 2026", heat: "normal" },
//     { rank: 16, query: "IPL 2026 playoff scenarios CSK", heat: "normal" },
//     { rank: 17, query: "Eshan Malinga wickets SRH", heat: "normal" },
//     { rank: 18, query: "KL Rahul dismissed early PBKS DC", heat: "normal" },
//     { rank: 19, query: "DC 2 must-win games left", heat: "normal" },
//     { rank: 20, query: "JioHotstar GT vs SRH stream", heat: "normal" },
//   ],
//   fan_trends: [
//     { rank: 1, trend: "#MillerTime — David Miller trending after return to DC XI. Fans who called his benching 'criminal' now vindicated.", badge: "Euphoric", badgeClass: "green" },
//     { rank: 2, trend: "'Axar's first six of IPL 2026' — fans stunned it took this long. Tweet went massively viral during the chase.", badge: "Viral", badgeClass: "orange" },
//     { rank: 3, trend: "PBKS spiral discourse — 'from table toppers to 4 losses in a row.' CSK, RR, GT, SRH fans celebrating PBKS's pain.", badge: "Schadenfreude", badgeClass: "red" },
//     { rank: 4, trend: "GT vs SRH hype building all morning — 'this is the match of the season.' Fans calling it a playoff final preview.", badge: "Building hype", badgeClass: "gold" },
//     { rank: 5, trend: "Chahal not bowling at Dharamshala — cricket Twitter baffled. 'Experienced leg spinner, seaming conditions, benched.'", badge: "Cricket nerd debate", badgeClass: "neutral" },
//     { rank: 6, trend: "Madhav Tiwari debut Player of Match — new fan favourite emerging. 'Find someone who performs like Madhav Tiwari on debut' format spreading.", badge: "New favourite", badgeClass: "green" },
//     { rank: 7, trend: "Bhuvneshwar Kumar India comeback campaign — Rayudu's quote boosting the campaign. Selectors + NCA discussions trending.", badge: "Ongoing campaign", badgeClass: "blue" },
//     { rank: 8, trend: "DC playoff maths — fans calculating DC need to win both remaining games AND need results to go their way. 'DC never die' energy back.", badge: "Hope vs math", badgeClass: "gold" },
//   ],
//   ads: [
//     { brand: "Google · AI Mode / Gemini", detail: "Category-exclusive co-presenting slot JioStar TV + digital. ~12% total IPL TV ad volume. ~₹270 Cr BCCI deal.", tier: "Co-presenting sponsor", tierClass: "blue" },
//     { brand: "OpenAI · ChatGPT", detail: "Everyday Superheroes campaign — 150+ TV channels, 25+ platforms, 9 languages. CSK, DC, LSG, RCB, RR deals.", tier: "5 franchise partner", tierClass: "green" },
//     { brand: "Amazon", detail: "Official co-powered category on JioStar's 27-brand sponsor roster.", tier: "Co-powered sponsor", tierClass: "neutral" },
//     { brand: "Microsoft · Copilot", detail: "Bing AI cricket APIs + Azure analytics integrations. No co-presenting tier confirmed.", tier: "Digital advertising", tierClass: "neutral" },
//     { brand: "Meta", detail: "Instagram + WhatsApp primary vehicle for Miller/Axar fan content and GT vs SRH preview graphics today.", tier: "Adtech / UGC", tierClass: "neutral" },
//     { brand: "Adobe · Claude (Anthropic)", detail: "No verified IPL 2026 advertising campaign for either brand. Not on JioStar's official sponsor roster.", tier: "Not confirmed", tierClass: "red" },
//   ],
//   languages: [
//     { language: "Hindi", share_pct: 52, note: "Star Sports 1 Hindi HD + JioHotstar. DC comeback and Miller return dominated Hindi commentary last night.", color: "#4a9eff", gradientTo: "#2277cc" },
//     { language: "Tamil", share_pct: 13, note: "Star Sports Tamil. CSK's playoff qualification math keeping Tamil fans engaged. Dhoni question simmering.", color: "#ffd94a", gradientTo: "#cc9900" },
//     { language: "Telugu", share_pct: 11, note: "SRH fanbase locked in for tonight's GT vs SRH in Ahmedabad. Audience spiking ahead of the big match.", color: "#2bdd8c", gradientTo: "#119960" },
//   ],
//   ad_volume: [
//     { label: "Fintech/Ecomm", pct: 40, color: "#4a9eff" },
//     { label: "FMCG/Auto", pct: 24, color: "#a87eff" },
//     { label: "AI brands", pct: 10, color: "#ff6b2b" },
//     { label: "Others", pct: 26, color: "#555" },
//   ],
//   memes: [
//     { rank: 1, text: '"And these clowns benched him" — DC fan tweet next to David Miller\'s 51 off 28. Most shared reaction post of the night.', meta: "X · @KLfied_ · Vibe: vindicated rage" },
//     { rank: 2, text: '"That was 1st ever six hit by Axar Patel in IPL 2026" — posted mid-match, fans reacted with shock.', meta: "X · @Adityakrsaha · Vibe: stunned disbelief" },
//     { rank: 3, text: '"CSK, RR, GT, SRH fans when DC beats PBKS" — four rival fanbases united in joy at PBKS\'s 4th straight loss.', meta: "X · @sagarcasm · Vibe: collective schadenfreude" },
//     { rank: 4, text: 'Shreyas Iyer\'s "fielding and bowling again" post-match face — freeze frame for the 4th match in a row. Caption: "New season, same diagnosis."', meta: "Instagram / WhatsApp · Vibe: dry despair" },
//     { rank: 5, text: '"Yuzvendra Chahal at Dharamshala watching the game" — meme of someone sitting unused. No over of spin bowled.', meta: "X · Cricket Twitter · Vibe: tactical bafflement turned comedy" },
//   ],
//   most_liked: [
//     { text: "David Miller's return knock highlight — 51 off 28, four sixes, back after being benched. DC official post + fan clips.", meta: "DC Official · X / Instagram · Most engaged cricket post overnight", accent: "#a87eff" },
//     { text: 'PTI match report: "Miller, Axar keep DC alive in IPL with record chase; PBKS lose four in a row" — most widely shared headline framing.', meta: "PTI via Siasat.com · X · Most screenshotted headline", accent: "#4a9eff" },
//     { text: 'ESPNcricinfo: "Only 2nd time in IPL history an over of spin was not bowled in a full-length game" — Dharamshala stat that floored cricket nerds.', meta: "ESPNcricinfo · X · High among analysts and fans", accent: "#2bdd8c" },
//     { text: 'Ambati Rayudu on Bhuvneshwar Kumar: "He\'s becoming sort of an artist now" — Bhuvi India comeback campaign getting major boost.', meta: "ESPNcricinfo video clip · X · India cricket fans + selectors watching", accent: "#FFD84A" },
//     { text: 'GT vs SRH tonight promo — "Both on 14 pts. One match. One top spot." Official IPL graphic building fever all morning.', meta: "IPL Official + GT + SRH accounts · X / Instagram · Pre-match hype building fast", accent: "#C41E1E" },
//   ],
//   articles: [
//     { rank: 1, source: "Tribune India", tag: "match report", tagClass: "blue", title: "IPL 2026: Shreyas Iyer blames fielding, bowling as PBKS suffer defeat vs DC", summary: "Skipper Shreyas Iyer pointed to fielding and bowling shortcomings as key reasons behind PBKS's loss to DC, saying the team fell 30 runs short of a par score. DC completed the highest-ever successful chase at Dharamshala with Axar Patel and David Miller the architects of a record 211-run pursuit.", url: "https://www.tribuneindia.com/news/cricket-news/ipl-2026-shreyas-iyer-blames-fielding-bowling-as-pbks-suffer-defeat-vs-dc", linkColor: "#4a9eff", accent: "#4a9eff" },
//     { rank: 2, source: "Tribune India", tag: "player quote", tagClass: "green", title: '"Very happy with how the team played": Axar Patel after DC\'s 3-wicket win over PBKS', summary: "Axar Patel praised the team's collective effort — highlighting debutant Madhav Tiwari's composure, his 64-run partnership with Miller, and youngsters finishing the game. He flagged the powerplay turnaround as the decisive tactical moment.", url: "https://www.tribuneindia.com/news/axar-patel/very-happy-with-how-the-team-played-axar-patel-after-dcs-3-wicket-win-over-pbks", linkColor: "#2bdd8c", accent: "#2bdd8c" },
//     { rank: 3, source: "Business Standard", tag: "highlights", tagClass: "gold", title: "PBKS vs DC HIGHLIGHTS IPL 2026: Axar-Miller shine as DC beat PBKS to keep their season alive", summary: "Full highlights of DC's record chase at Dharamshala — Priyansh Arya's first-over onslaught, DC's collapse to 14/2, and the Axar-Miller resurgence. PBKS's fourth consecutive defeat leaves them on 13 points while DC jump to 10.", url: "https://www.business-standard.com/cricket/ipl/ipl-2026-live-score-updates-pbks-vs-dc-full-scorecard-punjab-kings-vs-delhi-capitals-highlights-126051100740_1.html", linkColor: "#FFD84A", accent: "#FFD84A" },
//     { rank: 4, source: "Business Standard", tag: "match preview", tagClass: "orange", title: "IPL 2026: GT vs SRH Playing 11, live toss and match time, streaming", summary: "Both GT and SRH on 14 points — tonight's Ahmedabad clash is a top-of-table shootout. Winner moves to 16 points and near-certain playoff qualification. Playing 11 options, venue history, and key battles covered.", url: "https://www.business-standard.com/cricket/ipl/ipl-2026-gt-vs-srh-playing-11-live-toss-and-match-time-streaming-126051100745_1.html", linkColor: "#ff6b2b", accent: "#a87eff" },
//     { rank: 5, source: "Siasat Daily (PTI)", tag: "narrative", tagClass: "neutral", title: "Miller, Axar keep DC alive in IPL with record chase; PBKS lose four in a row", summary: "PTI's definitive match narrative — DC gunned down 211 in 19 overs for the highest-ever T20 chase at Dharamshala. PBKS have now lost four straight and need at least two wins from three remaining games to reach the playoffs.", url: "https://www.siasat.com/miller-axar-keep-dc-alive-in-ipl-with-record-chase-pbks-lose-four-in-a-row-3469549/", linkColor: "#a87eff", accent: "#ff6b2b" },
//   ],
//   signals: [
//     { num: "01", title: "DC are alive — and the Axar + Miller combination is finally clicking at the right time", desc: "Record chase at Dharamshala. Axar's first fifty of the season. David Miller back from the bench delivering 51 off 28. Debutant Madhav Tiwari winning Player of the Match. DC's 'never say die' brand is back in full force. They need both remaining games — and results to go their way — but after last night, no one is writing them off.", accent: "#4a9eff" },
//     { num: "02", title: "PBKS's collapse is now a four-match structural crisis — not bad luck", desc: "Fielding. Bowling. Again. Shreyas Iyer's fourth identical post-match assessment in a row. Dropped catches. Chahal unused at Dharamshala on a seaming pitch. A team that was unbeaten through 7 games has now lost 4 straight. Still technically in playoff contention with 13 pts but the form curve is brutal.", accent: "#C41E1E" },
//     { num: "03", title: "GT vs SRH tonight is the match of the season so far — both teams, one top spot, Ahmedabad", desc: "Both on 14 points. Winner gets 16 and near-certain playoff qualification. Shubman Gill's GT — four-match winning streak — vs Pat Cummins's SRH — six wins in last seven. Tonight decides the season's first confirmed playoff qualifier.", accent: "#FFD84A" },
//     { num: "04", title: 'The "no spin bowled" stat from Dharamshala is sparking cricket\'s analytical conversation of the week', desc: "Only the second time in IPL history that not a single over of spin was bowled in a full-length game by either side. Both teams had world-class spinners, both opted for pace on a seaming surface. Cricket Twitter split: brilliant tactical adaptation vs an era-defining shift in T20 thinking.", accent: "#2bdd8c" },
//     { num: "05", title: "Bhuvneshwar Kumar's India comeback campaign is no longer fringe — mainstream cricket media is picking it up", desc: "Ambati Rayudu's 'he's becoming an artist' quote on air is the latest mainstream voice joining what started as a fan campaign. 21 wickets, 7.46 economy, Purple Cap, match-winning six vs MI. At 35, defying age in the most physical format.", accent: "#a87eff" },
//   ],
//   sources: ["ESPNcricinfo","PTI / Siasat Daily","Tribune India","Business Standard","Yardbarker","CricTracker","IPLT20.com"],
// };

// // ─── Badge ────────────────────────────────────────────────────────────────────

// type BadgeClass = "red" | "green" | "gold" | "blue" | "orange" | "neutral";

// const badgeStyles: Record<BadgeClass, string> = {
//   red:     "bg-[rgba(196,30,30,0.12)] text-[#C41E1E] border border-[rgba(196,30,30,0.2)]",
//   green:   "bg-[rgba(43,221,140,0.12)] text-[#2bdd8c] border border-[rgba(43,221,140,0.2)]",
//   gold:    "bg-[rgba(255,216,74,0.12)] text-[#FFD84A] border border-[rgba(255,216,74,0.2)]",
//   blue:    "bg-[rgba(74,158,255,0.12)] text-[#4a9eff] border border-[rgba(74,158,255,0.2)]",
//   orange:  "bg-[rgba(255,107,43,0.12)] text-[#ff6b2b] border border-[rgba(255,107,43,0.2)]",
//   neutral: "bg-[rgba(255,255,255,0.06)] text-[#8888a2] border border-[rgba(255,255,255,0.07)]",
// };

// function Badge({ label, cls }: { label: string; cls: BadgeClass }) {
//   return (
//     <span className={`font-mono text-[9px] tracking-[0.07em] uppercase px-2 py-[2px] rounded-[10px] font-medium whitespace-nowrap ${badgeStyles[cls]}`}>
//       {label}
//     </span>
//   );
// }

// // ─── Section Header ───────────────────────────────────────────────────────────

// function SectionHeader({ title, sub }: { title: string; sub?: string }) {
//   return (
//     <div className="flex items-baseline gap-3 mb-3 mt-7">
//       <h2 className="font-['Bebas_Neue'] text-xl tracking-[0.05em] whitespace-nowrap text-[#eeedf0]">{title}</h2>
//       <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
//       {sub && <span className="font-mono text-[10px] text-[#50506a] tracking-[0.1em] uppercase whitespace-nowrap">{sub}</span>}
//     </div>
//   );
// }

// // ─── Card wrapper ─────────────────────────────────────────────────────────────

// function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
//   return (
//     <div className={`bg-[#101016] border border-[rgba(255,255,255,0.07)] rounded-xl p-[18px] relative overflow-hidden ${className}`}>
//       <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.13)] to-transparent" />
//       {children}
//     </div>
//   );
// }

// function CardLabel({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-[#50506a] mb-3">
//       {children}
//       <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function IPLPulse() {
//   return (
//     <div className="bg-[#09090e] min-h-screen text-[#eeedf0] font-['DM_Sans',sans-serif] text-sm leading-relaxed">
//       {/* Google Fonts */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');
//         @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
//         .live-pip::before { content:''; display:inline-block; width:6px; height:6px; border-radius:50%; background:#2bdd8c; margin-right:5px; animation:blink 1.8s ease infinite; vertical-align:middle; }
//       `}</style>

//       <div className="max-width-[1300px] mx-auto px-4 sm:px-6 pb-16">

//         {/* ── HEADER ── */}
//         <div className="pt-7 pb-5 border-b border-[rgba(255,255,255,0.07)] flex items-end justify-between flex-wrap gap-4 mb-6">
//           <div>
//             <div className="font-mono text-[10px] text-[#C41E1E] tracking-[0.16em] uppercase mb-1">SportsFan360 — Intelligence Dashboard</div>
//             <h1 className="font-['Bebas_Neue'] text-[clamp(36px,8vw,52px)] leading-none tracking-[0.02em]">
//               IPL 2026 <span className="text-[#C41E1E]">PULSE</span>
//             </h1>
//             <div className="text-xs text-[#8888a2] mt-1 flex flex-wrap gap-2 items-center">
//               <span>24-Hour Sentiment Report</span><span>·</span>
//               <span>Tuesday, 12 May 2026</span><span>·</span>
//               <span>DC keep playoffs alive · PBKS spiral deepens</span>
//             </div>
//           </div>
//           <div className="flex flex-col items-end gap-2">
//             <span className="live-pip font-mono text-[10px] text-[#2bdd8c] tracking-[0.1em] uppercase">Live Season · Match 56 Tonight</span>
//             <div className="bg-[#16161e] border border-[rgba(255,255,255,0.13)] rounded-[20px] px-3 py-1.5 text-xs text-[#FFD84A] flex items-center gap-1.5">
//               GT vs SRH tonight <span className="text-[#8888a2]">Ahmedabad · 7:30 PM · Top 2 clash</span>
//             </div>
//           </div>
//         </div>

//         {/* ── YESTERDAY'S MATCH ── */}
//         <SectionHeader title="Yesterday's Match" sub="Match 55 · May 11 · Dharamshala" />
//         <div className="bg-[#16161e] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-3.5 relative overflow-hidden mb-3.5">
//           <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#2561ae] to-[#4a9eff]" />
//           <div className="font-mono text-[9px] text-[#50506a] uppercase tracking-[0.1em] mb-2">Match 55 · HPCA Stadium, Dharamshala · May 11</div>
//           <div className="flex items-center gap-2.5 mb-2 flex-wrap">
//             <div>
//               <div className="font-['Bebas_Neue'] text-[22px] leading-none">210/5</div>
//               <div className="font-mono text-[10px] text-[#50506a] uppercase">PBKS (20 ov)</div>
//             </div>
//             <div className="text-[11px] text-[#50506a]">lost to</div>
//             <div>
//               <div className="font-['Bebas_Neue'] text-[22px] leading-none">216/7</div>
//               <div className="font-mono text-[10px] text-[#50506a] uppercase">DC (19 ov)</div>
//             </div>
//             <span className="font-mono text-[10px] px-2.5 py-[3px] rounded-md text-[#2bdd8c] bg-[rgba(43,221,140,0.1)] border border-[rgba(43,221,140,0.2)]">
//               DC won by 3 wkts — highest ever chase at Dharamshala
//             </span>
//           </div>
//           <div className="text-xs text-[#8888a2] leading-relaxed">
//             Priyansh Arya 56(33) set the tone. DC were 33/3 inside 5 overs, looked dead. Axar Patel&apos;s first 50 of the season (56 off 30) + David Miller&apos;s return knock (51 off 28) — a 64-run stand — turned it. Lower order sealed it with an over to spare. PBKS: 4th straight loss. No over of spin bowled by either side — only 2nd time in IPL history. Madhav Tiwari: Player of the Match (2/40 + 18* off 8).
//           </div>
//         </div>

//         {/* ── TONIGHT ── */}
//         <div className="bg-gradient-to-br from-[rgba(255,107,43,0.08)] to-[rgba(255,216,74,0.05)] border border-[rgba(255,107,43,0.2)] rounded-xl px-4 py-3.5 flex items-center justify-between gap-3 flex-wrap mb-6">
//           <div>
//             <div className="font-mono text-[9px] text-[#ff6b2b] uppercase tracking-[0.1em] mb-1">Tonight · Match 56 · The Big One</div>
//             <div className="text-base font-medium">Gujarat Titans vs Sunrisers Hyderabad</div>
//             <div className="text-xs text-[#8888a2] mt-0.5">Narendra Modi Stadium, Ahmedabad · 7:30 PM IST · Both on 14 pts · Winner goes top and nearly books playoff spot</div>
//           </div>
//           <div className="font-mono text-[11px] bg-[rgba(255,107,43,0.12)] text-[#ff6b2b] border border-[rgba(255,107,43,0.25)] rounded-lg px-3.5 py-1.5 whitespace-nowrap">
//             Winner goes #1 + near playoff lock
//           </div>
//         </div>

//         {/* ── KPI ROW ── */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
//           {data.kpis.map((k, i) => (
//             <div key={i} className="bg-[#101016] border border-[rgba(255,255,255,0.07)] rounded-xl p-[18px] relative overflow-hidden hover:border-[rgba(255,255,255,0.13)] transition-colors">
//               <div className="font-['Bebas_Neue'] text-[44px] leading-none" style={{ color: k.color }}>{k.value}</div>
//               <div className="text-xs text-[#8888a2] leading-snug mt-0.5">{k.label}</div>
//               <div className="font-mono text-[10px] text-[#50506a] mt-1">{k.sub}</div>
//               <div className="absolute bottom-[-10px] right-[-10px] w-14 h-14 rounded-full opacity-[0.07]" style={{ background: k.color }} />
//             </div>
//           ))}
//         </div>

//         {/* ── QUOTES + STANDINGS ── */}
//         <SectionHeader title="Analyst & Player Voice" sub="Verified · May 12" />
//         <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3.5 mb-2">

//           {/* Quotes */}
//           <Card>
//             <CardLabel>What they said</CardLabel>
//             <div className="flex flex-col gap-2.5">
//               {data.quotes.map((q, i) => {
//                 const accentColors: Record<BadgeClass, string> = { red: "#C41E1E", green: "#2bdd8c", gold: "#FFD84A", blue: "#4a9eff", orange: "#ff6b2b", neutral: "#50506a" };
//                 return (
//                   <div key={i} className="border-l-2 pl-3 py-2 bg-[#16161e] rounded-r-lg hover:border-l-[#C41E1E] transition-colors" style={{ borderLeftColor: accentColors[q.badgeClass as BadgeClass] }}>
//                     <p className="text-[13px] text-[#eeedf0] leading-relaxed mb-1.5">&apos;{q.text}&apos;</p>
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <span className="text-[11px] text-[#50506a] flex-1">{q.speaker}, {q.role}</span>
//                       <Badge label={q.badge} cls={q.badgeClass as BadgeClass} />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </Card>

//           {/* Points Table */}
//           <Card>
//             <CardLabel>Points table · May 12</CardLabel>
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr>
//                     {["Team","M","W","Pts","Form"].map(h => (
//                       <th key={h} className={`font-mono text-[9px] tracking-[0.1em] uppercase text-[#50506a] pb-2 border-b border-[rgba(255,255,255,0.07)] ${h === "Team" ? "text-left pr-2" : "text-center"}`}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.points_table.map((row) => (
//                     <tr key={row.rank} className={`hover:bg-[#16161e] ${row.eliminated ? "opacity-40" : ""} ${row.playoff_zone ? "bg-[rgba(196,30,30,0.02)]" : ""}`}>
//                       <td className="py-2 pr-2 border-b border-[rgba(255,255,255,0.07)]">
//                         <div className="flex items-center gap-1.5">
//                           <span className="inline-block w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: row.color }} />
//                           <span className={`text-[13px] font-medium ${row.playoff_zone ? "text-[#2bdd8c]" : "text-[#eeedf0]"}`}>{row.team}</span>
//                         </div>
//                       </td>
//                       <td className="py-2 text-center border-b border-[rgba(255,255,255,0.07)] text-[13px] text-[#8888a2]">{row.played}</td>
//                       <td className="py-2 text-center border-b border-[rgba(255,255,255,0.07)] text-[13px] text-[#8888a2]">{row.won}</td>
//                       <td className="py-2 text-center border-b border-[rgba(255,255,255,0.07)]">
//                         <span className={`bg-[#16161e] rounded px-1.5 py-[2px] font-mono text-[11px] font-medium ${row.eliminated ? "text-[#C41E1E]" : row.playoff_zone ? "text-[#2bdd8c]" : "text-[#8888a2]"}`}>{row.points}</span>
//                       </td>
//                       <td className="py-2 text-center border-b border-[rgba(255,255,255,0.07)]">
//                         <div className="flex items-center justify-center gap-[2px]">
//                           {row.form.map((f, fi) => (
//                             <span key={fi} className={`inline-block w-2.5 h-2.5 rounded-[2px] ${f === "W" ? "bg-[#2bdd8c]" : "bg-[#C41E1E]"}`} />
//                           ))}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="mt-2.5 text-[10px] text-[#50506a]">🟠 KL Rahul 2nd on Orange Cap · 🟣 Bhuvi 21 wkts Purple Cap leader</div>
//             <div className="mt-2 px-2.5 py-2 bg-[rgba(255,107,43,0.08)] rounded-md border border-[rgba(255,107,43,0.2)] text-[11px] text-[#ff6b2b]">Tonight: GT vs SRH winner goes 16 pts · near playoff certainty · loser stays on 14</div>
//           </Card>
//         </div>

//         {/* ── SEARCH + FAN TRENDS ── */}
//         <SectionHeader title="Search & Fan Trends" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-2">

//           {/* Searches */}
//           <Card>
//             <CardLabel>Top 20 searches · May 12</CardLabel>
//             <div className="flex flex-wrap gap-1.5">
//               {data.top_searches.map((s) => {
//                 const numCls = s.heat === "hot"
//                   ? "bg-[rgba(196,30,30,0.2)] text-[#C41E1E]"
//                   : s.heat === "warm"
//                   ? "bg-[rgba(255,216,74,0.15)] text-[#FFD84A]"
//                   : "bg-[#1c1c26] text-[#50506a]";
//                 return (
//                   <span key={s.rank} className="inline-flex items-center gap-1.5 bg-[#16161e] border border-[rgba(255,255,255,0.07)] rounded-[20px] px-3 py-1 text-xs text-[#eeedf0]">
//                     <span className={`font-mono text-[9px] rounded-full w-[17px] h-[17px] flex items-center justify-center flex-shrink-0 ${numCls}`}>{s.rank}</span>
//                     {s.query}
//                   </span>
//                 );
//               })}
//             </div>
//             <div className="text-[10px] text-[#50506a] mt-2.5">Top 10 verified from ESPNcricinfo, Tribune India, Business Standard, Yardbarker, CricTracker.</div>
//           </Card>

//           {/* Fan Trends */}
//           <Card>
//             <CardLabel>Leading fan trends</CardLabel>
//             {data.fan_trends.map((t, i) => (
//               <div key={i} className={`flex items-center gap-2.5 py-2.5 ${i < data.fan_trends.length - 1 ? "border-b border-[rgba(255,255,255,0.07)]" : ""}`}>
//                 <div className="font-mono text-[10px] text-[#50506a] w-5 flex-shrink-0">{String(t.rank).padStart(2,"0")}</div>
//                 <div className="text-[13px] text-[#eeedf0] flex-1 leading-snug">{t.trend}</div>
//                 <Badge label={t.badge} cls={t.badgeClass as BadgeClass} />
//               </div>
//             ))}
//           </Card>
//         </div>

//         {/* ── ADS + LANGUAGE ── */}
//         <SectionHeader title="Brand Ads & Language Reach" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-2">

//           {/* Ads */}
//           <Card>
//             <CardLabel>Tech & AI brand advertising · IPL 2026</CardLabel>
//             <div className="flex flex-col gap-2">
//               {data.ads.map((ad, i) => (
//                 <div key={i} className="bg-[#16161e] border border-[rgba(255,255,255,0.07)] rounded-[10px] p-3">
//                   <div className="flex items-center justify-between mb-1.5">
//                     <div className="text-[13px] font-medium text-[#eeedf0]">{ad.brand}</div>
//                     <Badge label={ad.tier} cls={ad.tierClass as BadgeClass} />
//                   </div>
//                   <div className="text-xs text-[#8888a2] leading-relaxed">{ad.detail}</div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Language + Ad Volume */}
//           <Card>
//             <CardLabel>Top 3 consumption languages</CardLabel>
//             <div className="flex flex-col gap-3.5">
//               {data.languages.map((l, i) => (
//                 <div key={i}>
//                   <div className="flex justify-between items-baseline mb-1.5">
//                     <span className="text-[13px] font-medium">{l.language}</span>
//                     <span className="font-['Bebas_Neue'] text-[22px] text-[#8888a2]">~{l.share_pct}%</span>
//                   </div>
//                   <div className="h-1 bg-[#1c1c26] rounded-full overflow-hidden">
//                     <div className="h-full rounded-full" style={{ width: `${(l.share_pct / 52) * 100}%`, background: `linear-gradient(90deg,${l.color},${l.gradientTo})` }} />
//                   </div>
//                   <div className="text-[11px] text-[#50506a] mt-1">{l.note}</div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4">
//               <CardLabel>Ad volume share</CardLabel>
//               <div className="flex flex-col gap-1.5">
//                 {data.ad_volume.map((av, i) => (
//                   <div key={i} className="flex items-center gap-2.5">
//                     <div className="text-xs text-[#8888a2] w-[90px] flex-shrink-0">{av.label}</div>
//                     <div className="flex-1 h-[5px] bg-[#1c1c26] rounded-full overflow-hidden">
//                       <div className="h-full rounded-full" style={{ width: `${(av.pct / 40) * 100}%`, background: av.color }} />
//                     </div>
//                     <div className="font-mono text-[10px] text-[#8888a2] w-9 text-right">~{av.pct}%</div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* ── MEMES + MOST LIKED ── */}
//         <SectionHeader title="Memes & Most Liked" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-2">

//           {/* Memes */}
//           <Card>
//             <CardLabel>Top 5 memes · May 12 morning</CardLabel>
//             <div className="flex flex-col gap-2">
//               {data.memes.map((m, i) => (
//                 <div key={i} className="flex items-start gap-3 p-3 bg-[#16161e] rounded-[10px] border border-[rgba(255,255,255,0.07)]">
//                   <div className="font-['Bebas_Neue'] text-[28px] text-[#50506a] leading-none flex-shrink-0 w-[26px] opacity-35">{String(m.rank).padStart(2,"0")}</div>
//                   <div>
//                     <div className="text-[13px] text-[#eeedf0] leading-relaxed mb-1">{m.text}</div>
//                     <div className="text-[11px] text-[#50506a]">{m.meta}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>

//           {/* Most Liked */}
//           <Card>
//             <CardLabel>Top 5 most liked posts · last 24 hrs</CardLabel>
//             <div className="flex flex-col gap-2">
//               {data.most_liked.map((l, i) => (
//                 <div key={i} className="pl-3 py-2.5 bg-[#16161e] rounded-r-[10px] rounded-bl-[10px] border-l-2" style={{ borderLeftColor: l.accent }}>
//                   <div className="text-[13px] text-[#eeedf0] leading-relaxed mb-1">{l.text}</div>
//                   <div className="text-[11px] text-[#50506a]">{l.meta}</div>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </div>

//         {/* ── TOP 5 ARTICLES ── */}
//         <SectionHeader title="Top 5 Trending Articles" sub="May 12 · Verified links" />
//         <div className="flex flex-col gap-2.5 mb-2">
//           {data.articles.map((a, i) => (
//             <div key={i} className="bg-[#101016] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-4 relative overflow-hidden hover:border-[rgba(255,255,255,0.13)] transition-colors">
//               <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.13)] to-transparent" />
//               <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: a.accent }} />
//               <div className="flex items-center justify-between mb-2 flex-wrap gap-1.5 pl-2">
//                 <div className="font-mono text-[9px] text-[#50506a] uppercase tracking-[0.1em]">#{a.rank} · {a.source} · May 12</div>
//                 <Badge label={a.tag} cls={a.tagClass as BadgeClass} />
//               </div>
//               <div className="text-sm font-medium leading-snug mb-1.5 pl-2">{a.title}</div>
//               <div className="text-xs text-[#8888a2] leading-relaxed mb-2.5 pl-2">{a.summary}</div>
//               <a href={a.url} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] tracking-[0.06em] pl-2 hover:underline" style={{ color: a.linkColor }}>
//                 READ FULL ARTICLE → {new URL(a.url).hostname.replace("www.","")}
//               </a>
//             </div>
//           ))}
//         </div>

//         {/* ── SIGNALS ── */}
//         <SectionHeader title="Top 5 Signals" sub="Editorial brief · May 12" />
//         <div className="flex flex-col gap-2.5 mb-2">
//           {data.signals.map((s, i) => (
//             <div key={i} className="bg-[#101016] border border-[rgba(255,255,255,0.07)] rounded-xl px-4 py-4 flex gap-3.5 relative overflow-hidden hover:border-[rgba(255,255,255,0.13)] transition-colors">
//               <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: s.accent }} />
//               <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.13)] to-transparent" />
//               <div className="font-['Bebas_Neue'] text-[44px] leading-none text-[#50506a] opacity-20 flex-shrink-0 w-[38px]">{s.num}</div>
//               <div>
//                 <div className="text-sm font-medium mb-1">{s.title}</div>
//                 <div className="text-[13px] text-[#8888a2] leading-relaxed">{s.desc}</div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── FOOTER ── */}
//         <div className="mt-10 pt-4 border-t border-[rgba(255,255,255,0.07)] text-[11px] text-[#50506a] flex justify-between flex-wrap gap-2">
//           <div>Sources: {data.sources.join(" · ")} — Verified May 12, 2026</div>
//           <div>SportsFan360 Intelligence · Daily Brief</div>
//         </div>

//       </div>
//     </div>
//   );
// }










"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const data = {
  report_date: "2026-05-12",
  meta: {
    title: "IPL 2026 Pulse — May 12",
    subtitle: "24-Hour Sentiment Report",
    summary: "DC keep playoffs alive with record chase at Dharamshala. PBKS spiral deepens — 4 straight losses. GT vs SRH tonight in Ahmedabad.",
  },
  match_result: {
    match_number: 55,
    date: "2026-05-11",
    venue: "HPCA Stadium, Dharamshala",
    team1: { name: "Punjab Kings", short: "PBKS", score: "210/5", overs: 20, result: "lost" },
    team2: { name: "Delhi Capitals", short: "DC", score: "216/7", overs: 19, result: "won" },
    result: "DC won by 3 wickets",
    note: "Highest ever successful chase at Dharamshala. No over of spin bowled by either side — only 2nd time in IPL history.",
    player_of_match: "Madhav Tiwari (2/40 + 18* off 8)",
  },
  tonight: {
    match_number: 56,
    teams: "Gujarat Titans vs Sunrisers Hyderabad",
    venue: "Narendra Modi Stadium, Ahmedabad",
    time: "7:30 PM IST",
    context: "Both on 14 pts. Winner goes to 16 and near playoff certainty.",
    badge: "Winner goes #1 + near playoff lock",
  },
  kpis: [
    { value: "3", label: "DC's winning margin — wickets", sub: "Record chase at Dharamshala — 211 gunned down in 19 ov", color: "#4a9eff" },
    { value: "4", label: "PBKS losses in a row", sub: "Table toppers → 4th · 3 must-wins to qualify", color: "#C41E1E" },
    { value: "14", label: "Points — GT and SRH tonight", sub: "Both on 14 pts from 11 games · Winner to 16", color: "#FFD84A" },
    { value: "8", label: "Teams still in playoff contention", sub: "Only MI + LSG eliminated · All others alive", color: "#2bdd8c" },
  ],
  quotes: [
    { text: "I won't beat around the bush; I'll just say fielding and bowling again. I feel it was 30 runs more on this wicket given how the ball was seaming and the variable bounce.", speaker: "Shreyas Iyer", role: "PBKS captain · post-match Dharamshala", badge: "Self-critical", badgeClass: "red" },
    { text: "It was a thought but the way it was seaming, if we had executed our lines and lengths, we may have gotten wickets. But we did not. We fell short of planning.", speaker: "Shreyas Iyer", role: "PBKS captain · on not bowling Chahal all game", badge: "Tactical regret", badgeClass: "gold" },
    { text: "Very happy with how the team played. In the bowling, first 3-4 overs they had 60 runs but to finish with only 72 in the powerplay — that was a winning moment. The future is strong.", speaker: "Axar Patel", role: "DC captain · post-match", badge: "Composed leader", badgeClass: "green" },
    { text: "We were behind. Axar has been working very hard. Tonight it came off. That is why he has been playing for so long — dug in deep and came out with good energy. We complement each other well.", speaker: "David Miller", role: "DC batter · on his partnership with Axar", badge: "Partnership quality", badgeClass: "green" },
    { text: "I would like to say I am a 100 percent bowler and a 100 percent batter. The wicket was helping the length balls, and I was sticking to that. Lucky to bowl four overs for the team.", speaker: "Madhav Tiwari", role: "DC · Player of the Match · debut all-rounder", badge: "Poised on debut", badgeClass: "gold" },
    { text: "He's becoming sort of an artist now. He's just becoming so, so good at what he's doing.", speaker: "Ambati Rayudu", role: "Commentator · on Bhuvneshwar Kumar's IPL 2026 season", badge: "High praise", badgeClass: "blue" },
    { text: "SRH arrive with momentum in their batting unit but must overcome a poor record against GT in Ahmedabad, as both teams eye No. 1 spot.", speaker: "ESPNcricinfo", role: "Match preview · GT vs SRH tonight", badge: "Tonight's frame", badgeClass: "neutral" },
  ],
  points_table: [
    { rank: 1, team: "RCB", played: 11, won: 7, points: 14, form: ["W","W","W","L","W"], playoff_zone: true, color: "#cc0000" },
    { rank: 2, team: "SRH", played: 11, won: 7, points: 14, form: ["W","W","W","L","W"], playoff_zone: true, color: "#f26522" },
    { rank: 3, team: "GT",  played: 11, won: 7, points: 14, form: ["W","W","W","W","L"], playoff_zone: true, color: "#1d4e9b" },
    { rank: 4, team: "PBKS",played: 11, won: 6, points: 13, form: ["L","L","L","L","W"], playoff_zone: true, color: "#dd4444" },
    { rank: 5, team: "CSK", played: 11, won: 6, points: 12, form: ["W","W","W","L","W"], playoff_zone: false, color: "#f9cd05" },
    { rank: 6, team: "RR",  played: 10, won: 6, points: 12, form: ["L","W","L","W","W"], playoff_zone: false, color: "#254aa5" },
    { rank: 7, team: "DC",  played: 12, won: 5, points: 10, form: ["W","L","L","L","W"], playoff_zone: false, color: "#2561ae" },
    { rank: 8, team: "KKR", played: 11, won: 4, points: 8,  form: ["W","W","W","L","L"], playoff_zone: false, color: "#3a225d" },
    { rank: 9, team: "MI",  played: 11, won: 3, points: 6,  form: ["L","L","L","L","L"], playoff_zone: false, color: "#004c93", eliminated: true },
    { rank: 10,team: "LSG", played: 11, won: 3, points: 6,  form: ["L","L","L","L","W"], playoff_zone: false, color: "#a5c8e1", eliminated: true },
  ],
  top_searches: [
    { rank: 1,  query: "GT vs SRH tonight Ahmedabad", heat: "hot" },
    { rank: 2,  query: "Axar Patel 56 DC vs PBKS", heat: "hot" },
    { rank: 3,  query: "David Miller return DC", heat: "hot" },
    { rank: 4,  query: "IPL 2026 points table May 12", heat: "hot" },
    { rank: 5,  query: "PBKS 4 losses in a row", heat: "hot" },
    { rank: 6,  query: "Madhav Tiwari debut Player of Match", heat: "warm" },
    { rank: 7,  query: "DC highest chase Dharamshala record", heat: "warm" },
    { rank: 8,  query: "Priyansh Arya 56 first over record", heat: "warm" },
    { rank: 9,  query: "PBKS playoff chances 3 games left", heat: "warm" },
    { rank: 10, query: "GT SRH playing 11 tonight", heat: "warm" },
    { rank: 11, query: "Shubman Gill GT vs SRH", heat: "normal" },
    { rank: 12, query: "Travis Head SRH Ahmedabad", heat: "normal" },
    { rank: 13, query: "Yuzvendra Chahal not bowled PBKS", heat: "normal" },
    { rank: 14, query: "RCB NRR lead over SRH GT", heat: "normal" },
    { rank: 15, query: "Axar Patel first fifty IPL 2026", heat: "normal" },
    { rank: 16, query: "IPL 2026 playoff scenarios CSK", heat: "normal" },
    { rank: 17, query: "Eshan Malinga wickets SRH", heat: "normal" },
    { rank: 18, query: "KL Rahul dismissed early PBKS DC", heat: "normal" },
    { rank: 19, query: "DC 2 must-win games left", heat: "normal" },
    { rank: 20, query: "JioHotstar GT vs SRH stream", heat: "normal" },
  ],
  fan_trends: [
    { rank: 1, trend: "#MillerTime — David Miller trending after return to DC XI. Fans who called his benching 'criminal' now vindicated.", badge: "Euphoric", badgeClass: "green" },
    { rank: 2, trend: "'Axar's first six of IPL 2026' — fans stunned it took this long. Tweet went massively viral during the chase.", badge: "Viral", badgeClass: "orange" },
    { rank: 3, trend: "PBKS spiral discourse — 'from table toppers to 4 losses in a row.' CSK, RR, GT, SRH fans celebrating PBKS's pain.", badge: "Schadenfreude", badgeClass: "red" },
    { rank: 4, trend: "GT vs SRH hype building all morning — 'this is the match of the season.' Fans calling it a playoff final preview.", badge: "Building hype", badgeClass: "gold" },
    { rank: 5, trend: "Chahal not bowling at Dharamshala — cricket Twitter baffled. 'Experienced leg spinner, seaming conditions, benched.'", badge: "Cricket nerd debate", badgeClass: "neutral" },
    { rank: 6, trend: "Madhav Tiwari debut Player of Match — new fan favourite emerging. 'Find someone who performs like Madhav Tiwari on debut' format spreading.", badge: "New favourite", badgeClass: "green" },
    { rank: 7, trend: "Bhuvneshwar Kumar India comeback campaign — Rayudu's quote boosting the campaign. Selectors + NCA discussions trending.", badge: "Ongoing campaign", badgeClass: "blue" },
    { rank: 8, trend: "DC playoff maths — fans calculating DC need to win both remaining games AND need results to go their way. 'DC never die' energy back.", badge: "Hope vs math", badgeClass: "gold" },
  ],
  ads: [
    { brand: "Google · AI Mode / Gemini", detail: "Category-exclusive co-presenting slot JioStar TV + digital. ~12% total IPL TV ad volume. ~₹270 Cr BCCI deal.", tier: "Co-presenting sponsor", tierClass: "blue" },
    { brand: "OpenAI · ChatGPT", detail: "Everyday Superheroes campaign — 150+ TV channels, 25+ platforms, 9 languages. CSK, DC, LSG, RCB, RR deals.", tier: "5 franchise partner", tierClass: "green" },
    { brand: "Amazon", detail: "Official co-powered category on JioStar's 27-brand sponsor roster.", tier: "Co-powered sponsor", tierClass: "neutral" },
    { brand: "Microsoft · Copilot", detail: "Bing AI cricket APIs + Azure analytics integrations. No co-presenting tier confirmed.", tier: "Digital advertising", tierClass: "neutral" },
    { brand: "Meta", detail: "Instagram + WhatsApp primary vehicle for Miller/Axar fan content and GT vs SRH preview graphics today.", tier: "Adtech / UGC", tierClass: "neutral" },
    { brand: "Adobe · Claude (Anthropic)", detail: "No verified IPL 2026 advertising campaign for either brand. Not on JioStar's official sponsor roster.", tier: "Not confirmed", tierClass: "red" },
  ],
  languages: [
    { language: "Hindi", share_pct: 52, note: "Star Sports 1 Hindi HD + JioHotstar. DC comeback and Miller return dominated Hindi commentary last night.", color: "#4a9eff", gradientTo: "#2277cc" },
    { language: "Tamil", share_pct: 13, note: "Star Sports Tamil. CSK's playoff qualification math keeping Tamil fans engaged. Dhoni question simmering.", color: "#ffd94a", gradientTo: "#cc9900" },
    { language: "Telugu", share_pct: 11, note: "SRH fanbase locked in for tonight's GT vs SRH in Ahmedabad. Audience spiking ahead of the big match.", color: "#2bdd8c", gradientTo: "#119960" },
  ],
  ad_volume: [
    { label: "Fintech/Ecomm", pct: 40, color: "#4a9eff" },
    { label: "FMCG/Auto", pct: 24, color: "#a87eff" },
    { label: "AI brands", pct: 10, color: "#ff6b2b" },
    { label: "Others", pct: 26, color: "#555" },
  ],
  memes: [
    { rank: 1, text: '"And these clowns benched him" — DC fan tweet next to David Miller\'s 51 off 28. Most shared reaction post of the night.', meta: "X · @KLfied_ · Vibe: vindicated rage" },
    { rank: 2, text: '"That was 1st ever six hit by Axar Patel in IPL 2026" — posted mid-match, fans reacted with shock.', meta: "X · @Adityakrsaha · Vibe: stunned disbelief" },
    { rank: 3, text: '"CSK, RR, GT, SRH fans when DC beats PBKS" — four rival fanbases united in joy at PBKS\'s 4th straight loss.', meta: "X · @sagarcasm · Vibe: collective schadenfreude" },
    { rank: 4, text: 'Shreyas Iyer\'s "fielding and bowling again" post-match face — freeze frame for the 4th match in a row. Caption: "New season, same diagnosis."', meta: "Instagram / WhatsApp · Vibe: dry despair" },
    { rank: 5, text: '"Yuzvendra Chahal at Dharamshala watching the game" — meme of someone sitting unused. No over of spin bowled.', meta: "X · Cricket Twitter · Vibe: tactical bafflement turned comedy" },
  ],
  most_liked: [
    { text: "David Miller's return knock highlight — 51 off 28, four sixes, back after being benched. DC official post + fan clips.", meta: "DC Official · X / Instagram · Most engaged cricket post overnight", accent: "#a87eff" },
    { text: 'PTI match report: "Miller, Axar keep DC alive in IPL with record chase; PBKS lose four in a row" — most widely shared headline framing.', meta: "PTI via Siasat.com · X · Most screenshotted headline", accent: "#4a9eff" },
    { text: 'ESPNcricinfo: "Only 2nd time in IPL history an over of spin was not bowled in a full-length game" — Dharamshala stat that floored cricket nerds.', meta: "ESPNcricinfo · X · High among analysts and fans", accent: "#2bdd8c" },
    { text: 'Ambati Rayudu on Bhuvneshwar Kumar: "He\'s becoming sort of an artist now" — Bhuvi India comeback campaign getting major boost.', meta: "ESPNcricinfo video clip · X · India cricket fans + selectors watching", accent: "#FFD84A" },
    { text: 'GT vs SRH tonight promo — "Both on 14 pts. One match. One top spot." Official IPL graphic building fever all morning.', meta: "IPL Official + GT + SRH accounts · X / Instagram · Pre-match hype building fast", accent: "#C41E1E" },
  ],
  articles: [
    { rank: 1, source: "Tribune India", tag: "match report", tagClass: "blue", title: "IPL 2026: Shreyas Iyer blames fielding, bowling as PBKS suffer defeat vs DC", summary: "Skipper Shreyas Iyer pointed to fielding and bowling shortcomings as key reasons behind PBKS's loss to DC, saying the team fell 30 runs short of a par score. DC completed the highest-ever successful chase at Dharamshala with Axar Patel and David Miller the architects of a record 211-run pursuit.", url: "https://www.tribuneindia.com/news/cricket-news/ipl-2026-shreyas-iyer-blames-fielding-bowling-as-pbks-suffer-defeat-vs-dc", linkColor: "#4a9eff", accent: "#4a9eff" },
    { rank: 2, source: "Tribune India", tag: "player quote", tagClass: "green", title: '"Very happy with how the team played": Axar Patel after DC\'s 3-wicket win over PBKS', summary: "Axar Patel praised the team's collective effort — highlighting debutant Madhav Tiwari's composure, his 64-run partnership with Miller, and youngsters finishing the game. He flagged the powerplay turnaround as the decisive tactical moment.", url: "https://www.tribuneindia.com/news/axar-patel/very-happy-with-how-the-team-played-axar-patel-after-dcs-3-wicket-win-over-pbks", linkColor: "#2bdd8c", accent: "#2bdd8c" },
    { rank: 3, source: "Business Standard", tag: "highlights", tagClass: "gold", title: "PBKS vs DC HIGHLIGHTS IPL 2026: Axar-Miller shine as DC beat PBKS to keep their season alive", summary: "Full highlights of DC's record chase at Dharamshala — Priyansh Arya's first-over onslaught, DC's collapse to 14/2, and the Axar-Miller resurgence. PBKS's fourth consecutive defeat leaves them on 13 points while DC jump to 10.", url: "https://www.business-standard.com/cricket/ipl/ipl-2026-live-score-updates-pbks-vs-dc-full-scorecard-punjab-kings-vs-delhi-capitals-highlights-126051100740_1.html", linkColor: "#FFD84A", accent: "#FFD84A" },
    { rank: 4, source: "Business Standard", tag: "match preview", tagClass: "orange", title: "IPL 2026: GT vs SRH Playing 11, live toss and match time, streaming", summary: "Both GT and SRH on 14 points — tonight's Ahmedabad clash is a top-of-table shootout. Winner moves to 16 points and near-certain playoff qualification. Playing 11 options, venue history, and key battles covered.", url: "https://www.business-standard.com/cricket/ipl/ipl-2026-gt-vs-srh-playing-11-live-toss-and-match-time-streaming-126051100745_1.html", linkColor: "#ff6b2b", accent: "#a87eff" },
    { rank: 5, source: "Siasat Daily (PTI)", tag: "narrative", tagClass: "neutral", title: "Miller, Axar keep DC alive in IPL with record chase; PBKS lose four in a row", summary: "PTI's definitive match narrative — DC gunned down 211 in 19 overs for the highest-ever T20 chase at Dharamshala. PBKS have now lost four straight and need at least two wins from three remaining games to reach the playoffs.", url: "https://www.siasat.com/miller-axar-keep-dc-alive-in-ipl-with-record-chase-pbks-lose-four-in-a-row-3469549/", linkColor: "#a87eff", accent: "#ff6b2b" },
  ],
  signals: [
    { num: "01", title: "DC are alive — and the Axar + Miller combination is finally clicking at the right time", desc: "Record chase at Dharamshala. Axar's first fifty of the season. David Miller back from the bench delivering 51 off 28. Debutant Madhav Tiwari winning Player of the Match. DC's 'never say die' brand is back in full force. They need both remaining games — and results to go their way — but after last night, no one is writing them off.", accent: "#4a9eff" },
    { num: "02", title: "PBKS's collapse is now a four-match structural crisis — not bad luck", desc: "Fielding. Bowling. Again. Shreyas Iyer's fourth identical post-match assessment in a row. Dropped catches. Chahal unused at Dharamshala on a seaming pitch. A team that was unbeaten through 7 games has now lost 4 straight. Still technically in playoff contention with 13 pts but the form curve is brutal.", accent: "#C41E1E" },
    { num: "03", title: "GT vs SRH tonight is the match of the season so far — both teams, one top spot, Ahmedabad", desc: "Both on 14 points. Winner gets 16 and near-certain playoff qualification. Shubman Gill's GT — four-match winning streak — vs Pat Cummins's SRH — six wins in last seven. Tonight decides the season's first confirmed playoff qualifier.", accent: "#FFD84A" },
    { num: "04", title: 'The "no spin bowled" stat from Dharamshala is sparking cricket\'s analytical conversation of the week', desc: "Only the second time in IPL history that not a single over of spin was bowled in a full-length game by either side. Both teams had world-class spinners, both opted for pace on a seaming surface. Cricket Twitter split: brilliant tactical adaptation vs an era-defining shift in T20 thinking.", accent: "#2bdd8c" },
    { num: "05", title: "Bhuvneshwar Kumar's India comeback campaign is no longer fringe — mainstream cricket media is picking it up", desc: "Ambati Rayudu's 'he's becoming an artist' quote on air is the latest mainstream voice joining what started as a fan campaign. 21 wickets, 7.46 economy, Purple Cap, match-winning six vs MI. At 35, defying age in the most physical format.", accent: "#a87eff" },
  ],
  sources: ["ESPNcricinfo","PTI / Siasat Daily","Tribune India","Business Standard","Yardbarker","CricTracker","IPLT20.com"],
};

// ─── Badge ────────────────────────────────────────────────────────────────────

type BadgeClass = "red" | "green" | "gold" | "blue" | "orange" | "neutral";

const badgeStyles: Record<BadgeClass, string> = {
  red:     "bg-[rgba(196,30,30,0.12)] text-[#C41E1E] border border-[rgba(196,30,30,0.2)]",
  green:   "bg-[rgba(43,221,140,0.12)] text-[#2bdd8c] border border-[rgba(43,221,140,0.2)]",
  gold:    "bg-[rgba(255,216,74,0.12)] text-[#FFD84A] border border-[rgba(255,216,74,0.2)]",
  blue:    "bg-[rgba(74,158,255,0.12)] text-[#4a9eff] border border-[rgba(74,158,255,0.2)]",
  orange:  "bg-[rgba(255,107,43,0.12)] text-[#ff6b2b] border border-[rgba(255,107,43,0.2)]",
  neutral: "bg-[rgba(255,255,255,0.06)] text-[#8888a2] border border-[rgba(255,255,255,0.07)]",
};

function Badge({ label, cls }: { label: string; cls: BadgeClass }) {
  return (
    <span className={`font-mono text-[9px] md:text-[9px] tracking-[0.07em] uppercase px-2 py-[2px] rounded-[10px] font-medium whitespace-nowrap ${badgeStyles[cls]}`}>
      {label}
    </span>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-2 md:gap-3 mb-3 mt-5 md:mt-7">
      <h2 className="font-['Bebas_Neue'] text-lg md:text-xl tracking-[0.05em] whitespace-nowrap text-[#eeedf0]">{title}</h2>
      <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)] min-w-[30px]" />
      {sub && <span className="font-mono text-[9px] md:text-[10px] text-[#50506a] tracking-[0.1em] uppercase whitespace-nowrap">{sub}</span>}
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#101016] border border-[rgba(255,255,255,0.07)] rounded-xl p-4 md:p-[18px] relative overflow-hidden ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.13)] to-transparent" />
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[9px] md:text-[10px] tracking-[0.12em] uppercase text-[#50506a] mb-3">
      {children}
      <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function IPLPulse() {
  return (
    <div className="bg-[#09090e] min-h-screen mt-10 text-[#eeedf0] font-['DM_Sans',sans-serif] text-sm leading-relaxed">
        <Link href="/MainModules/HomePage" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white -mb-4 lg:mb-4 pt-4 ml-4 transition cursor-pointer">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>
      </Link>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .live-pip::before { content:''; display:inline-block; width:6px; height:6px; border-radius:50%; background:#2bdd8c; margin-right:5px; animation:blink 1.8s ease infinite; vertical-align:middle; }
        
        /* Mobile responsive table container */
        .table-container {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin: 0 -4px;
          padding: 0 4px;
        }
        
        /* Responsive search tags */
        .search-tags-container {
          gap: 6px;
        }
        
        @media (max-width: 640px) {
          .search-tags-container {
            gap: 4px;
          }
        }
        
        /* Improve touch targets on mobile */
        @media (hover: none) and (pointer: coarse) {
          a, button, [role="button"], .clickable {
            min-height: 40px;
          }
        }
      `}</style>

      <div className="w-full max-w-[1300px] mx-auto px-3 sm:px-4 md:px-6 pb-12 md:pb-16">

        {/* ── HEADER ── */}
        <div className="pt-5 md:pt-7 pb-4 md:pb-5 border-b border-[rgba(255,255,255,0.07)] flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 md:mb-6">
          <div>
            <div className="font-mono text-[9px] md:text-[10px] text-[#C41E1E] tracking-[0.16em] uppercase mb-1">SportsFan360 — Intelligence Dashboard</div>
            <h1 className="font-['Bebas_Neue'] text-[clamp(32px,8vw,52px)] leading-none tracking-[0.02em]">
              IPL 2026 <span className="text-[#C41E1E]">PULSE</span>
            </h1>
            <div className="text-[11px] md:text-xs text-[#8888a2] mt-1 flex flex-wrap gap-1 md:gap-2 items-center">
              <span>24-Hour Sentiment Report</span><span>·</span>
              <span>Tuesday, 12 May 2026</span><span>·</span>
              <span className="hidden xs:inline">DC keep playoffs alive · PBKS spiral deepens</span>
              <span className="xs:hidden">DC alive · PBKS spiral</span>
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <span className="live-pip font-mono text-[9px] md:text-[10px] text-[#2bdd8c] tracking-[0.1em] uppercase">Live Season · Match 56 Tonight</span>
            <div className="bg-[#16161e] border border-[rgba(255,255,255,0.13)] rounded-[20px] px-2.5 md:px-3 py-1.5 text-[11px] md:text-xs text-[#FFD84A] flex flex-wrap items-center gap-1.5">
              GT vs SRH tonight <span className="text-[#8888a2] text-[10px] md:text-xs">Ahmedabad · 7:30 PM · Top 2 clash</span>
            </div>
          </div>
        </div>

        {/* ── YESTERDAY'S MATCH ── */}
        <SectionHeader title="Yesterday's Match" sub="Match 55 · May 11 · Dharamshala" />
        <div className="bg-[#16161e] border border-[rgba(255,255,255,0.07)] rounded-xl px-3 sm:px-4 py-3.5 relative overflow-hidden mb-3.5">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#2561ae] to-[#4a9eff]" />
          <div className="font-mono text-[8px] md:text-[9px] text-[#50506a] uppercase tracking-[0.1em] mb-2">Match 55 · HPCA Stadium, Dharamshala · May 11</div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div>
              <div className="font-['Bebas_Neue'] text-xl sm:text-[22px] leading-none">210/5</div>
              <div className="font-mono text-[9px] md:text-[10px] text-[#50506a] uppercase">PBKS (20 ov)</div>
            </div>
            <div className="text-[10px] md:text-[11px] text-[#50506a]">lost to</div>
            <div>
              <div className="font-['Bebas_Neue'] text-xl sm:text-[22px] leading-none">216/7</div>
              <div className="font-mono text-[9px] md:text-[10px] text-[#50506a] uppercase">DC (19 ov)</div>
            </div>
            <span className="font-mono text-[9px] px-2 py-[3px] rounded-md text-[#2bdd8c] bg-[rgba(43,221,140,0.1)] border border-[rgba(43,221,140,0.2)]">
              DC won by 3 wkts — record chase
            </span>
          </div>
          <div className="text-[11px] md:text-xs text-[#8888a2] leading-relaxed">
            Priyansh Arya 56(33) set the tone. DC were 33/3 inside 5 overs, looked dead. Axar Patel&apos;s first 50 of the season (56 off 30) + David Miller&apos;s return knock (51 off 28) — a 64-run stand — turned it. Lower order sealed it with an over to spare. PBKS: 4th straight loss. No over of spin bowled by either side — only 2nd time in IPL history. Madhav Tiwari: Player of the Match (2/40 + 18* off 8).
          </div>
        </div>

        {/* ── TONIGHT ── */}
        <div className="bg-gradient-to-br from-[rgba(255,107,43,0.08)] to-[rgba(255,216,74,0.05)] border border-[rgba(255,107,43,0.2)] rounded-xl px-3 sm:px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="font-mono text-[8px] md:text-[9px] text-[#ff6b2b] uppercase tracking-[0.1em] mb-1">Tonight · Match 56 · The Big One</div>
            <div className="text-sm sm:text-base font-medium">Gujarat Titans vs Sunrisers Hyderabad</div>
            <div className="text-[10px] sm:text-xs text-[#8888a2] mt-0.5">Narendra Modi Stadium, Ahmedabad · 7:30 PM IST · Both on 14 pts · Winner goes top and nearly books playoff spot</div>
          </div>
          <div className="font-mono text-[10px] sm:text-[11px] bg-[rgba(255,107,43,0.12)] text-[#ff6b2b] border border-[rgba(255,107,43,0.25)] rounded-lg px-2.5 sm:px-3.5 py-1.5 whitespace-nowrap text-center">
            Winner goes #1 + near playoff lock
          </div>
        </div>

        {/* ── KPI ROW ── Responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {data.kpis.map((k, i) => (
            <div key={i} className="bg-[#101016] border border-[rgba(255,255,255,0.07)] rounded-xl p-4 md:p-[18px] relative overflow-hidden hover:border-[rgba(255,255,255,0.13)] transition-colors">
              <div className="font-['Bebas_Neue'] text-4xl sm:text-5xl md:text-[44px] leading-none" style={{ color: k.color }}>{k.value}</div>
              <div className="text-[11px] sm:text-xs text-[#8888a2] leading-snug mt-0.5">{k.label}</div>
              <div className="font-mono text-[9px] sm:text-[10px] text-[#50506a] mt-1">{k.sub}</div>
              <div className="absolute bottom-[-10px] right-[-10px] w-14 h-14 rounded-full opacity-[0.07]" style={{ background: k.color }} />
            </div>
          ))}
        </div>

        {/* ── QUOTES + STANDINGS ── */}
        <SectionHeader title="Analyst & Player Voice" sub="Verified · May 12" />
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3.5 mb-2">

          {/* Quotes */}
          <Card>
            <CardLabel>What they said</CardLabel>
            <div className="flex flex-col gap-2.5">
              {data.quotes.map((q, i) => {
                const accentColors: Record<BadgeClass, string> = { red: "#C41E1E", green: "#2bdd8c", gold: "#FFD84A", blue: "#4a9eff", orange: "#ff6b2b", neutral: "#50506a" };
                return (
                  <div key={i} className="border-l-2 pl-3 py-2 bg-[#16161e] rounded-r-lg hover:border-l-[#C41E1E] transition-colors" style={{ borderLeftColor: accentColors[q.badgeClass as BadgeClass] }}>
                    <p className="text-[12px] sm:text-[13px] text-[#eeedf0] leading-relaxed mb-1.5">&apos;{q.text}&apos;</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] sm:text-[11px] text-[#50506a] flex-1">{q.speaker}, {q.role}</span>
                      <Badge label={q.badge} cls={q.badgeClass as BadgeClass} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Points Table */}
          <Card>
            <CardLabel>Points table · May 12</CardLabel>
            <div className="table-container overflow-x-auto">
              <table className="w-full border-collapse min-w-[400px]">
                <thead>
                  <tr>
                    {["Team","M","W","Pts","Form"].map(h => (
                      <th key={h} className={`font-mono text-[8px] sm:text-[9px] tracking-[0.1em] uppercase text-[#50506a] pb-2 border-b border-[rgba(255,255,255,0.07)] ${h === "Team" ? "text-left pr-2" : "text-center"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.points_table.map((row) => (
                    <tr key={row.rank} className={`hover:bg-[#16161e] ${row.eliminated ? "opacity-40" : ""} ${row.playoff_zone ? "bg-[rgba(196,30,30,0.02)]" : ""}`}>
                      <td className="py-2 pr-2 border-b border-[rgba(255,255,255,0.07)]">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block w-[6px] sm:w-[7px] h-[6px] sm:h-[7px] rounded-full flex-shrink-0" style={{ background: row.color }} />
                          <span className={`text-[12px] sm:text-[13px] font-medium ${row.playoff_zone ? "text-[#2bdd8c]" : "text-[#eeedf0]"}`}>{row.team}</span>
                        </div>
                      </td>
                      <td className="py-2 text-center border-b border-[rgba(255,255,255,0.07)] text-[12px] sm:text-[13px] text-[#8888a2]">{row.played}</td>
                      <td className="py-2 text-center border-b border-[rgba(255,255,255,0.07)] text-[12px] sm:text-[13px] text-[#8888a2]">{row.won}</td>
                      <td className="py-2 text-center border-b border-[rgba(255,255,255,0.07)]">
                        <span className={`bg-[#16161e] rounded px-1.5 py-[2px] font-mono text-[10px] sm:text-[11px] font-medium ${row.eliminated ? "text-[#C41E1E]" : row.playoff_zone ? "text-[#2bdd8c]" : "text-[#8888a2]"}`}>{row.points}</span>
                      </td>
                      <td className="py-2 text-center border-b border-[rgba(255,255,255,0.07)]">
                        <div className="flex items-center justify-center gap-[2px]">
                          {row.form.map((f, fi) => (
                            <span key={fi} className={`inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-[2px] ${f === "W" ? "bg-[#2bdd8c]" : "bg-[#C41E1E]"}`} />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2.5 text-[9px] sm:text-[10px] text-[#50506a]">🟠 KL Rahul 2nd on Orange Cap · 🟣 Bhuvi 21 wkts Purple Cap leader</div>
            <div className="mt-2 px-2 py-2 bg-[rgba(255,107,43,0.08)] rounded-md border border-[rgba(255,107,43,0.2)] text-[10px] sm:text-[11px] text-[#ff6b2b]">Tonight: GT vs SRH winner goes 16 pts · near playoff certainty · loser stays on 14</div>
          </Card>
        </div>

        {/* ── SEARCH + FAN TRENDS ── */}
        <SectionHeader title="Search & Fan Trends" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-2">

          {/* Searches */}
          <Card>
            <CardLabel>Top 20 searches · May 12</CardLabel>
            <div className="flex flex-wrap gap-1.5">
              {data.top_searches.map((s) => {
                const numCls = s.heat === "hot"
                  ? "bg-[rgba(196,30,30,0.2)] text-[#C41E1E]"
                  : s.heat === "warm"
                  ? "bg-[rgba(255,216,74,0.15)] text-[#FFD84A]"
                  : "bg-[#1c1c26] text-[#50506a]";
                return (
                  <span key={s.rank} className="inline-flex items-center gap-1 bg-[#16161e] border border-[rgba(255,255,255,0.07)] rounded-[20px] px-2 sm:px-3 py-1 text-[11px] sm:text-xs text-[#eeedf0]">
                    <span className={`font-mono text-[8px] sm:text-[9px] rounded-full w-[16px] h-[16px] flex items-center justify-center flex-shrink-0 ${numCls}`}>{s.rank}</span>
                    <span className="truncate max-w-[120px] sm:max-w-none">{s.query}</span>
                  </span>
                );
              })}
            </div>
            <div className="text-[9px] sm:text-[10px] text-[#50506a] mt-2.5">Top 10 verified from ESPNcricinfo, Tribune India, Business Standard, Yardbarker, CricTracker.</div>
          </Card>

          {/* Fan Trends */}
          <Card>
            <CardLabel>Leading fan trends</CardLabel>
            {data.fan_trends.map((t, i) => (
              <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-2 py-2.5 ${i < data.fan_trends.length - 1 ? "border-b border-[rgba(255,255,255,0.07)]" : ""}`}>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <div className="font-mono text-[9px] sm:text-[10px] text-[#50506a] w-5 flex-shrink-0">{String(t.rank).padStart(2,"0")}</div>
                  <div className="text-[12px] sm:text-[13px] text-[#eeedf0] flex-1 leading-snug">{t.trend}</div>
                </div>
                <div className="ml-auto sm:ml-0">
                  <Badge label={t.badge} cls={t.badgeClass as BadgeClass} />
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* ── ADS + LANGUAGE ── */}
        <SectionHeader title="Brand Ads & Language Reach" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-2">

          {/* Ads */}
          <Card>
            <CardLabel>Tech & AI brand advertising · IPL 2026</CardLabel>
            <div className="flex flex-col gap-2">
              {data.ads.map((ad, i) => (
                <div key={i} className="bg-[#16161e] border border-[rgba(255,255,255,0.07)] rounded-[10px] p-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 gap-1">
                    <div className="text-[12px] sm:text-[13px] font-medium text-[#eeedf0]">{ad.brand}</div>
                    <Badge label={ad.tier} cls={ad.tierClass as BadgeClass} />
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#8888a2] leading-relaxed">{ad.detail}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Language + Ad Volume */}
          <Card>
            <CardLabel>Top 3 consumption languages</CardLabel>
            <div className="flex flex-col gap-3.5">
              {data.languages.map((l, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-[12px] sm:text-[13px] font-medium">{l.language}</span>
                    <span className="font-['Bebas_Neue'] text-xl sm:text-[22px] text-[#8888a2]">~{l.share_pct}%</span>
                  </div>
                  <div className="h-1 bg-[#1c1c26] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(l.share_pct / 52) * 100}%`, background: `linear-gradient(90deg,${l.color},${l.gradientTo})` }} />
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#50506a] mt-1">{l.note}</div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <CardLabel>Ad volume share</CardLabel>
              <div className="flex flex-col gap-1.5">
                {data.ad_volume.map((av, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="text-[11px] sm:text-xs text-[#8888a2] w-[80px] sm:w-[90px] flex-shrink-0">{av.label}</div>
                    <div className="flex-1 h-[5px] bg-[#1c1c26] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(av.pct / 40) * 100}%`, background: av.color }} />
                    </div>
                    <div className="font-mono text-[9px] sm:text-[10px] text-[#8888a2] w-9 text-right">~{av.pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ── MEMES + MOST LIKED ── */}
        <SectionHeader title="Memes & Most Liked" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-2">

          {/* Memes */}
          <Card>
            <CardLabel>Top 5 memes · May 12 morning</CardLabel>
            <div className="flex flex-col gap-2">
              {data.memes.map((m, i) => (
                <div key={i} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-[#16161e] rounded-[10px] border border-[rgba(255,255,255,0.07)]">
                  <div className="font-['Bebas_Neue'] text-2xl sm:text-[28px] text-[#50506a] leading-none flex-shrink-0 w-[22px] sm:w-[26px] opacity-35">{String(m.rank).padStart(2,"0")}</div>
                  <div>
                    <div className="text-[12px] sm:text-[13px] text-[#eeedf0] leading-relaxed mb-1">{m.text}</div>
                    <div className="text-[10px] sm:text-[11px] text-[#50506a]">{m.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Most Liked */}
          <Card>
            <CardLabel>Top 5 most liked posts · last 24 hrs</CardLabel>
            <div className="flex flex-col gap-2">
              {data.most_liked.map((l, i) => (
                <div key={i} className="pl-2 sm:pl-3 py-2 bg-[#16161e] rounded-r-[10px] rounded-bl-[10px] border-l-2" style={{ borderLeftColor: l.accent }}>
                  <div className="text-[12px] sm:text-[13px] text-[#eeedf0] leading-relaxed mb-1">{l.text}</div>
                  <div className="text-[10px] sm:text-[11px] text-[#50506a]">{l.meta}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── TOP 5 ARTICLES ── */}
        <SectionHeader title="Top 5 Trending Articles" sub="May 12 · Verified links" />
        <div className="flex flex-col gap-2.5 mb-2">
          {data.articles.map((a, i) => (
            <div key={i} className="bg-[#101016] border border-[rgba(255,255,255,0.07)] rounded-xl px-3 sm:px-4 py-3 sm:py-4 relative overflow-hidden hover:border-[rgba(255,255,255,0.13)] transition-colors">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.13)] to-transparent" />
              <div className="absolute left-0 top-0 bottom-0 w-[2px] sm:w-[3px]" style={{ background: a.accent }} />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1.5 pl-2">
                <div className="font-mono text-[8px] sm:text-[9px] text-[#50506a] uppercase tracking-[0.1em]">#{a.rank} · {a.source} · May 12</div>
                <Badge label={a.tag} cls={a.tagClass as BadgeClass} />
              </div>
              <div className="text-xs sm:text-sm font-medium leading-snug mb-1.5 pl-2">{a.title}</div>
              <div className="text-[11px] sm:text-xs text-[#8888a2] leading-relaxed mb-2.5 pl-2">{a.summary}</div>
              <a href={a.url} target="_blank" rel="noopener noreferrer" className="font-mono text-[9px] sm:text-[10px] tracking-[0.06em] pl-2 hover:underline break-all" style={{ color: a.linkColor }}>
                READ FULL ARTICLE → {new URL(a.url).hostname.replace("www.","")}
              </a>
            </div>
          ))}
        </div>

        {/* ── SIGNALS ── */}
        <SectionHeader title="Top 5 Signals" sub="Editorial brief · May 12" />
        <div className="flex flex-col gap-2.5 mb-2">
          {data.signals.map((s, i) => (
            <div key={i} className="bg-[#101016] border border-[rgba(255,255,255,0.07)] rounded-xl px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row gap-2 sm:gap-3.5 relative overflow-hidden hover:border-[rgba(255,255,255,0.13)] transition-colors">
              <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: s.accent }} />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.13)] to-transparent" />
              <div className="font-['Bebas_Neue'] text-4xl sm:text-[44px] leading-none text-[#50506a] opacity-20 flex-shrink-0">{s.num}</div>
              <div>
                <div className="text-xs sm:text-sm font-medium mb-1">{s.title}</div>
                <div className="text-[12px] sm:text-[13px] text-[#8888a2] leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div className="mt-8 md:mt-10 pt-4 border-t border-[rgba(255,255,255,0.07)] text-[10px] md:text-[11px] text-[#50506a] flex flex-col sm:flex-row justify-between gap-2">
          <div>Sources: {data.sources.join(" · ")} — Verified May 12, 2026</div>
          <div>SportsFan360 Intelligence · Daily Brief</div>
        </div>

      </div>
    </div>
  );
}