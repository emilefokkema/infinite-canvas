import { MinimalInstruction } from "../instructions/instruction";

class FillWithFillRule implements MinimalInstruction {
    constructor(
        private readonly fillRule: CanvasFillRule
    ){}

    execute(context: CanvasRenderingContext2D): void {
        context.fill(this.fillRule);
    }
}
export class Fill implements MinimalInstruction {
    execute(context: CanvasRenderingContext2D): void {
        context.fill();
    }

    static create(fillRule?: CanvasFillRule): MinimalInstruction {
        if(fillRule === undefined){
            return fill;
        }
        return new FillWithFillRule(fillRule);
    }
}
const fill: MinimalInstruction = new Fill();