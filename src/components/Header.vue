<template>
  <header class="border-b-2 py-6 px-4 transition-colors duration-300 header-themed">
    <div class="container mx-auto max-w-7xl flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="text-4xl fortune-glow">⭐</div>
        <div>
          <h1 class="text-4xl font-serif font-bold header-title">{{ store.name }}</h1>
          <p class="text-sm header-subtitle">{{ store.race }} {{ store.class }} ({{ store.domain }} Domain) • Level {{ store.level }}</p>
          <p class="text-xs header-meta">{{ store.background }}</p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="hidden md:flex gap-6 text-center items-center">
        <div class="stat-box">
          <div class="text-xs font-bold uppercase stat-label">AC</div>
          <div class="text-2xl font-bold stat-value">{{ store.ac }}</div>
        </div>
        <div class="stat-box">
          <div class="text-xs font-bold uppercase stat-label">Spell DC</div>
          <div class="text-2xl font-bold stat-value">{{ store.spellSaveDC }}</div>
        </div>
        <div class="stat-box">
          <div class="text-xs font-bold uppercase stat-label">Spell ATK</div>
          <div class="text-2xl font-bold stat-value">+{{ store.spellAttackBonus }}</div>
        </div>

        <!-- Theme Selector -->
        <ThemeSelector />
      </div>
    </div>
  </header>
</template>

<script setup>
import { characterStore } from '../stores/characterStore.js'
import ThemeSelector from './ThemeSelector.vue'

const store = characterStore
</script>

<style scoped>
.header-themed {
  border-color: var(--theme-primary);
  background-color: var(--theme-secondary);
}

.header-title {
  color: var(--theme-primary);
}

.header-subtitle {
  color: var(--theme-primaryLight);
}

.header-meta {
  color: var(--theme-textSecondary);
}

.stat-label {
  color: var(--theme-primary);
}

.stat-value {
  color: var(--theme-primaryLight);
}
</style>
