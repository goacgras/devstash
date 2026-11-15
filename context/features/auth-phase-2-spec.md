# Auth Phase 2: Credentials Provider (Email/Password)

## Overview

Add a Credentials provider for email/password sign-in alongside the existing GitHub OAuth provider, plus a registration endpoint that creates email/password users.

Builds on Auth Phase 1 (`context/features/auth-phase-1-spec.md`): Auth.js (`@auth/core`) with the Prisma adapter and JWT sessions, mounted at `/api/auth/*`.

## Requirements

- Use `bcryptjs` for hashing (already installed; the seed script uses it)
- `User.password` already exists in `prisma/schema.prisma` and in the `init_schema` migration, so **no new migration is needed**
- Add the Credentials provider to `src/server/auth.server.ts` with a real `authorize` function (bcrypt validation)
- Create the registration endpoint as a server route at `src/routes/api/auth/register.ts`
- Validate registration input with Zod (coding standard). Zod is not installed yet, so add it as a dependency

## Registration API Route

`POST /api/auth/register` (`src/routes/api/auth/register.ts`)

Implemented as a file route with `server.handlers.POST`, the same pattern as `src/routes/api/auth/$.ts`. A server route is used rather than a server function because this is a plain HTTP endpoint with specific status codes, which the TanStack Start conventions call for.

- Accept JSON body: `name`, `email`, `password`, `confirmPassword`
- Validate with Zod: email format, password minimum length (8), `password === confirmPassword`
- Check if a user with that email already exists
- Hash password with `bcryptjs` (12 rounds, matching the seed script)
- Create user in the database via Prisma (`prisma.user.create`)
- Return JSON:
  - `201` with `{ success: true, data: { id, email, name } }` on success (password never returned)
  - `400` with `{ success: false, error }` for validation errors or mismatched passwords
  - `409` with `{ success: false, error }` if the email is already registered
  - `500` with `{ success: false, error }` for unexpected failures (try/catch)
- Route is a static segment, so it takes precedence over the `/api/auth/$` Auth.js catch-all

Registration does not sign the user in. After registering, the user signs in at `/api/auth/signin`.

## Credentials Provider in Auth.js

There is no split config in this project (TanStack Start, not Next.js), so no `auth.config.ts` / `auth.ts` pair. The Credentials provider is added directly to the single config in `src/server/auth.server.ts`.

- Add `Credentials` (from `@auth/core/providers/credentials`) to `providers`, alongside GitHub
- `credentials`: `email` and `password` fields
- `authorize`:
  - Look up the user by email (`prisma.user.findUnique`)
  - Return `null` if the user is missing or has no `password` (GitHub-only accounts)
  - Compare with `bcrypt.compare`; return `null` on mismatch
  - On success, return `{ id, name, email, image }`
- Keep `session: { strategy: "jwt" }`. Auth.js requires JWT sessions for Credentials, and Phase 1 already uses them
- The existing `session` callback already maps `token.sub` to `session.user.id`, so `getCurrentUser` works for password users with no change

## Notes

- The built-in sign-in page at `/api/auth/signin` shows the Credentials form automatically. No custom `pages.signIn` (same as Phase 1)
- `/dashboard` keeps its `beforeLoad` guard. A password user who signs in is redirected back to `callbackUrl` (`/dashboard`)
- Known edge case (not handled in this phase): if a user registers with an email and later signs in with GitHub using the same email, Auth.js blocks the sign-in by default (`OAuthAccountNotLinked`). Account linking is out of scope
- Env vars: no new env vars. Uses the existing `AUTH_SECRET`
- Do not expose the hash: the `authorize` return value and registration response must never include `password`

## Testing

1. Register via curl (expect `201`):

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123","confirmPassword":"password123"}'
```

2. Register again with the same email (expect `409`)
3. Register with mismatched `confirmPassword` (expect `400`)
4. Go to `/api/auth/signin` (or visit `/dashboard` and get redirected there)
5. Sign in with email/password
6. Verify redirect to `/dashboard`
7. Verify `/api/auth/session` returns the user with `id` after sign-in
8. Verify GitHub OAuth still works

Dev server port is `4000` (see `package.json`), not `3000`.

## References

- Credentials provider (Auth.js): https://authjs.dev/getting-started/authentication/credentials
- Existing implementation: `src/server/auth.server.ts`, `src/routes/api/auth/$.ts`, `src/server/auth.functions.ts`
