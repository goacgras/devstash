# Dashboard Items Spec

## Overview

Replace the dummy item data displayed in the main area of the dashboard (right side), with actual data from the database. This includes both pinned and recent items. It should look how it does now, but instead of using data from @src/lib/mock-data.ts, it should be from our Neon database using Prisma.

If there are no pinned items, nothing should display there.

## Requirements

- Create src/lib/db/collections.ts with Prisma query functions (server-only, no UI imports)
- Expose those queries through TanStack Start server functions (`createServerFn`) so Prisma never reaches the browser
- Fetch collections with TanStack Query, not server components (the app has none):
  - Route loader for `/` prefetches with `context.queryClient.ensureQueryData(...)` so the dashboard SSRs with data
  - Main area reads the data with `useSuspenseQuery` (or `useQuery`) using the query key `['collections']`
  - The `queryFn` calls the server function; no `fetch` in `useEffect`
- Show loading skeletons while collections load (per the UI micro-interactions)
- item card icon/border derived from the item type
- Display item type tags and anything else currently there. You can also reference the screenshot if needed
- Update collection stats display

## References

Check the `@context/screenshots/dashboard-ui-main.png` screenshot if needed, but layout and design is already there.
Check the `@context/features/.context/features/dashboard-collections-spec.md` if needed on how the collections are being fetch
