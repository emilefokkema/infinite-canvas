import { InfiniteCanvasStateInstance } from "../infinite-canvas-state-instance";
import { Instruction } from "../../instructions/instruction";
export interface StateInstanceDimension {
    isEqualForInstances(one: InfiniteCanvasStateInstance, other: InfiniteCanvasStateInstance): boolean;
    getInstructionToChange(fromInstance: InfiniteCanvasStateInstance, toInstance: InfiniteCanvasStateInstance): Instruction;
    valueIsTransformableForInstance(instance: InfiniteCanvasStateInstance): boolean;
}
