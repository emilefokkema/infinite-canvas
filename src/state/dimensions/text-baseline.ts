import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class TextBaseline extends InfiniteCanvasStateInstanceDimension<"textBaseline", MinimalInstruction>{
    protected valuesAreEqual(oldValue: CanvasTextBaseline, newValue: CanvasTextBaseline): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: CanvasTextBaseline): MinimalInstruction{
        return (context: CanvasRenderingContext2D) => {context.textBaseline = newValue;};
    }
}
export const textBaseline: TypedStateInstanceDimension<CanvasTextBaseline, MinimalInstruction> = new TextBaseline("textBaseline", noopInstruction);