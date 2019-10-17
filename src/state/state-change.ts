import { Instruction } from "../instructions/instruction";

export interface StateChange<TState>{
    newState: TState;
    instruction: Instruction;
}