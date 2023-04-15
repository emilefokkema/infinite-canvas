import { ExecutableStateChangingInstructionSet } from "./executable-state-changing-instruction-set";
import { PartOfDrawing } from "./part-of-drawing";

export interface StateChangingInstructionSetWithArea extends ExecutableStateChangingInstructionSet, PartOfDrawing{

}