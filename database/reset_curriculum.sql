-- Reset curriculum data to the two supported live programs.
-- Run this after schema.sql when you want to remove old course/prospectus rows.
--
-- This keeps curriculum content in Supabase instead of hardcoding it in the app.
-- Add the detailed term-by-term subjects from the PDFs through the Faculty/Admin
-- Console so future edits stay database-backed.

DELETE FROM public.prospectus_records;
DELETE FROM public.course_offerings;

ALTER TABLE public.course_offerings
  DROP COLUMN IF EXISTS summary,
  DROP COLUMN IF EXISTS technical_electives;

ALTER TABLE public.prospectus_records
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS technical_electives JSONB NOT NULL DEFAULT '[]'::jsonb;

INSERT INTO public.course_offerings (
  id,
  college,
  program,
  degree,
  overview,
  tags
)
VALUES
  (
    'coe-bsee-2018',
    'College of Engineering',
    'Bachelor of Science in Electrical Engineering',
    'BSEE',
    'Curriculum record for the College of Engineering BSEE prospectus.',
    '["coe", "engineering", "electrical engineering", "bsee"]'::jsonb
  ),
  (
    'cics-bsit-dbs',
    'College of Information and Computing Sciences',
    'BS-IT (DBs)',
    'BSIT-DBS',
    'Curriculum record for the CICS Bachelor of Science in Information Technology Database Systems track prospectus.',
    '["cics", "it", "database", "database systems", "dbs"]'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  college = EXCLUDED.college,
  program = EXCLUDED.program,
  degree = EXCLUDED.degree,
  overview = EXCLUDED.overview,
  tags = EXCLUDED.tags;
