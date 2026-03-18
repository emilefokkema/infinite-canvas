import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { SetValue } from "./set-value";

class ShadowColor extends InfiniteCanvasStateInstanceDimension<"shadowColor", MinimalInstruction>{
    protected valuesAreEqual(oldValue: string, newValue: string): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: string): MinimalInstruction{
        return new SetValue('shadowColor', newValue)
    }
}
export const shadowColor: TypedStateInstanceDimension<string, MinimalInstruction> = new ShadowColor("shadowColor", noopInstruction);