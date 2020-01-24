import { InfiniteCanvasTransformableStateInstanceDimension } from "./infinite-canvas-transformable-state-instance-dimension";
import { Instruction } from "../../instructions/instruction";
import { Transformation } from "../../transformation";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class LineDashOffset extends InfiniteCanvasTransformableStateInstanceDimension<"lineDashOffset">{
    protected valuesAreEqual(oldValue: number, newValue: number): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValueTransformed(newValue: number): Instruction{
        return (context: CanvasRenderingContext2D, transformation: Transformation) => {
            context.lineDashOffset = newValue * transformation.scale;
        };
    }
    protected changeToNewValueUntransformed(newValue: number): Instruction{
        return (context: CanvasRenderingContext2D) => {
            context.lineDashOffset = newValue;
        };
    }
    protected valuesAreEqualWhenTransformed(oldValue: number, newValue: number): boolean{
        return oldValue === 0 && newValue === 0;
    }
}
export const lineDashOffset: TypedStateInstanceDimension<number> = new LineDashOffset("lineDashOffset");