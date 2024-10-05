export interface TestCaseMetadata{
    id: string
    fileName: string
    fullPath: string
    title: string
    dependsOnEnvironments?: string[]
    skip?: boolean
}

