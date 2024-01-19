import { Instruction, noopInstruction } from "../../instructions/instruction";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class LineJoin extends InfiniteCanvasStateInstanceDimension<'lineJoin'>{
    protected valuesAreEqual(oldValue: CanvasLineJoin, newValue: CanvasLineJoin): boolean {
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: CanvasLineJoin): Instruction {
        return (ctx) => ctx.lineJoin = newValue;
    }
}

export const lineJoin: TypedStateInstanceDimension<CanvasLineJoin> = new LineJoin('lineJoin', noopInstruction)