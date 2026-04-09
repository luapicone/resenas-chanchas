import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const mimiPassword = await bcrypt.hash('mimi123', 10)
  const liquiPassword = await bcrypt.hash('liqui123', 10)

  await prisma.user.upsert({
    where: { username: 'mimi' },
    update: {},
    create: {
      name: 'Mimi',
      username: 'mimi',
      password: mimiPassword,
      avatar: '🐱',
    },
  })

  await prisma.user.upsert({
    where: { username: 'liqui' },
    update: {},
    create: {
      name: 'Liqui',
      username: 'liqui',
      password: liquiPassword,
      avatar: '🐶',
    },
  })

  console.log('✅ Users seeded: mimi (mimi123) and liqui (liqui123)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
