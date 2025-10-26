/**
 * Vuex store type definitions
 */

import type { Horse } from '@/entities/horse/model/types'
import type { Race, RaceSchedule, HorsePosition } from '@/entities/race/model/types'

/**
 * Root state interface
 */
export interface RootState {
  horses: HorsesState
  races: RacesState
}

/**
 * Horses module state
 */
export interface HorsesState {
  /** All horses in the game */
  horses: Horse[]
  /** Loading state */
  isLoading: boolean
  /** Error message if any */
  error: string | null
}

/**
 * Races module state
 */
export interface RacesState {
  /** Current race schedule */
  schedule: RaceSchedule | null
  /** Currently active race */
  currentRace: Race | null
  /** Index of current race in schedule */
  currentRaceIndex: number
  /** Horse positions during race */
  horsePositions: HorsePosition[]
  /** Is a race currently running */
  isRacing: boolean
  /** Is the race paused */
  isPaused: boolean
}