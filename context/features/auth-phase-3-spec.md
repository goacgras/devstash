# Auth Phase 3: Custom Sign In, Register & Sign Out UI (TanStack Start)

## Overview

Replace the built-in Auth.js pages (`/api/auth/signin`) with custom TanStack Router pages for sign-in and registration, and replace the mock user in the sidebar with the real session user (avatar, name, email, sign-out).

Builds on:

- Auth Phase 1 (`context/features/auth-phase-1-spec.md`): Auth.js (`@auth/core`) with the Prisma adapter, GitHub OAuth, JWT sessions, handler mounted at `/api/auth/*`, `getCurrentUser` server function
- Auth Phase 2 (`context/features/auth-phase-2-spec.md`): Credentials provider and `POST /api/auth/register`

## Requirements

### Sign In Page (`/sign-in`)

- Email and password fields
- "Sign in with GitHub" button
- Link to `/register`
- Form validation and error display (invalid credentials, validation errors)
- Reads `redirect` search param (validated with Zod); on success go there, default `/dashboard`
- Already signed in: `beforeLoad` redirects to `/dashboard`

### Register Page (`/register`)

- Name, email, password, confirm password fields
- Client-side validation with the same Zod schema as the register endpoint (email format, password min 8, passwords match)
- `POST /api/auth/register` (existing endpoint, no changes); show `400`/`409` errors from the response `error` field
- Redirect to `/sign-in` on success (registration does not sign the user in)
- Link back to `/sign-in`
- Already signed in: `beforeLoad` redirects to `/dashboard`

### Bottom of Sidebar (`SidebarUserArea`)

- Replace `MOCK_USER` with the real user from the route's `beforeLoad` context (`Route.useRouteContext()`) or `getCurrentUser`
- Show avatar (GitHub image or initials fallback), name, and email
- Clicking the avatar/name area links to `/profile` (TanStack Router `<Link>`); add a placeholder `/profile` route
- A dropdown (opens upward) with a "Sign out" action, toggled by a button next to the user info
- Remove the mock user from `src/lib/mock-data.ts` once unused

## Implementation Notes

### Auth.js is used directly, not NextAuth

There is no `next-auth` and no `next-auth/react` in this project, so `signIn()` / `signOut()` from `next-auth/react` do not exist. Call the Auth.js HTTP endpoints from the browser instead:

- **CSRF token**: `GET /api/auth/csrf` returns `{ csrfToken }`. Every sign-in/sign-out POST must include it
- **Credentials sign-in**: `POST /api/auth/callback/credentials` with `application/x-www-form-urlencoded` body `csrfToken`, `email`, `password`, `callbackUrl`, plus the header `X-Auth-Return-Redirect: 1`. With that header Auth.js returns `{ url }` instead of a redirect (`json=true` alone does not work); a URL containing `error=` means failure (e.g. `error=CredentialsSignin`), otherwise navigate to the callback URL. Verify against the Auth.js docs
- **GitHub sign-in**: `POST /api/auth/signin/github` with `csrfToken` and `callbackUrl`. Auth.js responds with a redirect to GitHub. Simplest is a real `<form method="post" action="/api/auth/signin/github">` with hidden `csrfToken` and `callbackUrl` inputs, so the browser follows the redirect
- **Sign out**: `POST /api/auth/signout` with `csrfToken` and `callbackUrl=/sign-in` (a form post, same as GitHub)
- Put these helpers in `src/lib/auth-client.ts` (client-safe, no secrets, no Prisma). Keep them small and typed; no `any`

### Auth.js config

- Add `pages: { signIn: "/sign-in" }` to `authConfig` in `src/server/auth.server.ts` so Auth.js redirects there on errors and unauthenticated access
- Update the `/dashboard` `beforeLoad` guard to redirect to `/sign-in` (via `redirect({ to: "/sign-in", search: { redirect: location.href } })`) instead of `/api/auth/signin`
- Keep `session: { strategy: "jwt" }` and the existing callbacks. The session already exposes `user.id`, `name`, `email`, and `image`

### Routing (TanStack Router)

