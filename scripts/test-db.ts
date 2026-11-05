import { config } from 'dotenv'

config({ path: '.env.local' })

const { prisma } = await import('../src/db.ts')

async function main() {
  console.log('🔌 Testing database connection...')

  const [{ now }] = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() AS now`
  console.log(`✅ Connected. Server time: ${now.toISOString()}`)

  const systemItemTypes = await prisma.itemType.findMany({
    where: { isSystem: true, userId: null },
    orderBy: { name: 'asc' },
    select: { name: true, icon: true, color: true },
  })
  console.log(`📦 System item types (${systemItemTypes.length}):`)
  for (const itemType of systemItemTypes) {
    console.log(`  - ${itemType.name} (${itemType.icon}, ${itemType.color})`)
  }

  const userCount = await prisma.user.count()
  console.log(`👤 Users: ${userCount}`)
}

main()
  .catch((e) => {
    console.error('❌ Database test failed:', e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
