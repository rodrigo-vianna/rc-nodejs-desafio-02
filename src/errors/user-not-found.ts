import { FastifyError } from 'fastify'

export class UserNotAuthorizedError implements FastifyError {
  code = '401'
  name = 'UserNotAuthorizedError'
  message = 'User not authorized'
}
