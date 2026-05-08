'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLeaderboard } from '@/context/LeaderboardContext';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const GlobalLeaderboard: React.FC = () => {
  const { user } = useAuth();
  const { leaderboard, currentUserRank, currentUserPoints, loading } = useLeaderboard();
  const router = useRouter();

  if (loading && leaderboard.length === 0) {
    return <div className="text-white p-4">Loading leaderboard...</div>;
  }

  return (
    <div className="rounded-xl max-w-3xl lg:max-w-6xl mx-auto p-6 mt-6 bg-[#121212] border border-white/10">
          <button
            onClick={() => router.push('/MainModules/Fantasy')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </button>

      <div className="mb-4">
        <h3 className="text-white text-lg font-bold">Global Leaderboard</h3>
        {currentUserRank && currentUserRank > 0 && (
          <p className="text-[#ff6d00] text-sm mt-1">
            Your Rank: #{currentUserRank} | {currentUserPoints} points
          </p>
        )}
        {(!currentUserRank || currentUserRank === 0) && currentUserPoints === null && (
          <p className="text-[#666] text-sm mt-1">
            Play battles to earn points and appear on the leaderboard!
          </p>
        )}
      </div>

      <div className="space-y-2">
        {leaderboard.length > 0 ? (
          leaderboard.map((leaderboardUser) => (
            <div
              key={leaderboardUser.userId}
              className={`flex items-center justify-between p-3 rounded-lg ${
                leaderboardUser.userId === user?.userId ? 'bg-[#2a2a2a] border border-[#ff6d00]' : 'bg-[#121212]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[#ffa726] font-bold w-8">#{leaderboardUser.rank}</span>
                <div>
                  <p className="text-white font-semibold">{leaderboardUser.userName}</p>
                  {/* <p className="text-[#666] text-xs">{leaderboardUser.userEmail || 'No email'}</p> */}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[#ff6d00] font-bold">{leaderboardUser.totalPoints}</span>
                <span className="text-[#666] text-xs">pts</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-[#666]">
            <p>No users on leaderboard yet</p>
            <p className="text-xs mt-2">Start playing to earn points!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalLeaderboard;