# myMSU-InfoGuide Database

This folder contains the SQLite schema for the app data model.

The runtime seed data lives in `src/data/mymsuDatabase.ts` so the Expo app can
work offline during prototype testing. When `EXPO_PUBLIC_API_BASE_URL` points to
the backend in `backend/server.mjs`, the app syncs these same entities to SQLite:

- `users`
- `handbook_entries`
- `administrative_offices`
- `campus_locations`
- `class_schedules`
- `notifications`
- `sessions`
- `course_offerings`
- `prospectus_records`
- `academic_calendar`

The backend creates `mymsu.sqlite` in this folder by default. Array fields are
stored as JSON text in SQLite and returned to the app as arrays.
