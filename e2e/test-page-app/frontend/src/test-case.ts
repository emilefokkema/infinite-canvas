import InfiniteCanvas from 'infinite-canvas'
import type { TestCase } from '../../../../test-cases/frontend/test-case'
import '../test-case-index.css'

console.log('hello from test case')

async function drawTestCase(testCaseId: string): Promise<void>{
    const path = `/test-cases/${testCaseId}.mjs`;
    const {default: testCase}: {default: TestCase} = await import(path);
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

window.TestCasesLib = { drawTestCase }