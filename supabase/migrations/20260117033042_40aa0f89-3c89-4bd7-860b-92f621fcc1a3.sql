-- Add new columns for NIP and seed source
ALTER TABLE public.tree_registrations 
ADD COLUMN IF NOT EXISTS nip text,
ADD COLUMN IF NOT EXISTS seed_source text;