"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft, Edit2, MapPin, Calendar,
  Link as LinkIcon, Globe, User,
  MessageSquare, ThumbsUp, Users, Radio,
  Check, Share2, MoreHorizontal, UserPlus,
} from "lucide-react";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

/* ── Upload profile image to Firebase Storage ── */
// async function uploadProfileImage(file: File, userId: string): Promise<string> {
//   const storage = getStorage();
//   const storageRef = ref(storage, `profile-images/${userId}`);
//   await uploadBytes(storageRef, file);
//   return getDownloadURL(storageRef);
// }

/* ═══════════════════════════════
   DESIGN TOKENS
═══════════════════════════════ */
const BG    = "#070809";
const CARD  = "#0B0C10";
const INNER = "#121317";
const TXT   = "#f3f3f7";
const SUB   = "#a1a1af";
const MUTED = "#676777";
const PINK  = "#e8437a";
const GRAD  = "linear-gradient(90deg,#e8437a,#f4732a)";
const R     = 14;

const card = (extra = {}) => ({
  background: CARD,
  borderRadius: R,
  border: "1px solid rgba(255,255,255,0.015)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.28)",
  ...extra,
});

const inputBase = {
  background: INNER,
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 8,
  color: TXT,
  outline: "none",
  width: "100%",
  padding: "8px 12px",
  fontSize: 13,
  boxSizing: "border-box" as const,
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function deriveHandle(name: string) {
  const slug = String(name || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
  return slug ? `@${slug.slice(0, 32)}` : "@user";
}

function getStoredUserId() {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem("auth_user");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.userId || parsed?.email || null;
  } catch {
    return null;
  }
}

/* ── Avatar ── */
function Av({ src, name, sz = 38 }: { src?: string; name: string; sz?: number }) {
  return (
    <div style={{
      width: sz, height: sz, borderRadius: "50%", flexShrink: 0,
      overflow: "hidden", background: GRAD,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: sz * 0.38, fontWeight: 700, color: "#fff",
    }}>
      {src
        ? <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        : (name || "U").charAt(0).toUpperCase()}
    </div>
  );
}

/* ─── Section heading ─── */
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

/* ─── Social icons ─── */
function SocialIcon({ icon }: { icon: string }) {
  const wrap = {
    width: 32, height: 32, borderRadius: "50%", background: "#0F1014",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  };
  if (icon === "ig") return (
    <div style={wrap}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig)" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" stroke="url(#ig)" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="#f4732a" />
        <defs>
          <linearGradient id="ig" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f4732a" /><stop offset="1" stopColor="#e8437a" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
  if (icon === "x") return (
    <div style={wrap}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="#aaa">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </div>
  );
  return (
    <div style={wrap}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff4444">
        <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C16.3 5 12 5 12 5s-4.3 0-6.9.1c-.4.1-1.3.1-2.1.9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.8C6.8 19 12 19 12 19s4.3 0 6.9-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9l5.7 2.8-5.7 2.7z" />
      </svg>
    </div>
  );
}

/* ── Empty profile shape — NO hardcoded content ── */
// All real values come from Firestore via /api/profile.
// These are the blank defaults shown only until the API responds.
const EMPTY_PROFILE = {
  name:        "",
  handle:      "",
  avatar:      "",
  subtitle:    "",
  description: "",
  location:    "",
  joinedDate:  "",
  website:     "",
  stats:       { following: null as number | null, followers: null as string | null, connections: null as number | null },
  interests:   [] as string[],
  favoriteTeams: [] as { name: string; league: string; liked: boolean; initial: string; color: string }[],
  socialLinks: [] as { platform: string; handle: string; icon: string }[],
};

/* ═══════════════════════════════
   MAIN PAGE
═══════════════════════════════ */
function ProfilePageInner() {
  const [isEditing, setIsEditing]   = useState(false);
  const [activeTab, setActiveTab]   = useState("Posts");
  const [isMobile, setIsMobile]     = useState(false);
  const { user, loading: authLoading, getUserDisplayName } = useAuth();

  // UI state
  const [saveSuccess, setSaveSuccess]   = useState(false);
  const [fieldErrors, setFieldErrors]   = useState<Record<string, string>>({});
  const [apiError, setApiError]         = useState<string | null>(null);
  const [isSaving, setIsSaving]         = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Image pick state
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl]               = useState<string | null>(null);

  const searchParams   = useSearchParams();
  const viewedUserId   = searchParams.get("userId");
  const loggedInUserId = user?.userId || user?.email || getStoredUserId();
  const isOwnProfile   = !viewedUserId || viewedUserId === loggedInUserId;

  const [friendStatus, setFriendStatus] = useState<"none" | "pending" | "friends">("none");
  useEffect(() => {
  if (
    !loggedInUserId ||
    !viewedUserId
  ) {
    return;
  }

  const loadStatus =
    async () => {
      try {
        const response =
          await fetch(
            `/api/follow-request/status?senderUserId=${encodeURIComponent(
              loggedInUserId
            )}&receiverUserId=${encodeURIComponent(
              viewedUserId
            )}`
          );

        const data =
          await response.json();

        if (
          data.success
        ) {
          if (
            data.status ===
            "accepted"
          ) {
            setFriendStatus(
              "friends"
            );
          } else if (
            data.status ===
            "pending"
          ) {
            setFriendStatus(
              "pending"
            );
          } else {
            setFriendStatus(
              "none"
            );
          }
        }
      } catch (
        error
      ) {
        console.error(
          error
        );
      }
    };

  loadStatus();
}, [
  loggedInUserId,
  viewedUserId,
]);
 const sendFollowRequest = async () => {
  if (!viewedUserId) {
    console.error("No viewed user id found");
    return;
  }

  try {
    const response = await fetch(
      "/api/follow-request",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderUserId: loggedInUserId,
          receiverUserId: viewedUserId,
          senderName:
            user?.firstName ||
            user?.name ||
            getUserDisplayName?.(),
          receiverName: profile.name,
        }),
      }
    );

    const data = await response.json();

   if (data.success) {
  setFriendStatus("pending");
} else {
  alert(data.message || "Failed to send request");
}
  } catch (error) {
    console.error(
      "Follow request failed",
      error
    );
  }
};
  /* ── Responsive ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Derive display name from auth ── */
  const authDisplayName: string = authLoading
    ? ""
    : (getUserDisplayName ? getUserDisplayName() : (user?.name || user?.displayName || user?.email || ""));

  // Profile state — starts blank; filled from Firestore
  const [profile, setProfile] = useState({ ...EMPTY_PROFILE });

  /* ── Sync name/handle from auth when auth resolves (own profile only) ── */
  useEffect(() => {
    if (authDisplayName && isOwnProfile) {
      setProfile(prev => ({
        ...prev,
        name:   prev.name || authDisplayName,       // only use auth name if Firestore name is still empty
        handle: prev.handle || deriveHandle(authDisplayName),
      }));
    }
  }, [authDisplayName, isOwnProfile]);

  /* ══════════════════════════════════════════
     LOAD PROFILE FROM FIREBASE (on page open)
     This ensures the user sees their real saved
     data after a refresh — never hardcoded text.
  ══════════════════════════════════════════ */
  const profileTargetId = viewedUserId || loggedInUserId;

  useEffect(() => {
    if (!profileTargetId) {
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    // FIX #1 (ROOT CAUSE): Added `credentials: "include"` so the browser
    // attaches the httpOnly "token" cookie. Without this the server's
    // getUser() always returns null → 401 Unauthorized. The frontend's
    // catch() block then displays the generic "network error" message.
    fetch(`/api/profile?userId=${encodeURIComponent(profileTargetId)}`, {
      credentials: "include",
    })
      .then(async r => {
        // FIX #2: Check r.ok BEFORE calling r.json(). If the server returns
        // 401/500 with a non-JSON body, r.json() throws a SyntaxError which
        // the original .catch(() => {}) silently swallowed — hiding the real
        // error and leaving the page stuck in a loading state.
        if (!r.ok) {
          const text = await r.text().catch(() => "");
          throw new Error(`HTTP ${r.status}: ${text || r.statusText}`);
        }
        return r.json();
      })
      .then((data: Record<string, string | null>) => {
        if (data && !data.error) {
          setProfile(prev => ({
  ...prev,

  name: data.name || prev.name,
  description:
    data.description ||
    prev.description,

  location:
    data.location ||
    prev.location,

  avatar:
    data.avatarUrl ||
    prev.avatar,

  website:
    data.website ||
    prev.website,

  subtitle:
    data.subtitle ||
    prev.subtitle,

  joinedDate:
    data.joinedDate ||
    prev.joinedDate,

  handle:
    data.name
      ? deriveHandle(data.name)
      : prev.handle,

  stats: {
    ...prev.stats,

    followers:
      typeof data.followers ===
      "number"
        ? data.followers
        : prev.stats.followers,

    following:
      typeof data.following ===
      "number"
        ? data.following
        : prev.stats.following,
  },
}));

          if (isOwnProfile) {
            setEditForm(prev => ({
              ...prev,
              name:        data.name        || prev.name,
              description: data.description || prev.description,
              location:    data.location    || prev.location,
              avatar:      data.avatarUrl   || prev.avatar,
              website:     data.website     || prev.website,
              subtitle:    data.subtitle    || prev.subtitle,
            }));
          }
        }
      })
      .catch((err) => {
        // FIX #3: Surface the actual error instead of silently swallowing it.
        // The original .catch(() => {}) discarded the error so developers had
        // no visibility into whether it was a 401, a network timeout, or a
        // JSON parse failure.
        console.error("Failed to load profile:", err);
      })
      .finally(() => setProfileLoading(false));
  }, [profileTargetId]);

  const [followingCount, setFollowingCount]     = useState<number | null>(null);
  const followingCountRef                        = useRef<number | null>(null);
  const [followingLoading, setFollowingLoading] = useState(false);
  const [followingError, setFollowingError]     = useState<string | null>(null);
  const [followingItems, setFollowingItems]     = useState<Record<string, unknown>[]>([]);
  const [followingPreviews, setFollowingPreviews] = useState<Record<string, { profileId?: string; image?: string; label?: string }>>({});
  const [unfollowingId, setUnfollowingId]       = useState<string | null>(null);
  const router = useRouter();

  const [editForm, setEditForm] = useState({ ...EMPTY_PROFILE });

  /* Keep editForm name in sync when auth loads (only if still empty) */
  useEffect(() => {
    if (authDisplayName) {
      setEditForm(prev => ({
        ...prev,
        name:   prev.name   || authDisplayName,
        handle: prev.handle || deriveHandle(authDisplayName),
      }));
    }
  }, [authDisplayName]);

  const disp = isEditing ? editForm : profile;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => {
      const u = { ...prev, [name]: value };
      if (name === "name") u.handle = deriveHandle(value);
      return u;
    });
    // Clear the error for this field as the user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  /* ── Image picker handler ── */
  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  /* ── Client-side validation (mirrors route.ts rules exactly) ── */
  function validate(form: typeof editForm): Record<string, string> {
    const e: Record<string, string> = {};

    // Name: required, 2–60 chars, letters/spaces/hyphens/apostrophes only
    const trimmedName = form.name.trim();
    if (!trimmedName) {
      e.name = "Name is required.";
    } else if (trimmedName.length < 2) {
      e.name = "Name must be at least 2 characters.";
    } else if (trimmedName.length > 60) {
      e.name = "Name must be 60 characters or fewer.";
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'\-]+$/.test(trimmedName)) {
      e.name = "Name must contain letters only (spaces, hyphens and apostrophes allowed).";
    }

    if (form.subtitle    && form.subtitle.length    > 160) e.subtitle    = "Subtitle must be 160 characters or fewer.";
    if (form.description && form.description.length > 500) e.description = "Description must be 500 characters or fewer.";
    if (form.location    && form.location.length    > 80)  e.location    = "Location must be 80 characters or fewer.";

    if (form.website) {
      try {
        const url = new URL(form.website.startsWith("http") ? form.website : `https://${form.website}`);
        if (!["http:", "https:"].includes(url.protocol)) e.website = "Website must start with http:// or https://.";
      } catch {
        e.website = "Website must be a valid URL (e.g. https://example.com).";
      }
    }

    return e;
  }
