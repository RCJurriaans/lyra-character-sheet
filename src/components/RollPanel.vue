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
            <option value="ability">Ability Check</option>
            <option value="save">Saving Throw</option>
            <option value="attack">Attack Roll</option>
          </select>
        </div>
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">Ability Check:</span> Roll d20 + ability modifier for tasks like climbing, deceiving, or investigating.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Saving Throw:</span> Roll d20 + ability modifier to resist spells/effects. WIS saves resist many control effects.</p>
            <p><span class="text-gold-300 font-bold">Attack Roll:</span> Roll d20 + proficiency/attack bonus to hit enemies in combat.</p>
          </div>
        </template>
      </StatTooltip>

      <!-- Ability Selection -->
      <StatTooltip title="Select Ability">
        <div>
          <label class="text-xs text-gold-400 font-bold uppercase">Ability</label>
          <select v-model="selectedAbility" class="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm mt-1">
            <option v-for="(name, abbr) in abilityNames" :key="abbr" :value="abbr">
              {{ name }} ({{ getMod(abbr) >= 0 ? '+' : '' }}{{ getMod(abbr) }})
            </option>
          </select>
        </div>
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">Your modifier will be added to the roll.</span></p>
            <p class="mb-2">Common uses:</p>
            <p class="mb-1"><span class="text-gold-300">STR:</span> Athletics (climbing, jumping), grappling</p>
            <p class="mb-1"><span class="text-gold-300">DEX:</span> Acrobatics, initiative, stealth, balancing</p>
            <p class="mb-1"><span class="text-gold-300">CON:</span> Endurance, concentration saves</p>
            <p class="mb-1"><span class="text-gold-300">INT:</span> Arcana, history, investigation</p>
            <p class="mb-1"><span class="text-gold-300">WIS:</span> Insight, medicine, perception, survival</p>
            <p><span class="text-gold-300">CHA:</span> Deception, intimidation, persuasion, performance</p>
          </div>
        </template>
      </StatTooltip>

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
import StatTooltip from './StatTooltip.vue'

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
