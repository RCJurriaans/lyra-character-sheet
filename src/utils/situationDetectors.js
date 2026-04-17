/**
 * Situation Detectors
 * Utility functions to detect character states for conditional hint display
 */

// HP-based conditions
export function isLowHP(store, threshold = 50) {
  if (!store.hitPoints) return false
  const percentHealth = (store.hitPoints.current / store.hitPoints.max) * 100
  return percentHealth < threshold
}

export function isCritical(store, threshold = 25) {
  if (!store.hitPoints) return false
  const percentHealth = (store.hitPoints.current / store.hitPoints.max) * 100
  return percentHealth < threshold
}

export function isFullyHealed(store) {
  if (!store.hitPoints) return false
  return store.hitPoints.current === store.hitPoints.max
}

export function isUnconscious(store) {
  if (!store.hitPoints) return false
  return store.hitPoints.current === 0
}

// Resource depletion
export function hasNoSpellSlots(store, level) {
  if (!store.spellSlots) return false
  const slots = store.spellSlots[level]
  if (!slots) return true
  return slots.used >= slots.max
}

export function hasAllSpellSlotsUsed(store) {
  if (!store.spellSlots) return false
  for (let level = 1; level <= 9; level++) {
    const slots = store.spellSlots[level]
    if (slots && slots.used < slots.max) {
      return false
    }
  }
  return true
}

export function hasNoLuckyPoints(store) {
  if (!store.luckyPoints) return false
  return store.luckyPoints.current <= 0
}

export function hasSpellSlots(store, level) {
  if (!store.spellSlots) return false
  const slots = store.spellSlots[level]
  if (!slots) return false
  return slots.used < slots.max
}

export function isLowOnSpellSlots(store) {
  if (!store.spellSlots) return false
  let totalUsed = 0
  let totalMax = 0
  for (let level = 1; level <= 9; level++) {
    const slots = store.spellSlots[level]
    if (slots) {
      totalUsed += slots.used
      totalMax += slots.max
    }
  }
  const percentUsed = totalMax > 0 ? (totalUsed / totalMax) * 100 : 0
  return percentUsed >= 75
}

// Action economy
export function noActionsAvailable(store) {
  if (!store.actions) return false
  return store.actions.actionUsed && store.actions.bonusActionUsed && store.actions.reactionUsed
}

export function canUseAction(store) {
  if (!store.actions) return true
  return !store.actions.actionUsed
}

export function canUseBonusAction(store) {
  if (!store.actions) return true
  return !store.actions.bonusActionUsed
}

export function canUseReaction(store) {
  if (!store.actions) return true
  return !store.actions.reactionUsed
}

export function hasMovement(store, minDistance = 5) {
  if (!store.actions) return true
  const speed = store.speed || 30
  return store.actions.movementUsed < speed - minDistance
}

// Conditions & effects
export function isConcentrating(store) {
  return hasCondition(store, 'concentrating')
}

export function hasCondition(store, conditionName) {
  if (!store.conditions) return false
  return store.conditions.includes(conditionName.toLowerCase())
}

export function hasMultipleConditions(store) {
  if (!store.conditions) return false
  return store.conditions.length >= 2
}

// Combat states
export function isInCombat(store) {
  if (!store.combatState) return false
  return store.combatState.currentRound > 1 || (store.combatState.initiative && store.combatState.initiative.length > 0)
}

export function isFirstRound(store) {
  if (!store.combatState) return false
  return store.combatState.currentRound === 1
}

// Rest states
export function hasRestedRecently(store) {
  if (!store.lastRested) return false
  const hoursAgo = (Date.now() - new Date(store.lastRested).getTime()) / (1000 * 60 * 60)
  return hoursAgo < 8
}

export function needsShortRest(store) {
  if (!store.hitPoints || !store.spellSlots) return false
  const hpLow = (store.hitPoints.current / store.hitPoints.max) < 0.5
  const slotsUsed = store.spellSlots[1] && store.spellSlots[1].used > 0
  return hpLow || slotsUsed
}

export function needsLongRest(store) {
  if (!store.hitPoints || !store.spellSlots) return false
  const hpLow = (store.hitPoints.current / store.hitPoints.max) < 0.3
  const allSlotsUsed = hasAllSpellSlotsUsed(store)
  const noLuck = hasNoLuckyPoints(store)
  return hpLow && (allSlotsUsed || noLuck)
}

// Channel Divinity tracking
export function canUseChannelDivinity(store) {
  if (!store.channelDivinity) return false
  return !store.channelDivinity.used
}

export function preserveLifeAvailable(store) {
  if (!store.preserveLife) return false
  return store.preserveLife.current > 0 && canUseChannelDivinity(store)
}

// Combined situation detectors
export function isEmergencySituation(store) {
  return (
    (isLowHP(store, 25) && hasCondition(store, 'poisoned')) ||
    (isUnconscious(store) && store.deathSaves && store.deathSaves.failures >= 2) ||
    (noActionsAvailable(store) && isLowHP(store))
  )
}

export function shouldUsePreserveLife(store) {
  // Use Preserve Life when:
  // 1. Multiple allies are below 50% (hint system will suggest)
  // 2. You have at least 10 HP left in the pool
  if (!store.preserveLife) return false
  return preserveLifeAvailable(store) && store.preserveLife.current >= 10
}

export function shouldHideAndHeal(store) {
  // Hide and heal when:
  // 1. You're low on HP (below 25%)
  // 2. You're not in immediate danger
  // 3. Allies need healing
  return isLowHP(store, 25) && !isCritical(store, 10)
}

export function isResourceDepleted(store) {
  return hasNoSpellSlots(store, 1) && hasNoLuckyPoints(store) && isLowHP(store)
}
