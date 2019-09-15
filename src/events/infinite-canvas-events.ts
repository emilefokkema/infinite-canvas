import { ViewBox } from "../viewbox";
import { mapMouseEvents } from "./map-mouse-events";
import { Transformer } from "../transformer/transformer";
import { AnchorSet } from "./anchor-set";
import { mapTouchEvents } from "./map-touch-events";
import { mapWheelEvents } from "./map-wheel-events";
import { Point } from "../point";

export class InfiniteCanvasEvents{
    private anchorSet: AnchorSet;
    constructor(canvasElement: HTMLCanvasElement, viewbox: ViewBox, transformer: Transformer){
        this.anchorSet = new AnchorSet();
        function getRelativePosition(clientX: number, clientY: number): Point{
            const rect: ClientRect = canvasElement.getBoundingClientRect();
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }
        mapWheelEvents(canvasElement, transformer, this.anchorSet, getRelativePosition);
        mapMouseEvents(canvasElement, transformer, this.anchorSet);
        mapTouchEvents(canvasElement, transformer, this.anchorSet, getRelativePosition);
    }
}