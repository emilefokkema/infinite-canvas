import type { TestCase } from "test-case";
import { isInfiniteTestCase } from "../../../../test-cases/frontend";
import type { TestCaseDisplay } from "./test-case-display";
import type { CanvasElement } from "./canvas-element";

export function createRegularDisplay(canvasEl: CanvasElement): TestCaseDisplay{
    function displayTestCase(testCase: TestCase): void{
        canvasEl.reset();
        const distortion = testCase.distortion;
        if(distortion){
            canvasEl.applyDistortion(distortion)
        }
        if(isInfiniteTestCase(testCase)){
            testCase.finiteCode(canvasEl.ctx);
        }else{
            testCase.code(canvasEl.ctx);
        }
    }
    return { displayTestCase }
}