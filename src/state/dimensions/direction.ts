import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { Instruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class Direction extends InfiniteCanvasStateInstanceDimension<"direction">{
    protected valuesAreEqual(oldValue: CanvasDirection, newValue: CanvasDirection): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: CanvasDirection): Instruction{
        return (context: CanvasRenderingContext2D) => {context.direction = newValue;};
    }
}
export const direction: TypedStateInstanceDimension<CanvasDirection> = new Direction("direction");