export interface ExampleDescription{
    title: string
    id: string,
    kind: 'use-case' | 'test-case'
}

export interface ExampleProject extends ExampleDescription{
    files: {[name: string]: string}
}

export interface CreateExampleRequest{
    title: string
}