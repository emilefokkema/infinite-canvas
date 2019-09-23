import { StriclyEquatableDimension } from "./strictly-equatable-dimension";
import { Instruction } from "../instruction";
import { SimpleInstruction } from "../simple-instruction";
import { Transformation } from "../transformation";
import { CanvasState } from "../canvas-state";

export class FillStyle extends StriclyEquatableDimension<string | CanvasGradient | CanvasPattern>{
    constructor(value: string | CanvasGradient | CanvasPattern){
        super(value);
    }
    protected getValueFromState(state: CanvasState): string | CanvasGradient | CanvasPattern{return state.fillStyle;}
    public getInstruction(): Instruction{
        return new SimpleInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
            context.fillStyle = this.value;
        });
    }
}