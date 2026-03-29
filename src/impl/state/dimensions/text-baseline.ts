import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { SetValue } from "./set-value";

class TextBaseline extends InfiniteCanvasStateInstanceDimension<"textBaseline", MinimalInstruction>{
    protected valuesAreEqual(oldValue: CanvasTextBaseline, newValue: CanvasTextBaseline): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: CanvasTextBaseline): MinimalInstruction{
        return new SetValue('textBaseline', newValue)
    }
}
export const textBaseline: TypedStateInstanceDimension<CanvasTextBaseline, MinimalInstruction> = new TextBaseline("textBaseline", noopInstruction);