<template>
  <div class="card">
    <h2 class="text-xl font-serif font-bold text-gold-300 mb-4 flex items-center gap-2">
      ⚡ Features & Abilities
    </h2>

    <!-- Channel Divinity -->
    <div class="border-b border-slate-700 pb-3 mb-3">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-bold text-gray-100">Channel Divinity</span>
        <span class="text-xs text-gold-400">{{ store.channelDivinity.used ? '0/1' : '1/1' }}</span>
      </div>
      <button
        @click="toggleChannelDivinity"
        :disabled="store.channelDivinity.used"
        :class="[
          'btn w-full',
          store.channelDivinity.used ? 'btn-secondary opacity-50 cursor-not-allowed' : 'btn-gold'
        ]"
      >
        {{ store.channelDivinity.used ? '✗ Used' : '✓ Turn Undead' }}
      </button>
      <p class="text-xs text-gray-400 mt-2">
        Undead within 30 ft must make WIS save or be turned for 1 minute. CR 1/2 or lower instantly destroyed.
      </p>
    </div>

    <!-- Preserve Life -->
    <div class="border-b border-slate-700 pb-3 mb-3">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-bold text-gray-100">Preserve Life</span>
        <span class="text-xs text-gold-400">{{ store.preserveLife.current }}/{{ store.preserveLife.max }} HP</span>
      </div>

      <div class="hp-bar mb-2">
        <div
          class="hp-fill bg-fortuneGreen"
          :style="{ width: (store.preserveLife.current / store.preserveLife.max) * 100 + '%' }"
        ></div>
      </div>

      <div class="flex gap-2">
        <input
          v-model.number="preserveAmount"
          type="number"
          min="1"
          :max="store.preserveLife.current"
          class="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
        />
        <button
          @click="activatePreserveLife"
          :disabled="preserveAmount <= 0 || preserveAmount > store.preserveLife.current"
          class="btn btn-gold px-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Use
        </button>
      </div>

      <p class="text-xs text-gray-400 mt-2">
        As an action, restore up to 25 HP. Divide among creatures within 30 ft. Cannot heal a creature past half its max HP.
      </p>
    </div>

    <!-- Traits -->
    <div>
      <div class="text-sm font-bold text-gray-100 mb-2">Features</div>
      <ul class="text-xs text-gray-400 space-y-1">
        <li>✓ <strong>Magic Resistance:</strong> Advantage on saves vs spells</li>
        <li>✓ <strong>Mirthful Leaps:</strong> Add 1d8 to jump distance</li>
        <li>✓ <strong>Disciple of Life:</strong> +2 HP per spell level on healing spells</li>
        <li>✓ <strong>Lucky Feat:</strong> 3 luck points per long rest</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { characterStore, useChannelDivinity as storeUseChannelDivinity, usePreserveLife as storeUsePreserveLife } from '../stores/characterStore.js'

const store = characterStore
const preserveAmount = ref(5)

const toggleChannelDivinity = () => {
  storeUseChannelDivinity()
}

const activatePreserveLife = () => {
  if (preserveAmount.value > 0) {
    storeUsePreserveLife(preserveAmount.value)
  }
}
</script>

<style scoped>
</style>
