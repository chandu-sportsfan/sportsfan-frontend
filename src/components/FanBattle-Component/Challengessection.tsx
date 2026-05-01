"use client";

import Link from "next/link";
import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Challenge {
    difficulty: "EASY" | "MEDIUM" | "DIFFICULT";
    title: string;
    questions: number;
    mins: number;
    points: string;
    playing: string;
    passRate: string;
    icon: React.ReactNode;
    iconBg: string;
    difficultyColor: string;
    active?: boolean;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const TargetIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
);

const BoltIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M13 2L4.09 12.96H11L10 22L20.91 11.04H14L13 2Z" />
    </svg>
);

const TrophyIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
        <path d="M12 17c-2.76 0-5-2.24-5-5V5h10v7c0 2.76-2.24 5-5 5zM7 5H3v3c0 1.66 1.34 3 3 3h.17A6.02 6.02 0 007 8.27V5zM17 5v3.27A6.02 6.02 0 0017.83 11H18c1.66 0 3-1.34 3-3V5h-4zM12 19c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2zM9 21h6v1H9z" />
    </svg>
);

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
        <path d="M4 17l6-6-6-6M12 17l6-6-6-6" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

// ─── Challenge Card ───────────────────────────────────────────────────────────
const ChallengeCard: React.FC<Challenge> = ({
    difficulty,
    title,
    questions,
    mins,
    points,
    playing,
    passRate,
    icon,
    iconBg,
    difficultyColor,
    active,
}) => (
<>
<Link href="/MainModules/FanBattle/TriviaQuestion">
    <div
        className={`w-full rounded-2xl p-4 ${active
                ? "bg-[#1e1e1e] border border-[#2a2a2a]"
                : "bg-[#1a1a1a] border border-[#222222]"
            } mb-3`}
       >
        <div className="flex items-start gap-3">
            {/* Icon */}
            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: iconBg }}
            >
                {icon}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <span
                    className="text-[10px] font-bold tracking-widest uppercase mb-0.5 block"
                    style={{ color: difficultyColor }}
                >
                    {difficulty}
                </span>
                <h3 className="text-white text-[15px] font-bold leading-tight">
                    {title}
                </h3>
                <p className="text-[#666] text-[11px] mt-0.5">
                    {questions} questions • {mins} mins
                </p>
            </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center mt-3 gap-4">
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                    <StarIcon />
                    <span className="text-[#555] text-[9px] uppercase tracking-wider">
                        Points
                    </span>
                </div>
                <span className="text-[#ccc] text-[12px] font-semibold">{points}</span>
            </div>

            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                    <PersonIcon />
                    <span className="text-[#555] text-[9px] uppercase tracking-wider">
                        Playing
                    </span>
                </div>
                <span className="text-[#ccc] text-[12px] font-semibold">{playing}</span>
            </div>

            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1">
                    <ArrowIcon />
                    <span className="text-[#555] text-[9px] uppercase tracking-wider">
                        Pass Rate
                    </span>
                </div>
                <span className="text-[#ccc] text-[12px] font-semibold">{passRate}</span>
            </div>
        </div>
    </div>
    </Link>
    </>
);

// ─── Main Component 
const ChallengesSection: React.FC = () => {
    const challenges: Challenge[] = [
        {
            difficulty: "EASY",
            title: "Rookie Challenge",
            questions: 10,
            mins: 3,
            points: "50-100",
            playing: "2.3k",
            passRate: "60%",
            icon: <TargetIcon />,
            iconBg: "#1a6b4a",
            difficultyColor: "#4caf82",
            active: true,
        },
        {
            difficulty: "MEDIUM",
            title: "Pro Fan Arena",
            questions: 15,
            mins: 8,
            points: "150-300",
            playing: "1.8k",
            passRate: "70%",
            icon: <BoltIcon />,
            iconBg: "#6b4e1a",
            difficultyColor: "#c8922a",
        },
        {
            difficulty: "DIFFICULT",
            title: "Elite Legend Battle",
            questions: 20,
            mins: 12,
            points: "400-750",
            playing: "892",
            passRate: "80%",
            icon: <TrophyIcon />,
            iconBg: "#6b1a2a",
            difficultyColor: "#e53935",
        },
    ];

    return (
        <div className="w-full bg-[#121212] px-4 pb-4">
            {/* Section Title */}
            <h2 className="text-white text-[15px] font-bold mb-3">
                Choose Your Challenge
            </h2>

            {/* Challenge Cards */}
            {challenges.map((c) => (
                <ChallengeCard key={c.title} {...c} />
            ))}

            {/* Daily Challenge Banner */}
            <div className="w-full rounded-2xl bg-[#1a1a1a] border border-[#252525] p-4 flex items-center justify-between mb-5">
                <div>
                    <p className="text-white text-[13px] font-semibold">
                        Daily Challenge
                    </p>
                    <p className="text-[#666] text-[11px] mt-0.5">
                        Complete to earn 2x points
                    </p>
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
                <h3 className="text-white text-[14px] font-bold mb-3">
                    Your Recent Performance
                </h3>
                <div className="flex flex-col gap-0">
                    {[
                        { label: "Win Rate", value: "68%", bold: false },
                        { label: "Best Streak", value: "12 wins", bold: true },
                        { label: "Total Battles", value: "47", bold: false },
                    ].map(({ label, value, bold }, i, arr) => (
                        <div
                            key={label}
                            className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? "border-b border-[#252525]" : ""
                                }`}
                        >
                            <span className="text-[#666] text-[13px]">{label}</span>
                            <span
                                className={`text-white text-[13px] ${bold ? "font-bold" : "font-medium"
                                    }`}
                            >
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