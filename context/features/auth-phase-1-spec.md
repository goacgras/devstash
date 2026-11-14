# Auth Setup - Auth.js + GitHub Provider (TanStack Start)

## Overview

Set up Auth.js (NextAuth v5 core, `@auth/core`) with the Prisma adapter and GitHub OAuth in the TanStack Start app. Auth.js has no first-party TanStack Start integration, so the handler is mounted as a TanStack server route and sessions are read in server functions. Use Auth.js's built-in sign-in page for testing.

## Requirements

- Install `@auth/core` and `@auth/prisma-adapter` (do not install `next-auth`, which is built around Next.js)
- Add the GitHub OAuth provider
- Mount the Auth.js handler as a TanStack server route under `/api/auth/*`
- Provide a server function that returns the current user from the session
- Protect `/dashboard` routes with a `beforeLoad` guard that redirects unauthenticated users to sign-in
- Add a `user.id` to the session type

## Files to Create

1. `src/server/auth.server.ts` - Server-only Auth.js config: GitHub provider, Prisma adapter, JWT session strategy, `AUTH_SECRET` read from env
2. `src/routes/api/auth/$.ts` - Server route; `server.handlers` for `GET` and `POST` call `Auth(request, authConfig)`
3. `src/server/auth.functions.ts` - `getCurrentUser` server function (`createServerFn`) that reads the session and returns the user or `null`
4. `src/routes/dashboard.tsx` (or a pathless `_authed` layout if more protected routes are added) - `beforeLoad` calls `getCurrentUser` and throws `redirect` to `/api/auth/signin` when there is no user
5. `src/types/auth.d.ts` - Augment the Auth.js session/user types with `id`

## Key Gotchas

Use Context7 (`/websites/authjs_dev` and `/websites/tanstack_start_framework_react`) to verify the newest config and conventions before implementing.

- Use `@auth/core` (`Auth(request, config)`) as the framework-agnostic entry point; do not import from `next-auth` or `next-auth/react`
- Use `session: { strategy: 'jwt' }` together with the Prisma adapter. The adapter defaults the session strategy to `database`, which is not needed here
- Do not set a custom sign-in page; use Auth.js's built-in sign-in page at `/api/auth/signin`
- There is no Next.js-style `proxy.ts` or edge middleware in this project. Route protection lives in the route's `beforeLoad`, and the split auth config pattern is not needed because the server routes run on Node with the `pg` driver adapter
- Route `beforeLoad` is UX, not the security boundary. Any server function that reads or mutates private data must call `getCurrentUser` (or equivalent) and reject a missing user itself
- Validate server function inputs with Zod via `.inputValidator()`, per the coding standards
- Keep Prisma and secret access in `*.server.ts` files; never import them from components or routes
- Set the auth response cache policy to `Cache-Control: private, no-store` on session-dependent routes, per the TanStack Start auth guide
- Reading the session outside the Next.js helper: call `Auth(new Request(new URL('/api/auth/session', url), { headers: request.headers }), authConfig)` and parse the JSON body. Verify this against the current Auth.js docs during implementation

## Environment Variables

```
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

Only server-side code reads these. Do not prefix them with `VITE_`.

## Testing

1. Go to `/dashboard` - should redirect to `/api/auth/signin` with a `callbackUrl` back to `/dashboard`
2. Click "Sign in with GitHub" on the built-in sign-in page
3. Verify redirect back to `/dashboard` after auth, and that `getCurrentUser` returns the demo/GitHub user

## References

- Auth.js core API: https://authjs.dev/reference/core
- Auth.js Prisma adapter: https://authjs.dev/getting-started/adapters/prisma
- Auth.js edge/split config (for reference only, not needed here): https://authjs.dev/guides/edge-compatibility
- TanStack Start authentication guide: https://tanstack.com/start/latest/docs/framework/react/guide/authentication
- TanStack Start server routes: https://tanstack.com/start/latest/docs/framework/react/guide/server-routes
