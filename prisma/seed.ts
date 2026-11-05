import bcrypt from 'bcryptjs'
import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../src/generated/prisma/client.js'
import { getDatabaseUrl } from '../src/database-url.js'

const SYSTEM_ITEM_TYPES = [
  { name: 'snippet', icon: 'Code', color: '#3b82f6' },
  { name: 'prompt', icon: 'Sparkles', color: '#8b5cf6' },
  { name: 'command', icon: 'Terminal', color: '#f97316' },
  { name: 'note', icon: 'StickyNote', color: '#fde047' },
  { name: 'file', icon: 'File', color: '#6b7280' },
  { name: 'image', icon: 'Image', color: '#ec4899' },
  { name: 'link', icon: 'Link', color: '#10b981' },
]

const DEMO_USER = {
  email: 'demo@devstash.io',
  name: 'Demo User',
  password: '12345678',
}

type ItemTypeName = (typeof SYSTEM_ITEM_TYPES)[number]['name']

type SeedItem = {
  title: string
  type: ItemTypeName
  description?: string
  language?: string
  content?: string
  url?: string
}

type SeedCollection = {
  name: string
  description: string
  // Default type for the collection; omitted for mixed-type collections
  defaultType?: ItemTypeName
  items: SeedItem[]
}

const COLLECTIONS: SeedCollection[] = [
  {
    name: 'React Patterns',
    description: 'Reusable React patterns and hooks',
    defaultType: 'snippet',
    items: [
      {
        title: 'useDebounce hook',
        type: 'snippet',
        language: 'typescript',
        description: 'Debounce a fast-changing value',
        content: `import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}`,
      },
      {
        title: 'useLocalStorage hook',
        type: 'snippet',
        language: 'typescript',
        description: 'State synced with localStorage',
        content: `import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    const stored = window.localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : initialValue
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}`,
      },
      {
        title: 'Context provider with guard',
        type: 'snippet',
        language: 'typescript',
        description: 'Typed Context provider that throws when used outside its provider',
        content: `import { createContext, useContext, useState, type ReactNode } from 'react'

type ThemeContextValue = {
  theme: 'light' | 'dark'
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}`,
      },
    ],
  },
  {
    name: 'AI Workflows',
    description: 'AI prompts and workflow automations',
    defaultType: 'prompt',
    items: [
      {
        title: 'Code review prompt',
        type: 'prompt',
        description: 'Structured code review with severity levels',
        content: `Review the following code changes. For each finding, report:
1. Severity (blocker, major, minor, nit)
2. File and line reference
3. What is wrong and why it matters
4. A concrete suggested fix

Focus on correctness, edge cases, security, and missing tests. Do not comment on formatting that the linter handles.

Code:
{{code}}`,
      },
      {
        title: 'Documentation generation prompt',
        type: 'prompt',
        description: 'Generate README-style docs for a module',
        content: `Write documentation for the module below. Include:
- A one-paragraph overview of what it does and why it exists
- Public API with parameter and return types
- A short usage example
- Notable edge cases or limitations

Keep it concise and accurate to the code. Do not invent behavior that is not in the source.

Module:
{{code}}`,
      },
      {
        title: 'Refactoring assistance prompt',
        type: 'prompt',
        description: 'Refactor code while preserving behavior',
        content: `Refactor the code below to improve readability and maintainability.

Constraints:
- Preserve existing behavior and public signatures
- Prefer small, well-named functions over comments
- Remove duplication only when the abstraction is clear
- List each change you made and why

Code:
{{code}}`,
      },
    ],
  },
  {
    name: 'DevOps',
    description: 'Infrastructure and deployment resources',
    items: [
      {
        title: 'Node.js Dockerfile and CI pipeline',
        type: 'snippet',
        language: 'dockerfile',
        description: 'Multi-stage Dockerfile for a Node.js app',
        content: `# syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
      },
      {
        title: 'Deployment script',
        type: 'command',
        language: 'bash',
        description: 'Build, push and roll out a container image',
        content: `#!/usr/bin/env bash
set -euo pipefail

IMAGE="registry.example.com/app:$(git rev-parse --short HEAD)"

docker build -t "$IMAGE" .
docker push "$IMAGE"
kubectl set image deployment/app app="$IMAGE"
kubectl rollout status deployment/app`,
      },
      {
        title: 'Docker Documentation',
        type: 'link',
        url: 'https://docs.docker.com',
        description: 'Official Docker documentation',
      },
      {
        title: 'GitHub Actions Documentation',
        type: 'link',
        url: 'https://docs.github.com/en/actions',
        description: 'Official GitHub Actions documentation',
      },
    ],
  },
  {
    name: 'Terminal Commands',
    description: 'Useful shell commands for everyday development',
    defaultType: 'command',
    items: [
      {
        title: 'Git: undo last commit, keep changes',
        type: 'command',
        language: 'bash',
        description: 'Reset the last commit but keep working tree changes',
        content: 'git reset --soft HEAD~1',
      },
      {
        title: 'Docker: remove stopped containers and dangling images',
        type: 'command',
        language: 'bash',
        description: 'Free up disk space from unused Docker resources',
        content: 'docker container prune -f && docker image prune -f',
      },
      {
        title: 'Process: find and kill process on port',
        type: 'command',
        language: 'bash',
        description: 'Kill whatever is listening on a given port',
        content: 'lsof -ti tcp:4000 | xargs kill -9',
      },
      {
        title: 'npm: list outdated packages',
        type: 'command',
        language: 'bash',
        description: 'Show outdated dependencies and their latest versions',
        content: 'npm outdated',
      },
    ],
  },
  {
    name: 'Design Resources',
    description: 'UI/UX resources and references',
    defaultType: 'link',
    items: [
      {
        title: 'Tailwind CSS Documentation',
        type: 'link',
        url: 'https://tailwindcss.com/docs',
        description: 'CSS utility reference and guides',
      },
      {
        title: 'shadcn/ui',
        type: 'link',
        url: 'https://ui.shadcn.com',
        description: 'Copy-paste component library built on Radix and Tailwind',
      },
      {
        title: 'Material Design 3',
        type: 'link',
        url: 'https://m3.material.io',
        description: 'Google design system with guidelines and tokens',
      },
      {
        title: 'Lucide Icons',
        type: 'link',
        url: 'https://lucide.dev/icons',
        description: 'Open-source icon library',
      },
    ],
  },
]

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

const prisma = new PrismaClient({ adapter })

async function seedSystemItemTypes() {
  console.log('🌱 Seeding system item types...')

  let created = 0

  // userId is null for system types; skip any that already exist so the seed is safe to re-run
  for (const itemType of SYSTEM_ITEM_TYPES) {
    const existing = await prisma.itemType.findFirst({
      where: { userId: null, name: itemType.name },
    })

    if (existing) {
      continue
    }

    await prisma.itemType.create({
      data: { ...itemType, isSystem: true },
    })
    created++
  }

  console.log(
    `✅ Created ${created} system item types (${SYSTEM_ITEM_TYPES.length - created} already existed)`,
  )
}

async function seedDemoUser() {
  console.log('👤 Seeding demo user...')

  const hashedPassword = await bcrypt.hash(DEMO_USER.password, 12)

  const user = await prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: {
      name: DEMO_USER.name,
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
    create: {
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
  })

  console.log(`✅ Demo user ready (${user.email})`)
  return user
}

async function seedCollectionsAndItems(userId: string) {
  console.log('📚 Seeding collections and items...')

  // Clear the demo user's existing content so re-running the seed gives a clean, predictable dataset.
  // ItemCollection rows are removed by cascade.
  const deletedItems = await prisma.item.deleteMany({ where: { userId } })
  const deletedCollections = await prisma.collection.deleteMany({ where: { userId } })
  console.log(
    `🧹 Cleared ${deletedItems.count} items and ${deletedCollections.count} collections`,
  )

  const itemTypes = await prisma.itemType.findMany({
    where: { userId: null, isSystem: true },
  })
  const typeIdByName = new Map(itemTypes.map((t) => [t.name, t.id]))

  const typeId = (name: ItemTypeName) => {
    const id = typeIdByName.get(name)
    if (!id) throw new Error(`System item type "${name}" not found; run the seed first`)
    return id
  }

  let itemCount = 0

  for (const collection of COLLECTIONS) {
    await prisma.collection.create({
      data: {
        name: collection.name,
        description: collection.description,
        userId,
        defaultTypeId: collection.defaultType ? typeId(collection.defaultType) : null,
        items: {
          create: collection.items.map((item) => {
            itemCount++
            return {
              item: {
                create: {
                  title: item.title,
                  description: item.description,
                  content: item.content ?? null,
                  language: item.language ?? null,
                  url: item.url ?? null,
                  userId,
                  itemTypeId: typeId(item.type),
                },
              },
            }
          }),
        },
      },
    })

    console.log(`  - ${collection.name} (${collection.items.length} items)`)
  }

  console.log(`✅ Created ${COLLECTIONS.length} collections and ${itemCount} items`)
}

async function main() {
  await seedSystemItemTypes()
  const user = await seedDemoUser()
  await seedCollectionsAndItems(user.id)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
