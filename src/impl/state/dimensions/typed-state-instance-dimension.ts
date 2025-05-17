import { InfiniteCanvasStateInstance } from "../infinite-canvas-state-instance";
import { StateInstanceDimension } from "./state-instance-dimension";
import { Instruction } from '../../instructions/instruction'

export interface TypedStateInstanceDimension<T, TInstruction extends Instruction = Instruction> extends StateInstanceDimension<TInstruction>{
    changeInstanceValue(instance: InfiniteCanvasStateInstance, newValue: T): InfiniteCanvasStateInstance;
}