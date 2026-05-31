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

CREATE TABLE IF NOT EXISTS public.colleges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS id_number TEXT,
  ADD COLUMN IF NOT EXISTS student_id TEXT,
  ADD COLUMN IF NOT EXISTS college_id TEXT,
  ADD COLUMN IF NOT EXISTS program_id TEXT,
  ADD COLUMN IF NOT EXISTS college TEXT,
  ADD COLUMN IF NOT EXISTS program TEXT,
  ADD COLUMN IF NOT EXISTS year_level TEXT,
  ADD COLUMN IF NOT EXISTS section TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-avatars', 'profile-avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read profile avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload own profile avatar" ON storage.objects;
CREATE POLICY "Public read profile avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-avatars');
CREATE POLICY "Authenticated upload own profile avatar" ON storage.objects
  FOR ALL USING (
    bucket_id = 'profile-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'profile-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
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

ALTER TABLE public.administrative_offices
  ADD COLUMN IF NOT EXISTS location_id TEXT,
  ADD COLUMN IF NOT EXISTS parent_office_id TEXT;

CREATE TABLE IF NOT EXISTS public.office_services (
  id TEXT PRIMARY KEY,
  office_id TEXT NOT NULL REFERENCES public.administrative_offices (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (office_id, name)
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

CREATE TABLE IF NOT EXISTS public.campus_location_links (
  location_id TEXT NOT NULL REFERENCES public.campus_locations (id) ON DELETE CASCADE,
  nearby_location_id TEXT NOT NULL REFERENCES public.campus_locations (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (location_id, nearby_location_id),
  CHECK (location_id <> nearby_location_id)
);

CREATE TABLE IF NOT EXISTS public.admin_contact_messages (
  id TEXT PRIMARY KEY,
  office_id TEXT NOT NULL REFERENCES public.administrative_offices (id) ON DELETE CASCADE,
  office_name TEXT NOT NULL,
  office_email TEXT,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  attachment_name TEXT,
  attachment_path TEXT,
  attachment_mime_type TEXT,
  attachment_size_bytes BIGINT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-contact-files', 'admin-contact-files', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "Authenticated office message attachments" ON storage.objects;
CREATE POLICY "Authenticated office message attachments" ON storage.objects
  FOR ALL USING (
    bucket_id = 'admin-contact-files'
    AND auth.role() = 'authenticated'
  )
  WITH CHECK (
    bucket_id = 'admin-contact-files'
    AND auth.role() = 'authenticated'
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
  announcement_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.class_schedules
  ADD COLUMN IF NOT EXISTS schedule_date DATE,
  ADD COLUMN IF NOT EXISTS start_time TIME,
  ADD COLUMN IF NOT EXISTS end_time TIME,
  ADD COLUMN IF NOT EXISTS program_id TEXT,
  ADD COLUMN IF NOT EXISTS location_id TEXT,
  ADD COLUMN IF NOT EXISTS reminder_minutes INTEGER NOT NULL DEFAULT 15,
  ADD COLUMN IF NOT EXISTS reminder_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS notification_id TEXT,
  ADD COLUMN IF NOT EXISTS announcement_id TEXT;

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
  college_id TEXT REFERENCES public.colleges (id) ON DELETE SET NULL,
  college TEXT NOT NULL,
  program TEXT NOT NULL,
  degree TEXT NOT NULL,
  overview TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.course_offerings
  ADD COLUMN IF NOT EXISTS college_id TEXT,
  DROP COLUMN IF EXISTS summary,
  DROP COLUMN IF EXISTS technical_electives;

CREATE TABLE IF NOT EXISTS public.prospectus_records (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES public.course_offerings (id) ON DELETE CASCADE,
  program TEXT NOT NULL,
  year_level TEXT NOT NULL,
  semester TEXT NOT NULL,
  summary TEXT,
  technical_electives JSONB NOT NULL DEFAULT '[]'::jsonb,
  subjects JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.prospectus_records
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS technical_electives JSONB NOT NULL DEFAULT '[]'::jsonb;

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
  ADD COLUMN IF NOT EXISTS event_date DATE,
  ADD COLUMN IF NOT EXISTS notification_id TEXT,
  ADD COLUMN IF NOT EXISTS office_id TEXT;

CREATE TABLE IF NOT EXISTS public.handbook_entry_offices (
  handbook_entry_id TEXT NOT NULL REFERENCES public.handbook_entries (id) ON DELETE CASCADE,
  office_id TEXT NOT NULL REFERENCES public.administrative_offices (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (handbook_entry_id, office_id)
);

CREATE TABLE IF NOT EXISTS public.notification_recipients (
  notification_id TEXT NOT NULL REFERENCES public.notifications (id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (notification_id, profile_id)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_college_id_fkey'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_college_id_fkey
      FOREIGN KEY (college_id) REFERENCES public.colleges (id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_program_id_fkey'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_program_id_fkey
      FOREIGN KEY (program_id) REFERENCES public.course_offerings (id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'administrative_offices_location_id_fkey'
  ) THEN
    ALTER TABLE public.administrative_offices
      ADD CONSTRAINT administrative_offices_location_id_fkey
      FOREIGN KEY (location_id) REFERENCES public.campus_locations (id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'administrative_offices_parent_office_id_fkey'
  ) THEN
    ALTER TABLE public.administrative_offices
      ADD CONSTRAINT administrative_offices_parent_office_id_fkey
      FOREIGN KEY (parent_office_id) REFERENCES public.administrative_offices (id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'class_schedules_program_id_fkey'
  ) THEN
    ALTER TABLE public.class_schedules
      ADD CONSTRAINT class_schedules_program_id_fkey
      FOREIGN KEY (program_id) REFERENCES public.course_offerings (id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'class_schedules_location_id_fkey'
  ) THEN
    ALTER TABLE public.class_schedules
      ADD CONSTRAINT class_schedules_location_id_fkey
      FOREIGN KEY (location_id) REFERENCES public.campus_locations (id) ON DELETE SET NULL;
  END IF;

  ALTER TABLE public.class_schedules
    DROP CONSTRAINT IF EXISTS class_schedules_notification_id_fkey;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'class_schedules_announcement_id_fkey'
  ) THEN
    ALTER TABLE public.class_schedules
      ADD CONSTRAINT class_schedules_announcement_id_fkey
      FOREIGN KEY (announcement_id) REFERENCES public.notifications (id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'course_offerings_college_id_fkey'
  ) THEN
    ALTER TABLE public.course_offerings
      ADD CONSTRAINT course_offerings_college_id_fkey
      FOREIGN KEY (college_id) REFERENCES public.colleges (id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'academic_calendar_notification_id_fkey'
  ) THEN
    ALTER TABLE public.academic_calendar
      ADD CONSTRAINT academic_calendar_notification_id_fkey
      FOREIGN KEY (notification_id) REFERENCES public.notifications (id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'academic_calendar_office_id_fkey'
  ) THEN
    ALTER TABLE public.academic_calendar
      ADD CONSTRAINT academic_calendar_office_id_fkey
      FOREIGN KEY (office_id) REFERENCES public.administrative_offices (id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (lower(username));
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles (lower(email));
CREATE INDEX IF NOT EXISTS idx_profiles_college_id ON public.profiles (college_id);
CREATE INDEX IF NOT EXISTS idx_profiles_program_id ON public.profiles (program_id);
CREATE INDEX IF NOT EXISTS idx_colleges_name ON public.colleges (lower(name));
CREATE INDEX IF NOT EXISTS idx_handbook_search ON public.handbook_entries (chapter, title);
CREATE INDEX IF NOT EXISTS idx_office_search ON public.administrative_offices (name, category);
CREATE INDEX IF NOT EXISTS idx_office_location_id ON public.administrative_offices (location_id);
CREATE INDEX IF NOT EXISTS idx_office_services_office_id ON public.office_services (office_id);
CREATE INDEX IF NOT EXISTS idx_admin_messages_office_id ON public.admin_contact_messages (office_id);
CREATE INDEX IF NOT EXISTS idx_admin_messages_sender_email ON public.admin_contact_messages (lower(sender_email));
CREATE INDEX IF NOT EXISTS idx_location_links_nearby ON public.campus_location_links (nearby_location_id);
CREATE INDEX IF NOT EXISTS idx_calendar_type ON public.academic_calendar (type);
CREATE INDEX IF NOT EXISTS idx_calendar_office_id ON public.academic_calendar (office_id);
CREATE INDEX IF NOT EXISTS idx_schedule_user ON public.class_schedules (user_id);
CREATE INDEX IF NOT EXISTS idx_schedule_program_id ON public.class_schedules (program_id);
CREATE INDEX IF NOT EXISTS idx_schedule_location_id ON public.class_schedules (location_id);
CREATE INDEX IF NOT EXISTS idx_schedule_announcement_id ON public.class_schedules (announcement_id);
CREATE INDEX IF NOT EXISTS idx_schedule_reminder_at ON public.class_schedules (reminder_at);
CREATE INDEX IF NOT EXISTS idx_course_offerings_college_id ON public.course_offerings (college_id);
CREATE INDEX IF NOT EXISTS idx_prospectus_program_id ON public.prospectus_records (program_id);

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
      WHEN lower(NEW.email) = 'admin@msumain.edu.ph' THEN 'admin'::public.user_role
      WHEN lower(NEW.email) LIKE '%@s.msumain.edu.ph' THEN 'student'::public.user_role
      WHEN lower(NEW.email) LIKE '%@msumain.edu.ph' THEN 'faculty'::public.user_role
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

DROP TRIGGER IF EXISTS touch_colleges_updated_at ON public.colleges;
CREATE TRIGGER touch_colleges_updated_at
  BEFORE UPDATE ON public.colleges
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

DROP TRIGGER IF EXISTS touch_office_services_updated_at ON public.office_services;
CREATE TRIGGER touch_office_services_updated_at
  BEFORE UPDATE ON public.office_services
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS touch_admin_messages_updated_at ON public.admin_contact_messages;
CREATE TRIGGER touch_admin_messages_updated_at
  BEFORE UPDATE ON public.admin_contact_messages
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
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handbook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrative_offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_location_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospectus_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.handbook_entry_offices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public write profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public read colleges" ON public.colleges;
DROP POLICY IF EXISTS "Public write colleges" ON public.colleges;
DROP POLICY IF EXISTS "Public read handbook entries" ON public.handbook_entries;
DROP POLICY IF EXISTS "Public write handbook entries" ON public.handbook_entries;
DROP POLICY IF EXISTS "Public read administrative offices" ON public.administrative_offices;
DROP POLICY IF EXISTS "Public write administrative offices" ON public.administrative_offices;
DROP POLICY IF EXISTS "Public read office services" ON public.office_services;
DROP POLICY IF EXISTS "Public write office services" ON public.office_services;
DROP POLICY IF EXISTS "Public read campus locations" ON public.campus_locations;
DROP POLICY IF EXISTS "Public write campus locations" ON public.campus_locations;
DROP POLICY IF EXISTS "Public read campus location links" ON public.campus_location_links;
DROP POLICY IF EXISTS "Public write campus location links" ON public.campus_location_links;
DROP POLICY IF EXISTS "Public read admin contact messages" ON public.admin_contact_messages;
DROP POLICY IF EXISTS "Public write admin contact messages" ON public.admin_contact_messages;
DROP POLICY IF EXISTS "Public read class schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Public write class schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Public read notifications" ON public.notifications;
DROP POLICY IF EXISTS "Public write notifications" ON public.notifications;
DROP POLICY IF EXISTS "Public read notification recipients" ON public.notification_recipients;
DROP POLICY IF EXISTS "Public write notification recipients" ON public.notification_recipients;
DROP POLICY IF EXISTS "Public read course offerings" ON public.course_offerings;
DROP POLICY IF EXISTS "Public write course offerings" ON public.course_offerings;
DROP POLICY IF EXISTS "Public read prospectus records" ON public.prospectus_records;
DROP POLICY IF EXISTS "Public write prospectus records" ON public.prospectus_records;
DROP POLICY IF EXISTS "Public read academic calendar" ON public.academic_calendar;
DROP POLICY IF EXISTS "Public write academic calendar" ON public.academic_calendar;
DROP POLICY IF EXISTS "Public read handbook entry offices" ON public.handbook_entry_offices;
DROP POLICY IF EXISTS "Public write handbook entry offices" ON public.handbook_entry_offices;

CREATE POLICY "Public read profiles" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Public write profiles" ON public.profiles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read colleges" ON public.colleges
  FOR SELECT USING (true);
CREATE POLICY "Public write colleges" ON public.colleges
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read handbook entries" ON public.handbook_entries
  FOR SELECT USING (true);
CREATE POLICY "Public write handbook entries" ON public.handbook_entries
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read administrative offices" ON public.administrative_offices
  FOR SELECT USING (true);
CREATE POLICY "Public write administrative offices" ON public.administrative_offices
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read office services" ON public.office_services
  FOR SELECT USING (true);
CREATE POLICY "Public write office services" ON public.office_services
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read campus locations" ON public.campus_locations
  FOR SELECT USING (true);
CREATE POLICY "Public write campus locations" ON public.campus_locations
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read campus location links" ON public.campus_location_links
  FOR SELECT USING (true);
CREATE POLICY "Public write campus location links" ON public.campus_location_links
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read admin contact messages" ON public.admin_contact_messages
  FOR SELECT USING (true);
CREATE POLICY "Public write admin contact messages" ON public.admin_contact_messages
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read class schedules" ON public.class_schedules
  FOR SELECT USING (true);
CREATE POLICY "Public write class schedules" ON public.class_schedules
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read notifications" ON public.notifications
  FOR SELECT USING (true);
CREATE POLICY "Public write notifications" ON public.notifications
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read notification recipients" ON public.notification_recipients
  FOR SELECT USING (true);
CREATE POLICY "Public write notification recipients" ON public.notification_recipients
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

CREATE POLICY "Public read handbook entry offices" ON public.handbook_entry_offices
  FOR SELECT USING (true);
CREATE POLICY "Public write handbook entry offices" ON public.handbook_entry_offices
  FOR ALL USING (true) WITH CHECK (true);

-- Backfill relationship tables from existing JSON/text fields when matching
-- records are already present. The original fields stay in place for app
-- compatibility, while these rows make the ERD relationships explicit.
UPDATE public.administrative_offices office
SET location_id = location.id
FROM public.campus_locations location
WHERE office.location_id IS NULL
  AND (
    office.id = location.id
    OR lower(office.name) = lower(location.name)
  );

INSERT INTO public.office_services (id, office_id, name)
SELECT
  office.id || '-' || md5(service.name),
  office.id,
  service.name
FROM public.administrative_offices office
CROSS JOIN LATERAL jsonb_array_elements_text(office.services) AS service(name)
ON CONFLICT (office_id, name) DO NOTHING;

INSERT INTO public.campus_location_links (location_id, nearby_location_id)
SELECT
  location.id,
  nearby_location.id
FROM public.campus_locations location
CROSS JOIN LATERAL jsonb_array_elements_text(location.nearby) AS nearby(name)
JOIN public.campus_locations nearby_location
  ON lower(nearby_location.name) = lower(nearby.name)
  OR nearby_location.id = nearby.name
WHERE location.id <> nearby_location.id
ON CONFLICT (location_id, nearby_location_id) DO NOTHING;

-- Current curriculum program records. Prospectus term rows are imported into
-- public.prospectus_records separately so rerunning the schema will not clear
-- live curriculum data.
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

UPDATE public.course_offerings course
SET college_id = college.id
FROM public.colleges college
WHERE course.college_id IS NULL
  AND lower(course.college) = lower(college.name);

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
    'Curriculum record for the College of Engineering Bachelor of Science in Electrical Engineering prospectus.',
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