- File routes: `src/routes/sign-in.tsx`, `src/routes/register.tsx`, `src/routes/profile.tsx` (placeholder; protected like `/dashboard`)
- Routes stay thin; forms live in `src/components/auth/` (`SignInForm.tsx`, `RegisterForm.tsx`)
- Search params validated with Zod via `validateSearch`. Only accept same-origin relative paths for `redirect` (must start with `/` and not `//`) to avoid open redirects
- Set `headers: () => ({ "Cache-Control": "private, no-store" })` on session-dependent routes, as `/dashboard` does
- Consider a pathless `_authed` layout now that `/dashboard` and `/profile` are both protected, so the guard lives in one place. Ask before refactoring `/dashboard`

### Avatar component

- `src/components/ui/UserAvatar.tsx`, reusable and typed (`image`, `name`, `size`)
- If `image` exists (GitHub): render it; fall back to initials if the image fails to load
- Otherwise: initials from the name, e.g. "Brad Traversy" → "BT" (max 2 letters, uppercase); fall back to the email's first letter, then `?`, when there is no name
- Move `getInitials` out of `SidebarUserArea.tsx` into the avatar component (or `src/lib/`) so there is one implementation
- GitHub avatar host (`avatars.githubusercontent.com`) needs no config; plain `<img>`, not `next/image`

### Forms and UI

- Tailwind v4 + shadcn/ui only: use the existing `Button` and `Input`; add shadcn `Label` and `DropdownMenu` via the shadcn CLI if needed. No inline styles
- Use `useMutation` (TanStack Query) for the register and credentials sign-in submits; show errors inline and via toast
- Zod schema shared between the client form and `src/routes/api/auth/register.ts`: extract it to `src/lib/validations/auth.ts` and import it in both places (the register route must keep its current behavior)
- Show loading/disabled state on submit buttons

### Session in the UI

- After sign-in or sign-out, do a full navigation (`window.location.assign`) or call `router.invalidate()` so `beforeLoad` re-runs `getCurrentUser` and the sidebar picks up the new user
- `getCurrentUser` already returns `{ id, name, email, image }`; no changes needed
- Route guards are UX only. Private server functions must still check the session themselves (see Phase 1)

## Files

Create:

- `src/routes/sign-in.tsx`
- `src/routes/register.tsx`
- `src/routes/profile.tsx` (placeholder)
- `src/components/auth/SignInForm.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/ui/UserAvatar.tsx`
- `src/lib/auth-client.ts`
- `src/lib/validations/auth.ts`

Modify:

- `src/server/auth.server.ts` (`pages.signIn`)
- `src/routes/api/auth/register.ts` (import the shared Zod schema)
- `src/routes/dashboard.tsx` (redirect to `/sign-in`)
- `src/components/dashboard/SidebarUserArea.tsx` and `Sidebar.tsx` (real user, avatar, dropdown, sign-out)
- `src/lib/mock-data.ts` (remove the mock user)

## Environment Variables

None new. Uses `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`.

## Testing

Dev server runs on port `4000`.

1. Go to `/sign-in`: custom page renders (not the Auth.js built-in page)
2. Visit `/dashboard` signed out: redirects to `/sign-in?redirect=/dashboard`
3. Sign in with GitHub: flow completes and lands on `/dashboard`
4. Sign in with email/password: flow completes; a wrong password shows an inline error
5. Sidebar bottom shows the avatar (GitHub image or initials), name, and email
6. Click the avatar/name: goes to `/profile`
7. Open the dropdown: "Sign out" is shown
8. Click "Sign out": session cleared (`/api/auth/session` returns `null`) and redirect to `/sign-in`
9. Go to `/register`, create an account (mismatched passwords and duplicate email show errors): redirect to `/sign-in` on success
10. Visit `/sign-in` while signed in: redirects to `/dashboard`
11. `npx tsc --noEmit` and `npm run build` pass

## References

- Auth.js custom pages: https://authjs.dev/guides/pages/signin
- Auth.js core API: https://authjs.dev/reference/core
- Credentials provider: https://authjs.dev/getting-started/authentication/credentials
- TanStack Router `beforeLoad` / redirects: https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes
- TanStack Start authentication guide: https://tanstack.com/start/latest/docs/framework/react/guide/authentication
- Existing implementation: `src/server/auth.server.ts`, `src/server/auth.functions.ts`, `src/routes/api/auth/`, `src/components/dashboard/SidebarUserArea.tsx`
