import { PluginOption } from 'vite'
import { createViteConfig as createExamplesViteConfig } from '../../examples/runner'
import { serveOther, OtherServerOptions } from '../../utils/vite';
import { createViteConfig as createTestCasesViteConfig } from './test-case/create-vite-config'

function serveTestCases(server: OtherServerOptions): PluginOption{
    return serveOther({
        id: 'test-cases',
        path: '/test-case',
        config: createTestCasesViteConfig(),
        server
    })
}

function serveExamples(server: OtherServerOptions): PluginOption{
    return serveOther({
        id: 'examples',
        path: '/examples',
        config: createExamplesViteConfig(),
        server
    })
}

export function addRunner(server: OtherServerOptions): PluginOption[]{
    return [
        serveExamples(server),
        serveTestCases(server),
    ]
}