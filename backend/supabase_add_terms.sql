-- Run this in Supabase SQL Editor to add consent tracking columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS accepted_terms BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMPTZ;
