import { CurrentPath } from "./current-path";
import { StateChangingInstructionSetWithCurrentStateAndArea } from "./state-changing-instruction-set-with-current-state-and-area";
import { Drawing } from "./drawing";

export interface StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState extends StateChangingInstructionSetWithCurrentStateAndArea, CurrentPath, Drawing{
    visible: boolean;
    recreatePath(): StateChangingInstructionSetWithAreaAndCurrentPathAndCurrentState;
}