<template>
  <div class="space-y-4">
    <!-- Round Counter -->
    <CardFrame title="🎭 Combat Tracker" suit="swords" variant="gold" :show-flip="false">
      <div class="space-y-4">
        <!-- Round and Turn Display -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-slate-700 rounded p-3 text-center">
            <div class="text-xs text-gold-400 font-bold uppercase">Round</div>
            <div class="text-3xl font-bold text-gold-300">{{ combatState.currentRound }}</div>
            <div class="flex gap-2 justify-center mt-2">
              <button @click="decrementRound" class="btn btn-secondary px-2 py-1 text-sm">−</button>
              <button @click="incrementRound" class="btn btn-gold px-2 py-1 text-sm">+</button>
            </div>
          </div>

          <div class="bg-slate-700 rounded p-3 text-center">
            <div class="text-xs text-gold-400 font-bold uppercase">Turn</div>
            <div class="text-3xl font-bold text-gold-300">{{ combatState.currentTurn + 1 }}</div>
            <div class="flex gap-2 justify-center mt-2">
              <button @click="previousTurn" class="btn btn-secondary px-2 py-1 text-sm">← Prev</button>
              <button @click="nextTurn" class="btn btn-gold px-2 py-1 text-sm">Next →</button>
            </div>
          </div>
        </div>

        <!-- Initiative Order -->
        <div class="border-t border-slate-700 pt-3">
          <h3 class="text-sm font-bold text-gold-300 mb-2">Initiative Order</h3>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div
              v-for="(combatant, idx) in combatState.initiative"
              :key="idx"
              :class="[
                'p-2 rounded flex items-center justify-between cursor-move',
                idx === combatState.currentTurn
                  ? 'bg-gold-400 text-slate-900 font-bold'
                  : 'bg-slate-700 hover:bg-slate-600'
              ]"
            >
              <div class="flex items-center gap-2 flex-1">
                <span class="text-lg">{{ idx + 1 }}.</span>
                <input
                  v-model="combatant.name"
                  type="text"
                  class="flex-1 bg-transparent border-b border-current outline-none text-sm"
                  placeholder="Combatant name"
                />
              </div>
              <div class="flex items-center gap-2">
                <input
                  v-model.number="combatant.roll"
                  type="number"
                  class="w-12 bg-slate-600 rounded px-1 py-0.5 text-sm text-center"
                  placeholder="Init"
                />
                <button @click="removeCombatant(idx)" class="text-red-400 hover:text-red-300">✕</button>
              </div>
            </div>
          </div>

          <!-- Add Combatant -->
          <div class="mt-3 flex gap-2">
            <input
              v-model="newCombatantName"
              type="text"
              placeholder="Add combatant..."
              class="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
              @keydown.enter="addCombatant"
            />
            <input
              v-model.number="newCombatantInit"
              type="number"
              placeholder="Init"
              class="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
              @keydown.enter="addCombatant"
            />
            <button @click="addCombatant" class="btn btn-gold px-3">Add</button>
          </div>
        </div>

        <!-- Combat Controls -->
        <div class="border-t border-slate-700 pt-3 flex gap-2">
          <button @click="sortByInitiative" class="btn btn-secondary flex-1 text-sm">
            ↓ Sort by Initiative
          </button>
          <button @click="endCombat" class="btn btn-secondary flex-1 text-sm">
            ⊘ End Combat
          </button>
        </div>
      </div>
    </CardFrame>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import CardFrame from './CardFrame.vue'
import { characterStore } from '../stores/characterStore.js'

// Initialize combat state if not exists
if (!characterStore.combatState) {
  characterStore.combatState = reactive({
    initiative: [{ name: 'Lyra', roll: 0, order: 0 }],
    currentRound: 1,
    currentTurn: 0
  })
}

const combatState = characterStore.combatState
const newCombatantName = ref('')
const newCombatantInit = ref(0)

const incrementRound = () => {
  combatState.currentRound++
  // Reset action economy on new round
  if (characterStore.actions) {
    characterStore.actions.actionUsed = false
    characterStore.actions.bonusActionUsed = false
    characterStore.actions.reactionUsed = false
    characterStore.actions.movementUsed = 0
  }
}

const decrementRound = () => {
  if (combatState.currentRound > 1) combatState.currentRound--
}

const nextTurn = () => {
  if (combatState.currentTurn < combatState.initiative.length - 1) {
    combatState.currentTurn++
  } else {
    combatState.currentTurn = 0
    incrementRound()
  }
  // Reset action economy on new turn
  if (characterStore.actions) {
    characterStore.actions.actionUsed = false
    characterStore.actions.bonusActionUsed = false
    characterStore.actions.reactionUsed = false
    characterStore.actions.movementUsed = 0
  }
}

const previousTurn = () => {
  if (combatState.currentTurn > 0) {
    combatState.currentTurn--
  }
}

const addCombatant = () => {
  if (newCombatantName.value.trim()) {
    combatState.initiative.push({
      name: newCombatantName.value,
      roll: newCombatantInit.value,
      order: combatState.initiative.length
    })
    newCombatantName.value = ''
    newCombatantInit.value = 0
  }
}

const removeCombatant = (idx) => {
  combatState.initiative.splice(idx, 1)
  if (combatState.currentTurn >= combatState.initiative.length) {
    combatState.currentTurn = 0
  }
}

const sortByInitiative = () => {
  combatState.initiative.sort((a, b) => b.roll - a.roll)
  combatState.currentTurn = 0
}

const endCombat = () => {
  if (confirm('End combat and reset tracker?')) {
    combatState.initiative = [{ name: 'Lyra', roll: 0, order: 0 }]
    combatState.currentRound = 1
    combatState.currentTurn = 0
  }
}
</script>

<style scoped>
</style>
