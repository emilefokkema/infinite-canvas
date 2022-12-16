import { mapMouseEvents } from "./map-mouse-events";
import { Transformer } from "../transformer/transformer";
import { mapTouchEvents } from "./map-touch-events";
import { mapWheelEvents } from "./map-wheel-events";
import { Config } from "../api-surface/config";
import { CanvasRectangle } from "../rectangle/canvas-rectangle";

export class InfiniteCanvasEvents{
    constructor(canvasElement: HTMLCanvasElement, transformer: Transformer, config: Config, rectangle: CanvasRectangle){
        
        mapWheelEvents(canvasElement, transformer, rectangle, config);
        mapMouseEvents(canvasElement, transformer, rectangle, config);
        mapTouchEvents(canvasElement, transformer, rectangle, config);
    }
}