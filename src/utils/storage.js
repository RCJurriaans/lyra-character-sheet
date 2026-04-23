const STORAGE_KEY = 'lyra-character-state'

/**
 * Fields that are always authoritative from character.json.
 * These represent the character build and never change via in-game play.
 */
const ALWAYS_FROM_DEFAULTS = [
  'name', 'class', 'domain', 'level', 'race', 'alignment', 'background',
  'abilities', 'savingThrows', 'skills',
  'proficiencyBonus', 'ac', 'initiative', 'spellSaveDC', 'spellAttackBonus',
  'traits', 'languages'
]

/**
 * Merge saved localStorage state with the current character.json defaults.
 *
 * Strategy:
 *  - Static build fields (abilities, saves, skills, etc.) always come from
 *    character.json so stat changes are reflected immediately.
 *  - Runtime fields (current HP, used slots, conditions, combat tracker,
 *    notes, equipment, etc.) are preserved from localStorage.
 *  - For "max vs current" pairs (HP, spell slots, lucky points, etc.) the
 *    max always comes from character.json; current is clamped to the new max.
 */
function mergeCharacterState(defaults, saved) {
  const merged = { ...saved }

  // Static build fields — always from character.json
  for (const key of ALWAYS_FROM_DEFAULTS) {
    if (defaults[key] !== undefined) {
      merged[key] = defaults[key]
    }
  }

  // Hit Points — max from defaults, current clamped to new max
  if (defaults.hitPoints) {
    const newMax = defaults.hitPoints.max
    const savedCurrent = saved.hitPoints?.current ?? newMax
    merged.hitPoints = {
      max: newMax,
      current: Math.min(savedCurrent, newMax),
      temporary: saved.hitPoints?.temporary ?? 0
    }
  }

  // Spell Slots — max per level from defaults, used preserved
  if (defaults.spellSlots) {
    merged.spellSlots = {}
    for (const lvl in defaults.spellSlots) {
      const newMax = defaults.spellSlots[lvl].max
      const usedSaved = saved.spellSlots?.[lvl]?.used ?? 0
      merged.spellSlots[lvl] = {
        max: newMax,
        used: Math.min(usedSaved, newMax)
      }
    }
  }

  // Lucky Points — max from defaults, current clamped
  if (defaults.luckyPoints) {
    const newMax = defaults.luckyPoints.max
    merged.luckyPoints = {
      max: newMax,
      current: Math.min(saved.luckyPoints?.current ?? newMax, newMax)
    }
  }

  // Channel Divinity — maxUses from defaults, used state preserved
  if (defaults.channelDivinity) {
    merged.channelDivinity = {
      maxUses: defaults.channelDivinity.maxUses,
      used: saved.channelDivinity?.used ?? false
    }
  }

  // Preserve Life — max from defaults, current clamped
  if (defaults.preserveLife) {
    const newMax = defaults.preserveLife.max
    merged.preserveLife = {
      max: newMax,
      current: Math.min(saved.preserveLife?.current ?? newMax, newMax)
    }
  }

  return merged
}

export function loadCharacterState(defaultState) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return mergeCharacterState(defaultState, JSON.parse(saved))
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
