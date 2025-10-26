/**
 * Vuex module for horse state management
 */

import type { Module } from 'vuex'
import type { HorsesState, RootState } from './types'
import type { Horse } from '@/entities/horse/model/types'
import { horseFactory } from '@/entities/horse/model/horse'

/**
 * Horses module for Vuex store
 */
export const horsesModule: Module<HorsesState, RootState> = {
  namespaced: true,

  state: (): HorsesState => ({
    horses: [],
    isLoading: false,
    error: null,
  }),

  mutations: {
    /**
     * Sets the horses list
     */
    SET_HORSES(state, horses: Horse[]) {
      state.horses = horses
    },

    /**
     * Sets loading state
     */
    SET_LOADING(state, isLoading: boolean) {
      state.isLoading = isLoading
    },

    /**
     * Sets error state
     */
    SET_ERROR(state, error: string | null) {
      state.error = error
    },
  },

  actions: {
    /**
     * Generates a new pool of horses
     */
    async generateHorses({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 300))

        const horses = horseFactory.createHorsePool()
        commit('SET_HORSES', horses)
      } catch (error) {
        commit('SET_ERROR', error instanceof Error ? error.message : 'Failed to generate horses')
      } finally {
        commit('SET_LOADING', false)
      }
    },
  },

  getters: {
    /**
     * Checks if horses have been generated
     */
    hasHorses: (state) => {
      return state.horses.length > 0
    },
  },
}