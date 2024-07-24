import { InfiniteTestCase, TestCase } from './test-case'

export function isInfiniteTestCase(testCase: TestCase): testCase is InfiniteTestCase{
    return (testCase as InfiniteTestCase).finiteCode !== undefined;
}