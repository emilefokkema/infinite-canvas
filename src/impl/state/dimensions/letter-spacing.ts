import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { SetValue } from "./set-value";

class LetterSpacing extends InfiniteCanvasStateInstanceDimension<"letterSpacing", MinimalInstruction>{
    protected valuesAreEqual(oldValue: string, newValue: string): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: string): MinimalInstruction{
        return new SetValue('letterSpacing', newValue)
    }
}
export const letterSpacing: TypedStateInstanceDimension<string, MinimalInstruction> = new LetterSpacing("letterSpacing", noopInstruction);