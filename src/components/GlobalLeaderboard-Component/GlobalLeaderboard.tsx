'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLeaderboard } from '@/context/LeaderboardContext';
import { ChevronLeft, Trophy, Star, Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';

const GlobalLeaderboard: React.FC = () => {
  const { user } = useAuth();
  const { leaderboard, currentUserRank, currentUserPoints, loading } = useLeaderboard();
  const router = useRouter();

  // Premium Loading State
  if (loading && leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
        <p className="text-gray-400 font-medium text-sm animate-pulse tracking-widest uppercase">Loading Ranks...</p>
      </div>
    );
  }

  return (
    // Main Container with smooth entry animation matching FanZone
    <div className="max-w-4xl mx-auto p-4 md:p-6 mt-4 md:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
        <div>
          {/* Modernized Back Button */}
          <button
            onClick={() => router.push('/MainModules/Fantasy')}
            className="flex items-center gap-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all mb-6 w-max text-sm font-bold border border-white/5"
          >
            <ChevronLeft size={16} />
            Back to Fantasy
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center border border-rose-500/30 shadow-[0_0_15px_rgba(225,29,72,0.2)]">
              <Trophy className="w-7 h-7 text-rose-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-1">
                Global Leaderboard
              </h1>
              <p className="text-sm text-gray-400 font-medium">
                Compete in battles, earn SXP, and climb the ranks.
              </p>
            </div>
          </div>
        </div>

        {/* Current User Quick Stat Card */}
        <div className="bg-[#09090b] border border-white/10 rounded-2xl p-5 flex items-center gap-6 shadow-xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           
           <div className="relative z-10">
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Your Rank</p>
             <div className="flex items-end gap-2">
               <h3 className="text-3xl font-black text-white leading-none">
                 {currentUserRank && currentUserRank > 0 ? `#${currentUserRank}` : "-"}
               </h3>
             </div>
           </div>
           
           <div className="w-px h-12 bg-white/10 relative z-10" />
           
           <div className="relative z-10">
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Total Points</p>
             <div className="flex items-end gap-2">
               <h3 className="text-xl font-black text-emerald-500 leading-none">
                 {currentUserPoints ? currentUserPoints.toLocaleString() : "0"} <span className="text-sm text-emerald-500/70">SXP</span>
               </h3>
             </div>
           </div>
        </div>
      </div>

      {/* --- LEADERBOARD LIST CONTAINER --- */}
      <div className="bg-[#09090b] border border-white/10 rounded-3xl p-2 md:p-4 shadow-2xl relative">
        
        {/* Table Headers */}
        <div className="flex items-center px-4 md:px-6 py-4 border-b border-white/5 mb-3">
           <div className="w-16 md:w-24 text-[10px] font-black tracking-widest text-gray-500 uppercase">Rank</div>
           <div className="flex-1 text-[10px] font-black tracking-widest text-gray-500 uppercase">Fan</div>
           <div className="text-right text-[10px] font-black tracking-widest text-gray-500 uppercase">Points</div>
        </div>

        {/* List Items */}
        <div className="space-y-2">
          {leaderboard.length > 0 ? (
            leaderboard.map((leaderboardUser, index) => {
              const isCurrentUser = leaderboardUser.userId === user?.userId;
              const isTop3 = index < 3;
              
              // Dynamic Styles based on rank
              let rankColor = "text-gray-400";
              let bgStyle = "bg-[#18181b] border-white/5 hover:bg-white/10";
              let rankIcon = null;

              // Top 3 Podium Styling
              if (index === 0) {
                rankColor = "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]";
                bgStyle = "bg-gradient-to-r from-yellow-500/10 to-[#18181b] border-yellow-500/30 shadow-[0_0_15px_rgba(250,204,21,0.05)]";
                rankIcon = <Crown className="w-5 h-5 text-yellow-400 absolute -top-3 -left-2 rotate-[-12deg] drop-shadow-md" />;
              } else if (index === 1) {
                rankColor = "text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]";
                bgStyle = "bg-gradient-to-r from-gray-400/10 to-[#18181b] border-gray-400/30";
              } else if (index === 2) {
                rankColor = "text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]";
                bgStyle = "bg-gradient-to-r from-amber-600/10 to-[#18181b] border-amber-600/30";
              }

              // Current User Row Override
              if (isCurrentUser) {
                 bgStyle = "bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-[#18181b] border-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.15)]";
              }

              return (
                <div
                  key={leaderboardUser.userId}
                  className={`relative flex items-center px-4 md:px-6 py-4 rounded-2xl border transition-all duration-300 group hover:scale-[1.01] ${bgStyle}`}
                >
                  {/* Rank Column */}
                  <div className="w-16 md:w-24 flex items-center relative">
                    {rankIcon}
                    <span className={`text-xl md:text-2xl font-black ${rankColor} tabular-nums`}>
                      #{leaderboardUser.rank}
                    </span>
                  </div>

                  {/* User Avatar & Name Column */}
                  <div className="flex-1 flex items-center gap-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${isCurrentUser ? 'bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg' : 'bg-[#27272a] text-gray-300 group-hover:bg-[#3f3f46] transition-colors border border-white/5'}`}>
                       {leaderboardUser.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={`font-bold md:text-lg tracking-wide ${isCurrentUser ? 'text-white' : 'text-gray-200 group-hover:text-white transition-colors'}`}>
                        {leaderboardUser.userName}
                        {isCurrentUser && (
                          <span className="ml-3 text-[9px] bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest align-middle shadow-sm">
                            You
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Points Column */}
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      {isTop3 && <Star className={`w-4 h-4 fill-current ${rankColor}`} />}
                      <span className={`text-lg md:text-xl font-black ${isCurrentUser ? 'text-emerald-400' : 'text-emerald-500'} tabular-nums`}>
                        {leaderboardUser.totalPoints.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">SXP</span>
                  </div>
                </div>
              );
            })
          ) : (
            // Empty State
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-12 h-12 text-gray-600" />
              </div>
              <p className="text-xl font-black text-white mb-2">No users on leaderboard yet</p>
              <p className="text-sm text-gray-500 font-medium">Play battles to earn SXP and claim the #1 spot!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalLeaderboard;
