
// // MainModules/WPLPlayersProfile/WPLPlayerProfileContent.tsx
// "use client";

// import { useEffect, useRef } from "react";
// import { useSearchParams } from "next/navigation";
// import { useWPLPlayerProfile } from "@/context/Wplplayerprofilecontext";
// import WPLPlayerProfileHeader from "@/src/components/WplPlayers-Component/WPLPlayerProfileHeader";
// import WPLPlayerProfileActions from "@/src/components/WplPlayers-Component/WPLPlayerProfileActions";
// import WPLPlayerSeasonStats from "@/src/components/WplPlayers-Component/WPLPlayerSeasonStats";
// import WPLPlayerGamePlan from "@/src/components/WplPlayers-Component/WPLPlayerGamePlan";

// export default function WPLPlayerProfileContent() {
//   const searchParams = useSearchParams();
//   const playerId = searchParams.get("id");
//   const tab      = searchParams.get("tab");

//   const {
//     player,
//     listData,
//     loading,
//     selectPlayer,
//     fetchWPLPlayerList,
//     fetchWPLPlayerById,   // ← direct fetch for search-nav flow
//   } = useWPLPlayerProfile();

//   // Tracks which player id we've already resolved so we don't loop.
//   const resolvedIdRef = useRef<string | null>(null);

//   // ── Step 1: Fetch the first page of the list on mount ────────────────────
//   // This populates listData for the home-page cards AND gives us 20 players
//   // to check against before deciding to do a direct fetch.
//   useEffect(() => {
//     if (!listData) {
//       fetchWPLPlayerList();
//     }
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   // ── Step 2: Resolve the player from the URL id ───────────────────────────
//   // Two paths:
//   //   A) Player is in the already-fetched 20 → selectPlayer() (no extra call)
//   //   B) Player is NOT in the list (came from global search) → fetchWPLPlayerById()
//   useEffect(() => {
//     if (!playerId) return;
//     if (!listData)  return;                          // wait for list to load first
//     if (resolvedIdRef.current === playerId) return;  // already resolved this id

//     resolvedIdRef.current = playerId;

//     const inList = listData.players.find((p) => p.player_id === playerId);

//     if (inList) {
//       // Fast path — already in memory
//       selectPlayer(playerId);
//     } else {
//       // Slow path — player not in first 20, fetch directly by id
//       fetchWPLPlayerById(playerId);
//     }
//   }, [playerId, listData]); // eslint-disable-line react-hooks/exhaustive-deps

//   // ── Step 3: Scroll to tab section after player loads ─────────────────────
//   useEffect(() => {
//     if (loading || !player) return;
//     if (!tab) return;

//     const id =
//       tab === "highlights" ? "wpl-highlights-section" :
//       tab === "stats"      ? "wpl-stats-section"      : null;
//     if (!id) return;

//     const timer = setTimeout(() => {
//       document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
//     }, 100);

//     return () => clearTimeout(timer);
//   }, [tab, loading, player]);

//   // ── Loading ───────────────────────────────────────────────────────────────
//   if (loading || (playerId && !player)) {
//     return (
//       <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center gap-3">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed]" />
//         <p className="text-white text-sm">Loading player data…</p>
//       </div>
//     );
//   }

//   // ── Not found ─────────────────────────────────────────────────────────────
//   if (!player) {
//     return (
//       <div className="min-h-screen bg-[#111] flex items-center justify-center text-white">
//         <div className="text-center">
//           <p className="text-red-400 mb-4">No player data found</p>
//           <button
//             onClick={() => (window.location.href = "/")}
//             className="bg-[#7c3aed] px-4 py-2 rounded text-white hover:bg-[#6d28d9]"
//           >
//             Go Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-[#111111] font-sans">

