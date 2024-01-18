import { StateInstanceProperties } from "../state-instance-properties";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { InfiniteCanvasStateInstance } from "../infinite-canvas-state-instance";
import { Instruction } from "../../instructions/instruction";

export abstract class InfiniteCanvasStateInstanceDimension<K extends keyof StateInstanceProperties, TInstruction extends Instruction = Instruction> implements TypedStateInstanceDimension<StateInstanceProperties[K], TInstruction>{
    constructor(protected readonly propertyName: K, private readonly noopInstruction: TInstruction){}
    protected abstract valuesAreEqual(oldValue: StateInstanceProperties[K], newValue: StateInstanceProperties[K]): boolean;
    protected abstract changeToNewValue(newValue: StateInstanceProperties[K]): TInstruction;
    public changeInstanceValue(instance: InfiniteCanvasStateInstance, newValue: StateInstanceProperties[K]): InfiniteCanvasStateInstance {
        if(this.valuesAreEqual(instance[this.propertyName], newValue)){
            return instance;
        }
        return instance.changeProperty(this.propertyName, newValue);
    }
    public isEqualForInstances(one: InfiniteCanvasStateInstance, other: InfiniteCanvasStateInstance): boolean{
        return this.valuesAreEqual(one[this.propertyName], other[this.propertyName]);
    }
    public getInstructionToChange(fromInstance: InfiniteCanvasStateInstance, toInstance: InfiniteCanvasStateInstance): TInstruction{
        if(this.valuesAreEqual(fromInstance[this.propertyName], toInstance[this.propertyName])){
            return this.noopInstruction;
        }
        return this.changeToNewValue(toInstance[this.propertyName]);
    }
    public valueIsTransformableForInstance(instance: InfiniteCanvasStateInstance): boolean{
        return true;
    }
}