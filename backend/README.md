# myMSU InfoGuide Backend

This backend exposes the app collections through a small REST API backed by
SQLite. It uses only Node.js built-in modules.

## Run

```sh
node backend/server.mjs
```

Then set the Expo app environment variable:

```sh
EXPO_PUBLIC_API_BASE_URL=http://localhost:8787
```

Use your computer's LAN IP instead of `localhost` when testing on a physical
phone.

## Auth rules

- `@gmail.com` signups become `visitor` accounts.
- MSU email signups can be `student`, `faculty`, or `employee`.
- Admin signup is disabled. The seeded fixed admin account is `admin` /
  `admin123`, and only one admin row is allowed.
- Sign-in, sign-up, and admin-managed student accounts are stored in SQLite.
  No external auth provider setup is required.

The first app launch against an empty or partially seeded backend fills missing
SQLite collections from `src/data/mymsuDatabase.ts`.
