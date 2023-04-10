import { CurrentPath } from "./current-path";
import { StateChangingInstructionSet } from "./state-changing-instruction-set";

export interface StateChangingInstructionSetWithCurrentPath extends StateChangingInstructionSet, CurrentPath {

}