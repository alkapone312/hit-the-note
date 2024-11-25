import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/modules', import.meta.url)),
      '@App': fileURLToPath(new URL('./src/app', import.meta.url)),
    }
  }
})
