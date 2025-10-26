<script setup lang="ts">
/**
 * StartButton component - controls race start/pause
 */
import { computed } from 'vue'
import { useStore } from 'vuex'
import type { RootState } from '@/shared/api/store/types'
import { useRace } from '@/shared/lib/composables'

const store = useStore<RootState>()

const {
  isRacing,
  hasSchedule,
  currentRace,
  hasNextRace,
} = useRace()

const isDisabled = computed(() => {
  if (!hasSchedule.value || !currentRace.value) return true
  return currentRace.value.status === 'completed' && !hasNextRace.value;

})

/**
 * Handles button click - starts race or moves to next race
 */
async function handleClick() {
  if (isRacing.value) {
    store.dispatch('races/stopRace')
  } else if (currentRace.value?.status === 'completed') {
    store.dispatch('races/nextRace')
  } else {
    store.dispatch('races/startRace')
  }
}

const buttonText = computed(() => {
  if (isRacing.value) return 'PAUSE'
  if (currentRace.value?.status === 'completed') {
    return hasNextRace.value ? 'NEXT RACE' : 'ALL RACES COMPLETED'
  }
  return 'START'
})

const buttonClass = computed(() => {
  if (isRacing.value) return 'bg-orange-600 hover:bg-orange-700'
  if (currentRace.value?.status === 'completed' && hasNextRace.value) {
    return 'bg-purple-600 hover:bg-purple-700'
  }
  return 'bg-green-600 hover:bg-green-700'
})
</script>

<template>
  <button
    data-testid="start-button"
    class="px-6 py-2 font-semibold text-white rounded-lg uppercase tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
    :class="buttonClass"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <span class="flex items-center gap-2">
      <!-- Play icon -->
      <svg v-if="!isRacing && currentRace?.status !== 'completed'" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
      </svg>

      <!-- Pause icon -->
      <svg v-else-if="isRacing" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>

      <!-- Next icon -->
      <svg v-else-if="hasNextRace" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>

      {{ buttonText }}
    </span>
  </button>
</template>