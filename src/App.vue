<template>
  <div class="min-h-screen bg-gradient-to-br from-fortuneNavy via-slate-900 to-slate-800">
    <!-- Header -->
    <Header />

    <!-- Main Content Grid -->
    <main class="container mx-auto px-4 py-6 max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Stats & Info -->
        <div class="lg:col-span-1 space-y-4">
          <StatBlock />
          <CharacterLore />
        </div>

        <!-- Center Column: Spellcasting -->
        <div class="lg:col-span-1 space-y-4">
          <SpellSlots />
          <SpellList />
        </div>

        <!-- Right Column: Combat -->
        <div class="lg:col-span-1 space-y-4">
          <HealingWidget />
          <RollPanel />
          <LuckyPointsWidget />
          <FeatureTracker />
        </div>
      </div>

      <!-- Rest Button -->
      <div class="mt-8 flex justify-center gap-4">
        <button @click="longRest" class="btn btn-gold">
          ⏰ Long Rest (8 hours)
        </button>
        <button @click="shortRest" class="btn btn-secondary">
          ⚡ Short Rest (1 hour)
        </button>
        <button @click="resetCharacter" class="btn btn-secondary">
          🔄 Reset Character
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { longRest, shortRest } from './stores/characterStore.js'
import { loadCharacterState } from './utils/storage.js'
import characterData from './data/character.json'
import Header from './components/Header.vue'
import StatBlock from './components/StatBlock.vue'
import SpellSlots from './components/SpellSlots.vue'
import SpellList from './components/SpellList.vue'
import RollPanel from './components/RollPanel.vue'
import HealingWidget from './components/HealingWidget.vue'
import LuckyPointsWidget from './components/LuckyPointsWidget.vue'
import FeatureTracker from './components/FeatureTracker.vue'
import CharacterLore from './components/CharacterLore.vue'

const resetCharacter = () => {
  if (confirm('Reset character to default state? This will clear all changes.')) {
    localStorage.removeItem('lyra-character-state')
    window.location.reload()
  }
}
</script>

<style scoped>
</style>
