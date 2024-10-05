import { computed, inject, type Ref } from 'vue'
import { examplesStoreInjectionKey } from './constants'
import type { ExamplesStore } from './examples-store'
import { getExampleUrl } from './get-example-url'

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
        return getExampleUrl(description)
    })
    return rawCurrentExampleUrl;
}