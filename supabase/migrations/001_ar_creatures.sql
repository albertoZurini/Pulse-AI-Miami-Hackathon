-- Therapist-managed animals in AR World. Enable Realtime in Dashboard: Table → Realtime → Enable.
CREATE TABLE IF NOT EXISTS public.ar_creatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emoji text NOT NULL,
  skill text NOT NULL,
  context text NOT NULL,
  practice_question text NOT NULL,
  choices jsonb NOT NULL DEFAULT '[]',
  position jsonb NOT NULL DEFAULT '{}',
  color text NOT NULL DEFAULT '#00D4FF',
  badge boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.ar_creatures;

-- RLS: allow all for hackathon (optional: disable RLS in Dashboard instead)
ALTER TABLE public.ar_creatures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for hackathon" ON public.ar_creatures FOR ALL USING (true) WITH CHECK (true);

-- Seed: same three creatures as in app
INSERT INTO public.ar_creatures (name, emoji, skill, context, practice_question, choices, position, color, badge, sort_order)
VALUES
  (
    'Breathe Bear',
    '🐻‍❄️',
    'Breathing',
    'Feeling really nervous right now?',
    'When you feel really nervous, what''s a great first step?',
    '[{"t":"Take a slow deep breath and count to 4","c":true},{"t":"Panic and run away","c":false},{"t":"Just push through it without doing anything","c":false}]'::jsonb,
    '{"top":100,"left":50,"dur":3,"delay":0}'::jsonb,
    '#00D4FF',
    true,
    0
  ),
  (
    'Think Fox',
    '🦊',
    'Thought Flipping',
    'You just heard something that made you feel bad about yourself.',
    'You think "I''m so bad at everything." What do you do with that thought?',
    '[{"t":"Believe it — it must be true","c":false},{"t":"Flip it: \"I struggle with some things, but I''m good at others\"","c":true},{"t":"Think about it more and more","c":false}]'::jsonb,
    '{"top":160,"right":40,"dur":2.5,"delay":0.5}'::jsonb,
    '#FF6B00',
    true,
    1
  ),
  (
    'Speak Owl',
    '🦉',
    'Self-Advocacy',
    'You want something but don''t know how to ask.',
    'You want something but feel nervous to ask. What''s the brave thing to do?',
    '[{"t":"Say nothing and hope someone notices","c":false},{"t":"Get upset and give up","c":false},{"t":"Use a calm voice and say what you need","c":true}]'::jsonb,
    '{"top":230,"left":140,"dur":4,"delay":1}'::jsonb,
    '#A855F7',
    false,
    2
  );
-- Run this migration once in Supabase SQL Editor (or via Supabase CLI). Then enable Realtime for ar_creatures in Dashboard → Table → Realtime.
