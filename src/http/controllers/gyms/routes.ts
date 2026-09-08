import type { FastifyInstance } from 'fastify'
import { create } from '@/http/controllers/gyms/create'
import { nearby } from '@/http/controllers/gyms/nearby'
import { search } from '@/http/controllers/gyms/search'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/search', search)

  app.get('/gyms/nearby', nearby)

  app.post('/gyms', create)
}
