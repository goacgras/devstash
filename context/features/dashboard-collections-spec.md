# Dashboard Collections Spec

## Overview

Replace the dummy collection data displayed in the main area of the dashboard (right side), with actual data from the database. It should look how it does now with the 6 cards of recent collections, but instead of using data from @src/lib/mock-data.ts, it should be from our Neon database using Prisma.

Do not add the items underneath yet. We will do that later.

## Requirements

- Create src/lib/db/collections.ts with Prisma query functions (server-only, no UI imports)
- Expose those queries through TanStack Start server functions (`createServerFn`) so Prisma never reaches the browser
- Fetch collections with TanStack Query, not server components (the app has none):
  - Route loader for `/` prefetches with `context.queryClient.ensureQueryData(...)` so the dashboard SSRs with data
  - Main area reads the data with `useSuspenseQuery` (or `useQuery`) using the query key `['collections']`
  - The `queryFn` calls the server function; no `fetch` in `useEffect`
- Show loading skeletons while collections load (per the UI micro-interactions)
- Collection card border color derived from most-used content type in that collection
- Show small icons of all types in that collection
- Keep the current design. You can also reference the screenshot
- Update collection stats display

## References

Check the `@context/screenshots/dashboard-ui-main.png` screenshot if needed, but layout and design is already there.
