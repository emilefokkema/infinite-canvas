import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { outDirPath} from './constants'
import { addDependencies } from './add-dependencies'

const entryPath = fileURLToPath(new URL('./impl/infinite-canvas.ts', import.meta.url))

export default defineConfig({
    plugins: [addDependencies()],
    build: {
        lib: {
            entry: entryPath,
            fileName: 'infinite-canvas',
            formats: ['es']
        },
        outDir: outDirPath,
        emptyOutDir: false
    }
})