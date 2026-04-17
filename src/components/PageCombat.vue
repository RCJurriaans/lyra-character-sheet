<template>
  <div class="page-combat space-y-4 md:space-y-6">
    <!-- Page title/icon for clarity -->
    <div class="flex items-center gap-2 mb-2">
      <span class="text-3xl">⚔️</span>
      <h2 class="text-2xl font-serif font-bold text-gold-300">Combat</h2>
    </div>

    <!-- Combat Tracker (always visible on this page) -->
    <div class="space-y-4">
      <CombatTracker />
    </div>

    <!-- Death Saves (conditional - only when HP = 0) -->
    <div v-if="characterStore.hitPoints.current === 0" class="space-y-4">
      <DeathSaves />
    </div>

    <!-- Action Economy and Conditions Grid: 2-col on desktop, 1-col on mobile -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      <!-- Column 1: Action Economy -->
      <div class="space-y-4">
        <ActionEconomy />
      </div>

      <!-- Column 2: Condition Tracker -->
      <div class="space-y-4">
        <ConditionTracker />
      </div>
    </div>
  </div>
</template>

<script setup>
import { characterStore } from '../stores/characterStore'
import CombatTracker from './CombatTracker.vue'
import ActionEconomy from './ActionEconomy.vue'
import ConditionTracker from './ConditionTracker.vue'
import DeathSaves from './DeathSaves.vue'
</script>

<style scoped>
.page-combat {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
