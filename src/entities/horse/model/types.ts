/**
 * Horse entity type definitions
 */

/**
 * Represents a horse in the racing game
 */
export interface Horse {
  /** Unique identifier for the horse */
  id: string
  /** Display name of the horse */
  name: string
  /** Condition score (1-100) affecting performance, temporary adjusted to 60-100 */
  condition: number
  /** Visual color representation */
  color: string
}

/**
 * Horse creation parameters
 */
export interface CreateHorseParams {
  /** Optional ID, will be generated if not provided */
  id?: string
  /** Optional name, will be randomly selected if not provided */
  name?: string
  /** Optional condition, will be randomly generated if not provided */
  condition?: number
  /** Optional color, will be assigned if not provided */
  color?: string
}