//   async function uploadImageToCloudinary(file: File) {
//   const formData = new FormData();

//   formData.append("file", file);

//   const res = await fetch("/api/upload-image", {
//     method: "POST",
//     body: formData,
//   });

//   const data = await res.json();

//   return data.secure_url;
// }
  /* ══════════════════════════════════════════
     SAVE — validates, then persists to Firestore
     via POST /api/profile. On success, local
     state is updated so the page reflects new
     values instantly without a refresh.
  ══════════════════════════════════════════ */
const save = async () => {
  const errors = validate(editForm);
  if (Object.keys(errors).length > 0) {
    setFieldErrors(errors);
    return;
  }

  setIsSaving(true);
  setApiError(null);
//   let avatarUrl = profile.avatar;

// if (selectedImageFile) {
//   avatarUrl = await uploadImageToCloudinary(
//     selectedImageFile
//   );
// }

  try {
    // ✅ Read the token exactly as your other fetches do
    const stored = window.localStorage.getItem("auth_user");
    const token = stored ? JSON.parse(stored)?.token : null;

    const formData =
  new FormData();

formData.append(
  "name",
  editForm.name
);

formData.append(
  "subtitle",
  editForm.subtitle
);

formData.append(
  "description",
  editForm.description
);

formData.append(
  "location",
  editForm.location
);

formData.append(
  "website",
  editForm.website
);

if (selectedImageFile) {
  formData.append(
    "profilePicture",
    selectedImageFile
  );
}

const headers: Record<
  string,
  string
> = {};

if (token) {
  headers.Authorization =
    `Bearer ${token}`;
}

const res = await fetch(
  "/api/profile",
  {
    method: "POST",
    headers,
    credentials: "include",
    body: formData,
  }
);
 
  // body: JSON.stringify({
  //   name: editForm.name,
  //   subtitle: editForm.subtitle,
  //   description: editForm.description,
  //   location: editForm.location,
  //   website: editForm.website,
  //   avatarUrl,
  // }),


    // ... rest of your code unchanged

      // FIX #6: Parse response body safely. If the server sent a non-JSON
      // error page (e.g. a 502 from a proxy, or a Next.js error HTML page),
      // calling res.json() throws and the catch() block shows "network error"
      // instead of the real HTTP error. We now read the text first, attempt
      // JSON parsing, and fall back to a plain-text error message.
      const rawText = await res.text().catch(() => "");
      let json: Record<string, unknown> = {};
      try { json = rawText ? JSON.parse(rawText) : {}; } catch { /* ignore parse errors */ }

      if (!res.ok) {
        // Surface server-side validation errors into the form
        if (json.fields && typeof json.fields === "object") {
          setFieldErrors(json.fields as Record<string, string>);
        } else {
          setApiError(
            (typeof json.error === "string" ? json.error : null) ||
            `Save failed (HTTP ${res.status}). Please try again.`
          );
        }
        return;
      }

      // 3️⃣ Update local state so the UI reflects saved values immediately
      setProfile(prev => ({
  ...prev,
  name: editForm.name,
  subtitle: editForm.subtitle,
  description: editForm.description,
  location: editForm.location,
  website: editForm.website,
  // avatar: avatarUrl,
  avatar: previewUrl || prev.avatar,
  handle: deriveHandle(editForm.name),
}));

      setIsEditing(false);
      setFieldErrors({});
      setSelectedImageFile(null);
      setPreviewUrl(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
      setApiError("A network error occurred. Please check your connection and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const cancel = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
    setFieldErrors({});
    setApiError(null);
    setSelectedImageFile(null);
    setPreviewUrl(null);
  };

  const getPlayerKey = (item: Record<string, unknown>) => {
    return (String(item.followingplayername || item.id || "")).trim().toLowerCase();
  };

  const loadFollowingCount = async () => {
    const uid = user?.userId || user?.email || getStoredUserId();
    if (!uid) {
      setFollowingCount(null);
      setFollowingItems([]);
      return null;
    }

    const url = `/api/following?userId=${encodeURIComponent(uid)}`;
    const res  = await fetch(url, { credentials: "include" }); // FIX #8: was missing credentials:include
    // FIX #9: Check res.ok BEFORE updating state. The original code set
    // followingItems and followingCount from the response body even on
    // error responses, then threw afterwards — leaving stale/wrong data
    // in the UI while also propagating the error to the caller.
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const text = await res.text().catch(() => "");
    let data: Record<string, unknown> | null = null;
    try { data = text ? JSON.parse(text) : null; } catch { /* ignore */ }

    const list = Array.isArray(data?.following) ? (data.following as Record<string, unknown>[]) : [];
    const resolvedCount =
      typeof data?.count === "number" ? data.count
      : typeof data?.total === "number" ? data.total
      : list.length;

    setFollowingItems(list);
    setFollowingCount(resolvedCount);
    try { setProfile(p => ({ ...p, stats: { ...p.stats, following: resolvedCount } })); } catch { /* ignore */ }

    return resolvedCount;
  };

  useEffect(() => {
    if (!followingItems.length) return;
    let cancelled = false;

    const resolvePreviews = async () => {
      const entries = followingItems.filter(item => item.followingplayername).slice(0, 12);
      await Promise.all(entries.map(async item => {
        const key = getPlayerKey(item);
        if (!key || followingPreviews[key]) return;
        try {
          const response = await fetch(`/api/global-search?q=${encodeURIComponent(String(item.followingplayername || ""))}`, { credentials: "include" });
          if (!response.ok) return;
          const body = await response.json().catch(() => null);
          const results = Array.isArray(body?.results) ? body.results as Record<string, unknown>[] : [];
          const match = results.find(r => r?.type === "player" && normalizeString(r.name) === normalizeString(item.followingplayername));
          const profileId = String(match?.playerProfilesId || "");
          const image = String(match?.image || item.image || item.avatar || item.logo || "");
          const label = typeof match?.jerseyNumber === "number"
            ? `Jersey #${match.jerseyNumber}`
            : Array.isArray(match?.category) && (match.category as string[]).length ? (match.category as string[])[0] : undefined;
          if (!cancelled && (profileId || image)) {
            setFollowingPreviews(prev => ({ ...prev, [key]: { profileId: profileId || prev[key]?.profileId, image: image || prev[key]?.image, label: label || prev[key]?.label } }));
          }
        } catch { /* ignore */ }
      }));
    };

    resolvePreviews();
    return () => { cancelled = true; };
  }, [followingItems]);

  const handleUnfollowFromList = async (item: Record<string, unknown>) => {
    const uid        = user?.userId || user?.email || getStoredUserId();
    const playerName = String(item.followingplayername || "");

    if (!uid || !playerName) {
      setFollowingError("Unable to unfollow this player right now.");
      return;
    }

    const removeFromState = () => {
      setFollowingItems(prev => prev.filter(entry => entry.id !== item.id));
      setFollowingCount(prev => {
        const next = Math.max(0, (prev ?? 0) - 1);
        setProfile(ps => ({ ...ps, stats: { ...ps.stats, following: next } }));
        return next;
      });
    };

    const reqBody = { userId: uid, followingplayername: playerName };
    const itemKey = String(item.id || playerName);

    try {
      setUnfollowingId(itemKey);
      let res = await fetch("/api/following", { method: "DELETE", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(reqBody) });
      if (res.status === 405) {
        const q = `/api/following?userId=${encodeURIComponent(uid)}&followingplayername=${encodeURIComponent(playerName)}`;
        res = await fetch(q, { method: "DELETE", credentials: "include" });
      }
      if (res.status === 405) {
        const unfollowUrl = process.env.NEXT_PUBLIC_FOLLOWING_API_URL ? new URL("/unfollow", process.env.NEXT_PUBLIC_FOLLOWING_API_URL).pathname : "/api/following/unfollow";
        res = await fetch(unfollowUrl, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(reqBody) });
      }
      if (res.status === 200 || res.status === 204) { removeFromState(); return; }
      throw new Error(`Failed to unfollow ${playerName}`);
    } catch (err) {
      setFollowingError((err as Error)?.message || "Failed to unfollow player");
    } finally {
      setUnfollowingId(null);
    }
  };

  const openPlayerProfileFromFollowing = async (item: Record<string, unknown>) => {
    const key     = getPlayerKey(item);
    const preview = followingPreviews[key];
    let profileId = String(preview?.profileId || item.playerProfilesId || "");

    if (!profileId && item.followingplayername) {
      try {
        const response = await fetch(`/api/global-search?q=${encodeURIComponent(String(item.followingplayername))}`, { credentials: "include" });
        if (response.ok) {
          const body    = await response.json().catch(() => null);
          const results = Array.isArray(body?.results) ? body.results as Record<string, unknown>[] : [];
          const match   = results.find(r => r?.type === "player" && normalizeString(r.name) === normalizeString(item.followingplayername));
          profileId     = String(match?.playerProfilesId || profileId);
        }
      } catch { /* ignore */ }
    }

    if (!profileId) return;
    router.push(`/MainModules/PlayersProfile?id=${encodeURIComponent(profileId)}&tab=highlights`);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setFollowingLoading(true);
      setFollowingError(null);
      try {
        const count = await loadFollowingCount();
        if (!cancelled && typeof count === "number") setFollowingCount(count);
      } catch (err) {
        if (!cancelled) {
          setFollowingError((err as Error)?.message || String(err));
          setFollowingCount(null);
          setFollowingItems([]);
        }
      } finally {
        if (!cancelled) setFollowingLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.email, user?.userId]);

  useEffect(() => { followingCountRef.current = followingCount; }, [followingCount]);

  const tabs     = ["Posts", "Live Reactions", "Comments", "Following"];
  const chips    = [
    { bg: "rgba(232,67,122,0.14)", color: "#e8437a" },
    { bg: "rgba(244,115,42,0.14)", color: "#f4732a" },
    { bg: "rgba(139,92,246,0.14)", color: "#9b7ef8" },
    { bg: "rgba(56,124,220,0.14)", color: "#5b9ae8" },
    { bg: "rgba(34,180,100,0.14)", color: "#38b46e" },
  ];
  const tabIcons = {
    "Posts":          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
    "Live Reactions": <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.49-.01a6 6 0 0 1 0-8.49"/></svg>,
    "Comments":       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    "Following":      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
  };

  const col1 = isMobile ? "1fr" : "230px 1fr";
  const col2 = isMobile ? "1fr" : "1fr 264px";

  /* ── Following section ── */
  const FollowingSection = () => (
    <div style={{ ...card(), padding: 18 }}>
      <SH title="Following" />
      {followingLoading ? (
        <div style={{ fontSize: 13, color: SUB, padding: "8px 0" }}>Loading following list…</div>
      ) : followingItems.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {followingItems.map((item, index) => (
            <div
              key={String(item.id || `${item.followingplayername || "item"}-${index}`)}
              role="button" tabIndex={0}
              onClick={() => openPlayerProfileFromFollowing(item)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPlayerProfileFromFollowing(item); } }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 12, background: "#0F1014", border: "1px solid rgba(255,255,255,0.04)", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#15161c", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", flexShrink: 0, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {(() => {
                    const key      = getPlayerKey(item);
                    const preview  = followingPreviews[key];
                    const imageSrc = String(preview?.image || item.image || item.avatar || item.logo || "");
                    return imageSrc
                      ? <img src={imageSrc} alt={String(item.followingplayername || "Player")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : (String(item.followingplayername || "?")).charAt(0).toUpperCase();
                  })()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{String(item.followingplayername || "Unknown player")}</div>
                  <div style={{ fontSize: 11, color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {(() => { const k = getPlayerKey(item); const p = followingPreviews[k]; return p?.label || String(item.playerProfilesId || "Tap to open player profile"); })()}
                  </div>
                </div>
              </div>
              <button type="button" onClick={e => { e.stopPropagation(); handleUnfollowFromList(item); }}
                disabled={unfollowingId === (String(item.id || item.followingplayername || ""))}
                style={{ fontSize: 11, color: PINK, fontWeight: 700, background: "transparent", border: "1px solid rgba(232,67,122,0.28)", borderRadius: 999, padding: "7px 12px", cursor: "pointer", opacity: unfollowingId === String(item.id || item.followingplayername || "") ? 0.7 : 1 }}>
                {unfollowingId === String(item.id || item.followingplayername || "") ? "Unfollowing…" : "Unfollow"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 13, color: SUB, padding: "8px 0" }}>No following items found.</div>
      )}
    </div>
  );

  /* ── Sidebar ── */
  const Sidebar = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Interests */}
      <div style={{ ...card(), padding: 18 }}>
        <SH title="Interests" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {profile.interests.length > 0
            ? profile.interests.map((interest, i) => {
                const c = chips[i % chips.length];
                return <span key={interest} style={{ padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: c.bg, color: c.color }}>{interest}</span>;
              })
            : <span style={{ fontSize: 12, color: MUTED }}>No interests added yet.</span>
          }
        </div>
      </div>

      {/* Favorite Teams */}
      <div style={{ ...card(), padding: 18 }}>
        <SH title="Favorite Teams" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {profile.favoriteTeams.length > 0
            ? profile.favoriteTeams.map((team, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: team.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff", flexShrink: 0 }}>{team.initial}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: TXT }}>{team.name}</div>
                      <div style={{ fontSize: 11, color: MUTED }}>{team.league}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 16 }}>{team.liked ? "❤️" : "🤍"}</span>
                </div>
              ))
            : <span style={{ fontSize: 12, color: MUTED }}>No teams added yet.</span>
          }
        </div>
      </div>

      {/* Social Links */}
      <div style={{ ...card(), padding: 18 }}>
        <SH title="Social Links" />
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {profile.socialLinks.length > 0
            ? profile.socialLinks.map((link, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <SocialIcon icon={link.icon} />
                  <span style={{ fontSize: 13, color: SUB, fontWeight: 500 }}>{link.handle}</span>
                </div>
              ))
            : <span style={{ fontSize: 12, color: MUTED }}>No social links yet.</span>
          }
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════
     RENDER
  ═══════════════════════════════ */
  return (
    <div style={{ minHeight: "100vh", background: BG, color: TXT, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", fontSize: 14 }}>

      {/* TOPBAR */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: BG, borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/MainModules/HomePage" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "#9090a8", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>
          <ArrowLeft size={15} /> Back
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {saveSuccess && (
            <span style={{ fontSize: 12, color: "#22c55e", display: "flex", alignItems: "center", gap: 5 }}>
              <Check size={13} /> Profile saved!
            </span>
          )}
          {!isEditing && (
            <button
              onClick={() => navigator.share?.({ title: profile.name, url: window.location.href }).catch(() => {})}
              style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "5px 12px", color: MUTED, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}
            >
              <Share2 size={11} /> Share
            </button>
          )}
        </div>
      </div>

      {/* PAGE BODY */}
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: isMobile ? "16px 14px 60px" : "24px 24px 72px" }}>

        {/* Loading skeleton for initial data fetch */}
        {profileLoading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: SUB, fontSize: 13 }}>
            Loading profile…
          </div>
        )}

        {!profileLoading && (
          <>
            {/* ROW 1: Identity card | About + Fan Stats */}
            <div style={{ display: "grid", gridTemplateColumns: col1, gap: 18, alignItems: "stretch" }}>

              {/* Identity card */}
              <div style={{ ...card(), padding: "24px 18px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>

                {/* Avatar */}
                <div style={{ marginBottom: 14, position: "relative", display: "inline-block" }}>
                  <div style={{ width: 104, height: 104, borderRadius: "50%", padding: 2.5, background: GRAD }}>
                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: CARD }}>
                      <Av src={isEditing && previewUrl ? previewUrl : profile.avatar} name={profile.name || "U"} sz={99} />
                    </div>
                  </div>
                  {isEditing && (
                    <label title="Change photo" style={{ position: "absolute", bottom: 4, right: 4, width: 30, height: 30, borderRadius: "50%", background: GRAD, border: `2px solid ${CARD}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImagePick} />
                    </label>
                  )}
                </div>

                {/* Name */}
                {isEditing ? (
                  <div style={{ width: "100%", marginBottom: 5 }}>
                    <input
                      name="name"
                      value={editForm.name}
                      onChange={handleChange}
                      style={{ ...inputBase, textAlign: "center", fontWeight: 700, fontSize: 15, borderColor: fieldErrors.name ? "#ef4444" : "rgba(255,255,255,0.07)" }}
                      placeholder="Your name"
                    />
                    {fieldErrors.name && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4, textAlign: "left" }}>{fieldErrors.name}</p>}
                  </div>
                ) : (
                  <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 3 }}>
                    {authLoading ? "Loading…" : (profile.name || authDisplayName || "—")}
                  </div>
                )}

                <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>{disp.handle}</div>

                {/* Subtitle */}
                {isEditing ? (
                  <div style={{ width: "100%", marginBottom: 14 }}>
                    <input
                      name="subtitle"
                      value={editForm.subtitle}
                      onChange={handleChange}
                      maxLength={160}
                      style={{ ...inputBase, textAlign: "center", fontSize: 12, borderColor: fieldErrors.subtitle ? "#ef4444" : "rgba(255,255,255,0.07)" }}
                      placeholder="Short bio (160 chars)"
                    />
                    {fieldErrors.subtitle && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4, textAlign: "left" }}>{fieldErrors.subtitle}</p>}
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: "#6e6e82", lineHeight: 1.6, marginBottom: 16 }}>
                    {profile.subtitle || <span style={{ color: MUTED, fontStyle: "italic" }}>No bio yet.</span>}
                  </div>
                )}

                {/* Stats */}
                <div style={{ display: "flex", justifyContent: "space-around", width: "100%", marginBottom: 16, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {[
                    // { v: followingLoading ? "…" : followingCount === null ? "—" : followingCount, l: "Following" },
                    {
  v:
    profile.stats.following ??
    "—",

  l: "Following"
},
                    { v: profile.stats.followers ?? "—", l: "Followers" },
                    { v: profile.stats.connections ?? "—", l: "Connections" },
                  ].map((s, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{s.v}</div>
                      <div style={{ fontSize: 10, color: MUTED, marginTop: 4 }}>{s.l}</div>
                      {s.l === "Following" && followingError && (
                        <div style={{ fontSize: 10, color: "#ff6b6b", marginTop: 6 }}>{followingError}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* API-level save error */}
                {apiError && isEditing && (
                  <div style={{ width: "100%", padding: "8px 12px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: 12, marginBottom: 10, textAlign: "left" }}>
                    {apiError}
                  </div>
                )}

                {/* Edit / Save / Cancel */}
                {isOwnProfile ? (
                  isEditing ? (
                    <div style={{ display: "flex", gap: 8, width: "100%" }}>
                      <button onClick={cancel} disabled={isSaving} style={{ flex: 1, padding: "8px 0", borderRadius: 50, fontSize: 12, fontWeight: 600, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: SUB, cursor: "pointer", opacity: isSaving ? 0.5 : 1 }}>
                        Cancel
                      </button>
                      <button onClick={save} disabled={isSaving} style={{ flex: 1, padding: "8px 0", borderRadius: 50, fontSize: 12, fontWeight: 700, background: GRAD, border: "none", color: "#fff", cursor: isSaving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, opacity: isSaving ? 0.7 : 1 }}>
                        {isSaving ? (
                          <><span style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> Saving…</>
                        ) : (
                          <><Check size={12} /> Save</>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                      <button onClick={() => setIsEditing(true)} style={{ width: "100%", padding: "9px 0", borderRadius: 50, fontSize: 13, fontWeight: 700, background: GRAD, border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <Edit2 size={13} /> Edit Profile
                      </button>
                    </div>
                  )
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                    <button
                    disabled={friendStatus !== "none"}
                      onClick={() => {
  if (friendStatus === "none") {
    sendFollowRequest();
  }
}}
                      style={{ width: "100%", padding: "9px 0", borderRadius: 50, fontSize: 13, fontWeight: 700, background: friendStatus === "none" ? GRAD : friendStatus === "pending" ? "transparent" : "rgba(34,197,94,0.15)", border: friendStatus === "none" ? "none" : friendStatus === "pending" ? `1px solid rgba(232,67,122,0.35)` : "1px solid rgba(34,197,94,0.35)", color: friendStatus === "friends" ? "#22c55e" : "#fff", cursor: friendStatus === "friends" ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all .2s ease" }}
                    >
                      {friendStatus === "none"    && <><UserPlus size={13} /> Follow</>}
                      {friendStatus === "pending" && <><Check size={13} /> Request Sent</>}
                      {friendStatus === "friends" && <><Check size={13} /> Following</>}
                    </button>
                  </div>
                )}
              </div>

              {/* About + Fan Stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                {/* About */}
                <div style={{ ...card(), padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 3, height: 17, background: PINK, borderRadius: 2 }} />
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>About</span>
                    </div>
                    <User size={14} color={isOwnProfile ? PINK : "transparent"} />
                  </div>

                  {isEditing ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div>
                        <label style={{ fontSize: 10, color: MUTED, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 4 }}>Description</label>
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleChange}
                          rows={3}
                          maxLength={500}
                          style={{ ...inputBase, resize: "none", lineHeight: 1.6, borderColor: fieldErrors.description ? "#ef4444" : "rgba(255,255,255,0.07)" }}
                          onFocus={e => (e.target.style.borderColor = PINK)}
                          onBlur={e  => (e.target.style.borderColor = fieldErrors.description ? "#ef4444" : "rgba(255,255,255,0.07)")}
                        />
                        {fieldErrors.description && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>{fieldErrors.description}</p>}
                        <p style={{ fontSize: 10, color: MUTED, textAlign: "right", marginTop: 2 }}>{editForm.description.length}/500</p>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {([
                          { name: "location", Icon: MapPin,  val: editForm.location, label: "Location", errKey: "location" },
                          { name: "website",  Icon: LinkIcon, val: editForm.website,  label: "Website",  errKey: "website"  },
                        ] as const).map(({ name, Icon, val, label, errKey }) => (
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
                                onBlur={e  => (e.target.style.borderColor = fieldErrors[errKey] ? "#ef4444" : "rgba(255,255,255,0.07)")}
                              />
                            </div>
                            {fieldErrors[errKey] && <p style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>{fieldErrors[errKey]}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: 13, color: SUB, lineHeight: 1.7, marginBottom: 16 }}>
                        {profile.description || <span style={{ color: MUTED, fontStyle: "italic" }}>No description yet.</span>}
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 28px" }}>
                        {[
                          { Icon: MapPin,   text: profile.location  || "—" },
                          { Icon: Calendar, text: profile.joinedDate ? `Joined ${profile.joinedDate}` : "—" },
                          { Icon: LinkIcon, text: profile.website   || "—" },
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

                {/* Fan Stats */}
                <div style={{ ...card(), padding: 20 }}>
                  <SH title="Fan Stats" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                    {[
                      { Icon: MessageSquare, val: "340",  lbl: "Comments",      c: "#8b5cf6" },
                      { Icon: ThumbsUp,      val: "1.2K", lbl: "Reactions",     c: "#d97706" },
                      { Icon: Users,         val: "56",   lbl: "Rooms Joined",  c: "#3b82f6" },
                      { Icon: Radio,         val: "78",   lbl: "Live Sessions", c: PINK      },
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

            {/* ROW 2: Activity Tabs | Sidebar */}
            <div style={{ display: "grid", gridTemplateColumns: col2, gap: 18, marginTop: 18 }}>

              {/* LEFT — Tab content */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                {/* TABS */}
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 0 }}>
                  {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "11px 14px", fontSize: 12, fontWeight: 600, background: "none", border: "none", cursor: "pointer", color: activeTab === tab ? PINK : MUTED, position: "relative", transition: "color .15s", whiteSpace: "nowrap" }}>
                      <span style={{ opacity: activeTab === tab ? 1 : 0.5 }}>{tabIcons[tab as keyof typeof tabIcons]}</span>
                      {tab}
                      {activeTab === tab && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: PINK, borderRadius: "2px 2px 0 0" }} />}
                    </button>
                  ))}
                </div>

                {activeTab === "Following" ? (
                  <FollowingSection />
                ) : (
                  <>
                    {/* POST 1 */}
                    <div style={{ ...card(), padding: 18 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ position: "relative" }}>
                            <Av src={profile.avatar} name={profile.name || "U"} sz={40} />
                            <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, borderRadius: "50%", background: "#22c55e", border: `2px solid ${CARD}` }} />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>{profile.name || authDisplayName || "User"}</div>
                            <div style={{ fontSize: 11, color: MUTED }}>{profile.handle} · 2h ago</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: "rgba(232,67,122,0.12)", color: PINK, border: "1px solid rgba(232,67,122,0.22)" }}>📌 Pinned</span>
                          <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, display: "flex" }}><MoreHorizontal size={15} /></button>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: SUB, lineHeight: 1.65, marginBottom: 13 }}>
                        What a match! India showed pure class under pressure. 💙<br />This is why we love cricket! 🏏🔥
                      </p>
                      <div style={{ background: "#0F1014", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#0f3e7a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🇮🇳</div>
                          <div><div style={{ fontSize: 13, fontWeight: 800, color: TXT }}>IND 198/7</div><div style={{ fontSize: 10, color: MUTED }}>20 Overs</div></div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: "rgba(232,67,122,0.13)", color: PINK, border: "1px solid rgba(232,67,122,0.26)", display: "inline-block", marginBottom: 4 }}>LIVE</div>
                          <div style={{ fontSize: 10, color: "#6e6e82" }}>India won by 7 runs</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 9, flexDirection: "row-reverse" }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#1a4d28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🇦🇺</div>
                          <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, fontWeight: 800, color: TXT }}>AUS 191/9</div><div style={{ fontSize: 10, color: MUTED }}>20 Overs</div></div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 18, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                        {[{ Icon: ThumbsUp, n: 256 }, { Icon: MessageSquare, n: 48 }, { Icon: Share2, n: 12 }].map(({ Icon, n }, i) => (
                          <button key={i} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 12, fontWeight: 500 }}>
                            <Icon size={13} /> {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* POST 2 */}
                    <div style={{ ...card(), padding: 18 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Av src={profile.avatar} name={profile.name || "U"} sz={40} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: TXT }}>{profile.name || authDisplayName || "User"}</div>
                            <div style={{ fontSize: 11, color: MUTED }}>{profile.handle} · 1d ago</div>
                          </div>
                        </div>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, display: "flex" }}><MoreHorizontal size={15} /></button>
                      </div>
                      <p style={{ fontSize: 13, color: SUB, lineHeight: 1.65, marginBottom: 13 }}>
                        RCB all the way! ❤️🖤<br />Ee Sala Cup Namde! 🏆
                      </p>
                      <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 13, height: 190, background: "linear-gradient(145deg,#4a0808,#8c1212,#b81a1a)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%,rgba(200,30,30,0.25) 0%,transparent 65%)" }} />
                        <span style={{ fontSize: 48, opacity: 0.45 }}>🏏</span>
                      </div>
                      <div style={{ display: "flex", gap: 18, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                        {[{ Icon: ThumbsUp, n: 189 }, { Icon: MessageSquare, n: 36 }, { Icon: Share2, n: 8 }].map(({ Icon, n }, i) => (
                          <button key={i} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 12, fontWeight: 500 }}>
                            <Icon size={13} /> {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* RIGHT — Sidebar (desktop only) */}
              {!isMobile && <div><Sidebar /></div>}
            </div>

            {/* Mobile: show sidebar below posts */}
            {isMobile && <div style={{ marginTop: 14 }}><Sidebar /></div>}

            {/* Invite Your Friends */}
            <div style={{ marginTop: 14, ...card(), padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(232,67,122,0.08)", border: "1px solid rgba(232,67,122,0.16)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Users size={19} color={PINK} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: TXT, marginBottom: 3 }}>Invite Your Friends</div>
                <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>Invite friends to join live rooms and enjoy the game together!</div>
              </div>
              <button
                onClick={() => navigator.share?.({ title: "Join SportsFan360!", url: window.location.origin }).catch(() => {})}
                style={{ padding: "9px 20px", borderRadius: 50, fontSize: 12, fontWeight: 700, background: GRAD, border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
              >
                <Share2 size={12} /> Invite Friends
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ═══════════════════════════════
   SUSPENSE WRAPPER
═══════════════════════════════ */
export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#070809", display: "flex", alignItems: "center", justifyContent: "center", color: "#a1a1af", fontSize: 14, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" }}>
        Loading profile…
      </div>
    }>
      <ProfilePageInner />
    </Suspense>
  );
}
