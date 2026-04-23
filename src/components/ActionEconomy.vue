<template>
  <CardFrame title="⚔️ Action Economy" suit="swords" variant="purple" :show-flip="false">
    <div class="flex flex-col gap-4">
      <!-- Action -->
      <StatTooltip title="Action">
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            :checked="actions.actionUsed"
            @change="toggleAction"
            class="w-5 h-5 cursor-pointer"
          />
          <label class="flex-1 text-sm font-semibold cursor-pointer">Action</label>
          <span v-if="actions.actionUsed" class="text-xs text-fortuneRed font-bold">USED</span>
          <span v-else class="text-xs text-fortuneGreen font-bold">AVAILABLE</span>
        </div>
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it is:</span> Your main action each turn. You get 1 action per turn.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Common uses:</span> Cast a spell, Attack with a weapon, Dodge, Help an ally, Hide.</p>
            <p><span class="text-gold-300 font-bold">Note:</span> You can use your action to do most things in combat. It resets at the start of your next turn.</p>
          </div>
        </template>
      </StatTooltip>

      <!-- Bonus Action -->
      <StatTooltip title="Bonus Action">
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            :checked="actions.bonusActionUsed"
            @change="toggleBonusAction"
            class="w-5 h-5 cursor-pointer"
          />
          <label class="flex-1 text-sm font-semibold cursor-pointer">Bonus Action</label>
          <span v-if="actions.bonusActionUsed" class="text-xs text-fortuneRed font-bold">USED</span>
          <span v-else class="text-xs text-fortuneGreen font-bold">AVAILABLE</span>
        </div>
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it is:</span> An extra action available only when a spell or ability grants it. You get 0-1 per turn.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">When you have it:</span> Bonus actions come from specific spells (e.g., Spiritual Weapon), abilities, or class features.</p>
            <p><span class="text-gold-300 font-bold">Example:</span> Spiritual Weapon spell lets you use a bonus action to attack with it on your turn.</p>
          </div>
        </template>
      </StatTooltip>

      <!-- Reaction -->
      <StatTooltip title="Reaction">
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            :checked="actions.reactionUsed"
            @change="toggleReaction"
            class="w-5 h-5 cursor-pointer"
          />
          <label class="flex-1 text-sm font-semibold cursor-pointer">Reaction</label>
          <span v-if="actions.reactionUsed" class="text-xs text-fortuneRed font-bold">USED</span>
          <span v-else class="text-xs text-fortuneGreen font-bold">AVAILABLE</span>
        </div>
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it is:</span> An instant response to something that happens. You get 1 reaction per round.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">When you use it:</span> Reactions happen on OTHER people's turns (e.g., when an enemy moves near you, opportunity attack).</p>
            <p><span class="text-gold-300 font-bold">Examples:</span> Opportunity attack, Shield spell to block damage, counterspell to block a spell.</p>
          </div>
        </template>
      </StatTooltip>

      <!-- Movement -->
      <StatTooltip title="Movement Speed">
        <div class="flex items-center gap-3">
          <div class="flex-1">
            <label class="text-sm font-semibold block mb-1">Movement: {{ actions.movementUsed }}/35 ft</label>
            <div class="w-full bg-slate-700 rounded-full h-2">
              <div
                class="bg-fortuneGreen h-2 rounded-full transition-all"
                :style="{ width: (actions.movementUsed / 35) * 100 + '%' }"
              ></div>
            </div>
          </div>
          <button
            @click="resetMovement"
            class="btn btn-secondary px-2 py-0.5 text-xs ml-2"
            :disabled="actions.movementUsed === 0"
          >
            Reset
          </button>
        </div>
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it is:</span> How far you can move each turn. You have 35 ft of movement per turn.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">How it works:</span> You can move before, during, or after your action. You don't have to use all your movement.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Spending movement:</span> Moving through difficult terrain (like trees) costs extra movement (2 ft per 1 ft of movement).</p>
            <p><span class="text-gold-300 font-bold">Note:</span> You can't use movement to leave combat without using Disengage action.</p>
          </div>
        </template>
      </StatTooltip>

      <!-- Quick action buttons -->
      <div class="border-t border-slate-700 pt-3 grid grid-cols-2 gap-2">
        <button @click="moveDistance(5)" class="btn btn-secondary text-xs py-1">Move 5 ft</button>
        <button @click="moveDistance(10)" class="btn btn-secondary text-xs py-1">Move 10 ft</button>
        <button @click="moveDistance(15)" class="btn btn-secondary text-xs py-1">Move 15 ft</button>
        <button @click="moveDistance(20)" class="btn btn-secondary text-xs py-1">Move 20 ft</button>
      </div>

      <!-- Reset button -->
      <button
        @click="resetActionEconomy"
        class="btn btn-gold w-full text-sm mt-3"
      >
        ↻ Reset (Next Turn)
      </button>
    </div>
  </CardFrame>
</template>

<script setup>
import CardFrame from './CardFrame.vue'
import StatTooltip from './StatTooltip.vue'
import { characterStore, saveCharacterState } from '../stores/characterStore.js'

// Initialize action economy if not exists
if (!characterStore.actions) {
  characterStore.actions = {
    actionUsed: false,
    bonusActionUsed: false,
    reactionUsed: false,
    movementUsed: 0
  }
  saveCharacterState(characterStore)
}

const actions = characterStore.actions

const toggleAction = () => {
  actions.actionUsed = !actions.actionUsed
  saveCharacterState(characterStore)
}

const toggleBonusAction = () => {
  actions.bonusActionUsed = !actions.bonusActionUsed
  saveCharacterState(characterStore)
}

const toggleReaction = () => {
  actions.reactionUsed = !actions.reactionUsed
  saveCharacterState(characterStore)
}

const moveDistance = (distance) => {
  if (actions.movementUsed + distance <= 35) {
    actions.movementUsed += distance
    saveCharacterState(characterStore)
  }
}

const resetMovement = () => {
  actions.movementUsed = 0
  saveCharacterState(characterStore)
}

const resetActionEconomy = () => {
  actions.actionUsed = false
  actions.bonusActionUsed = false
  actions.reactionUsed = false
  actions.movementUsed = 0
  saveCharacterState(characterStore)
}
</script>

<style scoped>
</style>
