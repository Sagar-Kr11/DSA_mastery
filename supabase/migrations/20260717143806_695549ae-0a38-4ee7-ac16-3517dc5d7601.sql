
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  leetcode_username TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.solved_problems (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  solved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','leetcode')),
  PRIMARY KEY (user_id, slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.solved_problems TO authenticated;
GRANT ALL ON public.solved_problems TO service_role;
ALTER TABLE public.solved_problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own solved all" ON public.solved_problems FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX solved_problems_user_solved_at_idx ON public.solved_problems (user_id, solved_at DESC);

-- auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
