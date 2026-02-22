"use client";

import { useState, useCallback } from "react";
import { questData } from "@/lib/questData";
import { arCreatureData } from "@/lib/arCreatureData";
import type { ARCreatureDisplay } from "@/lib/supabase";
import type { Quest, QuestChoice } from "@/lib/questData";
import HomeScreen from "./HomeScreen";
import QuestScreen from "./QuestScreen";
import ModulesScreen from "./ModulesScreen";
import CalmScreen from "./CalmScreen";
import ARWorldScreen from "./ARWorldScreen";
import BuddyScreen from "./BuddyScreen";
import WinScreen from "./WinScreen";
import BottomNav from "./BottomNav";

type ScreenId = "home" | "quest" | "modules" | "calm" | "arworld" | "buddy" | "win";

export default function PulseApp() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("home");
  const [mood, setMood] = useState<string | null>(null);

  // Quest state
  const [quest, setQuest] = useState<Quest | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [questAiReply, setQuestAiReply] = useState<string | null>(null);
  const [questAiLoading, setQuestAiLoading] = useState(false);
  const [questFeedback, setQuestFeedback] = useState<string | null>(null);
  const [questFeedbackCorrect, setQuestFeedbackCorrect] = useState<boolean | null>(null);
  const [pickedChoice, setPickedChoice] = useState<QuestChoice | null>(null);

  // Win state
  const [winMessage, setWinMessage] = useState("");
  const [winXp, setWinXp] = useState(50);
  const [realWorldClaimed, setRealWorldClaimed] = useState(false);

  // Buddy state
  const [buddyMessages, setBuddyMessages] = useState<{ text: string; type: "ai" | "user" }[]>([
    { text: "Hey Marcus!! 😊 I'm SO happy you're here! What do you need today?", type: "ai" },
  ]);
  const [quickChipsVisible, setQuickChipsVisible] = useState(true);

  // AR catch state
  const [arCatchOpen, setArCatchOpen] = useState(false);
  const [arCatchName, setArCatchName] = useState("");
  const [arCatchEmoji, setArCatchEmoji] = useState("");
  const [arCatchSub, setArCatchSub] = useState("");
  const [arCatchQuestion, setArCatchQuestion] = useState("");
  const [arCatchChoices, setArCatchChoices] = useState<{ t: string; c: boolean }[]>([]);
  const [arCatchFeedback, setArCatchFeedback] = useState<string | null>(null);
  const [arCatchDismissLabel, setArCatchDismissLabel] = useState("Close ✕");
  const [arAnswerPicked, setArAnswerPicked] = useState<boolean | null>(null);

  const showScreen = useCallback((id: ScreenId) => {
    setCurrentScreen(id);
  }, []);

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

  const goQuest = useCallback((type: string) => {
    const q = questData[type];
    if (!q) return;
    setQuest(q);
    setStepIndex(0);
    setQuestAiReply(null);
    setQuestFeedback(null);
    setQuestFeedbackCorrect(null);
    setPickedChoice(null);
    setCurrentScreen("quest");
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
        text = choice.c ? "YES! That's exactly right! You're amazing! 🎉" : "Good try! Next time, remember to ask directly — it always works better! 💪";
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
      setWinXp(quest.island.includes("Speak") ? 50 : quest.island.includes("Think") ? 40 : 45);
      setWinMessage(
        quest.island.includes("Speak")
          ? "Amazing!! You practiced how to speak up. You're getting SO good at this! 🌟"
          : quest.island.includes("Think")
            ? "Wow!! You flipped those sneaky thoughts like a pro! Your brain is getting stronger! 💪"
            : "You busted those worries!! Worry Time and Leaves on Stream are yours now. 🍃"
      );
      setCurrentScreen("win");
    } else {
      setStepIndex((i) => i + 1);
    }
  }, [quest, stepIndex]);

  const pickMood = useCallback((label: string) => {
    setMood(label);
    if (label === "NERVOUS" || label === "SAD") {
      setTimeout(() => {
        if (typeof window !== "undefined" && window.confirm("😊 It looks like you might need some support. Want to talk to Sparky or try the Calm Zone?")) {
          setCurrentScreen("buddy");
        }
      }, 400);
    }
  }, []);

  const sendBuddyMessage = useCallback(
    async (text: string) => {
      setBuddyMessages((m) => [...m, { text, type: "user" }]);
      setQuickChipsVisible(false);
      try {
        const reply = await callAI("chat", { messages: [{ role: "user", content: text }] });
        setBuddyMessages((m) => [...m, { text: reply, type: "ai" }]);
      } catch {
        setBuddyMessages((m) => [...m, { text: "Oops, I had a little trouble! But I'm still here. 💛 Try again?", type: "ai" }]);
      }
    },
    [callAI]
  );

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
    setArCatchSub(`Practice ${creature.skill} to catch it! ✨`);
    setArCatchQuestion(question);
    setArCatchChoices(choices);
    setArCatchFeedback(null);
    setArCatchDismissLabel("Close ✕");
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
        setArCatchFeedback((correct ? "🎉 CAUGHT IT! " : "💛 ") + text);
      } catch {
        setArCatchFeedback(correct ? "🎉 CAUGHT IT! You're amazing!! 🏆" : "💛 Good try! Remember: breathing first always helps!");
      }
      setArCatchDismissLabel(correct ? "🏆 Collect +60 ⭐" : "Try again next time!");
    },
    [callAI]
  );

  const dismissAR = useCallback(() => {
    setArCatchOpen(false);
  }, []);

  const showNav = currentScreen !== "arworld" && currentScreen !== "win";

  return (
    <div className="pulse-app">
      {currentScreen === "home" && (
        <div className={`screen active`} id="home">
          <HomeScreen
            onQuest={goQuest}
            onCalm={() => showScreen("calm")}
            onARWorld={() => showScreen("arworld")}
            onMoodPick={pickMood}
            pickedMood={mood}
          />
        </div>
      )}

      {currentScreen === "quest" && quest && (
        <div className="screen active" id="quest">
          <QuestScreen
            quest={quest}
            stepIndex={stepIndex}
            onBack={() => showScreen("home")}
            onAnswer={pickQuestAnswer}
            onNext={nextQuestStep}
            aiReply={questAiReply}
            aiLoading={questAiLoading}
            feedback={questFeedback}
            feedbackCorrect={questFeedbackCorrect}
            nextLabel={stepIndex >= 2 ? "🏆 Finish!" : "Next Step →"}
            pickedChoice={pickedChoice}
          />
        </div>
      )}

      {currentScreen === "modules" && (
        <div className={`screen ${currentScreen === "modules" ? "active" : ""}`} id="modules">
          <ModulesScreen
            onBack={() => showScreen("home")}
            onQuest={goQuest}
            onCalm={() => showScreen("calm")}
          />
        </div>
      )}

      {currentScreen === "calm" && (
        <div className={`screen active`} id="calm">
          <CalmScreen onBack={() => showScreen("home")} onARWorld={() => showScreen("arworld")} />
        </div>
      )}

      {currentScreen === "arworld" && (
        <div className="screen active" id="arworld">
          <ARWorldScreen
            onBack={() => showScreen("home")}
            onCatchCreature={openARCreature}
            catchModalOpen={arCatchOpen}
            catchEmoji={arCatchEmoji}
            catchName={arCatchName}
            catchSub={arCatchSub}
            catchQuestion={arCatchQuestion}
            catchChoices={arCatchChoices}
            onCatchAnswer={answerARCreature}
            catchFeedback={arCatchFeedback}
            catchDismissLabel={arCatchDismissLabel}
            onDismissCatch={dismissAR}
          />
        </div>
      )}

      {currentScreen === "buddy" && (
        <div className={`screen active`} id="buddy">
          <BuddyScreen
            onBack={() => showScreen("home")}
            messages={buddyMessages}
            onSendMessage={sendBuddyMessage}
            quickChipsVisible={quickChipsVisible}
          />
        </div>
      )}

      {currentScreen === "win" && (
        <div className="screen active" id="win">
          <WinScreen
            winMessage={winMessage}
            xpEarned={winXp}
            realWorldClaimed={realWorldClaimed}
            onRealWorld={() => {
              setRealWorldClaimed(true);
              setWinMessage(
                "⭐ MEGA BONUS STARS EARNED! Using a skill in REAL LIFE is the hardest thing — and YOU DID IT. Your therapist has been told. They are SO proud of you!! 🏆🌟"
              );
            }}
            onHome={() => showScreen("home")}
          />
        </div>
      )}

      {showNav && (
        <BottomNav
          current={currentScreen === "quest" ? "home" : currentScreen}
          onNav={(id) => setCurrentScreen(id as ScreenId)}
        />
      )}
    </div>
  );
}
