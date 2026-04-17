<template>
  <CardFrame title="🎒 Inventory" suit="coins" variant="gold" :show-flip="false">
    <div class="space-y-3">
      <!-- Search Filter -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search items..."
        class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm text-gray-100"
      />

      <!-- Equipment List -->
      <div class="space-y-2 max-h-80 overflow-y-auto">
        <div
          v-for="(item, idx) in filteredEquipment"
          :key="idx"
          class="flex items-center gap-2 p-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
        >
          <!-- Item Details -->
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-gray-100 flex items-center gap-2">
              <span class="text-xs text-gray-400">[{{ item.type }}]</span>
              {{ item.name }}
            </div>
            <div class="text-xs text-gray-400">
              Qty: {{ item.quantity }} | Weight: {{ item.weight || 'N/A' }} lb
            </div>
          </div>

          <!-- Quantity Controls -->
          <div class="flex items-center gap-1">
            <button
              @click="decrementQuantity(idx)"
              class="btn btn-secondary px-1.5 py-0.5 text-xs"
            >
              −
            </button>
            <span class="w-6 text-center text-sm font-semibold">{{ item.quantity }}</span>
            <button
              @click="incrementQuantity(idx)"
              class="btn btn-secondary px-1.5 py-0.5 text-xs"
            >
              +
            </button>
          </div>

          <!-- Delete Button -->
          <button
            @click="removeItem(idx)"
            class="text-red-400 hover:text-red-300 ml-1"
            title="Remove item"
          >
            ✕
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="characterStore.equipment.length === 0" class="text-center text-gray-400 text-sm py-4">
          No items in inventory
        </div>
      </div>

      <!-- Add Item Form -->
      <div class="border-t border-slate-700 pt-3 space-y-2">
        <div class="text-xs font-bold text-gold-400">Add Item</div>
        <div class="space-y-2">
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
              placeholder="Weight"
              class="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
            />
          </div>
          <button @click="addItem" class="btn btn-gold w-full text-sm">
            Add Item
          </button>
        </div>
      </div>

      <!-- Total Weight -->
      <div class="border-t border-slate-700 pt-2 text-sm font-semibold text-gold-400">
        Total Weight: {{ totalWeight }} lb
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
    { name: 'Healer\'s Kit', type: 'tool', quantity: 1, weight: 3 },
    { name: 'Backpack', type: 'misc', quantity: 1, weight: 5 },
    { name: 'Bedroll', type: 'misc', quantity: 1, weight: 5 },
    { name: 'Waterskin', type: 'misc', quantity: 2, weight: 1 },
    { name: 'Torch', type: 'misc', quantity: 5, weight: 5 },
    { name: 'Rope (50 ft)', type: 'misc', quantity: 1, weight: 10 },
    { name: 'Rations', type: 'consumable', quantity: 20, weight: 20 }
  ]
}

const searchQuery = ref('')
const newItem = reactive({
  name: '',
  type: 'misc',
  quantity: 1,
  weight: 0
})

const filteredEquipment = computed(() => {
  if (!searchQuery.value) {
    return characterStore.equipment
  }
  const query = searchQuery.value.toLowerCase()
  return characterStore.equipment.filter(
    item => item.name.toLowerCase().includes(query) || item.type.toLowerCase().includes(query)
  )
})

const totalWeight = computed(() => {
  return characterStore.equipment.reduce((total, item) => {
    return total + (item.weight || 0) * item.quantity
  }, 0)
})

const addItem = () => {
  if (newItem.name.trim()) {
    characterStore.equipment.push({
      name: newItem.name,
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
  characterStore.equipment[idx].quantity++
}

const decrementQuantity = (idx) => {
  if (characterStore.equipment[idx].quantity > 1) {
    characterStore.equipment[idx].quantity--
  }
}

const removeItem = (idx) => {
  characterStore.equipment.splice(idx, 1)
}
</script>

<style scoped>
</style>
