import { ExecutableInstruction } from "./executable-instruction";
import { StateChangingInstructionSet } from "./state-changing-instruction-set";

export interface ExecutableStateChangingInstructionSet extends StateChangingInstructionSet, ExecutableInstruction{
    
}
