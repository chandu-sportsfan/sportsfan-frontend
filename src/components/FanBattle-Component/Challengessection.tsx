// "use client";

// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// // ─── Types ────────────────────────────────────────────────────────────────────

// type Level = "easy" | "medium" | "difficult";

// interface QuizQuestion {
//   questionNumber: number;
//   question: string;
//   options: string[];
//   points: number;
// }

// interface FanBattleQuiz {
//   id: string;
//   level: Level;
//   category: string;
//   questions: QuizQuestion[];
//   totalQuestions: number;
//   totalPoints: number;
//   createdAt: number;
// }

// interface GroupedLevel {
//   level: Level;
//   quizzes: FanBattleQuiz[];
//   totalQuestions: number;
//   totalPoints: number;
// }

// // ─── Level config ─────────────────────────────────────────────────────────────

// interface LevelConfig {
//   label: string;
//   color: string;
//   iconBg: string;
//   icon: React.ReactNode;
// }

// const LEVEL_CONFIG: Record<Level, LevelConfig> = {
//   easy: {
//     label: "EASY",
//     color: "#4caf82",
//     iconBg: "#1a6b4a",
//     icon: (
//       <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//         <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
//         <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2" />
//         <circle cx="12" cy="12" r="2" fill="white" />
//       </svg>
//     ),
//   },
//   medium: {
//     label: "MEDIUM",
//     color: "#c8922a",
//     iconBg: "#6b4e1a",
//     icon: (
//       <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
//         <path d="M13 2L4.09 12.96H11L10 22L20.91 11.04H14L13 2Z" />
//       </svg>
//     ),
//   },
//   difficult: {
//     label: "DIFFICULT",
//     color: "#e53935",
//     iconBg: "#6b1a2a",
//     icon: (
//       <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
//         <path d="M12 17c-2.76 0-5-2.24-5-5V5h10v7c0 2.76-2.24 5-5 5zM7 5H3v3c0 1.66 1.34 3 3 3h.17A6.02 6.02 0 007 8.27V5zM17 5v3.27A6.02 6.02 0 0017.83 11H18c1.66 0 3-1.34 3-3V5h-4zM12 19c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2zM9 21h6v1H9z" />
//       </svg>
//     ),
//   },
// };

// // ─── Icons ────────────────────────────────────────────────────────────────────

// const StarIcon = () => (
//   <svg width="11" height="11" viewBox="0 0 24 24" fill="#8a8a8a">
//     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//   </svg>
// );

// const PersonIcon = () => (
//   <svg width="11" height="11" viewBox="0 0 24 24" fill="#8a8a8a">
//     <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
//   </svg>
// );

// const ArrowIcon = () => (
//   <svg width="11" height="11" viewBox="0 0 24 24" fill="#8a8a8a">
//     <path
//       d="M4 17l6-6-6-6M12 17l6-6-6-6"
//       stroke="#8a8a8a"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       fill="none"
//     />
//   </svg>
// );

// const ChevronDownIcon = ({ open }: { open: boolean }) => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="#666"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     style={{
//       transform: open ? "rotate(180deg)" : "rotate(0deg)",
//       transition: "transform 0.2s",
//     }}
//   >
//     <polyline points="6 9 12 15 18 9" />
//   </svg>
// );

// // ─── Skeleton card ────────────────────────────────────────────────────────────

// function SkeletonCard() {
//   return (
//     <div className="w-full rounded-2xl p-4 bg-[#1a1a1a] border border-[#222222] mb-3 animate-pulse">
//       <div className="flex items-start gap-3">
//         <div className="w-11 h-11 rounded-xl bg-[#2a2a2a] flex-shrink-0" />
//         <div className="flex-1 space-y-2">
//           <div className="h-3 w-16 bg-[#2a2a2a] rounded" />
//           <div className="h-4 w-32 bg-[#2a2a2a] rounded" />
//           <div className="h-3 w-24 bg-[#2a2a2a] rounded" />
//         </div>
//       </div>
//       <div className="flex gap-6 mt-3">
//         <div className="h-8 w-14 bg-[#2a2a2a] rounded" />
//         <div className="h-8 w-14 bg-[#2a2a2a] rounded" />
//         <div className="h-8 w-14 bg-[#2a2a2a] rounded" />
//       </div>
//     </div>
//   );
// }

