<script setup lang="ts">
/**
 * RaceTrack widget - displays the racing area with animated horses
 */
import { computed } from 'vue'
import { useRace } from '@/shared/lib/composables'
import { GAME_CONFIG, TRACK_LAYOUT } from '@/shared/lib/constants'
import HorseIcon from '@/entities/horse/ui/HorseIcon.vue'

const { currentRace, horsePositions, isRacing } = useRace()

const horsesByLane = computed(() => {
  const map = new Map()
  horsePositions.value.forEach(hp => {
    const horse = currentRace.value?.horses.find(h => h.id === hp.horseId)
    if (horse) {
      map.set(hp.lane, { ...hp, color: horse.color, name: horse.name })
    }
  })
  return map
})

const lanes = Array.from({ length: GAME_CONFIG.HORSES_PER_RACE }, (_, i) => i + 1)

function getHorsePositionByLane(lane: number) {
  return horsesByLane.value.get(lane)
}
</script>

<template>
  <div data-testid="race-track" class="race-track h-full flex flex-col bg-white rounded-lg border border-gray-200">
    <div class="flex-shrink-0 px-3 py-1 bg-slate-900 rounded-t-lg border-b border-gray-200">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-bold text-white">
          {{ currentRace ? `Round ${currentRace.roundNumber} - ${currentRace.distance}m` : 'Race Track' }}
        </h2>
        <div v-if="isRacing" class="flex items-center gap-1">
          <span class="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></span>
          <span class="text-white text-xs font-semibold">RACING</span>
        </div>
      </div>
    </div>

    <div class="flex-1 relative p-1 overflow-hidden bg-gray-50">
      <div v-if="!currentRace" class="flex items-center justify-center h-full">
        <p class="text-slate-500 text-base">Generate a program to start racing</p>
      </div>

      <div v-else class="relative h-full">
        <div class="absolute right-0 top-0 bottom-0 w-3 bg-blue-600 z-10">
          <div class="absolute inset-0 bg-finish-pattern opacity-30"></div>
          <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 text-white font-bold text-xs tracking-wider whitespace-nowrap">
            FINISH
          </span>
        </div>

        <div class="h-full flex flex-col">
          <div
            v-for="lane in lanes"
            :key="lane"
            class="track-lane relative flex-1 border-b border-dashed border-gray-400 flex items-center min-h-0"
            :class="{ 'border-b-0': lane === 10 }"
          >
            <div class="absolute left-1 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-white text-xs font-bold z-20">
              {{ lane }}
            </div>

            <div
              v-if="getHorsePositionByLane(lane)"
              v-show="getHorsePositionByLane(lane).position < 100"
              class="horse-container absolute transition-all duration-100 flex flex-col items-center"
              :style="{
                left: `${TRACK_LAYOUT.START_LINE_OFFSET + (getHorsePositionByLane(lane).position * TRACK_LAYOUT.TRACK_WIDTH_MULTIPLIER)}%`
              }"
            >
              <div
                  class="text-xs font-semibold text-gray-800 bg-white/95 px-2 rounded-full shadow-sm whitespace-nowrap mb-[-6px] border-2"
                  :style="{ borderColor: getHorsePositionByLane(lane).color }">
                {{ getHorsePositionByLane(lane).name }}
              </div>
              <HorseIcon
                :color="getHorsePositionByLane(lane).color"
                :is-racing="isRacing && !getHorsePositionByLane(lane).isFinished"
                :size="60"
              />
            </div>
          </div>
        </div>

        <div class="absolute top-0 bottom-0 w-0.5 bg-emerald-600 opacity-50" :style="{ left: `${TRACK_LAYOUT.START_LINE_OFFSET}%` }"></div>
      </div>
    </div>

    <div class="flex-shrink-0 py-0.5 px-2 bg-slate-900 rounded-b-lg border-t border-gray-200">
      <p class="text-center text-white text-xs">
        {{ currentRace ? `${currentRace.distance}m Race` : 'Ready to Race' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.track-lane:nth-child(even) {
  background-color: rgba(0,0,0,0.02);
}

.bg-finish-pattern {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(255,255,255,0.5) 5px,
    rgba(255,255,255,0.5) 10px
  );
}

.horse-container {
  transition: left 0.1s linear;
}
</style>