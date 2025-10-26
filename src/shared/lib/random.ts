/**
 * Random number generation utilities
 * Abstracted for testability via dependency injection
 */

/**
 * Interface for random number generation
 * Allows for mocking in tests
 */
export interface RandomGenerator {
  /**
   * Generates a random integer between min and max (inclusive)
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Random integer
   */
  next(min: number, max: number): number

  /**
   * Generates a random float between min and max
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Random float
   */
  nextFloat(min: number, max: number): number

  /**
   * Shuffles an array in place
   * @param array - Array to shuffle
   * @returns Shuffled array (same reference)
   */
  shuffle<T>(array: T[]): T[]

  /**
   * Picks random items from an array
   * @param array - Source array
   * @param count - Number of items to pick
   * @returns Array of randomly selected items
   */
  pickRandom<T>(array: T[], count: number): T[]
}

/**
 * Default random generator implementation using Math.random
 */
export class DefaultRandomGenerator implements RandomGenerator {
  /**
   * Generates a random integer between min and max (inclusive)
   */
  next(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Generates a random float between min and max
   */
  nextFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  /**
   * Shuffles an array using Fisher-Yates algorithm
   */
  shuffle<T>(array: T[]): T[] {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.next(0, i)
      ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
    }
    return arr
  }

  /**
   * Picks random items from an array without replacement
   */
  pickRandom<T>(array: T[], count: number): T[] {
    if (count > array.length) {
      throw new Error('Cannot pick more items than available')
    }

    const shuffled = this.shuffle(array)
    return shuffled.slice(0, count)
  }
}

/**
 * Mock random generator for testing
 * Returns predictable values
 */
export class MockRandomGenerator implements RandomGenerator {
  private sequence: number[] = []
  private index = 0

  /**
   * Sets the sequence of values to return
   * @param values - Array of values to return in order
   */
  setSequence(values: number[]): void {
    this.sequence = values
    this.index = 0
  }

  next(min: number, max: number): number {
    if (this.sequence.length === 0) {
      return min
    }
    const value = this.sequence[this.index % this.sequence.length]!
    this.index++
    // Scale the value to the requested range
    const scaled = min + (value * (max - min))
    return Math.floor(scaled)
  }

  nextFloat(min: number, max: number): number {
    if (this.sequence.length === 0) {
      return min
    }
    const value = this.sequence[this.index % this.sequence.length]!
    this.index++
    return min + (value * (max - min))
  }

  shuffle<T>(array: T[]): T[] {
    return [...array]
  }

  pickRandom<T>(array: T[], count: number): T[] {
    return array.slice(0, count)
  }
}