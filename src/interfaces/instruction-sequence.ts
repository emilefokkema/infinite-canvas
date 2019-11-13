import { StateChangingInstructionSetWithCurrentState } from "./state-changing-instruction-set-with-current-state";

export interface InstructionSequence<TInstruction> extends StateChangingInstructionSetWithCurrentState{
    add(instruction: TInstruction): void;
}