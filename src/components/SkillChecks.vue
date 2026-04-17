<template>
  <CardFrame title="⭐ Skill Checks" suit="wands" variant="gold" :show-flip="false">
    <div class="space-y-2">
      <!-- Skill Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
        <div
          v-for="(skill, key) in skillList"
          :key="key"
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors gap-1 sm:gap-2"
        >
          <div class="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
            <!-- Proficiency indicator -->
            <span
              :class="[
                'inline-block w-3 h-3 rounded-full flex-shrink-0',
                skill.proficient ? 'bg-fortuneGreen' : 'bg-slate-600'
              ]"
              :title="skill.proficient ? 'Proficient' : 'Not proficient'"
            ></span>

            <!-- Skill name and modifier -->
            <div class="flex-1 min-w-0">
              <span class="text-xs sm:text-sm font-semibold text-gray-100 block truncate">{{ skill.name }}</span>
              <span
                :class="[
                  'text-xs font-mono',
                  skill.mod >= 0 ? 'text-fortuneGreen' : 'text-fortuneRed'
                ]"
              >
                {{ skill.mod >= 0 ? '+' : '' }}{{ skill.mod }}
              </span>
            </div>
          </div>

          <!-- Quick roll button -->
          <button
            @click="rollSkill(key, skill)"
            class="btn btn-gold px-2 sm:px-3 py-1 text-xs sm:text-sm ml-1 sm:ml-2 hover:scale-105 transition-transform flex-shrink-0 min-h-8 sm:min-h-auto"
            :title="`Roll ${skill.name}`"
          >
            🎲
          </button>
        </div>
      </div>

      <!-- Skill Info Divider -->
      <div class="tarot-divider mt-3"></div>

      <!-- Last Roll Result -->
      <div v-if="lastRoll" class="p-3 bg-gold-100 text-slate-900 rounded border-2 border-gold-400">
        <div class="text-lg font-bold text-center">{{ lastRoll.total }}</div>
        <div class="text-sm text-center">
          {{ lastRollSkill }}: d20 ({{ lastRoll.d20 }}) {{ lastRoll.mod >= 0 ? '+' : '' }}{{ lastRoll.mod }}
        </div>
      </div>

      <!-- Proficiency Note -->
      <div class="text-xs text-gray-400 mt-3 italic">
        ● = Proficient (+{{ characterStore.proficiencyBonus }}) • Proficiency based on class/background features
      </div>
    </div>
  </CardFrame>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import CardFrame from './CardFrame.vue'
import { characterStore } from '../stores/characterStore.js'
import { rollAbilityCheck } from '../utils/diceRoller.js'

const lastRoll = ref(null)
const lastRollSkill = ref('')

const getAbilityMod = (ability) => {
  return Math.floor((characterStore.abilities[ability] - 10) / 2)
}

const skillList = reactive({
  acrobatics: {
    name: 'Acrobatics (DEX)',
    ability: 'dex',
    proficient: false,
    mod: computed(() => getAbilityMod('dex'))
  },
  animalHandling: {
    name: 'Animal Handling (WIS)',
    ability: 'wis',
    proficient: false,
    mod: computed(() => getAbilityMod('wis'))
  },
  arcana: {
    name: 'Arcana (INT)',
    ability: 'int',
    proficient: false,
    mod: computed(() => getAbilityMod('int'))
  },
  athletics: {
    name: 'Athletics (STR)',
    ability: 'str',
    proficient: false,
    mod: computed(() => getAbilityMod('str'))
  },
  deception: {
    name: 'Deception (CHA)',
    ability: 'cha',
    proficient: false,
    mod: computed(() => getAbilityMod('cha'))
  },
  history: {
    name: 'History (INT)',
    ability: 'int',
    proficient: false,
    mod: computed(() => getAbilityMod('int'))
  },
  insight: {
    name: 'Insight (WIS)',
    ability: 'wis',
    proficient: true, // From Faction Agent background
    mod: computed(() => getAbilityMod('wis') + (skillList.insight.proficient ? characterStore.proficiencyBonus : 0))
  },
  intimidation: {
    name: 'Intimidation (CHA)',
    ability: 'cha',
    proficient: false,
    mod: computed(() => getAbilityMod('cha'))
  },
  investigation: {
    name: 'Investigation (INT)',
    ability: 'int',
    proficient: false,
    mod: computed(() => getAbilityMod('int'))
  },
  medicine: {
    name: 'Medicine (WIS)',
    ability: 'wis',
    proficient: true, // From Cleric class
    mod: computed(() => getAbilityMod('wis') + (skillList.medicine.proficient ? characterStore.proficiencyBonus : 0))
  },
  nature: {
    name: 'Nature (INT)',
    ability: 'int',
    proficient: false,
    mod: computed(() => getAbilityMod('int'))
  },
  perception: {
    name: 'Perception (WIS)',
    ability: 'wis',
    proficient: true, // From Faction Agent background
    mod: computed(() => getAbilityMod('wis') + (skillList.perception.proficient ? characterStore.proficiencyBonus : 0))
  },
  performance: {
    name: 'Performance (CHA)',
    ability: 'cha',
    proficient: true, // From Satyr race
    mod: computed(() => getAbilityMod('cha') + (skillList.performance.proficient ? characterStore.proficiencyBonus : 0))
  },
  persuasion: {
    name: 'Persuasion (CHA)',
    ability: 'cha',
    proficient: true, // From Satyr race
    mod: computed(() => getAbilityMod('cha') + (skillList.persuasion.proficient ? characterStore.proficiencyBonus : 0))
  },
  religion: {
    name: 'Religion (INT)',
    ability: 'int',
    proficient: false,
    mod: computed(() => getAbilityMod('int'))
  },
  sleightOfHand: {
    name: 'Sleight of Hand (DEX)',
    ability: 'dex',
    proficient: false,
    mod: computed(() => getAbilityMod('dex'))
  },
  stealth: {
    name: 'Stealth (DEX)',
    ability: 'dex',
    proficient: false,
    mod: computed(() => getAbilityMod('dex'))
  },
  survival: {
    name: 'Survival (WIS)',
    ability: 'wis',
    proficient: false,
    mod: computed(() => getAbilityMod('wis'))
  }
})

const rollSkill = (key, skill) => {
  const abilityMod = getAbilityMod(skill.ability)
  const profBonus = skill.proficient ? characterStore.proficiencyBonus : 0
  const totalMod = abilityMod + profBonus

  const roll = rollAbilityCheck(totalMod)
  lastRoll.value = roll
  lastRollSkill.value = skill.name

  // Add to roll history if using RollPanel
  if (characterStore.rollHistory) {
    characterStore.rollHistory.push({
      d20: roll.d20,
      modifier: totalMod,
      total: roll.total,
      type: 'skill',
      skill: skill.name,
      timestamp: new Date().toISOString()
    })
  }
}
</script>

<style scoped>
</style>
