<template>
  <CardFrame title="⚔️ Action Economy" suit="swords" variant="purple" :show-flip="false">
    <div class="space-y-3">
      <!-- Action -->
      <div class="flex items-center gap-3">
        <input
          type="checkbox"
          :checked="actions.actionUsed"
          @change="actions.actionUsed = !actions.actionUsed"
          class="w-5 h-5 cursor-pointer"
        />
        <label class="flex-1 text-sm font-semibold cursor-pointer">Action</label>
        <span v-if="actions.actionUsed" class="text-xs text-fortuneRed font-bold">USED</span>
        <span v-else class="text-xs text-fortuneGreen font-bold">AVAILABLE</span>
      </div>

      <!-- Bonus Action -->
      <div class="flex items-center gap-3">
        <input
          type="checkbox"
          :checked="actions.bonusActionUsed"
          @change="actions.bonusActionUsed = !actions.bonusActionUsed"
          class="w-5 h-5 cursor-pointer"
        />
        <label class="flex-1 text-sm font-semibold cursor-pointer">Bonus Action</label>
        <span v-if="actions.bonusActionUsed" class="text-xs text-fortuneRed font-bold">USED</span>
        <span v-else class="text-xs text-fortuneGreen font-bold">AVAILABLE</span>
      </div>

      <!-- Reaction -->
      <div class="flex items-center gap-3">
        <input
          type="checkbox"
          :checked="actions.reactionUsed"
          @change="actions.reactionUsed = !actions.reactionUsed"
          class="w-5 h-5 cursor-pointer"
        />
        <label class="flex-1 text-sm font-semibold cursor-pointer">Reaction</label>
        <span v-if="actions.reactionUsed" class="text-xs text-fortuneRed font-bold">USED</span>
        <span v-else class="text-xs text-fortuneGreen font-bold">AVAILABLE</span>
      </div>

      <!-- Movement -->
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
import { reactive } from 'vue'
import CardFrame from './CardFrame.vue'
import { characterStore } from '../stores/characterStore.js'

// Initialize action economy if not exists
if (!characterStore.actions) {
  characterStore.actions = reactive({
    actionUsed: false,
    bonusActionUsed: false,
    reactionUsed: false,
    movementUsed: 0
  })
}

const actions = characterStore.actions

const moveDistance = (distance) => {
  if (actions.movementUsed + distance <= 35) {
    actions.movementUsed += distance
  }
}

const resetMovement = () => {
  actions.movementUsed = 0
}

const resetActionEconomy = () => {
  actions.actionUsed = false
  actions.bonusActionUsed = false
  actions.reactionUsed = false
  actions.movementUsed = 0
}
</script>

<style scoped>
</style>
