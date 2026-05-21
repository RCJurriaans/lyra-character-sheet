<template>
  <div class="card">
    <h2 class="text-xl font-serif font-bold text-gold-300 mb-4 flex items-center gap-2">
      📖 Prepared Spells
    </h2>

    <!-- Search -->
    <div class="mb-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search spells..."
        class="w-full bg-slate-700 border border-gold-400 rounded px-2 py-1 text-sm text-gray-100 placeholder-gray-500"
      />
    </div>

    <!-- Category filter pills -->
    <div class="flex flex-wrap gap-1 mb-3">
      <button
        @click="activeFilter = null"
        :class="[
          'text-xs px-2 py-0.5 rounded-full font-semibold border transition-colors',
          !activeFilter
            ? 'bg-gold-400 text-slate-900 border-gold-400'
            : 'bg-slate-700 text-gray-400 border-slate-600 hover:border-gray-400'
        ]"
      >All</button>
      <button
        v-for="(cfg, key) in tagConfig"
        :key="key"
        @click="activeFilter = activeFilter === key ? null : key"
        :class="[
          'text-xs px-2 py-0.5 rounded-full font-semibold border transition-colors',
          activeFilter === key
            ? cfg.activeClass
            : 'bg-slate-700 text-gray-400 border-slate-600 hover:border-gray-400'
        ]"
      >{{ cfg.icon }} {{ cfg.label }}</button>
    </div>

    <!-- Spell count -->
    <div class="text-xs text-gray-500 mb-2">
      {{ filteredSpells.length }} spell{{ filteredSpells.length !== 1 ? 's' : '' }}
      <span v-if="activeFilter || searchQuery"> (filtered)</span>
    </div>

    <div class="max-h-96 overflow-y-auto space-y-2 text-sm">
      <div
        v-for="spell in filteredSpells"
        :key="spell.name"
        :class="[
          'border-l-2 bg-slate-700 p-2 rounded cursor-pointer hover:bg-slate-600 transition-colors',
          getSpellBorderClass(spell)
        ]"
        @click="selectedSpell = selectedSpell === spell.name ? null : spell.name"
      >
        <!-- Collapsed header -->
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0 flex-1">
            <div class="font-bold text-gold-300 flex items-center gap-1 flex-wrap">
              {{ spell.name }}
              <span v-if="spell.tags?.includes('ritual')" class="text-xs text-teal-400" title="Can be cast as a ritual (10 min, no spell slot)">📜</span>
            </div>
            <div class="flex items-center gap-1 flex-wrap mt-0.5">
              <span class="text-xs text-gray-500">{{ spell.level }} • {{ spell.type }}</span>
              <!-- Casting time badge -->
              <span :class="['text-xs px-1.5 py-0 rounded font-semibold', castingTimeBadge(spell).cls]">
                {{ castingTimeBadge(spell).label }}
              </span>
              <!-- Concentration badge -->
              <span v-if="isConcentration(spell)" class="text-xs px-1.5 py-0 rounded font-semibold bg-indigo-900 text-indigo-300" title="Concentration — only one at a time">C</span>
              <!-- Category tags -->
              <span
                v-for="tag in spell.tags?.filter(t => t !== 'ritual')"
                :key="tag"
                :class="['text-xs px-1.5 py-0 rounded-full font-medium', tagConfig[tag]?.pillClass]"
              >{{ tagConfig[tag]?.label }}</span>
            </div>
          </div>
          <!-- Source badges -->
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
          <div class="flex flex-wrap gap-1 mt-2">
            <span v-if="spell.source" class="text-xs text-blue-400 italic">📌 {{ spell.source }}</span>
            <span v-if="spell.tags?.includes('ritual')" class="text-xs text-teal-400 italic">📜 Ritual: cast in 10 min with no spell slot</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedSpell = ref(null)
const activeFilter = ref(null)

