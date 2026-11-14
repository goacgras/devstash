# DevStash

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interactions.md
- @context/current-feature.md

## Commands

Package manager is npm (`package-lock.json`). The README and `.cursorrules` mention pnpm; use npm and `npx` instead.

```bash
npm install
npm run dev            # Vite dev server on port 4000
npm run build          # Production build; also regenerates src/routeTree.gen.ts
npm run preview        # Serve the production build
npm run lint           # biome lint
npm run format         # biome format
npm run check          # biome check (lint + format + import organizing)
npx tsc --noEmit       # Typecheck (no script defined; tsconfig is strict)
```

## Neon MCP

- Always use the `devstash` Neon project (`spring-salad-31329299`) when calling Neon MCP tools. Pass `project_id: spring-salad-31329299` explicitly.
- Always target the development branch `develpment` (spelled that way in Neon) with `branch_id: br-bold-butterfly-azvc32gd`. Pass it on every `run_sql` call.
- Never run queries against the `production` branch (`br-muddy-cherry-azd6k8pq`), and never use it as the default. Only touch production when the user explicitly names it in the request.
- Use read-only SQL unless the user asks for a change. Ask before any destructive or write statement.
