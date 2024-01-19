import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { MinimalInstruction, noopInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class Direction extends InfiniteCanvasStateInstanceDimension<"direction", MinimalInstruction>{
    protected valuesAreEqual(oldValue: CanvasDirection, newValue: CanvasDirection): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: CanvasDirection): MinimalInstruction{
        return (context: CanvasRenderingContext2D) => {context.direction = newValue;};
    }
}
export const direction: TypedStateInstanceDimension<CanvasDirection, MinimalInstruction> = new Direction("direction", noopInstruction);