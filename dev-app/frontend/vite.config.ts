import { UserConfig, defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import vue from '@vitejs/plugin-vue'
import { backend } from '../backend'
import { addRunner } from '../examples-runner/add-runner'
import { PORT } from '../shared/constants'

export default defineConfig(({mode}): UserConfig => {
    const root = fileURLToPath(new URL('.', import.meta.url))
    return {
        root,
        build: {
            outDir: './dist'
        },
        esbuild: {
            charset: 'ascii'
        },
        server: {
            port: PORT
        },
        plugins: [vue(), backend(), addRunner({port: PORT})]
    }
})