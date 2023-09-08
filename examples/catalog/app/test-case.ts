import testCases from 'virtual:test-cases-list'
import { isInfiniteTestCase, type TestCase, type TestCaseDistortion } from './test-cases';
import {default as InfiniteCanvas, type InfiniteCanvasRenderingContext2D} from 'infinite-canvas';
import './test-case.css';

class CanvasElementContainer<TCanvasContext extends CanvasRenderingContext2D>{
    private canvasEl: HTMLCanvasElement | null = null;
    constructor(
        private readonly element: HTMLDivElement,
        private readonly getContext: (canvasEl: HTMLCanvasElement) => TCanvasContext
    ){}
    public prepareCanvas(distortion?: TestCaseDistortion): void{
        this.element.innerHTML = '';
        const canvasEl = document.createElement('canvas');
        this.canvasEl = canvasEl;
        this.element.appendChild(canvasEl);
        if(distortion){
            canvasEl.style.width = distortion.screenWidth;
            canvasEl.style.height = distortion.screenHeight;
            canvasEl.width = distortion.viewboxWidth;
            canvasEl.height = distortion.viewboxHeight;
        }else{
            canvasEl.width = 400 * devicePixelRatio;
            canvasEl.height = 400 * devicePixelRatio;
        }
    }
    public execute(code: (ctx: TCanvasContext) => void): void{
        if(!this.canvasEl){
            return;
        }
        const ctx = this.getContext(this.canvasEl);
        try{
            code(ctx);
        }catch(e){
            console.error(e)
        }
    }
}

const regularCanvasElContainer = new CanvasElementContainer<CanvasRenderingContext2D>(
    document.getElementById('regular') as HTMLDivElement,
    (canvasEl) => canvasEl.getContext('2d') as CanvasRenderingContext2D);
const infiniteCanvasElContainer = new CanvasElementContainer<InfiniteCanvasRenderingContext2D>(
    document.getElementById('infinite') as HTMLDivElement,
    (canvasEl) => new InfiniteCanvas(canvasEl, { greedyGestureHandling: true}).getContext('2d'));

async function displayTestCase(): Promise<void>{
    const match = window.location.hash.match(/^#\/(.*)$/)
    if(!match){
        return;
    }
    const id = match[1];
    const testCase = testCases.find(c => c.id === id) as TestCase;

    regularCanvasElContainer.prepareCanvas(testCase.distortion);
    infiniteCanvasElContainer.prepareCanvas(testCase.distortion);

    if(isInfiniteTestCase(testCase)){
        regularCanvasElContainer.execute(testCase.finiteCode);
        infiniteCanvasElContainer.execute(testCase.code);
    }else{
        regularCanvasElContainer.execute(testCase.code);
        infiniteCanvasElContainer.execute(testCase.code);
    }
}

window.addEventListener('hashchange', () => {
    displayTestCase();
})

displayTestCase();