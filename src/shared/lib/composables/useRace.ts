/**
 * Composable for race management
 */

import { computed } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '@/shared/api/store/types'
import type { Race } from '@/entities/race'

export function useRace() {
  const store = useStore<RootState>()

  // State
  const schedule = computed(() => store.state.races.schedule)
  const currentRace = computed(() => store.state.races.currentRace)
  const currentRaceIndex = computed(() => store.state.races.currentRaceIndex)
  const horsePositions = computed(() => store.state.races.horsePositions)
  const isRacing = computed(() => store.state.races.isRacing)
  const isPaused = computed(() => store.state.races.isPaused)

  // Getters
  const currentRaceNumber = computed(() => store.getters['races/currentRaceNumber'])
  const totalRaces = computed(() => store.getters['races/totalRaces'])
  const hasNextRace = computed(() => store.getters['races/hasNextRace'])
  const completedRaces = computed(() => store.getters['races/completedRaces'])
  const hasSchedule = computed(() => store.getters['races/hasSchedule'])

  const isRaceCompleted = (race: Race | null): boolean => {
    return race?.status === 'completed'
  }

  const isCurrentRace = (index: number): boolean => {
    return index === currentRaceIndex.value
  }

  return {
    // State
    schedule,
    currentRace,
    currentRaceIndex,
    horsePositions,
    isRacing,
    isPaused,

    // Getters
    currentRaceNumber,
    totalRaces,
    hasNextRace,
    completedRaces,
    hasSchedule,

    // Helpers
    isRaceCompleted,
    isCurrentRace,
  }
}