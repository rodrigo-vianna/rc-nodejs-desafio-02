import { FastifyInstance } from 'fastify'
import { checkSession } from '../middlewares/check-session'
import { createUser, userSummary } from '../services/users.service'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/summary', { preHandler: [checkSession] }, userSummary)
  app.post('/', createUser)
}
