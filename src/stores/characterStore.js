import { reactive, computed } from 'vue'
import characterData from '../data/character.json'
import { loadCharacterState, saveCharacterState } from '../utils/storage.js'

const defaultState = structuredClone(characterData)

export const characterStore = reactive(loadCharacterState(defaultState))

// Computed properties
export const abilityModifier = (ability) => {
  const score = characterStore.abilities[ability]
  return Math.floor((score - 10) / 2)
}

// HP Management
export const takeDamage = (amount) => {
  characterStore.hitPoints.current = Math.max(0, characterStore.hitPoints.current - amount)
  saveCharacterState(characterStore)
}

export const heal = (amount) => {
  characterStore.hitPoints.current = Math.min(
    characterStore.hitPoints.max,
    characterStore.hitPoints.current + amount
  )
  saveCharacterState(characterStore)
}

export const setTemporaryHP = (amount) => {
  characterStore.hitPoints.temporary = amount
  saveCharacterState(characterStore)
}

// Spell Slots
export const useSpellSlot = (level) => {
  if (characterStore.spellSlots[level] && characterStore.spellSlots[level].used < characterStore.spellSlots[level].max) {
    characterStore.spellSlots[level].used++
    saveCharacterState(characterStore)
    return true
  }
  return false
}

export const restoreSpellSlot = (level) => {
  if (characterStore.spellSlots[level] && characterStore.spellSlots[level].used > 0) {
    characterStore.spellSlots[level].used--
    saveCharacterState(characterStore)
    return true
  }
  return false
}

export const getAvailableSlots = (level) => {
  return characterStore.spellSlots[level].max - characterStore.spellSlots[level].used
}

// Lucky Points
export const spendLuckyPoint = () => {
  if (characterStore.luckyPoints.current > 0) {
    characterStore.luckyPoints.current--
    saveCharacterState(characterStore)
    return true
  }
  return false
}

// Channel Divinity
export const useChannelDivinity = () => {
  if (!characterStore.channelDivinity.used) {
    characterStore.channelDivinity.used = true
    saveCharacterState(characterStore)
    return true
  }
  return false
}

// Preserve Life
export const usePreserveLife = (amount) => {
  if (characterStore.preserveLife.current >= amount) {
    characterStore.preserveLife.current -= amount
    saveCharacterState(characterStore)
    return true
  }
  return false
}

// Rest actions
export const longRest = () => {
  // Restore HP
  characterStore.hitPoints.current = characterStore.hitPoints.max
  characterStore.hitPoints.temporary = 0

  // Restore spell slots
  for (const level in characterStore.spellSlots) {
    characterStore.spellSlots[level].used = 0
  }

  // Restore Lucky Points
  characterStore.luckyPoints.current = characterStore.luckyPoints.max

  // Restore Channel Divinity
  characterStore.channelDivinity.used = false

  // Restore Preserve Life
  characterStore.preserveLife.current = characterStore.preserveLife.max

  saveCharacterState(characterStore)
}

export const shortRest = () => {
  // Short rest only restores hit dice and some features
  characterStore.luckyPoints.current = Math.min(
    characterStore.luckyPoints.max,
    characterStore.luckyPoints.current + 1
  )
  saveCharacterState(characterStore)
}

// Conditions Management
export const addCondition = (condition) => {
  if (!characterStore.conditions) {
    characterStore.conditions = []
  }
  if (!characterStore.conditions.includes(condition)) {
    characterStore.conditions.push(condition)
    saveCharacterState(characterStore)
  }
}

export const removeCondition = (condition) => {
  if (!characterStore.conditions) {
    characterStore.conditions = []
  }
  const idx = characterStore.conditions.indexOf(condition)
  if (idx > -1) {
    characterStore.conditions.splice(idx, 1)
    saveCharacterState(characterStore)
  }
}

export const hasCondition = (condition) => {
  if (!characterStore.conditions) {
    characterStore.conditions = []
  }
  return characterStore.conditions.includes(condition)
}

export const clearAllConditions = () => {
  characterStore.conditions = []
  saveCharacterState(characterStore)
}

// Death Saves Management
export const addDeathSaveSuccess = () => {
  if (!characterStore.deathSaves) {
    characterStore.deathSaves = { successes: 0, failures: 0 }
  }
  if (characterStore.deathSaves.successes < 3) {
    characterStore.deathSaves.successes++
    saveCharacterState(characterStore)
  }
}

export const addDeathSaveFailure = () => {
  if (!characterStore.deathSaves) {
    characterStore.deathSaves = { successes: 0, failures: 0 }
  }
  if (characterStore.deathSaves.failures < 3) {
    characterStore.deathSaves.failures++
    saveCharacterState(characterStore)
  }
}

export const resetDeathSaves = () => {
  if (!characterStore.deathSaves) {
    characterStore.deathSaves = { successes: 0, failures: 0 }
  }
  characterStore.deathSaves.successes = 0
  characterStore.deathSaves.failures = 0
  saveCharacterState(characterStore)
}

// Equipment Management
export const addEquipment = (item) => {
  if (!characterStore.equipment) {
    characterStore.equipment = []
  }
  characterStore.equipment.push(item)
  saveCharacterState(characterStore)
}

