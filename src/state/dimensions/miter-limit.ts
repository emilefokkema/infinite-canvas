import { Instruction } from "../../instructions/instruction";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class MiterLimit extends InfiniteCanvasStateInstanceDimension<'miterLimit'>{
    protected valuesAreEqual(oldValue: number, newValue: number): boolean {
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: number, rectangle: CanvasRectangle): Instruction {
        return (ctx) => ctx.miterLimit = newValue;
    }
}

export const miterLimit: TypedStateInstanceDimension<number> = new MiterLimit('miterLimit')