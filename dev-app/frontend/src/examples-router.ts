import { ref, computed, type Ref } from 'vue'

export interface ExamplesRouter{
    exampleId: Ref<string | undefined>
    initialize(): void
}

export function createExamplesRouter(): ExamplesRouter{
    const exampleIdValue = ref<string | undefined>();
    const exampleId = computed({
        get(): string | undefined{
            return exampleIdValue.value;
        },
        set(value: string | undefined){
            const url = new URL(location.href);
            url.hash = `/${value}`;
            history.pushState({}, '', url.toString())
        }
    })
    function readExampleId(): void{
        const hashMatch = location.hash.match(/#\/(.*)$/);
        if(!hashMatch){
            exampleIdValue.value = undefined;
            return;
        }
        exampleIdValue.value = hashMatch[1];
    }

    function initialize(): void{
        readExampleId();
    }
    return {
        exampleId,
        initialize
    };
}