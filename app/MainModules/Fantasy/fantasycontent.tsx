"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import CircleCricketGame from "@/src/components/fantasy/CircleCricketGame";

type Result = number | "OUT";
type Phase = "cover" | "opening" | "idle" | "flipping" | "reveal" | "over";

const DIGIT_MAP: Record<string, Result> = {
  "0": "OUT",
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 1,
  "6": 6,
  "7": 1,
  "8": 2,
  "9": 3,
};

const WORDS = [
  "the",
  "and",
  "of",
  "to",
  "in",
  "a",
  "that",
  "it",
  "he",
  "was",
  "for",
  "on",
  "are",
  "as",
  "with",
  "his",
  "they",
  "be",
  "at",
  "one",
  "have",
  "this",
  "from",
  "or",
  "had",
  "by",
  "but",
  "not",
  "what",
  "all",
  "were",
  "we",
  "when",
  "your",
  "can",
  "said",
  "there",
  "use",
  "an",
  "each",
  "which",
  "she",
  "do",
  "how",
  "their",
  "if",
  "will",
  "up",
  "about",
  "out",
  "many",
  "then",
  "them",
  "these",
  "so",
  "some",
  "her",
  "would",
  "make",
  "like",
  "into",
  "him",
  "has",
  "two",
  "more",
  "very",
  "after",
  "words",
  "called",
  "just",
  "where",
  "most",
  "know",
  "get",
  "through",
  "back",
  "much",
  "go",
  "good",
  "new",
  "write",
  "our",
  "me",
  "man",
  "too",
  "any",
  "day",
  "same",
  "right",
  "look",
  "think",
  "also",
  "around",
  "another",
];

const maxBalls = 12;
const maxWickets = 3;

function scoreForPage(page: number): Result {
  return DIGIT_MAP[String(page % 10)] ?? 1;
}

function resultLabel(result: Result): string {
  if (result === "OUT") return "WICKET!";
  if (result === 6) return "SIX! MAXIMUM!";
  if (result === 4) return "FOUR! BOUNDARY!";
  return `${result} RUN${result > 1 ? "S" : ""}`;
}

function randomPage(): number {
  return Math.floor(Math.random() * 488) + 12;
}

function buildPageLines(page: number, count = 13): string[] {
  let seed = (page * 9301 + 49297) >>> 0;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  return Array.from({ length: count }, (_, index) => {
    const wordCount = 5 + Math.floor(next() * 6);
    const words = Array.from({ length: wordCount }, () => WORDS[Math.floor(next() * WORDS.length)]);
    const prefix = index === 0 ? `Chapter ${Math.max(1, Math.floor(page / 20) + 1)} ` : "";
    return `${prefix}${words.join(" ")}`.replace(/^./, (char) => char.toUpperCase());
  });
}

