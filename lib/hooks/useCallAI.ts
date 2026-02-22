"use client";

import { useCallback } from "react";

export function useCallAI() {
  const callAI = useCallback(
    async (type: "chat" | "quest" | "ar", body: Record<string, unknown>) => {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...body }),
      });
      const data = await res.json();
      return data.text as string;
    },
    []
  );

  return callAI;
}
