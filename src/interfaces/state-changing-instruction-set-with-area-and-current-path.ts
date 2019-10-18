import { CurrentPath } from "./current-path";
import { StateChangingInstructionSetWithCurrentStateAndArea } from "./state-changing-instruction-set-with-current-state-and-area";

export interface StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState extends StateChangingInstructionSetWithCurrentStateAndArea, CurrentPath{

}