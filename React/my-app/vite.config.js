// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // ✅ This allows `expect`, `describe`, etc. to be used globally
    environment: 'jsdom',
    setupFiles: './vitest.setup.js' // ✅ Make sure this path is correct
  }
});