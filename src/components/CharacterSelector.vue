<template>
  <div class="flex items-center gap-2">
    <!-- Current Character Display -->
    <div class="flex-1">
      <div class="text-sm font-semibold text-gray-100">
        {{ characterStore.name }}
        <span class="text-xs text-gray-400 ml-2">
          {{ characterStore.class }} • Level {{ characterStore.level }}
        </span>
      </div>
    </div>

    <!-- Character Menu Button -->
    <button
      @click="showSelector = !showSelector"
      class="btn btn-secondary px-3 py-1 text-sm"
      title="Switch character"
    >
      ⟳
    </button>

    <!-- Character Selector Modal -->
    <div
      v-if="showSelector"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showSelector = false"
    >
      <div class="bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4 max-h-96 overflow-y-auto border-2 border-gold-400">
        <h2 class="text-lg font-bold text-gold-300 mb-4">Select Character</h2>

        <!-- Character List -->
        <div class="space-y-2 mb-4">
          <div
            v-for="char in savedCharacters"
            :key="char.id"
            :class="[
              'p-3 rounded border-2 cursor-pointer transition-colors',
              char.id === currentCharacterId
                ? 'bg-gold-400 text-slate-900 border-gold-400'
                : 'bg-slate-700 border-slate-600 hover:border-gold-400'
            ]"
            @click="loadCharacter(char.id)"
          >
            <div class="font-semibold">{{ char.name }}</div>
            <div class="text-sm text-gray-400">{{ char.class }} • Level {{ char.level }}</div>
          </div>

          <div v-if="savedCharacters.length === 0" class="text-center text-gray-400 text-sm py-4">
            No saved characters
          </div>
        </div>

        <!-- New Character Form -->
        <div class="border-t border-slate-600 pt-4">
          <h3 class="text-sm font-bold text-gold-300 mb-2">Create New Character</h3>
          <div class="space-y-2">
            <input
              v-model="newCharacter.name"
              type="text"
              placeholder="Character name"
              class="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
            />
            <input
              v-model="newCharacter.class"
              type="text"
              placeholder="Class"
              class="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
            />
            <input
              v-model.number="newCharacter.level"
              type="number"
              min="1"
              max="20"
              placeholder="Level"
              class="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
            />
            <button @click="createNewCharacter" class="btn btn-gold w-full text-sm">
              Create Character
            </button>
          </div>
        </div>

        <!-- Close Button -->
        <button
          @click="showSelector = false"
          class="btn btn-secondary w-full text-sm mt-4"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { characterStore } from '../stores/characterStore.js'

const showSelector = ref(false)
const currentCharacterId = ref(sessionStorage.getItem('currentCharacterId') || 'default')

const newCharacter = ref({
  name: '',
  class: '',
  level: 1
})

const savedCharacters = computed(() => {
  const chars = JSON.parse(localStorage.getItem('savedCharacters') || '[]')
  // If no saved characters, add the current one
  if (chars.length === 0) {
    return [{
      id: 'default',
      name: characterStore.name,
      class: characterStore.class,
      level: characterStore.level
    }]
  }
  return chars
})

const createNewCharacter = () => {
  if (newCharacter.value.name.trim() && newCharacter.value.class.trim()) {
    const chars = JSON.parse(localStorage.getItem('savedCharacters') || '[]')
    const newId = 'char-' + Date.now()

    chars.push({
      id: newId,
      name: newCharacter.value.name,
      class: newCharacter.value.class,
      level: newCharacter.value.level
    })

    localStorage.setItem('savedCharacters', JSON.stringify(chars))

    // Create character state in localStorage
    const blankCharacter = {
      name: newCharacter.value.name,
      class: newCharacter.value.class,
      level: newCharacter.value.level,
      race: 'Humanoid',
      abilities: {
        str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10
      },
      hitPoints: { current: 10, max: 10, temporary: 0 },
      ac: 10,
      proficiencyBonus: 2,
      spellSlots: { 1: { max: 0, used: 0 }, 2: { max: 0, used: 0 }, 3: { max: 0, used: 0 } },
      luckyPoints: { current: 0, max: 0 },
      channelDivinity: { used: false },
      preserveLife: { current: 0, max: 0 },
      conditions: [],
      deathSaves: { successes: 0, failures: 0 },
      equipment: [],
      actions: { actionUsed: false, bonusActionUsed: false, reactionUsed: false, movementUsed: 0 },
      rollHistory: []
    }

    localStorage.setItem(`character-${newId}`, JSON.stringify(blankCharacter))

    newCharacter.value.name = ''
    newCharacter.value.class = ''
    newCharacter.value.level = 1

    // Load the new character
    loadCharacter(newId)
  }
}

const loadCharacter = (characterId) => {
  // Save current character state
  localStorage.setItem(`character-${currentCharacterId.value}`, JSON.stringify(characterStore))

  // Load new character
  const characterState = JSON.parse(localStorage.getItem(`character-${characterId}`) || '{}')
  Object.assign(characterStore, characterState)

  currentCharacterId.value = characterId
  sessionStorage.setItem('currentCharacterId', characterId)

  showSelector.value = false
  window.location.reload() // Reload to ensure reactive updates
}
</script>

<style scoped>
</style>
