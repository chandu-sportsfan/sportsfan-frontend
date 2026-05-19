"use client";

import { useState } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
  MoonStar,
  Zap,
  Bell,
  Star,
} from 'lucide-react';

const TAGS = ['Cricket', 'Football', 'Athletics', 'Kabaddi', 'Badminton', 'Tennis', 'Arm Wrestling', 'Squash'];

export default function PreferencesOnboarding() {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [purpose, setPurpose] = useState<string | null>('Catch Live action');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Cricket']);
  const [sportStyle, setSportStyle] = useState<string>('Short & Fast');
  const [notif, setNotif] = useState({ live: true, final: true, breaking: true, highlights: true });

  const total = 5;
//done
  const finalHero = '/images/dolly3.png';
  const heroSrc = '/images/Dolly%202.png';
  const QUESTION_CLASS = "flex flex-col justify-between min-h-[260px]";
  const IMG_MAP: Record<string, string> = {
    'Catch Live action': 'catch.png',
    'Watch highlights & news': 'watch highlights.png',
    'Follow players & teams': 'follow players.png',
    'Explore everything': 'explore everything.png',
    'Short & Fast': 'short.png',
    'Deep Dives': 'deep.png',
    'Video First': 'catch.png',
    'Live Scores': 'Live scores.png',
    'Live match alerts': 'live match.png',
    'Final scores': 'final scores.png',
    'Breaking news': 'breaking news.png',
    'Highlight drops': 'highlights drops.png',
    Cricket: 'cricket.png',
    Football: 'explore.png',
    Athletics: 'explore.png',
    Kabaddi: 'battle.png',
    Badminton: 'feed.png',
    Tennis: 'playermi.png',
    'Arm Wrestling': 'battle.png',
    Squash: 'explore.png',
  };

  const getImg = (label: string) => {
    const f = IMG_MAP[label as keyof typeof IMG_MAP];
    return f ? `/images/${encodeURIComponent(f)}` : undefined;
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((s) => (s.includes(tag) ? s.filter((t) => t !== tag) : [...s, tag]));
  };

  const onSkip = () => setStep((s) => Math.min(total - 1, s + 1));

  const onNext = () => setStep((s) => Math.min(total - 1, s + 1));
  const onBack = () => setStep((s) => Math.max(0, s - 1));

  const progressPct = Math.round(((step + 1) / total) * 100);
  const [activeTab, setActiveTab] = useState<'featured' | 'following'>('featured');

  if (!started) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-4">
        <div className="w-full max-w-xl mt-4 rounded-2xl border border-white/10 bg-[#111] p-4 flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <Image src={'/images/dolly%201.png'} alt="dolly" width={80} height={80} className="object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-300 mb-2">Don&apos;t leave me hanging...</p>
            <p className="text-base font-semibold mb-4">Complete your profile setup to get the full experience.</p>
            <div className="flex gap-3">
              <button onClick={() => setStarted(true)} className="flex-1 rounded-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold">Complete Now</button>
              <a href="/MainModules/HomePage" className="inline-flex items-center justify-center px-4 py-3 rounded-full border border-white/10 text-sm">Skip</a>
            </div>
          </div>
        </div>
        <div className="w-full max-w-xl mt-6">
          <div className="rounded-2xl border border-white/6 p-3 bg-white/3 text-sm text-gray-300">You can always change these preferences later in Settings.</div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-full ${activeTab === 'featured' ? 'bg-white text-black' : 'border border-white/10 text-white'}`}
            >
              Featured
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`px-4 py-2 rounded-full ${activeTab === 'following' ? 'bg-white text-black' : 'border border-white/10 text-white'}`}
            >
              Following
            </button>
          </div>

          <div className="mt-4 w-full max-w-xl">
            {activeTab === 'featured' ? (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-white/3 border border-white/8 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image src="/images/dolly%201.png" alt="avatar" width={48} height={48} className="object-cover" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Virat Kohli</div>
                    <div className="text-xs text-gray-400">12m ago</div>
                    <div className="mt-2 text-sm text-gray-300">Let&apos;s go!!</div>
                  </div>
                  <button className="ml-2 px-3 py-1 rounded-full bg-white text-black text-sm">Follow</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-white/3 border border-white/8 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image src="/images/dolly%201.png" alt="avatar" width={48} height={48} className="object-cover" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">You</div>
                    <div className="text-xs text-gray-400">Just now</div>
                    <div className="mt-2 text-sm text-gray-300">Welcome back to your feed.</div>
                  </div>
                  <button className="ml-2 px-3 py-1 rounded-full border border-white/10 text-white text-sm">Following</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="relative">
        {step >= 0 && step <= 3 && (
          <div className="h-[180px] sm:h-[220px] bg-gradient-to-r from-pink-700 via-orange-600 to-rose-700 rounded-b-2xl overflow-hidden relative">
            <button
              onClick={() => { if (step > 0) onBack(); }}
              aria-label="Back"
              className={`absolute left-4 top-4 w-9 h-9 rounded-full flex items-center justify-center z-30 ${step > 0 ? 'bg-black/40 hover:bg-black/50' : 'bg-black/10 opacity-40 pointer-events-none'}`}
            >
              <ChevronLeft className="text-white" />
            </button>
            <button onClick={onSkip} aria-label="Skip" className="absolute right-4 top-4 text-sm px-3 py-1 rounded-full bg-black/30 z-20">SKIP</button>
            <Image src={heroSrc} alt="hero" width={240} height={90} className="object-contain absolute left-1/2 top-[82%] -translate-x-1/2 -translate-y-1/2" />
          </div>
        )}

        <div className="px-4 pt-2">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-orange-500 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 pt-6 pb-8">
        {step === 0 && (
          <section className={QUESTION_CLASS}>
            <h2 className="text-xl font-bold mb-2">What brings you here?</h2>
            <p className="text-sm text-gray-400 mb-4">Choose what you want to see first on your feed.</p>
            <div className="space-y-3 mb-6">
              {['Catch Live action', 'Watch highlights & news', 'Follow players & teams', 'Explore everything'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPurpose(opt)}
                  className={`w-full flex items-center justify-between gap-3 p-4 rounded-2xl border transition-colors duration-150 ${purpose === opt ? 'border-pink-500 bg-gradient-to-r from-pink-900/30 to-orange-900/20' : 'border-white/10 bg-white/3'}`}
                  tabIndex={0}
                  aria-pressed={purpose === opt}
                >
                  <div className="flex items-center gap-3 min-w-0 text-left">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={getImg(opt) || '/images/feed.png'} alt={opt} width={48} height={48} className="object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{opt}</div>
                    </div>
                  </div>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${purpose === opt ? 'border-pink-500' : 'border-white/20'} bg-white/5 transition-colors duration-150`}>
                    {purpose === opt && <span className="block w-3 h-3 rounded-full bg-pink-500" />}
                  </span>
                </button>
              ))}
            </div>
              <button
                onClick={onNext}
                className="w-full rounded-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold shadow-lg"
              >
                Continue
              </button>
          </section>
        )}

        {step === 1 && (
          <section className={QUESTION_CLASS}>
            <div>
              <h2 className="text-xl font-bold mb-2">Pick what you love</h2>
              <p className="text-sm text-gray-400 mb-4">Select one or more sports to personalize your feed.</p>
              <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                <div className="flex flex-wrap gap-3">
                  {TAGS.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-full border ${active ? 'bg-black border-pink-500 text-pink-300' : 'bg-white/5 border-white/10 text-gray-300'}`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <button
              onClick={onNext}
              className="w-full rounded-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold shadow-lg"
            >
              Continue
            </button>
          </section>
        )}

          {step === 2 && (
            <section className={QUESTION_CLASS}>
            <h2 className="text-xl font-bold mb-2">How do you like your sports?</h2>
            <p className="text-sm text-gray-400 mb-4">Pick a primary content style.</p>
            <div className="space-y-3 mb-6">
              {['Short & Fast', 'Deep Dives', 'Video First', 'Live Scores'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSportStyle(s)}
                  className={`w-full flex items-center justify-between gap-3 p-4 rounded-2xl border transition-colors duration-150 ${sportStyle === s ? 'border-pink-500 bg-gradient-to-r from-pink-900/30 to-orange-900/20' : 'border-white/10 bg-white/3'}`}
                  tabIndex={0}
                  aria-pressed={sportStyle === s}
                >
                  <div className="flex items-center gap-3 min-w-0 text-left">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={getImg(s) || '/images/short.png'} alt={s} width={48} height={48} className="object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{s}</div>
                      <div className="text-xs text-gray-400">{s === 'Short & Fast' ? 'Scores and quick clips' : s === 'Deep Dives' ? 'Long reads and analysis' : s === 'Video First' ? 'Reels and highlight clips' : 'Scorecards and ball-by-ball updates'}</div>
                    </div>
                  </div>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${sportStyle === s ? 'border-pink-500' : 'border-white/20'} bg-white/5 transition-colors duration-150`}>
                    {sportStyle === s && <span className="block w-3 h-3 rounded-full bg-pink-500" />}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={onNext}
              className="w-full rounded-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold shadow-lg"
            >
              Continue
            </button>
          </section>
        )}

          {step === 3 && (
            <section className={QUESTION_CLASS}>
            <h2 className="text-xl font-bold mb-2">Enable notifications & Stay in the loop!</h2>
            <p className="text-sm text-gray-400 mb-4">Turn on the updates you want to receive.</p>
            <div className="space-y-3 mb-6">
              {[
                { key: 'live', label: 'Live match alerts' },
                { key: 'final', label: 'Final scores' },
                { key: 'breaking', label: 'Breaking news' },
                { key: 'highlights', label: 'Highlight drops' },
              ].map((it) => (
                <button
                  key={it.key}
                  type="button"
                  onClick={() => setNotif((n) => { const k = it.key as keyof typeof n; return { ...n, [k]: !n[k] }; })}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border bg-white/3 border-white/10 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={getImg(it.label) || '/images/notification.png'} alt={it.label} width={40} height={40} className="object-cover" />
                    </div>
                    <div>{it.label}</div>
                  </div>
                  <div className={`h-6 w-11 rounded-full p-0.5 ${notif[it.key as keyof typeof notif] ? 'bg-pink-500' : 'bg-white/10'}`} aria-hidden>
                    <span className={`block h-5 w-5 rounded-full bg-white transition-transform ${notif[it.key as keyof typeof notif] ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={onNext}
              className="w-full rounded-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold shadow-lg"
            >
              Continue
            </button>
          </section>
        )}

        {step === 4 && (
          <section className={`${QUESTION_CLASS} items-center px-6 text-center`}>
            <div className="w-full max-w-md mx-auto">
              <Image src={finalHero} alt="celebrate" width={520} height={520} className="object-contain" />
            </div>
            <div className="pt-6 w-full">
              <h2 className="text-2xl font-bold mb-2">Let&apos;s go.</h2>
              <p className="text-sm text-gray-400 max-w-lg mx-auto mb-6">Your feed is alive. Built for you, by you.</p>
              <button
                onClick={() => window.location.assign('/MainModules/HomePage')}
                className="w-full rounded-full py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold shadow-lg mt-2"
              >
                Continue
              </button>
            </div>
          </section>
        )}
      </div>

      {/* ...existing code... */}
      {/* ...existing code... */}
    </div>
  );
}
