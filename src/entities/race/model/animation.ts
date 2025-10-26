/**
 * Race Animation Service
 * Handles race animation lifecycle and position updates
 */

import type { Horse } from '@/entities/horse/model/types'
import type { HorsePosition } from './types'
import { raceService } from './race'

/**
 * Callback types for animation events
 */
export interface AnimationCallbacks {
  onPositionUpdate: (positions: HorsePosition[]) => void
  onRaceComplete: (positions: HorsePosition[], duration: number) => void
  onFrame?: (deltaTime: number) => void
}

/**
 * Animation state management
 */
interface AnimationState {
  frameId: number | null
  startTime: number | null
  pausedElapsedTime: number | null
  lastFrameTime: number | null
  isPaused: boolean
  isRunning: boolean
}

/**
 * Service for managing race animations
 */
export class RaceAnimationService {
  private state: AnimationState = {
    frameId: null,
    startTime: null,
    pausedElapsedTime: null,
    lastFrameTime: null,
    isPaused: false,
    isRunning: false,
  }

  /**
   * Starts the race animation
   * @param positions - Initial horse positions
   * @param horses - Horse data for speed calculations
   * @param callbacks - Event callbacks
   */
  start(
    positions: HorsePosition[],
    horses: Horse[],
    callbacks: AnimationCallbacks
  ): void {
    if (this.state.isRunning && !this.state.isPaused) {
      console.warn('Animation already running')
      return
    }

    if (this.state.isPaused) {
      this.resume(positions, horses, callbacks)
      return
    }

    this.state.isRunning = true
    this.state.isPaused = false
    this.state.startTime = performance.now()
    this.state.lastFrameTime = performance.now()

    this.animate(positions, horses, callbacks)
  }

  /**
   * Stops/pauses the animation
   * @returns The elapsed time when paused
   */
  stop(): number | null {
    if (this.state.frameId !== null) {
      cancelAnimationFrame(this.state.frameId)
      this.state.frameId = null
    }

    // Store elapsed time when pausing
    if (this.state.isRunning && this.state.startTime) {
      const elapsedTime = performance.now() - this.state.startTime
      this.state.pausedElapsedTime = elapsedTime
      this.state.isPaused = true
      this.state.isRunning = false
      return elapsedTime
    }

    this.state.isRunning = false
    return null
  }

  /**
   * Resets the animation state
   */
  reset(): void {
    if (this.state.frameId !== null) {
      cancelAnimationFrame(this.state.frameId)
    }

    this.state = {
      frameId: null,
      startTime: null,
      pausedElapsedTime: null,
      lastFrameTime: null,
      isPaused: false,
      isRunning: false,
    }
  }

  /**
   * Gets the current animation state
   */
  getState(): Readonly<AnimationState> {
    return { ...this.state }
  }

  /**
   * Checks if animation is running
   */
  isRunning(): boolean {
    return this.state.isRunning
  }

  /**
   * Checks if animation is paused
   */
  isPaused(): boolean {
    return this.state.isPaused
  }

  /**
   * Resumes animation from paused state
   */
  private resume(
    positions: HorsePosition[],
    horses: Horse[],
    callbacks: AnimationCallbacks
  ): void {
    if (!this.state.isPaused) {
      return
    }

    this.state.isPaused = false
    this.state.isRunning = true
    this.state.lastFrameTime = performance.now()

    // Adjust start time to account for pause
    if (this.state.pausedElapsedTime !== null) {
      this.state.startTime = performance.now() - this.state.pausedElapsedTime
    }

    this.animate(positions, horses, callbacks)
  }

  /**
   * Main animation loop
   */
  private animate(
    positions: HorsePosition[],
    horses: Horse[],
    callbacks: AnimationCallbacks
  ): void {
    const currentTime = performance.now()
    const deltaTime = (currentTime - (this.state.lastFrameTime ?? currentTime)) / 1000
    this.state.lastFrameTime = currentTime

    const { positions: updatedPositions, isFinished } = raceService.updatePositions(
      positions,
      horses,
      deltaTime,
      currentTime
    )

    callbacks.onPositionUpdate(updatedPositions)

    if (callbacks.onFrame) {
      callbacks.onFrame(deltaTime)
    }

    if (isFinished) {
      const duration = currentTime - (this.state.startTime ?? currentTime)
      callbacks.onRaceComplete(updatedPositions, duration)
      this.reset()
    } else {
      this.state.frameId = requestAnimationFrame(() => {
        this.animate(updatedPositions, horses, callbacks)
      })
    }
  }
}

export const raceAnimationService = new RaceAnimationService()