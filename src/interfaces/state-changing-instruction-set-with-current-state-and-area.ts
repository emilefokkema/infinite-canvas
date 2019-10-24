import { StateChangingInstructionSetWithCurrentState } from "./state-changing-instruction-set-with-current-state";
import { WithArea } from "./with-area";
import { Drawing } from "./drawing";
import { PartOfDrawing } from "./part-of-drawing";

export interface StateChangingInstructionSetWithCurrentStateAndArea extends StateChangingInstructionSetWithCurrentState, WithArea, PartOfDrawing{

}