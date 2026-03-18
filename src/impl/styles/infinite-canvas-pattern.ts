import { InfiniteCanvasFillStrokeStyle } from "./infinite-canvas-fill-stroke-style";
import { Instruction } from "../instructions/instruction";
import { SetValue } from "../state/dimensions/set-value";

export class InfiniteCanvasPattern extends InfiniteCanvasFillStrokeStyle implements CanvasPattern{
    constructor(private readonly fillStrokeStyle: CanvasPattern){
        super();
    }
    public setTransform(transform?: DOMMatrix2DInit): void {
        this.fillStrokeStyle.setTransform(transform);
    }
    public getInstructionToSetUntransformed(propName: "fillStyle" | "strokeStyle"): Instruction{
        return new SetValue(propName, this.fillStrokeStyle);
    }
    public getInstructionToSetTransformed(propName: "fillStyle" | "strokeStyle"): Instruction{
        return new SetValue(propName, this.fillStrokeStyle);
    }
}