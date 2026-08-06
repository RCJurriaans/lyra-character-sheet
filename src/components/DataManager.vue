<template>
  <div class="flex items-center gap-2">
    <button @click="handleExport" class="btn btn-secondary text-xs md:text-sm py-2 px-2 md:px-4 min-h-10 md:min-h-auto">
      📥 <span class="hidden xs:inline">Export</span>
    </button>
    <button @click="triggerImport" class="btn btn-secondary text-xs md:text-sm py-2 px-2 md:px-4 min-h-10 md:min-h-auto">
      📤 <span class="hidden xs:inline">Import</span>
    </button>
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      class="hidden"
      @change="handleImport"
    />

    <!-- Status Toast -->
    <Transition name="fade">
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium max-w-sm text-center',
          toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        ]"
      >
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { exportCharacterData, downloadExport, importCharacterData, readFileAsJSON } from '../utils/exportImport.js'

const fileInput = ref(null)
const toast = ref({ show: false, message: '', type: 'success' })

let toastTimeout = null

function showToast(message, type = 'success') {
  if (toastTimeout) clearTimeout(toastTimeout)
  toast.value = { show: true, message, type }
  toastTimeout = setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

function handleExport() {
  try {
    const data = exportCharacterData()
    const filename = downloadExport(data)
    showToast(`Exported to ${filename}`)
  } catch (e) {
    showToast(`Export failed: ${e.message}`, 'error')
  }
}

function triggerImport() {
  fileInput.value.click()
}

async function handleImport(event) {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const data = await readFileAsJSON(file)
    importCharacterData(data)
    showToast('Import successful — reloading...')
    setTimeout(() => window.location.reload(), 1000)
  } catch (e) {
    showToast(e.message, 'error')
  } finally {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
