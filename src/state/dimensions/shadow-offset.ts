import { Point } from "../../geometry/point";
import { Instruction } from "../../instructions/instruction";
import { Transformation } from "../../transformation";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";

class ShadowOffset extends InfiniteCanvasStateInstanceDimension<"shadowOffset">{
    protected changeToNewValue(newValue: Point, rectangle: CanvasRectangle): Instruction{
        return (context: CanvasRenderingContext2D) => {
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
    protected valuesAreEqualWhenTransformed(oldValue: Point, newValue: Point): boolean{
        return oldValue.x === 0 && oldValue.y === 0 && newValue.x === 0 && newValue.y === 0;
    }
}
export const shadowOffset: TypedStateInstanceDimension<Point> = new ShadowOffset("shadowOffset");