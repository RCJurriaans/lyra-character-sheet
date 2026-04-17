<template>
  <div class="page-spellcasting space-y-4 md:space-y-6">
    <!-- Page title/icon for clarity -->
    <div class="flex items-center gap-2 mb-2">
      <span class="text-3xl">📖</span>
      <h2 class="text-2xl font-serif font-bold text-gold-300">Spellcasting</h2>
    </div>

    <!-- Content Grid: 2-col on desktop, 1-col on mobile -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      <!-- Column 1: Spell Slots -->
      <div class="space-y-4">
        <SpellSlots />
      </div>

      <!-- Column 2: Spell List -->
      <div class="space-y-4">
        <SpellList />
      </div>
    </div>
  </div>
</template>

<script setup>
import SpellSlots from './SpellSlots.vue'
import SpellList from './SpellList.vue'
</script>

<style scoped>
.page-spellcasting {
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
