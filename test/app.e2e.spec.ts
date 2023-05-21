import { it, beforeAll, afterAll, describe, expect, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(() => {
  execSync('npm run knex migrate:rollback --all')
  execSync('npm run knex migrate:latest')
})

describe('Users e2e', () => {
  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'João',
        email: 'joao@gmail.com',
      })
      .expect(201)
  })
  it('should be able to summarize user meals', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'João',
        email: 'joao@gmail.com',
      })
      .expect(201)

    const cookies = response.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Arroz',
        description: 'Arroz branco',
        onTheDiet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Feijão',
        onTheDiet: false,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Salada',
        onTheDiet: true,
      })
      .expect(201)

    await request(app.server)
      .get('/users/summary')
      .set('Cookie', cookies)
      .send()
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject({
          sumTotal: 3,
          sumTotalOnDiet: 2,
          sumTotalOffDiet: 1,
        })
      })
  })
})

describe('Meals e2e', () => {
  it('should be able to create a new meal', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'João',
        email: 'joao@gmail.com',
      })
      .expect(201)

    const cookies = response.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Arroz',
        description: 'Arroz branco',
        onTheDiet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Feijão',
        onTheDiet: false,
      })
      .expect(201)
  })

  it('should be able to list meals by user', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'João',
        email: 'joao@gmail.com',
      })
      .expect(201)

    const cookies = response.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Arroz',
        description: 'Arroz branco',
        onTheDiet: true,
      })
      .expect(201)

    await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .send()
      .expect(200)
      .expect((response) => {
        expect(response.body.meals).toHaveLength(1)
        expect(response.body.meals).toEqual([
          expect.objectContaining({
            id: expect.any(String),
            name: 'Arroz',
            description: 'Arroz branco',
            on_the_diet: 1,
          }),
        ])
      })
  })

  it('should be able to edit a meal', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'João',
        email: 'joao@gmail.com',
      })
      .expect(201)

    const cookies = response.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Arroz',
        description: 'Arroz branco',
        onTheDiet: true,
      })
      .expect(201)

    const responseList = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .send()
      .expect(200)

    const mealId = responseList.body.meals[0].id
    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Arroz integral',
        description: 'Arroz integral',
        onTheDiet: false,
      })
      .expect(200)

    await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .send()
      .expect(200)
      .expect((response) => {
        expect(response.body.meals).toHaveLength(1)
        expect(response.body.meals).toEqual([
          expect.objectContaining({
            id: mealId,
            name: 'Arroz integral',
            description: 'Arroz integral',
            on_the_diet: 0,
          }),
        ])
      })
  })

  it('should be able to delete a meal', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'João',
        email: 'joao@gmail.com',
      })
      .expect(201)

    const cookies = response.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Arroz',
        description: 'Arroz branco',
        onTheDiet: true,
      })
      .expect(201)

    const responseList = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .send()
      .expect(200)

    const mealId = responseList.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send()
      .expect(200)
  })

  it('should be able to get a meal', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'João',
        email: 'joao@gmail.com',
      })
      .expect(201)

    const cookies = response.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Arroz',
        description: 'Arroz branco',
        onTheDiet: true,
      })
      .expect(201)

    const responseList = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .send()
      .expect(200)

    const mealId = responseList.body.meals[0].id

    await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send()
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject(
          expect.objectContaining({
            id: mealId,
            name: 'Arroz',
            description: 'Arroz branco',
            on_the_diet: 1,
          }),
        )
      })
  })
})
