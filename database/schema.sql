-- Supabase/Postgres schema for myMSU-InfoGuide.
-- Run this file in the Supabase SQL editor for the project.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  CREATE TYPE public.user_role AS ENUM ('student', 'visitor', 'faculty', 'employee', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE public.event_type AS ENUM ('enrollment', 'classes', 'event', 'deadline', 'exam');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE public.notification_priority AS ENUM ('high', 'normal', 'low');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role public.user_role NOT NULL DEFAULT 'visitor',
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.handbook_entries (
  id TEXT PRIMARY KEY,
  chapter TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.administrative_offices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  location TEXT NOT NULL,
  contact TEXT NOT NULL,
  hours TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.campus_locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  map_x DOUBLE PRECISION NOT NULL DEFAULT 50,
  map_y DOUBLE PRECISION NOT NULL DEFAULT 50,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  street TEXT,
  nearby JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  image TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.class_schedules (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles (id) ON DELETE CASCADE,
  course_code TEXT NOT NULL,
  course_title TEXT NOT NULL,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  schedule_date DATE,
  start_time TIME,
  end_time TIME,
  room TEXT NOT NULL,
  reminder TEXT NOT NULL,
  reminder_minutes INTEGER NOT NULL DEFAULT 15,
  reminder_at TIMESTAMPTZ,
  notification_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.class_schedules
  ADD COLUMN IF NOT EXISTS schedule_date DATE,
  ADD COLUMN IF NOT EXISTS start_time TIME,
  ADD COLUMN IF NOT EXISTS end_time TIME,
  ADD COLUMN IF NOT EXISTS reminder_minutes INTEGER NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS reminder_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS notification_id TEXT;

CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  date_label TEXT NOT NULL,
  priority public.notification_priority NOT NULL DEFAULT 'normal',
  audience TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.course_offerings (
  id TEXT PRIMARY KEY,
  college TEXT NOT NULL,
  program TEXT NOT NULL,
  degree TEXT NOT NULL,
  overview TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.prospectus_records (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES public.course_offerings (id) ON DELETE CASCADE,
  program TEXT NOT NULL,
  year_level TEXT NOT NULL,
  semester TEXT NOT NULL,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.academic_calendar (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  event_date DATE,
  date_label TEXT NOT NULL,
  type public.event_type NOT NULL DEFAULT 'event',
  audience TEXT NOT NULL,
  details TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.academic_calendar
  ADD COLUMN IF NOT EXISTS event_date DATE;

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (lower(username));
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (lower(email));
CREATE INDEX IF NOT EXISTS idx_handbook_search ON public.handbook_entries (chapter, title);
CREATE INDEX IF NOT EXISTS idx_office_search ON public.administrative_offices (name, category);
CREATE INDEX IF NOT EXISTS idx_calendar_type ON public.academic_calendar (type);
CREATE INDEX IF NOT EXISTS idx_schedule_user ON public.class_schedules (user_id);
CREATE INDEX IF NOT EXISTS idx_schedule_reminder_at ON public.class_schedules (reminder_at);

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    CASE
      WHEN lower(NEW.email) LIKE '%@s.msumain.edu.ph' THEN 'student'::public.user_role
      WHEN NEW.raw_user_meta_data ->> 'role' IN ('faculty', 'employee', 'visitor') THEN (NEW.raw_user_meta_data ->> 'role')::public.user_role
      ELSE 'visitor'::public.user_role
    END,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    lower(NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS touch_profiles_updated_at ON public.profiles;
CREATE TRIGGER touch_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS touch_handbook_updated_at ON public.handbook_entries;
CREATE TRIGGER touch_handbook_updated_at
  BEFORE UPDATE ON public.handbook_entries
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS touch_offices_updated_at ON public.administrative_offices;
CREATE TRIGGER touch_offices_updated_at
  BEFORE UPDATE ON public.administrative_offices
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS touch_locations_updated_at ON public.campus_locations;
CREATE TRIGGER touch_locations_updated_at
  BEFORE UPDATE ON public.campus_locations
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS touch_course_offerings_updated_at ON public.course_offerings;
CREATE TRIGGER touch_course_offerings_updated_at
  BEFORE UPDATE ON public.course_offerings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS touch_prospectus_updated_at ON public.prospectus_records;
CREATE TRIGGER touch_prospectus_updated_at
  BEFORE UPDATE ON public.prospectus_records
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS touch_calendar_updated_at ON public.academic_calendar;
CREATE TRIGGER touch_calendar_updated_at
  BEFORE UPDATE ON public.academic_calendar
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handbook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrative_offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospectus_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_calendar ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public write profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public read handbook entries" ON public.handbook_entries;
DROP POLICY IF EXISTS "Public write handbook entries" ON public.handbook_entries;
DROP POLICY IF EXISTS "Public read administrative offices" ON public.administrative_offices;
DROP POLICY IF EXISTS "Public write administrative offices" ON public.administrative_offices;
DROP POLICY IF EXISTS "Public read campus locations" ON public.campus_locations;
DROP POLICY IF EXISTS "Public write campus locations" ON public.campus_locations;
DROP POLICY IF EXISTS "Public read class schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Public write class schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Public read notifications" ON public.notifications;
DROP POLICY IF EXISTS "Public write notifications" ON public.notifications;
DROP POLICY IF EXISTS "Public read course offerings" ON public.course_offerings;
DROP POLICY IF EXISTS "Public write course offerings" ON public.course_offerings;
DROP POLICY IF EXISTS "Public read prospectus records" ON public.prospectus_records;
DROP POLICY IF EXISTS "Public write prospectus records" ON public.prospectus_records;
DROP POLICY IF EXISTS "Public read academic calendar" ON public.academic_calendar;
DROP POLICY IF EXISTS "Public write academic calendar" ON public.academic_calendar;

CREATE POLICY "Public read profiles" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Public write profiles" ON public.profiles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read handbook entries" ON public.handbook_entries
  FOR SELECT USING (true);
CREATE POLICY "Public write handbook entries" ON public.handbook_entries
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read administrative offices" ON public.administrative_offices
  FOR SELECT USING (true);
CREATE POLICY "Public write administrative offices" ON public.administrative_offices
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read campus locations" ON public.campus_locations
  FOR SELECT USING (true);
CREATE POLICY "Public write campus locations" ON public.campus_locations
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read class schedules" ON public.class_schedules
  FOR SELECT USING (true);
CREATE POLICY "Public write class schedules" ON public.class_schedules
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read notifications" ON public.notifications
  FOR SELECT USING (true);
CREATE POLICY "Public write notifications" ON public.notifications
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read course offerings" ON public.course_offerings
  FOR SELECT USING (true);
CREATE POLICY "Public write course offerings" ON public.course_offerings
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read prospectus records" ON public.prospectus_records
  FOR SELECT USING (true);
CREATE POLICY "Public write prospectus records" ON public.prospectus_records
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read academic calendar" ON public.academic_calendar
  FOR SELECT USING (true);
CREATE POLICY "Public write academic calendar" ON public.academic_calendar
  FOR ALL USING (true) WITH CHECK (true);
