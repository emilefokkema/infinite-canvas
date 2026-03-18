import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { SetValue } from "./set-value";

class TextAlign extends InfiniteCanvasStateInstanceDimension<"textAlign", MinimalInstruction>{
    protected valuesAreEqual(oldValue: CanvasTextAlign, newValue: CanvasTextAlign): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: CanvasTextAlign): MinimalInstruction{
        return new SetValue('textAlign', newValue)
    }
}
export const textAlign: TypedStateInstanceDimension<CanvasTextAlign, MinimalInstruction> = new TextAlign("textAlign", noopInstruction);