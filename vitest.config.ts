import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules', '.next'],
    env: {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'test-secret-key-for-vitest-at-least-32-chars!',
      JWT_EXPIRES_IN: '1h',
      STRIPE_SECRET_KEY: 'sk_test_vitest_placeholder',
      STRIPE_WEBHOOK_SECRET: 'whsec_vitest_placeholder',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      FREESOUND_API_KEY: 'freesound_vitest_placeholder',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
