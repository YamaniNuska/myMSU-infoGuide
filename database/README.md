# myMSU-InfoGuide Supabase Database

`schema.sql` is the Supabase/Postgres schema used by the app.

Run `database/schema.sql` in the Supabase SQL editor before opening the app.
After the tables exist, the app will seed its built-in content from
`src/data/mymsuDatabase.ts` into Supabase when it sees an empty database.

To load the official Academic Calendar, School Year 2025-2026 from the scanned
registrar table, run `database/seed_academic_calendar_2025_2026.sql` in the
Supabase SQL editor after `schema.sql`. The Academic Calendar screen reads those
rows from `public.academic_calendar`; the official table is not hardcoded in the
React screen.

To load the MSU Main Campus course directory, run
`database/seed_msu_prospectus_courses.sql` in the Supabase SQL editor after
`schema.sql`. The Course Offerings screen reads those rows from
`public.course_offerings`; the imported course list is not hardcoded in the UI.

To fill the Prospectus screen with imported semester-by-semester subjects, run
`database/seed_msu_prospectus_records.sql` after the course seed. Those rows are
stored in `public.prospectus_records`, so the prospectus content is database
data instead of a directed download link.

The app uses:

- Supabase Auth for sign in and sign up
- `profiles` for public user profile data
- `colleges` as the parent lookup for degree programs and user academic data
- Supabase tables for handbook, offices, campus map, class schedules,
  announcements, course offerings, prospectus records, and academic calendar
- Join/relationship tables for handbook-office links, nearby campus locations,
  per-office services, and per-user notification recipients
- `admin_contact_messages` for in-app messages sent to administrative offices
- Structured class schedule columns for `schedule_date`, `start_time`,
  `end_time`, `program_id`, `location_id`, `reminder_minutes`, `reminder_at`,
  local reminder `notification_id`, and optional announcement link
  `announcement_id`

The policies in `schema.sql` are intentionally permissive for the capstone
prototype so the Expo app can seed and edit data with the publishable key.
Tighten these policies before using the project with real student data.

Run the latest schema again after pulling schedule/alarm changes. It uses
`ADD COLUMN IF NOT EXISTS`, so it can upgrade an existing Supabase project
without dropping current data.
