import type { TestCase } from "test-case";
import InfiniteCanvas from "infinite-canvas";
import type { TestCaseDisplay } from "./test-case-display";
import type { CanvasElement } from "./canvas-element";

export function createInfiniteDisplay(canvasEl: CanvasElement): TestCaseDisplay{
    function displayTestCase(testCase: TestCase): void{
        canvasEl.reset();
        if(testCase.distortion){
            canvasEl.applyDistortion(testCase.distortion);
        }
        const infCanvas = new InfiniteCanvas(canvasEl.el);
        const ctx = infCanvas.getContext('2d');
        testCase.code(ctx);
    }
    return { displayTestCase }
}