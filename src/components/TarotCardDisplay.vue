<template>
  <div class="tarot-card-display">
    <div class="tarot-card-image">
      <component :is="cardComponent" v-if="cardComponent" />
      <div v-else class="tarot-placeholder">
        <span class="tarot-symbol">{{ symbolMap[arcana] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  arcana: {
    type: String,
    enum: [
      'magician',
      'hermit',
      'wheel-of-fortune',
      'justice',
      'tower',
      'star',
      'world'
    ],
    required: true
  }
})

const symbolMap = {
  magician: '①',
  hermit: '⑨',
  'wheel-of-fortune': '⑩',
  justice: 'XI',
  tower: '⑯',
  star: '⑰',
  world: '㉑'
}

const cardComponent = computed(() => {
  // Dynamically import tarot card SVG components
  const cards = {
    magician: () => import('../assets/tarot/magician.svg'),
    'wheel-of-fortune': () => import('../assets/tarot/wheel-of-fortune.svg'),
    justice: () => import('../assets/tarot/justice.svg'),
    tower: () => import('../assets/tarot/the-tower.svg'),
    star: () => import('../assets/tarot/the-star.svg'),
    hermit: null,
    world: null
  }
  return cards[props.arcana]
})
</script>

<style scoped>
.tarot-card-display {
  display: inline-block;
  width: 80px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(139, 105, 20, 0.5), rgba(90, 58, 26, 0.5));
  border: 2px solid #d4af37;
  transition: all 0.3s ease;
}

.tarot-card-display:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(212, 175, 55, 0.4);
}

.tarot-card-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tarot-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #d4af37;
  opacity: 0.6;
}

.tarot-symbol {
  font-family: 'Cinzel', serif;
  font-weight: bold;
}

/* Responsive sizes */
@media (max-width: 768px) {
  .tarot-card-display {
    width: 60px;
    height: 90px;
  }

  .tarot-placeholder {
    font-size: 24px;
  }
}
</style>
