# Current Feature

## Status

## Goals

<!-- Goals and requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest. List completed features only. -->

- Initial setup: added `origin` remote (`git@github.com:goacgras/devstash.git`) and pushed `main` (commits `b698e13`, `e6c4e06`) with upstream tracking.
- Completed Dashboard UI Phase 1 on branch `feature/dashboard-phase-1`: ShadCN button and input, `/dashboard` route, dark mode by default, top bar with display-only search and New Item button, Sidebar and Main placeholders. Build passes; not yet committed or merged.
- Completed Dashboard UI Phase 2 on branch `feature/dashboard-phase-2`: collapsible sidebar (desktop) and drawer (mobile) toggled from the top bar, type links to `/items/$type` with counts, favorite and recent collections, user area at the bottom, and a placeholder `/items/$type` route. Build passes; not yet committed, merged, or checked in a browser.
- Completed Dashboard UI Phase 3 on branch `feature/dashboard-phase-3`: main area with 4 stats cards (items, collections, favorite items, favorite collections), recent collections, pinned items, and 10 recent items, all from `src/lib/mock-data.ts`. Shared `ItemTypeIcon` extracted from the sidebar. Build passes; not checked in a browser.
- Completed Prisma 7 + Neon PostgreSQL setup on branch `feature/prisma-neon`, merged to `main`: Prisma 7 `prisma-client` generator (output `src/generated/prisma`) with `@prisma/adapter-pg`; full schema from the project overview with NextAuth models, indexes and cascade deletes; `init_schema` migration applied to the Neon dev branch; system item types seeded via `npm run db:seed`; `npm run db:test` connection check. Build passes; not checked in a browser.
- Completed seed data on branch `feature/seed-data` (not yet committed or merged): `prisma/seed.ts` creates the demo user `demo@devstash.io` (bcrypt, 12 rounds), the 7 system item types, and 5 collections with 18 items (snippets, prompts, commands and links, with real URLs). Re-running clears and recreates the demo user's collections and items. Added `bcryptjs`; `db:*` scripts switched to `dotenv-cli` to fix a binary conflict. Seeded and verified against the dev database.
- Completed Dashboard Collections on branch `feature/dashboard-collections` (not yet committed or merged): the dashboard's recent collections and collection stats come from Neon via Prisma. Queries live in `src/lib/db/collections.ts`, exposed through the `getCollections` server function in `src/server/collections.functions.ts`, with `['collections']` query options in `src/queries/collections.ts`. The `/dashboard` loader prefetches with `ensureQueryData`; the main area uses `useSuspenseQuery` behind a skeleton fallback. Cards get their border color from the most-used type and show icons for all types. Demo user is hardcoded until auth lands. TanStack Query devtools are mounted in dev via `__root.tsx`. Build passes; verified SSR output against the dev database; not checked in a browser.
