# Current Feature: Auth Phase 2 (Credentials Provider)

## Status

In Progress

## Goals

- Add the Credentials provider (email/password) to `src/server/auth.server.ts`, alongside GitHub, with a bcrypt-based `authorize`
- Keep `session: { strategy: 'jwt' }` (required for Credentials)
- Create `POST /api/auth/register` as a server route at `src/routes/api/auth/register.ts`
- Accept `name`, `email`, `password`, `confirmPassword`; validate with Zod (install `zod`)
- Hash passwords with `bcryptjs` (12 rounds) and create the user via Prisma
- Return `201` on success, `400` for validation or mismatched passwords, `409` if the email exists, `500` on unexpected errors; never return the password hash
- Test: register (201), duplicate email (409), mismatched passwords (400), sign in with email/password at `/api/auth/signin` and land on `/dashboard`, `/api/auth/session` returns the user with `id`, GitHub OAuth still works

## Notes

- Spec: `context/features/auth-phase-2-spec.md`
- Files: `src/server/auth.server.ts` (Credentials provider), `src/routes/api/auth/register.ts` (new registration route), `src/routes/api/auth/$.ts` and `src/server/auth.functions.ts` unchanged
- No split config (`auth.config.ts` / `auth.ts`): this is TanStack Start, not Next.js
- No new migration: `User.password` already exists in `prisma/schema.prisma` and the `init_schema` migration
- No new env vars; uses the existing `AUTH_SECRET`
- Registration does not sign the user in; they sign in at `/api/auth/signin` afterward
- Known edge case, out of scope: a user who registered with email and later signs in with GitHub using the same email hits Auth.js `OAuthAccountNotLinked`
- Dev server runs on port `4000`
- Implemented on branch `feature/auth-phase-2`: Zod added (`^4`), Credentials provider in `src/server/auth.server.ts`, registration route `src/routes/api/auth/register.ts` (`name` required, trimmed, email lowercased)
- Verified: `tsc --noEmit` clean, `npm run build` passes, `biome check` clean on changed files. Dev server via curl: register returns 201 / 409 (duplicate) / 400 (mismatch, short password, bad JSON); `/api/auth/providers` lists credentials; wrong password redirects with `CredentialsSignin`; correct password redirects to `/dashboard`; `/api/auth/session` returns the user with `id`; `/dashboard` returns 200 with the session cookie
- Test data: user `test@test.com` (password `password123`) was created in the Neon dev branch during testing
- Not yet verified: GitHub sign-in in a browser after this change; sign-in form in the browser
- Phase 1 items still unverified in a browser (full GitHub sign-in, `getCurrentUser` with a real session) are not covered by this file; see git history of this file for the Phase 1 notes

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
- Completed Code Scanner Quick Wins on branch `feature/code-scanner-quick-wins` (merged to `main`): fixed the `/about` link so `tsc` is clean, formatted mismatched files, and updated the Biome config (schema version, `src/generated` excluded). Renamed the duplicate recent-collection limit constants, added a shared `unwrapResult` helper for query functions, moved `DashboardError` to its own file, and split `SidebarNav` and `SidebarNavSkeleton` out of `Sidebar.tsx`. Derived `ItemRow` from `Prisma.ItemGetPayload`. Added `@@index([userId, updatedAt])` to `Item` and `Collection` via migration `20261113055234_add_updated_at_indexes`, applied to the dev database; prod still needs `prisma migrate deploy`. Build passes; not checked in a browser. Deferred: server-only file moves, grouped type count, pinned item cap, dead header/footer removal, and formatting of the remaining files.
