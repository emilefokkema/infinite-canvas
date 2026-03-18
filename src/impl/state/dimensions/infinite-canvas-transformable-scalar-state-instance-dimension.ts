import { InfiniteCanvasTransformableStateInstanceDimension } from "./infinite-canvas-transformable-state-instance-dimension";
import { Instruction, MinimalInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";

type TransformableScalarPropertyName = "lineWidth" | "lineDashOffset" | "shadowBlur";

class ChangeToNewValueTransformed implements Instruction {
    constructor(private readonly propertyName: TransformableScalarPropertyName, private readonly value: number){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void {
        const transformation = rectangle.userTransformation;
        context[this.propertyName] = this.value * transformation.scale;
    }
}

class ChangeToNewValueUntransformed implements MinimalInstruction {
    constructor(private readonly propertyName: TransformableScalarPropertyName, private readonly value: number){}

    execute(context: CanvasRenderingContext2D): void {
        context[this.propertyName] = this.value;
    }
}

export class InfiniteCanvasTransformableScalarStateInstanceDimension extends InfiniteCanvasTransformableStateInstanceDimension<TransformableScalarPropertyName>{
    constructor(propertyName: TransformableScalarPropertyName){
        super(propertyName);
    }
    protected valuesAreEqual(oldValue: number, newValue: number): boolean{
        return oldValue === newValue;
    }
    protected changeToNewValueTransformed(newValue: number): Instruction{
        return new ChangeToNewValueTransformed(this.propertyName, newValue);
    }
    protected changeToNewValueUntransformed(newValue: number): Instruction{
        return new ChangeToNewValueUntransformed(this.propertyName, newValue)
    }
    protected valuesAreEqualWhenTransformed(oldValue: number, newValue: number): boolean{
        return oldValue === 0 && newValue === 0;
    }
}
export const lineWidth: TypedStateInstanceDimension<number> = new InfiniteCanvasTransformableScalarStateInstanceDimension("lineWidth");
export const lineDashOffset: TypedStateInstanceDimension<number> = new InfiniteCanvasTransformableScalarStateInstanceDimension("lineDashOffset");