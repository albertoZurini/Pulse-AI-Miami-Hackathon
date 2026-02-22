"use client";

import { useState } from "react";
import { baseAvatars, storeItems, storeCategories } from "@/lib/avatarData";
import type { StoreItem } from "@/lib/avatarData";
import AvatarDisplay from "./AvatarDisplay";
import type { AvatarState } from "@/lib/hooks/useAvatarState";

export default function AvatarStoreScreen({
  onBack,
  avatarState,
  stars,
  onSelectAvatar,
  onPurchase,
  onEquip,
  onUnequip,
}: {
  onBack: () => void;
  avatarState: AvatarState;
  stars: number;
  onSelectAvatar: (id: string) => void;
  onPurchase: (itemId: string) => boolean;
  onEquip: (itemId: string) => void;
  onUnequip: (category: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<StoreItem["category"] | "avatar">("avatar");
  const [buyFeedback, setBuyFeedback] = useState<string | null>(null);

  const handleBuy = (itemId: string, cost: number) => {
    if (stars < cost) {
      setBuyFeedback("Not enough stars!");
      setTimeout(() => setBuyFeedback(null), 2000);
      return;
    }
    const ok = onPurchase(itemId);
    if (ok) {
      setBuyFeedback("Purchased!");
      setTimeout(() => setBuyFeedback(null), 2000);
    }
  };

  const filteredItems = activeTab === "avatar" ? [] : storeItems.filter((i) => i.category === activeTab);

  return (
    <div className="store-screen">
      {/* Header */}
      <div className="store-header">
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
        <div className="store-title">{"🛍️"} Avatar Store</div>
        <div className="store-stars">{"⭐"} {stars}</div>
      </div>

      {/* Current avatar preview */}
      <div className="store-preview">
        <AvatarDisplay avatarState={avatarState} size="lg" />
      </div>

      {buyFeedback && <div className="store-feedback">{buyFeedback}</div>}

      {/* Tabs */}
      <div className="store-tabs">
        <button
          type="button"
          className={`store-tab ${activeTab === "avatar" ? "active" : ""}`}
          onClick={() => setActiveTab("avatar")}
        >
          {"🐾"} Avatar
        </button>
        {storeCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`store-tab ${activeTab === cat.id ? "active" : ""}`}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="store-content">
        {activeTab === "avatar" && (
          <div className="store-grid">
            {baseAvatars.map((av) => {
              const selected = avatarState.baseAvatarId === av.id;
              return (
                <button
                  key={av.id}
                  type="button"
                  className={`store-item ${selected ? "equipped" : ""}`}
                  onClick={() => onSelectAvatar(av.id)}
                >
                  <div className="si-emoji" style={{ fontSize: 36 }}>{av.emoji}</div>
                  <div className="si-name">{av.name}</div>
                  {selected && <div className="si-badge">{"✓"}</div>}
                </button>
              );
            })}
          </div>
        )}

        {activeTab !== "avatar" && (
          <div className="store-grid">
            {filteredItems.map((item) => {
              const owned = avatarState.ownedItemIds.includes(item.id);
              const equipped = avatarState.equippedItems[item.category] === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`store-item ${equipped ? "equipped" : ""} ${owned ? "owned" : ""}`}
                  onClick={() => {
                    if (!owned) {
                      handleBuy(item.id, item.cost);
                    } else if (equipped) {
                      onUnequip(item.category);
                    } else {
                      onEquip(item.id);
                    }
                  }}
                >
                  <div className="si-emoji">{item.emoji}</div>
                  <div className="si-name">{item.name}</div>
                  {!owned && (
                    <div className="si-cost">{"⭐"} {item.cost}</div>
                  )}
                  {owned && !equipped && (
                    <div className="si-equip">Equip</div>
                  )}
                  {equipped && <div className="si-badge">{"✓"}</div>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
