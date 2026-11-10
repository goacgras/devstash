# Current Feature

## Status

Completed

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
- Completed Dashboard Items on branch `feature/dashboard-items` (not yet committed or merged): the dashboard's pinned and recent items and the item stats come from Neon via Prisma. Queries live in `src/lib/db/items.ts` (demo-user lookup shared via `src/lib/db/demo-user.ts`), exposed through the `getItems` server function in `src/server/items.functions.ts`, with `['items']` query options in `src/queries/items.ts`. The `/dashboard` loader prefetches items and collections; `DashboardItems` uses `useSuspenseQuery` behind an `ItemsSkeleton`. Item cards take icon and border color from the item type, and the Pinned section is hidden when empty. Build passes; not checked in a browser or SSR-verified against the dev database. The sidebar was still on mock data at this point; Stats & Sidebar replaced that.
- Completed Stats & Sidebar on branch `feature/stats-sidebar` (not yet committed or merged): the sidebar's item types and their counts come from Neon via Prisma (`getSidebarItemTypes` in `src/lib/db/items.ts`, exposed through `getItemTypes` in `src/server/items.functions.ts`, with `['item-types']` query options in `src/queries/items.ts`, prefetched by the `/dashboard` loader). The sidebar's favorite and recent collections come from the existing collections query. Recent collections show a circle in the most-used type's color. A "View all collections" link points to a placeholder `/collections` route. `src/lib/mock-data.ts` now holds only the mock user, used by the sidebar user area. Dashboard stats were already database-backed. Type check is clean apart from a pre-existing `/about` link in `Header.tsx`; build passes; not checked in a browser or SSR-verified against the dev database.
- Completed Items and Collections design update with hover animation on branch `feature/hover-animation` (not yet committed or merged): dashboard item and recent collection cards show a 4px colored left border from the item type (collections use their most-used type) instead of a full-border color. A new `HoverCard` component (`src/components/dashboard/HoverCard.tsx`) wraps them in a Motion `motion.li` that lifts 3px with a soft shadow on hover, using a spring transition. Uses the `motion` package (`motion/react`) instead of `framer-motion`. Build passes; not checked in a browser.
- Completed Add Pro Badge to Sidebar on branch `feature/add-pro-badge-sidebar` (merged to `main`): the dashboard sidebar shows a subtle uppercase `PRO` badge, built with the new ShadCN `Badge` component (`src/components/ui/badge.tsx`), next to the Files and Images types. Build passes; checked in the browser.
