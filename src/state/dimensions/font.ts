import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { Instruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class Font extends InfiniteCanvasStateInstanceDimension<"font">{
    protected valuesAreEqual(oldValue: string, newValue: string): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: string): Instruction{
        return (context: CanvasRenderingContext2D) => {context.font = newValue;};
    }
}
export const font: TypedStateInstanceDimension<string> = new Font("font");