<script setup lang="ts">
/**
 * HorseCard component - displays individual horse information
 */
import type { Horse } from '@/entities/horse'

interface Props {
  /** Horse data to display */
  horse: Horse
  /** Optional position/rank number */
  position?: number
}

defineProps<Props>()
</script>

<template>
  <div
    data-testid="horse-card"
    class="horse-card flex items-center gap-2 p-2 rounded hover:bg-gray-50 transition-colors"
  >
    <div v-if="position" class="flex-shrink-0">
      <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-xs font-bold">
        {{ position }}
      </span>
    </div>

    <div class="flex-1 min-w-0">
      <div class="font-medium text-gray-900 truncate text-sm">
        {{ horse.name }}
      </div>
    </div>

    <div class="w-16 flex justify-center">
      <span
        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
        :class="[
          horse.condition >= 80 ? 'bg-green-100 text-green-800' :
          horse.condition >= 50 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        ]"
      >
        {{ horse.condition }}
      </span>
    </div>

    <div
      class="horse-color w-5 h-5 rounded-full border-2 border-gray-400 flex-shrink-0"
      :style="{ backgroundColor: horse.color }"
      :title="`Color: ${horse.color}`"
    />
  </div>
</template>

<style scoped>
.horse-card {
  transition: all 0.2s ease;
}

.horse-card:hover {
  transform: translateX(2px);
}
</style>