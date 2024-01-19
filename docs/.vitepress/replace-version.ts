import type { PluginOption } from "vite";
import pckg from '../../package.json'

export default function replaceVersion(): PluginOption{
    return {
        name: 'vite-plugin-do-replacement',
        transform(code){
            return code.replace(/---VERSION---/g, pckg.version)
        }
    }
}