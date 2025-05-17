import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { Instruction, noopInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class ShadowColor extends InfiniteCanvasStateInstanceDimension<"shadowColor">{
    protected valuesAreEqual(oldValue: string, newValue: string): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: string): Instruction{
        return (context: CanvasRenderingContext2D) => {context.shadowColor = newValue;};
    }
}
export const shadowColor: TypedStateInstanceDimension<string> = new ShadowColor("shadowColor", noopInstruction);