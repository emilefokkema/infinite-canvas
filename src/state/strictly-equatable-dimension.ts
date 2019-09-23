import { Instruction } from "../instruction";
import { Dimension } from "./dimension";
import { CanvasState } from "../canvas-state";

export abstract class StriclyEquatableDimension<T> implements Dimension{
    constructor(protected readonly value: T){

    }
    protected abstract getValueFromState(state: CanvasState): T;
    public hasSameValueAs(other: CanvasState): boolean{
        return this.value === this.getValueFromState(other);
    }
    public abstract getInstruction(): Instruction;
}