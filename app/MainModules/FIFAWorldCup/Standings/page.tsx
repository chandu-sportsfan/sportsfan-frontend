"use client";

import React from "react";
import Link from "next/link";
import { Calendar, MapPin, Trophy, Users, ChevronRight, Play } from "lucide-react";

// Mock Data Arrays for mapping (matches the image)
const upcomingMatches = [
  { date: "11 JUN", t1: "MEX", t1Img: "/images/flags/mexico.png", t2: "CAN", t2Img: "/images/flags/canada.png", time: "7:00 PM", venue: "Estadio Azteca" },
  { date: "11 JUN", t1: "USA", t1Img: "/images/flags/usa.png", t2: "CZE", t2Img: "/images/flags/czech.png", time: "8:00 PM", venue: "AT&T Stadium" },
  { date: "12 JUN", t1: "ESP", t1Img: "/images/flags/spain.png", t2: "BRA", t2Img: "/images/flags/brazil.png", time: "6:00 PM", venue: "MetLife Stadium" },
];

const groups = [
  { name: "GROUP A", teams: ["Mexico", "South Africa", "Korea Republic", "EURO Play-off D"] },
  { name: "GROUP B", teams: ["Canada", "Qatar", "Switzerland", "EURO Play-off A"] },
  { name: "GROUP C", teams: ["Brazil", "Morocco", "Haiti", "Scotland"] },
  { name: "GROUP D", teams: ["USA", "Paraguay", "Australia", "UEFA Play-off C"] },
];

const topPlayers = [
  { name: "Lionel Messi", country: "Argentina", num: 10, img: "/images/players/messi.png" },
  { name: "Kylian Mbappé", country: "France", num: 9, img: "/images/players/mbappe.png" },
  { name: "Erling Haaland", country: "Norway", num: 9, img: "/images/players/haaland.png" },
  { name: "Jude Bellingham", country: "England", num: 10, img: "/images/players/bellingham.png" },
  { name: "Vinícius Júnior", country: "Brazil", num: 10, img: "/images/players/vinicius.png" },
];

