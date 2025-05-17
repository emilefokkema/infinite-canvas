import { fileURLToPath } from "url";
import { PluginOption } from "vite";

const apiPath = fileURLToPath(new URL('./api', import.meta.url))

export function addDependencies(): PluginOption{
    return {
        name: 'vite-plugin-add-infinite-canvas-dependencies',
        config(){
            return {
                resolve: {
                    alias: {
                        api: apiPath
                    }
                }
            }
        }
    }
}