const tagConfig = {
  combat:  { label: 'Combat',  icon: '⚔️', pillClass: 'bg-red-900 text-red-300',    activeClass: 'bg-red-700 text-red-100 border-red-500'    },
  healing: { label: 'Healing', icon: '💚', pillClass: 'bg-green-900 text-green-300', activeClass: 'bg-green-700 text-green-100 border-green-500' },
  support: { label: 'Support', icon: '🛡️', pillClass: 'bg-blue-900 text-blue-300',   activeClass: 'bg-blue-700 text-blue-100 border-blue-500'   },
  utility: { label: 'Utility', icon: '🔧', pillClass: 'bg-purple-900 text-purple-300', activeClass: 'bg-purple-700 text-purple-100 border-purple-500' },
  ritual:  { label: 'Ritual',  icon: '📜', pillClass: 'bg-teal-900 text-teal-300',   activeClass: 'bg-teal-700 text-teal-100 border-teal-500'   },
}

const castingTimeBadge = (spell) => {
  const ct = (spell.castingTime || '').toLowerCase()
  if (ct.includes('bonus action')) return { label: '⚡ Bonus Action', cls: 'bg-orange-800 text-orange-200' }
  if (ct.includes('reaction'))     return { label: '↩ Reaction',     cls: 'bg-red-900 text-red-300' }
  if (ct.includes('hour') || ct.includes('minute')) return { label: spell.castingTime, cls: 'bg-teal-900 text-teal-300' }
  return { label: 'Action', cls: 'bg-slate-600 text-gray-400' }
}

const isConcentration = (spell) => spell.duration?.toLowerCase().includes('concentration')

const borderByPrimaryTag = {
  combat:  'border-red-500',
  healing: 'border-green-500',
  support: 'border-blue-500',
  utility: 'border-purple-500',
}

const getSpellBorderClass = (spell) => {
  const primary = spell.tags?.find(t => t !== 'ritual')
  return borderByPrimaryTag[primary] || 'border-gold-400'
}

