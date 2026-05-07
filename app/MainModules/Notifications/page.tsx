"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

type Notification = {
  id: string;
  type: string;
  senderName: string;
  senderId: string;
  battleId: string;
  battleName: string;
  battleType: "PLAYERS" | "CLUBS";
  message: string;
  isRead: boolean;
  createdAt: number;
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const SwordsIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.71 5.63l-2.34-2.34a1 1 0 00-1.41 0l-3.12 3.12-1.41-1.42-1.42 1.42 1.41 1.41-6.6 6.6A2 2 0 005 16v3h3a2 2 0 001.42-.59l6.6-6.6 1.41 1.42 1.42-1.42-1.42-1.41 3.12-3.12a1 1 0 000-1.65zM8 17H7v-1l6.59-6.59 1 1L8 17zm8.35-9.76l-1-1 1.06-1.06 1 1-1.06 1.06z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const CheckAllIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
  </svg>
);

const TrashIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner = ({ color = "border-white" }: { color?: string }) => (
  <span
    className={`inline-block h-3.5 w-3.5 rounded-full border-2 border-transparent ${color} border-t-current animate-spin`}
  />
);

// ─── Skeleton Card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="rounded-2xl border border-white/8 bg-white/3 p-4 animate-pulse">
    <div className="flex gap-3">
      <div className="h-11 w-11 rounded-xl bg-white/10 shrink-0" />
      <div className="flex-1 space-y-2.5 pt-1">
        <div className="h-3.5 w-4/5 rounded-full bg-white/10" />
        <div className="h-7 w-2/5 rounded-lg bg-white/8" />
        <div className="h-3 w-1/4 rounded-full bg-white/6" />
      </div>
    </div>
    <div className="mt-4 flex gap-2 pl-14">
      <div className="h-7 w-28 rounded-lg bg-white/8" />
      <div className="ml-auto h-7 w-16 rounded-lg bg-white/6" />
    </div>
  </div>
);

// ─── Notification Card ────────────────────────────────────────────────────────

type CardProps = {
  notif: Notification;
  onMarkRead: () => void;
  onClear: () => void;
  onBattleClick: () => void;
  markLoading: boolean;
  clearLoading: boolean;
};