export default function FantasyContent() {
  const router = useRouter();
  const timersRef = useRef<number[]>([]);

  const [activeGame, setActiveGame] = useState<"book" | "circle">("book");
  const [phase, setPhase] = useState<Phase>("cover");
  const [bookOpen, setBookOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [balls, setBalls] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [history, setHistory] = useState<Result[]>([]);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("Tap the book to open it.");
  const [showHow, setShowHow] = useState(false);
  const [showAbout, setShowAbout] = useState(true);
  const [revealOpen, setRevealOpen] = useState(false);
  const [revealPage, setRevealPage] = useState(0);
  const [revealResult, setRevealResult] = useState<Result>(1);

  const pageLines = useMemo(() => buildPageLines(page), [page]);
  const isOver = balls >= maxBalls || wickets >= maxWickets || phase === "over";
  const currentChapter = Math.max(1, Math.floor(page / 20) + 1);

  const switchGame = (nextGame: "book" | "circle") => {
    if (nextGame === activeGame) return;
    clearTimers();
    if (nextGame === "circle") setShowAbout(false);
    setActiveGame(nextGame);
  };

  useEffect(() => {
    const fonts = [
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@500;600;700&family=Special+Elite&display=swap",
    ];

    fonts.forEach((href) => {
      const existing = document.querySelector(`link[href='${href}']`);
      if (existing) return;
      const link = document.createElement("link");
      link.href = href;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    });

    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  const schedule = (handler: () => void, delay: number) => {
    timersRef.current.push(window.setTimeout(handler, delay));
  };

  const openBook = () => {
    if (bookOpen) return;
    clearTimers();
    setBookOpen(true);
    setPhase("opening");
    setMessage("The book is open. Flip the page to find your score.");
    schedule(() => setPhase("idle"), 900);
  };

  const resolveFlip = (nextPage: number, result: Result) => {
    const nextBalls = balls + 1;
    const nextScore = result === "OUT" ? score : score + result;
    const nextWickets = result === "OUT" ? wickets + 1 : wickets;
    const nextHistory = [...history, result];

    setRevealOpen(false);
    setBalls(nextBalls);
    setScore(nextScore);
    setWickets(nextWickets);
    setHistory(nextHistory);
    setBest((currentBest) => Math.max(currentBest, nextScore));

    if (result === "OUT") {
      setMessage(
        `Page ${nextPage} -> digit ${nextPage % 10} -> wicket. ${
          nextWickets < maxWickets ? "Keep batting." : "All out."
        }`,
      );
    } else if (result === 6) {
      setMessage(`Page ${nextPage} -> digit 6 -> SIX! Maximum celebration.`);
    } else if (result === 4) {
      setMessage(`Page ${nextPage} -> digit 4 -> FOUR! Clean boundary.`);
    } else {
      setMessage(`Page ${nextPage} -> digit ${nextPage % 10} -> ${result} run${result > 1 ? "s" : ""}.`);
    }

    if (nextBalls >= maxBalls || nextWickets >= maxWickets) {
      setPhase("over");
      schedule(() => setMessage(`Match over. You scored ${nextScore} runs.`), 200);
    } else {
      setPhase("idle");
    }
  };

  const flipPage = () => {
    if (phase === "cover") {
      openBook();
      return;
    }

    if (phase !== "idle" || isOver) return;

    clearTimers();
    const nextPage = randomPage();
    const result = scoreForPage(nextPage);

    setPhase("flipping");
    setPage(nextPage);
    setMessage("The page is turning...");

    schedule(() => {
      setRevealPage(nextPage);
      setRevealResult(result);
      setRevealOpen(true);
      setPhase("reveal");
    }, 360);

    schedule(() => resolveFlip(nextPage, result), 1650);
  };

  const resetGame = () => {
    clearTimers();
    setPhase("cover");
    setBookOpen(false);
    setScore(0);
    setBest(0);
    setBalls(0);
    setWickets(0);
    setHistory([]);
    setPage(1);
    setMessage("Tap the book to open it.");
    setShowHow(false);
    setRevealOpen(false);
    setRevealPage(0);
    setRevealResult(1);
  };

  const scoreCard = [
    { value: score, label: "SCORE" },
    { value: `${balls}/${maxBalls}`, label: "BALLS" },
    { value: `${wickets}/${maxWickets}`, label: "WICKETS" },
    { value: best, label: "BEST" },
  ];

  return (
    <div className="fantasy-book-game">
      <style jsx global>{`
        .fantasy-book-game {
          --bg: #090603;
          --bg2: #140d06;
          --paper: #f5ead6;
          --paper2: #ede0c4;
          --ink: #1a0f00;
          --spine: #5c1a06;
          --text: #f5ead6;
          --muted: #8b7050;
          --amber: #f59e0b;
          --green: #22c55e;
          --red: #dc2626;
          --blue: #60a5fa;
          min-height: 100vh;
          color: var(--text);
          background:
            radial-gradient(circle at top left, rgba(245, 158, 11, 0.16), transparent 30%),
            radial-gradient(circle at bottom right, rgba(96, 165, 250, 0.11), transparent 28%),
            linear-gradient(180deg, #090603 0%, #120a05 100%);
          font-family: "Rajdhani", sans-serif;
          overflow-x: hidden;
        }

        .fantasy-book-game,
        .fantasy-book-game * {
          box-sizing: border-box;
        }

        .fantasy-book-game .title-font {
          font-family: "Bebas Neue", sans-serif;
          letter-spacing: 0.08em;
        }

        .fantasy-book-game .detail-font {
          font-family: "Special Elite", serif;
        }

        .fantasy-book-game .shell {
          width: min(100%, 720px);
          margin: 0 auto;
          padding: 12px 14px 22px;
        }

        .fantasy-book-game .gameSwitch {
          display: flex;
          gap: 8px;
          margin: 8px 0 14px;
          padding: 6px;
          border: 1px solid rgba(42, 26, 10, 0.95);
          border-radius: 16px;
          background: rgba(13, 8, 4, 0.88);
        }

        .fantasy-book-game .switchBtn {
          flex: 1;
          border: 1px solid transparent;
          border-radius: 12px;
          padding: 12px 10px;
          background: transparent;
          color: #8b7050;
          cursor: pointer;
          transition: transform 0.18s ease, background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
        }

        .fantasy-book-game .switchBtn.active {
          background: linear-gradient(135deg, rgba(122, 32, 8, 0.96), rgba(196, 64, 16, 0.9));
          border-color: rgba(245, 158, 11, 0.6);
          color: #f5d5a0;
        }

        .fantasy-book-game .switchBtn:hover {
          transform: translateY(-1px);
        }

        .fantasy-book-game .switchTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 6px;
        }

        .fantasy-book-game .switchTag {
          font-size: 10px;
          letter-spacing: 0.28em;
          color: rgba(245, 158, 11, 0.74);
        }

        .fantasy-book-game .switchTitle {
          font-size: 18px;
          line-height: 1;
        }

        .fantasy-book-game .switchDesc {
          font-size: 10px;
          letter-spacing: 0.14em;
          color: rgba(197, 149, 106, 0.9);
        }

        .fantasy-book-game .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 6px 0 10px;
        }

        .fantasy-book-game .backBtn,
        .fantasy-book-game .ghostBtn,
        .fantasy-book-game .mainBtn {
          border: 1px solid rgba(197, 149, 106, 0.22);
          background: rgba(20, 13, 6, 0.9);
          color: #c4956a;
          border-radius: 999px;
          padding: 10px 14px;
          cursor: pointer;
          transition: transform 0.18s ease, border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
        }

        .fantasy-book-game .backBtn:hover,
        .fantasy-book-game .ghostBtn:hover,
        .fantasy-book-game .mainBtn:hover {
          transform: translateY(-1px);
          border-color: rgba(245, 158, 11, 0.6);
          color: #f5d5a0;
        }

        .fantasy-book-game .brand {
          text-align: right;
        }

        .fantasy-book-game .brand .kicker {
          color: rgba(245, 158, 11, 0.7);
          font-size: 10px;
          letter-spacing: 0.34em;
        }

        .fantasy-book-game .brand .name {
          font-size: clamp(28px, 5vw, 42px);
          line-height: 0.95;
          color: #f5d5a0;
          text-shadow: 0 2px 18px rgba(245, 158, 11, 0.22);
        }

        .fantasy-book-game .brand .name em {
          color: var(--amber);
          font-style: normal;
        }

        .fantasy-book-game .board {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 6px;
          margin-top: 4px;
        }

        .fantasy-book-game .scoreCard {
          background: linear-gradient(180deg, rgba(20, 13, 6, 0.96), rgba(12, 8, 4, 0.98));
          border: 1px solid rgba(42, 26, 10, 0.95);
          border-radius: 12px;
          padding: 8px 6px;
          text-align: center;
        }

        .fantasy-book-game .scoreCard .value {
          display: block;
          font-size: clamp(24px, 3vw, 30px);
          line-height: 1;
          color: var(--text);
        }

        .fantasy-book-game .scoreCard .label {
          display: block;
          margin-top: 2px;
          color: var(--muted);
          font-size: 10px;
          letter-spacing: 0.18em;
          font-weight: 700;
        }

        .fantasy-book-game .stage {
          position: relative;
          width: min(100%, 520px);
          margin: 16px auto 6px;
          height: 376px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1400px;
        }

        .fantasy-book-game .bookScene {
          position: relative;
          width: 320px;
          height: 244px;
          transform-style: preserve-3d;
          filter: drop-shadow(0 22px 40px rgba(0, 0, 0, 0.78));
          transition: transform 0.45s ease;
        }

        .fantasy-book-game .bookScene.idle {
          animation: fantasyFloat 3.2s ease-in-out infinite;
        }

        .fantasy-book-game .bookScene.flipping {
          transform: translateY(-2px) rotateX(7deg) rotateY(-5deg);
        }

        .fantasy-book-game .cover,
        .fantasy-book-game .pageOpen,
        .fantasy-book-game .sheet,
        .fantasy-book-game .backCover {
          position: absolute;
          inset: 0;
          border-radius: 4px 12px 12px 4px;
        }

        .fantasy-book-game .backCover {
          background: linear-gradient(160deg, #2a0e04, #1a0803);
        }

        .fantasy-book-game .pageEdge {
          position: absolute;
          top: 3px;
          bottom: 3px;
          left: 14px;
          right: 3px;
          border-radius: 0 4px 4px 0;
          background: repeating-linear-gradient(90deg, #eadbb8 0px, #f5e8cc 2px, #efe1c7 3px);
          box-shadow: inset -2px 0 4px rgba(0, 0, 0, 0.1);
        }

        .fantasy-book-game .pageOpen {
          top: 3px;
          bottom: 3px;
          left: 14px;
          right: 3px;
          background: var(--paper);
          border-radius: 0 4px 4px 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          color: var(--ink);
        }

        .fantasy-book-game .pageTop,
        .fantasy-book-game .pageBottom {
          padding: 8px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-color: rgba(0, 0, 0, 0.08);
          border-style: solid;
        }

        .fantasy-book-game .pageTop {
          border-bottom-width: 1px;
        }

        .fantasy-book-game .pageBottom {
          border-top-width: 1px;
        }

        .fantasy-book-game .pageTop span,
        .fantasy-book-game .pageBottom span {
          font-size: 8px;
          letter-spacing: 0.18em;
          color: #8b7050;
        }

        .fantasy-book-game .pageBody {
          position: relative;
          flex: 1;
          padding: 8px 14px 12px;
          overflow: hidden;
        }

        .fantasy-book-game .pageBody::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.02) 100%);
          pointer-events: none;
        }

        .fantasy-book-game .pageNumber {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          font-size: clamp(4rem, 11vw, 5.5rem);
          color: rgba(42, 24, 0, 0.18);
          line-height: 1;
        }

        .fantasy-book-game .line {
          height: 10px;
          margin: 4px 0;
          overflow: hidden;
        }

        .fantasy-book-game .line span {
          display: block;
          white-space: nowrap;
          font-size: 8px;
          color: rgba(90, 61, 30, 0.58);
        }

        .fantasy-book-game .spine {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 14px;
          background: linear-gradient(90deg, #3d1205, #6b2008, #3d1205);
          border-radius: 4px 0 0 4px;
          z-index: 3;
        }

        .fantasy-book-game .spine::after {
          content: "BOOK CRICKET";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-90deg);
          color: rgba(245, 213, 160, 0.42);
          font-size: 7px;
          letter-spacing: 0.22em;
          white-space: nowrap;
        }

        .fantasy-book-game .cover {
          background: linear-gradient(150deg, #8b2c0a 0%, #5c1a06 50%, #3d1205 100%);
          transform-origin: left center;
          transform-style: preserve-3d;
          overflow: hidden;
          cursor: pointer;
          z-index: 10;
          transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.35s ease;
        }

        .fantasy-book-game .cover::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, transparent 52%);
        }

        .fantasy-book-game .cover.open {
          transform: rotateY(-178deg);
          opacity: 0;
          pointer-events: none;
        }

        .fantasy-book-game .coverTitle {
          position: absolute;
          top: 28px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 28px;
          color: #f5d5a0;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
        }

        .fantasy-book-game .coverSub {
          position: absolute;
          top: 63px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 9px;
          letter-spacing: 0.18em;
          color: #c4956a;
          opacity: 0.82;
        }

        .fantasy-book-game .coverStage {
          position: absolute;
          top: 88px;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .fantasy-book-game .ballMark {
          width: 42px;
          height: 42px;
          border-radius: 999px;
          background: radial-gradient(circle at 35% 32%, #f8f4ec, #c8b49a, #a89070);
          box-shadow: inset -4px -4px 8px rgba(0, 0, 0, 0.3), inset 2px 2px 4px rgba(255, 255, 255, 0.28);
          position: relative;
          animation: ballBounce 1.8s ease-in-out infinite;
        }

        .fantasy-book-game .ballMark::before,
        .fantasy-book-game .ballMark::after {
          content: "";
          position: absolute;
          left: 6px;
          right: 6px;
          height: 1.5px;
          top: 50%;
          background: rgba(100, 60, 30, 0.5);
          border-radius: 1px;
        }

        .fantasy-book-game .ballMark::after {
          transform: translateY(6px);
        }

        .fantasy-book-game .tapHint {
          font-size: 8px;
          letter-spacing: 0.34em;
          color: #a07050;
          text-align: center;
          animation: hintPulse 1.6s ease-in-out infinite;
        }

        .fantasy-book-game .coverFooter {
          position: absolute;
          bottom: 7px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 9px;
          letter-spacing: 0.18em;
          color: #f0b87a;
          font-weight: 700;
        }

        .fantasy-book-game .sheet {
          top: 3px;
          bottom: 3px;
          left: 14px;
          right: 3px;
          border-radius: 0 4px 4px 0;
          background: var(--paper);
          z-index: 7;
          display: none;
          overflow: hidden;
        }

        .fantasy-book-game .sheet.show {
          display: block;
        }

        .fantasy-book-game .pageRibbon {
          position: absolute;
          inset: auto 12px 12px auto;
          width: 18px;
          height: 18px;
          opacity: 0.28;
          pointer-events: none;
        }

        .fantasy-book-game .reveal {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
          background: rgba(5, 3, 2, 0.74);
          backdrop-filter: blur(2px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }

        .fantasy-book-game .reveal.show {
          opacity: 1;
          pointer-events: auto;
        }

        .fantasy-book-game .revealCard {
          background: #0d0804;
          border: 2px solid var(--amber);
          border-radius: 22px;
          padding: 20px 32px;
          text-align: center;
          transform: scale(0.52);
          transition: transform 0.34s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .fantasy-book-game .reveal.show .revealCard {
          transform: scale(1);
        }

        .fantasy-book-game .revealNum {
          font-size: clamp(58px, 11vw, 92px);
          line-height: 1;
        }

        .fantasy-book-game .revealLabel {
          font-size: 18px;
          letter-spacing: 0.22em;
          margin-top: 2px;
        }

        .fantasy-book-game .revealInfo {
          margin-top: 8px;
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.14em;
        }

        .fantasy-book-game .msgRow {
          min-height: 24px;
          margin: 8px auto 2px;
          text-align: center;
          color: #c4956a;
          font-family: "Special Elite", serif;
          font-size: 12px;
          line-height: 1.6;
        }

        .fantasy-book-game .controls {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }

        .fantasy-book-game .mainBtn {
          flex: 1;
          min-height: 52px;
          font-size: 18px;
          color: #f5d5a0;
          background: linear-gradient(135deg, #7a2008, #c44010, #7a2008);
          border-color: rgba(196, 64, 16, 0.35);
          letter-spacing: 0.22em;
        }

        .fantasy-book-game .mainBtn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          transform: none;
        }

        .fantasy-book-game .controlRow {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }

        .fantasy-book-game .ghostBtn {
          flex: 1;
          min-height: 42px;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .fantasy-book-game .tracker {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
        }

        .fantasy-book-game .trackerLabel {
          font-size: 9px;
          letter-spacing: 0.28em;
          color: var(--muted);
          font-weight: 700;
          white-space: nowrap;
        }

        .fantasy-book-game .ballRow {
          display: flex;
          gap: 3px;
          flex-wrap: wrap;
          flex: 1;
        }

        .fantasy-book-game .ballPill {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          border: 1.5px solid #2a1a0a;
          background: var(--bg2);
          color: #4f3b2d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
        }

        .fantasy-book-game .ballPill.now {
          border-color: var(--amber);
          color: #f5d5a0;
          background: #2a1500;
          box-shadow: 0 0 14px rgba(245, 158, 11, 0.42);
        }

        .fantasy-book-game .ballPill.dot {
          color: #322111;
        }

        .fantasy-book-game .ballPill.out {
          border-color: var(--red);
          background: rgba(31, 8, 8, 0.95);
          color: #fca5a5;
        }

        .fantasy-book-game .ballPill.r1 {
          background: #0c2233;
          color: #67e8f9;
          border-color: #0891b2;
        }

        .fantasy-book-game .ballPill.r2 {
          background: #231505;
          color: #fcd34d;
          border-color: #d97706;
        }

        .fantasy-book-game .ballPill.r3 {
          background: #180c33;
          color: #c4b5fd;
          border-color: #7c3aed;
        }

        .fantasy-book-game .ballPill.r4 {
          background: #0a1533;
          color: #93c5fd;
          border-color: #2563eb;
        }

        .fantasy-book-game .ballPill.r6 {
          background: #052e16;
          color: #86efac;
          border-color: #16a34a;
        }

        .fantasy-book-game .howPanel {
          margin-top: 10px;
          border: 1px solid rgba(42, 26, 10, 0.95);
          border-radius: 14px;
          background: rgba(13, 8, 4, 0.96);
          padding: 14px 16px;
          font-size: 12px;
          line-height: 1.9;
          color: #c4956a;
        }

        .fantasy-book-game .howPanel h3 {
          margin: 0 0 6px;
          color: var(--amber);
          font-size: 16px;
          letter-spacing: 0.2em;
        }

        .fantasy-book-game .howPanel ul {
          margin: 0;
          padding-left: 16px;
        }

        .fantasy-book-game .howPanel li {
          margin-bottom: 2px;
        }

        .fantasy-book-game .footer {
          margin-top: 12px;
          text-align: center;
          font-size: 9px;
          letter-spacing: 0.24em;
          color: #8b6540;
        }

        .fantasy-book-game .footer a {
          color: var(--amber);
          text-decoration: none;
          font-weight: 700;
        }

        .fantasy-book-game .aboutOverlay {
          position: fixed;
          inset: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(170deg, rgba(18, 8, 0, 0.96), rgba(10, 5, 0, 0.98));
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }

        .fantasy-book-game .aboutOverlay.show {
          opacity: 1;
          pointer-events: auto;
        }

        .fantasy-book-game .aboutCard {
          width: min(92vw, 520px);
          max-height: min(86vh, 760px);
          overflow: auto;
          padding: 24px 18px 18px;
          border-radius: 22px;
          border: 1px solid rgba(196, 149, 106, 0.25);
          background: linear-gradient(180deg, rgba(16, 9, 4, 0.98), rgba(10, 6, 2, 0.98));
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
        }

        .fantasy-book-game .aboutTitle {
          text-align: center;
          font-size: clamp(32px, 7vw, 44px);
          line-height: 1;
          color: #f5d5a0;
        }

        .fantasy-book-game .aboutTitle em {
          color: var(--amber);
          font-style: normal;
        }

        .fantasy-book-game .aboutKicker {
          text-align: center;
          margin-top: 8px;
          color: rgba(245, 158, 11, 0.66);
          letter-spacing: 0.34em;
          font-size: 10px;
        }

        .fantasy-book-game .aboutStory {
          margin: 14px 0;
          color: #c4956a;
          font-size: 13px;
          line-height: 2;
          text-align: center;
        }

        .fantasy-book-game .aboutQuote {
          margin: 0;
          color: #7a5a30;
          font-family: "Special Elite", serif;
          font-size: 11px;
          line-height: 1.9;
          text-align: center;
          font-style: italic;
          padding: 10px 16px;
          border-left: 2px solid #3d2010;
          border-right: 2px solid #3d2010;
        }

        .fantasy-book-game .aboutClose {
          width: min(100%, 360px);
          margin: 16px auto 0;
          display: block;
          border: none;
          border-radius: 14px;
          padding: 14px 0;
          background: linear-gradient(135deg, #7a2008, #d4500f, #7a2008);
          color: #f5d5a0;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 6px 30px rgba(180, 60, 0, 0.45);
        }

        .fantasy-book-game .aboutClose:hover {
          transform: scale(1.02);
        }

        @keyframes fantasyFloat {
          0%,
          100% {
            transform: translateY(0) rotateX(12deg) rotateY(-10deg);
          }
          50% {
            transform: translateY(-4px) rotateX(13deg) rotateY(-8deg);
          }
        }

        @keyframes ballBounce {
          0%,
          100% {
            transform: translateY(0);
          }
          45% {
            transform: translateY(-7px);
          }
          55% {
            transform: translateY(-5px);
          }
        }

        @keyframes hintPulse {
          0%,
          100% {
            opacity: 0.45;
          }
          50% {
            opacity: 1;
          }
        }

        @media (max-width: 520px) {
          .fantasy-book-game .shell {
            padding-inline: 10px;
          }

          .fantasy-book-game .topbar {
            align-items: flex-start;
          }

          .fantasy-book-game .board {
            gap: 5px;
          }

          .fantasy-book-game .stage {
            height: 330px;
          }

          .fantasy-book-game .bookScene {
            width: min(88vw, 320px);
            height: 228px;
          }
        }
      `}</style>

      <div className="shell">
        <div className="topbar">
          <button className="backBtn" onClick={() => router.back()}>
            <ArrowLeft size={18} />
          </button>

          <div className="brand">
            <div className="kicker title-font">SPORTSFAN360 PRESENTS</div>
            <div className="name title-font">
              BOOK <em>CRICKET</em>
            </div>
          </div>
        </div>

        <div className="gameSwitch" role="tablist" aria-label="Fantasy game switcher">
          <button
            className={`switchBtn ${activeGame === "book" ? "active" : ""}`}
            onClick={() => switchGame("book")}
            role="tab"
            aria-selected={activeGame === "book"}
          >
            <div className="switchTop">
              <span className="switchTag title-font">FANTASY 01</span>
              <span className="switchTitle title-font">BOOK CRICKET</span>
            </div>
            <div className="switchDesc detail-font">Page flip scoring with the classic last-digit rule.</div>
          </button>
          <button
            className={`switchBtn ${activeGame === "circle" ? "active" : ""}`}
            onClick={() => switchGame("circle")}
            role="tab"
            aria-selected={activeGame === "circle"}
          >
            <div className="switchTop">
              <span className="switchTag title-font">FANTASY 02</span>
              <span className="switchTitle title-font">CIRCLE CRICKET</span>
            </div>
            <div className="switchDesc detail-font">Bat, chase, and switch the format from the classic game.</div>
          </button>
        </div>

        {activeGame === "circle" ? (
          <div className="rounded-[22px] border border-[rgba(42,26,10,0.95)] bg-[#05080f] p-2 sm:p-3">
            <CircleCricketGame />
          </div>
        ) : null}

        {activeGame === "book" ? (
          <>
            <div className="board">
              {scoreCard.map((card) => (
                <div className="scoreCard" key={card.label}>
                  <span className="value title-font">{card.value}</span>
                  <span className="label">{card.label}</span>
                </div>
              ))}
            </div>

            <div className="stage">
              <div className={`bookScene ${phase === "idle" ? "idle" : ""} ${phase === "flipping" ? "flipping" : ""}`}>
                <div className="backCover" />
                <div className="pageEdge" />

                <div className="pageOpen" onClick={flipPage} role="button" tabIndex={0}>
                  <div className="pageTop">
                    <span className="detail-font">CHAPTER {currentChapter}</span>
                    <span className="detail-font">BALL {Math.min(balls + 1, maxBalls)} OF {maxBalls}</span>
                  </div>

                  <div className="pageBody">
                    <div className="pageNumber detail-font">{page}</div>
                    {pageLines.map((line, index) => (
                      <div className="line" key={`${page}-${index}`}>
                        <span className="detail-font" style={{ opacity: 0.34 + ((index * 13) % 20) / 100 }}>
                          {line}
                        </span>
                      </div>
                    ))}
                    <svg className="pageRibbon" viewBox="0 0 18 18" aria-hidden="true">
                      <path d="M18,18 Q10,18 18,10 Z" fill="rgba(200,160,100,0.45)" />
                      <path d="M18,18 Q10,18 18,10" fill="none" stroke="rgba(245,200,130,0.7)" strokeWidth="0.8" />
                    </svg>
                  </div>

                  <div className="pageBottom">
                    <span className="detail-font">THE PAGE NUMBER DECIDES YOUR SCORE</span>
                    <span className="detail-font">{history.length ? `${history.length} PLAYED` : "FRESH MATCH"}</span>
                  </div>
                </div>

                <div
                  className={`cover ${bookOpen ? "open" : ""}`}
                  onClick={openBook}
                  role="button"
                  tabIndex={0}
                >
                  <div className="coverTitle title-font">Book Cricket</div>
                  <div className="coverSub detail-font">The Original Classroom Game</div>
                  <div className="coverStage">
                    <div className="ballMark" />
                    <div className="tapHint">TAP TO OPEN</div>
                  </div>
                  <div className="coverFooter">sportsfan360.com</div>
                </div>

                <div className={`sheet ${bookOpen ? "show" : ""}`} />
                <div className="spine" />

                <div className={`reveal ${revealOpen ? "show" : ""}`}>
                  <div className="revealCard">
                    <div
                      className="revealNum title-font"
                      style={{ color: revealResult === "OUT" ? "#ef4444" : revealResult === 6 ? "#22c55e" : revealResult === 4 ? "#60a5fa" : "#f5ead6" }}
                    >
                      {revealResult === "OUT" ? "0" : revealResult}
                    </div>
                    <div
                      className="revealLabel title-font"
                      style={{ color: revealResult === "OUT" ? "#ef4444" : revealResult === 6 ? "#22c55e" : revealResult === 4 ? "#60a5fa" : "#f59e0b" }}
                    >
                      {resultLabel(revealResult)}
                    </div>
                    <div className="revealInfo detail-font">PAGE {revealPage} · LAST DIGIT {revealPage % 10}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tracker">
              <div className="trackerLabel">SCORECARD</div>
              <div className="ballRow">
                {Array.from({ length: maxBalls }, (_, index) => {
                  const result = history[index];
                  const isCurrent = index === balls && !isOver;
                  const className = result
                    ? `ballPill ${result === "OUT" ? "out" : `r${Math.min(result, 6)}`}`
                    : `ballPill ${isCurrent ? "now" : ""}`;
                  const content = result ? (result === "OUT" ? "W" : result === 0 ? "•" : result) : index + 1;

                  return (
                    <div className={className} key={index}>
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="msgRow" aria-live="polite">
              {message}
            </div>

            <div className="controls">
              <button className="mainBtn title-font" onClick={flipPage} disabled={isOver}>
                FLIP THE PAGE
              </button>
            </div>

            <div className="controlRow">
              <button className="ghostBtn" onClick={resetGame}>
                NEW MATCH
              </button>
              <button className="ghostBtn" onClick={() => setShowHow((current) => !current)}>
                HOW TO PLAY
              </button>
            </div>

            {showHow ? (
              <div className="howPanel">
                <h3 className="title-font">HOW TO PLAY</h3>
                <ul>
                  <li>Tap the book to open it.</li>
                  <li>Flip a page to generate a random page number.</li>
                  <li>The last digit of the page number decides your runs.</li>
                  <li>Zero is a wicket. Six is a maximum.</li>
                  <li>You get 12 balls or 3 wickets to build a score.</li>
                </ul>
              </div>
            ) : null}

            <div className="footer">
              <a href="https://sportsfan360.com" target="_blank" rel="noreferrer">
                sportsfan360.com
              </a>
              {' '}— Book Cricket Fantasy
            </div>
          </>
        ) : null}
      </div>

      <div className={`aboutOverlay ${showAbout && activeGame === "book" ? "show" : ""}`}>
        <div className="aboutCard">
          <div className="aboutTitle title-font">
            WHEN CLASSROOMS BECAME<br />
            <em>CRICKET STADIUMS</em>
          </div>
          <div className="aboutKicker detail-font">A NOSTALGIC PAGE-FLIP GAME</div>
          <p className="aboutStory">
            Remember the old classroom ritual: a quiet book, a hidden scorecard, and a page flip that could turn a
            lesson into a legendary innings. This version keeps that feeling alive with the same last-digit scoring
            rule from the attached book cricket reference.
          </p>
          <p className="aboutQuote">
            &quot;No app store. No Wi-Fi. Just a book, a mate, and the hope that the next page would be a six.&quot;
          </p>
          <button className="aboutClose title-font" onClick={() => setShowAbout(false)}>
            LET&apos;S PLAY
          </button>
        </div>
      </div>
    </div>
  );
}