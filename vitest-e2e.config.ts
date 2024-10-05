import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'
import { addTestCasesMetadataList } from './test-cases/vite-plugins/add-test-cases-metadata-list'

export default defineConfig({
  test: {
    include: ['test-e2e/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globalSetup: ['./test-e2e/setup.ts'],
    hookTimeout: 120000,
    testTimeout: 120000,
  },
  plugins: [addTestCasesMetadataList()],
  resolve: {
    alias: {
      'test-page-lib': fileURLToPath(new URL('./test-e2e/test-page-lib/api', import.meta.url)),
      'infinite-canvas': fileURLToPath(new URL('./src/infinite-canvas', import.meta.url)),
    }
  }
})