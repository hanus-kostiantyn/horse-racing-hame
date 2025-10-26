<script setup lang="ts">
import GenerateButton from '@/features/generate-races/ui/GenerateButton.vue'
import StartButton from '@/features/control-race/ui/StartButton.vue'
import HorsePanel from '@/widgets/horse-panel/HorsePanel.vue'
import RaceTrack from '@/widgets/race-track/RaceTrack.vue'
import ProgramPanel from '@/widgets/program-panel/ProgramPanel.vue'
import ResultsPanel from '@/widgets/results-panel/ResultsPanel.vue'
</script>

<template>
  <div data-testid="game-page" class="h-screen flex flex-col bg-gray-50">
    <header class="bg-slate-900 px-6 py-4 border-b border-slate-200">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-white">Horse Racing</h1>
        <div class="flex gap-4">
          <GenerateButton />
          <StartButton />
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-hidden">
      <div class="h-full grid grid-cols-12 grid-rows-1 gap-4 p-4">
        <div class="col-span-2 h-full">
          <HorsePanel />
        </div>

        <div class="col-span-6 h-full">
          <RaceTrack />
        </div>

        <div class="col-span-2 h-full">
          <ProgramPanel />
        </div>

        <div class="col-span-2 h-full">
          <ResultsPanel />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
</style>