//       {/* Top nav bar */}
//       <div className="sticky top-0 z-50 flex items-center px-4 md:px-8 lg:px-12 py-3.5 bg-[#111111]/90 backdrop-blur-md border-b border-[#1f1f1f]">
//         <button
//           className="bg-transparent border-0 p-0 cursor-pointer text-[#e0e0e0] flex items-center hover:text-white transition-colors"
//           onClick={() => window.history.back()}
//         >
//           <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
//             <path d="M19 12H5" />
//             <path d="M12 5l-7 7 7 7" />
//           </svg>
//         </button>
//         <span className="flex-1 text-center text-[17px] md:text-xl font-bold text-white tracking-tight">
//           WPL Player Profile
//         </span>
//         <div className="w-[22px]" />
//       </div>

//       <div className="w-full max-w-[1280px] mx-auto">

//         {/* ── Mobile layout ── */}
//         <div className="block lg:hidden">
//           <div className="max-w-[640px] mx-auto">
//             <WPLPlayerProfileHeader player={player} />
//             <WPLPlayerProfileActions player={player} />
//             <WPLPlayerSeasonStats player={player} />
//             <WPLPlayerGamePlan player={player} />
//           </div>
//         </div>

//         {/* ── Desktop layout ── */}
//         <div className="hidden lg:flex lg:items-start lg:gap-6 xl:gap-8 px-8 xl:px-12 py-6">

//           {/* Left sticky panel */}
//           <div className="sticky top-[65px] w-[360px] xl:w-[400px] shrink-0 flex flex-col overflow-y-auto max-h-[calc(100vh-65px)] [scrollbar-width:none]">
//             <WPLPlayerProfileHeader player={player} />
//             <WPLPlayerProfileActions player={player} />
//           </div>

//           {/* Right scrollable panel */}
//           <div className="flex-1 min-w-0 flex flex-col pb-10">
//             <div id="wpl-stats-section">
//               <WPLPlayerSeasonStats player={player} />
//             </div>
//             <div id="wpl-highlights-section">
//               <WPLPlayerGamePlan player={player} />
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }






// MainModules/WPLPlayersProfile/WPLPlayerProfileContent.tsx
"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useWPLPlayerProfile } from "@/context/Wplplayerprofilecontext";
import WPLPlayerProfileHeader from "@/src/components/WplPlayers-Component/WPLPlayerProfileHeader";
import WPLPlayerProfileActions from "@/src/components/WplPlayers-Component/WPLPlayerProfileActions";
import WPLPlayerSeasonStats from "@/src/components/WplPlayers-Component/WPLPlayerSeasonStats";
import WPLPlayerGamePlan from "@/src/components/WplPlayers-Component/WPLPlayerGamePlan";

// ── Tournament label helper ───────────────────────────────────────────────────

function getTournamentLabel(tournament: string | null): string {
  if (tournament === "womens_t20i") return "WT20I Player Profile";
  return "WPL Player Profile"; // default / womens_ipl
}

function getTournamentAccent(tournament: string | null): string {
  if (tournament === "womens_t20i") return "#0e7490"; // cyan
  return "#7c3aed"; // purple (WPL)
}

