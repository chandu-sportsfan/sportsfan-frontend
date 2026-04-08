// // components/watch-along/FlashQuiz.tsx
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useWatchAlong } from "@/context/WatchAlongContext";

// interface QuizQuestion {
//   id: string;
//   question: string;
//   options: string[];
//   timerSeconds: number;
//   points: number;
//   isActive: boolean;
//   competing: number;
//   correctAnswer?: string;
// }

// interface AnsweredDetails {
//   selectedOption: string;
//   correctAnswer: string;
//   isCorrect: boolean;
//   pointsEarned: number;
// }

// export default function FlashQuiz({ matchId }: { matchId: string }) {
//   const [selected, setSelected] = useState<Record<string, string>>({});
//   const [revealed, setRevealed] = useState<Record<string, AnsweredDetails>>({});
//   const [points, setPoints] = useState(0);
//   const [submitting, setSubmitting] = useState<string | null>(null);
//   const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [errorQuestionId, setErrorQuestionId] = useState<string | null>(null);
  
//   const { 
//     quizQuestions, 
//     fetchQuizQuestions, 
//     submitQuizAnswer,
//     loading 
//   } = useWatchAlong();

//   // Clear error after 3 seconds
//   useEffect(() => {
//     if (errorMessage) {
//       const timer = setTimeout(() => {
//         setErrorMessage(null);
//         setErrorQuestionId(null);
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [errorMessage]);

//   // Fetch ALL quiz questions
//   const loadQuestions = useCallback(async () => {
//     if (!matchId) return;
//     await fetchQuizQuestions(matchId, false);
//   }, [matchId, fetchQuizQuestions]);

//   useEffect(() => {
//     loadQuestions();
//   }, [loadQuestions]);

//   // Auto-refresh every 10 seconds
//   useEffect(() => {
//     if (!matchId) return;
//     const interval = setInterval(loadQuestions, 10000);
//     return () => clearInterval(interval);
//   }, [matchId, loadQuestions]);

//   const handleSelect = async (questionId: string, option: string, question: QuizQuestion) => {
//     // Clear previous error for this question
//     if (errorQuestionId === questionId) {
//       setErrorMessage(null);
//       setErrorQuestionId(null);
//     }
    
//     if (answeredQuestions.has(questionId)) {
//       setErrorMessage("You've already answered this question!");
//       setErrorQuestionId(questionId);
//       return;
//     }
    
//     if (submitting === questionId) return;
    
//     setSubmitting(questionId);
//     try {
//       const result = await submitQuizAnswer(matchId, {
//         questionId,
//         option,
//         userId: localStorage.getItem("watchalong_user_id") || "anonymous",
//         displayName: "Quiz Player",
//       });
      
//       if (result) {
//         setSelected((prev) => ({ ...prev, [questionId]: option }));
//         setRevealed((prev) => ({ 
//           ...prev, 
//           [questionId]: {
//             selectedOption: option,
//             correctAnswer: result.correctAnswer,
//             isCorrect: result.isCorrect,
//             pointsEarned: result.pointsEarned
//           }
//         }));
//         setAnsweredQuestions((prev) => new Set([...prev, questionId]));
        
//         if (result.isCorrect) {
//           setPoints((p) => p + result.pointsEarned);
//         }
//       }
//     } catch (error: any) {
//       console.error("Failed to submit answer:", error);
      
//       // Handle different error status codes
//       if (error.response?.status === 409) {
//         setErrorMessage("⚠️ You've already answered this question! Each question can only be answered once.");
//         setErrorQuestionId(questionId);
//         // Mark as answered locally to prevent further attempts
//         setAnsweredQuestions((prev) => new Set([...prev, questionId]));
//       } else if (error.response?.status === 400) {
//         setErrorMessage("❌ Invalid answer. Please try again.");
//         setErrorQuestionId(questionId);
//       } else if (error.response?.status === 404) {
//         setErrorMessage("🔍 Question not found. It may have been removed.");
//         setErrorQuestionId(questionId);
//       } else if (error.code === "ERR_NETWORK") {
//         setErrorMessage("📡 Network error. Please check your connection and try again.");
//         setErrorQuestionId(questionId);
//       } else {
//         setErrorMessage("❌ Something went wrong. Please try again later.");
//         setErrorQuestionId(questionId);
//       }
//     } finally {
//       setSubmitting(null);
//     }
//   };

