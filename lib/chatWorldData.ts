export type ChatWorld = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  colorFrom: string;
  colorTo: string;
  ambientEmojis: string[];
  onlineCount: number; // simulated for now
};

export const chatWorlds: ChatWorld[] = [
  {
    id: "coral-kingdom",
    name: "Coral Kingdom",
    emoji: "🐠",
    description: "Swim with friends!",
    colorFrom: "#00D4FF",
    colorTo: "#0083B0",
    ambientEmojis: ["🐠", "🐙", "🦀", "🐚", "🫧", "🐡", "🦑"],
    onlineCount: 12,
  },
  {
    id: "hero-hq",
    name: "Hero HQ",
    emoji: "🦸",
    description: "Your secret base!",
    colorFrom: "#FF2D78",
    colorTo: "#5B2FE8",
    ambientEmojis: ["🦸", "⚡", "🛡️", "💥", "🌟", "🔥"],
    onlineCount: 8,
  },
  {
    id: "chill-classroom",
    name: "Chill Classroom",
    emoji: "📚",
    description: "Learn & hang out",
    colorFrom: "#A855F7",
    colorTo: "#7ED321",
    ambientEmojis: ["📚", "✏️", "🎒", "💡", "🌈", "⭐"],
    onlineCount: 15,
  },
  {
    id: "night-market",
    name: "Night Market",
    emoji: "🏮",
    description: "Explore the lights!",
    colorFrom: "#FFB800",
    colorTo: "#FF6B00",
    ambientEmojis: ["🏮", "🎆", "🍡", "🎪", "✨", "🎉"],
    onlineCount: 21,
  },
  {
    id: "cozy-cafe",
    name: "Cozy Cafe",
    emoji: "☕",
    description: "Warm vibes only",
    colorFrom: "#FF6B00",
    colorTo: "#FFB800",
    ambientEmojis: ["☕", "🧁", "🍪", "🕯️", "📖", "🎵"],
    onlineCount: 9,
  },
  {
    id: "space-station",
    name: "Space Station",
    emoji: "🚀",
    description: "Chat among the stars!",
    colorFrom: "#5B2FE8",
    colorTo: "#00D4FF",
    ambientEmojis: ["🚀", "🌍", "⭐", "🛸", "🌙", "☄️"],
    onlineCount: 17,
  },
  {
    id: "enchanted-forest",
    name: "Enchanted Forest",
    emoji: "🌲",
    description: "Peace in the trees",
    colorFrom: "#7ED321",
    colorTo: "#00A86B",
    ambientEmojis: ["🌲", "🍃", "🦋", "🍄", "✨", "🦌"],
    onlineCount: 6,
  },
  {
    id: "game-arena",
    name: "Game Arena",
    emoji: "🎮",
    description: "Level up together!",
    colorFrom: "#FF2D78",
    colorTo: "#FF6B00",
    ambientEmojis: ["🎮", "🏆", "🎯", "⚡", "👾", "🕹️"],
    onlineCount: 24,
  },
];
