import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from '@/use-cases/fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    // -5.1287308,-42.8275974 minha casa

    // -5.0700252,-42.781103 // mais longe que 10km

    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -5.0991271,
      longitude: -42.8164539,
      description: null,
      phone: null,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -5.0471532,
      longitude: -42.7394919,
      description: null,
      phone: null,
    })

    const { gyms } = await sut.execute({
      userLatitude: -5.0991271,
      userLongitude: -42.8164539,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ])
  })
})
