<template>
  <div class="hints-panel mt-6">
    <!-- Panel Header -->
    <div class="flex items-center justify-between bg-slate-800 border-2 border-gold-400 rounded-lg p-3 cursor-pointer hover:bg-slate-700/80 transition-colors" @click="isCollapsed = !isCollapsed">
      <div class="flex items-center gap-2">
        <span class="text-2xl">💡</span>
        <h3 class="font-bold text-gold-300">
          {{ isCollapsed ? 'Tips' : 'Tips & Hints for This Page' }}
        </h3>
        <span v-if="!isCollapsed && applicableHints.length > 0" class="text-xs text-gray-400">
          ({{ applicableHints.length }}/{{ maxApplicableHints }})
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click.stop="showPreferences = !showPreferences"
          class="text-gold-300 hover:text-gold-400 transition-colors text-lg p-1"
          title="Hint preferences"
        >
          ⚙️
        </button>
        <button
          @click.stop="isCollapsed = !isCollapsed"
          class="text-gold-300 hover:text-gold-400 transition-colors text-xl"
          :title="isCollapsed ? 'Expand hints' : 'Collapse hints'"
        >
          {{ isCollapsed ? '▼' : '▲' }}
        </button>
      </div>
    </div>

    <!-- Preferences Panel -->
    <transition name="collapse">
      <div v-if="showPreferences && !isCollapsed" class="bg-slate-700 rounded-b-lg p-4 border-x-2 border-b-2 border-gold-400/40 max-h-96 overflow-y-auto">
        <HintPreferencesPanel />
      </div>
    </transition>

    <!-- Hints Content (Collapsible) -->
    <transition name="collapse" mode="out-in">
      <div v-if="!isCollapsed" class="hints-content mt-2 space-y-2">
        <!-- Individual Hints -->
        <template v-for="hint in applicableHints" :key="hint.id">
          <!-- Compact mode -->
          <div
            v-if="hintPreferences.visualMode === 'compact'"
            class="hint-item bg-slate-800 border rounded-lg p-2 hover:border-gold-400/60 transition-colors"
            :class="[hint.criticalHighlight ? 'border-red-500/60 bg-red-950/30' : 'border-gold-400/40']"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <span class="text-xs font-bold text-gold-300 flex-shrink-0">{{ getCategoryEmoji(hint.category) }}</span>
                <div class="font-semibold text-gold-300 text-sm truncate flex-1">{{ hint.title }}</div>
                <span class="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-gray-400 flex-shrink-0">{{ hint.difficulty.charAt(0).toUpperCase() }}</span>
              </div>
              <button
                @click="dismissHint(hint.id)"
                class="text-xs text-gray-500 hover:text-gold-400 transition-colors flex-shrink-0"
                title="Dismiss this hint"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Normal mode (default) -->
          <div
            v-else-if="hintPreferences.visualMode === 'normal'"
            class="hint-item bg-slate-800 border rounded-lg p-3 hover:border-gold-400/60 transition-colors"
            :class="[hint.criticalHighlight ? 'border-red-500/60 bg-red-950/30 shadow-lg shadow-red-950/20' : 'border-gold-400/40']"
          >
            <div class="flex items-start justify-between gap-2 mb-2">
              <div class="flex items-start gap-2 flex-1">
                <div class="text-lg flex-shrink-0">{{ getCategoryEmoji(hint.category) }}</div>
                <div>
                  <h4 class="font-bold text-gold-300">{{ hint.title }}</h4>
                  <div class="flex gap-2 mt-1">
                    <span class="inline-block text-xs px-2 py-1 rounded bg-slate-700 text-gray-300">
                      {{ getCategoryLabel(hint.category) }}
                    </span>
                    <span class="inline-block text-xs px-2 py-1 rounded bg-slate-700 text-gray-400">
                      {{ hint.difficulty }}
                    </span>
                    <span v-if="hint.criticalHighlight" class="inline-block text-xs px-2 py-1 rounded bg-red-900 text-red-200">
                      🚨 Critical
                    </span>
                  </div>
                </div>
              </div>
              <button
                @click="dismissHint(hint.id)"
                class="text-xs text-gray-500 hover:text-gold-400 whitespace-nowrap transition-colors flex-shrink-0 mt-1"
                title="Dismiss this hint"
              >
                ✕
              </button>
            </div>
            <p class="text-sm text-gray-300 leading-relaxed">{{ hint.content }}</p>
          </div>

          <!-- Detailed mode -->
          <div
            v-else
            class="hint-item bg-slate-800 border rounded-lg p-3 hover:border-gold-400/60 transition-colors"
            :class="[hint.criticalHighlight ? 'border-red-500/60 bg-red-950/30 shadow-lg shadow-red-950/20' : 'border-gold-400/40']"
          >
            <div class="flex items-start justify-between gap-2 mb-2">
              <div class="flex items-start gap-2 flex-1">
                <div class="text-xl flex-shrink-0">{{ getCategoryEmoji(hint.category) }}</div>
                <h4 class="font-bold text-gold-300">{{ hint.title }}</h4>
              </div>
              <button
                @click="dismissHint(hint.id)"
                class="text-xs text-gray-500 hover:text-gold-400 transition-colors flex-shrink-0"
                title="Dismiss this hint"
              >
                ✕
              </button>
            </div>
            <div class="flex gap-2 mb-2">
              <span class="inline-block text-xs px-2 py-1 rounded bg-slate-700 text-gray-300">
                {{ getCategoryLabel(hint.category) }}
              </span>
              <span class="inline-block text-xs px-2 py-1 rounded bg-slate-700 text-gray-400">
                {{ hint.difficulty }}
              </span>
              <span v-if="hint.criticalHighlight" class="inline-block text-xs px-2 py-1 rounded bg-red-900 text-red-200">
                🚨 Critical
              </span>
            </div>
            <p class="text-sm text-gray-300 leading-relaxed mb-2">{{ hint.content }}</p>
            <div v-if="hint.relatedSpells || hint.relatedFeatures" class="text-xs text-gray-400 border-t border-slate-700 pt-2">
              <div v-if="hint.relatedSpells && hint.relatedSpells.length > 0">
                <span class="font-semibold">Related Spells:</span> {{ hint.relatedSpells.join(', ') }}
              </div>
              <div v-if="hint.relatedFeatures && hint.relatedFeatures.length > 0">
                <span class="font-semibold">Related Features:</span> {{ hint.relatedFeatures.join(', ') }}
              </div>
            </div>
          </div>
        </template>

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
import { characterStore, navigationState, hintPreferences, dismissHint as dismissHintStore, isDismissedHint } from '../stores/characterStore'
import { getHintsForPage } from '../utils/hintsDatabase'
import HintPreferencesPanel from './HintPreferencesPanel.vue'

