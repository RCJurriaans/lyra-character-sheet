<template>
  <div class="card">
    <div class="flex items-center justify-between gap-3">
      <StatTooltip title="Heroic Inspiration">
        <div>
          <h2 class="text-xl font-serif font-bold text-gold-300 flex items-center gap-2">
            🌟 Heroic Inspiration
          </h2>
          <p class="text-xs text-gray-400 mt-1">
            {{ store.heroicInspiration ? 'Ready. Spend it to reroll one die.' : 'None. The DM hands it out.' }}
          </p>
        </div>
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it does:</span> Right after you roll any die, spend it to reroll that die. You must use the new roll.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">How you get it:</span> The DM awards it, for great roleplay, a clever plan, or winning the quiz.</p>
            <p><span class="text-gold-300 font-bold">Limit:</span> You hold at most one. It doesn't reset on a rest, so it stays until you spend it.</p>
          </div>
        </template>
      </StatTooltip>

      <button
        @click="toggle"
        :class="[
          'w-14 h-14 shrink-0 rounded-full text-3xl transition-all',
          store.heroicInspiration
            ? 'bg-gold-400 hover:scale-110 shadow-lg shadow-gold-400/50'
            : 'bg-slate-700 border border-dashed border-slate-500 grayscale opacity-60 hover:opacity-100'
        ]"
        :title="store.heroicInspiration ? 'Click to spend' : 'Click when the DM gives you Inspiration'"
      >
        🌟
      </button>
    </div>

    <div v-if="flash" class="animate-pulse text-center text-gold-400 text-sm mt-3">
      {{ flash }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { characterStore, gainHeroicInspiration, spendHeroicInspiration } from '../stores/characterStore.js'
import StatTooltip from './StatTooltip.vue'

const store = characterStore
const flash = ref('')

const toggle = () => {
  if (store.heroicInspiration) {
    spendHeroicInspiration()
    flash.value = '✨ Inspiration spent! Reroll that die. ✨'
  } else {
    gainHeroicInspiration()
    flash.value = '🌟 Inspiration gained!'
  }
  setTimeout(() => { flash.value = '' }, 1500)
}
</script>
