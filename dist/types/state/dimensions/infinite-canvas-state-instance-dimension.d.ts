import { StateInstanceProperties } from "../state-instance-properties";
import { TypedStateInstanceDimension } from "./typed-state-instance-dimension";
import { InfiniteCanvasStateInstance } from "../infinite-canvas-state-instance";
import { Instruction } from "../../instructions/instruction";
export declare abstract class InfiniteCanvasStateInstanceDimension<K extends keyof StateInstanceProperties> implements TypedStateInstanceDimension<StateInstanceProperties[K]> {
    protected readonly propertyName: K;
    constructor(propertyName: K);
    protected abstract valuesAreEqual(oldValue: StateInstanceProperties[K], newValue: StateInstanceProperties[K]): boolean;
    protected abstract changeToNewValue(newValue: StateInstanceProperties[K]): Instruction;
    changeInstanceValue(instance: InfiniteCanvasStateInstance, newValue: StateInstanceProperties[K]): InfiniteCanvasStateInstance;
    isEqualForInstances(one: InfiniteCanvasStateInstance, other: InfiniteCanvasStateInstance): boolean;
    getInstructionToChange(fromInstance: InfiniteCanvasStateInstance, toInstance: InfiniteCanvasStateInstance): Instruction;
    valueIsTransformableForInstance(instance: InfiniteCanvasStateInstance): boolean;
}
