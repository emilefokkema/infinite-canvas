import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { SetValue } from "./set-value";

class TextRendering extends InfiniteCanvasStateInstanceDimension<"textRendering", MinimalInstruction>{
    protected valuesAreEqual(oldValue: CanvasTextRendering, newValue: CanvasTextRendering): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: CanvasTextRendering): MinimalInstruction{
        return new SetValue('textRendering', newValue)
    }
}
export const textRendering: TypedStateInstanceDimension<string, MinimalInstruction> = new TextRendering("textRendering", noopInstruction);