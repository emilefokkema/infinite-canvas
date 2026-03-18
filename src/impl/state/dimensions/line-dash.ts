import { InfiniteCanvasTransformableStateInstanceDimension } from "./infinite-canvas-transformable-state-instance-dimension";
import { Instruction, MinimalInstruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";

class SetLineDash implements MinimalInstruction {
    constructor(private readonly value: number[]){}

    execute(context: CanvasRenderingContext2D): void {
        context.setLineDash(this.value);
    }
}
class SetTransformedLineDash implements Instruction {
    constructor(private readonly value: number[]){}

    execute(context: CanvasRenderingContext2D, rectangle: CanvasRectangle): void {
        const transformation = rectangle.userTransformation;
        context.setLineDash(this.value.map(d => d * transformation.scale));
    }
}

class LineDash extends InfiniteCanvasTransformableStateInstanceDimension<"lineDash">{
    protected valuesAreEqual(oldValue: number[], newValue: number[]): boolean{
        if(oldValue.length !== newValue.length){
            return false;
        }
        for(let i=0; i<oldValue.length;i++){
            if(oldValue[i] !== newValue[i]){
                return false;
            }
        }
        return true;
    }
    protected changeToNewValueTransformed(newValue: number[]): Instruction{
        return new SetTransformedLineDash(newValue);
    }
    protected changeToNewValueUntransformed(newValue: number[]): Instruction{
        return new SetLineDash(newValue)
    }
    protected valuesAreEqualWhenTransformed(oldValue: number[], newValue: number[]): boolean{
        return oldValue.length === 0 && newValue.length === 0;
    }
}
export const lineDash: TypedStateInstanceDimension<number[]> = new LineDash("lineDash");
