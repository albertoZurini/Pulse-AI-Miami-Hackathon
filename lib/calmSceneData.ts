export type CalmScene = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockLevel: number;
  isDefault: boolean;
  bgGradient: string;
  ambientEmojis: string[];
};

export const calmScenes: CalmScene[] = [
  {
    id: "starry-night",
    name: "Starry Night",
    emoji: "🌌",
    description: "Breathe under the stars",
    unlockLevel: 0,
    isDefault: true,
    bgGradient: "radial-gradient(ellipse at 50% 30%, #1a0d4a, #060318)",
    ambientEmojis: ["✨", "🌟", "💫", "⭐", "🌙"],
  },
  {
    id: "ocean-waves",
    name: "Ocean Waves",
    emoji: "🌊",
    description: "Calm like the sea",
    unlockLevel: 0,
    isDefault: true,
    bgGradient: "radial-gradient(ellipse at 50% 60%, #0a3d62, #041c2c)",
    ambientEmojis: ["🌊", "🐚", "🐠", "🫧", "🦋"],
  },
  {
    id: "forest-glade",
    name: "Forest Glade",
    emoji: "🌲",
    description: "Peace in the trees",
    unlockLevel: 0,
    isDefault: true,
    bgGradient: "radial-gradient(ellipse at 50% 40%, #1a3d1a, #0a1f0a)",
    ambientEmojis: ["🌲", "🍃", "🦋", "🍄", "🌿"],
  },
  {
    id: "mountain-top",
    name: "Mountain Top",
    emoji: "🏔️",
    description: "Above the clouds",
    unlockLevel: 5,
    isDefault: false,
    bgGradient: "radial-gradient(ellipse at 50% 20%, #4a6fa5, #1a2a4a)",
    ambientEmojis: ["☁️", "🦅", "⛰️", "❄️", "🌤️"],
  },
  {
    id: "sunset-beach",
    name: "Sunset Beach",
    emoji: "🌅",
    description: "Warm golden light",
    unlockLevel: 8,
    isDefault: false,
    bgGradient: "radial-gradient(ellipse at 50% 60%, #5a2d0a, #2a1005)",
    ambientEmojis: ["🌅", "🐚", "🌴", "🦀", "✨"],
  },
  {
    id: "aurora-sky",
    name: "Aurora Sky",
    emoji: "🌈",
    description: "Dancing lights above",
    unlockLevel: 12,
    isDefault: false,
    bgGradient: "radial-gradient(ellipse at 50% 30%, #1a3a2a, #0a1a15)",
    ambientEmojis: ["🌈", "✨", "💫", "🌌", "⭐"],
  },
];
