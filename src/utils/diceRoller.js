export function rollDice(sides = 20) {
  return Math.floor(Math.random() * sides) + 1
}

export function rollAbilityCheck(abilityMod, proficient = false, proficiencyBonus = 0) {
  const d20 = rollDice(20)
  const modifier = abilityMod + (proficient ? proficiencyBonus : 0)
  const total = d20 + modifier

  return {
    d20,
    modifier,
    abilityMod,
    proficiencyBonus: proficient ? proficiencyBonus : 0,
    proficient,
    total
  }
}

export function rollSavingThrow(saveMod) {
  const d20 = rollDice(20)
  const total = d20 + saveMod

  return {
    d20,
    modifier: saveMod,
    total
  }
}

export function rollDamage(diceString) {
  // Parse formats like "2d8", "1d6+3", "3d8+5"
  const match = diceString.match(/^(\d+)d(\d+)(?:\+(\d+))?$/)
  if (!match) return null

  const numDice = parseInt(match[1])
  const dieSize = parseInt(match[2])
  const bonus = match[3] ? parseInt(match[3]) : 0

  let total = bonus
  const rolls = []
  for (let i = 0; i < numDice; i++) {
    const roll = rollDice(dieSize)
    rolls.push(roll)
    total += roll
  }

  return {
    rolls,
    bonus,
    total
  }
}

export function formatDiceRoll(result) {
  if (result.d20 !== undefined) {
    const mod = result.modifier >= 0 ? `+${result.modifier}` : result.modifier
    return `d20${mod} = ${result.total}`
  }
  return result.total
}
