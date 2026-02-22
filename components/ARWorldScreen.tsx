"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { ARCreatureRow, ARCreatureDisplay } from "@/lib/supabase";

const FALLBACK_CREATURES: ARCreatureDisplay[] = [
  { name: "Breathe Bear", emoji: "🐻‍❄️", skill: "Breathing", context: "Feeling really nervous right now?", top: 100, left: 50, dur: 3, color: "#00D4FF", badge: true },
  { name: "Think Fox", emoji: "🦊", skill: "Thought Flipping", context: "You just heard something that made you feel bad about yourself.", top: 160, right: 40, dur: 2.5, delay: 0.5, color: "#FF6B00", badge: true },
  { name: "Speak Owl", emoji: "🦉", skill: "Self-Advocacy", context: "You want something but don't know how to ask.", top: 230, left: 140, dur: 4, delay: 1, color: "#A855F7", badge: false },
];

function rowToDisplay(row: ARCreatureRow): ARCreatureDisplay {
  const pos = (row.position || {}) as { top?: number; left?: number; right?: number; dur?: number; delay?: number };
  return {
    id: row.id,
    name: row.name,
    emoji: row.emoji,
    skill: row.skill,
    context: row.context,
    practice_question: row.practice_question,
    choices: Array.isArray(row.choices) ? row.choices : undefined,
    top: pos.top ?? 100,
    left: pos.left,
    right: pos.right,
    dur: pos.dur ?? 3,
    delay: pos.delay,
    color: row.color || "#00D4FF",
    badge: row.badge ?? false,
  };
}

