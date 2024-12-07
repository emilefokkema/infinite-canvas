import { PluginOption, createServer, ViteDevServer, UserConfig, HttpServer } from 'vite'
import { ServeOtherOptions } from './serve-other-options';

function findServer(server: HttpServer | undefined, viteDevServer: ViteDevServer | undefined): HttpServer | undefined{
    if(server){
        return server;
    }
    if(!viteDevServer){
        return undefined;
    }
    return viteDevServer.httpServer || undefined;
}

export function serveOther({id, path, config, server: {port, server}}: ServeOtherOptions): PluginOption{
    let hasCreatedServer = false;
    return {
        name: `vite-plugin-serve-other-${id}`,
        apply: 'serve',
        async configureServer(viteDevServer){
            if(hasCreatedServer){
                return;
            }
            const possibleServer = findServer(server, viteDevServer);
            const configWithServer: UserConfig = {
                ...config,
                base: path,
                server: {
                    ...(config.server || {}),
                    middlewareMode: possibleServer ? {server: possibleServer} : true,
                    hmr: {
                        port,
                        server: possibleServer
                    }
                }
            }
            const otherServer = await createServer(configWithServer)
            if(possibleServer){
                possibleServer.on('close', () => {
                    otherServer.close();
                })
            }
            viteDevServer.middlewares.use(path, otherServer.middlewares)
        }
    }
}