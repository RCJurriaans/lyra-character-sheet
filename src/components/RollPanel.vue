<template>
  <div class="card">
    <h2 class="text-xl font-serif font-bold text-gold-300 mb-4 flex items-center gap-2">
      🎲 Roll Check
    </h2>

    <div class="space-y-3">
      <!-- Roll Type -->
      <div>
        <label class="text-xs text-gold-400 font-bold uppercase">Roll Type</label>
        <select v-model="rollType" class="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm mt-1">
          <option value="ability">Ability Check</option>
          <option value="save">Saving Throw</option>
          <option value="attack">Attack Roll</option>
        </select>
      </div>

      <!-- Ability Selection -->
      <div>
        <label class="text-xs text-gold-400 font-bold uppercase">Ability</label>
        <select v-model="selectedAbility" class="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm mt-1">
          <option v-for="(name, abbr) in abilityNames" :key="abbr" :value="abbr">
            {{ name }} ({{ getMod(abbr) >= 0 ? '+' : '' }}{{ getMod(abbr) }})
          </option>
        </select>
      </div>

      <!-- Roll Button -->
      <button @click="performRoll" class="btn btn-gold w-full">
        🎲 Roll d20
      </button>
    </div>

    <!-- Last Roll Result -->
    <div v-if="lastRoll" class="mt-4 p-3 bg-gold-100 text-slate-900 rounded border-2 border-gold-400">
      <div class="text-2xl font-bold text-center mb-2">{{ lastRoll.total }}</div>
      <div class="text-sm text-center">
        <div v-if="rollType === 'ability'">
          d20 ({{ lastRoll.d20 }}) {{ getMod(selectedAbility) >= 0 ? '+' : '' }}{{ getMod(selectedAbility) }}
        </div>
        <div v-else-if="rollType === 'save'">
          d20 ({{ lastRoll.d20 }}) + Save {{ store.savingThrows[selectedAbility] >= 0 ? '+' : '' }}{{ store.savingThrows[selectedAbility] }}
        </div>
        <div v-else>
          d20 ({{ lastRoll.d20 }}) + Attack Bonus +{{ attackBonus }}
        </div>
      </div>
    </div>

    <!-- Roll History -->
    <div v-if="rollHistory.length > 0" class="mt-4 border-t border-slate-700 pt-3">
      <div class="text-xs text-gold-400 font-bold uppercase mb-2">Recent Rolls</div>
      <div class="space-y-1 max-h-24 overflow-y-auto text-xs">
        <div v-for="(roll, idx) in rollHistory.slice().reverse()" :key="idx" class="text-gray-400">
          {{ roll.label }}: <span class="font-bold text-gold-300">{{ roll.total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { characterStore } from '../stores/characterStore.js'
import { rollAbilityCheck, rollSavingThrow } from '../utils/diceRoller.js'

const store = characterStore
const rollType = ref('ability')
const selectedAbility = ref('wis')
const lastRoll = ref(null)
const rollHistory = ref([])

const abilityNames = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma'
}

const attackBonus = computed(() => {
  return store.spellAttackBonus
})

const getMod = (ability) => {
  return Math.floor((store.abilities[ability] - 10) / 2)
}

const performRoll = () => {
  let roll

  if (rollType.value === 'ability') {
    const mod = getMod(selectedAbility.value)
    roll = rollAbilityCheck(mod)
    roll.label = `${abilityNames[selectedAbility.value]} Check`
  } else if (rollType.value === 'save') {
    const saveMod = store.savingThrows[selectedAbility.value]
    roll = rollSavingThrow(saveMod)
    roll.label = `${abilityNames[selectedAbility.value]} Save`
  } else {
    const mod = getMod(selectedAbility.value)
    roll = rollAbilityCheck(mod)
    roll.label = `${abilityNames[selectedAbility.value]} Attack`
  }

  lastRoll.value = roll
  rollHistory.value.push(roll)

  // Keep only last 10 rolls
  if (rollHistory.value.length > 10) {
    rollHistory.value.shift()
  }
}
</script>

<style scoped>
</style>
