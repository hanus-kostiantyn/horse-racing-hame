/**
 * Horse domain model and factory
 */

import type { Horse, CreateHorseParams } from './types'
import { GAME_CONFIG, HORSE_NAMES, HORSE_COLORS } from '@/shared/lib/constants'
import type { RandomGenerator } from '@/shared/lib/random'
import { DefaultRandomGenerator } from '@/shared/lib/random'

/**
 * Factory class for creating Horse entities
 * Uses dependency injection for testability
 */
export class HorseFactory {
  private randomGenerator: RandomGenerator

  /**
   * Creates a new HorseFactory instance
   * @param randomGenerator - Random number generator (injectable for testing)
   */
  constructor(randomGenerator?: RandomGenerator) {
    this.randomGenerator = randomGenerator ?? new DefaultRandomGenerator()
  }

  /**
   * Creates a single horse with provided or random attributes
   * @param params - Optional horse parameters
   * @returns Created horse entity
   */
  createHorse(params: CreateHorseParams = {}): Horse {
    const id = params.id || this.generateId()
    const name = params.name || this.selectRandomName()
    const condition = params.condition ?? this.generateCondition()
    const color = params.color || this.selectRandomColor()

    return {
      id,
      name,
      condition,
      color,
    }
  }

  /**
   * Creates a pool of horses for the game
   * @param count - Number of horses to create (default: 20)
   * @returns Array of unique horses (lanes assigned later)
   */
  createHorsePool(count: number = GAME_CONFIG.TOTAL_HORSES): Horse[] {
    const horses: Horse[] = []
    const usedNames = new Set<string>()
    const usedColors = new Set<string>()

    for (let i = 0; i < count; i++) {
      const name = this.selectUniqueItem(HORSE_NAMES, usedNames)
      const color = this.selectUniqueItem(HORSE_COLORS, usedColors)

      horses.push(
        this.createHorse({
          id: `horse-${i + 1}`,
          name,
          color,
        })
      )
    }

    return horses
  }

  /**
   * Generates a unique horse ID
   * @returns Generated ID string
   */
  private generateId(): string {
    return `horse-${Date.now()}-${this.randomGenerator.next(0, 9999)}`
  }

  /**
   * Selects a random horse name
   * @returns Random horse name
   */
  private selectRandomName(): string {
    const index = this.randomGenerator.next(0, HORSE_NAMES.length - 1)
    return HORSE_NAMES[index]!
  }

  /**
   * Selects a random horse color
   * @returns Random color hex code
   */
  private selectRandomColor(): string {
    const index = this.randomGenerator.next(0, HORSE_COLORS.length - 1)
    return HORSE_COLORS[index]!
  }

  /**
   * Generates a random condition value
   * @returns Condition value between MIN and MAX
   */
  private generateCondition(): number {
    return this.randomGenerator.next(
      GAME_CONFIG.MIN_CONDITION,
      GAME_CONFIG.MAX_CONDITION
    )
  }

  /**
   * Selects a unique item from an array
   * @param items - Array of items to choose from
   * @param usedItems - Set of already used items
   * @returns Selected unique item
   */
  private selectUniqueItem<T>(
    items: readonly T[],
    usedItems: Set<T>
  ): T {
    const availableItems = items.filter(item => !usedItems.has(item))

    if (availableItems.length === 0) {
      throw new Error('No unique items available')
    }

    const index = this.randomGenerator.next(0, availableItems.length - 1)
    const selected = availableItems[index]!
    usedItems.add(selected)

    return selected
  }
}

export const horseFactory = new HorseFactory()