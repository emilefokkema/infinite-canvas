import { Transformation } from "../../transformation";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { Instruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class TransformationDimension extends InfiniteCanvasStateInstanceDimension<"transformation">{
    protected valuesAreEqual(oldValue: Transformation, newValue: Transformation): boolean{
        return oldValue.equals(newValue);
    }
    protected changeToNewValue(newValue: Transformation): Instruction{
        return (context: CanvasRenderingContext2D, transformation: Transformation) => {
            const {a, b, c, d, e, f} = transformation.inverse().before(newValue).before(transformation);
            context.setTransform(a, b, c, d, e, f);
        }
    }
}
export const transformation: TypedStateInstanceDimension<Transformation> = new TransformationDimension("transformation");