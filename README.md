# Lyra's Interactive Character Sheet

An interactive Vue 3 + Vite character sheet for **Lyra**, a Satyr Cleric (Life Domain, Level 5) who worships Tymora, the goddess of luck and fortune.

## Features

✨ **Spell Slot Tracking** - Visual grid for managing 1st-3rd level spell slots
💚 **Hit Point Management** - Track current/max HP with visual health bar
🎲 **Quick Rolls** - Roll ability checks, saving throws, and attacks
🍀 **Lucky Points** - Track and spend your 3 luck points
⚡ **Channel Divinity** - Toggle your Channel Divinity and Preserve Life features
📜 **Character Lore** - View personality traits, ideals, bonds, and flaws
💾 **Auto-Save** - All changes persist in browser LocalStorage

## Theme

The interface features a **fortune/luck aesthetic** with:
- Gold & silver color palette (divine + lucky)
- Tarot-inspired borders and decorative elements
- D20 & coin motifs for interactive elements
- Glowing hover effects and smooth animations

## Tech Stack

- **Vue 3** - Reactive frontend framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **LocalStorage** - Persistent character state

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

Output is in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Vue components
│   ├── Header.vue      # Character name & quick stats
│   ├── StatBlock.vue   # Ability scores & saving throws
│   ├── SpellSlots.vue  # Spell slot tracker
│   ├── SpellList.vue   # Prepared spells with details
│   ├── RollPanel.vue   # d20 roller for checks/saves
│   ├── HealingWidget.vue     # HP management
│   ├── LuckyPointsWidget.vue  # Lucky points tracker
│   ├── FeatureTracker.vue     # Channel Divinity & Preserve Life
│   └── CharacterLore.vue      # Personality traits
├── stores/
│   └── characterStore.js      # Reactive character state
├── utils/
│   ├── storage.js      # LocalStorage helpers
│   └── diceRoller.js   # Dice rolling functions
├── data/
│   └── character.json  # Lyra's base stats
├── assets/
│   └── styles.css      # Global + fortune theme styles
├── App.vue             # Main layout wrapper
└── main.js             # Vite entry point
```

## How to Use

### Tracking Spell Slots
1. Click on a spell slot box to mark it as used
2. Click again to restore the slot
3. Click "Long Rest" to reset all slots

### Managing HP
1. Enter damage amount and click "Damage"
2. Enter healing amount and click "Heal"
3. HP bar changes color (green → yellow → red)

### Rolling Checks
1. Select the roll type (Ability Check, Saving Throw, Attack)
2. Choose the ability
3. Click "Roll d20"
4. Result shows with detailed breakdown

### Spending Lucky Points
1. Click on a gold coin to spend a Lucky Point
2. Use with rolls, ability checks, or attacks
3. Coins reset after a Long Rest

### Features
- **Channel Divinity**: Click "Turn Undead" to activate (resets on Long Rest)
- **Preserve Life**: Distribute healing from a 25 HP pool (resets on Long Rest)

## Customization

### Colors
Edit `tailwind.config.js` to change the gold/silver/fortune theme colors.

### Spells
Update the spell list in `SpellList.vue` component.

### Character Stats
Modify `src/data/character.json` to change Lyra's base stats.

## Character Details

**Name:** Lyra
**Race:** Satyr
**Class:** Cleric (Life Domain)
**Level:** 5
**Alignment:** Chaotic Good
**Background:** Faction Agent (Wayfarer's Concord)

### Abilities
- STR: 12 (+1)
- DEX: 14 (+2)
- CON: 16 (+3)
- INT: 8 (-1)
- WIS: 17 (+3)
- CHA: 12 (+1)

### Combat Stats
- **AC:** 19 (Half-Plate + Dex + Shield)
- **Initiative:** +2
- **Hit Points:** 43
- **Spell Save DC:** 14
- **Spell Attack Bonus:** +6

### Spells Known

**Cantrips (At-Will)**
- Guidance, Sacred Flame, Toll the Dead, Spare the Dying

**1st Level (4 slots)**
- Bless (D), Cure Wounds (D), Healing Word, Guiding Bolt, Shield of Faith

**2nd Level (3 slots)**
- Lesser Restoration (D), Spiritual Weapon (D), Aid, Hold Person

**3rd Level (2 slots)**
- Beacon of Hope (D), Revivify (D), Spirit Guardians, Mass Healing Word, Dispel Magic

**(D) = Domain spell (always prepared)**

## Development Notes

- Character state is saved to `localStorage` after every change
- All rolls are client-side (no server required)
- Static hosting ready (GitHub Pages, Netlify, Vercel, etc.)

## Future Enhancements

- Mobile-optimized layout
- Ability to customize Lyra's stats
- Multi-character support
- Roll history export
- Campaign notes section

## License

Feel free to use and modify for personal D&D campaigns!

---

**Happy adventuring with Lyra!** 🍀✨
