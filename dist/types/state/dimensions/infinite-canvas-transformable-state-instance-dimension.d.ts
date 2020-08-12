import { StateInstanceProperties } from "../state-instance-properties";
import { Instruction } from "../../instructions/instruction";
import { InfiniteCanvasStateInstance } from "../infinite-canvas-state-instance";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
export declare abstract class InfiniteCanvasTransformableStateInstanceDimension<K extends keyof StateInstanceProperties> implements TypedStateInstanceDimension<StateInstanceProperties[K]> {
    protected readonly propertyName: K;
    constructor(propertyName: K);
    protected abstract changeToNewValueTransformed(newValue: StateInstanceProperties[K]): Instruction;
    protected abstract changeToNewValueUntransformed(newValue: StateInstanceProperties[K]): Instruction;
    protected abstract valuesAreEqual(oldValue: StateInstanceProperties[K], newValue: StateInstanceProperties[K]): boolean;
    protected abstract valuesAreEqualWhenTransformed(oldValue: StateInstanceProperties[K], newValue: StateInstanceProperties[K]): boolean;
    changeInstanceValue(instance: InfiniteCanvasStateInstance, newValue: StateInstanceProperties[K]): InfiniteCanvasStateInstance;
    isEqualForInstances(one: InfiniteCanvasStateInstance, other: InfiniteCanvasStateInstance): boolean;
    valueIsTransformableForInstance(instance: InfiniteCanvasStateInstance): boolean;
    private changeToNewValue;
    getInstructionToChange(fromInstance: InfiniteCanvasStateInstance, toInstance: InfiniteCanvasStateInstance): Instruction;
}
