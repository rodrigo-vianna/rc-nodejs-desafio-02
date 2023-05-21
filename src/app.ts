import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users.route'
import { mealsRoutes } from './routes/meals.route'

const app = fastify()
app.register(cookie)
app.register(mealsRoutes, {
  prefix: '/meals',
})
app.register(usersRoutes, {
  prefix: '/users',
})

export { app }
