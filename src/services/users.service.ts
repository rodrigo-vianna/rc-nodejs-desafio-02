import { randomUUID } from 'node:crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { getUserBySession } from '../utils/session.util'

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string(),
  })
  const { name, email } = createUserSchema.parse(request.body)

  let sessionKey = request.cookies.sessionKey
  if (!sessionKey) {
    sessionKey = randomUUID()
    reply.cookie('sessionKey', sessionKey, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
  }

  await knex('users').insert({
    id: randomUUID(),
    name,
    email,
    session_key: sessionKey,
  })
  reply.status(201).send()
}

export async function userSummary(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = await getUserBySession(request)

  const getSumTotal = async () => {
    const result = await knex('meals')
      .count('id', { as: 'amount' })
      .where('user_id', user.id)
      .first()
    return Number(result?.amount ?? 0)
  }

  const getSumTotalOnDiet = async () => {
    const result = await knex('meals')
      .count('id', { as: 'amount' })
      .where('user_id', user.id)
      .andWhere('on_the_diet', true)
      .first()
    return Number(result?.amount ?? 0)
  }

  const getSumTotalOffDiet = async () => {
    const result = await knex('meals')
      .count('id', { as: 'amount' })
      .where('user_id', user.id)
      .andWhere('on_the_diet', false)
      .first()
    return Number(result?.amount ?? 0)
  }

  const [sumTotal, sumTotalOnDiet, sumTotalOffDiet] = await Promise.all([
    getSumTotal(),
    getSumTotalOnDiet(),
    getSumTotalOffDiet(),
  ])
  return {
    sumTotal,
    sumTotalOnDiet,
    sumTotalOffDiet,
  }
}
