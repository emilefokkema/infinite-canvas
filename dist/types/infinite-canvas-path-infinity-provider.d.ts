import { PathInfinityProvider } from "./interfaces/path-infinity-provider";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { ViewboxInfinity } from "./interfaces/viewbox-infinity";
import { CanvasRectangle } from "./rectangle/canvas-rectangle";
export declare class InfiniteCanvasPathInfinityProvider implements PathInfinityProvider {
    private readonly canvasRectangle;
    constructor(canvasRectangle: CanvasRectangle);
    private drawnLineWidth;
    private lineDashPeriod;
    addDrawnLineWidth(lineWidth: number): void;
    addLineDashPeriod(lineDashPeriod: number): void;
    getInfinity(state: InfiniteCanvasState): ViewboxInfinity;
}
