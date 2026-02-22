"use client";

import { useState, useEffect, useCallback } from "react";
import { achievements } from "@/lib/achievementData";
import type { Achievement } from "@/lib/achievementData";
import type { PlayerStats } from "@/lib/hooks/useStatsState";

const EARNED_KEY = "pulse-earned-achievements";

function loadEarned(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const saved = localStorage.getItem(EARNED_KEY);
    if (saved) return new Set(JSON.parse(saved));
  } catch { /* ignore */ }
  return new Set();
}

function getStatValue(stats: PlayerStats, type: Achievement["condition"]["type"]): number {
  switch (type) {
    case "creatures_caught": return stats.creaturesCaught;
    case "quests_done": return stats.questsDone;
    case "streak": return stats.currentStreak;
    case "calm_sessions": return stats.calmSessions;
    case "xp_total": return stats.totalXp;
    case "chat_messages": return stats.chatMessages;
    case "bonus_missions": return stats.bonusMissions;
    default: return 0;
  }
}

export function useAchievements(stats: PlayerStats) {
  const [earnedIds, setEarnedIds] = useState<Set<string>>(loadEarned);
  const [newlyEarned, setNewlyEarned] = useState<Achievement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(EARNED_KEY, JSON.stringify([...earnedIds]));
    }
  }, [earnedIds]);

  // Check for new achievements whenever stats change
  useEffect(() => {
    for (const ach of achievements) {
      if (earnedIds.has(ach.id)) continue;
      const val = getStatValue(stats, ach.condition.type);
      if (val >= ach.condition.threshold) {
        setEarnedIds((prev) => new Set([...prev, ach.id]));
        setNewlyEarned(ach);
        break; // only show one at a time
      }
    }
  }, [stats, earnedIds]);

  const dismissNewlyEarned = useCallback(() => {
    setNewlyEarned(null);
  }, []);

  const earned = achievements.filter((a) => earnedIds.has(a.id));
  const unearned = achievements.filter((a) => !earnedIds.has(a.id));

  return { earned, unearned, newlyEarned, dismissNewlyEarned };
}
