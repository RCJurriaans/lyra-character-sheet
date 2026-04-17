<template>
  <CardFrame title="🔥 Conditions" suit="cups" variant="gold" :show-flip="false">
    <div class="space-y-3">
      <!-- Active Conditions Summary -->
      <div v-if="characterStore.conditions && characterStore.conditions.length > 0" class="bg-fortuneRed/10 border-l-4 border-fortuneRed p-2 rounded">
        <div class="text-xs font-bold text-fortuneRed mb-1">Active Conditions:</div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="condition in characterStore.conditions"
            :key="condition"
            class="inline-block bg-fortuneRed/20 text-fortuneRed px-2 py-1 rounded text-xs font-semibold"
          >
            {{ conditionLabels[condition] || condition }}
          </span>
        </div>
      </div>

      <!-- Condition Checkboxes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        <div
          v-for="(label, condition) in conditionLabels"
          :key="condition"
          class="flex items-center gap-2 p-2 hover:bg-slate-700 rounded transition-colors"
        >
          <input
            type="checkbox"
            :id="`condition-${condition}`"
            :checked="hasCondition(condition)"
            @change="toggleCondition(condition)"
            class="w-4 h-4 cursor-pointer rounded"
          />
          <label :for="`condition-${condition}`" class="flex-1 text-sm cursor-pointer">
            {{ label }}
          </label>
          <span
            v-if="conditionDescriptions[condition]"
            class="text-xs text-gray-400 ml-auto"
            :title="conditionDescriptions[condition]"
          >
            ?
          </span>
        </div>
      </div>

      <!-- Clear All Button -->
      <div class="border-t border-slate-700 pt-3">
        <button
          v-if="characterStore.conditions && characterStore.conditions.length > 0"
          @click="clearAllConditions"
          class="btn btn-secondary w-full text-sm"
        >
          Clear All Conditions
        </button>
        <p v-else class="text-sm text-gray-400 text-center py-2">No active conditions</p>
      </div>
    </div>
  </CardFrame>
</template>

<script setup>
import { computed } from 'vue'
import CardFrame from './CardFrame.vue'
import { characterStore } from '../stores/characterStore.js'

// Initialize conditions array if not exists
if (!characterStore.conditions) {
  characterStore.conditions = []
}

const conditionLabels = {
  blinded: 'Blinded',
  charmed: 'Charmed',
  deafened: 'Deafened',
  exhaustion: 'Exhaustion',
  frightened: 'Frightened',
  grappled: 'Grappled',
  incapacitated: 'Incapacitated',
  invisible: 'Invisible',
  paralyzed: 'Paralyzed',
  petrified: 'Petrified',
  poisoned: 'Poisoned',
  prone: 'Prone',
  restrained: 'Restrained',
  stunned: 'Stunned',
  unconscious: 'Unconscious',
  concentrating: 'Concentrating'
}

const conditionDescriptions = {
  blinded: 'Unable to see. Disadvantage on attack rolls, attackers have advantage.',
  charmed: 'Friendly to the charmer. Cannot attack charmer. Charm aware when spell ends.',
  deafened: 'Cannot hear. Automatically fails checks that rely on hearing.',
  exhaustion: 'Gain 1 level. 6 levels = death. DC 10 CON save when exposed.',
  frightened: 'Disadvantage on attack rolls and ability checks while source visible.',
  grappled: 'Speed 0. Cannot benefit from speed increases. Escape DC 8 + DEX or STR.',
  incapacitated: 'Cannot take actions or reactions.',
  invisible: 'Unseen. Advantage on attack rolls. Attackers have disadvantage.',
  paralyzed: 'Incapacitated. Critical hit on first attack. Speed 0.',
  petrified: 'Incapacitated. Resistance to all damage. Immune to poison/disease.',
  poisoned: 'Disadvantage on attack rolls and ability checks.',
  prone: 'Melee within 5ft hit with advantage, ranged disadvantage. 0 movement.',
  restrained: 'Speed 0. Disadvantage on attack rolls. Advantage to attack you.',
  stunned: 'Incapacitated. Cannot move. Speech unintelligible.',
  unconscious: 'Incapacitated. Cannot move/speak. Unaware. At 0 HP. Critical hit = auto-fail.',
  concentrating: 'Maintaining spell concentration. Losing HP forces CON save or loses spell.'
}

const hasCondition = (condition) => {
  return characterStore.conditions.includes(condition)
}

const toggleCondition = (condition) => {
  const idx = characterStore.conditions.indexOf(condition)
  if (idx > -1) {
    characterStore.conditions.splice(idx, 1)
  } else {
    characterStore.conditions.push(condition)
  }
}

const clearAllConditions = () => {
  characterStore.conditions = []
}
</script>

<style scoped>
</style>