export const removeEquipment = (idx) => {
  if (!characterStore.equipment) {
    characterStore.equipment = []
  }
  if (idx >= 0 && idx < characterStore.equipment.length) {
    characterStore.equipment.splice(idx, 1)
    saveCharacterState(characterStore)
  }
}

export const updateEquipmentQuantity = (idx, quantity) => {
  if (!characterStore.equipment) {
    characterStore.equipment = []
  }
  if (idx >= 0 && idx < characterStore.equipment.length) {
    characterStore.equipment[idx].quantity = Math.max(0, quantity)
    saveCharacterState(characterStore)
  }
}

// Combat State Management
export const incrementRound = () => {
  if (!characterStore.combatState) {
    characterStore.combatState = {
      initiative: [{ name: 'Lyra', roll: 0, order: 0 }],
      currentRound: 1,
      currentTurn: 0
    }
  }
  characterStore.combatState.currentRound++
  // Reset action economy on new round
  resetActionEconomy()
  saveCharacterState(characterStore)
}

export const decrementRound = () => {
  if (!characterStore.combatState) {
    characterStore.combatState = {
      initiative: [{ name: 'Lyra', roll: 0, order: 0 }],
      currentRound: 1,
      currentTurn: 0
    }
  }
  if (characterStore.combatState.currentRound > 1) {
    characterStore.combatState.currentRound--
    saveCharacterState(characterStore)
  }
}

export const nextTurn = () => {
  if (!characterStore.combatState) {
    characterStore.combatState = {
      initiative: [{ name: 'Lyra', roll: 0, order: 0 }],
      currentRound: 1,
      currentTurn: 0
    }
  }
  if (characterStore.combatState.currentTurn < characterStore.combatState.initiative.length - 1) {
    characterStore.combatState.currentTurn++
  } else {
    characterStore.combatState.currentTurn = 0
    incrementRound()
    return
  }
  resetActionEconomy()
  saveCharacterState(characterStore)
}

export const previousTurn = () => {
  if (!characterStore.combatState) {
    characterStore.combatState = {
      initiative: [{ name: 'Lyra', roll: 0, order: 0 }],
      currentRound: 1,
      currentTurn: 0
    }
  }
  if (characterStore.combatState.currentTurn > 0) {
    characterStore.combatState.currentTurn--
    saveCharacterState(characterStore)
  }
}

export const endCombat = () => {
  if (!characterStore.combatState) {
    characterStore.combatState = {
      initiative: [{ name: 'Lyra', roll: 0, order: 0 }],
      currentRound: 1,
      currentTurn: 0
    }
  }
  characterStore.combatState.initiative = [{ name: 'Lyra', roll: 0, order: 0 }]
  characterStore.combatState.currentRound = 1
  characterStore.combatState.currentTurn = 0
  resetActionEconomy()
  saveCharacterState(characterStore)
}

// Action Economy Management
export const useAction = () => {
  if (!characterStore.actions) {
    characterStore.actions = {
      actionUsed: false,
      bonusActionUsed: false,
      reactionUsed: false,
      movementUsed: 0
    }
  }
  characterStore.actions.actionUsed = true
  saveCharacterState(characterStore)
}

export const useBonusAction = () => {
  if (!characterStore.actions) {
    characterStore.actions = {
      actionUsed: false,
      bonusActionUsed: false,
      reactionUsed: false,
      movementUsed: 0
    }
  }
  characterStore.actions.bonusActionUsed = true
  saveCharacterState(characterStore)
}

export const useReaction = () => {
  if (!characterStore.actions) {
    characterStore.actions = {
      actionUsed: false,
      bonusActionUsed: false,
      reactionUsed: false,
      movementUsed: 0
    }
  }
  characterStore.actions.reactionUsed = true
  saveCharacterState(characterStore)
}

export const moveDistance = (distance) => {
  if (!characterStore.actions) {
    characterStore.actions = {
      actionUsed: false,
      bonusActionUsed: false,
      reactionUsed: false,
      movementUsed: 0
    }
  }
  characterStore.actions.movementUsed = Math.min(35, characterStore.actions.movementUsed + distance)
  saveCharacterState(characterStore)
}

export const resetActionEconomy = () => {
  if (!characterStore.actions) {
    characterStore.actions = {
      actionUsed: false,
      bonusActionUsed: false,
      reactionUsed: false,
      movementUsed: 0
    }
  }
  characterStore.actions.actionUsed = false
  characterStore.actions.bonusActionUsed = false
  characterStore.actions.reactionUsed = false
  characterStore.actions.movementUsed = 0
  saveCharacterState(characterStore)
}

// Roll History Management
export const recordRoll = (rollData) => {
  if (!characterStore.rollHistory) {
    characterStore.rollHistory = []
  }
  characterStore.rollHistory.push(rollData)
  // Keep last 100 rolls
  if (characterStore.rollHistory.length > 100) {
    characterStore.rollHistory.shift()
  }
  saveCharacterState(characterStore)
}

export const clearRollHistory = () => {
  characterStore.rollHistory = []
  saveCharacterState(characterStore)
}
