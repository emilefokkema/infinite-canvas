import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { SetValue } from "./set-value";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class MiterLimit extends InfiniteCanvasStateInstanceDimension<'miterLimit', MinimalInstruction>{
    protected valuesAreEqual(oldValue: number, newValue: number): boolean {
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: number): MinimalInstruction {
        return new SetValue('miterLimit', newValue)
    }
}

export const miterLimit: TypedStateInstanceDimension<number, MinimalInstruction> = new MiterLimit('miterLimit', noopInstruction)