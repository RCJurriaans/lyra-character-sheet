<template>
  <header class="border-b-2 py-6 px-4 transition-colors duration-300 header-themed">
    <div class="container mx-auto max-w-7xl flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="text-4xl fortune-glow">⭐</div>
        <div>
          <h1 class="text-4xl font-serif font-bold header-title">{{ store.name }}</h1>
          <p class="text-sm header-subtitle">{{ store.race }} {{ store.class }} ({{ store.domain }} Domain) • Level {{ store.level }}</p>
          <p class="text-xs header-meta">{{ store.background }}</p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="hidden md:flex gap-6 text-center items-center">
        <!-- AC Stat with Tooltip -->
        <StatTooltip title="Armor Class (AC)">
          <div class="stat-box">
            <div class="text-xs font-bold uppercase stat-label">AC</div>
            <div class="text-2xl font-bold stat-value">{{ store.ac }}</div>
          </div>
          <template #content>
            <div>
              <p class="mb-2"><span class="tooltip-emphasis font-bold">What it means:</span> How hard you are to hit in combat. Higher AC = harder to hit.</p>
              <p class="mb-2"><span class="tooltip-emphasis font-bold">Calculation:</span> Base 10 + Armor bonus + Shield bonus + DEX modifier</p>
              <p><span class="tooltip-emphasis font-bold">When to use:</span> Enemies roll d20 + their attack bonus and compare to your AC. If they meet or exceed it, they hit you.</p>
            </div>
          </template>
        </StatTooltip>

        <!-- Spell Save DC with Tooltip -->
        <StatTooltip title="Spell Save DC">
          <div class="stat-box">
            <div class="text-xs font-bold uppercase stat-label">Spell DC</div>
            <div class="text-2xl font-bold stat-value">{{ store.spellSaveDC }}</div>
          </div>
          <template #content>
            <div>
              <p class="mb-2"><span class="tooltip-emphasis font-bold">What it means:</span> The difficulty class for enemies to resist your spells that require saving throws.</p>
              <p class="mb-2"><span class="tooltip-emphasis font-bold">Calculation:</span> 8 + Spellcasting ability modifier (WIS +3) + Proficiency bonus (+3)</p>
              <p><span class="tooltip-emphasis font-bold">When to use:</span> When you cast spells like <em>Hold Person</em> or <em>Toll the Dead</em>, enemies roll saving throws against this DC to resist the effect.</p>
            </div>
          </template>
        </StatTooltip>

        <!-- Spell Attack Bonus with Tooltip -->
        <StatTooltip title="Spell Attack Bonus">
          <div class="stat-box">
            <div class="text-xs font-bold uppercase stat-label">Spell ATK</div>
            <div class="text-2xl font-bold stat-value">+{{ store.spellAttackBonus }}</div>
          </div>
          <template #content>
            <div>
              <p class="mb-2"><span class="tooltip-emphasis font-bold">What it means:</span> Your bonus to attack rolls for spells that require you to hit a target.</p>
              <p class="mb-2"><span class="tooltip-emphasis font-bold">Calculation:</span> Spellcasting ability modifier (WIS +3) + Proficiency bonus (+3)</p>
              <p><span class="tooltip-emphasis font-bold">When to use:</span> When casting spell attacks like <em>Guiding Bolt</em> or <em>Spiritual Weapon</em>, roll d20 + {{ store.spellAttackBonus }} and compare to enemy AC.</p>
            </div>
          </template>
        </StatTooltip>

        <!-- Passive Perception with Tooltip -->
        <StatTooltip title="Passive Perception">
          <div class="stat-box">
            <div class="text-xs font-bold uppercase stat-label">Pass. Perc</div>
            <div class="text-2xl font-bold stat-value">{{ passivePerception }}</div>
          </div>
          <template #content>
            <div>
              <p class="mb-2"><span class="tooltip-emphasis font-bold">What it means:</span> How much detail you notice without actively looking. The DM uses this to determine if you spot hidden creatures or objects.</p>
              <p class="mb-2"><span class="tooltip-emphasis font-bold">Calculation:</span> 10 + Perception modifier (WIS +3 + Proficiency +3 = +6)</p>
              <p><span class="tooltip-emphasis font-bold">When to use:</span> Automatically checked against a creature's Stealth roll. If their roll doesn't beat your Passive Perception, you notice them.</p>
            </div>
          </template>
        </StatTooltip>

        <!-- Theme Selector -->
        <ThemeSelector />
      </div>
    </div>
  </header>
</template>

<script setup>
import { characterStore } from '../stores/characterStore.js'
import StatTooltip from './StatTooltip.vue'
import ThemeSelector from './ThemeSelector.vue'

import { computed } from 'vue'

const store = characterStore
const passivePerception = computed(() => 10 + (store.skills?.perception?.mod ?? 3))
</script>

<style scoped>
.header-themed {
  border-color: var(--theme-primary);
  background-color: var(--theme-secondary);
}

.header-title {
  color: var(--theme-primary);
}

.header-subtitle {
  color: var(--theme-primaryLight);
}

.header-meta {
  color: var(--theme-textSecondary);
}

.stat-label {
  color: var(--theme-primary);
}

.stat-value {
  color: var(--theme-primaryLight);
}

.tooltip-emphasis {
  color: var(--theme-primary);
}
</style>
