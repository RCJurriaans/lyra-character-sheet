<template>
  <div class="min-h-screen bg-gradient-to-br from-fortuneNavy via-slate-900 to-slate-800">
    <!-- Header -->
    <Header />

    <!-- Character Selector Bar -->
    <div class="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
      <div class="container mx-auto px-2 sm:px-4 py-2 sm:py-3 max-w-7xl">
        <CharacterSelector />
      </div>
    </div>

    <!-- Main Content Grid -->
    <main class="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-7xl">
      <!-- Active Combat Mode -->
      <div v-if="isInCombat" class="mb-6 space-y-4">
        <CombatTracker />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActionEconomy />
          <ConditionTracker />
        </div>
      </div>

      <!-- Death Saves (show when at 0 HP) -->
      <div v-if="characterStore.hitPoints.current === 0" class="mb-6">
        <DeathSaves />
      </div>

      <!-- Main Character Sheet Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        <!-- Column 1: Core Stats -->
        <div class="space-y-4">
          <StatBlock />
          <CharacterLore />
        </div>

        <!-- Column 2: Spellcasting -->
        <div class="space-y-4">
          <SpellSlots />
          <SpellList />
        </div>

        <!-- Column 3: Combat & Resources (spans 1 col on md, 1 col on xl) -->
        <div class="space-y-4 md:col-span-2 xl:col-span-1">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
            <div class="space-y-4">
              <HealingWidget />
              <RollPanel />
            </div>
            <div class="space-y-4">
              <LuckyPointsWidget />
              <FeatureTracker />
            </div>
          </div>
        </div>

        <!-- Column 4: Tracking & Reference (spans full width on md, 1 col on xl) -->
        <div class="space-y-4 md:col-span-2 xl:col-span-1">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
            <SkillChecks />
            <InventoryTracker />
          </div>
        </div>
      </div>

      <!-- Bottom Section: Campaign & Stats -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <CampaignNotes />
        <RollStats />
      </div>

      <!-- Rest & Control Buttons -->
      <div class="mt-8 grid grid-cols-2 md:flex md:justify-center gap-2 md:gap-4 flex-wrap">
        <button @click="longRest" class="btn btn-gold text-xs md:text-sm py-2 px-2 md:px-4 min-h-10 md:min-h-auto">
          ⏰ <span class="hidden xs:inline">Long Rest</span>
        </button>
        <button @click="shortRest" class="btn btn-secondary text-xs md:text-sm py-2 px-2 md:px-4 min-h-10 md:min-h-auto">
          ⚡ <span class="hidden xs:inline">Rest</span>
        </button>
        <button @click="toggleCombat" :class="['btn', isInCombat ? 'btn-secondary' : 'btn-gold', 'text-xs md:text-sm py-2 px-2 md:px-4 min-h-10 md:min-h-auto']">
          {{ isInCombat ? '⊘ End' : '⚔️ Combat' }}
        </button>
        <button @click="resetCharacter" class="btn btn-secondary text-xs md:text-sm py-2 px-2 md:px-4 min-h-10 md:min-h-auto">
          🔄 <span class="hidden xs:inline">Reset</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { longRest, shortRest } from './stores/characterStore.js'
import { characterStore } from './stores/characterStore.js'
import Header from './components/Header.vue'
import CharacterSelector from './components/CharacterSelector.vue'
import StatBlock from './components/StatBlock.vue'
import SpellSlots from './components/SpellSlots.vue'
import SpellList from './components/SpellList.vue'
import RollPanel from './components/RollPanel.vue'
import HealingWidget from './components/HealingWidget.vue'
import LuckyPointsWidget from './components/LuckyPointsWidget.vue'
import FeatureTracker from './components/FeatureTracker.vue'
import CharacterLore from './components/CharacterLore.vue'
import CombatTracker from './components/CombatTracker.vue'
import SkillChecks from './components/SkillChecks.vue'
import ActionEconomy from './components/ActionEconomy.vue'
import ConditionTracker from './components/ConditionTracker.vue'
import DeathSaves from './components/DeathSaves.vue'
import InventoryTracker from './components/InventoryTracker.vue'
import CampaignNotes from './components/CampaignNotes.vue'
import RollStats from './components/RollStats.vue'

const isInCombat = ref(false)

const toggleCombat = () => {
  isInCombat.value = !isInCombat.value
  if (!isInCombat.value) {
    // End combat
    if (characterStore.combatState) {
      characterStore.combatState.initiative = [{ name: characterStore.name, roll: 0, order: 0 }]
      characterStore.combatState.currentRound = 1
      characterStore.combatState.currentTurn = 0
    }
  }
}

const resetCharacter = () => {
  if (confirm('Reset character to default state? This will clear all changes.')) {
    const currentCharacterId = sessionStorage.getItem('currentCharacterId') || 'default'
    localStorage.removeItem(`character-${currentCharacterId}`)
    window.location.reload()
  }
}
</script>

<style scoped>
</style>
