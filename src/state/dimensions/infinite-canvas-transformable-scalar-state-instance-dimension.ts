import { InfiniteCanvasTransformableStateInstanceDimension } from "./infinite-canvas-transformable-state-instance-dimension";
import { Instruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";

declare type TransformableScalarPropertyName = "lineWidth" | "lineDashOffset" | "shadowBlur";
export class InfiniteCanvasTransformableScalarStateInstanceDimension extends InfiniteCanvasTransformableStateInstanceDimension<TransformableScalarPropertyName>{
    constructor(propertyName: TransformableScalarPropertyName){
        super(propertyName);
    }
    protected valuesAreEqual(oldValue: number, newValue: number): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValueTransformed(newValue: number): Instruction{
        return (context: CanvasRenderingContext2D, rectangle: CanvasRectangle) => {
            const transformation = rectangle.userTransformation;
            context[this.propertyName] = newValue * transformation.scale;
        };
    }
    protected changeToNewValueUntransformed(newValue: number): Instruction{
        return (context: CanvasRenderingContext2D) => {
            context[this.propertyName] = newValue;
        };
    }
    protected valuesAreEqualWhenTransformed(oldValue: number, newValue: number): boolean{
        return oldValue === 0 && newValue === 0;
    }
}
export const lineWidth: TypedStateInstanceDimension<number> = new InfiniteCanvasTransformableScalarStateInstanceDimension("lineWidth");
export const lineDashOffset: TypedStateInstanceDimension<number> = new InfiniteCanvasTransformableScalarStateInstanceDimension("lineDashOffset");