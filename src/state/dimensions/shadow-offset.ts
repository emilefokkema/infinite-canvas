import { Point } from "../../geometry/point";
import { Instruction, noopInstruction } from "../../instructions/instruction";
import { Transformation } from "../../transformation";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";

class ShadowOffset extends InfiniteCanvasStateInstanceDimension<"shadowOffset">{
    protected changeToNewValue(newValue: Point): Instruction{
        return (context, rectangle) => {
            const translation = Transformation.translation(newValue.x, newValue.y);
            const bitmapTranslation = rectangle.translateInfiniteCanvasContextTransformationToBitmapTransformation(translation);
            const {x: xb, y: yb} = bitmapTranslation.apply(Point.origin);
            context.shadowOffsetX = xb;
            context.shadowOffsetY = yb;
        };
    }
    protected valuesAreEqual(oldValue: Point, newValue: Point): boolean{
        return oldValue.x === newValue.x && oldValue.y == newValue.y;
    }
}
export const shadowOffset: TypedStateInstanceDimension<Point> = new ShadowOffset("shadowOffset", noopInstruction);