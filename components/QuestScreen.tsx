"use client";

import { useRef } from "react";
import type { Quest, QuestStep } from "@/lib/questData";

export default function QuestScreen({
  quest,
  stepIndex,
  onBack,
  onAnswer,
  onNext,
  aiReply,
  aiLoading,
  feedback,
  feedbackCorrect,
  nextLabel,
  pickedChoice,
}: {
  quest: Quest;
  stepIndex: number;
  onBack: () => void;
  onAnswer: (choice: { t: string; i: string; c: boolean }) => void;
  onNext: () => void;
  aiReply: string | null;
  aiLoading: boolean;
  feedback: string | null;
  feedbackCorrect: boolean | null;
  nextLabel: string;
  pickedChoice: { t: string; i: string; c: boolean } | null;
}) {
  const scenarioRef = useRef<HTMLDivElement>(null);
  const step = quest.steps[stepIndex];
  if (!step) return null;

  const readAloud = () => {
    const el = document.getElementById("sceneText");
    if (el && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(el.innerText);
      u.rate = 0.85;
      u.pitch = 1.1;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <>
      <div className="quest-top">
        <button type="button" className="q-back" onClick={onBack}>
          ← My World
        </button>
        <div className="q-island-name">{quest.island}</div>
        <div className="q-sub">{quest.sub}</div>
      </div>

      <div className="step-track">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`step-dot ${i < stepIndex ? "done" : i === stepIndex ? "active" : ""}`}
          />
        ))}
      </div>

      <div className="scenario-wrap" ref={scenarioRef}>
        <div className="scene-card">
          <div className="scene-visual">{step.visual}</div>
          <div className="scene-title">{step.title}</div>
          <div className="scene-text" id="sceneText">
            {step.text.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < step.text.split("\n").length - 1 && <br />}
              </span>
            ))}
          </div>
          <button type="button" className="read-btn" onClick={readAloud}>
            🔊 Read this to me
          </button>
        </div>

        <div className="choices-wrap">
          {step.choices.map((c) => (
            <button
              key={c.t}
              type="button"
              className={`choice ${pickedChoice?.t === c.t ? (pickedChoice.c ? "correct" : "wrong") : ""}`}
              onClick={() => !pickedChoice && onAnswer(c)}
              style={{ opacity: pickedChoice ? (pickedChoice.t === c.t ? 1 : 0.45) : 1 }}
              disabled={!!pickedChoice}
            >
              <span className="choice-ico">{c.i}</span>
              {c.t}
            </button>
          ))}
        </div>

        <div className={`ai-bubble ${aiReply !== null || aiLoading ? "show" : ""}`}>
          <div className="ai-header">
            <div className="ai-orb">✦</div>
            <div>
              <div className="ai-tag">Sparky is thinking...</div>
            </div>
          </div>
          {aiLoading && (
            <div className="ai-dots">
              <span />
              <span />
              <span />
            </div>
          )}
          {aiReply !== null && !aiLoading && (
            <div className="ai-text">{aiReply}</div>
          )}
        </div>

        <div className={`feedback-pop ${feedback !== null ? "show" : ""} ${feedback !== null && feedbackCorrect ? "great" : feedback !== null ? "try" : ""}`} style={{ display: feedback !== null ? "block" : "none" }}>
          <div className="fb-emoji">{feedbackCorrect ? "🎉" : "💛"}</div>
          <div className="fb-title">{feedbackCorrect ? "Nailed it!!" : "Good Try!"}</div>
          <div className="fb-msg">{feedback}</div>
          <button type="button" className="next-btn" onClick={onNext}>
            {nextLabel}
          </button>
        </div>

        <div style={{ height: 20 }} />
      </div>
    </>
  );
}
