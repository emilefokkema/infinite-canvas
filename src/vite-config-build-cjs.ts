import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { outDirPath} from './constants'
import { addDependencies } from './add-dependencies'

export default defineConfig({
    plugins: [addDependencies()],
    build: {
        lib: {
            entry: fileURLToPath(new URL('./impl/infinite-canvas-cjs.ts', import.meta.url)),
            name: 'InfiniteCanvas',
            fileName: 'infinite-canvas',
            formats: ['umd']
        },
        outDir: outDirPath,
        emptyOutDir: false
    }
})