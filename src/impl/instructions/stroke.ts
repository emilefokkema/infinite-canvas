import { MinimalInstruction } from "./instruction";


export class Stroke implements MinimalInstruction {
    execute(context: CanvasRenderingContext2D): void {
        context.stroke();
    }

    static create(): Stroke {
        return stroke;
    }
}

const stroke = new Stroke();