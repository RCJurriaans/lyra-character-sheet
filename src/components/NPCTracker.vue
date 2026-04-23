<template>
  <CardFrame title="👥 NPC Tracker" suit="swords" variant="silver" :show-flip="false">
    <div class="space-y-3">
      <!-- Add NPC Form -->
      <div class="p-3 bg-slate-700 rounded space-y-2">
        <div class="text-xs font-bold text-gold-400">Track NPC</div>
        <div class="flex gap-2">
          <input
            v-model="newNPCName"
            type="text"
            placeholder="Name..."
            class="flex-1 bg-slate-600 border border-slate-500 rounded px-2 py-1 text-sm text-gray-100"
            @keydown.enter="addNPC"
          />
          <input
            v-model="newNPCRole"
            type="text"
            placeholder="Role (optional)..."
            class="flex-1 bg-slate-600 border border-slate-500 rounded px-2 py-1 text-sm text-gray-100"
            @keydown.enter="addNPC"
          />
          <button @click="addNPC" class="btn btn-gold px-3 text-sm">Add</button>
        </div>
      </div>

      <!-- NPC List -->
      <div class="space-y-2">
        <div
          v-for="(npc, idx) in npcs"
          :key="idx"
          class="rounded-lg border overflow-hidden npc-card"
          :class="expandedNPC === idx ? 'border-gold-400' : 'border-slate-600'"
        >
          <!-- NPC Header -->
          <div
            @click="toggleNPC(idx)"
            class="flex items-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 cursor-pointer transition-colors select-none"
          >
            <div class="flex-1 min-w-0">
              <div class="text-gold-400 text-sm font-semibold truncate">{{ npc.name }}</div>
              <div v-if="npc.role" class="text-xs text-gray-400 truncate">{{ npc.role }}</div>
            </div>
            <span class="text-xs text-gray-400 shrink-0">{{ npc.notes.length }} note{{ npc.notes.length !== 1 ? 's' : '' }}</span>
            <span class="text-xs text-gray-500 ml-1">{{ expandedNPC === idx ? '▲' : '▼' }}</span>
            <button
              @click.stop="deleteNPC(idx)"
              class="text-red-400 hover:text-red-300 text-sm ml-1"
              title="Delete NPC"
            >✕</button>
          </div>

          <!-- Expanded Content -->
          <div v-if="expandedNPC === idx" class="p-3 space-y-4 bg-slate-800">
            <!-- Role -->
            <div>
              <div class="text-xs font-bold text-gold-400 mb-1">Role / Title</div>
              <input
                v-model="npc.role"
                type="text"
                placeholder="Mayor, Guard Captain, Innkeeper..."
                class="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-sm text-gray-100"
                @input="saveNPCs"
              />
            </div>

            <!-- Bio -->
            <div>
              <div class="text-xs font-bold text-gold-400 mb-1">Bio / Description</div>
              <textarea
                v-model="npc.bio"
                placeholder="Appearance, personality, faction, role..."
                class="w-full bg-slate-700 border border-slate-600 rounded px-2 py-2 text-sm text-gray-100 resize-none"
                rows="3"
                @input="saveNPCs"
              />
            </div>

            <!-- Notes Section -->
            <div>
              <div class="text-xs font-bold text-gold-400 mb-2">Notes</div>

              <!-- Existing Notes -->
              <div class="space-y-2 max-h-48 overflow-y-auto mb-2">
                <div
                  v-for="(note, nIdx) in npc.notes"
                  :key="nIdx"
                  class="p-2 bg-slate-700 rounded border-l-2 border-gold-400 flex items-start gap-2"
                >
                  <div class="flex-1 min-w-0">
                    <div class="text-xs text-gray-400 mb-1">
                      Session {{ note.session }} • {{ formatDate(note.date) }}
                    </div>
                    <div class="text-sm text-gray-200 whitespace-pre-wrap break-words">{{ note.text }}</div>
                  </div>
                  <button
                    @click="deleteNPCNote(idx, nIdx)"
                    class="text-red-400 hover:text-red-300 text-xs shrink-0"
                    title="Delete note"
                  >✕</button>
                </div>
                <div v-if="npc.notes.length === 0" class="text-xs text-gray-500 py-2 text-center">
                  No notes yet
                </div>
              </div>

              <!-- Add Note -->
              <textarea
                v-model="newNPCNotes[idx]"
                placeholder="Add a note about this NPC..."
                class="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm text-gray-100 resize-none"
                rows="2"
              />
              <button @click="addNPCNote(idx)" class="btn btn-gold w-full text-xs py-1 mt-1">
                Add Note
              </button>
            </div>
          </div>
        </div>

        <div v-if="npcs.length === 0" class="text-center text-gray-500 text-sm py-6">
          No NPCs tracked yet.<br>
          <span class="text-xs">Add NPCs to track their stories.</span>
        </div>
      </div>

      <!-- Count -->
      <div v-if="npcs.length > 0" class="border-t border-slate-700 pt-2 text-xs text-gray-400">
        Tracking {{ npcs.length }} NPC{{ npcs.length !== 1 ? 's' : '' }}
      </div>
    </div>
  </CardFrame>
</template>

<script setup>
import { ref, reactive } from 'vue'
import CardFrame from './CardFrame.vue'
import { characterStore, saveCharacterState } from '../stores/characterStore.js'

// Initialize NPCs if not exists
if (!characterStore.npcs) {
  characterStore.npcs = []
}

// Migrate: add role field to existing NPCs that don't have it
characterStore.npcs.forEach(npc => {
  if (npc.role === undefined) npc.role = ''
})

const npcs = characterStore.npcs
const newNPCName = ref('')
const newNPCRole = ref('')
const expandedNPC = ref(null)
const newNPCNotes = reactive({})

const currentSession = () => characterStore.activeSession || 1

const addNPC = () => {
  if (newNPCName.value.trim()) {
    npcs.push({
      name: newNPCName.value.trim(),
      role: newNPCRole.value.trim(),
      bio: '',
      notes: []
    })
    newNPCName.value = ''
    newNPCRole.value = ''
    saveCharacterState(characterStore)
    // Auto-expand the new NPC
    expandedNPC.value = npcs.length - 1
  }
}

const deleteNPC = (idx) => {
  if (confirm(`Delete NPC "${npcs[idx].name}" and all their notes?`)) {
    npcs.splice(idx, 1)
    if (expandedNPC.value === idx) expandedNPC.value = null
    else if (expandedNPC.value > idx) expandedNPC.value--
    saveCharacterState(characterStore)
  }
}

const toggleNPC = (idx) => {
  expandedNPC.value = expandedNPC.value === idx ? null : idx
}

const saveNPCs = () => {
  saveCharacterState(characterStore)
}

const addNPCNote = (idx) => {
  const text = (newNPCNotes[idx] || '').trim()
  if (text) {
    if (!npcs[idx].notes) npcs[idx].notes = []
    npcs[idx].notes.push({
      text,
      date: new Date().toISOString(),
      session: currentSession()
    })
    newNPCNotes[idx] = ''
    saveCharacterState(characterStore)
  }
}

const deleteNPCNote = (npcIdx, noteIdx) => {
  if (confirm('Delete this note?')) {
    npcs[npcIdx].notes.splice(noteIdx, 1)
    saveCharacterState(characterStore)
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
.npc-card {
  transition: border-color 0.2s ease;
}
</style>