export default function ARWorldScreen({
  onBack,
  onCatchCreature,
  catchModalOpen,
  catchEmoji,
  catchName,
  catchSub,
  catchQuestion,
  catchChoices,
  onCatchAnswer,
  catchFeedback,
  catchDismissLabel,
  onDismissCatch,
}: {
  onBack: () => void;
  onCatchCreature: (creature: ARCreatureDisplay) => void;
  catchModalOpen: boolean;
  catchEmoji: string;
  catchName: string;
  catchSub: string;
  catchQuestion: string;
  catchChoices: { t: string; c: boolean }[];
  onCatchAnswer: (correct: boolean) => void;
  catchFeedback: string | null;
  catchDismissLabel: string;
  onDismissCatch: () => void;
}) {
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);
  const [creatures, setCreatures] = useState<ARCreatureDisplay[]>(FALLBACK_CREATURES);
  const supabase = createClient();

  useEffect(() => {
    if (!catchModalOpen) setPickedIndex(null);
  }, [catchModalOpen]);

  const fetchAndSubscribe = useCallback(() => {
    if (!supabase) return;
    supabase
      .from("ar_creatures")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.warn("[ARWorld] Failed to fetch creatures, using fallback", error);
          return;
        }
        if (data && data.length > 0) {
          const display = (data as ARCreatureRow[]).map(rowToDisplay);
          setCreatures(display);
          console.info("[ARWorld] Loaded creatures from Supabase", { count: display.length });
        }
      });
  }, [supabase]);

  useEffect(() => {
    fetchAndSubscribe();
  }, [fetchAndSubscribe]);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel("ar_world_creatures")
      .on("postgres_changes", { event: "*", schema: "public", table: "ar_creatures" }, () => {
        fetchAndSubscribe();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchAndSubscribe]);

  return (
    <>
      <div className="ar-camera">
        <div className="ar-env-grid" />
        <div className="ar-scan-line" />
        <div style={{ position: "absolute", bottom: 100, left: 20, fontSize: 48 }}>🌳</div>
        <div style={{ position: "absolute", bottom: 110, right: 30, fontSize: 56 }}>🌲</div>
        <div style={{ position: "absolute", bottom: 90, left: 100, fontSize: 36 }}>🌿</div>
        <div style={{ position: "absolute", bottom: 95, right: 100, fontSize: 32 }}>🌾</div>
        <div style={{ position: "absolute", top: 200, left: 40, fontSize: 24, opacity: 0.4 }}>✨</div>
        <div style={{ position: "absolute", top: 280, right: 50, fontSize: 20, opacity: 0.3 }}>✨</div>

        {creatures.map((cr, index) => (
          <div
            key={cr.id ?? `ar-creature-${index}-${cr.emoji}-${cr.name}`}
            className="ar-creature"
            style={{
              top: cr.top,
              left: "left" in cr ? cr.left : undefined,
              right: "right" in cr ? cr.right : undefined,
              animationDuration: `${cr.dur}s`,
              animationDelay: `${cr.delay ?? 0}s`,
            }}
            onClick={() => onCatchCreature(cr)}
            onKeyDown={(e) => e.key === "Enter" && onCatchCreature(cr)}
            role="button"
            tabIndex={0}
          >
            <div className="ar-creature-body" style={{ ["--glow" as string]: cr.color }}>
              <div
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: 26,
                  border: "2px solid",
                  borderColor: cr.color.includes("00D4") ? "rgba(0,212,255,.6)" : cr.color.includes("FF6B") ? "rgba(255,107,0,.6)" : "rgba(168,85,247,.6)",
                  animation: "glowPulse 2s ease infinite",
                }}
              />
              <span className="ar-creature-emoji">{cr.emoji}</span>
              <div className="ar-creature-name" style={{ color: cr.color }}>{cr.name.toUpperCase().replace(" ", " ")}</div>
            </div>
            {cr.badge && <div className="ar-creature-badge">!</div>}
          </div>
        ))}
      </div>

      <div className="ar-top-bar">
        <button type="button" className="ar-close" onClick={onBack}>
          ✕ Exit AR
        </button>
        <div className="ar-title-badge">🔮 AR WORLD</div>
        <div className="ar-compass">🧭</div>
      </div>

      <div className="ar-bottom">
        <div className="ar-hint">👆 Tap a creature to catch it and practice a skill!</div>
        <div className="ar-skill-chips">
          {creatures.map((cr, index) => (
            <div
              key={cr.id ?? `ar-chip-${index}-${cr.emoji}-${cr.name}`}
              className="ar-chip"
              style={{ borderColor: `${cr.color}66`, color: cr.color }}
            >
              {cr.emoji} {cr.name} — Nearby!
            </div>
          ))}
        </div>
      </div>

      <div className={`ar-catch-modal ${catchModalOpen ? "show" : ""}`}>
        <div className="ar-catch-card">
          <div className="ar-catch-emoji">{catchEmoji}</div>
          <div className="ar-catch-title">{catchName}</div>
          <div className="ar-catch-sub">{catchSub}</div>
          <div className="ar-catch-question">{catchQuestion}</div>
          <div className="ar-catch-choices">
            {catchChoices.map((c, i) => (
              <button
                key={`catch-choice-${i}-${c.t.slice(0, 30)}`}
                type="button"
                className={`ar-catch-choice ${pickedIndex === i ? (c.c ? "correct" : "wrong") : ""}`}
                onClick={() => {
                  if (pickedIndex !== null) return;
                  setPickedIndex(i);
                  onCatchAnswer(c.c);
                }}
                disabled={pickedIndex !== null}
                style={{ opacity: pickedIndex !== null ? (pickedIndex === i ? 1 : 0.5) : 1 }}
              >
                {c.t}
              </button>
            ))}
          </div>
          {catchFeedback && (
            <div
              style={{
                display: "block",
                background: "rgba(126,211,33,.1)",
                border: "1px solid var(--lime)",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                fontSize: 13,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              {catchFeedback}
            </div>
          )}
          <button type="button" className="ar-dismiss" onClick={onDismissCatch}>
            {catchDismissLabel}
          </button>
        </div>
      </div>
    </>
  );
}
