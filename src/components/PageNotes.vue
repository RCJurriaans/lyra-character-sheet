<template>
  <div class="page-notes space-y-4 md:space-y-6">
    <!-- Page Header -->
    <div class="flex items-center gap-2 mb-2">
      <span class="text-3xl">📝</span>
      <h2 class="text-2xl font-serif font-bold text-gold-300">Notes & Lore</h2>
    </div>

    <!-- Two-column layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <!-- Campaign Notes -->
      <div>
        <CampaignNotes />
      </div>

      <!-- NPC Tracker -->
      <div>
        <NPCTracker />
      </div>
    </div>
  </div>
</template>

<script setup>
import CampaignNotes from './CampaignNotes.vue'
import NPCTracker from './NPCTracker.vue'
</script>

<style scoped>
.page-notes {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>
