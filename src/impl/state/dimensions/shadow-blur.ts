import { Point } from "../../geometry/point";
import { Instruction, noopInstruction } from "../../instructions/instruction";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";
import { Transformation } from "../../transformation";
import { InfiniteCanvasStateInstanceDimension } from "./infinite-canvas-state-instance-dimension";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

class SetShadowBlur implements Instruction {
    constructor(private readonly shadowBlur: number){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void {
        const translation = Transformation.translation(this.shadowBlur, 0);
        const bitmapTranslation = rectangle.translateInfiniteCanvasContextTransformationToBitmapTransformation(translation);
        const newValueTransformed = bitmapTranslation.apply(Point.origin).mod();
        context.shadowBlur = newValueTransformed;
    }
}

class ShadowBlur extends InfiniteCanvasStateInstanceDimension<"shadowBlur">{
    protected changeToNewValue(newValue: number): Instruction {
        return new SetShadowBlur(newValue)
    }
    protected valuesAreEqual(oldValue: number, newValue: number): boolean {
        return oldValue === newValue;
    }
}

export const shadowBlur: TypedStateInstanceDimension<number> = new ShadowBlur('shadowBlur', noopInstruction);