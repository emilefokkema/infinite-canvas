import { UserConfig, PluginOption } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { ExampleRunnerOptions } from './options'
import { getExamplesDirs } from '../access'
import { addDarkTheme } from '../../utils/dark-theme/vite-plugin'
import { addInfiniteCanvas } from '../../src/add-infinite-canvas'

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

function addExampleInfiniteCanvas(infiniteCanvasPath?: string): PluginOption{
    return {
        name: 'vite-plugin-add-example-infinite-canvas',
        resolveId: {
            order: 'pre',
            async handler(source, importer, options){
                if(source !== 'ef-infinite-canvas'){
                    return;
                }
                if(infiniteCanvasPath){
                    return infiniteCanvasPath;
                }
                return this.resolve('infinite-canvas', importer, options)
            }
        }
    }
}

export function createViteConfig(options?: ExampleRunnerOptions): UserConfig{
    const root = fileURLToPath(new URL('../catalog', import.meta.url))
    return {
        root,
        plugins: [
            addIndexJsToIndexHtml(),
            resolveEntryPoints(),
            addDarkTheme(),
            addInfiniteCanvas(),
            addExampleInfiniteCanvas(options?.infiniteCanvasPath)
        ]
    }
}