export default function WPLPlayerProfileContent() {
  const searchParams = useSearchParams();
  const playerId   = searchParams.get("id");
  const tab        = searchParams.get("tab");
  const tournament = searchParams.get("tournament"); // "womens_ipl" | "womens_t20i" | null

  const {
    player,
    listData,
    loading,
    selectPlayer,
    fetchWPLPlayerList,
    fetchWPLPlayerById,
  } = useWPLPlayerProfile();

  const resolvedIdRef = useRef<string | null>(null);

  // ── Step 1: Load list on mount ────────────────────────────────────────────
  useEffect(() => {
    if (!listData) {
      fetchWPLPlayerList();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Step 2: Resolve the player ────────────────────────────────────────────
  // Key includes tournament so that the same player_id in two different
  // tournaments (e.g. Smriti in womens_ipl AND womens_t20i) loads correctly.
  useEffect(() => {
    if (!playerId) return;
    if (!listData) return;

    // Use "id|tournament" as the resolution key
    const resolutionKey = `${playerId}|${tournament ?? ""}`;
    if (resolvedIdRef.current === resolutionKey) return;
    resolvedIdRef.current = resolutionKey;

    // Try to find in list — match both player_id AND tournament if tournament given
    const inList = listData.players.find((p) => {
      const idMatch = p.player_id === playerId;
      if (!tournament) return idMatch;
      return idMatch && (p as unknown as Record<string, string>).tournament === tournament;
    });

    if (inList) {
      selectPlayer(playerId);
    } else {
      // Not in cached list — fetch directly, passing tournament for precision
      fetchWPLPlayerById(playerId, tournament ?? undefined);
    }
  }, [playerId, tournament, listData]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Step 3: Scroll to tab ─────────────────────────────────────────────────
  useEffect(() => {
    if (loading || !player) return;
    if (!tab) return;

    const id =
      tab === "highlights" ? "wpl-highlights-section" :
      tab === "stats"      ? "wpl-stats-section"      : null;
    if (!id) return;

    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timer);
  }, [tab, loading, player]);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading || (playerId && !player)) {
    const accent = getTournamentAccent(tournament);
    return (
      <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center gap-3">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: accent }}
        />
        <p className="text-white text-sm">Loading player data…</p>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!player) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-red-400 mb-4">No player data found</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 rounded text-white"
            style={{ background: getTournamentAccent(tournament) }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const navLabel  = getTournamentLabel(tournament);
  const accent    = getTournamentAccent(tournament);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#111111] font-sans">

      {/* Top nav bar */}
      <div className="sticky top-0 z-50 flex items-center px-4 md:px-8 lg:px-12 py-3.5 bg-[#111111]/90 backdrop-blur-md border-b border-[#1f1f1f]">
        <button
          className="bg-transparent border-0 p-0 cursor-pointer text-[#e0e0e0] flex items-center hover:text-white transition-colors"
          onClick={() => window.history.back()}
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M19 12H5" />
            <path d="M12 5l-7 7 7 7" />
          </svg>
        </button>

        <div className="flex-1 flex flex-col items-center">
          <span className="text-[17px] md:text-xl font-bold text-white tracking-tight">
            {navLabel}
          </span>
          {/* Coloured underline accent to distinguish tournaments */}
          <div
            className="h-[2px] w-10 rounded-full mt-0.5"
            style={{ background: accent }}
          />
        </div>

        <div className="w-[22px]" />
      </div>

      <div className="w-full max-w-[1280px] mx-auto">

        {/* ── Mobile layout ── */}
        <div className="block lg:hidden">
          <div className="max-w-[640px] mx-auto">
            <WPLPlayerProfileHeader player={player} tournament={tournament} />
            <WPLPlayerProfileActions player={player} tournament={tournament} />
            <WPLPlayerSeasonStats player={player} />
            <WPLPlayerGamePlan player={player} />
          </div>
        </div>

        {/* ── Desktop layout ── */}
        <div className="hidden lg:flex lg:items-start lg:gap-6 xl:gap-8 px-8 xl:px-12 py-6">

          {/* Left sticky panel */}
          <div className="sticky top-[65px] w-[360px] xl:w-[400px] shrink-0 flex flex-col overflow-y-auto max-h-[calc(100vh-65px)] [scrollbar-width:none]">
            <WPLPlayerProfileHeader player={player} tournament={tournament} />
            <WPLPlayerProfileActions player={player} tournament={tournament} />
          </div>

          {/* Right scrollable panel */}
          <div className="flex-1 min-w-0 flex flex-col pb-10">
            <div id="wpl-stats-section">
              <WPLPlayerSeasonStats player={player} />
            </div>
            <div id="wpl-highlights-section">
              <WPLPlayerGamePlan player={player} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}