//   const getOptionStyle = (questionId: string, option: string) => {
//     const answer = revealed[questionId];
//     if (!answer) {
//       return "bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:border-[#444] hover:bg-[#222]";
//     }
//     if (option === answer.correctAnswer) {
//       return "bg-green-600/20 border-green-500 text-green-300";
//     }
//     if (option === answer.selectedOption && !answer.isCorrect) {
//       return "bg-red-600/20 border-red-500 text-red-300";
//     }
//     return "bg-[#1a1a1a] border-[#2a2a2a] text-gray-500 opacity-50";
//   };

//   if (loading && quizQuestions.length === 0) {
//     return (
//       <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3">
//         <div className="flex items-center justify-center py-12">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
//         </div>
//       </div>
//     );
//   }

//   if (quizQuestions.length === 0) {
//     return (
//       <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3">
//         <div className="text-center py-12 text-gray-500">
//           <p>No quiz questions available</p>
//           <p className="text-xs text-gray-600 mt-2">Check back later!</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-2">
//           <span className="text-yellow-400 text-sm">⚡</span>
//           <span className="text-sm font-bold">Flash Quiz</span>
//         </div>
//         <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-full">
//           {points} pts
//         </span>
//       </div>

//       {/* Global Error Message */}
//       {errorMessage && (
//         <div className="mb-4 p-3 bg-red-600/20 border border-red-500 rounded-lg animate-pulse">
//           <p className="text-red-400 text-sm text-center">{errorMessage}</p>
//         </div>
//       )}

//       {/* All Questions */}
//       <div className="flex flex-col gap-6">
//         {quizQuestions.map((question, index) => {
//           const isAnswered = answeredQuestions.has(question.id);
//           const answer = revealed[question.id];
//           const hasError = errorQuestionId === question.id;
          
//           return (
//             <div 
//               key={question.id} 
//               className={`flex flex-col gap-2 transition-all ${hasError ? 'border border-red-500 rounded-lg p-3 bg-red-600/5' : ''}`}
//             >
//               {/* Question number and header */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-gray-500">Q{index + 1}</span>
//                   <span className="text-[13px] font-semibold text-white leading-snug">
//                     {question.question}
//                   </span>
//                 </div>
//                 {!isAnswered && (
//                   <span className="text-[10px] text-gray-500 flex items-center gap-1">
//                     <span>🎯</span>
//                     {question.points} pts
//                   </span>
//                 )}
//                 {isAnswered && answer?.isCorrect && (
//                   <span className="text-[10px] text-green-500 flex items-center gap-1">
//                     ✓ +{answer.pointsEarned}
//                   </span>
//                 )}
//                 {isAnswered && answer && !answer.isCorrect && (
//                   <span className="text-[10px] text-red-500 flex items-center gap-1">
//                     ✗ 0 pts
//                   </span>
//                 )}
//               </div>

//               {/* Options */}
//               <div className="flex flex-col gap-1.5">
//                 {question.options.map((option, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => handleSelect(question.id, option, question)}
//                     disabled={isAnswered || submitting === question.id}
//                     className={`w-full text-left px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all border ${getOptionStyle(
//                       question.id,
//                       option
//                     )} ${submitting === question.id ? 'opacity-50 cursor-wait' : ''}`}
//                   >
//                     {String.fromCharCode(65 + idx)}. {option}
//                     {submitting === question.id && selected[question.id] === option && (
//                       <span className="float-right">
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       </span>
//                     )}
//                   </button>
//                 ))}
//               </div>

