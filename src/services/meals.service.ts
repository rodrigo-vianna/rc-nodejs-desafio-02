import { randomUUID } from 'node:crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { getUserBySession } from '../utils/session.util'

export async function createMeal(request: FastifyRequest, reply: FastifyReply) {
  const createMealSchema = z.object({
    name: z.string(),
    description: z.string().nullable().optional(),
    onTheDiet: z.boolean(),
  })
  const { name, description, onTheDiet } = createMealSchema.parse(request.body)
  const user = await getUserBySession(request)

  await knex('meals').insert({
    id: randomUUID(),
    name,
    description,
    on_the_diet: onTheDiet,
    user_id: user.id,
  })
  reply.status(201).send()
}

export async function listMeals(request: FastifyRequest, reply: FastifyReply) {
  const user = await getUserBySession(request)
  const meals = await knex('meals').select().where('user_id', user.id)
  reply.status(200).send({
    meals,
  })
}

export async function getMeal(request: FastifyRequest, reply: FastifyReply) {
  const user = await getUserBySession(request)
  const getParamsSchema = z.object({
    id: z.string(),
  })
  const { id } = getParamsSchema.parse(request.params)
  const meal = await knex('meals')
    .select()
    .where('user_id', user.id)
    .andWhere('id', id)
    .first()
  reply.status(200).send(meal)
}

export async function editMeal(request: FastifyRequest, reply: FastifyReply) {
  const user = await getUserBySession(request)
  const getParamsSchema = z.object({
    id: z.string(),
  })
  const { id } = getParamsSchema.parse(request.params)
  const createMealSchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    onTheDiet: z.boolean(),
  })
  const { name, description, onTheDiet } = createMealSchema.parse(request.body)
  await knex('meals')
    .update({
      name,
      description,
      on_the_diet: onTheDiet,
    })
    .where('user_id', user.id)
    .andWhere('id', id)
  reply.status(200).send()
}

export async function deleteMeal(request: FastifyRequest, reply: FastifyReply) {
  const user = await getUserBySession(request)
  const getParamsSchema = z.object({
    id: z.string(),
  })
  const { id } = getParamsSchema.parse(request.params)
  await knex('meals').delete().where('user_id', user.id).andWhere('id', id)
  reply.status(200).send()
}
