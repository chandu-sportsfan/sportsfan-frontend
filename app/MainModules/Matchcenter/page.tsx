"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type FormResult = "W" | "L" | "N";
type TeamAbbr = "PBKS" | "RCB" | "RR" | "SRH" | "GT" | "CSK" | "DC" | "KKR" | "MI" | "LSG";

interface Team {
  pos: number;
  name: string;
  abbr: TeamAbbr;
  m: number;
  w: number;
  l: number;
  nr: number;
  nrr: number;
  pts: number;
  form: FormResult[];
  qual: boolean;
}

interface BatterStat {
  pos: number;
  player: string;
  team: TeamAbbr;
  mat: number;
  runs: number;
  hs: string;
  avg: number;
  sr: number;
}

interface BowlerStat {
  pos: number;
  player: string;
  team: TeamAbbr;
  mat: number;
  wkts: number;
  bbi: string;
  avg: number;
  econ: number;
}

type TabId = "table" | "orange" | "purple";

const teams: Team[] = [
  { pos: 1, abbr: "PBKS", name: "Punjab Kings", m: 8, w: 6, l: 1, nr: 1, nrr: +1.043, pts: 13, form: ["L", "W", "W", "W", "W"], qual: true },
  { pos: 2, abbr: "RCB", name: "Royal Challengers Bengaluru", m: 8, w: 6, l: 2, nr: 0, nrr: +1.919, pts: 12, form: ["W", "W", "L", "W", "W"], qual: true },
  { pos: 3, abbr: "SRH", name: "Sunrisers Hyderabad", m: 9, w: 6, l: 3, nr: 0, nrr: +0.815, pts: 12, form: ["W", "W", "W", "W", "W"], qual: true },
  { pos: 4, abbr: "RR", name: "Rajasthan Royals", m: 9, w: 6, l: 3, nr: 0, nrr: +0.617, pts: 12, form: ["W", "L", "W", "L", "W"], qual: true },
  { pos: 5, abbr: "GT", name: "Gujarat Titans", m: 8, w: 4, l: 4, nr: 0, nrr: -0.475, pts: 8, form: ["W", "L", "L", "W", "W"], qual: false },
  { pos: 6, abbr: "CSK", name: "Chennai Super Kings", m: 8, w: 3, l: 5, nr: 0, nrr: -0.121, pts: 6, form: ["L", "W", "L", "W", "W"], qual: false },
  { pos: 7, abbr: "DC", name: "Delhi Capitals", m: 8, w: 3, l: 5, nr: 0, nrr: -1.060, pts: 6, form: ["L", "L", "L", "W", "L"], qual: false },
  { pos: 8, abbr: "KKR", name: "Kolkata Knight Riders", m: 8, w: 2, l: 5, nr: 1, nrr: -0.751, pts: 5, form: ["W", "W", "L", "L", "L"], qual: false },
  { pos: 9, abbr: "MI", name: "Mumbai Indians", m: 8, w: 2, l: 6, nr: 0, nrr: -0.736, pts: 4, form: ["L", "W", "L", "L", "L"], qual: false },
  { pos: 10, abbr: "LSG", name: "Lucknow Super Giants", m: 8, w: 2, l: 6, nr: 0, nrr: -1.106, pts: 4, form: ["L", "L", "L", "L", "L"], qual: false },
];

const orangeCapList: BatterStat[] = [
  { pos: 1, player: "V. Sooryavanshi", team: "RR", mat: 9, runs: 400, hs: "103", avg: 44.44, sr: 238.09 },
  { pos: 2, player: "Abhishek Sharma", team: "SRH", mat: 9, runs: 380, hs: "135*", avg: 54.29, sr: 212.29 },
  { pos: 3, player: "KL Rahul", team: "DC", mat: 8, runs: 358, hs: "152*", avg: 51.14, sr: 185.49 },
  { pos: 4, player: "Virat Kohli", team: "RCB", mat: 8, runs: 351, hs: "81", avg: 58.50, sr: 162.50 },
  { pos: 5, player: "H. Klaasen", team: "SRH", mat: 9, runs: 349, hs: "65*", avg: 49.86, sr: 149.78 },
];

const purpleCapList: BowlerStat[] = [
  { pos: 1, player: "Bhuvneshwar Kumar", team: "RCB", mat: 8, wkts: 14, bbi: "5/3", avg: 16.85, econ: 7.61 },
  { pos: 1, player: "Jofra Archer", team: "RR", mat: 9, wkts: 14, bbi: "3/20", avg: 19.50, econ: 8.27 },
  { pos: 1, player: "Anshul Kamboj", team: "CSK", mat: 8, wkts: 14, bbi: "3/22", avg: 16.92, econ: 8.56 },
  { pos: 4, player: "Eshan Malinga", team: "SRH", mat: 9, wkts: 14, bbi: "4/32", avg: 18.21, econ: 9.44 },
  { pos: 5, player: "Prince Yadav", team: "LSG", mat: 8, wkts: 13, bbi: "3/32", avg: 18.61, econ: 8.06 },
];

