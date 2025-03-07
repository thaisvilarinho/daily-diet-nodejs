import type { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function mealsRoute(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })
      const { name, description, isOnDiet, date } = createMealBodySchema.parse(
        request.body,
      )

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
        user_id: request.user?.id,
      })

      return reply.status(201).send()
    },
  )
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const meals = await knex('meals')
        .where({ user_id: request.user?.id })
        .orderBy('date', 'desc')

      return reply.send({ meals })
    },
  )
  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsGetSchema = z.object({ id: z.string().uuid() })

      const { id } = paramsGetSchema.parse(request.params)

      const meal = await knex('meals').where({ id }).first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      return reply.send({ meal })
    },
  )
  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsUpdateSchema = z.object({ id: z.string().uuid() })

      const { id } = paramsUpdateSchema.parse(request.params)

      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, isOnDiet, date } = updateMealBodySchema.parse(
        request.body,
      )

      const meal = await knex('meals').where({ id }).first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found ' })
      }

      await knex('meals').where({ id }).update({
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
      })

      return reply.status(204).send()
    },
  )
  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsDeleteSchema = z.object({ id: z.string().uuid() })

      const { id } = paramsDeleteSchema.parse(request.params)

      const meal = await knex('meals').where({ id }).first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }
      await knex('meals').where({ id }).delete()

      return reply.status(204).send()
    },
  )
  app.get(
    '/metrics',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const userId = request.user?.id
      const totalMealsOnDiet = await knex('meals')
        .where({ user_id: userId, is_on_diet: true })
        .count('id', { as: 'total' })
        .first() // [{ total: 5 }] ❌ -> {total: 5} ✅

      const totalMealsOffDiet = await knex('meals')
        .where({ user_id: userId, is_on_diet: false })
        .count('id', { as: 'total' })
        .first() // [{ total: 5 }] ❌ -> {total: 5} ✅

      const totalMeals = await knex('meals')
        .where({ user_id: userId })
        .orderBy('date', 'desc')

      const { bestOnDietSequence } = totalMeals.reduce(
        (acc, meal) => {
          if (meal.is_on_diet) {
            acc.currentSequence += 1
          } else {
            acc.currentSequence = 0
          }

          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence
          }

          return acc
        },
        { bestOnDietSequence: 0, currentSequence: 0 },
      )

      return reply.send({
        totalMeals: totalMeals.length,
        totalMealsOnDiet: totalMealsOnDiet?.total,
        totalMealsOffDiet: totalMealsOffDiet?.total,
        bestOnDietSequence,
      })
    },
  )
}
