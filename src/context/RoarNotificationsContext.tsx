"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type RoarNotification = {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  time: string;
  read: boolean;
  fan: { username: string; badge: string } | null;
  cta: string | null;
};

type RoarNotifContextType = {
  roarNotifications: RoarNotification[];
  setRoarNotifications: React.Dispatch<React.SetStateAction<RoarNotification[]>>;
  markRoarRead: (id: string) => void;
  markAllRoarRead: () => void;
  roarUnreadCount: number;
};

const RoarNotifContext = createContext<RoarNotifContextType>({
  roarNotifications: [],
  setRoarNotifications: () => {},
  markRoarRead: () => {},
  markAllRoarRead: () => {},
  roarUnreadCount: 0,
});

export function RoarNotificationsProvider({ children }: { children: React.ReactNode }) {
  const [roarNotifications, setRoarNotifications] = useState<RoarNotification[]>([]);

  const markRoarRead = useCallback((id: string) => {
    setRoarNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRoarRead = useCallback(() => {
    setRoarNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const roarUnreadCount = roarNotifications.filter((n) => !n.read).length;

  return (
    <RoarNotifContext.Provider value={{ roarNotifications, setRoarNotifications, markRoarRead, markAllRoarRead, roarUnreadCount }}>
      {children}
    </RoarNotifContext.Provider>
  );
}

export function useRoarNotifications() {
  return useContext(RoarNotifContext);
}
