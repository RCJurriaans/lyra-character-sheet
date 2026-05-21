<template>
  <div class="space-y-6">

    <!-- Rules overview -->
    <div class="card">
      <h2 class="text-xl font-serif font-bold text-gold-300 mb-3 flex items-center gap-2">🐾 Find Familiar</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
        <div class="bg-slate-700 rounded p-3">
          <div class="font-bold text-gold-300 mb-1">How Many?</div>
          <div class="text-gray-300">You can have <strong>1 active familiar</strong> at a time. Casting the spell again dismisses the current one to a pocket dimension — you can resummon it later, or choose a new form.</div>
        </div>
        <div class="bg-slate-700 rounded p-3">
          <div class="font-bold text-gold-300 mb-1">How to Cast</div>
          <div class="text-gray-300">
            <div>📜 <strong>Ritual</strong> — 10 min, no slot, <em>unlimited</em></div>
            <div class="mt-1">✨ <strong>MI Free</strong> — instant, 1/Long Rest</div>
            <div class="mt-1">🔮 <strong>Spell Slot</strong> — instant, any time</div>
          </div>
        </div>
        <div class="bg-slate-700 rounded p-3">
          <div class="font-bold text-gold-300 mb-1">What It Can Do</div>
          <div class="text-gray-300">
            <div>👁️ See through its eyes (action)</div>
            <div class="mt-1">🤝 Deliver your touch spells</div>
            <div class="mt-1">💬 Telepathic link within 100 ft</div>
            <div class="mt-1">⚔️ Can't attack; acts on your initiative</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommended for Lyra -->
    <div>
      <h2 class="text-xl font-serif font-bold text-gold-300 mb-3 flex items-center gap-2">⭐ Recommended for Lyra</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FamiliarCard
          v-for="fam in recommended"
          :key="fam.name"
          :familiar="fam"
          :highlight="true"
        />
      </div>
    </div>

    <!-- Filter -->
    <div>
      <h2 class="text-xl font-serif font-bold text-gold-300 mb-3 flex items-center gap-2">📋 All Familiars</h2>
      <div class="flex flex-wrap gap-1 mb-3">
        <button
          @click="filter = null"
          :class="['text-xs px-2 py-0.5 rounded-full font-semibold border transition-colors', !filter ? 'bg-gold-400 text-slate-900 border-gold-400' : 'bg-slate-700 text-gray-400 border-slate-600 hover:border-gray-400']"
        >All</button>
        <button
          v-for="tag in ['land', 'fly', 'water', 'stealth', 'scout']"
          :key="tag"
          @click="filter = filter === tag ? null : tag"
          :class="['text-xs px-2 py-0.5 rounded-full font-semibold border transition-colors capitalize', filter === tag ? 'bg-gold-400 text-slate-900 border-gold-400' : 'bg-slate-700 text-gray-400 border-slate-600 hover:border-gray-400']"
        >{{ tag }}</button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <FamiliarCard
          v-for="fam in filteredFamiliars"
          :key="fam.name"
          :familiar="fam"
          :highlight="false"
        />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, defineComponent, h } from 'vue'

const filter = ref(null)

