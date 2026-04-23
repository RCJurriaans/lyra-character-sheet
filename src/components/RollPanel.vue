<template>
  <div class="card">
    <h2 class="text-xl font-serif font-bold text-gold-300 mb-4 flex items-center gap-2">
      🎲 Roll Check
    </h2>

    <div class="flex flex-col gap-4">
      <!-- Roll Type -->
      <StatTooltip title="Roll Type">
        <div>
          <label class="text-xs text-gold-400 font-bold uppercase">Roll Type</label>
          <select v-model="rollType" class="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm mt-1">
            <option value="attack">Attack Roll</option>
            <option value="save">Saving Throw</option>
            <option value="ability">Ability Check</option>
          </select>
        </div>
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">Attack Roll:</span> Roll d20 + attack bonus to hit. Meets or beats the target's AC = hit.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Saving Throw:</span> Roll d20 + save modifier to resist spells or effects. Meets or beats the DC = success.</p>
            <p><span class="text-gold-300 font-bold">Ability Check:</span> Roll d20 + ability modifier for tasks like climbing, persuading, or investigating.</p>
          </div>
        </template>
      </StatTooltip>

      <!-- Secondary Dropdown — changes based on roll type -->
      <div>
        <label class="text-xs text-gold-400 font-bold uppercase">{{ secondaryLabel }}</label>
        <select v-model="selectedOption" class="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm mt-1">
          <option v-for="opt in secondaryOptions" :key="opt.key" :value="opt.key">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <!-- Roll Button -->
      <button @click="performRoll" class="btn btn-gold w-full">
        🎲 Roll d20
      </button>
    </div>

    <!-- Last Roll Result -->
    <div v-if="lastRoll" class="mt-4 p-3 rounded border-2 roll-result" :class="lastRoll.d20 === 20 ? 'crit' : lastRoll.d20 === 1 ? 'fumble' : ''">
      <div v-if="lastRoll.d20 === 20" class="text-xs font-bold text-center mb-1 text-yellow-300 uppercase tracking-widest">⭐ Critical Hit!</div>
      <div v-if="lastRoll.d20 === 1" class="text-xs font-bold text-center mb-1 text-red-400 uppercase tracking-widest">💀 Natural 1</div>
      <div class="text-3xl font-bold text-center mb-1">{{ lastRoll.total }}</div>
      <div class="text-xs text-center text-slate-600">
        d20 ({{ lastRoll.d20 }}) {{ lastRoll.bonus >= 0 ? '+' : '' }}{{ lastRoll.bonus }}
        <span class="text-slate-500 ml-1">— {{ lastRoll.label }}</span>
      </div>
    </div>

    <!-- Roll History -->
    <div v-if="rollHistory.length > 0" class="mt-4 border-t border-slate-700 pt-3">
      <div class="text-xs text-gold-400 font-bold uppercase mb-2">Recent Rolls</div>
      <div class="space-y-1 max-h-24 overflow-y-auto text-xs">
        <div v-for="(roll, idx) in rollHistory.slice().reverse()" :key="idx" class="text-gray-400">
          {{ roll.label }}: <span class="font-bold text-gold-300">{{ roll.total }}</span>
          <span class="text-gray-600 ml-1">({{ roll.d20 }}{{ roll.bonus >= 0 ? '+' : '' }}{{ roll.bonus }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { characterStore } from '../stores/characterStore.js'
import { rollDice } from '../utils/diceRoller.js'
import StatTooltip from './StatTooltip.vue'

const store = characterStore

const rollType = ref('attack')
const selectedOption = ref('spell')
const lastRoll = ref(null)
const rollHistory = ref([])

const getMod = (ability) => Math.floor((store.abilities[ability] - 10) / 2)

// Options for the second dropdown — fully driven by rollType
const secondaryOptions = computed(() => {
  if (rollType.value === 'attack') {
    const spellBonus = getMod('wis') + store.proficiencyBonus
    const meleeBonus = getMod('str') + store.proficiencyBonus
    return [
      { key: 'spell', label: `Spell Attack (${spellBonus >= 0 ? '+' : ''}${spellBonus})`, bonus: spellBonus },
      { key: 'mace',  label: `Mace / Melee (${meleeBonus >= 0 ? '+' : ''}${meleeBonus})`,  bonus: meleeBonus },
    ]
  }

  if (rollType.value === 'save') {
    return [
      { key: 'str', label: `Strength Save (${store.savingThrows.str >= 0 ? '+' : ''}${store.savingThrows.str})`,  bonus: store.savingThrows.str },
      { key: 'dex', label: `Dexterity Save (${store.savingThrows.dex >= 0 ? '+' : ''}${store.savingThrows.dex})`, bonus: store.savingThrows.dex },
      { key: 'con', label: `Constitution Save (${store.savingThrows.con >= 0 ? '+' : ''}${store.savingThrows.con})`, bonus: store.savingThrows.con },
      { key: 'int', label: `Intelligence Save (${store.savingThrows.int >= 0 ? '+' : ''}${store.savingThrows.int})`, bonus: store.savingThrows.int },
      { key: 'wis', label: `Wisdom Save (${store.savingThrows.wis >= 0 ? '+' : ''}${store.savingThrows.wis}) ★`,   bonus: store.savingThrows.wis },
      { key: 'cha', label: `Charisma Save (${store.savingThrows.cha >= 0 ? '+' : ''}${store.savingThrows.cha}) ★`, bonus: store.savingThrows.cha },
    ]
  }

  // Ability Check
  return [
    { key: 'str', label: `Strength (${getMod('str') >= 0 ? '+' : ''}${getMod('str')})`,     bonus: getMod('str') },
    { key: 'dex', label: `Dexterity (${getMod('dex') >= 0 ? '+' : ''}${getMod('dex')})`,    bonus: getMod('dex') },
    { key: 'con', label: `Constitution (${getMod('con') >= 0 ? '+' : ''}${getMod('con')})`, bonus: getMod('con') },
    { key: 'int', label: `Intelligence (${getMod('int') >= 0 ? '+' : ''}${getMod('int')})`, bonus: getMod('int') },
    { key: 'wis', label: `Wisdom (${getMod('wis') >= 0 ? '+' : ''}${getMod('wis')})`,       bonus: getMod('wis') },
    { key: 'cha', label: `Charisma (${getMod('cha') >= 0 ? '+' : ''}${getMod('cha')})`,     bonus: getMod('cha') },
  ]
})

// Reset to first sensible option whenever roll type changes
watch(rollType, () => {
  selectedOption.value = secondaryOptions.value[0].key
})

const secondaryLabel = computed(() => {
  if (rollType.value === 'attack') return 'Attack'
  if (rollType.value === 'save')   return 'Saving Throw'
  return 'Ability'
})

const performRoll = () => {
  const opt = secondaryOptions.value.find(o => o.key === selectedOption.value)
  if (!opt) return

  const d20 = rollDice(20)
  const bonus = opt.bonus
  const total = d20 + bonus

  // Build a clean label (strip the modifier part in parentheses)
  const baseName = opt.label.replace(/\s*\(.*\)\s*★?/, '').trim()
  const typeSuffix = rollType.value === 'attack' ? '' : rollType.value === 'save' ? '' : ' Check'
  const label = `${baseName}${typeSuffix}`

  const roll = { d20, bonus, total, label }
  lastRoll.value = roll
  rollHistory.value.push(roll)
  if (rollHistory.value.length > 10) rollHistory.value.shift()
}
</script>

<style scoped>
.roll-result {
  background: var(--theme-surface);
  border-color: var(--theme-primary);
  color: var(--theme-text);
}

.roll-result .text-slate-600 {
  color: var(--theme-textSecondary);
}

.roll-result.crit {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
}

.roll-result.fumble {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}
</style>
