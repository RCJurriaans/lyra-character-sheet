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
