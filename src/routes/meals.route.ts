import { FastifyInstance } from 'fastify'
import { checkSession } from '../middlewares/check-session'
import {
  createMeal,
  deleteMeal,
  editMeal,
  getMeal,
  listMeals,
} from '../services/meals.service'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkSession)
  app.get('/:id', getMeal)
  app.get('/', listMeals)
  app.delete('/:id', deleteMeal)
  app.put('/:id', editMeal)
  app.post('/', createMeal)
}
