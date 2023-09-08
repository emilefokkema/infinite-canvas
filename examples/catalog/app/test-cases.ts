import type { InfiniteCanvasRenderingContext2D } from 'infinite-canvas';

export interface TestCaseDistortion{
    screenWidth: string
    screenHeight: string
    viewboxWidth: number
    viewboxHeight: number
}

interface TestCaseBase{
    title: string,
    id: string,
    distortion?: TestCaseDistortion
}
interface RegularTestCase extends TestCaseBase{
    code: (ctx: CanvasRenderingContext2D) => void,
}
interface InfiniteTestCase extends TestCaseBase{
    code: (ctx: InfiniteCanvasRenderingContext2D) => void,
    finiteCode: (ctx: CanvasRenderingContext2D) => void
}
export function isInfiniteTestCase(testCase: TestCase): testCase is InfiniteTestCase{
    return (testCase as any).finiteCode !== undefined;
}
export type TestCase = RegularTestCase | InfiniteTestCase;