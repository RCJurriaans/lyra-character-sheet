<template>
  <div class="hints-panel mt-6">
    <!-- Panel Header -->
    <div class="flex items-center justify-between bg-slate-800 border-2 border-gold-400 rounded-lg p-3 cursor-pointer hover:bg-slate-700/80 transition-colors" @click="isCollapsed = !isCollapsed">
      <div class="flex items-center gap-2">
        <span class="text-2xl">💡</span>
        <h3 class="font-bold text-gold-300">
          {{ isCollapsed ? 'Tips' : 'Tips & Hints for This Page' }}
        </h3>
      </div>
      <button
        @click.stop="isCollapsed = !isCollapsed"
        class="text-gold-300 hover:text-gold-400 transition-colors text-xl"
        :title="isCollapsed ? 'Expand hints' : 'Collapse hints'"
      >
        {{ isCollapsed ? '▼' : '▲' }}
      </button>
    </div>

    <!-- Hints Content (Collapsible) -->
    <transition name="collapse" mode="out-in">
      <div v-if="!isCollapsed" class="hints-content mt-2 space-y-2">
        <!-- Individual Hints -->
        <div
          v-for="hint in applicableHints"
          :key="hint.id"
          class="hint-item bg-slate-800 border border-gold-400/40 rounded-lg p-3 hover:border-gold-400/60 transition-colors"
        >
          <div class="flex items-start justify-between gap-2 mb-1">
            <div class="font-bold text-gold-300 flex-1">{{ hint.title }}</div>
            <button
              @click="dismissHint(hint.id)"
              class="text-xs text-gray-500 hover:text-gold-400 whitespace-nowrap transition-colors flex-shrink-0"
              title="Dismiss this hint for the session"
            >
              ✕
            </button>
          </div>
          <p class="text-sm text-gray-300 leading-relaxed">{{ hint.content }}</p>
        </div>

        <!-- Empty State -->
        <div v-if="applicableHints.length === 0" class="text-center text-gray-500 text-sm py-4">
          No tips for this page right now. You're all set! ✦
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { characterStore, navigationState, dismissHint as dismissHintStore } from '../stores/characterStore'
import { getHintsForPage } from '../utils/hintsData'

const isCollapsed = ref(false)

// Get hints for current page, filtered by conditions and dismissed status
const applicableHints = computed(() => {
  const hints = getHintsForPage(navigationState.currentPage, characterStore)

  // Filter out dismissed hints
  return hints.filter(h => !navigationState.dismissedHints.includes(h.id))
})

function dismissHint(hintId) {
  dismissHintStore(hintId)
}
</script>

<style scoped>
/* Collapse/expand animation */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
}

.collapse-enter-from {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.collapse-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  max-height: 1000px;
}

/* Hints panel specific styles */
.hints-panel {
  position: relative;
}

.hints-content {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hint-item {
  animation: fadeIn 0.2s ease;
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
