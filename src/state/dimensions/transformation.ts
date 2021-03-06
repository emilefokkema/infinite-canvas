import { Transformation } from "../../transformation";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { Instruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";

class TransformationDimension extends InfiniteCanvasStateInstanceDimension<"transformation">{
    protected valuesAreEqual(oldValue: Transformation, newValue: Transformation): boolean{
        return oldValue.equals(newValue);
    }
    protected changeToNewValue(newValue: Transformation, rectangle: CanvasRectangle): Instruction{
        return rectangle.getTransformationInstruction(newValue);
    }
}
export const transformation: TypedStateInstanceDimension<Transformation> = new TransformationDimension("transformation");