"use client";

import { baseAvatars } from "@/lib/avatarData";

export default function CharacterSelectScreen({
  onSelect,
}: {
  onSelect: (avatarId: string) => void;
}) {
  return (
    <div className="character-select-screen">
      <div className="cs-stars" />
      <div className="cs-content">
        <div className="cs-title">{"🌟"} Choose Your Explorer!</div>
        <div className="cs-subtitle">Pick an avatar to start your journey</div>

        <div className="character-select-grid">
          {baseAvatars.map((av) => (
            <button
              key={av.id}
              type="button"
              className="cs-avatar-card"
              onClick={() => onSelect(av.id)}
              style={{ "--av-color": av.color } as React.CSSProperties}
            >
              <div className="cs-avatar-ring" style={{ borderColor: av.color }}>
                <span className="cs-avatar-emoji">{av.emoji}</span>
              </div>
              <div className="cs-avatar-name">{av.name}</div>
            </button>
          ))}
        </div>

        <div className="cs-hint">You can change this later in the store!</div>
      </div>
    </div>
  );
}
