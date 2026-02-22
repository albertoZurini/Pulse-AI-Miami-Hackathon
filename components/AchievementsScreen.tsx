"use client";

import type { Achievement } from "@/lib/achievementData";

export default function AchievementsScreen({
  onBack,
  earned,
  unearned,
}: {
  onBack: () => void;
  earned: Achievement[];
  unearned: Achievement[];
}) {
  return (
    <div className="achievements-screen">
      <div className="achievements-header">
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
          {"←"} Back
        </button>
        <div style={{ fontFamily: "Fredoka One", fontSize: 24, marginTop: 8 }}>
          {"🏆"} Achievements
        </div>
        <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>
          {earned.length} of {earned.length + unearned.length} unlocked!
        </div>
      </div>

      <div className="achievement-scroll">
        {earned.length > 0 && (
          <>
            <div className="ach-section-label">{"🌟"} Earned</div>
            <div className="achievement-grid">
              {earned.map((ach) => (
                <div key={ach.id} className="achievement-badge earned">
                  <div className="ab-emoji">{ach.emoji}</div>
                  <div className="ab-name">{ach.name}</div>
                  <div className="ab-desc">{ach.description}</div>
                  <div className="ab-xp">{"⭐"} +{ach.xpReward}</div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="ach-section-label" style={{ marginTop: 16 }}>{"🔒"} Locked</div>
        <div className="achievement-grid">
          {unearned.map((ach) => (
            <div key={ach.id} className={`achievement-badge locked ${ach.isMystery ? "mystery" : ""}`}>
              <div className="ab-emoji">{ach.isMystery ? "🎁" : ach.emoji}</div>
              <div className="ab-name">{ach.isMystery ? "???" : ach.name}</div>
              <div className="ab-desc">{ach.isMystery ? "Keep playing to find out!" : ach.description}</div>
              <div className="ab-xp">{ach.isMystery ? "??? stars" : `⭐ +${ach.xpReward}`}</div>
            </div>
          ))}
        </div>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
}
