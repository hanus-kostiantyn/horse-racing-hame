<script setup lang="ts">
/**
 * GenerateButton component - triggers generation of horses and race schedule
 */
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '@/shared/api/store/types'
import { useHorses, useRace } from '@/shared/lib/composables'

const store = useStore<RootState>()

const { isLoading } = useHorses()
const { hasSchedule, isRacing } = useRace()

const isDisabled = computed(() => isRacing.value || isLoading.value)

/**
 * Handles generate button click
 * Generates new horses and race schedule for a fresh game
 */
async function handleGenerate() {
  try {
    await store.dispatch('horses/generateHorses')
    await store.dispatch('races/generateSchedule')
  } catch (error) {
    console.error('Failed to generate races:', error)
  }
}
</script>

<template>
  <button
    data-testid="generate-button"
    class="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 uppercase tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
    :disabled="isDisabled"
    @click="handleGenerate"
  >
    <span v-if="isLoading" class="flex items-center gap-2">
      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Generating...
    </span>
    <span v-else>
      {{ hasSchedule ? 'REGENERATE PROGRAM' : 'GENERATE PROGRAM' }}
    </span>
  </button>
</template>