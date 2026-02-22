"use client";

import type { PlayerStats } from "@/lib/hooks/useStatsState";

const STAT_TILES = [
  { key: "creaturesCaught" as const, emoji: "🐾", label: "Creatures" },
  { key: "questsDone" as const, emoji: "⚔️", label: "Quests Done" },
  { key: "currentStreak" as const, emoji: "🔥", label: "Day Streak" },
  { key: "totalXp" as const, emoji: "⭐", label: "Total Stars" },
  { key: "calmSessions" as const, emoji: "☁️", label: "Calm Sessions" },
  { key: "chatMessages" as const, emoji: "💬", label: "Messages" },
];

export default function StatsSection({
  stats,
  onTrophyTap,
}: {
  stats: PlayerStats;
  onTrophyTap: () => void;
}) {
  return (
    <div className="stats-section">
      <div className="stats-header">
        <div className="stats-title">{"📊"} My Stats</div>
        <button type="button" className="trophy-btn" onClick={onTrophyTap}>
          {"🏆"} Achievements
        </button>
      </div>
      <div className="stats-grid">
        {STAT_TILES.map((tile) => (
          <div key={tile.key} className="stat-tile">
            <div className="st-emoji">{tile.emoji}</div>
            <div className="st-value">{stats[tile.key]}</div>
            <div className="st-label">{tile.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
