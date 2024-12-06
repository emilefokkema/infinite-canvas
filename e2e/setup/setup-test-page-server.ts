import { default as express, type Express } from 'express'
import { Server } from 'http'
import { distPath as testAppDistPath } from '../test-page-app/frontend/constants'
import { createBackend as createRuntimeEventTargetBackend } from '../../e2e-test-utils/runtime-event-target/setup/backend'
import { Options as RuntimeEventTargetOptions } from '../../e2e-test-utils/runtime-event-target/shared/options'
import { RUNTIME_EVENT_TARGET_PUBLIC_PATH, SERVER_BASE_URL } from '../shared/constants'
import { catalogRoot, catalogStaticRoot } from '../../test-cases/backend'

export interface TestPageServer{
    runtimeEventTargetOptions: RuntimeEventTargetOptions
}
export async function setupTestPageServer(server: Server, app: Express): Promise<TestPageServer>{
    const runtimeEventTargetOptions: RuntimeEventTargetOptions = { 
        baseUrl: SERVER_BASE_URL,
        publicPath: RUNTIME_EVENT_TARGET_PUBLIC_PATH
    }
    
    app.use(express.static(testAppDistPath))
    app.use('/test-cases', express.static(catalogRoot))
    app.use('/static', express.static(catalogStaticRoot))

    const {router: runtimeEventTargetRouter } = await createRuntimeEventTargetBackend(server, runtimeEventTargetOptions)
    app.use(`/${RUNTIME_EVENT_TARGET_PUBLIC_PATH}`, runtimeEventTargetRouter)
    return { runtimeEventTargetOptions }
}