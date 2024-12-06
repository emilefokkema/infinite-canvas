import { fileURLToPath } from 'url'
import { InlineConfig } from 'vite'
import { distPath } from './constants'

const entryPath = fileURLToPath(new URL('./src/index.ts', import.meta.url))
export function createConfig(): InlineConfig{
    return {
        build: {
            lib: {
                entry: entryPath,
                formats: ['es'],
                fileName: 'index'
            },
            outDir: distPath
        }
    }
}