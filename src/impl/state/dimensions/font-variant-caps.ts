import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { SetValue } from "./set-value";

class FontVariantCaps extends InfiniteCanvasStateInstanceDimension<"fontVariantCaps", MinimalInstruction>{
    protected valuesAreEqual(oldValue: CanvasFontVariantCaps, newValue: CanvasFontVariantCaps): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: CanvasFontVariantCaps): MinimalInstruction{
        return new SetValue('fontVariantCaps', newValue)
    }
}
export const fontVariantCaps: TypedStateInstanceDimension<CanvasFontVariantCaps, MinimalInstruction> = new FontVariantCaps("fontVariantCaps", noopInstruction);