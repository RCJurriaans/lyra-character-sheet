<template>
  <div class="card">
    <h2 class="text-xl font-serif font-bold text-gold-300 mb-4 flex items-center gap-2">
      ❤️ Hit Points
    </h2>

    <!-- HP Bar -->
    <div class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-bold">{{ store.hitPoints.current }} / {{ store.hitPoints.max }}</span>
        <span v-if="store.hitPoints.temporary > 0" class="text-xs text-fortuneGreen">
          +{{ store.hitPoints.temporary }} Temporary
        </span>
      </div>

      <div class="hp-bar">
        <div
          class="hp-fill"
          :style="{ width: hpPercentage + '%', backgroundColor: hpColor }"
        >
          <span v-if="hpPercentage > 15" class="text-white drop-shadow">{{ Math.round(hpPercentage) }}%</span>
        </div>
      </div>
    </div>

    <!-- Damage/Heal Inputs -->
    <div class="space-y-3">
      <div class="flex gap-2">
        <input
          v-model.number="damageAmount"
          type="number"
          min="1"
          placeholder="Damage amount"
          class="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
        />
        <button @click="takeDamage" class="btn btn-gold px-3">
          💔 Damage
        </button>
      </div>

      <div class="flex gap-2">
        <input
          v-model.number="healAmount"
          type="number"
          min="1"
          placeholder="Heal amount"
          class="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
        />
        <button @click="heal" class="btn btn-gold px-3">
          ✨ Heal
        </button>
      </div>

      <div class="flex gap-2">
        <input
          v-model.number="tempHPAmount"
          type="number"
          min="0"
          placeholder="Temporary HP"
          class="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
        />
        <button @click="setTempHP" class="btn btn-secondary px-3">
          Set Temp HP
        </button>
      </div>
    </div>

    <!-- Death Saves -->
    <div v-if="store.hitPoints.current === 0" class="mt-4 p-3 border border-fortuneRed rounded bg-slate-700">
      <div class="text-sm font-bold text-fortuneRed mb-2">Death Saves</div>
      <div class="flex gap-2">
        <span class="text-xs">Successes: ☑️ ☑️ ☑️</span>
        <span class="text-xs">Failures: ☑️ ☑️ ☑️</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { characterStore, takeDamage as store_takeDamage, heal as store_heal, setTemporaryHP as store_setTempHP } from '../stores/characterStore.js'

const store = characterStore
const damageAmount = ref(1)
const healAmount = ref(1)
const tempHPAmount = ref(0)

const hpPercentage = computed(() => {
  return Math.round((store.hitPoints.current / store.hitPoints.max) * 100)
})

const hpColor = computed(() => {
  const percent = hpPercentage.value
  if (percent > 50) return '#50C878' // Green
  if (percent > 25) return '#FFB700' // Amber
  return '#C41E3A' // Red
})

const takeDamage = () => {
  store_takeDamage(damageAmount.value)
}

const heal = () => {
  store_heal(healAmount.value)
}

const setTempHP = () => {
  store_setTempHP(tempHPAmount.value)
}
</script>

<style scoped>
</style>
