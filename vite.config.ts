import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  base: '/test/',
  build: {
    sourcemap: 'hidden',
  },
  server: {
    watch: {
      ignored: ['**/.pnpm-store/**', '**/node_modules/**', '**/dist/**'],
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    tsconfigPaths()
  ],
})
