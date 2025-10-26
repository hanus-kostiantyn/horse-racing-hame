/**
 * Race entity type definitions
 */

import type { Horse } from '@/entities/horse/model/types'

/**
 * Horse with assigned lane number for racing
 */
export interface RaceHorse extends Horse {
  /** Assigned lane number (1-10) for this race */
  laneNumber: number
}

/**
 * Represents a single race round
 */
export interface Race {
  /** Unique identifier for the race */
  id: string
  /** Round number (1-6) */
  roundNumber: number
  /** Distance in meters */
  distance: number
  /** Horses participating in this race with assigned lanes */
  horses: RaceHorse[]
  /** Race results after completion */
  results?: RaceResult
  /** Current race status */
  status: RaceStatus
}

/**
 * Race status enum
 */
export enum RaceStatus {
  /** Race is scheduled but not started */
  SCHEDULED = 'scheduled',
  /** Race is currently in progress */
  IN_PROGRESS = 'in_progress',
  /** Race has completed */
  COMPLETED = 'completed',
}

/**
 * Result of a completed race
 */
export interface RaceResult {
  /** Race ID */
  raceId: string
  /** Ordered list of horse IDs by finish position */
  positions: string[]
  /** Timestamp when race completed */
  completedAt: Date
  /** Duration of the race in milliseconds */
  duration: number
}

/**
 * Complete race schedule for all rounds
 */
export interface RaceSchedule {
  /** Unique schedule ID */
  id: string
  /** All races in the schedule */
  races: Race[]
  /** Timestamp when schedule was generated */
  generatedAt: Date
}

/**
 * Horse position during race animation
 */
export interface HorsePosition {
  /** Horse ID */
  horseId: string
  /** Current position as percentage of track (0-100) */
  position: number
  /** Current lane number (1-10) */
  lane: number
  /** Has finished the race */
  isFinished: boolean
  /** Timestamp when horse finished (milliseconds) */
  finishTime?: number
}