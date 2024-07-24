import type { InfiniteCanvasRenderingContext2D } from "infinite-canvas"

export interface TestCaseDistortion{
    screenWidth: string
    screenHeight: string
    viewboxWidth: number,
    viewboxHeight: number
}

export interface TestCaseBase{
    title: string,
    distortion?: TestCaseDistortion
}

export interface RegularTestCase extends TestCaseBase{
    code(ctx: CanvasRenderingContext2D): void
}

export interface InfiniteTestCase extends TestCaseBase{
    code(ctx: InfiniteCanvasRenderingContext2D): void
    finiteCode(ctx: CanvasRenderingContext2D): void
}
export type TestCase = RegularTestCase | InfiniteTestCase;