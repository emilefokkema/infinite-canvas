import { Point } from "../../geometry/point";
import { Instruction, noopInstruction } from "../../instructions/instruction";
import { Transformation } from "../../transformation";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";

class SetShadowOffset implements Instruction {
    constructor(private readonly shadowOffset: Point){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void {
        const translation = Transformation.translation(this.shadowOffset.x, this.shadowOffset.y);
        const bitmapTranslation = rectangle.translateInfiniteCanvasContextTransformationToBitmapTransformation(translation);
        const {x: xb, y: yb} = bitmapTranslation.apply(Point.origin);
        context.shadowOffsetX = xb;
        context.shadowOffsetY = yb;
    }
}
class ShadowOffset extends InfiniteCanvasStateInstanceDimension<"shadowOffset">{
    protected changeToNewValue(newValue: Point): Instruction{
        return new SetShadowOffset(newValue)
    }
    protected valuesAreEqual(oldValue: Point, newValue: Point): boolean{
        return oldValue.x === newValue.x && oldValue.y == newValue.y;
    }
}
export const shadowOffset: TypedStateInstanceDimension<Point> = new ShadowOffset("shadowOffset", noopInstruction);