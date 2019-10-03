import { Instruction } from "../instruction";
import { CanvasState } from "../canvas-state";
import { Dimension } from "./dimension";
import { LineWidth } from "./line-width";
import { LineDashOffset } from "./line-dash-offset";
import { LineDash } from "./line-dash";
import { FillStyle } from "./fill-style";
import { StrokeStyle } from "./stroke-style";
import { Transformation } from "../transformation";

export class InfiniteCanvasState implements CanvasState{
    private dimensions: Dimension[];
    constructor(
        public readonly lineWidth: number,
        public readonly lineDashOffset: number,
        public readonly lineDash: number[],
        public readonly fillStyle: string | CanvasGradient | CanvasPattern,
        public readonly strokeStyle: string | CanvasGradient | CanvasPattern,
        public readonly transformation: Transformation
    ){
        this.dimensions = [
            new LineWidth(lineWidth),
            new LineDashOffset(lineDashOffset),
            new LineDash(lineDash),
            new FillStyle(fillStyle),
            new StrokeStyle(strokeStyle)
        ];
    }
    public setLineWidth(lineWidth: number): InfiniteCanvasState{
        return new InfiniteCanvasState(
            lineWidth,
            this.lineDashOffset,
            this.lineDash,
            this.fillStyle,
            this.strokeStyle,
            this.transformation
        );
    }
    public setLineDashOffset(lineDashOffset: number): InfiniteCanvasState{
        return new InfiniteCanvasState(
            this.lineWidth,
            lineDashOffset,
            this.lineDash,
            this.fillStyle,
            this.strokeStyle,
            this.transformation
        );
    }
    public setLineDash(lineDash: number[]): InfiniteCanvasState{
        return new InfiniteCanvasState(
            this.lineWidth,
            this.lineDashOffset,
            lineDash,
            this.fillStyle,
            this.strokeStyle,
            this.transformation
        );
    }
    public setFillStyle(fillStyle: string | CanvasGradient | CanvasPattern): InfiniteCanvasState{
        return new InfiniteCanvasState(
            this.lineWidth,
            this.lineDashOffset,
            this.lineDash,
            fillStyle,
            this.strokeStyle,
            this.transformation
        );
    }
    public setStrokeStyle(strokeStyle: string | CanvasGradient | CanvasPattern): InfiniteCanvasState{
        return new InfiniteCanvasState(
            this.lineWidth,
            this.lineDashOffset,
            this.lineDash,
            this.fillStyle,
            strokeStyle,
            this.transformation
        );
    }
    public addTransformation(transformation: Transformation): InfiniteCanvasState{
        return new InfiniteCanvasState(
            this.lineWidth,
            this.lineDashOffset,
            this.lineDash,
            this.fillStyle,
            this.strokeStyle,
            transformation.before(this.transformation)
        );
    }
    public setTransformation(transformation: Transformation): InfiniteCanvasState{
        return new InfiniteCanvasState(
            this.lineWidth,
            this.lineDashOffset,
            this.lineDash,
            this.fillStyle,
            this.strokeStyle,
            transformation
        );
    }
    public getInstructionsComparedTo(predecessor: CanvasState): Instruction[]{
        const instructions: Instruction[] = [];
        for(const dimension of this.dimensions){
            if(!dimension.hasSameValueAs(predecessor)){
                instructions.push(dimension.getInstruction());
            }
        }
        return instructions;
    }
    public getAllInstructions(): Instruction[]{
        const instructions: Instruction[] = [];
        for(const dimension of this.dimensions){
            if(!dimension.hasSameValueAs(InfiniteCanvasState.default) || dimension.hasScale){
                instructions.push(dimension.getInstruction());
            }
        }
        return instructions;
    }
    public static default: InfiniteCanvasState = new InfiniteCanvasState(
        1,
        0,
        [],
        "#000",
        "#000",
        Transformation.identity
    );
}