import { InfiniteCanvasFillStrokeStyle } from "./infinite-canvas-fill-stroke-style";
import { Instruction } from "../instructions/instruction";

export class InfiniteCanvasPattern extends InfiniteCanvasFillStrokeStyle implements CanvasPattern{
    constructor(private readonly fillStrokeStyle: CanvasPattern){
        super();
    }
    public setTransform(transform?: DOMMatrix2DInit): void {
        this.fillStrokeStyle.setTransform(transform);
    }
    public getInstructionToSetUntransformed(propName: "fillStyle" | "strokeStyle"): Instruction{
        return (context: CanvasRenderingContext2D) => {
            context[propName] = this.fillStrokeStyle;
        };
    }
    public getInstructionToSetTransformed(propName: "fillStyle" | "strokeStyle"): Instruction{
        return (context: CanvasRenderingContext2D) => {
            context[propName] = this.fillStrokeStyle;
        };
    }
}