import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: 'JavaScript Gym',
      description: 'Some description',
      phone: '1199999999',
      latitude: -5.0991271,
      longitude: -42.8164539,
    })

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: 'TypeScript Gym',
      description: 'Some description',
      phone: '1199999999',
      latitude: -5.0471532,
      longitude: -42.7394919,
    })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -5.0991271,
        longitude: -42.8164539,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
