import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { SetValue } from "./set-value";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class GlobalCompositeOperationDim extends InfiniteCanvasStateInstanceDimension<'globalCompositeOperation', MinimalInstruction>{
    protected valuesAreEqual(oldValue: GlobalCompositeOperation, newValue: GlobalCompositeOperation): boolean {
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: GlobalCompositeOperation): MinimalInstruction {
        return new SetValue('globalCompositeOperation', newValue)
    }
}

export const globalCompositeOperation: TypedStateInstanceDimension<GlobalCompositeOperation, MinimalInstruction> = new GlobalCompositeOperationDim('globalCompositeOperation', noopInstruction);