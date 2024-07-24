import { defineLoader } from 'vitepress'
import { getExampleProjects } from '../../../examples/access'
import type { ExampleProject } from '../../../examples/shared/examples'

declare const data: ExampleProject[];
export {data}

export default defineLoader({
    async load(): Promise<ExampleProject[]>{
        return await getExampleProjects([
            'getting-started',
            'start-path-at-infinity',
            'line-to-infinity',
            'infinite-rectangles-1'
        ]);
    }
})