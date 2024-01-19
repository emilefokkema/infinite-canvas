import { Transformation } from "../../transformation";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { Instruction, noopInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class TransformationDimension extends InfiniteCanvasStateInstanceDimension<"transformation">{
    protected valuesAreEqual(oldValue: Transformation, newValue: Transformation): boolean{
        return oldValue.equals(newValue);
    }
    protected changeToNewValue(newValue: Transformation): Instruction{
        return (ctx, rectangle) => {
            const {a, b, c, d, e, f} = rectangle.getTransformationForInstruction(newValue);
            ctx.setTransform(a, b, c, d, e, f)
        }
    }
}
export const transformation: TypedStateInstanceDimension<Transformation> = new TransformationDimension("transformation", noopInstruction);