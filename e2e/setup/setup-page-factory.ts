import type { GlobalSetupContext } from 'vitest/node'
import type { Express } from 'express'
import { createBackend  } from '../../e2e-test-utils/page-factory/setup/backend'
import {SERVER_BASE_URL} from '../shared/constants'

export function setupPageFactory({ provide }: GlobalSetupContext, app: Express): {destroy(): Promise<void>}{
    const pageFactoryPath = 'page-factory'
    const pageFactoryBaseUrl = new URL(pageFactoryPath, SERVER_BASE_URL).toString()
    provide('pageFactoryOptions', {baseUrl: pageFactoryBaseUrl})
    const headless = process.env.HEADLESS !== 'false'
    const backend = createBackend({headless});
    app.use(`/${pageFactoryPath}`, backend.router)
    function destroy(): Promise<void>{
        return backend.destroy();
    }
    return { destroy }
}