//               {/* Result message */}
//               {isAnswered && answer && (
//                 <div className={`mt-1 p-2 rounded-lg text-center text-xs ${
//                   answer.isCorrect
//                     ? "bg-green-600/20 text-green-400"
//                     : "bg-red-600/20 text-red-400"
//                 }`}>
//                   {answer.isCorrect
//                     ? `✓ Correct! +${answer.pointsEarned} points`
//                     : `✗ Wrong! The correct answer was: ${answer.correctAnswer}`}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Completion Message */}
//       {quizQuestions.length > 0 && answeredQuestions.size === quizQuestions.length && (
//         <div className="mt-6 p-4 bg-green-600/20 border border-green-500 rounded-lg text-center">
//           <p className="text-green-400 font-semibold">🎉 Quiz Completed! 🎉</p>
//           <p className="text-sm text-gray-300 mt-1">
//             You scored {points} out of {quizQuestions.reduce((sum, q) => sum + q.points, 0)} points
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }









// components/watch-along/FlashQuiz.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useWatchAlong } from "@/context/WatchAlongContext";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  timerSeconds: number;
  points: number;
  isActive: boolean;
  competing: number;
  correctAnswer?: string;
}

interface AnsweredDetails {
  selectedOption: string;
  correctAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
}

// Per-question inline error (never touches global error state)
type QuestionError = {
  message: string;
  type: "warning" | "error";
};

