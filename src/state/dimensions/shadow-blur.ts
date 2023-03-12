import { Point } from "../../geometry/point";
import { Instruction } from "../../instructions/instruction";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { Transformation } from "../../transformation";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class ShadowBlur extends InfiniteCanvasStateInstanceDimension<"shadowBlur">{
    protected changeToNewValue(newValue: number, rectangle: CanvasRectangle): Instruction {
        return (context: CanvasRenderingContext2D) => {
            const translation = Transformation.translation(newValue, 0);
            const bitmapTranslation = rectangle.translateInfiniteCanvasContextTransformationToBitmapTransformation(translation);
            const newValueTransformed = bitmapTranslation.apply(Point.origin).mod();
            context.shadowBlur = newValueTransformed;
        }
    }
    protected valuesAreEqual(oldValue: number, newValue: number): boolean {
        return oldValue === newValue;
    }
}

export const shadowBlur: TypedStateInstanceDimension<number> = new ShadowBlur('shadowBlur');