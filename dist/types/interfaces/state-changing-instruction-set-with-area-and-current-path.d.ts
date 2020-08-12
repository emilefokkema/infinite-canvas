import { StateChangingInstructionSetWithArea } from "./state-changing-instruction-set-with-area";
import { CurrentPath } from "./current-path";
import { PartOfDrawing } from "./part-of-drawing";
export interface StateChangingInstructionSetWithAreaAndCurrentPath extends StateChangingInstructionSetWithArea, CurrentPath, PartOfDrawing {
}
