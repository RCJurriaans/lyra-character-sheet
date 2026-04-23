<template>
  <div class="page-inventory space-y-4 md:space-y-6">
    <!-- Page title/icon for clarity -->
    <div class="flex items-center gap-2 mb-2">
      <span class="text-3xl">🎒</span>
      <h2 class="text-2xl font-serif font-bold text-gold-300">Inventory</h2>
    </div>

    <InventoryTracker />
  </div>
</template>

<script setup>
import InventoryTracker from './InventoryTracker.vue'
</script>

<style scoped>
.page-inventory {
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
