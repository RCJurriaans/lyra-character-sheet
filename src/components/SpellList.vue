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
          <div class="flex gap-1 flex-shrink-0">
            <span v-if="spell.domain" class="text-xs bg-gold-400 text-slate-900 px-2 py-0.5 rounded font-bold" title="Life Domain — always prepared">D</span>
            <span v-if="spell.source === 'Thaumaturge'" class="text-xs bg-purple-500 text-white px-2 py-0.5 rounded font-bold" title="Divine Order: Thaumaturge bonus cantrip">T</span>
            <span v-if="spell.source === 'Magic Initiate (Wizard)'" class="text-xs bg-blue-500 text-white px-2 py-0.5 rounded font-bold" title="Magic Initiate (Wizard) — Sage background feat">MI</span>
          </div>
        </div>

        <!-- Expanded spell details -->
        <div v-if="selectedSpell === spell.name" class="mt-2 pt-2 border-t border-slate-600 text-xs text-gray-400">
          <p v-if="spell.castingTime" class="mb-1"><strong>Casting Time:</strong> {{ spell.castingTime }}</p>
          <p v-if="spell.range" class="mb-1"><strong>Range:</strong> {{ spell.range }}</p>
          <p v-if="spell.components" class="mb-1"><strong>Components:</strong> {{ spell.components }}</p>
          <p v-if="spell.duration" class="mb-1"><strong>Duration:</strong> {{ spell.duration }}</p>
          <p v-if="spell.description" class="mt-2">{{ spell.description }}</p>
          <p v-if="spell.damage" class="text-fortuneRed font-bold mt-1">💥 {{ spell.damage }}</p>
          <p v-if="spell.source" class="text-blue-400 mt-1 italic">📌 Source: {{ spell.source }}</p>
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
  // Cantrips — Cleric (4 known at level 5)
  { name: 'Guidance', level: 'Cantrip', type: 'Divination', castingTime: '1 action', range: 'Touch', components: 'V,S', duration: '1 minute', description: 'One willing creature gets +1d4 to one ability check of its choice within 1 minute.' },
  { name: 'Sacred Flame', level: 'Cantrip', type: 'Evocation', castingTime: '1 action', range: '60 feet', components: 'V,S', duration: 'Instantaneous', description: 'Target must succeed on a DC 14 DEX save or take 2d8 radiant damage. No benefit from cover.', damage: '2d8 radiant' },
  { name: 'Toll the Dead', level: 'Cantrip', type: 'Necromancy', castingTime: '1 action', range: '60 feet', components: 'V,S', duration: 'Instantaneous', description: 'Target must succeed on a DC 14 WIS save or take 2d8 necrotic damage (2d12 if already missing any HP).', damage: '2d8 or 2d12 necrotic' },
  { name: 'Spare the Dying', level: 'Cantrip', type: 'Necromancy', castingTime: '1 action', range: 'Touch', components: 'V,S', duration: 'Instantaneous', description: 'Touch a dying creature and stabilize it. Does not restore HP.' },

  // Cantrips — Divine Order: Thaumaturge bonus (doesn't count against Cleric cantrips known)
  { name: 'Thaumaturgy', level: 'Cantrip', type: 'Transmutation', castingTime: '1 action', range: '30 feet', components: 'V', duration: 'Up to 1 minute', description: 'Manifest a minor wonder: alter a flame, cause tremors, change your eye colour, create an eerie sound, open an unlocked door, or make your voice boom. Up to 3 effects at once.', source: 'Thaumaturge' },

  // Cantrips — Magic Initiate (Wizard) from Sage background
  { name: 'Prestidigitation', level: 'Cantrip', type: 'Transmutation', castingTime: '1 action', range: '10 feet', components: 'V,S', duration: 'Up to 1 hour', description: 'Perform a minor magical trick: light or snuff a candle/torch, clean a small object, chill/warm/flavour 1 cubic foot, make a trinket, draw a symbol in the air. Up to 3 effects at once.', source: 'Magic Initiate (Wizard)' },
  { name: 'Mage Hand', level: 'Cantrip', type: 'Conjuration', castingTime: '1 action', range: '30 feet', components: 'V,S', duration: '1 minute', description: 'Create a spectral floating hand that can manipulate objects, open doors, pick up light items (up to 10 lbs). Disappears if you cast it again or move it more than 30 feet away.', source: 'Magic Initiate (Wizard)' },

  // 1st Level Domain Spells (always prepared — Life Domain)
  { name: 'Bless', level: '1st', type: 'Enchantment', domain: true, castingTime: '1 action', range: '30 feet', components: 'V,S,M', duration: 'Concentration, up to 1 minute', description: 'Bless up to 3 creatures. When a target makes an attack roll or saving throw, they roll a d4 and add it to the result.' },
  { name: 'Cure Wounds', level: '1st', type: 'Evocation', domain: true, castingTime: '1 action', range: 'Touch', components: 'V,S', duration: 'Instantaneous', description: 'A creature you touch regains 2d8 + WIS mod HP (+2 extra from Disciple of Life). Upcast: +2d8 per spell level above 1st.' },

  // 1st Level — Magic Initiate (Wizard), can cast using spell slots at 5th level
  { name: 'Find Familiar', level: '1st', type: 'Conjuration', castingTime: '1 hour (ritual)', range: '10 feet', components: 'V,S,M', duration: 'Instantaneous', description: 'Summon a familiar spirit (bat, cat, crab, frog, hawk, lizard, octopus, owl, snake, fish, weasel, spider, or rat). Can see through its eyes, use it to deliver touch spells, and it acts on your turn. 1/day free OR use a spell slot (5th level+).', source: 'Magic Initiate (Wizard)' },

  // 1st Level Chosen Spells
  { name: 'Command', level: '1st', type: 'Enchantment', castingTime: '1 action', range: '60 feet', components: 'V', duration: '1 round', description: 'A creature you can see makes a DC 14 WIS save or obeys a one-word command: Approach, Drop, Flee, Grovel, Halt, Surrender, etc. Doesn\'t work on undead or creatures that don\'t understand you.' },
  { name: 'Healing Word', level: '1st', type: 'Evocation', castingTime: '1 bonus action', range: '60 feet', components: 'V', duration: 'Instantaneous', description: 'Creature within range regains 2d4 + WIS mod HP (+2 extra from Disciple of Life). Bonus action means you can still cast an attack cantrip this turn.' },
  { name: 'Guiding Bolt', level: '1st', type: 'Evocation', castingTime: '1 action', range: '120 feet', components: 'V,S', duration: 'Instantaneous', description: 'Ranged spell attack (+6 to hit). Hit: 4d6 radiant damage. The next attack roll against the target before the end of your next turn has advantage.', damage: '4d6 radiant' },
  { name: 'Sanctuary', level: '1st', type: 'Abjuration', castingTime: '1 bonus action', range: '30 feet', components: 'V,S,M', duration: 'Up to 1 minute', description: 'Ward yourself or a creature within range. Any attacker must succeed on a DC 14 WIS save or be forced to choose a new target (or lose the attack/spell). Does not protect against area effects. Ends immediately if the warded creature attacks, deals damage, or casts a harmful spell.' },
  { name: 'Shield of Faith', level: '1st', type: 'Abjuration', castingTime: '1 bonus action', range: '60 feet', components: 'V,S,M', duration: 'Concentration, up to 10 minutes', description: 'A shimmering field surrounds a creature of your choice, granting +2 AC for the duration.' },

  // 2nd Level Domain Spells (always prepared — Life Domain, 2024 rules)
  { name: 'Aid', level: '2nd', type: 'Abjuration', domain: true, castingTime: '1 action', range: '30 feet', components: 'V,S,M', duration: '8 hours', description: 'Choose up to 3 creatures. Each increases their max HP and current HP by 5 for 8 hours. Upcast: +5 HP per spell level above 2nd.' },
  { name: 'Lesser Restoration', level: '2nd', type: 'Abjuration', domain: true, castingTime: '1 action', range: 'Touch', components: 'V,S', duration: 'Instantaneous', description: 'End one disease or one of the following conditions on a creature you touch: blinded, deafened, paralyzed, or poisoned.' },

  // 2nd Level Chosen Spells
  { name: 'Hold Person', level: '2nd', type: 'Enchantment', castingTime: '1 action', range: '60 feet', components: 'V,S,M', duration: 'Concentration, up to 1 minute', description: 'Humanoid makes a DC 14 WIS save or is paralyzed. They can retry the save at the end of each of their turns.' },

  // 3rd Level Domain Spells (always prepared — Life Domain, 2024 rules)
  { name: 'Mass Healing Word', level: '3rd', type: 'Evocation', domain: true, castingTime: '1 bonus action', range: '60 feet', components: 'V', duration: 'Instantaneous', description: 'Up to 6 creatures you can see each regain 2d4 + WIS mod HP (+2 extra from Disciple of Life). Bonus action, so you can still cast a cantrip this turn.' },
  { name: 'Revivify', level: '3rd', type: 'Necromancy', domain: true, castingTime: '1 action', range: 'Touch', components: 'V,S,M', duration: 'Instantaneous', description: 'Touch a creature that has died within the last minute. It returns to life with 1 HP. Requires a diamond worth 300gp (consumed).' },

  // 3rd Level Chosen Spells
  { name: 'Beacon of Hope', level: '3rd', type: 'Abjuration', castingTime: '1 action', range: '60 feet', components: 'V,S', duration: 'Concentration, up to 1 minute', description: 'Targets have advantage on WIS saves and death saving throws. When they receive healing, they regain the maximum number of HP possible.' },
  { name: 'Spirit Guardians', level: '3rd', type: 'Conjuration', castingTime: '1 action', range: 'Self (15-foot radius)', components: 'V,S,M', duration: 'Concentration, up to 10 minutes', description: 'Spectral guardians swirl around you. Creatures you choose that enter or start their turn in the area must make a DC 14 WIS save or take 3d8 radiant (or necrotic) damage (half on save). Your speed is halved.', damage: '3d8 radiant/necrotic' },
  { name: 'Dispel Magic', level: '3rd', type: 'Abjuration', castingTime: '1 action', range: '120 feet', components: 'V,S', duration: 'Instantaneous', description: 'End any spell of 3rd level or lower on the target. For spells of 4th level or higher, make a spellcasting ability check (DC 10 + spell\'s level).' },
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
