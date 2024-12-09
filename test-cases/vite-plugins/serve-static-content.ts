import { serveStaticContent as addToRouter } from '../backend'
import { PluginOption } from "vite";

export function serveStaticContent(): PluginOption{
    return {
        name: 'vite-plugin-test-cases-serve-static-content',
        configureServer(viteDevServer){
            addToRouter(viteDevServer.middlewares);
        }
    }
}