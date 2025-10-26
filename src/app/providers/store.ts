/**
 * Main Vuex store configuration
 */

import { createStore } from 'vuex'
import type { RootState } from '@/shared/api/store/types'
import { horsesModule } from '@/shared/api/store/horses'
import { racesModule } from '@/shared/api/store/races'

/**
 * Creates and configures the Vuex store
 * @returns Configured store instance
 */
export function createAppStore() {
  return createStore<RootState>({
    modules: {
      horses: horsesModule,
      races: racesModule,
    },

    strict: import.meta.env.DEV,
  })
}

/**
 * Store instance
 */
export const store = createAppStore()