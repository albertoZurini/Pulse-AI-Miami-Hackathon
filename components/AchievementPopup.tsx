"use client";

import { useEffect } from "react";
import type { Achievement } from "@/lib/achievementData";

export default function AchievementPopup({
  achievement,
  onDismiss,
}: {
  achievement: Achievement;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="achievement-popup" onClick={onDismiss} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onDismiss()}>
      <div className="ap-card">
        <div className="ap-label">{"🎉"} Achievement Unlocked!</div>
        <div className="ap-emoji">{achievement.emoji}</div>
        <div className="ap-name">{achievement.isMystery ? achievement.name : achievement.name}</div>
        <div className="ap-desc">{achievement.isMystery ? achievement.description : achievement.description}</div>
        <div className="ap-xp">{"⭐"} +{achievement.xpReward} Stars!</div>
      </div>
    </div>
  );
}
