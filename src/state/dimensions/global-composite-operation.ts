import { Instruction } from "../../instructions/instruction";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class GlobalCompositeOperationDim extends InfiniteCanvasStateInstanceDimension<'globalCompositeOperation'>{
    protected valuesAreEqual(oldValue: GlobalCompositeOperation, newValue: GlobalCompositeOperation): boolean {
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: GlobalCompositeOperation, rectangle: CanvasRectangle): Instruction {
        return (ctx) => ctx.globalCompositeOperation = newValue;
    }
}

export const globalCompositeOperation: TypedStateInstanceDimension<GlobalCompositeOperation> = new GlobalCompositeOperationDim('globalCompositeOperation');