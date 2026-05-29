"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Edit2, MapPin, Calendar,
  Link as LinkIcon, Globe, User,
  MessageSquare, ThumbsUp, Users, Radio,
  Camera, Check, Share2, MoreHorizontal,
  Loader2, AlertCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PostCard from "@/components/PostCard"; // reuse your existing PostCard

/* ════════════════════════════════════════════
   DESIGN TOKENS
════════════════════════════════════════════ */
const BG    = "#070809";
const CARD  = "#0B0C10";
const INNER = "#121317";
const TXT   = "#f3f3f7";
const SUB   = "#a1a1af";
const MUTED = "#676777";
const PINK  = "#e8437a";
const GRAD  = "linear-gradient(90deg,#e8437a,#f4732a)";
const R     = 14;

const card = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  background: CARD,
  borderRadius: R,
  border: "1px solid rgba(255,255,255,0.015)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
  ...extra,
});

const inputBase: React.CSSProperties = {
  background: INNER,
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 8,
  color: TXT,
  outline: "none",
  width: "100%",
  padding: "8px 12px",
  fontSize: 13,
  boxSizing: "border-box",
};

/* ── Types ── */
interface ProfileData {
  name: string;
  handle: string;
  avatar: string;
  subtitle: string;
  description: string;
  location: string;
  joinedDate: string;
  website: string;
  stats: { following: number | string; followers: number | string; following2: number | string };
  interests: string[];
  favoriteTeams: { name: string; league: string; liked: boolean; initial: string; color: string }[];
  socialLinks: { platform: string; handle: string; icon: string }[];
}

interface ValidationErrors {
  name?: string;
  subtitle?: string;
  description?: string;
  location?: string;
  website?: string;
}

/* ── Helpers ── */
function deriveHandle(name: string): string {
  const slug = name.trim().toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
  return `@${slug || "user"}fan360`;
}

/* ── Avatar ── */
function Av({ src, name, sz = 38 }: { src: string; name: string; sz?: number }) {
  return (
    <div style={{
      width: sz, height: sz, borderRadius: "50%", flexShrink: 0,
      overflow: "hidden", background: GRAD,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: sz * 0.38, fontWeight: 700, color: "#fff",
    }}>
      {src
        ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : name.charAt(0).toUpperCase()}
    </div>
  );
}

/* ── Section heading ── */
function SH({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 3, height: 17, background: PINK, borderRadius: 2 }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{title}</span>
      </div>
      {right}
    </div>
  );
}

/* ── Social icons ── */
function SocialIcon({ icon }: { icon: string }) {
  const s: React.CSSProperties = {
    width: 32, height: 32, borderRadius: "50%", background: "#0F1014",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  };
  const ig = <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig)" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" stroke="url(#ig)" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="#f4732a" />
    <defs><linearGradient id="ig" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
      <stop stopColor="#f4732a" /><stop offset="1" stopColor="#e8437a" />
    </linearGradient></defs>
  </svg>;
  const xIcon = <svg width="13" height="13" viewBox="0 0 24 24" fill="#aaa">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>;
  const yt = <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff4444">
    <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C16.3 5 12 5 12 5s-4.3 0-6.9.1c-.4.1-1.3.1-2.1.9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.8C6.8 19 12 19 12 19s4.3 0 6.9-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9l5.7 2.8-5.7 2.7z" />
  </svg>;
  return <div style={s}>{icon === "ig" ? ig : icon === "x" ? xIcon : yt}</div>;
}

