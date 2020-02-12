import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { Instruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class TextBaseline extends InfiniteCanvasStateInstanceDimension<"textBaseline">{
    protected valuesAreEqual(oldValue: CanvasTextBaseline, newValue: CanvasTextBaseline): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: CanvasTextBaseline): Instruction{
        return (context: CanvasRenderingContext2D) => {context.textBaseline = newValue;};
    }
}
export const textBaseline: TypedStateInstanceDimension<CanvasTextBaseline> = new TextBaseline("textBaseline");