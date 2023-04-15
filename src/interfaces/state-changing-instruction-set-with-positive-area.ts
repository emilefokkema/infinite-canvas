import { PositivePartOfDrawing } from "./positive-part-of-drawing";
import { ExecutableStateChangingInstructionSet } from "./executable-state-changing-instruction-set";

export interface StateChangingInstructionSetWithPositiveArea extends ExecutableStateChangingInstructionSet, PositivePartOfDrawing{

}