import { InfiniteCanvasTransformableStateInstanceDimension } from "./infinite-canvas-transformable-state-instance-dimension";
import { Instruction } from "../../instructions/instruction";
import { Transformation } from "../../transformation";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

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
        return (context: CanvasRenderingContext2D, transformation: Transformation) => {
            context.setLineDash(newValue.map(d => d * transformation.scale));
        };
    }
    protected changeToNewValueUntransformed(newValue: number[]): Instruction{
        return (context: CanvasRenderingContext2D) => {
            context.setLineDash(newValue);
        };
    }
    protected valuesAreEqualWhenTransformed(oldValue: number[], newValue: number[]): boolean{
        return oldValue.length === 0 && newValue.length === 0;
    }
}
export const lineDash: TypedStateInstanceDimension<number[]> = new LineDash("lineDash");