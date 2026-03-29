import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { SetValue } from "./set-value";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class LineCap extends InfiniteCanvasStateInstanceDimension<'lineCap', MinimalInstruction>{
    protected valuesAreEqual(oldValue: CanvasLineCap, newValue: CanvasLineCap): boolean {
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: CanvasLineCap): MinimalInstruction {
        return new SetValue('lineCap', newValue)
    }
}

export const lineCap: TypedStateInstanceDimension<CanvasLineCap, MinimalInstruction> = new LineCap('lineCap', noopInstruction);