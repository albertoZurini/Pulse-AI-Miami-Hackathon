"use client";

import { useState, useCallback, useEffect } from "react";

export interface PlayerStats {
  creaturesCaught: number;
  questsDone: number;
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  calmSessions: number;
  chatMessages: number;
  bonusMissions: number;
}

const DEFAULT_STATS: PlayerStats = {
  creaturesCaught: 3,
  questsDone: 4,
  currentStreak: 9,
  longestStreak: 9,
  totalXp: 340,
  calmSessions: 6,
  chatMessages: 12,
  bonusMissions: 2,
};

const STORAGE_KEY = "pulse-player-stats";

function loadStats(): PlayerStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_STATS, ...JSON.parse(saved) };
  } catch { /* ignore */ }
  return DEFAULT_STATS;
}

export function useStatsState() {
  const [stats, setStats] = useState<PlayerStats>(loadStats);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    }
  }, [stats]);

  const incrementStat = useCallback((key: keyof PlayerStats, amount = 1) => {
    setStats((prev) => ({
      ...prev,
      [key]: prev[key] + amount,
    }));
  }, []);

  const getStat = useCallback(
    (key: keyof PlayerStats) => stats[key],
    [stats]
  );

  return { stats, incrementStat, getStat };
}