export default function FIFAMatchCenter() {
  return (
    <div className="min-h-screen bg-[#05050A] text-white p-4 lg:p-6 font-sans">
      
      {/* --- TOP ROW --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        
        {/* Hero Card (Spans 2 columns) */}
       <div
  className="xl:col-span-2 relative rounded-3xl overflow-hidden"
  style={{
    backgroundImage: `
      linear-gradient(
        90deg,
        rgba(5,5,25,.95) 0%,
        rgba(5,5,25,.85) 40%,
        rgba(5,5,25,.4) 100%
      ),
      url('/fifa/stadium-bg.jpg')
    `,
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}
>
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 w-[400px] h-full bg-gradient-to-l from-[#C9115F]/30 via-purple-600/20 to-transparent pointer-events-none" />
          
          <div className="p-6 lg:p-8 flex flex-col md:flex-row justify-between relative z-10">
            <div className="max-w-xl">
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                FIFA WORLD CUP 2026™
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-300 mb-4 font-medium">
                <span className="flex items-center gap-1"><Calendar size={16} className="text-gray-400"/> 11 JUNE - 19 JULY 2026</span>
                <span className="flex items-center gap-1"><MapPin size={16} className="text-gray-400"/> USA • CANADA • MEXICO</span>
              </div>
              <p className="text-sm text-gray-400 mb-8 leading-relaxed max-w-md">
                The biggest stage in football returns! 48 nations, 104 matches, across 16 iconic host cities. One world. One trophy.
              </p>

              {/* Stat Badges */}
              <div className="flex flex-wrap gap-3">
                {[ 
                  { icon: <Users size={16} className="text-pink-500"/>, val: "48", label: "Teams" },
                  { icon: <Play size={16} className="text-purple-500"/>, val: "104", label: "Matches" },
                  { icon: <MapPin size={16} className="text-orange-500"/>, val: "16", label: "Host Cities" },
                  { icon: <Trophy size={16} className="text-yellow-500"/>, val: "1", label: "Trophy" },
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#1A1A24] border border-white/5 rounded-xl px-4 py-2">
                    {stat.icon}
                    <div>
                      <div className="text-lg font-bold leading-none">{stat.val}</div>
                      <div className="text-[10px] text-gray-500 uppercase">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="mt-8 md:mt-0 flex flex-col items-center justify-center backdrop-blur-xl
bg-white/5
border border-white/10
shadow-[0_0_40px_rgba(236,72,153,0.15)] backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mb-4">Countdown to Kickoff</p>
              <div className="flex gap-3">
                {[ 
                  { val: "125", label: "DAYS" },
                  { val: "18", label: "HRS" },
                  { val: "42", label: "MINS" },
                  { val: "28", label: "SECS" },
                ].map((time, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="bg-[#11111A] border border-white/10 rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold mb-2">
                      {time.val}
                    </div>
                    <span className="text-[10px] text-gray-500 tracking-wider">{time.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Match Card */}
        <div className="bg-[#11111A] border border-white/10 rounded-2xl p-6 flex flex-col relative overflow-hidden">
          {/* Diagonal slash background effect */}
          <div className="absolute right-0 bottom-0 w-full h-full bg-gradient-to-tl from-[#C9115F]/20 via-transparent to-transparent opacity-50" />
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="text-sm font-bold tracking-wider">NEXT MATCH</h3>
            <span className="text-[11px] text-gray-400 cursor-pointer hover:text-white flex items-center">View All <ChevronRight size={14}/></span>
          </div>

          <div className="flex justify-between items-center px-4 relative z-10 flex-grow">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center bg-green-900/30 overflow-hidden">
                <img src="/images/flags/mexico.png" alt="MEX" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold tracking-wider">MEXICO</span>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
              VS
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center bg-red-900/30 overflow-hidden">
                <img src="/images/flags/canada.png" alt="CAN" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold tracking-wider">CANADA</span>
            </div>
          </div>

          <div className="text-center mt-6 relative z-10">
            <p className="text-[11px] text-gray-300 flex items-center justify-center gap-2 mb-1">
              <Calendar size={12}/> 11 JUN 2026 • 7:00 PM LOCAL
            </p>
            <p className="text-[11px] text-gray-500 flex items-center justify-center gap-2 mb-6">
              <MapPin size={12}/> Estadio Azteca, Mexico City
            </p>
            <button className="w-full py-3 rounded-xl border border-[#C9115F] text-[#C9115F] font-bold text-xs tracking-wider hover:bg-[#C9115F] hover:text-white transition-all flex items-center justify-center gap-2">
              MATCH CENTRE <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* --- MIDDLE ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        
        {/* Upcoming Matches */}
        <div className="bg-[#11111A] border border-white/10 rounded-2xl p-5 lg:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[12px] font-bold tracking-wider uppercase">Upcoming Matches</h3>
            <span className="text-[10px] text-gray-400 cursor-pointer">View Full Schedule</span>
          </div>
          
          <div className="flex flex-col gap-3 flex-grow">
            {upcomingMatches.map((match, i) => (
              <div key={i} className="flex items-center justify-between bg-[#1A1A24] rounded-xl p-3 border border-white/5">
                <div className="text-center pr-3 border-r border-white/10">
                  <div className="text-sm font-bold">{match.date.split(' ')}</div>
                  <div className="text-[9px] text-gray-500">{match.date.split(' ')}</div>
                </div>
                
                <div className="flex items-center gap-3 flex-grow px-3">
                  <span className="text-xs font-bold w-8 text-right">{match.t1}</span>
                  <div className="w-5 h-5 rounded-full bg-gray-800" /> {/* Flag placeholder */}
                  <span className="text-[10px] text-gray-500">VS</span>
                  <div className="w-5 h-5 rounded-full bg-gray-800" /> {/* Flag placeholder */}
                  <span className="text-xs font-bold w-8">{match.t2}</span>
                </div>

                <div className="text-right pl-2">
                  <div className="text-[10px] text-pink-500 font-bold">{match.time}</div>
                  <div className="text-[9px] text-gray-500 truncate w-20">{match.venue}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-[11px] font-bold text-[#C9115F] tracking-wider py-2 hover:bg-white/5 rounded-lg transition-colors flex justify-center items-center gap-1">
            VIEW ALL MATCHES <ChevronRight size={14} />
          </button>
        </div>

        {/* Group Stage Overview */}
        <div className="bg-[#11111A] border border-white/10 rounded-2xl p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[12px] font-bold tracking-wider uppercase">Group Stage Overview</h3>
            <span className="text-[11px] text-gray-400 cursor-pointer flex items-center">View Groups <ChevronRight size={14}/></span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {groups.map((group, idx) => {
               // Dynamic border colors based on index matching your design
               const borderColors = ['border-[#C9115F]/50', 'border-purple-500/50', 'border-orange-500/50', 'border-blue-500/50'];
               return (
                <div key={idx} className={`bg-[#1A1A24] border ${borderColors[idx]} rounded-xl p-3 flex flex-col`}>
                  <h4 className="text-[10px] font-bold text-center mb-3 text-gray-400 tracking-wider">{group.name}</h4>
                  <div className="flex flex-col gap-2 flex-grow">
                    {group.teams.map((team, tIdx) => (
                      <div key={tIdx} className="flex items-center gap-2 text-[11px]">
                        <div className="w-4 h-4 rounded-full bg-gray-700 flex-shrink-0" />
                        <span className="truncate text-gray-300">{team}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center text-[10px] text-[#C9115F] font-semibold cursor-pointer">View Group</div>
                </div>
               );
            })}
          </div>
        </div>

        {/* Host Cities */}
        <div className="bg-[#11111A] border border-white/10 rounded-2xl p-5 lg:col-span-1">
           <div className="flex justify-between items-center mb-4">
            <h3 className="text-[12px] font-bold tracking-wider uppercase">Host Cities</h3>
            <span className="text-[11px] text-gray-400 cursor-pointer flex items-center">View All <ChevronRight size={14}/></span>
          </div>
          <div className="flex gap-2 h-[140px]">
            {/* Example City Card */}
            <div className="flex-1 rounded-xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gray-800" /> {/* Img placeholder */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 flex flex-col justify-end">
                <span className="text-[9px] font-bold">Mexico City</span>
                <span className="text-[8px] text-gray-400 truncate">Estadio Azteca</span>
                <span className="text-[8px] mt-1 text-green-500 bg-green-500/20 px-1 py-0.5 rounded w-fit">MEX</span>
              </div>
            </div>
            {/* Example City Card 2 */}
             <div className="flex-1 rounded-xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gray-800" /> {/* Img placeholder */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 flex flex-col justify-end">
                <span className="text-[9px] font-bold">New York / NJ</span>
                <span className="text-[8px] text-gray-400 truncate">MetLife Stadium</span>
                <span className="text-[8px] mt-1 text-blue-500 bg-blue-500/20 px-1 py-0.5 rounded w-fit">USA</span>
              </div>
            </div>
            {/* View More Card */}
            <div className="flex-1 rounded-xl overflow-hidden relative bg-[#C9115F]/20 border border-[#C9115F]/30 flex flex-col items-center justify-center cursor-pointer hover:bg-[#C9115F]/30 transition-colors">
              <span className="text-xl font-bold text-white">+13</span>
              <span className="text-[9px] text-gray-300">More Cities</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM ROW --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        
        {/* Tournament Stats */}
        <div className="bg-[#11111A] border border-white/10 rounded-2xl p-5 xl:col-span-1">
           <h3 className="text-[12px] font-bold tracking-wider uppercase mb-4">Tournament Stats</h3>
           <div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-3 gap-3">
              {[
                { val: "104", label: "Total Matches", icon: <Play size={20} className="text-[#C9115F]"/>, color: 'border-[#C9115F]/30' },
                { val: "48", label: "Teams", icon: <Users size={20} className="text-purple-500"/>, color: 'border-purple-500/30' },
                { val: "16", label: "Host Cities", icon: <MapPin size={20} className="text-orange-500"/>, color: 'border-orange-500/30' },
                { val: "39", label: "Days of Action", icon: <Calendar size={20} className="text-blue-500"/>, color: 'border-blue-500/30' },
                { val: "1", label: "Champion", icon: <Trophy size={20} className="text-green-500"/>, color: 'border-green-500/30' },
              ].map((s, i) => (
                <div key={i} className={`bg-[#1A1A24] border ${s.color} rounded-xl p-3 flex flex-col items-center text-center justify-center h-24`}>
                  <div className="mb-2">{s.icon}</div>
                  <div className="text-sm font-bold">{s.val}</div>
                  <div className="text-[8px] text-gray-400 mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
           </div>
        </div>

        {/* Top Players to Watch */}
        <div className="bg-[#11111A] border border-white/10 rounded-2xl p-5 xl:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[12px] font-bold tracking-wider uppercase">Top Players to Watch</h3>
            <span className="text-[11px] text-gray-400 cursor-pointer flex items-center">View All <ChevronRight size={14}/></span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
             {topPlayers.map((player, idx) => (
                <div key={idx} className="bg-[#1A1A24] border border-white/5 rounded-xl overflow-hidden flex flex-col relative group">
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                  
                  {/* Image Placeholder */}
                  <div className="h-32 bg-gray-800 w-full flex items-end justify-center pt-4 relative">
                     {/* Replace with actual player image tags */}
                     <div className="w-20 h-24 bg-gray-600 rounded-t-lg" /> 
                  </div>
                  
                  <div className="p-3 relative z-20 flex flex-col items-center text-center -mt-4 bg-gradient-to-t from-[#1A1A24] via-[#1A1A24] to-transparent">
                    <h4 className="text-[11px] font-bold mb-1">{player.name}</h4>
                    <span className="text-[9px] text-gray-400 flex items-center gap-1 mb-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500"/> {player.country}
                    </span>
                    <div className="border border-[#C9115F]/50 text-[#C9115F] px-3 py-0.5 rounded text-[10px] font-bold">
                      {player.num}
                    </div>
                  </div>
                </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}