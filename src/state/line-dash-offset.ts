import { StriclyEquatableDimension } from "./strictly-equatable-dimension";
import { Instruction } from "../instruction";
import { SimpleInstruction } from "../simple-instruction";
import { Transformation } from "../transformation";
import { CanvasState } from "../canvas-state";

export class LineDashOffset extends StriclyEquatableDimension<number>{
    public readonly hasScale: boolean;
    constructor(value: number){
        super(value);
        this.hasScale = value !== 0;
    }
    protected getValueFromState(state: CanvasState): number{return state.lineDashOffset;}
    public getInstruction(): Instruction{
        return new SimpleInstruction((context: CanvasRenderingContext2D, transformation: Transformation) => {
            context.lineDashOffset = this.value * transformation.scale;
        });
    }
}