// ─── Familiar data ─────────────────────────────────────────────────────────
const familiars = [
  {
    name: 'Owl', emoji: '🦉',
    tags: ['fly', 'scout'],
    lyraRating: 5,
    lyraNote: 'The best pick for a healer. Flyby means it can deliver your Cure Wounds without triggering opportunity attacks. 120 ft darkvision, fast, wise — a natural fit for a WIS caster.',
    cr: '0', ac: 11, hp: '1 (1d4−1)', speed: '5 ft, fly 60 ft',
    str: '3 (−4)', dex: '13 (+1)', con: '8 (−1)', int: '2 (−4)', wis: '12 (+1)', cha: '7 (−2)',
    senses: 'Darkvision 120 ft, passive Perception 13',
    skills: 'Perception +3, Stealth +3',
    traits: [
      { name: 'Flyby', desc: 'Doesn\'t provoke opportunity attacks when it flies out of reach — great for delivering touch spells.' },
      { name: 'Keen Hearing & Sight', desc: 'Advantage on Perception checks using hearing or sight.' },
    ],
    action: 'Talons: +3 to hit, 1 slashing damage',
  },
  {
    name: 'Raven', emoji: '🐦‍⬛',
    tags: ['fly', 'scout'],
    lyraRating: 5,
    lyraNote: 'Thematically perfect for Lyra — ravens embody fate, luck, and chaos. Mimicry lets it repeat words and voices, great for roleplay and deception. Fits the Sage scholar aesthetic too.',
    cr: '0', ac: 12, hp: '1 (1d4−1)', speed: '10 ft, fly 50 ft',
    str: '2 (−4)', dex: '14 (+2)', con: '8 (−1)', int: '2 (−4)', wis: '12 (+1)', cha: '6 (−2)',
    senses: 'Passive Perception 11',
    skills: 'Perception +3',
    traits: [
      { name: 'Mimicry', desc: 'Can mimic simple sounds and voices it has heard. A DC 10 Insight check reveals it\'s an imitation.' },
    ],
    action: 'Beak: +4 to hit, 1 piercing damage',
  },
  {
    name: 'Bat', emoji: '🦇',
    tags: ['fly', 'scout'],
    lyraRating: 4,
    lyraNote: 'Blindsight 60 ft is uniquely powerful — it can "see" invisible creatures within 60 ft. Chaotic bat energy fits a Satyr. Fragile (1 HP) but great at detecting hidden threats.',
    cr: '0', ac: 12, hp: '1 (1d4−1)', speed: '5 ft, fly 30 ft',
    str: '2 (−4)', dex: '15 (+2)', con: '8 (−1)', int: '2 (−4)', wis: '12 (+1)', cha: '4 (−3)',
    senses: 'Blindsight 60 ft (disabled if deafened), passive Perception 11',
    skills: 'Perception +3',
    traits: [
      { name: 'Echolocation', desc: 'Blindsight fails while deafened.' },
      { name: 'Keen Hearing', desc: 'Advantage on Perception checks using hearing.' },
    ],
    action: 'Bite: +0 to hit, 1 piercing damage',
  },
  {
    name: 'Cat', emoji: '🐱',
    tags: ['land', 'stealth'],
    lyraRating: 4,
    lyraNote: 'Excellent in social and urban settings — doesn\'t look suspicious. Stealth +4 and climb 30 ft make it a great scout in buildings. Easy to carry around without raising eyebrows.',
    cr: '0', ac: 12, hp: '2 (1d4)', speed: '40 ft, climb 30 ft',
    str: '3 (−4)', dex: '15 (+2)', con: '10 (+0)', int: '3 (−4)', wis: '12 (+1)', cha: '7 (−2)',
    senses: 'Darkvision 60 ft, passive Perception 13',
    skills: 'Perception +3, Stealth +4',
    traits: [
      { name: 'Keen Smell', desc: 'Advantage on Perception checks using smell.' },
    ],
    action: 'Claws: +0 to hit, 1 slashing damage',
  },
  {
    name: 'Hawk', emoji: '🦅',
    tags: ['fly', 'scout'],
    lyraRating: 2,
    cr: '0', ac: 13, hp: '1 (1d4−1)', speed: '10 ft, fly 60 ft',
    str: '5 (−3)', dex: '16 (+3)', con: '8 (−1)', int: '2 (−4)', wis: '14 (+2)', cha: '6 (−2)',
    senses: 'Passive Perception 14',
    skills: 'Perception +4',
    traits: [
      { name: 'Keen Sight', desc: 'Advantage on Perception checks using sight.' },
    ],
    action: 'Talons: +5 to hit, 1 slashing damage',
  },
  {
    name: 'Spider', emoji: '🕷️',
    tags: ['land', 'stealth'],
    lyraRating: 2,
    cr: '0', ac: 12, hp: '1 (1d4−1)', speed: '20 ft, climb 20 ft',
    str: '2 (−4)', dex: '14 (+2)', con: '8 (−1)', int: '1 (−5)', wis: '10 (+0)', cha: '2 (−4)',
    senses: 'Darkvision 30 ft, passive Perception 12',
    skills: 'Stealth +4',
    traits: [
      { name: 'Spider Climb', desc: 'Can climb difficult surfaces including ceilings.' },
      { name: 'Web Sense', desc: 'Knows the exact location of any creature in contact with the same web.' },
      { name: 'Web Walker', desc: 'Ignores movement restrictions from webs.' },
    ],
    action: 'Bite: +4 to hit, 1 piercing + DC 9 CON save or 2 (1d4) poison damage',
  },
  {
    name: 'Weasel', emoji: '🐭',
    tags: ['land', 'stealth'],
    lyraRating: 1,
    cr: '0', ac: 13, hp: '1 (1d4−1)', speed: '30 ft',
    str: '3 (−4)', dex: '16 (+3)', con: '8 (−1)', int: '2 (−4)', wis: '12 (+1)', cha: '3 (−4)',
    senses: 'Passive Perception 13',
    skills: 'Perception +3, Stealth +5',
    traits: [
      { name: 'Keen Hearing & Smell', desc: 'Advantage on Perception checks using hearing or smell.' },
    ],
    action: 'Bite: +5 to hit, 1 piercing damage',
  },
  {
    name: 'Rat', emoji: '🐀',
    tags: ['land', 'stealth'],
    lyraRating: 1,
    cr: '0', ac: 10, hp: '1 (1d4−1)', speed: '20 ft',
    str: '2 (−4)', dex: '11 (+0)', con: '9 (−1)', int: '2 (−4)', wis: '10 (+0)', cha: '4 (−3)',
    senses: 'Darkvision 30 ft, passive Perception 10',
    skills: '',
    traits: [
      { name: 'Keen Smell', desc: 'Advantage on Perception checks using smell.' },
    ],
    action: 'Bite: +0 to hit, 1 piercing damage',
  },
  {
    name: 'Lizard', emoji: '🦎',
    tags: ['land'],
    lyraRating: 1,
    cr: '0', ac: 10, hp: '2 (1d4)', speed: '20 ft, climb 20 ft',
    str: '2 (−4)', dex: '11 (+0)', con: '10 (+0)', int: '1 (−5)', wis: '8 (−1)', cha: '3 (−4)',
    senses: 'Darkvision 30 ft, passive Perception 9',
    skills: '',
    traits: [],
    action: 'Bite: +0 to hit, 1 piercing damage',
  },
  {
    name: 'Frog', emoji: '🐸',
    tags: ['land', 'water'],
    lyraRating: 1,
    cr: '0', ac: 11, hp: '1 (1d4−1)', speed: '20 ft, swim 20 ft',
    str: '1 (−5)', dex: '13 (+1)', con: '8 (−1)', int: '1 (−5)', wis: '8 (−1)', cha: '3 (−4)',
    senses: 'Darkvision 30 ft, passive Perception 9',
    skills: '',
    traits: [
      { name: 'Amphibious', desc: 'Can breathe air and water.' },
      { name: 'Standing Leap', desc: 'Long jump up to 10 ft and high jump up to 5 ft, without a running start.' },
    ],
    action: 'No attacks',
  },
  {
    name: 'Poisonous Snake', emoji: '🐍',
    tags: ['land', 'water'],
    lyraRating: 2,
    cr: '1/8', ac: 13, hp: '2 (1d4)', speed: '30 ft, swim 30 ft',
    str: '2 (−4)', dex: '16 (+3)', con: '11 (+0)', int: '1 (−5)', wis: '10 (+0)', cha: '3 (−4)',
    senses: 'Blindsight 10 ft, passive Perception 10',
    skills: '',
    traits: [],
    action: 'Bite: +5 to hit, 1 piercing + DC 10 CON save or 5 (2d4) poison damage',
  },
  {
    name: 'Octopus', emoji: '🐙',
    tags: ['water', 'stealth'],
    lyraRating: 2,
    cr: '0', ac: 13, hp: '3 (1d6)', speed: '5 ft, swim 30 ft',
    str: '4 (−3)', dex: '15 (+2)', con: '11 (+0)', int: '3 (−4)', wis: '10 (+0)', cha: '4 (−3)',
    senses: 'Darkvision 30 ft, passive Perception 10',
    skills: 'Perception +2, Stealth +4',
    traits: [
      { name: 'Camouflage', desc: 'Advantage on Stealth while in water.' },
      { name: 'Hold Breath', desc: 'Can breathe underwater and hold breath for 30 minutes out of water.' },
    ],
    action: 'Tentacles: +4 to hit, 1 bludgeoning + grappled (escape DC 10)',
  },
  {
    name: 'Crab', emoji: '🦀',
    tags: ['water'],
    lyraRating: 1,
    cr: '0', ac: 11, hp: '2 (1d4)', speed: '20 ft, swim 20 ft',
    str: '2 (−4)', dex: '11 (+0)', con: '10 (+0)', int: '1 (−5)', wis: '8 (−1)', cha: '2 (−4)',
    senses: 'Blindsight 30 ft, passive Perception 9',
    skills: 'Stealth +2',
    traits: [
      { name: 'Amphibious', desc: 'Can breathe air and water.' },
    ],
    action: 'Claw: +0 to hit, 1 bludgeoning',
  },
  {
    name: 'Quipper', emoji: '🐟',
    tags: ['water'],
    lyraRating: 1,
    cr: '0', ac: 13, hp: '1 (1d4−1)', speed: 'swim 40 ft',
    str: '2 (−4)', dex: '16 (+3)', con: '9 (−1)', int: '1 (−5)', wis: '7 (−2)', cha: '2 (−4)',
    senses: 'Darkvision 60 ft, passive Perception 8',
    skills: '',
    traits: [
      { name: 'Blood Frenzy', desc: 'Advantage on melee attacks against creatures that are missing HP.' },
      { name: 'Water Breathing', desc: 'Can only breathe underwater.' },
    ],
    action: 'Bite: +5 to hit, 1 piercing damage',
  },
  {
    name: 'Sea Horse', emoji: '🌊',
    tags: ['water'],
    lyraRating: 1,
    cr: '0', ac: 11, hp: '1 (1d4−1)', speed: 'swim 20 ft',
    str: '1 (−5)', dex: '12 (+1)', con: '8 (−1)', int: '1 (−5)', wis: '10 (+0)', cha: '2 (−4)',
    senses: 'Passive Perception 10',
    skills: '',
    traits: [
      { name: 'Water Breathing', desc: 'Can only breathe underwater.' },
    ],
    action: 'No attacks',
  },
]

