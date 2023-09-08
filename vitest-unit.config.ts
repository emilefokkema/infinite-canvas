import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test-unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    environment: 'jsdom'
  },
})