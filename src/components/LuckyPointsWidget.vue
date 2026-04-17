<template>
  <div class="card">
    <h2 class="text-xl font-serif font-bold text-gold-300 mb-4 flex items-center gap-2">
      🍀 Lucky Points
    </h2>

    <!-- Lucky Coins Display -->
    <div class="flex justify-center gap-3 mb-4">
      <button
        v-for="idx in store.luckyPoints.max"
        :key="idx"
        @click="spendLucky"
        :disabled="idx > store.luckyPoints.current"
        :class="[
          'w-12 h-12 rounded-full text-2xl font-bold transition-all',
          idx <= store.luckyPoints.current
            ? 'bg-gold-400 text-slate-900 hover:scale-110 cursor-pointer shadow-lg shadow-gold-400/50 coin-flip'
            : 'bg-slate-700 text-slate-600 cursor-not-allowed border border-slate-600'
        ]"
        :title="idx <= store.luckyPoints.current ? 'Click to spend' : 'No luck left'"
      >
        🪙
      </button>
    </div>

    <!-- Lucky Points Info -->
    <div class="text-center text-sm text-gray-400 mb-4">
      <div class="font-bold text-gold-300">{{ store.luckyPoints.current }} / {{ store.luckyPoints.max }}</div>
      <p class="text-xs mt-1">Spend to re-roll d20s or add to checks</p>
    </div>

    <!-- Spent Points Animation -->
    <div v-if="justSpent" class="animate-pulse text-center text-gold-400 text-sm">
      ✨ Lucky Point Spent! ✨
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { characterStore, spendLuckyPoint } from '../stores/characterStore.js'

const store = characterStore
const justSpent = ref(false)

const spendLucky = () => {
  if (spendLuckyPoint()) {
    justSpent.value = true
    setTimeout(() => {
      justSpent.value = false
    }, 1000)
  }
}
</script>

<style scoped>
</style>
