<template>
  <div class="card">
    <h2 class="text-xl font-serif font-bold text-gold-300 mb-4 flex items-center gap-2">
      📖 Prepared Spells
    </h2>

    <div class="mb-3">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search spells..."
        class="w-full bg-slate-700 border border-gold-400 rounded px-2 py-1 text-sm text-gray-100 placeholder-gray-500"
      />
    </div>

    <div class="max-h-96 overflow-y-auto space-y-2 text-sm">
      <div
        v-for="spell in filteredSpells"
        :key="spell.name"
        class="border-l-2 border-gold-400 bg-slate-700 p-2 rounded cursor-pointer hover:bg-slate-600 transition-colors"
        @click="selectedSpell = selectedSpell === spell.name ? null : spell.name"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="font-bold text-gold-300">{{ spell.name }}</div>
            <div class="text-xs text-gray-500">{{ spell.level }} • {{ spell.type }}</div>
          </div>
          <span v-if="spell.domain" class="text-xs bg-gold-400 text-slate-900 px-2 py-0.5 rounded font-bold">D</span>
        </div>

        <!-- Expanded spell details -->
        <div v-if="selectedSpell === spell.name" class="mt-2 pt-2 border-t border-slate-600 text-xs text-gray-400">
          <p v-if="spell.castingTime" class="mb-1"><strong>Casting Time:</strong> {{ spell.castingTime }}</p>
          <p v-if="spell.range" class="mb-1"><strong>Range:</strong> {{ spell.range }}</p>
          <p v-if="spell.components" class="mb-1"><strong>Components:</strong> {{ spell.components }}</p>
          <p v-if="spell.duration" class="mb-1"><strong>Duration:</strong> {{ spell.duration }}</p>
          <p v-if="spell.description" class="mt-2">{{ spell.description }}</p>
          <p v-if="spell.damage" class="text-fortuneRed font-bold mt-1">💥 {{ spell.damage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedSpell = ref(null)

const spells = [
  // Cantrips
  { name: 'Guidance', level: 'Cantrip', type: 'Enchantment', castingTime: '1 action', range: 'Touch', components: 'V,S', duration: '1 minute', description: 'One willing creature gets +1d4 to one ability check of its choice within 1 minute.' },
  { name: 'Sacred Flame', level: 'Cantrip', type: 'Evocation', castingTime: '1 action', range: '60 feet', components: 'V,S', duration: 'Instantaneous', description: 'Radiant flame descends on creature. Dex save or take 2d8 radiant damage. No cover benefit.', damage: '2d8 radiant' },
  { name: 'Toll the Dead', level: 'Cantrip', type: 'Necromancy', castingTime: '1 action', range: '60 feet', components: 'V,S', duration: 'Instantaneous', description: 'Creature makes Wis save or takes 2d8 necrotic damage (2d12 if missing HP).', damage: '2d8 or 2d12 necrotic' },
  { name: 'Spare the Dying', level: 'Cantrip', type: 'Necromancy', castingTime: '1 action', range: 'Touch', components: 'V,S', duration: 'Instantaneous', description: 'Touch a dying creature and stabilize it. Does not restore HP.' },

  // 1st Level Domain Spells
  { name: 'Bless', level: '1st', type: 'Enchantment', domain: true, castingTime: '1 action', range: '30 feet', components: 'V,S', duration: 'Concentration, up to 1 minute', description: 'Bless up to 3 creatures. When target makes attack or save, it rolls d4 and adds result.' },
  { name: 'Cure Wounds', level: '1st', type: 'Evocation', domain: true, castingTime: '1 action', range: 'Touch', components: 'V,S', duration: 'Instantaneous', description: 'Creature regains 1d8 + WIS mod HP.' },

  // 1st Level Chosen Spells
  { name: 'Healing Word', level: '1st', type: 'Evocation', castingTime: '1 bonus action', range: '60 feet', components: 'V,S', duration: 'Instantaneous', description: 'Creature within range regains 1d4 + WIS mod HP.' },
  { name: 'Guiding Bolt', level: '1st', type: 'Evocation', castingTime: '1 action', range: '120 feet', components: 'V,S', duration: 'Instantaneous', description: 'Ranged spell attack. Hit: 4d6 radiant damage. Next attack vs target has advantage before end of your turn.', damage: '4d6 radiant' },
  { name: 'Shield of Faith', level: '1st', type: 'Abjuration', castingTime: '1 bonus action', range: '60 feet', components: 'V,S,M', duration: 'Concentration, up to 10 minutes', description: 'Creature gains +2 AC.' },

  // 2nd Level Domain Spells
  { name: 'Lesser Restoration', level: '2nd', type: 'Abjuration', domain: true, castingTime: '1 action', range: 'Touch', components: 'V,S', duration: 'Instantaneous', description: 'End one disease or condition (blinded, deafened, paralyzed, poisoned).' },
  { name: 'Spiritual Weapon', level: '2nd', type: 'Evocation', domain: true, castingTime: '1 bonus action', range: '60 feet', components: 'V,S', duration: 'Concentration, up to 1 minute', description: 'Create spectral weapon. Melee spell attack: 1d8 + WIS mod force damage.', damage: '1d8 force' },

  // 2nd Level Chosen Spells
  { name: 'Aid', level: '2nd', type: 'Abjuration', castingTime: '1 action', range: '30 feet', components: 'V,S,M', duration: '8 hours', description: 'Choose up to 3 creatures. Each increases max HP and current HP by 5.' },
  { name: 'Hold Person', level: '2nd', type: 'Enchantment', castingTime: '1 action', range: '60 feet', components: 'V,S,M', duration: 'Concentration, up to 1 minute', description: 'Humanoid makes Wis save or is paralyzed. Can retry save at end of each turn.' },

  // 3rd Level Domain Spells
  { name: 'Beacon of Hope', level: '3rd', type: 'Abjuration', domain: true, castingTime: '1 action', range: '60 feet', components: 'V,S', duration: 'Concentration, up to 1 minute', description: 'Targets have advantage on Wis saves and death saves, regain max HP from healing.' },
  { name: 'Revivify', level: '3rd', type: 'Necromancy', domain: true, castingTime: '1 action', range: 'Touch', components: 'V,S,M', duration: 'Instantaneous', description: 'Touch dying creature within 1 minute. Returns to life with 1 HP. Requires 300gp diamond.' },

  // 3rd Level Chosen Spells
  { name: 'Spirit Guardians', level: '3rd', type: 'Conjuration', castingTime: '1 action', range: 'Self (15-foot radius)', components: 'V,S,M', duration: 'Concentration, up to 1 minute', description: 'Spectral guardians protect you. Creatures entering/starting turn in area make Wis save or take 3d8 radiant/necrotic damage (half on save).', damage: '3d8 radiant/necrotic' },
  { name: 'Mass Healing Word', level: '3rd', type: 'Evocation', castingTime: '1 bonus action', range: '60 feet', components: 'V,S', duration: 'Instantaneous', description: 'Up to 6 creatures you can see regain 1d4 + WIS mod HP.' },
  { name: 'Dispel Magic', level: '3rd', type: 'Abjuration', castingTime: '1 action', range: '120 feet', components: 'V,S', duration: 'Instantaneous', description: 'End spells 3rd level or lower. Make ability check vs DC 10 + spell level for 4th+ spells.' },
]

const filteredSpells = computed(() => {
  return spells.filter(spell =>
    spell.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    spell.type.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<style scoped>
</style>
