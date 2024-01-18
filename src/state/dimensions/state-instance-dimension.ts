import { InfiniteCanvasStateInstance } from "../infinite-canvas-state-instance";
import { Instruction } from "../../instructions/instruction";

export interface StateInstanceDimension<TInstruction extends Instruction = Instruction>{
    isEqualForInstances(one: InfiniteCanvasStateInstance, other: InfiniteCanvasStateInstance): boolean;
    getInstructionToChange(fromInstance: InfiniteCanvasStateInstance, toInstance: InfiniteCanvasStateInstance): TInstruction;
    valueIsTransformableForInstance(instance: InfiniteCanvasStateInstance): boolean;
}