/**
 * Contextual Hints Database for Lyra's Character Sheet
 * Organized by page, with conditional logic for dynamic hints
 */

export const hintsDatabase = {
  overview: {
    hints: [
      {
        id: 'ac_defense',
        title: 'Your AC',
        content: 'You have AC 19 from studded leather armor and a shield, plus bonuses from your Dexterity and Wisdom modifiers. This makes you well-protected for a Cleric.'
      },
      {
        id: 'ability_scores',
        title: 'Ability Score Strengths',
        content: 'Your highest abilities are Wisdom (17) and Constitution (16). These are perfect for a Life Cleric—Wisdom powers your spells, and CON increases your HP.'
      },
      {
        id: 'proficiency_bonus',
        title: 'Proficiency Bonus',
        content: 'At Level 5, your proficiency bonus is +3. This applies to any attack roll, ability check, or saving throw you\'re proficient in.'
      },
      {
        id: 'satyr_traits',
        title: 'Your Satyr Heritage',
        content: 'As a Satyr, you have magic resistance (advantage vs spells and magical effects) and can speak with small beasts. Use these advantages when exploring and negotiating!'
      },
      {
        id: 'life_domain',
        title: 'Life Domain Features',
        content: 'Your Life Domain grants you proficiency with heavy armor and the Preserve Life feature—spend your Channel Divinity to heal up to 25 HP split among allies.'
      }
    ],
    maxHints: 2
  },

  spellcasting: {
    hints: [
      {
        id: 'spell_slots_overview',
        title: 'Spell Slots Available',
        content: 'You have 4 first-level slots, 3 second-level slots, and 2 third-level slots. Cantrips (like Toll the Dead) don\'t use slots and are always available.',
        condition: (store) => store.spellSlots && store.spellSlots[1]
      },
      {
        id: 'healing_word_tip',
        title: 'Healing Word Strategy',
        content: 'Healing Word is your most versatile spell: use as a bonus action, heals 1d4 + WIS (current: +3), and works at 60 feet away. Perfect for helping allies from range.',
        condition: (store) => store.spellSlots && store.spellSlots[1] && store.spellSlots[1].max > 0
      },
      {
        id: 'channel_divinity_healing',
        title: 'Channel Divinity: Preserve Life',
        content: 'You can use Channel Divinity once per short rest to restore up to 25 HP total to any creatures you can see within 30 feet. Split it among multiple allies or focus one target.',
        condition: (store) => !store.channelDivinity || !store.channelDivinity.used
      },
      {
        id: 'concentration_spells',
        title: 'Concentration Spells',
        content: 'Several of your spells require concentration: Bless, Hold Person, Spiritual Weapon. You can only maintain concentration on one spell at a time. If you take damage, make a CON saving throw (DC = 10 or half damage) or lose concentration.'
      },
      {
        id: 'prepared_spells',
        title: 'Prepared Spells',
        content: 'You can prepare a number of spells equal to your Level (5) + WIS modifier (+3) = 8 spells. You\'ve already chosen 8, but you can change them on a long rest.'
      },
      {
        id: 'spell_save_dc',
        title: 'Your Spell Save DC',
        content: 'Enemies defending against your spells must roll 14 or higher to resist. (Spell Save DC = 8 + 3 proficiency + 3 WIS = 14)'
      },
      {
        id: 'toll_the_dead',
        title: 'Toll the Dead (Cantrip)',
        content: 'Your primary damage cantrip. Roll 2d12 damage if the target is missing HP, or 2d8 if it\'s at full HP. No saving throw—just an attack roll at range.'
      }
    ],
    maxHints: 3
  },

  combat: {
    hints: [
      {
        id: 'your_turn_action_economy',
        title: 'Your Turn Action Economy',
        content: 'On your turn, you can: take 1 Action (cast a spell, Attack, Dodge, Help, Hide, Ready, Search, Use an Object), use 1 Bonus Action (if a feature grants it), and move up to 35 feet. Most of your spells use your Action.'
      },
      {
        id: 'ac_in_combat',
        title: 'You\'re Well Defended',
        content: 'Your AC is 19—most enemies need a 12+ on the d20 to hit you. Use Dodge action if you need extra defense (enemies have disadvantage vs you).'
      },
      {
        id: 'spiritual_weapon_bonus_action',
        title: 'Spiritual Weapon Strategy',
        content: 'Spiritual Weapon uses your bonus action to attack (1d8 + 3 damage). Great for action economy: cast it as an action, then attack as a bonus action every turn. It lasts 1 minute with concentration.'
      },
      {
        id: 'healing_word_in_combat',
        title: 'Healing in Combat',
        content: 'You can heal allies without using your main action! Healing Word is a bonus action spell (60 ft range, 1d4+3 healing). This lets you cast a cantrip or attack AND heal in the same turn.'
      },
      {
        id: 'channel_divinity_combat',
        title: 'Channel Divinity in Combat',
        content: 'In combat, use Channel Divinity (Preserve Life) as an action to heal up to 25 HP total among creatures within 30 feet. Effective for stabilizing multiple allies.'
      },
      {
        id: 'death_saves_info',
        title: 'If You Reach 0 HP',
        content: 'You fall unconscious. On your turn, roll a death saving throw (d20, no modifier): 10+ = success, below 10 = failure. 3 successes = stabilize, 3 failures = death. Rolling a 20 = recover 1 HP! Rolling a 1 = 2 failures!'
      },
      {
        id: 'initiative_advantage',
        title: 'Your Initiative',
        content: 'You have +2 to initiative rolls. Try to act early in combat so you can position yourself or start healing allies before they take damage.'
      },
      {
        id: 'dodge_action',
        title: 'Defensive Options',
        content: 'If surrounded or low on HP, use your Action to Dodge (enemies have disadvantage attacking you until your next turn) or Disengage (move without provoking opportunity attacks).'
      },
      {
        id: 'conditions_tracking',
        title: 'Track Active Conditions',
        content: 'Use the Conditions tracker on this page to remember effects like Poisoned, Prone, or Grappled. Some conditions impair your ability to act or impose disadvantage on rolls.'
      }
    ],
    maxHints: 3
  },

  resources: {
    hints: [
      {
        id: 'lucky_points_power',
        title: 'Your Lucky Points (Satyr Ability)',
        content: 'You have 3 Lucky Points. Spend one to reroll any d20 you\'ve just rolled (ability check, attack roll, saving throw, or skill check). You regain all 3 on a long rest. Use them on critical rolls!'
      },
      {
        id: 'lucky_points_strategy',
        title: 'When to Use Lucky Points',
        content: 'Save Lucky Points for critical moments: death saves, important saving throws, or rolls that determine combat outcome. Don\'t waste them on routine checks.',
        condition: (store) => store.luckyPoints && store.luckyPoints.current > 0
      },
      {
        id: 'channel_divinity_per_turn',
        title: 'Channel Divinity Uses',
        content: 'You can use Channel Divinity once per short rest. Preserve Life is your best healing feature—restore up to 25 HP total to allies within 30 feet as an action.',
        condition: (store) => !store.channelDivinity || !store.channelDivinity.used
      },
      {
        id: 'hp_management',
        title: 'Managing Your HP',
        content: 'You have 43 HP. You\'re moderately tough for a Cleric, but avoid taking hits when possible. Healing Word is your lifeline—use it on allies (and yourself) early.'
      },
      {
        id: 'temporary_hp',
        title: 'Temporary HP',
        content: 'Temporary HP acts as a buffer: damage reduces temp HP first, then your real HP. Spells like Arcane Ward grant temp HP. They don\'t stack—use the highest value only.'
      },
      {
        id: 'short_rest_recovery',
        title: 'Short Rest Benefits',
        content: 'On a short rest (1 hour), you can: regain 1 hit die (d8) to recover HP, recover some Channel Divinity uses (depends on your class), and restore focus. You\'re the healer—help allies rest too.'
      },
      {
        id: 'healing_during_long_rest',
        title: 'Long Rest Recovery',
        content: 'On a long rest (8 hours), you fully recover: all HP, all spell slots, all Lucky Points (3), Channel Divinity uses. You need a long rest to regain the most powerful resources.'
      },
      {
        id: 'preserve_life_mechanics',
        title: 'Preserve Life (Channel Divinity)',
        content: 'As an action, you spend your Channel Divinity to restore HP to any creatures you can see within 30 feet, up to your Cleric level × 5 (25 HP total). You choose how to distribute it. This is instant healing—powerful for pulling allies back from the brink.'
      }
    ],
    maxHints: 3
  },

  skills: {
    hints: [
      {
        id: 'proficient_skills_list',
        title: 'Your Skill Proficiencies',
        content: 'You\'re proficient in: Insight (+6), Medicine (+6), Perception (+6), Performance (+5), and Persuasion (+5). You add your +3 proficiency bonus to these rolls.'
      },
      {
        id: 'wisdom_is_strength',
        title: 'Wisdom: Your Best Ability',
        content: 'Your Wisdom is 17 (+3 modifier). This makes you excellent at Insight, Medicine, and Perception—three of your proficiencies. You notice details others miss and read people well.'
      },
      {
        id: 'skill_check_mechanics',
        title: 'How Skill Checks Work',
        content: 'When the DM asks for a skill check, roll d20 + the ability modifier + proficiency bonus (if you\'re proficient). Example: Perception check = d20 + 3 (WIS) + 3 (proficiency) = d20 + 6.'
      },
      {
        id: 'insight_in_roleplay',
        title: 'Use Insight for NPCs',
        content: 'When talking to NPCs, use Insight to detect if they\'re lying or to understand their emotions. With +6, you\'re excellent at reading people—use this advantage in social encounters.'
      },
      {
        id: 'medicine_for_healing',
        title: 'Medicine Beyond Spells',
        content: 'Medicine checks can help stabilize dying allies (DC 10), diagnose illnesses, or treat wounds. Combined with your healing spells, you\'re invaluable to your party\'s survival.'
      },
      {
        id: 'perception_awareness',
        title: 'Perception: Your Eyes on the Party',
        content: 'With +6 Perception, you\'re likely to notice hidden enemies, traps, or important details. You\'re the party\'s early warning system—let your high WIS guide you.'
      },
      {
        id: 'charisma_skills_lower',
        title: 'Your Charisma Skills',
        content: 'You\'re also proficient in Performance (+5) and Persuasion (+5), though these use your lower Charisma (+0). Still solid rolls—use them when appropriate.'
      },
      {
        id: 'low_strength_skills',
        title: 'Skills You\'re Not Good At',
        content: 'Your lowest scores are Intelligence (8, -1) and Strength (12, +1). Avoid Arcana, History, Nature, Religion, and Athletic checks if possible. Leave these to party members.'
      },
      {
        id: 'roll_history_tracking',
        title: 'Roll Statistics',
        content: 'Your roll history shows success/failure patterns. Look at the data to see which skill checks are problematic for your character, and adjust your strategy accordingly.'
      }
    ],
    maxHints: 3
  },

  inventory: {
    hints: [
      {
        id: 'armor_and_weapons',
        title: 'Your Equipment',
        content: 'You wear studded leather armor + shield (AC 19). You carry a mace as your melee weapon (1d6 + STR damage) and Healing Word as your primary spell.'
      },
      {
        id: 'adventuring_gear',
        title: 'Adventuring Gear',
        content: 'You have standard adventure supplies: backpack, bedroll, 50 feet of rope, waterskin, and rations. Your total carrying capacity is 15 × STR (12) = 180 lb. Track weight if carrying treasure.'
      },
      {
        id: 'no_magical_items',
        title: 'No Magic Items Yet',
        content: 'You don\'t have magical items equipped. Any magical weapons or armor the party finds could boost your AC or damage. Keep an eye out for Cleric-friendly magic.'
      },
      {
        id: 'campaign_notes_purpose',
        title: 'Campaign Notes',
        content: 'Use this section to track NPCs, plot hooks, discovered locations, and quest details. Write down anything important so you remember the campaign world.'
      },
      {
        id: 'loot_tracking',
        title: 'Tracking Treasure',
        content: 'Record treasure your party finds: gold pieces, gems, art objects, and items. This helps you plan what to buy during downtime.'
      },
      {
        id: 'inventory_weight',
        title: 'Carrying Capacity',
        content: 'Your carrying capacity is 12 (STR) × 15 = 180 lb total. Medium armor (studded leather + shield) weighs ~45 lb. You have plenty of room for loot!'
      }
    ],
    maxHints: 2
  }
}

/**
 * Get hints for a specific page, filtered by conditions
 * @param {string} pageName - The current page (overview, spellcasting, combat, resources, skills, inventory)
 * @param {Object} characterStore - The character store object
 * @returns {Array} Array of applicable hints for this page
 */
export function getHintsForPage(pageName, characterStore) {
  const pageHints = hintsDatabase[pageName] || { hints: [], maxHints: 2 }

  // Filter hints based on conditions
  let applicableHints = pageHints.hints.filter(hint => {
    // If no condition is specified, always show
    if (!hint.condition) return true

    // Evaluate the condition function
    try {
      return hint.condition(characterStore)
    } catch (e) {
      console.warn(`Error evaluating hint condition for ${hint.id}:`, e)
      return true // Default to showing if condition errors
    }
  })

  // Return up to maxHints (respects the page's hint limit)
  return applicableHints.slice(0, pageHints.maxHints)
}

/**
 * Check if a hint has been dismissed in this session
 * @param {string} hintId - The hint ID
 * @param {Array} dismissedHints - Array of dismissed hint IDs
 * @returns {boolean} Whether the hint is dismissed
 */
export function isHintDismissed(hintId, dismissedHints) {
  return dismissedHints.includes(hintId)
}
