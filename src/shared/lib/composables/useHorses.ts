/**
 * Composable for horse management
 */

import { computed } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '@/shared/api/store/types'

export function useHorses() {
  const store = useStore<RootState>()

  // State
  const horses = computed(() => store.state.horses.horses)
  const isLoading = computed(() => store.state.horses.isLoading)
  const error = computed(() => store.state.horses.error)

  // Getters
  const hasHorses = computed(() => store.getters['horses/hasHorses'])

  return {
    // State
    horses,
    isLoading,
    error,

    // Getters
    hasHorses,
  }
}