// // ─── Sub-quiz row (shown inside expanded level) ───────────────────────────────

// function SubQuizRow({ quiz }: { quiz: FanBattleQuiz }) {
//   const mins = Math.max(1, Math.ceil(quiz.totalQuestions * 0.5));

//   return (
//     <Link href={`/MainModules/FanBattle/TriviaQuestion?quizId=${quiz.id}`}>
//       <div className="flex items-center justify-between py-3 px-3 rounded-xl bg-[#232323] mb-2 active:bg-[#2a2a2a] transition-colors">
//         <div className="flex-1 min-w-0">
//           <p className="text-white text-[13px] font-semibold leading-tight truncate">
//             {quiz.category}
//           </p>
//           <p className="text-[#555] text-[10px] mt-0.5">
//             {quiz.totalQuestions} questions • {mins} min • up to {quiz.totalPoints} pts
//           </p>
//         </div>
//         <svg
//           width="16"
//           height="16"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="#555"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="flex-shrink-0 ml-2"
//         >
//           <polyline points="9 18 15 12 9 6" />
//         </svg>
//       </div>
//     </Link>
//   );
// }

// // ─── Grouped level card ───────────────────────────────────────────────────────

// function LevelCard({ group, index }: { group: GroupedLevel; index: number }) {
//   const cfg = LEVEL_CONFIG[group.level];
//   const isActive = index === 0;

//   const totalMins = Math.max(1, Math.ceil(group.totalQuestions * 0.5));
//   const maxPoints = group.totalPoints;
//   const pointsRange = `${Math.round(maxPoints * 0.5)}-${maxPoints}`;
//   const quizCount = group.quizzes.length;

//   return (
//     <Link href={`/MainModules/FanBattle/TriviaLevel?level=${group.level}`} className="block">
//       <div
//         className={`w-full rounded-2xl mb-3 overflow-hidden ${
//           isActive
//             ? "bg-[#1e1e1e] border border-[#2a2a2a]"
//             : "bg-[#1a1a1a] border border-[#222222]"
//         }`}
//       >
//         <div className="w-full p-4 text-left">
//           <div className="flex items-start gap-3">
//             {/* Icon */}
//             <div
//               className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
//               style={{ backgroundColor: cfg.iconBg }}
//             >
//               {cfg.icon}
//             </div>

//             {/* Info */}
//             <div className="flex-1 min-w-0">
//               <span
//                 className="text-[10px] font-bold tracking-widest uppercase mb-0.5 block"
//                 style={{ color: cfg.color }}
//               >
//                 {cfg.label}
//               </span>
//               <h3 className="text-white text-[15px] font-bold leading-tight">
//                 {quizCount} {quizCount === 1 ? "Challenge" : "Challenges"} Available
//               </h3>
//               <p className="text-[#666] text-[11px] mt-0.5">
//                 {group.totalQuestions} total questions • ~{totalMins} mins
//               </p>
//             </div>

//             {/* Arrow instead of Chevron */}
//             <div className="mt-1">
//               <ArrowIcon />
//             </div>
//           </div>

//           {/* Stats row */}
//           <div className="flex items-center mt-3 gap-4">
//             <div className="flex flex-col gap-0.5">
//               <div className="flex items-center gap-1">
//                 <StarIcon />
//                 <span className="text-[#555] text-[9px] uppercase tracking-wider">Points</span>
//               </div>
//               <span className="text-[#ccc] text-[12px] font-semibold">{pointsRange}</span>
//             </div>
//             <div className="flex flex-col gap-0.5">
//               <div className="flex items-center gap-1">
//                 <PersonIcon />
//                 <span className="text-[#555] text-[9px] uppercase tracking-wider">Questions</span>
//               </div>
//               <span className="text-[#ccc] text-[12px] font-semibold">{group.totalQuestions}</span>
//             </div>
//             <div className="flex flex-col gap-0.5">
//               <div className="flex items-center gap-1">
//                 <ArrowIcon />
//                 <span className="text-[#555] text-[9px] uppercase tracking-wider">Max Pts</span>
//               </div>
//               <span className="text-[#ccc] text-[12px] font-semibold">{maxPoints}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

// // ─── Group quizzes by level ───────────────────────────────────────────────────

