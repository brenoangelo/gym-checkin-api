import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/environments'

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL env variable')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)

  return url.toString()
}

export default (<Environment>{
  name: 'prisma',
  viteEnvironment: 'ssr',
  async setup() {
    const schema = `test_${randomUUID().replace(/-/g, '_')}`
    const databaseUrl = generateDatabaseUrl(schema)

    process.env.DATABASE_URL = databaseUrl

    execSync('pnpm exec prisma db push', {
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
    })

    return {
      async teardown() {
        const adapter = new PrismaPg({ connectionString: databaseUrl }, { schema })
        const prisma = new PrismaClient({ adapter })

        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
        await prisma.$disconnect()
      },
    }
  },
})
