import { StateChangingInstructionSet } from "./state-changing-instruction-set";
import { CurrentState } from "./current-state";

export interface StateChangingInstructionSetWithCurrentState extends StateChangingInstructionSet, CurrentState{

}