const STORAGE_KEY = 'lyra-character-state'

export function loadCharacterState(defaultState) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to load character state:', e)
  }
  return defaultState
}

export function saveCharacterState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save character state:', e)
  }
}

export function resetCharacterState(defaultState) {
  localStorage.removeItem(STORAGE_KEY)
  return defaultState
}
