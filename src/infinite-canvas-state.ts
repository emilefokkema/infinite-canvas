import { Transformation } from "./transformation";
import { DrawingInstruction } from "./drawing-instruction";

export class InfiniteCanvasState implements DrawingInstruction{
    constructor(
        public readonly lineWidth: number,
        public readonly lineDashOffset: number,
        public readonly lineDash: number[],
        public readonly fillStyle: string | CanvasGradient | CanvasPattern,
        public readonly strokeStyle: string | CanvasGradient | CanvasPattern
    ){

    }
    public apply(context: CanvasRenderingContext2D, transformation: Transformation): void{
        context.lineWidth = this.lineWidth * transformation.scale;
        context.lineDashOffset = this.lineDashOffset * transformation.scale;
        context.setLineDash(this.lineDash.map(s => s * transformation.scale));
        context.fillStyle = this.fillStyle;
        context.strokeStyle = this.strokeStyle;
    }
    public setLineWidth(lineWidth: number): InfiniteCanvasState{
        return new InfiniteCanvasState(
            lineWidth,
            this.lineDashOffset,
            this.lineDash,
            this.fillStyle,
            this.strokeStyle
        );
    }
    public setLineDashOffset(lineDashOffset: number): InfiniteCanvasState{
        return new InfiniteCanvasState(
            this.lineWidth,
            lineDashOffset,
            this.lineDash,
            this.fillStyle,
            this.strokeStyle
        );
    }
    public setLineDash(lineDash: number[]): InfiniteCanvasState{
        return new InfiniteCanvasState(
            this.lineWidth,
            this.lineDashOffset,
            lineDash,
            this.fillStyle,
            this.strokeStyle
        );
    }
    public setFillStyle(fillStyle: string | CanvasGradient | CanvasPattern): InfiniteCanvasState{
        return new InfiniteCanvasState(
            this.lineWidth,
            this.lineDashOffset,
            this.lineDash,
            fillStyle,
            this.strokeStyle
        );
    }
    public setStrokeStyle(strokeStyle: string | CanvasGradient | CanvasPattern): InfiniteCanvasState{
        return new InfiniteCanvasState(
            this.lineWidth,
            this.lineDashOffset,
            this.lineDash,
            this.fillStyle,
            strokeStyle
        );
    }
    public static default(): InfiniteCanvasState{
        return new InfiniteCanvasState(
            1,
            0,
            [],
            "#000",
            "#000"
        );
    }
}