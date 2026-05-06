# myMSU-InfoGuide

An Expo Router app for the capstone project "A Comprehensive Digital Handbook
and Interactive Mobile Student Guide for MSU Main Campus."

## What Is Included

- Responsive dashboard for mobile and web/PC layouts
- Digital student handbook with search
- Administrative office directory
- Campus map route
- Class schedule module
- Course/program offerings
- Prospectus preview
- Academic calendar
- Notifications and reminders
- AI chatbot with local database fallback
- SQLite-compatible schema in `database/schema.sql`
- Runtime seed data in `src/data/mymsuDatabase.ts`

## Run Locally

```bash
npm install
npm run web
```

The current local web server uses:

```text
http://localhost:8081
```

## Verify

```bash
npx tsc --noEmit
npm run lint
```

## Web Build

The deployable static web export was generated with:

```bash
npx expo export -p web --output-dir web-deploy
```

Upload `web-deploy` to a static host such as Netlify, Vercel, Firebase Hosting,
or a school web server. For a fresh export, run the same command again.

## Database

Use `database/schema.sql` for SQLite. Use the same table names as Firebase
collection names if syncing the app to Firebase later.
