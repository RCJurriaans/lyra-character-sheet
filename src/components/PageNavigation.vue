<template>
  <!-- Desktop: Horizontal Tab Bar -->
  <div class="hidden md:block border-b border-gold-400 bg-slate-800/50 backdrop-blur-sm">
    <div class="container mx-auto px-2 sm:px-4 max-w-7xl">
      <div class="flex gap-1 overflow-x-auto">
        <button
          v-for="page in pages"
          :key="page.id"
          @click="selectPage(page.id)"
          :class="[
            'px-3 sm:px-4 py-3 font-semibold text-sm sm:text-base whitespace-nowrap transition-all border-b-2 flex items-center gap-2',
            currentPage === page.id
              ? 'text-gold-300 border-b-gold-400 bg-slate-700/30'
              : 'text-gray-400 border-b-transparent hover:text-gold-300 hover:border-b-gold-400/50'
          ]"
          :title="page.label"
        >
          <span class="text-lg">{{ page.icon }}</span>
          <span class="hidden sm:inline">{{ page.label }}</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile: Dropdown Select -->
  <div class="md:hidden px-2 sm:px-4 py-3 bg-slate-800/50 backdrop-blur-sm border-b border-gold-400">
    <select
      :value="currentPage"
      @change="selectPage($event.target.value)"
      class="w-full bg-slate-700 text-gold-300 border border-gold-400 rounded px-3 py-2 font-semibold hover:bg-slate-600 transition-colors"
    >
      <option v-for="page in pages" :key="page.id" :value="page.id">
        {{ page.icon }} {{ page.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { navigationState, setCurrentPage } from '../stores/characterStore'

const pages = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'spellcasting', label: 'Spellcasting', icon: '📖' },
  { id: 'combat', label: 'Combat', icon: '⚔️' },
  { id: 'resources', label: 'Resources', icon: '💎' },
  { id: 'skills', label: 'Skills', icon: '⭐' },
  { id: 'inventory', label: 'Inventory', icon: '🎒' },
  { id: 'notes', label: 'Notes', icon: '📝' }
]

const currentPage = computed(() => navigationState.currentPage)

function selectPage(pageId) {
  setCurrentPage(pageId)
}
</script>

<style scoped>
/* Smooth tab transition */
button {
  transition: all 0.3s ease;
}

/* Hide scrollbar while keeping functionality on desktop */
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}

.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
