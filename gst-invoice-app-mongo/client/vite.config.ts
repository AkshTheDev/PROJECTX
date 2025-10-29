// client/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite' // <-- Ensure this is imported

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Ensure this is in the plugins array
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})