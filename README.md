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

## Technology Stack

- Language: TypeScript, TSX, JavaScript, JSON, SQL
- Mobile/web framework: Expo SDK 54 with React Native
- Web runtime: React Native Web
- Routing/navigation: Expo Router, React Navigation bottom tabs
- UI libraries: React, React Native components, Expo Vector Icons
- Native Expo modules: Expo Location, Expo Splash Screen, Expo Status Bar, Expo Video, Expo Linking, Expo Linear Gradient
- State/data layer: local React state plus the app store in `src/data/appStore.ts`
- Runtime data source: `src/data/mymsuDatabase.ts`
- Database reference: SQLite-compatible schema in `database/schema.sql`
- Map assets: shared assets in `assets/campusMap`
- Map routing logic: road graph data in `src/data/mymsuDatabase.ts`, routing helper in `src/features/campusMap/routing.ts`
- Build tools: npm, Expo CLI, Metro Bundler, TypeScript, Expo ESLint
- Mobile deployment tool: EAS Build using `eas.json`
- Web deployment output: static export in `web-deploy`

## Web Build

The deployable static web export was generated with:

```bash
npx expo export -p web --output-dir web-deploy
```

Upload `web-deploy` to a static host such as Netlify, Vercel, Firebase Hosting,
or a school web server. For a fresh export, run the same command again.

## Mobile Build

This project is configured for Expo Go SDK 54 and EAS mobile builds.

```bash
npm run start
npx eas-cli build --platform android --profile preview
npx eas-cli build --platform android --profile production
npx eas-cli build --platform ios --profile production
```

Preview Android builds generate an APK for testing. Production builds generate
store-ready artifacts, but they require Expo account login and Android/iOS
signing credentials.

## Database

The app has one runtime data source: `src/data/mymsuDatabase.ts`.
`database/schema.sql` is only the SQLite reference schema for a future migration.
Use the same table names as Firebase collection names if syncing the app later.

## Campus Location Images

Put location detail images in `src/features/campusMap/locationImages/`, then
register each file in `src/features/campusMap/locationImages.ts` using the
matching location `id` from `src/data/mymsuDatabase.ts`.
