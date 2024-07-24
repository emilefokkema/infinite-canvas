import { fileURLToPath } from "url"
import path from 'path'
import fs from 'fs'
import { readFile } from 'fs/promises'
import { PluginOption, HtmlTagDescriptor, build } from "vite"
import { DARK_THEME_STYLE_ID, DARK_THEME_CSS_CONTENT_ID } from '../shared/constants'

async function getDarkCssContent(directory: string): Promise<string | undefined>{
    return new Promise((res) => {
        fs.readFile(path.resolve(directory, 'index-dark.css'), {encoding: 'utf-8'}, (err, data) => {
            if(err){
                res(undefined)
                return;
            }
            res(data)
        })
    })
}

function isDarkRequested(fileName: string, originalUrl: string | undefined): boolean{
    if(originalUrl){
        return new URL(originalUrl, 'http://www.example.com').searchParams.get('dark') === 'true'
    }
    return /\/index-dark\.html/.test(fileName);
}

export function addDarkCssLoader(): PluginOption{
    const loadDarkThemePath = fileURLToPath(new URL('../frontend/shared/load-dark-theme.ts', import.meta.url))
    //const loadDarkThemeModuleId = 'dark-theme-plugin-load-dark-theme';
    let root: string
    let base: string;
    let outDir: string;
    return {
        name: 'vite-plugin-dark-theme-add-loader',
        configResolved(config){
            root = config.root;
            base = config.base;
            outDir = config.build.outDir;
        },
        transformIndexHtml: {
            order: 'post',
            async handler(_, {originalUrl, filename}){
                const darkCssContent = await getDarkCssContent(path.dirname(filename))
                if(!darkCssContent){
                    return;
                }
                const darkRequested = isDarkRequested(filename, originalUrl)
                const tags: HtmlTagDescriptor[] = [{
                    tag: 'script',
                    attrs: {
                        src: `${base.replace(/(?!\/)(.)$/,'$1/').replace(/^(?!\/)/, '/')}dark-theme-plugin-load-dark-theme.js`,
                        type: 'module'
                    }
                }];
                if(darkRequested){
                    tags.push({
                        tag: 'style',
                        attrs: {
                            id: DARK_THEME_STYLE_ID
                        },
                        children: darkCssContent,
                        injectTo: 'body-prepend'
                    })
                }else{
                    tags.push({
                        tag: 'script',
                        attrs: {
                            type: 'text/css',
                            id: DARK_THEME_CSS_CONTENT_ID
                        },
                        children: darkCssContent
                    })
                }
                return tags;
            }
        },
        async writeBundle(){
            await build({
                build: {
                    lib: {
                        entry: loadDarkThemePath,
                        fileName: 'dark-theme-plugin-load-dark-theme',
                        formats: ['es']
                    },
                    emptyOutDir: false,
                    outDir
                }
            })
        },
        resolveId(id){
            if(!/dark-theme-plugin-load-dark-theme\.js$/.test(id)){
                return;
            }
            return loadDarkThemePath;
        }
    }
}