const ExtLink = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
export default function ProfilePage() {
  const { user } = useAuth();

  /* ── UI state ── */
  const [isEditing, setIsEditing]   = useState(false);
  const [activeTab, setActiveTab]   = useState("Posts");
  const [isMobile, setIsMobile]     = useState(false);
  const fileInputRef                = useRef<HTMLInputElement>(null);

  /* ── Profile data state ── */
  const [profile, setProfile]           = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [saving, setSaving]             = useState(false);
  const [saveSuccess, setSaveSuccess]   = useState(false);

  /* ── Edit form state ── */
  const [editForm, setEditForm]   = useState<ProfileData | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [avatarFile, setAvatarFile]   = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  /* ── Posts state ── */
  const [posts, setPosts]       = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError]     = useState<string | null>(null);
  const [postsPage, setPostsPage]       = useState(1);
  const [postsHasMore, setPostsHasMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  /* ── Responsive ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ────────────────────────────────────────
     FETCH PROFILE on mount
  ──────────────────────────────────────── */
  useEffect(() => {
    async function fetchProfile() {
      setProfileLoading(true);
      setProfileError(null);
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error(await res.text());
        const data: ProfileData = await res.json();
        setProfile(data);
        setEditForm(data);
      } catch (err: any) {
        setProfileError(err.message || "Failed to load profile.");
      } finally {
        setProfileLoading(false);
      }
    }
    fetchProfile();
  }, []);

  /* ────────────────────────────────────────
     FETCH POSTS (paginated, infinite scroll)
  ──────────────────────────────────────── */
  const fetchPosts = useCallback(async (page: number, replace = false) => {
    if (!user) return;
    setPostsLoading(true);
    setPostsError(null);
    try {
      const res = await fetch(`/api/user-posts?page=${page}&limit=10`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPosts(prev => replace ? data.posts : [...prev, ...data.posts]);
      setPostsHasMore(data.hasMore);
      setPostsPage(page);
    } catch (err: any) {
      setPostsError(err.message || "Failed to load posts.");
    } finally {
      setPostsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  /* ── Infinite scroll sentinel ── */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && postsHasMore && !postsLoading) {
          fetchPosts(postsPage + 1);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [postsHasMore, postsLoading, postsPage, fetchPosts]);

  /* ────────────────────────────────────────
     EDIT HANDLERS
  ──────────────────────────────────────── */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    setEditForm(prev => {
      if (!prev) return prev;
      const u = { ...prev, [name]: value };
      if (name === "name") {
        u.handle = deriveHandle(value);
        const slug = value.trim().toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "") || "user";
        u.socialLinks = prev.socialLinks.map((l, i) => ({
          ...l,
          handle: i === 2
            ? slug.charAt(0).toUpperCase() + slug.slice(1) + "Fan360"
            : `${slug}fan360`,
        }));
      }
      return u;
    });
  };

  /* ── Client-side validation mirror ── */
  function validateForm(form: ProfileData): ValidationErrors {
    const errors: ValidationErrors = {};
    if (!form.name.trim()) {
      errors.name = "Name is required.";
    } else if (!/^[A-Za-z\s'\-]{2,60}$/.test(form.name.trim())) {
      errors.name = "Name must be 2–60 letters only (no numbers or special characters).";
    }
    if (form.subtitle && form.subtitle.length > 160) {
      errors.subtitle = "Subtitle must be 160 characters or fewer.";
    }
    if (form.description && form.description.length > 500) {
      errors.description = "Description must be 500 characters or fewer.";
    }
    if (form.location && form.location.length > 80) {
      errors.location = "Location must be 80 characters or fewer.";
    }
    if (form.website) {
      try {
        new URL(form.website.startsWith("http") ? form.website : `https://${form.website}`);
      } catch {
        errors.website = "Enter a valid website URL.";
      }
    }
    return errors;
  }

  /* ── Handle avatar file select ── */
  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
    setEditForm(prev => prev ? { ...prev, avatar: URL.createObjectURL(f) } : prev);
  };

  /* ── Save profile ── */
  const save = async () => {
    if (!editForm) return;
    const errors = validateForm(editForm);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    try {
      // 1. Upload avatar if changed
      let avatarUrl = editForm.avatar;
      if (avatarFile) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        const avatarRes = await fetch("/api/profile/avatar", { method: "POST", body: fd });
        if (!avatarRes.ok) throw new Error("Avatar upload failed.");
        const { avatarUrl: newUrl } = await avatarRes.json();
        avatarUrl = newUrl;
      }

      // 2. Save profile fields
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:        editForm.name,
          subtitle:    editForm.subtitle,
          description: editForm.description,
          location:    editForm.location,
          website:     editForm.website,
          avatar:      avatarUrl,
          interests:   editForm.interests,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Server returned field-level errors
        if (data.errors) {
          setFieldErrors(data.errors);
        } else {
          throw new Error(data.error || "Save failed.");
        }
        return;
      }

      // 3. Update local state with server-confirmed data
      setProfile(prev => prev
        ? { ...prev, ...data.profile, avatar: avatarUrl }
        : prev
      );
      setAvatarFile(null);
      setAvatarPreview("");
      setIsEditing(false);
      setFieldErrors({});
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setEditForm(profile ? { ...profile } : null);
    setAvatarFile(null);
    setAvatarPreview("");
    setFieldErrors({});
    setIsEditing(false);
  };

  /* ────────────────────────────────────────
     POST ACTIONS (passed to PostCard)
  ──────────────────────────────────────── */
  const handleDeletePost = async (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id && p._id !== id));
  };

  const handleVote = async (postId: string, optionId: string, voterId: string, userName: string) => {
    // Delegate to your existing vote handler; optimistic update here if needed
  };

  const handleLike = (postId: string, userId: string) => {
    // Delegate to your existing like handler
  };

  /* ────────────────────────────────────────
     DERIVED DISPLAY VALUES
  ──────────────────────────────────────── */
  const disp = isEditing ? editForm : profile;
  const tabs = ["Posts", "Live Reactions", "Comments", "Following"];
  const col1 = isMobile ? "1fr" : "230px 1fr";
  const col2 = isMobile ? "1fr" : "1fr 264px";

  const chips = [
    { bg: "rgba(232,67,122,0.14)", color: "#e8437a" },
    { bg: "rgba(244,115,42,0.14)", color: "#f4732a" },
    { bg: "rgba(139,92,246,0.14)", color: "#9b7ef8" },
    { bg: "rgba(56,124,220,0.14)", color: "#5b9ae8" },
    { bg: "rgba(34,180,100,0.14)", color: "#38b46e" },
  ];

  const tabIcons: Record<string, React.ReactNode> = {
    "Posts":          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>,
    "Live Reactions": <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.49-.01a6 6 0 0 1 0-8.49" /></svg>,
    "Comments":       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    "Following":      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>,
  };

  /* ────────────────────────────────────────
     SIDEBAR
  ──────────────────────────────────────── */
  const Sidebar = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {/* INTERESTS */}
      <div style={{ ...card(), padding: "18px", display: "flex", flexDirection: "column" }}>
        <SH title="Interests" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {(profile?.interests || []).map((interest, i) => {
            const c = chips[i % chips.length];
            return (
              <span key={interest} style={{
                padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: c.bg, color: c.color,
              }}>{interest}</span>
            );
          })}
        </div>
      </div>

      {/* FAVORITE TEAMS */}
      <div style={{ ...card(), padding: "18px", marginTop: "2px", minHeight: "180px" }}>
        <SH title="Favorite Teams"
          right={<button style={{ fontSize: 12, color: PINK, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Edit</button>}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {(profile?.favoriteTeams || []).map((team, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: team.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  {team.initial}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TXT }}>{team.name}</div>
                  <div style={{ fontSize: 11, color: MUTED }}>{team.league}</div>
                </div>
              </div>
              <span style={{ fontSize: 16 }}>{team.liked ? "❤️" : "🤍"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SOCIAL LINKS */}
      <div style={{ ...card(), padding: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Social Links</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {(profile?.socialLinks || []).map((link, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <SocialIcon icon={link.icon} />
                <span style={{ fontSize: 13, color: SUB, fontWeight: 500 }}>{link.handle}</span>
              </div>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, display: "flex" }}>
                <ExtLink />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ────────────────────────────────────────
     LOADING / ERROR STATES
  ──────────────────────────────────────── */
  if (profileLoading) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={32} color={PINK} style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (profileError || !profile || !disp) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <AlertCircle size={32} color={PINK} />
        <p style={{ color: SUB, fontSize: 14 }}>{profileError || "Could not load profile."}</p>
        <button
          onClick={() => window.location.reload()}
          style={{ padding: "8px 20px", borderRadius: 50, background: GRAD, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          Retry
        </button>
      </div>
    );
  }

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <div style={{ minHeight: "100vh", background: BG, color: TXT, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", fontSize: 14 }}>

      {/* ── TOPBAR ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: BG, borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/MainModules/HomePage" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#9090a8", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
          <ArrowLeft size={15} /> Back
        </Link>
        {saveSuccess && (
          <span style={{ fontSize: 12, color: "#22c55e", display: "flex", alignItems: "center", gap: 5 }}>
            <Check size={13} /> Profile saved!
          </span>
        )}
      </div>

      {/* ── PAGE ── */}
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: isMobile ? "16px 14px 60px" : "24px 24px 72px" }}>

        {/* ══ ROW 1: Profile card | About + Fan Stats ══ */}
        <div style={{ display: "grid", gridTemplateColumns: col1, gap: "18px", alignItems: "stretch" }}>

          {/* LEFT — Profile identity */}
          <div style={{ ...card(), padding: "24px 18px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>

            {/* Avatar */}
            <div style={{ position: "relative", marginBottom: 14 }}>
              <div style={{ width: 104, height: 104, borderRadius: "50%", padding: 2.5, background: GRAD }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: CARD }}>
                  <Av
                    src={isEditing ? (avatarPreview || disp.avatar) : profile.avatar}
                    name={disp.name}
                    sz={99}
                  />
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{ position: "absolute", bottom: 2, right: 2, width: 28, height: 28, borderRadius: "50%", background: PINK, border: `2.5px solid ${BG}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <Edit2 size={11} color="#fff" />
                </button>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
                >
                  <Camera size={19} color={PINK} />
                  <span style={{ fontSize: 8, color: "#fff", marginTop: 3, textTransform: "uppercase", letterSpacing: 1 }}>Change</span>
                  <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImg} />
                </button>
              )}
            </div>

            {/* Name */}
            {isEditing ? (
              <div style={{ width: "100%", marginBottom: 5 }}>
                <input
                  name="name"
                  value={editForm?.name || ""}
                  onChange={handleChange}
                  style={{ ...inputBase, textAlign: "center", fontWeight: 700, fontSize: 15, borderColor: fieldErrors.name ? "#ef4444" : "rgba(255,255,255,0.07)" }}
                  placeholder="Your name"
                />
                {fieldErrors.name && (
                  <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4, textAlign: "left" }}>{fieldErrors.name}</p>
                )}
              </div>
            ) : (
              <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 3, letterSpacing: 0.2 }}>{profile.name}</div>
            )}

            {/* Handle (always derived, never manually entered) */}
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>{disp.handle}</div>

            {/* Subtitle */}
            {isEditing ? (
              <div style={{ width: "100%", marginBottom: 14 }}>
                <input
                  name="subtitle"
                  value={editForm?.subtitle || ""}
                  onChange={handleChange}
                  style={{ ...inputBase, textAlign: "center", fontSize: 12, borderColor: fieldErrors.subtitle ? "#ef4444" : "rgba(255,255,255,0.07)" }}
                  placeholder="Short bio (160 chars)"
                  maxLength={160}
                />
                {fieldErrors.subtitle && (
                  <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4, textAlign: "left" }}>{fieldErrors.subtitle}</p>
                )}
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "#6e6e82", lineHeight: 1.6, marginBottom: 16 }}>{profile.subtitle}</div>
            )}

            {/* Stats */}
            <div style={{ display: "flex", justifyContent: "space-around", width: "100%", marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              {[
                { v: profile.stats.following,  l: "Following" },
                { v: profile.stats.followers,  l: "Followers" },
                { v: profile.stats.following2, l: "Mutual" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            {isEditing ? (
              <div style={{ display: "flex", gap: 8, width: "100%" }}>
                <button
                  onClick={cancel}
                  disabled={saving}
                  style={{ flex: 1, padding: "8px 0", borderRadius: 50, fontSize: 12, fontWeight: 600, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: SUB, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  style={{ flex: 1, padding: "8px 0", borderRadius: 50, fontSize: 12, fontWeight: 700, background: GRAD, border: "none", color: "#fff", cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={12} />}
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                style={{ width: "100%", padding: "9px 0", borderRadius: 50, fontSize: 13, fontWeight: 700, background: GRAD, border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <Edit2 size={13} /> Edit Profile
              </button>
            )}
          </div>

          {/* RIGHT — About + Fan Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* ABOUT */}
            <div style={{ ...card(), padding: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 3, height: 17, background: PINK, borderRadius: 2 }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>About</span>
                </div>
                <User size={14} color={PINK} />
              </div>

              {isEditing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 4 }}>Description</label>
                    <textarea
                      name="description"
                      value={editForm?.description || ""}
                      onChange={handleChange}
                      rows={3}
                      maxLength={500}
                      style={{ ...inputBase, resize: "none", lineHeight: 1.6, borderColor: fieldErrors.description ? "#ef4444" : "rgba(255,255,255,0.07)" }}
                      onFocus={e => (e.target.style.borderColor = PINK)}
                      onBlur={e => (e.target.style.borderColor = fieldErrors.description ? "#ef4444" : "rgba(255,255,255,0.07)")}
                    />
                    {fieldErrors.description && (
                      <p style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>{fieldErrors.description}</p>
                    )}
                    <p style={{ fontSize: 10, color: MUTED, textAlign: "right", marginTop: 2 }}>{(editForm?.description || "").length}/500</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { name: "location", Icon: MapPin,   val: editForm?.location || "",  label: "Location",      errKey: "location" as const },
                      { name: "website",  Icon: LinkIcon,  val: editForm?.website || "",   label: "Website",       errKey: "website" as const },
                    ].map(({ name, Icon, val, label, errKey }) => (
                      <div key={name}>
                        <label style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 4 }}>{label}</label>
                        <div style={{ position: "relative" }}>
                          <Icon size={12} color={MUTED} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                          <input
                            name={name}
                            value={val}
                            onChange={handleChange}
                            style={{ ...inputBase, paddingLeft: 28, borderColor: fieldErrors[errKey] ? "#ef4444" : "rgba(255,255,255,0.07)" }}
                            onFocus={e => (e.target.style.borderColor = PINK)}
                            onBlur={e => (e.target.style.borderColor = fieldErrors[errKey] ? "#ef4444" : "rgba(255,255,255,0.07)")}
                          />
                        </div>
                        {fieldErrors[errKey] && (
                          <p style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>{fieldErrors[errKey]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: SUB, lineHeight: 1.7, marginBottom: 16 }}>{profile.description}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 28px" }}>
                    {[
                      { Icon: MapPin,   text: profile.location },
                      { Icon: Calendar, text: `Joined ${profile.joinedDate}` },
                      { Icon: LinkIcon, text: profile.website },
                      { Icon: Globe,    text: "Public Profile" },
                    ].map(({ Icon, text }, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: SUB }}>
                        <Icon size={12} color={PINK} style={{ flexShrink: 0 }} /> {text}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* FAN STATS */}
            <div style={{ ...card(), padding: 20 }}>
              <SH title="Fan Stats" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {[
                  { Icon: MessageSquare, val: "340",  lbl: "Comments",      c: "#8b5cf6" },
                  { Icon: ThumbsUp,      val: "1.2K", lbl: "Reactions",     c: "#d97706" },
                  { Icon: Users,         val: "56",   lbl: "Rooms Joined",  c: "#3b82f6" },
                  { Icon: Radio,         val: "78",   lbl: "Live Sessions", c: PINK },
                ].map(({ Icon, val, lbl, c }, i) => (
                  <div key={i} style={{ background: "#0F1014", borderRadius: 10, padding: "14px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    <Icon size={17} color={c} />
                    <span style={{ fontSize: 19, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{val}</span>
                    <span style={{ fontSize: 10, color: MUTED, textAlign: "center", lineHeight: 1.3 }}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ══ ROW 2: Posts feed | Sidebar ══ */}
        <div style={{ display: "grid", gridTemplateColumns: col2, gap: "18px", alignItems: "stretch", marginTop: 18 }}>

          {/* LEFT — Tabs + Posts */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

            {/* TABS */}
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 0 }}>
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "11px 14px", fontSize: 12, fontWeight: 600,
                  background: "none", border: "none", cursor: "pointer",
                  color: activeTab === tab ? PINK : MUTED,
                  position: "relative", transition: "color .15s",
                  whiteSpace: "nowrap",
                }}>
                  <span style={{ opacity: activeTab === tab ? 1 : 0.5 }}>{tabIcons[tab]}</span>
                  {tab}
                  {activeTab === tab && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: PINK, borderRadius: "2px 2px 0 0" }} />
                  )}
                </button>
              ))}
            </div>

            {/* POSTS TAB CONTENT */}
            {activeTab === "Posts" && (
              <>
                {postsError && (
                  <div style={{ ...card(), padding: 16, display: "flex", alignItems: "center", gap: 8, color: "#ef4444", fontSize: 13 }}>
                    <AlertCircle size={15} /> {postsError}
                  </div>
                )}

                {!postsLoading && posts.length === 0 && (
                  <div style={{ ...card(), padding: "40px 20px", textAlign: "center" }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>📝</div>
                    <p style={{ color: MUTED, fontSize: 13 }}>No posts yet. Share your first thought!</p>
                  </div>
                )}

                {posts.map(post => (
                  <PostCard
                    key={post.id || post._id}
                    post={post}
                    onDelete={handleDeletePost}
                    onVote={handleVote}
                    onLike={handleLike}
                    currentUserId={user?.userId || user?.email || ""}
                    currentUserName={profile.name}
                    onCommentAdded={(postId) => {
                      setPosts(prev => prev.map(p =>
                        (p.id || p._id) === postId
                          ? { ...p, commentCount: (p.commentCount || 0) + 1 }
                          : p
                      ));
                    }}
                    onCommentDeleted={(postId) => {
                      setPosts(prev => prev.map(p =>
                        (p.id || p._id) === postId
                          ? { ...p, commentCount: Math.max(0, (p.commentCount || 0) - 1) }
                          : p
                      ));
                    }}
                  />
                ))}

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} />

                {postsLoading && (
                  <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
                    <Loader2 size={20} color={PINK} style={{ animation: "spin 1s linear infinite" }} />
                  </div>
                )}
              </>
            )}

            {/* Other tabs — placeholder */}
            {activeTab !== "Posts" && (
              <div style={{ ...card(), padding: "40px 20px", textAlign: "center" }}>
                <p style={{ color: MUTED, fontSize: 13 }}>Coming soon</p>
              </div>
            )}

          </div>

          {/* RIGHT — Sidebar (desktop) */}
          {!isMobile && <div><Sidebar /></div>}

        </div>

        {/* Mobile sidebar */}
        {isMobile && <div style={{ marginTop: 14 }}><Sidebar /></div>}

        {/* ── INVITE YOUR FRIENDS ── */}
        <div style={{ marginTop: 14, ...card(), padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(232,67,122,0.08)", border: "1px solid rgba(232,67,122,0.16)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Users size={19} color={PINK} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: TXT, marginBottom: 3 }}>Invite Your Friends</div>
            <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>Invite your friends to join live rooms and enjoy the game together!</div>
          </div>
          <button style={{ padding: "9px 20px", borderRadius: 50, fontSize: 12, fontWeight: 700, background: GRAD, border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <Share2 size={12} /> Invite Friends
          </button>
        </div>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
