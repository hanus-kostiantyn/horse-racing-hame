/**
 * Unit tests for Horse domain model
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { HorseFactory } from './horse'
import { MockRandomGenerator } from '@/shared/lib/random'
import { GAME_CONFIG } from '@/shared/lib/constants'

describe('HorseFactory', () => {
  let mockRandom: MockRandomGenerator
  let factory: HorseFactory

  beforeEach(() => {
    mockRandom = new MockRandomGenerator()
    factory = new HorseFactory(mockRandom)
  })

  describe('createHorse', () => {
    it('should create a horse with generated values', () => {
      mockRandom.setSequence([0.5])

      const horse = factory.createHorse()

      expect(horse).toMatchObject({
        id: expect.stringContaining('horse-'),
        name: expect.any(String),
        condition: expect.any(Number),
        color: expect.any(String),
      })

      expect(horse.condition).toBeGreaterThanOrEqual(GAME_CONFIG.MIN_CONDITION)
      expect(horse.condition).toBeLessThanOrEqual(GAME_CONFIG.MAX_CONDITION)
    })

    it('should use provided parameters', () => {
      const params = {
        id: 'custom-id',
        name: 'Thunder Bolt',
        condition: 75,
        color: '#FF0000',
      }

      const horse = factory.createHorse(params)

      expect(horse).toEqual(params)
    })
  })

  describe('createHorsePool', () => {
    it('should create 20 unique horses by default', () => {
      const horses = factory.createHorsePool()

      expect(horses).toHaveLength(GAME_CONFIG.TOTAL_HORSES)

      const ids = new Set(horses.map(h => h.id))
      const names = new Set(horses.map(h => h.name))
      const colors = new Set(horses.map(h => h.color))

      expect(ids.size).toBe(GAME_CONFIG.TOTAL_HORSES)
      expect(names.size).toBe(GAME_CONFIG.TOTAL_HORSES)
      expect(colors.size).toBe(GAME_CONFIG.TOTAL_HORSES)
    })

    it('should create specified number of horses', () => {
      const horses = factory.createHorsePool(5)

      expect(horses).toHaveLength(5)
      expect(horses[0]!.id).toBe('horse-1')
      expect(horses[4]!.id).toBe('horse-5')
    })

    it('should throw error when requesting too many horses', () => {
      expect(() => factory.createHorsePool(50)).toThrow('No unique items available')
    })
  })
})
