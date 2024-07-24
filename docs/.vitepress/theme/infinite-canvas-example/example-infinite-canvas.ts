import InfiniteCanvas, { Units } from 'infinite-canvas'
import { messages } from './constants';

export default class ExampleInfiniteCanvas extends InfiniteCanvas{
    constructor(canvasEl: HTMLCanvasElement){
        super(canvasEl, {units: Units.CSS})
        const { width, height } = canvasEl.getBoundingClientRect();
        canvasEl.width = width * devicePixelRatio;
        canvasEl.height = height * devicePixelRatio;
        this.addEventListener('wheelignored', (e) => {
            e.preventDefault();
            messages.sendToParent('wheelignored', {})
        })
        this.addEventListener('touchignored', (e) => {
            e.preventDefault();
            messages.sendToParent('touchignored', {})
        })
    }
}
export { Units }