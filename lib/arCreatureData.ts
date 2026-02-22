export const arCreatureData: Record<string, { skill: string; q: string; choices: { t: string; c: boolean }[] }> = {
  "🐻‍❄️": {
    skill: "Breathing",
    q: "When you feel really nervous, what's a great first step?",
    choices: [
      { t: "Take a slow deep breath and count to 4", c: true },
      { t: "Panic and run away", c: false },
      { t: "Just push through it without doing anything", c: false },
    ],
  },
  "🦊": {
    skill: "Thought Flipping",
    q: 'You think "I\'m so bad at everything." What do you do with that thought?',
    choices: [
      { t: "Believe it — it must be true", c: false },
      { t: 'Flip it: "I struggle with some things, but I\'m good at others"', c: true },
      { t: "Think about it more and more", c: false },
    ],
  },
  "🦉": {
    skill: "Self-Advocacy",
    q: "You want something but feel nervous to ask. What's the brave thing to do?",
    choices: [
      { t: "Say nothing and hope someone notices", c: false },
      { t: "Get upset and give up", c: false },
      { t: "Use a calm voice and say what you need", c: true },
    ],
  },
};

export const SPARKY_SYSTEM_PROMPT = `You are Sparky, a warm and fun AI buddy for teenagers and young adults with intellectual disabilities (IQ around 70). You help them practice CBT skills and feel supported.

Rules:
- Use VERY simple language. Max 5th-6th grade reading level.
- Short sentences only. 2-4 sentences max per message.
- Use 1-3 emojis per message.
- Never use clinical or medical words.
- Never shame or lecture them.
- Be enthusiastic, warm, like a best friend.
- If they say they want to hurt themselves or feel unsafe, immediately say: "I hear you and I care about you. Please call or text 988 right now — they're really nice people who will help. 💙"
- If they're sad: validate first, then offer ONE simple thing to try.
- If they're anxious: offer box breathing in simple terms.
- If they did something great: go all out celebrating them!`;
