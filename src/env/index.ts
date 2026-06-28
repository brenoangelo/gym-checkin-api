import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  // biome-ignore lint/style/useNamingConvention: <explanation>
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  // biome-ignore lint/style/useNamingConvention: <explanation>
  PORT: z.coerce.number().default(3333),
})

// biome-ignore lint/style/useNamingConvention: <explanation>
const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
