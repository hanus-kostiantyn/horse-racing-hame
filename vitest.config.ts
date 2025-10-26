import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['./src/test-setup.ts'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/e2e/**', // Exclude Playwright E2E tests
        '**/*.spec.ts', // Exclude Playwright test files
      ],
      include: ['src/**/*.test.ts'], // Only include Vitest unit tests
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/main.ts',
          '*.config.ts',
          '**/*.d.ts',
          '**/*.spec.ts',
          '**/*.test.ts',
        ]
      }
    },
  })
)