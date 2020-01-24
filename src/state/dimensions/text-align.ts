import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { Instruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class TextAlign extends InfiniteCanvasStateInstanceDimension<"textAlign">{
    protected valuesAreEqual(oldValue: CanvasTextAlign, newValue: CanvasTextAlign): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: CanvasTextAlign): Instruction{
        return (context: CanvasRenderingContext2D) => {context.textAlign = newValue;};
    }
}
export const textAlign: TypedStateInstanceDimension<CanvasTextAlign> = new TextAlign("textAlign");