<script setup lang="ts">
/**
 * ResultsPanel widget - displays race results
 */
import { useRace } from '@/shared/lib/composables'
import { formatPosition, formatOrdinal } from '@/shared/lib/formatting'

const { schedule } = useRace()

/**
 * Get horse name from race by ID
 */
function getHorseName(raceHorses: any[], horseId: string): string {
  const horse = raceHorses.find(h => h.id === horseId)
  return horse?.name || 'Unknown'
}

/**
 * Get lane number from race by ID
 */
function getLaneNumber(raceHorses: any[], horseId: string): number {
  const horse = raceHorses.find(h => h.id === horseId)
  return horse?.laneNumber || 0
}
</script>

<template>
  <div data-testid="results-panel" class="results-panel h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div class="flex-shrink-0 bg-slate-900 px-3 py-1.5 border-b border-gray-200">
      <h2 class="text-base font-bold text-white">Results</h2>
    </div>

    <div class="flex-1 overflow-y-auto min-h-0 p-3 bg-white">
      <div v-if="!schedule" class="text-slate-500 text-center py-4">
        No results yet
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(race, index) in schedule.races"
          :key="race.id"
        >
          <div v-if="race.results" class="border border-emerald-200 rounded p-2 bg-emerald-50">
            <div class="font-bold text-sm mb-1 text-emerald-900">
              {{ formatOrdinal(index + 1) }} Lap - {{ race.distance }}m ✓
            </div>

            <div class="grid grid-cols-2 gap-x-2 text-xs">
              <div
                v-for="(horseId, position) in race.results.positions"
                :key="horseId"
                class="flex items-center gap-1 py-0.5"
              >
                <span class="font-bold text-emerald-700 mr-1">{{ formatPosition(position + 1) }}</span>
                <span class="font-mono text-slate-500 mr-1">{{ formatPosition(getLaneNumber(race.horses, horseId)) }}</span>
                <span class="truncate flex-1 text-slate-700">{{ getHorseName(race.horses, horseId) }}</span>
              </div>
            </div>
          </div>

          <div v-else class="border border-gray-200 rounded p-2 bg-white">
            <div class="font-bold text-sm text-slate-400">
              {{ formatOrdinal(index + 1) }} Lap - {{ race.distance }}m
            </div>
            <div class="text-xs text-slate-400 mt-1">
              Not started
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>