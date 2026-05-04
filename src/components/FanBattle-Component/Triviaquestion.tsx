"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type AnswerState = "idle" | "correct" | "incorrect";

interface QuizQuestion {
  questionNumber: number;
  question: string;
  options: string[];
  points: number;
}

interface FanBattleQuiz {
  id: string;
  level: string;
  category: string;
  questions: QuizQuestion[];
  totalQuestions: number;
  totalPoints: number;
}

interface SessionSummary {
  id: string;
  status: "in_progress" | "completed";
  totalPointsEarned: number;
  correctCount: number;
  incorrectCount: number;
  answeredCount: number;
  totalQuestions: number;
  completedAt: number | null;
}

// ─── Option Button ────────────────────────────────────────────────────────────

interface OptionButtonProps {
  label: string;
  selected: boolean;
  isCorrect: boolean;
  answerState: AnswerState;
  onSelect: () => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  label,
  selected,
  isCorrect,
  answerState,
  onSelect,
}) => {
  const isAnswered = answerState !== "idle";
  const isSelectedCorrect = selected && isCorrect;
  const isSelectedIncorrect = selected && !isCorrect;
  const isUnselectedCorrect = !selected && isCorrect && isAnswered;

  const getBorderAndBg = () => {
    if (!isAnswered)
      return "border border-[#2a2f3a] bg-[#151b26] hover:border-[#3a4150] hover:bg-[#1a2030] active:bg-[#1e2535]";
    if (isUnselectedCorrect) return "border border-[#00c853] bg-[#0a2016]";
    if (isSelectedCorrect) return "border border-[#00c853] bg-[#0d2b1a]";
    if (isSelectedIncorrect) return "border border-[#e53935] bg-[#2b0d0d]";
    return "border border-[#2a2f3a] bg-[#151b26]";
  };

  const getLabelColor = () => {
    if (!isAnswered) return "text-white";
    if (isUnselectedCorrect) return "text-[#00e676]";
    if (isSelectedCorrect) return "text-[#00e676]";
    if (isSelectedIncorrect) return "text-[#ef5350]";
    return "text-[#6b7280]";
  };

  return (
    <button
      onClick={() => !isAnswered && onSelect()}
      disabled={isAnswered}
      className={`w-full flex items-center justify-between px-4 py-[14px] rounded-xl transition-all duration-200 ${getBorderAndBg()} cursor-pointer disabled:cursor-default`}
    >
      <span
        className={`text-[14px] sm:text-[15px] font-medium ${getLabelColor()}`}
      >
        {label}
      </span>

      {isAnswered &&
        (isSelectedCorrect || isSelectedIncorrect || isUnselectedCorrect) && (
          <span className="flex-shrink-0 ml-2">
            {(isSelectedCorrect || isUnselectedCorrect) && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="11"
                  stroke="#00c853"
                  strokeWidth="1.5"
                />
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
                <circle
                  cx="12"
                  cy="12"
                  r="11"
                  stroke="#e53935"
                  strokeWidth="1.5"
                />
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

// ─── Already Played Screen ────────────────────────────────────────────────────

function AlreadyPlayedScreen({
  session,
  quiz,
}: {
  session: SessionSummary;
  quiz: FanBattleQuiz;
}) {
  const router = useRouter();
  const pct = Math.round((session.correctCount / session.totalQuestions) * 100);

  return (
    <div className="w-full mt-20 max-w-sm sm:max-w-md mx-auto bg-[#0f1520] rounded-2xl overflow-hidden px-4 py-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 bg-[#1a1a2e] border border-[#2a2a4a]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="1.5" />
            <path
              d="M12 7v5l3 3"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-white text-[20px] font-bold">Already Played!</h2>
        <p className="text-[#9ca3af] text-[13px] mt-1">
          You have already completed this quiz.
        </p>
        <p className="text-[#6b7280] text-[12px] mt-0.5">
          {quiz.category} · {quiz.level}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            label: "Points",
            value: session.totalPointsEarned,
            color: "#4caf82",
          },
          { label: "Correct", value: session.correctCount, color: "#00c853" },
          {
            label: "Score",
            value: `${pct}%`,
            color: pct >= 60 ? "#4caf82" : "#e53935",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-[#1a1a1a] rounded-xl p-3 text-center border border-[#222222]"
          >
            <p className="text-[11px] text-[#666] uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className="font-bold text-[18px]" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[#1a1a1a] border border-[#222222] rounded-xl p-4 mb-5">
        {[
          { label: "Questions answered", value: session.answeredCount },
          { label: "Correct", value: session.correctCount },
          { label: "Incorrect", value: session.incorrectCount },
          {
            label: "Points earned",
            value: `${session.totalPointsEarned} / ${quiz.totalPoints}`,
          },
        ].map(({ label, value }, i, arr) => (
          <div
            key={label}
            className={`flex justify-between py-2.5 ${
              i < arr.length - 1 ? "border-b border-[#252525]" : ""
            }`}
          >
            <span className="text-[#666] text-[13px]">{label}</span>
            <span className="text-white text-[13px] font-medium">{value}</span>
          </div>
        ))}
      </div>

      <p className="text-center text-[12px] text-[#555] mb-4">
        Each quiz can only be played once. Check back for new challenges!
      </p>

      <button
        onClick={() => router.push("/MainModules/FanBattle")}
        className="w-full py-3 rounded-2xl font-bold text-[14px] text-white bg-gradient-to-r from-[#e91e8c] to-[#ff6b35] hover:opacity-90 transition-opacity"
      >
        Back to Fan Battle
      </button>
    </div>
  );
}

// ─── Results screen ───────────────────────────────────────────────────────────

function ResultsScreen({
  session,
  quiz,
}: {
  session: SessionSummary;
  quiz: FanBattleQuiz;
}) {
  const router = useRouter();
  const pct = Math.round((session.correctCount / session.totalQuestions) * 100);

  return (
    <div className="w-full mt-20 max-w-sm sm:max-w-md mx-auto bg-[#0f1520] rounded-2xl overflow-hidden px-4 py-6">
      <div className="text-center mb-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ background: pct >= 60 ? "#0d2b1a" : "#2b0d0d" }}
        >
          {pct >= 60 ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#00c853"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M12 17c-2.76 0-5-2.24-5-5V5h10v7c0 2.76-2.24 5-5 5zM9 21h6v1H9z" />
            </svg>
          )}
        </div>
        <h2 className="text-white text-[22px] font-bold">
          {pct >= 80
            ? "Outstanding!"
            : pct >= 60
            ? "Well done!"
            : "Keep practicing!"}
        </h2>
        <p className="text-[#9ca3af] text-[13px] mt-1">
          {quiz.category} · {quiz.level}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            label: "Points",
            value: session.totalPointsEarned,
            color: "#4caf82",
          },
          { label: "Correct", value: session.correctCount, color: "#00c853" },
          {
            label: "Score",
            value: `${pct}%`,
            color: pct >= 60 ? "#4caf82" : "#e53935",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-[#1a1a1a] rounded-xl p-3 text-center border border-[#222222]"
          >
            <p className="text-[11px] text-[#666] uppercase tracking-wider mb-1">
              {label}
            </p>
            <p className="font-bold text-[18px]" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[#1a1a1a] border border-[#222222] rounded-xl p-4 mb-5">
        {[
          { label: "Questions answered", value: session.answeredCount },
          { label: "Correct", value: session.correctCount },
          { label: "Incorrect", value: session.incorrectCount },
          {
            label: "Points earned",
            value: `${session.totalPointsEarned} / ${quiz.totalPoints}`,
          },
        ].map(({ label, value }, i, arr) => (
          <div
            key={label}
            className={`flex justify-between py-2.5 ${
              i < arr.length - 1 ? "border-b border-[#252525]" : ""
            }`}
          >
            <span className="text-[#666] text-[13px]">{label}</span>
            <span className="text-white text-[13px] font-medium">{value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/MainModules/FanBattle")}
        className="w-full py-3 rounded-2xl font-bold text-[14px] text-white bg-gradient-to-r from-[#e91e8c] to-[#ff6b35] hover:opacity-90 transition-opacity"
      >
        Back to Fan Battle
      </button>
    </div>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="w-full mt-20 max-w-sm sm:max-w-md mx-auto bg-[#0f1520] rounded-2xl overflow-hidden animate-pulse">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full bg-[#1e2535]" />
          <div className="h-4 w-32 bg-[#1e2535] rounded" />
        </div>
        <div className="h-7 w-48 bg-[#1e2535] rounded mb-2" />
        <div className="h-4 w-full bg-[#1e2535] rounded mb-3" />
        <div className="h-1 w-full bg-[#1e2535] rounded" />
      </div>
      <div className="px-4 pt-2 pb-3 flex flex-col gap-2.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 w-full bg-[#1e2535] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ─── Main TriviaQuestion component ───────────────────────────────────────────

const TriviaQuestion: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const quizId = searchParams.get("quizId");

  // ── Auth ─────────────────────────────────────────────────────────────────
  const { user, getUserName } = useAuth();
  const userId = user?.userId ?? null;
  const userName = getUserName?.() ?? "";
  const userEmail = user?.email ?? "";
//   const userAvatar = user?.userAvatar ?? "";

  const [quiz, setQuiz] = useState<FanBattleQuiz | null>(null);
  const [fetchError, setFetchError] = useState("");

  // ── Session state — loaded from DB on mount ───────────────────────────────
  const [sessionCheckLoading, setSessionCheckLoading] = useState(true);
  const [existingCompletedSession, setExistingCompletedSession] =
    useState<SessionSummary | null>(null); // quiz already fully played

  const [currentIndex, setCurrentIndex] = useState(0);

  // Answer state for current question
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [correctAnswerOption, setCorrectAnswerOption] = useState<string | null>(
    null
  );
  const [explanation, setExplanation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Protection against double-submit
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const isSubmittingRef = useRef(false);

  // Active session tracking (in-progress)
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<SessionSummary | null>(null);
  const [showResults, setShowResults] = useState(false);

  // ── Prevent browser back button after answering ───────────────────────────
  useEffect(() => {
    if (answerState !== "idle") {
      window.history.pushState(null, "", window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, "", window.location.href);
      };
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [answerState]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      isSubmittingRef.current = false;
    };
  }, []);

  // ── Fetch quiz ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!quizId) {
      setFetchError("No quiz selected. Please go back and pick a challenge.");
      return;
    }
    const loadQuiz = async () => {
      try {
        const res = await axios.get(`/api/fanbattle/quiz/${quizId}`);
        setQuiz(res.data.data);
      } catch {
        setFetchError("Failed to load the quiz. Please try again.");
      }
    };
    loadQuiz();
  }, [quizId]);

  // ── Check DB for an existing session for this user+quiz ───────────────────
  // This is the single source of truth — no localStorage needed.
  // Assumes your API supports GET /api/fanbattle/session?quizId=X&userId=Y
  // and returns { data: SessionSummary | null }
  useEffect(() => {
    if (!quizId || !userId) {
      setSessionCheckLoading(false);
      return;
    }
    const checkExistingSession = async () => {
      try {
        const res = await axios.get(`/api/fanbattle/session`, {
          params: { quizId, userId },
        });
        const existingSession: SessionSummary | null =
          res.data?.data ?? null;

        if (existingSession && existingSession.status === "completed") {
          // User has fully completed this quiz before — block replay
          setExistingCompletedSession(existingSession);
        } else if (existingSession && existingSession.status === "in_progress") {
          // Resume in-progress session: jump to where they left off
          setSessionId(existingSession.id);
          setSession(existingSession);
          setCurrentIndex(existingSession.answeredCount); // resume at next unanswered question
        }
        // null → fresh start, do nothing
      } catch {
        // If session check fails, allow play (fail open)
        console.warn("Could not check existing session, proceeding fresh.");
      } finally {
        setSessionCheckLoading(false);
      }
    };
    checkExistingSession();
  }, [quizId, userId]);

  // ── Submit answer ─────────────────────────────────────────────────────────
  const handleSelect = async (answer: string) => {
    if (
      answerState !== "idle" ||
      submitting ||
      hasAnsweredCurrent ||
      !quiz ||
      !userId
    ) {
      return;
    }
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setHasAnsweredCurrent(true);
    setSelectedAnswer(answer);
    setSubmitting(true);

    const currentQuestion = quiz.questions[currentIndex];

    try {
      const res = await axios.post("/api/fanbattle/response", {
        quizId: quiz.id,
        questionNumber: currentQuestion.questionNumber,
        selectedAnswer: answer,
        userId,
        userName,
        userEmail,
        // userAvatar,
        ...(sessionId ? { sessionId } : {}),
      });

      const { response, session: updatedSession } = res.data.data;

      if (!sessionId) setSessionId(updatedSession.id);
      setSession(updatedSession);

      const isCorrect = response.isCorrect;
      setAnswerState(isCorrect ? "correct" : "incorrect");

      const resolvedCorrect =
        quiz.questions[currentIndex].options.find(
          (o) => o === response.correctAnswer
        ) ?? response.correctAnswer;
      setCorrectAnswerOption(resolvedCorrect);

      setExplanation(
        isCorrect
          ? `Correct! The answer is "${answer}".`
          : `Incorrect. The correct answer is "${resolvedCorrect}".`
      );
    } catch (e: unknown) {
      console.error("Submit error:", e);
      // Rollback on error
      setHasAnsweredCurrent(false);
      setAnswerState("idle");
      setExplanation("");
      setSelectedAnswer(null);
      setCorrectAnswerOption(null);
    } finally {
      setSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  // ── Next question ─────────────────────────────────────────────────────────
  const handleNext = () => {
    if (!quiz) return;

    if (
      session?.status === "completed" ||
      currentIndex >= quiz.totalQuestions - 1
    ) {
      setShowResults(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setAnswerState("idle");
    setCorrectAnswerOption(null);
    setExplanation("");
    setHasAnsweredCurrent(false);
    isSubmittingRef.current = false;
  };

  // ── Guards ────────────────────────────────────────────────────────────────

  // Not logged in
  if (!userId && !sessionCheckLoading) {
    return (
      <div className="w-full mt-20 max-w-sm sm:max-w-md mx-auto bg-[#0f1520] rounded-2xl p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-[#1a1a2e] border border-[#2a2a4a] flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
              stroke="#9ca3af"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="7"
              r="4"
              stroke="#9ca3af"
              strokeWidth="1.8"
            />
          </svg>
        </div>
        <p className="text-white text-[16px] font-bold mb-1">
          Login Required
        </p>
        <p className="text-[#9ca3af] text-[13px] mb-5">
          Please log in to play Fan Battle.
        </p>
        <Link href="/login">
          <button className="w-full py-3 rounded-2xl font-bold text-[14px] text-white bg-gradient-to-r from-[#e91e8c] to-[#ff6b35] hover:opacity-90 transition-opacity">
            Go to Login
          </button>
        </Link>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="w-full mt-20 max-w-sm sm:max-w-md mx-auto bg-[#0f1520] rounded-2xl p-6 text-center">
        <p className="text-[#ef5350] text-[14px] mb-4">{fetchError}</p>
        <Link href="/MainModules/FanBattle">
          <button className="text-[#9ca3af] text-[13px] underline">
            Go back
          </button>
        </Link>
      </div>
    );
  }

  // Still loading quiz or session check
  if (!quiz || sessionCheckLoading) return <LoadingScreen />;

  // User already completed this quiz → show their previous results, no replay
  if (existingCompletedSession) {
    return (
      <AlreadyPlayedScreen session={existingCompletedSession} quiz={quiz} />
    );
  }

  // Just finished this session → show results
  if (showResults && session) {
    return <ResultsScreen session={session} quiz={quiz} />;
  }

  const currentQuestion = quiz.questions[currentIndex];
  const progressPct =
    ((currentIndex + (answerState !== "idle" ? 1 : 0)) / quiz.totalQuestions) *
    100;

  return (
    <div className="w-full mt-20 max-w-sm sm:max-w-md mx-auto bg-[#0f1520] rounded-2xl overflow-hidden">
      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 bg-[#0f1520]">
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
              {quiz.category} Trivia
            </p>
            <p className="text-[#6b7280] text-[11px] capitalize">
              {quiz.level} · Challenge
            </p>
          </div>

          {session && (
            <div className="ml-auto flex items-center gap-1.5 bg-[#1e2535] px-2.5 py-1 rounded-full">
              <span className="text-[#4caf82] text-[11px] font-bold">
                {session.totalPointsEarned}
              </span>
              <span className="text-[#555] text-[9px]">pts</span>
            </div>
          )}
        </div>

        <h2 className="text-white text-[22px] sm:text-[26px] font-bold leading-tight mb-1">
          Question {currentIndex + 1} / {quiz.totalQuestions}
        </h2>
        <p className="text-[#9ca3af] text-[13px] sm:text-[14px] mb-3">
          {currentQuestion.question}
        </p>

        <div className="w-full h-[3px] bg-[#1e2535] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#e91e8c] rounded-full transition-all duration-500"
            style={{ width: `${Math.max(progressPct, 2)}%` }}
          />
        </div>
      </div>

      {/* ── Options ── */}
      <div className="px-4 pt-2 pb-3 flex flex-col gap-2.5">
        {currentQuestion.options.map((opt) => (
          <OptionButton
            key={opt}
            label={opt}
            selected={selectedAnswer === opt}
            isCorrect={opt === correctAnswerOption}
            answerState={answerState}
            onSelect={() => handleSelect(opt)}
          />
        ))}
      </div>

      {/* Submitting indicator */}
      {submitting && (
        <div className="px-4 pb-2">
          <p className="text-[#6b7280] text-[12px] text-center animate-pulse">
            Checking answer…
          </p>
        </div>
      )}

      {/* ── Feedback Banner ── */}
      {answerState !== "idle" && (
        <div
          className={`mx-4 mb-3 px-4 py-3 rounded-xl flex items-start gap-2.5 transition-all duration-300 ${
            answerState === "correct"
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
              className={`text-[13px] font-bold mb-0.5 ${
                answerState === "correct" ? "text-[#00c853]" : "text-[#ef5350]"
              }`}
            >
              {answerState === "correct" ? "Correct!" : "Incorrect"}
            </p>
            <p className="text-[#9ca3af] text-[12px] leading-relaxed">
              {explanation}
            </p>
            {session && (
              <p className="text-[#555] text-[11px] mt-1">
                {session.correctCount}/{session.answeredCount} correct ·{" "}
                {session.totalPointsEarned} pts
              </p>
            )}
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
            {currentIndex >= quiz.totalQuestions - 1
              ? "See Results"
              : "Next Question"}
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