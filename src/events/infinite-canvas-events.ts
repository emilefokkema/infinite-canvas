import { mapMouseEvents } from "./map-mouse-events";
import { Transformer } from "../transformer/transformer";
import { mapTouchEvents } from "./map-touch-events";
import { mapWheelEvents } from "./map-wheel-events";
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export class InfiniteCanvasEvents{
    constructor(canvasElement: HTMLCanvasElement, transformer: Transformer, config: InfiniteCanvasConfig, rectangle: CanvasRectangle){
        
        mapWheelEvents(canvasElement, transformer, rectangle, config);
        mapMouseEvents(canvasElement, transformer, rectangle, config);
        mapTouchEvents(canvasElement, transformer, rectangle, config);
    }
}