import { WithFunctionsAsStrings } from "../utils";
import { InfiniteCanvasE2EInitialization } from "../shared/configuration";
import { InfiniteCanvasOnE2ETestPage } from "./interfaces";
import { InfiniteCanvas as InfiniteCanvasClass } from "../../../../src/infinite-canvas-declaration";
import { TestCanvas } from './test-canvas';

declare const InfiniteCanvas: typeof InfiniteCanvasClass;

export function initializeInfiniteCanvas(config: WithFunctionsAsStrings<InfiniteCanvasE2EInitialization>): InfiniteCanvasOnE2ETestPage{
    const {
        styleWidth,
        styleHeight,
        canvasWidth,
        canvasHeight,
        greedyGestureHandling,
        rotationEnabled,
        units,
        spaceBelowCanvas,
        drawing
    } = config;
    const canvasEl = document.createElement('canvas');
    document.body.appendChild(canvasEl);
    canvasEl.style.width = styleWidth;
    canvasEl.style.height = styleHeight;
    canvasEl.style.position = 'absolute';
    if(typeof canvasWidth === 'number' && typeof canvasHeight === 'number'){
        canvasEl.width = canvasWidth;
        canvasEl.height = canvasHeight;
    }else{
        const {width: rectWidth, height: rectHeight} = canvasEl.getBoundingClientRect();
        canvasEl.width = canvasWidth === 'boundingclientrect' ? rectWidth : canvasWidth;
        canvasEl.height = canvasHeight === 'boundingclientrect' ? rectHeight : canvasHeight;
    }
    if(spaceBelowCanvas !== undefined){
        const belowCanvas = document.createElement('div');
        document.body.appendChild(belowCanvas);
        belowCanvas.style.width = `100px`;
        belowCanvas.style.height = `${spaceBelowCanvas}px`;
    }
    const infCanvas = new InfiniteCanvas(canvasEl);
    if(greedyGestureHandling !== undefined){
        infCanvas.greedyGestureHandling = greedyGestureHandling;
    }
    if(rotationEnabled !== undefined){
        infCanvas.rotationEnabled = rotationEnabled;
    }
    if(units !== undefined){
        infCanvas.units = units === 0 ? InfiniteCanvas.CSS_UNITS : InfiniteCanvas.CANVAS_UNITS;
    }
    const drawingFn = eval(drawing);
    const context = infCanvas.getContext();
    drawingFn(context);
    return new TestCanvas(infCanvas);
}