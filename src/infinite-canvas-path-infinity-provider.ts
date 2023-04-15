import { InfiniteCanvasViewboxInfinity } from "./infinite-canvas-viewbox-infinity";
import { DrawnStrokeProperties } from "./interfaces/drawn-stroke-properties";
import { PathInfinityProvider } from "./interfaces/path-infinity-provider";
import { ViewboxInfinity } from "./interfaces/viewbox-infinity";
import { CanvasRectangle } from "./rectangle/canvas-rectangle";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";

export class InfiniteCanvasPathInfinityProvider implements PathInfinityProvider{
    constructor(
        private readonly canvasRectangle: CanvasRectangle,
        private readonly drawnStrokeProperties: DrawnStrokeProperties){
    }
    public getInfinity(state: InfiniteCanvasState): ViewboxInfinity{
        return new InfiniteCanvasViewboxInfinity(this.canvasRectangle, state, this.drawnStrokeProperties);
    }
}