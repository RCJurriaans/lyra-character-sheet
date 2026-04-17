<template>
  <CardFrame title="📊 Roll Statistics" suit="coins" variant="purple" :show-flip="false">
    <div class="space-y-3">
      <!-- Overall Statistics -->
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-slate-700 rounded p-2 text-center">
          <div class="text-xs text-gray-400">Total Rolls</div>
          <div class="text-2xl font-bold text-gold-300">{{ totalRolls }}</div>
        </div>
        <div class="bg-slate-700 rounded p-2 text-center">
          <div class="text-xs text-gray-400">Average</div>
          <div class="text-2xl font-bold text-gold-300">{{ averageRoll }}</div>
        </div>
        <div class="bg-slate-700 rounded p-2 text-center">
          <div class="text-xs text-emerald-400">Critical Hits (20)</div>
          <div class="text-2xl font-bold text-emerald-400">{{ criticalHits }}</div>
        </div>
        <div class="bg-slate-700 rounded p-2 text-center">
          <div class="text-xs text-fortuneRed">Critical Fails (1)</div>
          <div class="text-2xl font-bold text-fortuneRed">{{ criticalFails }}</div>
        </div>
      </div>

      <!-- Roll Type Breakdown -->
      <div class="border-t border-slate-700 pt-3">
        <h3 class="text-sm font-bold text-gold-300 mb-2">By Type</h3>
        <div class="space-y-1 text-sm">
          <div v-for="(count, type) in rollsByType" :key="type" class="flex justify-between text-gray-100">
            <span class="capitalize">{{ type }}:</span>
            <span class="font-semibold">{{ count }}</span>
          </div>
        </div>
      </div>

      <!-- D20 Distribution Chart -->
      <div class="border-t border-slate-700 pt-3">
        <h3 class="text-sm font-bold text-gold-300 mb-2">D20 Distribution</h3>
        <div class="space-y-1 text-xs">
          <div v-for="num in 20" :key="num" class="flex items-center gap-2">
            <span class="w-4 text-right">{{ num }}</span>
            <div class="flex-1 bg-slate-700 rounded h-4 relative">
              <div
                class="bg-gold-400 h-4 rounded transition-all"
                :style="{ width: (d20Distribution[num] / maxD20Count) * 100 + '%' }"
              ></div>
              <span class="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-900">
                {{ d20Distribution[num] || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Rolls -->
      <div class="border-t border-slate-700 pt-3">
        <h3 class="text-sm font-bold text-gold-300 mb-2">Recent Rolls (Last 10)</h3>
        <div class="space-y-1 max-h-32 overflow-y-auto">
          <div
            v-for="(roll, idx) in recentRolls"
            :key="idx"
            class="flex items-center justify-between text-sm p-1 bg-slate-700 rounded text-gray-200"
          >
            <span class="text-xs text-gray-400">
              <span v-if="roll.skill">{{ roll.skill }}</span>
              <span v-else-if="roll.type" class="capitalize">{{ roll.type }}</span>
            </span>
            <span :class="[
              'font-bold',
              roll.d20 === 20 ? 'text-emerald-400' : roll.d20 === 1 ? 'text-fortuneRed' : 'text-gold-400'
            ]">
              {{ roll.total }}
            </span>
          </div>

          <div v-if="recentRolls.length === 0" class="text-center text-gray-400 text-sm py-2">
            No rolls yet
          </div>
        </div>
      </div>

      <!-- Clear History -->
      <button
        @click="clearHistory"
        class="btn btn-secondary w-full text-sm"
        :disabled="totalRolls === 0"
      >
        Clear History
      </button>
    </div>
  </CardFrame>
</template>

<script setup>
import { computed } from 'vue'
import CardFrame from './CardFrame.vue'
import { characterStore } from '../stores/characterStore.js'

// Initialize roll history if not exists
if (!characterStore.rollHistory) {
  characterStore.rollHistory = []
}

const totalRolls = computed(() => characterStore.rollHistory?.length || 0)

const averageRoll = computed(() => {
  if (totalRolls.value === 0) return '—'
  const sum = characterStore.rollHistory?.reduce((acc, roll) => acc + (roll.total || 0), 0) || 0
  return (sum / totalRolls.value).toFixed(1)
})

const criticalHits = computed(() => {
  return characterStore.rollHistory?.filter(roll => roll.d20 === 20).length || 0
})

const criticalFails = computed(() => {
  return characterStore.rollHistory?.filter(roll => roll.d20 === 1).length || 0
})

const rollsByType = computed(() => {
  const types = {}
  characterStore.rollHistory?.forEach(roll => {
    const type = roll.type || 'unknown'
    types[type] = (types[type] || 0) + 1
  })
  return types
})

const d20Distribution = computed(() => {
  const dist = {}
  for (let i = 1; i <= 20; i++) {
    dist[i] = 0
  }
  characterStore.rollHistory?.forEach(roll => {
    if (roll.d20 >= 1 && roll.d20 <= 20) {
      dist[roll.d20]++
    }
  })
  return dist
})

const maxD20Count = computed(() => {
  return Math.max(...Object.values(d20Distribution.value), 1)
})

const recentRolls = computed(() => {
  return characterStore.rollHistory?.slice(-10).reverse() || []
})

const clearHistory = () => {
  if (confirm('Clear all roll history? This cannot be undone.')) {
    characterStore.rollHistory = []
  }
}
</script>

<style scoped>
</style>