function NotificationCard({
  notif,
  onMarkRead,
  onClear,
  onBattleClick,
  markLoading,
  clearLoading,
}: CardProps) {
  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 ${
        notif.isRead
          ? "border-white/8 bg-[#111116]"
          : "border-[#d75a2d]/30 bg-gradient-to-br from-[#1a0e1a] to-[#1a1208]"
      }`}
    >
      {/* Unread glow dot */}
      {!notif.isRead && (
        <span className="absolute right-4 top-4 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e91e8c] opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e91e8c]" />
        </span>
      )}

      <div className="p-4">
        {/* Top row: icon + message + time */}
        <div className="flex gap-3">
          {/* Icon */}
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              notif.isRead
                ? "bg-white/6 text-[#666]"
                : "bg-gradient-to-br from-[#e91e8c]/25 to-[#d75a2d]/25 text-[#ff9a6c]"
            }`}
          >
            <SwordsIcon size={20} />
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0 pr-4">
            {/* Sender highlight */}
            <p
              className={`text-sm leading-snug mb-1 ${
                notif.isRead ? "text-[#888]" : "text-white font-medium"
              }`}
            >
              <span
                className={`font-bold ${notif.isRead ? "text-[#aaa]" : "text-[#ff9a6c]"}`}
              >
                {notif.senderName}
              </span>{" "}
              has invited you to a{" "}
              <span className={notif.isRead ? "text-[#777]" : "text-white"}>
                Fan Battle!
              </span>
            </p>

            {/* Battle pill — clickable */}
            <button
              onClick={onBattleClick}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all group/pill ${
                notif.isRead
                  ? "border-white/10 bg-white/5 text-[#666] hover:border-white/20 hover:text-[#aaa]"
                  : "border-[#d75a2d]/35 bg-[#d75a2d]/12 text-[#ff9a6c] hover:border-[#d75a2d]/55 hover:bg-[#d75a2d]/20"
              }`}
            >
              <SwordsIcon size={12} />
              <span className="truncate max-w-[180px]">{notif.battleName}</span>
              <span className="opacity-50 text-[10px]">
                · {notif.battleType === "PLAYERS" ? "Players" : "Clubs"}
              </span>
              <ArrowRightIcon />
            </button>

            {/* Timestamp */}
            <p className="mt-1.5 text-[11px] text-[#444]">{timeAgo(notif.createdAt)}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-3 border-t border-white/5" />

        {/* Action buttons row */}
        <div className="flex items-center gap-2 pl-14">
          {!notif.isRead ? (
            <button
              onClick={onMarkRead}
              disabled={markLoading}
              className="flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/6 px-3 py-1.5 text-xs font-medium text-[#aaa] hover:border-white/25 hover:bg-white/10 hover:text-white transition-all disabled:opacity-40"
            >
              {markLoading ? <Spinner /> : <CheckIcon />}
              Mark as read
            </button>
          ) : (
            <span className="flex items-center gap-1 text-xs text-[#444]">
              <CheckIcon />
              Read
            </span>
          )}

          <button
            onClick={onClear}
            disabled={clearLoading}
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-red-500/15 bg-red-500/6 px-3 py-1.5 text-xs font-medium text-red-500/60 hover:border-red-500/35 hover:bg-red-500/15 hover:text-red-400 transition-all disabled:opacity-40"
          >
            {clearLoading ? <Spinner color="border-red-400" /> : <TrashIcon />}
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await axios.get<{ success: boolean; notifications: Notification[] }>(
        "/api/notifications",
        { params: { email: user.email } }
      );
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const markRead = async (id: string) => {
    setActionLoading(id);
    try {
      await axios.patch("/api/notifications", { id, action: "markRead" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark read:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const markAllRead = async () => {
    if (!user?.email) return;
    setActionLoading("__all__");
    try {
      await axios.patch("/api/notifications", {
        email: user.email,
        action: "markAllRead",
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all read:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const clearOne = async (id: string) => {
    setActionLoading(id + "__clear");
    try {
      await axios.delete("/api/notifications", { data: { id } });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to clear notification:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const clearAll = async () => {
    if (!user?.email) return;
    setActionLoading("__clear_all__");
    try {
      await axios.delete("/api/notifications", {
        data: { email: user.email, all: true },
      });
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear all:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Derived state ──────────────────────────────────────────────────────────
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayed =
    filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;
  const isBulkLoading =
    actionLoading === "__all__" || actionLoading === "__clear_all__";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#07070f] text-white pb-10">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-20 border-b border-white/8 bg-[#07070f]/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4">

          {/* Top bar */}
          <div className="flex items-center gap-3 py-4">
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#aaa] hover:bg-white/10 hover:text-white transition-all"
            >
              <BackIcon />
            </button>

            {/* Title + badge */}
            <div className="flex items-center gap-2.5 flex-1">
              {/* <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#e91e8c] to-[#d75a2d] text-white shadow-lg shadow-pink-900/30">
                <BellIcon />
              </div> */}
              <div>
                <h1 className="text-base font-bold leading-tight tracking-tight">
                  Notifications
                </h1>
                <p className="text-[11px] text-[#555]">
                  {loading
                    ? "Loading…"
                    : unreadCount > 0
                    ? `${unreadCount} unread`
                    : "All caught up"}
                </p>
              </div>
            </div>

            {/* Bulk action buttons */}
            {!loading && notifications.length > 0 && (
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    disabled={isBulkLoading}
                    className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#aaa] hover:border-white/20 hover:text-white transition-all disabled:opacity-40"
                    title="Mark all as read"
                  >
                    {actionLoading === "__all__" ? (
                      <Spinner />
                    ) : (
                      <CheckAllIcon />
                    )}
                    <span className="hidden sm:inline">All read</span>
                  </button>
                )}
                <button
                  onClick={clearAll}
                  disabled={isBulkLoading}
                  className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/8 px-3 py-1.5 text-xs font-medium text-red-400/70 hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-400 transition-all disabled:opacity-40"
                  title="Clear all notifications"
                >
                  {actionLoading === "__clear_all__" ? (
                    <Spinner color="border-red-400" />
                  ) : (
                    <TrashIcon />
                  )}
                  <span className="hidden sm:inline">Clear all</span>
                </button>
              </div>
            )}
          </div>

          {/* Filter tabs */}
          {!loading && notifications.length > 0 && (
            <div className="flex gap-1 pb-3">
              {(["all", "unread"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-sm font-medium transition-all capitalize ${
                    filter === tab
                      ? "bg-gradient-to-r from-[#e91e8c]/15 to-[#d75a2d]/15 border border-[#d75a2d]/35 text-[#ff9a6c]"
                      : "text-[#555] hover:text-[#888]"
                  }`}
                >
                  {tab}
                  {tab === "unread" && unreadCount > 0 && (
                    <span className="rounded-full bg-[#e91e8c] px-1.5 py-0.5 text-[10px] font-bold text-white leading-none min-w-[18px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-6xl px-4 pt-4 space-y-3">
        {loading ? (
          // Skeleton loading state
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </>
        ) : displayed.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-24 text-center select-none">
            {/* <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/8 bg-white/3">
              <BellIcon />
            </div> */}
            <p className="text-base font-semibold text-white/25">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
            <p className="mt-1.5 text-sm text-white/15 max-w-xs">
              {filter === "unread"
                ? "You're all caught up! Switch to all to see past notifications."
                : "When someone invites you to a Fan Battle, it'll appear here."}
            </p>
            {filter === "unread" && notifications.length > 0 && (
              <button
                onClick={() => setFilter("all")}
                className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#aaa] hover:text-white transition-colors"
              >
                View all notifications
              </button>
            )}
          </div>
        ) : (
          // Notification list
          displayed.map((notif) => (
            <NotificationCard
              key={notif.id}
              notif={notif}
              onMarkRead={() => markRead(notif.id)}
              onClear={() => clearOne(notif.id)}
              onBattleClick={() => router.push(`/battles/${notif.battleId}`)}
              markLoading={actionLoading === notif.id}
              clearLoading={actionLoading === notif.id + "__clear"}
            />
          ))
        )}
      </div>
    </div>
  );
}