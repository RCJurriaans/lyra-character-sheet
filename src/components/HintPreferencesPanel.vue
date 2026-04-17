<template>
  <div class="hint-preferences-panel space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-2 mb-4">
      <span class="text-2xl">⚙️</span>
      <h3 class="text-xl font-serif font-bold text-gold-300">Hint Preferences</h3>
    </div>

    <!-- Master Toggle -->
    <div class="space-y-2">
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          v-model="localPreferences.enabled"
          class="w-4 h-4 rounded"
          @change="savePreferences"
        />
        <span class="font-semibold">Enable Hints</span>
      </label>
      <p class="text-xs text-gray-400 ml-6">Master toggle to show/hide all hints</p>
    </div>

    <!-- Frequency Selector -->
    <div class="space-y-2">
      <label class="block text-sm font-semibold">Display Frequency</label>
      <select
        v-model="localPreferences.frequency"
        @change="savePreferences"
        class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
      >
        <option value="always">Always Show</option>
        <option value="daily">Daily (once per day)</option>
        <option value="once">Once Per Session</option>
        <option value="never">Never (Manual Only)</option>
      </select>
      <p class="text-xs text-gray-400">How often hints appear automatically</p>
    </div>

    <!-- Category Filters -->
    <div class="space-y-3">
      <label class="block text-sm font-semibold">Hint Categories</label>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            v-model="localPreferences.categories.strategy"
            class="w-4 h-4 rounded"
            @change="savePreferences"
          />
          <span class="text-sm">🎯 Strategy</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            v-model="localPreferences.categories.mechanics"
            class="w-4 h-4 rounded"
            @change="savePreferences"
          />
          <span class="text-sm">⚙️ Mechanics</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            v-model="localPreferences.categories.rules"
            class="w-4 h-4 rounded"
            @change="savePreferences"
          />
          <span class="text-sm">📖 Rules</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            v-model="localPreferences.categories.critical"
            class="w-4 h-4 rounded"
            disabled
          />
          <span class="text-sm">🚨 Critical</span>
          <span class="text-xs text-gray-500">(always on)</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            v-model="localPreferences.categories.reminder"
            class="w-4 h-4 rounded"
            @change="savePreferences"
          />
          <span class="text-sm">💡 Reminder</span>
        </label>
      </div>
      <p class="text-xs text-gray-400">Choose which hint types to display</p>
    </div>

    <!-- Visual Mode -->
    <div class="space-y-2">
      <label class="block text-sm font-semibold">Display Style</label>
      <div class="flex gap-2">
        <button
          v-for="mode in ['compact', 'normal', 'detailed']"
          :key="mode"
          @click="localPreferences.visualMode = mode; savePreferences()"
          :class="[
            'px-3 py-2 rounded text-sm font-medium transition',
            localPreferences.visualMode === mode
              ? 'bg-gold-400 text-slate-900'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          ]"
        >
          {{ mode === 'compact' ? '📄' : mode === 'normal' ? '📋' : '📚' }}
          {{ mode.charAt(0).toUpperCase() + mode.slice(1) }}
        </button>
      </div>
      <p class="text-xs text-gray-400">
        <span v-if="localPreferences.visualMode === 'compact'">Title only, minimal space</span>
        <span v-else-if="localPreferences.visualMode === 'normal'">Title + content + badge</span>
        <span v-else>Full content + related items</span>
      </p>
    </div>

    <!-- Dismissal Mode -->
    <div class="space-y-2">
      <label class="block text-sm font-semibold">Dismissed Hints Behavior</label>
      <select
        v-model="localPreferences.dismissalMode"
        @change="savePreferences"
        class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
      >
        <option value="session">Session Only (reset on long rest)</option>
        <option value="permanent">Permanent (persistent across sessions)</option>
      </select>
      <p class="text-xs text-gray-400">How long to remember dismissed hints</p>
    </div>

    <!-- Difficulty Filter -->
    <div class="space-y-2">
      <label class="block text-sm font-semibold">Show Difficulties</label>
      <div class="flex gap-2">
        <button
          v-for="diff in ['beginner', 'intermediate', 'advanced']"
          :key="diff"
          @click="toggleDifficulty(diff)"
          :class="[
            'px-3 py-2 rounded text-sm font-medium transition',
            localPreferences.difficultiesShown.includes(diff)
              ? 'bg-gold-400 text-slate-900'
              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
          ]"
        >
          {{ diff === 'beginner' ? '1️⃣' : diff === 'intermediate' ? '2️⃣' : '3️⃣' }}
          {{ diff.charAt(0).toUpperCase() + diff.slice(1) }}
        </button>
      </div>
      <p class="text-xs text-gray-400">Select which difficulty levels to show</p>
    </div>

    <!-- Max Hints Slider -->
    <div class="space-y-2">
      <label class="block text-sm font-semibold">Max Hints Per Page</label>
      <div class="flex items-center gap-4">
        <input
          type="range"
          v-model.number="localPreferences.maxHintsPerPage"
          min="1"
          max="5"
          @change="savePreferences"
          class="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
        <span class="text-lg font-bold text-gold-300 w-8 text-center">{{ localPreferences.maxHintsPerPage }}</span>
      </div>
      <p class="text-xs text-gray-400">Display up to 1-5 hints per page</p>
    </div>

    <!-- Critical Only Mode -->
    <div class="space-y-2">
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          v-model="localPreferences.showOnCriticalOnly"
          class="w-4 h-4 rounded"
          @change="savePreferences"
        />
        <span class="font-semibold">Expert Mode (Critical Hints Only)</span>
      </label>
      <p class="text-xs text-gray-400 ml-6">Show only urgent, critical situation hints</p>
    </div>

    <!-- Divider -->
    <hr class="border-slate-700" />

    <!-- Action Buttons -->
    <div class="flex gap-2 pt-4">
      <button
        @click="resetToDefaults"
        class="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded font-medium text-sm transition"
      >
        🔄 Reset to Defaults
      </button>
      <button
        @click="clearAllDismissed"
        class="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded font-medium text-sm transition"
      >
        🔓 Show All Hints
      </button>
    </div>

    <!-- Statistics -->
    <div class="bg-slate-700/50 rounded p-3 text-xs">
      <p class="text-gray-300">
        <span class="font-semibold">Status:</span>
        Hints are {{ localPreferences.enabled ? 'enabled' : 'disabled' }} •
        {{ dismissedCount }} hints dismissed •
        {{ Object.values(localPreferences.categories).filter(v => v).length }}/5 categories active
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { hintPreferences, saveHintPreferences, resetHintPreferences, clearDismissedHints } from '../stores/characterStore.js'
import { navigationState } from '../stores/characterStore.js'

const localPreferences = reactive({
  ...hintPreferences
})

const dismissedCount = computed(() => {
  return navigationState.dismissedHints.length + navigationState.permanentlyDismissedHints.length
})

const savePreferences = () => {
  Object.assign(hintPreferences, localPreferences)
  saveHintPreferences(localPreferences)
}

const toggleDifficulty = (difficulty) => {
  const idx = localPreferences.difficultiesShown.indexOf(difficulty)
  if (idx > -1) {
    localPreferences.difficultiesShown.splice(idx, 1)
  } else {
    localPreferences.difficultiesShown.push(difficulty)
  }
  savePreferences()
}

const resetToDefaults = () => {
  if (confirm('Reset all hint preferences to defaults?')) {
    resetHintPreferences()
    Object.assign(localPreferences, hintPreferences)
  }
}

const clearAllDismissed = () => {
  if (confirm('Show all dismissed hints?')) {
    const dismissalMode = localPreferences.dismissalMode
    clearDismissedHints(dismissalMode === 'permanent')
  }
}
</script>

<style scoped>
.hint-preferences-panel {
  animation: slideIn 0.3s ease-out;
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

input[type='range'] {
  accent-color: #d4af37;
}

input[type='range']:disabled,
input[type='checkbox']:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
