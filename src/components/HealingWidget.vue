<template>
  <div class="card">
    <h2 class="text-xl font-serif font-bold text-gold-300 mb-4 flex items-center gap-2">
      ❤️ Hit Points
    </h2>

    <!-- HP Bar -->
    <div class="mb-4">
      <StatTooltip title="Hit Points (HP)">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-bold">{{ store.hitPoints.current }} / {{ store.hitPoints.max }}</span>
          <span v-if="store.hitPoints.temporary > 0" class="text-xs text-fortuneGreen">
            +{{ store.hitPoints.temporary }} Temporary
          </span>
        </div>
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it means:</span> Your current health. When HP reaches 0, you fall unconscious and begin making death saves.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Max HP:</span> {{ store.hitPoints.max }} (8 base + CON modifier ×{{ store.level }} levels)</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Current:</span> {{ store.hitPoints.current }} HP</p>
            <p><span class="text-gold-300 font-bold">When to use:</span> Subtract damage taken. Gain healing from spells or potions. At 0 HP, start making death saves.</p>
          </div>
        </template>
      </StatTooltip>

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
    <div class="flex flex-col gap-4">
      <StatTooltip title="Take Damage">
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
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it does:</span> Reduces your current HP by the damage amount. Damage goes through temporary HP first, then your actual HP.</p>
            <p><span class="text-gold-300 font-bold">When to use:</span> When you take damage from an enemy attack, spell, trap, or hazard, enter the damage value and click Damage.</p>
          </div>
        </template>
      </StatTooltip>

      <StatTooltip title="Heal">
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
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it does:</span> Increases your HP. You cannot exceed your maximum HP.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Sources:</span> Healing Word, Healing Aura, potions, or bed rest (1d4 per day during long rest).</p>
            <p><span class="text-gold-300 font-bold">When to use:</span> After taking damage, enter healing amount and click Heal.</p>
          </div>
        </template>
      </StatTooltip>

      <StatTooltip title="Temporary Hit Points">
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
        <template #content>
          <div>
            <p class="mb-2"><span class="text-gold-300 font-bold">What it means:</span> Extra "shield" HP that absorbs damage first. When you take damage, it reduces Temp HP before your actual HP.</p>
            <p class="mb-2"><span class="text-gold-300 font-bold">Mechanics:</span> Temporary HP doesn't stack—if you get 5 Temp HP when you have 3, you still have 5 (not 8). Temp HP goes away after a long rest or when you would heal.</p>
            <p><span class="text-gold-300 font-bold">Sources:</span> Spells like Arcane Ward, Infusions, or magic items.</p>
          </div>
        </template>
      </StatTooltip>
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
import StatTooltip from './StatTooltip.vue'

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
