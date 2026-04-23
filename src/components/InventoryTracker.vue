<template>
  <CardFrame title="🎒 Inventory" suit="coins" variant="gold" :show-flip="false">
    <div class="space-y-3">
      <!-- Search + filter row -->
      <div class="flex gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search items..."
          class="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-gray-100"
        />
        <select
          v-model="filterType"
          class="bg-slate-700 border border-slate-600 rounded px-2 py-2 text-sm text-gray-100"
        >
          <option value="">All types</option>
          <option value="weapon">Weapons</option>
          <option value="armor">Armor</option>
          <option value="tool">Tools</option>
          <option value="consumable">Consumables</option>
          <option value="misc">Misc</option>
        </select>
      </div>

      <!-- Item Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-[600px] overflow-y-auto pr-1">
        <div
          v-for="(item, idx) in filteredEquipment"
          :key="idx"
          class="bg-slate-700 rounded-lg border border-slate-600 hover:border-gold-400/60 transition-colors flex flex-col gap-2 p-3"
        >
          <!-- Top row: badge + controls -->
          <div class="flex items-start justify-between gap-2">
            <span class="text-xs font-medium px-1.5 py-0.5 rounded leading-tight shrink-0" :class="typeBadgeClass(item.type)">
              {{ typeIcon(item.type) }} {{ item.type }}
            </span>
            <div class="flex items-center gap-1 shrink-0">
              <button @click="decrementQuantity(idx)" class="btn btn-secondary px-2 py-0.5 text-xs">−</button>
              <span class="w-6 text-center text-sm font-bold text-gold-300">{{ item.quantity }}</span>
              <button @click="incrementQuantity(idx)" class="btn btn-secondary px-2 py-0.5 text-xs">+</button>
              <button @click="removeItem(idx)" class="text-red-400 hover:text-red-300 text-xs ml-1 opacity-60 hover:opacity-100" title="Remove item">✕</button>
            </div>
          </div>

          <!-- Item name + weight -->
          <div>
            <div class="text-sm font-semibold text-gray-100 leading-tight">{{ item.name }}</div>
            <div class="text-xs text-gray-500 mt-0.5">{{ item.weight > 0 ? `${item.weight} lb` : '— lb' }}</div>
          </div>

          <!-- Description (always visible) -->
          <div
            v-if="item.description || knownDescriptions[item.name]"
            class="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap border-t border-slate-600 pt-2"
          >{{ item.description || knownDescriptions[item.name] }}</div>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredEquipment.length === 0"
          class="col-span-2 text-center text-gray-400 text-sm py-8"
        >
          {{ searchQuery || filterType ? 'No items match your search' : 'No items in inventory' }}
        </div>
      </div>

      <!-- Add Item Form -->
      <div class="border-t border-slate-700 pt-3 space-y-2">
        <div class="text-xs font-bold text-gold-400">Add Item</div>
        <input
          v-model="newItem.name"
          type="text"
          placeholder="Item name"
          class="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
          @keydown.enter="addItem"
        />
        <div class="grid grid-cols-3 gap-2">
          <select v-model="newItem.type" class="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm">
            <option value="weapon">Weapon</option>
            <option value="armor">Armor</option>
            <option value="tool">Tool</option>
            <option value="consumable">Consumable</option>
            <option value="misc">Miscellaneous</option>
          </select>
          <input v-model.number="newItem.quantity" type="number" min="1" placeholder="Qty"
            class="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm" />
          <input v-model.number="newItem.weight" type="number" min="0" step="0.5" placeholder="lb"
            class="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm" />
        </div>
        <textarea
          v-model="newItem.description"
          placeholder="Description (optional)..."
          class="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm resize-none"
          rows="2"
        />
        <button @click="addItem" class="btn btn-gold w-full text-sm">Add Item</button>
      </div>

      <!-- Total Weight -->
      <div class="border-t border-slate-700 pt-2 flex justify-between text-sm">
        <span class="text-gray-400">{{ characterStore.equipment.length }} items</span>
        <span class="font-semibold text-gold-400">Total: {{ totalWeight }} lb</span>
      </div>
    </div>
  </CardFrame>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import CardFrame from './CardFrame.vue'
import { characterStore } from '../stores/characterStore.js'

