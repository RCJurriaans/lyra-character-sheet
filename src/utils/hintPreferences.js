/**
 * Hint Preferences System
 * Manages user preferences for hint display, filtering, and persistence
 */

const PREFERENCES_STORAGE_KEY = 'lyra-hint-preferences'

/**
 * Default preferences structure
 */
export const DEFAULT_PREFERENCES = {
  enabled: true,
  frequency: 'always', // 'always' | 'daily' | 'once' | 'never'
  categories: {
    strategy: true,
    mechanics: true,
    rules: true,
    critical: true,
    reminder: true
  },
  visualMode: 'normal', // 'normal' | 'compact' | 'detailed'
  dismissalMode: 'session', // 'session' | 'permanent'
  difficultiesShown: ['beginner', 'intermediate', 'advanced'],
  maxHintsPerPage: 3, // 1-5
  showOnCriticalOnly: false
}

/**
 * Load preferences from localStorage or return defaults
 */
export function loadPreferences() {
  try {
    const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge with defaults to handle missing fields
      return { ...DEFAULT_PREFERENCES, ...parsed }
    }
  } catch (error) {
    console.error('Failed to load hint preferences:', error)
  }
  return { ...DEFAULT_PREFERENCES }
}

/**
 * Save preferences to localStorage
 */
export function savePreferences(preferences) {
  try {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences))
    return true
  } catch (error) {
    console.error('Failed to save hint preferences:', error)
    return false
  }
}

/**
 * Reset preferences to defaults
 */
export function resetPreferences() {
  try {
    localStorage.removeItem(PREFERENCES_STORAGE_KEY)
    return { ...DEFAULT_PREFERENCES }
  } catch (error) {
    console.error('Failed to reset hint preferences:', error)
    return { ...DEFAULT_PREFERENCES }
  }
}

/**
 * Update a single preference field
 */
export function updateSinglePreference(preferences, key, value) {
  const updated = { ...preferences }

  // Handle nested updates (e.g., 'categories.strategy')
  if (key.includes('.')) {
    const [parent, child] = key.split('.')
    updated[parent] = { ...updated[parent], [child]: value }
  } else {
    updated[key] = value
  }

  return updated
}

/**
 * Check if a hint should be shown based on preferences and conditions
 */
export function shouldShowHint(hint, preferences, characterStore = null) {
  // Master disable
  if (!preferences.enabled) return false

  // Category filter
  if (!preferences.categories[hint.category] && hint.category !== 'critical') {
    // Critical hints cannot be hidden
    return false
  }

  // Difficulty filter
  if (!preferences.difficultiesShown.includes(hint.difficulty)) {
    return false
  }

  // Critical-only mode
  if (preferences.showOnCriticalOnly && !hint.criticalHighlight) {
    return false
  }

  // Hint condition evaluation
  if (hint.condition && characterStore) {
    try {
      return hint.condition(characterStore)
    } catch (error) {
      console.error(`Failed to evaluate hint condition for ${hint.id}:`, error)
      return true // Show hint if condition fails
    }
  }

  return true
}

/**
 * Filter hints by preferences
 */
export function getFilteredHints(hints, preferences, characterStore = null) {
  return hints.filter(hint => shouldShowHint(hint, preferences, characterStore))
}

/**
 * Get hints matching specific criteria
 */
export function getHintsByCategory(hints, category) {
  return hints.filter(hint => hint.category === category)
}

export function getHintsByDifficulty(hints, difficulty) {
  return hints.filter(hint => hint.difficulty === difficulty)
}

export function getHintsByDifficultiesShown(hints, difficultiesShown) {
  return hints.filter(hint => difficultiesShown.includes(hint.difficulty))
}

/**
 * Get hint statistics
 */
export function getHintStatistics(hints) {
  const stats = {
    total: hints.length,
    byCategory: {},
    byDifficulty: {}
  }

  hints.forEach(hint => {
    // Count by category
    if (!stats.byCategory[hint.category]) {
      stats.byCategory[hint.category] = 0
    }
    stats.byCategory[hint.category]++

    // Count by difficulty
    if (!stats.byDifficulty[hint.difficulty]) {
      stats.byDifficulty[hint.difficulty] = 0
    }
    stats.byDifficulty[hint.difficulty]++
  })

  return stats
}

/**
 * Validate preferences structure
 */
export function validatePreferences(preferences) {
  const errors = []

  // Check required fields
  if (typeof preferences.enabled !== 'boolean') {
    errors.push('enabled must be boolean')
  }

  if (!['always', 'daily', 'once', 'never'].includes(preferences.frequency)) {
    errors.push('frequency must be always/daily/once/never')
  }

  if (!['normal', 'compact', 'detailed'].includes(preferences.visualMode)) {
    errors.push('visualMode must be normal/compact/detailed')
  }

  if (!['session', 'permanent'].includes(preferences.dismissalMode)) {
    errors.push('dismissalMode must be session/permanent')
  }

  if (!Array.isArray(preferences.difficultiesShown)) {
    errors.push('difficultiesShown must be array')
  }

  if (typeof preferences.maxHintsPerPage !== 'number' || preferences.maxHintsPerPage < 1 || preferences.maxHintsPerPage > 5) {
    errors.push('maxHintsPerPage must be 1-5')
  }

  if (typeof preferences.showOnCriticalOnly !== 'boolean') {
    errors.push('showOnCriticalOnly must be boolean')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Merge user preferences with defaults (for upgrades)
 */
export function mergeWithDefaults(userPreferences) {
  return {
    ...DEFAULT_PREFERENCES,
    ...userPreferences,
    categories: {
      ...DEFAULT_PREFERENCES.categories,
      ...userPreferences.categories
    },
    difficultiesShown: userPreferences.difficultiesShown || DEFAULT_PREFERENCES.difficultiesShown
  }
}

/**
 * Check preference compatibility with character state
 * (Advanced: detect impossible preference combinations)
 */
export function getPreferenceWarnings(preferences) {
  const warnings = []

  if (preferences.showOnCriticalOnly && !preferences.categories.critical) {
    warnings.push('Critical-only mode enabled but critical hints hidden—no hints will show')
  }

  if (!preferences.enabled) {
    warnings.push('Hints disabled globally—no hints will show')
  }

  const allDisabled = !Object.values(preferences.categories).some(v => v)
  if (allDisabled) {
    warnings.push('All hint categories disabled—no hints will show')
  }

  return warnings
}

/**
 * Export preferences as JSON string
 */
export function exportPreferences(preferences) {
  return JSON.stringify(preferences, null, 2)
}

/**
 * Import preferences from JSON string
 */
export function importPreferences(jsonString) {
  try {
    const parsed = JSON.parse(jsonString)
    const validation = validatePreferences(parsed)
    if (!validation.valid) {
      return { success: false, errors: validation.errors }
    }
    return { success: true, preferences: mergeWithDefaults(parsed) }
  } catch (error) {
    return { success: false, errors: [error.message] }
  }
}
