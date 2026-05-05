"use client";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─── Types (mirror route.ts exports) ─────────────────────────────────────────

interface TeamRow {
  rank: number;
  abbr: string;
  name: string;
  qualified: boolean;
  m: number;
  w: number;
  l: number;
  nr: number;
  pts: number;
  nrr: string;
}

interface PlayerRow {
  rank: number;
  player: string;
  team: string;
  m: number;
  runs?: number;
  wickets?: number;
  avg: string;
  sr: string;
  hs?: string;
  econ?: string;
}

interface StatsData {
  pointsTable: TeamRow[];
  orangeCap: PlayerRow[];
  purpleCap: PlayerRow[];
}

type TabId   = "table" | "caps";
type CapTab  = "orange" | "purple";

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Team logo + name cell used in the points table */
function TeamCell({ abbr, name }: { abbr: string; name: string }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
        {/* Strictly lowercase <img>, NO 'fill' property! */}
        <img
          src={`/teams/${abbr.toUpperCase()}.png`}
          alt={abbr}
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-white font-medium whitespace-nowrap">{name}</span>
    </div>
  );
}

/** Player + team logo cell used in both cap tables */
function PlayerCell({ player, teamAbbr }: { player: string; teamAbbr: string }) {
  return (
    <div className="flex items-center gap-2">
      {/* Team logo next to player name */}
      <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
        {/* Swapped to standard HTML <img>, pointing to the '/teams/' folder with uppercase */}
        <img
          src={`/teams/${teamAbbr.toUpperCase()}.png`}
          alt={teamAbbr}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="min-w-0">
        <p className="text-white font-medium whitespace-nowrap">{player}</p>
        <p className="text-gray-500 text-xs">{teamAbbr}</p>
      </div>
    </div>
  );
}

// ─── Points Table ─────────────────────────────────────────────────────────────

