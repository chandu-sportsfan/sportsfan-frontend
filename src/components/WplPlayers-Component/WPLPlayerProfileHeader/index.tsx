// // components/WPLPlayerProfile/WPLPlayerProfileHeader/index.tsx
// "use client";

// import { WPLPlayer } from "@/types/wplPlayer";

// interface Props {
//   player: WPLPlayer;
// }

// export default function WPLPlayerProfileHeader({ player }: Props) {
//   const avatarInitial = player.player_name.trim().charAt(0).toUpperCase();

//   return (
//     <div className="flex flex-col items-center gap-4 text-center">
//       {/* Avatar circle */}
//       <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#e91e8c] p-[3px] shrink-0">
//         <div className="w-full h-full rounded-full overflow-hidden bg-[#1a1a1a] flex items-center justify-center text-white text-3xl font-bold">
//           <span aria-hidden="true">{avatarInitial}</span>
//         </div>
//       </div>

//       {/* Name + team */}
//       <div className="space-y-1">
//         <h1 className="text-2xl md:text-3xl font-extrabold text-white">{player.player_name}</h1>
//         <p className="text-[#a78bfa] font-semibold">Women's Premier League</p>
//       </div>

//       {/* Badges */}
//       <div className="flex flex-wrap items-center justify-center gap-2">
//         <span className="rounded-full border border-white/15 px-3 py-1 text-sm text-white">
//           {player.format}
//         </span>
//         <span className="rounded-full bg-[#7c3aed] px-3 py-1 text-sm font-semibold text-white">
//           {player.gender === "female" ? "Women's Cricket" : "Cricket"}
//         </span>
//         {player.jersey_no != null && (
//           <span className="rounded-full border border-[#7c3aed]/60 px-3 py-1 text-sm text-[#a78bfa]">
//             #{player.jersey_no}
//           </span>
//         )}
//       </div>

//       {/* About / tournament */}
//       <div className="w-full rounded-2xl bg-[#1a1a1a] p-4 md:p-5 text-left">
//         <div className="mb-3 flex items-center gap-2">
//           <div className="h-4 w-[3px] rounded-sm bg-[#7c3aed]" />
//           <h2 className="text-lg font-bold text-white">About</h2>
//         </div>
//         <p className="text-sm leading-6 text-[#b5b5b5]">
//           {player.player_name} is a Women&apos;s Premier League (WPL) cricketer competing in the{" "}
//           <span className="text-white font-medium">Women&apos;s T20</span> format. Player ID:{" "}
//           <span className="text-[#a78bfa]">{player.player_id}</span>.
//         </p>
//       </div>
//     </div>
//   );
// }





// components/WPLPlayerProfile/WPLPlayerProfileHeader/index.tsx
"use client";

import { WPLPlayer } from "@/types/wplPlayer";

interface Props {
  player: WPLPlayer;
  tournament?: string | null;
}

// ── Tournament config ─────────────────────────────────────────────────────────

type TournamentConfig = {
  label: string;         // short badge text
  fullName: string;      // shown under player name
  accentColor: string;   // hex for inline styles
  gradientFrom: string;  // Tailwind from-*
  gradientTo: string;    // Tailwind to-*
  badgeBg: string;       // Tailwind bg for the pill
  borderColor: string;   // Tailwind border for jersey badge
  textColor: string;     // Tailwind text for jersey badge
};

const TOURNAMENT_CONFIG: Record<string, TournamentConfig> = {
  womens_ipl: {
    label: "WPL",
    fullName: "Women's Premier League",
    accentColor: "#7c3aed",
    gradientFrom: "from-[#7c3aed]",
    gradientTo: "to-[#e91e8c]",
    badgeBg: "bg-[#7c3aed]",
    borderColor: "border-[#7c3aed]/60",
    textColor: "text-[#a78bfa]",
  },
  womens_t20i: {
    label: "WT20I",
    fullName: "Women's T20 International",
    accentColor: "#0e7490",
    gradientFrom: "from-[#0e7490]",
    gradientTo: "to-[#0891b2]",
    badgeBg: "bg-[#0e7490]",
    borderColor: "border-[#0e7490]/60",
    textColor: "text-[#67e8f9]",
  },
};

function getConfig(tournament?: string | null): TournamentConfig {
  return TOURNAMENT_CONFIG[tournament ?? ""] ?? TOURNAMENT_CONFIG.womens_ipl;
}

export default function WPLPlayerProfileHeader({ player, tournament }: Props) {
  const cfg = getConfig(tournament);
  const avatarInitial = player.player_name.trim().charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center gap-4 text-center">

      {/* Avatar circle */}
      <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${cfg.gradientFrom} ${cfg.gradientTo} p-[3px] shrink-0`}>
        <div className="w-full h-full rounded-full overflow-hidden bg-[#1a1a1a] flex items-center justify-center text-white text-3xl font-bold">
          <span aria-hidden="true">{avatarInitial}</span>
        </div>
      </div>

      {/* Name + tournament */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">{player.player_name}</h1>
        <p className="font-semibold" style={{ color: cfg.accentColor }}>
          {cfg.fullName}
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full border border-white/15 px-3 py-1 text-sm text-white">
          {player.format}
        </span>
        <span className={`rounded-full ${cfg.badgeBg} px-3 py-1 text-sm font-semibold text-white`}>
          {cfg.label}
        </span>
        {player.jersey_no != null && (
          <span className={`rounded-full border ${cfg.borderColor} px-3 py-1 text-sm ${cfg.textColor}`}>
            #{player.jersey_no}
          </span>
        )}
      </div>

      {/* About */}
      <div className="w-full rounded-2xl bg-[#1a1a1a] p-4 md:p-5 text-left">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-4 w-[3px] rounded-sm" style={{ background: cfg.accentColor }} />
          <h2 className="text-lg font-bold text-white">About</h2>
        </div>
        <p className="text-sm leading-6 text-[#b5b5b5]">
          {player.player_name} is a{" "}
          <span className="text-white font-medium">{cfg.fullName}</span> cricketer
          competing in the{" "}
          <span className="text-white font-medium">Women&apos;s T20</span> format.
          Player ID:{" "}
          <span style={{ color: cfg.accentColor }}>{player.player_id}</span>.
        </p>
      </div>
    </div>
  );
}