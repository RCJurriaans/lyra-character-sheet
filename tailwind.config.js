/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme variables
        'theme-primary': 'var(--theme-primary, #D4AF37)',
        'theme-primary-light': 'var(--theme-primaryLight, #F5E6D3)',
        'theme-primary-dark': 'var(--theme-primaryDark, #B8960E)',
        'theme-secondary': 'var(--theme-secondary, #1A3A4A)',
        'theme-accent': 'var(--theme-accent, #9D4EDD)',
        'theme-background': 'var(--theme-background, #1A3A4A)',
        'theme-surface': 'var(--theme-surface, #2D3E47)',
        'theme-text': 'var(--theme-text, #E8E0D5)',
        'theme-text-secondary': 'var(--theme-textSecondary, #9CA3AF)',

        gold: {
          50: '#FDF8F0',
          100: '#F9EDD7',
          200: '#F5E6D3',
          300: '#EDD4B8',
          400: '#D4AF37',
          500: '#C4A000',
          600: '#B8960E',
          700: '#997A12',
          800: '#6B5A0E',
          900: '#3D3606',
        },
        silver: '#C0C0C0',
        fortuneRed: '#C41E3A',
        fortuneNavy: '#1A3A4A',
        fortuneGreen: '#50C878',
        fortuneAmber: '#FFB700',
        // Tarot colors
        'tarot-purple': {
          300: '#B8A3D8',
          400: '#9D4EDD',
          600: '#5A189A',
          800: '#3C096C',
        },
        'tarot-blue': {
          600: '#0B3D91',
          700: '#072463',
          800: '#051F3A',
        },
        'tarot-silver': '#E8E0D5',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
        'fortune-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.3) 50%, transparent 100%)',
        'tarot-pattern': 'radial-gradient(circle at 20% 50%, rgba(157, 78, 221, 0.1) 0%, transparent 50%)',
      },
      animation: {
        'card-flip': 'card-flip 0.6s ease-out',
        'tarot-shimmer': 'tarot-shimmer 3s ease-in-out infinite',
        'mystical-glow': 'mystical-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'card-flip': {
          '0%': { transform: 'rotateY(0deg) scale(1)' },
          '50%': { transform: 'rotateY(90deg) scale(1.05)' },
          '100%': { transform: 'rotateY(0deg) scale(1)' },
        },
        'tarot-shimmer': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'mystical-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)' },
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
