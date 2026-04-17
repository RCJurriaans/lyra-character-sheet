import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/lyra-character-sheet/',
  server: {
    port: 5173,
    host: true
  }
})
