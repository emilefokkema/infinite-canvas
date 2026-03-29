import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { SetValue } from "./set-value";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class LineJoin extends InfiniteCanvasStateInstanceDimension<'lineJoin', MinimalInstruction>{
    protected valuesAreEqual(oldValue: CanvasLineJoin, newValue: CanvasLineJoin): boolean {
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: CanvasLineJoin): MinimalInstruction {
        return new SetValue('lineJoin', newValue)
    }
}

export const lineJoin: TypedStateInstanceDimension<CanvasLineJoin, MinimalInstruction> = new LineJoin('lineJoin', noopInstruction)