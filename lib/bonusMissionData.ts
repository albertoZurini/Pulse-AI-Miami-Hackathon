export interface BonusMission {
  id: string;
  title: string;
  emoji: string;
  xp: number;
  question: string;
  choices: { t: string; c: boolean }[];
}

export const bonusMissions: BonusMission[] = [
  {
    id: "quick-breath",
    title: "Quick Breath Check!",
    emoji: "🫁",
    xp: 25,
    question: "Take one deep breath right now. How did it feel?",
    choices: [
      { t: "I feel a little calmer already!", c: true },
      { t: "I didn't try it", c: false },
      { t: "It was hard but I did it", c: true },
    ],
  },
  {
    id: "kind-thought",
    title: "Say Something Kind!",
    emoji: "💛",
    xp: 30,
    question: "Think of one nice thing about yourself. What is it?",
    choices: [
      { t: "I'm a good friend", c: true },
      { t: "I can't think of anything", c: false },
      { t: "I try my best every day", c: true },
    ],
  },
  {
    id: "body-check",
    title: "Body Scan!",
    emoji: "💪",
    xp: 20,
    question: "Are your shoulders tight right now? Drop them down and relax.",
    choices: [
      { t: "Yes! I just relaxed them, that feels better", c: true },
      { t: "They were already relaxed", c: true },
      { t: "I don't want to try", c: false },
    ],
  },
  {
    id: "gratitude-pop",
    title: "Gratitude Moment!",
    emoji: "🌟",
    xp: 25,
    question: "Name one thing you're thankful for today.",
    choices: [
      { t: "My friends or family", c: true },
      { t: "This game!", c: true },
      { t: "I don't feel thankful right now", c: false },
    ],
  },
  {
    id: "brave-moment",
    title: "Bravery Check!",
    emoji: "🦁",
    xp: 35,
    question: "Did you do something brave today, even something small?",
    choices: [
      { t: "Yes! I spoke up about something", c: true },
      { t: "I tried something new", c: true },
      { t: "Not yet, but I will!", c: true },
    ],
  },
];
