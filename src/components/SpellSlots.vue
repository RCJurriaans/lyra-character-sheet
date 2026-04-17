<template>
  <div class="card">
    <h2 class="text-xl font-serif font-bold text-gold-300 mb-4 flex items-center gap-2">
      ✨ Spell Slots
    </h2>

    <!-- Cantrips -->
    <div class="mb-4">
      <div class="text-xs font-bold text-gold-400 uppercase mb-2">Cantrips (At-Will)</div>
      <p class="text-xs text-gray-400">Guidance • Sacred Flame • Toll the Dead • Spare the Dying</p>
    </div>

    <!-- Spell Levels -->
    <div class="space-y-3">
      <div v-for="level in [1, 2, 3]" :key="level" class="border-t border-slate-700 pt-3">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-bold text-gold-300">{{ levelNames[level] }} Spells</span>
          <span class="text-xs text-gray-400">{{ getAvailableSlots(level) }}/{{ store.spellSlots[level].max }}</span>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="slot in store.spellSlots[level].max"
            :key="`${level}-${slot}`"
            @click="toggleSlot(level, slot)"
            :class="[
              'spell-slot-box',
              slot <= store.spellSlots[level].used ? 'used' : 'available'
            ]"
            :title="`${levelNames[level]} Slot ${slot}`"
          >
            {{ slot <= store.spellSlots[level].used ? '✗' : '●' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { characterStore, useSpellSlot, restoreSpellSlot, getAvailableSlots } from '../stores/characterStore.js'

const store = characterStore

const levelNames = {
  1: '1st Level',
  2: '2nd Level',
  3: '3rd Level'
}

const toggleSlot = (level, slot) => {
  if (slot <= store.spellSlots[level].used) {
    restoreSpellSlot(level)
  } else {
    useSpellSlot(level)
  }
}
</script>

<style scoped>
</style>
