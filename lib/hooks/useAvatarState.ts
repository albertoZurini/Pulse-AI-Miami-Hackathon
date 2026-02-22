"use client";

import { useState, useCallback, useEffect } from "react";
import { baseAvatars, storeItems } from "@/lib/avatarData";
import type { BaseAvatar, StoreItem } from "@/lib/avatarData";

export interface AvatarState {
  baseAvatarId: string;
  equippedItems: Record<string, string>; // category -> itemId
  ownedItemIds: string[];
  hasChosenAvatar: boolean;
}

const STORAGE_KEY = "pulse-avatar";

function loadAvatarState(): AvatarState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AvatarState;
  } catch {
    // ignore
  }
  return defaultState();
}

function defaultState(): AvatarState {
  return {
    baseAvatarId: "fox",
    equippedItems: {},
    ownedItemIds: [],
    hasChosenAvatar: false,
  };
}

function persist(state: AvatarState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useAvatarState() {
  const [avatarState, setAvatarState] = useState<AvatarState>(defaultState);

  // Load from localStorage on mount
  useEffect(() => {
    setAvatarState(loadAvatarState());
  }, []);

  const save = useCallback((next: AvatarState) => {
    setAvatarState(next);
    persist(next);
  }, []);

  const selectAvatar = useCallback(
    (avatarId: string) => {
      setAvatarState((prev) => {
        const next = { ...prev, baseAvatarId: avatarId, hasChosenAvatar: true };
        persist(next);
        return next;
      });
    },
    []
  );

  const purchaseItem = useCallback(
    (itemId: string, spendStars: (amount: number) => boolean): boolean => {
      const item = storeItems.find((i) => i.id === itemId);
      if (!item) return false;
      if (avatarState.ownedItemIds.includes(itemId)) return false;

      const success = spendStars(item.cost);
      if (!success) return false;

      const next = {
        ...avatarState,
        ownedItemIds: [...avatarState.ownedItemIds, itemId],
        equippedItems: { ...avatarState.equippedItems, [item.category]: itemId },
      };
      save(next);
      return true;
    },
    [avatarState, save]
  );

  const equipItem = useCallback(
    (itemId: string) => {
      const item = storeItems.find((i) => i.id === itemId);
      if (!item) return;
      if (!avatarState.ownedItemIds.includes(itemId)) return;
      const next = {
        ...avatarState,
        equippedItems: { ...avatarState.equippedItems, [item.category]: itemId },
      };
      save(next);
    },
    [avatarState, save]
  );

  const unequipCategory = useCallback(
    (category: string) => {
      const next = { ...avatarState, equippedItems: { ...avatarState.equippedItems } };
      delete next.equippedItems[category];
      save(next);
    },
    [avatarState, save]
  );

  const getBaseAvatar = useCallback((): BaseAvatar => {
    return baseAvatars.find((a) => a.id === avatarState.baseAvatarId) ?? baseAvatars[0];
  }, [avatarState.baseAvatarId]);

  const getEquippedItem = useCallback(
    (category: string): StoreItem | null => {
      const itemId = avatarState.equippedItems[category];
      if (!itemId) return null;
      return storeItems.find((i) => i.id === itemId) ?? null;
    },
    [avatarState.equippedItems]
  );

  return {
    avatarState,
    selectAvatar,
    purchaseItem,
    equipItem,
    unequipCategory,
    getBaseAvatar,
    getEquippedItem,
  };
}