function FormPill({ result }: { result: FormResult }) {
  const map: Record<FormResult, { bg: string; text: string }> = {
    W: { bg: "bg-green-500/20", text: "text-green-500" },
    L: { bg: "bg-red-500/20", text: "text-red-500" },
    N: { bg: "bg-gray-500/20", text: "text-gray-400" },
  };
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${map[result].bg} ${map[result].text} text-xs font-bold`}>
      {result}
    </span>
  );
}

function NRR({ value }: { value: number }) {
  return (
    <span className={value >= 0 ? "text-green-500" : "text-red-500"}>
      {(value >= 0 ? "+" : "") + value.toFixed(3)}
    </span>
  );
}

export default function IPLPointsTable() {
  const [tab, setTab] = useState<TabId>("table");

  const tabs: { id: TabId; label: string }[] = [
    { id: "table", label: "Points Table" },
    { id: "orange", label: "Orange Cap" },
    { id: "purple", label: "Purple Cap" },
  ];

  return (
    <>
    <div className="mt-15 ml-5 lg:ml-20">
      <Link href="/MainModules/HomePage" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition cursor-pointer">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>
      </Link>
      </div>

      <div className="max-w-7xl mx-auto mt-4 pb-4 mb-20 w-[300px] sm:w-[300px] md:w-[750px] lg:w-[1400px] bg-[#0d0d10] rounded-2xl border border-[#2a2a2e] overflow-hidden [scrollbar-height:none]">
      {/* //  style={{ overscrollBehavior: 'contain' }} */}
        {/* Tab Bar - stays fixed */}
        <div className="flex border-b border-[#2a2a2e] px-2 overflow-x-auto">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-2 sm:px-4 py-3 text-sm sm:text-base font-medium transition-all whitespace-nowrap ${tab === id
                  ? "text-[#C9115F] border-b-2 border-[#C9115F]"
                  : "text-gray-400 hover:text-gray-300"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Scrollable Table Container - ONLY THIS scrolls */}
        <div className="overflow-y-auto overflow-x-auto max-h-[400px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Points Table */}
          {tab === "table" && (
            <table className="w-full min-w-[600px]">
              <thead className="bg-[#1a1a1e] sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">M</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">W</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">L</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">NR</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">NRR</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Pts</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Form</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e22]">
                {teams.map((t) => (
                  <tr key={t.abbr} className="hover:bg-[#1a1a1e] transition-colors">
                    <td className="px-3 py-3 text-sm text-gray-500">{t.pos}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        {t.qual && (
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        )}
                        <span className="font-semibold text-white text-sm">{t.abbr}</span>
                        <span className="text-gray-500 text-xs hidden sm:inline">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-sm text-gray-300">{t.m}</td>
                    <td className="px-3 py-3 text-center text-sm text-green-500 font-semibold">{t.w}</td>
                    <td className="px-3 py-3 text-center text-sm text-red-500">{t.l}</td>
                    <td className="px-3 py-3 text-center text-sm text-gray-500">{t.nr}</td>
                    <td className="px-3 py-3 text-center text-sm"><NRR value={t.nrr} /></td>
                    <td className="px-3 py-3 text-center text-sm text-white font-semibold">{t.pts}</td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1 justify-center">
                        {t.form.map((f, j) => <FormPill key={j} result={f} />)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Orange Cap Table */}
          {tab === "orange" && (
            <table className="w-full min-w-[500px]">
              <thead className="bg-[#1a1a1e] sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Player</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Mat</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Runs</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">HS</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Avg</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">SR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e22]">
                {orangeCapList.map((p, i) => (
                  <tr key={i} className="hover:bg-[#1a1a1e] transition-colors">
                    <td className="px-3 py-3 text-sm text-gray-500">{p.pos}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-white">{p.player}</td>
                    <td className="px-3 py-3 text-center text-sm text-gray-400">{p.team}</td>
                    <td className="px-3 py-3 text-center text-sm text-gray-300">{p.mat}</td>
                    <td className="px-3 py-3 text-center text-sm text-white font-semibold">{p.runs}</td>
                    <td className="px-3 py-3 text-center text-sm text-gray-300">{p.hs}</td>
                    <td className="px-3 py-3 text-center text-sm text-gray-300">{p.avg.toFixed(2)}</td>
                    <td className="px-3 py-3 text-center text-sm text-green-500">{p.sr.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Purple Cap Table */}
          {tab === "purple" && (
            <table className="w-full min-w-[500px]">
              <thead className="bg-[#1a1a1e] sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">#</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Player</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Mat</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Wkts</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">BBI</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Avg</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Econ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e22]">
                {purpleCapList.map((p, i) => (
                  <tr key={i} className="hover:bg-[#1a1a1e] transition-colors">
                    <td className="px-3 py-3 text-sm text-gray-500">{p.pos}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-white">{p.player}</td>
                    <td className="px-3 py-3 text-center text-sm text-gray-400">{p.team}</td>
                    <td className="px-3 py-3 text-center text-sm text-gray-300">{p.mat}</td>
                    <td className="px-3 py-3 text-center text-sm text-white font-semibold">{p.wkts}</td>
                    <td className="px-3 py-3 text-center text-sm text-gray-300">{p.bbi}</td>
                    <td className="px-3 py-3 text-center text-sm text-gray-300">{p.avg.toFixed(2)}</td>
                    <td className="px-3 py-3 text-center text-sm text-green-500">{p.econ.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}