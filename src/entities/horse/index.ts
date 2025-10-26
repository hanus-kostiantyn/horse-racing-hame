/**
 * Horse entity public API
 */

export type { Horse, CreateHorseParams } from './model/types'

// Domain logic
export { HorseFactory, horseFactory } from './model/horse'