// function groupByLevel(quizzes: FanBattleQuiz[]): GroupedLevel[] {
//   const order: Level[] = ["easy", "medium", "difficult"];
//   const map: Partial<Record<Level, FanBattleQuiz[]>> = {};

//   for (const quiz of quizzes) {
//     if (!map[quiz.level]) map[quiz.level] = [];
//     map[quiz.level]!.push(quiz);
//   }

//   return order
//     .filter((level) => map[level] && map[level]!.length > 0)
//     .map((level) => {
//       const levelQuizzes = map[level]!;
//       return {
//         level,
//         quizzes: levelQuizzes,
//         totalQuestions: levelQuizzes.reduce((sum, q) => sum + q.totalQuestions, 0),
//         totalPoints: levelQuizzes.reduce((sum, q) => sum + q.totalPoints, 0),
//       };
//     });
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// const ChallengesSection: React.FC = () => {
//   const [quizzes, setQuizzes] = useState<FanBattleQuiz[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         const res = await axios.get("/api/fanbattle/quiz", {
//           params: { limit: "10" },
//         });
//         setQuizzes(res.data.quizzes || []);
//       } catch {
//         setError("Failed to load challenges.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuizzes();
//   }, []);

//   const groupedLevels = groupByLevel(quizzes);

//   return (
//     <div className="w-full bg-[#121212] px-4 pb-4">
//       {/* Section title */}
//       <h2 className="text-white text-[15px] font-bold mb-3">Choose Your Challenge</h2>

//       {/* Challenge cards */}
//       {loading ? (
//         <>
//           <SkeletonCard />
//           <SkeletonCard />
//           <SkeletonCard />
//         </>
//       ) : error ? (
//         <div className="w-full rounded-2xl p-4 bg-[#1a1a1a] border border-[#3a1a1a] mb-3 text-center">
//           <p className="text-[#e53935] text-[13px]">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="text-[#9ca3af] text-[11px] mt-1 underline"
//           >
//             Try again
//           </button>
//         </div>
//       ) : groupedLevels.length === 0 ? (
//         <div className="w-full rounded-2xl p-4 bg-[#1a1a1a] border border-[#222222] mb-3 text-center">
//           <p className="text-[#666] text-[13px]">No challenges available yet.</p>
//         </div>
//       ) : (
//         groupedLevels.map((group, i) => (
//           <LevelCard key={group.level} group={group} index={i} />
//         ))
//       )}

//       {/* Daily Challenge Banner */}
//       <div className="w-full rounded-2xl bg-[#1a1a1a] border border-[#252525] p-4 flex items-center justify-between mb-5">
//         <div>
//           <p className="text-white text-[13px] font-semibold">Daily Challenge</p>
//           <p className="text-[#666] text-[11px] mt-0.5">Complete to earn 2x points</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="flex flex-col items-end">
//             <span className="text-[#4caf82] text-[11px] font-bold">+500</span>
//             <span className="text-[#555] text-[9px]">bonus pts</span>
//           </div>
//           <button className="bg-[#e91e8c] hover:bg-[#d81b80] active:bg-[#c2185b] transition-colors text-white text-[12px] font-bold px-4 py-2 rounded-xl shadow-md shadow-pink-900/30">
//             Start
//           </button>
//         </div>
//       </div>

//       {/* Recent Performance */}
//       <div className="w-full rounded-2xl bg-[#1a1a1a] border border-[#222222] p-4">
//         <h3 className="text-white text-[14px] font-bold mb-3">Your Recent Performance</h3>
//         <div className="flex flex-col gap-0">
//           {[
//             { label: "Win Rate", value: "68%", bold: false },
//             { label: "Best Streak", value: "12 wins", bold: true },
//             { label: "Total Battles", value: "47", bold: false },
//           ].map(({ label, value, bold }, i, arr) => (
//             <div
//               key={label}
//               className={`flex items-center justify-between py-3 ${
//                 i < arr.length - 1 ? "border-b border-[#252525]" : ""
//               }`}
//             >
//               <span className="text-[#666] text-[13px]">{label}</span>
//               <span className={`text-white text-[13px] ${bold ? "font-bold" : "font-medium"}`}>
//                 {value}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChallengesSection;







"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Level = "easy" | "medium" | "difficult";

