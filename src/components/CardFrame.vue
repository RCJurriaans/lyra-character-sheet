<template>
  <div
    :class="[
      'card tarot-glow tarot-section',
      variantClass,
      { 'opacity-75 hover:opacity-100 transition-opacity': disabled }
    ]"
    @mouseover="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Header with suit symbol and title -->
    <div v-if="title" class="tarot-card-header" :class="`suit-${suit}`">
      <h2 class="text-xl font-serif font-bold text-gold-300 flex-1">{{ title }}</h2>
      <span v-if="subtitle" class="text-xs text-gold-400 font-serif uppercase">{{ subtitle }}</span>
    </div>

    <!-- Card flip animation on hover -->
    <div v-if="showFlip && isHovered" class="animate-card-flip absolute inset-0 rounded-lg flex items-center justify-center">
      <div class="text-4xl font-serif text-gold-400">✦</div>
    </div>

    <!-- Main content slot -->
    <div :class="{ 'opacity-50': isHovered && showFlip }">
      <slot></slot>
    </div>

    <!-- Optional decorative footer -->
    <div v-if="decorative" class="mt-4 pt-3 border-t border-gold-400/30 text-center text-xs text-gold-300">
      ✦ {{ decorativeText }} ✦
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: null
  },
  subtitle: {
    type: String,
    default: null
  },
  suit: {
    type: String,
    enum: ['cups', 'wands', 'coins', 'swords'],
    default: 'coins'
  },
  variant: {
    type: String,
    enum: ['gold', 'purple', 'silver'],
    default: 'gold'
  },
  showFlip: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  decorative: {
    type: Boolean,
    default: false
  },
  decorativeText: {
    type: String,
    default: 'Fortune favors the bold'
  }
})

const isHovered = ref(false)

const variantClass = {
  gold: 'card-tarot-gold',
  purple: 'card-tarot',
  silver: 'card-tarot-silver'
}[props.variant]
</script>

<style scoped>
.tarot-glow {
  transition: all 0.3s ease;
}

.tarot-glow:hover {
  transform: translateY(-2px);
}
</style>
