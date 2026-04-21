-- =====================================================
-- SmartSchemes — Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor (supabase.com → SQL)
-- =====================================================

-- 1. Business Schemes Table
CREATE TABLE IF NOT EXISTS business_schemes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  min_age INTEGER DEFAULT 0,
  max_age INTEGER DEFAULT 100,
  min_income NUMERIC DEFAULT 0,
  max_income NUMERIC DEFAULT 999999999,
  business_type TEXT[] DEFAULT '{}',
  min_investment NUMERIC DEFAULT 0,
  max_investment NUMERIC DEFAULT 999999999,
  states TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  eligibility TEXT[] DEFAULT '{}',
  application_process TEXT[] DEFAULT '{}',
  deadline TEXT DEFAULT 'Ongoing',
  website TEXT DEFAULT '',
  funding_amount TEXT DEFAULT '',
  ministry TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Education Schemes Table
CREATE TABLE IF NOT EXISTS education_schemes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  min_age INTEGER DEFAULT 0,
  max_age INTEGER DEFAULT 100,
  education_level TEXT[] DEFAULT '{}',
  category TEXT[] DEFAULT '{}',
  min_income NUMERIC DEFAULT 0,
  max_income NUMERIC DEFAULT 999999999,
  field_of_study TEXT[] DEFAULT '{}',
  states TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  eligibility TEXT[] DEFAULT '{}',
  application_process TEXT[] DEFAULT '{}',
  deadline TEXT DEFAULT 'Ongoing',
  website TEXT DEFAULT '',
  scholarship_amount TEXT DEFAULT '',
  ministry TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. User Profiles (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  pref_category TEXT DEFAULT '',
  pref_state TEXT DEFAULT '',
  pref_age INTEGER,
  pref_income NUMERIC,
  search_history JSONB DEFAULT '[]',
  saved_schemes JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_business_type ON business_schemes USING GIN (business_type);
CREATE INDEX IF NOT EXISTS idx_business_income ON business_schemes (min_income, max_income);
CREATE INDEX IF NOT EXISTS idx_business_states ON business_schemes USING GIN (states);

CREATE INDEX IF NOT EXISTS idx_education_level ON education_schemes USING GIN (education_level);
CREATE INDEX IF NOT EXISTS idx_education_category ON education_schemes USING GIN (category);
CREATE INDEX IF NOT EXISTS idx_education_states ON education_schemes USING GIN (states);

-- 5. Row Level Security (RLS)
ALTER TABLE business_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Schemes: public read
CREATE POLICY "Schemes are viewable by everyone" ON business_schemes FOR SELECT USING (true);
CREATE POLICY "Education schemes are viewable by everyone" ON education_schemes FOR SELECT USING (true);

-- Profiles: users can manage their own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. Auto-create profile on signup (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Updated_at auto-update
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_business_schemes_updated_at BEFORE UPDATE ON business_schemes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_education_schemes_updated_at BEFORE UPDATE ON education_schemes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
