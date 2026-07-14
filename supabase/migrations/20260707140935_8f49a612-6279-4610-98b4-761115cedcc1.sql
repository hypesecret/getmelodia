
-- Enums
CREATE TYPE public.order_status AS ENUM ('draft','paid','generating','ready','failed');
CREATE TYPE public.order_plan AS ENUM ('essentiel','signature','legende');
CREATE TYPE public.app_role AS ENUM ('admin','user');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read"   ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Song orders
CREATE TABLE public.song_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pack_slug TEXT NOT NULL,
  questionnaire JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary TEXT,
  status public.order_status NOT NULL DEFAULT 'draft',
  plan public.order_plan NOT NULL DEFAULT 'essentiel',
  amount_fcfa INTEGER NOT NULL DEFAULT 2500,
  payment_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.song_orders TO authenticated;
GRANT ALL ON public.song_orders TO service_role;
ALTER TABLE public.song_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own orders read"   ON public.song_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own orders insert" ON public.song_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own orders update" ON public.song_orders FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX song_orders_user_idx ON public.song_orders(user_id, created_at DESC);

-- Songs
CREATE TABLE public.songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.song_orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  style TEXT,
  language TEXT,
  lyrics TEXT,
  prompt TEXT,
  audio_url TEXT,
  cover_url TEXT,
  duration INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  suno_job_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.songs TO authenticated;
GRANT ALL ON public.songs TO service_role;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own songs read"   ON public.songs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own songs insert" ON public.songs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own songs update" ON public.songs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX songs_user_idx ON public.songs(user_id, created_at DESC);
CREATE INDEX songs_order_idx ON public.songs(order_id);

-- Referrals
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  uses INTEGER NOT NULL DEFAULT 0,
  credits_fcfa INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own referral read"   ON public.referrals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own referral insert" ON public.referrals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Trigger: create profile + referral on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  ref_code TEXT;
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;

  ref_code := upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
  INSERT INTO public.referrals (user_id, code) VALUES (NEW.id, ref_code)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
