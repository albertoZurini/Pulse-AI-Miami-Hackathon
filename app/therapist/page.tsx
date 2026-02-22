"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { ARCreatureRow } from "@/lib/supabase";

const AR_VIEWPORT_WIDTH = 320;
const AR_TOP_MIN = 80;
const AR_TOP_MAX = 260;
const AR_SIDE_MIN = 30;
const AR_SIDE_MAX = 180;
const AR_MIN_DISTANCE = 80;

/** Returns a random position that does not overlap existing creatures (by minimum distance). */
function randomNonOverlappingPosition(
  existing: { position?: { top?: number; left?: number; right?: number } | null }[]
): { top: number; left?: number; right?: number; dur: number; delay: number } {
  const existingPoints = existing
    .map((c) => {
      const p = c.position;
      if (!p || p.top == null) return null;
      const x = p.left != null ? p.left : p.right != null ? AR_VIEWPORT_WIDTH - p.right : null;
      if (x == null) return null;
      return { x, y: p.top };
    })
    .filter((p): p is { x: number; y: number } => p != null);

  const dur = 2.5 + Math.random() * 2;
  const delay = Math.random() * 1.5;
  const maxAttempts = 50;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const top = AR_TOP_MIN + Math.random() * (AR_TOP_MAX - AR_TOP_MIN);
    const useLeft = Math.random() > 0.5;
    const side = AR_SIDE_MIN + Math.random() * (AR_SIDE_MAX - AR_SIDE_MIN);
    const x = useLeft ? side : AR_VIEWPORT_WIDTH - side;
    const tooClose = existingPoints.some(
      (p) => Math.hypot(p.x - x, p.y - top) < AR_MIN_DISTANCE
    );
    if (!tooClose) {
      return useLeft
        ? { top: Math.round(top), left: Math.round(side), dur, delay }
        : { top: Math.round(top), right: Math.round(side), dur, delay };
    }
  }
  return {
    top: Math.round(AR_TOP_MIN + Math.random() * (AR_TOP_MAX - AR_TOP_MIN)),
    left: Math.round(AR_SIDE_MIN + Math.random() * (AR_SIDE_MAX - AR_SIDE_MIN)),
    dur,
    delay,
  };
}

type CreatureForm = {
  name: string;
  emoji: string;
  skill: string;
  context: string;
  practice_question: string;
  choices: { t: string; c: boolean }[];
  position: { top?: number; left?: number; right?: number; dur?: number; delay?: number };
  color: string;
  badge: boolean;
  sort_order: number;
};

const emptyForm: CreatureForm = {
  name: "",
  emoji: "🦊",
  skill: "",
  context: "",
  practice_question: "",
  choices: [
    { t: "", c: false },
    { t: "", c: false },
    { t: "", c: false },
  ],
  position: { top: 100, left: 50, dur: 3, delay: 0 },
  color: "#00D4FF",
  badge: false,
  sort_order: 0,
};

function rowToForm(row: ARCreatureRow): CreatureForm {
  const pos = (row.position || {}) as CreatureForm["position"];
  return {
    name: row.name,
    emoji: row.emoji,
    skill: row.skill,
    context: row.context,
    practice_question: row.practice_question,
    choices: Array.isArray(row.choices) && row.choices.length >= 3
      ? row.choices.slice(0, 3)
      : [...emptyForm.choices],
    position: { top: pos.top ?? 100, left: pos.left, right: pos.right, dur: pos.dur ?? 3, delay: pos.delay ?? 0 },
    color: row.color || "#00D4FF",
    badge: row.badge ?? false,
    sort_order: row.sort_order ?? 0,
  };
}