interface QuizQuestion {
  questionNumber: number;
  question: string;
  options: string[];
  points: number;
}

interface FanBattleQuiz {
  id: string;
  level: Level;
  category: string;
  questions: QuizQuestion[];
  totalQuestions: number;
  totalPoints: number;
  createdAt: number;
}

interface GroupedLevel {
  level: Level;
  quizzes: FanBattleQuiz[];
  totalQuestions: number;
  totalPoints: number;
}

interface LevelConfig {
  label: string;
  color: string;
  iconBg: string;
  icon: React.ReactNode;
}

const LEVEL_CONFIG: Record<Level, LevelConfig> = {
  easy: {
    label: "EASY",
    color: "#4caf82",
    iconBg: "#1a6b4a",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="white" />
      </svg>
    ),
  },
  medium: {
    label: "MEDIUM",
    color: "#c8922a",
    iconBg: "#6b4e1a",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M13 2L4.09 12.96H11L10 22L20.91 11.04H14L13 2Z" />
      </svg>
    ),
  },
  difficult: {
    label: "DIFFICULT",
    color: "#e53935",
    iconBg: "#6b1a2a",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 17c-2.76 0-5-2.24-5-5V5h10v7c0 2.76-2.24 5-5 5zM7 5H3v3c0 1.66 1.34 3 3 3h.17A6.02 6.02 0 007 8.27V5zM17 5v3.27A6.02 6.02 0 0017.83 11H18c1.66 0 3-1.34 3-3V5h-4zM12 19c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2zM9 21h6v1H9z" />
      </svg>
    ),
  },
};

const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#8a8a8a">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const PersonIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#8a8a8a">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#8a8a8a">
    <path
      d="M4 17l6-6-6-6M12 17l6-6-6-6"
      stroke="#8a8a8a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

function SkeletonCard() {
  return (
    <div className="w-full rounded-2xl p-4 bg-[#1a1a1a] border border-[#222222] mb-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-[#2a2a2a] flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 bg-[#2a2a2a] rounded" />
          <div className="h-4 w-32 bg-[#2a2a2a] rounded" />
          <div className="h-3 w-24 bg-[#2a2a2a] rounded" />
        </div>
      </div>
      <div className="flex gap-6 mt-3">
        <div className="h-8 w-14 bg-[#2a2a2a] rounded" />
        <div className="h-8 w-14 bg-[#2a2a2a] rounded" />
        <div className="h-8 w-14 bg-[#2a2a2a] rounded" />
      </div>
    </div>
  );
}

