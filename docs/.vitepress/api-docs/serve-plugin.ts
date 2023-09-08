import type { PluginOption } from "vite";
import path from 'path'
import fs from 'fs/promises'
import { outDir, watchApplication } from './create-application'

export default function addApi(): PluginOption{
    let watching: boolean = false;
    return {
        name: 'vite-plugin-add-api-docs-serve',
        apply: 'serve',
        configureServer: async () => {
            if(watching){
                return;
            }
            await watchApplication();
            watching = true;
        },
        load: {
            order: 'post',
            handler: async (id: string) => {
                const apiMatch = id.match(/^\/api\/(.*)$/)
                if(!apiMatch){
                    return;
                }
                const [,requested] = apiMatch;
                const resultPath = path.resolve(outDir, requested);
                const result = await fs.readFile(resultPath, {encoding: 'utf-8'});
                return result;
            }
        }
    };
}