function PointsTable({ rows }: { rows: TeamRow[] }) {
  return (
    /*
     * TASK 1 FIX — mobile horizontal scroll
     * ───────────────────────────────────────
     * ① Outer div: overflow-x-auto   → creates a scroll container
     *                                   without letting the PAGE scroll sideways
     * ② table:     min-w-[640px]     → forces the table to its natural width
     *                                   so columns never squish
     * ③ th / td:   whitespace-nowrap → prevents header labels from line-wrapping
     */
    <div className="overflow-x-auto rounded-xl">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="text-gray-500 text-xs uppercase tracking-wider">
            <th className="py-3 px-3 text-left w-8">#</th>
            <th className="py-3 px-3 text-left min-w-[160px]">Team</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">M</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">W</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">L</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">NR</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">PTS</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">NRR</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((team) => (
            <tr
              key={team.abbr}
              className={`border-t border-[#1e1e22] hover:bg-[#1a1a1e] transition-colors ${
                team.qualified ? "border-l-2 border-l-yellow-500" : ""
              }`}
            >
              {/* Rank */}
              <td className={`py-3 px-3 font-bold text-sm ${team.qualified ? "text-yellow-400" : "text-gray-500"}`}>
                {team.rank}
              </td>

              {/* TASK 2 — team logo + name */}
              <td className="py-3 px-3">
                <TeamCell abbr={team.abbr} name={team.name} />
              </td>

              {/* Stats columns — whitespace-nowrap stops wrapping on small screens */}
              <td className="py-3 px-3 text-center text-gray-300 whitespace-nowrap">{team.m}</td>
              <td className="py-3 px-3 text-center text-green-400 font-semibold whitespace-nowrap">{team.w}</td>
              <td className="py-3 px-3 text-center text-red-400  font-semibold whitespace-nowrap">{team.l}</td>
              <td className="py-3 px-3 text-center text-gray-400 whitespace-nowrap">{team.nr}</td>
              <td className="py-3 px-3 text-center text-white   font-bold whitespace-nowrap">{team.pts}</td>
              <td className={`py-3 px-3 text-center font-medium whitespace-nowrap ${
                String(team.nrr).startsWith("+") ? "text-green-400" : "text-red-400"
              }`}>
                {team.nrr}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Orange Cap Table ─────────────────────────────────────────────────────────

function OrangeCapTable({ rows }: { rows: PlayerRow[] }) {
  return (
    /* TASK 3 FIX — same overflow-x-auto pattern for the caps table */
    <div className="overflow-x-auto rounded-xl">
      <table className="w-full min-w-[580px] border-collapse text-sm">
        <thead>
          <tr className="text-gray-500 text-xs uppercase tracking-wider">
            <th className="py-3 px-3 text-left w-8">#</th>
            <th className="py-3 px-3 text-left min-w-[160px]">Player</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">MAT</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">RUNS</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">AVG</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">SR</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">HS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr
              key={`${p.rank}-${p.player}`}
              className="border-t border-[#1e1e22] hover:bg-[#1a1a1e] transition-colors"
            >
              <td className="py-3 px-3 text-orange-400 font-bold">{p.rank}</td>
              <td className="py-3 px-3">
                <PlayerCell player={p.player} teamAbbr={p.team} />
              </td>
              <td className="py-3 px-3 text-center text-gray-300 whitespace-nowrap">{p.m}</td>
              <td className="py-3 px-3 text-center text-orange-400 font-bold whitespace-nowrap">{p.runs}</td>
              <td className="py-3 px-3 text-center text-gray-300 whitespace-nowrap">{p.avg}</td>
              <td className="py-3 px-3 text-center text-gray-300 whitespace-nowrap">{p.sr}</td>
              <td className="py-3 px-3 text-center text-gray-300 whitespace-nowrap">{p.hs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Purple Cap Table ─────────────────────────────────────────────────────────

function PurpleCapTable({ rows }: { rows: PlayerRow[] }) {
  return (
    /* TASK 3 FIX — same overflow-x-auto pattern */
    <div className="overflow-x-auto rounded-xl">
      <table className="w-full min-w-[580px] border-collapse text-sm">
        <thead>
          <tr className="text-gray-500 text-xs uppercase tracking-wider">
            <th className="py-3 px-3 text-left w-8">#</th>
            <th className="py-3 px-3 text-left min-w-[160px]">Player</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">MAT</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">WKT</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">AVG</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">ECON</th>
            <th className="py-3 px-3 text-center whitespace-nowrap">BEST</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr
              key={`${p.rank}-${p.player}`}
              className="border-t border-[#1e1e22] hover:bg-[#1a1a1e] transition-colors"
            >
              <td className="py-3 px-3 text-purple-400 font-bold">{p.rank}</td>
              <td className="py-3 px-3">
                <PlayerCell player={p.player} teamAbbr={p.team} />
              </td>
              <td className="py-3 px-3 text-center text-gray-300 whitespace-nowrap">{p.m}</td>
              <td className="py-3 px-3 text-center text-purple-400 font-bold whitespace-nowrap">{p.wickets}</td>
              <td className="py-3 px-3 text-center text-gray-300 whitespace-nowrap">{p.avg}</td>
              <td className="py-3 px-3 text-center text-gray-300 whitespace-nowrap">{p.econ}</td>
              <td className="py-3 px-3 text-center text-gray-300 whitespace-nowrap">{p.hs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Caps section wrapper (orange / purple sub-tabs) ─────────────────────────

function CapsSection({
  orangeCap,
  purpleCap,
}: {
  orangeCap: PlayerRow[];
  purpleCap: PlayerRow[];
}) {
  const [capTab, setCapTab] = useState<CapTab>("orange");

  return (
    <div>
      {/* Sub-tab pills */}
      <div className="flex gap-2 mb-4 px-1">
        <button
          onClick={() => setCapTab("orange")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            capTab === "orange"
              ? "bg-orange-500 text-white"
              : "bg-[#1a1a1e] text-gray-400 hover:text-white"
          }`}
        >
          🟠 Orange Cap
        </button>
        <button
          onClick={() => setCapTab("purple")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
            capTab === "purple"
              ? "bg-purple-600 text-white"
              : "bg-[#1a1a1e] text-gray-400 hover:text-white"
          }`}
        >
          🟣 Purple Cap
        </button>
      </div>

      {capTab === "orange"
        ? <OrangeCapTable rows={orangeCap} />
        : <PurpleCapTable rows={purpleCap} />}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IPLPointsTable() {
  const [tab, setTab]       = useState<TabId>("table");
  const [data, setData]     = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ipl-stats`);
        if (!res.ok) throw new Error("fetch failed");
        setData(await res.json());
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const tabs: { id: TabId; label: string }[] = [
    { id: "table", label: "Points Table" },
    { id: "caps",  label: "Orange/Purple Cap" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d10] flex items-center justify-center">
        <p className="text-white">Loading IPL 2026 Stats…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0d0d10] flex items-center justify-center">
        <p className="text-red-400">Failed to load stats. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d10] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Back button */}
        <Link
          href="/MainModules/HomePage"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </Link>

        {/* Card */}
        <div className="bg-[#0d0d10] rounded-2xl border border-[#2a2a2e] overflow-hidden flex flex-col">

          {/* Tab bar */}
          <div className="flex border-b border-[#2a2a2e] px-4 bg-[#0d0d10] z-10 relative">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-6 py-4 text-sm font-medium transition-all cursor-pointer ${
                  tab === id
                    ? "text-[#C9115F] border-b-2 border-[#C9115F]"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-2 sm:p-4">
            {tab === "table"
              ? <PointsTable rows={data.pointsTable} />
              : <CapsSection orangeCap={data.orangeCap} purpleCap={data.purpleCap} />}
          </div>

        </div>
      </div>
    </div>
  );
}
