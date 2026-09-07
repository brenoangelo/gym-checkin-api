import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { env } from '@/env'

const connectionString = process.env.DATABASE_URL!
const url = new URL(connectionString)
const schema = url.searchParams.get('schema') ?? 'public'

// Em vez de instanciar o Pool manualmente, passamos o objeto de configuração (PoolConfig)
// direto para o PrismaPg, e o schema é informado separadamente para que o Prisma
// qualifique as queries geradas com o schema correto (não basta setar o search_path
// da conexão, pois o Prisma usa `pgOptions.schema` para montar o SQL).
const adapter = new PrismaPg(
  { connectionString },
  { schema },
)

export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
