"use client";

import { useState, useCallback, useEffect } from "react";
import { useCallAI } from "@/lib/hooks/useCallAI";
import { usePlayerState } from "@/lib/hooks/usePlayerState";
import { useQuestState } from "@/lib/hooks/useQuestState";
import { useBuddyState } from "@/lib/hooks/useBuddyState";
import { useARState } from "@/lib/hooks/useARState";
import { useStatsState } from "@/lib/hooks/useStatsState";
import { useAchievements } from "@/lib/hooks/useAchievements";
import { useAvatarState } from "@/lib/hooks/useAvatarState";
import { creatureQuests } from "@/lib/creatureQuestData";
import { bonusMissions } from "@/lib/bonusMissionData";
import type { BonusMission } from "@/lib/bonusMissionData";
import HomeScreen from "./HomeScreen";
import QuestScreen from "./QuestScreen";
import QuestsListScreen from "./QuestsListScreen";
import ModulesScreen from "./ModulesScreen";
import CalmScreen from "./CalmScreen";
import ARWorldScreen from "./ARWorldScreen";
import BuddyScreen from "./BuddyScreen";
import WinScreen from "./WinScreen";
import ChatRoomScreen from "./ChatRoomScreen";
import AchievementsScreen from "./AchievementsScreen";
import AchievementPopup from "./AchievementPopup";
import CharacterSelectScreen from "./CharacterSelectScreen";
import AvatarStoreScreen from "./AvatarStoreScreen";
import BottomNav from "./BottomNav";

type ScreenId =
  | "home"
  | "quest"
  | "quests"
  | "modules"
  | "calm"
  | "arworld"
  | "buddy"
  | "win"
  | "chatroom"
  | "achievements"
  | "characterSelect"
  | "store";

