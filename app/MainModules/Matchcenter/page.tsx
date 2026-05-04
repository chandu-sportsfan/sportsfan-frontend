"use client";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type FormResult = "W" | "L" | "N";
type TeamAbbr = string;

interface Team {
  pos: number;
  name: string;
  abbr: TeamAbbr;
  m: number;
  w: number;
  l: number;
  nr: number;
  nrr: string | number; 
  pts: number;
  form: FormResult[];
  qual: boolean;
}

interface UpcomingMatch {
  id: string;
  name: string;
  date: string;
  venue: string;
  teams: string;
}

// 1. NEW INTERFACE: For our Recent Results
interface RecentResult {
  id: string;
  name: string;
  date: string;
  result: string;
}

// 2. UPDATED TABS: Added the "recent" tab
type TabId = "table" | "upcoming" | "recent";

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

function NRR({ value }: { value: string | number }) {
  const numValue = Number(value);
  return (
    <span className={numValue >= 0 ? "text-green-500" : "text-red-500"}>
      {(numValue >= 0 ? "+" : "") + numValue.toFixed(3)}
    </span>
  );
}

export default function IPLPointsTable() {
    const [tab, setTab] = useState<TabId>("table");
    
    const [teams, setTeams] = useState<Team[]>([]);
    const [upcomingMatches, setUpcomingMatches] = useState<UpcomingMatch[]>([]);
    // 3. NEW STATE: To hold our recent results data
    const [recentResults, setRecentResults] = useState<RecentResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/ipl-stats");
                if (!res.ok) throw new Error("Network response was not ok");
                
                const data = await res.json();
                
                setTeams(data.pointsTable || []);
                setUpcomingMatches(data.upcomingMatches || []); 
                // Catch the new data from the backend!
                setRecentResults(data.recentResults || []); 
            } catch (error) {
                console.error("Error fetching real-time stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const tabs: { id: TabId; label: string }[] = [
        { id: "table", label: "Points Table" },
        { id: "upcoming", label: "Upcoming Matches" },
        { id: "recent", label: "Recent Results" }, // Added to the navigation!
    ];

    if (loading) {
        return <div className="text-white text-center mt-20">Loading real-time stats...</div>;
    }

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
        
        {/* Tab Bar */}
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

        {/* Scrollable Container */}
        <div className="overflow-y-auto overflow-x-auto max-h-[400px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Points Table Tab */}
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

          {/* Upcoming Matches Tab */}
          {tab === "upcoming" && (
             // ... (Keep your exact upcoming matches table here) ...
             <table className="w-full min-w-[500px]">
              <thead className="bg-[#1a1a1e] sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Match</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Teams</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Venue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e22]">
                {upcomingMatches.length > 0 ? (
                    upcomingMatches.map((match) => (
                    <tr key={match.id} className="hover:bg-[#1a1a1e] transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-400 whitespace-nowrap">
                            {new Date(match.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300">{match.name}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-white">{match.teams}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{match.venue}</td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">
                            No upcoming matches found.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          )}

          {/* 4. NEW UI: Recent Results Tab */}
          {tab === "recent" && (
            <table className="w-full min-w-[500px]">
              <thead className="bg-[#1a1a1e] sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Match</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e22]">
                {recentResults.length > 0 ? (
                    recentResults.map((match) => (
                    <tr key={match.id} className="hover:bg-[#1a1a1e] transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-400 whitespace-nowrap w-32">
                            {new Date(match.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300 w-1/3">{match.name}</td>
                        <td className="px-4 py-4 text-sm font-semibold text-green-500">{match.result}</td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-gray-500 text-sm">
                            No recent results available yet.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          )}
          
        </div>
      </div>
    </>
  );
}
