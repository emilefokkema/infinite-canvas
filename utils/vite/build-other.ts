import path from 'path'
import { InlineConfig, PluginOption, build } from "vite";
import { OtherOptions } from "./other-options";

export function buildOther({id, path: optionsPath, config}: OtherOptions): PluginOption{
    let outDir: string | undefined = undefined;
    let otherWritten: boolean = false;
    return {
        name: `vite-plugin-build-other-${id}`,
        apply: 'build',
        configResolved: (c) => {
            outDir = c.build.outDir;
        },
        async writeBundle(){
            if(otherWritten){
                return;
            }
            const otherOutDir = path.resolve(outDir, optionsPath.replace(/^\//,''))
            const extendedOtherConfig: InlineConfig = {
                ...config,
                base: optionsPath,
                build: {
                    ...(config.build || {}),
                    outDir: otherOutDir,
                    emptyOutDir: false
                }
            }
            await build(extendedOtherConfig)
            otherWritten = true;
        }
    }
}