import { ref, type Ref } from 'vue'
import type { ExampleDescription, CreateExampleRequest } from '../../shared/examples'
import type { ExamplesRouter } from './examples-router'

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

export function createExamplesStore(router: ExamplesRouter): ExamplesStore{
    const examples = ref<DisplayableExample[]>([])
    const selected = ref<string | null>(null);

    async function refresh(): Promise<void>{
        const response = await fetch('/api/examples');
        const result = (await response.json()) as ExampleDescription[];
        const examplesValue = result.map(e => ({id: `${e.kind}/${e.id}`, description: e}));
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
        const id = await response.text();
        refresh().then(() => selectExample(id));
    }
    return { examples, selected, refresh, selectExample, createExample };
}