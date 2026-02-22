"use client";

import { useState, useCallback } from "react";
import { questData } from "@/lib/questData";
import type { Quest, QuestChoice } from "@/lib/questData";

export function useQuestState(
  callAI: (type: "chat" | "quest" | "ar", body: Record<string, unknown>) => Promise<string>,
  onWin: (message: string, xp: number) => void
) {
  const [quest, setQuest] = useState<Quest | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [questAiReply, setQuestAiReply] = useState<string | null>(null);
  const [questAiLoading, setQuestAiLoading] = useState(false);
  const [questFeedback, setQuestFeedback] = useState<string | null>(null);
  const [questFeedbackCorrect, setQuestFeedbackCorrect] = useState<boolean | null>(null);
  const [pickedChoice, setPickedChoice] = useState<QuestChoice | null>(null);

  const goQuest = useCallback((type: string) => {
    const q = questData[type];
    if (!q) return;
    setQuest(q);
    setStepIndex(0);
    setQuestAiReply(null);
    setQuestFeedback(null);
    setQuestFeedbackCorrect(null);
    setPickedChoice(null);
  }, []);

  const startQuest = useCallback((q: Quest) => {
    setQuest(q);
    setStepIndex(0);
    setQuestAiReply(null);
    setQuestFeedback(null);
    setQuestFeedbackCorrect(null);
    setPickedChoice(null);
  }, []);

  const pickQuestAnswer = useCallback(
    async (choice: QuestChoice) => {
      if (!quest || pickedChoice) return;
      setPickedChoice(choice);
      setQuestAiLoading(true);
      setQuestAiReply(null);
      setQuestFeedback(null);

      const step = quest.steps[stepIndex];
      const rightAnswer = step.choices.find((c) => c.c)?.t ?? "";
      const prompt = choice.c
        ? `You are Sparky, a fun AI buddy for teens/young adults with intellectual disability (IQ ~70). They just got the RIGHT answer in a skill practice game. Scenario: "${step.title}". They chose: "${choice.t}". Give SUPER encouraging feedback in 2 sentences max. Simple words only. 1-2 emojis. Be hype, like a best friend celebrating them!`
        : `You are Sparky, a fun AI buddy for teens/young adults with intellectual disability (IQ ~70). They got an INCORRECT answer. Scenario: "${step.title}". They chose: "${choice.t}". The right answer was: "${rightAnswer}". In 2-3 sentences max, gently explain WHY the better answer works. Zero shame. Simple words. Warm and encouraging. 1-2 emojis.`;

      let text: string;
      try {
        text = await callAI("quest", { prompt, correct: choice.c });
      } catch {
        text = choice.c
          ? "YES! That's exactly right! You're amazing! \u{1F389}"
          : "Good try! Next time, remember to ask directly \u2014 it always works better! \u{1F4AA}";
      }
      setQuestAiReply(text);
      setQuestAiLoading(false);
      setTimeout(() => {
        setQuestFeedback(text);
        setQuestFeedbackCorrect(choice.c);
      }, 700);
    },
    [quest, stepIndex, pickedChoice, callAI]
  );

  const nextQuestStep = useCallback(() => {
    if (!quest) return;
    setQuestFeedback(null);
    setQuestAiReply(null);
    setPickedChoice(null);
    if (stepIndex >= 2) {
      const xp = quest.island.includes("Speak") ? 50 : quest.island.includes("Think") ? 40 : 45;
      const msg = quest.island.includes("Speak")
        ? "Amazing!! You practiced how to speak up. You're getting SO good at this! \u{1F31F}"
        : quest.island.includes("Think")
          ? "Wow!! You flipped those sneaky thoughts like a pro! Your brain is getting stronger! \u{1F4AA}"
          : "You busted those worries!! Worry Time and Leaves on Stream are yours now. \u{1F343}";
      onWin(msg, xp);
    } else {
      setStepIndex((i) => i + 1);
    }
  }, [quest, stepIndex, onWin]);

  return {
    quest,
    stepIndex,
    questAiReply,
    questAiLoading,
    questFeedback,
    questFeedbackCorrect,
    pickedChoice,
    goQuest,
    startQuest,
    pickQuestAnswer,
    nextQuestStep,
  };
}