// D&D 2024 descriptions sourced from dnd2024.wikidot.com
const knownDescriptions = {
  'Mace':
    'Simple Melee Weapon | 1d6 Bludgeoning | No properties\n5 GP · 4 lb.',

  'Shield':
    'Armor | AC +2 | Don/Doff: Utilize Action\n10 GP · 6 lb.\n\nYou gain the Armor Class benefit of a Shield only if you have training with it. A creature can wield only one Shield at a time.',

  'Half Plate Armor':
    'Medium Armor | AC 15 + DEX mod (max +2) | Stealth: Disadvantage\n750 GP · 40 lb.\n\nElaborate overlapping metal plates covering the upper body, with chain mail beneath. No Strength requirement. With DEX +2 and a Shield, gives AC 19.',

  'Holy Symbol (Amulet)':
    'Spellcasting Focus | 5 GP\n\nA Holy Symbol is bejeweled or painted to channel divine magic. A Cleric or Paladin can use a Holy Symbol as a Spellcasting Focus.',

  "Healer's Kit":
    'Tool | 10 uses | 5 GP · 3 lb.\n\nA Healer\'s Kit has ten uses. As a Utilize action, you can expend one of its uses to stabilize an Unconscious creature that has 0 Hit Points without needing to make a Wisdom (Medicine) check.',

  'Backpack':
    'Adventuring Gear | 2 GP · 5 lb.\n\nA Backpack holds up to 30 pounds within 1 cubic foot. It can also serve as a saddlebag.',

  'Bedroll':
    'Adventuring Gear | 1 GP · 7 lb.\n\nA Bedroll sleeps one Small or Medium creature. While in a Bedroll, you automatically succeed on saving throws against extreme cold.',

  'Waterskin':
    'Adventuring Gear | 2 SP · 5 lb.\n\nA Waterskin holds up to 4 pints. If you don\'t drink sufficient water, you risk dehydration.',

  'Torch':
    'Adventuring Gear | 1 CP · 1 lb.\n\nA Torch burns for 1 hour, casting Bright Light in a 20-foot radius and Dim Light for an additional 20 feet. When you take the Attack action, you can attack with the Torch as a Simple Melee weapon. On a hit, the target takes 1 Fire damage.',

  'Rope (50 ft)':
    'Adventuring Gear | 1 GP · 5 lb.\n\nAs a Utilize action, you can tie a knot with Rope if you succeed on a DC 10 Dexterity (Sleight of Hand) check. The Rope can be burst with a DC 20 Strength (Athletics) check. You can bind an unwilling creature only if it has the Grappled, Incapacitated, or Restrained condition. Escaping requires a DC 15 Dexterity (Acrobatics) check as an action.',

  'Rations':
    'Adventuring Gear (Consumable) | 5 SP · 2 lb. per day\n\nRations consist of travel-ready food, including jerky, dried fruit, hardtack, and nuts. See the Malnutrition rules for the risks of not eating.',
}

// Migrate: replace incorrectly set Plate Armor with Half Plate Armor
if (characterStore.equipment) {
  characterStore.equipment.forEach(item => {
    if (item.name === 'Plate Armor' && item.type === 'armor') {
      item.name = 'Half Plate Armor'
      item.weight = 40
    }
  })
}

// Initialize equipment if not exists
if (!characterStore.equipment) {
  characterStore.equipment = [
    { name: 'Mace',               type: 'weapon',    quantity: 1,  weight: 4  },
    { name: 'Shield',             type: 'armor',     quantity: 1,  weight: 6  },
    { name: 'Half Plate Armor',   type: 'armor',     quantity: 1,  weight: 40 },
    { name: 'Holy Symbol (Amulet)', type: 'tool',    quantity: 1,  weight: 0  },
    { name: "Healer's Kit",       type: 'tool',      quantity: 1,  weight: 3  },
    { name: 'Backpack',           type: 'misc',      quantity: 1,  weight: 5  },
    { name: 'Bedroll',            type: 'misc',      quantity: 1,  weight: 5  },
    { name: 'Waterskin',          type: 'misc',      quantity: 2,  weight: 1  },
    { name: 'Torch',              type: 'misc',      quantity: 5,  weight: 1  },
    { name: 'Rope (50 ft)',       type: 'misc',      quantity: 1,  weight: 10 },
    { name: 'Rations',            type: 'consumable',quantity: 20, weight: 2  },
  ]
}

const searchQuery = ref('')
const filterType = ref('')
const newItem = reactive({ name: '', type: 'misc', quantity: 1, weight: 0, description: '' })

const typeIcon = (type) => ({ weapon: '⚔️', armor: '🛡️', tool: '🔧', consumable: '🧪', misc: '📦' }[type] || '📦')
const typeBadgeClass = (type) => ({
  weapon: 'bg-red-900/50 text-red-300',
  armor: 'bg-blue-900/50 text-blue-300',
  tool: 'bg-yellow-900/50 text-yellow-300',
  consumable: 'bg-green-900/50 text-green-300',
  misc: 'bg-slate-600 text-gray-300'
}[type] || 'bg-slate-600 text-gray-300')

const filteredEquipment = computed(() => {
  let items = characterStore.equipment
  if (filterType.value) items = items.filter(i => i.type === filterType.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.type.toLowerCase().includes(q))
  }
  return items
})

const totalWeight = computed(() =>
  characterStore.equipment.reduce((total, item) => total + (item.weight || 0) * item.quantity, 0)
)

const addItem = () => {
  if (newItem.name.trim()) {
    characterStore.equipment.push({
      name: newItem.name.trim(),
      type: newItem.type,
      quantity: newItem.quantity,
      weight: newItem.weight,
      description: newItem.description.trim()
    })
    newItem.name = ''
    newItem.type = 'misc'
    newItem.quantity = 1
    newItem.weight = 0
    newItem.description = ''
  }
}

const incrementQuantity = (idx) => {
  const item = filteredEquipment.value[idx]
  const ri = characterStore.equipment.indexOf(item)
  if (ri > -1) characterStore.equipment[ri].quantity++
}

const decrementQuantity = (idx) => {
  const item = filteredEquipment.value[idx]
  const ri = characterStore.equipment.indexOf(item)
  if (ri > -1 && characterStore.equipment[ri].quantity > 1) characterStore.equipment[ri].quantity--
}

const removeItem = (idx) => {
  const item = filteredEquipment.value[idx]
  const ri = characterStore.equipment.indexOf(item)
  if (ri > -1) characterStore.equipment.splice(ri, 1)
}
</script>

<style scoped>
</style>
