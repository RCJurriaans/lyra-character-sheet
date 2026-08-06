const EXPORT_VERSION = 1

const JSON_KEYS = [
  'lyra-character-state',
  'savedCharacters',
  'permanentlyDismissedHints',
  'lyra-hint-preferences'
]

const RAW_KEYS = [
  'currentPage',
  'preferredTheme'
]

function getCharacterKeys() {
  const keys = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith('character-')) {
      keys.push(key)
    }
  }
  return keys
}

export function exportCharacterData() {
  const data = {
    _meta: {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      source: 'lyra-character-sheet'
    }
  }

  for (const key of JSON_KEYS) {
    const value = localStorage.getItem(key)
    if (value !== null) {
      data[key] = JSON.parse(value)
    }
  }

  for (const key of RAW_KEYS) {
    const value = localStorage.getItem(key)
    if (value !== null) {
      data[key] = value
    }
  }

  for (const key of getCharacterKeys()) {
    const value = localStorage.getItem(key)
    if (value !== null) {
      data[key] = JSON.parse(value)
    }
  }

  const currentCharId = sessionStorage.getItem('currentCharacterId')
  if (currentCharId) {
    data._meta.currentCharacterId = currentCharId
  }

  return data
}

export function downloadExport(data) {
  const charName = data['lyra-character-state']?.name || 'character'
  const date = new Date().toISOString().slice(0, 10)
  const filename = `${charName.toLowerCase().replace(/\s+/g, '-')}-${date}.json`

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  return filename
}

export function validateImportData(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid file: not a JSON object' }
  }

  if (!data._meta || data._meta.source !== 'lyra-character-sheet') {
    return { valid: false, error: 'Invalid file: not a Lyra character sheet export' }
  }

  if (!data['lyra-character-state']) {
    return { valid: false, error: 'Invalid file: missing character state data' }
  }

  return { valid: true }
}

export function importCharacterData(data) {
  const { valid, error } = validateImportData(data)
  if (!valid) {
    throw new Error(error)
  }

  for (const key of JSON_KEYS) {
    if (data[key] !== undefined) {
      localStorage.setItem(key, JSON.stringify(data[key]))
    }
  }

  for (const key of RAW_KEYS) {
    if (data[key] !== undefined) {
      localStorage.setItem(key, data[key])
    }
  }

  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith('character-')) {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  if (data._meta.currentCharacterId) {
    sessionStorage.setItem('currentCharacterId', data._meta.currentCharacterId)
  }
}

export function readFileAsJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target.result))
      } catch {
        reject(new Error('File is not valid JSON'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
