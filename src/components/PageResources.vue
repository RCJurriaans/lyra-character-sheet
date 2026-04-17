<template>
  <div class="page-resources space-y-4 md:space-y-6">
    <!-- Page title/icon for clarity -->
    <div class="flex items-center gap-2 mb-2">
      <span class="text-3xl">💎</span>
      <h2 class="text-2xl font-serif font-bold text-gold-300">Resources & Economy</h2>
    </div>

    <!-- Content Grid: 2-col on desktop, 1-col on mobile -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      <!-- Column 1: Healing Widget -->
      <div class="space-y-4">
        <HealingWidget />
      </div>

      <!-- Column 2: Lucky Points & Features -->
      <div class="space-y-4">
        <LuckyPointsWidget />
        <FeatureTracker />
      </div>
    </div>
  </div>
</template>

<script setup>
import HealingWidget from './HealingWidget.vue'
import LuckyPointsWidget from './LuckyPointsWidget.vue'
import FeatureTracker from './FeatureTracker.vue'
</script>

<style scoped>
.page-resources {
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
