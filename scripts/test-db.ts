import { config } from 'dotenv'

config({ path: '.env.local' })

const { prisma } = await import('../src/db.ts')

const DEMO_EMAIL = 'demo@devstash.io'

async function checkConnection() {
  console.log('🔌 Testing database connection...')

  const [{ now }] = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() AS now`
  console.log(`✅ Connected. Server time: ${now.toISOString()}`)
}

async function showSystemItemTypes() {
  const systemItemTypes = await prisma.itemType.findMany({
    where: { isSystem: true, userId: null },
    orderBy: { name: 'asc' },
    select: { name: true, icon: true, color: true },
  })
  console.log(`\n📦 System item types (${systemItemTypes.length}):`)
  for (const itemType of systemItemTypes) {
    console.log(`  - ${itemType.name} (${itemType.icon}, ${itemType.color})`)
  }
}

async function showDemoData() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true, name: true, email: true, isPro: true, emailVerified: true },
  })

  if (!user) {
    console.log(`\n👤 Demo user (${DEMO_EMAIL}) not found. Run \`npm run db:seed\`.`)
    return
  }

  console.log(`\n👤 Demo user: ${user.name} <${user.email}>`)
  console.log(`  Pro: ${user.isPro ? 'yes' : 'no'}`)
  console.log(`  Email verified: ${user.emailVerified?.toISOString() ?? 'no'}`)

  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    orderBy: { name: 'asc' },
    include: {
      items: {
        orderBy: { item: { title: 'asc' } },
        include: { item: { include: { itemType: { select: { name: true } } } } },
      },
    },
  })

  console.log(`\n📚 Collections (${collections.length}):`)
  for (const collection of collections) {
    console.log(`  ${collection.name} (${collection.items.length} items)`)
    for (const { item } of collection.items) {
      console.log(`    - [${item.itemType.name}] ${item.title}`)
    }
  }

  const itemCountsByType = await prisma.item.groupBy({
    by: ['itemTypeId'],
    where: { userId: user.id },
    _count: { _all: true },
  })
  const itemTypes = await prisma.itemType.findMany({
    where: { id: { in: itemCountsByType.map((c) => c.itemTypeId) } },
    select: { id: true, name: true },
  })
  const typeNameById = new Map(itemTypes.map((t) => [t.id, t.name]))
  const totalItems = itemCountsByType.reduce((sum, c) => sum + c._count._all, 0)

  console.log(`\n🗂️  Items by type (${totalItems} total):`)
  for (const count of itemCountsByType.sort((a, b) =>
    (typeNameById.get(a.itemTypeId) ?? '').localeCompare(typeNameById.get(b.itemTypeId) ?? ''),
  )) {
    console.log(`  - ${typeNameById.get(count.itemTypeId)}: ${count._count._all}`)
  }
}

async function main() {
  await checkConnection()
  await showSystemItemTypes()
  await showDemoData()

  const userCount = await prisma.user.count()
  console.log(`\n👥 Users in database: ${userCount}`)
}

main()
  .catch((e) => {
    console.error('❌ Database test failed:', e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
