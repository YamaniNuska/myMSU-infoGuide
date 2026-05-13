# myMSU-InfoGuide Supabase Database

`schema.sql` is the Supabase/Postgres schema used by the app.

Run `database/schema.sql` in the Supabase SQL editor before opening the app.
After the tables exist, the app will seed its built-in content from
`src/data/mymsuDatabase.ts` into Supabase when it sees an empty database.

The app uses:

- Supabase Auth for sign in and sign up
- `profiles` for public user profile data
- Supabase tables for handbook, offices, campus map, class schedules,
  announcements, course offerings, prospectus records, and academic calendar
- Structured class schedule columns for `schedule_date`, `start_time`,
  `end_time`, `reminder_minutes`, `reminder_at`, and `notification_id`

The policies in `schema.sql` are intentionally permissive for the capstone
prototype so the Expo app can seed and edit data with the publishable key.
Tighten these policies before using the project with real student data.

Run the latest schema again after pulling schedule/alarm changes. It uses
`ADD COLUMN IF NOT EXISTS`, so it can upgrade an existing Supabase project
without dropping current data.
