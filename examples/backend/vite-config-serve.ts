import { defineConfig, type PluginOption, type ViteDevServer } from 'vite'
import type { Express } from 'express'
import { fileURLToPath } from 'url'
import vue from '@vitejs/plugin-vue'
import { addExamples, addTestCases } from './vite-plugin'
import { createExamplesApi } from './api'

function api(): PluginOption{
    let apiHandler: Express;

    return {
        name: 'vite-add-examples-api',
        apply: 'serve',
        configureServer: {
            order: 'pre',
            handler(server: ViteDevServer){
                if(!apiHandler){
                    apiHandler = createExamplesApi();
                }
                server.middlewares.use('/api', apiHandler)
            }
        }
    }
}

export default defineConfig(() => {
    const root = fileURLToPath(new URL('../catalog', import.meta.url))
    return {
        root,
        plugins: [vue(), api(), addExamples(), addTestCases()]
    }
})