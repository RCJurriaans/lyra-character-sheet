<template>
  <div class="page-overview space-y-4 md:space-y-6">
    <!-- Page title/icon for clarity -->
    <div class="flex items-center gap-2 mb-2">
      <span class="text-3xl">📊</span>
      <h2 class="text-2xl font-serif font-bold text-gold-300">Character Overview</h2>
    </div>

    <!-- Content Grid: 2-col on desktop, 1-col on mobile -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      <!-- Column 1: Core Stats -->
      <div class="space-y-4">
        <StatBlock />
      </div>

      <!-- Column 2: Character Lore -->
      <div class="space-y-4">
        <CharacterLore />
      </div>
    </div>
  </div>
</template>

<script setup>
import StatBlock from './StatBlock.vue'
import CharacterLore from './CharacterLore.vue'
</script>

<style scoped>
.page-overview {
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
