<template>
  <div class="card">
    <h2 class="text-xl font-serif font-bold text-gold-300 mb-4 flex items-center gap-2">
      📊 Ability Scores
    </h2>

    <div class="grid grid-cols-2 gap-3">
      <StatTooltip
        v-for="(ability, abbr) in abilityNames"
        :key="abbr"
        :title="ability"
      >
        <div class="stat-box text-center">
          <div class="text-xs font-bold text-gold-400 uppercase">{{ ability }}</div>
          <div class="text-lg font-bold text-gray-100">{{ store.abilities[abbr] }}</div>
          <div class="text-xs text-gray-400 mt-1" :class="getMod(abbr) >= 0 ? 'text-fortuneGreen' : 'text-fortuneRed'">
            {{ getMod(abbr) >= 0 ? '+' : '' }}{{ getMod(abbr) }}
          </div>
        </div>
        <template #content>
          <component :is="getAbilityTooltip(abbr)" />
        </template>
      </StatTooltip>
    </div>

    <!-- Other Stats -->
    <div class="mt-4 flex flex-col gap-3 border-t border-slate-700 pt-4">
      <StatTooltip title="Proficiency Bonus">
        <div class="flex justify-between text-sm">
          <span class="text-gold-400">Proficiency Bonus</span>
          <span class="font-bold">+{{ store.proficiencyBonus }}</span>
        </div>
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it means:</span> Your bonus added to attack rolls, ability checks, and saving throws where you have proficiency.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Calculation:</span> Based on your level: +2 (Levels 1-4), +3 (Levels 5-8), +4 (Levels 9-12), etc.</p>
            <p><span class="text-gold-300 font-bold">When to use:</span> Add to any roll where you're trained or proficient.</p>
          </div>
        </template>
      </StatTooltip>

      <StatTooltip title="Initiative">
        <div class="flex justify-between text-sm">
          <span class="text-gold-400">Initiative</span>
          <span class="font-bold">{{ store.initiative >= 0 ? '+' : '' }}{{ store.initiative }}</span>
        </div>
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it means:</span> Your roll bonus at the start of combat to determine who goes first.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Calculation:</span> DEX modifier ({{ getMod('dex') >= 0 ? '+' : '' }}{{ getMod('dex') }}) + any magical items or abilities</p>
            <p><span class="text-gold-300 font-bold">When to use:</span> Roll d20 + {{ store.initiative }} when combat starts. Higher rolls go first in turn order.</p>
          </div>
        </template>
      </StatTooltip>
    </div>

    <!-- Saving Throws -->
    <div class="mt-4 border-t border-slate-700 pt-4">
      <h3 class="text-sm font-bold text-gold-300 mb-2">Saving Throws</h3>
      <div class="grid grid-cols-2 gap-3">
        <StatTooltip
          v-for="abbr in ['str', 'dex', 'con', 'int', 'wis', 'cha']"
          :key="abbr"
          :title="`${abbr.toUpperCase()} Save`"
        >
          <div class="flex items-center gap-2">
            <input type="checkbox" :id="`save-${abbr}`" :checked="isProficientSave(abbr)" class="rounded" />
            <label :for="`save-${abbr}`" class="text-xs cursor-pointer flex-1">
              {{ abbr.toUpperCase() }}
              <span class="text-gray-500">{{ store.savingThrows[abbr] >= 0 ? '+' : '' }}{{ store.savingThrows[abbr] }}</span>
            </label>
          </div>
          <template #content>
            <div>
              <p class="mb-2"><span class="text-gold-300 font-bold">What it means:</span> Your ability to resist effects targeting this ability.</p>
              <p class="mb-2"><span class="text-gold-300 font-bold">Calculation:</span> {{ abbr.toUpperCase() }} modifier ({{ getMod(abbr) >= 0 ? '+' : '' }}{{ getMod(abbr) }}){{ isProficientSave(abbr) ? ` + Proficiency (+${store.proficiencyBonus})` : '' }}</p>
              <p><span class="text-gold-300 font-bold">When to use:</span> When an enemy casts a spell or uses an ability that forces a {{ abbr.toUpperCase() }} save, roll d20 + {{ store.savingThrows[abbr] }}.</p>
            </div>
          </template>
        </StatTooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import { characterStore } from '../stores/characterStore.js'
import StatTooltip from './StatTooltip.vue'

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