const isCollapsed = ref(false)
const showPreferences = ref(false)

// Category emojis for visual identification
const categoryEmojis = {
  strategy: '🎯',
  mechanics: '⚙️',
  rules: '📖',
  critical: '🚨',
  reminder: '💡'
}

// Category labels
const categoryLabels = {
  strategy: 'Strategy',
  mechanics: 'Mechanics',
  rules: 'Rules',
  critical: 'Critical',
  reminder: 'Reminder'
}

// Get hints for current page, filtered by conditions and preferences
const allApplicableHints = computed(() => {
  return getHintsForPage(navigationState.currentPage, characterStore)
})

const applicableHints = computed(() => {
  let hints = allApplicableHints.value

  // Filter by preferences
  if (!hintPreferences.enabled) {
    return []
  }

  // Filter by dismissed status (both session and permanent)
  hints = hints.filter(h => !isDismissedHint(h.id))

  // Filter by category (except critical which can't be hidden)
  hints = hints.filter(h => {
    if (h.category === 'critical') return true
    return hintPreferences.categories[h.category] !== false
  })

  // Filter by difficulty
  hints = hints.filter(h => hintPreferences.difficultiesShown.includes(h.difficulty))

  // Filter by critical-only mode
  if (hintPreferences.showOnCriticalOnly) {
    hints = hints.filter(h => h.criticalHighlight)
  }

  // Limit to maxHintsPerPage
  return hints.slice(0, hintPreferences.maxHintsPerPage)
})

const maxApplicableHints = computed(() => {
  return allApplicableHints.value.filter(h => !isDismissedHint(h.id)).length
})

function dismissHint(hintId) {
  const permanent = hintPreferences.dismissalMode === 'permanent'
  dismissHintStore(hintId, permanent)
}

function getCategoryEmoji(category) {
  return categoryEmojis[category] || '💡'
}

function getCategoryLabel(category) {
  return categoryLabels[category] || 'Hint'
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
