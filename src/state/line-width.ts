import { StriclyEquatableDimension } from "./strictly-equatable-dimension";
import { Instruction } from "../instruction";
import { SimpleInstruction } from "../simple-instruction";
import { Transformation } from "../transformation";
import { CanvasState } from "../canvas-state";

export class LineWidth extends StriclyEquatableDimension<number>{
    constructor(value: number){
        super(value);
    }
    protected getValueFromState(state: CanvasState): number{return state.lineWidth;}
    public getInstruction(): Instruction{
        return new SimpleInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
            context.lineWidth = this.value * transformation.scale;
        });
    }
}