const sign = (n) => n >= 0 ? `+${n}` : `${n}`
const calcMod = (abbr) => `(${store.abilities[abbr]} − 10) ÷ 2 = ${sign(getMod(abbr))}`

const getAbilityTooltip = (abbr) => {
  const tooltips = {
    str: () => h('div', [
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'What it means: '), 'Physical power and athletic ability.']),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'Uses: '), 'Attack rolls with melee weapons (Mace), Athletics checks, breaking things.']),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'Calculation: '), calcMod('str')]),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'Mace attack: '), `STR (${sign(getMod('str'))}) + PB (+${store.proficiencyBonus}) = ${sign(getMod('str') + store.proficiencyBonus)} to hit, 1d6${sign(getMod('str'))} damage`]),
      h('p', [h('span', { class: 'text-gold-300 font-bold' }, 'Examples: '), 'Pushing a boulder, swinging your mace, grappling a foe.'])
    ]),
    dex: () => h('div', [
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'What it means: '), 'Agility, reflexes, and coordination.']),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'Uses: '), 'Initiative, AC bonus (capped at +2 for medium armor), Acrobatics, Stealth.']),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'Calculation: '), calcMod('dex')]),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'AC contribution: '), `DEX (${sign(getMod('dex'))}) capped at +2 by Half Plate — your DEX 14 hits the cap exactly.`]),
      h('p', [h('span', { class: 'text-gold-300 font-bold' }, 'Examples: '), 'Dodging attacks, sneaking past guards, catching a falling object.'])
    ]),
    con: () => h('div', [
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'What it means: '), 'Endurance, health, and vitality.']),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'Uses: '), 'Hit Points, concentration saving throws (DC 10 or half damage taken).']),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'Calculation: '), calcMod('con')]),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'HP: '), `Level 1: 8 + ${getMod('con')} = ${8 + getMod('con')}. Levels 2–5: (5 + ${getMod('con')}) × 4 = ${(5 + getMod('con')) * 4}. Total: ${store.hitPoints.max} HP.`]),
      h('p', [h('span', { class: 'text-gold-300 font-bold' }, 'Examples: '), 'Holding your breath, resisting poison, maintaining Spirit Guardians concentration.'])
    ]),
    int: () => h('div', [
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'What it means: '), 'Reasoning, memory, and knowledge.']),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'Uses: '), 'Arcana, History, Investigation, Nature, Religion checks. Your dump stat.']),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'Calculation: '), calcMod('int')]),
      h('p', [h('span', { class: 'text-gold-300 font-bold' }, 'Examples: '), 'Recalling lore, understanding a puzzle, identifying magical effects.'])
    ]),
    wis: () => h('div', [
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'What it means: '), 'Awareness, insight, and intuition. Your most important stat.']),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'Uses: '), 'Spellcasting ability — governs Spell DC, Spell Attack, and WIS-based skills.']),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'Calculation: '), calcMod('wis')]),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'Spellcasting: '), `Spell DC = 8 + WIS (${sign(getMod('wis'))}) + PB (+${store.proficiencyBonus}) = ${8 + getMod('wis') + store.proficiencyBonus}. Spell Attack = WIS (${sign(getMod('wis'))}) + PB (+${store.proficiencyBonus}) = ${sign(getMod('wis') + store.proficiencyBonus)}.`]),
      h('p', [h('span', { class: 'text-gold-300 font-bold' }, 'Examples: '), 'Noticing ambushes, reading emotions, detecting lies.'])
    ]),
    cha: () => h('div', [
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'What it means: '), 'Force of personality, charisma, and persuasiveness.']),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'Uses: '), 'Performance and Persuasion (proficient), Deception, Intimidation.']),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'Calculation: '), calcMod('cha')]),
      h('p', { class: 'mb-2' }, [h('span', { class: 'text-gold-300 font-bold' }, 'Proficient skills: '), `Performance & Persuasion: CHA (${sign(getMod('cha'))}) + PB (+${store.proficiencyBonus}) = ${sign(getMod('cha') + store.proficiencyBonus)}.`]),
      h('p', [h('span', { class: 'text-gold-300 font-bold' }, 'Examples: '), 'Persuading an NPC, performing on stage, charming enemies.'])
    ])
  }
  return tooltips[abbr] || (() => h('div', 'Unknown ability'))
}

import { h } from 'vue'
</script>

<style scoped>
</style>
