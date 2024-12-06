import { fileURLToPath } from "url";
import { PluginOption } from "vite";
import { addDependencies } from "./add-dependencies";

const entryPath = fileURLToPath(new URL('./impl/infinite-canvas.ts', import.meta.url))

export function addInfiniteCanvas(): PluginOption[]{
    return [
        addDependencies(),
        {
            name: 'vite-plugin-add-infinite-canvas',
            config(){
                return {
                    resolve: {
                        alias: {
                            'infinite-canvas': entryPath
                        }
                    }
                }
            }
        }
    ]
}