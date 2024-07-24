import type { TestCase } from "test-case";

export interface TestCaseDisplay{
    displayTestCase(testCase: TestCase): void
}