import { Instruction } from "../../instructions/instruction";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class LineCap extends InfiniteCanvasStateInstanceDimension<'lineCap'>{
    protected valuesAreEqual(oldValue: CanvasLineCap, newValue: CanvasLineCap): boolean {
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: CanvasLineCap, rectangle: CanvasRectangle): Instruction {
        return ctx => ctx.lineCap = newValue;
    }
}

export const lineCap: TypedStateInstanceDimension<CanvasLineCap> = new LineCap('lineCap');