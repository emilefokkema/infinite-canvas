import { InfiniteCanvasState } from "../state/infinite-canvas-state";
import { ViewboxInfinity } from "./viewbox-infinity";

export interface PathInfinityProvider{
    getInfinity(state: InfiniteCanvasState): ViewboxInfinity;
    addDrawnLineWidth(lineWidth: number): void;
    addLineDashPeriod(lineDashPeriod: number): void;
}
