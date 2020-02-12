import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { Instruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { Transformation } from "../../transformation";

class ShadowBlur extends InfiniteCanvasStateInstanceDimension<"shadowBlur">{
    protected valuesAreEqual(oldValue: number, newValue: number): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValue(newValue: number): Instruction{
        return (context: CanvasRenderingContext2D, transformation: Transformation) => {context.shadowBlur = newValue * transformation.scale;};
    }
}
export const shadowBlur: TypedStateInstanceDimension<number> = new ShadowBlur("shadowBlur");