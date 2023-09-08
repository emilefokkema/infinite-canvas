import { defineLoader } from 'vitepress'
// @ts-ignore: The current file is part of both the 'ts-config-docs-app.json' project and the 'ts-config-docs-config.json'
// project, but retrieve-examples.ts is only part of the latter. C'est la vitepress.
import { findExamples } from '../../../examples/backend/retrieval/retrieve-examples';
import type { ExampleProject } from '../../../examples/shared/examples'

declare const data: ExampleProject[];
export {data}

export default defineLoader({
    async load(): Promise<ExampleProject[]>{
        return await findExamples([
            'getting-started',
            'start-path-at-infinity',
            'line-to-infinity',
            'infinite-rectangles-1'
        ]);
    }
})