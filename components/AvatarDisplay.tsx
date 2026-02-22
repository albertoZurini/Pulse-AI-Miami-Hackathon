"use client";

import { baseAvatars, storeItems } from "@/lib/avatarData";
import type { AvatarState } from "@/lib/hooks/useAvatarState";

export default function AvatarDisplay({
  avatarState,
  size = "md",
}: {
  avatarState: AvatarState;
  size?: "sm" | "md" | "lg";
}) {
  const base = baseAvatars.find((a) => a.id === avatarState.baseAvatarId) ?? baseAvatars[0];

  const hatItem = avatarState.equippedItems.hats
    ? storeItems.find((i) => i.id === avatarState.equippedItems.hats)
    : null;
  const accItem = avatarState.equippedItems.accessories
    ? storeItems.find((i) => i.id === avatarState.equippedItems.accessories)
    : null;
  const colorItem = avatarState.equippedItems.colors
    ? storeItems.find((i) => i.id === avatarState.equippedItems.colors)
    : null;
  const bgItem = avatarState.equippedItems.backgrounds
    ? storeItems.find((i) => i.id === avatarState.equippedItems.backgrounds)
    : null;
  const expItem = avatarState.equippedItems.expressions
    ? storeItems.find((i) => i.id === avatarState.equippedItems.expressions)
    : null;

  const sizeClass = `avatar-display-${size}`;
  const ringColor = colorItem ? colorItem.overlay : base.color;
  const bgStyle = bgItem
    ? { background: bgItem.overlay }
    : { background: `radial-gradient(circle, ${base.color}33, transparent)` };

  return (
    <div className={`avatar-display ${sizeClass}`}>
      <div
        className="avatar-display-ring"
        style={{ borderColor: ringColor, boxShadow: `0 0 12px ${ringColor}66` }}
      >
        <div className="avatar-display-bg" style={bgStyle}>
          {hatItem && <span className="avatar-overlay avatar-hat">{hatItem.overlay}</span>}
          <span className="avatar-display-emoji">
            {expItem ? expItem.overlay : base.emoji}
          </span>
          {accItem && <span className="avatar-overlay avatar-acc">{accItem.overlay}</span>}
        </div>
      </div>
    </div>
  );
}
