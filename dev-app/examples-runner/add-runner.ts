import { PluginOption } from 'vite'
import { fileURLToPath } from "url";
import { createViteConfig as createExamplesViteConfig, ExampleRunnerOptions } from '../../examples/runner'
import { serveOther, OtherServerOptions } from '../../utils/vite';
import { TestCaseRunnerOptions } from './test-case/options';
import { createViteConfig as createTestCasesViteConfig } from './test-case/create-vite-config'

function serveTestCases(options: TestCaseRunnerOptions, server: OtherServerOptions): PluginOption{
    return serveOther({
        id: 'test-cases',
        path: '/test-case',
        config: createTestCasesViteConfig(options),
        server
    })
}

function serveExamples(options: ExampleRunnerOptions, server: OtherServerOptions): PluginOption{
    return serveOther({
        id: 'examples',
        path: '/examples',
        config: createExamplesViteConfig(options),
        server
    })
}

export function addRunner(server: OtherServerOptions): PluginOption[]{
    const infiniteCanvasPath = fileURLToPath(new URL('../../src/infinite-canvas.ts', import.meta.url))
    return [
        serveExamples({infiniteCanvasPath}, server),
        serveTestCases({infiniteCanvasPath}, server),
    ]
}