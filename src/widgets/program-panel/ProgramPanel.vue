<script setup lang="ts">
/**
 * ProgramPanel widget - displays race schedule/program
 */
import { useRace } from '@/shared/lib/composables'
import { formatPosition, formatOrdinal } from '@/shared/lib/formatting'
import type { Race } from '@/entities/race/model/types'

const { schedule, isCurrentRace, isRaceCompleted } = useRace()

/**
 * Get race status class based on race state
 * @param race - Race object
 * @param index - Race index
 * @returns CSS classes for race status
 */
function getRaceStatusClass(race: Race, index: number): string {
  if (isRaceCompleted(race)) return 'bg-emerald-50 text-emerald-900 border-emerald-200'
  if (isCurrentRace(index)) return 'bg-blue-50 text-blue-900 border-blue-200'
  return 'bg-white text-slate-700'
}
</script>

<template>
  <div data-testid="program-panel" class="program-panel h-full flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
    <div class="flex-shrink-0 bg-slate-900 px-3 py-1.5 border-b border-gray-200">
      <h2 class="text-base font-bold text-white">Program</h2>
    </div>

    <div class="flex-1 overflow-y-auto min-h-0 p-3 bg-white">
      <div v-if="!schedule" class="text-slate-500 text-center py-4">
        No program generated yet
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="(race, index) in schedule.races"
          :key="race.id"
          class="border border-gray-200 rounded p-2 transition-colors"
          :class="getRaceStatusClass(race, index)"
        >
          <div class="font-bold text-sm mb-1">
            {{ formatOrdinal(index + 1) }} Lap - {{ race.distance }}m
          </div>

          <div class="grid grid-cols-2 gap-x-2 text-xs">
            <div
              v-for="(horse, horseIndex) in race.horses"
              :key="horse.id"
              class="flex items-center gap-1 py-0.5"
            >
              <span class="font-mono text-slate-500 mr-1">{{ formatPosition(horseIndex + 1) }}</span>
              <span class="truncate flex-1 text-slate-700">{{ horse.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>