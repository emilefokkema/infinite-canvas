import { default as express } from 'express'
import http from 'http'
import type { GlobalSetupContext } from 'vitest/node'
import { setupPageFactory } from './setup-page-factory'
import { SERVER_PORT } from '../shared/constants'
import { setupTestPageServer } from './setup-test-page-server'

export default async function setup(ctx: GlobalSetupContext){
    const app = express();
    const server = http.createServer(app);
    const {destroy: destroyPageFactory} = setupPageFactory(ctx, app)

    const { runtimeEventTargetOptions } = await setupTestPageServer(server, app);
    ctx.provide('runtimeEventTargetOptions', runtimeEventTargetOptions)

    
    await new Promise<void>(res => {
        server.listen(SERVER_PORT, res);
    })
    console.log('e2e server started')
    return async () => {
        await destroyPageFactory();
        await new Promise<void>((res) => {
            server.close(() => res())
        })
        console.log('e2e server closed')
    }
}