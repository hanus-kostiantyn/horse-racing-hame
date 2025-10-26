/**
 * Race domain model and business logic
 */

import type { Race, RaceSchedule, RaceResult, HorsePosition, RaceHorse } from './types'
import { RaceStatus } from './types'
import type { Horse } from '@/entities/horse/model/types'
import { GAME_CONFIG, RACE_MECHANICS } from '@/shared/lib/constants'
import type { RandomGenerator } from '@/shared/lib/random'
import { DefaultRandomGenerator } from '@/shared/lib/random'

/**
 * Factory class for creating Race entities
 */
export class RaceFactory {
  private randomGenerator: RandomGenerator

  /**
   * Creates a new RaceFactory instance
   * @param randomGenerator - Random number generator (injectable for testing)
   */
  constructor(randomGenerator?: RandomGenerator) {
    this.randomGenerator = randomGenerator ?? new DefaultRandomGenerator()
  }

  /**
   * Creates a single race
   * @param roundNumber - Round number (1-6)
   * @param horses - Horses participating in the race with assigned lanes
   * @returns Created race entity
   */
  createRace(roundNumber: number, horses: RaceHorse[]): Race {
    if (roundNumber < 1 || roundNumber > GAME_CONFIG.TOTAL_ROUNDS) {
      throw new Error(`Invalid round number: ${roundNumber}`)
    }

    if (horses.length !== GAME_CONFIG.HORSES_PER_RACE) {
      throw new Error(`Race must have exactly ${GAME_CONFIG.HORSES_PER_RACE} horses`)
    }

    const distance = GAME_CONFIG.RACE_DISTANCES[roundNumber - 1]!

    return {
      id: `race-${roundNumber}-${Date.now()}`,
      roundNumber,
      distance,
      horses,
      status: RaceStatus.SCHEDULED,
    }
  }

  /**
   * Creates a complete race schedule
   * @param allHorses - Pool of all available horses (20)
   * @returns Created race schedule with 10 randomly selected horses
   */
  createSchedule(allHorses: Horse[]): RaceSchedule {
    if (allHorses.length < GAME_CONFIG.HORSES_PER_RACE) {
      throw new Error(`Need at least ${GAME_CONFIG.HORSES_PER_RACE} horses`)
    }

    // Randomly select 10 horses from the pool of 20
    const selectedHorses = this.randomGenerator.pickRandom(
      allHorses,
      GAME_CONFIG.HORSES_PER_RACE
    )

    // Assign lanes 1-10 to the selected horses
    const horsesWithLanes: RaceHorse[] = selectedHorses.map((horse, index) => ({
      ...horse,
      laneNumber: index + 1,
    }))

    const races: Race[] = []

    for (let i = 0; i < GAME_CONFIG.TOTAL_ROUNDS; i++) {
      const roundNumber = i + 1
      const race = this.createRace(roundNumber, [...horsesWithLanes])
      races.push(race)
    }

    return {
      id: `schedule-${Date.now()}`,
      races,
      generatedAt: new Date(),
    }
  }
}

/**
 * Service class for race execution logic
 */
export class RaceService {
  private randomGenerator: RandomGenerator

  /**
   * Creates a new RaceService instance
   * @param randomGenerator - Random number generator (injectable for testing)
   */
  constructor(randomGenerator?: RandomGenerator) {
    this.randomGenerator = randomGenerator ?? new DefaultRandomGenerator()
  }

  /**
   * Initializes horse positions for a race
   * @param race - Race to initialize
   * @returns Initial horse positions
   */
  initializePositions(race: Race): HorsePosition[] {
    return race.horses.map((horse, index) => ({
      horseId: horse.id,
      position: 0,
      lane: index + 1,
      isFinished: false,
    }))
  }

  /**
   * Updates horse positions based on their conditions
   * @param positions - Current positions
   * @param horses - Horse data for condition lookup
   * @param deltaTime - Time since last update in seconds
   * @param currentTime - Current time in milliseconds
   * @returns Updated positions and whether race is finished
   */
  updatePositions(
    positions: HorsePosition[],
    horses: Horse[],
    deltaTime: number,
    currentTime?: number
  ): { positions: HorsePosition[], isFinished: boolean } {
    const updatedPositions = positions.map(pos => {
      if (pos.isFinished) {
        return pos
      }

      const horse = horses.find(h => h.id === pos.horseId)
      if (!horse) {
        return pos
      }

      // Calculate speed based on condition with randomness
      const baseSpeed = (horse.condition / 100) * RACE_MECHANICS.BASE_SPEED_MULTIPLIER
      const variation = this.randomGenerator.nextFloat(
        -RACE_MECHANICS.SPEED_VARIATION_RANGE,
        RACE_MECHANICS.SPEED_VARIATION_RANGE
      )
      const speed = baseSpeed + variation

      // Update position
      const newPosition = Math.min(100, pos.position + speed * deltaTime)
      const isFinished = newPosition >= 100

      return {
        ...pos,
        position: newPosition,
        isFinished,
        finishTime: isFinished && !pos.isFinished ? currentTime : pos.finishTime,
      }
    })

    const isRaceFinished = updatedPositions.every(p => p.isFinished)

    return {
      positions: updatedPositions,
      isFinished: isRaceFinished,
    }
  }

  /**
   * Determines race results from final positions
   * @param race - The race that was completed
   * @param positions - Final horse positions
   * @param duration - Race duration in milliseconds
   * @returns Race result
   */
  determineResults(
    race: Race,
    positions: HorsePosition[],
    duration: number
  ): RaceResult {
    // Sort horses by finish time
    // If finish times are equal or missing, sort by position (higher is better)
    // If both are equal, sort by lane number
    const sortedPositions = [...positions].sort((a, b) => {
      // Primary sort: finish time (earlier finisher wins)
      if (a.finishTime !== undefined && b.finishTime !== undefined) {
        if (a.finishTime !== b.finishTime) {
          return a.finishTime - b.finishTime
        }
      }

      // Secondary sort: position (higher position wins)
      if (b.position !== a.position) {
        return b.position - a.position
      }

      // lane number (lower lane wins tie)
      return a.lane - b.lane
    })

    return {
      raceId: race.id,
      positions: sortedPositions.map(p => p.horseId),
      completedAt: new Date(),
      duration,
    }
  }

}

/**
 * Singleton instances for convenience
 */
export const raceFactory = new RaceFactory()
export const raceService = new RaceService()