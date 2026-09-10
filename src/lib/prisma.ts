import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { env } from '@/env'

const connectionString = process.env.DATABASE_URL!
const url = new URL(connectionString)
const schema = url.searchParams.get('schema') ?? 'public'

// Em vez de instanciar o Pool manualmente, passamos o objeto de configuração (PoolConfig)
// direto para o PrismaPg. O `search_path` (1º argumento) garante que queries SQL raw
// (ex: $queryRaw) resolvam os nomes de tabela sem schema no schema correto, e o `schema`
// (2º argumento) garante que as queries geradas pelo Prisma (ex: prisma.user.findMany())
// sejam qualificadas com o schema correto, já que o Prisma usa `pgOptions.schema` para
// montar o SQL e não lê o `search_path` da conexão para isso.
const adapter = new PrismaPg({ connectionString, options: `-c search_path=${schema}` }, { schema })

export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
