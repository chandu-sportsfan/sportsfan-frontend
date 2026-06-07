// components/ChatComponent/index.tsx — FRONTEND (DM-only, production-grade)
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronLeft, Plus, UserPlus, X, MoreVertical, Mic,
  CheckCheck, Reply, Edit2, Trash2, Copy,
  Search, BadgeCheck, Loader2, AlertCircle,
  Phone, Video, Info, Smile, Paperclip, Send,
  ArrowDown, Star, BellOff, Shield, Flag,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useChats, useMessages, useCreateChat, timeAgo } from "../../../hooks/useChat";
import { useAuth } from "@/context/AuthContext";
import {
  ChatAPI, resolveChatName,
  type Chat, type Message,
} from "../../../lib/chatApi";

// ─── Types ────────────────────────────────────────────────────────────────────
type ViewType = "list" | "chat_room";

type PickerUser = {
  userId?: string; user_id?: string; id?: string;
  email?: string; firstName?: string; lastName?: string; name?: string; avatar?: string;
};

// 6 reactions matching Meta Messenger
const REACTIONS = [
  { emoji: "❤️", label: "Love" },
  { emoji: "😆", label: "Haha" },
  { emoji: "😮", label: "Wow" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😠", label: "Angry" },
  { emoji: "👍", label: "Like" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatMsgTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatListTime(ts?: number) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr  = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1)   return "now";
  if (diffMin < 60)  return `${diffMin}m`;
  if (diffHr  < 24)  return `${diffHr}h`;
  if (diffDay < 7)   return `${diffDay}d`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Avatar with shimmer fallback */
const Avatar = ({
  src, name, size = 44, online = false, className = "",
}: {
  src?: string | null; name: string; size?: number; online?: boolean; className?: string;
}) => {
  const [err, setErr] = useState(false);
  const letter = (name || "?").charAt(0).toUpperCase();
  // Deterministic gradient from name
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

  return (
    <div className={`relative flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-full overflow-hidden flex items-center justify-center font-semibold text-white select-none"
        style={{
          background: src && !err
            ? undefined
            : `linear-gradient(135deg, hsl(${hue},65%,45%), hsl(${(hue + 40) % 360},70%,35%))`,
          fontSize: size * 0.38,
        }}
      >
        {src && !err
          ? <img src={src} alt={name} className="w-full h-full object-cover" onError={() => setErr(true)} />
          : letter}
      </div>
      {online && (
        <span
          className="absolute bottom-0 right-0 rounded-full border-2 border-[#0e0e0e] bg-emerald-400"
          style={{ width: size * 0.26, height: size * 0.26 }}
        />
      )}
    </div>
  );
};

/** Read receipt ticks */
const Ticks = ({ isRead, sending }: { isRead: boolean; sending: boolean }) => {
  if (sending) return <Loader2 size={11} className="animate-spin text-white/50" />;
  return (
    <CheckCheck size={14} className={isRead ? "text-sky-300" : "text-white/50"} />
  );
};

/** Skeleton for chat list rows */
const SkeletonRow = () => (
  <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
    <div className="w-[52px] h-[52px] rounded-full bg-white/[0.06] flex-shrink-0" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-[14px] bg-white/[0.06] rounded-full w-2/5" />
      <div className="h-[12px] bg-white/[0.04] rounded-full w-3/5" />
    </div>
  </div>
);

/** Thin pill divider with date label between messages */
const DateDivider = ({ label }: { label: string }) => (
  <div className="flex items-center justify-center my-3">
    <span className="text-[11px] text-[#555] bg-[#0e0e0e] px-3 py-1 rounded-full border border-white/[0.05] tracking-wide uppercase font-medium">
      {label}
    </span>
  </div>
);

/** Error banner */
const Err = ({ msg, retry }: { msg: string; retry?: () => void }) => (
  <div className="flex items-center gap-2.5 bg-rose-950/30 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-2xl mx-4 my-2">
    <AlertCircle size={15} className="flex-shrink-0" />
    <span className="flex-1 text-[13px]">{msg}</span>
    {retry && <button onClick={retry} className="text-rose-300 text-xs underline">Retry</button>}
  </div>
);

/** Full-screen modal backdrop */
const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
  <div
    className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-[2px] p-4"
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}
  >
    {children}
  </div>
);

/** User picker modal — Meta-style search sheet */
const UserPickerModal = ({ open, onClose, onPickUser }: {
  open: boolean; onClose: () => void; onPickUser: (id: string, name: string) => void;
}) => {
  const [q, setQ]         = useState("");
  const [users, setUsers] = useState<PickerUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) { setQ(""); return; }
    setLoading(true); setError(null);
    const ac = new AbortController();
    fetch("/api/users", { signal: ac.signal, credentials: "include" })
      .then(r => r.json())
      .then(j => setUsers(Array.isArray(j.users) ? j.users : []))
      .catch(e => { if (e.name !== "AbortError") setError("Failed to load users"); })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  if (!open) return null;

  const filtered = users.filter(u => {
    const n = `${u.firstName ?? u.name ?? ""} ${u.lastName ?? ""}`.toLowerCase();
    return n.includes(q.toLowerCase()) || (u.email ?? "").toLowerCase().includes(q.toLowerCase());
  });

  return (
    <Modal onClose={onClose}>
      <div
        className="bg-[#1c1c1c] w-full max-w-[420px] rounded-3xl overflow-hidden shadow-2xl border border-white/[0.07]"
        style={{ maxHeight: "80vh" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-white/[0.13] transition"
          >
            <X size={16} />
          </button>
          <h3 className="font-semibold text-[15px] text-white">New Message</h3>
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-2.5 bg-white/[0.06] rounded-full px-4 py-2.5 border border-white/[0.06] focus-within:border-[#0084ff]/50 transition-colors">
            <Search size={14} className="text-[#666]" />
            <input
              ref={inputRef}
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search people…"
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-[#555]"
            />
            {q && (
              <button onClick={() => setQ("")}>
                <X size={13} className="text-[#555]" />
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden" style={{ maxHeight: "55vh" }}>
          {loading && (
            <div className="flex items-center justify-center gap-2.5 py-10 text-[#555] text-sm">
              <Loader2 size={16} className="animate-spin" /> Loading…
            </div>
          )}
          {error && <div className="px-5 py-4 text-rose-400 text-sm text-center">{error}</div>}
          {!loading && !error && filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-[#555] text-sm">No people found</div>
          )}
          {filtered.map((u, i) => {
            const id = u.userId ?? u.user_id ?? u.id ?? u.email ?? "";
            const displayName = (u.name?.trim()) || `${u.firstName ?? ""}${u.lastName ? " " + u.lastName : ""}`.trim() || id;
            return (
              <div
                key={`${id}-${i}`}
                onClick={() => onPickUser(id, displayName)}
                className="flex items-center gap-3.5 px-5 py-3 hover:bg-white/[0.04] cursor-pointer transition-colors active:bg-white/[0.08]"
              >
                <Avatar src={u.avatar} name={displayName} size={44} />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-white truncate">{displayName}</div>
                  {u.email && <div className="text-[12px] text-[#666] truncate">{u.email}</div>}
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-[#0084ff]/50 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#0084ff]/40" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

/** Chat info / options modal */
const ChatInfoModal = ({ chat, displayName, onClose, onBlock, onReport, onMute }: {
  chat: Chat; displayName: string; onClose: () => void;
  onBlock: () => void; onReport: () => void; onMute: () => void;
}) => (
  <Modal onClose={onClose}>
    <div className="bg-[#1c1c1c] w-full max-w-[380px] rounded-3xl overflow-hidden shadow-2xl border border-white/[0.07]">
      <div className="flex flex-col items-center px-6 pt-7 pb-5 border-b border-white/[0.06]">
        <Avatar src={chat.avatarUrl} name={displayName} size={72} online={chat.isOnline} />
        <h3 className="mt-3 font-bold text-[17px] text-white flex items-center gap-1.5">
          {displayName}
          {chat.isVerified && <BadgeCheck size={16} className="text-sky-400" />}
        </h3>
        {chat.isOnline
          ? <span className="text-[12px] text-emerald-400 mt-0.5">Active now</span>
          : chat.lastMessageAt
            ? <span className="text-[12px] text-[#555] mt-0.5">Last active {timeAgo(chat.lastMessageAt)}</span>
            : null}
      </div>
      <div className="py-2">
        {[
          { icon: <BellOff size={18} />, label: "Mute notifications", action: onMute, color: "text-gray-300" },
          { icon: <Star size={18} />,    label: "Mark as favourite",  action: () => {}, color: "text-gray-300" },
          { icon: <Shield size={18} />,  label: "Block user",         action: onBlock, color: "text-rose-400" },
          { icon: <Flag size={18} />,    label: "Report user",        action: onReport, color: "text-rose-400" },
        ].map(row => (
          <button
            key={row.label}
            onClick={() => { row.action(); onClose(); }}
            className={`w-full flex items-center gap-4 px-6 py-3.5 hover:bg-white/[0.04] transition-colors ${row.color}`}
          >
            {row.icon}
            <span className="text-[14px] font-medium">{row.label}</span>
          </button>
        ))}
      </div>
      <div className="px-5 pb-5 pt-1">
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white/[0.07] text-gray-300 text-[14px] font-semibold hover:bg-white/[0.11] transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </Modal>
);

/** Delete message confirmation modal */
const DeleteModal = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
  <Modal onClose={onCancel}>
    <div className="bg-[#1c1c1c] w-full max-w-[340px] rounded-3xl overflow-hidden border border-white/[0.07] shadow-2xl">
      <div className="px-6 pt-6 pb-4 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-3">
          <Trash2 size={22} className="text-rose-400" />
        </div>
        <h3 className="font-bold text-[16px] text-white mb-1.5">Delete message?</h3>
        <p className="text-[13px] text-[#666] leading-relaxed">This will remove the message for everyone and cannot be undone.</p>
      </div>
      <div className="flex border-t border-white/[0.06]">
        <button onClick={onCancel} className="flex-1 py-4 text-[15px] font-semibold text-gray-300 hover:bg-white/[0.04] transition border-r border-white/[0.06]">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-4 text-[15px] font-semibold text-rose-400 hover:bg-rose-500/10 transition">
          Delete
        </button>
      </div>
    </div>
  </Modal>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function ChatComponent() {
  const router = useRouter();
  const { user, authReady } = useAuth();
  const currentUserId = user?.userId ?? user?.uid ?? user?.email ?? "";

  // ── Navigation state ────────────────────────────────────────────────────────
  const [view, setView]             = useState<ViewType>("list");
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  // ── Hooks ───────────────────────────────────────────────────────────────────
  const chatHook    = useChats(undefined, authReady);
  const messageHook = useMessages(activeChat?.id ?? null, currentUserId, authReady);
  const createChatHook = useCreateChat(); // kept per original

  // ── List state ──────────────────────────────────────────────────────────────
  const [search, setSearch]         = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [dmCreating, setDmCreating] = useState(false);

  // ── Chat room state ─────────────────────────────────────────────────────────
  const [msgInput, setMsgInput]           = useState("");
  const [replyingTo, setReplyingTo]       = useState<Message | null>(null);
  const [editingMsg, setEditingMsg]       = useState<Message | null>(null);
  const [deletingId, setDeletingId]       = useState<string | null>(null);
  const [menuMsgId, setMenuMsgId]         = useState<string | null>(null);
  const [reactionMsgId, setReactionMsgId] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showChatInfo, setShowChatInfo]   = useState(false);
  const [toast, setToast]                 = useState<string | null>(null);

  // ── Refs ────────────────────────────────────────────────────────────────────
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const listRef   = useRef<HTMLDivElement>(null);

  // ── Effects ─────────────────────────────────────────────────────────────────
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (atBottom || messageHook.messages.length <= 1) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messageHook.messages]);

  // Scroll-to-bottom button visibility
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [view]);

  // Focus input when entering chat room
  useEffect(() => {
    if (view === "chat_room") setTimeout(() => inputRef.current?.focus(), 120);
  }, [view]);

  // Mark as read
  useEffect(() => {
    if (activeChat?.id) chatHook.markChatAsRead(activeChat.id);
  }, [activeChat?.id]);

  // Close menus on outside click
  useEffect(() => {
    const handler = () => { setMenuMsgId(null); setReactionMsgId(null); };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // Toast auto-dismiss
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const openChat = useCallback((chat: Chat) => {
    setActiveChat(chat);
    setMsgInput("");
    setReplyingTo(null);
    setEditingMsg(null);
    setMenuMsgId(null);
    chatHook.markChatAsRead(chat.id);
    setView("chat_room");
  }, [chatHook]);

  const handlePickUser = useCallback(async (userId: string, displayName: string) => {
    setShowPicker(false);
    setDmCreating(true);
    try {
      const res = await ChatAPI.createDM(userId, displayName);
      chatHook.prependChat(res.chat);
      openChat(res.chat);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to start chat");
    } finally {
      setDmCreating(false);
    }
  }, [chatHook, openChat, showToast]);

  const handleSend = useCallback(async () => {
    const text = msgInput.trim();
    if (!text || !activeChat) return;
    setMsgInput("");
    if (editingMsg) {
      await messageHook.editMessage(editingMsg.id, text);
      setEditingMsg(null);
      return;
    }
    await messageHook.send(text, replyingTo ? { replyToId: replyingTo.id } : undefined);
    setReplyingTo(null);
    chatHook.refresh();
    chatHook.markChatAsRead(activeChat.id);
    // Scroll to bottom after sending
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 60);
  }, [msgInput, activeChat, editingMsg, replyingTo, messageHook, chatHook]);

  const confirmDelete = useCallback(async () => {
    if (!deletingId) return;
    await messageHook.deleteMessage(deletingId);
    setDeletingId(null);
  }, [deletingId, messageHook]);

  const copyMessage = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => showToast("Copied"));
  }, [showToast]);

  const scrollToBottom = () => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    setShowScrollBtn(false);
  };

  // ── Filtered chats ──────────────────────────────────────────────────────────
  const dmChats = chatHook.chats.filter(c => c.type === "dm");
  const filteredChats = search.trim()
    ? dmChats.filter(c =>
        resolveChatName(c, currentUserId).toLowerCase().includes(search.toLowerCase())
      )
    : dmChats;

  // ── Auth guard ──────────────────────────────────────────────────────────────
  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[#0084ff]" />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // VIEW: CHAT ROOM — Meta Messenger quality
  // ════════════════════════════════════════════════════════════════════════════
  if (view === "chat_room" && activeChat) {
    const displayName = resolveChatName(activeChat, currentUserId);

    // Group messages by date for date dividers
    const grouped: { type: "date"; label: string } | { type: "msg"; msg: Message }[] = [];
    let lastDate = "";
    for (const msg of messageHook.messages) {
      const d = new Date(msg.createdAt);
      const today = new Date();
      const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
      let label = d.toDateString() === today.toDateString()
        ? "Today"
        : d.toDateString() === yesterday.toDateString()
          ? "Yesterday"
          : d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
      if (label !== lastDate) {
        lastDate = label;
        (grouped as any[]).push({ type: "date", label });
      }
      (grouped as any[]).push({ type: "msg", msg });
    }

    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex flex-col font-sans">

        {/* ── Top bar ── */}
        <div className="flex items-center gap-3 px-3 py-2.5 bg-[#0e0e0e] border-b border-white/[0.05] z-30 sticky top-0">
          {/* Back */}
          <button
            onClick={() => { setView("list"); setActiveChat(null); }}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/[0.07] transition active:scale-95"
          >
            <ChevronLeft size={22} className="text-gray-200" />
          </button>

          {/* Avatar + name — tappable for info */}
          <button
            onClick={() => setShowChatInfo(true)}
            className="flex items-center gap-3 flex-1 min-w-0 text-left hover:opacity-80 transition"
          >
            <Avatar src={activeChat.avatarUrl} name={displayName} size={40} online={activeChat.isOnline} />
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-white truncate flex items-center gap-1.5">
                {displayName}
                {activeChat.isVerified && <BadgeCheck size={14} className="text-sky-400 flex-shrink-0" />}
              </div>
              {activeChat.isOnline
                ? <div className="text-[12px] text-emerald-400">Active now</div>
                : activeChat.lastMessageAt
                  ? <div className="text-[12px] text-[#555]">Active {timeAgo(activeChat.lastMessageAt)} ago</div>
                  : <div className="text-[12px] text-[#555]">Offline</div>}
            </div>
          </button>

          {/* Action icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/[0.07] transition">
              <Phone size={18} className="text-[#0084ff]" />
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/[0.07] transition">
              <Video size={18} className="text-[#0084ff]" />
            </button>
            <button
              onClick={() => setShowChatInfo(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/[0.07] transition"
            >
              <Info size={18} className="text-[#0084ff]" />
            </button>
          </div>
        </div>

        {/* ── Messages area ── */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          onClick={() => { setMenuMsgId(null); setReactionMsgId(null); }}
        >
          {/* Loading */}
          {messageHook.loading && messageHook.messages.length === 0 && (
            <div className="flex justify-center py-20">
              <Loader2 size={22} className="animate-spin text-[#0084ff]" />
            </div>
          )}

          {/* Error */}
          {messageHook.error && <Err msg={messageHook.error} />}

          {/* Toast */}
          {toast && (
            <div className="sticky top-2 z-20 flex justify-center mb-2 pointer-events-none">
              <div className="bg-[#1e1e1e]/95 backdrop-blur-md text-[13px] text-gray-200 px-4 py-2 rounded-full border border-white/[0.08] shadow-xl">
                {toast}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!messageHook.loading && messageHook.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 select-none">
              <Avatar src={activeChat.avatarUrl} name={displayName} size={72} online={activeChat.isOnline} />
              <div className="text-center">
                <p className="font-bold text-[16px] text-white">{displayName}</p>
                {activeChat.isVerified && (
                  <p className="text-[12px] text-sky-400 flex items-center justify-center gap-1 mt-0.5">
                    <BadgeCheck size={12} /> Verified
                  </p>
                )}
              </div>
              <p className="text-[13px] text-[#555] text-center max-w-[200px] leading-relaxed">
                This is the beginning of your conversation with {displayName}
              </p>
            </div>
          )}

          {/* Messages */}
          {(grouped as any[]).map((item: any, idx: number) => {
            if (item.type === "date") {
              return <DateDivider key={`date-${idx}`} label={item.label} />;
            }

            const msg = item.msg as Message;
            const isMe         = msg.senderId === currentUserId;
            const isDeleted    = !!msg.deletedAt;
            const isOptimistic = msg.id.startsWith("optimistic_");
            const showMenu     = menuMsgId === msg.id;
            const showReact    = reactionMsgId === msg.id;

            // Look ahead/behind for bubble grouping
            const allMsgs = messageHook.messages;
            const msgIdx  = allMsgs.indexOf(msg);
            const prev    = allMsgs[msgIdx - 1];
            const next    = allMsgs[msgIdx + 1];
            const isFirst = !prev || prev.senderId !== msg.senderId;
            const isLast  = !next || next.senderId !== msg.senderId;

            // Bubble tail shape (Meta style)
            const radius = isMe
              ? `rounded-[20px] ${isLast ? "rounded-br-[5px]" : "rounded-br-[20px]"}`
              : `rounded-[20px] ${isLast ? "rounded-bl-[5px]" : "rounded-bl-[20px]"}`;

            const replyMsg = msg.replyToId
              ? allMsgs.find(m => m.id === msg.replyToId)
              : null;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} ${isFirst ? "mt-3" : "mt-0.5"}`}
              >
                {/* Reply preview */}
                {replyMsg && !isDeleted && (
                  <div className={`flex items-center gap-1.5 mb-1 max-w-[66%] px-3 py-1.5 rounded-xl border ${
                    isMe
                      ? "bg-[#0084ff]/10 border-[#0084ff]/20 self-end"
                      : "bg-white/[0.04] border-white/[0.06] self-start"
                  }`}>
                    <div className={`w-0.5 h-full rounded-full ${isMe ? "bg-[#0084ff]" : "bg-[#555]"} self-stretch min-h-[20px]`} />
                    <div className="min-w-0">
                      <p className={`text-[10px] font-semibold ${isMe ? "text-[#0084ff]" : "text-[#888]"}`}>
                        {replyMsg.senderId === currentUserId ? "You" : displayName}
                      </p>
                      <p className="text-[11px] text-[#666] truncate">{replyMsg.content.slice(0, 60)}</p>
                    </div>
                  </div>
                )}

                {/* Bubble */}
                <div className={`relative flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>

                  {/* Other user avatar — only on last bubble in group */}
                  {!isMe && (
                    <div className="w-7 flex-shrink-0">
                      {isLast
                        ? <Avatar src={activeChat.avatarUrl} name={displayName} size={28} />
                        : null}
                    </div>
                  )}

                  {/* Message bubble */}
                  <div className="relative group">
                    <div
                      onClick={e => {
                        e.stopPropagation();
                        if (isDeleted) return;
                        setMenuMsgId(showMenu ? null : msg.id);
                        setReactionMsgId(null);
                      }}
                      onDoubleClick={e => {
                        e.stopPropagation();
                        if (isDeleted) return;
                        setReactionMsgId(msg.id);
                        setMenuMsgId(null);
                      }}
                      className={`
                        px-[14px] py-[8px] max-w-[280px] sm:max-w-[320px] cursor-pointer select-none
                        text-[14.5px] leading-[1.45] break-words
                        ${radius}
                        ${isOptimistic ? "opacity-60" : ""}
                        ${isDeleted
                          ? "bg-transparent border border-white/[0.08] text-[#555] italic text-[13px]"
                          : isMe
                            ? "bg-[#0084ff] text-white"
                            : "bg-[#3a3a3a] text-white"
                        }
                        transition-opacity
                      `}
                    >
                      {isDeleted ? "Message deleted" : msg.content}

                      {/* Time + ticks (inside bubble, bottom-right) */}
                      {!isDeleted && (
                        <span className={`inline-flex items-center gap-1 ml-2 float-right mt-[3px] text-[10px] leading-none ${isMe ? "text-white/50" : "text-white/30"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {isMe && <Ticks isRead={msg.isRead} sending={isOptimistic} />}
                        </span>
                      )}
                    </div>

                    {/* Reaction picker — appears on double-tap or long-press */}
                    {showReact && !isDeleted && (
                      <div
                        onClick={e => e.stopPropagation()}
                        className={`absolute z-50 bottom-full mb-2 flex items-center gap-1 bg-[#1c1c1c] border border-white/[0.08] rounded-full px-2 py-1.5 shadow-2xl ${isMe ? "right-0" : "left-0"}`}
                      >
                        {REACTIONS.map(r => (
                          <button
                            key={r.emoji}
                            title={r.label}
                            onClick={() => { setReactionMsgId(null); showToast(`Reacted ${r.emoji}`); }}
                            className="text-[22px] hover:scale-125 active:scale-110 transition-transform leading-none"
                          >
                            {r.emoji}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Context menu — tap on bubble */}
                    {showMenu && !isDeleted && (
                      <div
                        onClick={e => e.stopPropagation()}
                        className={`absolute z-50 bottom-full mb-2 w-[170px] bg-[#1e1e1e] border border-white/[0.07] rounded-2xl shadow-2xl overflow-hidden ${isMe ? "right-0" : "left-0"}`}
                      >
                        {/* Quick reactions row */}
                        <div className="flex items-center justify-around px-2 py-2 border-b border-white/[0.06] bg-[#252525]">
                          {REACTIONS.slice(0, 5).map(r => (
                            <button
                              key={r.emoji}
                              onClick={() => { setMenuMsgId(null); showToast(`Reacted ${r.emoji}`); }}
                              className="text-[19px] hover:scale-125 transition-transform leading-none"
                            >
                              {r.emoji}
                            </button>
                          ))}
                        </div>
                        {/* Actions */}
                        <button
                          onClick={() => { setReplyingTo(msg); setMenuMsgId(null); setTimeout(() => inputRef.current?.focus(), 60); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] text-[13px] text-gray-200 transition-colors"
                        >
                          <Reply size={14} className="text-[#888]" /> Reply
                        </button>
                        <button
                          onClick={() => { copyMessage(msg.content); setMenuMsgId(null); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] text-[13px] text-gray-200 transition-colors"
                        >
                          <Copy size={14} className="text-[#888]" /> Copy
                        </button>
                        {isMe && (
                          <>
                            <button
                              onClick={() => {
                                setEditingMsg(msg); setMsgInput(msg.content);
                                setMenuMsgId(null); setTimeout(() => inputRef.current?.focus(), 60);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] text-[13px] text-gray-200 transition-colors"
                            >
                              <Edit2 size={14} className="text-[#888]" /> Edit
                            </button>
                            <button
                              onClick={() => { setDeletingId(msg.id); setMenuMsgId(null); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] text-[13px] text-rose-400 transition-colors"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Edited label */}
                {msg.editedAt && !isDeleted && (
                  <span className={`text-[10px] text-[#444] mt-0.5 ${isMe ? "mr-1" : "ml-9"}`}>edited</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Scroll-to-bottom button */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-[88px] right-4 z-30 w-10 h-10 rounded-full bg-[#1e1e1e] border border-white/[0.1] shadow-lg flex items-center justify-center hover:bg-[#2a2a2a] transition"
          >
            <ArrowDown size={18} className="text-gray-300" />
          </button>
        )}

        {/* ── Input area ── */}
        <div className="bg-[#0e0e0e] border-t border-white/[0.05] px-3 pb-4 pt-2 z-20">

          {/* Reply / Edit banner */}
          {(replyingTo || editingMsg) && (
            <div className="flex items-center gap-3 bg-[#1a1a1a] border border-white/[0.07] rounded-2xl px-4 py-2.5 mb-2">
              <div className={`w-0.5 h-8 rounded-full flex-shrink-0 ${editingMsg ? "bg-amber-400" : "bg-[#0084ff]"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-semibold ${editingMsg ? "text-amber-400" : "text-[#0084ff]"}`}>
                  {editingMsg ? "Editing message" : `Replying to ${replyingTo?.senderId === currentUserId ? "yourself" : displayName}`}
                </p>
                <p className="text-[12px] text-[#666] truncate">
                  {editingMsg ? editingMsg.content : replyingTo?.content}
                </p>
              </div>
              <button
                onClick={() => { setReplyingTo(null); setEditingMsg(null); setMsgInput(""); }}
                className="w-7 h-7 rounded-full bg-white/[0.07] flex items-center justify-center hover:bg-white/[0.12] transition flex-shrink-0"
              >
                <X size={13} className="text-gray-400" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            {/* Attachment button */}
            <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/[0.07] transition flex-shrink-0 mb-0.5">
              <Paperclip size={18} className="text-[#0084ff]" />
            </button>

            {/* Input */}
            <div className="flex-1 flex items-end gap-2 bg-[#1e1e1e] rounded-[24px] px-4 py-2 border border-white/[0.07] focus-within:border-[#0084ff]/30 transition-colors min-h-[44px]">
              <input
                ref={inputRef}
                type="text"
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                placeholder={editingMsg ? "Edit your message…" : `Message ${displayName}…`}
                className="flex-1 bg-transparent outline-none text-[14px] text-white placeholder-[#555] leading-relaxed py-0.5"
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              <button className="flex-shrink-0 mb-0.5 text-[#0084ff] hover:text-blue-300 transition">
                <Smile size={18} />
              </button>
            </div>

            {/* Send / Mic */}
            {msgInput.trim()
              ? (
                <button
                  onClick={handleSend}
                  disabled={messageHook.sending}
                  className="w-10 h-10 rounded-full bg-[#0084ff] flex items-center justify-center hover:bg-[#0073e0] active:scale-95 transition flex-shrink-0 disabled:opacity-50 shadow-lg shadow-[#0084ff]/25"
                >
                  {messageHook.sending
                    ? <Loader2 size={16} className="animate-spin text-white" />
                    : <Send size={16} className="text-white" style={{ transform: "translateX(1px)" }} />
                  }
                </button>
              )
              : (
                <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/[0.07] transition flex-shrink-0">
                  <Mic size={18} className="text-[#0084ff]" />
                </button>
              )
            }
          </div>
        </div>

        {/* Modals */}
        {showChatInfo && (
          <ChatInfoModal
            chat={activeChat}
            displayName={displayName}
            onClose={() => setShowChatInfo(false)}
            onBlock={() => showToast("User blocked")}
            onReport={() => showToast("Reported")}
            onMute={() => showToast("Notifications muted")}
          />
        )}
        {deletingId && (
          <DeleteModal onConfirm={confirmDelete} onCancel={() => setDeletingId(null)} />
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // VIEW: CHAT LIST — Meta-quality inbox
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-sans flex flex-col">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 bg-[#0e0e0e] sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/[0.07] transition"
            >
              <ChevronLeft size={22} className="text-gray-200" />
            </button>
            <h1 className="text-[22px] font-bold text-white tracking-[-0.3px]">Chats</h1>
          </div>
          <div className="flex items-center gap-2">
            {dmCreating && <Loader2 size={18} className="animate-spin text-[#0084ff]" />}
            {/* Compose button */}
            <button
              onClick={() => setShowPicker(true)}
              className="w-9 h-9 rounded-full bg-[#0084ff]/10 border border-[#0084ff]/20 flex items-center justify-center hover:bg-[#0084ff]/20 transition"
            >
              <Plus size={18} className="text-[#0084ff]" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2.5 bg-[#1e1e1e] rounded-full px-4 py-2.5 border border-white/[0.06] focus-within:border-[#0084ff]/30 transition-colors">
          <Search size={15} className="text-[#555] flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search messages…"
            className="flex-1 bg-transparent outline-none text-[14px] text-white placeholder-[#555]"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={14} className="text-[#555]" />
            </button>
          )}
        </div>
      </div>

      {/* ── Chat list ── */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {/* Errors */}
        {chatHook.error && <Err msg={chatHook.error} retry={chatHook.refresh} />}

        {/* Skeletons */}
        {chatHook.loading && dmChats.length === 0 && (
          <>{[...Array(7)].map((_, i) => <SkeletonRow key={i} />)}</>
        )}

        {/* Empty state */}
        {!chatHook.loading && dmChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 px-8 text-center gap-4 select-none">
            <div className="w-20 h-20 rounded-full bg-[#0084ff]/10 border border-[#0084ff]/10 flex items-center justify-center">
              <UserPlus size={30} className="text-[#0084ff]" />
            </div>
            <div>
              <p className="font-bold text-[16px] text-white mb-1">No messages yet</p>
              <p className="text-[13px] text-[#555] leading-relaxed">Start a conversation with someone and your chats will appear here.</p>
            </div>
            <button
              onClick={() => setShowPicker(true)}
              className="px-6 py-2.5 rounded-full bg-[#0084ff] text-white text-[14px] font-semibold hover:bg-[#0073e0] active:scale-95 transition shadow-lg shadow-[#0084ff]/20"
            >
              New Message
            </button>
          </div>
        )}

        {/* Rows */}
        {filteredChats.map(chat => {
          const name     = resolveChatName(chat, currentUserId);
          const hasUnread = chat.unreadCount > 0;

          return (
            <div
              key={chat.id}
              onClick={() => openChat(chat)}
              className="flex items-center gap-3.5 px-4 py-3 hover:bg-white/[0.03] active:bg-white/[0.06] cursor-pointer transition-colors"
            >
              {/* Avatar */}
              <Avatar src={chat.avatarUrl} name={name} size={56} online={chat.isOnline} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-[2px]">
                  <h2 className={`text-[15px] truncate flex items-center gap-1.5 ${hasUnread ? "font-bold text-white" : "font-semibold text-[#d4d4d4]"}`}>
                    {name}
                    {chat.isVerified && <BadgeCheck size={14} className="text-sky-400 flex-shrink-0" />}
                    {chat.isPinned && <Star size={11} className="text-amber-400/70 flex-shrink-0" />}
                  </h2>
                  <span className={`text-[11px] ml-2 flex-shrink-0 ${hasUnread ? "text-[#0084ff] font-semibold" : "text-[#444]"}`}>
                    {formatListTime(chat.lastMessageAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-[13px] truncate pr-3 ${hasUnread ? "text-[#aaa] font-medium" : "text-[#555]"}`}>
                    {chat.lastMessageContent || "Tap to start chatting"}
                  </p>
                  {hasUnread && (
                    <div className="bg-[#0084ff] text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center flex-shrink-0 shadow shadow-[#0084ff]/30">
                      {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                    </div>
                  )}
                  {!hasUnread && chat.isMuted && (
                    <BellOff size={12} className="text-[#444] flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Load more */}
        {chatHook.hasMore && (
          <button
            onClick={chatHook.loadMore}
            disabled={chatHook.loading}
            className="w-full flex items-center justify-center gap-2 py-4 text-[13px] text-[#444] hover:text-gray-300 transition"
          >
            {chatHook.loading ? <Loader2 size={14} className="animate-spin" /> : "Load more"}
          </button>
        )}

        {/* No results */}
        {!chatHook.loading && search && filteredChats.length === 0 && (
          <div className="px-4 py-12 text-center">
            <p className="text-[14px] text-[#555]">No results for "{search}"</p>
          </div>
        )}
      </div>

      {/* User picker modal */}
      <UserPickerModal open={showPicker} onClose={() => setShowPicker(false)} onPickUser={handlePickUser} />
    </div>
  );
}
