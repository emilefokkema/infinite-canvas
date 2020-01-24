import { StateInstanceProperties } from "../state-instance-properties";
import { Instruction } from "../../instructions/instruction";
import { InfiniteCanvasStateInstance } from "../infinite-canvas-state-instance";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";

export abstract class InfiniteCanvasTransformableStateInstanceDimension<K extends keyof StateInstanceProperties> implements TypedStateInstanceDimension<StateInstanceProperties[K]>{
    constructor(private readonly propertyName: K){}
    protected abstract changeToNewValueTransformed(newValue: StateInstanceProperties[K]): Instruction;
    protected abstract changeToNewValueUntransformed(newValue: StateInstanceProperties[K]): Instruction;
    protected abstract valuesAreEqual(oldValue: StateInstanceProperties[K], newValue: StateInstanceProperties[K]): boolean;
    protected abstract valuesAreEqualWhenTransformed(oldValue: StateInstanceProperties[K], newValue: StateInstanceProperties[K]): boolean;
    public changeInstanceValue(instance: InfiniteCanvasStateInstance, newValue: StateInstanceProperties[K]): InfiniteCanvasStateInstance {
        if(this.valuesAreEqual(instance[this.propertyName], newValue)){
            return instance;
        }
        return instance.changeProperty(this.propertyName, newValue);
    }
    public isEqualForInstances(one: InfiniteCanvasStateInstance, other: InfiniteCanvasStateInstance): boolean{
        return this.valuesAreEqual(one[this.propertyName], other[this.propertyName]);
    }
    public valueIsTransformableForInstance(instance: InfiniteCanvasStateInstance): boolean{
        return true;
    }
    private changeToNewValue(newValue: StateInstanceProperties[K], transformed: boolean): Instruction{
        return transformed ? this.changeToNewValueTransformed(newValue) : this.changeToNewValueUntransformed(newValue);
    }
    public getInstructionToChange(fromInstance: InfiniteCanvasStateInstance, toInstance: InfiniteCanvasStateInstance): Instruction{
        const oldValue: StateInstanceProperties[K] = fromInstance[this.propertyName];
        const newValue: StateInstanceProperties[K] = toInstance[this.propertyName];
        if(this.valuesAreEqual(oldValue, newValue) && (fromInstance.fillAndStrokeStylesTransformed === toInstance.fillAndStrokeStylesTransformed || this.valuesAreEqualWhenTransformed(oldValue, newValue))){
            return () => {};
        }
        return this.changeToNewValue(newValue, toInstance.fillAndStrokeStylesTransformed);
    }
}