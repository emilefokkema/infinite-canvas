import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: fileURLToPath(new URL('./src/infinite-canvas.ts', import.meta.url)),
            fileName: 'infinite-canvas',
            formats: ['es']
        },
        emptyOutDir: false
    }
})