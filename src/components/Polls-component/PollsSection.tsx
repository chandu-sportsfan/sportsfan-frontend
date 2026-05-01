"use client";

import { useState, useEffect } from "react";
import { Poll } from "@/types/Polls";
import { useAuth } from "@/context/AuthContext";
import PollCard from "./PollCard";

async function fetchActivePolls(): Promise<Poll[]> {
  const res = await fetch("/api/polls");
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

async function castVote(pollId: string, optionId: string, userId?: string): Promise<void> {
  const res = await fetch(`/api/polls/${pollId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ optionId, userId }),
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error ?? "Vote failed");
  }
}

function PollSkeleton() {
  return (
    <div className="w-[260px] rounded-xl bg-[#1e1e2e] border border-white/10 overflow-hidden animate-pulse">
      <div className="px-4 pt-3 pb-2 space-y-2">
        <div className="h-2.5 w-16 bg-white/10 rounded" />
        <div className="h-3.5 w-3/4 bg-white/10 rounded" />
      </div>
      <div className="px-3 pb-3 space-y-2">
        <div className="h-10 bg-white/10 rounded-lg" />
        <div className="h-10 bg-white/10 rounded-lg" />
      </div>
      <div className="h-7 bg-white/5" />
    </div>
  );
}

export default function PollsSection() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivePolls()
      .then(setPolls)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && polls.length === 0) return null;

  return (
    <section className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <h1 className="text-[20px] text-white font-bold">Polls &amp; Quizzes</h1>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {loading ? (
          <>
            <PollSkeleton />
            <PollSkeleton />
          </>
        ) : (
          polls.map((poll) => (
            <div key={poll.id} className="flex-shrink-0">
              <PollCard 
                poll={poll} 
                onVote={castVote} 
                userId={user?.userId}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}