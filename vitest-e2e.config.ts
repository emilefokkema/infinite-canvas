import { defineConfig } from 'vitest/config'
import { addTestCasesMetadataList } from './test-cases/vite-plugins'

export default defineConfig({
  test: {
    include: ['e2e/tests/**/*.spec.ts'],
    globalSetup: ["e2e/setup/index.ts"],
    setupFiles: ["e2e/tests/test-page/setup.ts"],
    hookTimeout: 120000,
    testTimeout: 120000,
    reporters: ['dot']
  },
  plugins: [addTestCasesMetadataList()],
})