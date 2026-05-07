"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FantasyPage() {
  const router = useRouter();

  const options = [
    {
      id: "fantasy-games",
      title: "Cricket Games",
      description: "Play Book Cricket and Circle Cricket games with friends.",
      icon: "🎮",
      href: "/MainModules/FantasyGames",
      color: "from-amber-900 to-yellow-900",
    },
    {
      id: "fan-battle",
      title: "Fan Battle",
      description: "Compete in head-to-head cricket fantasy battles.",
      icon: "⚔️",
      href: "/MainModules/FanBattle",
      color: "from-red-900 to-orange-900",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12 sm:px-6">
      <style jsx global>{`
        .fantasy-page {
          --text: #f5ead6;
          --muted: #8b7050;
          --amber: #f59e0b;
        }

        .fantasy-page * {
          box-sizing: border-box;
        }

        .fantasy-page .title-font {
          font-family: "Bebas Neue", sans-serif;
          letter-spacing: 0.08em;
        }

        .fantasy-page .detail-font {
          font-family: "Special Elite", serif;
        }
      `}</style>

      <div className="fantasy-page max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <button
            onClick={() => router.back()}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(197,149,106,0.22)] bg-[rgba(20,13,6,0.9)] text-[#c4956a] hover:border-[rgba(245,158,11,0.6)] hover:text-[#f5d5a0] transition-all"
          >
            ← Back
          </button>

          <h1 className="title-font text-4xl sm:text-5xl font-bold text-[#f5d5a0] mb-3">
            FANTASY
          </h1>
          <p className="text-[#8b7050] text-sm max-w-2xl mx-auto">
            Choose your fantasy cricket experience. Play games or battle with friends.
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {options.map((option) => (
            <Link
              key={option.id}
              href={option.href}
              className="group relative overflow-hidden rounded-2xl border border-[rgba(42,26,10,0.95)] transition-all hover:border-[rgba(245,158,11,0.6)] hover:shadow-2xl hover:shadow-amber-900/50"
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-20 group-hover:opacity-30 transition-opacity`}
              />

              {/* Overlay grid */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIEwgMCA2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI0NSwyMDYsMzIsMS4wKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-[0.02]" />

              {/* Content */}
              <div className="relative p-8 sm:p-10 z-10 h-full flex flex-col justify-between min-h-[280px]">
                {/* Icon and Title */}
                <div>
                  <div className="mb-4 text-5xl">{option.icon}</div>
                  <h2 className="title-font text-3xl font-bold text-[#f5d5a0] mb-2">
                    {option.title}
                  </h2>
                  <p className="text-[#c4956a] text-sm leading-relaxed">
                    {option.description}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="mt-8 flex items-center gap-3 text-[#f5d5a0] group-hover:gap-5 transition-all">
                  <span className="font-bold text-sm letter-spacing[0.2em]">EXPLORE</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 rounded-2xl border border-[rgba(245,158,11,0.3)]" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-[#8b6540] text-xs letter-spacing[0.2em]">
            <a
              href="https://sportsfan360.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#f59e0b] hover:underline"
            >
              sportsfan360.com
            </a>
            {' '}— Fantasy Cricket
          </p>
        </div>
      </div>
    </div>
  );
}