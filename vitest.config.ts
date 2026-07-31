import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': resolve(__dirname, '.') } },
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['./vitest.setup.ts'],
    // `components/**/*.test.tsx` added so a tool's interaction test has a
    // correct home. Previously it had none: three redesign agents wrote real
    // `@testing-library/react` harnesses under `lib/tools/<slug>/`, ran them
    // once, and deleted them, because that directory is for pure logic and
    // permanent test files don't belong somewhere they'd be mistaken for
    // production code.
    include: [
      'lib/**/*.test.ts',
      'lib/**/*.test.tsx',
      'components/**/*.test.tsx',
      'tests/**/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.ts'],
      exclude: ['lib/**/*.test.ts'],
    },
  },
})
