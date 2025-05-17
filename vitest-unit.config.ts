import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'
import { addDependencies } from './src/add-dependencies'

export default defineConfig({
  plugins: [addDependencies()],
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src/impl', import.meta.url)),
    }
  },
  test: {
    include: ['test-unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    environment: 'jsdom'
  },
})