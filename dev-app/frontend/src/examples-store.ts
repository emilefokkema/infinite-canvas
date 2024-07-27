import { ref, type Ref } from 'vue'
import type { ExampleDescription } from '../../shared'
import type { CreateExampleRequest } from '../../../examples/shared'
import type { ExamplesRouter } from './examples-router'
import { getExampleUrl } from './get-example-url'
import { waitUntilFound } from './wait-until-found'

export interface DisplayableExample{
    id: string
    description: ExampleDescription
}
export interface ExamplesStore{
    examples: Ref<DisplayableExample[]>
    selected: Ref<string | null>
    refresh(): void
    selectExample(id: string): void
    createExample(request: CreateExampleRequest): Promise<void>
}

function mapToDisplayableExample(description: ExampleDescription): DisplayableExample{
    return {
        id: `${description.kind}/${description.id}`,
        description
    };
}

export function createExamplesStore(router: ExamplesRouter): ExamplesStore{
    const examples = ref<DisplayableExample[]>([])
    const selected = ref<string | null>(null);

    async function refresh(): Promise<void>{
        const response = await fetch('/api/examples');
        const result = (await response.json()) as ExampleDescription[];
        const examplesValue = result.map(mapToDisplayableExample);
        examplesValue.sort((a, b) => a.description.title > b.description.title ? 1 : -1);
        examples.value = examplesValue;
        if(selected.value === null){
            const idFromRouter = router.exampleId.value;
            if(idFromRouter){
                selectExample(idFromRouter)
            }else{
                selectExample(examplesValue[0].id);
            }
        }
    }
    function selectExample(id: string): void{
        selected.value = id;
        router.exampleId.value = id;
    }
    
    async function createExample(request: CreateExampleRequest): Promise<void>{
        const response = await fetch('/api/examples/create', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(request)})
        const description = await response.json();
        const displayableExample = mapToDisplayableExample(description)
        const url = getExampleUrl(description)
        await waitUntilFound(url)
        await refresh();
        selectExample(displayableExample.id)
    }
    return { examples, selected, refresh, selectExample, createExample };
}