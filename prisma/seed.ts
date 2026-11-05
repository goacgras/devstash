import { PrismaClient } from '../src/generated/prisma/client.js'

import { getDatabaseUrl } from '../src/database-url.js'

import { PrismaPg } from '@prisma/adapter-pg'

const SYSTEM_ITEM_TYPES = [
  { name: 'snippet', icon: 'Code', color: '#3b82f6' },
  { name: 'prompt', icon: 'Sparkles', color: '#8b5cf6' },
  { name: 'command', icon: 'Terminal', color: '#f97316' },
  { name: 'note', icon: 'StickyNote', color: '#fde047' },
  { name: 'file', icon: 'File', color: '#6b7280' },
  { name: 'image', icon: 'Image', color: '#ec4899' },
  { name: 'link', icon: 'Link', color: '#10b981' },
]

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

const prisma = new PrismaClient({ adapter })

async function main() {
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

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
