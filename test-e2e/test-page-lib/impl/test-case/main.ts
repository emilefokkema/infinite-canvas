import InfiniteCanvas from 'infinite-canvas'
import type { InfiniteCanvasRenderingContext2D } from 'infinite-canvas-api';
import './index.css'

interface TestCase{
    code: (ctx: InfiniteCanvasRenderingContext2D) => void
    distortion?: {
        screenWidth: string
        screenHeight: string
        viewboxWidth: number,
        viewboxHeight: number
    }
}

async function drawTestCase(testCaseFile: string): Promise<void>{
    const path = `/test-cases/${testCaseFile}`;
    const {default: testCase}: {default: TestCase} = await import(path)
    const canvasEl = document.getElementById('canvas') as HTMLCanvasElement;
    if(testCase.distortion){
        const {screenWidth, screenHeight, viewboxWidth, viewboxHeight} = testCase.distortion;
        canvasEl.width = viewboxWidth;
        canvasEl.height = viewboxHeight;
        canvasEl.style.width = screenWidth;
        canvasEl.style.height = screenHeight;
    }else{
        const {width, height} = canvasEl.getBoundingClientRect();
        canvasEl.width = width;
        canvasEl.height = height;
    }
    
    const infCanvas = new InfiniteCanvas(canvasEl);
    const ctx = infCanvas.getContext('2d');
    await new Promise<void>((res) => {
        infCanvas.addEventListener('draw', () => res());
        testCase.code(ctx);
    })
}

window.TestCaseLib = {
    drawTestCase
};