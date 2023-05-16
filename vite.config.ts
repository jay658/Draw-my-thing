import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import express from "./express.plugin"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), express("/server")],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts']
  }
})