<template>
  <div class="tarot-card-container">
    <div
      :class="[
        'tarot-card',
        `tarot-${suit}`,
        { 'tarot-card-hover': hoverable }
      ]"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <!-- Card Back (default) -->
      <div v-if="!isHovered || !hoverable" class="tarot-card-back">
        <div class="tarot-card-pattern">
          <span class="tarot-symbol">✦</span>
        </div>
        <div class="tarot-card-text">
          <div class="tarot-card-suit">{{ suitSymbol }}</div>
        </div>
      </div>

      <!-- Card Front (on hover) -->
      <div v-if="isHovered && hoverable" class="tarot-card-front animate-card-flip">
        <div class="tarot-card-header">
          <span class="tarot-arcana-number">{{ arcanaNumber }}</span>
          <span class="tarot-card-suit">{{ suitSymbol }}</span>
        </div>
        <div class="tarot-card-title">{{ title }}</div>
        <div class="tarot-card-description">{{ description }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  suit: {
    type: String,
    enum: ['cups', 'wands', 'coins', 'swords'],
    default: 'coins'
  },
  arcanaNumber: {
    type: String,
    default: 'XI'
  },
  description: {
    type: String,
    default: 'The mysteries of fortune unfold...'
  },
  hoverable: {
    type: Boolean,
    default: true
  }
})

const isHovered = ref(false)

const suitSymbol = computed(() => {
  return {
    cups: '♡',
    wands: '♣',
    coins: '♦',
    swords: '♠'
  }[props.suit]
})
</script>

<style scoped>
.tarot-card-container {
  perspective: 1000px;
  width: 100%;
}

.tarot-card {
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  cursor: pointer;
  border-radius: 8px;
  border: 2px solid var(--tarot-border);
  overflow: hidden;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, var(--tarot-bg-start), var(--tarot-bg-end));
}

.tarot-cups {
  --tarot-border: #d4af37;
  --tarot-bg-start: #5a3a1a;
  --tarot-bg-end: #8b6914;
}

.tarot-wands {
  --tarot-border: #9d4edd;
  --tarot-bg-start: #2d1b4e;
  --tarot-bg-end: #5a189a;
}

.tarot-coins {
  --tarot-border: #c0c0c0;
  --tarot-bg-start: #1a3a4a;
  --tarot-bg-end: #2d5a6e;
}

.tarot-swords {
  --tarot-border: #d4af37;
  --tarot-bg-start: #1a2a3a;
  --tarot-bg-end: #2d4a5a;
}

.tarot-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(212, 175, 55, 0.3);
}

.tarot-card-back,
.tarot-card-front {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  text-align: center;
}

.tarot-card-back {
  position: relative;
}

.tarot-card-pattern {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  opacity: 0.3;
  animation: tarot-shimmer 3s ease-in-out infinite;
}

.tarot-card-text {
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tarot-card-suit {
  font-size: 32px;
  line-height: 1;
}

.tarot-card-front {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  gap: 12px;
}

.tarot-card-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 8px;
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
  font-size: 12px;
  font-weight: bold;
  color: #d4af37;
}

.tarot-arcana-number {
  font-size: 14px;
  font-family: 'Cinzel', serif;
}

.tarot-card-title {
  font-size: 16px;
  font-weight: bold;
  color: #d4af37;
  font-family: 'Cinzel', serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tarot-card-description {
  font-size: 11px;
  color: #c0c0c0;
  line-height: 1.4;
  font-style: italic;
}

@keyframes tarot-shimmer {
  0%, 100% {
    opacity: 0.2;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@media (max-width: 768px) {
  .tarot-card {
    aspect-ratio: 3 / 4;
  }

  .tarot-card-title {
    font-size: 14px;
  }

  .tarot-card-description {
    font-size: 10px;
  }
}
</style>
