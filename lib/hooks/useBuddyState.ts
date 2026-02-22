"use client";

import { useState, useCallback } from "react";

export interface BuddyMessage {
  text: string;
  type: "ai" | "user";
}

export function useBuddyState(
  callAI: (type: "chat" | "quest" | "ar", body: Record<string, unknown>) => Promise<string>
) {
  const [buddyMessages, setBuddyMessages] = useState<BuddyMessage[]>([
    { text: "Hey Marcus!! \u{1F60A} I'm SO happy you're here! What do you need today?", type: "ai" },
  ]);
  const [quickChipsVisible, setQuickChipsVisible] = useState(true);

  const sendBuddyMessage = useCallback(
    async (text: string) => {
      setBuddyMessages((m) => [...m, { text, type: "user" }]);
      setQuickChipsVisible(false);
      try {
        const reply = await callAI("chat", { messages: [{ role: "user", content: text }] });
        setBuddyMessages((m) => [...m, { text: reply, type: "ai" }]);
      } catch {
        setBuddyMessages((m) => [
          ...m,
          { text: "Oops, I had a little trouble! But I'm still here. \u{1F49B} Try again?", type: "ai" },
        ]);
      }
    },
    [callAI]
  );

  return { buddyMessages, quickChipsVisible, sendBuddyMessage };
}
