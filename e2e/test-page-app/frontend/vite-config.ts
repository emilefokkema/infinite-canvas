import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import path from 'path'
import { outDirPath } from '../../../src/constants'

export default defineConfig(() => {
    const root = fileURLToPath(new URL('.', import.meta.url))
    const rootIndexHtml = fileURLToPath(new URL('./index.html', import.meta.url))
    const testCaseRoot = fileURLToPath(new URL('./test-case/index.html', import.meta.url))
    return {
        root,
        build: {
            outDir: './dist',
            rollupOptions: {
                input: [rootIndexHtml, testCaseRoot]
            }
        },
        resolve: {
            alias: {
                'infinite-canvas': path.resolve(outDirPath, 'infinite-canvas.js')
            }
        }
    }
})