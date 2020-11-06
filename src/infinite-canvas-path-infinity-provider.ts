import { PathInfinityProvider } from "./interfaces/path-infinity-provider";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { ViewboxInfinity } from "./interfaces/viewbox-infinity";
import { InfiniteCanvasViewboxInfinity } from "./infinite-canvas-viewbox-infinity";
import { CanvasRectangle } from "./rectangle/canvas-rectangle";

export class InfiniteCanvasPathInfinityProvider implements PathInfinityProvider{
    constructor(private readonly canvasRectangle: CanvasRectangle){}
    private drawnLineWidth: number = 0;
    private lineDashPeriod: number = 0;

    public addDrawnLineWidth(lineWidth: number): void{
        this.drawnLineWidth = lineWidth;
    }
    public addLineDashPeriod(lineDashPeriod: number): void {
        this.lineDashPeriod = lineDashPeriod;
    }

    public getInfinity(state: InfiniteCanvasState): ViewboxInfinity{
        return new InfiniteCanvasViewboxInfinity(this.canvasRectangle, state, () => this.lineDashPeriod, () => this.drawnLineWidth);
    }
}
