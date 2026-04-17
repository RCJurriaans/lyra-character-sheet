<template>
  <div class="card">
    <button @click="expanded = !expanded" class="w-full flex items-center justify-between mb-4 hover:text-gold-300 transition-colors">
      <h2 class="text-lg font-serif font-bold text-gold-300 flex items-center gap-2">
        📜 Character Lore
      </h2>
      <span class="text-lg">{{ expanded ? '▼' : '▶' }}</span>
    </button>

    <div v-if="expanded" class="space-y-3 text-sm">
      <!-- Personality -->
      <div>
        <div class="text-xs font-bold text-gold-400 uppercase mb-1">Personality Traits</div>
        <p class="italic text-gray-300">{{ store.traits.personality }}</p>
      </div>

      <!-- Ideal -->
      <div class="border-t border-slate-700 pt-3">
        <div class="text-xs font-bold text-gold-400 uppercase mb-1">Ideal</div>
        <p class="italic text-gray-300">{{ store.traits.ideal }}</p>
      </div>

      <!-- Bond -->
      <div class="border-t border-slate-700 pt-3">
        <div class="text-xs font-bold text-gold-400 uppercase mb-1">Bond</div>
        <p class="italic text-gray-300">{{ store.traits.bond }}</p>
      </div>

      <!-- Flaw -->
      <div class="border-t border-slate-700 pt-3">
        <div class="text-xs font-bold text-gold-400 uppercase mb-1">Flaw</div>
        <p class="italic text-gray-300">{{ store.traits.flaw }}</p>
      </div>

      <!-- Alignment & Background -->
      <div class="border-t border-slate-700 pt-3">
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div class="text-gold-400 font-bold">Alignment</div>
            <div class="text-gray-400">{{ store.alignment }}</div>
          </div>
          <div>
            <div class="text-gold-400 font-bold">Background</div>
            <div class="text-gray-400">{{ store.background }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { characterStore } from '../stores/characterStore.js'

const store = characterStore
const expanded = ref(false)
</script>

<style scoped>
</style>
