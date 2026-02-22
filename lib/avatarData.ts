export interface BaseAvatar {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export interface StoreItem {
  id: string;
  name: string;
  category: "hats" | "accessories" | "colors" | "backgrounds" | "expressions";
  emoji: string;
  cost: number;
  /** Visual overlay applied on top of the avatar */
  overlay: string;
}

export const baseAvatars: BaseAvatar[] = [
  { id: "fox", name: "Fox", emoji: "\u{1F98A}", color: "#FF6B00" },
  { id: "bear", name: "Bear", emoji: "\u{1F43B}", color: "#A0522D" },
  { id: "owl", name: "Owl", emoji: "\u{1F989}", color: "#A855F7" },
  { id: "cat", name: "Cat", emoji: "\u{1F431}", color: "#FFB800" },
  { id: "panda", name: "Panda", emoji: "\u{1F43C}", color: "#333333" },
  { id: "wolf", name: "Wolf", emoji: "\u{1F43A}", color: "#5B7DB1" },
];

export const storeItems: StoreItem[] = [
  // Hats
  { id: "crown", name: "Golden Crown", category: "hats", emoji: "\u{1F451}", cost: 100, overlay: "\u{1F451}" },
  { id: "tophat", name: "Top Hat", category: "hats", emoji: "\u{1F3A9}", cost: 80, overlay: "\u{1F3A9}" },
  { id: "cap", name: "Cool Cap", category: "hats", emoji: "\u{1F9E2}", cost: 50, overlay: "\u{1F9E2}" },
  { id: "wizard", name: "Wizard Hat", category: "hats", emoji: "\u{1FA84}", cost: 120, overlay: "\u{1FA84}" },
  { id: "party", name: "Party Hat", category: "hats", emoji: "\u{1F389}", cost: 40, overlay: "\u{1F389}" },

  // Accessories
  { id: "shades", name: "Cool Shades", category: "accessories", emoji: "\u{1F576}\uFE0F", cost: 60, overlay: "\u{1F576}\uFE0F" },
  { id: "bow", name: "Cute Bow", category: "accessories", emoji: "\u{1F380}", cost: 45, overlay: "\u{1F380}" },
  { id: "scarf", name: "Cozy Scarf", category: "accessories", emoji: "\u{1F9E3}", cost: 55, overlay: "\u{1F9E3}" },
  { id: "medal", name: "Hero Medal", category: "accessories", emoji: "\u{1F396}\uFE0F", cost: 90, overlay: "\u{1F396}\uFE0F" },
  { id: "sparkles", name: "Sparkle Aura", category: "accessories", emoji: "\u2728", cost: 70, overlay: "\u2728" },

  // Colors (ring colors around avatar)
  { id: "color-pink", name: "Pink Glow", category: "colors", emoji: "\u{1F338}", cost: 30, overlay: "#FF2D78" },
  { id: "color-blue", name: "Ocean Blue", category: "colors", emoji: "\u{1F30A}", cost: 30, overlay: "#00D4FF" },
  { id: "color-green", name: "Forest Green", category: "colors", emoji: "\u{1F33F}", cost: 30, overlay: "#7ED321" },
  { id: "color-gold", name: "Golden Aura", category: "colors", emoji: "\u{1F31F}", cost: 60, overlay: "#FFB800" },
  { id: "color-purple", name: "Cosmic Purple", category: "colors", emoji: "\u{1F52E}", cost: 60, overlay: "#A855F7" },

  // Backgrounds
  { id: "bg-stars", name: "Starfield", category: "backgrounds", emoji: "\u{1F320}", cost: 80, overlay: "linear-gradient(135deg,#0f0a2e,#3b1fa8)" },
  { id: "bg-sunset", name: "Sunset", category: "backgrounds", emoji: "\u{1F305}", cost: 80, overlay: "linear-gradient(135deg,#FF6B00,#FF2D78)" },
  { id: "bg-ocean", name: "Deep Ocean", category: "backgrounds", emoji: "\u{1F30A}", cost: 80, overlay: "linear-gradient(135deg,#004E92,#00D4FF)" },
  { id: "bg-forest", name: "Enchanted", category: "backgrounds", emoji: "\u{1F332}", cost: 100, overlay: "linear-gradient(135deg,#0A5C36,#7ED321)" },
  { id: "bg-rainbow", name: "Rainbow", category: "backgrounds", emoji: "\u{1F308}", cost: 150, overlay: "linear-gradient(135deg,#FF2D78,#FFB800,#7ED321,#00D4FF,#A855F7)" },

  // Expressions
  { id: "exp-star-eyes", name: "Star Eyes", category: "expressions", emoji: "\u{1F929}", cost: 50, overlay: "\u{1F929}" },
  { id: "exp-hearts", name: "Heart Eyes", category: "expressions", emoji: "\u{1F60D}", cost: 50, overlay: "\u{1F60D}" },
  { id: "exp-cool", name: "Cool Face", category: "expressions", emoji: "\u{1F60E}", cost: 40, overlay: "\u{1F60E}" },
  { id: "exp-wink", name: "Wink", category: "expressions", emoji: "\u{1F609}", cost: 35, overlay: "\u{1F609}" },
  { id: "exp-fire", name: "Fire Eyes", category: "expressions", emoji: "\u{1F525}", cost: 75, overlay: "\u{1F525}" },
];

export const storeCategories = [
  { id: "hats" as const, label: "Hats", emoji: "\u{1F451}" },
  { id: "accessories" as const, label: "Flair", emoji: "\u2728" },
  { id: "colors" as const, label: "Glow", emoji: "\u{1F308}" },
  { id: "backgrounds" as const, label: "BGs", emoji: "\u{1F3A8}" },
  { id: "expressions" as const, label: "Moods", emoji: "\u{1F60E}" },
];
