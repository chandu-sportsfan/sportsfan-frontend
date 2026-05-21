"use client";

import React, { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import { Player } from "@/types/player";

interface Props {
  player: Player;
  playerId?: string;
}

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-[3px] h-5 bg-[#e91e8c] rounded-sm shrink-0" />
      <span className="text-base md:text-lg font-bold text-white">{text}</span>
    </div>
  );
}

export default function PlayerProfileActions({ player, playerId }: Props) {
  const storageKey = `player-profile-actions:${playerId || player.name.toLowerCase().replace(/\s+/g, "-")}`;

  const [isFollowing, setIsFollowing] = useState(false);
  const [followRecordId, setFollowRecordId] = useState<string | null>(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const previousMediaCount = useRef(player.media.length);

  const careerStatItems = [
    { value: player.stats.runs, label: "RUNS" },
    { value: player.stats.sr, label: "SR" },
    { value: player.stats.avg, label: "AVG" },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) return;

      const parsed = JSON.parse(stored) as { following?: boolean; watching?: boolean };
      setIsFollowing(Boolean(parsed.following));
      setIsWatching(Boolean(parsed.watching));
    } catch (error) {
      console.error("Failed to restore player actions state", error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify({ following: isFollowing, watching: isWatching }));
  }, [isFollowing, isWatching, storageKey]);

  useEffect(() => {
    if (!isWatching) {
      previousMediaCount.current = player.media.length;
      setActivityItems([]);
      return;
    }

    const nextItems = player.media.slice(0, 3).map((item, index) => ({
      id: `${item.title}-${index}`,
      title: item.title,
      detail: `${player.name} uploaded a new clip`,
      time: item.time,
    }));

    setActivityItems(nextItems);

    if (player.media.length > previousMediaCount.current && previousMediaCount.current > 0) {
      setToastMessage(`${player.name} has new uploads ready for you`);
    }

    previousMediaCount.current = player.media.length;
  }, [isWatching, player.media, player.name]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const relatedInsights = player.insights.slice(0, 3);
  const relatedStrengths = player.strengths.slice(0, 4);

  const { user } = useAuth();

  function formatResponseMessage(body: any, defaultMsg: string, status?: number) {
    if (!body) return `${defaultMsg}${status ? ` (${status})` : ""}`;
    if (typeof body === "string") {
      const text = body.trim();
      return text ? text : `${defaultMsg}${status ? ` (${status})` : ""}`;
    }
    if (typeof body === "object") {
      if (body.error) return String(body.error);
      if (body.message) return String(body.message);
      try {
        const s = JSON.stringify(body);
        return s === '{}' ? `${defaultMsg}${status ? ` (${status})` : ""}` : s;
      } catch {
        return `${defaultMsg}${status ? ` (${status})` : ""}`;
      }
    }
    return `${defaultMsg}${status ? ` (${status})` : ""}`;
  }

  useEffect(() => {
    if (!user?.email || !player?.name) return;

    const uid = user.userId || user.email;

    (async () => {
      setIsFollowLoading(true);
      try {
        const res = await fetch(`/api/following?userId=${encodeURIComponent(uid)}`, {
          credentials: 'include',
        });
        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        const list = data?.following || [];
        const match = list.find(
          (f: any) => String(f.followingplayername || "").toLowerCase() === String(player.name || "").toLowerCase()
        );
        if (match) {
          setIsFollowing(true);
          setFollowRecordId(match.id || null);
        } else {
          setIsFollowing(false);
          setFollowRecordId(null);
        }
      } catch (e) {
        // ignore
      } finally {
        setIsFollowLoading(false);
      }
    })();
  }, [user?.email, user?.userId, player?.name]);

  const handleFollowClick = async () => {
    if (isFollowing) {
      setShowUnfollowConfirm(true);
      return;
    }

    if (!user?.email) {
      setToastMessage("Please sign in to follow players");
      return;
    }

    setIsFollowLoading(true);
    setIsFollowing(true);
    try {
      const payload = {
        userId: user.userId || user.email,
        userEmail: user.email,
        followingplayername: player.name,
      };

      // debug: log request details
      try {
        console.debug('FOLLOW REQ', { url: '/api/following', method: 'POST', payload });
      } catch (e) {}

      const res = await fetch("/api/following", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      let body: any = null;
      try {
        body = await res.json();
      } catch {
        try {
          body = await res.text();
        } catch {
          body = null;
        }
      }
      try {
        console.debug('FOLLOW RES', { status: res.status, body });
      } catch (e) {}

      if (res.status === 201) {
        setToastMessage(`Following ${player.name}`);
        if (body?.following?.id) setFollowRecordId(body.following.id);
      } else if (res.status === 401 || res.status === 403) {
        setToastMessage("Please sign in to follow players");
        setIsFollowing(false);
        signIn();
        return;
      } else if (res.status === 409) {
        setToastMessage(formatResponseMessage(body, "Already following", res.status));
        setIsFollowing(true);
      } else {
        setToastMessage(formatResponseMessage(body, "Failed to follow player", res.status));
        setIsFollowing(false);
      }
    } catch (err) {
      setToastMessage("Failed to follow player");
      setIsFollowing(false);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const confirmUnfollow = async () => {
    if (!user?.email) {
      setToastMessage("Please sign in to unfollow players");
      setShowUnfollowConfirm(false);
      return;
    }

    setShowUnfollowConfirm(false);
    setIsFollowLoading(true);
    setIsFollowing(false);

    const uid = user.userId || user.email;

    try {
      const reqBody = { userId: uid, followingplayername: player.name };
      try { console.debug('UNFOLLOW REQ', { url: '/api/following', method: 'DELETE', body: reqBody }); } catch (e) {}

      let res = await fetch("/api/following", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(reqBody),
      });

      let body: any = null;
      try {
        body = await res.json();
      } catch {
        try { body = await res.text(); } catch { body = null; }
      }
      try { console.debug('UNFOLLOW RES', { status: res.status, body }); } catch (e) {}

      // Fallbacks for 405 Method Not Allowed
      if (res.status === 405) {
        // 1) Try DELETE with query params
        const q = `/api/following?userId=${encodeURIComponent(uid)}&followingplayername=${encodeURIComponent(player.name)}`;
        try { console.debug('UNFOLLOW FALLBACK 1', { q }); } catch (e) {}
        res = await fetch(q, { method: 'DELETE', credentials: 'include' });
        try { body = await res.json().catch(() => res.text().catch(() => null)); } catch { body = null; }
        try { console.debug('UNFOLLOW FALLBACK 1 RES', { status: res.status, body }); } catch (e) {}
      }

      if (res.status === 405) {
        // 2) Try POST to an 'unfollow' action endpoint (some backends prefer POST)
        const unfollowUrl = process.env.NEXT_PUBLIC_FOLLOWING_API_URL ? new URL('/unfollow', process.env.NEXT_PUBLIC_FOLLOWING_API_URL).pathname : '/api/following/unfollow';
        try { console.debug('UNFOLLOW FALLBACK 2', { url: unfollowUrl }); } catch (e) {}
        res = await fetch(unfollowUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(reqBody) });
        try { body = await res.json().catch(() => res.text().catch(() => null)); } catch { body = null; }
        try { console.debug('UNFOLLOW FALLBACK 2 RES', { status: res.status, body }); } catch (e) {}
      }

      if (res.status === 200 || res.status === 204) {
        setToastMessage(`Unfollowed ${player.name}`);
        setFollowRecordId(null);
      } else if (res.status === 401 || res.status === 403) {
        setToastMessage("Please sign in to unfollow players");
        setIsFollowing(true);
        signIn();
        return;
      } else {
        setToastMessage(formatResponseMessage(body, `Failed to unfollow`, res.status));
        setIsFollowing(true);
      }
    } catch (err) {
      setToastMessage("Failed to unfollow");
      setIsFollowing(true);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const cancelUnfollow = () => setShowUnfollowConfirm(false);

  const toggleWatch = () => setIsWatching((c) => !c);

  const openShareDialog = () => {
    setShowShareDialog(true);
    setCopied(false);
  };

  const closeShareDialog = () => {
    setShowShareDialog(false);
    setCopied(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      try {
        const input = document.createElement("textarea");
        input.value = text;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.focus();
        input.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(input);
        return ok;
      } catch {
        return false;
      }
    }
  };

  const buildPlayerShareUrl = () => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  };

  const buildPlayerShareText = () => {
    const previewLink = buildPlayerShareUrl();
    return [
      `Check out ${player.name}'s profile`,
      previewLink ? `View profile: ${previewLink}` : "",
    ].filter(Boolean).join("\n");
  };

  const handleShareToWhatsApp = () => {
    const shareText = buildPlayerShareText();
    const whatsappAppUrl = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
    const whatsappWebFallbackUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

    const opened = window.open(whatsappAppUrl, "_self");
    if (!opened) {
      window.location.href = whatsappWebFallbackUrl;
    }
  };

  const handleShareToThreads = () => {
    const shareText = buildPlayerShareText();
    window.open(`https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
  };

  const handleShareToInstagram = async () => {
    const shareText = buildPlayerShareText();
    await copyToClipboard(shareText);
    setCopied(true);
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    setTimeout(() => setCopied(false), 1600);
  };

  const handleShareToLinkedIn = () => {
    const shareUrl = buildPlayerShareUrl();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
  };

  const handleShareToX = () => {
    const shareText = buildPlayerShareText();
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(buildPlayerShareText());
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const shareButtons = (size: string) => (
    <>
      {[
        { handler: handleShareToWhatsApp, src: "/images/share_whatsapp.png", alt: "WhatsApp" },
        { handler: handleShareToThreads, src: "/images/share_thread.png", alt: "Threads" },
        { handler: handleShareToInstagram, src: "/images/share_insta.png", alt: "Instagram" },
        { handler: handleShareToLinkedIn, src: "/images/Share_linkedin.png", alt: "LinkedIn" },
        { handler: handleShareToX, src: "/images/Share_X.png", alt: "X" },
        { handler: handleCopyLink, src: "/images/share_copy_link.png", alt: "Copy" },
      ].map(({ handler, src, alt }) => (
        <button
          key={alt}
          onClick={handler}
          className={`${size} shrink-0 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center`}
          aria-label={`Share on ${alt}`}
        >
          <img src={src} alt={alt} className="w-full h-full object-cover rounded-full" />
        </button>
      ))}
    </>
  );

  return (
    <div className="flex flex-col gap-4 px-4 md:px-6 pt-4 pb-4">
      {toastMessage && (
        <div className="rounded-2xl border border-[#e91e8c]/30 bg-[#24111c] px-4 py-3 text-sm font-medium text-white">
          {toastMessage}
        </div>
      )}

      {showUnfollowConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={cancelUnfollow} />
          <div className="relative w-[90%] max-w-md bg-[#111] border border-[#2a2a2a] rounded-xl p-6 z-10">
            <p className="text-white text-lg font-bold">Unfollow {player.name}?</p>
            <p className="text-sm text-[#b5b5b5] mt-2">Are you sure you want to unfollow {player.name}?</p>
            <div className="mt-4 flex gap-3 justify-end">
              <button onClick={cancelUnfollow} className="px-4 py-2 rounded-full bg-transparent border border-[#3a3a3a] text-white">Cancel</button>
              <button onClick={confirmUnfollow} className="px-4 py-2 rounded-full bg-gradient-to-r from-[#e91e8c] to-[#ff5722] text-white font-bold">Unfollow</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={handleFollowClick}
          disabled={isFollowLoading}
          className={`flex flex-1 items-center justify-center gap-2 h-[46px] md:h-[52px] rounded-full text-white text-[14px] md:text-base font-bold tracking-wide border-0 cursor-pointer hover:opacity-90 transition-opacity bg-gradient-to-r from-[#e91e8c] to-[#ff5722] ${isFollowLoading ? "opacity-70 pointer-events-none" : ""}`}
        >
          {isFollowLoading ? (
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" strokeOpacity="0.2" fill="none" />
              <path d="M22 12a10 10 0 0 1-10 10" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
          ) : (
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          )}
          {isFollowing ? "Following" : "Follow"}
        </button>

        <button
          onClick={toggleWatch}
          className={`flex flex-1 items-center justify-center gap-2 h-[46px] md:h-[52px] rounded-full text-[14px] md:text-base font-bold cursor-pointer transition-colors ${
            isWatching
              ? "bg-[#e91e8c]/15 border border-[#e91e8c] text-white"
              : "bg-transparent border border-[#e91e8c] text-[#e91e8c] hover:bg-[#e91e8c]/10"
          }`}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {isWatching ? "Watching" : "Watch Me"}
        </button>

        <button onClick={openShareDialog} className="flex items-center justify-center w-[46px] h-[46px] md:w-[52px] md:h-[52px] rounded-full bg-transparent border border-[#e91e8c] text-[#e91e8c] cursor-pointer shrink-0 hover:bg-[#e91e8c]/10 transition-colors" aria-label="Share player profile">
          <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </div>

      {showShareDialog && (
        <>
          <button type="button" className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={closeShareDialog} />
          <div className="fixed bottom-16 inset-x-4 z-50 mx-auto w-full max-w-[280px] rounded-2xl border border-white/10 bg-[#1a1a1e] p-3 shadow-2xl lg:hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm font-semibold">Share</p>
              <button onClick={closeShareDialog} className="text-gray-400 hover:text-white" aria-label="Close share dialog">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="flex flex-row flex-nowrap items-center gap-1.5 mb-2 overflow-x-auto">{shareButtons("w-8 h-8")}</div>
            {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
          </div>
          <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/60" onClick={closeShareDialog}>
            <div className="bg-[#1a1a1e] rounded-2xl border border-white/10 p-4 w-[300px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm font-semibold">Share Player Profile</p>
                <button onClick={closeShareDialog} className="text-gray-400 hover:text-white" aria-label="Close share dialog">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#111114] p-3 mb-3">
                <p className="text-white text-sm font-semibold line-clamp-2">{player.name}</p>
                <p className="text-white/45 text-[11px] mt-2 line-clamp-2 break-all">{buildPlayerShareUrl()}</p>
              </div>
              <div className="flex flex-row flex-nowrap items-center gap-2 mb-2">{shareButtons("w-9 h-9")}</div>
              {copied && <p className="text-xs text-emerald-400">Copied to clipboard</p>}
            </div>
          </div>
        </>
      )}

      {(!isFollowing && !isWatching) && (
        <div className="grid gap-4">
          {isFollowing && (
            <div className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 md:p-5">
              <SectionLabel text={`Related to ${player.name}`} />
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/80">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{player.team}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{player.battingStyle}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{player.bowlingStyle}</span>
              </div>

              {relatedStrengths.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#777] mb-2">Top strengths</p>
                  <div className="flex flex-wrap gap-2">
                    {relatedStrengths.map((strength) => (
                      <span key={strength} className="rounded-full bg-[#242424] px-3 py-1 text-sm text-white">
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {relatedInsights.length > 0 && (
                <div className="mt-4 space-y-3">
                  {relatedInsights.map((insight: any) => (
                    <div key={insight.title} className="rounded-xl bg-[#242424] p-3">
                      <p className="text-sm font-bold text-white">{insight.title}</p>
                      {!isFollowing && (
                        <p className="mt-1 text-sm text-[#b5b5b5]">{insight.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {isWatching && (
            <div className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 md:p-5">
              <SectionLabel text="Watch Me notifications" />
              <p className="mt-2 text-sm text-[#a7a7a7]">You’ll get updates whenever new clips or highlights are uploaded for this player.</p>

              <div className="mt-4 space-y-3">
                {activityItems.length > 0 ? (
                  activityItems.map((item) => (
                    <div key={item.id} className="rounded-xl bg-[#242424] p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-white">{item.title}</p>
                          <p className="mt-1 text-sm text-[#b5b5b5]">{item.detail}</p>
                        </div>
                        <span className="shrink-0 rounded-full border border-[#e91e8c]/30 bg-[#e91e8c]/10 px-2.5 py-1 text-[11px] font-semibold text-[#ffb7dd]">{item.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-[#242424] p-3 text-sm text-[#b5b5b5]">No uploads yet. New player content will appear here automatically.</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <button className="flex w-full items-center justify-center gap-2 h-12 md:h-[52px] rounded-full bg-transparent border border-[#e91e8c] text-[#e91e8c] text-[13px] md:text-sm font-bold cursor-pointer hover:bg-[#e91e8c]/10 transition-colors">
        <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add to Playlist
      </button>

      <button className="flex w-full items-center justify-center gap-2 h-12 md:h-[52px] rounded-full bg-transparent border border-[#e91e8c] text-[#e91e8c] text-[13px] md:text-sm font-bold cursor-pointer hover:bg-[#e91e8c]/10 transition-colors">
        <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H7v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V10h3.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
        </svg>
        Make My Avatar in This Jersey
      </button>

      <div className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 md:p-5">
        <SectionLabel text="Career Stats  (2021 - Present)" />
        <div className="grid grid-cols-3 gap-3 mt-3">
          {careerStatItems.map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center py-3.5 md:py-5 rounded-xl bg-[#242424]">
              <span className="text-[22px] md:text-[28px] font-extrabold text-white leading-none">{s.value}</span>
              <span className="text-[11px] md:text-xs text-[#777777] mt-1 tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 md:p-5">
        <SectionLabel text="Player Overview" />
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="flex flex-col justify-center p-3.5 md:p-4 rounded-xl bg-[#242424] min-h-[70px] md:min-h-[84px]">
            <span className="text-[20px] md:text-[24px] font-extrabold text-white leading-tight">{player.overview.debut}</span>
            <span className="text-[11px] md:text-xs text-[#777777] mt-1">IPL Debut</span>
          </div>

          <div className="flex flex-col justify-center p-3.5 md:p-4 rounded-xl bg-[#242424] min-h-[70px] md:min-h-[84px]">
            <span className="text-[20px] md:text-[24px] font-extrabold text-[#e91e8c] leading-tight">{player.overview.specialization}</span>
            <span className="text-[11px] md:text-xs text-[#777777] mt-1">Specialization</span>
          </div>

          <div className="flex flex-col justify-center p-3.5 md:p-4 rounded-xl bg-[#242424] min-h-[70px] md:min-h-[84px]">
            <span className="text-[15px] md:text-[18px] font-extrabold text-white leading-tight">{player.overview.dob}</span>
            <span className="text-[11px] md:text-xs text-[#777777] mt-1">Date of Birth</span>
          </div>

          <div className="flex flex-col justify-center p-3.5 md:p-4 rounded-xl bg-[#242424] min-h-[70px] md:min-h-[84px]">
            <span className="text-[22px] md:text-[28px] font-extrabold text-[#ff9800] leading-tight">{player.overview.matches}</span>
            <span className="text-[11px] md:text-xs text-[#777777] mt-1">Matches</span>
          </div>
        </div>
      </div>
    </div>
  );
}