const recommended = computed(() => familiars.filter(f => f.lyraRating >= 4))

const filteredFamiliars = computed(() => {
  if (!filter.value) return familiars
  return familiars.filter(f => f.tags.includes(filter.value))
})

// ─── FamiliarCard sub-component ───────────────────────────────────────────
const FamiliarCard = defineComponent({
  props: { familiar: Object, highlight: Boolean },
  setup(props) {
    const expanded = ref(false)
    const stars = computed(() => {
      const r = props.familiar.lyraRating || 0
      return '★'.repeat(r) + '☆'.repeat(5 - r)
    })
    return () => {
      const f = props.familiar
      return h('div', {
        class: [
          'rounded border p-3 cursor-pointer transition-colors',
          props.highlight
            ? 'bg-slate-700 border-gold-400 hover:bg-slate-600'
            : 'bg-slate-800 border-slate-600 hover:bg-slate-700',
        ],
        onClick: () => { expanded.value = !expanded.value }
      }, [
        // Header row
        h('div', { class: 'flex items-center justify-between' }, [
          h('div', { class: 'flex items-center gap-2' }, [
            h('span', { class: 'text-2xl' }, f.emoji),
            h('div', [
              h('div', { class: 'font-bold text-gold-300 text-sm' }, f.name),
              h('div', { class: 'text-xs text-gray-500' }, `CR ${f.cr} · AC ${f.ac} · HP ${f.hp}`),
            ]),
          ]),
          h('div', { class: 'text-right' }, [
            h('div', { class: 'text-xs text-yellow-400 font-mono' }, stars.value),
            h('div', { class: 'text-xs text-gray-500 mt-0.5' }, f.speed),
          ]),
        ]),

        // Lyra note (if recommended)
        f.lyraNote ? h('div', { class: 'mt-2 text-xs text-gold-200 italic bg-slate-600/50 rounded px-2 py-1' }, f.lyraNote) : null,

        // Expanded stats
        expanded.value ? h('div', { class: 'mt-3 pt-2 border-t border-slate-600 text-xs text-gray-400 space-y-1' }, [
          // Ability scores
          h('div', { class: 'grid grid-cols-6 gap-1 text-center mb-2' },
            ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map((ab, i) => {
              const val = [f.str, f.dex, f.con, f.int, f.wis, f.cha][i]
              return h('div', { class: 'bg-slate-600 rounded p-1' }, [
                h('div', { class: 'text-gold-400 font-bold' }, ab),
                h('div', { class: 'text-gray-300 text-xs' }, val),
              ])
            })
          ),
          // Senses & skills
          h('p', [h('strong', 'Senses: '), f.senses]),
          f.skills ? h('p', [h('strong', 'Skills: '), f.skills]) : null,
          // Traits
          ...f.traits.map(t =>
            h('p', [h('strong', { class: 'text-gray-300' }, `${t.name}: `), t.desc])
          ),
          // Action
          f.action ? h('p', { class: 'mt-1 text-gray-300 font-medium' }, [h('strong', 'Action: '), f.action]) : null,
          // Tags
          h('div', { class: 'flex gap-1 flex-wrap mt-1' },
            f.tags.map(tag =>
              h('span', { class: 'text-xs bg-slate-600 text-gray-300 px-1.5 py-0.5 rounded capitalize' }, tag)
            )
          ),
        ]) : null,

        // Expand hint
        h('div', { class: 'text-xs text-gray-600 mt-1 text-center' }, expanded.value ? '▲ collapse' : '▼ details'),
      ])
    }
  }
})
</script>

<style scoped>
</style>
