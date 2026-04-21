<template>
  <div class="theme-selector">
    <button
      @click="showMenu = !showMenu"
      :style="{
        backgroundColor: theme.colors.primary,
        color: theme.colors.background
      }"
      class="theme-toggle-btn"
    >
      🎨 {{ theme.name }}
    </button>

    <div v-if="showMenu" class="theme-menu">
      <button
        v-for="(t, key) in availableThemes"
        :key="key"
        @click="selectTheme(key)"
        :style="{
          backgroundColor: t.colors.primary,
          borderColor: currentTheme === key ? t.colors.accent : 'transparent'
        }"
        :class="['theme-option', { active: currentTheme === key }]"
      >
        <div class="font-semibold">{{ t.name }}</div>
        <div class="text-xs opacity-75">{{ t.description }}</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTheme } from '../stores/themeStore.js'

const { theme, currentTheme, setTheme, availableThemes } = useTheme()
const showMenu = ref(false)

const selectTheme = (themeName) => {
  setTheme(themeName)
  showMenu.value = false
}
</script>

<style scoped>
.theme-selector {
  position: relative;
}

.theme-toggle-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-toggle-btn:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.theme-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--theme-surface, #2D3E47);
  border: 2px solid var(--theme-primary, #D4AF37);
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-top: 0.5rem;
  min-width: 250px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.theme-option {
  display: block;
  width: 100%;
  padding: 0.75rem;
  border: 2px solid transparent;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  text-align: left;
  color: var(--theme-text, #E8E0D5);
  transition: all 0.2s;
  background-color: var(--theme-surface, #2D3E47);
}

.theme-option:last-child {
  margin-bottom: 0;
}

.theme-option:hover {
  opacity: 0.85;
}

.theme-option.active {
  border-color: var(--theme-accent, #9D4EDD);
  opacity: 1;
}
</style>
