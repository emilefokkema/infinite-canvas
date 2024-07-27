import type { ExampleDescription } from "../../shared";

function getTestCaseUrl(description: ExampleDescription): string{
    return new URL(`/test-case/#/${description.id}`, location.href).toString()
}

function getUseCaseUrl(description: ExampleDescription): string{
    return new URL(`/examples/${description.id}/`, location.href).toString()
}

export function getExampleUrl(description: ExampleDescription): string{
    if(description.kind === 'test-case'){
        return getTestCaseUrl(description)
    }
    return getUseCaseUrl(description)
}