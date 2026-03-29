import { Instruction } from "../instructions/instruction";
import { StateChangingInstructionSet } from "./state-changing-instruction-set";

export interface ExecutableStateChangingInstructionSet extends StateChangingInstructionSet, Instruction{
    
}
