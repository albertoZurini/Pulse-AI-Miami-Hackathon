import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing; client will be null");
}

let clientInstance: SupabaseClient | null = null;

/** Single shared Supabase client (and one Realtime connection). Event-driven only; no polling. */
export function createClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!clientInstance) {
    clientInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey);
  }
  return clientInstance;
}

export type ARCreatureRow = {
  id: string;
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
  created_at?: string;
  updated_at?: string;
};

/** Creature shape used by AR World UI and catch modal (from DB or fallback). */
export type ARCreatureDisplay = {
  id?: string;
  name: string;
  emoji: string;
  skill: string;
  context: string;
  practice_question?: string;
  choices?: { t: string; c: boolean }[];
  top: number;
  left?: number;
  right?: number;
  dur: number;
  delay?: number;
  color: string;
  badge: boolean;
};
