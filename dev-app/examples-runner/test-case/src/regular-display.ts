import type { TestCase } from "test-case";
import { isInfiniteTestCase } from "../../../../test-cases/frontend";
import type { TestCaseDisplay } from "./test-case-display";
import type { CanvasElement } from "./canvas-element";

export function createRegularDisplay(canvasEl: CanvasElement): TestCaseDisplay{
    function displayTestCase(testCase: TestCase): void{
        canvasEl.reset();
        const ctx = canvasEl.el.getContext('2d') as CanvasRenderingContext2D;
        const distortion = testCase.distortion;
        if(distortion){
            canvasEl.applyDistortion(distortion)
        }
        if(isInfiniteTestCase(testCase)){
            testCase.finiteCode(ctx);
        }else{
            testCase.code(ctx);
        }
    }
    return { displayTestCase }
}