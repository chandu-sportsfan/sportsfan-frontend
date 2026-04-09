"use client";

import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type Player360Data = {
  profile: any;
  home: any;
  season: any;
  insights: any;
  media: any;
};

type ContextType = {
  data: Player360Data | null;
  loading: boolean;
  fetchPlayer360: (id: string) => Promise<void>;
  setPlayer360Data: (data: Partial<Player360Data>) => void;
};

const PlayerProfile360Context = createContext<ContextType | undefined>(
  undefined
);

export function PlayerProfile360Provider({
  children,
}: {
  children: ReactNode;
}) {
  const [data, setData] = useState<Player360Data | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPlayer360 = async (id: string) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `/api/player-profile/search/${id}`
      );

      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch player360 data", error);
    } finally {
      setLoading(false);
    }
  };

  const setPlayer360Data = (updated: Partial<Player360Data>) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            ...updated,
          }
        : null
    );
  };

  return (
    <PlayerProfile360Context.Provider
      value={{
        data,
        loading,
        fetchPlayer360,
        setPlayer360Data,
      }}
    >
      {children}
    </PlayerProfile360Context.Provider>
  );
}

export function usePlayerProfile360() {
  const context = useContext(PlayerProfile360Context);

  if (!context) {
    throw new Error(
      "usePlayerProfile360 must be used inside PlayerProfile360Provider"
    );
  }

  return context;
}