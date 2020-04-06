import { PathInfinityProvider } from "./interfaces/path-infinity-provider";
import { InfiniteCanvasViewboxInfinityProvider } from "./infinite-canvas-viewbox-infinity-provider";
import { Instruction } from "./instructions/instruction";
import { InfiniteCanvasState } from "./state/infinite-canvas-state";
import { ViewboxInfinity } from "./interfaces/viewbox-infinity";
import { Transformation } from "./transformation";
import { ConvexPolygon } from "./areas/polygons/convex-polygon";
import { InfiniteCanvasViewboxInfinity } from "./infinite-canvas-viewbox-infinity";

export class InfiniteCanvasPathInfinityProvider implements PathInfinityProvider{
    constructor(private readonly viewboxInfinityProvider: InfiniteCanvasViewboxInfinityProvider){}
    private drawnLineWidth: number = 0;
    private lineDashPeriod: number = 0;
    public getPathInstructionToGoAroundViewbox(): Instruction{
        const lw: number = this.drawnLineWidth;
        const width: number = this.viewboxInfinityProvider.viewBoxWidth + 2 * lw;
        const height: number = this.viewboxInfinityProvider.viewBoxHeight + 2 * lw;
        return (context: CanvasRenderingContext2D) => {
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.rect(-lw, -lw, width, height);
            context.restore();
        };
    }
    public addDrawnLineWidth(lineWidth: number): void{
        this.drawnLineWidth = lineWidth;
    }
    public addLineDashPeriod(lineDashPeriod: number): void {
        this.lineDashPeriod = lineDashPeriod;
    }

    public getInfinity(state: InfiniteCanvasState): ViewboxInfinity{
        const infiniteContextTransformation: Transformation = state.current.transformation;
        const getTransformedViewbox: () => ConvexPolygon = () => {
            const t: Transformation = infiniteContextTransformation.before(this.viewboxInfinityProvider.viewBoxTransformation)
            return this.viewboxInfinityProvider.viewBoxRectangle.expandByDistance(this.drawnLineWidth * this.viewboxInfinityProvider.viewBoxTransformation.scale).transform(t.inverse());
        };
        return new InfiniteCanvasViewboxInfinity(getTransformedViewbox, () => this.viewboxInfinityProvider.viewBoxTransformation, () => this.lineDashPeriod);
    }
}
