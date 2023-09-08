declare module 'virtual:test-cases-*' {
    export interface TestCase{
        id: string
        title: string,
        dependsOnEnvironments: string[] | undefined
    }
    const testCases: TestCase[];
    export default testCases;
}