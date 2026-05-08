"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FantasyGamesHub() {
  const router = useRouter();

  const games = [
    {
      id: "book-cricket",
      title: "Book Cricket",
      subtitle: "Classic Classroom Game",
      description: "Flip pages to generate random page numbers. The last digit decides your score. Get 12 balls or 3 wickets.",
      icon: "📖",
      color: "from-amber-900 to-yellow-900",
      href: "/MainModules/FantasyGames/book-cricket",
    },
    {
      id: "circle-cricket",
      title: "Circle Cricket",
      subtitle: "Fast-Paced Action",
      description: "Bat, chase, and swing the format. Experience the dynamic circle-based cricket game with instant feedback.",
      icon: "🎯",
      color: "from-blue-900 to-cyan-900",
      href: "/MainModules/FantasyGames/circle-cricket",
    },
    {
      id: "hand-cricket",
      title: "Hand Cricket",
      subtitle: "Classic Hand Cricket",
      description: "Play the traditional hand-cricket game — choose odd/even, bowl and bat using hand gestures or taps.",
      icon: "🤚",
      color: "from-red-900 to-pink-700",
      href: "/MainModules/FantasyGames/hand-cricket",
    },
    {
      id: "coming-soon",
      title: "Coming Soon",
      subtitle: "More Games Ahead",
      description: "We're working on exciting new cricket fantasy games. Stay tuned for more thrilling gaming experiences coming your way.",
      icon: "🚀",
      color: "from-purple-900 to-pink-900",
      href: null,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12 sm:px-6">
      <style jsx global>{`
        .fantasy-hub {
          --text: #f5ead6;
          --muted: #8b7050;
          --amber: #f59e0b;
          --bg: #090603;
        }

        .fantasy-hub * {
          box-sizing: border-box;
        }

        .fantasy-hub .title-font {
          font-family: "Bebas Neue", sans-serif;
          letter-spacing: 0.08em;
        }

        .fantasy-hub .detail-font {
          font-family: "Special Elite", serif;
        }
      `}</style>

      <div className="fantasy-hub max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="title-font text-4xl sm:text-5xl font-bold text-[#f5d5a0] mb-2">
            FANTASY GAMES
          </h1>
          <p className="text-[#c4956a] text-sm sm:text-base letter-spacing[0.2em] mb-2">
            SPORTSFAN360 PRESENTS
          </p>
          <p className="text-[#8b7050] text-sm max-w-2xl mx-auto">
            Choose your cricket experience. Pick a game, test your skills, and build your fantasy cricket legacy.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => {
            const commonClassName = "group relative overflow-hidden rounded-2xl border border-[rgba(42,26,10,0.95)] transition-all";
            
            if (game.href) {
              return (
                <Link 
                  key={game.id} 
                  href={game.href} 
                  className={`${commonClassName} hover:border-[rgba(245,158,11,0.6)] hover:shadow-2xl hover:shadow-amber-900/50 cursor-pointer`}
                >
                  <CardInner game={game} />
                </Link>
              );
            }

            return (
              <div 
                key={game.id} 
                className={`${commonClassName} opacity-75 cursor-not-allowed`}
              >
                <CardInner game={game} />
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <p className="text-[#8b6540] text-xs letter-spacing[0.2em]">
            <a href="https://sportsfan360.com" target="_blank" rel="noreferrer" className="text-[#f59e0b] hover:underline">
              sportsfan360.com
            </a>
            {' '}— Fantasy Cricket Games
          </p>
        </div>
      </div>
    </div>
  );
}

interface FantasyGame {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  href: string | null;
}

function CardInner({ game }: { game: FantasyGame }) {
  return (
    <>
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-20 group-hover:opacity-30 transition-opacity`}
      />

      {/* Overlay grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIEwgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI0NSwyMDYsMzIsMS4wKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-[0.02]" />

      {/* Content */}
      <div className="relative p-8 sm:p-10 z-10 h-full flex flex-col justify-between">
        {/* Icon and Title */}
        <div>
          <div className="mb-4 text-5xl">{game.icon}</div>
          <h2 className="title-font text-3xl font-bold text-[#f5d5a0] mb-1">
            {game.title}
          </h2>
          <p className="detail-font text-sm text-[#f59e0b] mb-4">
            {game.subtitle}
          </p>
          <p className="text-[#c4956a] text-sm leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Play Button */}
        {game.href && (
          <div className="mt-8 flex items-center gap-3 text-[#f5d5a0] group-hover:gap-5 transition-all">
            <span className="font-bold text-sm letter-spacing[0.2em]">PLAY NOW</span>
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </div>
        )}
        {!game.href && (
          <div className="mt-8 flex items-center gap-3 text-[#8b7050]">
            <span className="font-bold text-sm letter-spacing[0.2em]">COMING SOON</span>
          </div>
        )}
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 rounded-2xl border border-[rgba(245,158,11,0.3)] shadow-inset" />
      </div>
    </>
  );
}
