import { StateChangingInstructionSetWithArea } from "./state-changing-instruction-set-with-area";
import { CurrentPath } from "./current-path";
import { Drawing } from "./drawing";

export interface StateChangingInstructionSetWithAreaAndCurrentPath extends StateChangingInstructionSetWithArea, CurrentPath, Drawing{

}