export default function PulseApp() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("home");

  // Win state
  const [winMessage, setWinMessage] = useState("");
  const [winXp, setWinXp] = useState(50);
  const [realWorldClaimed, setRealWorldClaimed] = useState(false);

  const callAI = useCallAI();
  const { player, pickMood, addStars, spendStars } = usePlayerState();
  const { stats, incrementStat } = useStatsState();
  const { earned, unearned, newlyEarned, dismissNewlyEarned } = useAchievements(stats);
  const {
    avatarState,
    selectAvatar,
    purchaseItem,
    equipItem,
    unequipCategory,
  } = useAvatarState();

  const handleWin = useCallback(
    (message: string, xp: number) => {
      setWinMessage(message);
      setWinXp(xp);
      setRealWorldClaimed(false);
      addStars(xp);
      incrementStat("questsDone");
      incrementStat("totalXp", xp);
      setCurrentScreen("win");
    },
    [addStars, incrementStat]
  );

  const questState = useQuestState(callAI, handleWin);
  const buddyState = useBuddyState(callAI);
  const arState = useARState(callAI);

  const showScreen = useCallback((id: ScreenId) => {
    setCurrentScreen(id);
  }, []);

  const goQuest = useCallback(
    (type: string) => {
      questState.goQuest(type);
      setCurrentScreen("quest");
    },
    [questState]
  );

  const handleMoodPick = useCallback(
    (label: string) => {
      pickMood(label);
      if (label === "NERVOUS" || label === "SAD") {
        setTimeout(() => {
          if (
            typeof window !== "undefined" &&
            window.confirm(
              "\u{1F60A} It looks like you might need some support. Want to talk to Sparky or try the Calm Zone?"
            )
          ) {
            setCurrentScreen("buddy");
          }
        }, 400);
      }
    },
    [pickMood]
  );

  // Bonus mission state
  const [activeBonusMission, setActiveBonusMission] = useState<BonusMission | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const mission = bonusMissions[Math.floor(Math.random() * bonusMissions.length)];
      setActiveBonusMission(mission);
    }, 180_000);
    return () => clearInterval(timer);
  }, []);

  const handleBonusMissionAnswer = useCallback(
    (correct: boolean) => {
      if (correct && activeBonusMission) {
        addStars(activeBonusMission.xp);
        incrementStat("bonusMissions");
        incrementStat("totalXp", activeBonusMission.xp);
      }
      setActiveBonusMission(null);
    },
    [activeBonusMission, addStars, incrementStat]
  );

  const goCreatureQuest = useCallback(
    (creatureKey: string) => {
      const quests = creatureQuests[creatureKey];
      if (!quests || quests.length === 0) return;
      questState.startQuest(quests[0]);
      setCurrentScreen("quest");
    },
    [questState]
  );

  // Chat room state
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null);

  const joinChatRoom = useCallback((roomId: string) => {
    setActiveChatRoomId(roomId);
    setCurrentScreen("chatroom");
  }, []);

  const handleSelectAvatar = useCallback(
    (avatarId: string) => {
      selectAvatar(avatarId);
      setCurrentScreen("home");
    },
    [selectAvatar]
  );

  const handlePurchaseItem = useCallback(
    (itemId: string): boolean => {
      return purchaseItem(itemId, spendStars);
    },
    [purchaseItem, spendStars]
  );

  // Show character select on first launch
  const effectiveScreen =
    !avatarState.hasChosenAvatar && currentScreen === "home"
      ? "characterSelect"
      : currentScreen;

  const showNav =
    effectiveScreen !== "arworld" &&
    effectiveScreen !== "win" &&
    effectiveScreen !== "chatroom" &&
    effectiveScreen !== "characterSelect" &&
    effectiveScreen !== "store";

  return (
    <div className="pulse-app">
      {effectiveScreen === "characterSelect" && (
        <div className="screen active" id="characterSelect">
          <CharacterSelectScreen onSelect={handleSelectAvatar} />
        </div>
      )}

      {effectiveScreen === "store" && (
        <div className="screen active" id="store">
          <AvatarStoreScreen
            onBack={() => showScreen("home")}
            avatarState={avatarState}
            stars={player.stars}
            onSelectAvatar={selectAvatar}
            onPurchase={handlePurchaseItem}
            onEquip={equipItem}
            onUnequip={unequipCategory}
          />
        </div>
      )}

      {effectiveScreen === "home" && (
        <div className="screen active" id="home">
          <HomeScreen
            onQuest={goQuest}
            onCalm={() => showScreen("calm")}
            onARWorld={() => showScreen("arworld")}
            onMoodPick={handleMoodPick}
            pickedMood={player.mood}
            player={player}
            onJoinChatRoom={joinChatRoom}
            stats={stats}
            onAchievements={() => showScreen("achievements")}
            avatarState={avatarState}
            onStore={() => showScreen("store")}
          />
        </div>
      )}

      {effectiveScreen === "quest" && questState.quest && (
        <div className="screen active" id="quest">
          <QuestScreen
            quest={questState.quest}
            stepIndex={questState.stepIndex}
            onBack={() => showScreen("home")}
            onAnswer={questState.pickQuestAnswer}
            onNext={questState.nextQuestStep}
            aiReply={questState.questAiReply}
            aiLoading={questState.questAiLoading}
            feedback={questState.questFeedback}
            feedbackCorrect={questState.questFeedbackCorrect}
            nextLabel={questState.stepIndex >= 2 ? "\u{1F3C6} Finish!" : "Next Step \u2192"}
            pickedChoice={questState.pickedChoice}
          />
        </div>
      )}

      {effectiveScreen === "quests" && (
        <div className="screen active" id="quests">
          <QuestsListScreen
            onBack={() => showScreen("home")}
            onQuest={goQuest}
            onCreatureQuest={goCreatureQuest}
            activeBonusMission={activeBonusMission}
            onBonusMissionAnswer={handleBonusMissionAnswer}
          />
        </div>
      )}

      {effectiveScreen === "modules" && (
        <div className="screen active" id="modules">
          <ModulesScreen
            onBack={() => showScreen("home")}
            onQuest={goQuest}
            onCalm={() => showScreen("calm")}
          />
        </div>
      )}

      {effectiveScreen === "calm" && (
        <div className="screen active" id="calm">
          <CalmScreen onBack={() => showScreen("home")} onARWorld={() => showScreen("arworld")} />
        </div>
      )}

      {effectiveScreen === "arworld" && (
        <div className="screen active" id="arworld">
          <ARWorldScreen
            onBack={() => showScreen("home")}
            onCatchCreature={arState.openARCreature}
            catchModalOpen={arState.arCatchOpen}
            catchEmoji={arState.arCatchEmoji}
            catchName={arState.arCatchName}
            catchSub={arState.arCatchSub}
            catchQuestion={arState.arCatchQuestion}
            catchChoices={arState.arCatchChoices}
            onCatchAnswer={arState.answerARCreature}
            catchFeedback={arState.arCatchFeedback}
            catchDismissLabel={arState.arCatchDismissLabel}
            onDismissCatch={arState.dismissAR}
          />
        </div>
      )}

      {effectiveScreen === "buddy" && (
        <div className="screen active" id="buddy">
          <BuddyScreen
            onBack={() => showScreen("home")}
            messages={buddyState.buddyMessages}
            onSendMessage={buddyState.sendBuddyMessage}
            quickChipsVisible={buddyState.quickChipsVisible}
          />
        </div>
      )}

      {effectiveScreen === "chatroom" && activeChatRoomId && (
        <div className="screen active" id="chatroom">
          <ChatRoomScreen
            roomId={activeChatRoomId}
            onBack={() => showScreen("home")}
            avatarState={avatarState}
          />
        </div>
      )}

      {effectiveScreen === "achievements" && (
        <div className="screen active" id="achievements">
          <AchievementsScreen
            onBack={() => showScreen("home")}
            earned={earned}
            unearned={unearned}
          />
        </div>
      )}

      {effectiveScreen === "win" && (
        <div className="screen active" id="win">
          <WinScreen
            winMessage={winMessage}
            xpEarned={winXp}
            realWorldClaimed={realWorldClaimed}
            onRealWorld={() => {
              setRealWorldClaimed(true);
              setWinMessage(
                "\u2B50 MEGA BONUS STARS EARNED! Using a skill in REAL LIFE is the hardest thing \u2014 and YOU DID IT. Your therapist has been told. They are SO proud of you!! \u{1F3C6}\u{1F31F}"
              );
            }}
            onHome={() => showScreen("home")}
          />
        </div>
      )}

      {/* Achievement popup overlay */}
      {newlyEarned && (
        <AchievementPopup achievement={newlyEarned} onDismiss={dismissNewlyEarned} />
      )}

      {showNav && (
        <BottomNav
          current={effectiveScreen === "quest" ? "quests" : effectiveScreen === "achievements" ? "home" : effectiveScreen}
          onNav={(id) => setCurrentScreen(id as ScreenId)}
        />
      )}
    </div>
  );
}
