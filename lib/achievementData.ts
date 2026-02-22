export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  description: string;
  condition: {
    type: "creatures_caught" | "quests_done" | "streak" | "calm_sessions" | "xp_total" | "chat_messages" | "bonus_missions";
    threshold: number;
  };
  xpReward: number;
  isMystery: boolean;
}

export const achievements: Achievement[] = [
  // Creature catching
  { id: "first-catch", name: "First Catch!", emoji: "🎣", description: "Catch your first creature", condition: { type: "creatures_caught", threshold: 1 }, xpReward: 20, isMystery: false },
  { id: "creature-trio", name: "Creature Trio", emoji: "🐾", description: "Catch 3 creatures", condition: { type: "creatures_caught", threshold: 3 }, xpReward: 40, isMystery: false },
  { id: "creature-master", name: "Creature Master", emoji: "👑", description: "Catch 10 creatures", condition: { type: "creatures_caught", threshold: 10 }, xpReward: 100, isMystery: false },

  // Quests
  { id: "quest-starter", name: "Quest Starter", emoji: "⚔️", description: "Complete your first quest", condition: { type: "quests_done", threshold: 1 }, xpReward: 25, isMystery: false },
  { id: "quest-warrior", name: "Quest Warrior", emoji: "🗡️", description: "Complete 5 quests", condition: { type: "quests_done", threshold: 5 }, xpReward: 60, isMystery: false },
  { id: "quest-legend", name: "Quest Legend", emoji: "🏆", description: "Complete 15 quests", condition: { type: "quests_done", threshold: 15 }, xpReward: 150, isMystery: false },

  // Streaks
  { id: "streak-3", name: "3-Day Streak!", emoji: "🔥", description: "Keep a 3-day streak", condition: { type: "streak", threshold: 3 }, xpReward: 30, isMystery: false },
  { id: "streak-7", name: "Week Warrior", emoji: "💪", description: "Keep a 7-day streak", condition: { type: "streak", threshold: 7 }, xpReward: 75, isMystery: false },
  { id: "streak-30", name: "Monthly Hero", emoji: "🌟", description: "Keep a 30-day streak", condition: { type: "streak", threshold: 30 }, xpReward: 200, isMystery: false },

  // Calm sessions
  { id: "first-calm", name: "First Breath", emoji: "🫁", description: "Complete a calm session", condition: { type: "calm_sessions", threshold: 1 }, xpReward: 15, isMystery: false },
  { id: "calm-regular", name: "Calm Regular", emoji: "☁️", description: "Complete 10 calm sessions", condition: { type: "calm_sessions", threshold: 10 }, xpReward: 80, isMystery: false },

  // Chat
  { id: "social-butterfly", name: "Social Butterfly", emoji: "🦋", description: "Send 10 chat messages", condition: { type: "chat_messages", threshold: 10 }, xpReward: 35, isMystery: false },

  // XP milestones
  { id: "xp-100", name: "Star Collector", emoji: "⭐", description: "Earn 100 total stars", condition: { type: "xp_total", threshold: 100 }, xpReward: 20, isMystery: false },
  { id: "xp-500", name: "Star Chaser", emoji: "🌠", description: "Earn 500 total stars", condition: { type: "xp_total", threshold: 500 }, xpReward: 50, isMystery: false },

  // Mystery achievements
  { id: "mystery-1", name: "???", emoji: "🎁", description: "???", condition: { type: "streak", threshold: 14 }, xpReward: 100, isMystery: true },
  { id: "mystery-2", name: "???", emoji: "🎁", description: "???", condition: { type: "creatures_caught", threshold: 20 }, xpReward: 150, isMystery: true },
  { id: "mystery-3", name: "???", emoji: "🎁", description: "???", condition: { type: "bonus_missions", threshold: 10 }, xpReward: 120, isMystery: true },
  { id: "mystery-4", name: "???", emoji: "🎁", description: "???", condition: { type: "xp_total", threshold: 1000 }, xpReward: 200, isMystery: true },
];
