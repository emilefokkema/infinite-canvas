import { StateInstanceProperties } from "../state-instance-properties";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { InfiniteCanvasStateInstance } from "../infinite-canvas-state-instance";
import { Instruction } from "../../instructions/instruction";
import { CanvasRectangle } from "../../rectangle/canvas-rectangle";

export abstract class InfiniteCanvasStateInstanceDimension<K extends keyof StateInstanceProperties> implements TypedStateInstanceDimension<StateInstanceProperties[K]>{
    constructor(protected readonly propertyName: K){}
    protected abstract valuesAreEqual(oldValue: StateInstanceProperties[K], newValue: StateInstanceProperties[K]): boolean;
    protected abstract changeToNewValue(newValue: StateInstanceProperties[K], rectangle: CanvasRectangle): Instruction;
    public changeInstanceValue(instance: InfiniteCanvasStateInstance, newValue: StateInstanceProperties[K]): InfiniteCanvasStateInstance {
        if(this.valuesAreEqual(instance[this.propertyName], newValue)){
            return instance;
        }
        return instance.changeProperty(this.propertyName, newValue);
    }
    public isEqualForInstances(one: InfiniteCanvasStateInstance, other: InfiniteCanvasStateInstance): boolean{
        return this.valuesAreEqual(one[this.propertyName], other[this.propertyName]);
    }
    public getInstructionToChange(fromInstance: InfiniteCanvasStateInstance, toInstance: InfiniteCanvasStateInstance, rectangle: CanvasRectangle): Instruction{
        if(this.valuesAreEqual(fromInstance[this.propertyName], toInstance[this.propertyName])){
            return () => {};
        }
        return this.changeToNewValue(toInstance[this.propertyName], rectangle);
    }
    public valueIsTransformableForInstance(instance: InfiniteCanvasStateInstance): boolean{
        return true;
    }
}