<template>
  <div class="card">
    <h2 class="text-xl font-serif font-bold text-gold-300 mb-4 flex items-center gap-2">
      📊 Ability Scores
    </h2>

    <div class="grid grid-cols-2 gap-3">
      <div v-for="(ability, abbr) in abilityNames" :key="abbr" class="stat-box text-center">
        <div class="text-xs font-bold text-gold-400 uppercase">{{ ability }}</div>
        <div class="text-lg font-bold text-gray-100">{{ store.abilities[abbr] }}</div>
        <div class="text-xs text-gray-400 mt-1" :class="getMod(abbr) >= 0 ? 'text-fortuneGreen' : 'text-fortuneRed'">
          {{ getMod(abbr) >= 0 ? '+' : '' }}{{ getMod(abbr) }}
        </div>
      </div>
    </div>

    <!-- Other Stats -->
    <div class="mt-4 space-y-2 border-t border-slate-700 pt-4">
      <div class="flex justify-between text-sm">
        <span class="text-gold-400">Proficiency Bonus</span>
        <span class="font-bold">+{{ store.proficiencyBonus }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gold-400">Initiative</span>
        <span class="font-bold">{{ store.initiative >= 0 ? '+' : '' }}{{ store.initiative }}</span>
      </div>
    </div>

    <!-- Saving Throws -->
    <div class="mt-4 border-t border-slate-700 pt-4">
      <h3 class="text-sm font-bold text-gold-300 mb-2">Saving Throws</h3>
      <div class="grid grid-cols-2 gap-2">
        <div v-for="abbr in ['str', 'dex', 'con', 'int', 'wis', 'cha']" :key="abbr" class="flex items-center gap-2">
          <input type="checkbox" :id="`save-${abbr}`" :checked="isProficientSave(abbr)" class="rounded" />
          <label :for="`save-${abbr}`" class="text-xs cursor-pointer flex-1">
            {{ abbr.toUpperCase() }}
            <span class="text-gray-500">{{ store.savingThrows[abbr] >= 0 ? '+' : '' }}{{ store.savingThrows[abbr] }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { characterStore } from '../stores/characterStore.js'

const store = characterStore

const abilityNames = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma'
}

const getMod = (ability) => {
  return Math.floor((store.abilities[ability] - 10) / 2)
}

const isProficientSave = (ability) => {
  // WIS and CHA are proficient (from character sheet)
  return ability === 'wis' || ability === 'cha'
}
</script>

<style scoped>
</style>
