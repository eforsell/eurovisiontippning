-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT NOT NULL,
    is_private BOOLEAN DEFAULT false NOT NULL,
    is_admin BOOLEAN DEFAULT false NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can read their own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can read public profiles" ON profiles FOR SELECT TO authenticated USING (is_private = false);
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- Protect is_admin column from being updated by non-admins
CREATE OR REPLACE FUNCTION public.protect_admin_column()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_admin != OLD.is_admin THEN
    -- Allow the Supabase UI (postgres/service_role) to bypass this check
    IF current_user IN ('postgres', 'service_role', 'dashboard_user', 'supabase_admin') THEN
      RETURN NEW;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true) THEN
      RAISE EXCEPTION 'Only admins can change the is_admin flag.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER check_admin_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_admin_column();

-- Update is_admin function to use profiles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- T007: Trigger to wipe friends when account goes private
CREATE OR REPLACE FUNCTION public.set_account_private()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_private = true AND OLD.is_private = false THEN
    DELETE FROM public.friends WHERE user_id = NEW.id OR friend_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_profile_made_private
  AFTER UPDATE OF is_private ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_account_private();

-- Create contests table (replaces/augments years logic)
CREATE TABLE IF NOT EXISTS public.contests (
  id TEXT PRIMARY KEY, -- e.g., '2026-semi-1'
  year INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('semi', 'final')),
  name TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  qualifiers JSONB DEFAULT '[]'::jsonb,
  final_order JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contests are viewable by authenticated users" ON contests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert contests" ON contests FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update contests" ON contests FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete contests" ON contests FOR DELETE TO authenticated USING (public.is_admin());