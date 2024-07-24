import { computed, inject, type Ref } from 'vue'
import { examplesStoreInjectionKey } from './constants'
import type { ExamplesStore } from './examples-store'
import type { ExampleDescription } from '../../shared'

function getTestCaseUrl(description: ExampleDescription): string{
    return new URL(`/test-case/#/${description.id}`, location.href).toString()
}

function getExampleUrl(description: ExampleDescription): string{
    return new URL(`/examples/${description.id}/`, location.href).toString()
}

export interface CurrentExampleUrl{
    url: Ref<string | undefined>
}

export function useCurrentExampleUrl(): Ref<string | undefined>{
    const store = inject(examplesStoreInjectionKey) as ExamplesStore

    const rawCurrentExampleUrl = computed(() => {
        const selectedIdValue = store.selected.value;
        const selectedExample = store.examples.value.find(e => e.id === selectedIdValue)
        if(!selectedExample){
            return undefined;
        }
        const description = selectedExample.description;
        if(description.kind === 'test-case'){
            return getTestCaseUrl(selectedExample.description)
        }
        return getExampleUrl(selectedExample.description)
    })
    return rawCurrentExampleUrl;
}