export default function TherapistPage() {
  const [creatures, setCreatures] = useState<ARCreatureRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreatureForm>(emptyForm);
  const [isAdding, setIsAdding] = useState(false);

  const supabase = createClient();

  const fetchCreatures = useCallback(async () => {
    if (!supabase) {
      console.warn("[TherapistPortal] Supabase not configured; skipping fetch");
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }
    try {
      const { data, error: e } = await supabase
        .from("ar_creatures")
        .select("*")
        .order("sort_order", { ascending: true });
      if (e) throw e;
      const rows = (data as ARCreatureRow[]) ?? [];
      setCreatures(rows);
      setError(null);
      console.info("[TherapistPortal] Fetched animals", { count: rows.length });
    } catch (err) {
      console.error("[TherapistPortal] Fetch error", err);
      setError(err instanceof Error ? err.message : "Failed to load animals.");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCreatures();
  }, [fetchCreatures]);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel("ar_creatures_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ar_creatures" },
        () => {
          fetchCreatures();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchCreatures]);

  const saveEdit = async () => {
    if (!supabase) return;
    const position =
      isAdding
        ? randomNonOverlappingPosition(creatures)
        : form.position;
    const payload = {
      name: form.name,
      emoji: form.emoji,
      skill: form.skill,
      context: form.context,
      practice_question: form.practice_question,
      choices: form.choices,
      position,
      color: form.color,
      badge: form.badge,
      sort_order: form.sort_order,
      updated_at: new Date().toISOString(),
    };
    try {
      if (editingId) {
        const { error: e } = await supabase.from("ar_creatures").update(payload).eq("id", editingId);
        if (e) throw e;
      } else if (isAdding) {
        const { error: e } = await supabase.from("ar_creatures").insert(payload);
        if (e) throw e;
      }
      setEditingId(null);
      setIsAdding(false);
      setForm(emptyForm);
      console.info("[TherapistPortal] Saved animal", {
        editingId: editingId ?? "new",
        ...(isAdding && { position }),
      });
      await fetchCreatures();
    } catch (err) {
      console.error("[TherapistPortal] Save error", err);
      setError(err instanceof Error ? err.message : "Failed to save.");
    }
  };

  const remove = async (id: string) => {
    if (!supabase || !confirm("Remove this animal from the AR World?")) return;
    try {
      const { error: e } = await supabase.from("ar_creatures").delete().eq("id", id);
      if (e) throw e;
      setEditingId(null);
      setIsAdding(false);
      console.info("[TherapistPortal] Removed animal", { id });
      await fetchCreatures();
    } catch (err) {
      console.error("[TherapistPortal] Delete error", err);
      setError(err instanceof Error ? err.message : "Failed to remove.");
    }
  };

  const startEdit = (row: ARCreatureRow) => {
    setForm(rowToForm(row));
    setEditingId(row.id);
    setIsAdding(false);
  };

  const startAdd = () => {
    setForm({ ...emptyForm, sort_order: creatures.length });
    setEditingId(null);
    setIsAdding(true);
  };

  const cancelForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setForm(emptyForm);
  };

  return (
    <main className="min-h-screen bg-[#0F0A2E] text-white p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Animals in AR World</h1>
        <p className="text-sm text-gray-400 mb-6">
          Clients see changes immediately. Add, edit, or remove animals and their practice questions.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Live</span>
          <button
            type="button"
            onClick={startAdd}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold"
          >
            Add an animal
          </button>
        </div>

        {(isAdding || editingId) && (
          <div className="mb-8 p-6 rounded-xl bg-[#1A1040] border border-white/10 space-y-4">
            <h2 className="font-semibold">{editingId ? "Edit animal" : "New animal"}</h2>
            <div className="grid gap-3">
              <label className="block text-sm text-gray-300">Animal name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/20 text-white placeholder-gray-500"
                placeholder="e.g. Breathe Bear"
              />
              <label className="block text-sm text-gray-300">Emoji</label>
              <input
                type="text"
                value={form.emoji}
                onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/20 text-white"
                placeholder="🐻‍❄️"
              />
              <label className="block text-sm text-gray-300">Skill to practice</label>
              <input
                type="text"
                value={form.skill}
                onChange={(e) => setForm((f) => ({ ...f, skill: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/20 text-white"
                placeholder="e.g. Breathing"
              />
              <label className="block text-sm text-gray-300">Context (short prompt for when it appears)</label>
              <input
                type="text"
                value={form.context}
                onChange={(e) => setForm((f) => ({ ...f, context: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/20 text-white"
                placeholder="e.g. Feeling really nervous right now?"
              />
              <label className="block text-sm text-gray-300">Practice question</label>
              <textarea
                value={form.practice_question}
                onChange={(e) => setForm((f) => ({ ...f, practice_question: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/20 text-white placeholder-gray-500"
                placeholder="Question shown when the client taps the animal"
              />
              <label className="block text-sm text-gray-300">Answer choices (check the correct one)</label>
              {form.choices.map((choice, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={choice.c}
                    onChange={() =>
                      setForm((f) => ({
                        ...f,
                        choices: f.choices.map((c, j) => (j === i ? { ...c, c: true } : { ...c, c: false })),
                      }))
                    }
                    className="rounded"
                  />
                  <input
                    type="text"
                    value={choice.t}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        choices: f.choices.map((c, j) => (j === i ? { ...c, t: e.target.value } : c)),
                      }))
                    }
                    className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-white/20 text-white text-sm"
                    placeholder={`Choice ${i + 1}`}
                  />
                </div>
              ))}
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                    className="w-24 px-2 py-1 rounded bg-black/30 border border-white/20"
                  />
                  Color
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.badge}
                    onChange={(e) => setForm((f) => ({ ...f, badge: e.target.checked }))}
                    className="rounded"
                  />
                  Show “new” badge
                </label>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={saveEdit}
                className="px-4 py-2 rounded-lg bg-lime-600 hover:bg-lime-500 text-sm font-semibold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-gray-400">Loading animals…</p>
        ) : creatures.length === 0 ? (
          <p className="text-gray-400">No animals yet. Add one above to show in the client app.</p>
        ) : (
          <ul className="space-y-3">
            {creatures.map((row) => (
              <li
                key={row.id}
                className="flex items-center justify-between p-4 rounded-xl bg-[#1A1040] border border-white/10"
              >
                <span className="text-2xl mr-3">{row.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{row.name}</div>
                  <div className="text-sm text-gray-400">{row.skill}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(row)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-500 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(row.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-900/50 hover:bg-red-800/50 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
