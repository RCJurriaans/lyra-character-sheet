<template>
  <header class="border-b-2 border-gold-400 bg-gradient-to-r from-fortuneNavy to-slate-800 py-6 px-4">
    <div class="container mx-auto max-w-7xl flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="text-4xl fortune-glow">⭐</div>
        <div>
          <h1 class="text-4xl font-serif font-bold text-gold-300">{{ store.name }}</h1>
          <p class="text-gold-200 text-sm">{{ store.race }} {{ store.class }} ({{ store.domain }} Domain) • Level {{ store.level }}</p>
          <p class="text-gray-400 text-xs">{{ store.background }}</p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="hidden md:flex gap-6 text-center">
        <div class="stat-box">
          <div class="text-xs text-gold-400 font-bold uppercase">AC</div>
          <div class="text-2xl font-bold text-gold-300">{{ store.ac }}</div>
        </div>
        <div class="stat-box">
          <div class="text-xs text-gold-400 font-bold uppercase">Spell DC</div>
          <div class="text-2xl font-bold text-gold-300">{{ store.spellSaveDC }}</div>
        </div>
        <div class="stat-box">
          <div class="text-xs text-gold-400 font-bold uppercase">Spell ATK</div>
          <div class="text-2xl font-bold text-gold-300">+{{ store.spellAttackBonus }}</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { characterStore } from '../stores/characterStore.js'

const store = characterStore
</script>

<style scoped>
</style>
