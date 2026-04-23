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
          <StatTooltip v-if="conditionDetails[condition]" :title="label">
            <span class="condition-help-btn">?</span>
            <template #content>
              <div>
                <p
                  v-for="(detail, i) in conditionDetails[condition]"
                  :key="i"
                  class="mb-1"
                >
                  <span class="font-bold condition-emphasis">{{ detail.label }}:</span>
                  {{ detail.text }}
                </p>
              </div>
            </template>
          </StatTooltip>
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
import CardFrame from './CardFrame.vue'
import StatTooltip from './StatTooltip.vue'
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

const conditionDetails = {
  blinded: [
    { label: 'Your Attacks', text: 'You have disadvantage on attack rolls.' },
    { label: 'Being Attacked', text: 'Attack rolls against you have advantage.' },
    { label: 'Ability Checks', text: 'You automatically fail any check that requires sight.' },
  ],
  charmed: [
    { label: 'Restrictions', text: "You can't attack the charmer or target them with harmful abilities or effects." },
    { label: 'Social', text: 'The charmer has advantage on ability checks to interact with you socially.' },
    { label: 'Awareness', text: 'You know you were charmed once the condition ends.' },
  ],
  deafened: [
    { label: 'Hearing', text: "You can't hear anything." },
    { label: 'Ability Checks', text: 'You automatically fail ability checks that require hearing.' },
  ],
  exhaustion: [
    { label: 'D20 Tests', text: 'You have disadvantage on D20 Tests equal to your Exhaustion level (levels 1–4).' },
    { label: 'Speed (level 5)', text: 'At Exhaustion 5, your Speed drops to 0.' },
    { label: 'Death (level 6)', text: 'At Exhaustion 6, you die.' },
    { label: 'Recovery', text: 'You lose 1 level of Exhaustion when you finish a Long Rest.' },
  ],
  frightened: [
    { label: 'Disadvantage', text: 'You have disadvantage on ability checks and attack rolls while you can see the source of your fear.' },
    { label: 'Movement', text: "You can't willingly move closer to the source of your fear." },
  ],
  grappled: [
    { label: 'Speed', text: "Your speed becomes 0 and can't increase." },
    { label: 'Escape', text: "You can use an action to escape: DC 8 + the grappler's STR or DEX modifier + proficiency bonus." },
    { label: 'Ends When', text: "The condition ends if the grappler is incapacitated, or if you're moved beyond their reach." },
  ],
  incapacitated: [
    { label: 'Actions', text: "You can't take actions." },
    { label: 'Reactions', text: "You can't take reactions." },
  ],
  invisible: [
    { label: 'Your Attacks', text: 'Your attack rolls have advantage.' },
    { label: 'Being Attacked', text: 'Attack rolls against you have disadvantage.' },
    { label: 'Detection', text: "You can't be seen without special magic. You still make noise and leave tracks." },
  ],
  paralyzed: [
    { label: 'Incapacitated', text: "You're incapacitated (no actions or reactions) and can't move or speak." },
    { label: 'Saving Throws', text: 'You automatically fail STR and DEX saving throws.' },
    { label: 'Attack Rolls', text: 'Attack rolls against you have advantage. Any hit within 5 feet is a critical hit.' },
  ],
  petrified: [
    { label: 'Incapacitated', text: "You're incapacitated, can't move or speak, and are unaware of your surroundings." },
    { label: 'Damage', text: 'You have resistance to all damage.' },
    { label: 'Immunity', text: "You're immune to poison and disease; existing ones are suspended." },
    { label: 'Saving Throws', text: 'You automatically fail STR and DEX saving throws. Attack rolls against you have advantage.' },
  ],
  poisoned: [
    { label: 'Attack Rolls', text: 'You have disadvantage on attack rolls.' },
    { label: 'Ability Checks', text: 'You have disadvantage on ability checks.' },
  ],
  prone: [
    { label: 'Movement', text: 'Your only movement option is to crawl (1 extra foot per foot moved) unless you stand up (costs half your speed).' },
    { label: 'Melee Attacks', text: 'Melee attack rolls against you have advantage. Ranged attack rolls have disadvantage.' },
    { label: 'Your Attacks', text: 'Your attack rolls have disadvantage.' },
  ],
  restrained: [
    { label: 'Speed', text: "Your speed becomes 0 and can't increase." },
    { label: 'Attack Rolls', text: 'Attack rolls against you have advantage. Your attack rolls have disadvantage.' },
    { label: 'Saving Throws', text: 'You have disadvantage on DEX saving throws.' },
  ],
  stunned: [
    { label: 'Incapacitated', text: "You're incapacitated (no actions or reactions) and can't move." },
    { label: 'Speech', text: 'You can only speak falteringly.' },
    { label: 'Saving Throws', text: 'You automatically fail STR and DEX saving throws. Attack rolls against you have advantage.' },
  ],
  unconscious: [
    { label: 'Incapacitated', text: "You're incapacitated, can't move or speak, and are unaware of your surroundings." },
    { label: 'Drops', text: "You drop everything you're holding and fall Prone." },
    { label: 'Critical Hits', text: 'Attack rolls against you have advantage. Any hit within 5 feet is a critical hit.' },
    { label: 'Saving Throws', text: 'You automatically fail STR and DEX saving throws.' },
  ],
  concentrating: [
    { label: 'Taking Damage', text: 'When you take damage, make a CON save (DC = half damage taken, minimum 10) or lose concentration.' },
    { label: 'Incapacitation', text: 'If you become incapacitated or die, concentration ends immediately.' },
    { label: 'New Spell', text: 'Casting another concentration spell automatically ends this one.' },
    { label: 'Duration', text: 'Spells can require up to 1 minute, 10 minutes, or 1 hour of concentration.' },
  ],
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
.condition-help-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: transparent;
  border: 1px solid var(--theme-primary, #D4AF37);
  color: var(--theme-primary, #D4AF37);
  font-size: 0.65rem;
  font-weight: bold;
  cursor: help;
  opacity: 0.6;
  transition: opacity 0.15s;
  flex-shrink: 0;
}

.condition-help-btn:hover {
  opacity: 1;
}

.condition-emphasis {
  color: var(--theme-primary);
}
</style>
