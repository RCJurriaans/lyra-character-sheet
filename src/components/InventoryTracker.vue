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
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-1">
        <div
          v-for="(item, idx) in filteredEquipment"
          :key="idx"
          class="bg-slate-700 rounded-lg p-3 border border-slate-600 hover:border-gold-400/60 transition-colors flex flex-col gap-2 min-h-[100px]"
        >
          <!-- Top: type badge + delete -->
          <div class="flex items-start justify-between gap-1">
            <span
              class="text-xs font-medium px-1.5 py-0.5 rounded leading-tight"
              :class="typeBadgeClass(item.type)"
            >
              {{ typeIcon(item.type) }} {{ item.type }}
            </span>
            <button
              @click="removeItem(idx)"
              class="text-red-400 hover:text-red-300 text-xs opacity-60 hover:opacity-100 shrink-0"
              title="Remove item"
            >✕</button>
          </div>

          <!-- Item Name -->
          <div class="text-sm font-semibold text-gray-100 leading-tight flex-1">{{ item.name }}</div>

          <!-- Weight -->
          <div class="text-xs text-gray-500">
            {{ item.weight > 0 ? `${item.weight} lb` : '— lb' }}
          </div>

          <!-- Quantity Controls -->
          <div class="flex items-center gap-1">
            <button
              @click="decrementQuantity(idx)"
              class="btn btn-secondary px-2 py-0.5 text-xs flex-none"
            >−</button>
            <span class="flex-1 text-center text-sm font-bold text-gold-300">{{ item.quantity }}</span>
            <button
              @click="incrementQuantity(idx)"
              class="btn btn-secondary px-2 py-0.5 text-xs flex-none"
            >+</button>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredEquipment.length === 0"
          class="col-span-2 lg:col-span-3 text-center text-gray-400 text-sm py-8"
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
          <select
            v-model="newItem.type"
            class="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
          >
            <option value="weapon">Weapon</option>
            <option value="armor">Armor</option>
            <option value="tool">Tool</option>
            <option value="consumable">Consumable</option>
            <option value="misc">Miscellaneous</option>
          </select>
          <input
            v-model.number="newItem.quantity"
            type="number"
            min="1"
            placeholder="Qty"
            class="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
          />
          <input
            v-model.number="newItem.weight"
            type="number"
            min="0"
            step="0.5"
            placeholder="Weight"
            class="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
          />
        </div>
        <button @click="addItem" class="btn btn-gold w-full text-sm">
          Add Item
        </button>
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

// Initialize equipment if not exists
if (!characterStore.equipment) {
  characterStore.equipment = [
    { name: 'Mace', type: 'weapon', quantity: 1, weight: 4 },
    { name: 'Shield', type: 'armor', quantity: 1, weight: 6 },
    { name: 'Plate Armor', type: 'armor', quantity: 1, weight: 65 },
    { name: 'Holy Symbol (Amulet)', type: 'tool', quantity: 1, weight: 0 },
    { name: "Healer's Kit", type: 'tool', quantity: 1, weight: 3 },
    { name: 'Backpack', type: 'misc', quantity: 1, weight: 5 },
    { name: 'Bedroll', type: 'misc', quantity: 1, weight: 5 },
    { name: 'Waterskin', type: 'misc', quantity: 2, weight: 1 },
    { name: 'Torch', type: 'misc', quantity: 5, weight: 5 },
    { name: 'Rope (50 ft)', type: 'misc', quantity: 1, weight: 10 },
    { name: 'Rations', type: 'consumable', quantity: 20, weight: 20 }
  ]
}

const searchQuery = ref('')
const filterType = ref('')
const newItem = reactive({ name: '', type: 'misc', quantity: 1, weight: 0 })

const typeIcon = (type) => ({
  weapon: '⚔️',
  armor: '🛡️',
  tool: '🔧',
  consumable: '🧪',
  misc: '📦'
}[type] || '📦')

const typeBadgeClass = (type) => ({
  weapon: 'bg-red-900/50 text-red-300',
  armor: 'bg-blue-900/50 text-blue-300',
  tool: 'bg-yellow-900/50 text-yellow-300',
  consumable: 'bg-green-900/50 text-green-300',
  misc: 'bg-slate-600 text-gray-300'
}[type] || 'bg-slate-600 text-gray-300')

const filteredEquipment = computed(() => {
  let items = characterStore.equipment
  if (filterType.value) {
    items = items.filter(i => i.type === filterType.value)
  }
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
      weight: newItem.weight
    })
    newItem.name = ''
    newItem.type = 'misc'
    newItem.quantity = 1
    newItem.weight = 0
  }
}

const incrementQuantity = (idx) => {
  const item = filteredEquipment.value[idx]
  const realIdx = characterStore.equipment.indexOf(item)
  if (realIdx > -1) characterStore.equipment[realIdx].quantity++
}

const decrementQuantity = (idx) => {
  const item = filteredEquipment.value[idx]
  const realIdx = characterStore.equipment.indexOf(item)
  if (realIdx > -1 && characterStore.equipment[realIdx].quantity > 1) {
    characterStore.equipment[realIdx].quantity--
  }
}

const removeItem = (idx) => {
  const item = filteredEquipment.value[idx]
  const realIdx = characterStore.equipment.indexOf(item)
  if (realIdx > -1) characterStore.equipment.splice(realIdx, 1)
}
</script>

<style scoped>
</style>
