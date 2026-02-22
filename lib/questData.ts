export type QuestChoice = { t: string; i: string; c: boolean };
export type QuestStep = { visual: string; title: string; text: string; choices: QuestChoice[] };
export type Quest = { island: string; sub: string; steps: QuestStep[] };

export const questData: Record<string, Quest> = {
  speak: {
    island: "🗣️ Speak Up Island",
    sub: "Ask for Help at Work",
    steps: [
      {
        visual: "🏢",
        title: "You Are at Work",
        text: "You are at work. Your boss asks you to do something new. But you don't understand what they mean. You feel a little nervous. 😰\n\nWhat do you do?",
        choices: [
          { t: "Say nothing and hope you figure it out", i: "😶", c: false },
          { t: 'Say: "Can you explain that again? I want to do it right."', i: "✋", c: true },
          { t: "Walk away and ask someone else later", i: "🏃", c: false },
        ],
      },
      {
        visual: "🍕",
        title: "Lunch Mix-Up",
        text: "Your coworker took your lunch by mistake. You feel upset. 😤\n\nHow do you handle it?",
        choices: [
          { t: "Say nothing and feel bad all day", i: "😔", c: false },
          { t: "Get really angry at them", i: "😠", c: false },
          { t: 'Say: "Hey, I think you took my lunch. Can I have it back?"', i: "😊", c: true },
        ],
      },
      {
        visual: "📋",
        title: "A New Task",
        text: "Your boss gives you a big new task. You're not sure how to start. 🤔\n\nWhat's the FIRST thing you do?",
        choices: [
          { t: "Panic and do nothing", i: "😱", c: false },
          { t: 'Say: "What should I do first?"', i: "🙋", c: true },
          { t: "Pretend you understand and guess", i: "🎲", c: false },
        ],
      },
    ],
  },
  think: {
    island: "💭 Think Island",
    sub: "Flip a Bad Thought",
    steps: [
      {
        visual: "🧠",
        title: "A Sneaky Thought",
        text: 'You make a mistake at work. A sneaky thought pops up: "I\'m so stupid. I always mess up." 😔\n\nIs this thought TRUE or is it a SNEAKY thought?',
        choices: [
          { t: "It's true — I am stupid", i: "😔", c: false },
          { t: "It's a sneaky thought — making a mistake doesn't mean I'm stupid", i: "💡", c: true },
          { t: "I don't know", i: "🤷", c: false },
        ],
      },
      {
        visual: "🔄",
        title: "Flip It!",
        text: "Now let's flip the sneaky thought into a BETTER thought. Which one feels better and is more true?",
        choices: [
          { t: "I'm terrible at everything", i: "😢", c: false },
          { t: "I made one mistake. Everyone makes mistakes. I can learn from it.", i: "💪", c: true },
          { t: "I should just give up", i: "🚪", c: false },
        ],
      },
      {
        visual: "🌟",
        title: "Use It for Real",
        text: 'Your friend says "You always say the wrong thing." You feel bad. What do you do with that sneaky thought?',
        choices: [
          { t: "Believe them — they must be right", i: "😔", c: false },
          { t: "Say nothing and feel bad", i: "😶", c: false },
          { t: 'Remind yourself: "One person saying this doesn\'t make it true"', i: "🛡️", c: true },
        ],
      },
    ],
  },
  worry: {
    island: "🛡️ Worry Buster",
    sub: "Handle Your Worries",
    steps: [
      {
        visual: "😰",
        title: "A Big Worry",
        text: "You are really worried about going to a doctor's appointment tomorrow. The worry feels very big. 😰\n\nWhat is a good first step?",
        choices: [
          { t: "Stay up all night worrying", i: "🌙", c: false },
          { t: 'Tell myself: "I can handle this. I\'ve done hard things before."', i: "💪", c: true },
          { t: "Cancel the appointment", i: "❌", c: false },
        ],
      },
      {
        visual: "🍃",
        title: "Let the Worry Float",
        text: "Imagine putting your worry on a leaf and watching it float down a stream. The worry is still real — but you're letting it go for now.\n\nHow does that feel?",
        choices: [
          { t: "Weird — I don't get it", i: "🤔", c: false },
          { t: "A little better — the worry is still there but it's not stuck in my head", i: "🍃", c: true },
          { t: "Bad — I need to keep thinking about it", i: "😤", c: false },
        ],
      },
      {
        visual: "⏰",
        title: "Worry Time",
        text: 'Here\'s a cool skill: give your worry a "Worry Time." Say to yourself: "I will think about this worry at 5pm for 10 minutes. Not now." Then do something else.\n\nWhen does worry time help most?',
        choices: [
          { t: "When I want to worry all day long", i: "😩", c: false },
          { t: "When I'm trying to sleep or do something important", i: "✅", c: true },
          { t: "Never — worrying is always useful", i: "❌", c: false },
        ],
      },
    ],
  },
};
