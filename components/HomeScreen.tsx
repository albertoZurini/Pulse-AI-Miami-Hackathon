"use client";

import { useCallback } from "react";

const STAR_COUNT = 60;

export default function HomeScreen({
  onQuest,
  onCalm,
  onARWorld,
  onMoodPick,
  pickedMood,
}: {
  onQuest: (type: string) => void;
  onCalm: () => void;
  onARWorld: () => void;
  onMoodPick: (label: string) => void;
  pickedMood: string | null;
}) {
  const moods = [
    { emoji: "😄", label: "GREAT" },
    { emoji: "🙂", label: "OKAY" },
    { emoji: "😐", label: "MEH" },
    { emoji: "😰", label: "NERVOUS" },
    { emoji: "😔", label: "SAD" },
  ];

  const stars = useCallback(() => {
    return Array.from({ length: STAR_COUNT }, (_, i) => {
      const size = Math.random() * 3 + 1;
      return (
        <div
          key={i}
          className="star"
          style={{
            width: size,
            height: size,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 1.5}s`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      );
    });
  }, []);

  return (
    <>
      <div className="stars">{stars()}</div>
      <div className="aurora" />

      <div className="home-header">
        <div className="player-info">
          <div className="avatar-ring">
            <div className="avatar-inner">🦊</div>
          </div>
          <div>
            <div className="player-name">Marcus</div>
            <div className="player-level">⚡ LEVEL 7 EXPLORER</div>
          </div>
        </div>
        <div className="header-pills">
          <div className="pill-stat">
            <span>🔥</span>
            <span className="pill-fire">9</span>
          </div>
          <div className="pill-stat">
            <span>⭐</span>
            <span className="pill-star">340</span>
          </div>
        </div>
      </div>
      <div className="h-16"></div>

      <div className="world-map">
        <div
          className="island"
          style={{ left: 22, bottom: 40, animationDuration: "3.2s" }}
          onClick={() => onQuest("speak")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onQuest("speak")}
        >
          <div
            className="island-base"
            style={{
              width: 82,
              height: 82,
              background: "linear-gradient(135deg,#FF6B00,#FF2D78)",
            }}
          >
            <div className="island-glow" style={{ background: "rgba(255,107,0,.5)" }} />
            <div className="island-emoji">🗣️</div>
            <div className="island-name">SPEAK UP</div>
          </div>
          <div className="island-badge">!</div>
          <div className="island-shadow" />
        </div>

        <div
          className="island"
          style={{ left: 130, bottom: 70, animationDuration: "2.8s" }}
          onClick={onCalm}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onCalm()}
        >
          <div
            className="island-base"
            style={{
              width: 72,
              height: 72,
              background: "linear-gradient(135deg,#00D4FF,#5B2FE8)",
            }}
          >
            <div className="island-glow" style={{ background: "rgba(0,212,255,.5)" }} />
            <div className="island-emoji">☁️</div>
            <div className="island-name">CALM ZONE</div>
          </div>
          <div className="island-shadow" />
        </div>

        <div
          className="island"
          style={{ right: 30, bottom: 55, animationDuration: "3.5s" }}
          onClick={() => onQuest("think")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onQuest("think")}
        >
          <div
            className="island-base"
            style={{
              width: 68,
              height: 68,
              background: "linear-gradient(135deg,#A855F7,#5B2FE8)",
            }}
          >
            <div className="island-glow" style={{ background: "rgba(168,85,247,.5)" }} />
            <div className="island-emoji">💭</div>
            <div className="island-name">THINK IT</div>
          </div>
          <div className="island-shadow" />
        </div>

        <div
          className="island island-locked"
          style={{ right: 28, bottom: 140, animationDuration: "4s" }}
        >
          <div
            className="island-base"
            style={{
              width: 56,
              height: 56,
              background: "linear-gradient(135deg,#7ED321,#00A86B)",
            }}
          >
            <div className="island-emoji">🌟</div>
            <div className="island-name">LOCKED</div>
          </div>
          <div className="island-shadow" />
        </div>

        <div
          className="island"
          style={{ left: 180, bottom: 140, animationDuration: "3.8s" }}
          onClick={() => onQuest("worry")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onQuest("worry")}
        >
          <div
            className="island-base"
            style={{
              width: 60,
              height: 60,
              background: "linear-gradient(135deg,#FFB800,#FF6B00)",
            }}
          >
            <div className="island-glow" style={{ background: "rgba(255,184,0,.5)" }} />
            <div className="island-emoji">🛡️</div>
            <div className="island-name">WORRY BUSTER</div>
          </div>
          <div className="island-shadow" />
        </div>

        <button type="button" className="ar-fab" onClick={onARWorld}>
          🔮 AR WORLD
        </button>
      </div>

      <div className="xp-section">
        <div className="xp-row">
          <span className="xp-label">⚡ LEVEL 7 XP</span>
          <span className="xp-nums">340 / 500</span>
        </div>
        <div className="xp-track">
          <div className="xp-fill" />
        </div>
      </div>

      <div className="scrollable" style={{ flex: 1 }}>
        <div className="mood-card">
          <div className="mood-title">🌡️ How do you feel right now?</div>
          <div className="mood-row">
            {moods.map((m) => (
              <button
                key={m.label}
                type="button"
                className={`mood-btn ${pickedMood === m.label ? "picked" : ""}`}
                onClick={() => onMoodPick(m.label)}
              >
                <span className="mood-emoji">{m.emoji}</span>
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="streak-card">
          <div className="streak-flame">🔥</div>
          <div>
            <div className="streak-days">9 Days!</div>
            <div className="streak-sub">Don&apos;t break it! 💪</div>
          </div>
          <div className="streak-dots">
            <div className="sd done">✓</div>
            <div className="sd done">✓</div>
            <div className="sd done">✓</div>
            <div className="sd done">✓</div>
            <div className="sd done">✓</div>
            <div className="sd now">★</div>
            <div className="sd empty" />
          </div>
        </div>

        <div className="section-label">
          Today&apos;s Quests <span>3 left</span>
        </div>
        <div className="quest-scroll">
          <div
            className="quest-pill"
            style={{ background: "linear-gradient(135deg,#FF2D78,#FF6B00)" }}
            onClick={() => onQuest("speak")}
            onKeyDown={(e) => e.key === "Enter" && onQuest("speak")}
            role="button"
            tabIndex={0}
          >
            <div className="qp-tag">🗣️ Speak Up Island</div>
            <div className="qp-title">Ask for Help at Work</div>
            <div className="qp-xp">⭐ +50 Stars</div>
          </div>
          <div
            className="quest-pill"
            style={{ background: "linear-gradient(135deg,#5B2FE8,#00D4FF)" }}
            onClick={() => onQuest("think")}
            onKeyDown={(e) => e.key === "Enter" && onQuest("think")}
            role="button"
            tabIndex={0}
          >
            <div className="qp-tag">💭 Think Island</div>
            <div className="qp-title">Flip a Bad Thought</div>
            <div className="qp-xp">⭐ +40 Stars</div>
          </div>
          <div
            className="quest-pill"
            style={{ background: "linear-gradient(135deg,#FFB800,#7ED321)" }}
            onClick={onCalm}
            onKeyDown={(e) => e.key === "Enter" && onCalm()}
            role="button"
            tabIndex={0}
          >
            <div className="qp-tag">☁️ Calm Zone</div>
            <div className="qp-title">Box Breathing Challenge</div>
            <div className="qp-xp">⭐ +30 Stars</div>
          </div>
          <div
            className="quest-pill"
            style={{ background: "linear-gradient(135deg,#A855F7,#FF2D78)" }}
            onClick={onARWorld}
            onKeyDown={(e) => e.key === "Enter" && onARWorld()}
            role="button"
            tabIndex={0}
          >
            <div className="qp-tag">🔮 AR World</div>
            <div className="qp-title">Catch a Calm Creature!</div>
            <div className="qp-xp">⭐ +60 Stars</div>
          </div>
        </div>

        <div style={{ height: 20 }} />
      </div>
    </>
  );
}
