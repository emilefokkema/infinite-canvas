import { StateChangingInstructionSetWithCurrentState } from "./state-changing-instruction-set-with-current-state";
import { PartOfDrawing } from "./part-of-drawing";

export interface StateChangingInstructionSetWithCurrentStateAndArea extends StateChangingInstructionSetWithCurrentState, PartOfDrawing{

}