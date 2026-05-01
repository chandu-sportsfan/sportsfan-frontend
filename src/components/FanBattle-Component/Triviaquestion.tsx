"use client";

import Link from "next/link";
import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type AnswerState = "idle" | "correct" | "incorrect";

interface Option {
    id: string;
    label: string;
}

interface TriviaQuestionProps {
    questionNumber?: number;
    totalQuestions?: number;
    question?: string;
    options?: Option[];
    correctOptionId?: string;
    explanation?: string;
    onNext?: () => void;
}

// ─── Option Button ────────────────────────────────────────────────────────────
interface OptionButtonProps {
    option: Option;
    selected: boolean;
    isCorrect: boolean;
    answerState: AnswerState;
    onSelect: (id: string) => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({
    option,
    selected,
    isCorrect,
    answerState,
    onSelect,
}) => {
    const isAnswered = answerState !== "idle";

    // Determine visual state
    const isSelectedCorrect = selected && isCorrect;
    const isSelectedIncorrect = selected && !isCorrect;
    const isCorrectUnselected = !selected && isCorrect && isAnswered;

    const getBorderAndBg = () => {
        if (!isAnswered) {
            return "border border-[#2a2f3a] bg-[#151b26] hover:border-[#3a4150] hover:bg-[#1a2030] active:bg-[#1e2535]";
        }
        if (isSelectedCorrect) {
            return "border border-[#00c853] bg-[#0d2b1a]";
        }
        if (isSelectedIncorrect) {
            return "border border-[#e53935] bg-[#2b0d0d]";
        }
        if (isCorrectUnselected) {
            // show correct answer subtly when user got it wrong
            return "border border-[#2a2f3a] bg-[#151b26]";
        }
        return "border border-[#2a2f3a] bg-[#151b26]";
    };

    const getLabelColor = () => {
        if (!isAnswered) return "text-white";
        if (isSelectedCorrect) return "text-[#00e676]";
        if (isSelectedIncorrect) return "text-[#ef5350]";
        return "text-[#6b7280]";
    };

    return (
        <button
            onClick={() => !isAnswered && onSelect(option.id)}
            disabled={isAnswered}
            className={`w-full flex items-center justify-between px-4 py-[14px] rounded-xl transition-all duration-200 ${getBorderAndBg()} cursor-pointer disabled:cursor-default`}
        >
            <span className={`text-[14px] sm:text-[15px] font-medium ${getLabelColor()}`}>
                {option.label}
            </span>

            {/* Icon */}
            {isAnswered && (
                <span className="flex-shrink-0 ml-2">
                    {isSelectedCorrect && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="11" stroke="#00c853" strokeWidth="1.5" />
                            <path
                                d="M7 12.5l3.5 3.5 6.5-7"
                                stroke="#00c853"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                    {isSelectedIncorrect && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="11" stroke="#e53935" strokeWidth="1.5" />
                            <path
                                d="M8.5 8.5l7 7M15.5 8.5l-7 7"
                                stroke="#e53935"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </span>
            )}
        </button>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const TriviaQuestion: React.FC<TriviaQuestionProps> = ({
    questionNumber = 1,
    totalQuestions = 10,
    question = "Who was India's first Test captain?",
    options = [
        { id: "a", label: "CK Nayudu" },
        { id: "b", label: "Kapil Dev" },
        { id: "c", label: "Gavaskar" },
        { id: "d", label: "Azharuddin" },
    ],
    correctOptionId = "a",
    explanation = "CK Nayudu captained India in their first Test match in 1932.",
    onNext,
}) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const answerState: AnswerState =
        selectedId === null
            ? "idle"
            : selectedId === correctOptionId
                ? "correct"
                : "incorrect";

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };

    const handleNext = () => {
        setSelectedId(null);
        onNext?.();
    };

    // Progress bar fill (just for Q1/10 demo = 0%)
    const progressPct = ((questionNumber - 1) / totalQuestions) * 100;

    return (
        <div className="w-full mt-20 max-w-sm sm:max-w-md mx-auto bg-[#0f1520] rounded-2xl overflow-hidden">
            {/* ── Header ── */}
            <div className="px-4 pt-4 pb-3 bg-[#0f1520]">
                {/* Nav row */}
                <div className="flex items-center gap-2 mb-3">
                    <Link href="/MainModules/FanBattle">
                        <button className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-[#1e2535] transition-colors">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#ffffff"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        </Link>

                        <div>
                            <p className="text-white text-[13px] font-semibold leading-tight">
                                SportsFan360 Trivia
                            </p>
                            <p className="text-[#6b7280] text-[11px]">Challenge</p>
                        </div>
                </div>

                {/* Question label */}
                <h2 className="text-white text-[22px] sm:text-[26px] font-bold leading-tight mb-1">
                    Question {questionNumber} / {totalQuestions}
                </h2>
                <p className="text-[#9ca3af] text-[13px] sm:text-[14px] mb-3">
                    {question}
                </p>

                {/* Progress bar */}
                <div className="w-full h-[3px] bg-[#1e2535] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#e91e8c] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(progressPct, 2)}%` }}
                    />
                </div>
            </div>

            {/* ── Options ── */}
            <div className="px-4 pt-2 pb-3 flex flex-col gap-2.5">
                {options.map((opt) => (
                    <OptionButton
                        key={opt.id}
                        option={opt}
                        selected={selectedId === opt.id}
                        isCorrect={opt.id === correctOptionId}
                        answerState={answerState}
                        onSelect={handleSelect}
                    />
                ))}
            </div>

            {/* ── Feedback Banner ── */}
            {answerState !== "idle" && (
                <div
                    className={`mx-4 mb-3 px-4 py-3 rounded-xl flex items-start gap-2.5 transition-all duration-300 ${answerState === "correct"
                            ? "bg-[#0d2b1a] border border-[#1a4a2a]"
                            : "bg-[#2b0d0d] border border-[#4a1a1a]"
                        }`}
                >
                    {answerState === "correct" ? (
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="flex-shrink-0 mt-0.5"
                        >
                            <path
                                d="M5 13l4 4L19 7"
                                stroke="#00c853"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    ) : (
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="flex-shrink-0 mt-0.5"
                        >
                            <circle cx="12" cy="12" r="10" stroke="#e53935" strokeWidth="2" />
                            <path
                                d="M8.5 8.5l7 7M15.5 8.5l-7 7"
                                stroke="#e53935"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                    <div>
                        <p
                            className={`text-[13px] font-bold mb-0.5 ${answerState === "correct" ? "text-[#00c853]" : "text-[#ef5350]"
                                }`}
                        >
                            {answerState === "correct" ? "Correct!" : "Incorrect"}
                        </p>
                        <p className="text-[#9ca3af] text-[12px] leading-relaxed">
                            {explanation}
                        </p>
                    </div>
                </div>
            )}

            {/* ── Next Button ── */}
            {answerState !== "idle" && (
                <div className="px-4 pb-5">
                    <button
                        onClick={handleNext}
                        className="w-full flex items-center justify-center gap-2 py-[15px] rounded-2xl font-bold text-[15px] text-white bg-gradient-to-r from-[#e91e8c] to-[#ff6b35] hover:opacity-90 active:opacity-80 transition-opacity shadow-lg shadow-pink-900/30"
                    >
                        Next Question
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default TriviaQuestion;