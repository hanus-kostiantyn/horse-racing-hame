/**
 * Unit tests for Race domain model
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { RaceFactory, RaceService } from './race'
import { RaceStatus } from './types'
import type { RaceHorse, HorsePosition } from './types'
import { MockRandomGenerator } from '@/shared/lib/random'
import { GAME_CONFIG } from '@/shared/lib/constants'

describe('RaceFactory', () => {
  let mockRandom: MockRandomGenerator
  let factory: RaceFactory

  beforeEach(() => {
    mockRandom = new MockRandomGenerator()
    factory = new RaceFactory(mockRandom)
  })

  const createTestHorses = (count: number): RaceHorse[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `horse-${i + 1}`,
      name: `Horse ${i + 1}`,
      condition: 60 + i * 5,
      color: `#${i.toString(16).padStart(6, '0')}`,
      laneNumber: i + 1,
    }))
  }

  describe('createRace', () => {
    it('should create a valid race with correct structure', () => {
      const horses = createTestHorses(10)
      const race = factory.createRace(1, horses)

      expect(race).toMatchObject({
        id: expect.stringContaining('race-1-'),
        roundNumber: 1,
        distance: 1200,
        horses,
        status: RaceStatus.SCHEDULED,
      })
    })

    it('should assign correct distance for each round', () => {
      const horses = createTestHorses(10)

      GAME_CONFIG.RACE_DISTANCES.forEach((expectedDistance, index) => {
        const race = factory.createRace(index + 1, horses)
        expect(race.distance).toBe(expectedDistance)
      })
    })

    it('should validate round number', () => {
      const horses = createTestHorses(10)

      expect(() => factory.createRace(0, horses)).toThrow('Invalid round number')
      expect(() => factory.createRace(7, horses)).toThrow('Invalid round number')
    })

    it('should validate horse count', () => {
      const tooFewHorses = createTestHorses(5)
      const tooManyHorses = createTestHorses(15)

      expect(() => factory.createRace(1, tooFewHorses)).toThrow('must have exactly')
      expect(() => factory.createRace(1, tooManyHorses)).toThrow('must have exactly')
    })
  })

  describe('createSchedule', () => {
    it('should create complete 6-race schedule', () => {
      const horses = createTestHorses(20)
      const schedule = factory.createSchedule(horses)

      expect(schedule.races).toHaveLength(GAME_CONFIG.TOTAL_ROUNDS)
      expect(schedule.id).toContain('schedule-')
      expect(schedule.generatedAt).toBeInstanceOf(Date)

      // Each race should have 10 horses
      schedule.races.forEach(race => {
        expect(race.horses).toHaveLength(GAME_CONFIG.HORSES_PER_RACE)
      })
    })

    it('should throw error with insufficient horses', () => {
      const horses = createTestHorses(5)
      expect(() => factory.createSchedule(horses)).toThrow()
    })
  })
})

describe('RaceService', () => {
  let service: RaceService

  beforeEach(() => {
    service = new RaceService()
  })

  const createTestRace = () => {
    const horses: RaceHorse[] = Array.from({ length: 3 }, (_, i) => ({
      id: `horse-${i + 1}`,
      name: `Horse ${i + 1}`,
      condition: 60 + i * 20, // 60, 80, 100
      color: '#000000',
      laneNumber: i + 1,
    }))

    return {
      id: 'test-race',
      roundNumber: 1,
      distance: 1200,
      horses,
      status: RaceStatus.SCHEDULED,
    }
  }

  describe('initializePositions', () => {
    it('should create initial positions for all horses', () => {
      const race = createTestRace()
      const positions = service.initializePositions(race)

      expect(positions).toHaveLength(3)
      positions.forEach((pos, index) => {
        expect(pos).toEqual({
          horseId: `horse-${index + 1}`,
          position: 0,
          lane: index + 1,
          isFinished: false,
        })
      })
    })
  })

  describe('updatePositions', () => {
    it('should update positions based on horse conditions', () => {
      const race = createTestRace()
      const positions = service.initializePositions(race)

      const deltaTime = 1.0
      const result = service.updatePositions(positions, race.horses, deltaTime)

      // All horses should have moved from starting position
      result.positions.forEach(pos => {
        expect(pos.position).toBeGreaterThan(0)
      })

      // Result should have correct structure
      expect(result.positions).toHaveLength(3)
      expect(result.isFinished).toBe(false)
    })

    it('should cap position at 100 and mark as finished', () => {
      const race = createTestRace()
      const positions: HorsePosition[] = [
        { horseId: 'horse-1', position: 105, lane: 1, isFinished: false },
        { horseId: 'horse-2', position: 105, lane: 2, isFinished: false },
        { horseId: 'horse-3', position: 105, lane: 3, isFinished: false },
      ]

      const result = service.updatePositions(positions, race.horses, 0.1)

      // All positions should be capped at 100 and marked finished
      expect(result.positions.every(p => p.position === 100)).toBe(true)
      expect(result.positions.every(p => p.isFinished)).toBe(true)
      expect(result.isFinished).toBe(true)
    })
  })

  describe('determineResults', () => {
    it('should order horses by position', () => {
      const race = createTestRace()
      const positions: HorsePosition[] = [
        { horseId: 'horse-1', position: 75, lane: 1, isFinished: false },
        { horseId: 'horse-2', position: 100, lane: 2, isFinished: true },
        { horseId: 'horse-3', position: 90, lane: 3, isFinished: false },
      ]

      const results = service.determineResults(race, positions, 5000)

      expect(results.positions).toEqual(['horse-2', 'horse-3', 'horse-1'])
      expect(results.duration).toBe(5000)
      expect(results.completedAt).toBeInstanceOf(Date)
    })
  })
})
