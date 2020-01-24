import { InfiniteCanvasFillStrokeStyle } from "../../infinite-canvas-fill-stroke-style";
import { Instruction } from "../../instructions/instruction";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { InfiniteCanvasStateInstance } from "../infinite-canvas-state-instance";
import { InfiniteCanvasPattern } from "../../infinite-canvas-pattern";

class FillStrokeStyle<K extends "fillStyle" | "strokeStyle"> implements TypedStateInstanceDimension<string | CanvasGradient | CanvasPattern>{
    constructor(private readonly propName: K){}
    public changeInstanceValue(instance: InfiniteCanvasStateInstance, newValue: string | CanvasGradient | CanvasPattern): InfiniteCanvasStateInstance{
        return instance.changeProperty(this.propName, newValue);
    }
    public isEqualForInstances(one: InfiniteCanvasStateInstance, other: InfiniteCanvasStateInstance): boolean{
        return one[this.propName] === other[this.propName];
    }
    public getInstructionToChange(fromInstance: InfiniteCanvasStateInstance, toInstance: InfiniteCanvasStateInstance): Instruction{
        const newValue: string | CanvasGradient | CanvasPattern = toInstance[this.propName];
        if(this.isEqualForInstances(fromInstance, toInstance)){
            if(!(newValue instanceof InfiniteCanvasFillStrokeStyle) || fromInstance.fillAndStrokeStylesTransformed === toInstance.fillAndStrokeStylesTransformed){
                return () => {};
            }
            return toInstance.fillAndStrokeStylesTransformed ? newValue.getInstructionToSetTransformed(this.propName) : newValue.getInstructionToSetUntransformed(this.propName);
        }
        if(newValue instanceof InfiniteCanvasFillStrokeStyle){
            return toInstance.fillAndStrokeStylesTransformed ? newValue.getInstructionToSetTransformed(this.propName) : newValue.getInstructionToSetUntransformed(this.propName);
        }
        

        return (context: CanvasRenderingContext2D) => {context[this.propName] = toInstance[this.propName];};
    }
    public valueIsTransformableForInstance(instance: InfiniteCanvasStateInstance): boolean{
        return !(instance[this.propName] instanceof InfiniteCanvasPattern);
    }
}
export const fillStyle = new FillStrokeStyle("fillStyle");
export const strokeStyle = new FillStrokeStyle("strokeStyle");
