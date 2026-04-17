<template>
  <CardFrame title="💀 Death Saves" suit="coins" variant="silver" :show-flip="false">
    <div class="space-y-4">
      <!-- Status Display -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="bg-slate-700 rounded p-3 text-center">
          <div class="text-xs text-emerald-400 font-bold uppercase">Successes</div>
          <div class="text-3xl font-bold text-emerald-400">{{ deathSaves.successes }}/3</div>
        </div>

        <div class="bg-slate-700 rounded p-3 text-center">
          <div class="text-xs text-fortuneRed font-bold uppercase">Failures</div>
          <div class="text-3xl font-bold text-fortuneRed">{{ deathSaves.failures }}/3</div>
        </div>
      </div>

      <!-- Status Message -->
      <div
        v-if="statusMessage"
        :class="[
          'p-3 rounded text-center font-bold text-sm',
          statusMessage === 'STABLE' ? 'bg-emerald-500/20 text-emerald-400' :
          statusMessage === 'DEAD' ? 'bg-red-500/20 text-red-400' :
          'bg-amber-500/20 text-amber-400'
        ]"
      >
        {{ statusMessage }}
      </div>

      <!-- Success Circles -->
      <div>
        <div class="text-xs font-bold text-emerald-400 mb-2">Successes</div>
        <div class="flex gap-2">
          <button
            v-for="i in 3"
            :key="`success-${i}`"
            @click="toggleSuccess(i)"
            :disabled="isOutcome"
            :class="[
              'w-8 h-8 rounded-full border-2 transition-all',
              i <= deathSaves.successes
                ? 'bg-emerald-500 border-emerald-400'
                : 'bg-slate-700 border-slate-600 hover:border-emerald-400'
            ]"
            :title="`Success ${i}`"
          >
            <span v-if="i <= deathSaves.successes" class="text-sm font-bold">✓</span>
          </button>
        </div>
      </div>

      <!-- Failure Circles -->
      <div>
        <div class="text-xs font-bold text-fortuneRed mb-2">Failures</div>
        <div class="flex gap-2">
          <button
            v-for="i in 3"
            :key="`failure-${i}`"
            @click="toggleFailure(i)"
            :disabled="isOutcome"
            :class="[
              'w-8 h-8 rounded-full border-2 transition-all',
              i <= deathSaves.failures
                ? 'bg-fortuneRed border-fortuneRed'
                : 'bg-slate-700 border-slate-600 hover:border-fortuneRed'
            ]"
            :title="`Failure ${i}`"
          >
            <span v-if="i <= deathSaves.failures" class="text-sm font-bold">✕</span>
          </button>
        </div>
      </div>

      <!-- Reset Button -->
      <button
        @click="resetDeathSaves"
        class="btn btn-secondary w-full text-sm"
        :disabled="!isOutcome"
      >
        Reset (Return to Combat)
      </button>

      <!-- Info -->
      <div class="text-xs text-gray-400 italic border-t border-slate-700 pt-2">
        Roll d20 when you fall to 0 HP. 10+ = success, &lt;10 = failure. Crits count as 2.
      </div>
    </div>
  </CardFrame>
</template>

<script setup>
import { computed } from 'vue'
import CardFrame from './CardFrame.vue'
import { characterStore } from '../stores/characterStore.js'

// Initialize death saves if not exists
if (!characterStore.deathSaves) {
  characterStore.deathSaves = {
    successes: 0,
    failures: 0
  }
}

const deathSaves = characterStore.deathSaves

const isOutcome = computed(() => {
  return deathSaves.successes === 3 || deathSaves.failures === 3
})

const statusMessage = computed(() => {
  if (deathSaves.successes === 3) {
    return 'STABLE'
  } else if (deathSaves.failures === 3) {
    return 'DEAD'
  } else if (deathSaves.successes > 0 || deathSaves.failures > 0) {
    return `${deathSaves.successes}S / ${deathSaves.failures}F`
  }
  return null
})

const toggleSuccess = (index) => {
  if (index <= deathSaves.successes) {
    deathSaves.successes = index - 1
  } else {
    deathSaves.successes = index
  }
}

const toggleFailure = (index) => {
  if (index <= deathSaves.failures) {
    deathSaves.failures = index - 1
  } else {
    deathSaves.failures = index
  }
}

const resetDeathSaves = () => {
  deathSaves.successes = 0
  deathSaves.failures = 0
}
</script>

<style scoped>
</style>
