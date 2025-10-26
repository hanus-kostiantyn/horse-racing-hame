/**
 * Vuex module for race state management
 */

import type { Module } from 'vuex'
import type { RacesState, RootState } from './types'
import type { Race, RaceSchedule, HorsePosition, RaceResult } from '@/entities/race/model/types'
import { RaceStatus } from '@/entities/race/model/types'
import { raceFactory, raceService } from '@/entities/race/model/race'
import { raceAnimationService } from '@/entities/race/model/animation'
import type { AnimationCallbacks } from '@/entities/race/model/animation'

/**
 * Races module for Vuex store
 */
export const racesModule: Module<RacesState, RootState> = {
  namespaced: true,

  state: (): RacesState => ({
    schedule: null,
    currentRace: null,
    currentRaceIndex: 0,
    horsePositions: [],
    isRacing: false,
    isPaused: false,
  }),

  mutations: {
    /**
     * Sets the race schedule
     */
    SET_SCHEDULE(state, schedule: RaceSchedule | null) {
      state.schedule = schedule
    },

    /**
     * Sets the current race
     */
    SET_CURRENT_RACE(state, race: Race | null) {
      state.currentRace = race
    },

    /**
     * Sets the current race index
     */
    SET_CURRENT_RACE_INDEX(state, index: number) {
      state.currentRaceIndex = index
    },

    /**
     * Sets horse positions
     */
    SET_HORSE_POSITIONS(state, positions: HorsePosition[]) {
      state.horsePositions = positions
    },

    /**
     * Sets racing state
     */
    SET_IS_RACING(state, isRacing: boolean) {
      state.isRacing = isRacing
    },

    /**
     * Sets paused state
     */
    SET_IS_PAUSED(state, isPaused: boolean) {
      state.isPaused = isPaused
    },

    /**
     * Updates race status
     */
    UPDATE_RACE_STATUS(state, { raceId, status }: { raceId: string, status: RaceStatus }) {
      if (state.currentRace?.id === raceId) {
        state.currentRace.status = status
      }
      if (state.schedule) {
        const race = state.schedule.races.find(r => r.id === raceId)
        if (race) {
          race.status = status
        }
      }
    },

    /**
     * Sets race results
     */
    SET_RACE_RESULTS(state, { raceId, results }: { raceId: string, results: RaceResult }) {
      if (state.currentRace?.id === raceId) {
        state.currentRace.results = results
      }
      if (state.schedule) {
        const race = state.schedule.races.find(r => r.id === raceId)
        if (race) {
          race.results = results
        }
      }
    },
  },

  actions: {
    /**
     * Generates a new race schedule
     */
    async generateSchedule({ commit, rootState }) {
      const horses = rootState.horses.horses

      if (horses.length === 0) {
        throw new Error('No horses available. Generate horses first.')
      }

      commit('SET_CURRENT_RACE', null)
      commit('SET_CURRENT_RACE_INDEX', 0)
      commit('SET_HORSE_POSITIONS', [])
      commit('SET_IS_RACING', false)

      const schedule = raceFactory.createSchedule(horses)
      commit('SET_SCHEDULE', schedule)

      if (schedule.races.length > 0) {
        const firstRace = schedule.races[0]!
        commit('SET_CURRENT_RACE', firstRace)
        commit('SET_CURRENT_RACE_INDEX', 0)

        const positions = raceService.initializePositions(firstRace)
        commit('SET_HORSE_POSITIONS', positions)
      }
    },

    /**
     * Starts the current race
     */
    async startRace({ commit, state }) {
      const race = state.currentRace
      if (!race || (state.isRacing && !state.isPaused)) {
        return
      }

      if (!state.isPaused) {
        const positions = raceService.initializePositions(race!)
        commit('SET_HORSE_POSITIONS', positions)
        commit('UPDATE_RACE_STATUS', { raceId: race.id, status: RaceStatus.IN_PROGRESS })
      }

      commit('SET_IS_RACING', true)
      commit('SET_IS_PAUSED', false)

      const callbacks: AnimationCallbacks = {
        onPositionUpdate: (positions) => {
          commit('SET_HORSE_POSITIONS', positions)
        },
        onRaceComplete: (positions, duration) => {
          const results = raceService.determineResults(race!, positions, duration)
          commit('SET_RACE_RESULTS', { raceId: race!.id, results })
          commit('UPDATE_RACE_STATUS', { raceId: race!.id, status: RaceStatus.COMPLETED })
          commit('SET_IS_RACING', false)
          commit('SET_IS_PAUSED', false)
        },
      }

      raceAnimationService.start(state.horsePositions, race!.horses, callbacks)
    },

    /**
     * Stops/Pauses the current race
     */
    stopRace({ commit, state }) {
      if (!state.isRacing) {
        return
      }

      raceAnimationService.stop()

      commit('SET_IS_RACING', false)
      commit('SET_IS_PAUSED', true)
    },

    /**
     * Moves to the next race
     */
    nextRace({ commit, state }) {
      if (!state.schedule) {
        return
      }

      const nextIndex = state.currentRaceIndex + 1
      if (nextIndex < state.schedule.races.length) {
        const nextRace = state.schedule.races[nextIndex]!
        commit('SET_CURRENT_RACE_INDEX', nextIndex)
        commit('SET_CURRENT_RACE', nextRace)

        raceAnimationService.reset()
        commit('SET_IS_PAUSED', false)

        const positions = raceService.initializePositions(nextRace)
        commit('SET_HORSE_POSITIONS', positions)
      }
    },

    /**
     * Resets all races
     */
    resetRaces({ commit }) {
      raceAnimationService.reset()

      commit('SET_SCHEDULE', null)
      commit('SET_CURRENT_RACE', null)
      commit('SET_CURRENT_RACE_INDEX', 0)
      commit('SET_HORSE_POSITIONS', [])
      commit('SET_IS_RACING', false)
      commit('SET_IS_PAUSED', false)
    },
  },

  getters: {
    /**
     * Gets the current race number (1-based)
     */
    currentRaceNumber: (state) => {
      return state.currentRaceIndex + 1
    },

    /**
     * Gets the total number of races
     */
    totalRaces: (state) => {
      return state.schedule?.races.length || 0
    },

    /**
     * Checks if there's a next race
     */
    hasNextRace: (state) => {
      if (!state.schedule) return false
      return state.currentRaceIndex < state.schedule.races.length - 1
    },

    /**
     * Gets completed races
     */
    completedRaces: (state) => {
      if (!state.schedule) return []
      return state.schedule.races.filter(r => r.status === RaceStatus.COMPLETED)
    },

    /**
     * Checks if schedule is generated
     */
    hasSchedule: (state) => {
      return state.schedule !== null
    },
  },
}