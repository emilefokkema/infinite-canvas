import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class FontKerning extends InfiniteCanvasStateInstanceDimension<'fontKerning', MinimalInstruction>{
    protected valuesAreEqual(oldValue: CanvasFontKerning, newValue: CanvasFontKerning): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: CanvasFontKerning): MinimalInstruction{
        return (ctx) => ctx.fontKerning = newValue;
    }
}

export const fontKerning: TypedStateInstanceDimension<CanvasFontKerning, MinimalInstruction> = new FontKerning('fontKerning', noopInstruction)