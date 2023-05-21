import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkSession(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionKey = request.cookies.sessionKey
  if (!sessionKey) return reply.status(401).send()
}
