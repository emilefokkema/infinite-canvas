import { Instruction } from "./instructions/instruction"
import { StateChangingInstructionSetWithCurrentPath } from "./interfaces/state-changing-instruction-set-with-current-path"
import { StateChangingInstructionSetWithPositiveArea } from "./interfaces/state-changing-instruction-set-with-positive-area"
import { InfiniteCanvasState } from "./state/infinite-canvas-state"
import { TransformationKind } from "./transformation-kind"

export interface DrawingInstructionDefinition{
    instruction: Instruction
    build(currentPath: StateChangingInstructionSetWithCurrentPath, instruction: Instruction): StateChangingInstructionSetWithPositiveArea
    takeClippingRegionIntoAccount: boolean
    transformationKind: TransformationKind
    state: InfiniteCanvasState
    tempState?: InfiniteCanvasState
}