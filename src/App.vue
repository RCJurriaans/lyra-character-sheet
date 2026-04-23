<template>
  <div class="min-h-screen transition-colors duration-300" :style="{ backgroundColor: 'var(--theme-background)' }">
    <!-- Header (always visible) -->
    <Header />

    <!-- Character Selector Bar (always visible) -->
    <div class="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
      <div class="container mx-auto px-2 sm:px-4 py-2 sm:py-3 max-w-7xl">
        <CharacterSelector />
      </div>
    </div>

    <!-- Page Navigation (tab/dropdown switcher) -->
    <PageNavigation />

    <!-- Main Content - Pages -->
    <main class="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-7xl">
      <!-- Page Content: Only one page visible at a time -->
      <PageOverview v-show="navigationState.currentPage === 'overview'" />
      <PageSpellcasting v-show="navigationState.currentPage === 'spellcasting'" />
      <PageCombat v-show="navigationState.currentPage === 'combat'" />
      <PageResources v-show="navigationState.currentPage === 'resources'" />
      <PageSkills v-show="navigationState.currentPage === 'skills'" />
      <PageInventory v-show="navigationState.currentPage === 'inventory'" />
      <PageNotes v-show="navigationState.currentPage === 'notes'" />

      <!-- Contextual Hints Panel -->
      <HintsPanel />

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
import { ref, onMounted } from 'vue'
import { longRest, shortRest, characterStore, navigationState, clearDismissedHints } from './stores/characterStore.js'
import { useTheme } from './stores/themeStore.js'
import Header from './components/Header.vue'
import CharacterSelector from './components/CharacterSelector.vue'
import PageNavigation from './components/PageNavigation.vue'
import HintsPanel from './components/HintsPanel.vue'
import PageOverview from './components/PageOverview.vue'
import PageSpellcasting from './components/PageSpellcasting.vue'
import PageCombat from './components/PageCombat.vue'
import PageResources from './components/PageResources.vue'
import PageSkills from './components/PageSkills.vue'
import PageInventory from './components/PageInventory.vue'
import PageNotes from './components/PageNotes.vue'

const { initTheme } = useTheme()
const isInCombat = ref(false)

onMounted(() => {
  initTheme()
})

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
