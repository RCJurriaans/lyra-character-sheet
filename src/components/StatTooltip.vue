<template>
  <div class="relative inline-block group" ref="triggerElement" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <!-- Trigger element -->
    <div class="cursor-help">
      <slot />
    </div>

    <!-- Tooltip Portal (renders outside scrollable areas) -->
    <Teleport to="body">
      <div
        v-if="isHovered"
        class="fixed z-50 max-w-3xl"
        :style="tooltipPosition"
      >
        <div class="rounded-lg px-6 py-4 text-sm whitespace-normal shadow-lg mx-auto tooltip-box">
          <div class="font-bold mb-3 tooltip-title">{{ title }}</div>
          <div class="text-xs leading-relaxed space-y-2 tooltip-content">
            <slot name="content" />
          </div>
          <!-- Tooltip arrow pointing up -->
          <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent tooltip-arrow"></div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineProps({
  title: {
    type: String,
    required: true
  }
})

const triggerElement = ref(null)
const isHovered = ref(false)

const tooltipPosition = computed(() => {
  if (!triggerElement.value) return {}

  const rect = triggerElement.value.getBoundingClientRect()
  const tooltipHeight = 280
  const tooltipWidth = Math.min(768, window.innerWidth - 32) // max-w-3xl or viewport
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  const padding = 12

  // Vertical: below by default, above if not enough space
  let top
  if ((viewportHeight - rect.bottom) < tooltipHeight && rect.top > tooltipHeight) {
    top = rect.top - tooltipHeight - 8
  } else {
    top = rect.bottom + 8
  }

  // Horizontal: center on trigger, but clamp within viewport
  let left = rect.left + rect.width / 2 - tooltipWidth / 2
  left = Math.max(padding, Math.min(left, viewportWidth - tooltipWidth - padding))

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${tooltipWidth}px`,
    transform: 'none',
    pointerEvents: isHovered.value ? 'auto' : 'none'
  }
})

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  isHovered.value = false
}
</script>

<style scoped>
.tooltip-box {
  background-color: var(--theme-surface);
  border: 2px solid var(--theme-primary);
  color: var(--theme-primaryLight);
}

.tooltip-title {
  color: var(--theme-primary);
}

.tooltip-content {
  color: var(--theme-text);
}

.tooltip-arrow {
  border-b-color: var(--theme-surface);
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
