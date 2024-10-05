import { UserConfig, PluginOption } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { ExampleRunnerOptions } from './options'
import { getExamplesDirs } from '../access'
import { addDarkTheme } from '../../utils/dark-theme/vite-plugin'

function addIndexJsToIndexHtml(): PluginOption{
    return {
        name: 'vite-plugin-runner-examples-index-js',
        transformIndexHtml: {
            order: 'pre',
            handler(){
                return [{tag: 'script', attrs: {'src': 'index.js','type': 'module'}}]
            }
        }
    }
}

function resolveEntryPoints(): PluginOption{
    return {
        name: 'vite-plugin-resolve-example-entry-points',
        apply: 'build',
        async config(){
            const input: {[entryAlias: string]: string} = {};
            const exampleDirs = await getExamplesDirs();
            for(let {dirName, fullPath} of exampleDirs){
                input[dirName] = path.resolve(fullPath, 'index.html')
            }
            return {
                build: {
                    rollupOptions: { input }
                }
            }
        }
    }
}

export function createViteConfig({infiniteCanvasPath, alias}: ExampleRunnerOptions): UserConfig{
    const root = fileURLToPath(new URL('../catalog', import.meta.url))
    return {
        root,
        resolve: {
            alias: {
                'ef-infinite-canvas': infiniteCanvasPath,
                ...(alias || {})
            }
        },
        plugins: [addIndexJsToIndexHtml(), resolveEntryPoints(), addDarkTheme()]
    }
}