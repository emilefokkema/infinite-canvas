import { InfiniteCanvasViewboxInfinity } from "./infinite-canvas-viewbox-infinity";
import { DrawnPathProperties } from "./interfaces/drawn-path-properties";
import { PathInfinityProvider } from "./interfaces/path-infinity-provider";
import { ViewboxInfinity } from "./interfaces/viewbox-infinity";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";

export class InfiniteCanvasPathInfinityProvider implements PathInfinityProvider{
    constructor(
        private readonly drawnPathProperties: DrawnPathProperties){
    }
    public getInfinity(state: InfiniteCanvasState): ViewboxInfinity{
        return new InfiniteCanvasViewboxInfinity(state, this.drawnPathProperties);
    }
}