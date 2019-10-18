import { ViewBox } from "../interfaces/viewbox";
import { mapMouseEvents } from "./map-mouse-events";
import { Transformer } from "../transformer/transformer";
import { AnchorSet } from "./anchor-set";
import { mapTouchEvents } from "./map-touch-events";
import { mapWheelEvents } from "./map-wheel-events";
import { Point } from "../point";
import { InfiniteCanvasConfig } from "../config/infinite-canvas-config";

export class InfiniteCanvasEvents{
    private anchorSet: AnchorSet;
    constructor(canvasElement: HTMLCanvasElement, viewbox: ViewBox, transformer: Transformer, config: InfiniteCanvasConfig){
        this.anchorSet = new AnchorSet();
        function getRelativePosition(clientX: number, clientY: number): Point{
            const rect: ClientRect = canvasElement.getBoundingClientRect();
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }
        mapWheelEvents(canvasElement, transformer, this.anchorSet, getRelativePosition, config);
        mapMouseEvents(canvasElement, transformer, this.anchorSet, getRelativePosition, config);
        mapTouchEvents(canvasElement, transformer, this.anchorSet, getRelativePosition, config);
    }
}