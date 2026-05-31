-- Refresh curriculum program records for the two supported live programs.
-- Run this after schema.sql when you want to make sure the program rows exist.
--
-- This keeps curriculum content in Supabase instead of hardcoding it in the app.
-- Detailed term-by-term prospectus rows live in public.prospectus_records and
-- are imported separately from the PDF source files. This script intentionally
-- does not delete those live records.

ALTER TABLE public.course_offerings
  ADD COLUMN IF NOT EXISTS college_id TEXT,
  DROP COLUMN IF EXISTS summary,
  DROP COLUMN IF EXISTS technical_electives;

ALTER TABLE public.prospectus_records
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS technical_electives JSONB NOT NULL DEFAULT '[]'::jsonb;

INSERT INTO public.colleges (id, name, description)
VALUES
  (
    'coe',
    'College of Engineering',
    'Academic college that offers engineering programs.'
  ),
  (
    'cics',
    'College of Information and Computing Sciences',
    'Academic college that offers computing and information systems programs.'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO public.course_offerings (
  id,
  college_id,
  college,
  program,
  degree,
  overview,
  tags
)
VALUES
  (
    'coe-bsee-2018',
    'coe',
    'College of Engineering',
    'Bachelor of Science in Electrical Engineering',
    'BSEE',
    'Curriculum record for the College of Engineering BSEE prospectus.',
    '["coe", "engineering", "electrical engineering", "bsee"]'::jsonb
  ),
  (
    'cics-bsit-dbs',
    'cics',
    'College of Information and Computing Sciences',
    'BS-IT (DBs)',
    'BSIT-DBS',
    'Curriculum record for the CICS Bachelor of Science in Information Technology Database Systems track prospectus.',
    '["cics", "it", "database", "database systems", "dbs"]'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  college_id = EXCLUDED.college_id,
  college = EXCLUDED.college,
  program = EXCLUDED.program,
  degree = EXCLUDED.degree,
  overview = EXCLUDED.overview,
  tags = EXCLUDED.tags;
