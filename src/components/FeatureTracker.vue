<template>
  <div class="card">
    <h2 class="text-xl font-serif font-bold text-gold-300 mb-4 flex items-center gap-2">
      ⚡ Features & Abilities
    </h2>

    <!-- Channel Divinity -->
    <div class="border-b border-slate-700 pb-3 mb-3">
      <StatTooltip title="Channel Divinity: Turn Undead">
        <div>
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
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it does:</span> Force undead creatures to flee from you for 1 minute. Undead with CR 1/2 or lower are instantly destroyed.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">How to use:</span> Use 1 action. All undead within 30 ft must make a WIS save (DC {{ store.spellSaveDC }}). Failed save = creature is turned.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Turned mechanics:</span> Can't come closer to you. Takes Disadvantage on attacks against you. Can't move toward you.</p>
            <p><span class="text-gold-300 font-bold">Reset:</span> 1 use per long rest.</p>
          </div>
        </template>
      </StatTooltip>
    </div>

    <!-- Preserve Life -->
    <div class="border-b border-slate-700 pb-3 mb-3">
      <StatTooltip title="Preserve Life">
        <div>
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
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it does:</span> Life Domain clerics can channel divine energy to heal multiple allies at once.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">How to use:</span> Use 1 action. Choose creatures within 30 ft. You can restore {{ store.preserveLife.max }} HP total, split however you want.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Restriction:</span> You cannot heal a creature past half its max HP. If they have 20 max HP, you can only heal them to 10 HP with this ability.</p>
            <p><span class="text-gold-300 font-bold">Reset:</span> Pool resets after a long rest (back to {{ store.preserveLife.max }} HP to distribute).</p>
          </div>
        </template>
      </StatTooltip>
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
import StatTooltip from './StatTooltip.vue'

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
