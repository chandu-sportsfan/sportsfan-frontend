"use client";

import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type RoomStatus = "LIVE" | "SCHEDULED";
type RoomType = "Open Room" | "Inner Room";

interface LiveRoom {
  id: string;
  status: "LIVE";
  roomType: RoomType;
  title: string;
  tags: string[];
  watching: number;
  active: number;
  minutesLive: number;
  earnings: number;
  currency: string;
}

interface ScheduledRoom {
  id: string;
  status: "SCHEDULED";
  roomType: RoomType;
  title: string;
  time: string;
  tags: string[];
  capacity: number;
  rsvps: number;
}

type Room = LiveRoom | ScheduledRoom;

// ─── Mock Data ───────────────────────────────────────────────────────────────

const rooms: Room[] = [
  {
    id: "room-1",
    status: "LIVE",
    roomType: "Open Room",
    title: "Ind vs SA Tactical Breakdown",
    tags: ["BWF World Tour Finals", "Expert Analysis", "Hindi"],
    watching: 1356,
    active: 817,
    minutesLive: 34,
    earnings: 42196,
    currency: "₹",
  },
  {
    id: "room-2",
    status: "SCHEDULED",
    roomType: "Inner Room",
    title: "India vs China Semi-Final Watch Along",
    time: "6:30 PM IST",
    tags: ["Full Energy", "Hindi"],
    capacity: 1000,
    rsvps: 342,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function LiveBadge() {
  return (
    <span className="flex items-center gap-1.5 bg-orange-500 text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
      Live
    </span>
  );
}

function ScheduledBadge() {
  return (
    <span className="flex items-center gap-1.5 bg-sky-500/20 text-sky-400 text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-sky-500/30">
      <svg
        className="w-3 h-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
      Scheduled
    </span>
  );
}

function ThreeDotMenu() {
  return (
    <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <circle cx="12" cy="5" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="12" cy="19" r="1.5" />
      </svg>
    </button>
  );
}

function LiveRoomCard({ room }: { room: LiveRoom }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <LiveBadge />
          <span className="text-zinc-400 text-sm font-medium">{room.roomType}</span>
        </div>
        <ThreeDotMenu />
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-orange-500/20 via-zinc-700/50 to-transparent mx-4" />

      {/* Body */}
      <div className="px-4 pt-4 pb-5 space-y-4">
        {/* Title */}
        <div>
          <h3 className="text-white font-bold text-lg sm:text-xl leading-snug">
            {room.title}
          </h3>
          <p className="text-zinc-500 text-sm mt-1">{room.tags.join(" • ")}</p>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2 text-orange-400 text-sm font-medium">
            {/* Wifi/wave icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M1.5 8.5a15 15 0 0 1 21 0" />
              <path d="M5 12.5a10 10 0 0 1 14 0" />
              <path d="M8.5 16.5a5 5 0 0 1 7 0" />
              <circle cx="12" cy="20" r="1" fill="currentColor" />
            </svg>
            {formatNumber(room.watching)} watching
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {formatNumber(room.active)} active
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            {room.minutesLive} min live
          </div>
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-base px-4 py-1.5 rounded-xl tracking-tight">
            {room.currency}{formatNumber(room.earnings)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduledRoomCard({ room }: { room: ScheduledRoom }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <ScheduledBadge />
          <span className="text-zinc-400 text-sm font-medium">{room.roomType}</span>
        </div>
        <ThreeDotMenu />
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-sky-500/20 via-zinc-700/50 to-transparent mx-4" />

      {/* Body */}
      <div className="px-4 pt-4 space-y-4">
        <div>
          <h3 className="text-white font-bold text-lg sm:text-xl leading-snug">
            {room.title}
          </h3>
          <p className="text-zinc-500 text-sm mt-1">
            {room.time} • {room.tags.join(" • ")}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Capacity: {formatNumber(room.capacity)}
          </div>
          <div className="flex items-center gap-2 text-sky-400 text-sm font-medium">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {formatNumber(room.rsvps)} RSVPs
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-0 -mx-px pb-0">
          <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 transition-colors text-white font-semibold py-3.5 text-sm rounded-bl-2xl border-t border-zinc-700">
            Edit
          </button>
          <button className="flex-1 bg-emerald-500 hover:bg-emerald-400 transition-colors text-white font-semibold py-3.5 text-sm rounded-br-2xl">
            Go Live Early
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LiveRoomsCard() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-2">
      <div className="w-full max-w-4xl">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg sm:text-xl">
            Live &amp; Upcoming Rooms
          </h2>
          <button className="text-orange-400 hover:text-orange-300 transition-colors text-sm font-semibold flex items-center gap-1">
            View All
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Room Cards */}
        <div className="flex flex-col gap-4">
          {rooms.map((room) =>
            room.status === "LIVE" ? (
              <LiveRoomCard key={room.id} room={room} />
            ) : (
              <ScheduledRoomCard key={room.id} room={room} />
            )
          )}
        </div>
      </div>
    </div>
  );
}