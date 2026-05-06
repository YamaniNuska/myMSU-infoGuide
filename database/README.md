# myMSU-InfoGuide Database

This folder contains the SQLite-compatible schema for the app data model.

The runtime seed data lives in `src/data/mymsuDatabase.ts` so the Expo app can
work without a native database package during prototype testing. The same
entities map cleanly to Firebase collections or SQLite tables:

- `users`
- `handbook_entries`
- `administrative_offices`
- `campus_locations`
- `class_schedules`
- `notifications`
- `course_offerings`
- `prospectus_records`
- `academic_calendar`

Use `schema.sql` when moving the prototype data into SQLite. For Firebase, use
the same table names as collection names and keep array fields as native arrays
instead of JSON strings.
