import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: fileURLToPath(new URL('./src/infinite-canvas-cjs.ts', import.meta.url)),
            name: 'InfiniteCanvas',
            fileName: 'infinite-canvas',
            formats: ['umd']
        },
        emptyOutDir: false
    }
})