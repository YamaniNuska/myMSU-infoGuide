# myMSU-InfoGuide

An Expo Router app for the capstone project "A Comprehensive Digital Handbook
and Interactive Mobile Student Guide for MSU Main Campus."

## What Is Included

- Responsive dashboard for mobile and web layouts
- Digital student handbook with search
- Administrative office directory
- Campus map with route guidance
- Class schedule module with per-user schedule rows and local alarms
- Course/program offerings and prospectus preview
- Academic calendar, announcements, and reminders
- AI chatbot with local knowledge-base fallback
- Supabase Auth, public profiles, and Supabase data tables
- Runtime seed data in `src/data/mymsuDatabase.ts`

## Run Locally

```bash
npm install
cp .env.example .env.local
npm run web
```

Fill these Supabase values in `.env.local` before signing in or syncing shared
content:

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
EXPO_PUBLIC_ORS_API_KEY=
```

`EXPO_PUBLIC_ORS_API_KEY` is optional. When it is present, the campus map asks
OpenRouteService for a walking route and falls back to the bundled campus route
graph if ORS is unavailable.

The current local web server uses:

```text
http://localhost:8081
```

## Supabase Setup

1. Create a Supabase project.
2. Open the Supabase SQL editor and run `database/schema.sql`.
3. Add the project URL and publishable key to `.env.local`.
4. Start the app. On first sync, the app seeds bundled handbook, offices, map,
   schedule samples, announcements, courses, prospectus, and calendar records.
5. App sign-up accepts `@s.msumain.edu.ph` accounts and assigns student access
   automatically. Faculty and student accounts share the same app access.
6. Create at least one account in Supabase Auth, then promote it to admin:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@msumain.edu.ph';
```

The prototype policies in `database/schema.sql` are intentionally permissive so
the Expo app can seed and edit data with the publishable key. Tighten RLS
policies before using real student data.

Class schedule reminders use `expo-notifications`. The schedule row is stored
in Supabase; the alarm itself is a local device notification, so test reliable
alarms in an Android/iOS development or production build rather than web
preview.

## Verify

```bash
npm run typecheck
npm run lint
```

## Technology Stack

- Expo SDK 54, React Native, React Native Web, and Expo Router
- Supabase Auth and Supabase Postgres
- Shared app data store in `src/data/appStore.ts`
- Seed/offline data in `src/data/mymsuDatabase.ts`
- Map assets in `assets/campusMap`
- Campus route graph in `src/data/mymsuDatabase.ts`

## Web Build

```bash
npx expo export -p web --output-dir web-deploy
```

Upload `web-deploy` to a static host such as Netlify, Vercel, Firebase Hosting,
or a school web server.

## Render Deploy

The simplest Render option is a Static Site:

Use these settings:

```text
Build Command: npm run build
Publish Directory: dist
```

Only run the build command in a terminal:

```bash
npm run build
```

`Publish Directory: dist` is not a terminal command. Enter `dist` in Render's
Publish Directory field.

The Publish Directory is the relative path of the directory containing the built
assets that Render should publish. For this Expo web build, that directory is
`dist`.

Leave Start Command empty. Static Sites do not use one.

Add the `EXPO_PUBLIC_*` environment variables in Render before deploying. The
included `render.yaml` also configures Render to publish `dist` and rewrite
client-side routes to `/index.html`.

If you deploy as a Render Web Service instead, use these settings:

```text
Build Command: npm run build
Start Command: npm run serve
```

Do not leave the Web Service Start Command empty. Render may otherwise run
`node .`, which reads `main: "expo-router/entry"` from `package.json` and fails
because Expo Router's entrypoint is not a production Node server. The
`npm run serve` command starts `server.cjs`, binds to Render's `PORT`, and serves
the exported `dist` folder.

## Mobile Build

```bash
npm run start
npx eas-cli build --platform android --profile preview
npx eas-cli build --platform android --profile production
npx eas-cli build --platform ios --profile production
```

Preview Android builds generate an APK for testing. Production builds generate
store-ready artifacts, but they require Expo account login and signing
credentials.

## Campus Location Images

Put location detail images in `src/features/campusMap/locationImages/`, then
register each file in `src/features/campusMap/locationImages.ts` using the
matching location `id` from `src/data/mymsuDatabase.ts`.
