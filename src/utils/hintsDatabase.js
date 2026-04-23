/**
 * Comprehensive Hints Database
 * 100+ contextual hints organized by page with categories and difficulty levels
 *
 * Categories:
 * - strategy: Tactical advice, resource optimization, when to use abilities
 * - mechanics: How rules work, calculations, modifiers
 * - rules: D&D 5e mechanics, spell effects, conditions
 * - critical: Urgent situations (low HP, resource depletion, action economy)
 * - reminder: Don't forget features, abilities, traits
 */

export const hintsDatabase = {
  overview: {
    maxHints: 3,
    hints: [
      // Strategy hints (4)
      {
        id: 'overview_strategy_1',
        title: 'Leverage Your Wisdom',
        content: 'You have +3 WIS modifier, your highest stat. This is excellent for Perception checks and your spell save DC (14). Look for Wisdom-based challenges where you can shine.',
        category: 'strategy',
        difficulty: 'beginner',
        condition: (store) => store.abilities?.wis >= 16,
        relatedFeatures: ['proficiency']
      },
      {
        id: 'overview_strategy_2',
        title: 'Proficiency Bonus Strategy',
        content: 'Your +3 proficiency bonus applies to attack rolls, saving throws, ability checks, and skill checks with proficient skills. Don\'t forget to add it!',
        category: 'strategy',
        difficulty: 'beginner',
        condition: (store) => true,
        relatedSkills: ['Medicine', 'Perception', 'Insight']
      },
      {
        id: 'overview_strategy_3',
        title: 'Satyr Abilities to Remember',
        content: 'As a Satyr, you have Fey Ancestry (resistance to magic that charms or puts you to sleep) and Natural Performer (extra skill proficiencies). Leverage these traits!',
        category: 'strategy',
        difficulty: 'beginner',
        condition: (store) => store.race === 'Satyr',
        relatedFeatures: ['Fey Ancestry', 'Natural Performer']
      },
      {
        id: 'overview_strategy_4',
        title: 'Cleric Life Domain Focus',
        content: 'Your Life Domain is designed for healing. Healing Word and other healing spells will be your primary utility. Prioritize keeping allies up over damage.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => store.domain === 'Life',
        relatedSpells: ['Healing Word', 'Cure Wounds']
      },
      // Mechanics hints (3)
      {
        id: 'overview_mechanics_1',
        title: 'Understanding Ability Modifiers',
        content: 'Your ability modifier = (Ability Score - 10) ÷ 2. STR 10 = +0, WIS 17 = +3. These modifiers apply to attacks, saves, and checks.',
        category: 'mechanics',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'overview_mechanics_2',
        title: 'What\'s Your Proficiency Bonus?',
        content: 'At level 5, your proficiency bonus is +3. It applies to attack rolls, ability checks with proficient skills, saving throws with proficient abilities, and spell attack modifiers.',
        category: 'mechanics',
        difficulty: 'beginner',
        condition: (store) => store.level === 5
      },
      {
        id: 'overview_mechanics_3',
        title: 'AC Calculation Explained',
        content: 'Your AC 19 = 15 (Half Plate) + 2 (DEX mod cap) + 2 (shield). Higher AC makes you harder to hit. Half Plate is the best medium armor and matches your DEX perfectly.',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => store.ac >= 18
      },
      // Rules hints (3)
      {
        id: 'overview_rules_1',
        title: 'Advantage & Disadvantage',
        content: 'When you have advantage, roll 2d20 and use the higher result. With disadvantage, roll 2d20 and use the lower. These can stack but ultimately cancel to normal rolls.',
        category: 'rules',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'overview_rules_2',
        title: 'Skill Proficiency Basics',
        content: 'When you\'re proficient in a skill, add your proficiency bonus to the d20 roll. You\'re proficient in Medicine, Insight, Perception, Performance, and Persuasion.',
        category: 'rules',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'overview_rules_3',
        title: 'Saving Throws',
        content: 'When an effect forces a save, add the modifier of the relevant ability plus your proficiency bonus if you\'re proficient (WIS saves, STR saves, etc.).',
        category: 'rules',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      // Critical hints (2)
      {
        id: 'overview_critical_1',
        title: 'Character Survival Tips',
        content: 'You have 38 HP with 14 CON. You\'re reasonably durable for a cleric, but avoid being the tank. Keep 1-2 allies healed and let your CON +2 carry concentration saves.',
        category: 'critical',
        difficulty: 'intermediate',
        condition: (store) => store.hitPoints?.max >= 35
      },
      {
        id: 'overview_critical_2',
        title: 'When to Use Lucky Points',
        content: 'Luck Points are your nuclear option. Save them for: critical saves, failing death saves, or crucial ability checks. You have only 3 per long rest.',
        category: 'critical',
        difficulty: 'intermediate',
        condition: (store) => store.luckyPoints?.max === 3
      },
      // Reminder hints (2)
      {
        id: 'overview_reminder_1',
        title: 'Your Proficiencies at a Glance',
        content: 'Skills: Medicine, Insight, Perception, Performance, Persuasion | Saving Throws: WIS (+6) | Weapon: Simple melee & ranged | Armor: Light, Medium, Heavy, Shields',
        category: 'reminder',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'overview_reminder_2',
        title: 'Don\'t Forget Your Traits',
        content: 'Read your personality traits, ideals, bonds, and flaws. These guide roleplay and might grant inspiration when followed.',
        category: 'reminder',
        difficulty: 'beginner',
        condition: (store) => true
      }
    ]
  },

  spellcasting: {
    maxHints: 3,
    hints: [
      // Strategy hints (6)
      {
        id: 'spellcasting_strategy_1',
        title: 'Healing Word Over Healing Spell',
        content: 'Healing Word (bonus action, 60 ft) is superior to Healing Spell (action, touch). Use Healing Word to stay distant and heal multiple allies across the battlefield.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => store.spellSlots?.[1]?.max > 0
      },
      {
        id: 'spellcasting_strategy_2',
        title: 'Maximize Your Domain Spells',
        content: 'Your Life Domain grants bonus spells: Bless, Cure Wounds, Lesser Restoration, Spiritual Weapon. These don\'t count against your prepared spells—powerful advantage!',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => store.domain === 'Life'
      },
      {
        id: 'spellcasting_strategy_3',
        title: 'Spell Slot Management',
        content: 'You have 4 first-level slots, 3 second-level, 2 third-level. Don\'t waste powerful slots early. Save 3rd-level for emergencies (revivify if needed).',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => store.spellSlots?.[1]?.max === 4
      },
      {
        id: 'spellcasting_strategy_4',
        title: 'Concentration Management',
        content: 'Many spells require concentration (only one at a time). Bless, Hold Person, Spiritual Weapon are concentration spells. Choose wisely which you maintain.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'spellcasting_strategy_5',
        title: 'Cantrips Don\'t Use Slots',
        content: 'You can cast Word of Recall, Guidance, and Spare the Dying unlimited times (no spell slots). Use these freely, especially Guidance on allies\' checks.',
        category: 'strategy',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'spellcasting_strategy_6',
        title: 'Prepared vs Unprepared Spells',
        content: 'You prepare (WIS mod + level) = 8 spells from your class list. Only prepared spells can be cast. Change your prepared spells on long rests for flexibility.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => store.level === 5
      },
      // Mechanics hints (5)
      {
        id: 'spellcasting_mechanics_1',
        title: 'Spell Save DC Calculation',
        content: 'Your spell save DC is 14: 8 + 3 (WIS mod) + 3 (proficiency). Enemies must beat this DC to resist your spell effects.',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => store.spellSaveDC === 14
      },
      {
        id: 'spellcasting_mechanics_2',
        title: 'Spell Attack Bonus',
        content: 'Your spell attack modifier is +6: 3 (WIS mod) + 3 (proficiency). Use this when casting spells that require attack rolls (Spiritual Weapon, Guiding Bolt).',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => store.spellAttackBonus === 6
      },
      {
        id: 'spellcasting_mechanics_3',
        title: 'Using Higher-Level Slots',
        content: 'When upcasting a spell with a higher-level slot, the spell often does more damage or affects more targets. Check spell descriptions for scaling.',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => store.spellSlots?.[2]?.max > 0
      },
      {
        id: 'spellcasting_mechanics_4',
        title: 'Spell Components',
        content: 'Most spells need Verbal (speak words) or Somatic (hand gestures). Some need Material components. Check if you have required items (holy symbol, etc.).',
        category: 'mechanics',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'spellcasting_mechanics_5',
        title: 'Action Economy for Spells',
        content: 'Casting a spell takes 1 action or 1 bonus action (depending on spell). Bonus action spells (Healing Word) are faster; action spells (Hold Person) take your action.',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      // Rules hints (4)
      {
        id: 'spellcasting_rules_1',
        title: 'What\'s Concentration?',
        content: 'Concentration spells end if you take damage and fail a CON save (DC 10 or half the damage, whichever is higher). Only one concentration spell at a time.',
        category: 'rules',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'spellcasting_rules_2',
        title: 'Spell Ranges & Distances',
        content: 'Touch = adjacent target, Self = affects you, Range = distance in feet (Healing Word 60 ft, Spiritual Weapon 60 ft). Check range before casting.',
        category: 'rules',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'spellcasting_rules_3',
        title: 'Area of Effect (AOE) Rules',
        content: 'Spells with areas (cones, radius circles) affect all creatures in that area. Allies can be caught in area spells—communicate with your party.',
        category: 'rules',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'spellcasting_rules_4',
        title: 'Ritual Casting',
        content: 'Some spells have the ritual tag (Detect Magic, Identify). You can cast these without using a spell slot if you have time and a book.',
        category: 'rules',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      // Critical hints (2)
      {
        id: 'spellcasting_critical_1',
        title: 'Healing Word Timing',
        content: 'Healing Word is your lifeline when allies drop. It\'s a bonus action (leaves action free) and has 60 ft range. Prioritize keeping party members up.',
        category: 'critical',
        difficulty: 'intermediate',
        condition: (store) => store.spellSlots?.[1]?.max > 0
      },
      {
        id: 'spellcasting_critical_2',
        title: 'Running Low on Slots?',
        content: 'When spell slots are depleted, focus on cantrips (Guidance, Word of Recall, Spare the Dying). Consider taking a short rest if possible.',
        category: 'critical',
        difficulty: 'beginner',
        condition: (store) => store.spellSlots?.[1]?.used >= 2
      },
      // Reminder hints (1)
      {
        id: 'spellcasting_reminder_1',
        title: 'Your Spell List',
        content: 'Cantrips: Word of Recall, Guidance, Spare the Dying | Domain Spells (bonus): Bless, Cure Wounds, Lesser Restoration, Spiritual Weapon',
        category: 'reminder',
        difficulty: 'beginner',
        condition: (store) => true
      }
    ]
  },

  combat: {
    maxHints: 3,
    hints: [
      // Strategy hints (7)
      {
        id: 'combat_strategy_1',
        title: 'Position Your Healer',
        content: 'Don\'t stand next to enemies. Stay 30-60 ft away, use Healing Word to heal from distance. This keeps you safe while supporting allies.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'combat_strategy_2',
        title: 'Prioritize Healing',
        content: 'When an ally drops below 50% HP, consider healing. At 0 HP, heal immediately (before stabilization checks). Your healing action is more valuable than damage.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'combat_strategy_3',
        title: 'Spiritual Weapon Tactic',
        content: 'Spiritual Weapon (2nd-level) is action-efficient: bonus action to cast, then bonus action to attack each turn. Paired with healing spells, it\'s devastating.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => store.spellSlots?.[2]?.max > 0
      },
      {
        id: 'combat_strategy_4',
        title: 'Hold Person Control',
        content: 'Hold Person paralyzes a humanoid enemy. Melee allies get advantage against paralyzed targets. Great for disabling dangerous enemies.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => store.spellSlots?.[2]?.max > 0
      },
      {
        id: 'combat_strategy_5',
        title: 'When to Use Channel Divinity',
        content: 'Channel Divinity (1/rest): Use Preserve Life to heal multiple allies (25 HP pool) or Destroy Undead to auto-kill weak undead. Choose based on enemy type.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => store.channelDivinity?.max >= 1
      },
      {
        id: 'combat_strategy_6',
        title: 'Action Economy This Turn',
        content: 'Each turn: 1 Action (cast spell, Attack, Dodge, Help), 1 Bonus Action (bonus action spell, Spiritual Weapon), 1 Reaction (opportunity attack, counterspell).',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'combat_strategy_7',
        title: 'Healing Priorities',
        content: 'Heal allies who tank damage (barbarian, fighter). Self-heal only when necessary. Use Spare the Dying (cantrip) on unconscious allies to stabilize.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      // Mechanics hints (5)
      {
        id: 'combat_mechanics_1',
        title: 'Rolling Initiative',
        content: 'Initiative = DEX mod + modifiers. You roll +2 (DEX 14). Higher rolls act earlier. Mark your position carefully.',
        category: 'mechanics',
        difficulty: 'beginner',
        condition: (store) => store.abilities?.dex === 14
      },
      {
        id: 'combat_mechanics_2',
        title: 'Opportunity Attacks',
        content: 'When an enemy moves away from you, you can use your reaction to make a melee attack against them (if they move away from your reach).',
        category: 'mechanics',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'combat_mechanics_3',
        title: 'Flanking Benefits',
        content: 'If an ally is on the opposite side of an enemy from you (flanking), you both get +2 to attack rolls. Coordinate positioning with melee allies.',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'combat_mechanics_4',
        title: 'Critical Hits',
        content: 'When you roll a 20 on an attack, it\'s a critical hit! Roll damage twice (2d20 + modifiers). Crits only apply to attack rolls, not saves.',
        category: 'mechanics',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'combat_mechanics_5',
        title: 'Handling Enemy Saves',
        content: 'When you cast a spell with a save (Hold Person, Tasha\'s Hideous Laughter), the enemy rolls against your spell save DC (14). They use their best ability mod.',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => store.spellSaveDC === 14
      },
      // Rules hints (4)
      {
        id: 'combat_rules_1',
        title: 'What is Prone?',
        content: 'Prone enemies have disadvantage on melee attacks but advantage against them within 5 ft. Ranged attackers have disadvantage. Use Knock Down spells wisely.',
        category: 'rules',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'combat_rules_2',
        title: 'Grapple Mechanics',
        content: 'Grappling uses STR (Athletics) vs STR/DEX (Acrobatics). You\'re not great at grappling (STR 12), but can help allies escape grapples.',
        category: 'rules',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'combat_rules_3',
        title: 'Being Restrained',
        content: 'Restrained enemies have disadvantage on DEX saves and attack rolls. Ranged attacks against them have advantage. Some spells cause this (Web, Entangle).',
        category: 'rules',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'combat_rules_4',
        title: 'What is Invisibility?',
        content: 'Invisible creatures can\'t be seen (melee attacks have disadvantage). They must still hide to avoid detection. Casting a spell breaks invisibility.',
        category: 'rules',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      // Critical hints (2)
      {
        id: 'combat_critical_1',
        title: 'At 0 HP: Take the Help Action',
        content: 'When at 0 HP, use Help action to aid allies or cast Spare the Dying (stabilize allies before they fail 3 death saves). Don\'t attack.',
        category: 'critical',
        difficulty: 'intermediate',
        condition: (store) => store.hitPoints?.current <= 0
      },
      {
        id: 'combat_critical_2',
        title: 'Preserve Life HP Pool',
        content: 'You can heal 25 HP total with Preserve Life (Channel Divinity). Spread this across multiple allies to prevent more deaths.',
        category: 'critical',
        difficulty: 'intermediate',
        condition: (store) => store.preserveLife?.max >= 25
      },
      // Reminder hints (2)
      {
        id: 'combat_reminder_1',
        title: 'Your Combat Stats',
        content: 'AC: 19 | Initiative: +2 | HP: 43 | Spell DC: 14 | Spell Attack: +6',
        category: 'reminder',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'combat_reminder_2',
        title: 'Track Enemy Conditions',
        content: 'Mark conditions you apply (Hold Person: paralyzed, Web: restrained). This helps allies know which enemies are controlled.',
        category: 'reminder',
        difficulty: 'beginner',
        condition: (store) => true
      }
    ]
  },

  resources: {
    maxHints: 3,
    hints: [
      // Strategy hints (5)
      {
        id: 'resources_strategy_1',
        title: 'Preserve Life Pool Strategy',
        content: 'Your Preserve Life pool (25 HP) is a one-use per rest heal-everyone tool. Save it for emergencies when multiple allies are injured.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => store.preserveLife?.max === 25
      },
      {
        id: 'resources_strategy_2',
        title: 'Lucky Point Usage',
        content: 'Spend Lucky Points on: critical saves, failed death saves, or crucial checks. Don\'t waste on guaranteed successes. They\'re your insurance policy.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => store.luckyPoints?.max === 3
      },
      {
        id: 'resources_strategy_3',
        title: 'Short Rest vs Long Rest',
        content: 'Short Rest (1 hour): Hit Die recovery only. Long Rest (8 hours): Full HP, spell slots, Channel Divinity, Lucky Points. Plan rests strategically.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'resources_strategy_4',
        title: 'Healing Word Conservation',
        content: 'Use 1st-level Healing Word first (more slots). Save 2nd-3rd level slots for emergencies or upcast healing when allies are badly wounded.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => store.spellSlots?.[1]?.max > 0
      },
      {
        id: 'resources_strategy_5',
        title: 'Channel Divinity Timing',
        content: 'Channel Divinity resets on long rest. Use Preserve Life when party is hurt, Destroy Undead against skeletons/zombies. Plan its use based on enemies.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => store.channelDivinity?.max >= 1
      },
      // Mechanics hints (4)
      {
        id: 'resources_mechanics_1',
        title: 'Healing Word vs Hit Points',
        content: 'Healing Word (1st-level, 1d4+3 = 4-7 HP) is fast but weak. Healing Spell (action, 1d8+3 = 4-11 HP) is stronger but slower. Choose based on situation.',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'resources_mechanics_2',
        title: 'Temporary HP Rules',
        content: 'Temporary HP don\'t heal damage (they absorb it). Multiple sources of temp HP don\'t stack; use the highest. Temp HP end when you finish a long rest.',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'resources_mechanics_3',
        title: 'Hit Die Recovery',
        content: 'During a short rest, spend up to 5 Hit Dice (d8s). For each, roll and add CON mod (+3). You regain that much HP. Max recovery = 5 × 11 = 55 HP.',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => store.level === 5
      },
      {
        id: 'resources_mechanics_4',
        title: 'Ability Score Recovery',
        content: 'Some abilities drain ability scores (poison, disease). You regain 1d4 points after a long rest. Recovery is slower than HP healing.',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      // Rules hints (4)
      {
        id: 'resources_rules_1',
        title: 'Stabilization & Death Saves',
        content: 'At 0 HP: take a death save. 20+ = success, 19- = failure. 3 successes = stabilized. 3 failures = dead. Healing = immediate stability.',
        category: 'rules',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'resources_rules_2',
        title: 'Stable but Unconscious',
        content: 'Unconscious creatures can\'t act but remain in combat. They\'re vulnerable to critical hits. Healing (even 1 HP) wakes them up.',
        category: 'rules',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'resources_rules_3',
        title: 'Resting & Recovery',
        content: 'Long Rest = 8 hours of sleep, no more than 1 hour of light activity. You regain HP, spell slots, and class features that recharge. Max 1 long rest per day.',
        category: 'rules',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'resources_rules_4',
        title: 'Exhaustion Levels',
        content: 'Exhaustion has 6 levels. Each level imposes penalties (disadvantage, speed halved, max HP halved, death). Rest 8 hours to reduce exhaustion by 1.',
        category: 'rules',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      // Critical hints (3)
      {
        id: 'resources_critical_1',
        title: 'Running Out of HP?',
        content: 'At low HP (under 25%), consider disengaging (use action to avoid attacks) or hiding. Let allies tank while you heal from range.',
        category: 'critical',
        difficulty: 'intermediate',
        condition: (store) => store.hitPoints?.current <= 12
      },
      {
        id: 'resources_critical_2',
        title: 'Death Save Warning',
        content: 'Each round at 0 HP, you make a death save. Rolling a 1 = 2 failures. Rolling a 20 = 1 success + you regain 1 HP. Critical!',
        category: 'critical',
        difficulty: 'intermediate',
        condition: (store) => store.hitPoints?.current === 0
      },
      {
        id: 'resources_critical_3',
        title: 'Preserve Life Emergency Use',
        content: 'When 3+ allies are below 25% HP, use Preserve Life to instantly heal them. It\'s your "group stabilizer"—invaluable in crisis moments.',
        category: 'critical',
        difficulty: 'intermediate',
        condition: (store) => store.preserveLife?.current >= 10
      },
      // Reminder hints (2)
      {
        id: 'resources_reminder_1',
        title: 'Your Resource Limits',
        content: 'HP: 43 | Hit Dice: 5d8 | Lucky Points: 3/rest | Channel Divinity: 1/rest (Preserve Life 25 HP or Destroy Undead)',
        category: 'reminder',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'resources_reminder_2',
        title: 'What Gets Restored on Long Rest?',
        content: 'HP (full), spell slots (all), Channel Divinity (resets), Lucky Points (back to 3), Hit Dice (regain half, minimum 1), conditions (most clear).',
        category: 'reminder',
        difficulty: 'beginner',
        condition: (store) => true
      }
    ]
  },

  skills: {
    maxHints: 3,
    hints: [
      // Strategy hints (4)
      {
        id: 'skills_strategy_1',
        title: 'Leverage Your Proficiencies',
        content: 'You\'re proficient in Medicine, Insight, Perception, Performance, Persuasion. Use these skills liberally in roleplay and problem-solving.',
        category: 'strategy',
        difficulty: 'beginner',
        condition: (store) => true,
        relatedSkills: ['Medicine', 'Insight', 'Perception', 'Performance', 'Persuasion']
      },
      {
        id: 'skills_strategy_2',
        title: 'Use Guidance Cantrip',
        content: 'Cast Guidance (cantrip) on allies before checks. +1d4 can turn a failure into success. It\'s free, unlimited, and powerful.',
        category: 'strategy',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'skills_strategy_3',
        title: 'High WIS for Perception',
        content: 'Your +6 Perception (+3 WIS + 3 prof) is excellent. Use it to spot hidden enemies, traps, and details in the environment.',
        category: 'strategy',
        difficulty: 'beginner',
        condition: (store) => store.abilities?.wis >= 16
      },
      {
        id: 'skills_strategy_4',
        title: 'Medicine & Insight for Roleplay',
        content: 'Your high Insight (+6) detects lies. Your high Medicine (+6) diagnoses illnesses. Use these in conversations and investigations for depth.',
        category: 'strategy',
        difficulty: 'beginner',
        condition: (store) => store.abilities?.wis >= 16
      },
      // Mechanics hints (5)
      {
        id: 'skills_mechanics_1',
        title: 'Skill Check Formula',
        content: 'Skill check = d20 + ability modifier + proficiency bonus (if proficient). Medicine = d20 + WIS (+3) + 3 prof = d20 + 6.',
        category: 'mechanics',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'skills_mechanics_2',
        title: 'Which Ability for Each Skill?',
        content: 'STR: Athletics | DEX: Acrobatics, Sleight of Hand, Stealth | INT: Arcana, History, Investigation, Nature, Religion | WIS: Animal Handling, Insight, Medicine, Perception, Survival | CHA: Deception, Intimidation, Performance, Persuasion',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'skills_mechanics_3',
        title: 'Passive Checks',
        content: 'Passive checks = 10 + modifier. Your passive Perception = 16 (detects most hidden things without rolling). Passive Insight = 16.',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => store.abilities?.wis >= 16
      },
      {
        id: 'skills_mechanics_4',
        title: 'Double Proficiency (Expertise)',
        content: 'You don\'t have Expertise (rogue/bard feature), but multiclassing or feats could grant it. Double proficiency = add proficiency twice.',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'skills_mechanics_5',
        title: 'Assistance & Cooperation',
        content: 'When allies Help (use action) on your check, you get +1d4. Coordinate with party—group rolls are often superior to individual attempts.',
        category: 'mechanics',
        difficulty: 'beginner',
        condition: (store) => true
      },
      // Rules hints (3)
      {
        id: 'skills_rules_1',
        title: 'DC (Difficulty Class) Guidelines',
        content: 'DC 10 = Easy, 15 = Hard, 20 = Very Hard, 25 = Nearly Impossible. Your +6 to proficient skills beats DC 10-15 most of the time.',
        category: 'rules',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'skills_rules_2',
        title: 'Advantage & Disadvantage on Checks',
        content: 'If you have advantage on a check, roll 2d20 and use the higher. Disadvantage = use the lower. These override natural modifiers.',
        category: 'rules',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'skills_rules_3',
        title: 'Taking 10 (Optional Rule)',
        content: 'In non-combat situations, you can take 10 (treat d20 as 10) on familiar checks. This guarantees a minimum result without rolling.',
        category: 'rules',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      // Critical hints (2)
      {
        id: 'skills_critical_1',
        title: 'Critical Checks in Tense Moments',
        content: 'Roll normally for critical checks (death saves, saving throws, initiative). Taking 10 doesn\'t work in combat or high-stress situations.',
        category: 'critical',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'skills_critical_2',
        title: 'When You Fail a Check',
        content: 'Failure doesn\'t mean "you fail forever." It means one attempt failed. Discuss with your DM if you can retry with different methods.',
        category: 'critical',
        difficulty: 'beginner',
        condition: (store) => true
      },
      // Reminder hints (2)
      {
        id: 'skills_reminder_1',
        title: 'Your Proficient Skills & Bonuses',
        content: '+6 Bonus: Medicine, Insight, Perception, Performance, Persuasion | Other WIS checks: +3 | Other checks: depends on ability modifier',
        category: 'reminder',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'skills_reminder_2',
        title: 'Skills You\'re Weak At',
        content: 'STR-based (Athletics, +1), INT-based (Arcana, +0), Stealth (-1), Sleight of Hand (-1). Avoid these or ask allies for help.',
        category: 'reminder',
        difficulty: 'beginner',
        condition: (store) => true
      }
    ]
  },

  inventory: {
    maxHints: 3,
    hints: [
      // Strategy hints (3)
      {
        id: 'inventory_strategy_1',
        title: 'Keep Healing Potions Handy',
        content: 'Potions of Healing (2d4+2) are your backup when spells are used up. Keep at least 2-3 in easy reach. They don\'t require spell slots.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'inventory_strategy_2',
        title: 'Organization Tips',
        content: 'Keep frequently used items (healing potions, holy symbol, spell components) in pockets. Heavy/rare items in a backpack. This speeds up combat.',
        category: 'strategy',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'inventory_strategy_3',
        title: 'Holy Symbol for Spellcasting',
        content: 'Your holy symbol (amulet, emblem) replaces material components for cleric spells. Always carry it! Losing it means slower spellcasting.',
        category: 'strategy',
        difficulty: 'intermediate',
        condition: (store) => store.class === 'Cleric'
      },
      // Mechanics hints (4)
      {
        id: 'inventory_mechanics_1',
        title: 'Carrying Capacity',
        content: 'You can carry STR (12) × 15 = 180 pounds. Your full plate (65 lbs) + shield (6 lbs) + gear (~50 lbs) = ~120 lbs. You have room for loot!',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => store.abilities?.str === 12
      },
      {
        id: 'inventory_mechanics_2',
        title: 'Armor Weight & Speed',
        content: 'Your plate armor (65 lbs) is heavy but doesn\'t reduce speed. If you wear armor exceeding STR 10, you move 5 ft slower (30 instead of 35).',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'inventory_mechanics_3',
        title: 'Magic Item Attunement',
        content: 'Some magic items require attunement. You can attune to up to 3 items. Attunement takes 1 hour of contact (long rest). Breaking attunement is instant.',
        category: 'mechanics',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      {
        id: 'inventory_mechanics_4',
        title: 'Item Rarity & Value',
        content: 'Common (1-100 gp), Uncommon (101-500 gp), Rare (501-5000 gp), Very Rare (5001+ gp). Track valuable items for selling or trading.',
        category: 'mechanics',
        difficulty: 'beginner',
        condition: (store) => true
      },
      // Rules hints (3)
      {
        id: 'inventory_rules_1',
        title: 'What\'s a Free Object Interaction?',
        content: 'Each turn, you can interact with one object (draw weapon, open door, stow shield). This doesn\'t use your action or bonus action.',
        category: 'rules',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'inventory_rules_2',
        title: 'Drawing Weapons',
        content: 'Drawing a weapon is a free object interaction. But if you draw multiple weapons/shields in one turn, the second uses your action. Plan ahead.',
        category: 'rules',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'inventory_rules_3',
        title: 'Potion Usage Rules',
        content: 'Drinking a potion takes 1 action. You can use a bonus action if someone else gives it to you (they use action, you use bonus action).',
        category: 'rules',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      // Critical hints (2)
      {
        id: 'inventory_critical_1',
        title: 'Losing Your Holy Symbol',
        content: 'If your holy symbol is lost or broken, you can\'t cast spells with material components. Immediately attempt to recover it or find a replacement.',
        category: 'critical',
        difficulty: 'critical',
        condition: (store) => true
      },
      {
        id: 'inventory_critical_2',
        title: 'Emergency Healing Potions',
        content: 'When spell slots are exhausted and allies need healing, healing potions are your lifeline. Keep at least 3-5 on hand at all times.',
        category: 'critical',
        difficulty: 'intermediate',
        condition: (store) => true
      },
      // Reminder hints (2)
      {
        id: 'inventory_reminder_1',
        title: 'Your Starting Equipment',
        content: 'Plate Armor (65 lbs) | Shield (6 lbs) | Mace (4 lbs) | Holy Symbol (1 lb) | Backpack | Rope | Torches | Bedroll | Rations | Waterskin',
        category: 'reminder',
        difficulty: 'beginner',
        condition: (store) => true
      },
      {
        id: 'inventory_reminder_2',
        title: 'Consumable Items Track',
        content: 'Update quantities of: Healing Potions, Rations, Torches, Ammunition (if using ranged). Consumed items are gone forever.',
        category: 'reminder',
        difficulty: 'beginner',
        condition: (store) => true
      }
    ]
  }
}

/**
 * Get hints for a specific page, filtered by conditions
 * Returns array of applicable hints
 */
export function getHintsForPage(pageName, characterStore) {
  if (!hintsDatabase[pageName]) {
    return []
  }

  return hintsDatabase[pageName].hints.filter(hint => {
    // Evaluate condition function
    if (hint.condition) {
      try {
        return hint.condition(characterStore)
      } catch (error) {
        // If condition fails, show hint anyway as fallback
        return true
      }
    }
    return true
  })
}

/**
 * Check if a hint has been dismissed
 */
export function isHintDismissed(hintId, dismissedHints = []) {
  return dismissedHints.includes(hintId)
}

/**
 * Get all hints for a page with metadata
 */
export function getPageHintMetadata(pageName) {
  if (!hintsDatabase[pageName]) {
    return null
  }
  return {
    page: pageName,
    maxHints: hintsDatabase[pageName].maxHints,
    totalHints: hintsDatabase[pageName].hints.length
  }
}
