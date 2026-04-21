import { ref, watch, computed } from 'vue'

export const THEMES = {
  fortune: {
    name: 'Fortune Teller',
    description: 'Gold and navy mystical theme',
    colors: {
      primary: '#D4AF37',
      primaryLight: '#F5E6D3',
      primaryDark: '#B8960E',
      secondary: '#1A3A4A',
      accent: '#9D4EDD',
      background: '#1A3A4A',
      surface: '#2D3E47',
      text: '#E8E0D5',
      textSecondary: '#9CA3AF',
    }
  },
  riderWaiteClassic: {
    name: 'Rider-Waite Classic',
    description: 'Rich purples, golds, and earthy tones',
    colors: {
      primary: '#8B4513',
      primaryLight: '#D2B48C',
      primaryDark: '#654321',
      secondary: '#2C1810',
      accent: '#9D4EDD',
      background: '#1F1515',
      surface: '#3A2F2A',
      text: '#F5E6D3',
      textSecondary: '#A89968',
    }
  },
  riderWaiteMystical: {
    name: 'Rider-Waite Mystical',
    description: 'Deep purples, crimsons, and mystical blues',
    colors: {
      primary: '#9D4EDD',
      primaryLight: '#D8B8FF',
      primaryDark: '#5A189A',
      secondary: '#2D1B4E',
      accent: '#DC143C',
      background: '#1A0F2E',
      surface: '#2D1B4E',
      text: '#F5E6D3',
      textSecondary: '#B8A3D8',
    }
  },
  riderWaiteArcane: {
    name: 'Rider-Waite Arcane',
    description: 'Forest greens, gold accents, and cream',
    colors: {
      primary: '#2D5016',
      primaryLight: '#90EE90',
      primaryDark: '#1B3A0F',
      secondary: '#1A1A1A',
      accent: '#FFD700',
      background: '#0F1410',
      surface: '#1F2B1F',
      text: '#F5E6D3',
      textSecondary: '#8FBC8F',
    }
  },
  riderWaiteRoyal: {
    name: 'Rider-Waite Royal',
    description: 'Royal blues, deep reds, and silver',
    colors: {
      primary: '#0B3D91',
      primaryLight: '#4A90E2',
      primaryDark: '#051F3A',
      secondary: '#1A1A1A',
      accent: '#DC143C',
      background: '#0F1620',
      surface: '#1A2A3A',
      text: '#F5E6D3',
      textSecondary: '#A9B4C2',
    }
  }
}

const currentTheme = ref('fortune')
const themes = ref(THEMES)

export const useTheme = () => {
  const theme = computed(() => themes.value[currentTheme.value])

  const setTheme = (themeName) => {
    if (themeName in themes.value) {
      currentTheme.value = themeName
      localStorage.setItem('preferredTheme', themeName)
    }
  }

  const initTheme = () => {
    const saved = localStorage.getItem('preferredTheme')
    if (saved && saved in themes.value) {
      currentTheme.value = saved
    }
    applyTheme()
  }

  const applyTheme = () => {
    const colors = theme.value.colors
    const root = document.documentElement

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })
  }

  watch(currentTheme, () => {
    applyTheme()
  })

  return {
    theme,
    currentTheme,
    setTheme,
    initTheme,
    availableThemes: THEMES
  }
}
