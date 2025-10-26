<script setup lang="ts">
/**
 * HorsePanel widget - displays list of all horses
 */
import { useHorses } from '@/shared/lib/composables'
import HorseCard from '@/entities/horse/ui/HorseCard.vue'

const { horses, isLoading, error } = useHorses()
</script>

<template>
  <div data-testid="horse-panel" class="horse-panel h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div class="flex-shrink-0 p-3 border-b border-gray-200 bg-slate-900">
      <h2 class="text-base font-bold text-white mb-2">
        Horse List
      </h2>
      <div class="flex items-center gap-2 text-xs font-semibold text-gray-300">
        <div class="w-6"></div>
        <div class="flex-1">Name</div>
        <div class="w-16 text-center">Condition</div>
        <div class="w-10 text-center">Color</div>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-2 min-h-0 bg-white">
      <div v-if="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        <p class="mt-2 text-slate-600">Loading horses...</p>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else-if="horses.length === 0" class="text-center py-8">
        <p class="text-slate-500">No horses generated yet.</p>
        <p class="text-sm text-slate-400 mt-2">Click "Generate Program" to start</p>
      </div>

      <div v-else>
        <HorseCard
          v-for="(horse, index) in horses"
          :key="horse.id"
          :horse="horse"
          :position="index + 1"
          class="mb-1"
        />
      </div>
    </div>
  </div>
</template>