const spells = [
  // ── Cantrips ─────────────────────────────────────────────────────────────
  { name: 'Guidance',         level: 'Cantrip', type: 'Divination',    tags: ['support'],
    castingTime: '1 action',      range: 'Touch',    components: 'V,S', duration: '1 minute',
    description: 'One willing creature gets +1d4 to one ability check of its choice within 1 minute.' },

  { name: 'Sacred Flame',     level: 'Cantrip', type: 'Evocation',     tags: ['combat'],
    castingTime: '1 action',      range: '60 feet',  components: 'V,S', duration: 'Instantaneous',
    description: 'Target must succeed on a DC 14 DEX save or take 2d8 radiant damage. No benefit from cover.',
    damage: '2d8 radiant' },

  { name: 'Toll the Dead',    level: 'Cantrip', type: 'Necromancy',    tags: ['combat'],
    castingTime: '1 action',      range: '60 feet',  components: 'V,S', duration: 'Instantaneous',
    description: 'Target must succeed on a DC 14 WIS save or take 2d8 necrotic damage (2d12 if already missing any HP).',
    damage: '2d8 or 2d12 necrotic' },

  { name: 'Spare the Dying',  level: 'Cantrip', type: 'Necromancy',    tags: ['utility'],
    castingTime: '1 action',      range: 'Touch',    components: 'V,S', duration: 'Instantaneous',
    description: 'Touch a dying creature (0 HP) and stabilize it. Does not restore HP.' },

  { name: 'Thaumaturgy',      level: 'Cantrip', type: 'Transmutation', tags: ['utility'],
    source: 'Thaumaturge',
    castingTime: '1 action',      range: '30 feet',  components: 'V',   duration: 'Up to 1 minute',
    description: 'Manifest a minor wonder: alter a flame, cause tremors, change your eye colour, create an eerie sound, open an unlocked door, or make your voice boom. Up to 3 effects at once.' },

  { name: 'Prestidigitation', level: 'Cantrip', type: 'Transmutation', tags: ['utility'],
    source: 'Magic Initiate (Wizard)',
    castingTime: '1 action',      range: '10 feet',  components: 'V,S', duration: 'Up to 1 hour',
    description: 'Perform a minor magical trick: light or snuff a flame, clean a small object, chill/warm/flavour food, make a trinket, draw a symbol in air. Up to 3 effects at once.' },

  { name: 'Mage Hand',        level: 'Cantrip', type: 'Conjuration',   tags: ['utility'],
    source: 'Magic Initiate (Wizard)',
    castingTime: '1 action',      range: '30 feet',  components: 'V,S', duration: '1 minute',
    description: 'Spectral floating hand manipulates objects, opens unlocked doors, picks up items up to 10 lbs. Disappears if you cast it again or move it 30+ feet away.' },

  // ── 1st Level ─────────────────────────────────────────────────────────────
  { name: 'Bless',            level: '1st',     type: 'Enchantment',   tags: ['support'],
    domain: true,
    castingTime: '1 action',      range: '30 feet',  components: 'V,S,M', duration: 'Concentration, up to 1 minute',
    description: 'Bless up to 3 creatures. When a target makes an attack roll or saving throw, they roll a d4 and add it to the result.' },

  { name: 'Cure Wounds',      level: '1st',     type: 'Evocation',     tags: ['healing'],
    domain: true,
    castingTime: '1 action',      range: 'Touch',    components: 'V,S', duration: 'Instantaneous',
    description: 'A creature you touch regains 2d8 + WIS mod HP (+2 extra from Disciple of Life). Upcast: +2d8 per spell level above 1st.' },

  { name: 'Find Familiar',    level: '1st',     type: 'Conjuration',   tags: ['utility', 'ritual'],
    source: 'Magic Initiate (Wizard)',
    castingTime: '1 hour',        range: '10 feet',  components: 'V,S,M', duration: 'Instantaneous',
    description: 'Summon a familiar (bat, cat, owl, hawk, rat, raven, spider, weasel, etc.). See through its eyes, deliver touch spells through it, and it acts on your initiative. Your familiar persists until dismissed or killed — you do not resummon it daily. Options to cast: (1) As a ritual — 10 min, no spell slot, unlimited times. (2) Magic Initiate free use — 1/Long Rest, instantly. (3) Spell slot — any time at level 5+.' },

  { name: 'Command',          level: '1st',     type: 'Enchantment',   tags: ['combat'],
    castingTime: '1 action',      range: '60 feet',  components: 'V',   duration: '1 round',
    description: 'A creature makes a DC 14 WIS save or obeys a one-word command: Approach, Drop, Flee, Grovel, Halt, Surrender, etc. Doesn\'t affect undead or creatures that can\'t understand you.' },

  { name: 'Healing Word',     level: '1st',     type: 'Evocation',     tags: ['healing'],
    castingTime: '1 bonus action', range: '60 feet', components: 'V',   duration: 'Instantaneous',
    description: 'Creature within range regains 2d4 + WIS mod HP (+2 extra from Disciple of Life). Bonus action — you can still cast a cantrip or make a weapon attack this turn.' },

  { name: 'Guiding Bolt',     level: '1st',     type: 'Evocation',     tags: ['combat'],
    castingTime: '1 action',      range: '120 feet', components: 'V,S', duration: 'Instantaneous',
    description: 'Ranged spell attack (+6 to hit). Hit: 4d6 radiant damage. The next attack roll against the target before the end of your next turn has advantage.',
    damage: '4d6 radiant' },

  { name: 'Sanctuary',        level: '1st',     type: 'Abjuration',    tags: ['support'],
    castingTime: '1 bonus action', range: '30 feet', components: 'V,S,M', duration: 'Up to 1 minute',
    description: 'Ward yourself or a creature within range. Any attacker must succeed on a DC 14 WIS save or be forced to choose a new target (or lose the attack/spell). Does not protect against area effects. Ends immediately if the warded creature attacks, deals damage, or casts a harmful spell.' },

  { name: 'Shield of Faith',  level: '1st',     type: 'Abjuration',    tags: ['support'],
    castingTime: '1 bonus action', range: '60 feet', components: 'V,S,M', duration: 'Concentration, up to 10 minutes',
    description: 'A shimmering field surrounds a creature of your choice, granting +2 AC for the duration.' },

  // ── 2nd Level ─────────────────────────────────────────────────────────────
  { name: 'Aid',              level: '2nd',     type: 'Abjuration',    tags: ['support'],
    domain: true,
    castingTime: '1 action',      range: '30 feet',  components: 'V,S,M', duration: '8 hours',
    description: 'Choose up to 3 creatures. Each increases their max HP and current HP by 5 for 8 hours. Upcast: +5 HP per spell level above 2nd.' },

  { name: 'Lesser Restoration', level: '2nd',   type: 'Abjuration',    tags: ['utility'],
    domain: true,
    castingTime: '1 action',      range: 'Touch',    components: 'V,S', duration: 'Instantaneous',
    description: 'End one disease or one of the following conditions on a creature you touch: blinded, deafened, paralyzed, or poisoned.' },

  { name: 'Hold Person',      level: '2nd',     type: 'Enchantment',   tags: ['combat'],
    castingTime: '1 action',      range: '60 feet',  components: 'V,S,M', duration: 'Concentration, up to 1 minute',
    description: 'A humanoid makes a DC 14 WIS save or is paralyzed. They can retry the save at the end of each of their turns. Melee attacks against a paralyzed creature within 5 ft are critical hits.' },

  // ── 3rd Level ─────────────────────────────────────────────────────────────
  { name: 'Mass Healing Word', level: '3rd',    type: 'Evocation',     tags: ['healing'],
    domain: true,
    castingTime: '1 bonus action', range: '60 feet', components: 'V',   duration: 'Instantaneous',
    description: 'Up to 6 creatures you can see each regain 2d4 + WIS mod HP (+2 extra from Disciple of Life). Bonus action — you can still cast a cantrip this turn.' },

  { name: 'Revivify',         level: '3rd',     type: 'Necromancy',    tags: ['healing'],
    domain: true,
    castingTime: '1 action',      range: 'Touch',    components: 'V,S,M', duration: 'Instantaneous',
    description: 'Touch a creature that has died within the last minute. It returns to life with 1 HP. Requires a diamond worth 300gp (consumed).' },

  { name: 'Beacon of Hope',   level: '3rd',     type: 'Abjuration',    tags: ['support'],
    castingTime: '1 action',      range: '60 feet',  components: 'V,S', duration: 'Concentration, up to 1 minute',
    description: 'Targets have advantage on WIS saves and death saving throws. When they receive healing, they regain the maximum number of HP possible. Combines extremely well with Mass Healing Word or Cure Wounds.' },

  { name: 'Spirit Guardians', level: '3rd',     type: 'Conjuration',   tags: ['combat'],
    castingTime: '1 action',      range: 'Self (15-ft radius)', components: 'V,S,M', duration: 'Concentration, up to 10 minutes',
    description: 'Spectral guardians swirl around you. Creatures you choose that enter or start their turn in the area make a DC 14 WIS save or take 3d8 radiant (or necrotic) damage (half on save). Your speed is halved.',
    damage: '3d8 radiant/necrotic' },

  { name: 'Dispel Magic',     level: '3rd',     type: 'Abjuration',    tags: ['utility'],
    castingTime: '1 action',      range: '120 feet', components: 'V,S', duration: 'Instantaneous',
    description: 'End any spell of 3rd level or lower on the target automatically. For spells of 4th level or higher, make a DC (10 + spell\'s level) spellcasting ability check.' },
]

const filteredSpells = computed(() => {
  return spells.filter(spell => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = !q ||
      spell.name.toLowerCase().includes(q) ||
      spell.type.toLowerCase().includes(q) ||
      spell.tags?.some(t => t.includes(q))
    const matchesFilter = !activeFilter.value || spell.tags?.includes(activeFilter.value)
    return matchesSearch && matchesFilter
  })
})
</script>

<style scoped>
</style>
