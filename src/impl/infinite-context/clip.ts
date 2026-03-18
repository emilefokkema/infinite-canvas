import { MinimalInstruction } from "../instructions/instruction";

class ClipWithFillRule implements MinimalInstruction {
    constructor(
        private readonly fillRule: CanvasFillRule
    ){}

    execute(context: CanvasRenderingContext2D): void {
        context.clip(this.fillRule);
    }
}
export class Clip implements MinimalInstruction {
    execute(context: CanvasRenderingContext2D): void {
        context.clip();
    }

    static create(fillRule?: CanvasFillRule): MinimalInstruction {
        if(fillRule === undefined){
            return clip;
        }
        return new ClipWithFillRule(fillRule);
    }
}
const clip: MinimalInstruction = new Clip();