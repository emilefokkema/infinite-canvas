import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { SetValue } from "./set-value";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class GlobalAlpha extends InfiniteCanvasStateInstanceDimension<'globalAlpha', MinimalInstruction>{
    protected valuesAreEqual(oldValue: number, newValue: number): boolean {
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: number): MinimalInstruction {
        return new SetValue('globalAlpha', newValue)
    }
}

export const globalAlpha: TypedStateInstanceDimension<number, MinimalInstruction> = new GlobalAlpha('globalAlpha', noopInstruction);