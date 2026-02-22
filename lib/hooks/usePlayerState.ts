"use client";

import { useState, useCallback } from "react";

export interface PlayerState {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpMax: number;
  stars: number;
  streak: number;
  mood: string | null;
}

const DEFAULT_PLAYER: PlayerState = {
  name: "Marcus",
  avatar: "\u{1F98A}",
  level: 7,
  xp: 340,
  xpMax: 500,
  stars: 340,
  streak: 9,
  mood: null,
};

export function usePlayerState() {
  const [player, setPlayer] = useState<PlayerState>(DEFAULT_PLAYER);

  const pickMood = useCallback((label: string) => {
    setPlayer((p) => ({ ...p, mood: label }));
  }, []);

  const addStars = useCallback((amount: number) => {
    setPlayer((p) => {
      const newXp = p.xp + amount;
      const newStars = p.stars + amount;
      if (newXp >= p.xpMax) {
        return {
          ...p,
          xp: newXp - p.xpMax,
          xpMax: p.xpMax + 100,
          level: p.level + 1,
          stars: newStars,
        };
      }
      return { ...p, xp: newXp, stars: newStars };
    });
  }, []);

  const spendStars = useCallback((amount: number): boolean => {
    let success = false;
    setPlayer((p) => {
      if (p.stars >= amount) {
        success = true;
        return { ...p, stars: p.stars - amount };
      }
      return p;
    });
    return success;
  }, []);

  return { player, pickMood, addStars, spendStars, setPlayer };
}
