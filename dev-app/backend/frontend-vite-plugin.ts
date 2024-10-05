import { type PluginOption } from 'vite'
import { type Express } from 'express'
import { createRouter } from './router';

function devBackend(): PluginOption{
    let apiRouter: Express | undefined;
    return {
        name: 'vite-plugin-dev-app-backend',
        apply: 'serve',
        configureServer(server){
            server.middlewares.use('/api', apiRouter || (apiRouter = createRouter()))
        }
    }
}

export function backend(): PluginOption[]{
    return [devBackend()]
}