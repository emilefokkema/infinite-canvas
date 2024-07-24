export interface ExampleProject {
    id: string,
    title: string
    files: {[name: string]: string}
}

export interface CreateExampleRequest{
    title: string
}