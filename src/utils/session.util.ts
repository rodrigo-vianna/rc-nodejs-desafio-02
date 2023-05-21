import { FastifyRequest } from 'fastify'
import { knex } from '../database'
import { UserNotAuthorizedError } from '../errors/user-not-found'

export const getUserBySession = async (request: FastifyRequest) => {
  const { sessionKey } = request.cookies
  const user = await knex('users').where('session_key', sessionKey).first()
  if (!user) throw new UserNotAuthorizedError()
  return user
}
