declare module 'virtual:test-cases-list'{
    import { TestCase } from 'test-case'
    const list: {id: string, testCase: TestCase}[]
    export default list;
}