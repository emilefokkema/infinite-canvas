import { Instruction } from "../instructions/instruction";
import { PathInstruction } from "./path-instruction";
import { StateChangingInstructionSetWithAreaAndCurrentPath } from "./state-changing-instruction-set-with-area-and-current-path";
import { Rectangle } from "../rectangle";
import { InfiniteCanvasState } from "../state/infinite-canvas-state";

export interface CurrentPath{
    drawPath(instruction: Instruction, state: InfiniteCanvasState): void;
    clipPath(instruction: Instruction, state: InfiniteCanvasState): void;
    addPathInstruction(pathInstruction: PathInstruction, state: InfiniteCanvasState): void;
    visible: boolean;
    recreatePath(): StateChangingInstructionSetWithAreaAndCurrentPath;
    getClippedArea(previouslyClipped?: Rectangle): Rectangle;
}