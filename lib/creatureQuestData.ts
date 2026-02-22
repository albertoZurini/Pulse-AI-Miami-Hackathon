import type { Quest } from "@/lib/questData";

export const creatureQuests: Record<string, Quest[]> = {
  "breathe-bear": [
    {
      island: "🐻‍❄️ Breathe Bear",
      sub: "Calm a Scary Moment",
      steps: [
        {
          visual: "😰",
          title: "A Loud Noise!",
          text: "You hear a really loud bang outside. Your heart starts beating fast and your hands feel shaky.",
          choices: [
            { t: "Freeze and hold your breath", i: "😶", c: false },
            { t: "Take 3 slow deep breaths to calm down", i: "🫁", c: true },
            { t: "Scream and run away", i: "😱", c: false },
          ],
        },
        {
          visual: "🏥",
          title: "Waiting Room Worry",
          text: "You're at the doctor's office. The waiting room is full and you feel your chest getting tight.",
          choices: [
            { t: "Breathe in for 4, hold for 4, out for 4", i: "🌬️", c: true },
            { t: "Leave without seeing the doctor", i: "🚪", c: false },
            { t: "Pretend nothing is wrong", i: "😐", c: false },
          ],
        },
        {
          visual: "🌙",
          title: "Can't Sleep",
          text: "It's bedtime but your mind won't stop racing. You keep thinking about tomorrow.",
          choices: [
            { t: "Watch videos until you pass out", i: "📱", c: false },
            { t: "Do box breathing until you feel sleepy", i: "😌", c: true },
            { t: "Get up and eat a snack", i: "🍪", c: false },
          ],
        },
      ],
    },
  ],
  "think-fox": [
    {
      island: "🦊 Think Fox",
      sub: "Flip the Doubt",
      steps: [
        {
          visual: "📝",
          title: "A Bad Grade",
          text: 'You get a low score on a test. Your brain says: "I\'m dumb. I can\'t learn anything."',
          choices: [
            { t: "Believe it — maybe I am dumb", i: "😞", c: false },
            { t: "That's a sneaky thought! One test doesn't decide how smart I am", i: "💡", c: true },
            { t: "Tear up the test and forget about it", i: "😤", c: false },
          ],
        },
        {
          visual: "👥",
          title: "Left Out",
          text: 'Your friends hang out without you. You think: "Nobody likes me."',
          choices: [
            { t: "They probably just forgot — I can ask to join next time", i: "🤔", c: true },
            { t: "Stop talking to all my friends", i: "😶", c: false },
            { t: "They hate me so I should be alone", i: "😢", c: false },
          ],
        },
        {
          visual: "🪞",
          title: "Mirror Moment",
          text: 'You look in the mirror and think: "I look weird. Everyone notices."',
          choices: [
            { t: "Skip going out today", i: "🏠", c: false },
            { t: "Everyone has things they don't like. I'm okay the way I am", i: "💪", c: true },
            { t: "Try to change everything about myself", i: "😣", c: false },
          ],
        },
      ],
    },
  ],
  "speak-owl": [
    {
      island: "🦉 Speak Owl",
      sub: "Ask for What You Need",
      steps: [
        {
          visual: "🍕",
          title: "Wrong Order",
          text: "You ordered pizza but they gave you the wrong one. You really wanted your pizza.",
          choices: [
            { t: "Eat it even though it's wrong", i: "😕", c: false },
            { t: "Politely say: \"Excuse me, I ordered a different pizza\"", i: "🗣️", c: true },
            { t: "Throw it away and leave hungry", i: "🚶", c: false },
          ],
        },
        {
          visual: "🚌",
          title: "Lost on the Bus",
          text: "You think you missed your stop on the bus. You feel confused but nobody seems to notice.",
          choices: [
            { t: "Stay quiet and hope for the best", i: "😰", c: false },
            { t: "Ask the bus driver: \"Can you help me? I think I missed my stop\"", i: "✋", c: true },
            { t: "Get off at the next stop and figure it out alone", i: "🚶", c: false },
          ],
        },
        {
          visual: "🏪",
          title: "Store Help",
          text: "You can't find what you need in the store. A worker is nearby but you feel shy.",
          choices: [
            { t: "Walk around for another hour looking", i: "🔄", c: false },
            { t: "Leave without buying anything", i: "😔", c: false },
            { t: "Walk up and say: \"Hi, can you help me find something?\"", i: "😊", c: true },
          ],
        },
      ],
    },
  ],
};
