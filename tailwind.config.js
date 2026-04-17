/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
        'fortune-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.3) 50%, transparent 100%)',
      },
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
