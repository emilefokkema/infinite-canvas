import { WithFunctionsAsStrings } from "../utils";
import { CanvasElementInitialization } from "../shared/configuration";
import { CanvasElementOnE2eTestPage } from "./interfaces";
import { TestCanvasElement } from './test-canvas-element';

export function initializeCanvas(config: WithFunctionsAsStrings<CanvasElementInitialization>): CanvasElementOnE2eTestPage{
    const {
        styleWidth,
        styleHeight,
        canvasWidth,
        canvasHeight,
        spaceBelowCanvas,
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
    return new TestCanvasElement(canvasEl);
}