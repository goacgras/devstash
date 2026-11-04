# Coding Standards

## TypeScript

- Strict mode enabled
- No `any` types - use proper typing or `unknown`
- Define interfaces for all props, API responses, and data models
- Use type inference where obvious, explicit types where helpful

## React

- Functional components only (no class components)
- Use hooks for state and side effects
- Keep components focused - one job per component
- Extract reusable logic into custom hooks

## TanStack Start

- File-based routing with TanStack Router; routes live in `src/routes/`
- Routes are SSR by default; keep route components thin and move UI into `src/components/`
- Use **route loaders** to prefetch data into the TanStack Query cache (`queryClient.ensureQueryData`) so pages render with data on first paint
- Use **server functions** (`createServerFn`) for database access, form submissions, and mutations
- Use **server routes** (`server.handlers` on a file route) when you need:
  - Webhooks (Stripe, GitHub, etc.)
  - File uploads with progress tracking
  - Streaming responses (e.g. AI output)
  - Long-running operations
  - Specific HTTP status codes or headers
  - Endpoints for future mobile/CLI clients
  - Third-party integrations
- Keep server-only code (Prisma, secrets, session access) in `*.server.ts` files and server functions in `*.functions.ts` files; never import server-only modules from components
- Only variables prefixed with `VITE_` are exposed to the client; never prefix secrets
- Dynamic routes for item/collection pages (`$type`, `$id`)
- Use search params for UI state that should be linkable (e.g. `?item=<id>` for the item drawer), validated with Zod

## Tailwind CSS v4

**CRITICAL**: We are using Tailwind CSS v4, which uses CSS-based configuration.

- **DO NOT** create `tailwind.config.ts` or `tailwind.config.js` files (those are for v3)
- All theme configuration must be done in CSS using the `@theme` directive in `src/styles/app.css`
- Use CSS custom properties for colors, spacing, etc.
- No JavaScript-based config allowed

Example v4 configuration:

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(50% 0.2 250);
}
```

## File Organization

- Components: `src/components/[feature]/ComponentName.tsx`
- Routes: `src/routes/[route].tsx` (file-based; layouts via `_layout` files, dynamic segments via `$param`)
- Server functions: `src/server/[feature].functions.ts`
- Server-only helpers: `src/server/[feature].server.ts`
- Query options and keys: `src/queries/[feature].ts`
- Types: `src/types/[feature].ts`
- Lib/Utils: `src/lib/[utility].ts`

## Naming

- Components: PascalCase (`ItemCard.tsx`)
- Files: Match component name or kebab-case
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/Interfaces: PascalCase (no prefix)
- Query option factories: `[thing]QueryOptions` (e.g. `itemsQueryOptions`)
- Server functions: verb-first camelCase (`createItem`, `getCollections`)

## Styling

- Tailwind CSS for all styling
- Use shadcn/ui components where applicable
- No inline styles
- Dark mode first, light mode as option

## Database

- Use Prisma ORM for all database operations
- Always use `prisma migrate dev` for schema changes (not `db push`)
- Run `prisma migrate status` before committing to verify migrations are in sync
- Production deployments must run `prisma migrate deploy` before the app starts

## Data Fetching

- Use **TanStack Query** for all data fetching and caching
- Define query options in factory functions in `src/queries/` so loaders and components share the same keys and `queryFn`
- Use a consistent query key layout: `['items', { type }]`, `['item', id]`, `['collections']`, `['collection', id]`, `['search', term]`
- Route loaders prefetch with `ensureQueryData`; components read with `useSuspenseQuery` (or `useQuery` when a loading state is needed)
- Reads and writes call server functions as the `queryFn` / `mutationFn`
- Use `useMutation` for all writes and invalidate the affected query keys in `onSuccess`
- On-demand, cost-sensitive actions (e.g. AI calls) must use `useMutation`, never `useQuery`
- Validate all inputs with Zod using `.inputValidator()` on server functions, since they are public HTTP endpoints

## Error Handling

- Use try/catch in server functions
- Return `{ success, data, error }` pattern from server functions
- Display user-friendly error messages via toast
- Use route-level `errorComponent` and `notFoundComponent` for loader and routing failures

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions under 50 lines when possible
