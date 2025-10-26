/**
 * Race entity public API
 */

export type {
  Race,
  RaceResult,
  RaceSchedule,
  HorsePosition,
  RaceHorse,
} from './model/types'

export { RaceStatus } from './model/types'

// Domain logic
export {
  RaceFactory,
  RaceService,
  raceFactory,
  raceService,
} from './model/race'

// Animation service
export {
  RaceAnimationService,
  raceAnimationService,
} from './model/animation'
export type { AnimationCallbacks } from './model/animation'