export default function FlashQuiz({ matchId }: { matchId: string }) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, AnsweredDetails>>({});
  const [points, setPoints] = useState(0);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "warning" } | null>(null);
  // Inline per-question errors — replaces any global error propagation
  const [questionErrors, setQuestionErrors] = useState<Record<string, QuestionError>>({});

  const {
    quizQuestions,
    fetchQuizQuestions,
    submitQuizAnswer,
    loading,
  } = useWatchAlong();

  // Toast auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const loadQuestions = useCallback(async () => {
    if (!matchId) return;
    await fetchQuizQuestions(matchId, false);
  }, [matchId, fetchQuizQuestions]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const setQuestionError = (questionId: string, message: string, type: QuestionError["type"]) => {
    setQuestionErrors((prev) => ({ ...prev, [questionId]: { message, type } }));
    // Auto-clear after 4 seconds
    setTimeout(() => {
      setQuestionErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }, 4000);
  };

  const handleSelect = async (questionId: string, option: string, question: QuizQuestion) => {
    if (answeredQuestions.has(questionId)) {
      setQuestionError(questionId, "You've already answered this question!", "warning");
      return;
    }

    if (submitting === questionId) return;

    setSubmitting(questionId);
    // Clear any previous error for this question
    setQuestionErrors((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });

    try {
      const result = await submitQuizAnswer(matchId, {
        questionId,
        option,
        userId: localStorage.getItem("watchalong_user_id") || "anonymous",
        displayName: "Quiz Player",
      });

      if (result) {
        setSelected((prev) => ({ ...prev, [questionId]: option }));
        setRevealed((prev) => ({
          ...prev,
          [questionId]: {
            selectedOption: option,
            correctAnswer: result.correctAnswer,
            isCorrect: result.isCorrect,
            pointsEarned: result.pointsEarned,
          },
        }));
        setAnsweredQuestions((prev) => new Set([...prev, questionId]));

        if (result.isCorrect) {
          setPoints((p) => p + result.pointsEarned);
          setToastMessage({ text: `✓ Correct! +${result.pointsEarned} points`, type: "success" });
        } else {
          setToastMessage({ text: `✗ Wrong! The correct answer was: ${result.correctAnswer}`, type: "error" });
        }
      }
    } catch (error: unknown) {
      //  All errors are caught HERE — never propagate to context/page error state
      const errorObj = error as { response?: { status: number }; status?: number };
      const status = errorObj?.response?.status ?? errorObj?.status;

      if (status === 409) {
        // Already answered — mark locally and show inline message
        setAnsweredQuestions((prev) => new Set([...prev, questionId]));
        setQuestionError(
          questionId,
          "You've already answered this question. Each question can only be answered once.",
          "warning"
        );
      } else if (status === 400) {
        setQuestionError(questionId, "Invalid answer. Please try again.", "error");
      } else if (status === 404) {
        setQuestionError(questionId, "This question may have been removed.", "error");
      } else {
        setQuestionError(questionId, "Something went wrong. Please try again.", "error");
      }
    } finally {
      setSubmitting(null);
    }
  };

  const getOptionStyle = (questionId: string, option: string) => {
    const answer = revealed[questionId];
    if (!answer) {
      return "bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:border-[#444] hover:bg-[#222]";
    }
    if (option === answer.correctAnswer) {
      return "bg-green-600/20 border-green-500 text-green-300";
    }
    if (option === answer.selectedOption && !answer.isCorrect) {
      return "bg-red-600/20 border-red-500 text-red-300";
    }
    return "bg-[#1a1a1a] border-[#2a2a2a] text-gray-500 opacity-50";
  };

  if (loading && quizQuestions.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400" />
        </div>
      </div>
    );
  }

  if (quizQuestions.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3">
        <div className="text-center py-12 text-gray-500">
          <p>No quiz questions available</p>
          <p className="text-xs text-gray-600 mt-2">Check back later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-24 right-4 z-50 p-3 rounded-lg shadow-lg min-w-[250px] max-w-[350px] animate-slide-in ${
            toastMessage.type === "success"
              ? "bg-green-600 text-white"
              : toastMessage.type === "warning"
              ? "bg-yellow-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <p className="text-sm text-center">{toastMessage.text}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-sm">⚡</span>
          <span className="text-sm font-bold">Flash Quiz</span>
        </div>
        <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-full">
          {points} pts
        </span>
      </div>

      {/* All Questions */}
      <div className="flex flex-col gap-6">
        {quizQuestions.map((question, index) => {
          const isAnswered = answeredQuestions.has(question.id);
          const answer = revealed[question.id];
          const qError = questionErrors[question.id];

          return (
            <div key={question.id} className="flex flex-col gap-2">
              {/* Question header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Q{index + 1}</span>
                  <span className="text-[13px] font-semibold text-white leading-snug">
                    {question.question}
                  </span>
                </div>
                {!isAnswered && (
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <span>🎯</span>
                    {question.points} pts
                  </span>
                )}
                {isAnswered && answer?.isCorrect && (
                  <span className="text-[10px] text-green-500">✓ +{answer.pointsEarned}</span>
                )}
                {isAnswered && answer && !answer.isCorrect && (
                  <span className="text-[10px] text-red-500">✗ 0 pts</span>
                )}
              </div>

              {/* Options */}
              <div className="flex flex-col gap-1.5">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(question.id, option, question)}
                    disabled={isAnswered || submitting === question.id}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all border ${getOptionStyle(
                      question.id,
                      option
                    )} ${submitting === question.id ? "opacity-50 cursor-wait" : ""}`}
                  >
                    {String.fromCharCode(65 + idx)}. {option}
                    {submitting === question.id && selected[question.id] === option && (
                      <span className="float-right">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── Inline result message (correct / wrong) ── */}
              {isAnswered && answer && (
                <div
                  className={`mt-1 p-2 rounded-lg text-center text-xs ${
                    answer.isCorrect
                      ? "bg-green-600/20 text-green-400"
                      : "bg-red-600/20 text-red-400"
                  }`}
                >
                  {answer.isCorrect
                    ? `✓ Correct! +${answer.pointsEarned} points`
                    : `✗ Wrong! The correct answer was: ${answer.correctAnswer}`}
                </div>
              )}

              {/* ── Inline per-question error (409, network, etc.) ── */}
              {qError && (
                <div
                  className={`mt-1 p-2 rounded-lg text-center text-xs flex items-center justify-center gap-1.5 ${
                    qError.type === "warning"
                      ? "bg-yellow-500/15 border border-yellow-500/30 text-yellow-400"
                      : "bg-red-500/15 border border-red-500/30 text-red-400"
                  }`}
                >
                  <span>{qError.type === "warning" ? "⚠️" : "❌"}</span>
                  {qError.message}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {quizQuestions.length > 0 && answeredQuestions.size === quizQuestions.length && (
        <div className="mt-6 p-4 bg-green-600/20 border border-green-500 rounded-lg text-center">
          <p className="text-green-400 font-semibold">🎉 Quiz Completed! 🎉</p>
          <p className="text-sm text-gray-300 mt-1">
            You scored {points} out of {quizQuestions.reduce((sum, q) => sum + q.points, 0)} points
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}