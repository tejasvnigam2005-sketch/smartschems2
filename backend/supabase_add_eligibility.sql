-- Run this in Supabase SQL Editor to add eligibility questionnaire columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pref_occupation TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pref_gender TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pref_area TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pref_disability BOOLEAN DEFAULT false;
