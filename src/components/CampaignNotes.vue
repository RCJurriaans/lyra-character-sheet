<template>
  <CardFrame title="📖 Campaign Notes" suit="wands" variant="purple" :show-flip="false">
    <div class="space-y-3">
      <!-- Session Management -->
      <div class="space-y-2 p-3 bg-slate-700 rounded">
        <div class="text-xs font-bold text-gold-400">Active Session</div>
        <div class="flex gap-2">
          <input
            v-model.number="activeSession"
            type="number"
            min="1"
            placeholder="Session number..."
            class="flex-1 bg-slate-600 border border-slate-500 rounded px-2 py-1 text-sm text-gray-100"
          />
          <button @click="setActiveSession" class="btn btn-gold text-sm px-3">
            Set
          </button>
        </div>
        <div class="text-xs text-gray-400 mt-1">Current: Session {{ currentSession }}</div>
      </div>

      <!-- Add New Note -->
      <div class="space-y-2 p-3 bg-slate-700 rounded">
        <div class="text-xs font-bold text-gold-400">New Entry</div>
        <textarea
          v-model="newNote"
          placeholder="Write your session notes here..."
          class="w-full bg-slate-600 border border-slate-500 rounded px-2 py-2 text-sm text-gray-100 h-24 resize-none"
        ></textarea>
        <button @click="addNote" class="btn btn-gold w-full text-sm">
          Save Entry
        </button>
      </div>

      <!-- Filter Controls -->
      <div class="flex gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search notes..."
          class="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
        />
        <select
          v-model="filterSession"
          class="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm"
        >
          <option value="">All Sessions</option>
          <option
            v-for="session in uniqueSessions"
            :key="session"
            :value="session"
          >
            Session {{ session }}
          </option>
        </select>
      </div>

      <!-- Notes List -->
      <div class="space-y-2 max-h-80 overflow-y-auto">
        <div
          v-for="(note, idx) in filteredNotes"
          :key="idx"
          class="p-3 bg-slate-700 rounded border-l-4 border-gold-400 hover:bg-slate-600 transition-colors"
        >
          <div class="flex items-start justify-between mb-1">
            <div class="flex-1">
              <div class="text-xs text-gold-400 font-semibold">
                Session {{ note.session }} • {{ formatDate(note.date) }}
              </div>
            </div>
            <button
              @click="deleteNote(idx)"
              class="text-red-400 hover:text-red-300 text-sm ml-2"
              title="Delete note"
            >
              ✕
            </button>
          </div>
          <div class="text-sm text-gray-200 whitespace-pre-wrap break-words">
            {{ note.text }}
          </div>
        </div>

        <div v-if="filteredNotes.length === 0" class="text-center text-gray-400 text-sm py-4">
          No notes found
        </div>
      </div>

      <!-- Stats -->
      <div class="border-t border-slate-700 pt-2 text-xs text-gray-400">
        Total entries: {{ characterStore.campaignNotes?.length || 0 }}
      </div>
    </div>
  </CardFrame>
</template>

<script setup>
import { ref, computed } from 'vue'
import CardFrame from './CardFrame.vue'
import { characterStore, saveCharacterState } from '../stores/characterStore.js'

// Initialize campaign notes if not exists
if (!characterStore.campaignNotes) {
  characterStore.campaignNotes = []
}

// Initialize active session if not exists
if (!characterStore.activeSession) {
  characterStore.activeSession = 1
}

const newNote = ref('')
const searchQuery = ref('')
const filterSession = ref('')
const activeSession = ref(characterStore.activeSession || 1)
const currentSession = computed(() => characterStore.activeSession || 1)

const uniqueSessions = computed(() => {
  if (!characterStore.campaignNotes) return []
  const sessions = new Set(characterStore.campaignNotes.map(note => note.session))
  return Array.from(sessions).sort((a, b) => b - a)
})

const filteredNotes = computed(() => {
  if (!characterStore.campaignNotes) return []

  let notes = characterStore.campaignNotes

  // Filter by session
  if (filterSession.value) {
    notes = notes.filter(note => note.session === parseInt(filterSession.value))
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    notes = notes.filter(note =>
      note.text.toLowerCase().includes(query)
    )
  }

  // Sort by date (newest first)
  return notes.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const setActiveSession = () => {
  if (activeSession.value >= 1) {
    characterStore.activeSession = activeSession.value
    saveCharacterState(characterStore)
  }
}

const addNote = () => {
  if (newNote.value.trim()) {
    if (!characterStore.campaignNotes) {
      characterStore.campaignNotes = []
    }

    characterStore.campaignNotes.push({
      text: newNote.value,
      date: new Date().toISOString(),
      session: currentSession.value
    })

    newNote.value = ''
    saveCharacterState(characterStore)
  }
}

const deleteNote = (idx) => {
  if (confirm('Delete this note?')) {
    // Find and remove the note from the filtered results
    const note = filteredNotes.value[idx]
    const originalIdx = characterStore.campaignNotes.indexOf(note)
    if (originalIdx > -1) {
      characterStore.campaignNotes.splice(originalIdx, 1)
      saveCharacterState(characterStore)
    }
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
</style>
