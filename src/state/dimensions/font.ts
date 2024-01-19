import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class Font extends InfiniteCanvasStateInstanceDimension<"font", MinimalInstruction>{
    protected valuesAreEqual(oldValue: string, newValue: string): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: string): MinimalInstruction{
        return (context: CanvasRenderingContext2D) => {context.font = newValue;};
    }
}
export const font: TypedStateInstanceDimension<string, MinimalInstruction> = new Font("font", noopInstruction);