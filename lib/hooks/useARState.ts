"use client";

import { useState, useCallback } from "react";
import { arCreatureData } from "@/lib/arCreatureData";
import type { ARCreatureDisplay } from "@/lib/supabase";

export function useARState(
  callAI: (type: "chat" | "quest" | "ar", body: Record<string, unknown>) => Promise<string>
) {
  const [arCatchOpen, setArCatchOpen] = useState(false);
  const [arCatchName, setArCatchName] = useState("");
  const [arCatchEmoji, setArCatchEmoji] = useState("");
  const [arCatchSub, setArCatchSub] = useState("");
  const [arCatchQuestion, setArCatchQuestion] = useState("");
  const [arCatchChoices, setArCatchChoices] = useState<{ t: string; c: boolean }[]>([]);
  const [arCatchFeedback, setArCatchFeedback] = useState<string | null>(null);
  const [arCatchDismissLabel, setArCatchDismissLabel] = useState("Close \u2715");
  const [arAnswerPicked, setArAnswerPicked] = useState<boolean | null>(null);

  const openARCreature = useCallback((creature: ARCreatureDisplay) => {
    const d = arCreatureData[creature.emoji];
    const question = creature.practice_question ?? d?.q ?? creature.context;
    const choices =
      creature.choices && creature.choices.length > 0
        ? creature.choices
        : d?.choices ?? [
            { t: "Take a deep breath first", c: true },
            { t: "Just ignore the feeling", c: false },
            { t: "Give up immediately", c: false },
          ];
    setArCatchName(`${creature.name} appeared!`);
    setArCatchEmoji(creature.emoji);
    setArCatchSub(`Practice ${creature.skill} to catch it! \u2728`);
    setArCatchQuestion(question);
    setArCatchChoices(choices);
    setArCatchFeedback(null);
    setArCatchDismissLabel("Close \u2715");
    setArAnswerPicked(null);
    setArCatchOpen(true);
  }, []);

  const answerARCreature = useCallback(
    async (correct: boolean) => {
      setArAnswerPicked(correct);
      const prompt = correct
        ? "You are Sparky, an AI buddy for a teen with intellectual disability. They just caught an AR creature in a Pokemon-Go style skill game by getting the right answer! Give a SUPER HYPE 1-2 sentence celebration. Simple words. 2 emojis max. Make them feel like a champion!"
        : "You are Sparky, an AI buddy for a teen with intellectual disability. They got the wrong answer in an AR creature catching game. In 1-2 sentences, kindly explain the right approach. Simple words. Encouraging. 1 emoji.";
      try {
        const text = await callAI("ar", { prompt, correct });
        setArCatchFeedback((correct ? "\u{1F389} CAUGHT IT! " : "\u{1F49B} ") + text);
      } catch {
        setArCatchFeedback(
          correct
            ? "\u{1F389} CAUGHT IT! You're amazing!! \u{1F3C6}"
            : "\u{1F49B} Good try! Remember: breathing first always helps!"
        );
      }
      setArCatchDismissLabel(correct ? "\u{1F3C6} Collect +60 \u2B50" : "Try again next time!");
    },
    [callAI]
  );

  const dismissAR = useCallback(() => {
    setArCatchOpen(false);
  }, []);

  return {
    arCatchOpen,
    arCatchName,
    arCatchEmoji,
    arCatchSub,
    arCatchQuestion,
    arCatchChoices,
    arCatchFeedback,
    arCatchDismissLabel,
    arAnswerPicked,
    openARCreature,
    answerARCreature,
    dismissAR,
  };
}
