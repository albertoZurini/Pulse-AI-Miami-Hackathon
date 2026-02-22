"use client";

import { creatureQuests } from "@/lib/creatureQuestData";
import type { BonusMission } from "@/lib/bonusMissionData";

const QUEST_LIST = [
  {
    type: "speak",
    island: "Speak Up Island",
    emoji: "🗣️",
    title: "Ask for Help at Work",
    xp: 50,
    gradient: "linear-gradient(135deg,#FF2D78,#FF6B00)",
    steps: 3,
  },
  {
    type: "think",
    island: "Think Island",
    emoji: "💭",
    title: "Flip a Bad Thought",
    xp: 40,
    gradient: "linear-gradient(135deg,#5B2FE8,#00D4FF)",
    steps: 3,
  },
  {
    type: "worry",
    island: "Worry Buster",
    emoji: "🛡️",
    title: "Handle Your Worries",
    xp: 45,
    gradient: "linear-gradient(135deg,#FFB800,#FF6B00)",
    steps: 3,
  },
];

const CREATURE_INFO = [
  { key: "breathe-bear", creature: "🐻‍❄️", name: "Breathe Bear", skill: "Breathing", color: "#00D4FF" },
  { key: "think-fox", creature: "🦊", name: "Think Fox", skill: "Thought Flipping", color: "#FF6B00" },
  { key: "speak-owl", creature: "🦉", name: "Speak Owl", skill: "Self-Advocacy", color: "#A855F7" },
];

export default function QuestsListScreen({
  onBack,
  onQuest,
  onCreatureQuest,
  activeBonusMission,
  onBonusMissionAnswer,
}: {
  onBack: () => void;
  onQuest: (type: string) => void;
  onCreatureQuest: (creatureKey: string) => void;
  activeBonusMission: BonusMission | null;
  onBonusMissionAnswer: (correct: boolean) => void;
}) {
  return (
    <div className="quests-list-screen">
      <div className="quests-list-header">
        <button
          type="button"
          className="q-back"
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "var(--muted)",
            fontFamily: "Nunito",
            fontSize: 14,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {"←"} My World
        </button>
        <div style={{ fontFamily: "Fredoka One", fontSize: 24, marginTop: 8 }}>
          {"⚔️"} Quests
        </div>
        <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>
          Complete quests to earn stars and level up!
        </div>
      </div>

      <div className="quests-list-scroll">
        {/* Bonus Mission Banner */}
        {activeBonusMission && (
          <div className="bonus-mission-card">
            <div className="bm-header">
              <span className="bm-badge">BONUS!</span>
              <span className="bm-emoji">{activeBonusMission.emoji}</span>
              <span className="bm-title">{activeBonusMission.title}</span>
              <span className="bm-xp">{"⭐"} +{activeBonusMission.xp}</span>
            </div>
            <div className="bm-question">{activeBonusMission.question}</div>
            <div className="bm-choices">
              {activeBonusMission.choices.map((ch, i) => (
                <button
                  key={i}
                  type="button"
                  className="bm-choice"
                  onClick={() => onBonusMissionAnswer(ch.c)}
                >
                  {ch.t}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="quest-section-header">
          <span>{"🌟"} Today&apos;s Quests</span>
          <span className="quest-section-count">{QUEST_LIST.length} available</span>
        </div>

        {QUEST_LIST.map((q) => (
          <div
            key={q.type}
            className="quest-list-card"
            style={{ background: q.gradient }}
            onClick={() => onQuest(q.type)}
            onKeyDown={(e) => e.key === "Enter" && onQuest(q.type)}
            role="button"
            tabIndex={0}
          >
            <div className="qlc-left">
              <div className="qlc-emoji">{q.emoji}</div>
              <div>
                <div className="qlc-island">{q.island}</div>
                <div className="qlc-title">{q.title}</div>
              </div>
            </div>
            <div className="qlc-right">
              <div className="qlc-xp">{"⭐"} +{q.xp}</div>
              <div className="qlc-steps">{q.steps} steps</div>
            </div>
          </div>
        ))}

        <div className="quest-section-header" style={{ marginTop: 20 }}>
          <span>{"🐾"} Creature Quests</span>
          <span className="quest-section-count">Catch to unlock more!</span>
        </div>

        {CREATURE_INFO.map((ci) => {
          const quests = creatureQuests[ci.key] ?? [];
          return (
            <div key={ci.key} className="creature-quest-group">
              <div className="cqg-header" style={{ borderColor: `${ci.color}44` }}>
                <span className="cqg-emoji">{ci.creature}</span>
                <span className="cqg-name" style={{ color: ci.color }}>
                  {ci.name}
                </span>
                <span className="cqg-skill">{ci.skill}</span>
              </div>
              {quests.map((quest, i) => (
                <div
                  key={i}
                  className="creature-quest-card"
                  onClick={() => onCreatureQuest(ci.key)}
                  onKeyDown={(e) => e.key === "Enter" && onCreatureQuest(ci.key)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="cqc-title">{quest.sub}</div>
                  <div className="cqc-xp">
                    {"⭐"} +{quest.island.includes("Bear") ? 35 : quest.island.includes("Fox") ? 35 : 35}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}