function LevelCard({ group, index }: { group: GroupedLevel; index: number }) {
  const cfg = LEVEL_CONFIG[group.level];
  const isActive = index === 0;

  const totalMins = Math.max(1, Math.ceil(group.totalQuestions * 0.5));
  const maxPoints = group.totalPoints;
  const pointsRange = `${Math.round(maxPoints * 0.5)}-${maxPoints}`;
  const quizCount = group.quizzes.length;

  return (
    <Link
      href={`/MainModules/FanBattle/TriviaQuestion?level=${group.level}`}
      className="block"
    >
      <div
        className={`w-full rounded-2xl mb-3 overflow-hidden ${
          isActive
            ? "bg-[#1e1e1e] border border-[#2a2a2a]"
            : "bg-[#1a1a1a] border border-[#222222]"
        }`}
      >
        <div className="w-full p-4 text-left">
          <div className="flex items-start gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: cfg.iconBg }}
            >
              {cfg.icon}
            </div>

            <div className="flex-1 min-w-0">
              <span
                className="text-[10px] font-bold tracking-widest uppercase mb-0.5 block"
                style={{ color: cfg.color }}
              >
                {cfg.label}
              </span>
              <h3 className="text-white text-[15px] font-bold leading-tight">
                {quizCount} {quizCount === 1 ? "Challenge" : "Challenges"} Available
              </h3>
              <p className="text-[#666] text-[11px] mt-0.5">
                {group.totalQuestions} total questions • ~{totalMins} mins
              </p>
            </div>

            <div className="mt-1">
              <ArrowIcon />
            </div>
          </div>

          <div className="flex items-center mt-3 gap-4">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <StarIcon />
                <span className="text-[#555] text-[9px] uppercase tracking-wider">Points</span>
              </div>
              <span className="text-[#ccc] text-[12px] font-semibold">{pointsRange}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <PersonIcon />
                <span className="text-[#555] text-[9px] uppercase tracking-wider">Questions</span>
              </div>
              <span className="text-[#ccc] text-[12px] font-semibold">{group.totalQuestions}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1">
                <ArrowIcon />
                <span className="text-[#555] text-[9px] uppercase tracking-wider">Max Pts</span>
              </div>
              <span className="text-[#ccc] text-[12px] font-semibold">{maxPoints}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function groupByLevel(quizzes: FanBattleQuiz[]): GroupedLevel[] {
  const order: Level[] = ["easy", "medium", "difficult"];
  const map: Partial<Record<Level, FanBattleQuiz[]>> = {};

  for (const quiz of quizzes) {
    if (!map[quiz.level]) map[quiz.level] = [];
    map[quiz.level]!.push(quiz);
  }

  return order
    .filter((level) => map[level] && map[level]!.length > 0)
    .map((level) => {
      const levelQuizzes = map[level]!;
      return {
        level,
        quizzes: levelQuizzes,
        totalQuestions: levelQuizzes.reduce((sum, q) => sum + q.totalQuestions, 0),
        totalPoints: levelQuizzes.reduce((sum, q) => sum + q.totalPoints, 0),
      };
    });
}

const ChallengesSection: React.FC = () => {
  const [quizzes, setQuizzes] = useState<FanBattleQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("/api/fanbattle/quiz", {
          params: { limit: "50" },
        });
        setQuizzes(res.data.quizzes || []);
      } catch {
        setError("Failed to load challenges.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const groupedLevels = groupByLevel(quizzes);

  return (
    <div className="w-full bg-[#121212] px-4 pb-4">
      <h2 className="text-white text-[15px] font-bold mb-3">Choose Your Challenge</h2>

      {loading ? (
        <>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </>
      ) : error ? (
        <div className="w-full rounded-2xl p-4 bg-[#1a1a1a] border border-[#3a1a1a] mb-3 text-center">
          <p className="text-[#e53935] text-[13px]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-[#9ca3af] text-[11px] mt-1 underline"
          >
            Try again
          </button>
        </div>
      ) : groupedLevels.length === 0 ? (
        <div className="w-full rounded-2xl p-4 bg-[#1a1a1a] border border-[#222222] mb-3 text-center">
          <p className="text-[#666] text-[13px]">No challenges available yet.</p>
        </div>
      ) : (
        groupedLevels.map((group, i) => (
          <LevelCard key={group.level} group={group} index={i} />
        ))
      )}

      {/* Daily Challenge Banner */}
      <div className="w-full rounded-2xl bg-[#1a1a1a] border border-[#252525] p-4 flex items-center justify-between mb-5">
        <div>
          <p className="text-white text-[13px] font-semibold">Daily Challenge</p>
          <p className="text-[#666] text-[11px] mt-0.5">Complete to earn 2x points</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-[#4caf82] text-[11px] font-bold">+500</span>
            <span className="text-[#555] text-[9px]">bonus pts</span>
          </div>
          <button className="bg-[#e91e8c] hover:bg-[#d81b80] active:bg-[#c2185b] transition-colors text-white text-[12px] font-bold px-4 py-2 rounded-xl shadow-md shadow-pink-900/30">
            Start
          </button>
        </div>
      </div>

      {/* Recent Performance */}
      <div className="w-full rounded-2xl bg-[#1a1a1a] border border-[#222222] p-4">
        <h3 className="text-white text-[14px] font-bold mb-3">Your Recent Performance</h3>
        <div className="flex flex-col gap-0">
          {[
            { label: "Win Rate", value: "68%", bold: false },
            { label: "Best Streak", value: "12 wins", bold: true },
            { label: "Total Battles", value: "47", bold: false },
          ].map(({ label, value, bold }, i, arr) => (
            <div
              key={label}
              className={`flex items-center justify-between py-3 ${
                i < arr.length - 1 ? "border-b border-[#252525]" : ""
              }`}
            >
              <span className="text-[#666] text-[13px]">{label}</span>
              <span className={`text-white text-[13px] ${bold ? "font-bold" : "font-medium"}`}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChallengesSection;