import type { DisplayableExample } from './examples-store'

export function getExampleUrl(example: DisplayableExample): string{
    const description = example.description;
    if(description.kind === 'use-case'){
        return new URL(`/${description.id}/`, location.href).toString();
    }
    return new URL(`/test-case.html#/${description.id}`, location.href).toString()
}