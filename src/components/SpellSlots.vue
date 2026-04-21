<template>
  <div class="card">
    <h2 class="text-xl font-serif font-bold text-gold-300 mb-4 flex items-center gap-2">
      ✨ Spell Slots
    </h2>

    <!-- Cantrips -->
    <StatTooltip title="Cantrips">
      <div class="mb-4">
        <div class="text-xs font-bold text-gold-400 uppercase mb-2">Cantrips (At-Will)</div>
        <p class="text-xs text-gray-400">Guidance • Sacred Flame • Toll the Dead • Spare the Dying</p>
      </div>
      <template #content>
        <div>
          <p class="mb-2"><span class="text-gold-300 font-bold">What they are:</span> Simple spells you can cast unlimited times. No spell slots required.</p>
          <p class="mb-2"><span class="text-gold-300 font-bold">When to use:</span> Use cantrips for repeated low-damage effects or utility (Guidance for ability checks, Sacred Flame for reliable damage).</p>
          <p class="mb-2"><span class="text-gold-300 font-bold">Examples:</span> Guidance (+1d4 to ability check), Sacred Flame (1d8 radiant if they fail save), Toll the Dead (1d8/2d8 necrotic), Spare the Dying (stabilize unconscious allies).</p>
          <p><span class="text-gold-300 font-bold">Note:</span> Cantrips scale with your character level and are your reliable source of damage between spell slots.</p>
        </div>
      </template>
    </StatTooltip>

    <!-- Spell Levels -->
    <div class="flex flex-col gap-4">
      <StatTooltip
        v-for="level in [1, 2, 3]"
        :key="level"
        :title="`${levelNames[level]} Spell Slots`"
      >
        <div class="border-t border-slate-700 pt-3">
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
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it is:</span> A {{ levelNames[level] }} spell slot is needed to cast {{ levelNames[level] }} level spells.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">How many:</span> You have {{ store.spellSlots[level].max }} {{ levelNames[level] }} slots (● = available, ✗ = used).</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">How to use:</span> Cast a {{ levelNames[level] }} spell, click the slot box to mark it used. Used slots come back after a long rest.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Damage:</span> {{ level === 1 ? 'Healing Word (1d4+3), Guiding Bolt (4d6)' : level === 2 ? 'Spiritual Weapon (1d8+3 bonus action), Lesser Restoration' : 'Revivify, Beacon of Hope' }}</p>
            <p><span class="text-gold-300 font-bold">Note:</span> Higher level spells are more powerful but use limited slots. Use lower-level slots and cantrips when possible to save higher ones.</p>
          </div>
        </template>
      </StatTooltip>
    </div>
  </div>
</template>

<script setup>
import { characterStore, useSpellSlot, restoreSpellSlot, getAvailableSlots } from '../stores/characterStore.js'
import StatTooltip from './StatTooltip.vue'

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
