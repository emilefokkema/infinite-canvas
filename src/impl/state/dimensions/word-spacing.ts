import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { SetValue } from "./set-value";

class WordSpacing extends InfiniteCanvasStateInstanceDimension<"wordSpacing", MinimalInstruction>{
    protected valuesAreEqual(oldValue: string, newValue: string): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: string): MinimalInstruction{
        return new SetValue('wordSpacing', newValue)
    }
}
export const wordSpacing: TypedStateInstanceDimension<string, MinimalInstruction> = new WordSpacing("wordSpacing", noopInstruction);