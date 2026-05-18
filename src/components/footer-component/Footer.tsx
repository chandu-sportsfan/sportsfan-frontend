// SportsFan360Footer.tsx
// Next.js + TypeScript + Tailwind CSS (inline classes only, no style tags)

import { Globe } from "lucide-react";
import React from "react";

// ─── SVG Icon Components ────────────────────────────────────────────────────

const RocketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-pink-500" stroke="currentColor" strokeWidth={1.8}>
    <path d="M12 2C12 2 7 6 7 13H17C17 6 12 2 12 2Z" strokeLinejoin="round" />
    <path d="M7 13L5 17H19L17 13" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="1.5" fill="currentColor" stroke="none" />
    <path d="M9 17L8 21M15 17L16 21" strokeLinecap="round" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.919l4.259 5.632 4.816-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-pink-500">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Divider with glow 

const GlowDivider = () => (
  <div className="relative w-full h-px my-6">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-600 to-transparent opacity-60" />
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-20 blur-sm" />
  </div>
);

// ─── Social Button 

interface SocialBtnProps {
  href: string;
  label: string;
  color: string; // tailwind ring/border color class
  children: React.ReactNode;
}

const SocialBtn: React.FC<SocialBtnProps> = ({ href, label, color, children }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    className={`
      group relative flex items-center justify-center
      w-12 h-12 md:w-14 md:h-14
      rounded-full border border-zinc-700 bg-zinc-900
      transition-all duration-300
      hover:scale-110 hover:border-pink-500
      ${color}
    `}
  >
    <span className="transition-colors duration-300 text-zinc-400 group-hover:text-white">
      {children}
    </span>
    {/* Glow halo on hover */}
    <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-pink-600/10 blur-sm" />
  </a>
);

// ─── Main Footer ──────────────────────────────────────────────────────────────

const SportsFan360Footer: React.FC = () => {
  const quickLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
    { label: "Refund Policy", href: "#" },
    { label: "Contact Us", href: "#" },
  ];

  const socials = [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/sportsfan360/", icon: <LinkedInIcon /> },
    { label: "X (Twitter)", href: "https://x.com/sportsfan_360", icon: <XIcon /> },
    { label: "Instagram", href: "https://www.instagram.com/sportsfan_360/", icon: <InstagramIcon /> },
    { label: "YouTube", href: "https://www.youtube.com/@sportsfan_360", icon: <YouTubeIcon /> },
    {label: "Website", href: "https://www.sportsfan360.com", icon: <Globe />},
  ];

  return (
    <footer className="w-full bg-[#111114] text-white pb-2 font-sans selection:bg-pink-700 selection:text-white">
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-600 to-transparent" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10 py-10 lg:py-14">

        {/* ── Desktop: 3-column grid / Mobile: stacked ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 lg:gap-12">

          {/* ── Col 1: App Info ──────────────────────────── */}
          {/* <div className="flex flex-col gap-4">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-pink-500 mb-1">
              App Info
            </p>

            <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-4 hover:border-pink-800 transition-colors duration-300">
              
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <RocketIcon />
              </div>
              <div>
                <p className="text-sm font-semibold text-white tracking-wide">
                  Beta Build v0.0.02
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">We&apos;re improving every day.</p>
              </div>
            </div>
          </div> */}

          {/* ── Col 2: Quick Links ───────────────────────── */}
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-pink-500 mb-1">
              Quick Links
            </p>

            <div className="flex flex-wrap gap-x-2 gap-y-3">
              {quickLinks.map((link, i) => (
                <React.Fragment key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-pink-400 transition-colors duration-200 whitespace-nowrap"
                  >
                    {link.label}
                  </a>
                  {/* bullet separator — hide after last item */}
                  {i < quickLinks.length - 1 && (
                    <span className="text-pink-700 text-xs select-none">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── Col 3: Follow Us ─────────────────────────── */}
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-pink-500 mb-1">
              Follow Us
            </p>

            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <SocialBtn key={s.label} href={s.href} label={s.label} color="">
                  {s.icon}
                </SocialBtn>
              ))}
            </div>
          </div>
        </div>

        {/* <GlowDivider /> */}

        {/* ── Bottom Bar ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4 px-5 mb-2 mt-6">

           <div className="flex items-center gap-2.5">
            <RocketIcon />
            <div>
              <p className="text-xs font-medium text-zinc-300 leading-snug">
                Beta Build v0.0.02
              </p>
              <p className="text-[11px] text-zinc-600">We&apos;re improving every day.</p>
            </div>
          </div>

          {/* Left: copyright */}
          <div className="flex items-center gap-2.5">
            <ShieldIcon />
            <div>
              <p className="text-xs font-medium text-zinc-300 leading-snug">
                © 2026 SportsFan360
              </p>
              <p className="text-[11px] text-zinc-600">All rights reserved.</p>
            </div>
          </div>

        
        </div>
        

      </div>

      {/* Bottom accent line */}
      {/* <div className="h-px w-full bg-gradient-to-r from-transparent via-pink-900 to-transparent" /> */}
    </footer>
  );
};

export default SportsFan360Footer;