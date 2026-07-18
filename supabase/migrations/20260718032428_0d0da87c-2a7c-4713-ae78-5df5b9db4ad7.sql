CREATE TABLE public.pattern_drill_attempts (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_id text NOT NULL,
  drill_id text NOT NULL,
  language text NOT NULL,
  correct int NOT NULL DEFAULT 0,
  total int NOT NULL DEFAULT 0,
  completed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, pattern_id, drill_id, language)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pattern_drill_attempts TO authenticated;
GRANT ALL ON public.pattern_drill_attempts TO service_role;

ALTER TABLE public.pattern_drill_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own drill attempts all" ON public.pattern_drill_attempts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);