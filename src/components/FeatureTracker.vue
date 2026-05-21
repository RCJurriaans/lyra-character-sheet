<template>
  <div class="card">
    <h2 class="text-xl font-serif font-bold text-gold-300 mb-4 flex items-center gap-2">
      ⚡ Features & Abilities
    </h2>

    <!-- Channel Divinity (2024: 2 uses, recharges on Short or Long Rest) -->
    <div class="border-b border-slate-700 pb-4 mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-bold text-gray-100">Channel Divinity</span>
        <div class="flex items-center gap-2">
          <!-- Use pips -->
          <div class="flex gap-1">
            <span
              v-for="i in store.channelDivinity.maxUses"
              :key="i"
              @click="i <= store.channelDivinity.used ? restoreCD() : spendCD()"
              :class="[
                'w-5 h-5 rounded-full border-2 cursor-pointer transition-colors',
                i <= store.channelDivinity.used
                  ? 'bg-slate-600 border-slate-500'
                  : 'bg-gold-400 border-gold-300'
              ]"
              :title="i <= store.channelDivinity.used ? 'Click to restore one use' : 'Use available'"
            ></span>
          </div>
          <span class="text-xs text-gold-400">{{ store.channelDivinity.maxUses - store.channelDivinity.used }}/{{ store.channelDivinity.maxUses }}</span>
        </div>
      </div>
      <p class="text-xs text-gray-500 mb-3">Recharges on a Short or Long Rest. Each option below costs 1 use.</p>

      <!-- Divine Spark -->
      <StatTooltip title="Divine Spark">
        <button
          @click="spendCD()"
          :disabled="store.channelDivinity.used >= store.channelDivinity.maxUses"
          class="btn btn-gold w-full mb-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ✨ Divine Spark (1d8+3 heal or radiant)
        </button>
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it does:</span> Target one creature within 30 ft. Either heal it or deal Radiant damage.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Roll:</span> 1d8 + WIS modifier (+3) = 1d8+3 HP healed or Radiant damage dealt.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Action:</span> 1 Action.</p>
            <p><span class="text-gold-300 font-bold">Reset:</span> Recharges on any rest.</p>
          </div>
        </template>
      </StatTooltip>

      <!-- Turn/Sear Undead -->
      <StatTooltip title="Turn/Sear Undead">
        <button
          @click="spendCD()"
          :disabled="store.channelDivinity.used >= store.channelDivinity.maxUses"
          class="btn btn-gold w-full mb-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ☀️ Turn Undead (DC {{ store.spellSaveDC }} WIS + 3d8 Radiant)
        </button>
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it does:</span> All undead within 30 ft must make a DC {{ store.spellSaveDC }} WIS save or be turned for 1 minute AND take 3d8 Radiant damage.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Turned:</span> Can't move closer to you, takes Disadvantage on attacks against you. Ends if it takes damage.</p>
            <p><span class="text-gold-300 font-bold">Action:</span> 1 Action.</p>
          </div>
        </template>
      </StatTooltip>

      <!-- Preserve Life -->
      <StatTooltip title="Preserve Life">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-gray-300">Preserve Life</span>
            <span class="text-xs text-gold-400">{{ store.preserveLife.current }}/{{ store.preserveLife.max }} HP pool</span>
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
              :disabled="preserveAmount <= 0 || preserveAmount > store.preserveLife.current || store.channelDivinity.used >= store.channelDivinity.maxUses"
              class="btn btn-gold px-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              🌿 Use
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-1">Distribute {{ store.preserveLife.max }} HP among Bloodied allies (≤ half HP) within 30 ft. Costs 1 CD use.</p>
        </div>
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it does:</span> Distribute up to {{ store.preserveLife.max }} HP of healing among any number of Bloodied (≤ half HP) creatures within 30 ft.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Restriction:</span> Cannot heal a creature above half its max HP. Costs 1 Channel Divinity use.</p>
            <p><span class="text-gold-300 font-bold">Reset:</span> Pool ({{ store.preserveLife.max }} HP) resets on Short or Long Rest.</p>
          </div>
        </template>
      </StatTooltip>
    </div>

    <!-- Features & Traits -->
    <div>
      <div class="text-sm font-bold text-gray-100 mb-2">Features & Traits</div>
      <ul class="text-xs text-gray-400 space-y-2">
        <li>
          <strong class="text-gold-300">Divine Order: Thaumaturge</strong> (Cleric lvl 1)<br>
          Bonus cantrip from Cleric list (Thaumaturgy). Add WIS mod (+3) to Religion checks.
        </li>
        <li>
          <strong class="text-gold-300">Disciple of Life</strong> (Life Domain lvl 3)<br>
          Healing spells restore extra HP equal to 2 + the spell's level (e.g. Cure Wounds 1st = +3, Healing Word 1st = +3).
        </li>
        <li>
          <strong class="text-gold-300">Lucky Feat</strong> (lvl 4 General Feat)<br>
          {{ store.luckyPoints.current }}/{{ store.luckyPoints.max }} luck points (= PB). Spend 1 to grant yourself Advantage on a d20 Test, or force Disadvantage on an attack against you. Recharges on Long Rest.
        </li>
        <li>
          <strong class="text-gold-300">Magic Initiate (Wizard)</strong> (Sage background Origin Feat)<br>
          Cantrips: Prestidigitation &amp; Mage Hand. Spell: Find Familiar 1/day free, or via spell slots (level 5+). Use WIS as spellcasting stat.
        </li>
        <li>
          <strong class="text-gold-300">Ram</strong> (Satyr)<br>
          Unarmed strikes deal 1d6 + STR mod (-1) bludgeoning damage = 1d6−1.
        </li>
        <li>
          <strong class="text-gold-300">Reveler</strong> (Satyr)<br>
          Proficiency in Performance &amp; Persuasion. Add CHA mod (+1) to Initiative. (DEX +2 + CHA +1 = Initiative +3)
        </li>
        <li>
          <strong class="text-gold-300">Magic Resistance</strong> (Satyr)<br>
          Advantage on saving throws against spells and other magical effects.
        </li>
        <li>
          <strong class="text-gold-300">Mirthful Leaps</strong> (Satyr)<br>
          Roll 1d8 and add it to any long or high jump distance.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  characterStore,
  useChannelDivinity as storeSpendCD,
  restoreChannelDivinity as storeRestoreCD,
  usePreserveLife as storeUsePreserveLife
} from '../stores/characterStore.js'
import StatTooltip from './StatTooltip.vue'

const store = characterStore
const preserveAmount = ref(5)

const spendCD = () => storeSpendCD()
const restoreCD = () => storeRestoreCD()

const activatePreserveLife = () => {
  if (preserveAmount.value > 0) {
    storeUsePreserveLife(preserveAmount.value)
  }
}
</script>

<style scoped>
</style>
