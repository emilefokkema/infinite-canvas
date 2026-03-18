import { Transformation } from "../../transformation";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { Instruction, noopInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";

class SetTransformation implements Instruction {
    constructor(private readonly transformation: Transformation){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void {
        const {a, b, c, d, e, f} = rectangle.getTransformationForInstruction(this.transformation);
        context.setTransform(a, b, c, d, e, f)
    }
}
class TransformationDimension extends InfiniteCanvasStateInstanceDimension<"transformation">{
    protected valuesAreEqual(oldValue: Transformation, newValue: Transformation): boolean{
        return oldValue.equals(newValue);
    }
    protected changeToNewValue(newValue: Transformation): Instruction{
        return new SetTransformation(newValue);
    }
}
export const transformation: TypedStateInstanceDimension<Transformation> = new TransformationDimension("transformation", noopInstruction);