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
- If `HYGRAPH_AUTH_ENDPOINT` is set, sign-in and sign-up use Hygraph first.
  Keep `HYGRAPH_AUTH_TOKEN` on the backend only. The default Hygraph auth model
  is expected to expose `name`, `username`, `email`, `role`, and `passwordHash`.

The first app launch against an empty or partially seeded backend fills missing
SQLite collections from `src/data/mymsuDatabase.ts`.
