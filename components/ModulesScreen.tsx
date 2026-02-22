"use client";

import { useState } from "react";

export default function ModulesScreen({
  onBack,
  onQuest,
  onCalm,
}: {
  onBack: () => void;
  onQuest: (type: string) => void;
  onCalm: () => void;
}) {
  const [filter, setFilter] = useState<"all" | "cbt" | "life" | "calm">("all");

  const modules = [
    { emoji: "🗣️", name: "Speak Up", desc: "Ask for help, say what you need", xp: "+50", stars: 3, accent: "var(--magenta)", onClick: () => onQuest("speak") },
    { emoji: "💭", name: "Flip a Thought", desc: "Change sneaky thoughts to better ones", xp: "+40", stars: 2, accent: "var(--purple)", onClick: () => onQuest("think") },
    { emoji: "🌬️", name: "Box Breathing", desc: "Calm your body in 2 minutes", xp: "+30", stars: 4, accent: "var(--cyan)", onClick: onCalm },
    { emoji: "🛡️", name: "Worry Buster", desc: "Put your worries on a leaf and let them float away", xp: "+45", stars: 3, accent: "var(--amber)", onClick: () => onQuest("worry") },
    { emoji: "📅", name: "My Happy Day", desc: "Plan fun things so you feel better", xp: "+35", stars: 1, accent: "var(--lime)", onClick: undefined },
    { emoji: "🍎", name: "Healthy Me", desc: "Recipes and healthy living", xp: "+60", locked: true, accent: "var(--indigo)" },
    { emoji: "💪", name: "Body Relax", desc: "Progressive muscle relaxation", xp: "+40", locked: true, accent: "var(--orange)" },
    { emoji: "🃏", name: "My Values", desc: "What matters most to you?", xp: "+55", locked: true, accent: "var(--magenta)" },
  ];

  return (
    <>
      <div className="mod-header">
        <button type="button" className="q-back" onClick={onBack}>
          ← My World
        </button>
        <div className="mod-title">🧩 Skill Islands</div>
        <div className="mod-sub">Pick what to practice today</div>
      </div>
      <div className="mod-tabs">
        {(["all", "cbt", "life", "calm"] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={`mod-tab ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f === "cbt" ? "Feelings & Thinking" : f === "life" ? "Real Life Skills" : "Calm Tools"}
          </button>
        ))}
      </div>
      <div className="mod-grid">
        {modules.map((m) => (
          <div
            key={m.name}
            className={`mod-card ${m.locked ? "locked" : ""}`}
            style={{ ["--accent" as string]: m.accent }}
            onClick={m.locked ? undefined : m.onClick}
            onKeyDown={m.locked ? undefined : (e) => e.key === "Enter" && m.onClick?.()}
            role={m.locked ? undefined : "button"}
            tabIndex={m.locked ? undefined : 0}
          >
            <div className="mc-emoji">{m.emoji}</div>
            <div className="mc-name">{m.name}</div>
            <div className="mc-desc">{m.desc}</div>
            <div className="mc-xp">⭐ {m.xp}</div>
            {!m.locked && "stars" in m && (
              <div className="mc-stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="mc-star">
                    {i <= (m.stars ?? 0) ? "⭐" : "☆"}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
