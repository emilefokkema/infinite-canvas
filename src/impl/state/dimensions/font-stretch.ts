import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { SetValue } from "./set-value";

class FontStretch extends InfiniteCanvasStateInstanceDimension<"fontStretch", MinimalInstruction>{
    protected valuesAreEqual(oldValue: CanvasFontStretch, newValue: CanvasFontStretch): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: CanvasFontStretch): MinimalInstruction{
        return new SetValue('fontStretch', newValue)
    }
}
export const fontStretch: TypedStateInstanceDimension<CanvasFontStretch, MinimalInstruction> = new FontStretch("fontStretch", noopInstruction);